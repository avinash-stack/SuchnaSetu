import fs from 'fs';
import path from 'path';

// Parse .env.local
try {
  const envContent = fs.readFileSync(path.resolve('.env.local'), 'utf-8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) {
      let val = match[2].trim();
      if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
      if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
      process.env[match[1].trim()] = val;
    }
  });
} catch {}

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

import { IngestionPipelineEngine } from '../src/modules/ingestion/core/pipeline';
import { createAdminClient } from '../src/lib/supabase/admin';

async function testPipelineSync() {
  console.log('='.repeat(80));
  console.log('TESTING INGESTION PIPELINE EXECUTION (MANUAL & SYNC)');
  console.log('='.repeat(80));

  const supabase = createAdminClient();
  const pipeline = new IngestionPipelineEngine();

  // Test target sources
  const targetCodes = ['bpsc_official_feed', 'rpsc_official_feed', 'sbi_official_feed', 'upsc_exams_feed'];

  const { data: sources, error } = await (supabase.from('import_sources') as any)
    .select('id, code, name, target_module')
    .in('code', targetCodes);

  if (error || !sources || sources.length === 0) {
    console.error('Failed to query import_sources:', error?.message);
    return;
  }

  console.log(`Found ${sources.length} test sources in database.`);

  for (const src of sources) {
    console.log(`\n>>> Executing Pipeline for: ${src.name} [${src.code}] (${src.target_module})`);
    
    // Create job record
    const { data: job, error: jobErr } = await (supabase.from('import_jobs') as any)
      .insert({
        source_id: src.id,
        trigger_type: 'manual',
        status: 'running',
        started_at: new Date().toISOString()
      })
      .select('id')
      .single();

    if (jobErr || !job) {
      console.error(`Failed to create job: ${jobErr?.message}`);
      continue;
    }

    try {
      const stats = await pipeline.executeJob(job.id);
      console.log(`  ✅ Pipeline Job Completed (${job.id}):`);
      console.log(`     - Extracted: ${stats.totalExtracted}`);
      console.log(`     - Inserted:  ${stats.totalInserted}`);
      console.log(`     - Updated:   ${stats.totalUpdated}`);
      console.log(`     - Skipped:   ${stats.totalSkipped}`);
      console.log(`     - Failed:    ${stats.totalFailed}`);
    } catch (err: any) {
      console.error(`  ❌ Pipeline Job Failed: ${err.message}`);
    }
  }

  console.log('\n' + '='.repeat(80));
  console.log('PIPELINE SYNC TEST COMPLETED');
  console.log('='.repeat(80));
}

testPipelineSync().catch(console.error);
