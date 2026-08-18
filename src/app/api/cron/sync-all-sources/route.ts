import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { IngestionPipelineEngine } from "@/modules/ingestion/core/pipeline";
import { getSchedulerConfig, getNextScheduledSync } from "@/modules/ingestion/config/scheduler.config";
import { isSourceActivelyRunning } from "@/modules/ingestion/actions";

export const maxDuration = 300; // 5 minutes max duration for serverless cron execution
export const dynamic = "force-dynamic";

/**
 * Automated Cron Execution Handler for All Enabled Government Jobs, Exams, and News Sources.
 * Invoked twice daily at 06:00 AM IST and 06:00 PM IST (30 0,12 * * *).
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

  // 3. Execute synchronization with isolated error boundary per pipeline
  for (const src of sources) {
    const sourceStart = Date.now();

    // Check concurrency lock: prevent concurrent sync if this source is already in-flight
    const isRunning = await isSourceActivelyRunning(src.id);
    if (isRunning) {
      results.push({
        sourceId: src.id,
        sourceCode: src.code,
        sourceName: src.name,
        targetModule: src.target_module,
        status: "skipped_locked",
        durationMs: Date.now() - sourceStart,
        error: "Source is already running an active sync job. Concurrency lock applied.",
      });
      continue;
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
      results.push({
        sourceId: src.id,
        sourceCode: src.code,
        sourceName: src.name,
        targetModule: src.target_module,
        status: "failed",
        durationMs: Date.now() - sourceStart,
        error: `Failed to create job record: ${jobErr?.message}`,
      });
      totalFailed++;
      continue;
    }

    const jobId = job.id;

    try {
      const stats = await pipeline.executeJob(jobId);
      const sourceDuration = Date.now() - sourceStart;

      totalExtracted += stats.totalExtracted || 0;
      totalInserted += stats.totalInserted || 0;
      totalUpdated += stats.totalUpdated || 0;
      totalSkipped += stats.totalSkipped || 0;
      totalFailed += stats.totalFailed || 0;

      results.push({
        sourceId: src.id,
        sourceCode: src.code,
        sourceName: src.name,
        targetModule: src.target_module,
        status: "completed",
        stats,
        durationMs: sourceDuration,
      });
    } catch (execErr: any) {
      const sourceDuration = Date.now() - sourceStart;
      totalFailed++;

      results.push({
        sourceId: src.id,
        sourceCode: src.code,
        sourceName: src.name,
        targetModule: src.target_module,
        status: "failed",
        durationMs: sourceDuration,
        error: execErr?.message || "Execution exception occurred during pipeline run",
      });
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
