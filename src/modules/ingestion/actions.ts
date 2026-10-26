"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth";
import { IngestionPipelineEngine } from "./core/pipeline";
import { BatchOrchestrator } from "./core/batch-orchestrator";
import { SourceAdapterRegistry } from "./core/registry";
import { IngestionStats, ImportSource } from "./types";
import { getSchedulerConfig } from "./config/scheduler.config";
import { dispatchGitHubSyncWorkflow } from "@/lib/github/dispatch";
import { recoverStaleImportJobs, getStaleThresholdMs } from "./core/recovery";

/**
 * Checks whether an active sync job is currently running for a source.
 * Uses a safe execution threshold (35m) matching GitHub Actions execution budget.
 * Clears genuinely stale/interrupted jobs without terminating active runs.
 */
export async function isSourceActivelyRunning(sourceId: string): Promise<boolean> {
  const supabase = createAdminClient();
  const thresholdMs = getStaleThresholdMs();
  const cutoffTime = new Date(Date.now() - thresholdMs).toISOString();

  // 1. Check for genuine active running job within threshold
  const { data: runningJobs } = await (supabase.from("import_jobs") as any)
    .select("id, created_at")
    .eq("source_id", sourceId)
    .eq("status", "running");

  if (!runningJobs || runningJobs.length === 0) return false;

  const genuinelyActive = runningJobs.some(
    (j: any) => new Date(j.created_at).getTime() >= Date.now() - thresholdMs
  );

  // If there are orphaned/stale jobs, trigger recovery safely
  const hasStale = runningJobs.some(
    (j: any) => new Date(j.created_at).getTime() < Date.now() - thresholdMs
  );
  if (hasStale) {
    recoverStaleImportJobs(thresholdMs).catch((e) =>
      console.warn("[ACTIONS] Stale job recovery notice:", e?.message)
    );
  }

  return genuinelyActive;
}

/**
 * Triggers a manual synchronization of an import job for a given source.
 * Dispatches execution to the GitHub Actions runner rather than running inside Cloudflare Workers.
 */
export async function triggerImportJob(sourceId: string): Promise<{
  success: boolean;
  jobId?: string;
  stats?: IngestionStats;
  message?: string;
  runUrl?: string;
  executionMode?: "github_actions_runner";
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

    // 2. Concurrency Lock: Check if actively running within execution window
    const isRunning = await isSourceActivelyRunning(sourceId);
    if (isRunning) {
      return {
        success: false,
        error: `A synchronization run is currently active for "${source.name}". Concurrent execution is prevented.`,
      };
    }

    // 3. Dispatch execution to GitHub Actions runner
    const dispatchResult = await dispatchGitHubSyncWorkflow({
      syncType: "source",
      sourceId: source.id,
      reason: `Admin manual trigger for source: ${source.code} (${admin.email || admin.id})`,
    });

    if (!dispatchResult.success) {
      return {
        success: false,
        error: dispatchResult.error,
      };
    }

    // 4. Record Admin Audit Log
    try {
      await (supabase.from("audit_logs") as any).insert({
        admin_id: admin.id,
        action: "IMPORT_SOURCE_SYNCED",
        entity_type: "import_sources",
        entity_id: sourceId,
        metadata: {
          source_code: source.code,
          workflow: dispatchResult.workflow,
          runUrl: dispatchResult.runUrl,
        },
      });
    } catch (auditErr) {
      console.warn("Failed to write audit log for import sync:", auditErr);
    }

    // 5. Revalidate cache
    revalidatePath("/admin/sources");
    revalidatePath("/admin/operations");

    return {
      success: true,
      executionMode: "github_actions_runner",
      message: `Synchronization for "${source.name}" dispatched to GitHub Actions runner successfully.`,
      runUrl: dispatchResult.runUrl,
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
 * Executes a bulk synchronization across all enabled sources.
 * Dispatches execution to the GitHub Actions runner to avoid Cloudflare Worker CPU limits.
 */
export async function bulkSyncSourcesAction(sourceIds?: string[]): Promise<{
  success: boolean;
  totalSynced: number;
  totalErrors: number;
  message?: string;
  results: Array<{ sourceId: string; sourceCode: string; success: boolean; error?: string }>;
}> {
  try {
    await requireAdmin();
    const supabase = createAdminClient();

    let query = (supabase.from("import_sources") as any)
      .select("id, code, name")
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
        message: "No enabled sources found to synchronize.",
        results: [],
      };
    }

    // Dispatch full sync workflow to GitHub Actions runner
    const dispatchResult = await dispatchGitHubSyncWorkflow({
      syncType: "full",
      reason: `Bulk sync triggered for ${sources.length} sources`,
    });

    if (!dispatchResult.success) {
      return {
        success: false,
        totalSynced: 0,
        totalErrors: sources.length,
        message: dispatchResult.error || "Failed to dispatch workflow to GitHub Actions",
        results: [],
      };
    }

    revalidatePath("/admin/sources");
    revalidatePath("/admin/operations");

    return {
      success: true,
      totalSynced: sources.length,
      totalErrors: 0,
      message: `Bulk synchronization dispatched to GitHub Actions runner (${dispatchResult.workflow}).`,
      results: sources.map((s: any) => ({
        sourceId: s.id,
        sourceCode: s.code,
        success: true,
      })),
    };
  } catch (err: any) {
    return {
      success: false,
      totalSynced: 0,
      totalErrors: 1,
      message: err?.message || "Internal server error dispatching bulk sync",
      results: [],
    };
  }
}

/**
 * Retrieves currently active running sync jobs.
 * Excludes stale jobs older than 35m execution threshold.
 */
export async function getActiveRunningJobsAction(): Promise<{
  success: boolean;
  runningJobSourceIds: string[];
  runningJobs: any[];
}> {
  try {
    await requireAdmin();
    const supabase = createAdminClient();
    const cutoffTime = new Date(Date.now() - getStaleThresholdMs()).toISOString();

    const { data: jobs, error } = await (supabase.from("import_jobs") as any)
      .select("id, source_id, started_at, trigger_type, import_sources(name, code)")
      .eq("status", "running")
      .gt("created_at", cutoffTime);

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
 * Server Action: Explicitly triggers recovery of stale/orphaned running jobs.
 */
export async function recoverStaleJobsAction() {
  try {
    await requireAdmin();
    const result = await recoverStaleImportJobs();
    revalidatePath("/admin/operations");
    revalidatePath("/admin/sources");
    return result;
  } catch (err: any) {
    return {
      success: false,
      recoveredCount: 0,
      recoveredJobIds: [],
      error: err?.message || "Failed to recover stale jobs",
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
