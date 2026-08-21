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

async function inspectExamsAndJobsContent() {
  const { data: exams } = await supabase.from('gov_exams').select('id, title, slug, status, syllabus_summary, pattern_description, marking_scheme, source_metadata, official_notification_url, published_at, created_at, organizations(name, acronym)').limit(10);
  console.log('Sample Exams:', JSON.stringify(exams, null, 2));

  // Check upcoming dates for Coming Soon
  const { data: upcomingJobs } = await supabase
    .from('gov_jobs')
    .select('id, title, slug, application_start_date, application_end_date, published_at, organizations(name, acronym)')
    .order('application_start_date', { ascending: true })
    .limit(10);
  console.log('Sample Jobs with Dates:', JSON.stringify(upcomingJobs, null, 2));
}

inspectExamsAndJobsContent().catch(console.error);
