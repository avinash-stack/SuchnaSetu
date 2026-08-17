"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth";
import { IngestionPipelineEngine } from "./core/pipeline";
import { SourceAdapterRegistry } from "./core/registry";
import { IngestionStats, ImportSource } from "./types";

/**
 * Triggers a manual execution of an import job for a given source.
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

    // 2. Create Import Job Record
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

    // 3. Execute the Ingestion Pipeline
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

    // 4. Record Admin Audit Log
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

    // 5. Revalidate cache
    revalidatePath("/admin/sources");
    revalidatePath("/jobs");
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
 * Executes a bulk synchronization across multiple enabled sources.
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
      .select("id, code, name, is_enabled")
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

    const results: Array<{ sourceId: string; sourceCode: string; success: boolean; error?: string }> = [];
    let totalSynced = 0;
    let totalErrors = 0;

    for (const src of sources) {
      try {
        const res = await triggerImportJob(src.id);
        if (res.success) {
          totalSynced++;
          results.push({ sourceId: src.id, sourceCode: src.code, success: true });
        } else {
          totalErrors++;
          results.push({ sourceId: src.id, sourceCode: src.code, success: false, error: res.error });
        }
      } catch (e: any) {
        totalErrors++;
        results.push({ sourceId: src.id, sourceCode: src.code, success: false, error: e?.message });
      }
    }

    revalidatePath("/admin/sources");
    revalidatePath("/jobs");
    revalidatePath("/sitemap.xml");
    revalidatePath("/");

    return {
      success: totalErrors === 0,
      totalSynced,
      totalErrors,
      results,
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
