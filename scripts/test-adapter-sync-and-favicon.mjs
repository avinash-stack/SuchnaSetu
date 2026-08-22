import { createAdminClient } from "../src/lib/supabase/admin.js";
import { SourceAdapterRegistry } from "../src/modules/ingestion/core/registry.js";
import { IngestionPipelineEngine } from "../src/modules/ingestion/core/pipeline.js";
import fs from "fs";
import path from "path";

async function runComprehensiveAudit() {
  console.log("================================================================");
  console.log("1. INGESTION ADAPTER & SOURCES AUDIT");
  console.log("================================================================\n");

  const supabase = createAdminClient();
  const { data: sources, error } = await supabase
    .from("import_sources")
    .select("id, code, name, adapter_key, target_module, is_enabled")
    .order("name");

  if (error || !sources) {
    console.error("Failed to fetch sources:", error);
    process.exit(1);
  }

  const enabledSources = sources.filter((s) => s.is_enabled);
  const registeredAdapters = SourceAdapterRegistry.listAdapters();

  console.log(`Total Configured Sources in DB: ${sources.length}`);
  console.log(`Total Enabled Sources in DB:    ${enabledSources.length}`);
  console.log(`Total Registered Adapters:      ${registeredAdapters.length}`);

  const missingAdapters = [];
  for (const src of enabledSources) {
    const adapter = SourceAdapterRegistry.getAdapter(src.adapter_key);
    if (!adapter) {
      missingAdapters.push({
        sourceId: src.id,
        code: src.code,
        name: src.name,
        adapterKey: src.adapter_key,
      });
    }
  }

  console.log(`Missing Adapters Count:         ${missingAdapters.length}`);
  if (missingAdapters.length > 0) {
    console.error("❌ CRITICAL: Found sources with missing adapters:", missingAdapters);
    process.exit(1);
  } else {
    console.log("✅ 100% of enabled sources have verified, registered SourceAdapters in the registry.");
  }

  console.log("\n================================================================");
  console.log("2. EXECUTING MANUAL SYNC FOR THE 5 FEEDS");
  console.log("   - defence_exams_feed");
  console.log("   - wb_exams_feed");
  console.log("   - uk_exams_feed");
  console.log("   - up_exams_feed");
  console.log("   - sbi_exams_feed");
  console.log("================================================================\n");

  const targetCodes = ["defence_exams_feed", "wb_exams_feed", "uk_exams_feed", "up_exams_feed", "sbi_exams_feed"];
  const targetSources = enabledSources.filter((s) => targetCodes.includes(s.code));
  const pipeline = new IngestionPipelineEngine();

  const manualResults = [];
  for (const src of targetSources) {
    console.log(`Running sync for: ${src.name} [${src.code}] -> adapter: ${src.adapter_key}...`);
    
    // Spawn test job record
    const { data: job, error: jobErr } = await supabase
      .from("import_jobs")
      .insert({
        source_id: src.id,
        trigger_type: "manual",
        status: "running",
        started_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (jobErr || !job) {
      console.error(`Failed to create job for ${src.code}:`, jobErr);
      manualResults.push({ code: src.code, status: "FAILED_TO_START", error: jobErr?.message });
      continue;
    }

    try {
      const stats = await pipeline.executeJob(job.id);
      console.log(`  ✓ Success! Extracted: ${stats.totalExtracted}, Inserted: ${stats.totalInserted}, Updated: ${stats.totalUpdated}, Skipped: ${stats.totalSkipped}, Failed: ${stats.totalFailed}`);
      manualResults.push({ code: src.code, status: "SUCCESS", stats });
    } catch (execErr) {
      console.error(`  ❌ Execution error for ${src.code}:`, execErr.message);
      manualResults.push({ code: src.code, status: "ERROR", error: execErr.message });
    }
  }

  console.log("\nManual Sync Results Summary:");
  console.table(manualResults.map(r => ({
    Source: r.code,
    Status: r.status,
    Extracted: r.stats?.totalExtracted ?? 0,
    Inserted: r.stats?.totalInserted ?? 0,
    Updated: r.stats?.totalUpdated ?? 0,
    Skipped: r.stats?.totalSkipped ?? 0,
    Failed: r.stats?.totalFailed ?? 0,
    Error: r.error || "None",
  })));

  console.log("\n================================================================");
  console.log("3. FAVICON & STATIC ASSETS VALIDATION");
  console.log("================================================================\n");

  const requiredFavicons = [
    "public/favicon.ico",
    "src/app/favicon.ico",
    "public/favicon-16x16.png",
    "public/favicon-32x32.png",
    "public/favicon-48x48.png",
    "public/apple-touch-icon.png",
    "public/android-chrome-192x192.png",
    "public/android-chrome-512x512.png",
    "public/icon.png",
    "src/app/icon.png",
    "public/site.webmanifest",
  ];

  for (const f of requiredFavicons) {
    const fullPath = path.resolve(f);
    if (fs.existsSync(fullPath)) {
      const stats = fs.statSync(fullPath);
      console.log(`  ✅ ${f} (${stats.size} bytes)`);
    } else {
      console.error(`  ❌ MISSING: ${f}`);
    }
  }
}

runComprehensiveAudit().catch(console.error);
