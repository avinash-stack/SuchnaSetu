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

async function inspectAllOrgsAndJobs() {
  const { data: orgs } = await supabase.from('organizations').select('id, name, acronym, jurisdiction, category_id, website_url');
  const { data: jobs } = await supabase.from('gov_jobs').select('id, title, official_notification_url, official_apply_url, organization_id');
  const { data: exams } = await supabase.from('gov_exams').select('id, title, official_notification_url, official_website_url, organization_id');

  const orgMap = {};
  for (const o of orgs || []) orgMap[o.id] = o;

  const jobCountsByOrg = {};
  for (const j of jobs || []) {
    const org = orgMap[j.organization_id];
    const key = org ? `${org.acronym || 'NO_ACRONYM'} (${org.name}) [${org.jurisdiction || 'NO_JUR'}]` : `Unknown (${j.organization_id})`;
    jobCountsByOrg[key] = (jobCountsByOrg[key] || 0) + 1;
  }

  console.log('\n--- Distribution of 510 Jobs by Organization ---');
  for (const [k, count] of Object.entries(jobCountsByOrg)) {
    console.log(`${k.padEnd(65)} : ${count} jobs`);
  }

  console.log('\n--- All 76 Organizations in DB & their Category/Jurisdiction ---');
  for (const o of orgs || []) {
    console.log(`[${(o.acronym || 'N/A').padEnd(8)}] ${o.name.padEnd(50)} | Jur: ${(o.jurisdiction || 'N/A').padEnd(12)} | Site: ${o.website_url}`);
  }
}

inspectAllOrgsAndJobs().catch(console.error);
