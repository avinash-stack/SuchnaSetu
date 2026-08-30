import { createAdminClient } from "../src/lib/supabase/admin";
import { BatchOrchestrator } from "../src/modules/ingestion/core/batch-orchestrator";

async function testIngestion() {
  console.log("================================================================================");
  console.log("TESTING BATCH INGESTION FOR TARGET SPECIFIC SOURCES & NEWLY ADDED SOURCES");
  console.log("================================================================================");

  const supabase = createAdminClient();

  const targetCodes = [
    "rfcl_official_feed",
    "eil_official_feed",
    "nic_nielit_official_feed",
    "aai_official_feed",
    "india_post_official_feed",
    "incometax_official_feed",
    "incometax_pune_official_feed",
    "sail_official_feed",
    "gail_official_feed",
    "iocl_official_feed",
    "sebi_official_feed",
    "lic_official_feed",
    "rrc_national_feed",
    "delhi_police_official_feed",
    "mahapolice_official_feed",
    "osssc_official_feed",
    "bombay_hc_official_feed",
  ];

  const { data: sources, error } = await (supabase.from("import_sources") as any)
    .select("id, code, name, target_module, adapter_key, is_enabled")
    .in("code", targetCodes);

  if (error || !sources || sources.length === 0) {
    console.error("No target sources found in DB:", error?.message);
    return;
  }

  console.log(`Found ${sources.length} target sources in DB. Executing BatchOrchestrator...\n`);

  const orchestrator = new BatchOrchestrator({
    batchSize: 4,
    sourceTimeoutMs: 12000,
    maxFunctionDurationMs: 250000,
  });

  for (const src of sources) {
    try {
      const res = await orchestrator.executeSingleSource(src, "manual");
      console.log(`✓ [${res.sourceCode}] Status: ${res.status} | Extracted: ${res.stats?.totalExtracted || 0} | Inserted: ${res.stats?.totalInserted || 0} | Updated: ${res.stats?.totalUpdated || 0} | Skipped: ${res.stats?.totalSkipped || 0} | Duration: ${res.durationMs}ms`);
      if (res.error) {
        console.log(`   Note: ${res.error}`);
      }
    } catch (err: any) {
      console.error(`✗ [${src.code}] Error:`, err.message);
    }
  }

  console.log("\n================================================================================");
  console.log("AUDITING SPECIFIC TARGET JOBS DISCOVERED IN DATABASE:");
  console.log("================================================================================");

  const checkKeywords = [
    { label: "RFCL", query: "rfcl" },
    { label: "EIL", query: "engineers-india" },
    { label: "NIC / NIELIT", query: "nic" },
    { label: "AAI", query: "airports-authority" },
    { label: "India Post", query: "india-post" },
    { label: "Income Tax Department", query: "income-tax-department" },
    { label: "Income Tax Pune", query: "income-tax-pune" },
    { label: "SAIL", query: "sail" },
    { label: "GAIL", query: "gail" },
    { label: "IOCL", query: "iocl" },
    { label: "SEBI", query: "sebi" },
    { label: "LIC", query: "lic" },
    { label: "RRC (Railways Level-1)", query: "rrc" },
    { label: "Delhi Police", query: "delhi-police" },
    { label: "Maharashtra Police", query: "mahapolice" },
    { label: "OSSSC", query: "osssc" },
    { label: "Bombay High Court", query: "bombay-hc" },
  ];

  for (const item of checkKeywords) {
    const { data: notices, count } = await (supabase.from("gov_job_notifications") as any)
      .select("id, title, slug, notification_number, total_vacancies, pay_scale_details, organizations(name, slug)", { count: "exact" })
      .or(`slug.ilike.%${item.query}%,title.ilike.%${item.query}%`);

    console.log(`\n▶ [${item.label}] -> Found ${count || 0} active job notifications in DB:`);
    (notices || []).forEach((n: any) => {
      console.log(`   • ${n.title}`);
      console.log(`     Advt: ${n.notification_number} | Vacancies: ${n.total_vacancies} | Pay: ${n.pay_scale_details || "N/A"}`);
      console.log(`     Slug: /jobs/${n.slug}`);
    });
  }
}

testIngestion().catch(console.error);
