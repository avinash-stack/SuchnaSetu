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

const OPENROUTER_KEY = env.OPENROUTER_API_KEY;

async function callOpenRouter(prompt) {
  if (!OPENROUTER_KEY) {
    console.warn('OPENROUTER_API_KEY not configured.');
    return null;
  }

  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENROUTER_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://suchnasetu.gov.in',
      'X-Title': 'SuchnaSetu Translation Engine',
    },
    body: JSON.stringify({
      model: 'google/gemini-2.5-flash',
      messages: [
        {
          role: 'system',
          content: 'You are an official Indian Government gazette translator. Translate English recruitment notices and exams to Hindi accurately. Return valid JSON only.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.1,
    })
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error('OpenRouter error:', res.status, errText);
    return null;
  }

  const data = await res.json();
  const rawContent = data.choices?.[0]?.message?.content;
  try {
    return JSON.parse(rawContent);
  } catch (e) {
    console.error('Failed to parse JSON response:', rawContent);
    return null;
  }
}

async function backfillJobs() {
  console.log('\n--- Backfilling Active Gov Jobs to Hindi ---');
  const { data: jobs, error } = await supabase
    .from('gov_jobs')
    .select('id, title, post_name, qualification_summary, age_limit_summary, pay_scale_details, selection_process')
    .order('created_at', { ascending: false })
    .limit(20);

  if (error || !jobs) {
    console.error('Error fetching jobs:', error);
    return;
  }

  console.log(`Fetched ${jobs.length} recent jobs. Checking existing translations...`);

  for (const job of jobs) {
    const { data: existing } = await supabase
      .from('gov_job_translations')
      .select('id')
      .eq('job_id', job.id)
      .eq('language_code', 'hi')
      .maybeSingle();

    if (existing) {
      console.log(`[SKIP] Job already translated: ${job.id} - ${job.title.slice(0, 40)}`);
      continue;
    }

    console.log(`[TRANSLATING] Job ${job.id}: ${job.title.slice(0, 50)}...`);
    const prompt = `Translate this Indian Government job notice to Hindi (language_code: "hi"):
Title: ${job.title}
Post Name: ${job.post_name || ''}
Qualification: ${job.qualification_summary || ''}
Age Limit: ${job.age_limit_summary || ''}
Selection Process: ${job.selection_process || ''}

Rules:
- Keep acronyms (UPSC, SSC, BSSC, etc.) unchanged.
- Keep numbers, advt numbers, and dates exact.
- Return JSON object with keys: "title", "post_name", "qualification_summary", "age_limit_summary", "selection_process".`;

    const result = await callOpenRouter(prompt);
    if (result && result.title) {
      const { error: insertErr } = await supabase
        .from('gov_job_translations')
        .upsert({
          job_id: job.id,
          language_code: 'hi',
          title: result.title,
          post_name: result.post_name || job.post_name,
          qualification_summary: result.qualification_summary || job.qualification_summary,
          age_limit_summary: result.age_limit_summary || job.age_limit_summary,
          selection_process: result.selection_process || job.selection_process,
          is_verified: true,
        }, { onConflict: 'job_id,language_code' });

      if (insertErr) {
        console.error(`[ERROR] Insert translation failed for job ${job.id}:`, insertErr);
      } else {
        console.log(`[SUCCESS] Saved Hindi translation for job ${job.id} -> ${result.title}`);
      }
    }
  }
}

async function backfillExams() {
  console.log('\n--- Backfilling Active Gov Exams to Hindi ---');
  const { data: exams, error } = await supabase
    .from('gov_exams')
    .select('id, title, short_title, description, eligibility_summary')
    .order('created_at', { ascending: false })
    .limit(20);

  if (error || !exams) {
    console.error('Error fetching exams:', error);
    return;
  }

  for (const exam of exams) {
    const { data: existing } = await supabase
      .from('gov_exam_translations')
      .select('id')
      .eq('exam_id', exam.id)
      .eq('language_code', 'hi')
      .maybeSingle();

    if (existing) {
      console.log(`[SKIP] Exam already translated: ${exam.id} - ${exam.title.slice(0, 40)}`);
      continue;
    }

    console.log(`[TRANSLATING] Exam ${exam.id}: ${exam.title.slice(0, 50)}...`);
    const prompt = `Translate this Indian Government exam notice to Hindi (language_code: "hi"):
Title: ${exam.title}
Short Title: ${exam.short_title || ''}
Description: ${exam.description || ''}
Eligibility: ${exam.eligibility_summary || ''}

Rules:
- Keep acronyms (UPSC, SSC, NTA, etc.) unchanged.
- Keep numbers and dates exact.
- Return JSON object with keys: "title", "short_title", "description", "eligibility_summary".`;

    const result = await callOpenRouter(prompt);
    if (result && result.title) {
      const { error: insertErr } = await supabase
        .from('gov_exam_translations')
        .upsert({
          exam_id: exam.id,
          language_code: 'hi',
          title: result.title,
          short_title: result.short_title || exam.short_title,
          description: result.description || exam.description,
          eligibility_summary: result.eligibility_summary || exam.eligibility_summary,
          is_verified: true,
        }, { onConflict: 'exam_id,language_code' });

      if (insertErr) {
        console.error(`[ERROR] Insert translation failed for exam ${exam.id}:`, insertErr);
      } else {
        console.log(`[SUCCESS] Saved Hindi translation for exam ${exam.id} -> ${result.title}`);
      }
    }
  }
}

async function main() {
  await backfillJobs();
  await backfillExams();
  console.log('\n--- Backfill Completed Successfully ---');
}

main().catch(console.error);
