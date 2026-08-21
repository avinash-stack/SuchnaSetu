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

async function inspectSchema() {
  const { data: sampleExam } = await supabase.from('gov_exams').select('*').limit(1);
  const { data: sampleJob } = await supabase.from('gov_jobs').select('*').limit(1);

  console.log('Exam Columns:', Object.keys(sampleExam?.[0] || {}));
  console.log('Job Columns:', Object.keys(sampleJob?.[0] || {}));

  // Check how many exams have syllabus / answer key data
  const { data: allExams } = await supabase.from('gov_exams').select('id, title, official_syllabus_url, answer_key_url, official_notification_url, syllabus_data, official_website_url');
  
  let withSyllabusUrl = 0;
  let withAnswerKeyUrl = 0;
  allExams?.forEach(e => {
    if (e.official_syllabus_url) withSyllabusUrl++;
    if (e.answer_key_url) withAnswerKeyUrl++;
  });

  console.log(`Total Exams: ${allExams?.length}`);
  console.log(`Exams with official_syllabus_url: ${withSyllabusUrl}`);
  console.log(`Exams with answer_key_url: ${withAnswerKeyUrl}`);
}

inspectSchema().catch(console.error);
