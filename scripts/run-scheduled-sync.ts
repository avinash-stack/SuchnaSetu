import fs from "fs";
import path from "path";
import { createAdminClient } from "../src/lib/supabase/admin";
import { runNewsIngestionPipeline } from "../src/modules/news/services/ingestion-service";
import { BatchOrchestrator } from "../src/modules/ingestion/core/batch-orchestrator";

// Load environment variables from .env.local if present and not already defined in process.env
const envLocalPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envLocalPath)) {
  const envContent = fs.readFileSync(envLocalPath, "utf8");
  envContent.split("\n").forEach((line) => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      let val = match[2].trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  });
}

// Support alternative secret variable names in CI/runners
if (process.env.SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL) {
  process.env.NEXT_PUBLIC_SUPABASE_URL = process.env.SUPABASE_URL;
}
if (process.env.SUPABASE_KEY && !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  process.env.SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_KEY;
}

const targetType = (process.argv[2] || "news").toLowerCase();
const appUrl = (process.env.APP_URL || process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || "https://suchnasetu.in").replace(/\/+$/, "");
const cronSecret = process.env.CRON_SECRET || "";

/**
 * Triggers lightweight cache revalidation on Vercel after ingestion completes.
 * Note: This only revalidates ISR page caches (<100ms); it does NOT execute any scraping or ingestion compute.
 */
async function triggerVercelRevalidate(paths?: string[]) {
  if (!cronSecret) {
    console.log("ℹ️ No CRON_SECRET provided; skipping remote cache revalidation.");
    return;
  }

  if (!appUrl || appUrl.includes("localhost")) {
    console.log("ℹ️ Skipping remote revalidation in local environment.");
    return;
  }

  const pathsToRevalidate = paths && paths.length > 0 ? paths : [undefined];

  for (const p of pathsToRevalidate) {
    const endpoint = p
      ? `${appUrl}/api/revalidate?secret=${encodeURIComponent(cronSecret)}&path=${encodeURIComponent(p)}`
      : `${appUrl}/api/revalidate?secret=${encodeURIComponent(cronSecret)}`;

    try {
      console.log(`📡 Triggering Vercel cache revalidation: ${endpoint.replace(cronSecret, "***")}`);
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "User-Agent": "SuchnaSetu-GitHubActions-SyncRunner/1.0",
        },
      });
      if (res.ok) {
        console.log(`✅ Vercel cache revalidation succeeded for ${p || "all primary hubs"}.`);
      } else {
        console.warn(`⚠️ Vercel revalidation returned HTTP ${res.status}`);
      }
    } catch (err: any) {
      console.warn("⚠️ Failed to trigger Vercel revalidation:", err?.message || err);
    }
  }
}

/**
 * News Ingestion execution directly on GitHub Actions runner.
 * Bounded concurrency, safe timeouts, per-source fault tolerance.
 */
export async function runNewsSync() {
  console.log("=================================================================");
  console.log("🚀 Starting Standalone News Ingestion (GitHub Actions Runner)");
  console.log(`⏰ Time: ${new Date().toISOString()}`);
  console.log("=================================================================\n");

  const startTime = Date.now();
  // Allow up to 10 minutes for full news synchronization across all enabled feeds
  const summary = await runNewsIngestionPipeline({
    concurrencyLimit: 4,
    maxDurationMs: 600000,
  });

  const durationSec = Math.round((Date.now() - startTime) / 1000);
  console.log("\n=================================================================");
  console.log("📊 News Ingestion Execution Summary:");
  console.log(`- Total Sources:          ${summary.totalSources}`);
  console.log(`- Successful Sources:     ${summary.successfulSources}`);
  console.log(`- Failed Sources:         ${summary.failedSources}`);
  console.log(`- Articles Fetched:       ${summary.totalArticlesFetched}`);
  console.log(`- Articles Inserted:      +${summary.totalArticlesInserted}`);
  console.log(`- Duplicates Skipped:     ${summary.totalDuplicatesSkipped}`);
  console.log(`- Total Duration:         ${durationSec}s`);
  console.log("=================================================================\n");

  if (summary.totalArticlesInserted > 0) {
    await triggerVercelRevalidate(["/news", "/"]);
  }

  return summary;
}

