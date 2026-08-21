import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

// Parse .env.local
const envContent = fs.readFileSync('.env.local', 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) {
    let val = match[2].trim();
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
    if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
    env[match[1].trim()] = val;
  }
});

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function runContentCoverageAudit() {
  console.log('='.repeat(100));
  console.log('RUNNING PRODUCTION DATABASE CONTENT COVERAGE AUDIT');
  console.log('='.repeat(100));

  // 1. Fetch all import_sources
  const { data: sources, error: srcErr } = await supabase
    .from('import_sources')
    .select('*')
    .order('target_module', { ascending: true })
    .order('name', { ascending: true });

  if (srcErr || !sources) {
    console.error('Failed to query import_sources:', srcErr?.message);
    return;
  }

  // 2. Fetch all gov_jobs
  const { data: jobs, error: jobErr } = await supabase
    .from('gov_jobs')
    .select('*');

  if (jobErr) {
    console.error('Failed to query gov_jobs:', jobErr.message);
    return;
  }

  // 3. Fetch all gov_exams
  const { data: exams, error: examErr } = await supabase
    .from('gov_exams')
    .select('*');

  if (examErr) {
    console.error('Failed to query gov_exams:', examErr.message);
    return;
  }

  console.log('Source Columns:', Object.keys(sources[0] || {}));
  console.log('Job Columns:', Object.keys(jobs[0] || {}));
  console.log('Exam Columns:', Object.keys(exams[0] || {}));

  console.log(`Loaded ${sources.length} sources, ${jobs.length} jobs, ${exams.length} exams.\n`);

  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  // Group jobs by source_id
  const jobsBySource = new Map();
  for (const j of jobs) {
    const list = jobsBySource.get(j.source_id) || [];
    list.push(j);
    jobsBySource.set(j.source_id, list);
  }

  // Group exams by source_id
  const examsBySource = new Map();
  for (const e of exams) {
    const list = examsBySource.get(e.source_id) || [];
    list.push(e);
    examsBySource.set(e.source_id, list);
  }

  const reportRows = [];

  for (const src of sources) {
    const isExam = src.target_module === 'exams';
    const records = isExam ? (examsBySource.get(src.id) || []) : (jobsBySource.get(src.id) || []);
    const totalCount = records.length;

    // Active records
    const activeRecords = records.filter(r => r.is_active !== false);
    const activeCount = activeRecords.length;

    // Last 7 days records
    const recentCount = records.filter(r => new Date(r.created_at || r.updated_at) >= sevenDaysAgo).length;

    // Valid Apply URL
    const validApplyCount = records.filter(r => {
      const u = r.apply_url;
      if (!u || u.length < 8) return false;
      return true;
    }).length;

    // Valid Notification URL
    const validNotifCount = records.filter(r => {
      const u = r.official_notification_url || r.pdf_url;
      if (!u || u.length < 8) return false;
      return true;
    }).length;

    // Valid Source URL
    const validSourceCount = records.filter(r => {
      const u = r.source_url;
      if (!u || u.length < 8) return false;
      return true;
    }).length;

    // Complete Data %
    let completeCount = 0;
    for (const r of records) {
      if (isExam) {
        if (r.title && r.conducting_body && r.apply_url && r.official_notification_url && (r.application_end_date || r.exam_date_summary)) {
          completeCount++;
        }
      } else {
        if (r.title && r.apply_url && r.official_notification_url && (r.closing_date || r.date_of_notification) && (r.qualification_summary || r.total_vacancies !== undefined)) {
          completeCount++;
        }
      }
    }

    const completePct = totalCount > 0 ? Math.round((completeCount / totalCount) * 100) : 0;
    const applyPct = totalCount > 0 ? Math.round((validApplyCount / totalCount) * 100) : 0;
    const notifPct = totalCount > 0 ? Math.round((validNotifCount / totalCount) * 100) : 0;

    // Classification
    let status = 'HEALTHY';
    if (!src.is_active) {
      status = 'DISABLED';
    } else if (totalCount === 0) {
      status = 'NO CURRENT DATA';
    } else if (totalCount <= 1) {
      status = 'LOW COVERAGE';
    } else if (applyPct < 80 || notifPct < 80) {
      status = 'LOW QUALITY';
    } else {
      status = 'HEALTHY';
    }

    const category = (src.config && (src.config.defaultCategory || src.config.jurisdiction)) || (isExam ? 'examinations' : 'general');
    const lastSync = src.last_sync_at ? new Date(src.last_sync_at).toLocaleDateString('en-GB') : 'Never';

    reportRows.push({
      code: src.code,
      name: src.name,
      module: src.target_module,
      category,
      enabled: src.is_active ? 'YES' : 'NO',
      lastSync,
      records: totalCount,
      activeRecords: activeCount,
      recent7d: recentCount,
      completePct,
      applyPct,
      notifPct,
      status
    });
  }

  // Aggregate Stats
  console.log('='.repeat(100));
  console.log('CONTENT COVERAGE AUDIT SUMMARY');
  console.log('='.repeat(100));
  console.log(`Total Enabled Sources:              ${sources.filter(s => s.is_active).length} / ${sources.length}`);
  console.log(`Sources with >0 Records:            ${reportRows.filter(r => r.records > 0).length}`);
  console.log(`Sources with 0 Records:             ${reportRows.filter(r => r.records === 0).length}`);
  console.log(`Sources with 1 Record (Low Cov):    ${reportRows.filter(r => r.records === 1).length}`);
  console.log(`Sources with >1 Records (Healthy):  ${reportRows.filter(r => r.records > 1).length}`);
  console.log(`Total Job Records in DB:            ${jobs.length}`);
  console.log(`Total Exam Records in DB:           ${exams.length}`);
  console.log(`Total Records Created Last 7 Days:  ${reportRows.reduce((a, b) => a + b.recent7d, 0)}`);

  console.log('\n' + '='.repeat(100));
  console.log('FULL SOURCE-BY-SOURCE COVERAGE MATRIX');
  console.log('='.repeat(100));
  console.log('Source Code'.padEnd(28) + ' | Module | Cat | En | Last Sync | Total | Act | 7d | Comp% | Apply% | Notif% | Status');
  console.log('-'.repeat(120));

  for (const r of reportRows) {
    const c = r.code.substring(0, 26).padEnd(28);
    const m = r.module.padEnd(6);
    const cat = r.category.substring(0, 10).padEnd(10);
    const en = r.enabled.padEnd(2);
    const ls = r.lastSync.padEnd(10);
    const rec = String(r.records).padEnd(5);
    const act = String(r.activeRecords).padEnd(4);
    const r7 = String(r.recent7d).padEnd(3);
    const cp = (r.completePct + '%').padEnd(5);
    const ap = (r.applyPct + '%').padEnd(6);
    const np = (r.notifPct + '%').padEnd(6);
    const st = r.status;
    console.log(`${c} | ${m} | ${cat} | ${en} | ${ls} | ${rec} | ${act} | ${r7} | ${cp} | ${ap} | ${np} | ${st}`);
  }

  // Dump JSON for report synthesis
  fs.writeFileSync('scripts/coverage-report-data.json', JSON.stringify(reportRows, null, 2));
}

runContentCoverageAudit().catch(console.error);
