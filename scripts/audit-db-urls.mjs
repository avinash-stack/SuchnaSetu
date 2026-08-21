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

async function inspectUrls() {
  console.log('Fetching all jobs and exams from DB...');
  const { data: jobs } = await supabase
    .from('gov_jobs')
    .select('id, title, official_notification_url, official_apply_url, organizations(name, acronym, website_url)');

  const { data: exams } = await supabase
    .from('gov_exams')
    .select('id, title, official_notification_url, official_website_url, organizations(name, acronym, website_url)');

  console.log(`Found ${jobs?.length} jobs, ${exams?.length} exams in DB.`);

  // Sample distinct domain patterns
  const jobNotifUrls = jobs?.map(j => ({ id: j.id, title: j.title, notif: j.official_notification_url, apply: j.official_apply_url, org: j.organizations?.acronym })) || [];
  const examNotifUrls = exams?.map(e => ({ id: e.id, title: e.title, notif: e.official_notification_url, apply: e.official_website_url, org: e.organizations?.acronym })) || [];

  console.log('\n--- Sample Job Notification & Apply URLs (First 25) ---');
  jobNotifUrls.slice(0, 25).forEach((j, i) => {
    console.log(`[${i+1}] [${j.org}] ${j.title.slice(0, 40)}`);
    console.log(`    Notif: ${j.notif}`);
    console.log(`    Apply: ${j.apply}`);
  });

  // Let's test HTTP status of 30 distinct URLs
  console.log('\n--- Testing Live HTTP Status of 20 URLs ---');
  const urlsToTest = [
    ...jobNotifUrls.map(j => ({ type: 'Job Notif', url: j.notif, title: j.title })),
    ...jobNotifUrls.map(j => ({ type: 'Job Apply', url: j.apply, title: j.title })),
  ].filter(u => u.url).slice(0, 20);

  for (const item of urlsToTest) {
    try {
      const controller = new AbortController();
      const tid = setTimeout(() => controller.abort(), 6000);
      const res = await fetch(item.url, {
        method: 'HEAD',
        signal: controller.signal,
        headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)' }
      });
      clearTimeout(tid);
      console.log(`HTTP ${res.status} | [${item.type}] ${item.url}`);
    } catch (e) {
      console.log(`FAIL ${e.message} | [${item.type}] ${item.url}`);
    }
  }
}

inspectUrls().catch(console.error);
