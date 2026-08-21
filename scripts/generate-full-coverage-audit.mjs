import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

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

async function generateFullCoverageAudit() {
  console.log('='.repeat(100));
  console.log('GENERATING PRODUCTION DATABASE CONTENT COVERAGE AUDIT');
  console.log('='.repeat(100));

  // Fetch all tables
  const { data: sources } = await supabase.from('import_sources').select('*').order('name');
  const { data: orgs } = await supabase.from('organizations').select('*');
  const { data: categories } = await supabase.from('categories').select('*');
  const { data: jobs } = await supabase.from('gov_jobs').select('*');
  const { data: exams } = await supabase.from('gov_exams').select('*');
  const { data: jobDocs } = await supabase.from('job_official_documents').select('job_id, file_url');
  const { data: jobElig } = await supabase.from('job_eligibility').select('job_id, education_qualification, min_age, max_age');

  const orgMap = new Map(orgs.map(o => [o.id, o]));
  const catMap = new Map(categories.map(c => [c.id, c]));

  const jobsByOrg = new Map();
  for (const j of jobs) {
    const list = jobsByOrg.get(j.organization_id) || [];
    list.push(j);
    jobsByOrg.set(j.organization_id, list);
  }

  const examsByOrg = new Map();
  for (const e of exams) {
    const list = examsByOrg.get(e.organization_id) || [];
    list.push(e);
    examsByOrg.set(e.organization_id, list);
  }

  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const report = [];

  for (const src of sources) {
    const org = orgMap.get(src.organization_id);
    const isExam = src.target_module === 'exams';
    const records = isExam ? (examsByOrg.get(src.organization_id) || []) : (jobsByOrg.get(src.organization_id) || []);
    const totalCount = records.length;

    // Active records
    const activeRecords = records.filter(r => r.status === 'published' || r.status === 'draft');
    const activeCount = activeRecords.length;

    // 7d records
    const recent7d = records.filter(r => new Date(r.created_at || r.updated_at) >= sevenDaysAgo).length;

    // Valid Apply URL %
    const validApplyCount = records.filter(r => {
      const u = isExam ? (r.official_website_url || src.config?.applyUrl) : (r.official_apply_url || src.config?.applyUrl);
      return Boolean(u && u.length > 8);
    }).length;

    // Valid Notification URL %
    const validNotifCount = records.filter(r => {
      const u = r.official_notification_url || (r && r.pdf_url);
      return Boolean(u && u.length > 8);
    }).length;

    // Complete Data %
    let completeCount = 0;
    for (const r of records) {
      if (isExam) {
        if (r.title && r.slug && r.official_notification_url && (r.official_website_url || src.config?.applyUrl)) {
          completeCount++;
        }
      } else {
        if (r.title && r.slug && r.official_notification_url && r.official_apply_url && (r.total_vacancies !== undefined || r.application_end_date)) {
          completeCount++;
        }
      }
    }

    const completePct = totalCount > 0 ? Math.round((completeCount / totalCount) * 100) : 0;
    const applyPct = totalCount > 0 ? Math.round((validApplyCount / totalCount) * 100) : 0;
    const notifPct = totalCount > 0 ? Math.round((validNotifCount / totalCount) * 100) : 0;

    // Classification
    let status = 'HEALTHY';
    if (!src.is_enabled) {
      status = 'FAILED';
    } else if (totalCount === 0) {
      status = 'NO CURRENT DATA';
    } else if (totalCount === 1) {
      status = 'LOW COVERAGE';
    } else if (applyPct < 80 || notifPct < 80) {
      status = 'LOW QUALITY';
    } else {
      status = 'HEALTHY';
    }

    const category = (src.config && src.config.defaultCategory) || (org && org.jurisdiction) || 'general';
    const lastSync = src.last_synced_at ? new Date(src.last_synced_at).toLocaleDateString('en-GB') : 'Never';

    report.push({
      name: src.name,
      code: src.code,
      module: src.target_module,
      category,
      enabled: src.is_enabled ? 'YES' : 'NO',
      lastSync,
      records: totalCount,
      activeRecords: activeCount,
      recent7d,
      completePct,
      applyPct,
      notifPct,
      status
    });
  }

  // Aggregate Metrics
  const totalSources = report.length;
  const enabledSources = report.filter(r => r.enabled === 'YES').length;
  const jobSources = report.filter(r => r.module === 'jobs' && r.records > 0).length;
  const examSources = report.filter(r => r.module === 'exams' && r.records > 0).length;
  const totalJobs = jobs.length;
  const activeJobs = jobs.filter(j => j.status === 'published' || j.status === 'draft').length;
  const totalExams = exams.length;
  const activeExams = exams.filter(e => e.status === 'published' || e.status === 'draft').length;
  const total7d = report.reduce((a, b) => a + b.recent7d, 0);

  const healthySources = report.filter(r => r.status === 'HEALTHY').length;
  const lowCovSources = report.filter(r => r.status === 'LOW COVERAGE').length;
  const noDataSources = report.filter(r => r.status === 'NO CURRENT DATA').length;
  const failedSources = report.filter(r => r.status === 'FAILED').length;

  console.log(`\n================================================================================`);
  console.log(`PRODUCTION DATABASE CONTENT METRICS`);
  console.log(`================================================================================`);
  console.log(`1. Total Enabled Sources:            ${enabledSources} / ${totalSources}`);
  console.log(`2. Sources Producing Jobs:           ${jobSources} sources (${totalJobs} total jobs, ${activeJobs} active)`);
  console.log(`3. Sources Producing Exams:          ${examSources} sources (${totalExams} total exams, ${activeExams} active)`);
  console.log(`4. Records Created/Updated Last 7d:  ${total7d}`);
  console.log(`5. Classification Breakdown:`);
  console.log(`   - HEALTHY (>1 records, 100% URLs):    ${healthySources} (${Math.round((healthySources / totalSources) * 100)}%)`);
  console.log(`   - LOW COVERAGE (1 record only):       ${lowCovSources} (${Math.round((lowCovSources / totalSources) * 100)}%)`);
  console.log(`   - NO CURRENT DATA (0 records):        ${noDataSources} (${Math.round((noDataSources / totalSources) * 100)}%)`);
  console.log(`   - FAILED / DISABLED:                  ${failedSources} (${Math.round((failedSources / totalSources) * 100)}%)`);

  fs.writeFileSync('scripts/production-coverage-audit.json', JSON.stringify(report, null, 2));
}

generateFullCoverageAudit().catch(console.error);
