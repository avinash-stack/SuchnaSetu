"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth";
import { IngestionStats } from "@/modules/ingestion/types";
import { dispatchGitHubSyncWorkflow } from "@/lib/github/dispatch";
import { recoverStaleImportJobs, StaleJobRecoveryResult } from "@/modules/ingestion/core/recovery";

/**
 * Server Action: Retries a previously failed import job via GitHub Actions runner.
 */
export async function retryFailedJobAction(jobId: string): Promise<{
  success: boolean;
  message?: string;
  runUrl?: string;
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
    const sourceName = previousJob.import_sources?.name || sourceId;

    // 2. Dispatch execution to GitHub Actions runner
    const dispatchResult = await dispatchGitHubSyncWorkflow({
      syncType: "source",
      sourceId,
      reason: `Retry triggered by ${admin.email || admin.id} for job ${jobId}`,
    });

    if (!dispatchResult.success) {
      return {
        success: false,
        error: dispatchResult.error,
      };
    }

    // 3. Audit Log
    try {
      await (supabase.from("audit_logs") as any).insert({
        admin_id: admin.id,
        action: "RETRY_IMPORT_JOB",
        entity_type: "import_jobs",
        entity_id: jobId,
        metadata: {
          original_job_id: jobId,
          source_code: previousJob.import_sources?.code,
          workflow: dispatchResult.workflow,
          runUrl: dispatchResult.runUrl,
        },
      });
    } catch (auditErr) {
      console.warn("Failed to write audit log for retry:", auditErr);
    }

    revalidatePath("/admin/operations");
    revalidatePath("/admin/sources");

    return {
      success: true,
      message: `Retry for "${sourceName}" dispatched to GitHub Actions runner.`,
      runUrl: dispatchResult.runUrl,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || "Internal server error retrying job",
    };
  }
}

/**
 * Server Action: Runs safe recovery of stale/orphaned jobs exceeding the 35m execution window.
 */
export async function recoverStaleJobsAction(): Promise<StaleJobRecoveryResult> {
  await requireAdmin();
  const result = await recoverStaleImportJobs();
  revalidatePath("/admin/operations");
  revalidatePath("/admin/sources");
  return result;
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
