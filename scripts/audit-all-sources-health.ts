import { GOV_JOB_SOURCES_CONFIG } from '../src/modules/ingestion/adapters/sources.config';
import { GOV_EXAM_SOURCES_CONFIG } from '../src/modules/ingestion/adapters/exam-sources.config';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

interface SourceHealthResult {
  sourceName: string;
  sourceKey: string;
  module: 'Jobs' | 'Exams';
  jurisdiction: string;
  targetUrl: string;
  fetchStatus: string;
  httpCode: number | string;
  parseStatus: string;
  recordsFound: number;
  liveRecords: number;
  applyUrl: string;
  applyUrlValid: boolean;
  notificationUrl: string;
  notificationUrlValid: boolean;
  status: 'HEALTHY' | 'PARTIAL' | 'FAILED' | 'BLOCKED' | 'NO DATA';
  failingStage: string;
  error: string;
}

function isValidApplyUrl(url: string, baseUrl: string): boolean {
  if (!url || typeof url !== 'string') return false;
  try {
    const u = new URL(url);
    const b = new URL(baseUrl);
    // Homepage fallback check: identical host + path is "/" or empty
    if (u.origin === b.origin && (u.pathname === '/' || u.pathname === '')) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

function isValidNotificationUrl(url: string, baseUrl: string): boolean {
  if (!url || typeof url !== 'string') return false;
  try {
    const u = new URL(url);
    const b = new URL(baseUrl);
    if (u.origin === b.origin && (u.pathname === '/' || u.pathname === '')) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

async function probeEndpoint(url: string) {
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8,application/json',
        'Accept-Language': 'en-US,en;q=0.9,hi;q=0.8',
        'Cache-Control': 'no-cache',
      },
      redirect: 'follow',
      signal: AbortSignal.timeout(6000)
    });

    const text = await res.text();
    return {
      ok: res.ok,
      status: res.status,
      statusText: res.statusText,
      contentType: res.headers.get('content-type') || '',
      landedUrl: res.url,
      body: text,
      error: null
    };
  } catch (err: any) {
    return {
      ok: false,
      status: 0,
      statusText: err.name || 'Error',
      contentType: '',
      landedUrl: url,
      body: '',
      error: err.message || 'Fetch failed'
    };
  }
}

async function auditSourceBatch<T>(
  items: T[],
  batchSize: number,
  fn: (item: T) => Promise<SourceHealthResult>
): Promise<SourceHealthResult[]> {
  const results: SourceHealthResult[] = [];
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(fn));
    results.push(...batchResults);
  }
  return results;
}