/**
 * Jobs & Exams Ingestion execution directly on GitHub Actions runner.
 * Sequential bounded batches (batchSize: 4, safe per-source timeouts).
 */
export async function runJobsExamsSync() {
  console.log("=================================================================");
  console.log("🚀 Starting Standalone Jobs & Exams Ingestion (GitHub Runner)");
  console.log(`⏰ Time: ${new Date().toISOString()}`);
  console.log("=================================================================\n");

  const supabase = createAdminClient();

  // Fetch all active and enabled sources
  const { data: sources, error: sourcesError } = await (supabase.from("import_sources") as any)
    .select("id, code, name, target_module, adapter_key, is_enabled")
    .eq("is_enabled", true)
    .order("target_module", { ascending: true })
    .order("name", { ascending: true });

  if (sourcesError || !sources || sources.length === 0) {
    console.warn("⚠️ No enabled sources found to synchronize:", sourcesError?.message);
    return null;
  }

  console.log(`Found ${sources.length} enabled sources to synchronize.`);

  // Use BatchOrchestrator with safe parameters for GitHub Actions environment (up to 20 mins)
  const orchestrator = new BatchOrchestrator({
    batchSize: 4,
    sourceTimeoutMs: 12000,
    maxFunctionDurationMs: 1200000, // 20 minutes runner budget
  });

  const syncSummary = await orchestrator.orchestrateSequentialSync(sources, {
    startBatchIndex: 0,
    triggerType: "scheduled",
  });

  console.log("\n=================================================================");
  console.log("📊 Jobs & Exams Ingestion Execution Summary:");
  console.log(`- Total Sources Evaluated: ${syncSummary.totalSources}`);
  console.log(`- Batches Total:           ${syncSummary.batchesTotal}`);
  console.log(`- Batches Completed:       ${syncSummary.batchesCompleted}`);
  console.log(`- Successful Sources:      ${syncSummary.successfulSources}`);
  console.log(`- Failed Sources:          ${syncSummary.failedSources}`);
  console.log(`- Timed Out Sources:       ${syncSummary.timedOutSources}`);
  console.log(`- Total Extracted:         ${syncSummary.summary.totalExtracted}`);
  console.log(`- Total Inserted:          +${syncSummary.summary.totalInserted}`);
  console.log(`- Total Updated:           +${syncSummary.summary.totalUpdated}`);
  console.log(`- Overall Duration:        ${Math.round(syncSummary.overallDurationMs / 1000)}s`);
  console.log("=================================================================\n");

  if (syncSummary.summary.totalInserted > 0 || syncSummary.summary.totalUpdated > 0) {
    await triggerVercelRevalidate(["/jobs", "/exams", "/sitemap.xml", "/"]);
  }

  return syncSummary;
}

/**
 * AI Career Guidance Resources Generation directly on GitHub Actions runner.
 * Employs Groq AI integration with candidate topic discovery.
 */
export async function runResourcesSync() {
  console.log("=================================================================");
  console.log("🚀 Starting AI Career Guidance Resources Generation & Sync");
  console.log(`⏰ Time: ${new Date().toISOString()}`);
  console.log("=================================================================\n");

  const supabase = createAdminClient();
  const existingSlugs = new Set<string>();

  try {
    const { data } = await (supabase.from("career_resources") as any)
      .select("slug");
    if (data) {
      data.forEach((r: any) => existingSlugs.add(r.slug));
    }
  } catch (err: any) {
    console.warn("Could not query existing slugs:", err?.message);
  }

  const { discoverNextTrendingTopic } = await import("../src/modules/resources/services/topic-discovery");
  const { generateCareerResource } = await import("../src/modules/resources/services/ai-generator");
  const { saveGeneratedResource } = await import("../src/modules/resources/service");

  const topic = await discoverNextTrendingTopic(existingSlugs);
  console.log(`Selected Candidate Topic: "${topic.suggestedTitle}" (${topic.organization})`);

  const genResult = await generateCareerResource(topic);

  if (!genResult.success || !genResult.resource) {
    console.error("❌ Failed to generate resource:", genResult.error);
    return { success: false, error: genResult.error };
  }

  console.log(`✅ Generated guide successfully in ${genResult.durationMs}ms:`);
  console.log(`- Title:   ${genResult.resource.title}`);
  console.log(`- Slug:    ${genResult.resource.slug}`);
  console.log(`- FAQs:    ${(genResult.resource.faqs || []).length}`);
  console.log(`- Words:   ~${(genResult.resource.content || "").split(/\s+/).length}`);

  const saveResult = await saveGeneratedResource(genResult.resource);
  if (saveResult.success) {
    console.log(`✅ Published to Supabase with ID: ${saveResult.id}`);
    await triggerVercelRevalidate(["/resources", `/resources/${genResult.resource.slug}`, "/sitemap.xml"]);
    return { success: true, id: saveResult.id, slug: genResult.resource.slug };
  } else {
    console.warn(`⚠️ Supabase save result (migration may need to be applied in Supabase dashboard):`, saveResult.error);
    return { success: false, error: saveResult.error };
  }
}

