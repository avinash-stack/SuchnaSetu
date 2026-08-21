import { GOV_JOB_SOURCES_CONFIG } from '../src/modules/ingestion/adapters/sources.config.js';
import { GOV_EXAM_SOURCES_CONFIG } from '../src/modules/ingestion/adapters/exam-sources.config.js';
import { isPdfUrl } from '../src/lib/utils/index.js';

const testUrls = [
  // Central
  { name: 'UPSC CSE Notification', url: 'https://upsc.gov.in/sites/default/files/Notif-CSP-2026-Engl.pdf' },
  { name: 'SSC CGL Notice', url: 'https://ssc.gov.in/api/notices/CGL_2026_Official_Notice.pdf' },
  { name: 'RRB ALP CEN 01/2026', url: 'https://indianrailways.gov.in/rrb/CEN_01_2026_ALP.pdf' },
  { name: 'IBPS PO Detailed Advt', url: 'https://ibps.in/pdf/CRP_PO_XVI_Detailed_Advertisement.pdf' },
  { name: 'DRDO RAC Scientist B', url: 'https://rac.gov.in/advt148_scientist_b.pdf' },
  { name: 'AIIMS NORCET 07', url: 'https://aiimsexams.ac.in/pdf/NORCET_07_Advertisement_2026.pdf' },
  { name: 'SBI PO Advertisement', url: 'https://sbi.co.in/documents/careers/CRPD_PO_2026_Advt.pdf' },
  // State
  { name: 'BPSC 71st CCE', url: 'https://bpsc.bih.nic.in/Advt/NB-2026-71-CCE.pdf' },
  { name: 'UPPSC PCS Notice', url: 'https://uppsc.up.nic.in/notifications/PCS_2026_Notice.pdf' },
  { name: 'RPSC RAS Advt', url: 'https://rpsc.rajasthan.gov.in/Static/RecruitmentAdvertisements/RAS_2026.pdf' },
  { name: 'DSSSB Advt 03/2026', url: 'https://dsssb.delhi.gov.in/sites/default/files/DSSSB_Advt_03_2026.pdf' },
  { name: 'BSSC 2nd Inter Level', url: 'https://bssc.bihar.gov.in/advt/2nd_Inter_Level_Official_Notice.pdf' },
  { name: 'CSBC Constable Notice', url: 'https://csbc.bihar.gov.in/advt/CSBC_Constable_2026_Notice.pdf' }
];

async function checkUrl(item) {
  try {
    const parsed = new URL(item.url);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(item.url, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'application/pdf,*/*;q=0.8',
        'Referer': `${parsed.protocol}//${parsed.hostname}/`,
      }
    });
    clearTimeout(timeoutId);

    const status = res.status;
    const contentType = res.headers.get('content-type') || '';
    const buf = await res.arrayBuffer();
    const uint8 = new Uint8Array(buf);
    const isPdfMagic = uint8.length >= 4 && uint8[0] === 0x25 && uint8[1] === 0x50 && uint8[2] === 0x44 && uint8[3] === 0x46;

    return {
      name: item.name,
      url: item.url,
      status,
      contentType,
      isPdfMagic,
      size: buf.byteLength,
      result: isPdfMagic ? 'PDF_STREAMABLE' : (status === 200 && contentType.includes('html') ? 'RETURNED_HTML_PAGE' : 'SERVER_BLOCKED_OR_404')
    };
  } catch (err) {
    return {
      name: item.name,
      url: item.url,
      status: 'ERR',
      error: err.message,
      result: 'CONNECTION_FAILED_OR_TIMEOUT'
    };
  }
}

async function runAudit() {
  console.log('Testing live HTTP requests to representative Government PDF URLs...\n');
  for (const item of testUrls) {
    const res = await checkUrl(item);
    console.log(`[${res.name}]`);
    console.log(`  URL: ${res.url}`);
    console.log(`  Status: ${res.status} | Content-Type: ${res.contentType || 'N/A'} | Magic %PDF: ${res.isPdfMagic || false}`);
    console.log(`  Classification: ${res.result}`);
    console.log('');
  }
}

runAudit();