async function runFullHealthAudit() {
  console.log('='.repeat(100));
  console.log('COMPREHENSIVE JOBS & EXAMS SOURCE HEALTH AUDIT (ALL ENABLED SOURCES)');
  console.log('='.repeat(100));
  console.log();

  // 1. AUDIT ALL JOB SOURCES
  console.log(`Auditing ${GOV_JOB_SOURCES_CONFIG.length} Enabled Job Sources in concurrent batches...`);
  
  const jobResults = await auditSourceBatch(GOV_JOB_SOURCES_CONFIG, 8, async (src) => {
    const targetUrl = `${src.baseUrl}${src.recruitmentPath}`;
    const probe = await probeEndpoint(targetUrl);
    let parseStatus = 'NO_DATA';
    let liveRecords = 0;
    let failingStage = 'NONE';
    let errorMsg = '';
    let status: 'HEALTHY' | 'PARTIAL' | 'FAILED' | 'BLOCKED' | 'NO DATA' = 'NO DATA';

    const sampleNotice = src.canonicalNotices[0];
    const sampleApply = sampleNotice?.apply_url || src.applyUrl;
    const samplePdf = sampleNotice?.pdf_url;

    const applyValid = isValidApplyUrl(sampleApply, src.baseUrl);
    const notifValid = isValidNotificationUrl(samplePdf, src.baseUrl);

    if (probe.error) {
      if (probe.error.includes('ETIMEDOUT') || probe.error.includes('ECONNREFUSED') || probe.error.includes('ENOTFOUND')) {
        failingStage = 'FETCH';
        errorMsg = `Network/DNS: ${probe.error}`;
        status = 'BLOCKED';
      } else {
        failingStage = 'FETCH';
        errorMsg = `Fetch: ${probe.error}`;
        status = 'FAILED';
      }
    } else if (probe.status >= 400) {
      failingStage = 'FETCH';
      errorMsg = `HTTP ${probe.status} ${probe.statusText}`;
      status = probe.status === 403 || probe.status === 401 ? 'BLOCKED' : 'FAILED';
    } else {
      const body = probe.body;
      const trCount = (body.match(/<tr/gi) || []).length;
      const pdfCount = (body.match(/\.pdf/gi) || []).length;
      const isSpa = body.includes('<app-root') || body.includes('id="root"') || body.includes('id="__next"');

      if (pdfCount > 0 || trCount > 3) {
        parseStatus = `SUCCESS (TRs: ${trCount}, PDFs: ${pdfCount})`;
        liveRecords = pdfCount > 0 ? pdfCount : trCount;
        status = applyValid && notifValid ? 'HEALTHY' : 'PARTIAL';
        if (!applyValid || !notifValid) {
          failingStage = 'URL EXTRACTION';
          errorMsg = 'Apply or Notification URL points to homepage';
        }
      } else if (isSpa) {
        parseStatus = 'SPA_CLIENT_RENDERED';
        status = applyValid && notifValid ? 'PARTIAL' : 'FAILED';
        failingStage = 'PARSE';
        errorMsg = 'Angular/React SPA requiring JSON endpoint';
      } else {
        parseStatus = 'NO_TABLE_ROWS';
        status = src.canonicalNotices.length > 0 ? 'PARTIAL' : 'NO DATA';
        failingStage = 'DISCOVERY';
        errorMsg = 'No active recruitment links on landing page';
      }
    }

    console.log(`  [Jobs] ${src.name.substring(0, 50).padEnd(52)} -> [${status}] HTTP ${probe.status} (Live: ${liveRecords}, Static: ${src.canonicalNotices.length})`);

    return {
      sourceName: src.name,
      sourceKey: src.key,
      module: 'Jobs',
      jurisdiction: src.jurisdiction,
      targetUrl,
      fetchStatus: probe.ok ? 'OK' : 'FAILED',
      httpCode: probe.status || (probe.error ? 'ERR' : 0),
      parseStatus,
      recordsFound: liveRecords > 0 ? liveRecords : src.canonicalNotices.length,
      liveRecords,
      applyUrl: sampleApply || '',
      applyUrlValid: applyValid,
      notificationUrl: samplePdf || '',
      notificationUrlValid: notifValid,
      status,
      failingStage,
      error: errorMsg
    };
  });

  // 2. AUDIT ALL EXAM SOURCES
  console.log(`\nAuditing ${GOV_EXAM_SOURCES_CONFIG.length} Enabled Exam Sources in concurrent batches...`);

  const examResults = await auditSourceBatch(GOV_EXAM_SOURCES_CONFIG, 8, async (src) => {
    const targetUrl = `${src.baseUrl}${src.examinationPath}`;
    const probe = await probeEndpoint(targetUrl);
    let parseStatus = 'NO_DATA';
    let liveRecords = 0;
    let failingStage = 'NONE';
    let errorMsg = '';
    let status: 'HEALTHY' | 'PARTIAL' | 'FAILED' | 'BLOCKED' | 'NO DATA' = 'NO DATA';

    const sampleExam = src.canonicalExams[0];
    const sampleApply = sampleExam?.official_website_url || src.applyUrl;
    const samplePdf = sampleExam?.official_notification_url;

    const applyValid = isValidApplyUrl(sampleApply, src.baseUrl);
    const notifValid = isValidNotificationUrl(samplePdf, src.baseUrl);

    if (probe.error) {
      if (probe.error.includes('ETIMEDOUT') || probe.error.includes('ECONNREFUSED') || probe.error.includes('ENOTFOUND')) {
        failingStage = 'FETCH';
        errorMsg = `Network/DNS: ${probe.error}`;
        status = 'BLOCKED';
      } else {
        failingStage = 'FETCH';
        errorMsg = `Fetch: ${probe.error}`;
        status = 'FAILED';
      }
    } else if (probe.status >= 400) {
      failingStage = 'FETCH';
      errorMsg = `HTTP ${probe.status} ${probe.statusText}`;
      status = probe.status === 403 || probe.status === 401 ? 'BLOCKED' : 'FAILED';
    } else {
      const body = probe.body;
      const trCount = (body.match(/<tr/gi) || []).length;
      const pdfCount = (body.match(/\.pdf/gi) || []).length;
      const isSpa = body.includes('<app-root') || body.includes('id="root"') || body.includes('id="__next"');

      if (pdfCount > 0 || trCount > 3) {
        parseStatus = `SUCCESS (TRs: ${trCount}, PDFs: ${pdfCount})`;
        liveRecords = pdfCount > 0 ? pdfCount : trCount;
        status = applyValid && notifValid ? 'HEALTHY' : 'PARTIAL';
        if (!applyValid || !notifValid) {
          failingStage = 'URL EXTRACTION';
          errorMsg = 'Apply or Notification URL points to homepage';
        }
      } else if (isSpa) {
        parseStatus = 'SPA_CLIENT_RENDERED';
        status = applyValid && notifValid ? 'PARTIAL' : 'FAILED';
        failingStage = 'PARSE';
        errorMsg = 'Angular/React SPA requiring JSON endpoint';
      } else {
        parseStatus = 'NO_TABLE_ROWS';
        status = src.canonicalExams.length > 0 ? 'PARTIAL' : 'NO DATA';
        failingStage = 'DISCOVERY';
        errorMsg = 'No active recurring exam schedules on landing page';
      }
    }

    console.log(`  [Exams] ${src.name.substring(0, 50).padEnd(52)} -> [${status}] HTTP ${probe.status} (Live: ${liveRecords}, Static: ${src.canonicalExams.length})`);

    return {
      sourceName: src.name,
      sourceKey: src.key,
      module: 'Exams',
      jurisdiction: src.jurisdiction,
      targetUrl,
      fetchStatus: probe.ok ? 'OK' : 'FAILED',
      httpCode: probe.status || (probe.error ? 'ERR' : 0),
      parseStatus,
      recordsFound: liveRecords > 0 ? liveRecords : src.canonicalExams.length,
      liveRecords,
      applyUrl: sampleApply || '',
      applyUrlValid: applyValid,
      notificationUrl: samplePdf || '',
      notificationUrlValid: notifValid,
      status,
      failingStage,
      error: errorMsg
    };
  });

  const results = [...jobResults, ...examResults];

  // =========================================================================
  // SUMMARY METRICS TABLE
  // =========================================================================
  console.log('\n' + '='.repeat(100));
  console.log('SUMMARY HEALTH MATRIX ACROSS ALL 47 SOURCES');
  console.log('='.repeat(100));

  const totalSources = results.length;
  const healthyCount = results.filter(r => r.status === 'HEALTHY').length;
  const partialCount = results.filter(r => r.status === 'PARTIAL').length;
  const failedCount = results.filter(r => r.status === 'FAILED').length;
  const blockedCount = results.filter(r => r.status === 'BLOCKED').length;
  const noDataCount = results.filter(r => r.status === 'NO DATA').length;

  const jobsApplyCoverage = Math.round((jobResults.filter(r => r.applyUrlValid).length / jobResults.length) * 100);
  const jobsNotifCoverage = Math.round((jobResults.filter(r => r.notificationUrlValid).length / jobResults.length) * 100);

  const examsApplyCoverage = Math.round((examResults.filter(r => r.applyUrlValid).length / examResults.length) * 100);
  const examsNotifCoverage = Math.round((examResults.filter(r => r.notificationUrlValid).length / examResults.length) * 100);

  console.log(`\nTOTAL ENABLED SOURCES: ${totalSources}`);
  console.log(`  - HEALTHY:  ${healthyCount} (${Math.round((healthyCount / totalSources) * 100)}%)`);
  console.log(`  - PARTIAL:  ${partialCount} (${Math.round((partialCount / totalSources) * 100)}%)`);
  console.log(`  - FAILED:   ${failedCount} (${Math.round((failedCount / totalSources) * 100)}%)`);
  console.log(`  - BLOCKED:  ${blockedCount} (${Math.round((blockedCount / totalSources) * 100)}%)`);
  console.log(`  - NO DATA:  ${noDataCount} (${Math.round((noDataCount / totalSources) * 100)}%)`);

  console.log(`\nJOBS MODULE (${jobResults.length} sources):`);
  console.log(`  - Apply URL Coverage:        ${jobsApplyCoverage}%`);
  console.log(`  - Notification URL Coverage: ${jobsNotifCoverage}%`);

  console.log(`\nEXAMS MODULE (${examResults.length} sources):`);
  console.log(`  - Apply URL Coverage:        ${examsApplyCoverage}%`);
  console.log(`  - Notification URL Coverage: ${examsNotifCoverage}%`);

  console.log('\n' + '='.repeat(100));
  console.log('DETAILED SOURCE-BY-SOURCE BREAKDOWN');
  console.log('='.repeat(100));
  console.log('Source Key'.padEnd(28) + ' | Module | HTTP | Records | Apply OK | Notif OK | Status    | Failing Stage / Error');
  console.log('-'.repeat(100));

  for (const r of results) {
    const key = r.sourceKey.substring(0, 26).padEnd(28);
    const mod = r.module.padEnd(6);
    const http = String(r.httpCode).padEnd(4);
    const rec = String(r.recordsFound).padEnd(7);
    const app = (r.applyUrlValid ? 'YES' : 'NO ').padEnd(8);
    const not = (r.notificationUrlValid ? 'YES' : 'NO ').padEnd(8);
    const st = r.status.padEnd(9);
    const err = r.failingStage !== 'NONE' ? `[${r.failingStage}] ${r.error}` : 'OK';

    console.log(`${key} | ${mod} | ${http} | ${rec} | ${app} | ${not} | ${st} | ${err.substring(0, 50)}`);
  }
}

runFullHealthAudit().catch(console.error);
