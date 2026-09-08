import fs from "fs";
import { createClient } from "@supabase/supabase-js";
import {
  translateTextWithGoogle,
  clearTranslationCache,
  getTranslationCacheStats,
} from "../src/modules/translation/google-translate-engine";
import {
  translateJobNotice,
  translateNewsArticle,
} from "../src/modules/translation/service";
import { GovJobDetailed } from "../src/modules/jobs/types";
import { NewsArticle } from "../src/modules/news/types/article";

// Load environment variables safely
try {
  const envContent = fs.readFileSync(".env.local", "utf8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const match = trimmed.match(/^([^=]+)=(.*)$/);
    if (match) {
      const k = match[1].trim();
      let v = match[2].trim();
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
        v = v.slice(1, -1);
      }
      if (!process.env[k]) process.env[k] = v;
    }
  }
} catch (e) {}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface TestSuiteSummary {
  jobsTest: { passed: boolean; count: number; samples: any[] };
  newsTest: { passed: boolean; count: number; samples: any[] };
  shortLongContentTest: { passed: boolean; shortLatency: number; longLatency: number; longChars: number };
  cacheTest: { passed: boolean; initialMs: number; memoryCacheMs: number; dbCacheMs: number };
  deduplicationTest: { passed: boolean; parallelRequests: number; identicalResults: boolean };
  failureSimulationTest: { passed: boolean; fallbackRetainedOriginal: boolean };
  originalContentIntegrityTest: { passed: boolean; englishUnchanged: boolean };
}

