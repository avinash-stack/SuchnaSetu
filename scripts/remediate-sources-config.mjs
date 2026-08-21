import fs from 'fs';
import path from 'path';

const sourcesConfigPath = path.resolve('src/modules/ingestion/adapters/sources.config.ts');
const examSourcesConfigPath = path.resolve('src/modules/ingestion/adapters/exam-sources.config.ts');

let sourcesContent = fs.readFileSync(sourcesConfigPath, 'utf8');
let examSourcesContent = fs.readFileSync(examSourcesConfigPath, 'utf8');

// Replacement mappings for Job sources
const jobSourceCorrections = [
  {
    find: /baseUrl:\s*"https:\/\/indianrailways\.gov\.in",\s*recruitmentPath:\s*"\/rrb-notices"/g,
    replace: `baseUrl: "https://www.rrbcdg.gov.in",\n    recruitmentPath: "/"`
  },
  {
    find: /baseUrl:\s*"https:\/\/jpsc\.gov\.in",\s*recruitmentPath:\s*"\/jpsc-notices"/g,
    replace: `baseUrl: "https://www.jpsc.gov.in",\n    recruitmentPath: "/"`
  },
  {
    find: /baseUrl:\s*"https:\/\/hpsc\.gov\.in",\s*recruitmentPath:\s*"\/hpsc-advertisements"/g,
    replace: `baseUrl: "https://hpsc.gov.in",\n    recruitmentPath: "/en-us/Advertisements"`
  },
  {
    find: /baseUrl:\s*"https:\/\/opsc\.gov\.in",\s*recruitmentPath:\s*"\/opsc-notices"/g,
    replace: `baseUrl: "https://www.opsc.gov.in",\n    recruitmentPath: "/Public/Notices"`
  },
  {
    find: /baseUrl:\s*"https:\/\/patnahighcourt\.gov\.in",\s*recruitmentPath:\s*"\/notices"/g,
    replace: `baseUrl: "https://patnahighcourt.gov.in",\n    recruitmentPath: "/"`
  },
  {
    find: /baseUrl:\s*"https:\/\/delhihighcourt\.nic\.in",\s*recruitmentPath:\s*"\/notices"/g,
    replace: `baseUrl: "https://delhihighcourt.nic.in",\n    recruitmentPath: "/open_positions"`
  },
  {
    find: /baseUrl:\s*"https:\/\/districts\.ecourts\.gov\.in",\s*recruitmentPath:\s*"\/notices"/g,
    replace: `baseUrl: "https://services.ecourts.gov.in",\n    recruitmentPath: "/"`
  },
  {
    find: /baseUrl:\s*"https:\/\/uppbpb\.gov\.in",\s*recruitmentPath:\s*"\/notices"/g,
    replace: `baseUrl: "https://uppbpb.gov.in",\n    recruitmentPath: "/"`
  },
  {
    find: /baseUrl:\s*"https:\/\/hssc\.gov\.in",\s*recruitmentPath:\s*"\/notices"/g,
    replace: `baseUrl: "https://hssc.gov.in",\n    recruitmentPath: "/"`
  },
  {
    find: /baseUrl:\s*"https:\/\/dsssb\.delhi\.gov\.in",\s*recruitmentPath:\s*"\/notices"/g,
    replace: `baseUrl: "https://dsssb.delhi.gov.in",\n    recruitmentPath: "/current-vacancies"`
  },
  {
    find: /baseUrl:\s*"https:\/\/upnrhm\.gov\.in",\s*recruitmentPath:\s*"\/notices"/g,
    replace: `baseUrl: "https://upnrhm.gov.in",\n    recruitmentPath: "/Home/Recruitment"`
  },
  {
    find: /baseUrl:\s*"https:\/\/bsphcl\.co\.in",\s*recruitmentPath:\s*"\/notices"/g,
    replace: `baseUrl: "https://bsphcl.co.in",\n    recruitmentPath: "/"`
  },
  {
    find: /baseUrl:\s*"https:\/\/dlrs\.bihar\.gov\.in",\s*recruitmentPath:\s*"\/notices"/g,
    replace: `baseUrl: "https://dlrs.bihar.gov.in",\n    recruitmentPath: "/"`
  },
  {
    find: /baseUrl:\s*"https:\/\/ongcindia\.com",\s*recruitmentPath:\s*"\/careers"/g,
    replace: `baseUrl: "https://ongcindia.com",\n    recruitmentPath: "/web/eng/career"`
  },
  {
    find: /baseUrl:\s*"https:\/\/careers\.bhel\.in",\s*recruitmentPath:\s*"\/notices"/g,
    replace: `baseUrl: "https://careers.bhel.in",\n    recruitmentPath: "/"`
  },
  {
    find: /baseUrl:\s*"https:\/\/nta\.ac\.in",\s*recruitmentPath:\s*"\/notices"/g,
    replace: `baseUrl: "https://nta.ac.in",\n    recruitmentPath: "/"`
  },
  {
    find: /applyUrl:\s*"https:\/\/joinindianarmy\.nic\.in"/g,
    replace: `applyUrl: "https://joinindianarmy.nic.in/default.aspx"`
  },
  {
    find: /applyUrl:\s*"https:\/\/joinindiannavy\.gov\.in"/g,
    replace: `applyUrl: "https://www.joinindiannavy.gov.in/en/account/login"`
  },
  {
    find: /applyUrl:\s*"https:\/\/csbc\.bihar\.gov\.in"/g,
    replace: `applyUrl: "https://csbc.bihar.gov.in"`
  },
  {
    find: /applyUrl:\s*"https:\/\/uppbpb\.gov\.in"/g,
    replace: `applyUrl: "https://ccp223.onlinereg.co.in"`
  },
  {
    find: /applyUrl:\s*"https:\/\/hssc\.gov\.in"/g,
    replace: `applyUrl: "https://onetimeregn.haryana.gov.in"`
  },
  {
    find: /applyUrl:\s*"https:\/\/dsssb\.delhi\.gov\.in"/g,
    replace: `applyUrl: "https://dsssbonline.nic.in"`
  },
  {
    find: /applyUrl:\s*"https:\/\/shs\.bihar\.gov\.in"/g,
    replace: `applyUrl: "https://shs.bihar.gov.in"`
  },
  {
    find: /applyUrl:\s*"https:\/\/bsphcl\.co\.in"/g,
    replace: `applyUrl: "https://bsphcl.co.in"`
  },
  {
    find: /applyUrl:\s*"https:\/\/kvsangathan\.nic\.in"/g,
    replace: `applyUrl: "https://kvsangathan.nic.in"`
  }
];

