import { isPdfUrl } from '../src/lib/utils/index.js';

// Test matrix for UI behaviors across Job and Exam scenarios
const testCases = [
  {
    scenario: '1. Central Job with Authentic Gateway & Direct PDF (UPSC/SSC)',
    job: {
      title: 'Civil Services Examination 2026',
      official_apply_url: 'https://upsconline.nic.in',
      official_notification_url: 'https://upsc.gov.in/sites/default/files/Notif-CSP-2026-Engl.pdf',
      org: { name: 'Union Public Service Commission', website_url: 'https://upsc.gov.in' }
    },
    expected: {
      showApplyOnline: true,
      applyTarget: 'https://upsconline.nic.in',
      notifType: 'PDF_INLINE',
      showOrgPortal: true,
      orgPortalTarget: 'https://upsc.gov.in'
    }
  },
  {
    scenario: '2. State Job with No Separate Apply Gateway (CSBC / UPPSC)',
    job: {
      title: 'Police Constable Recruitment 2026',
      official_apply_url: null,
      official_notification_url: 'https://csbc.bih.nic.in/advt/CSBC_Constable_2026_Notice.pdf',
      org: { name: 'Central Selection Board of Constable', website_url: 'https://csbc.bih.nic.in' }
    },
    expected: {
      showApplyOnline: false,
      applyTarget: null,
      notifType: 'PDF_INLINE',
      showOrgPortal: true,
      orgPortalTarget: 'https://csbc.bih.nic.in'
    }
  },
  {
    scenario: '3. Web Notification Circular (HTML / Non-PDF)',
    job: {
      title: 'Special Recruitment Advisory 2026',
      official_apply_url: 'https://upsconline.nic.in',
      official_notification_url: 'https://upsc.gov.in/recruitment/special-recruitment-advertisements',
      org: { name: 'UPSC', website_url: 'https://upsc.gov.in' }
    },
    expected: {
      showApplyOnline: true,
      applyTarget: 'https://upsconline.nic.in',
      notifType: 'WEB_PAGE_EXTERNAL',
      showOrgPortal: true,
      orgPortalTarget: 'https://upsc.gov.in'
    }
  },
  {
    scenario: '4. Notice with Unavailable PDF',
    job: {
      title: 'Departmental Intimation Notice',
      official_apply_url: null,
      official_notification_url: null,
      org: { name: 'State Commission', website_url: 'https://commission.gov.in' }
    },
    expected: {
      showApplyOnline: false,
      applyTarget: null,
      notifType: 'UNAVAILABLE',
      showOrgPortal: true,
      orgPortalTarget: 'https://commission.gov.in'
    }
  }
];

console.log('================================================================');
console.log('            PHASE B: UI BEHAVIOR & URL CONTRACT AUDIT           ');
console.log('================================================================\n');

let allPassed = true;

testCases.forEach(tc => {
  const { job, expected } = tc;
  const showApply = !!job.official_apply_url;
  const notifIsPdf = isPdfUrl(job.official_notification_url);
  const notifType = !job.official_notification_url ? 'UNAVAILABLE' : (notifIsPdf ? 'PDF_INLINE' : 'WEB_PAGE_EXTERNAL');
  const showOrg = !!job.org?.website_url;

  const applyPassed = showApply === expected.showApplyOnline && job.official_apply_url === expected.applyTarget;
  const notifPassed = notifType === expected.notifType;
  const orgPassed = showOrg === expected.showOrgPortal && job.org?.website_url === expected.orgPortalTarget;

  const testPassed = applyPassed && notifPassed && orgPassed;
  if (!testPassed) allPassed = false;

  console.log(`[${testPassed ? 'PASS' : 'FAIL'}] ${tc.scenario}`);
  console.log(`  - "Apply Online" Button: ${showApply ? 'RENDERED -> ' + job.official_apply_url : 'OMITTED (Clean fallback)'}`);
  console.log(`  - Notification Button: ${notifType === 'PDF_INLINE' ? 'Notification PDF (Single-Page Viewer)' : (notifType === 'WEB_PAGE_EXTERNAL' ? 'Official Notification Page (External)' : 'OMITTED')}`);
  console.log(`  - Official Portal Button: ${showOrg ? 'RENDERED -> ' + job.org.website_url : 'OMITTED'}`);
  console.log('');
});

if (allPassed) {
  console.log('Phase B UI Contract Verification PASSED with 100% compliance!\n');
} else {
  console.error('Phase B UI Contract Verification FAILED.');
  process.exit(1);
}
