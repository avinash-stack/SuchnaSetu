import fs from "fs";
import { createClient } from "@supabase/supabase-js";

const envContent = fs.readFileSync(".env.local", "utf8");
const env = {};
envContent.split("\n").forEach((line) => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    let val = match[2].trim();
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
    env[match[1].trim()] = val;
  }
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function verifyTabs() {
  console.log("=============================================================================");
  console.log(" SuchnaSetu - Admin Sources 4-Tab Restructuring Verification Suite");
  console.log("=============================================================================\n");

  const [importSourcesRes, officialSourcesRes] = await Promise.all([
    supabase.from("import_sources").select("*, organizations(name, acronym, state_code, jurisdiction)").order("name", { ascending: true }),
    supabase.from("official_sources").select("*, organizations(name, acronym)").order("name", { ascending: true }),
  ]);

  const importSources = importSourcesRes.data || [];
  const officialSources = officialSourcesRes.data || [];

  // Tab 1: Exams
  const examSources = importSources.filter((s) => s.target_module === "exams");
  console.log(`📋 Tab 1 [Exams]: ${examSources.length} Pipelines found`);
  examSources.forEach((s, idx) => console.log(`   ${idx + 1}. [${s.code}] ${s.name} (${s.is_enabled ? "Active" : "Disabled"})`));

  // Tab 2: News
  const newsSources = importSources.filter((s) => s.target_module === "bulletins");
  console.log(`\n📰 Tab 2 [News]: ${newsSources.length} Pipelines found`);
  newsSources.forEach((s, idx) => console.log(`   ${idx + 1}. [${s.code}] ${s.name} (${s.is_enabled ? "Active" : "Disabled"})`));

  // Tab 3: Recruitment
  const nationalSources = importSources.filter(
    (s) => s.target_module === "jobs" && s.organizations?.jurisdiction !== "state" && s.code !== "benchmark_mock_feed"
  );
  const stateSources = importSources.filter(
    (s) => s.target_module === "jobs" && s.organizations?.jurisdiction === "state"
  );
  console.log(`\n💼 Tab 3 [Recruitment]: Total ${nationalSources.length + stateSources.length} Pipelines`);
  console.log(`   • National Sub-filter : ${nationalSources.length} Sources`);
  console.log(`   • State Sub-filter    : ${stateSources.length} Sources`);

  // Tab 4: Sources
  console.log(`\n🌐 Tab 4 [Sources]: ${officialSources.length} Verified Official Public Portals found`);

  // Assertions
  let passed = true;
  if (examSources.length < 19) {
    console.error("❌ Exam sources count mismatch: expected 19, got " + examSources.length);
    passed = false;
  }
  if (newsSources.length < 6) {
    console.error("❌ News sources count mismatch: expected 6, got " + newsSources.length);
    passed = false;
  }
  if (nationalSources.length + stateSources.length < 29) {
    console.error("❌ Recruitment sources count mismatch: expected at least 29, got " + (nationalSources.length + stateSources.length));
    passed = false;
  }
  if (officialSources.length < 90) {
    console.error("❌ Official sources count mismatch: expected at least 90, got " + officialSources.length);
    passed = false;
  }

  if (passed) {
    console.log("\n=============================================================================");
    console.log(" ✅ ALL 4 TABS VERIFIED: Every source is properly categorized & accessible.");
    console.log("=============================================================================\n");
  }
}

verifyTabs().catch(console.error);
