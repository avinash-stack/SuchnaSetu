import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { runNewsIngestionPipeline } from "@/modules/news/services/ingestion-service";
import { BatchOrchestrator } from "@/modules/ingestion/core/batch-orchestrator";
import { revalidatePath } from "next/cache";

export const maxDuration = 300; // 5 minutes runtime
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    // 1. Verify authenticated admin user session
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Active admin authentication required." },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const syncType = body.type || "news"; // "news" | "full"

    // 2. Trigger News Sync
    if (syncType === "news") {
      const startTime = Date.now();
      const summary = await runNewsIngestionPipeline(4);
      const durationMs = Date.now() - startTime;

      try {
        revalidatePath("/news");
        revalidatePath("/");
      } catch (err) {
        console.warn("Revalidation warning:", err);
      }

      return NextResponse.json({
        success: true,
        type: "news",
        executedAt: new Date().toISOString(),
        durationMs,
        summary: {
          totalSources: summary.totalSources,
          successfulSources: summary.successfulSources,
          failedSources: summary.failedSources,
          totalFetched: summary.totalArticlesFetched,
          totalInserted: summary.totalArticlesInserted,
          totalDuplicates: summary.totalDuplicatesSkipped,
        },
        results: summary.results,
      });
    }

    // 3. Trigger Full Sequential Sync (Jobs, Exams & Recruits)
    if (syncType === "full") {
      const adminClient = createAdminClient();
      const { data: sources, error: sourcesErr } = await (adminClient.from("import_sources") as any)
        .select("id, code, name, target_module, adapter_key, is_enabled")
        .eq("is_enabled", true)
        .order("target_module", { ascending: true })
        .order("name", { ascending: true });

      if (sourcesErr || !sources || sources.length === 0) {
        return NextResponse.json(
          { success: false, error: "No enabled sources found to synchronize." },
          { status: 400 }
        );
      }

      const batchSize = body.batchSize || 6;
      const startBatchIndex = body.batchIndex || 0;
      const maxBatchesToRun = body.maxBatches || 5;

      const orchestrator = new BatchOrchestrator({
        batchSize,
        sourceTimeoutMs: 18000,
        maxFunctionDurationMs: 240000,
      });

      const syncSummary = await orchestrator.orchestrateSequentialSync(sources, {
        startBatchIndex,
        maxBatchesToRun,
        triggerType: "manual",
      });

      try {
        revalidatePath("/jobs");
        revalidatePath("/exams");
        revalidatePath("/sitemap.xml");
        revalidatePath("/");
      } catch (err) {
        console.warn("Revalidation warning:", err);
      }

      return NextResponse.json({
        success: true,
        type: "full",
        executedAt: syncSummary.executedAt,
        durationMs: syncSummary.overallDurationMs,
        batchExecution: {
          batchesTotal: syncSummary.batchesTotal,
          batchesCompleted: syncSummary.batchesCompleted,
          isComplete: syncSummary.isComplete,
          nextBatchIndex: syncSummary.nextBatchIndex,
          successfulSources: syncSummary.successfulSources,
          failedSources: syncSummary.failedSources,
          timedOutSources: syncSummary.timedOutSources,
        },
        summary: syncSummary.summary,
        results: syncSummary.results.slice(0, 30),
      });
    }

    return NextResponse.json(
      { success: false, error: `Unsupported sync type: ${syncType}` },
      { status: 400 }
    );
  } catch (err: any) {
    console.error("[ADMIN TRIGGER SYNC ERROR]:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Manual sync trigger failed" },
      { status: 500 }
    );
  }
}
