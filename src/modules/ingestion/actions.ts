"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
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