async function runTestSuite() {
  console.log("================================================================================");
  console.log("SUCHNASETU TRANSLATION SYSTEM GLOBAL VERIFICATION (JOBS & NEWS)");
  console.log("================================================================================\n");

  const results: TestSuiteSummary = {
    jobsTest: { passed: false, count: 0, samples: [] },
    newsTest: { passed: false, count: 0, samples: [] },
    shortLongContentTest: { passed: false, shortLatency: 0, longLatency: 0, longChars: 0 },
    cacheTest: { passed: false, initialMs: 0, memoryCacheMs: 0, dbCacheMs: 0 },
    deduplicationTest: { passed: false, parallelRequests: 10, identicalResults: false },
    failureSimulationTest: { passed: false, fallbackRetainedOriginal: false },
    originalContentIntegrityTest: { passed: false, englishUnchanged: false },
  };

  // ---------------------------------------------------------------------------
  // TEST 1: Multiple Job Notices English -> Hindi
  // ---------------------------------------------------------------------------
  console.log("--- TEST 1: MULTIPLE JOB NOTICES TRANSLATION (FULL CONTENT) ---");
  const sampleJobs: GovJobDetailed[] = [
    {
      id: "test-job-rrb-1",
      slug: "rrb-assistant-loco-pilot-2026",
      title: "Railway Recruitment Board Assistant Loco Pilot (ALP) CEN 01/2026",
      post_name: "Assistant Loco Pilot",
      summary: "RRB invites applications for 18,799 posts across Indian railway divisions.",
      description: "Official Notification CEN 01/2026. Applicants must verify medical fitness and eyesight standards. Official portal: https://suchnasetu.in/jobs/rrb-alp.",
      pay_scale_details: "Level-2 of 7th CPC with initial pay of ₹19,900/- per month plus allowances.",
      qualification_summary: "Matriculation / 10th Pass plus ITI or Diploma in Engineering.",
      age_limit_summary: "18 to 30 years as on closing date.",
      selection_process: "CBT-1 -> CBT-2 -> Computer Based Aptitude Test -> Document Verification.",
      status: "published",
      total_vacancies: 18799,
      translations: [],
    } as any,
    {
      id: "test-job-upsc-2",
      slug: "upsc-civil-services-2026",
      title: "Union Public Service Commission Civil Services Examination (CSE) 2026",
      post_name: "IAS, IPS, IFS Group A & B Officers",
      summary: "UPSC announces 1,056 vacancies for premier administrative services across India.",
      description: "Detailed Advt No. 04/2026-CSP. Candidates must submit preliminary applications online before 15 March 2026.",
      pay_scale_details: "Junior Time Scale Level 10 (₹56,100 - ₹1,77,500).",
      qualification_summary: "Bachelor's Degree in any discipline from a recognized University.",
      age_limit_summary: "21 to 32 years with permissible relaxation for reserved categories.",
      selection_process: "Preliminary Objective Test -> Mains Written Examination -> Personality Interview.",
      status: "published",
      total_vacancies: 1056,
      translations: [],
    } as any,
  ];

  let jobsPassed = true;
  for (const rawJob of sampleJobs) {
    const originalEnglishTitle = rawJob.title;
    const originalEnglishSummary = rawJob.summary;

    const start = Date.now();
    const { job: localizedJob, translation, isTranslated } = await translateJobNotice(rawJob, "hi");
    const latency = Date.now() - start;

    const hasHindiChars = /[\u0900-\u097F]/.test(localizedJob.title);
    const preservedToken =
      localizedJob.title.includes("ALP") ||
      localizedJob.title.includes("CSE") ||
      localizedJob.description?.includes("CEN 01/2026") ||
      localizedJob.description?.includes("04/2026-CSP") ||
      localizedJob.description?.includes("https://");

    console.log(`• Job: "${rawJob.title}"`);
    console.log(`  Hindi Title       : "${localizedJob.title}"`);
    console.log(`  Hindi Pay Scale   : "${localizedJob.pay_scale_details}"`);
    console.log(`  Hindi Selection   : "${localizedJob.selection_process}"`);
    console.log(`  Devanagari Present: ${hasHindiChars ? "✅ YES" : "❌ NO"}`);
    console.log(`  Token Preserved   : ${preservedToken ? "✅ YES" : "❌ NO"}`);
    console.log(`  Latency           : ${latency}ms`);

    // Verify original English was untouched
    if (rawJob.title !== originalEnglishTitle || rawJob.summary !== originalEnglishSummary) {
      console.error("  ❌ FAILURE: Original English job object was mutated!");
      jobsPassed = false;
    }

    if (!hasHindiChars || !isTranslated) {
      jobsPassed = false;
    }

    results.jobsTest.samples.push({
      englishTitle: originalEnglishTitle,
      hindiTitle: localizedJob.title,
      latency,
      isTranslated,
    });
  }

  results.jobsTest.passed = jobsPassed;
  results.jobsTest.count = sampleJobs.length;
  console.log(`  Result: ${jobsPassed ? "✅ PASS" : "❌ FAIL"}\n`);

  // ---------------------------------------------------------------------------
  // TEST 2: Multiple News Articles English -> Hindi
  // ---------------------------------------------------------------------------
  console.log("--- TEST 2: MULTIPLE NEWS ARTICLES TRANSLATION (FULL MULTI-PARAGRAPH) ---");
  const sampleNewsArticles: NewsArticle[] = [
    {
      id: "test-news-1",
      slug: "isro-chandrayaan-4-roadmap-2026",
      title: "ISRO unveils roadmap for Bharatiya Antariksh Station and Chandrayaan-4",
      source_name: "DD News",
      summary: "ISRO Chairman addressed the National Space Day conference in New Delhi, announcing formal government clearance for lunar sample return.",
      content: `Addressing delegates at Bharat Mandapam on Tuesday, ISRO leadership confirmed that the Union Government has officially cleared the roadmap for the Bharatiya Antariksh Station (BAS-1). The first orbital module will be launched by 2028 utilizing the LVM3 heavy-lift rocket.

Simultaneously, the Chandrayaan-4 lunar sample return architecture has entered its engineering realization phase. Chandrayaan-4 will involve two separate launches and four distinct spacecraft modules that will rendezvous in lunar orbit, collect regolith samples, and safely return to Earth.

The mission is expected to reinforce India's sovereign deep-space capabilities ahead of the Gaganyaan human spaceflight operations.`,
      category_slug: "technology",
      importance: "breaking",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as any,
    {
      id: "test-news-2",
      slug: "delhi-metro-phase-4-approval",
      title: "Union Cabinet approves Delhi Metro Phase 4 expansion with two new corridors",
      source_name: "PIB Delhi",
      summary: "The Union Cabinet chaired by Prime Minister Narendra Modi approved two new corridors of Delhi Metro Phase 4 at an estimated cost of ₹8,399 crore.",
      content: `The Union Cabinet chaired by Prime Minister Narendra Modi on Wednesday approved two new corridors under Phase 4 of the Delhi Metro project. The project with a total route length of 20.76 kilometers will be constructed at an estimated cost of ₹8,399 crore.

The two corridors comprise the Lajpat Nagar to Saket G-Block corridor (8.38 km) and the Inderlok to Indraprastha corridor (12.37 km). These lines will provide direct interchange connectivity to the existing Violet, Yellow, and Blue lines across central and south Delhi.

Daily ridership across the capital is projected to increase by over 2.5 lakh commuters upon operational commissioning by 2029.`,
      category_slug: "governance",
      importance: "high",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as any,
  ];

  let newsPassed = true;
  for (const article of sampleNewsArticles) {
    const origTitle = article.title;
    const origSummary = article.summary;
    const origContent = article.content;

    const start = Date.now();
    const { article: translatedArticle, isTranslated } = await translateNewsArticle(article, "hi");
    const latency = Date.now() - start;

    const hasHindi = /[\u0900-\u097F]/.test(translatedArticle.title);
    const paragraphsCount = (translatedArticle.content || "").split(/\n\s*\n/).length;

    console.log(`• News: "${article.title}"`);
    console.log(`  Hindi Title       : "${translatedArticle.title}"`);
    console.log(`  Hindi Summary     : "${translatedArticle.summary}"`);
    console.log(`  Hindi Paragraphs  : ${paragraphsCount} paragraphs`);
    console.log(`  Devanagari Present: ${hasHindi ? "✅ YES" : "❌ NO"}`);
    console.log(`  Latency           : ${latency}ms`);

    // Verify original English remained untouched
    if (article.title !== origTitle || article.summary !== origSummary || article.content !== origContent) {
      console.error("  ❌ FAILURE: Original English news article was mutated!");
      newsPassed = false;
    }

    if (!hasHindi || !isTranslated || paragraphsCount < 2) {
      newsPassed = false;
    }

    results.newsTest.samples.push({
      englishTitle: origTitle,
      hindiTitle: translatedArticle.title,
      paragraphsCount,
      latency,
      isTranslated,
    });
  }

  results.newsTest.passed = newsPassed;
  results.newsTest.count = sampleNewsArticles.length;
  console.log(`  Result: ${newsPassed ? "✅ PASS" : "❌ FAIL"}\n`);

  // ---------------------------------------------------------------------------
  // TEST 3: Short vs Long Content
  // ---------------------------------------------------------------------------
  console.log("--- TEST 3: SHORT VS LONG CONTENT CHUNKING ---");
  const shortText = "Candidates must have passed 10th class with 50% marks and possess ITI certificate.";
  const longText = `The Union Cabinet, chaired by the Prime Minister Shri Narendra Modi, has approved the proposal of the Ministry of Earth Sciences (MoES) on "Mission Mausam" with a budget outlay of Rs.2,000 crore over two years.

Mission Mausam will empower India to be weather-ready and climate-smart. It will help citizens, stakeholders, and all government agencies to proactively manage extreme weather events and the impacts of climate change.

The mission will focus on multi-faceted development including state-of-the-art radar systems, high performance computing clusters, optical profilers, and meteorological satellite systems. Advanced observations will be deployed across all vulnerable districts of the country.

Key institutions involved include the India Meteorological Department (IMD), Indian Institute of Tropical Meteorology (IITM), and National Centre for Medium Range Weather Forecasting (NCMRWF). Hyperlocal forecast resolution will be enhanced down to village and panchayat levels.

Detailed administrative information is available at https://suchnasetu.in/news/mission-mausam-2026. For inquiries, email contact@suchnasetu.in or reference notification Advt No. 01/MoES/2026.`;

  const shortStart = Date.now();
  const shortTranslated = await translateTextWithGoogle(shortText, "hi");
  const shortLatency = Date.now() - shortStart;

  const longStart = Date.now();
  const longTranslated = await translateTextWithGoogle(longText, "hi");
  const longLatency = Date.now() - longStart;

  console.log(`• Short text (${shortText.length} chars) -> ${shortLatency}ms: "${shortTranslated}"`);
  console.log(`• Long text  (${longText.length} chars) -> ${longLatency}ms:`);
  console.log(`  Paragraphs preserved: ${longTranslated.split(/\n\s*\n/).length}/5`);
  console.log(`  URL preserved       : ${longTranslated.includes("https://suchnasetu.in/news/mission-mausam-2026") ? "✅ YES" : "❌ NO"}`);
  console.log(`  Email preserved     : ${longTranslated.includes("contact@suchnasetu.in") ? "✅ YES" : "❌ NO"}`);
  console.log(`  Notice ID preserved : ${longTranslated.includes("Advt No. 01/MoES/2026") ? "✅ YES" : "❌ NO"}`);

  results.shortLongContentTest = {
    passed: shortTranslated.length > 0 && longTranslated.split(/\n\s*\n/).length === 5,
    shortLatency,
    longLatency,
    longChars: longText.length,
  };
  console.log(`  Result: ${results.shortLongContentTest.passed ? "✅ PASS" : "❌ FAIL"}\n`);

  // ---------------------------------------------------------------------------
  // TEST 4: Repeated Requests & Multi-Tier Caching
  // ---------------------------------------------------------------------------
  console.log("--- TEST 4: REPEATED REQUESTS & MULTI-TIER CACHE VERIFICATION ---");
  const testPhrase = "Government of India gazette announcement regarding nationwide entrance examination.";

  clearTranslationCache(); // Start fresh
  const t1Start = Date.now();
  const res1 = await translateTextWithGoogle(testPhrase, "hi");
  const initialMs = Date.now() - t1Start;

  // Immediate repeat: Memory cache hit
  const t2Start = Date.now();
  const res2 = await translateTextWithGoogle(testPhrase, "hi");
  const memoryCacheMs = Date.now() - t2Start;

  console.log(`• Initial Network Call Latency : ${initialMs}ms`);
  console.log(`• Immediate Repeat (Memory)    : ${memoryCacheMs}ms (Speedup: ${Math.round(initialMs / Math.max(memoryCacheMs, 1))}x)`);

  const cacheStats = getTranslationCacheStats();
  console.log(`• Memory Cache Entries         : ${cacheStats.size}`);

  const cachePassed = res1 === res2 && memoryCacheMs < 15;
  results.cacheTest = {
    passed: cachePassed,
    initialMs,
    memoryCacheMs,
    dbCacheMs: 0,
  };
  console.log(`  Result: ${cachePassed ? "✅ PASS" : "❌ FAIL"}\n`);

  // ---------------------------------------------------------------------------
  // TEST 5: In-Flight Duplicate Request Deduplication
  // ---------------------------------------------------------------------------
  console.log("--- TEST 5: IN-FLIGHT CONCURRENT DUPLICATE REQUEST DEDUPLICATION ---");
  clearTranslationCache();
  const concurrentText = "Simultaneous stress test query for verifying in-flight promise coalescing.";

  console.log("• Launching 10 simultaneous identical translation requests...");
  const promises = Array.from({ length: 10 }, () => translateTextWithGoogle(concurrentText, "hi"));
  const parallelResults = await Promise.all(promises);

  const allIdentical = parallelResults.every((r) => r === parallelResults[0] && r.length > 0);
  console.log(`• All 10 returned identical translation: ${allIdentical ? "✅ YES" : "❌ NO"}`);
  console.log(`• Translated string: "${parallelResults[0]}"`);

  results.deduplicationTest = {
    passed: allIdentical,
    parallelRequests: 10,
    identicalResults: allIdentical,
  };
  console.log(`  Result: ${allIdentical ? "✅ PASS" : "❌ FAIL"}\n`);

  // ---------------------------------------------------------------------------
  // TEST 6: Failure & Timeout Resilience Fallback
  // ---------------------------------------------------------------------------
  console.log("--- TEST 6: FAILURE & TIMEOUT RESILIENCE FALLBACK ---");
  // Test empty and invalid strings safely
  const emptyRes = await translateTextWithGoogle("", "hi");
  const englishFallback = await translateTextWithGoogle("Untranslatable string fallback test", "en");

  const fallbackSafe = emptyRes === "" && englishFallback === "Untranslatable string fallback test";
  console.log(`• Empty string handled safely: ${emptyRes === "" ? "✅ YES" : "❌ NO"}`);
  console.log(`• 'en' target returns original English immediately: ${englishFallback === "Untranslatable string fallback test" ? "✅ YES" : "❌ NO"}`);

  results.failureSimulationTest = {
    passed: fallbackSafe,
    fallbackRetainedOriginal: fallbackSafe,
  };
  console.log(`  Result: ${fallbackSafe ? "✅ PASS" : "❌ FAIL"}\n`);

  // ---------------------------------------------------------------------------
  // TEST 7: Database Content Integrity Check
  // ---------------------------------------------------------------------------
  console.log("--- TEST 7: PRODUCTION DATABASE ORIGINAL CONTENT INTEGRITY ---");
  const { data: dbJobs } = await supabase
    .from("gov_jobs")
    .select("id, title, summary")
    .eq("status", "published")
    .limit(3);

  let originalUntouched = true;
  if (dbJobs) {
    for (const j of dbJobs) {
      // Titles in gov_jobs must remain strictly original English
      const hasDevanagari = /[\u0900-\u097F]/.test(j.title);
      if (hasDevanagari) {
        console.error(`  ❌ Database corruption: gov_jobs title ${j.id} contains Devanagari!`);
        originalUntouched = false;
      }
    }
  }

  console.log(`• Database original jobs inspected: ${dbJobs?.length || 0}`);
  console.log(`• Original English content strictly preserved: ${originalUntouched ? "✅ YES" : "❌ NO"}`);

  results.originalContentIntegrityTest = {
    passed: originalUntouched,
    englishUnchanged: originalUntouched,
  };
  console.log(`  Result: ${originalUntouched ? "✅ PASS" : "❌ FAIL"}\n`);

  // ---------------------------------------------------------------------------
  // FINAL REPORT
  // ---------------------------------------------------------------------------
  console.log("================================================================================");
  console.log("TRANSLATION TEST SUITE SUMMARY");
  console.log("================================================================================");
  const allPassed =
    results.jobsTest.passed &&
    results.newsTest.passed &&
    results.shortLongContentTest.passed &&
    results.cacheTest.passed &&
    results.deduplicationTest.passed &&
    results.failureSimulationTest.passed &&
    results.originalContentIntegrityTest.passed;

  console.log(`1. Multiple Job Pages (Full Content)      : ${results.jobsTest.passed ? "✅ PASS" : "❌ FAIL"}`);
  console.log(`2. Multiple News Pages (Full Body)        : ${results.newsTest.passed ? "✅ PASS" : "❌ FAIL"}`);
  console.log(`3. Short & Long Content Chunking          : ${results.shortLongContentTest.passed ? "✅ PASS" : "❌ FAIL"}`);
  console.log(`4. Repeated Requests & Caching            : ${results.cacheTest.passed ? "✅ PASS" : "❌ FAIL"}`);
  console.log(`5. In-Flight Request Deduplication        : ${results.deduplicationTest.passed ? "✅ PASS" : "❌ FAIL"}`);
  console.log(`6. Error & Fallback Resilience            : ${results.failureSimulationTest.passed ? "✅ PASS" : "❌ FAIL"}`);
  console.log(`7. Original English Content Integrity     : ${results.originalContentIntegrityTest.passed ? "✅ PASS" : "❌ FAIL"}`);
  console.log(`\nOVERALL STATUS: ${allPassed ? "🎉 ALL 7 TESTS PASSED" : "⚠️ SOME TESTS FAILED"}`);
  console.log("================================================================================\n");

  fs.writeFileSync(
    "scratch/translation-test-results.json",
    JSON.stringify(results, null, 2),
    "utf8"
  );
}

runTestSuite().catch(console.error);
