import { ImportSource } from "../types";

export interface ScheduledSourceCheckResult {
  dueSources: ImportSource[];
  enqueuedJobsCount: number;
}

/**
 * Contract for Ingestion Scheduler interface.
 * Evaluates periodic sync frequencies without tying logic to any single host environment.
 */
export interface IIngestionScheduler {
  /**
   * Evaluates all enabled sources and triggers ingestion for sources whose interval has elapsed
   */
  evaluateScheduledSources(): Promise<ScheduledSourceCheckResult>;

  /**
   * Calculates the next scheduled execution timestamp for a given source
   */
  calculateNextRun(source: ImportSource): Date;
}
