import fs from 'fs';
import path from 'path';

const sourcesConfigPath = path.resolve('src/modules/ingestion/adapters/sources.config.ts');
const examSourcesConfigPath = path.resolve('src/modules/ingestion/adapters/exam-sources.config.ts');

let sourcesContent = fs.readFileSync(sourcesConfigPath, 'utf8');
let examSourcesContent = fs.readFileSync(examSourcesConfigPath, 'utf8');

// Replacements for Job sources
const jobReplacements = [
  { from: 'applyUrl: "https://uppsc.up.nic.in/candidatepages"', to: 'applyUrl: "https://uppsc.up.nic.in/CandidatePages/Notifications.aspx"' },
  { from: 'applyUrl: "https://csbc.bihar.gov.in"', to: 'applyUrl: "https://csbc.bihar.gov.in/Advt/AdvtList.aspx"' },
  { from: 'applyUrl: "https://bpssc.bihar.gov.in"', to: 'applyUrl: "https://bpssc.bihar.gov.in/Advt/AdvtList.aspx"' },
  { from: 'applyUrl: "https://upsssc.gov.in"', to: 'applyUrl: "https://upsssc.gov.in/Default.aspx#candidate_login"' },
  { from: 'applyUrl: "https://uppbpb.gov.in"', to: 'applyUrl: "https://uppbpb.gov.in/Notices"' },
  { from: 'applyUrl: "https://hssc.gov.in"', to: 'applyUrl: "https://adv12024.hryssc.com"' },
  { from: 'applyUrl: "https://jpsc.gov.in/online_application"', to: 'applyUrl: "https://jpsc.gov.in/online_application"' },
  { from: 'applyUrl: "https://hpsc.gov.in/en-us/Online-Application-Form"', to: 'applyUrl: "https://hpsc.gov.in/en-us/Online-Application-Form"' },
  { from: 'applyUrl: "https://ukpscnet.in"', to: 'applyUrl: "https://ukpscnet.in"' },
];

for (const rep of jobReplacements) {
  if (sourcesContent.includes(rep.from)) {
    sourcesContent = sourcesContent.replaceAll(rep.from, rep.to);
    console.log(`Updated job source: ${rep.from} -> ${rep.to}`);
  }
}

// Replacements for Exam sources
const examReplacements = [
  { from: 'applyUrl: "https://uppsc.up.nic.in"', to: 'applyUrl: "https://uppsc.up.nic.in/CandidatePages/Notifications.aspx"' },
  { from: '"official_website_url": "https://uppsc.up.nic.in"', to: '"official_website_url": "https://uppsc.up.nic.in/CandidatePages/Notifications.aspx"' },
  { from: 'applyUrl: "https://ibps.in"', to: 'applyUrl: "https://ibpsonline.ibps.in"' },
  { from: '"official_website_url": "https://ibps.in"', to: '"official_website_url": "https://ibpsonline.ibps.in"' },
  { from: 'applyUrl: "https://mppsc.mp.gov.in"', to: 'applyUrl: "https://mponline.gov.in"' },
  { from: '"official_website_url": "https://mppsc.mp.gov.in"', to: '"official_website_url": "https://mponline.gov.in"' },
  { from: 'applyUrl: "https://hpsc.gov.in"', to: 'applyUrl: "https://hpsc.gov.in/en-us/Online-Application-Form"' },
  { from: '"official_website_url": "https://hpsc.gov.in"', to: '"official_website_url": "https://hpsc.gov.in/en-us/Online-Application-Form"' },
  { from: 'applyUrl: "https://jpsc.gov.in"', to: 'applyUrl: "https://jpsc.gov.in/online_application"' },
  { from: '"official_website_url": "https://jpsc.gov.in"', to: '"official_website_url": "https://jpsc.gov.in/online_application"' },
  { from: 'applyUrl: "https://ukpsc.net.in"', to: 'applyUrl: "https://ukpscnet.in"' },
  { from: '"official_website_url": "https://ukpsc.net.in"', to: '"official_website_url": "https://ukpscnet.in"' },
  { from: 'applyUrl: "https://opsc.gov.in"', to: 'applyUrl: "https://opsconline.gov.in"' },
  { from: '"official_website_url": "https://opsc.gov.in"', to: '"official_website_url": "https://opsconline.gov.in"' },
];

for (const rep of examReplacements) {
  if (examSourcesContent.includes(rep.from)) {
    examSourcesContent = examSourcesContent.replaceAll(rep.from, rep.to);
    console.log(`Updated exam source: ${rep.from} -> ${rep.to}`);
  }
}

fs.writeFileSync(sourcesConfigPath, sourcesContent, 'utf8');
fs.writeFileSync(examSourcesConfigPath, examSourcesContent, 'utf8');

console.log('\nSources configs updated successfully.');
