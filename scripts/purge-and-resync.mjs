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

async function purgeAndResync() {
  console.log('1. Purging existing gov_jobs and gov_exams records...');

  // Delete dependencies first
  await supabase.from('gov_job_translations').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('gov_exam_translations').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('job_vacancies').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('gov_jobs').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('gov_exams').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  console.log('✅ Purge complete.');

  console.log('2. Checking table counts...');
  const { count: jobCount } = await supabase.from('gov_jobs').select('*', { count: 'exact', head: true });
  const { count: examCount } = await supabase.from('gov_exams').select('*', { count: 'exact', head: true });
  console.log(`Current DB State: ${jobCount} Jobs, ${examCount} Exams.`);
}

purgeAndResync().catch(console.error);
