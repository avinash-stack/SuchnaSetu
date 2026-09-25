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

// Support SUPABASE_URL / SUPABASE_KEY fallbacks if named differently in CI
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
 * Triggers lightweight cache revalidation on Vercel after ingestion completes
 */
async function triggerVercelRevalidate(paths?: string[]) {
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

async function runNewsSync() {
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

async function runFullSync() {
  console.log("=================================================================");
  console.log("🚀 Starting Standalone Full Sync (Jobs & Exams on GitHub Runner)");
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
    return;
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
  console.log("📊 Full Ingestion Execution Summary:");
  console.log(`- Total Sources Evaluated: ${syncSummary.totalSources}`);
  console.log(`- Batches Total:           ${syncSummary.batchesTotal}`);
  console.log(`- Batches Completed:       ${syncSummary.batchesCompleted}`);
  console.log(`- Total Extracted:         ${syncSummary.summary.totalExtracted}`);
  console.log(`- Total Inserted:          +${syncSummary.summary.totalInserted}`);
  console.log(`- Total Updated:           +${syncSummary.summary.totalUpdated}`);
  console.log(`- Total Failed:            ${syncSummary.summary.totalFailed}`);
  console.log(`- Overall Duration:        ${Math.round(syncSummary.overallDurationMs / 1000)}s`);
  console.log("=================================================================\n");

  if (syncSummary.summary.totalInserted > 0 || syncSummary.summary.totalUpdated > 0) {
    await triggerVercelRevalidate(["/jobs", "/exams", "/news", "/sitemap.xml", "/"]);
  }

  return syncSummary;
}

async function main() {
  if (targetType === "news") {
    await runNewsSync();
  } else if (targetType === "full" || targetType === "all") {
    await runFullSync();
  } else {
    console.error(`❌ Unknown sync target: "${targetType}". Must be "news" or "full".`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("❌ Unhandled sync execution error:", err);
  process.exit(1);
});
