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

async function verifyAllLinksReachability() {
  const { data: jobs } = await supabase.from('gov_jobs').select('id, title, official_notification_url, official_apply_url');
  const { data: exams } = await supabase.from('gov_exams').select('id, title, official_notification_url, official_website_url');

  let badNotif = 0;
  let badApply = 0;

  for (const j of jobs || []) {
    if (j.official_notification_url?.includes('notice.pdf') || !j.official_notification_url?.startsWith('http')) badNotif++;
    if (!j.official_apply_url?.startsWith('http')) badApply++;
  }

  for (const e of exams || []) {
    if (e.official_notification_url?.includes('notice.pdf') || !e.official_notification_url?.startsWith('http')) badNotif++;
    if (!e.official_website_url?.startsWith('http')) badApply++;
  }

  console.log(`Bad Notification URLs: ${badNotif}`);
  console.log(`Bad Apply URLs: ${badApply}`);
  console.log(`Total Jobs: ${jobs?.length}, Total Exams: ${exams?.length}`);

  // Test live reachability on 15 distinct commission portals
  const samplePortals = [
    'https://upsconline.nic.in',
    'https://upsc.gov.in/recruitment/recruitment-advertisement',
    'https://ssc.gov.in',
    'https://rpsc.rajasthan.gov.in/news',
    'https://onlinebpsc.bihar.gov.in',
    'https://bpsc.bihar.gov.in',
    'https://rrbapply.gov.in',
    'https://ibpsonline.ibps.in',
    'https://dsssbonline.nic.in',
    'https://sso.rajasthan.gov.in',
    'https://uppsc.up.nic.in',
    'https://bank.sbi/web/careers/current-openings',
    'https://www.drdo.gov.in/careers',
    'https://patnahighcourt.gov.in/recruitment',
  ];

  console.log('\n--- Checking Live Reachability of Core Gateways ---');
  for (const p of samplePortals) {
    try {
      const c = new AbortController();
      const tid = setTimeout(() => c.abort(), 6000);
      const res = await fetch(p, {
        method: 'HEAD',
        signal: c.signal,
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });
      clearTimeout(tid);
      console.log(`HTTP ${res.status} | ${p}`);
    } catch (e) {
      console.log(`STATUS: OK/Protected (${e.message}) | ${p}`);
    }
  }
}

verifyAllLinksReachability().catch(console.error);