for (const item of jobSourceCorrections) {
  sourcesContent = sourcesContent.replace(item.find, item.replace);
}

fs.writeFileSync(sourcesConfigPath, sourcesContent, 'utf8');
console.log('✅ Updated sources.config.ts');

// Replacement mappings for Exam sources
const examSourceCorrections = [
  {
    find: /baseUrl:\s*"https:\/\/rrbcdg\.gov\.in",\s*examinationPath:\s*"\/exams"/g,
    replace: `baseUrl: "https://www.rrbcdg.gov.in",\n    examinationPath: "/"`
  },
  {
    find: /baseUrl:\s*"https:\/\/aiimsexams\.ac\.in",\s*examinationPath:\s*"\/exams"/g,
    replace: `baseUrl: "https://aiimsexams.ac.in",\n    examinationPath: "/"`
  },
  {
    find: /baseUrl:\s*"https:\/\/uppsc\.up\.nic\.in",\s*examinationPath:\s*"\/exams"/g,
    replace: `baseUrl: "https://uppsc.up.nic.in",\n    examinationPath: "/CandidatePages/Notifications.aspx"`
  },
  {
    find: /baseUrl:\s*"https:\/\/rpsc\.rajasthan\.gov\.in",\s*examinationPath:\s*"\/exams"/g,
    replace: `baseUrl: "https://rpsc.rajasthan.gov.in",\n    examinationPath: "/"`
  },
  {
    find: /baseUrl:\s*"https:\/\/dsssb\.delhi\.gov\.in",\s*examinationPath:\s*"\/exams"/g,
    replace: `baseUrl: "https://dsssb.delhi.gov.in",\n    examinationPath: "/current-vacancies"`
  },
  {
    find: /baseUrl:\s*"https:\/\/hpsc\.gov\.in",\s*examinationPath:\s*"\/exams"/g,
    replace: `baseUrl: "https://hpsc.gov.in",\n    examinationPath: "/en-us/Advertisements"`
  },
  {
    find: /baseUrl:\s*"https:\/\/jpsc\.gov\.in",\s*examinationPath:\s*"\/exams"/g,
    replace: `baseUrl: "https://www.jpsc.gov.in",\n    examinationPath: "/"`
  },
  {
    find: /baseUrl:\s*"https:\/\/wbpsc\.gov\.in",\s*examinationPath:\s*"\/exams"/g,
    replace: `baseUrl: "https://wbpsc.gov.in",\n    examinationPath: "/"`
  },
  {
    find: /baseUrl:\s*"https:\/\/opsc\.gov\.in",\s*examinationPath:\s*"\/exams"/g,
    replace: `baseUrl: "https://www.opsc.gov.in",\n    examinationPath: "/Public/Notices"`
  },
  {
    find: /baseUrl:\s*"https:\/\/bpsc\.bih\.nic\.in",\s*examinationPath:\s*"\/exams"/g,
    replace: `baseUrl: "https://bpsc.bihar.gov.in",\n    examinationPath: "/"`
  }
];

for (const item of examSourceCorrections) {
  examSourcesContent = examSourcesContent.replace(item.find, item.replace);
}

fs.writeFileSync(examSourcesConfigPath, examSourcesContent, 'utf8');
console.log('✅ Updated exam-sources.config.ts');
