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

async function testSelect() {
  const slug = 'upsc-specialist-grade-iii-assistant-professor-nephrology-cardiology-neurology-082026';
  const { data, error } = await supabase
    .from('gov_jobs')
    .select(`
      *,
      organization:organizations(*),
      department:departments(*),
      category:categories(*),
      qualification:qualifications(*),
      state:states_uts(*),
      vacancies:job_vacancies(*),
      important_dates:job_important_dates(*),
      eligibility:job_eligibility(*),
      official_documents:job_official_documents(*),
      translations:gov_job_translations(*)
    `)
    .eq('slug', slug)
    .single();

  console.log('Query with gov_job_translations:');
  console.log('Error:', error);
  console.log('Data found:', !!data);
}

testSelect().catch(console.error);
