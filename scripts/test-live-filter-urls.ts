import http from "http";

interface UrlTest {
  portal: "Jobs" | "Exams";
  url: string;
  expectedStatus: number;
  expectedBadgeMatch?: RegExp;
  checkContent?: (html: string) => { pass: boolean; reason: string };
}

const tests: UrlTest[] = [
  // Jobs Portal Tests
  {
    portal: "Jobs",
    url: "/jobs",
    expectedStatus: 200,
    checkContent: (html) => {
      const match = html.match(/(\d+)(?:<!-- -->)?\s*Active/);
      return {
        pass: !!match && parseInt(match[1], 10) > 1000,
        reason: match ? `Found badge: ${match[0]}` : "Active badge not found",
      };
    },
  },
  {
    portal: "Jobs",
    url: "/jobs?state=BR",
    expectedStatus: 200,
    checkContent: (html) => {
      const match = html.match(/(\d+)(?:<!-- -->)?\s*Active/);
      const isCorrect = !!match && parseInt(match[1], 10) === 71;
      return {
        pass: isCorrect,
        reason: match ? `Found badge: ${match[0]} (Expected: 71 Active)` : "No badge",
      };
    },
  },
  {
    portal: "Jobs",
    url: "/jobs?state=UP",
    expectedStatus: 200,
    checkContent: (html) => {
      const match = html.match(/(\d+)(?:<!-- -->)?\s*Active/);
      const isCorrect = !!match && parseInt(match[1], 10) === 657;
      return {
        pass: isCorrect,
        reason: match ? `Found badge: ${match[0]} (Expected: 657 Active)` : "No badge",
      };
    },
  },
  {
    portal: "Jobs",
    url: "/jobs?state=MP",
    expectedStatus: 200,
    checkContent: (html) => {
      const match = html.match(/(\d+)(?:<!-- -->)?\s*Active/);
      const isCorrect = !!match && parseInt(match[1], 10) === 3;
      return {
        pass: isCorrect,
        reason: match ? `Found badge: ${match[0]} (Expected: 3 Active)` : "No badge",
      };
    },
  },
  {
    portal: "Jobs",
    url: "/jobs?state=JH",
    expectedStatus: 200,
    checkContent: (html) => {
      const match = html.match(/(\d+)(?:<!-- -->)?\s*Active/);
      const isCorrect = !!match && parseInt(match[1], 10) === 2;
      return {
        pass: isCorrect,
        reason: match ? `Found badge: ${match[0]} (Expected: 2 Active)` : "No badge",
      };
    },
  },
  {
    portal: "Jobs",
    url: "/jobs?state=RJ",
    expectedStatus: 200,
    checkContent: (html) => {
      const match = html.match(/(\d+)(?:<!-- -->)?\s*Active/);
      const isCorrect = !!match && parseInt(match[1], 10) === 2;
      return {
        pass: isCorrect,
        reason: match ? `Found badge: ${match[0]} (Expected: 2 Active)` : "No badge",
      };
    },
  },
  {
    portal: "Jobs",
    url: "/jobs?organization=bpsc",
    expectedStatus: 200,
    checkContent: (html) => {
      const match = html.match(/(\d+)(?:<!-- -->)?\s*Active/);
      return {
        pass: !!match && parseInt(match[1], 10) > 0,
        reason: match ? `Found badge: ${match[0]}` : "No badge",
      };
    },
  },
  {
    portal: "Jobs",
    url: "/jobs?organization=invalid-org-slug",
    expectedStatus: 200,
    checkContent: (html) => {
      const match = html.match(/(\d+)(?:<!-- -->)?\s*Active/);
      const count = match ? parseInt(match[1], 10) : -1;
      // If count > 0 for non-existent org, it's a bug!
      const pass = count === 0;
      return {
        pass,
        reason: `Found badge: ${count} Active (Expected 0 for invalid org). ${count > 0 ? "BUG: Bypassed filter!" : "Correct"}`,
      };
    },
  },
  {
    portal: "Jobs",
    url: "/jobs?category=engineering-technical",
    expectedStatus: 200,
    checkContent: (html) => {
      const match = html.match(/(\d+)(?:<!-- -->)?\s*Active/);
      const count = match ? parseInt(match[1], 10) : 0;
      return {
        pass: count === 506,
        reason: `Found badge: ${count} Active (Expected 506 for engineering-technical)`,
      };
    },
  },
  {
    portal: "Jobs",
    url: "/jobs?category=invalid-category-slug",
    expectedStatus: 200,
    checkContent: (html) => {
      const match = html.match(/(\d+)(?:<!-- -->)?\s*Active/);
      const count = match ? parseInt(match[1], 10) : -1;
      const pass = count === 0;
      return {
        pass,
        reason: `Found badge: ${count} Active (Expected 0 for invalid category). ${count > 0 ? "BUG: Bypassed filter!" : "Correct"}`,
      };
    },
  },
  {
    portal: "Jobs",
    url: "/jobs?qualification=graduate-degree",
    expectedStatus: 200,
    checkContent: (html) => {
      // Remember: column gov_jobs.qualification_id does not exist!
      // Let's see what happens to the page!
      const match = html.match(/(\d+)(?:<!-- -->)?\s*Active/);
      const hasErrorText = html.includes("qualification_id") || html.includes("Error");
      return {
        pass: !hasErrorText && !!match,
        reason: hasErrorText ? "BUG: Page crashed or displayed error" : `Found badge: ${match?.[0]}`,
      };
    },
  },
  {
    portal: "Jobs",
    url: "/jobs?state=BR&category=state-govt",
    expectedStatus: 200,
    checkContent: (html) => {
      const match = html.match(/(\d+)(?:<!-- -->)?\s*Active/);
      const count = match ? parseInt(match[1], 10) : 0;
      return {
        pass: count > 0 && count < 71,
        reason: `Found badge: ${count} Active (Expected subset of Bihar jobs)`,
      };
    },
  },
  {
    portal: "Jobs",
    url: "/jobs?search=Constable&state=UP",
    expectedStatus: 200,
    checkContent: (html) => {
      const match = html.match(/(\d+)(?:<!-- -->)?\s*Active/);
      const count = match ? parseInt(match[1], 10) : 0;
      return {
        pass: count > 0,
        reason: `Found badge: ${count} Active for Constable in UP`,
      };
    },
  },
  {
    portal: "Jobs",
    url: "/jobs?search=recruitment&page=4",
    expectedStatus: 200,
    checkContent: (html) => {
      // In searchJobs, candidateLimit is 60. On page 4, are there job cards or empty state?
      const hasJobCard = html.includes("JobCard") || html.includes("border-slate-200 bg-white") || html.includes("Apply Online");
      const hasEmptyState = html.includes("No Openings Match Your Filters") || html.includes("No notifications found");
      return {
        pass: hasJobCard && !hasEmptyState,
        reason: hasEmptyState ? "BUG: Empty state on page 4 due to candidateLimit=60 cap!" : "Found job listings on page 4",
      };
    },
  },

  // Exams Portal Tests
  {
    portal: "Exams",
    url: "/exams",
    expectedStatus: 200,
    checkContent: (html) => {
      const match = html.match(/(\d+)(?:<!-- -->)?\s*Active/);
      return {
        pass: !!match && parseInt(match[1], 10) > 300,
        reason: match ? `Found badge: ${match[0]}` : "No badge",
      };
    },
  },
  {
    portal: "Exams",
    url: "/exams?state=BR",
    expectedStatus: 200,
    checkContent: (html) => {
      const match = html.match(/(\d+)(?:<!-- -->)?\s*Active/);
      const count = match ? parseInt(match[1], 10) : 0;
      return {
        pass: count === 43,
        reason: `Found badge: ${count} Active (Expected 43 for Bihar Exams)`,
      };
    },
  },
  {
    portal: "Exams",
    url: "/exams?organization=bpsc",
    expectedStatus: 200,
    checkContent: (html) => {
      const match = html.match(/(\d+)(?:<!-- -->)?\s*Active/);
      const count = match ? parseInt(match[1], 10) : 0;
      return {
        pass: count === 14,
        reason: `Found badge: ${count} Active (Expected 14 for BPSC Exams)`,
      };
    },
  },
  {
    portal: "Exams",
    url: "/exams?mode=offline_omr",
    expectedStatus: 200,
    checkContent: (html) => {
      const match = html.match(/(\d+)(?:<!-- -->)?\s*Active/);
      const count = match ? parseInt(match[1], 10) : 0;
      return {
        pass: count > 0,
        reason: `Found badge: ${count} Active for offline_omr mode`,
      };
    },
  },
  {
    portal: "Exams",
    url: "/exams?category=defence-security",
    expectedStatus: 200,
    checkContent: (html) => {
      const match = html.match(/(\d+)\s+Active/);
      const count = match ? parseInt(match[1], 10) : 0;
      return {
        pass: count === 72,
        reason: `Found badge: ${count} Active for defence-security (Expected 72)`,
      };
    },
  },
  {
    portal: "Exams",
    url: "/exams?organization=invalid-exam-org",
    expectedStatus: 200,
    checkContent: (html) => {
      const match = html.match(/(\d+)\s+Active/);
      const count = match ? parseInt(match[1], 10) : -1;
      const pass = count === 0;
      return {
        pass,
        reason: `Found badge: ${count} Active (Expected 0 for invalid org). ${count > 0 ? "BUG: Bypassed filter!" : "Correct"}`,
      };
    },
  },
];

