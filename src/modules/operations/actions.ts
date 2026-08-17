"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth";
import { IngestionPipelineEngine } from "@/modules/ingestion/core/pipeline";
import { IngestionStats } from "@/modules/ingestion/types";

/**
 * Server Action: Retries a previously failed import job.
 */
export async function retryFailedJobAction(jobId: string): Promise<{
  success: boolean;
  newJobId?: string;
  stats?: IngestionStats;
  error?: string;
}> {
  try {
    const admin = await requireAdmin();
    const supabase = createAdminClient();

    // 1. Fetch previous job
    const { data: previousJob, error: jobError } = await (supabase.from("import_jobs") as any)
      .select("*, import_sources(*)")
      .eq("id", jobId)
      .single();

    if (jobError || !previousJob) {
      return { success: false, error: `Job not found: ${jobId}` };
    }

    const sourceId = previousJob.source_id;

    // 2. Spawn a new retry job
    const { data: newJob, error: createError } = await (supabase.from("import_jobs") as any)
      .insert({
        source_id: sourceId,
        trigger_type: "retry",
        status: "running",
        started_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (createError || !newJob) {
      return { success: false, error: `Failed to spawn retry job: ${createError?.message}` };
    }

    const newJobId = newJob.id;

    // 3. Execute Ingestion Pipeline
    const pipeline = new IngestionPipelineEngine();
    let stats: IngestionStats;

    try {
      stats = await pipeline.executeJob(newJobId);
    } catch (execErr: any) {
      return {
        success: false,
        newJobId,
        error: execErr?.message || "Execution failed during pipeline retry",
      };
    }

    // 4. Audit Log
    try {
      await (supabase.from("audit_logs") as any).insert({
        admin_id: admin.id,
        action: "RETRY_IMPORT_JOB",
        entity_type: "import_jobs",
        entity_id: newJobId,
        metadata: {
          original_job_id: jobId,
          source_code: previousJob.import_sources?.code,
          stats,
        },
      });
    } catch (auditErr) {
      console.warn("Failed to write audit log for retry:", auditErr);
    }

    revalidatePath("/admin/operations");
    revalidatePath("/admin/sources");
    revalidatePath("/jobs");

    return {
      success: true,
      newJobId,
      stats,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || "Internal server error retrying job",
    };
  }
}

/**
 * Server Action: Cleans up any orphan records (child records with missing parent references).
 */
export async function cleanupOrphanRecordsAction(): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const admin = await requireAdmin();
    const supabase = createAdminClient();

    // Clean orphan vacancies
    await (supabase.from("job_vacancies") as any)
      .delete()
      .is("job_id", null);

    // Clean orphan important dates
    await (supabase.from("job_important_dates") as any)
      .delete()
      .is("job_id", null);

    // Record audit
    await (supabase.from("audit_logs") as any).insert({
      admin_id: admin.id,
      action: "CLEANUP_ORPHAN_RECORDS",
      entity_type: "system_maintenance",
      changes_summary: "Cleaned dangling orphan child records in job tables",
    });

    revalidatePath("/admin/operations");
    return {
      success: true,
      message: "Orphan record cleanup completed successfully.",
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || "Failed to cleanup orphan records",
    };
  }
}
