import { createAdminClient } from "@/lib/supabase/admin";
import { IIngestionQueue, QueueJobOptions } from "../interfaces/queue.interface";
import { ImportJob, TriggerType } from "../types";

export class DatabaseIngestionQueue implements IIngestionQueue {
  /**
   * Enqueues a new ingestion job into import_jobs table with status 'pending'.
   */
  async enqueue(sourceId: string, triggerType: TriggerType, options?: QueueJobOptions): Promise<ImportJob> {
    const supabase = createAdminClient();

    const { data: job, error } = await (supabase.from("import_jobs") as any)
      .insert({
        source_id: sourceId,
        trigger_type: triggerType,
        status: "pending",
        max_retries: options?.maxRetries ?? 3,
      })
      .select("*")
      .single();

    if (error || !job) {
      throw new Error(`Failed to enqueue ingestion job: ${error?.message || "Unknown error"}`);
    }

    return job as ImportJob;
  }

  /**
   * Dequeues the next pending job atomically, transitions status to 'running'.
   */
  async dequeue(): Promise<ImportJob | null> {
    const supabase = createAdminClient();

    // Select the oldest pending job
    const { data: pendingJob, error: selectError } = await (supabase.from("import_jobs") as any)
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (selectError || !pendingJob) {
      return null;
    }

    // Atomically transition status to 'running'
    const { data: claimedJob, error: updateError } = await (supabase.from("import_jobs") as any)
      .update({
        status: "running",
        started_at: new Date().toISOString(),
      })
      .eq("id", pendingJob.id)
      .eq("status", "pending") // Concurrency guard
      .select("*")
      .maybeSingle();

    if (updateError || !claimedJob) {
      return null; // Another worker claimed this job concurrently
    }

    return claimedJob as ImportJob;
  }

  /**
   * Returns current count of pending jobs in queue.
   */
  async getBacklogCount(): Promise<number> {
    const supabase = createAdminClient();

    const { count, error } = await (supabase.from("import_jobs") as any)
      .select("*", { count: "exact", head: true })
      .eq("status", "pending");

    return count || 0;
  }

  /**
   * Cancels a pending job.
   */
  async cancelJob(jobId: string, reason?: string): Promise<boolean> {
    const supabase = createAdminClient();

    const { error } = await (supabase.from("import_jobs") as any)
      .update({
        status: "cancelled",
        error_message: reason || "Cancelled by administrator",
        completed_at: new Date().toISOString(),
      })
      .eq("id", jobId)
      .in("status", ["pending", "retrying"]);

    return !error;
  }
}