function fetchPage(path: string): Promise<{ statusCode: number; html: string }> {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: "localhost",
        port: 3005,
        path,
        method: "GET",
        headers: {
          Host: "suchnasetu.in",
          "User-Agent": "SuchnaSetu-Audit-Agent",
        },
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => resolve({ statusCode: res.statusCode || 0, html: data }));
      }
    );
    req.on("error", reject);
    req.end();
  });
}

async function runLiveTests() {
  console.log("================================================================================");
  console.log("LIVE HTTP GET REQUEST FILTER AUDIT ON LOCAL SERVER (PORT 3005)");
  console.log("================================================================================\n");

  let passCount = 0;
  let failCount = 0;

  for (const t of tests) {
    try {
      const { statusCode, html } = await fetchPage(t.url);
      const statusMatch = statusCode === t.expectedStatus;
      const contentCheck = t.checkContent ? t.checkContent(html) : { pass: true, reason: "" };

      const passed = statusMatch && contentCheck.pass;
      if (passed) {
        passCount++;
        console.log(`✅ [PASS] [${t.portal}] ${t.url}`);
        console.log(`   HTTP: ${statusCode} | ${contentCheck.reason}\n`);
      } else {
        failCount++;
        console.log(`❌ [FAIL] [${t.portal}] ${t.url}`);
        console.log(`   HTTP: ${statusCode} (Expected: ${t.expectedStatus})`);
        console.log(`   Issue: ${contentCheck.reason}\n`);
      }
    } catch (err: any) {
      failCount++;
      console.log(`❌ [ERROR] [${t.portal}] ${t.url}`);
      console.log(`   Connection Error: ${err.message}\n`);
    }
  }

  console.log("================================================================================");
  console.log(`TOTAL LIVE TESTS: ${tests.length} | PASS: ${passCount} | FAIL: ${failCount}`);
  console.log("================================================================================");
}

runLiveTests().catch(console.error);
