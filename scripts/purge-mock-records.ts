import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";

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
  console.error("❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function purgeMockRecords() {
  console.log("=================================================================");
  console.log("🧹 SUCHNASETU MOCK / TEST DATA PURGE & REMEDIATION SUITE");
  console.log(`⏰ Time: ${new Date().toISOString()}`);
  console.log("=================================================================\n");

  const nowIso = new Date().toISOString();

  // 1. Audit Mock Exams
  const { data: mockExams, error: examFetchErr } = await supabase
    .from("gov_exams")
    .select("id, slug, title, status")
    .or("slug.ilike.mock-%,slug.ilike.test-%,title.ilike.%Benchmark Feed%");

  if (examFetchErr) {
    console.error("❌ Error fetching mock exams:", examFetchErr.message);
  } else {
    console.log(`Found ${mockExams?.length || 0} mock/benchmark exams.`);
    if (mockExams && mockExams.length > 0) {
      const examIds = mockExams.map((e) => e.id);
      const { error: examUpdateErr } = await supabase
        .from("gov_exams")
        .update({
          status: "archived",
          deleted_at: nowIso,
          updated_at: nowIso,
        })
        .in("id", examIds);

      if (examUpdateErr) {
        console.error("❌ Failed to archive mock exams:", examUpdateErr.message);
      } else {
        console.log(`✅ Successfully archived and soft-deleted ${examIds.length} mock exams in Supabase.`);
      }
    }
  }

  // 2. Audit Mock Jobs
  const { data: mockJobs, error: jobFetchErr } = await supabase
    .from("gov_jobs")
    .select("id, slug, title, status")
    .or("slug.ilike.mock-%,slug.ilike.test-%,title.ilike.%Benchmark Feed%");

  if (jobFetchErr) {
    console.error("❌ Error fetching mock jobs:", jobFetchErr.message);
  } else {
    console.log(`Found ${mockJobs?.length || 0} mock/benchmark jobs.`);
    if (mockJobs && mockJobs.length > 0) {
      const jobIds = mockJobs.map((j) => j.id);
      const { error: jobUpdateErr } = await supabase
        .from("gov_jobs")
        .update({
          status: "archived",
          deleted_at: nowIso,
          updated_at: nowIso,
        })
        .in("id", jobIds);

      if (jobUpdateErr) {
        console.error("❌ Failed to archive mock jobs:", jobUpdateErr.message);
      } else {
        console.log(`✅ Successfully archived and soft-deleted ${jobIds.length} mock jobs in Supabase.`);
      }
    }
  }

  // 3. Audit Mock News Articles
  const { data: mockNews, error: newsFetchErr } = await supabase
    .from("news_articles")
    .select("id, slug, title, is_published")
    .or("slug.ilike.mock-%,slug.ilike.test-%,title.ilike.%Benchmark Feed%");

  if (newsFetchErr) {
    console.error("❌ Error fetching mock news:", newsFetchErr.message);
  } else {
    console.log(`Found ${mockNews?.length || 0} mock news articles.`);
    if (mockNews && mockNews.length > 0) {
      const newsIds = mockNews.map((n) => n.id);
      const { error: newsUpdateErr } = await supabase
        .from("news_articles")
        .update({
          is_published: false,
          updated_at: nowIso,
        })
        .in("id", newsIds);

      if (newsUpdateErr) {
        console.error("❌ Failed to unpublish mock news:", newsUpdateErr.message);
      } else {
        console.log(`✅ Successfully unpublished ${newsIds.length} mock news articles.`);
      }
    }
  }

  // 4. Verification Check: Count active published mock items remaining
  const { count: remainingMockJobs } = await supabase
    .from("gov_jobs")
    .select("id", { count: "exact", head: true })
    .eq("status", "published")
    .is("deleted_at", null)
    .or("slug.ilike.mock-%,slug.ilike.test-%,title.ilike.%Benchmark Feed%");

  const { count: remainingMockExams } = await supabase
    .from("gov_exams")
    .select("id", { count: "exact", head: true })
    .eq("status", "published")
    .is("deleted_at", null)
    .or("slug.ilike.mock-%,slug.ilike.test-%,title.ilike.%Benchmark Feed%");

  console.log("\n=================================================================");
  console.log("📊 Post-Purge Verification Summary:");
  console.log(`- Active Published Mock Jobs Remaining:  ${remainingMockJobs || 0}`);
  console.log(`- Active Published Mock Exams Remaining: ${remainingMockExams || 0}`);
  console.log("=================================================================\n");
}

purgeMockRecords().catch(console.error);
