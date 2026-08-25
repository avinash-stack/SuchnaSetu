"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth";
import { IngestionPipelineEngine } from "./core/pipeline";
import { BatchOrchestrator } from "./core/batch-orchestrator";
import { SourceAdapterRegistry } from "./core/registry";
import { IngestionStats, ImportSource } from "./types";
import { getSchedulerConfig } from "./config/scheduler.config";

/**
 * Checks whether an active sync job is currently running for a source.
 * Enforces timeout window to auto-clear stalled jobs.
 */
export async function isSourceActivelyRunning(sourceId: string): Promise<boolean> {
  const supabase = createAdminClient();
  const config = getSchedulerConfig();
  // 60-second safety window for deadlock recovery
  const timeoutWindowMs = 60 * 1000;
  const cutoffTime = new Date(Date.now() - timeoutWindowMs).toISOString();

  // 1. Auto-clear stale jobs for this source older than cutoff window
  try {
    await (supabase.from("import_jobs") as any)
      .update({
        status: "failed",
        completed_at: new Date().toISOString(),
        error_message: "Job timed out and was cleared by scheduler deadlock recovery",
      })
      .eq("source_id", sourceId)
      .eq("status", "running")
      .lt("created_at", cutoffTime);
  } catch (clearErr) {
    console.error("Failed to clear stale running jobs:", clearErr);
  }

  // 2. Check for active running job within valid window
  const { data: runningJobs } = await (supabase.from("import_jobs") as any)
    .select("id")
    .eq("source_id", sourceId)
    .eq("status", "running")
    .limit(1);

  return Boolean(runningJobs && runningJobs.length > 0);
}

/**
 * Triggers a manual execution of an import job for a given source.
 * Prevents concurrent execution if a job is already in progress for this source.
 */
