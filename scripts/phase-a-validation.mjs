import { GOV_JOB_SOURCES_CONFIG } from '../src/modules/ingestion/adapters/sources.config.js';
import { GOV_EXAM_SOURCES_CONFIG } from '../src/modules/ingestion/adapters/exam-sources.config.js';
import { StandardGovJobDataNormalizer } from '../src/modules/ingestion/adapters/standard-gov-job.adapter.js';
import { StandardGovExamDataNormalizer } from '../src/modules/ingestion/adapters/standard-gov-exam.adapter.js';
import { isPdfUrl } from '../src/lib/utils/index.js';

// Classification criteria
function classifyApplyUrl(applyUrl, baseUrl) {
  if (!applyUrl) {
    return {
      status: 'NULL',
      category: 'Preserved Org Portal Only (No Separate Apply Gateway)',
      url: null,
    };
  }
  return {
    status: 'VALID_GATEWAY',
    category: 'Dedicated Candidate / OTR Portal',
    url: applyUrl,
  };
}

function classifyNotificationUrl(notifUrl) {
  if (!notifUrl) {
    return {
      status: 'UNAVAILABLE',
      category: 'Notification Unavailable',
      url: null,
    };
  }
  if (isPdfUrl(notifUrl)) {
    return {
      status: 'DIRECT_PDF',
      category: 'Direct PDF Document (Inline Viewer Eligible)',
      url: notifUrl,
    };
  }
  return {
    status: 'WEB_NOTIFICATION',
    category: 'Official Web Notification / Notice Board (External Link Only)',
    url: notifUrl,
  };
}

async function runPhaseA() {
  console.log('================================================================');
  console.log('       PHASE A: REPRESENTATIVE SOURCES VALIDATION MATRIX        ');
  console.log('================================================================\n');

  const targetSlugs = [
    // Central
    'ssc', 'rrb', 'ibps', 'drdo', 'aiims', 'sbi', 'nta-recruitment',
    // State
    'bpsc', 'uppsc', 'rpsc', 'dsssb', 'bssc', 'csbc'
  ];

  const results = [];

  // 1. Audit Representative Jobs
  console.log('--- 1. CENTRAL & STATE GOVERNMENT JOBS ---');
  for (const slug of targetSlugs) {
    const source = GOV_JOB_SOURCES_CONFIG.find(s => s.organizationSlug === slug);
    if (!source) continue;

    const normalizer = new StandardGovJobDataNormalizer(source);
    for (const notice of source.canonicalNotices) {
      const res = await normalizer.normalize({
        externalId: notice.advertisement_number,
        rawPayload: notice,
        contentType: 'application/json',
        extractedAt: new Date(),
      }, { log: async () => {} });

      if (res.success && res.data) {
        const d = res.data;
        const applyClassification = classifyApplyUrl(d.officialApplyUrl, source.baseUrl);
        const notifClassification = classifyNotificationUrl(d.officialNotificationUrl);

        results.push({
          module: 'Job',
          orgSlug: slug,
          orgName: source.organizationName,
          title: d.title,
          baseUrl: source.baseUrl,
          applyStatus: applyClassification.status,
          applyUrl: applyClassification.url,
          notifStatus: notifClassification.status,
          notifUrl: notifClassification.url,
        });

        console.log(`[JOB: ${source.organizationName.toUpperCase()}]`);
        console.log(`  - Title: ${d.title.slice(0, 50)}...`);
        console.log(`  - Org Portal: ${source.baseUrl}`);
        console.log(`  - Apply Online: [${applyClassification.status}] ${applyClassification.url || '(NULL)'}`);
        console.log(`  - Notification: [${notifClassification.status}] ${notifClassification.url}`);
        console.log('');
      }
    }
  }

  // 2. Audit Representative Exams
  console.log('\n--- 2. CENTRAL & STATE GOVERNMENT EXAMINATIONS ---');
  const examSlugs = ['upsc', 'ssc', 'bpsc', 'rpsc'];
  for (const slug of examSlugs) {
    const source = GOV_EXAM_SOURCES_CONFIG.find(s => s.organizationSlug === slug);
    if (!source) continue;

    const normalizer = new StandardGovExamDataNormalizer(source);
    for (const notice of source.canonicalExams) {
      const res = await normalizer.normalize({
        externalId: notice.exam_code || notice.slug,
        rawPayload: notice,
        contentType: 'application/json',
        extractedAt: new Date(),
      }, { log: async () => {} });

      if (res.success && res.data) {
        const d = res.data;
        const applyClassification = classifyApplyUrl(d.officialApplyUrl, source.baseUrl);
        const notifClassification = classifyNotificationUrl(d.officialNotificationUrl);

        results.push({
          module: 'Exam',
          orgSlug: slug,
          orgName: source.organizationName,
          title: d.title,
          baseUrl: source.baseUrl,
          applyStatus: applyClassification.status,
          applyUrl: applyClassification.url,
          notifStatus: notifClassification.status,
          notifUrl: notifClassification.url,
        });

        console.log(`[EXAM: ${source.organizationName.toUpperCase()}]`);
        console.log(`  - Title: ${d.title.slice(0, 50)}...`);
        console.log(`  - Org Portal: ${source.baseUrl}`);
        console.log(`  - Apply Online: [${applyClassification.status}] ${applyClassification.url || '(NULL)'}`);
        console.log(`  - Notification: [${notifClassification.status}] ${notifClassification.url}`);
        console.log(`  - Official Documents Persisted: ${d.officialDocuments?.length || 0} doc(s)`);
        console.log('');
      }
    }
  }

  console.log('================================================================');
  console.log('PHASE A AUDIT SUMMARY:');
  const total = results.length;
  const genuineGateways = results.filter(r => r.applyStatus === 'VALID_GATEWAY').length;
  const nullApply = results.filter(r => r.applyStatus === 'NULL').length;
  const directPdf = results.filter(r => r.notifStatus === 'DIRECT_PDF').length;
  const webNotif = results.filter(r => r.notifStatus === 'WEB_NOTIFICATION').length;

  console.log(`- Total Sample Notices Audited: ${total}`);
  console.log(`- Genuine Candidate Apply Gateways: ${genuineGateways}`);
  console.log(`- Correctly Nullified Apply URLs (Org Portal Preserved): ${nullApply}`);
  console.log(`- Direct PDF Notices: ${directPdf}`);
  console.log(`- Web Notification Pages (Non-PDF): ${webNotif}`);
  console.log('================================================================');
}

runPhaseA();
