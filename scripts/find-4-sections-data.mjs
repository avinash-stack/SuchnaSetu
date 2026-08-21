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

async function find4SectionsData() {
  console.log('--- 1. TODAY\'S UPDATES CHECK ---');
  // Today's updates (published or created recently)
  const today = new Date();
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString();

  const { data: todayJobs } = await supabase.from('gov_jobs').select('id, title, slug, published_at, created_at, official_apply_url, organizations(name, acronym)').gte('published_at', startOfDay).limit(5);
  const { data: todayExams } = await supabase.from('gov_exams').select('id, title, slug, published_at, created_at, official_website_url, organizations(name, acronym)').gte('published_at', startOfDay).limit(5);
  console.log(`Today's Jobs: ${todayJobs?.length}, Today's Exams: ${todayExams?.length}`);

  console.log('--- 2. COMING SOON / UPCOMING CHECK ---');
  const nowIso = new Date().toISOString();
  const { data: upcomingEvents } = await supabase
    .from('gov_jobs')
    .select('id, title, slug, application_start_date, application_end_date, organizations(name, acronym)')
    .gt('application_start_date', nowIso)
    .order('application_start_date', { ascending: true })
    .limit(10);
  console.log(`Jobs with future start date: ${upcomingEvents?.length}`);

  console.log('--- 3. ANSWER KEYS CHECK ---');
  // Look for answer keys in titles or status or result records
  const { data: answerKeyExams } = await supabase
    .from('gov_exams')
    .select('id, title, slug, status, official_notification_url, official_website_url, published_at, organizations(name, acronym)')
    .or('title.ilike.%Answer Key%,title.ilike.%Answerkey%,title.ilike.%Key Challenge%,status.eq.answer_key_released')
    .limit(10);
  console.log(`Exams matching Answer Key: ${answerKeyExams?.length}`);
  answerKeyExams?.forEach(e => console.log(`  - [${e.organizations?.acronym}] ${e.title}`));

  const { data: answerKeyJobs } = await supabase
    .from('gov_jobs')
    .select('id, title, slug, status, official_notification_url, official_apply_url, published_at, organizations(name, acronym)')
    .or('title.ilike.%Answer Key%,title.ilike.%Answerkey%,title.ilike.%Key Challenge%')
    .limit(10);
  console.log(`Jobs matching Answer Key: ${answerKeyJobs?.length}`);

  console.log('--- 4. SYLLABUS CHECK ---');
  const { data: syllabusExams } = await supabase
    .from('gov_exams')
    .select('id, title, slug, syllabus_summary, pattern_description, marking_scheme, official_notification_url, organizations(name, acronym)')
    .not('syllabus_summary', 'is', null)
    .limit(10);
  console.log(`Exams with Syllabus details: ${syllabusExams?.length}`);
  syllabusExams?.forEach(e => console.log(`  - [${e.organizations?.acronym}] ${e.title} -> ${e.syllabus_summary?.slice(0, 60)}...`));
}

find4SectionsData().catch(console.error);
