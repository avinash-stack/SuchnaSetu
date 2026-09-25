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

interface TestResult {
  suite: string;
  name: string;
  status: "PASS" | "FAIL";
  details?: string;
}

const results: TestResult[] = [];

function record(suite: string, name: string, pass: boolean, details?: string) {
  results.push({
    suite,
    name,
    status: pass ? "PASS" : "FAIL",
    details,
  });
  console.log(`  ${pass ? "✅ PASS" : "❌ FAIL"}: [${suite}] ${name}${details ? ` -> ${details}` : ""}`);
}

async function runQa() {
  console.log("=================================================================");
  console.log("🧪 SUCHNASETU COMPREHENSIVE PRODUCTION QA TEST SUITE");
  console.log(`⏰ Executed At: ${new Date().toISOString()}`);
  console.log("=================================================================\n");

  // SUITE 1: Live Production HTTP Endpoints Reachability
  console.log("--- SUITE 1: Live Public Endpoint Health ---");
  const endpoints = [
    { path: "/", expectedStatus: 200 },
    { path: "/jobs", expectedStatus: 200 },
    { path: "/exams", expectedStatus: 200 },
    { path: "/news", expectedStatus: 200 },
    { path: "/admit-cards", expectedStatus: 200 },
    { path: "/results", expectedStatus: 200 },
    { path: "/syllabus", expectedStatus: 200 },
    { path: "/answer-keys", expectedStatus: 200 },
    { path: "/todays-updates", expectedStatus: 200 },
    { path: "/coming-soon", expectedStatus: 200 },
    { path: "/directory", expectedStatus: 200 },
    { path: "/sitemap.xml", expectedStatus: 200 },
    { path: "/robots.txt", expectedStatus: 200 },
  ];

  for (const ep of endpoints) {
    const url = `https://suchnasetu.in${ep.path}`;
    try {
      const res = await fetch(url, {
        method: "HEAD",
        headers: { "User-Agent": "SuchnaSetu-QA-Tester/1.0" },
      });
      record("Endpoint Health", ep.path, res.status === ep.expectedStatus, `HTTP ${res.status}`);
    } catch (e: any) {
      record("Endpoint Health", ep.path, false, `Network error: ${e.message}`);
    }
  }

  // SUITE 2: Domain Canonical & Redirects
  console.log("\n--- SUITE 2: Domain Redirects & Canonical Enforcements ---");
  const redirectTests = [
    { url: "http://suchnasetu.in", expectedRedirect: "https://suchnasetu.in/" },
    { url: "https://www.suchnasetu.in", expectedRedirect: "https://suchnasetu.in/" },
    { url: "http://www.suchnasetu.in", expectedRedirect: "https://www.suchnasetu.in/" }, // bounces to https://www then https://
  ];

  for (const rt of redirectTests) {
    try {
      const res = await fetch(rt.url, {
        redirect: "manual",
        headers: { "User-Agent": "SuchnaSetu-QA-Tester/1.0" },
      });
      const location = res.headers.get("location");
      const isRedirect = res.status === 301 || res.status === 307 || res.status === 308;
      const matchesTarget = location ? location.startsWith(rt.expectedRedirect) : false;
      record("Domain Redirect", rt.url, isRedirect && matchesTarget, `HTTP ${res.status} Location: ${location}`);
    } catch (e: any) {
      record("Domain Redirect", rt.url, false, `Error: ${e.message}`);
    }
  }

  // SUITE 3: SEO Meta, Title & Header Integrity on Live HTML
  console.log("\n--- SUITE 3: SEO Tags & Header Validation on Live Pages ---");
  const pagesToCheck = [
    { name: "Homepage", url: "https://suchnasetu.in" },
    { name: "Jobs Hub", url: "https://suchnasetu.in/jobs" },
    { name: "News Hub", url: "https://suchnasetu.in/news" },
  ];

  for (const p of pagesToCheck) {
    try {
      const res = await fetch(p.url, {
        headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
      });
      const html = await res.text();
      
      // Check title tag
      const titleMatch = html.match(/<title>(.*?)<\/title>/i);
      const title = titleMatch ? titleMatch[1] : "";
      const singleTitleSuffix = !/(SuchnaSetu.*){2,}/i.test(title);
      record("SEO Metadata", `${p.name} - Single Title Brand`, singleTitleSuffix && title.length > 5, `Title: "${title.slice(0, 60)}..."`);

      // Check canonical tag
      const canonicalMatch = html.match(/<link rel="canonical" href="(.*?)"/i);
      const canonical = canonicalMatch ? canonicalMatch[1] : "";
      const validCanonical = canonical.startsWith("https://suchnasetu.in");
      record("SEO Metadata", `${p.name} - Canonical HTTPS`, validCanonical, `Canonical: ${canonical}`);

      // Check robots tag
      const robotsMatch = html.match(/<meta name="robots" content="(.*?)"/i);
      const robots = robotsMatch ? robotsMatch[1] : "";
      const isIndexable = robots.includes("index") && !robots.includes("noindex");
      record("SEO Metadata", `${p.name} - Indexable`, isIndexable, `Robots: "${robots}"`);
    } catch (e: any) {
      record("SEO Metadata", p.name, false, e.message);
    }
  }

  // SUITE 4: Live Sitemap Validation
  console.log("\n--- SUITE 4: Live Sitemap URL & Mock Filter Audit ---");
  try {
    const sitemapRes = await fetch("https://suchnasetu.in/sitemap.xml", {
      headers: { "User-Agent": "SuchnaSetu-QA-Tester/1.0" },
    });
    const sitemapXml = await sitemapRes.text();
    const locUrls = sitemapXml.match(/<loc>(.*?)<\/loc>/g)?.map(l => l.replace(/<\/?loc>/g, "")) || [];

    record("Sitemap Audit", "Sitemap Content Length > 1000", locUrls.length > 1000, `Total URLs: ${locUrls.length}`);
    
    // Test for mock URLs
    const actualMockUrls = locUrls.filter(u => u.includes("/mock-") || u.includes("mock-upsc"));
    record("Sitemap Audit", "Zero Mock Records in Sitemap", actualMockUrls.length === 0, `Mock URLs found: ${actualMockUrls.length}`);

    // Verify all URLs start with production canonical domain
    const nonProductionUrls = locUrls.filter(u => !u.startsWith("https://suchnasetu.in"));
    record("Sitemap Audit", "100% Production Domain URLs", nonProductionUrls.length === 0, `Non-production URLs: ${nonProductionUrls.length}`);
  } catch (e: any) {
    record("Sitemap Audit", "Fetch sitemap.xml", false, e.message);
  }

  // SUITE 5: Supabase Database Integrity
  console.log("\n--- SUITE 5: Database Health & Content Integrity ---");
  try {
    const { count: publishedJobs } = await supabase
      .from("gov_jobs")
      .select("*", { count: "exact", head: true })
      .eq("status", "published");

    const { count: publishedExams } = await supabase
      .from("gov_exams")
      .select("*", { count: "exact", head: true })
      .eq("status", "published");

    const { count: publishedNews } = await supabase
      .from("news_articles")
      .select("*", { count: "exact", head: true })
      .eq("is_published", true);

    const { data: activeMockInDb } = await supabase
      .from("gov_exams")
      .select("id")
      .ilike("slug", "mock-%")
      .eq("status", "published");

    record("Database Health", "Published Jobs Available", (publishedJobs || 0) > 10, `Published: ${publishedJobs}`);
    record("Database Health", "Published Exams Available", (publishedExams || 0) > 10, `Published: ${publishedExams}`);
    record("Database Health", "Published News Available", (publishedNews || 0) > 10, `Published: ${publishedNews}`);
    record("Database Health", "Zero Active Mock Records in DB", (activeMockInDb?.length || 0) === 0, `Active mock in DB: ${activeMockInDb?.length || 0}`);
  } catch (e: any) {
    record("Database Health", "DB Connection Check", false, e.message);
  }

  // SUITE 6: CLI Runner Binary & Workflow Configuration
  console.log("\n--- SUITE 6: Runner Binary & Workflow Checks ---");
  const tsxExists = fs.existsSync(path.resolve(process.cwd(), "node_modules/.bin/tsx"));
  record("Runner & Workflow", "tsx Local Binary Installed", tsxExists, tsxExists ? "node_modules/.bin/tsx exists" : "Missing");

  const dataSyncYml = fs.readFileSync(path.resolve(process.cwd(), ".github/workflows/data-sync.yml"), "utf8");
  const dataSyncHasY = dataSyncYml.includes("npx -y tsx");
  record("Runner & Workflow", "data-sync.yml has npx -y tsx", dataSyncHasY, "Prevents CI interactive prompt");

  const newsSyncYml = fs.readFileSync(path.resolve(process.cwd(), ".github/workflows/news-sync.yml"), "utf8");
  const newsSyncHasY = newsSyncYml.includes("npx -y tsx");
  record("Runner & Workflow", "news-sync.yml has npx -y tsx", newsSyncHasY, "Prevents CI interactive prompt");

  // Summary
  console.log("\n=================================================================");
  const total = results.length;
  const passed = results.filter(r => r.status === "PASS").length;
  const failed = total - passed;
  console.log(`📊 FINAL QA SUMMARY: ${passed}/${total} TESTS PASSED (${failed} failures)`);
  console.log(`✨ Status: ${failed === 0 ? "ALL SYSTEMS OPERATIONAL & HEALTHY ✅" : "ISSUES FOUND ❌"}`);
  console.log("=================================================================\n");

  if (failed > 0) {
    process.exit(1);
  }
}

runQa();
