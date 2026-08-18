import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const envContent = fs.readFileSync('.env.local', 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    let val = match[2].trim();
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
    env[match[1].trim()] = val;
  }
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

async function syncAllExams() {
  console.log('Fetching existing jobs with examination characteristics...');
  const { data: jobs, error: jobsErr } = await supabase
    .from('gov_jobs')
    .select('*, organizations(*), categories(*), job_eligibility(*), job_important_dates(*), job_official_documents(*)');

  if (jobsErr) {
    console.error('Error fetching jobs:', jobsErr);
    return;
  }

  console.log('Total jobs fetched:', jobs.length);

  const examKeywords = [
    'examination',
    'exam',
    'cgl',
    'chsl',
    'mts',
    'nda',
    'cds',
    'cse',
    'prelims',
    'mains',
    'po',
    'clerk',
    'test',
    'entrance',
    'civil services',
    'cce',
    'norcet',
    'afcat',
    'agniveer',
    'services',
    'officer'
  ];

  let syncedCount = 0;

  for (const job of jobs) {
    const titleLower = (job.title || '').toLowerCase();
    const isExam = examKeywords.some(kw => titleLower.includes(kw));

    if (!isExam) continue;

    const slug = slugify(job.title);
    const org = job.organizations;
    const cat = job.categories;
    const elig = Array.isArray(job.job_eligibility) ? job.job_eligibility[0] : job.job_eligibility;

    const mode = titleLower.includes('cbt') || titleLower.includes('online') ? 'online_cbt' : 'offline_omr';

    const examPayload = {
      title: job.title,
      short_title: job.title.slice(0, 60),
      slug: slug,
      exam_code: job.notification_number || 'EXAM-2026',
      organization_id: job.organization_id,
      category_id: job.category_id,
      state_code: job.state_code || org?.state_code || 'DL',
      mode: mode,
      frequency: 'annual',
      description: job.summary || (job.title + ' conducted by ' + (org?.name || 'Official Commission') + '.'),
      syllabus_summary: elig?.selection_process || 'General Awareness, Reasoning, Quantitative Aptitude, English, and Domain Knowledge subjects as per official gazette.',
      marking_scheme: 'Negative marking applicable for incorrect responses (1/3rd or 0.25 marks deduction) as per official scheme.',
      pattern_description: elig?.selection_process || 'Multi-stage competitive examination comprising Preliminary screening and Main written test.',
      application_process_guide: 'Apply online via the official portal (' + (job.official_apply_url || job.official_notification_url) + ').',
      official_notification_url: job.official_notification_url,
      official_website_url: job.official_apply_url || job.official_notification_url,
      application_fee_details: elig?.application_fee_details || { general: 100, obc: 100, ews: 100, sc: 0, st: 0, female: 0 },
      status: 'published',
      is_featured: syncedCount < 4,
      published_at: job.published_at || new Date().toISOString()
    };

    // Upsert into gov_exams
    const { data: existingExam } = await supabase.from('gov_exams').select('id').eq('slug', slug).maybeSingle();
    let examId;
    if (existingExam) {
      examId = existingExam.id;
      await supabase.from('gov_exams').update(examPayload).eq('id', examId);
    } else {
      const { data: inserted, error: insertErr } = await supabase.from('gov_exams').insert(examPayload).select('id').single();
      if (insertErr) {
        console.error('Failed to insert exam:', job.title, insertErr.message);
        continue;
      }
      examId = inserted.id;
    }

    // Ensure Stages
    const { count: stageCount } = await supabase.from('exam_stages').select('id', { count: 'exact', head: true }).eq('exam_id', examId);
    if (!stageCount || stageCount === 0) {
      await supabase.from('exam_stages').insert([
        {
          exam_id: examId,
          stage_name: 'Stage I: Preliminary Screening / CBT',
          stage_order: 1,
          stage_type: 'prelims',
          mode: mode,
          duration_minutes: 120,
          total_marks: 200,
          qualifying_marks: 66,
          status: 'scheduled',
          start_date: job.application_end_date ? new Date(new Date(job.application_end_date).getTime() + 45 * 86400000).toISOString().split('T')[0] : '2026-10-15'
        },
        {
          exam_id: examId,
          stage_name: 'Stage II: Main Examination / Skill Evaluation',
          stage_order: 2,
          stage_type: 'mains',
          mode: 'pen_paper',
          duration_minutes: 180,
          total_marks: 300,
          qualifying_marks: 100,
          status: 'upcoming'
        }
      ]);
    }

    // Important Dates
    const dates = [];
    if (job.application_start_date) {
      dates.push({
        exam_id: examId,
        title: 'Application Window Opens',
        event_date: job.application_start_date.split('T')[0],
        date_type: 'application_start',
        is_tentative: false,
        display_order: 1
      });
    }
    if (job.application_end_date) {
      dates.push({
        exam_id: examId,
        title: 'Last Date for Online Application',
        event_date: job.application_end_date.split('T')[0],
        date_type: 'application_end',
        is_tentative: false,
        display_order: 2
      });
      dates.push({
        exam_id: examId,
        title: 'Tentative Examination Date',
        event_date: new Date(new Date(job.application_end_date).getTime() + 45 * 86400000).toISOString().split('T')[0],
        date_type: 'exam_start',
        is_tentative: true,
        display_order: 3
      });
    }

    if (dates.length > 0) {
      await supabase.from('exam_important_dates').delete().eq('exam_id', examId);
      await supabase.from('exam_important_dates').insert(dates);
    }

    // Eligibility
    if (elig) {
      await supabase.from('exam_eligibility').delete().eq('exam_id', examId);
      await supabase.from('exam_eligibility').insert({
        exam_id: examId,
        min_age: elig.min_age || 18,
        max_age: elig.max_age || 32,
        age_relaxation_rules: elig.age_relaxation_details || 'Standard relaxation for SC/ST/OBC/PwD as per government rules.',
        educational_qualification_description: elig.education_qualification || 'Bachelor Degree or equivalent qualification from recognized institution.',
        nationality_criteria: 'Citizen of India'
      });
    }

    // Documents
    if (job.job_official_documents && job.job_official_documents.length > 0) {
      await supabase.from('exam_official_documents').delete().eq('exam_id', examId);
      const docs = job.job_official_documents.map(d => ({
        exam_id: examId,
        title: d.title || 'Official Notification Gazette',
        file_url: d.file_url,
        document_type: 'notification',
        published_date: d.published_date || job.published_at?.split('T')[0] || '2026-08-15'
      }));
      await supabase.from('exam_official_documents').insert(docs);
    }

    syncedCount++;
    console.log('Synced exam: [' + (org?.slug || 'gov') + '] ' + job.title);
  }

  console.log('\nSuccessfully populated ' + syncedCount + ' structured examinations into gov_exams!');
}

syncAllExams();