export async function triggerImportJob(sourceId: string): Promise<{
  success: boolean;
  jobId?: string;
  stats?: IngestionStats;
  error?: string;
}> {
  try {
    const admin = await requireAdmin();
    const supabase = createAdminClient();

    // 1. Fetch Source details
    const { data: source, error: sourceError } = await (supabase.from("import_sources") as any)
      .select("*")
      .eq("id", sourceId)
      .single();

    if (sourceError || !source) {
      return { success: false, error: `Import source not found: ${sourceId}` };
    }

    if (!source.is_enabled) {
      return { success: false, error: `Import source "${source.name}" is currently disabled` };
    }

    // 2. Concurrency Lock: Auto-clear stale running jobs and prevent concurrent sync
    const isRunning = await isSourceActivelyRunning(sourceId);
    if (isRunning) {
      return {
        success: false,
        error: `A synchronization job is already running for "${source.name}". Concurrent execution is prevented.`,
      };
    }

    // 3. Create Import Job Record with start timestamp
    const { data: job, error: jobError } = await (supabase.from("import_jobs") as any)
      .insert({
        source_id: sourceId,
        trigger_type: "manual",
        status: "running",
        started_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (jobError || !job) {
      return { success: false, error: `Failed to create import job: ${jobError?.message}` };
    }

    const jobId = job.id;

    // 4. Execute the Ingestion Pipeline
    const pipeline = new IngestionPipelineEngine();
    let stats: IngestionStats;

    try {
      stats = await pipeline.executeJob(jobId);
    } catch (execErr: any) {
      return {
        success: false,
        jobId,
        error: execErr?.message || "Execution failed during ingestion pipeline processing",
      };
    }

    // 5. Record Admin Audit Log
    try {
      await (supabase.from("audit_logs") as any).insert({
        admin_id: admin.id,
        action: "IMPORT_SOURCE_SYNCED",
        entity_type: "import_sources",
        entity_id: sourceId,
        metadata: {
          job_id: jobId,
          source_code: source.code,
          stats,
        },
      });
    } catch (auditErr) {
      console.warn("Failed to write audit log for import sync:", auditErr);
    }

    // 6. Revalidate cache
    revalidatePath("/admin/sources");
    revalidatePath("/admin/operations");
    revalidatePath("/jobs");
    revalidatePath("/exams");
    revalidatePath("/news");
    revalidatePath("/sitemap.xml");
    revalidatePath("/");

    return {
      success: true,
      jobId,
      stats,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || "Internal server error triggering import job",
    };
  }
}

/**
 * Executes a bulk synchronization across multiple selected sources.
 */
export async function syncSelectedSourcesAction(sourceIds: string[]): Promise<{
  success: boolean;
  totalSynced: number;
  totalErrors: number;
  results: Array<{ sourceId: string; sourceCode: string; success: boolean; error?: string }>;
}> {
  if (!sourceIds || sourceIds.length === 0) {
    return {
      success: false,
      totalSynced: 0,
      totalErrors: 1,
      results: [],
    };
  }
  return bulkSyncSourcesAction(sourceIds);
}

/**
 * Helper to enforce maximum per-source execution timeout during bulk runs
 */
async function runWithTimeout<T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> {
  let timer: NodeJS.Timeout;
  const timeoutPromise = new Promise<T>((resolve) => {
    timer = setTimeout(() => resolve(fallback), ms);
  });
  return Promise.race([
    promise.then((res) => {
      clearTimeout(timer);
      return res;
    }),
    timeoutPromise,
  ]);
}

/**
 * Executes a bulk synchronization across all enabled sources or specified IDs.
 * Utilizes Durable Sequential Batch Orchestration to prevent HTTP connection timeouts.
 */
export async function bulkSyncSourcesAction(sourceIds?: string[]): Promise<{
  success: boolean;
  totalSynced: number;
  totalErrors: number;
  results: Array<{ sourceId: string; sourceCode: string; success: boolean; error?: string }>;
}> {
  try {
    await requireAdmin();
    const supabase = createAdminClient();

    let query = (supabase.from("import_sources") as any)
      .select("*")
      .eq("is_enabled", true);

    if (sourceIds && sourceIds.length > 0) {
      query = query.in("id", sourceIds);
    }

    const { data: sources, error } = await query;
    if (error || !sources || sources.length === 0) {
      return {
        success: false,
        totalSynced: 0,
        totalErrors: 1,
        results: [],
      };
    }

    // Execute via Durable Sequential Batch Orchestrator
    const orchestrator = new BatchOrchestrator({
      batchSize: 4,
      sourceTimeoutMs: 10000,
      maxFunctionDurationMs: 240000,
    });

    const syncSummary = await orchestrator.orchestrateSequentialSync(sources as ImportSource[], {
      triggerType: "manual",
    });

    revalidatePath("/admin/sources");
    revalidatePath("/admin/operations");
    revalidatePath("/jobs");
    revalidatePath("/exams");
    revalidatePath("/news");
    revalidatePath("/sitemap.xml");
    revalidatePath("/");

    return {
      success: syncSummary.failedSources === 0 || syncSummary.successfulSources > 0,
      totalSynced: syncSummary.successfulSources,
      totalErrors: syncSummary.failedSources + syncSummary.timedOutSources,
      results: syncSummary.results.map((r) => ({
        sourceId: r.sourceId,
        sourceCode: r.sourceCode,
        success: r.status === "SUCCESS",
        error: r.error,
      })),
    };
  } catch (err: any) {
    return {
      success: false,
      totalSynced: 0,
      totalErrors: 1,
      results: [],
    };
  }
}

/**
 * Retrieves currently active running sync jobs.
 */
export async function getActiveRunningJobsAction(): Promise<{
  success: boolean;
  runningJobSourceIds: string[];
  runningJobs: any[];
}> {
  try {
    await requireAdmin();
    const supabase = createAdminClient();
    const config = getSchedulerConfig();
    const cutoffTime = new Date(Date.now() - config.jobTimeoutMinutes * 60 * 1000).toISOString();

    const { data: jobs, error } = await (supabase.from("import_jobs") as any)
      .select("id, source_id, started_at, trigger_type, import_sources(name, code)")
      .eq("status", "running")
      .gt("started_at", cutoffTime);

    if (error) throw error;

    const sourceIds = (jobs || []).map((j: any) => j.source_id);
    return {
      success: true,
      runningJobSourceIds: sourceIds,
      runningJobs: jobs || [],
    };
  } catch (err: any) {
    return {
      success: false,
      runningJobSourceIds: [],
      runningJobs: [],
    };
  }
}

/**
 * Toggles whether an import source is enabled or disabled.
 */
export async function toggleSourceEnabledAction(
  sourceId: string,
  isEnabled: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    const admin = await requireAdmin();
    const supabase = createAdminClient();

    const { data: updated, error } = await (supabase.from("import_sources") as any)
      .update({
        is_enabled: isEnabled,
        updated_at: new Date().toISOString(),
      })
      .eq("id", sourceId)
      .select("name, code")
      .single();

    if (error) throw new Error(error.message);

    try {
      await (supabase.from("audit_logs") as any).insert({
        admin_id: admin.id,
        action: isEnabled ? "ENABLE_IMPORT_SOURCE" : "DISABLE_IMPORT_SOURCE",
        entity_type: "import_sources",
        entity_id: sourceId,
        metadata: { is_enabled: isEnabled, source_code: updated?.code },
      });
    } catch (auditErr) {
      console.warn("Failed to write audit log for source toggle:", auditErr);
    }

    revalidatePath("/admin/sources");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to toggle source status" };
  }
}

/**
 * Tests the live connectivity for a registered import source.
 */
export async function testSourceConnection(sourceId: string): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    await requireAdmin();
    const supabase = createAdminClient();

    const { data: source, error: sourceError } = await (supabase.from("import_sources") as any)
      .select("*")
      .eq("id", sourceId)
      .single();

    if (sourceError || !source) {
      return { success: false, message: `Source not found: ${sourceId}` };
    }

    const adapter = SourceAdapterRegistry.getAdapter(source.adapter_key);
    if (!adapter) {
      return {
        success: false,
        message: `No SourceAdapter registered for key "${source.adapter_key}"`,
      };
    }

    const result = await adapter.testConnection(source as ImportSource);
    return {
      success: result.success,
      message: result.message || (result.success ? "Connection verified successfully" : "Connection failed"),
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || "Error testing connection",
    };
  }
}

/**
 * Retrieves execution logs for an import job.
 */
export async function getImportJobLogs(jobId: string) {
  try {
    await requireAdmin();
    const supabase = createAdminClient();

    const { data, error } = await (supabase.from("import_logs") as any)
      .select("*")
      .eq("job_id", jobId)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return { success: true, logs: data || [] };
  } catch (err: any) {
    return { success: false, error: err?.message, logs: [] };
  }
}
