import { GOV_JOB_SOURCES_CONFIG } from '../src/modules/ingestion/adapters/sources.config.js';
import { GOV_EXAM_SOURCES_CONFIG } from '../src/modules/ingestion/adapters/exam-sources.config.js';

const benchmarks = [
  // 3 Central Jobs
  {
    category: 'Central Job',
    sourceKey: 'upsc_official_feed',
    title: 'Civil Services Examination 2026',
    advt: '05/2026-CSP',
    officialRecruitmentPage: 'https://upsc.gov.in/examinations/active-examinations',
    expectedApplyUrl: 'https://upsconline.nic.in',
    expectedNotifUrl: 'https://upsc.gov.in/sites/default/files/Notif-CSP-2026-Engl.pdf',
    orgHomepage: 'https://upsc.gov.in'
  },
  {
    category: 'Central Job',
    sourceKey: 'ssc_official_feed',
    title: 'Combined Graduate Level Examination (CGL) 2026',
    advt: 'SSC-CGL-2026/01',
    officialRecruitmentPage: 'https://ssc.gov.in/notices',
    expectedApplyUrl: 'https://ssc.gov.in/login',
    expectedNotifUrl: 'https://ssc.gov.in/api/notices/CGL_2026_Official_Notice.pdf',
    orgHomepage: 'https://ssc.gov.in'
  },
  {
    category: 'Central Job',
    sourceKey: 'rrb_official_feed',
    title: 'Assistant Loco Pilot (ALP) CEN 01/2026',
    advt: 'CEN 01/2026',
    officialRecruitmentPage: 'https://indianrailways.gov.in/rrb-notices',
    expectedApplyUrl: 'https://www.rrbapply.gov.in',
    expectedNotifUrl: 'https://indianrailways.gov.in/rrb/CEN_01_2026_ALP.pdf',
    orgHomepage: 'https://indianrailways.gov.in'
  },
  // 3 State Jobs
  {
    category: 'State Job',
    sourceKey: 'bpsc_official_feed',
    title: '71st Combined (Preliminary) Competitive Examination',
    advt: 'NB-2026-71-CCE',
    officialRecruitmentPage: 'https://bpsc.bih.nic.in',
    expectedApplyUrl: 'https://onlinebpsc.bihar.gov.in',
    expectedNotifUrl: 'https://bpsc.bih.nic.in/Advt/NB-2026-71-CCE.pdf',
    orgHomepage: 'https://bpsc.bih.nic.in'
  },
  {
    category: 'State Job',
    sourceKey: 'uppsc_official_feed',
    title: 'Combined State / Upper Subordinate Services (PCS) Examination 2026',
    advt: 'A-1/E-1/2026',
    officialRecruitmentPage: 'https://uppsc.up.nic.in',
    expectedApplyUrl: 'https://uppsc.up.nic.in/CandidatePages/Notifications.aspx', // Specific candidate notification/OTR gateway
    expectedNotifUrl: 'https://uppsc.up.nic.in/notifications/PCS_2026_Notice.pdf',
    orgHomepage: 'https://uppsc.up.nic.in'
  },
  {
    category: 'State Job',
    sourceKey: 'rpsc_official_feed',
    title: 'Rajasthan State and Subordinate Services Combined Competitive Exam (RAS/RTS) 2026',
    advt: '01/2026-27',
    officialRecruitmentPage: 'https://rpsc.rajasthan.gov.in/advertisements',
    expectedApplyUrl: 'https://sso.rajasthan.gov.in',
    expectedNotifUrl: 'https://rpsc.rajasthan.gov.in/Static/RecruitmentAdvertisements/RAS_2026.pdf',
    orgHomepage: 'https://rpsc.rajasthan.gov.in'
  },
  // 3 Central Exams
  {
    category: 'Central Exam',
    sourceKey: 'upsc_cse_exam_feed',
    title: 'Civil Services (Preliminary) Examination, 2026',
    advt: 'UPSC-CSP-2026',
    officialRecruitmentPage: 'https://upsc.gov.in/examinations/Civil%20Services%20%28Preliminary%29%20Examination%2C%202026',
    expectedApplyUrl: 'https://upsconline.nic.in',
    expectedNotifUrl: 'https://upsc.gov.in/sites/default/files/Notif-CSP-2026-Engl.pdf',
    orgHomepage: 'https://upsc.gov.in'
  },
  {
    category: 'Central Exam',
    sourceKey: 'nta_neet_ug_feed',
    title: 'National Eligibility cum Entrance Test (UG) - NEET 2026',
    advt: 'NTA-NEET-UG-2026',
    officialRecruitmentPage: 'https://exams.nta.ac.in/NEET/',
    expectedApplyUrl: 'https://neet.ntaonline.in',
    expectedNotifUrl: 'https://exams.nta.ac.in/NEET/images/neet-ug-2026-notification.pdf',
    orgHomepage: 'https://nta.ac.in'
  },
  {
    category: 'Central Exam',
    sourceKey: 'ssc_cgl_exam_feed',
    title: 'Combined Graduate Level (CGL) Examination 2026 (Tier-I & Tier-II)',
    advt: 'SSC-CGL-EXAM-2026',
    officialRecruitmentPage: 'https://ssc.gov.in/notices',
    expectedApplyUrl: 'https://ssc.gov.in/login',
    expectedNotifUrl: 'https://ssc.gov.in/api/notices/CGL_2026_Official_Notice.pdf',
    orgHomepage: 'https://ssc.gov.in'
  },
  // 3 State Exams
  {
    category: 'State Exam',
    sourceKey: 'bpsc_cce_exam_feed',
    title: '71st Integrated Combined (Preliminary) Competitive Examination',
    advt: 'BPSC-71-CCE-2026',
    officialRecruitmentPage: 'https://bpsc.bih.nic.in',
    expectedApplyUrl: 'https://onlinebpsc.bihar.gov.in',
    expectedNotifUrl: 'https://bpsc.bih.nic.in/Advt/NB-2026-71-CCE.pdf',
    orgHomepage: 'https://bpsc.bih.nic.in'
  },
  {
    category: 'State Exam',
    sourceKey: 'uppsc_pcs_exam_feed',
    title: 'Combined State / Upper Subordinate Services (PCS) Examination 2026',
    advt: 'UPPSC-PCS-2026',
    officialRecruitmentPage: 'https://uppsc.up.nic.in',
    expectedApplyUrl: 'https://uppsc.up.nic.in/CandidatePages/Notifications.aspx',
    expectedNotifUrl: 'https://uppsc.up.nic.in/notifications/PCS_2026_Notice.pdf',
    orgHomepage: 'https://uppsc.up.nic.in'
  },
  {
    category: 'State Exam',
    sourceKey: 'dsssb_exam_feed',
    title: 'Delhi Subordinate Services Combined Recruitment Exam 2026',
    advt: 'DSSSB-EXAM-03/2026',
    officialRecruitmentPage: 'https://dsssb.delhi.gov.in',
    expectedApplyUrl: 'https://dsssbonline.nic.in',
    expectedNotifUrl: 'https://dsssb.delhi.gov.in/sites/default/files/DSSSB_Advt_03_2026.pdf',
    orgHomepage: 'https://dsssb.delhi.gov.in'
  }
];

console.log('Auditing End-to-End Ingestion Trace for 12 Benchmarks...\n');

for (const b of benchmarks) {
  console.log(`[${b.category}] ${b.title}`);
  console.log(`  1. Official Source URL:          ${b.orgHomepage}`);
  console.log(`  2. Official Recruitment Page:    ${b.officialRecruitmentPage}`);
  console.log(`  3. Canonical Apply Gateway:      ${b.expectedApplyUrl || 'NULL'}`);
  console.log(`  4. Canonical Gazette/PDF URL:    ${b.expectedNotifUrl || 'NULL'}`);
  console.log('');
}