/**
 * Full Scheduled Synchronization:
 * Executes Jobs & Exams, News, and Career Resources sequentially on the runner.
 */
export async function runFullSync() {
  console.log("#################################################################");
  console.log("🌟 INITIATING COMPLETE SCHEDULED DATA SYNCHRONIZATION");
  console.log("   Includes: 1. Jobs & Exams  |  2. News Feeds  |  3. Career Resources");
  console.log(`   Time: ${new Date().toISOString()}`);
  console.log("#################################################################\n");

  const fullStart = Date.now();

  // 1. Ingest Jobs & Exams
  const jobsSummary = await runJobsExamsSync();

  // 2. Ingest Live News
  const newsSummary = await runNewsSync();

  // 3. Generate Trending Career Guidance Resources
  let resourcesSummary: any = null;
  try {
    resourcesSummary = await runResourcesSync();
  } catch (resErr: any) {
    console.warn("⚠️ Resources generation step encountered error:", resErr?.message);
    resourcesSummary = { success: false, error: resErr?.message };
  }

  const overallSec = Math.round((Date.now() - fullStart) / 1000);

  console.log("\n#################################################################");
  console.log("🏁 OVERALL FULL SYNCHRONIZATION RUN COMPLETE");
  console.log(`- Total Duration:       ${overallSec}s`);
  console.log(`- Jobs & Exams Sources: ${jobsSummary ? `${jobsSummary.successfulSources}/${jobsSummary.totalSources} succeeded` : "N/A"}`);
  console.log(`- News Sources:         ${newsSummary.successfulSources}/${newsSummary.totalSources} succeeded`);
  console.log(`- Career Resources:     ${resourcesSummary?.success ? "Generated & Saved" : "Skipped/Failed"}`);
  console.log("#################################################################\n");

  return {
    jobsSummary,
    newsSummary,
    resourcesSummary,
    overallSec,
  };
}

async function main() {
  if (targetType === "news") {
    const summary = await runNewsSync();
    if (summary.totalSources > 0 && summary.successfulSources === 0) {
      console.error("❌ Critical Failure: All news sources failed in this execution run.");
      process.exit(1);
    }
  } else if (targetType === "jobs" || targetType === "exams") {
    const summary = await runJobsExamsSync();
    if (summary && summary.totalSources > 0 && summary.successfulSources === 0) {
      console.error("❌ Critical Failure: All jobs/exams sources failed in this execution run.");
      process.exit(1);
    }
  } else if (targetType === "resources") {
    const result = await runResourcesSync();
    if (!result.success) {
      console.warn("⚠️ Resource generation did not complete successfully.");
    }
  } else if (targetType === "full" || targetType === "all") {
    const result = await runFullSync();
    const jobsFailed = result.jobsSummary && result.jobsSummary.totalSources > 0 && result.jobsSummary.successfulSources === 0;
    const newsFailed = result.newsSummary.totalSources > 0 && result.newsSummary.successfulSources === 0;
    if (jobsFailed && newsFailed) {
      console.error("❌ Critical Failure: Both Jobs/Exams and News ingestions completely failed.");
      process.exit(1);
    }
  } else {
    console.error(`❌ Unknown sync target: "${targetType}". Must be "news", "jobs", "exams", "resources", or "full".`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("❌ Unhandled sync execution error:", err);
  process.exit(1);
});
