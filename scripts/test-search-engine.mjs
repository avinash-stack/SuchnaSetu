import { parseSearchQuery } from "../src/modules/search/query-parser.ts";

console.log("=== SEARCH QUERY PARSER TEST SUITE ===\n");

const testQueries = [
  "Bihar Govt Job",
  "Banking jobs",
  "SSC recruitment",
  "Teacher vacancy",
  "Railway recruitment",
  "UPSC exam",
  "Latest government news",
  "Civil eng",
  "Patna High Court",
  "UP Police Constable",
  "BPSC Block Agriculture Officer",
  "Admit card 2026",
  "",
];

let allPassed = true;

for (const query of testQueries) {
  const parsed = parseSearchQuery(query);
  console.log(`Query: "${query}"`);
  console.log(`  -> Clean Query: "${parsed.cleanQuery}"`);
  console.log(`  -> Tokens: [${parsed.tokens.join(", ")}]`);
  console.log(`  -> Content Tokens: [${parsed.contentTokens.join(", ")}]`);
  console.log(`  -> State Codes: [${parsed.matchedStateCodes.join(", ")}]`);
  console.log(`  -> Org Keywords: [${parsed.matchedOrgKeywords.join(", ")}]`);
  console.log(`  -> Category Slugs: [${parsed.matchedCategorySlugs.join(", ")}]`);
  console.log(`  -> Intent: Job=${parsed.isJobIntent}, Exam=${parsed.isExamIntent}, News=${parsed.isNewsIntent}\n`);
}

// Assertions on the core test cases required by the user
const testCases = [
  {
    query: "Bihar Govt Job",
    verify: (p) => p.matchedStateCodes.includes("BR") && p.isJobIntent,
    desc: "Resolves 'Bihar' to State Code 'BR' and identifies Job Intent",
  },
  {
    query: "Banking jobs",
    verify: (p) => p.matchedCategorySlugs.includes("banking-finance") && p.isJobIntent,
    desc: "Resolves 'Banking' to Category 'banking-finance' and identifies Job Intent",
  },
  {
    query: "SSC recruitment",
    verify: (p) => p.matchedOrgKeywords.includes("ssc") && p.isJobIntent,
    desc: "Resolves 'SSC' to Organization and identifies Job Intent",
  },
  {
    query: "Teacher vacancy",
    verify: (p) => p.matchedCategorySlugs.includes("teaching-research") && p.isJobIntent,
    desc: "Resolves 'Teacher' to Category 'teaching-research' and identifies Job Intent",
  },
  {
    query: "Railway recruitment",
    verify: (p) => p.matchedCategorySlugs.includes("railways") && p.isJobIntent,
    desc: "Resolves 'Railway' to Category 'railways' and identifies Job Intent",
  },
  {
    query: "UPSC exam",
    verify: (p) => p.matchedOrgKeywords.includes("upsc") && p.isExamIntent,
    desc: "Resolves 'UPSC' to Organization and identifies Exam Intent",
  },
  {
    query: "Latest government news",
    verify: (p) => p.isNewsIntent,
    desc: "Identifies News Intent for 'Latest government news'",
  },
];

console.log("=== RUNNING SPECIFIC ASSERTIONS ===");
for (const tc of testCases) {
  const parsed = parseSearchQuery(tc.query);
  const pass = tc.verify(parsed);
  if (pass) {
    console.log(`✅ PASS: "${tc.query}" - ${tc.desc}`);
  } else {
    console.error(`❌ FAIL: "${tc.query}" - ${tc.desc}`);
    allPassed = false;
  }
}

if (!allPassed) {
  process.exit(1);
} else {
  console.log("\n🎉 All Search Query Parser test assertions passed successfully!");
}
