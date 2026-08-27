async function testFooters() {
  console.log("================================================================================");
  console.log("             VERIFYING SEPARATED FOOTERS ACROSS JOBS AND NEWS                   ");
  console.log("================================================================================\n");

  const testRoutes = [
    {
      url: "http://localhost:3001/jobs",
      type: "jobs",
      label: "Jobs Portal Main Page (/jobs)",
    },
    {
      url: "http://localhost:3001/jobs/rrb-recruitment-of-assistant-loco-pilot-alp-across-railway-zones-cen-012026-alp",
      type: "jobs",
      label: "Individual Job Page (/jobs/[slug])",
    },
    {
      url: "http://localhost:3001/jobs/privacy-policy",
      type: "jobs",
      label: "Jobs Privacy Policy (/jobs/privacy-policy)",
    },
    {
      url: "http://localhost:3001/jobs/terms-and-conditions",
      type: "jobs",
      label: "Jobs Terms (/jobs/terms-and-conditions)",
    },
    {
      url: "http://localhost:3001/news",
      type: "news",
      label: "News Portal Main Page (/news)",
    },
    {
      url: "http://localhost:3001/news/union-cabinet-approves-modernization-of-national-career-service-portal",
      type: "news",
      label: "Individual News Page (/news/[slug])",
    },
    {
      url: "http://localhost:3001/news/privacy-policy",
      type: "news",
      label: "News Privacy Policy (/news/privacy-policy)",
    },
    {
      url: "http://localhost:3001/news/terms-and-conditions",
      type: "news",
      label: "News Terms (/news/terms-and-conditions)",
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

  for (const route of testRoutes) {
    console.log(`[TESTING ROUTE]: ${route.label}`);
    const res = await fetch(route.url);
    const html = await res.text();

    assert(res.status === 200, `Page returned HTTP 200`);

    const hasJobsPrivacy = html.includes("/jobs/privacy-policy") && html.includes("Jobs Privacy Policy");
    const hasJobsTerms = html.includes("/jobs/terms-and-conditions") && html.includes("Jobs Terms");
    const hasNewsPrivacy = html.includes("/news/privacy-policy") && html.includes("News Privacy Policy");
    const hasNewsTerms = html.includes("/news/terms-and-conditions") && html.includes("News Terms");

    if (route.type === "jobs") {
      assert(hasJobsPrivacy, "Shows 'Jobs Privacy Policy'");
      assert(hasJobsTerms, "Shows 'Jobs Terms & Conditions'");
      assert(!hasNewsPrivacy, "Does NOT show 'News Privacy Policy'");
      assert(!hasNewsTerms, "Does NOT show 'News Terms & Conditions'");
    } else if (route.type === "news") {
      assert(hasNewsPrivacy, "Shows 'News Privacy Policy'");
      assert(hasNewsTerms, "Shows 'News Terms & Conditions'");
      assert(!hasJobsPrivacy, "Does NOT show 'Jobs Privacy Policy'");
      assert(!hasJobsTerms, "Does NOT show 'Jobs Terms & Conditions'");
    }

    console.log("");
  }

  console.log("================================================================================");
  console.log(`FINAL FOOTER VERIFICATION: ${passed} PASSED, ${failed} FAILED`);
  console.log("================================================================================");
}

testFooters().catch(console.error);
