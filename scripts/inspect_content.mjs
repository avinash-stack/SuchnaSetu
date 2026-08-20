import { createClient } from "@supabase/supabase-js";
import fs from "fs";

const envFile = fs.readFileSync(".env.local", "utf8");
const env = Object.fromEntries(
  envFile
    .split("\n")
    .filter((l) => l.includes("=") && !l.startsWith("#"))
    .map((l) => {
      const idx = l.indexOf("=");
      const val = l.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
      return [l.slice(0, idx).trim(), val];
    })
);

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const jobsRes = await supabase.from("gov_jobs").select("*").limit(3);
  const examsRes = await supabase.from("gov_exams").select("*").limit(3);
  const bulletinsRes = await supabase.from("public_bulletins").select("*").limit(3);

  console.log("Jobs Error:", jobsRes.error, "Count:", jobsRes.data?.length);
  if (jobsRes.data?.length) console.log("Job 0:", jobsRes.data[0].id, jobsRes.data[0].title, jobsRes.data[0].slug);

  console.log("Exams Error:", examsRes.error, "Count:", examsRes.data?.length);
  if (examsRes.data?.length) console.log("Exam 0:", examsRes.data[0].id, examsRes.data[0].title, examsRes.data[0].slug);

  console.log("Bulletins Error:", bulletinsRes.error, "Count:", bulletinsRes.data?.length);
  if (bulletinsRes.data?.length) console.log("Bulletin 0:", bulletinsRes.data[0].id, bulletinsRes.data[0].title, bulletinsRes.data[0].slug);
}

main().catch(console.error);
