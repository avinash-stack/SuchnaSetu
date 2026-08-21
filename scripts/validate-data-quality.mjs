#!/usr/bin/env node

/**
 * Phase 1 Data Quality Validation Script
 * 
 * Validates that fabrication has been eliminated from the ingestion pipeline.
 * Checks source configs, normalizer, and pipeline for remaining data fabrication.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');

const FABRICATION_PATTERNS = [
  'Pay Scale as per applicable government rules',
  'Written Examination / Computer Based Test followed by Document Verification.',
  'Age relaxations applicable as per government norms for SC/ST/OBC/PwD/Ex-Servicemen.',
  'Graduate degree from a recognized University or equivalent (Refer to official notice for details).',
  "Bachelor's Degree or minimum prescribed qualification.",
  'Standard relaxation for SC/ST/OBC/PwD as per government rules.',
  'As per official examination gazette',
  'totalVacancies: 100',
  'totalPosts: 100',
  'Math.floor(totalPosts * 0.4)',
  '|| "18"',
  '|| "35"',
  '|| "32"',
  'minAge || 18',
  'maxAge || 32',
];

const FILES_TO_CHECK = [
  'src/modules/ingestion/adapters/standard-gov-job.adapter.ts',
  'src/modules/ingestion/adapters/standard-gov-exam.adapter.ts',
  'src/modules/ingestion/core/pipeline.ts',
  'src/modules/jobs/components/job-detail-view.tsx',
  'src/modules/exams/components/exam-detail-view.tsx',
];

let totalIssues = 0;
let totalPassed = 0;

console.log('='.repeat(80));
console.log('PHASE 1 DATA QUALITY VALIDATION');
console.log('='.repeat(80));

for (const relPath of FILES_TO_CHECK) {
  const fullPath = path.join(PROJECT_ROOT, relPath);
  if (!fs.existsSync(fullPath)) { console.log(`⚠️  SKIP: ${relPath}`); continue; }
  const content = fs.readFileSync(fullPath, 'utf-8');
  let fileIssues = 0;
  for (const pattern of FABRICATION_PATTERNS) {
    if (content.includes(pattern)) {
      if (fileIssues === 0) console.log(`❌ FAIL: ${relPath}`);
      console.log(`   └─ Found: "${pattern.substring(0, 60)}"`);
      fileIssues++;
    }
  }
  if (fileIssues === 0) { console.log(`✅ PASS: ${relPath}`); totalPassed++; }
  else totalIssues += fileIssues;
}

console.log('\n📊 STRUCTURAL CHECKS:');
const sc = fs.readFileSync(path.join(PROJECT_ROOT, 'src/modules/ingestion/adapters/sources.config.ts'), 'utf-8');
const checks = [
  [sc.includes('min_age?: number'), 'Template.min_age field'],
  [sc.includes('max_age?: number'), 'Template.max_age field'],
  [sc.includes('post_wise_vacancies?: PostWiseVacancy[]'), 'Template.post_wise_vacancies'],
  [(sc.match(/min_age: \d+/g) || []).length >= 15, `Enriched sources: ${(sc.match(/min_age: \d+/g) || []).length}/15`],
  [fs.readFileSync(path.join(PROJECT_ROOT, 'src/modules/ingestion/adapters/standard-gov-job.adapter.ts'), 'utf-8').includes('parseAgeLimits'), 'parseAgeLimits method'],
  [!fs.readFileSync(path.join(PROJECT_ROOT, 'src/modules/ingestion/core/pipeline.ts'), 'utf-8').includes('Stage I: Preliminary Screening / CBT'), 'No generic exam stages'],
];
let sp = 0;
for (const [ok, label] of checks) { console.log(`  ${ok ? '✅' : '❌'} ${label}`); if (ok) sp++; }

console.log(`\nRESULTS: ${totalPassed}/${FILES_TO_CHECK.length} files clean | ${sp}/${checks.length} structural | ${totalIssues} issues`);
if (totalIssues > 0 || sp < checks.length) process.exit(1);
console.log('🎉 All Phase 1 checks PASSED!');
