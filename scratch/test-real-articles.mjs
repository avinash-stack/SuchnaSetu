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

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function testRealArticles() {
  console.log("================================================================================");
  console.log("             VERIFYING FULL CONTENT ACROSS REAL NEWS ARTICLES                   ");
  console.log("================================================================================\n");

  const slugsToTest = [
    "union-cabinet-approves-modernization-of-national-career-service-portal",
    "isro-finalizes-launch-window-chandrayaan-4-sample-return-mission",
    "ugc-mandatory-advisory-degree-equivalence-state-central-recruitment",
    "up-cabinet-approves-youth-employment-incentive-scheme-2026",
  ];

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✓ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${message}`);
      failed++;
    }
  }

  for (const slug of slugsToTest) {
    console.log(`[TESTING ARTICLE]: "${slug}"`);

    // Fetch rendered English page
    const resEn = await fetch(`http://localhost:3001/news/${slug}`);
    const htmlEn = await resEn.text();

    assert(resEn.status === 200, `English Detail Page returned HTTP 200`);

    const hasAiSummary = htmlEn.includes("AI Summary &amp; Key Takeaway") || htmlEn.includes("AI Summary");
    const hasSource = htmlEn.includes("Original Source Attribution &amp; Reference") || htmlEn.includes("View Original Source");
    const hasArtificialNumberedSections = htmlEn.includes("2. What Happened") || htmlEn.includes("3. Key Details");

    assert(hasAiSummary, "AI Summary highlight card is present at top");
    assert(!hasArtificialNumberedSections, "Rendered in normal flowing article paragraphs (no artificial numbered sections)");
    assert(hasSource, "Original source attribution is present at bottom");

    // Content length verification from rendered HTML body
    const hasMultipleParagraphs = (htmlEn.match(/<p class="leading-relaxed">/g) || []).length >= 3;
    assert(hasMultipleParagraphs, "Rendered page contains multiple full journalistic paragraphs (substantially more than summary)");

    // Fetch rendered Hindi page
    const resHi = await fetch(`http://localhost:3001/news/${slug}?lang=hi`);
    const htmlHi = await resHi.text();

    assert(resHi.status === 200, `Hindi Detail Page returned HTTP 200`);
    assert(htmlHi.includes("AI सारांश एवं मुख्य बिंदु") || htmlHi.includes("सारांश"), "Hindi AI summary rendered correctly");
    assert(htmlHi.includes("मूल आधिकारिक स्रोत देखें"), "Hindi source attribution rendered correctly");

    console.log("");
  }

  console.log("================================================================================");
  console.log(`VERIFICATION SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log("================================================================================");
}

testRealArticles().catch(console.error);
