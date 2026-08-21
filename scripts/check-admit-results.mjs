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

async function checkAdmitCardsAndResults() {
  const { data: exams } = await supabase
    .from('gov_exams')
    .select('id, title, slug, exam_code, exam_date_start, exam_date_end, official_website_url, official_notification_url, exam_stages, organizations(name, acronym, state_code)')
    .limit(10);

  console.log('Sample Exams with stages:', JSON.stringify(exams?.[0], null, 2));

  const { data: jobDocs } = await supabase
    .from('job_official_documents')
    .select('id, job_id, title, document_type, file_url, is_verified')
    .limit(10);

  console.log('Job official documents count:', jobDocs?.length);
  if (jobDocs?.length) console.log('Sample doc:', jobDocs[0]);
}

checkAdmitCardsAndResults().catch(console.error);
