import { ImportJob, TriggerType } from "../types";

export interface QueueJobOptions {
  priority?: number; // Higher number = higher priority
  delayMs?: number;
  maxRetries?: number;
}

export interface QueueItem {
  id: string;
  sourceId: string;
  triggerType: TriggerType;
  options?: QueueJobOptions;
  enqueuedAt: Date;
}

/**
 * Contract for Ingestion Job Queue.
 * Decouples trigger mechanisms from execution engines with concurrency controls.
 */
export interface IIngestionQueue {
  /**
   * Enqueue a new ingestion job
   */
  enqueue(sourceId: string, triggerType: TriggerType, options?: QueueJobOptions): Promise<ImportJob>;

  /**
   * Dequeue the next pending job ready for execution
   */
  dequeue(): Promise<ImportJob | null>;

  /**
   * Returns current queue backlog count
   */
  getBacklogCount(): Promise<number>;

  /**
   * Cancels a pending or queued job
   */
  cancelJob(jobId: string, reason?: string): Promise<boolean>;
}
