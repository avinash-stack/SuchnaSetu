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

async function backup() {
  console.log('Backing up current gov_jobs, gov_exams, translations, and vacancies...');
  const { data: jobs } = await supabase.from('gov_jobs').select('*');
  const { data: exams } = await supabase.from('gov_exams').select('*');
  const { data: jobTrans } = await supabase.from('gov_job_translations').select('*');
  const { data: examTrans } = await supabase.from('gov_exam_translations').select('*');
  const { data: vacancies } = await supabase.from('job_vacancies').select('*');

  const backupData = {
    timestamp: new Date().toISOString(),
    jobsCount: jobs?.length || 0,
    examsCount: exams?.length || 0,
    jobs,
    exams,
    jobTrans,
    examTrans,
    vacancies,
  };

  fs.mkdirSync('data', { recursive: true });
  fs.writeFileSync('data/backup-gov-jobs-exams.json', JSON.stringify(backupData, null, 2));
  console.log(`✅ Backup saved to data/backup-gov-jobs-exams.json (${jobs?.length} jobs, ${exams?.length} exams)`);
}

backup().catch(console.error);
