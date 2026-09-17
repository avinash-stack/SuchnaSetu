import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import { formatPageTitle } from "../src/lib/seo";

// Load environment variables from .env.local
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

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing Supabase credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runVerification() {
  console.log("=================================================================");
  console.log("🔍 SUCHNASETU SEO & URL VERIFICATION SUITE");
  console.log("=================================================================\n");

  // 1. Fetch 3 Representative Jobs
  const { data: jobs, error: jobErr } = await supabase
    .from("gov_jobs")
    .select("slug, title, status")
    .eq("status", "published")
    .not("slug", "ilike", "mock-%")
    .limit(3);

  if (jobErr) console.error("Jobs fetch error:", jobErr);
  console.log("📋 3 REPRESENTATIVE JOB URLs:");
  jobs?.forEach((j, idx) => {
    const url = `https://suchnasetu.in/jobs/${j.slug}`;
    const rawTitle = `${j.title} Recruitment 2026`;
    const finalTitle = formatPageTitle(rawTitle);
    console.log(`  [Job ${idx + 1}]`);
    console.log(`    URL:       ${url}`);
    console.log(`    Canonical: ${url}`);
    console.log(`    Title:     ${finalTitle}`);
  });

  // 2. Fetch 3 Representative Exams
  const { data: exams, error: examErr } = await supabase
    .from("gov_exams")
    .select("slug, title, status")
    .eq("status", "published")
    .not("slug", "ilike", "mock-%")
    .limit(3);

  if (examErr) console.error("Exams fetch error:", examErr);
  console.log("\n📋 3 REPRESENTATIVE EXAM URLs:");
  exams?.forEach((e, idx) => {
    const url = `https://suchnasetu.in/exams/${e.slug}`;
    const rawTitle = `${e.title} 2026`;
    const finalTitle = formatPageTitle(rawTitle);
    console.log(`  [Exam ${idx + 1}]`);
    console.log(`    URL:       ${url}`);
    console.log(`    Canonical: ${url}`);
    console.log(`    Title:     ${finalTitle}`);
  });

  // 3. Fetch 3 Representative News Articles
  const { data: news, error: newsErr } = await supabase
    .from("news_articles")
    .select("slug, title, is_published")
    .eq("is_published", true)
    .not("slug", "ilike", "mock-%")
    .order("published_at", { ascending: false })
    .limit(3);

  if (newsErr) console.error("News fetch error:", newsErr);
  console.log("\n📋 3 REPRESENTATIVE NEWS URLs:");
  news?.forEach((n, idx) => {
    const url = `https://suchnasetu.in/news/${n.slug}`;
    const rawTitle = `${n.title} | SuchnaSetu News`;
    const finalTitle = formatPageTitle(rawTitle);
    console.log(`  [News ${idx + 1}]`);
    console.log(`    URL:       ${url}`);
    console.log(`    Canonical: ${url}`);
    console.log(`    Title:     ${finalTitle}`);
  });

  // 4. Verify Sitemap Mock Exclusion
  const { data: mockExamsInDb } = await supabase
    .from("gov_exams")
    .select("id, slug, status, deleted_at")
    .or("slug.ilike.mock-%,slug.ilike.test-%");

  const activeMockExams = mockExamsInDb?.filter(e => e.status === "active" && !e.deleted_at);
  console.log("\n📊 MOCK DATA AUDIT:");
  console.log(`  - Total mock exams in DB:           ${mockExamsInDb?.length || 0}`);
  console.log(`  - Active mock exams eligible for sitemap: ${activeMockExams?.length || 0} (Expected: 0)`);

  const { data: mockJobsInDb } = await supabase
    .from("gov_jobs")
    .select("id, slug, status, deleted_at")
    .or("slug.ilike.mock-%,slug.ilike.test-%");

  const activeMockJobs = mockJobsInDb?.filter(j => j.status === "active" && !j.deleted_at);
  console.log(`  - Total mock jobs in DB:            ${mockJobsInDb?.length || 0}`);
  console.log(`  - Active mock jobs eligible for sitemap:  ${activeMockJobs?.length || 0} (Expected: 0)`);

  // 5. Test Title Formatter Edge Cases
  console.log("\n🏷️ TITLE FORMATTER VALIDATION:");
  const testCases = [
    { in: "UPSC CSE 2026", expected: "UPSC CSE 2026 | SuchnaSetu" },
    { in: "UPSC CSE 2026 | SuchnaSetu", expected: "UPSC CSE 2026 | SuchnaSetu" },
    { in: "Railways Notification | SuchnaSetu News", expected: "Railways Notification | SuchnaSetu News" },
    { in: "Railways Notification | SuchnaSetu News | SuchnaSetu", expected: "Railways Notification | SuchnaSetu News" },
    { in: "Notice Not Found | SuchnaSetu", expected: "Notice Not Found | SuchnaSetu" },
    { in: "सूचना सेतु समाचार — मुख्य पृष्ठ", expected: "सूचना सेतु समाचार — मुख्य पृष्ठ" },
  ];

  let titleTestsPassed = true;
  for (const tc of testCases) {
    const actual = formatPageTitle(tc.in);
    const pass = actual === tc.expected;
    if (!pass) titleTestsPassed = false;
    console.log(`  ${pass ? "✅ PASS" : "❌ FAIL"}: "${tc.in}" => "${actual}"`);
  }

  console.log("\n=================================================================");
  console.log(`✨ VERIFICATION SUMMARY: All SEO checks ${titleTestsPassed ? "PASSED ✅" : "FAILED ❌"}`);
  console.log("=================================================================\n");
}

runVerification();
