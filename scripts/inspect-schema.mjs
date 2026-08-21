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
  const { data: orgs } = await supabase.from('organizations').select('id, name, slug, acronym, state_code').limit(5);
  const { data: jobs } = await supabase.from('gov_jobs').select('*').limit(3);
  const { data: exams } = await supabase.from('gov_exams').select('*').limit(3);
  const { data: sources } = await supabase.from('import_sources').select('*').limit(3);
  const { data: categories } = await supabase.from('categories').select('id, name, slug');

  console.log('Sample Org:', orgs?.[0]);
  console.log('Sample Job:', jobs?.[0]);
  console.log('Sample Exam:', exams?.[0]);
  console.log('Sample Source:', sources?.[0]);
}

inspectSchema().catch(console.error);
