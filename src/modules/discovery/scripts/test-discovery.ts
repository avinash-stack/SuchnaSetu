import { DiscoveryService } from "../service";
import { OfficialDomainVerifier } from "../verifier/domain-verifier";

export async function runDiscoveryEvaluation() {
  console.log("================================================================================");
  console.log("            SUCHNASETU RECRUITMENT DISCOVERY LAYER EVALUATION                   ");
  console.log("================================================================================");

  // Test Case 1: Official Domain Verifier Test
  console.log("\n[TEST SUITE 1] Official Domain Verifier & Aggregator Rejection");
  const testUrls = [
    { url: "https://www.rfcl.co.in/careers.php", expectedOfficial: true, name: "RFCL Official" },
    { url: "https://recruitment.eil.co.in/hrd/advt2026.asp", expectedOfficial: true, name: "EIL Official" },
    { url: "https://www.calicut.nielit.in/nic2026/advt.pdf", expectedOfficial: true, name: "NIC / NIELIT Official" },
    { url: "https://www.aai.aero/en/careers/recruitment", expectedOfficial: true, name: "AAI Official" },
    { url: "https://indiapostgdsonline.gov.in", expectedOfficial: true, name: "India Post GDS Official" },
    { url: "https://incometaxindia.gov.in", expectedOfficial: true, name: "Income Tax Official" },
    { url: "https://sarkariresult.com/latestjob/rfcl-2026", expectedOfficial: false, name: "SarkariResult Aggregator" },
    { url: "https://freejobalert.com/eil-recruitment", expectedOfficial: false, name: "FreeJobAlert Aggregator" },
  ];

  for (const item of testUrls) {
    const res = OfficialDomainVerifier.verifyUrl(item.url);
    const pass = res.isOfficial === item.expectedOfficial;
    console.log(`  [${pass ? "PASS" : "FAIL"}] ${item.name}: isOfficial=${res.isOfficial} (Score: ${res.confidenceScore}, Domain: ${res.domain})`);
  }

  // Test Case 2: Discovery for the 7 Target Cases
  console.log("\n[TEST SUITE 2] Discovery Execution across 7 Target Cases");
  const discoveryService = new DiscoveryService();
  const report = await discoveryService.runDiscovery([
    "RFCL recruitment 2026",
    "Engineers India Limited EIL recruitment 2026",
    "NIC recruitment 2026",
    "AAI recruitment 2026",
    "India Post recruitment 2026",
    "Income Tax Department recruitment 2026",
    "Income Tax Pune sports quota recruitment 2026",
  ]);

  console.log(`  Discovery Run ID: ${report.runId}`);
  console.log(`  Duration: ${report.durationMs}ms`);
  console.log(`  Queries Executed: ${report.queriesExecuted}`);
  console.log(`  Candidates Found: ${report.candidatesFound}`);
  console.log(`  Official Sources Verified: ${report.officialSourcesVerified}`);
  console.log(`  Candidates Rejected: ${report.candidatesRejected}`);
  console.log(`  New Jobs Created: ${report.newJobsCreated}`);
  console.log(`  Existing Jobs Updated: ${report.existingJobsUpdated}`);

  console.log("\n  --- Individual Results for Target Test Cases ---");
  for (const res of report.results) {
    console.log(`  • Title: ${res.title}`);
    console.log(`    - Organization: ${res.organization}`);
    console.log(`    - Provider: ${res.provider}`);
    console.log(`    - Status: ${res.status}`);
    console.log(`    - Confidence Score: ${res.confidenceScore}%`);
    console.log(`    - Official Domain: ${res.officialDomain}`);
    console.log(`    - Outcome: ${res.reason || "Success"}\n`);
  }

  // Test Case 3: Duplicate Detection Verification (Second Run)
  console.log("[TEST SUITE 3] Multi-Signal Deduplication Safety Check (Second Run)");
  const secondReport = await discoveryService.runDiscovery([
    "RFCL recruitment 2026",
    "Engineers India Limited EIL recruitment 2026",
  ]);
  console.log(`  Second Run - Duplicates Detected: ${secondReport.duplicatesDetected}`);
  console.log(`  Second Run - New Jobs Created: ${secondReport.newJobsCreated} (Expected 0 - no duplicates created)`);

  console.log("\n================================================================================");
  console.log("               DISCOVERY LAYER EVALUATION COMPLETED                             ");
  console.log("================================================================================");

  return report;
}
