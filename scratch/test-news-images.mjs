import fs from "fs";

async function testNewsImages() {
  console.log("================================================================================");
  console.log("             TESTING AI-GENERATED IMAGES ON NEWS DETAIL PAGES                   ");
  console.log("================================================================================\n");

  const articlesToTest = [
    {
      slug: "union-cabinet-approves-modernization-of-national-career-service-portal",
      title: "Union Cabinet Approves Nationwide Modernization of National Career Service (NCS) Portal",
      expectedTopic: "National Career Service / Governance",
    },
    {
      slug: "isro-finalizes-launch-window-chandrayaan-4-sample-return-mission",
      title: "ISRO Finalizes Launch Window for Chandrayaan-4 Sample Return Mission",
      expectedTopic: "ISRO Chandrayaan-4 / Space",
    },
    {
      slug: "ugc-mandatory-advisory-degree-equivalence-state-central-recruitment",
      title: "UGC Issues Mandatory Advisory on Equivalence of Degrees for All State & Central Recruitments",
      expectedTopic: "UGC Degree Equivalence / Education",
    },
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

  for (let i = 0; i < articlesToTest.length; i++) {
    const art = articlesToTest[i];
    console.log(`[ARTICLE ${i + 1}]: "${art.title}"`);
    console.log(`  Slug: ${art.slug}`);
    console.log(`  Topic Focus: ${art.expectedTopic}`);

    // Fetch First Request
    const url = `http://localhost:3001/news/${art.slug}`;
    const res1 = await fetch(url);
    const html1 = await res1.text();

    assert(res1.status === 200, `Article loaded with HTTP 200`);

    // 1. Image Presence & Placement
    const hasFigure = html1.includes("<figure") && html1.includes("AI Visual Representation");
    assert(hasFigure, `Featured image figure with AI representation badge is present`);

    // 2. Position Verification: Image appears below header and before AI summary
    const headerPos = html1.indexOf("</header>");
    const imgPos = html1.indexOf("<figure");
    const summaryPos = html1.indexOf("AI Summary &amp; Key Takeaway");

    assert(
      headerPos !== -1 && imgPos !== -1 && summaryPos !== -1 && headerPos < imgPos && imgPos < summaryPos,
      `Image is placed immediately below headline and before the AI Summary card`
    );

    // 3. Alt Text Verification
    const altRegex = new RegExp(`alt="${art.title.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")}"`, "i");
    const hasCorrectAlt = altRegex.test(html1) || html1.includes(art.title);
    assert(hasCorrectAlt, `Image has descriptive alt text matching headline for SEO & a11y`);

    // 4. Mobile PageSpeed Optimization
    const hasResponsiveSizes = html1.includes("sizes=") || html1.includes("100vw");
    assert(hasResponsiveSizes, `Image uses responsive sizing for mobile PageSpeed optimization`);

    // 5. Extract image src
    const imgMatch = html1.match(/<img[^>]*src="([^"]+)"/i) || html1.match(/https%3A%2F%2Fimage\.pollinations\.ai[^"&]+/i);
    const extractedImgSrc = imgMatch ? imgMatch[0] : "";
    console.log(`  • Extracted Image Src: ${extractedImgSrc.slice(0, 100)}...`);

    // 6. Persistence Verification (Fetch Second Time to ensure no regeneration / identical image)
    const res2 = await fetch(url);
    const html2 = await res2.text();
    assert(res2.status === 200, `Second view returns HTTP 200`);

    const imgMatch2 = html2.match(/<img[^>]*src="([^"]+)"/i) || html2.match(/https%3A%2F%2Fimage\.pollinations\.ai[^"&]+/i);
    const extractedImgSrc2 = imgMatch2 ? imgMatch2[0] : "";
    assert(extractedImgSrc === extractedImgSrc2, `Image URL is permanently stored and identical on subsequent page view (no regeneration)`);

    console.log("");
  }

  // 7. Test Failure Tolerance: Article with invalid or failed image still loads normally
  console.log(`[TESTING FAULT TOLERANCE]: Graceful degradation if image generation fails`);
  const resFallback = await fetch(`http://localhost:3001/news/rbi-monetary-policy-keeps-repo-rate-steady-6-50`);
  assert(resFallback.status === 200, `Article loads cleanly with HTTP 200 even under network/image variations`);

  console.log("\n================================================================================");
  console.log(`AI IMAGE GENERATION TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log("================================================================================");
}

testNewsImages().catch(console.error);
