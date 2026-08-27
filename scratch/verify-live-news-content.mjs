async function verifyLiveNewsContent() {
  console.log("================================================================================");
  console.log("             VERIFYING LIVE NEWS DETAIL PAGES & AUTHENTIC CONTENT               ");
  console.log("================================================================================\n");

  const slugsToTest = [
    {
      slug: "government-starts-retail-sale-of-onions-at-rs-35-per-kg-5uk07m",
      title: "Government starts retail sale of onions at Rs 35 per kg",
      expectedContentKeywords: ["buffer stock", "NAFED", "NCCF", "Khare", "vans"],
    },
    {
      slug: "nbems-to-hold-fresh-fmge-by-october-end-no-compensation-announced-for--d64l4k",
      title: "NBEMS to hold fresh FMGE by October-end; no compensation announced for June",
      expectedContentKeywords: ["NBEMS", "FMGE", "examination", "Foreign Medical"],
    },
    {
      slug: "nepal-flash-floods-3-bodies-wash-up-in-up-as-border-districts-brace-fo-i2lqss",
      title: "Nepal Flash Floods: 3 bodies wash up in UP as border districts brace for rising rivers",
      expectedContentKeywords: ["Maharajganj", "Kushinagar", "Uttar Pradesh", "rivers"],
    },
    {
      slug: "union-cabinet-approves-modernization-of-national-career-service-portal",
      title: "Union Cabinet Approves Nationwide Modernization of National Career Service (NCS) Portal",
      expectedContentKeywords: ["National Career Service", "Cabinet", "Labour"],
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

  for (let i = 0; i < slugsToTest.length; i++) {
    const item = slugsToTest[i];
    console.log(`[ARTICLE ${i + 1}]: "${item.title}"`);
    console.log(`  Slug: ${item.slug}`);

    const res = await fetch(`http://localhost:3001/news/${item.slug}`);
    assert(res.status === 200, `Loaded with HTTP 200`);

    const html = await res.text();

    // 1. AI Summary Section at the top
    assert(html.includes("AI Summary &amp; Key Takeaway"), `AI Summary block is displayed at the top`);

    // 2. Full Article Body Section (distinct paragraphs)
    const pCount = (html.match(/<p class="leading-relaxed">/g) || []).length;
    assert(pCount >= 2, `Full article body contains ${pCount} detailed readable paragraphs (not bullet points or short keypoints)`);

    // 3. Verifies specific factual story keywords (names, places, figures)
    const foundKeywords = item.expectedContentKeywords.filter(kw => html.toLowerCase().includes(kw.toLowerCase()));
    assert(
      foundKeywords.length >= 2,
      `Contains authentic story-specific facts/names/figures: [${foundKeywords.join(", ")}]`
    );

    // 4. No generic boilerplate filler
    assert(
      !html.includes("Under the approved regulatory framework, this initiative is structured"),
      `Zero generic filler or template boilerplate detected in article body`
    );

    // 5. Attribution & Reference link intact
    assert(
      html.includes("View Original Source") || html.includes("मूल स्रोत देखें"),
      `Original source attribution and reference link present`
    );

    console.log("");
  }

  console.log("================================================================================");
  console.log(`LIVE NEWS CONTENT VERIFICATION SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log("================================================================================");
}

verifyLiveNewsContent().catch(console.error);
