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

async function checkSources() {
  const { data: sources } = await supabase.from('import_sources').select('*');
  console.log(`Total Import Sources: ${sources?.length}`);
  sources?.forEach(s => {
    console.log(`[${s.code.padEnd(20)}] [${s.target_module.padEnd(10)}] [Adapter: ${(s.adapter_key || 'N/A').padEnd(20)}] Enabled: ${s.is_enabled}`);
  });
}

checkSources().catch(console.error);
