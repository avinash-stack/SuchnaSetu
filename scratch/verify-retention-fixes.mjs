import http from "http";

function get(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () =>
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data,
        })
      );
    }).on("error", reject);
  });
}

async function runTests() {
  console.log("=== STARTING SUCHNASETU RETENTION & NEWS/JOB VERIFICATION TESTS ===");
  let passed = 0;
  let failed = 0;

  const assert = (desc, condition) => {
    if (condition) {
      console.log(`✅ [PASS] ${desc}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${desc}`);
      failed++;
    }
  };

  // Test 1: Real Database News Article (Exact match)
  const realSlug = "no-rain-but-massive-deluge-what-really-triggered-nepals-sudden-destructive-flash-bf6e24";
  const res1 = await get(`http://localhost:3009/news/${realSlug}`);
  assert("Real DB News Article returns 200 OK", res1.statusCode === 200);
  assert("News Article contains AI Summary heading", res1.body.includes("AI त्वरित सारांश") || res1.body.includes("AI Synopsis"));
  assert("News Article contains Executive Key Highlights", res1.body.includes("Key Highlights") || res1.body.includes("मुख्य बिंदु"));
  assert("News Article contains In-Depth Report heading", res1.body.includes("Comprehensive News") || res1.body.includes("विस्तृत समाचार"));
  assert("News Article contains Actionable Takeaways", res1.body.includes("Actionable Steps") || res1.body.includes("महत्वपूर्ण निर्देश"));
  assert("News Article contains Contextual Connected Govt Jobs & Exams section", res1.body.includes("Connected Government Jobs") || res1.body.includes("संबंधित सरकारी नौकरियां"));
  assert("News Article contains secondary source attribution", res1.body.includes("Official Source Attribution:") || res1.body.includes("आधिकारिक स्रोत संदर्भ"));

  // Test 2: Stripped Hash Variation Match (URL indexed without hash suffix)
  const strippedSlug = "no-rain-but-massive-deluge-what-really-triggered-nepals-sudden-destructive-flash";
  const res2 = await get(`http://localhost:3009/news/${strippedSlug}`);
  assert("Stripped hash slug resolves or redirects (200/307/308)", res2.statusCode === 200 || (res2.statusCode >= 300 && res2.statusCode < 400));

  // Test 3: Uppercase Case-Insensitive Slug
  const upperSlug = realSlug.toUpperCase();
  const res3 = await get(`http://localhost:3009/news/${upperSlug}`);
  assert("Uppercase slug resolves or redirects (200/307/308)", res3.statusCode === 200 || (res3.statusCode >= 300 && res3.statusCode < 400));

  // Test 4: Cross-Module URL Handling (Accessing a job slug under /news/)
  const res4 = await get("http://localhost:3009/news/ssc-cgl-recruitment-2026");
  assert("Job slug under /news/ triggers redirect or handles gracefully", res4.statusCode === 200 || (res4.statusCode >= 300 && res4.statusCode < 400));

  // Test 5: Truly missing slug returns recovery view and noindex meta
  const res5 = await get("http://localhost:3009/news/this-slug-definitely-does-not-exist-at-all-12345");
  assert("Missing slug renders rich recovery view instead of blank 404", res5.body.includes("This Story Has Moved or Been Archived"));
  assert("Missing slug page contains noindex tag to prevent indexing 'Not Found'", res5.body.includes('content="noindex') || res5.body.includes('name="robots" content="noindex'));
  assert("Missing slug page offers direct navigation to jobs & news", res5.body.includes("/jobs") && res5.body.includes("/news"));

  // Test 6: Job detail page verification
  const res6 = await get("http://localhost:3009/jobs/rrb-recruitment-of-assistant-loco-pilot-alp-across-railway-zones-cen-012026-alp");
  assert("Job page returns 200 OK", res6.statusCode === 200);
  assert("Job page contains Standard Exam Pattern & Marking Scheme", res6.body.includes("Standard Examination Pattern"));
  assert("Job page contains Related Opportunities & Updates", res6.body.includes("Related Government Opportunities"));
  assert("Job page contains Related News for Recruitment", res6.body.includes("Latest News") && res6.body.includes("/news/"));

  // Test 7: Exam detail page verification
  const res7 = await get("http://localhost:3009/exams/mock-upsc-4990");
  assert("Exam page returns 200 OK", res7.statusCode === 200);
  assert("Exam page contains Related Examinations, Jobs & Updates", res7.body.includes("Related Examinations, Jobs"));
  assert("Exam page contains Related News for Exam", res7.body.includes("Latest News") && res7.body.includes("/news/"));

  // Test 8: Root Layout Analytics Route Tracker
  const res8 = await get("http://localhost:3009/");
  assert("Root layout loads GA script", res8.body.includes("gtag('config'") || res8.body.includes("googletagmanager.com/gtag/js"));

  console.log(`\n=== RESULTS: ${passed} PASSED, ${failed} FAILED ===`);
  process.exit(failed > 0 ? 1 : 0);
}

runTests().catch((err) => {
  console.error("Test error:", err);
  process.exit(1);
});
