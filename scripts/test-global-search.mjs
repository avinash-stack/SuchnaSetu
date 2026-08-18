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

async function testSearchJobs(keyword) {
  let query = supabase.from("gov_jobs").select("id, title, notification_number", { count: "exact" }).eq("status", "published");
  if (keyword && keyword.trim()) {
    const cleanTerm = keyword.replace(/[,()]/g, " ").trim();
    const term = `%${cleanTerm}%`;
    query = query.or(`title.ilike.${term},notification_number.ilike.${term},summary.ilike.${term},slug.ilike.${term}`);
  }
  const { data, count, error } = await query.limit(5);
  return { count: count || 0, data: data || [], error };
}

async function testSearchExams(keyword) {
  let query = supabase.from("gov_exams").select("id, title, exam_code", { count: "exact" }).eq("status", "published");
  if (keyword && keyword.trim()) {
    const cleanTerm = keyword.replace(/[,()]/g, " ").trim();
    const term = `%${cleanTerm}%`;
    query = query.or(`title.ilike.${term},short_title.ilike.${term},description.ilike.${term},exam_code.ilike.${term},slug.ilike.${term}`);
  }
  const { data, count, error } = await query.limit(5);
  return { count: count || 0, data: data || [], error };
}

async function testSearchNews(keyword) {
  let query = supabase.from("public_bulletins").select("id, title, source_name", { count: "exact" }).eq("status", "published");
  if (keyword && keyword.trim()) {
    const cleanTerm = keyword.replace(/[,()]/g, " ").trim();
    const term = `%${cleanTerm}%`;
    query = query.or(`title.ilike.${term},summary.ilike.${term},source_name.ilike.${term},content.ilike.${term},slug.ilike.${term}`);
  }
  const { data, count, error } = await query.limit(5);
  return { count: count || 0, data: data || [], error };
}

async function runTests() {
  console.log("=============================================================================");
  console.log(" SuchnaSetu - Global Search Verification Suite Across All Modules");
  console.log("=============================================================================\n");

  let passed = 0;
  let failed = 0;

  // TEST 1: Jobs Module Search
  console.log("🔍 [1. JOBS MODULE SEARCH]");
  const jobsPartial = await testSearchJobs("Engineer");
  console.log(`  • Partial keyword "Engineer": ${jobsPartial.count} matches found`);
  if (jobsPartial.count > 0) passed++; else failed++;

  const jobsExact = await testSearchJobs("Assistant");
  console.log(`  • Exact keyword "Assistant": ${jobsExact.count} matches found`);
  if (jobsExact.count > 0) passed++; else failed++;

  const jobsNoResult = await testSearchJobs("xyznonexistentjob12345");
  console.log(`  • No-result keyword "xyznonexistentjob12345": ${jobsNoResult.count} matches (correct empty state)`);
  if (jobsNoResult.count === 0) passed++; else failed++;

  const jobsCleared = await testSearchJobs("");
  console.log(`  • Cleared search (""): ${jobsCleared.count} total jobs returned`);
  if (jobsCleared.count > 0) passed++; else failed++;

  // TEST 2: Exams & Notifications Search
  console.log("\n🔍 [2. EXAMS & NOTIFICATIONS MODULE SEARCH]");
  const examsPartial = await testSearchExams("Civil");
  console.log(`  • Partial keyword "Civil": ${examsPartial.count} matches found`);
  if (examsPartial.count > 0) passed++; else failed++;

  const examsExact = await testSearchExams("Combined");
  console.log(`  • Exact keyword "Combined": ${examsExact.count} matches found`);
  if (examsExact.count > 0) passed++; else failed++;

  const examsNoResult = await testSearchExams("xyznonexistentexam999");
  console.log(`  • No-result keyword "xyznonexistentexam999": ${examsNoResult.count} matches (correct empty state)`);
  if (examsNoResult.count === 0) passed++; else failed++;

  const examsCleared = await testSearchExams("");
  console.log(`  • Cleared search (""): ${examsCleared.count} total exams returned`);
  if (examsCleared.count > 0) passed++; else failed++;

  // TEST 3: News & Public Bulletins Search
  console.log("\n🔍 [3. NEWS & PUBLIC BULLETINS MODULE SEARCH]");
  const newsPartial = await testSearchNews("Employment");
  console.log(`  • Partial keyword "Employment": ${newsPartial.count} matches found`);
  if (newsPartial.count > 0) passed++; else failed++;

  const newsExact = await testSearchNews("Advisory");
  console.log(`  • Exact keyword "Advisory": ${newsExact.count} matches found`);
  if (newsExact.count > 0) passed++; else failed++;

  const newsNoResult = await testSearchNews("xyznonexistentnews000");
  console.log(`  • No-result keyword "xyznonexistentnews000": ${newsNoResult.count} matches (correct empty state)`);
  if (newsNoResult.count === 0) passed++; else failed++;

  const newsCleared = await testSearchNews("");
  console.log(`  • Cleared search (""): ${newsCleared.count} total bulletins returned`);
  if (newsCleared.count > 0) passed++; else failed++;

  // TEST 4: Special Characters & Sanitization
  console.log("\n🔍 [4. SPECIAL CHARACTERS & POSTGREST SANITIZATION]");
  const specialCharsJobs = await testSearchJobs("UPSC, SSC (Civil)");
  console.log(`  • Sanitized special character search "UPSC, SSC (Civil)": ${specialCharsJobs.count} matches without SQL/PostgREST error`);
  if (!specialCharsJobs.error) passed++; else failed++;

  console.log("\n=============================================================================");
  console.log(` SUMMARY: ${passed} / ${passed + failed} Search Test Scenarios Passed Successfully`);
  console.log("=============================================================================\n");
}

runTests().catch(console.error);
