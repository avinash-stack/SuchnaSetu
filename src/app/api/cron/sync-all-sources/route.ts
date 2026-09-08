import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { BatchOrchestrator } from "@/modules/ingestion/core/batch-orchestrator";
import { getSchedulerConfig, getNextScheduledSync } from "@/modules/ingestion/config/scheduler.config";
import { SourceAdapterRegistry } from "@/modules/ingestion/core/registry";
import { revalidatePath } from "next/cache";

export const maxDuration = 60; // Vercel Hobby plan: 60s hard limit
export const dynamic = "force-dynamic";

/**
 * Automated Cron Execution Handler for All Enabled Government Jobs, Exams, and News Sources.
 * Utilizes Durable Sequential Batch Orchestration to eliminate Vercel serverless execution timeouts.
 */
export async function GET(request: NextRequest) {
  return handleSync(request);
}

export async function POST(request: NextRequest) {
  return handleSync(request);
}

async function handleSync(request: NextRequest) {
  const config = getSchedulerConfig();

  // 1. Security Verification: Validate CRON_SECRET via Bearer token or query key
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret) {
    const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;
    const apiKey = request.nextUrl.searchParams.get("key");
    const isAuthorized = bearerToken === cronSecret || apiKey === cronSecret;

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

  // 2. Fetch all active and enabled sources deterministically
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

  // 3. Pre-execution Adapter Registry Validation
  const unregisteredSources = sources.filter((src: any) => !SourceAdapterRegistry.getAdapter(src.adapter_key));
  if (unregisteredSources.length > 0) {
    console.error(
      `[CRON PRE-CHECK WARNING] ${unregisteredSources.length} sources have missing/unregistered adapters:`,
      unregisteredSources.map((s: any) => `${s.code} -> ${s.adapter_key}`)
    );
  }

  // Parse optional batch pagination controls from query params
  const searchParams = request.nextUrl.searchParams;
  const batchSize = parseInt(searchParams.get("batchSize") || "3", 10) || 3;
  const startBatchIndex = parseInt(searchParams.get("batchIndex") || "0", 10) || 0;
  const maxBatchesToRun = searchParams.get("maxBatches")
    ? parseInt(searchParams.get("maxBatches")!, 10)
    : 2; // Default: process 2 batches per invocation to stay within 60s Hobby limit

  // 4. Execute with Durable Sequential Batch Orchestrator
  const orchestrator = new BatchOrchestrator({
    batchSize,
    sourceTimeoutMs: 10000, // 10s per-source timeout
    maxFunctionDurationMs: 50000, // 50s safe time-budget within 60s Vercel Hobby limit
  });

  const syncSummary = await orchestrator.orchestrateSequentialSync(sources, {
    startBatchIndex,
    maxBatchesToRun,
    triggerType: "scheduled",
  });

  // 5. Trigger cache revalidation on successful ingestion
  if (syncSummary.summary.totalInserted > 0 || syncSummary.summary.totalUpdated > 0) {
    try {
      revalidatePath("/jobs");
      revalidatePath("/exams");
      revalidatePath("/news");
      revalidatePath("/sitemap.xml");
      revalidatePath("/");
    } catch (revalErr) {
      console.warn("Revalidation notice:", revalErr);
    }
  }

  const nextSync = getNextScheduledSync();

  // 6. Return response compatible with existing API contract + enhanced batch details
  return NextResponse.json({
    success: true,
    executionType: syncSummary.executionType,
    executedAt: syncSummary.executedAt,
    overallDurationMs: syncSummary.overallDurationMs,
    totalSourcesEvaluated: syncSummary.totalSources,
    batchExecution: {
      batchesTotal: syncSummary.batchesTotal,
      batchesCompleted: syncSummary.batchesCompleted,
      batchSize,
      isComplete: syncSummary.isComplete,
      nextBatchIndex: syncSummary.nextBatchIndex,
      successfulSources: syncSummary.successfulSources,
      failedSources: syncSummary.failedSources,
      timedOutSources: syncSummary.timedOutSources,
      skippedLockedSources: syncSummary.skippedLockedSources,
    },
    summary: {
      totalExtracted: syncSummary.summary.totalExtracted,
      totalInserted: syncSummary.summary.totalInserted,
      totalUpdated: syncSummary.summary.totalUpdated,
      totalSkipped: syncSummary.summary.totalSkipped,
      totalFailed: syncSummary.summary.totalFailed,
    },
    nextScheduledSync: {
      formattedIST: nextSync.formattedIST,
      timeRemaining: nextSync.timeRemaining,
      dateUTC: nextSync.date.toISOString(),
    },
    results: syncSummary.results.map((r) => ({
      sourceId: r.sourceId,
      sourceCode: r.sourceCode,
      sourceName: r.sourceName,
      targetModule: r.targetModule,
      status: r.status === "SUCCESS" ? "completed" : r.status === "SKIPPED_LOCKED" ? "skipped_locked" : "failed",
      stats: r.stats,
      durationMs: r.durationMs,
      error: r.error,
    })),
  });
}
