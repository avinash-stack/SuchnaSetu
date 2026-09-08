import { createClient } from "@supabase/supabase-js";
import fs from "fs";

const envContent = fs.readFileSync(".env.local", "utf-8");
const env: Record<string, string> = {};
envContent.split("\n").forEach((line) => {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) {
    let val = match[2].trim();
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
    if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
    env[match[1].trim()] = val;
  }
});

const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL!, env.SUPABASE_SERVICE_ROLE_KEY!);

async function main() {
  const { data: cats } = await sb.from("categories").select("id, name, slug");
  console.log("Categories in DB (total: " + cats?.length + "):");
  console.table(cats);

  const { data: quals } = await sb.from("qualifications").select("id, name, slug");
  console.log("\nQualifications in DB (total: " + quals?.length + "):");
  console.table(quals);

  const { count: totalJobs } = await sb.from("gov_jobs").select("id", { count: "exact", head: true });
  const { count: jobsWithMinQual } = await sb.from("gov_jobs").select("id", { count: "exact", head: true }).not("min_qualification_id", "is", null);
  console.log(`\nJobs with min_qualification_id: ${jobsWithMinQual} / ${totalJobs}`);

  const { data: jobCats } = await sb.from("gov_jobs").select("category_id, categories(name, slug)");
  const catCounts: Record<string, number> = {};
  (jobCats || []).forEach((j: any) => {
    const slug = j.categories?.slug || "No Category";
    catCounts[slug] = (catCounts[slug] || 0) + 1;
  });
  console.log("\nJobs Breakdown by Category:", catCounts);

  const { data: jobStates } = await sb.from("gov_jobs").select("state_code");
  const stateCounts: Record<string, number> = {};
  (jobStates || []).forEach((j: any) => {
    const sc = j.state_code || "NULL";
    stateCounts[sc] = (stateCounts[sc] || 0) + 1;
  });
  for (const st of ["BR", "UP", "MP", "JH", "RJ", "DL"]) {
    const { count: jc } = await sb.from("gov_jobs").select("id", { count: "exact", head: true }).eq("state_code", st).eq("status", "published").is("deleted_at", null);
    const { count: ec } = await sb.from("gov_exams").select("id", { count: "exact", head: true }).eq("state_code", st).eq("status", "published").is("deleted_at", null);
    console.log(`State [${st}]: Jobs=${jc}, Exams=${ec}`);
  }

  const { data: examCats } = await sb.from("gov_exams").select("category_id, categories(name, slug)");
  const examCatCounts: Record<string, number> = {};
  (examCats || []).forEach((e: any) => {
    const slug = e.categories?.slug || "No Category";
    examCatCounts[slug] = (examCatCounts[slug] || 0) + 1;
  });
  console.log("\nExams Breakdown by Category:", examCatCounts);

  const { count: totalExams } = await sb.from("gov_exams").select("id", { count: "exact", head: true });
  console.log(`\nTotal Exams: ${totalExams}`);
}

main().catch(console.error);
