import { createAdminClient } from "../../../lib/supabase/admin";

/**
 * Standard threshold for considering a running job orphaned or interrupted.
 * Matches the maximum GitHub Actions workflow duration (35 minutes).
 * Any job older than this cannot be an active runner execution.
 */
export const DEFAULT_STALE_JOB_THRESHOLD_MS = 35 * 60 * 1000; // 35 minutes

export function getStaleThresholdMs(): number {
  if (process.env.STALE_JOB_THRESHOLD_MS) {
    const parsed = parseInt(process.env.STALE_JOB_THRESHOLD_MS, 10);
    if (!isNaN(parsed) && parsed > 0) return parsed;
  }
  return DEFAULT_STALE_JOB_THRESHOLD_MS;
}

export interface StaleJobRecoveryResult {
  success: boolean;
  recoveredCount: number;
  recoveredJobIds: string[];
  error?: string;
}

/**
 * Safely recovers genuinely stale jobs that were interrupted by previous host
 * terminations (e.g. Cloudflare Worker CPU limits, network cutoffs) without completing.
 *
 * Requirements:
 * - Does not fail jobs merely because they have run for 5 or 10 minutes.
 * - Prevents stale jobs from blocking future synchronization.
 * - Records recovery actions in execution logs.
 * - Preserves historical records, metrics, and error details.
 * - Avoids racing with active GitHub Actions executions.
 */
export async function recoverStaleImportJobs(
  thresholdMs: number = getStaleThresholdMs()
): Promise<StaleJobRecoveryResult> {
  try {
    const supabase = createAdminClient();
    const cutoffDate = new Date(Date.now() - thresholdMs);
    const cutoffTime = cutoffDate.toISOString();

    // 1. Find genuinely stale jobs running longer than the threshold
    const { data: staleJobs, error: selectErr } = await (supabase.from("import_jobs") as any)
      .select("id, source_id, started_at, created_at, trigger_type")
      .eq("status", "running")
      .lt("created_at", cutoffTime);

    if (selectErr) {
      console.error("[STALE JOB RECOVERY] Error querying running jobs:", selectErr.message);
      return {
        success: false,
        recoveredCount: 0,
        recoveredJobIds: [],
        error: selectErr.message,
      };
    }

    if (!staleJobs || staleJobs.length === 0) {
      return {
        success: true,
        recoveredCount: 0,
        recoveredJobIds: [],
      };
    }

    const recoveredJobIds: string[] = [];
    const nowIso = new Date().toISOString();

    for (const job of staleJobs) {
      const jobId = job.id;
      const startedAt = job.started_at || job.created_at;
      const runningDurationMin = startedAt
        ? Math.round((Date.now() - new Date(startedAt).getTime()) / 60000)
        : "unknown";

      const recoveryReason = `Job orphaned / interrupted: was in 'running' state for ~${runningDurationMin} minutes (exceeded ${Math.round(thresholdMs / 60000)}m threshold). Recovered safely.`;

      // 2. Mark job failed with recovery message
      const { error: updateErr } = await (supabase.from("import_jobs") as any)
        .update({
          status: "failed",
          completed_at: nowIso,
          error_message: recoveryReason,
          error_details: {
            category: "stale_recovery",
            interrupted_at: startedAt,
            recovered_at: nowIso,
            threshold_minutes: Math.round(thresholdMs / 60000),
          },
        })
        .eq("id", jobId)
        .eq("status", "running"); // Guard against concurrent update

      if (updateErr) {
        console.warn(`[STALE JOB RECOVERY] Failed to update stale job ${jobId}:`, updateErr.message);
        continue;
      }

      // 3. Record audit entry in import_logs
      try {
        await (supabase.from("import_logs") as any).insert({
          job_id: jobId,
          stage: "recovery",
          level: "warn",
          message: recoveryReason,
          created_at: nowIso,
        });
      } catch (logErr) {
        console.warn(`[STALE JOB RECOVERY] Failed to write log for recovered job ${jobId}:`, logErr);
      }

      recoveredJobIds.push(jobId);
    }

    console.log(
      `[STALE JOB RECOVERY] Successfully recovered ${recoveredJobIds.length} orphaned jobs exceeding ${Math.round(thresholdMs / 60000)}m cutoff.`
    );

    return {
      success: true,
      recoveredCount: recoveredJobIds.length,
      recoveredJobIds,
    };
  } catch (err: any) {
    console.error("[STALE JOB RECOVERY] Unhandled recovery error:", err);
    return {
      success: false,
      recoveredCount: 0,
      recoveredJobIds: [],
      error: err.message || "Unknown error during stale job recovery",
    };
  }
}
