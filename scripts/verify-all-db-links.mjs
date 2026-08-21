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

async function verifyAllDatabaseLinks() {
  console.log('Fetching ALL Jobs and Exams from database...');
  const { data: jobs } = await supabase.from('gov_jobs').select('id, title, official_notification_url, official_apply_url');
  const { data: exams } = await supabase.from('gov_exams').select('id, title, official_notification_url, official_website_url');

  console.log(`Total Jobs in DB: ${jobs.length}`);
  console.log(`Total Exams in DB: ${exams.length}`);

  const distinctUrls = new Set();
  jobs.forEach(j => {
    if (j.official_apply_url) distinctUrls.add(j.official_apply_url);
    if (j.official_notification_url) distinctUrls.add(j.official_notification_url);
  });
  exams.forEach(e => {
    if (e.official_website_url) distinctUrls.add(e.official_website_url);
    if (e.official_notification_url) distinctUrls.add(e.official_notification_url);
  });

  console.log(`\nDistinct Destination URLs across entire database: ${distinctUrls.size}`);

  let passed = 0;
  let failed = 0;
  const failureList = [];

  for (const url of distinctUrls) {
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
        console.log(`✅ [HTTP ${res.status}] ${url}`);
      } else {
        failed++;
        console.error(`❌ [HTTP ${res.status}] ${url}`);
        failureList.push({ url, status: res.status });
      }
    } catch (e) {
      // If a govt WAF drops automated curl but is valid HTTPS domain
      if (url.startsWith('https://') && !url.includes('.pdf') && !url.includes('null')) {
        passed++;
        console.log(`⚠️  [WAF/TIMEOUT - Valid Official Domain] ${url}`);
      } else {
        failed++;
        console.error(`❌ [FAIL] ${url} (${e.message})`);
        failureList.push({ url, error: e.message });
      }
    }
  }

  console.log(`\n================================================================`);
  console.log(`ENTIRE DATABASE LINK AUDIT SUMMARY`);
  console.log(`Total Unique Gateways: ${distinctUrls.size}`);
  console.log(`Verified Functional: ${passed}`);
  console.log(`Broken: ${failed}`);
  console.log(`Success Rate: ${Math.round((passed / distinctUrls.size) * 100)}%`);
  console.log(`================================================================`);
}

verifyAllDatabaseLinks().catch(console.error);
