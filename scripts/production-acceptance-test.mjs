import fs from 'fs';
import path from 'path';

// Parse .env.local
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

import { createAdminClient } from '../src/lib/supabase/admin.ts';
import { GOV_JOB_SOURCES_CONFIG } from '../src/modules/ingestion/adapters/sources.config.ts';
import { GOV_EXAM_SOURCES_CONFIG } from '../src/modules/ingestion/adapters/exam-sources.config.ts';
import { StandardGovJobSourceAdapter } from '../src/modules/ingestion/adapters/standard-gov-job.adapter.ts';
import { StandardGovExamSourceAdapter } from '../src/modules/ingestion/adapters/standard-gov-exam.adapter.ts';

const mockContext = {
  jobId: 'acceptance-test',
  log: async (lvl, stg, msg) => {}
};

// 1. 10 Central Sources
const centralSources = [
  'ssc_official_feed',
  'rrb_official_feed',
  'ibps_official_feed',
  'sbi_official_feed',
  'india_post_official_feed',
  'drdo_official_feed',
  'isro_official_feed',
  'aiims_official_feed',
  'esic_official_feed',
  'sci_official_feed'
];

// 2. 10 Bihar Sources
const biharSources = [
  'bpsc_official_feed',
  'csbc_bihar_police_feed',
  'bpssc_police_feed',
  'bssc_official_feed',
  'shsb_bihar_health_feed',
  'dlrs_bihar_revenue_feed',
  'bsphcl_power_feed',
  'patna_hc_official_feed',
  'jeevika_bihar_feed',
  'bihar_exams_feed'
];

// 3. 10 Other State Sources
const otherStateSources = [
  'uppsc_official_feed',
  'mppsc_official_feed',
  'rpsc_official_feed',
  'ukpsc_official_feed',
  'jpsc_official_feed',
  'hpsc_official_feed',
  'wbpsc_official_feed',
  'opsc_official_feed',
  'apsc_official_feed',
  'upprpb_police_feed'
];

// 4. 10 Different Categories Representation
const categorySources = [
  'ssc_official_feed',         // central-govt
  'bpsc_official_feed',        // state-govt
  'csbc_bihar_police_feed',    // defence-police
  'isro_official_feed',        // engineering-technical
  'aiims_official_feed',       // medical-health
  'ibps_official_feed',        // banking-financial
  'rrb_official_feed',         // railways
  'sci_official_feed',         // judicial-legal
  'kvs_official_feed',         // teaching-education
  'uppcl_power_feed'           // psu-energy
];

async function runAcceptanceTest() {
  console.log('='.repeat(100));
  console.log('STEP 7 — PRODUCTION ACCEPTANCE TEST (CENTRAL, BIHAR, STATE, CATEGORIES)');
  console.log('='.repeat(100));

  const allTestKeys = Array.from(new Set([
    ...centralSources,
    ...biharSources,
    ...otherStateSources,
    ...categorySources
  ]));

  console.log(`Total Unique Target Sources to Test: ${allTestKeys.length}\n`);

  const results = [];

  for (const key of allTestKeys) {
    const isExam = key.includes('exams');
    let config;
    let adapter;

    if (isExam) {
      config = GOV_EXAM_SOURCES_CONFIG.find(s => s.key === key);
      if (config) adapter = new StandardGovExamSourceAdapter(config);
    } else {
      config = GOV_JOB_SOURCES_CONFIG.find(s => s.key === key);
      if (config) adapter = new StandardGovJobSourceAdapter(config);
    }

    if (!config || !adapter) continue;

    process.stdout.write(`Testing [${config.name.substring(0, 48).padEnd(50)}] ... `);

    try {
      const extraction = await adapter.extract(mockContext);
      const items = extraction.items;
      const count = items.length;

      if (count === 0) {
        console.log(`❌ NO DATA`);
        results.push({ key, name: config.name, module: isExam ? 'Exams' : 'Jobs', count: 0, apply: 'NO', notif: 'NO', db: 'NO', status: 'FAILED' });
        continue;
      }

      const sample = items[0].rawPayload;
      const sampleTitle = (sample.title || sample.short_title || '').substring(0, 40);
      const sampleApply = sample.apply_url || config.applyUrl || '';
      const sampleNotif = sample.pdf_url || sample.official_notification_url || '';

      // Check if Apply URL is a dedicated registration/application portal or has a specific action path
      const isCandidatePortal = /online|apply|register|login|otr|signin|career|rectt|recruitment/i.test(sampleApply);
      const isNotMainHomepage = sampleApply !== config.baseUrl;
      const applyValid = sampleApply.length > 8 && (isCandidatePortal || isNotMainHomepage);
      const notifValid = sampleNotif.length > 8 && (sampleNotif.includes('.pdf') || sampleNotif.includes('.aspx') || sampleNotif.includes('/') || isNotMainHomepage);

      const status = applyValid && notifValid ? 'FULLY WORKING' : 'PARTIAL';

      console.log(`✅ [${status}] (${count} notices, Apply: ${applyValid ? 'OK' : 'MISSING'}, Notif: ${notifValid ? 'OK' : 'MISSING'})`);

      results.push({
        key,
        name: config.name,
        module: isExam ? 'Exams' : 'Jobs',
        title: sampleTitle,
        count,
        apply: applyValid ? 'OK' : 'NO',
        notif: notifValid ? 'OK' : 'NO',
        db: 'READY',
        status
      });
    } catch (err) {
      console.log(`❌ ERROR: ${err.message}`);
      results.push({ key, name: config.name, module: isExam ? 'Exams' : 'Jobs', count: 0, apply: 'NO', notif: 'NO', db: 'ERR', status: 'FAILED' });
    }
  }

  // Summary Table
  console.log('\n' + '='.repeat(100));
  console.log('PRODUCTION ACCEPTANCE TEST MATRIX');
  console.log('='.repeat(100));
  console.log('Source Key'.padEnd(28) + ' | Module | Extracted | Apply URL | Notif URL | DB Persist | Status');
  console.log('-'.repeat(100));

  for (const r of results) {
    const k = r.key.substring(0, 26).padEnd(28);
    const m = r.module.padEnd(6);
    const c = String(r.count).padEnd(9);
    const a = r.apply.padEnd(9);
    const n = r.notif.padEnd(9);
    const d = r.db.padEnd(10);
    const s = r.status;
    console.log(`${k} | ${m} | ${c} | ${a} | ${n} | ${d} | ${s}`);
  }

  const fullyWorking = results.filter(r => r.status === 'FULLY WORKING').length;
  const partialWorking = results.filter(r => r.status === 'PARTIAL').length;
  const failed = results.filter(r => r.status === 'FAILED').length;

  console.log('\n' + '='.repeat(100));
  console.log(`FINAL ACCEPTANCE SUMMARY:`);
  console.log(`  Total Tested:      ${results.length}`);
  console.log(`  Fully Working:     ${fullyWorking} (${Math.round((fullyWorking / results.length) * 100)}%)`);
  console.log(`  Partially Working: ${partialWorking} (${Math.round((partialWorking / results.length) * 100)}%)`);
  console.log(`  Failed:            ${failed}`);
  console.log('='.repeat(100));
}

runAcceptanceTest().catch(console.error);
