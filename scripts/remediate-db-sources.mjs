import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { GOV_JOB_SOURCES_CONFIG } from '../src/modules/ingestion/adapters/sources.config.ts';
import { GOV_EXAM_SOURCES_CONFIG } from '../src/modules/ingestion/adapters/exam-sources.config.ts';

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

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function remediateDatabaseSources() {
  console.log('='.repeat(80));
  console.log('UPDATING IMPORT_SOURCES IN DATABASE WITH CORRECT BASE URLS & PATHS');
  console.log('='.repeat(80));

  // 1. Update Job Sources
  for (const src of GOV_JOB_SOURCES_CONFIG) {
    const { data, error } = await supabase
      .from('import_sources')
      .update({
        base_url: src.baseUrl,
        config: {
          recruitmentPath: src.recruitmentPath,
          applyUrl: src.applyUrl,
          organizationSlug: src.organizationSlug,
          organizationName: src.organizationName,
          jurisdiction: src.jurisdiction,
          stateCode: src.stateCode,
          defaultCategory: src.defaultCategory
        }
      })
      .eq('code', src.key);

    if (error) {
      console.error(`Error updating ${src.key}:`, error.message);
    } else {
      console.log(`✓ Updated import_source [${src.key}] -> ${src.baseUrl}${src.recruitmentPath}`);
    }
  }

  // 2. Update Exam Sources
  for (const src of GOV_EXAM_SOURCES_CONFIG) {
    const { data, error } = await supabase
      .from('import_sources')
      .update({
        base_url: src.baseUrl,
        config: {
          examinationPath: src.examinationPath,
          applyUrl: src.applyUrl,
          organizationSlug: src.organizationSlug,
          organizationName: src.organizationName,
          jurisdiction: src.jurisdiction,
          stateCode: src.stateCode,
          defaultCategory: src.defaultCategory
        }
      })
      .eq('code', src.key);

    if (error) {
      console.error(`Error updating ${src.key}:`, error.message);
    } else {
      console.log(`✓ Updated import_source [${src.key}] -> ${src.baseUrl}${src.examinationPath}`);
    }
  }

  console.log('Done updating import_sources.');
}

remediateDatabaseSources().catch(console.error);
