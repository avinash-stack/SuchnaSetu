import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import { DEFAULT_NEWS_SOURCES } from "../src/modules/news/constants/sources";

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

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function seedNewsSources() {
  console.log("================================================================================");
  console.log(`SEEDING & SYNCHRONIZING ${DEFAULT_NEWS_SOURCES.length} NEWS SOURCES IN SUPABASE`);
  console.log("================================================================================");

  let created = 0;
  let updated = 0;

  for (const src of DEFAULT_NEWS_SOURCES) {
    const { data: existing } = await supabase
      .from("news_sources")
      .select("id, code")
      .eq("code", src.code)
      .maybeSingle();

    const payload = {
      code: src.code,
      name: src.name,
      website_url: src.website_url,
      feed_url: src.feed_url,
      source_type: src.source_type,
      default_category: src.default_category,
      state_code: src.state_code,
      country: src.country,
      is_enabled: true,
      priority: src.priority,
      fetch_interval_minutes: src.fetch_interval_minutes,
      updated_at: new Date().toISOString(),
    };

    if (existing) {
      const { error } = await supabase
        .from("news_sources")
        .update(payload)
        .eq("id", existing.id);

      if (error) {
        console.error(`[UPDATE ERROR] ${src.code}:`, error.message);
      } else {
        updated++;
      }
    } else {
      const { error } = await supabase.from("news_sources").insert({
        ...payload,
        created_at: new Date().toISOString(),
      });

      if (error) {
        console.error(`[INSERT ERROR] ${src.code}:`, error.message);
      } else {
        created++;
        console.log(`+ Added: [${src.code}] ${src.name}`);
      }
    }
  }

  const { data: totalList } = await supabase.from("news_sources").select("id, is_enabled");
  const totalActive = totalList?.filter(s => s.is_enabled).length || 0;

  console.log("\n================================================================================");
  console.log(`NEWS SOURCE SEEDING SUMMARY:`);
  console.log(`Created: ${created} | Updated: ${updated}`);
  console.log(`Total Active News Sources in Database: ${totalActive}`);
  console.log("================================================================================");
}

seedNewsSources().catch(console.error);
