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

async function inspectOrgPortals() {
  const { data: orgs } = await supabase
    .from('organizations')
    .select('id, name, acronym, website_url, state_code');

  console.log(`Loaded ${orgs?.length} organizations from DB.`);

  const { data: sources } = await supabase
    .from('import_sources')
    .select('id, code, name, base_url, target_module, organization_id');

  console.log(`Loaded ${sources?.length} import sources.`);

  // Map each org to its official recruitment portal and application gateway
  const orgMap = {};
  for (const o of orgs || []) {
    orgMap[o.id] = o;
  }

  // Count invalid/placeholder URLs in gov_jobs
  const { data: jobs } = await supabase
    .from('gov_jobs')
    .select('id, title, official_notification_url, official_apply_url, organization_id');

  let placeholderNotifCount = 0;
  let placeholderApplyCount = 0;

  for (const j of jobs || []) {
    if (j.official_notification_url?.includes('notice.pdf') || j.official_notification_url?.includes('advt.pdf') || j.official_notification_url?.includes('CRPD_PO_2026')) {
      placeholderNotifCount++;
    }
  }

  console.log(`Found ${placeholderNotifCount} jobs with placeholder/guessed PDF URLs!`);
}

inspectOrgPortals().catch(console.error);
