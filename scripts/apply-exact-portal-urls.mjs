import fs from 'fs';
import path from 'path';

const sourcesConfigPath = path.resolve('src/modules/ingestion/adapters/sources.config.ts');
const examSourcesConfigPath = path.resolve('src/modules/ingestion/adapters/exam-sources.config.ts');

let sourcesContent = fs.readFileSync(sourcesConfigPath, 'utf8');
let examSourcesContent = fs.readFileSync(examSourcesConfigPath, 'utf8');

// Refined exact apply URLs for portals
const applyUrlFixes = [
  { find: /applyUrl:\s*"https:\/\/rac\.gov\.in",/g, replace: `applyUrl: "https://rac.gov.in/index.php?lang=en&id=0",` },
  { find: /applyUrl:\s*"https:\/\/indiapostgdsonline\.gov\.in",/g, replace: `applyUrl: "https://indiapostgdsonline.gov.in/Registration_Registration.aspx",` },
  { find: /applyUrl:\s*"https:\/\/rectt\.bsf\.gov\.in",/g, replace: `applyUrl: "https://rectt.bsf.gov.in/candidate/login",` },
  { find: /applyUrl:\s*"https:\/\/rect\.crpf\.gov\.in",/g, replace: `applyUrl: "https://rect.crpf.gov.in/Application/Register",` },
  { find: /applyUrl:\s*"https:\/\/recruitment\.itbpolice\.nic\.in",/g, replace: `applyUrl: "https://recruitment.itbpolice.nic.in/applicant-profile-details/applicant-login",` },
  { find: /applyUrl:\s*"https:\/\/csbc\.bihar\.gov\.in",/g, replace: `applyUrl: "https://csbc.bihar.gov.in/Advt/AdvtList.aspx",` },
  { find: /applyUrl:\s*"https:\/\/www\.upenergy\.in\/uppcl",/g, replace: `applyUrl: "https://www.upenergy.in/uppcl/en/page/vacancy-results",` },
  { find: /applyUrl:\s*"https:\/\/kvsangathan\.nic\.in",/g, replace: `applyUrl: "https://kvsangathan.nic.in/employment-notice",` },
  { find: /applyUrl:\s*"https:\/\/ccp223\.onlinereg\.co\.in",/g, replace: `applyUrl: "https://ccp223.onlinereg.co.in/home.html",` }
];

for (const fix of applyUrlFixes) {
  sourcesContent = sourcesContent.replace(fix.find, fix.replace);
}

fs.writeFileSync(sourcesConfigPath, sourcesContent, 'utf8');

// Exams apply URLs
const examApplyFixes = [
  { find: /applyUrl:\s*"https:\/\/rpsc\.rajasthan\.gov\.in",/g, replace: `applyUrl: "https://sso.rajasthan.gov.in/signin",` },
  { find: /applyUrl:\s*"https:\/\/ukpsc\.net\.in",/g, replace: `applyUrl: "https://ukpsc.net.in/candidate/login",` },
  { find: /applyUrl:\s*"https:\/\/wbpsc\.gov\.in",/g, replace: `applyUrl: "https://psc.wb.gov.in/candidate-login",` },
  { find: /applyUrl:\s*"https:\/\/aiimsexams\.ac\.in",/g, replace: `applyUrl: "https://rrp.aiimsexams.ac.in",` }
];

for (const fix of examApplyFixes) {
  examSourcesContent = examSourcesContent.replace(fix.find, fix.replace);
}

fs.writeFileSync(examSourcesConfigPath, examSourcesContent, 'utf8');
console.log('✅ Applied exact Apply portal URLs across sources.config.ts and exam-sources.config.ts');
