import { createAdminClient } from "@/lib/supabase/admin";
import { IngestionPipelineEngine } from "./pipeline";
import { isSourceActivelyRunning } from "../actions";
import { SourceAdapterRegistry } from "./registry";
import {
  ImportSource,
  SourceExecutionResult,
  SyncBatchResult,
  DurableSyncSummary,
  IngestionStats,
} from "../types";

export interface BatchOrchestratorOptions {
  batchSize?: number;
  sourceTimeoutMs?: number;
  maxFunctionDurationMs?: number;
  startBatchIndex?: number;
  maxBatchesToRun?: number;
}

const DEFAULT_BATCH_SIZE = 4;
const DEFAULT_SOURCE_TIMEOUT_MS = 10000; // 10s safe adapter timeout
const DEFAULT_MAX_FUNCTION_DURATION_MS = 250000; // 250s safe time-budget within 300s limit

export class BatchOrchestrator {
  private pipeline: IngestionPipelineEngine;
  private batchSize: number;
  private sourceTimeoutMs: number;
  private maxFunctionDurationMs: number;

  constructor(options?: BatchOrchestratorOptions) {
    this.pipeline = new IngestionPipelineEngine();
    this.batchSize = options?.batchSize || DEFAULT_BATCH_SIZE;
    this.sourceTimeoutMs = options?.sourceTimeoutMs || DEFAULT_SOURCE_TIMEOUT_MS;
    this.maxFunctionDurationMs = options?.maxFunctionDurationMs || DEFAULT_MAX_FUNCTION_DURATION_MS;
  }

  /**
   * Helper to enforce per-source execution timeout without killing the process
   */
  private async runWithTimeout<T>(promise: Promise<T>, ms: number, fallback: T): Promise<{ result: T; timedOut: boolean }> {
    let timer: NodeJS.Timeout | null = null;
    let timedOut = false;

    const timeoutPromise = new Promise<{ result: T; timedOut: boolean }>((resolve) => {
      timer = setTimeout(() => {
        timedOut = true;
        resolve({ result: fallback, timedOut: true });
      }, ms);
    });

    const executionPromise = promise.then((res) => {
      if (timer) clearTimeout(timer);
      return { result: res, timedOut: false };
    });

    return Promise.race([executionPromise, timeoutPromise]);
  }

