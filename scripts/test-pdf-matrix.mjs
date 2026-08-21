import { isPdfUrl } from '../src/lib/utils/index.js';

const sampleJobs = [
  // 1. Central Sources
  {
    org: 'UPSC',
    title: 'Civil Services Examination 2026',
    notificationUrl: 'https://upsc.gov.in/sites/default/files/Notif-CSP-2026-Engl.pdf',
    applyUrl: 'https://upsconline.nic.in',
    type: 'direct_pdf'
  },
  {
    org: 'SSC',
    title: 'Combined Graduate Level Examination (CGL) 2026',
    notificationUrl: 'https://ssc.gov.in/api/notices/CGL_2026_Official_Notice.pdf',
    applyUrl: 'https://ssc.gov.in/login',
    type: 'direct_pdf'
  },
  {
    org: 'RRB',
    title: 'Assistant Loco Pilot (ALP) CEN 01/2026',
    notificationUrl: 'https://indianrailways.gov.in/rrb/CEN_01_2026_ALP.pdf',
    applyUrl: 'https://www.rrbapply.gov.in',
    type: 'direct_pdf'
  },
  {
    org: 'IBPS',
    title: 'Probationary Officers CRP PO/MT-XVI 2026',
    notificationUrl: 'https://ibps.in/pdf/CRP_PO_XVI_Detailed_Advertisement.pdf',
    applyUrl: 'https://ibpsonline.ibps.in',
    type: 'direct_pdf'
  },
  {
    org: 'DRDO',
    title: 'Scientist B Recruitment (Advt No. 148)',
    notificationUrl: 'https://rac.gov.in/advt148_scientist_b.pdf',
    applyUrl: 'https://rac.gov.in',
    type: 'direct_pdf'
  },
  {
    org: 'AIIMS',
    title: 'Nursing Officer NORCET-07 Examination 2026',
    notificationUrl: 'https://aiimsexams.ac.in/pdf/NORCET_07_Advertisement_2026.pdf',
    applyUrl: 'https://norcet7.aiimsexams.ac.in',
    type: 'direct_pdf'
  },
  // 2. State Sources
  {
    org: 'BPSC',
    title: '71st Combined (Preliminary) Competitive Exam',
    notificationUrl: 'https://bpsc.bih.nic.in/Advt/NB-2026-71-CCE.pdf',
    applyUrl: 'https://onlinebpsc.bihar.gov.in',
    type: 'direct_pdf'
  },
  {
    org: 'UPPSC',
    title: 'Combined State / Upper Subordinate Services (PCS)',
    notificationUrl: 'https://uppsc.up.nic.in/notifications/PCS_2026_Notice.pdf',
    applyUrl: null,
    type: 'direct_pdf'
  },
  {
    org: 'RPSC',
    title: 'Rajasthan State and Subordinate Services (RAS)',
    notificationUrl: 'https://rpsc.rajasthan.gov.in/Static/RecruitmentAdvertisements/RAS_2026.pdf',
    applyUrl: 'https://sso.rajasthan.gov.in',
    type: 'direct_pdf'
  },
  {
    org: 'DSSSB',
    title: 'Delhi Govt Teaching & Nursing Officer (Advt 03/2026)',
    notificationUrl: 'https://dsssb.delhi.gov.in/sites/default/files/DSSSB_Advt_03_2026.pdf',
    applyUrl: 'https://dsssbonline.nic.in',
    type: 'direct_pdf'
  },
  {
    org: 'BSSC',
    title: '2nd Inter Level Combined Competitive Examination',
    notificationUrl: 'https://bssc.bihar.gov.in/advt/2nd_Inter_Level_Official_Notice.pdf',
    applyUrl: 'https://onlinebssc.com',
    type: 'direct_pdf'
  },
  {
    org: 'CSBC',
    title: 'Bihar Police Constable Recruitment 2026',
    notificationUrl: 'https://csbc.bihar.gov.in/advt/CSBC_Constable_2026_Notice.pdf',
    applyUrl: null,
    type: 'direct_pdf'
  },
  // 3. Web Notification Page & Unavailable Test Cases
  {
    org: 'UPSC Special Notice',
    title: 'Special Recruitment Web Notice',
    notificationUrl: 'https://upsc.gov.in/recruitment/special-recruitment-advertisements',
    applyUrl: 'https://upsconline.nic.in',
    type: 'web_notification'
  },
  {
    org: 'Archival Department Notice',
    title: 'Unpublished Departmental Memo',
    notificationUrl: null,
    applyUrl: null,
    type: 'unavailable'
  }
];

console.log('================================================================');
console.log('       MULTI-SOURCE PDF NOTIFICATION PIPELINE TEST MATRIX       ');
console.log('================================================================\n');

let allPassed = true;

sampleJobs.forEach((job, idx) => {
  const isDirectPdf = isPdfUrl(job.notificationUrl);
  let resolvedState = '';

  if (!job.notificationUrl) {
    resolvedState = 'STATE_D: Notification Unavailable';
  } else if (isDirectPdf) {
    resolvedState = 'STATE_A/B: Direct Official PDF (Inline Stream or Direct Gazette Access Card)';
  } else {
    resolvedState = 'STATE_C: Official Web Notification Page (External Portal Link)';
  }

  const matchesExpected = 
    (job.type === 'direct_pdf' && isDirectPdf) ||
    (job.type === 'web_notification' && !isDirectPdf && job.notificationUrl) ||
    (job.type === 'unavailable' && !job.notificationUrl);

  if (!matchesExpected) allPassed = false;

  console.log(`[${matchesExpected ? 'PASS' : 'FAIL'}] [${idx + 1}] ${job.org}: ${job.title.slice(0, 45)}`);
  console.log(`  - URL: ${job.notificationUrl || '(NULL)'}`);
  console.log(`  - State Resolution: ${resolvedState}`);
  console.log(`  - Candidate Apply Gateway: ${job.applyUrl ? '✅ ' + job.applyUrl : '➖ NULL (Preserved Commission Portal only)'}`);
  console.log('');
});

console.log('================================================================');
console.log(`TOTAL JOBS TESTED: ${sampleJobs.length} | PASSED: ${allPassed ? sampleJobs.length : 'FAIL'}`);
console.log('================================================================\n');
