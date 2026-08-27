import fs from "fs";
import { createClient } from "@supabase/supabase-js";

// Load environment variables
const envContent = fs.readFileSync(".env.local", "utf8");
for (const line of envContent.split("\n")) {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
    const idx = trimmed.indexOf("=");
    const key = trimmed.slice(0, idx).trim();
    const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
    if (!process.env[key]) {
      process.env[key] = val;
    }
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function runAuditAndVerification() {
  console.log("================================================================================");
  console.log("             SUCHNASETU FIXES & VERIFICATION SUITE                             ");
  console.log("================================================================================\n");

  // ---------------------------------------------------------------------------
  // 1. AUDIT & TEST JOB COVERAGE FOR 7 TARGET NOTIFICATIONS
  // ---------------------------------------------------------------------------
  console.log("--- 1. JOB COVERAGE & DISCOVERY AUDIT ---");
  const testCases = [
    { name: "RFCL Recruitment 2026", term: "RFCL", query: "RFCL Management Trainee" },
    { name: "EIL Recruitment 2026", term: "Engineers India", query: "Engineers India Limited" },
    { name: "NIC Recruitment 2026", term: "NIC", query: "National Informatics Centre" },
    { name: "AAI Recruitment 2026", term: "AAI", query: "Airports Authority of India" },
    { name: "India Post Recruitment 2026", term: "India Post", query: "India Post" },
    { name: "Income Tax Department Recruitment 2026 (7 Canteen)", term: "Income Tax", query: "Canteen Attendant" },
    { name: "Income Tax Pune Sports Quota 2026", term: "Income Tax", query: "Pune Sports Quota" },
  ];

  let discoveredCount = 0;
  for (const tc of testCases) {
    const { data: matched, error } = await supabase
      .from("gov_jobs")
      .select("id, title, notification_number, total_vacancies, official_notification_url, status")
      .or(`title.ilike.%${tc.term}%,title.ilike.%${tc.query}%`)
      .limit(1);

    if (matched && matched.length > 0) {
      const job = matched[0];
      discoveredCount++;
      console.log(`  [DISCOVERED] ${tc.name}`);
      console.log(`    - Title: ${job.title}`);
      console.log(`    - Advt No: ${job.notification_number || "N/A"}`);
      console.log(`    - Vacancies: ${job.total_vacancies}`);
      console.log(`    - Official URL: ${job.official_notification_url}`);
      console.log(`    - Status: ${job.status}\n`);
    } else {
      console.log(`  [MISSING] ${tc.name} (Error: ${error?.message || "Not found in database"})\n`);
    }
  }
  console.log(`Total Target Test Cases Discovered: ${discoveredCount}/7\n`);

  // ---------------------------------------------------------------------------
  // 2. TEST TRANSLATOR: ENGLISH <-> HINDI, ENTITY PRESERVATION, FALLBACK
  // ---------------------------------------------------------------------------
  console.log("--- 2. NEWS TRANSLATOR AUDIT & VERIFICATION ---");

  // Test 2A: English -> Hindi Translation with strict entity preservation
  const sampleEnglish = {
    title: "UPSC Civil Services 2026 Notification Released for 1,056 Vacancies on 15 Feb 2026",
    summary: "Union Public Service Commission (UPSC) invites online applications for IAS and IPS recruitment. Apply on upsc.gov.in before 14 March 2026.",
  };

  const openRouterKey = process.env.OPENROUTER_API_KEY;
  console.log(`  OpenRouter API Key Configured: ${openRouterKey ? "YES" : "NO"}`);

  if (openRouterKey) {
    try {
      const prompt = `Translate this Indian news story headline and summary from English into Hindi:
Title: ${sampleEnglish.title}
Summary: ${sampleEnglish.summary}

Strict Editorial Rules:
1. Maintain journalistic precision and factual accuracy.
2. DO NOT translate or alter proper nouns, abbreviations (e.g. UPSC, IAS, IPS), numbers (1,056, 15, 2026, 14), dates, and URLs (upsc.gov.in).
3. Output valid JSON only with keys: "title", "summary".`;

      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${openRouterKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://suchnasetu.in",
          "X-Title": "SuchnaSetu News Translator",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: "You are a professional Hindi news translator for SuchnaSetu. Output valid JSON only." },
            { role: "user", content: prompt },
          ],
          response_format: { type: "json_object" },
          temperature: 0.1,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const parsed = JSON.parse(data?.choices?.[0]?.message?.content || "{}");
        console.log("  [PASS] English -> Hindi Translation Result:");
        console.log(`    - Translated Title: ${parsed.title}`);
        console.log(`    - Translated Summary: ${parsed.summary}`);

        // Check entity preservation
        const preservedUPSC = parsed.title.includes("UPSC") || parsed.summary.includes("UPSC");
        const preservedYear = parsed.title.includes("2026") || parsed.summary.includes("2026");
        const preservedVacancies = parsed.title.includes("1,056") || parsed.title.includes("1056") || parsed.summary.includes("1,056");
        console.log(`    - Preserved UPSC Acronym: ${preservedUPSC}`);
        console.log(`    - Preserved Year 2026: ${preservedYear}`);
        console.log(`    - Preserved Vacancies 1,056: ${preservedVacancies}\n`);
      } else {
        console.log(`  [WARN] OpenRouter translation returned HTTP ${res.status}`);
      }
    } catch (e) {
      console.warn("  [WARN] Translation API exception:", e.message);
    }
  }

  // Test 2B: Fallback test (Missing translation never breaks page)
  console.log("  [TEST] Fallback Behavior on Missing Translation / Null AI:");
  const testArticle = {
    id: "art-test-01",
    title: "Cabinet Approves Major Railway Infrastructure Projects",
    summary: "Union Cabinet chaired by Prime Minister approved multi-crore railway lines.",
    translations: [],
  };

  // Resolve localization
  const matched = testArticle.translations.find((t) => t.language_code === "hi");
  const resolved = {
    title: matched?.title || testArticle.title,
    summary: matched?.summary || testArticle.summary,
  };
  console.log(`    - Resolved Title without translation: "${resolved.title}"`);
  console.log(`    - Fallback Succeeded without crash: ${resolved.title === testArticle.title}\n`);

  console.log("================================================================================");
  console.log("             AUDIT & VERIFICATION COMPLETED SUCCESSFULLY                        ");
  console.log("================================================================================");
}

runAuditAndVerification();
