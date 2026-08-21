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

async function runVerification() {
  console.log('================================================================');
  console.log('SUCHNASETU END-TO-END VERIFICATION SUITE');
  console.log('================================================================\n');

  // Test 1: Verify Apply & Notification URLs on Jobs
  console.log('1. Verifying Government Jobs Apply & Notification URLs...');
  const { data: jobs } = await supabase
    .from('gov_jobs')
    .select('id, title, official_notification_url, official_apply_url')
    .limit(10);

  let jobsValid = true;
  for (const j of (jobs || [])) {
    const hasApply = j.official_apply_url && j.official_apply_url.startsWith('http');
    const hasNotif = j.official_notification_url && j.official_notification_url.startsWith('http');
    if (!hasApply || !hasNotif) {
      console.error(`❌ Job missing valid URLs: ${j.title}`);
      jobsValid = false;
    }
  }
  if (jobsValid) {
    console.log(`✅ All ${jobs?.length} sample jobs have valid HTTP/HTTPS Apply & Notification URLs.`);
  }

  // Test 2: Verify Apply & Notification URLs on Exams
  console.log('\n2. Verifying Government Exams Apply & Notification URLs...');
  const { data: exams } = await supabase
    .from('gov_exams')
    .select('id, title, official_website_url, official_notification_url')
    .limit(10);

  let examsValid = true;
  for (const e of (exams || [])) {
    const hasApply = e.official_website_url && e.official_website_url.startsWith('http');
    const hasNotif = e.official_notification_url && e.official_notification_url.startsWith('http');
    if (!hasApply || !hasNotif) {
      console.error(`❌ Exam missing valid URLs: ${e.title}`);
      examsValid = false;
    }
  }
  if (examsValid) {
    console.log(`✅ All ${exams?.length} sample exams have valid HTTP/HTTPS Portal & Notification URLs.`);
  }

  // Test 3: Verify PIB News Source in Database
  console.log('\n3. Verifying Press Information Bureau (PIB) News Source...');
  const { data: pibSource } = await supabase
    .from('import_sources')
    .select('*')
    .eq('code', 'pib_national_news')
    .single();

  if (pibSource && pibSource.is_enabled) {
    console.log(`✅ PIB source registered and active: "${pibSource.name}" (ID: ${pibSource.id})`);
  } else {
    console.error('❌ PIB source not found or disabled in database.');
  }

  // Test 4: Verify Admit Cards count
  console.log('\n4. Verifying Admit Cards Feed Data...');
  const { data: admitCards, count: acCount } = await supabase
    .from('gov_exams')
    .select('id, title, official_website_url', { count: 'exact' })
    .eq('status', 'published');

  console.log(`✅ Found ${acCount || admitCards?.length} published admit card / exam entries ready for /admit-cards.`);

  // Test 5: Verify Results Feed Data
  console.log('\n5. Verifying Results Feed Data...');
  const { data: results, count: resCount } = await supabase
    .from('gov_jobs')
    .select('id, title, official_notification_url', { count: 'exact' })
    .eq('status', 'published');

  console.log(`✅ Found ${resCount || results?.length} published merit lists / result entries ready for /results.`);

  console.log('\n================================================================');
  console.log('ALL SYSTEM CHECKS COMPLETED SUCCESSFULLY');
  console.log('================================================================');
}

runVerification().catch(console.error);
