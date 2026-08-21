import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import { GOV_JOB_SOURCES_CONFIG } from '../src/modules/ingestion/adapters/sources.config.js';
import { GOV_EXAM_SOURCES_CONFIG } from '../src/modules/ingestion/adapters/exam-sources.config.js';

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

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Build lookup maps for canonical job notices and exams
const jobNoticeMap = new Map();
for (const src of GOV_JOB_SOURCES_CONFIG) {
  for (const n of src.canonicalNotices) {
    if (n.advertisement_number) {
      jobNoticeMap.set(n.advertisement_number.toLowerCase(), {
        applyUrl: n.apply_url || src.applyUrl,
        pdfUrl: n.pdf_url,
        orgSlug: src.organizationSlug,
        sourceApplyUrl: src.applyUrl
      });
    }
  }
}

const examMap = new Map();
for (const src of GOV_EXAM_SOURCES_CONFIG) {
  for (const e of src.canonicalExams) {
    if (e.exam_code) {
      examMap.set(e.exam_code.toLowerCase(), {
        applyUrl: e.official_website_url || src.applyUrl,
        pdfUrl: e.official_notification_url,
        slug: e.slug
      });
    }
    if (e.slug) {
      examMap.set(e.slug.toLowerCase(), {
        applyUrl: e.official_website_url || src.applyUrl,
        pdfUrl: e.official_notification_url,
        slug: e.slug
      });
    }
  }
}

async function remediate() {
  console.log('================================================================');
  console.log('   SYSTEMIC URL REMEDIATION: JOBS & GOVERNMENT EXAMINATIONS     ');
  console.log('================================================================\n');

  // 1. Remediate gov_jobs
  const { data: jobs, error: jobsErr } = await supabase
    .from('gov_jobs')
    .select('id, title, slug, notification_number, official_apply_url, official_notification_url, organization_id');

  if (jobsErr) {
    console.error('Error querying gov_jobs:', jobsErr);
  } else if (jobs) {
    console.log(`[JOBS] Auditing & Remediating ${jobs.length} records...`);
    let jobsUpdated = 0;

    for (const job of jobs) {
      let targetApplyUrl = job.official_apply_url;
      let targetNotifUrl = job.official_notification_url;
      let needsUpdate = false;

      const advtKey = job.notification_number ? job.notification_number.toLowerCase() : null;
      const canonical = advtKey ? jobNoticeMap.get(advtKey) : null;

      if (canonical) {
        if (canonical.applyUrl && job.official_apply_url !== canonical.applyUrl) {
          targetApplyUrl = canonical.applyUrl;
          needsUpdate = true;
        }
        if (canonical.pdfUrl && job.official_notification_url !== canonical.pdfUrl) {
          targetNotifUrl = canonical.pdfUrl;
          needsUpdate = true;
        }
      }

      // Check if current apply URL is a generic homepage
      if (targetApplyUrl && /^https?:\/\/[^\/]+\/?$/.test(targetApplyUrl)) {
        const isKnownSubdomain = ['online', 'apply', 'otr', 'sso', 'rac.gov.in', 'upsconline.nic.in'].some(k => targetApplyUrl.includes(k));
        if (!isKnownSubdomain) {
          targetApplyUrl = null;
          needsUpdate = true;
        }
      }

      if (needsUpdate) {
        await supabase
          .from('gov_jobs')
          .update({
            official_apply_url: targetApplyUrl,
            official_notification_url: targetNotifUrl,
          })
          .eq('id', job.id);

        jobsUpdated++;
        console.log(`  ✓ Updated Job [${job.title.slice(0, 45)}...]`);
        console.log(`    • Apply URL: ${targetApplyUrl || 'NULL'}`);
        console.log(`    • Notif URL: ${targetNotifUrl || 'NULL'}`);
      }
    }
    console.log(`[JOBS] Completed: ${jobsUpdated} records updated.\n`);
  }

  // 2. Remediate gov_exams
  const { data: exams, error: examsErr } = await supabase
    .from('gov_exams')
    .select('id, title, slug, exam_code, official_website_url, official_notification_url, organization_id');

  if (examsErr) {
    console.error('Error querying gov_exams:', examsErr);
  } else if (exams) {
    console.log(`[EXAMS] Auditing & Remediating ${exams.length} records...`);
    let examsUpdated = 0;

    for (const exam of exams) {
      let targetApplyUrl = exam.official_website_url;
      let targetNotifUrl = exam.official_notification_url;
      let needsUpdate = false;

      const codeKey = exam.exam_code ? exam.exam_code.toLowerCase() : null;
      const slugKey = exam.slug ? exam.slug.toLowerCase() : null;
      const canonical = (codeKey && examMap.get(codeKey)) || (slugKey && examMap.get(slugKey));

      if (canonical) {
        if (canonical.applyUrl && exam.official_website_url !== canonical.applyUrl) {
          targetApplyUrl = canonical.applyUrl;
          needsUpdate = true;
        }
        if (canonical.pdfUrl && exam.official_notification_url !== canonical.pdfUrl) {
          targetNotifUrl = canonical.pdfUrl;
          needsUpdate = true;
        }
      }

      // Check if current candidate portal URL is a generic homepage
      if (targetApplyUrl && /^https?:\/\/[^\/]+\/?$/.test(targetApplyUrl)) {
        const isKnownSubdomain = ['online', 'apply', 'otr', 'sso', 'rac.gov.in', 'upsconline.nic.in'].some(k => targetApplyUrl.includes(k));
        if (!isKnownSubdomain) {
          targetApplyUrl = null;
          needsUpdate = true;
        }
      }

      if (needsUpdate) {
        await supabase
          .from('gov_exams')
          .update({
            official_website_url: targetApplyUrl,
            official_notification_url: targetNotifUrl,
          })
          .eq('id', exam.id);

        examsUpdated++;
        console.log(`  ✓ Updated Exam [${exam.title.slice(0, 45)}...]`);
        console.log(`    • Gateway URL: ${targetApplyUrl || 'NULL'}`);
        console.log(`    • Notif URL:   ${targetNotifUrl || 'NULL'}`);
      }
    }
    console.log(`[EXAMS] Completed: ${examsUpdated} records updated.\n`);
  }

  console.log('================================================================');
  console.log('   DATA REMEDIATION SUCCESSFULLY EXECUTED                       ');
  console.log('================================================================\n');
}

remediate().catch(console.error);
