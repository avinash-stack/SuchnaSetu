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

async function runNonPscAudit() {
  const { data: orgs } = await supabase.from('organizations').select('id, name, acronym, slug, type, jurisdiction, website_url');
  const { data: jobs } = await supabase.from('gov_jobs').select('id, title, notification_number, official_notification_url, official_apply_url, organization_id');
  const { data: exams } = await supabase.from('gov_exams').select('id, title, exam_code, official_notification_url, official_website_url, organization_id');

  const orgMap = {};
  for (const o of orgs || []) orgMap[o.id] = o;

  const isPsc = (o) => {
    if (!o) return false;
    const ac = (o.acronym || '').toUpperCase();
    const nm = (o.name || '').toUpperCase();
    return ac === 'UPSC' || ac === 'SSC' || ac.includes('PSC') || ac.includes('SSSC') || nm.includes('PUBLIC SERVICE COMMISSION') || nm.includes('STAFF SELECTION');
  };

  const nonPscJobs = (jobs || []).filter(j => !isPsc(orgMap[j.organization_id]));
  const nonPscExams = (exams || []).filter(e => !isPsc(orgMap[e.organization_id]));

  console.log(`\n================================================================`);
  console.log(`NON-PSC JOBS & EXAMS COVERAGE`);
  console.log(`Total Non-PSC Jobs in DB: ${nonPscJobs.length}`);
  console.log(`Total Non-PSC Exams in DB: ${nonPscExams.length}`);
  console.log(`================================================================\n`);

  // Count by non-PSC org
  const orgJobs = {};
  for (const j of nonPscJobs) {
    const o = orgMap[j.organization_id] || { name: 'Unknown', acronym: 'UNK' };
    const key = o.acronym || o.name;
    if (!orgJobs[key]) orgJobs[key] = { org: o, jobs: [] };
    orgJobs[key].jobs.push(j);
  }

  console.log(`--- Non-PSC Organizations with Active Postings in DB ---`);
  for (const [key, data] of Object.entries(orgJobs)) {
    console.log(`[${key.padEnd(10)}] (${data.org.name}) - ${data.jobs.length} postings | Site: ${data.org.website_url}`);
  }

  // Check all non-PSC organizations that currently have 0 postings
  const activeOrgIds = new Set([...jobs.map(j => j.organization_id), ...exams.map(e => e.organization_id)]);
  const inactiveNonPscOrgs = (orgs || []).filter(o => !isPsc(o) && !activeOrgIds.has(o.id));

  console.log(`\n--- Non-PSC Organizations in DB with 0 postings (${inactiveNonPscOrgs.length} orgs) ---`);
  inactiveNonPscOrgs.forEach(o => {
    console.log(`• [${(o.acronym || 'N/A').padEnd(8)}] ${o.name.padEnd(50)} (${o.type || 'N/A'}) -> ${o.website_url}`);
  });

  // Test live GET on every distinct link in non-PSC jobs
  const urlsToTest = new Map();
  for (const j of nonPscJobs) {
    const o = orgMap[j.organization_id] || {};
    if (j.official_apply_url) urlsToTest.set(j.official_apply_url, { org: o.acronym || o.name, type: 'Apply URL' });
    if (j.official_notification_url) urlsToTest.set(j.official_notification_url, { org: o.acronym || o.name, type: 'Gazette URL' });
  }
  for (const e of nonPscExams) {
    const o = orgMap[e.organization_id] || {};
    if (e.official_website_url) urlsToTest.set(e.official_website_url, { org: o.acronym || o.name, type: 'Apply URL' });
    if (e.official_notification_url) urlsToTest.set(e.official_notification_url, { org: o.acronym || o.name, type: 'Gazette URL' });
  }

  console.log(`\n--- Live HTTP Verification of All ${urlsToTest.size} Non-PSC Destination URLs ---`);
  let passed = 0;
  let failed = 0;

  for (const [url, info] of urlsToTest.entries()) {
    try {
      const c = new AbortController();
      const tid = setTimeout(() => c.abort(), 6000);
      const res = await fetch(url, {
        method: 'GET',
        signal: c.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        }
      });
      clearTimeout(tid);
      if (res.status >= 200 && res.status < 400) {
        passed++;
        console.log(`✅ [HTTP ${res.status}] [${(info.org || '').padEnd(10)}] [${info.type.padEnd(12)}] ${url}`);
      } else {
        failed++;
        console.error(`❌ [HTTP ${res.status}] [${(info.org || '').padEnd(10)}] [${info.type.padEnd(12)}] ${url}`);
      }
    } catch (e) {
      failed++;
      console.error(`❌ [FAIL]      [${(info.org || '').padEnd(10)}] [${info.type.padEnd(12)}] ${url} (${e.message})`);
    }
  }

  console.log(`\n================================================================`);
  console.log(`NON-PSC LINK VERIFICATION RESULT: ${passed} PASSED, ${failed} FAILED`);
  console.log(`================================================================`);
}

runNonPscAudit().catch(console.error);
