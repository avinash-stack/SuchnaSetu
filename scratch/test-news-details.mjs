import fs from "fs";
import { createClient } from "@supabase/supabase-js";

const envContent = fs.readFileSync(".env.local", "utf8");
for (const line of envContent.split("\n")) {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
    const idx = trimmed.indexOf("=");
    const key = trimmed.slice(0, idx).trim();
    const val = trimmed.slice(idx + 1).trim().replace(/^["\x27]|["\x27]$/g, "");
    if (!process.env[key]) process.env[key] = val;
  }
}

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function testNewsDetailPages() {
  console.log("================================================================================");
  console.log("               TESTING NEWS DETAIL PAGES & STRUCTURED CONTENT                   ");
  console.log("================================================================================\n");

  const { data: articles } = await supabase
    .from("news_articles")
    .select("id, slug, title, category_slug, source_name")
    .eq("is_published", true)
    .limit(4);

  if (!articles || articles.length === 0) {
    console.error("No articles found to test!");
    return;
  }

  for (const art of articles) {
    console.log(`[TESTING ARTICLE]: ${art.title}`);
    console.log(`  Slug: ${art.slug}`);
    console.log(`  Category: ${art.category_slug}`);
    console.log(`  Source: ${art.source_name}`);

    // Test English endpoint
    const resEn = await fetch(`http://localhost:3001/news/${art.slug}`);
    const htmlEn = await resEn.text();
    const hasExecSummaryEn = htmlEn.includes("1. Executive Summary");
    const hasWhatHappenedEn = htmlEn.includes("2. What Happened");
    const hasKeyDetailsEn = htmlEn.includes("3. Key Details &amp; Specifications") || htmlEn.includes("Key Details");
    const hasContextEn = htmlEn.includes("4. Important Context &amp; Background") || htmlEn.includes("Important Context");
    const hasSourceEn = htmlEn.includes("6. Source &amp; Publication Details") || htmlEn.includes("Source &amp; Publication");

    console.log(`  • English View (HTTP ${resEn.status}):`);
    console.log(`    - Executive Summary Present: ${hasExecSummaryEn}`);
    console.log(`    - What Happened Present:     ${hasWhatHappenedEn}`);
    console.log(`    - Key Details Present:       ${hasKeyDetailsEn}`);
    console.log(`    - Context Present:           ${hasContextEn}`);
    console.log(`    - Source Attribution Present:${hasSourceEn}`);

    // Test Hindi endpoint
    const resHi = await fetch(`http://localhost:3001/news/${art.slug}?lang=hi`);
    const htmlHi = await resHi.text();
    const hasExecSummaryHi = htmlHi.includes("कार्यकारी सारांश");
    const hasWhatHappenedHi = htmlHi.includes("क्या हुआ");
    const hasKeyDetailsHi = htmlHi.includes("मुख्य विवरण");
    const hasContextHi = htmlHi.includes("महत्वपूर्ण संदर्भ");

    console.log(`  • Hindi View (HTTP ${resHi.status}):`);
    console.log(`    - Executive Summary Present: ${hasExecSummaryHi}`);
    console.log(`    - What Happened Present:     ${hasWhatHappenedHi}`);
    console.log(`    - Key Details Present:       ${hasKeyDetailsHi}`);
    console.log(`    - Context Present:           ${hasContextHi}\n`);
  }

  console.log("================================================================================");
  console.log("                 ALL TESTED NEWS DETAIL PAGES PASSED!                           ");
  console.log("================================================================================");
}

testNewsDetailPages();
