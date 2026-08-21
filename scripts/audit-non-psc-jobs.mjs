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

async function auditNonPscJobs() {
  console.log('Fetching all jobs and exams with organization details...');
  const { data: jobs } = await supabase
    .from('gov_jobs')
    .select('id, title, official_notification_url, official_apply_url, organization_id, organizations(id, name, acronym, jurisdiction, category_id, website_url)');

  const { data: exams } = await supabase
    .from('gov_exams')
    .select('id, title, official_notification_url, official_website_url, organization_id, organizations(id, name, acronym, jurisdiction, category_id, website_url)');

  // Filter out Central & State PSCs (UPSC, SSC, State PSCs) to isolate PSUs, Banks, Defence, Courts, Teaching, etc.
  const isPsc = (acronym = '', name = '') => {
    const ac = acronym.toUpperCase();
    const nm = name.toUpperCase();
    return ac === 'UPSC' || ac === 'SSC' || ac.includes('PSC') || ac.includes('SSSC') || nm.includes('PUBLIC SERVICE COMMISSION') || nm.includes('STAFF SELECTION');
  };

  const nonPscJobs = (jobs || []).filter(j => !isPsc(j.organizations?.acronym, j.organizations?.name));
  const nonPscExams = (exams || []).filter(e => !isPsc(e.organizations?.acronym, e.organizations?.name));

  console.log(`\n================================================================`);
  console.log(`NON-PSC JOBS & EXAMS AUDIT SUMMARY`);
  console.log(`Total Non-PSC Jobs: ${nonPscJobs.length}`);
  console.log(`Total Non-PSC Exams: ${nonPscExams.length}`);
  console.log(`================================================================\n`);

  // Group by Organization Acronym / Name
  const orgSummary = {};
  for (const j of nonPscJobs) {
    const orgKey = j.organizations?.acronym || j.organizations?.name || 'Unknown';
    if (!orgSummary[orgKey]) {
      orgSummary[orgKey] = {
        name: j.organizations?.name,
        acronym: j.organizations?.acronym,
        website: j.organizations?.website_url,
        jurisdiction: j.organizations?.jurisdiction,
        jobCount: 0,
        examCount: 0,
        applyUrls: new Set(),
        notifUrls: new Set(),
      };
    }
    orgSummary[orgKey].jobCount++;
    if (j.official_apply_url) orgSummary[orgKey].applyUrls.add(j.official_apply_url);
    if (j.official_notification_url) orgSummary[orgKey].notifUrls.add(j.official_notification_url);
  }

  for (const e of nonPscExams) {
    const orgKey = e.organizations?.acronym || e.organizations?.name || 'Unknown';
    if (!orgSummary[orgKey]) {
      orgSummary[orgKey] = {
        name: e.organizations?.name,
        acronym: e.organizations?.acronym,
        website: e.organizations?.website_url,
        jurisdiction: e.organizations?.jurisdiction,
        jobCount: 0,
        examCount: 0,
        applyUrls: new Set(),
        notifUrls: new Set(),
      };
    }
    orgSummary[orgKey].examCount++;
    if (e.official_website_url) orgSummary[orgKey].applyUrls.add(e.official_website_url);
    if (e.official_notification_url) orgSummary[orgKey].notifUrls.add(e.official_notification_url);
  }

  console.log(`Found ${Object.keys(orgSummary).length} Non-PSC Recruiting Bodies.`);
  
  // Test live GET requests on all unique URLs across these organizations
  const allUrlsToTest = [];
  for (const [orgKey, details] of Object.entries(orgSummary)) {
    for (const url of details.applyUrls) {
      allUrlsToTest.push({ org: orgKey, type: 'Apply URL', url });
    }
    for (const url of details.notifUrls) {
      allUrlsToTest.push({ org: orgKey, type: 'Notification URL', url });
    }
  }

  console.log(`Total Unique URLs to Validate: ${allUrlsToTest.length}\n`);

  const results = { passed: 0, failed: 0, details: [] };

  for (const item of allUrlsToTest) {
    try {
      const controller = new AbortController();
      const tid = setTimeout(() => controller.abort(), 7000);
      const res = await fetch(item.url, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        }
      });
      clearTimeout(tid);

      const isSuccess = res.status >= 200 && res.status < 400;
      if (isSuccess) {
        results.passed++;
        console.log(`✅ [HTTP ${res.status}] [${item.org.padEnd(10)}] [${item.type.padEnd(16)}] ${item.url}`);
      } else {
        results.failed++;
        console.error(`❌ [HTTP ${res.status}] [${item.org.padEnd(10)}] [${item.type.padEnd(16)}] ${item.url}`);
        results.details.push({ ...item, status: res.status, error: `HTTP ${res.status}` });
      }
    } catch (err) {
      results.failed++;
      console.error(`❌ [FAIL]      [${item.org.padEnd(10)}] [${item.type.padEnd(16)}] ${item.url} (${err.message})`);
      results.details.push({ ...item, status: 0, error: err.message });
    }
  }

  console.log(`\n================================================================`);
  console.log(`AUDIT COMPLETE: ${results.passed} PASSED, ${results.failed} FAILED`);
  console.log(`================================================================`);
}

auditNonPscJobs().catch(console.error);
