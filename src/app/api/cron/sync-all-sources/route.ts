import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { IngestionPipelineEngine } from "@/modules/ingestion/core/pipeline";
import { isSourceActivelyRunning } from "@/modules/ingestion/actions";
import { getSchedulerConfig, getNextScheduledSync } from "@/modules/ingestion/config/scheduler.config";
import { SourceAdapterRegistry } from "@/modules/ingestion/core/registry";

export const maxDuration = 300; // 5 minutes max duration for serverless cron execution
export const dynamic = "force-dynamic";

/**
 * Automated Cron Execution Handler for All Enabled Government Jobs, Exams, and News Sources.
 * Invoked 3 times daily at 08:00 AM IST (02:30 UTC), 04:00 PM IST (10:30 UTC), and 01:30 AM IST (20:00 UTC).
 */
export async function GET(request: NextRequest) {
  return handleSync(request);
}

export async function POST(request: NextRequest) {
  return handleSync(request);
}

async function handleSync(request: NextRequest) {
  const startTime = Date.now();
  const config = getSchedulerConfig();

  // 1. Security Verification: Validate CRON_SECRET or Vercel Cron Header
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  const isVercelCron = request.headers.get("x-vercel-cron") === "1";

  if (cronSecret) {
    const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;
    const apiKey = request.nextUrl.searchParams.get("key");
    const isAuthorized = bearerToken === cronSecret || apiKey === cronSecret || isVercelCron;

    if (!isAuthorized) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid or missing CRON_SECRET authorization token." },
        { status: 401 }
      );
    }
  }

  if (!config.enabled) {
    return NextResponse.json(
      { message: "Automated synchronization is currently disabled in scheduler config (SYNC_ENABLED=false)." },
      { status: 200 }
    );
  }

  const supabase = createAdminClient();

  // 2. Fetch all active and enabled sources across Jobs, Exams, and Bulletins
  const { data: sources, error: sourcesError } = await (supabase.from("import_sources") as any)
    .select("id, code, name, target_module, adapter_key, is_enabled")
    .eq("is_enabled", true)
    .order("target_module", { ascending: true })
    .order("name", { ascending: true });

  if (sourcesError || !sources || sources.length === 0) {
    return NextResponse.json(
      {
        success: false,
        message: "No enabled sources found to synchronize.",
        error: sourcesError?.message,
      },
      { status: 200 }
    );
  }

  // 3. Pre-execution Adapter Registry Validation: Ensure all enabled sources resolve to registered adapters
  const unregisteredSources = sources.filter((src: any) => !SourceAdapterRegistry.getAdapter(src.adapter_key));
  if (unregisteredSources.length > 0) {
    console.error(
      `[CRON PRE-CHECK WARNING] ${unregisteredSources.length} sources have missing/unregistered adapters:`,
      unregisteredSources.map((s: any) => `${s.code} -> ${s.adapter_key}`)
    );
  }

  const pipeline = new IngestionPipelineEngine();
  const results: Array<{
    sourceId: string;
    sourceCode: string;
    sourceName: string;
    targetModule: string;
    status: "completed" | "failed" | "skipped_locked";
    stats?: any;
    durationMs: number;
    error?: string;
  }> = [];

  let totalInserted = 0;
  let totalUpdated = 0;
  let totalSkipped = 0;
  let totalFailed = 0;
  let totalExtracted = 0;

  // Helper to enforce maximum per-source execution timeout during cron runs
  const runWithTimeout = async <T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> => {
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
  };

  // 4. Execute synchronization in bounded parallel batches (concurrency: 4) with per-source isolation
  const BATCH_SIZE = 4;
  for (let i = 0; i < sources.length; i += BATCH_SIZE) {
    const batch = sources.slice(i, i + BATCH_SIZE);
    const batchPromises = batch.map(async (src: any) => {
      const sourceStart = Date.now();

      // Check concurrency lock: prevent concurrent sync if this source is already in-flight
      const isRunning = await isSourceActivelyRunning(src.id);
      if (isRunning) {
        return {
          sourceId: src.id,
          sourceCode: src.code,
          sourceName: src.name,
          targetModule: src.target_module,
          status: "skipped_locked" as const,
          durationMs: Date.now() - sourceStart,
          error: "Source is already running an active sync job. Concurrency lock applied.",
        };
      }

      // Create automated import_job record
      const { data: job, error: jobErr } = await (supabase.from("import_jobs") as any)
        .insert({
          source_id: src.id,
          trigger_type: "scheduled",
          status: "running",
          started_at: new Date().toISOString(),
        })
        .select("id")
        .single();

      if (jobErr || !job) {
        return {
          sourceId: src.id,
          sourceCode: src.code,
          sourceName: src.name,
          targetModule: src.target_module,
          status: "failed" as const,
          durationMs: Date.now() - sourceStart,
          error: `Failed to create job record: ${jobErr?.message}`,
        };
      }

      const jobId = job.id;

      try {
        // Execute with safe 12-second per-source timeout
        const stats = await runWithTimeout(
          pipeline.executeJob(jobId),
          12000,
          null
        );

        const sourceDuration = Date.now() - sourceStart;

        if (!stats) {
          // Timeout occurred
          await (supabase.from("import_jobs") as any)
            .update({
              status: "failed",
              completed_at: new Date().toISOString(),
              error_message: "Execution timed out (exceeded 12s safe threshold)",
            })
            .eq("id", jobId);

          return {
            sourceId: src.id,
            sourceCode: src.code,
            sourceName: src.name,
            targetModule: src.target_module,
            status: "failed" as const,
            durationMs: sourceDuration,
            error: "Source execution timed out",
          };
        }

        return {
          sourceId: src.id,
          sourceCode: src.code,
          sourceName: src.name,
          targetModule: src.target_module,
          status: "completed" as const,
          stats,
          durationMs: sourceDuration,
        };
      } catch (execErr: any) {
        const sourceDuration = Date.now() - sourceStart;
        return {
          sourceId: src.id,
          sourceCode: src.code,
          sourceName: src.name,
          targetModule: src.target_module,
          status: "failed" as const,
          durationMs: sourceDuration,
          error: execErr?.message || "Execution exception occurred during pipeline run",
        };
      }
    });

    const batchResults = await Promise.all(batchPromises);

    for (const res of batchResults) {
      if (res.status === "completed" && res.stats) {
        totalExtracted += res.stats.totalExtracted || 0;
        totalInserted += res.stats.totalInserted || 0;
        totalUpdated += res.stats.totalUpdated || 0;
        totalSkipped += res.stats.totalSkipped || 0;
        totalFailed += res.stats.totalFailed || 0;
      } else if (res.status === "failed") {
        totalFailed++;
      }
      results.push(res);
    }
  }

  const overallDurationMs = Date.now() - startTime;
  const nextSync = getNextScheduledSync();

  return NextResponse.json({
    success: true,
    executionType: "automated_scheduled_sync",
    executedAt: new Date().toISOString(),
    overallDurationMs,
    totalSourcesEvaluated: sources.length,
    summary: {
      totalExtracted,
      totalInserted,
      totalUpdated,
      totalSkipped,
      totalFailed,
    },
    nextScheduledSync: {
      formattedIST: nextSync.formattedIST,
      timeRemaining: nextSync.timeRemaining,
      dateUTC: nextSync.date.toISOString(),
    },
    results,
  });
}
