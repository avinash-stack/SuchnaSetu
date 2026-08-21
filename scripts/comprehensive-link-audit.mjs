import http from 'http';
import https from 'https';
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

async function checkUrl(url) {
  if (!url || !url.startsWith('http')) return { ok: false, status: 0, reason: 'Invalid or empty URL' };
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      },
      signal: controller.signal,
      redirect: 'follow',
    });
    clearTimeout(timeout);
    // Many government servers return 403 or 401 to bots/scripts but work in browsers
    const isWorking = res.status >= 200 && res.status < 400 || res.status === 403 || res.status === 401;
    return { ok: isWorking, status: res.status };
  } catch (err) {
    return { ok: false, status: 0, reason: err.message };
  }
}

async function runComprehensiveAudit() {
  console.log('--- Fetching all Jobs, Exams, and Organizations ---');
  const { data: jobs } = await supabase.from('gov_jobs').select('id, title, slug, official_apply_url, official_notification_url, organization_id, organizations(name, acronym, website_url)');
  const { data: exams } = await supabase.from('gov_exams').select('id, title, slug, official_notification_url, official_website_url, organization_id, organizations(name, acronym, website_url)');

  console.log(`Found ${jobs?.length} Jobs and ${exams?.length} Exams.`);

  // Collect all distinct URLs to check
  const urlMap = new Map();

  jobs?.forEach(j => {
    if (j.official_apply_url) {
      if (!urlMap.has(j.official_apply_url)) urlMap.set(j.official_apply_url, []);
      urlMap.get(j.official_apply_url).push({ type: 'job_apply', id: j.id, title: j.title, org: j.organizations?.acronym });
    }
    if (j.official_notification_url) {
      if (!urlMap.has(j.official_notification_url)) urlMap.set(j.official_notification_url, []);
      urlMap.get(j.official_notification_url).push({ type: 'job_notif', id: j.id, title: j.title, org: j.organizations?.acronym });
    }
  });

  exams?.forEach(e => {
    if (e.official_website_url) {
      if (!urlMap.has(e.official_website_url)) urlMap.set(e.official_website_url, []);
      urlMap.get(e.official_website_url).push({ type: 'exam_web', id: e.id, title: e.title, org: e.organizations?.acronym });
    }
    if (e.official_notification_url) {
      if (!urlMap.has(e.official_notification_url)) urlMap.set(e.official_notification_url, []);
      urlMap.get(e.official_notification_url).push({ type: 'exam_notif', id: e.id, title: e.title, org: e.organizations?.acronym });
    }
  });

  console.log(`Unique URLs to test: ${urlMap.size}`);

  const brokenUrls = [];
  const validUrls = [];
  const entries = Array.from(urlMap.entries());

  for (let i = 0; i < entries.length; i += 10) {
    const batch = entries.slice(i, i + 10);
    await Promise.all(batch.map(async ([url, usages]) => {
      const result = await checkUrl(url);
      if (!result.ok || result.status === 404 || result.status >= 500) {
        brokenUrls.push({ url, status: result.status, reason: result.reason, usages });
        console.log(`❌ [FAIL ${result.status || 'ERR'}] ${url} (${usages[0]?.org}) - ${result.reason || ''}`);
      } else {
        validUrls.push({ url, status: result.status });
      }
    }));
  }

  console.log(`\nAudit Complete: ${validUrls.length} Working, ${brokenUrls.length} Broken/Failing.`);

  // Write broken URLs report
  fs.writeFileSync('scripts/broken-links-report.json', JSON.stringify(brokenUrls, null, 2));
  console.log('Report saved to scripts/broken-links-report.json');
}

runComprehensiveAudit().catch(console.error);
