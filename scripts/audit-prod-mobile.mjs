import { execSync } from "child_process";
import fs from "fs";

const pages = [
  { name: "Homepage", url: "https://suchnasetu.in/" },
  { name: "Jobs Listing", url: "https://suchnasetu.in/jobs" },
  { name: "Exams Listing", url: "https://suchnasetu.in/exams" },
  { name: "Job Detail", url: "https://suchnasetu.in/jobs/rrb-recruitment-of-assistant-loco-pilot-alp-across-railway-zones-cen-012026-alp" },
  { name: "Exam Detail", url: "https://suchnasetu.in/exams/uppsc-miscellaneous-examination-uppsc-2" },
];

console.log("================================================================");
console.log("PRODUCTION MOBILE LIGHTHOUSE AUDIT (PageSpeed Throttling)");
console.log("================================================================\n");

const results = [];

for (const p of pages) {
  console.log(`Auditing: ${p.name} (${p.url})...`);
  const file = `/tmp/lh-mobile-${Date.now()}.json`;
  execSync(
    `npx lighthouse "${p.url}" --output=json --output-path="${file}" --chrome-flags="--headless --no-sandbox --disable-gpu" --only-categories=performance --quiet`
  );
  const lhr = JSON.parse(fs.readFileSync(file, "utf-8"));
  fs.unlinkSync(file);

  const score = Math.round((lhr.categories.performance?.score || 0) * 100);
  const lcp = Math.round(lhr.audits["largest-contentful-paint"]?.numericValue || 0);
  const fcp = Math.round(lhr.audits["first-contentful-paint"]?.numericValue || 0);
  const tbt = Math.round(lhr.audits["total-blocking-time"]?.numericValue || 0);
  const cls = parseFloat((lhr.audits["cumulative-layout-shift"]?.numericValue || 0).toFixed(3));
  const speedIndex = Math.round(lhr.audits["speed-index"]?.numericValue || 0);
  const ttfb = Math.round(lhr.audits["server-response-time"]?.numericValue || 0);

  const resourceItems = lhr.audits["resource-summary"]?.details?.items || [];
  let totalJsBytes = 0;
  let totalRequests = 0;
  resourceItems.forEach((item) => {
    if (item.resourceType === "script") totalJsBytes = item.transferSize || item.size || 0;
    if (item.resourceType === "total") totalRequests = item.requestCount || 0;
  });

  results.push({
    Page: p.name,
    Score: `${score}/100`,
    "LCP (s)": (lcp / 1000).toFixed(2) + "s",
    "FCP (s)": (fcp / 1000).toFixed(2) + "s",
    "TBT (ms)": `${tbt}ms`,
    CLS: cls,
    "Speed Index (s)": (speedIndex / 1000).toFixed(2) + "s",
    "TTFB (ms)": `${ttfb}ms`,
    "JS (KB)": `${Math.round(totalJsBytes / 1024)} KB`,
    Requests: totalRequests,
  });
}

console.table(results);
