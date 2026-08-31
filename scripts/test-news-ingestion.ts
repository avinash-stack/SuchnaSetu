import { runNewsIngestionPipeline } from "../src/modules/news/services/ingestion-service";
import { createAdminClient } from "../src/lib/supabase/admin";

async function testNewsIngestion() {
  console.log("================================================================================");
  console.log("TESTING EXPANDED NEWS INGESTION PIPELINE ACROSS ALL 36 SOURCES");
  console.log("================================================================================");

  const supabase = createAdminClient();
  const { count: initialCount } = await (supabase.from("news_articles") as any)
    .select("id", { count: "exact", head: true });

  console.log(`Articles in database before sync: ${initialCount || 0}`);
  console.log(`Starting bounded parallel ingestion (concurrency = 4)...\n`);

  const startTime = Date.now();
  const summary = await runNewsIngestionPipeline(4);
  const duration = Date.now() - startTime;

  const { count: finalCount } = await (supabase.from("news_articles") as any)
    .select("id", { count: "exact", head: true });

  console.log("\n================================================================================");
  console.log("NEWS INGESTION RESULTS BREAKDOWN:");
  console.log("================================================================================");
  console.log(`Total Sources Processed: ${summary.totalSources}`);
  console.log(`✓ Successful / Working Sources: ${summary.successfulSources}`);
  console.log(`✗ Failed Sources: ${summary.failedSources}`);
  console.log(`Total Articles Fetched: ${summary.totalArticlesFetched}`);
  console.log(`New Articles Inserted: ${summary.totalArticlesInserted}`);
  console.log(`Duplicates Handled/Skipped: ${summary.totalDuplicatesSkipped}`);
  console.log(`Database Article Count After: ${finalCount || 0} (+${(finalCount || 0) - (initialCount || 0)} new)`);
  console.log(`Total Pipeline Execution Time: ${duration}ms (${(duration / 1000).toFixed(1)}s)`);

  console.log("\n--- Source-by-Source Breakdown: ---");
  summary.results.forEach((r) => {
    const icon = r.status === "success" || r.status === "partial" ? "✓" : "✗";
    console.log(`${icon} [${r.sourceCode}] (${r.sourceName}): Fetched: ${r.totalFetched} | Inserted: ${r.totalInserted} | Duplicates: ${r.totalDuplicates} | Time: ${r.durationMs}ms ${r.errorMessage ? `(Note: ${r.errorMessage})` : ""}`);
  });
}

testNewsIngestion().catch(console.error);