  /**
   * Executes a single source within an isolated lifecycle
   */
  public async executeSingleSource(source: ImportSource, triggerType: "scheduled" | "manual" = "scheduled"): Promise<SourceExecutionResult> {
    const supabase = createAdminClient();
    const sourceStart = Date.now();

    // 1. Concurrency Check: Prevent overlapping executions for this specific source
    const isRunning = await isSourceActivelyRunning(source.id);
    if (isRunning) {
      console.warn(`[BATCH ORCHESTRATOR] Source "${source.code}" is already active. Skipping.`);
      return {
        sourceId: source.id,
        sourceCode: source.code,
        sourceName: source.name,
        targetModule: source.target_module,
        status: "SKIPPED_LOCKED",
        durationMs: Date.now() - sourceStart,
        error: "Source is already running an active sync job. Concurrency lock applied.",
      };
    }

    // 2. Just-In-Time Import Job Record Creation
    const { data: job, error: jobErr } = await (supabase.from("import_jobs") as any)
      .insert({
        source_id: source.id,
        trigger_type: triggerType,
        status: "running",
        started_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (jobErr || !job) {
      console.error(`[BATCH ORCHESTRATOR] Failed to create job record for ${source.code}:`, jobErr);
      return {
        sourceId: source.id,
        sourceCode: source.code,
        sourceName: source.name,
        targetModule: source.target_module,
        status: "FAILED",
        durationMs: Date.now() - sourceStart,
        error: `Failed to create job record: ${jobErr?.message}`,
        errorCategory: "fatal",
      };
    }

    const jobId = job.id;

    try {
      console.log(`[BATCH ORCHESTRATOR] Starting source execution: ${source.code} (Job: ${jobId})`);

      // 3. Execute with bounded timeout protection (default 10s)
      const { result: stats, timedOut } = await this.runWithTimeout(
        this.pipeline.executeJob(jobId),
        this.sourceTimeoutMs,
        null
      );

      const sourceDuration = Date.now() - sourceStart;

      if (timedOut || !stats) {
        console.warn(`[BATCH ORCHESTRATOR] Source "${source.code}" TIMED OUT after ${sourceDuration}ms.`);
        
        // Persist timeout status to import_jobs
        await (supabase.from("import_jobs") as any)
          .update({
            status: "failed",
            completed_at: new Date().toISOString(),
            error_message: `Execution timed out (exceeded ${this.sourceTimeoutMs}ms safe threshold)`,
            error_details: { category: "timeout", durationMs: sourceDuration },
          })
          .eq("id", jobId);

        return {
          sourceId: source.id,
          sourceCode: source.code,
          sourceName: source.name,
          targetModule: source.target_module,
          status: "TIMEOUT",
          jobId,
          durationMs: sourceDuration,
          error: `Source execution timed out after ${sourceDuration}ms`,
          errorCategory: "timeout",
        };
      }

      console.log(`[BATCH ORCHESTRATOR] Source "${source.code}" SUCCESS in ${sourceDuration}ms (Extracted: ${stats.totalExtracted}, Inserted: ${stats.totalInserted})`);

      return {
        sourceId: source.id,
        sourceCode: source.code,
        sourceName: source.name,
        targetModule: source.target_module,
        status: "SUCCESS",
        jobId,
        stats,
        durationMs: sourceDuration,
      };
    } catch (execErr: any) {
      const sourceDuration = Date.now() - sourceStart;
      console.error(`[BATCH ORCHESTRATOR] Source "${source.code}" FAILED in ${sourceDuration}ms:`, execErr?.message);

      // Persist failure to import_jobs if not already recorded
      try {
        await (supabase.from("import_jobs") as any)
          .update({
            status: "failed",
            completed_at: new Date().toISOString(),
            error_message: execErr?.message || "Execution exception occurred",
            error_details: { stack: execErr?.stack, durationMs: sourceDuration },
          })
          .eq("id", jobId);
      } catch (logErr) {
        console.error("Failed to update import_job failure status:", logErr);
      }

      return {
        sourceId: source.id,
        sourceCode: source.code,
        sourceName: source.name,
        targetModule: source.target_module,
        status: "FAILED",
        jobId,
        durationMs: sourceDuration,
        error: execErr?.message || "Execution exception occurred during pipeline run",
        errorCategory: "transient_network",
      };
    }
  }

  /**
   * Executes a single bounded batch of sources in parallel
   */
  public async executeBatch(
    sourcesInBatch: ImportSource[],
    batchIndex: number,
    totalBatches: number,
    triggerType: "scheduled" | "manual" = "scheduled"
  ): Promise<SyncBatchResult> {
    const batchStart = Date.now();
    const startedAt = new Date().toISOString();

    console.log(`[BATCH ORCHESTRATOR] >>> Executing Batch ${batchIndex + 1}/${totalBatches} (${sourcesInBatch.length} sources)`);

    // Execute sources in parallel within this batch
    const sourcePromises = sourcesInBatch.map((source) =>
      this.executeSingleSource(source, triggerType)
    );

    const sourceResults = await Promise.all(sourcePromises);
    const durationMs = Date.now() - batchStart;
    const completedAt = new Date().toISOString();

    let successful = 0;
    let failed = 0;
    let timedOut = 0;
    let skippedLocked = 0;

    for (const res of sourceResults) {
      if (res.status === "SUCCESS") successful++;
      else if (res.status === "FAILED") failed++;
      else if (res.status === "TIMEOUT") timedOut++;
      else if (res.status === "SKIPPED_LOCKED") skippedLocked++;
    }

    const batchStatus = failed === 0 && timedOut === 0 ? "COMPLETED" : "PARTIAL";

    console.log(
      `[BATCH ORCHESTRATOR] <<< Batch ${batchIndex + 1}/${totalBatches} ${batchStatus} in ${durationMs}ms: ` +
      `${successful} succeeded, ${failed} failed, ${timedOut} timed out, ${skippedLocked} skipped`
    );

    return {
      batchIndex,
      batchSize: sourcesInBatch.length,
      totalBatches,
      status: batchStatus,
      startedAt,
      completedAt,
      durationMs,
      sources: sourceResults,
      summary: {
        total: sourcesInBatch.length,
        successful,
        failed,
        timedOut,
        skippedLocked,
      },
    };
  }

  /**
   * Orchestrates the full sequential batch execution across all enabled sources
   * with strict time-budgeting and safe recoverable state checkpoints.
   */
  public async orchestrateSequentialSync(
    sources: ImportSource[],
    options?: {
      startBatchIndex?: number;
      maxBatchesToRun?: number;
      triggerType?: "scheduled" | "manual";
    }
  ): Promise<DurableSyncSummary> {
    const startTime = Date.now();
    const executedAt = new Date().toISOString();
    const triggerType = options?.triggerType || "scheduled";

    // 1. Partition all sources into bounded batches
    const batches: ImportSource[][] = [];
    for (let i = 0; i < sources.length; i += this.batchSize) {
      batches.push(sources.slice(i, i + this.batchSize));
    }

    const totalBatches = batches.length;
    const startIndex = Math.min(options?.startBatchIndex || 0, totalBatches);
    const maxBatches = options?.maxBatchesToRun || totalBatches;

    console.log(`[BATCH ORCHESTRATOR] Initializing sync: ${sources.length} sources partitioned into ${totalBatches} batches (batchSize: ${this.batchSize})`);

    const batchResults: SyncBatchResult[] = [];
    const aggregatedResults: SourceExecutionResult[] = [];

    const totalStats: IngestionStats = {
      totalExtracted: 0,
      totalNormalized: 0,
      totalInserted: 0,
      totalUpdated: 0,
      totalSkipped: 0,
      totalFailed: 0,
    };

    let successfulSources = 0;
    let failedSources = 0;
    let timedOutSources = 0;
    let skippedLockedSources = 0;
    let batchesCompleted = 0;
    let nextBatchIndex: number | null = null;
    let isComplete = false;

    // 2. Process batches sequentially
    for (let bIndex = startIndex; bIndex < totalBatches; bIndex++) {
      // Check maximum batch limit requested by caller
      if (batchesCompleted >= maxBatches) {
        nextBatchIndex = bIndex;
        console.log(`[BATCH ORCHESTRATOR] Reached max batches limit (${maxBatches}). Next batch: ${nextBatchIndex}`);
        break;
      }

      // Check remaining execution time budget against safe serverless duration limit
      const elapsedMs = Date.now() - startTime;
      const estimatedNextBatchDurationMs = this.sourceTimeoutMs + 2000;

      if (elapsedMs + estimatedNextBatchDurationMs > this.maxFunctionDurationMs) {
        nextBatchIndex = bIndex;
        console.warn(
          `[BATCH ORCHESTRATOR] Time budget safety guard reached (${elapsedMs}ms elapsed). ` +
          `Gracefully checkpointing at batch ${bIndex + 1}/${totalBatches}. Next batch: ${nextBatchIndex}`
        );
        break;
      }

      const currentBatchSources = batches[bIndex];

      try {
        const batchResult = await this.executeBatch(
          currentBatchSources,
          bIndex,
          totalBatches,
          triggerType
        );

        batchResults.push(batchResult);
        batchesCompleted++;

        // Aggregate statistics
        for (const sResult of batchResult.sources) {
          aggregatedResults.push(sResult);

          if (sResult.status === "SUCCESS") {
            successfulSources++;
            if (sResult.stats) {
              totalStats.totalExtracted += sResult.stats.totalExtracted || 0;
              totalStats.totalNormalized += sResult.stats.totalNormalized || 0;
              totalStats.totalInserted += sResult.stats.totalInserted || 0;
              totalStats.totalUpdated += sResult.stats.totalUpdated || 0;
              totalStats.totalSkipped += sResult.stats.totalSkipped || 0;
              totalStats.totalFailed += sResult.stats.totalFailed || 0;
            }
          } else if (sResult.status === "FAILED") {
            failedSources++;
            totalStats.totalFailed++;
          } else if (sResult.status === "TIMEOUT") {
            timedOutSources++;
            totalStats.totalFailed++;
          } else if (sResult.status === "SKIPPED_LOCKED") {
            skippedLockedSources++;
          }
        }
      } catch (batchErr) {
        console.error(`[BATCH ORCHESTRATOR] Unexpected batch level error in batch ${bIndex + 1}:`, batchErr);
        // Continue to the next batch even if a batch-level error occurs
        batchesCompleted++;
      }
    }

    isComplete = startIndex + batchesCompleted >= totalBatches;
    if (isComplete) {
      nextBatchIndex = null;
    }

    const overallDurationMs = Date.now() - startTime;

    console.log(
      `[BATCH ORCHESTRATOR] Finished sync run in ${overallDurationMs}ms: ` +
      `${successfulSources}/${sources.length} sources succeeded, ${failedSources} failed, ` +
      `${timedOutSources} timed out, ${batchesCompleted}/${totalBatches} batches completed. Complete: ${isComplete}`
    );

    return {
      executionType: "durable_sequential_batch_sync",
      executedAt,
      totalSources: sources.length,
      batchesTotal: totalBatches,
      batchesCompleted,
      successfulSources,
      failedSources,
      timedOutSources,
      skippedLockedSources,
      overallDurationMs,
      isComplete,
      nextBatchIndex,
      summary: totalStats,
      batchResults,
      results: aggregatedResults,
    };
  }
}
