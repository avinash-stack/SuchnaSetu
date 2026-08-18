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

/**
 * Full Suite of 85+ Major Recurring Central and State Government Examinations
 */
const COMPREHENSIVE_EXAMS = [
  // =========================================================================
  // 1. BANKING EXAMINATIONS (IBPS & SBI)
  // =========================================================================
  {
    org_slug: 'ibps',
    category_slug: 'banking',
    state_code: 'MH',
    title: 'IBPS Common Recruitment Process for Probationary Officers (CRP PO/MT-XVI)',
    short_title: 'IBPS PO 2026',
    slug: 'ibps-crp-po-mt-16-examination-2026',
    exam_code: 'CRP-PO/MT-XVI',
    mode: 'online_cbt',
    frequency: 'annual',
    description: 'National banking competitive examination for Probationary Officers and Management Trainees across 11 public sector participating banks.',
    syllabus_summary: 'Prelims: English Language (30), Quantitative Aptitude (35), Reasoning Ability (35). Mains: Reasoning & Computer Aptitude (60), General Economy & Banking Awareness (40), English (40), Data Analysis & Interpretation (60), English Descriptive Essay/Letter (25).',
    marking_scheme: 'Negative marking of 0.25 marks for every incorrect answer in Prelims and Mains.',
    pattern_description: '3-Tier Selection: Preliminary Online Examination (100 marks), Main Online Examination + Descriptive Writing (225 marks), and Common Interview (100 marks).',
    application_process_guide: 'Register and fill application on ibps.in with scanned photograph, signature, left thumb impression, and handwritten declaration.',
    official_notification_url: 'https://ibps.in/notices/CRP_PO_MT_XVI_Detailed_Notification.pdf',
    official_website_url: 'https://ibps.in',
    date_of_notification: '2026-08-01',
    application_start_date: '2026-08-01',
    application_closing_date: '2026-08-28',
    tentative_exam_date: '2026-10-19',
    min_age: 20,
    max_age: 30,
    educational_qualification: 'A Degree (Graduation) in any discipline from a recognized University.',
    fee_details: { general: 850, obc: 850, ews: 850, sc: 175, st: 175, female: 850 },
    is_featured: true,
    stages: [
      { name: 'Preliminary Online Examination', order: 1, type: 'prelims', mode: 'online_cbt', duration: 60, marks: 100, qual_marks: 50, status: 'scheduled', start_date: '2026-10-19' },
      { name: 'Main Online & Descriptive Examination', order: 2, type: 'mains', mode: 'online_cbt', duration: 210, marks: 225, qual_marks: 90, status: 'upcoming', start_date: '2026-11-30' },
      { name: 'Common Interview', order: 3, type: 'interview', mode: 'hybrid', duration: 20, marks: 100, qual_marks: 40, status: 'upcoming' }
    ]
  },
  {
    org_slug: 'ibps',
    category_slug: 'banking',
    state_code: 'MH',
    title: 'IBPS Clerical Cadre (CRP Clerk-XVI) Recruitment Examination 2026',
    short_title: 'IBPS Clerk 2026',
    slug: 'ibps-crp-clerk-16-examination-2026',
    exam_code: 'CRP-CLERK-XVI',
    mode: 'online_cbt',
    frequency: 'annual',
    description: 'National clerical recruitment examination for Customer Service Associates across 11 participating public sector banks in 13 regional languages.',
    syllabus_summary: 'Prelims: English, Numerical Ability, Reasoning Ability (100 Qs). Mains: General/Financial Awareness (50), General English (40), Reasoning & Computer (50), Quantitative Aptitude (50).',
    marking_scheme: '0.25 marks penalty for wrong answers.',
    pattern_description: 'Two-tier selection: Preliminary CBT (100 marks) followed by Main CBT (200 marks). No interview for clerical cadre.',
    application_process_guide: 'Apply online on ibps.in indicating State/UT preference and bank order.',
    official_notification_url: 'https://ibps.in/notices/CRP_Clerks_XVI_Notice.pdf',
    official_website_url: 'https://ibps.in',
    date_of_notification: '2026-06-30',
    application_start_date: '2026-06-30',
    application_closing_date: '2026-07-28',
    tentative_exam_date: '2026-08-24',
    min_age: 20,
    max_age: 28,
    educational_qualification: 'Graduation in any discipline and operating/working knowledge in computer systems.',
    fee_details: { general: 850, obc: 850, ews: 850, sc: 175, st: 175, female: 850 },
    stages: [
      { name: 'Preliminary Examination (CBT)', order: 1, type: 'prelims', mode: 'online_cbt', duration: 60, marks: 100, qual_marks: 45, status: 'scheduled', start_date: '2026-08-24' },
      { name: 'Main Online Examination', order: 2, type: 'mains', mode: 'online_cbt', duration: 160, marks: 200, qual_marks: 80, status: 'upcoming', start_date: '2026-10-13' }
    ]
  },
  {
    org_slug: 'ibps',
    category_slug: 'banking',
    state_code: 'MH',
    title: 'IBPS Specialist Officers (CRP SPL-XVI) Examination 2026',
    short_title: 'IBPS SO 2026',
    slug: 'ibps-specialist-officer-crp-spl-16-2026',
    exam_code: 'CRP-SPL-XVI',
    mode: 'online_cbt',
    frequency: 'annual',
    description: 'National recruitment for IT Officers, Agricultural Field Officers (AFO), Rajbhasha Adhikari, Law Officers, HR/Personnel Officers, and Marketing Officers.',
    syllabus_summary: 'Prelims: Reasoning, English, General Awareness with special reference to Banking / Quantitative Aptitude. Mains: Professional Knowledge test in relevant discipline (60 marks). Interview.',
    marking_scheme: '0.25 marks penalty per incorrect answer.',
    pattern_description: 'Prelims CBT, Mains Professional Knowledge Test, and Interview.',
    application_process_guide: 'Apply online at ibps.in.',
    official_notification_url: 'https://ibps.in/notices/CRP_SPL_XVI_Notice.pdf',
    official_website_url: 'https://ibps.in',
    date_of_notification: '2026-08-01',
    application_start_date: '2026-08-01',
    application_closing_date: '2026-08-28',
    tentative_exam_date: '2026-11-09',
    min_age: 20,
    max_age: 30,
    educational_qualification: '4-year Engineering Degree / Master Degree in relevant specialized stream (CS, IT, Agriculture, Law, HR, Marketing).',
    fee_details: { general: 850, obc: 850, ews: 850, sc: 175, st: 175, female: 850 },
    stages: [
      { name: 'Preliminary Examination', order: 1, type: 'prelims', mode: 'online_cbt', duration: 120, marks: 125, qual_marks: 50, status: 'scheduled', start_date: '2026-11-09' },
      { name: 'Main Professional Knowledge Exam', order: 2, type: 'mains', mode: 'online_cbt', duration: 45, marks: 60, qual_marks: 24, status: 'upcoming', start_date: '2026-12-14' },
      { name: 'Interview', order: 3, type: 'interview', mode: 'hybrid', duration: 20, marks: 100, qual_marks: 40, status: 'upcoming' }
    ]
  },
  {
    org_slug: 'ibps',
    category_slug: 'banking',
    state_code: 'MH',
    title: 'IBPS RRB (Officers Scale I, II, III & Office Assistants) Examination 2026',
    short_title: 'IBPS RRB 2026',
    slug: 'ibps-rrb-officers-office-assistant-2026',
    exam_code: 'CRP-RRBs-XIII',
    mode: 'online_cbt',
    frequency: 'annual',
    description: 'Regional Rural Banks common recruitment for Assistant Managers (Scale-I), Managers (Scale-II), Senior Managers (Scale-III), and Multipurpose Office Assistants across 43 RRBs.',
    syllabus_summary: 'Prelims: Reasoning (40) & Numerical Ability / Quantitative Aptitude (40) - 80 Qs total. Mains: Reasoning, Computer, General Awareness, English/Hindi, Quantitative Aptitude (200 marks).',
    marking_scheme: '0.25 marks penalty per wrong response.',
    pattern_description: 'Prelims CBT, Mains CBT, and Interview (for Officer posts only).',
    application_process_guide: 'Apply online at ibps.in selecting state RRB preferences and local language proficiency.',
    official_notification_url: 'https://ibps.in/notices/CRP_RRB_XIII_Notice.pdf',
    official_website_url: 'https://ibps.in',
    date_of_notification: '2026-06-07',
    application_start_date: '2026-06-07',
    application_closing_date: '2026-06-30',
    tentative_exam_date: '2026-08-03',
    min_age: 18,
    max_age: 30,
    educational_qualification: "Bachelor's degree in any discipline with local language proficiency of the respective state.",
    fee_details: { general: 850, obc: 850, ews: 850, sc: 175, st: 175, female: 850 },
    stages: [
      { name: 'Preliminary Examination (80 Questions)', order: 1, type: 'prelims', mode: 'online_cbt', duration: 45, marks: 80, qual_marks: 35, status: 'scheduled', start_date: '2026-08-03' },
      { name: 'Main Examination (200 Marks)', order: 2, type: 'mains', mode: 'online_cbt', duration: 120, marks: 200, qual_marks: 80, status: 'upcoming', start_date: '2026-09-29' }
    ]
  },
  {
    org_slug: 'sbi',
    category_slug: 'banking',
    state_code: 'MH',
    title: 'SBI Probationary Officers (PO) Recruitment Examination 2026',
    short_title: 'SBI PO 2026',
    slug: 'sbi-probationary-officers-po-2026',
    exam_code: 'CRPD/PO/2026-27/01',
    mode: 'online_cbt',
    frequency: 'annual',
    description: "India's highest-tier banking recruitment examination for Probationary Officers in State Bank of India with fast-track career progression.",
    syllabus_summary: 'Phase-I: English (30), Quantitative Aptitude (35), Reasoning Ability (35). Phase-II: Reasoning & Computer (40), Data Analysis (30), General Economy & Banking (50), English (35) + Descriptive Test (50). Phase-III: Psychometric Test, Group Discussion & Interview.',
    marking_scheme: '0.25 negative marks per incorrect answer in Phase-I and Phase-II objective tests.',
    pattern_description: 'Phase-I Preliminary Exam (100 marks), Phase-II Main Exam (250 marks), Phase-III Psychometric Test, Group Exercise (20 marks) & Interview (30 marks).',
    application_process_guide: 'Apply online at bank.sbi/careers with valid photograph and signature.',
    official_notification_url: 'https://bank.sbi/careers/PO_2026_Notification.pdf',
    official_website_url: 'https://bank.sbi/careers',
    date_of_notification: '2026-09-06',
    application_start_date: '2026-09-06',
    application_closing_date: '2026-09-27',
    tentative_exam_date: '2026-11-01',
    min_age: 21,
    max_age: 30,
    educational_qualification: 'Graduation in any discipline from a recognized University.',
    fee_details: { general: 750, obc: 750, ews: 750, sc: 0, st: 0, female: 750 },
    is_featured: true,
    stages: [
      { name: 'Phase-I: Preliminary Online Examination', order: 1, type: 'prelims', mode: 'online_cbt', duration: 60, marks: 100, qual_marks: 55, status: 'scheduled', start_date: '2026-11-01' },
      { name: 'Phase-II: Main Online Exam & Descriptive Test', order: 2, type: 'mains', mode: 'online_cbt', duration: 210, marks: 250, qual_marks: 100, status: 'upcoming', start_date: '2026-12-10' },
      { name: 'Phase-III: Psychometric Test, Group Exercise & Interview', order: 3, type: 'interview', mode: 'hybrid', duration: 45, marks: 50, qual_marks: 20, status: 'upcoming' }
    ]
  },
  {
    org_slug: 'sbi',
    category_slug: 'banking',
    state_code: 'MH',
    title: 'SBI Junior Associates (Customer Support & Sales) Examination 2026',
    short_title: 'SBI Clerk 2026',
    slug: 'sbi-junior-associates-clerk-2026',
    exam_code: 'CRPD/CR/2026-27/02',
    mode: 'online_cbt',
    frequency: 'annual',
    description: 'National recruitment for Junior Associates (Clerical Cadre) in State Bank of India across state circles with 13 regional language test options.',
    syllabus_summary: 'Prelims: English Language, Numerical Ability, Reasoning Ability (100 Qs). Mains: General/Financial Awareness, General English, Quantitative Aptitude, Reasoning Ability & Computer Aptitude (200 marks).',
    marking_scheme: '0.25 marks deduction for each wrong answer.',
    pattern_description: 'Phase-I Preliminary Exam (100 marks) followed by Phase-II Main Exam (200 marks) and Local Language Test.',
    application_process_guide: 'Apply online at bank.sbi/careers selecting state vacancy circle.',
    official_notification_url: 'https://bank.sbi/careers/JA_2026_Notice.pdf',
    official_website_url: 'https://bank.sbi/careers',
    date_of_notification: '2026-11-16',
    application_start_date: '2026-11-16',
    application_closing_date: '2026-12-10',
    tentative_exam_date: '2026-01-05',
    min_age: 20,
    max_age: 28,
    educational_qualification: 'Graduation in any discipline from a recognized University.',
    fee_details: { general: 750, obc: 750, ews: 750, sc: 0, st: 0, female: 750 },
    stages: [
      { name: 'Phase-I: Preliminary Examination', order: 1, type: 'prelims', mode: 'online_cbt', duration: 60, marks: 100, qual_marks: 60, status: 'scheduled', start_date: '2026-01-05' },
      { name: 'Phase-II: Main Examination', order: 2, type: 'mains', mode: 'online_cbt', duration: 160, marks: 200, qual_marks: 80, status: 'upcoming', start_date: '2026-02-25' }
    ]
  },

  // =========================================================================
  // 2. DEFENCE EXAMINATIONS (AFCAT, AGNIVEER, COAST GUARD)
  // =========================================================================
  {
    org_slug: 'indian-air-force',
    category_slug: 'defence',
    state_code: 'DL',
    title: 'Air Force Common Admission Test (AFCAT - 02/2026) for Flying & Ground Duty Branches',
    short_title: 'IAF AFCAT 02/2026',
    slug: 'iaf-afcat-02-2026-examination',
    exam_code: 'AFCAT-02/2026',
    mode: 'online_cbt',
    frequency: 'biannual',
    description: 'National commissioning examination for Commissioned Officers in Flying, Technical, and Non-Technical Ground Duty Branches of the Indian Air Force.',
    syllabus_summary: 'General Awareness (20), Verbal Ability in English (30), Numerical Ability (20), Reasoning and Military Aptitude Test (30) - 100 Questions total (300 Marks).',
    marking_scheme: '3 marks awarded for correct answer, 1 mark deducted for incorrect answer.',
    pattern_description: 'Online CBT Examination (300 marks) followed by 5-day Air Force Selection Board (AFSB) Testing and Medicals.',
    application_process_guide: 'Apply online at afcat.cdac.in using candidate login credentials.',
    official_notification_url: 'https://afcat.cdac.in/AFCAT/assets/images/news/AFCAT_02_2026_Advt.pdf',
    official_website_url: 'https://afcat.cdac.in',
    date_of_notification: '2026-05-30',
    application_start_date: '2026-05-30',
    application_closing_date: '2026-06-28',
    tentative_exam_date: '2026-08-23',
    min_age: 20,
    max_age: 26,
    educational_qualification: 'Graduation in any discipline with minimum 60% marks and Maths & Physics at 10+2 level OR B.E./B.Tech.',
    fee_details: { general: 550, obc: 550, ews: 550, sc: 550, st: 550, female: 550 },
    is_featured: true,
    stages: [
      { name: 'AFCAT Online Computer Based Test (100 Qs)', order: 1, type: 'prelims', mode: 'online_cbt', duration: 120, marks: 300, qual_marks: 140, status: 'scheduled', start_date: '2026-08-23' },
      { name: 'AFSB (Air Force Selection Board) Testing', order: 2, type: 'interview', mode: 'hybrid', duration: 7200, marks: 300, qual_marks: 0, status: 'upcoming' }
    ]
  },
  {
    org_slug: 'indian-army',
    category_slug: 'defence',
    state_code: 'DL',
    title: 'Indian Army Agniveer Common Entrance Examination (CEE) & Rally Intake 2026',
    short_title: 'Army Agniveer CEE 2026',
    slug: 'indian-army-agniveer-cee-2026',
    exam_code: 'ARMY-AGNIVEER-2026',
    mode: 'online_cbt',
    frequency: 'annual',
    description: 'National recruitment for Agniveer General Duty (GD), Technical, Clerk / Store Keeper Technical, and Tradesmen across all ZROs/AROs.',
    syllabus_summary: 'General Knowledge, General Science, Mathematics, and Logical Reasoning. Special English module for Clerk cadre.',
    marking_scheme: '2 marks for correct answer, 0.50 negative marks for incorrect answer.',
    pattern_description: 'Phase-I Online Common Entrance Examination (CEE) followed by Phase-II Recruitment Rally (Physical Fitness Test PFT) and Adaptability Test.',
    application_process_guide: 'Register with Aadhaar on joinindianarmy.nic.in and select district rally location.',
    official_notification_url: 'https://joinindianarmy.nic.in/notices/Agniveer_2026_Notification.pdf',
    official_website_url: 'https://joinindianarmy.nic.in',
    date_of_notification: '2026-02-13',
    application_start_date: '2026-02-13',
    application_closing_date: '2026-03-22',
    tentative_exam_date: '2026-04-22',
    min_age: 17.5,
    max_age: 21,
    educational_qualification: 'Class 10th / Matric with 45% marks aggregate (GD) or 10+2 with Physics, Chemistry, Maths & English (Technical).',
    fee_details: { general: 250, obc: 250, ews: 250, sc: 250, st: 250, female: 250 },
    stages: [
      { name: 'Phase-I: Online Computer Based Common Entrance Exam (CEE)', order: 1, type: 'prelims', mode: 'online_cbt', duration: 60, marks: 100, qual_marks: 35, status: 'scheduled', start_date: '2026-04-22' },
      { name: 'Phase-II: Physical Fitness Test (PFT Rally 1.6km Run & Beam)', order: 2, type: 'physical', mode: 'hybrid', duration: 120, marks: 100, qual_marks: 60, status: 'upcoming' }
    ]
  },
  {
    org_slug: 'indian-navy',
    category_slug: 'defence',
    state_code: 'DL',
    title: 'Indian Navy Agniveer (Senior Secondary Recruit - SSR & MR) 02/2026 Batch Examination',
    short_title: 'Navy Agniveer SSR/MR 2026',
    slug: 'indian-navy-agniveer-ssr-mr-02-2026',
    exam_code: 'NAVY-AGNIVEER-02/2026',
    mode: 'online_cbt',
    frequency: 'biannual',
    description: 'National recruitment for Sailors (Agniveer SSR and Agniveer MR) in the Indian Navy for maritime fleet operations.',
    syllabus_summary: 'SSR: English, Science, Mathematics, General Awareness (100 Qs). MR: Science & Mathematics, General Awareness (50 Qs).',
    marking_scheme: '0.25 marks penalty per incorrect response in INET.',
    pattern_description: 'Stage-I Indian Navy Entrance Test (INET CBT), Stage-II PFT (Physical Fitness), Written Exam & Recruitment Medicals.',
    application_process_guide: 'Apply online at agniveernavy.cdac.in.',
    official_notification_url: 'https://agniveernavy.cdac.in/notices/Navy_SSR_MR_02_2026.pdf',
    official_website_url: 'https://agniveernavy.cdac.in',
    date_of_notification: '2026-05-13',
    application_start_date: '2026-05-13',
    application_closing_date: '2026-06-05',
    tentative_exam_date: '2026-07-12',
    min_age: 17.5,
    max_age: 21,
    educational_qualification: '10+2 with Mathematics & Physics and at least one of Chemistry/Biology/Computer Science (SSR) or 10th pass (MR).',
    fee_details: { general: 550, obc: 550, ews: 550, sc: 550, st: 550, female: 550 },
    stages: [
      { name: 'Stage-I: Shortlisting Computer Based Test (INET)', order: 1, type: 'prelims', mode: 'online_cbt', duration: 60, marks: 100, qual_marks: 35, status: 'scheduled', start_date: '2026-07-12' },
      { name: 'Stage-II: PFT (1.6km run, squats, pushups) & Medicals', order: 2, type: 'physical', mode: 'hybrid', duration: 120, marks: 0, qual_marks: 0, status: 'upcoming' }
    ]
  },
  {
    org_slug: 'indian-coast-guard',
    category_slug: 'defence',
    state_code: 'DL',
    title: 'Indian Coast Guard Navik (General Duty / Domestic Branch) & Yantrik Examination (CGEPT 01/2026)',
    short_title: 'ICG Navik & Yantrik 2026',
    slug: 'indian-coast-guard-navik-yantrik-cgept-2026',
    exam_code: 'ICG-CGEPT-01/2026',
    mode: 'online_cbt',
    frequency: 'biannual',
    description: 'National entrance test for Navik (GD), Navik (DB), and Yantrik (Mechanical, Electrical, Electronics) in the Indian Coast Guard.',
    syllabus_summary: 'Section-I: Maths, Science, English, Reasoning, GK (60 marks). Section-II: Physics & Mathematics (50 marks). Section-III/IV/V: Engineering discipline technical questions (50 marks).',
    marking_scheme: 'No negative marking in ICG online exam.',
    pattern_description: 'Stage-I Computer Based Examination, Stage-II Assessment / Adaptability / PFT, Stage-III Document Verification at INS Chilka.',
    application_process_guide: 'Apply online at joinindiancoastguard.cdac.in.',
    official_notification_url: 'https://joinindiancoastguard.cdac.in/assets/img/advt/CGEPT_01_2026.pdf',
    official_website_url: 'https://joinindiancoastguard.cdac.in',
    date_of_notification: '2026-06-13',
    application_start_date: '2026-06-13',
    application_closing_date: '2026-07-03',
    tentative_exam_date: '2026-09-18',
    min_age: 18,
    max_age: 22,
    educational_qualification: 'Navik GD: 10+2 with Maths and Physics. Navik DB: 10th pass. Yantrik: 10th + Engineering Diploma.',
    fee_details: { general: 300, obc: 300, ews: 300, sc: 0, st: 0, female: 0 },
    stages: [
      { name: 'Stage-I: Computer Based Online Examination', order: 1, type: 'prelims', mode: 'online_cbt', duration: 75, marks: 110, qual_marks: 50, status: 'scheduled', start_date: '2026-09-18' },
      { name: 'Stage-II: Physical Fitness Test (PFT 1.6km run, pushups)', order: 2, type: 'physical', mode: 'hybrid', duration: 60, marks: 0, qual_marks: 0, status: 'upcoming' }
    ]
  },

  // =========================================================================
  // 3. CENTRAL AUTONOMOUS BODIES (AIIMS, DRDO, ISRO, ESIC, EPFO, INDIA POST)
  // =========================================================================
  {
    org_slug: 'aiims',
    category_slug: 'central-govt',
    state_code: 'DL',
    title: 'AIIMS Nursing Officer Recruitment Common Eligibility Test (NORCET-07)',
    short_title: 'AIIMS NORCET-07 2026',
    slug: 'aiims-norcet-07-nursing-officer-examination-2026',
    exam_code: 'AIIMS-NORCET-07',
    mode: 'online_cbt',
    frequency: 'biannual',
    description: 'National entrance and recruitment examination for Nursing Officers (Staff Nurse Grade-II) across all AIIMS institutes and central government hospitals in New Delhi.',
    syllabus_summary: 'Prelims: 100 MCQs (80 on Nursing curriculum, 20 on General Knowledge & Aptitude). Mains: 100 MCQs focused on Clinical Nursing Scenarios, Skill Assessment, and Critical Care decision making.',
    marking_scheme: '1/3rd negative marking per wrong response in both Prelims and Mains.',
    pattern_description: 'Two-stage National CBT: Stage-I Screening Preliminary Exam (100 marks) followed by Stage-II Scenario-based Main Exam (100 marks).',
    application_process_guide: 'Submit application on aiimsexams.ac.in and upload live web camera photo and thumb impression.',
    official_notification_url: 'https://aiimsexams.ac.in/notices/NORCET_07_Detailed_Notification.pdf',
    official_website_url: 'https://aiimsexams.ac.in',
    date_of_notification: '2026-08-01',
    application_start_date: '2026-08-01',
    application_closing_date: '2026-08-21',
    tentative_exam_date: '2026-09-15',
    min_age: 18,
    max_age: 30,
    educational_qualification: 'B.Sc. (Hons.) Nursing / B.Sc. Nursing from an Indian Nursing Council recognized Institute OR GNM with 2 years experience in a minimum 50 bedded hospital.',
    fee_details: { general: 3000, obc: 3000, ews: 3000, sc: 2400, st: 2400, female: 3000 },
    is_featured: true,
    stages: [
      { name: 'Stage-I: NORCET Preliminary CBT Examination', order: 1, type: 'prelims', mode: 'online_cbt', duration: 90, marks: 100, qual_marks: 50, status: 'scheduled', start_date: '2026-09-15' },
      { name: 'Stage-II: NORCET Clinical Scenario Main CBT Exam', order: 2, type: 'mains', mode: 'online_cbt', duration: 90, marks: 100, qual_marks: 50, status: 'upcoming', start_date: '2026-10-06' }
    ]
  },
  {
    org_slug: 'drdo',
    category_slug: 'central-govt',
    state_code: 'DL',
    title: 'DRDO Centre for Personnel Talent Management (CEPTAM-11) Technical Cadre Examination',
    short_title: 'DRDO CEPTAM-11 2026',
    slug: 'drdo-ceptam-11-technical-cadre-examination-2026',
    exam_code: 'DRDO-CEPTAM-11',
    mode: 'online_cbt',
    frequency: 'as_needed',
    description: 'National recruitment examination for Senior Technical Assistants (STA-B) and Technicians (Tech-A) across DRDO research laboratories nationwide.',
    syllabus_summary: 'Tier-I (STA-B): Quantitative Ability, Reasoning, GA, English, Science (120 Qs). Tier-II (STA-B): Subject specific technical syllabus (100 Qs). Tech-A: Common Aptitude + Trade Test.',
    marking_scheme: 'No negative marking in CEPTAM computer based examinations.',
    pattern_description: 'Tier-I CBT (Screening), Tier-II CBT (Selection Merit for STA-B) or Trade Test (for Tech-A).',
    application_process_guide: 'Apply online at drdo.gov.in (CEPTAM advertisement link).',
    official_notification_url: 'https://drdo.gov.in/careers/CEPTAM_11_Advt.pdf',
    official_website_url: 'https://drdo.gov.in',
    date_of_notification: '2026-07-15',
    application_start_date: '2026-07-15',
    application_closing_date: '2026-08-15',
    tentative_exam_date: '2026-11-12',
    min_age: 18,
    max_age: 28,
    educational_qualification: 'B.Sc. degree in Science or Diploma in Engineering/Technology in relevant branch (STA-B) or 10th + ITI (Tech-A).',
    fee_details: { general: 100, obc: 100, ews: 100, sc: 0, st: 0, female: 0 },
    stages: [
      { name: 'Tier-I: Screening CBT (120 Questions)', order: 1, type: 'prelims', mode: 'online_cbt', duration: 90, marks: 120, qual_marks: 48, status: 'scheduled', start_date: '2026-11-12' },
      { name: 'Tier-II: Subject Specific CBT / Trade Evaluation', order: 2, type: 'mains', mode: 'online_cbt', duration: 90, marks: 100, qual_marks: 40, status: 'upcoming' }
    ]
  },
  {
    org_slug: 'isro',
    category_slug: 'central-govt',
    state_code: 'KA',
    title: 'ISRO Centralised Recruitment Board (ICRB) Scientist/Engineer (SC) Examination 2026',
    short_title: 'ISRO ICRB Scientist (SC) 2026',
    slug: 'isro-icrb-scientist-engineer-sc-2026',
    exam_code: 'ISRO-ICRB-01/2026',
    mode: 'online_cbt',
    frequency: 'annual',
    description: "Premier national technical competitive examination for Scientist / Engineer 'SC' positions in Electronics, Mechanical, Computer Science, and Civil Engineering.",
    syllabus_summary: "Part 'A': Core Engineering Discipline based on GATE syllabus (80 Qs - 80 marks). Part 'B': Aptitude and Reasoning (15 Qs - 20 marks).",
    marking_scheme: '1/3rd negative marking in Part A. No negative marking in Part B.',
    pattern_description: 'Written Computer Based Test (100 marks) followed by Technical Interview (100 marks with 60% minimum qualifying score).',
    application_process_guide: 'Apply online at isro.gov.in careers section with B.E./B.Tech percentage / CGPA.',
    official_notification_url: 'https://www.isro.gov.in/careers/ICRB_Scientist_SC_2026.pdf',
    official_website_url: 'https://www.isro.gov.in',
    date_of_notification: '2026-05-25',
    application_start_date: '2026-05-25',
    application_closing_date: '2026-06-16',
    tentative_exam_date: '2026-09-27',
    min_age: 18,
    max_age: 28,
    educational_qualification: 'B.E./B.Tech in first class with aggregate minimum of 65% marks or CGPA 6.84/10 in relevant engineering discipline.',
    fee_details: { general: 250, obc: 250, ews: 250, sc: 0, st: 0, female: 0 },
    stages: [
      { name: 'Written Examination (Core Technical + Aptitude)', order: 1, type: 'prelims', mode: 'online_cbt', duration: 120, marks: 100, qual_marks: 50, status: 'scheduled', start_date: '2026-09-27' },
      { name: 'Technical In-Depth Interview', order: 2, type: 'interview', mode: 'hybrid', duration: 45, marks: 100, qual_marks: 60, status: 'upcoming' }
    ]
  },
  {
    org_slug: 'esic',
    category_slug: 'central-govt',
    state_code: 'DL',
    title: 'ESIC Social Security Officer (SSO) & Insurance Medical Officer (IMO) Examination 2026',
    short_title: 'ESIC SSO / IMO 2026',
    slug: 'esic-social-security-officer-sso-imo-2026',
    exam_code: 'ESIC-SSO-2026',
    mode: 'online_cbt',
    frequency: 'as_needed',
    description: 'National recruitment examination for Social Security Officers (Manager Grade-II) and Medical Officers across ESIC hospitals and regional offices.',
    syllabus_summary: 'Phase-I: Reasoning (35), English (30), Quantitative Aptitude (35). Phase-II: Reasoning, English, General Awareness with Insurance/Economy, Quantitative Aptitude (200 marks). Phase-III: Computer Skill & Descriptive English Test.',
    marking_scheme: '0.25 marks penalty for wrong responses.',
    pattern_description: 'Phase-I Preliminary Exam, Phase-II Main Exam, and Phase-III Computer Skill Test (CST) & Objective Type Computer Test.',
    application_process_guide: 'Apply online at esic.gov.in under Recruitment section.',
    official_notification_url: 'https://esic.gov.in/recruitment/SSO_2026_Notification.pdf',
    official_website_url: 'https://esic.gov.in',
    date_of_notification: '2026-03-12',
    application_start_date: '2026-03-12',
    application_closing_date: '2026-04-12',
    tentative_exam_date: '2026-06-11',
    min_age: 21,
    max_age: 27,
    educational_qualification: 'A degree of a recognized University (preference for Commerce/Law/Management).',
    fee_details: { general: 500, obc: 500, ews: 500, sc: 250, st: 250, female: 250 },
    stages: [
      { name: 'Phase-I: Preliminary Online Examination', order: 1, type: 'prelims', mode: 'online_cbt', duration: 60, marks: 100, qual_marks: 45, status: 'scheduled', start_date: '2026-06-11' },
      { name: 'Phase-II: Main Online Examination', order: 2, type: 'mains', mode: 'online_cbt', duration: 120, marks: 200, qual_marks: 80, status: 'upcoming' }
    ]
  },
  {
    org_slug: 'epfo',
    category_slug: 'central-govt',
    state_code: 'DL',
    title: 'EPFO Social Security Assistant (SSA) & Stenographer Examination 2026',
    short_title: 'EPFO SSA 2026',
    slug: 'epfo-social-security-assistant-ssa-2026',
    exam_code: 'EPFO-SSA-2026',
    mode: 'online_cbt',
    frequency: 'as_needed',
    description: "National competitive examination conducted by NTA for Social Security Assistants in the Employees' Provident Fund Organisation.",
    syllabus_summary: 'General Aptitude (120), General Knowledge/General Awareness (120), Quantitative Ability (120), General English (200), Computer Literacy (40) - 600 Marks total.',
    marking_scheme: '4 marks for correct answer, 1 mark negative marking for incorrect answer.',
    pattern_description: 'Stage-I Computer Based Examination (600 marks) followed by Stage-II Computer Data Entry Skill Test (35 wpm in English or 30 wpm in Hindi).',
    application_process_guide: 'Apply online at recruitment.nta.nic.in / epfindia.gov.in.',
    official_notification_url: 'https://recruitment.nta.nic.in/EPFO/EPFO_SSA_2026_Notice.pdf',
    official_website_url: 'https://www.epfindia.gov.in',
    date_of_notification: '2026-03-27',
    application_start_date: '2026-03-27',
    application_closing_date: '2026-04-26',
    tentative_exam_date: '2026-08-18',
    min_age: 18,
    max_age: 27,
    educational_qualification: "Bachelor's Degree from a recognized University and possessing a typing speed of 35 words per minute in English.",
    fee_details: { general: 700, obc: 700, ews: 700, sc: 0, st: 0, female: 0 },
    stages: [
      { name: 'Stage-I: Computer Based Examination (600 Marks)', order: 1, type: 'prelims', mode: 'online_cbt', duration: 150, marks: 600, qual_marks: 240, status: 'scheduled', start_date: '2026-08-18' },
      { name: 'Stage-II: Computer Data Entry Skill Test', order: 2, type: 'skill', mode: 'online_cbt', duration: 15, marks: 0, qual_marks: 0, status: 'upcoming' }
    ]
  },
  {
    org_slug: 'india-post',
    category_slug: 'central-govt',
    state_code: 'DL',
    title: 'Department of Posts Gramin Dak Sevak (GDS) National Engagement Schedule 2026',
    short_title: 'India Post GDS 2026',
    slug: 'india-post-gramin-dak-sevak-gds-2026',
    exam_code: 'GDS-2026-CYCLE-1',
    mode: 'offline_omr',
    frequency: 'biannual',
    description: 'National public merit engagement process for Branch Postmaster (BPM) and Assistant Branch Postmaster (ABPM) across 23 Postal Circles.',
    syllabus_summary: 'Merit list generated automatically on the basis of 10th Standard secondary school examination marks combined with computer qualification.',
    marking_scheme: 'Automated merit ranking based on percentage in 10th class Board examinations.',
    pattern_description: 'Online application followed by computerized state-wise merit list declaration and Document Verification.',
    application_process_guide: 'Apply online at indiapostgdsonline.gov.in selecting Postal Division and post preferences.',
    official_notification_url: 'https://indiapostgdsonline.gov.in/notices/GDS_2026_Notification.pdf',
    official_website_url: 'https://indiapostgdsonline.gov.in',
    date_of_notification: '2026-07-15',
    application_start_date: '2026-07-15',
    application_closing_date: '2026-08-05',
    tentative_exam_date: '2026-08-20',
    min_age: 18,
    max_age: 40,
    educational_qualification: 'Secondary School Examination pass certificate of 10th standard with passing marks in Mathematics and English conducted by any recognized Board.',
    fee_details: { general: 100, obc: 100, ews: 100, sc: 0, st: 0, female: 0 },
    stages: [
      { name: 'Merit List Generation & Document Verification', order: 1, type: 'screening', mode: 'offline_omr', duration: 0, marks: 100, qual_marks: 85, status: 'scheduled', start_date: '2026-08-20' }
    ]
  },

  // =========================================================================
  // 4. STATE GOVERNMENT EXAMINATIONS (12 SUPPORTED STATES)
  // =========================================================================
  // BIHAR
  {
    org_slug: 'bpsc',
    category_slug: 'state-govt',
    state_code: 'BR',
    title: 'BPSC 71st Combined (Preliminary & Main) Competitive Examination 2026 (BPSC 71st CCE)',
    short_title: 'BPSC 71st CCE 2026',
    slug: 'bpsc-71st-combined-competitive-examination-2026',
    exam_code: 'BPSC-71-CCE',
    mode: 'offline_omr',
    frequency: 'annual',
    description: "Bihar's premier civil services competitive examination for Sub-Divisional Officer (SDO), Deputy Superintendent of Police (DSP), and Block Development Officer (BDO).",
    syllabus_summary: 'Prelims: General Studies (150 MCQs covering Bihar History, Geography, Polity, Economy, Science, Current Affairs). Mains: General Hindi, GS-I, GS-II, Essay Paper (300 marks) + Optional Paper.',
    marking_scheme: 'Negative marking of 1/3rd marks (0.33 mark deducted) per incorrect response in Prelims.',
    pattern_description: 'Stage-I Objective Preliminary (150 marks), Stage-II Written Descriptive Mains (900 marks), Stage-III Interview (120 marks).',
    application_process_guide: 'Apply online at onlinebpsc.bihar.gov.in using BPSC OTR account.',
    official_notification_url: 'https://bpsc.bih.nic.in/Advt_71st_CCE_2026.pdf',
    official_website_url: 'https://onlinebpsc.bihar.gov.in',
    date_of_notification: '2026-07-20',
    application_start_date: '2026-07-20',
    application_closing_date: '2026-08-20',
    tentative_exam_date: '2026-10-18',
    min_age: 20,
    max_age: 37,
    educational_qualification: 'Graduation in any discipline from a recognized University.',
    fee_details: { general: 600, obc: 600, ews: 600, sc: 150, st: 150, female: 150 },
    is_featured: true,
    stages: [
      { name: 'Preliminary Objective Examination (150 Marks)', order: 1, type: 'prelims', mode: 'offline_omr', duration: 120, marks: 150, qual_marks: 60, status: 'scheduled', start_date: '2026-10-18' },
      { name: 'Main Written Examination (Descriptive 900 Marks)', order: 2, type: 'mains', mode: 'pen_paper', duration: 540, marks: 900, qual_marks: 360, status: 'upcoming', start_date: '2027-01-15' },
      { name: 'Interview / Personality Evaluation', order: 3, type: 'interview', mode: 'hybrid', duration: 30, marks: 120, qual_marks: 0, status: 'upcoming' }
    ]
  },
  {
    org_slug: 'bpsc',
    category_slug: 'teaching',
    state_code: 'BR',
    title: 'BPSC School Teacher Recruitment Examination (TRE 4.0) 2026',
    short_title: 'BPSC TRE 4.0 2026',
    slug: 'bpsc-school-teacher-tre-4-2026',
    exam_code: 'BPSC-TRE-4.0',
    mode: 'offline_omr',
    frequency: 'annual',
    description: 'Mega teacher recruitment examination for Primary (Class 1-5), Middle (Class 6-8), Secondary (Class 9-10), and Higher Secondary (Class 11-12) teachers in Bihar.',
    syllabus_summary: 'Part-I: Qualifying Language (English + Hindi/Urdu/Bangla - 30 marks). Part-II: General Studies (40 marks). Part-III: Concerned Subject Pedagogy (80 marks). Total 150 MCQs.',
    marking_scheme: 'No negative marking in BPSC TRE examination.',
    pattern_description: 'Single stage Objective Pen-Paper OMR Examination (150 Questions) followed by Document Verification.',
    application_process_guide: 'Apply online at onlinebpsc.bihar.gov.in uploading CTET/STET certificate and D.El.Ed/B.Ed credentials.',
    official_notification_url: 'https://bpsc.bih.nic.in/TRE_4_Advt.pdf',
    official_website_url: 'https://onlinebpsc.bihar.gov.in',
    date_of_notification: '2026-06-15',
    application_start_date: '2026-06-15',
    application_closing_date: '2026-07-10',
    tentative_exam_date: '2026-08-24',
    min_age: 18,
    max_age: 40,
    educational_qualification: 'D.El.Ed / B.Ed with CTET Paper-I/II or Bihar STET Paper-I/II qualification.',
    fee_details: { general: 750, obc: 750, ews: 750, sc: 200, st: 200, female: 200 },
    stages: [
      { name: 'Written Examination (Language + GS + Subject - 150 Qs)', order: 1, type: 'prelims', mode: 'offline_omr', duration: 150, marks: 150, qual_marks: 60, status: 'scheduled', start_date: '2026-08-24' }
    ]
  },
  {
    org_slug: 'bssc',
    category_slug: 'state-govt',
    state_code: 'BR',
    title: 'BSSC 4th Graduate Level Combined Competitive Examination (BSSC CGL-4)',
    short_title: 'BSSC CGL-4 2026',
    slug: 'bssc-4th-graduate-level-cgl-4-2026',
    exam_code: 'BSSC-CGL-4/2026',
    mode: 'offline_omr',
    frequency: 'as_needed',
    description: 'Bihar state combined examination for Secretariat Assistant (Prashakha Adhikari), Planning Assistant, and Auditor posts in Bihar Government departments.',
    syllabus_summary: 'General Studies (50 Qs), General Science and Mathematics (50 Qs), Comprehension/Logic/Reasoning (50 Qs) - 150 Questions total (600 Marks).',
    marking_scheme: '4 marks awarded per correct answer, 1 mark deducted per incorrect answer.',
    pattern_description: 'Preliminary OMR Examination (600 marks) followed by Main Written Examination (Paper 1 Hindi + Paper 2 GS).',
    application_process_guide: 'Apply online at onlinebssc.bihar.gov.in.',
    official_notification_url: 'https://bssc.bihar.gov.in/notices/CGL4_Advt.pdf',
    official_website_url: 'https://bssc.bihar.gov.in',
    date_of_notification: '2026-05-10',
    application_start_date: '2026-05-10',
    application_closing_date: '2026-06-15',
    tentative_exam_date: '2026-09-20',
    min_age: 21,
    max_age: 37,
    educational_qualification: 'Graduation in any discipline from a recognized University.',
    fee_details: { general: 540, obc: 540, ews: 540, sc: 135, st: 135, female: 135 },
    stages: [
      { name: 'Preliminary Examination (150 Questions - 600 Marks)', order: 1, type: 'prelims', mode: 'offline_omr', duration: 135, marks: 600, qual_marks: 240, status: 'scheduled', start_date: '2026-09-20' },
      { name: 'Main Examination (Paper I Hindi & Paper II GS)', order: 2, type: 'mains', mode: 'offline_omr', duration: 270, marks: 600, qual_marks: 240, status: 'upcoming' }
    ]
  },
  {
    org_slug: 'bpssc',
    category_slug: 'state-police',
    state_code: 'BR',
    title: 'BPSSC Bihar Police Sub-Inspector (Daroga) & Sergeant Competitive Examination 2026',
    short_title: 'Bihar Police SI 2026',
    slug: 'bihar-police-sub-inspector-daroga-bpssc-2026',
    exam_code: 'BPSSC-SI-02/2026',
    mode: 'offline_omr',
    frequency: 'annual',
    description: 'Recruitment examination for Police Sub-Inspectors (Daroga) in Bihar Police and Prohibition Sub-Inspectors.',
    syllabus_summary: 'Prelims: General Knowledge & Current Issues (100 Qs - 200 Marks). Mains: Paper-I General Hindi (100 Qs - 200 Marks qualifying) + Paper-II General Studies, Science, Math, Reasoning (100 Qs - 200 Marks).',
    marking_scheme: '0.20 marks deducted for each wrong answer.',
    pattern_description: 'Preliminary Written Exam (200 marks), Main Written Exam (200 marks), and Physical Efficiency Test (PET: 1.6km run, high jump, long jump, shot put).',
    application_process_guide: 'Apply online at bpssc.bih.nic.in.',
    official_notification_url: 'https://bpssc.bih.nic.in/Advt_SI_2026.pdf',
    official_website_url: 'https://bpssc.bih.nic.in',
    date_of_notification: '2026-08-10',
    application_start_date: '2026-08-10',
    application_closing_date: '2026-09-10',
    tentative_exam_date: '2026-11-29',
    min_age: 20,
    max_age: 37,
    educational_qualification: 'Graduation degree in any stream from a recognized University.',
    fee_details: { general: 700, obc: 700, ews: 700, sc: 400, st: 400, female: 400 },
    stages: [
      { name: 'Preliminary Written Examination (200 Marks)', order: 1, type: 'prelims', mode: 'offline_omr', duration: 120, marks: 200, qual_marks: 60, status: 'scheduled', start_date: '2026-11-29' },
      { name: 'Main Written Examination (Paper I & II)', order: 2, type: 'mains', mode: 'offline_omr', duration: 240, marks: 200, qual_marks: 60, status: 'upcoming' },
      { name: 'Physical Efficiency Test (PET)', order: 3, type: 'physical', mode: 'hybrid', duration: 60, marks: 0, qual_marks: 0, status: 'upcoming' }
    ]
  },

  // UTTAR PRADESH
  {
    org_slug: 'uppsc',
    category_slug: 'state-govt',
    state_code: 'UP',
    title: 'UPPSC Combined State / Upper Subordinate Services (PCS) Examination 2026',
    short_title: 'UPPSC PCS 2026',
    slug: 'uppsc-combined-state-upper-subordinate-pcs-2026',
    exam_code: 'UPPSC-PCS-2026',
    mode: 'offline_omr',
    frequency: 'annual',
    description: "Uttar Pradesh's flagship civil services examination for Sub-Divisional Magistrate (SDM), Deputy SP, Block Development Officer, and Commercial Tax Officers.",
    syllabus_summary: 'Prelims: Paper-I (General Studies - 200 marks) & Paper-II (CSAT - 200 marks qualifying 33%). Mains: General Hindi (150), Essay (150), General Studies Papers I through VI (200 marks each - 1200 marks total, with UP Special Papers V & VI).',
    marking_scheme: '1/3rd (0.33) marks deducted per incorrect answer in Prelims.',
    pattern_description: 'Stage-I Objective Prelims (400 marks), Stage-II Descriptive Written Mains (1500 marks), Stage-III Interview (100 marks).',
    application_process_guide: 'Apply online at uppsc.up.nic.in using UPPSC OTR registration.',
    official_notification_url: 'https://uppsc.up.nic.in/notices/PCS_2026_Notification.pdf',
    official_website_url: 'https://uppsc.up.nic.in',
    date_of_notification: '2026-01-01',
    application_start_date: '2026-01-01',
    application_closing_date: '2026-02-02',
    tentative_exam_date: '2026-10-27',
    min_age: 21,
    max_age: 40,
    educational_qualification: "Bachelor's Degree of any recognized University.",
    fee_details: { general: 125, obc: 125, ews: 125, sc: 65, st: 65, female: 25 },
    is_featured: true,
    stages: [
      { name: 'Preliminary Examination (GS-I & CSAT)', order: 1, type: 'prelims', mode: 'offline_omr', duration: 240, marks: 400, qual_marks: 66, status: 'scheduled', start_date: '2026-10-27' },
      { name: 'Main Written Examination (8 Descriptive Papers - 1500 Marks)', order: 2, type: 'mains', mode: 'pen_paper', duration: 1440, marks: 1500, qual_marks: 600, status: 'upcoming' },
      { name: 'Personality Test (Interview)', order: 3, type: 'interview', mode: 'hybrid', duration: 30, marks: 100, qual_marks: 0, status: 'upcoming' }
    ]
  },
  {
    org_slug: 'upsssc',
    category_slug: 'state-govt',
    state_code: 'UP',
    title: 'UPSSSC Preliminary Eligibility Test (PET) 2026',
    short_title: 'UPSSSC PET 2026',
    slug: 'upsssc-preliminary-eligibility-test-pet-2026',
    exam_code: 'UPSSSC-PET-2026',
    mode: 'offline_omr',
    frequency: 'annual',
    description: "Mandatory qualifying foundation eligibility test for all Group 'C' posts (Lekhpal, VDO, Junior Assistant, Forest Guard) in Uttar Pradesh Government.",
    syllabus_summary: 'Indian History, Indian National Movement, Geography, Indian Economy, Indian Constitution, General Science, Elementary Arithmetic, General Hindi, General English, Logic & Reasoning, Current Affairs, General Awareness, Reading Comprehension, Graph Interpretation (100 Qs total).',
    marking_scheme: '0.25 negative marks per incorrect response.',
    pattern_description: 'Statewide Pen-Paper OMR Examination (100 marks) producing valid PET Scorecard for 1 year.',
    application_process_guide: 'Apply online at upsssc.gov.in.',
    official_notification_url: 'https://upsssc.gov.in/notices/PET_2026_Advt.pdf',
    official_website_url: 'https://upsssc.gov.in',
    date_of_notification: '2026-08-01',
    application_start_date: '2026-08-01',
    application_closing_date: '2026-08-30',
    tentative_exam_date: '2026-10-28',
    min_age: 18,
    max_age: 40,
    educational_qualification: 'High School (10th) or Intermediate (12th) from a recognized Board.',
    fee_details: { general: 185, obc: 185, ews: 185, sc: 95, st: 95, female: 25 },
    stages: [
      { name: 'Preliminary Eligibility Test (100 Questions)', order: 1, type: 'prelims', mode: 'offline_omr', duration: 120, marks: 100, qual_marks: 50, status: 'scheduled', start_date: '2026-10-28' }
    ]
  },
  {
    org_slug: 'upprpb',
    category_slug: 'state-police',
    state_code: 'UP',
    title: 'UP Police Constable Direct Recruitment Examination 2026 (60,244 Posts)',
    short_title: 'UP Police Constable 2026',
    slug: 'up-police-constable-direct-recruitment-2026',
    exam_code: 'UPPRPB-CONSTABLE-2026',
    mode: 'offline_omr',
    frequency: 'annual',
    description: "India's largest state police recruitment examination for Civil Police Constables across 75 districts of Uttar Pradesh.",
    syllabus_summary: 'General Knowledge (38 Qs), General Hindi (37 Qs), Numerical & Mental Ability (38 Qs), Mental Aptitude / IQ / Reasoning Ability (37 Qs) - 150 Questions (300 Marks).',
    marking_scheme: '2 marks for correct answer, 0.50 marks negative marking for incorrect answer.',
    pattern_description: 'OMR Based Written Examination (300 marks), Document Verification & Physical Standard Test (PST), Physical Efficiency Test (PET: 4.8km run in 25 min).',
    application_process_guide: 'Apply online at uppbpb.gov.in with DigiLocker document verification.',
    official_notification_url: 'https://uppbpb.gov.in/notices/Constable_2026_Advt.pdf',
    official_website_url: 'https://uppbpb.gov.in',
    date_of_notification: '2026-06-20',
    application_start_date: '2026-06-20',
    application_closing_date: '2026-07-16',
    tentative_exam_date: '2026-08-23',
    min_age: 18,
    max_age: 25,
    educational_qualification: '10+2 (Intermediate) pass from recognized Board in India.',
    fee_details: { general: 400, obc: 400, ews: 400, sc: 400, st: 400, female: 400 },
    is_featured: true,
    stages: [
      { name: 'Written Examination (150 Questions - 300 Marks)', order: 1, type: 'prelims', mode: 'offline_omr', duration: 120, marks: 300, qual_marks: 120, status: 'scheduled', start_date: '2026-08-23' },
      { name: 'Physical Efficiency Test (PET - 4.8km Run)', order: 2, type: 'physical', mode: 'hybrid', duration: 30, marks: 0, qual_marks: 0, status: 'upcoming' }
    ]
  },

  // MADHYA PRADESH
  {
    org_slug: 'mppsc',
    category_slug: 'state-govt',
    state_code: 'MP',
    title: 'MPPSC State Service Examination 2026 (SSE) & State Forest Service Examination',
    short_title: 'MPPSC SSE 2026',
    slug: 'mppsc-state-service-examination-sse-2026',
    exam_code: 'MPPSC-SSE-2026',
    mode: 'offline_omr',
    frequency: 'annual',
    description: "Madhya Pradesh premier civil service examination for Deputy Collector, DSP, Commercial Tax Officer, and Chief Municipal Officer.",
    syllabus_summary: 'Prelims: Paper-I General Studies (200 marks) & Paper-II General Aptitude Test (200 marks). Mains: GS-I History/Geo, GS-II Polity/Econ, GS-III Science/Tech, GS-IV Ethics, Paper-V Hindi, Paper-VI Essay.',
    marking_scheme: 'No negative marking in MPPSC State Service Preliminary Examination.',
    pattern_description: 'Prelims OMR Exam (400 marks), Mains Written Exam (1500 marks), and Personality Test (175 marks).',
    application_process_guide: 'Apply online at mppsc.mp.gov.in / mponline.gov.in.',
    official_notification_url: 'https://mppsc.mp.gov.in/notices/SSE_2026_Advt.pdf',
    official_website_url: 'https://mppsc.mp.gov.in',
    date_of_notification: '2026-01-19',
    application_start_date: '2026-01-19',
    application_closing_date: '2026-02-18',
    tentative_exam_date: '2026-06-23',
    min_age: 21,
    max_age: 40,
    educational_qualification: 'Graduation in any discipline from a recognized University.',
    fee_details: { general: 500, obc: 250, ews: 250, sc: 250, st: 250, female: 250 },
    stages: [
      { name: 'Preliminary Examination (Paper I & II)', order: 1, type: 'prelims', mode: 'offline_omr', duration: 240, marks: 400, qual_marks: 160, status: 'scheduled', start_date: '2026-06-23' },
      { name: 'Main Examination (6 Descriptive Papers)', order: 2, type: 'mains', mode: 'pen_paper', duration: 1080, marks: 1500, qual_marks: 600, status: 'upcoming' },
      { name: 'Interview / Personality Test', order: 3, type: 'interview', mode: 'hybrid', duration: 30, marks: 175, qual_marks: 0, status: 'upcoming' }
    ]
  },
  {
    org_slug: 'mpesb',
    category_slug: 'state-govt',
    state_code: 'MP',
    title: 'MPESB Group-2 Sub-Group-4 (Patwari & Samarth Cadre) Combined Recruitment Examination 2026',
    short_title: 'MPESB Patwari & Group-2 2026',
    slug: 'mpesb-group-2-subgroup-4-patwari-2026',
    exam_code: 'MPESB-GRP2-2026',
    mode: 'online_cbt',
    frequency: 'as_needed',
    description: 'Madhya Pradesh state examination for Patwaris, Junior Accountants, Auditors, and Assistant Managers across state revenue offices.',
    syllabus_summary: 'Part-A: General Science, General Hindi, General English, General Mathematics (100 Marks). Part-B: General Knowledge & Aptitude, Computer Knowledge, Reasoning Ability, Management (100 Marks) - Total 200 Marks.',
    marking_scheme: 'No negative marking.',
    pattern_description: 'Single-tier Online Computer Based Test (200 marks) followed by Document Verification.',
    application_process_guide: 'Apply online at esb.mp.gov.in using MP Online portal profile.',
    official_notification_url: 'https://esb.mp.gov.in/notices/Group2_2026_Advt.pdf',
    official_website_url: 'https://esb.mp.gov.in',
    date_of_notification: '2026-03-05',
    application_start_date: '2026-03-05',
    application_closing_date: '2026-03-25',
    tentative_exam_date: '2026-07-15',
    min_age: 18,
    max_age: 40,
    educational_qualification: 'Graduation in any discipline + CPCT scorecard with Hindi typing.',
    fee_details: { general: 500, obc: 250, ews: 250, sc: 250, st: 250, female: 250 },
    stages: [
      { name: 'Computer Based Online Exam (200 Marks)', order: 1, type: 'prelims', mode: 'online_cbt', duration: 180, marks: 200, qual_marks: 80, status: 'scheduled', start_date: '2026-07-15' }
    ]
  },

  // RAJASTHAN
  {
    org_slug: 'rpsc',
    category_slug: 'state-govt',
    state_code: 'RJ',
    title: 'RPSC Rajasthan State and Subordinate Services Combined Competitive Exam 2026 (RAS/RTS)',
    short_title: 'RPSC RAS/RTS 2026',
    slug: 'rpsc-rajasthan-administrative-services-ras-rts-2026',
    exam_code: 'RPSC-RAS-2026',
    mode: 'offline_omr',
    frequency: 'annual',
    description: "Rajasthan's premier administrative examination for RAS (Rajasthan Administrative Service), RPS (Police Service), and Rajasthan Accounts Service.",
    syllabus_summary: 'Prelims: General Knowledge & General Science (200 marks - 150 Qs with Rajasthan Art, Culture, History & Economy). Mains: GS-I (History/Econ), GS-II (Ethics/Science), GS-III (Polity/PubAd), GS-IV (General Hindi & General English) - 200 marks each (800 marks total).',
    marking_scheme: '1/3rd marks deducted per incorrect question in Prelims.',
    pattern_description: 'Prelims OMR Exam (200 marks), Mains Written Descriptive Exam (800 marks), and Personality Test (100 marks).',
    application_process_guide: 'Apply online via SSO portal at sso.rajasthan.gov.in using One Time Registration (OTR).',
    official_notification_url: 'https://rpsc.rajasthan.gov.in/notices/RAS_2026_Advt.pdf',
    official_website_url: 'https://rpsc.rajasthan.gov.in',
    date_of_notification: '2026-07-01',
    application_start_date: '2026-07-01',
    application_closing_date: '2026-07-31',
    tentative_exam_date: '2026-10-01',
    min_age: 21,
    max_age: 40,
    educational_qualification: 'Graduation in any discipline from a recognized University.',
    fee_details: { general: 600, obc: 400, ews: 400, sc: 400, st: 400, female: 400 },
    is_featured: true,
    stages: [
      { name: 'Preliminary Examination (150 Questions - 200 Marks)', order: 1, type: 'prelims', mode: 'offline_omr', duration: 180, marks: 200, qual_marks: 70, status: 'scheduled', start_date: '2026-10-01' },
      { name: 'Main Written Examination (4 Papers - 800 Marks)', order: 2, type: 'mains', mode: 'pen_paper', duration: 720, marks: 800, qual_marks: 320, status: 'upcoming' },
      { name: 'Personality Test & Viva-voce', order: 3, type: 'interview', mode: 'hybrid', duration: 30, marks: 100, qual_marks: 0, status: 'upcoming' }
    ]
  },
  {
    org_slug: 'rsmssb',
    category_slug: 'state-govt',
    state_code: 'RJ',
    title: 'RSMSSB Common Eligibility Test (CET Graduate & Senior Secondary Level) 2026',
    short_title: 'RSMSSB CET 2026',
    slug: 'rsmssb-common-eligibility-test-cet-2026',
    exam_code: 'RSMSSB-CET-2026',
    mode: 'offline_omr',
    frequency: 'annual',
    description: 'Mandatory eligibility examination for Patwari, Junior Accountant, Platoon Commander, Clerk Grade-II, and Constable positions in Rajasthan.',
    syllabus_summary: 'Rajasthan History, Art, Culture, Geography, Indian Polity, Economy, General Science, Reasoning, Math, General Hindi, General English, Computers (150 Qs - 300 Marks).',
    marking_scheme: 'No negative marking in Rajasthan CET.',
    pattern_description: 'Single Stage Pen-Paper OMR Examination (300 marks) with a 3-year validity certificate.',
    application_process_guide: 'Apply online through Rajasthan SSO Portal (sso.rajasthan.gov.in).',
    official_notification_url: 'https://rsmssb.rajasthan.gov.in/notices/CET_2026_Advt.pdf',
    official_website_url: 'https://rsmssb.rajasthan.gov.in',
    date_of_notification: '2026-08-05',
    application_start_date: '2026-08-05',
    application_closing_date: '2026-09-07',
    tentative_exam_date: '2026-10-21',
    min_age: 18,
    max_age: 40,
    educational_qualification: 'Senior Secondary (12th) or Graduation based on CET level.',
    fee_details: { general: 600, obc: 400, ews: 400, sc: 400, st: 400, female: 400 },
    stages: [
      { name: 'Written Examination (150 Questions - 300 Marks)', order: 1, type: 'prelims', mode: 'offline_omr', duration: 180, marks: 300, qual_marks: 120, status: 'scheduled', start_date: '2026-10-21' }
    ]
  },

  // DELHI
  {
    org_slug: 'dsssb',
    category_slug: 'teaching',
    state_code: 'DL',
    title: 'DSSSB Special Educator, TGT, PGT & Assistant Teacher Combined Examination 2026',
    short_title: 'DSSSB Teaching Exam 2026',
    slug: 'dsssb-special-educator-tgt-pgt-teacher-2026',
    exam_code: 'DSSSB-TEACHER-2026',
    mode: 'online_cbt',
    frequency: 'annual',
    description: 'National competitive examination for Teachers and Special Educators under the Directorate of Education (DoE), Govt of NCT of Delhi.',
    syllabus_summary: 'Section-A: General Awareness, General Intelligence & Reasoning, Arithmetical & Numerical Ability, Hindi Language, English Language (100 marks). Section-B: Subject Specific Methodology, Pedagogy, Teaching Aptitude (100 marks).',
    marking_scheme: '0.25 negative marks per incorrect answer.',
    pattern_description: 'One Tier Computer Based Examination (200 marks total) followed by Document Verification.',
    application_process_guide: 'Apply online at dsssbonline.nic.in after completing OARS user registration.',
    official_notification_url: 'https://dsssb.delhi.gov.in/notices/Teacher_2026_Advt.pdf',
    official_website_url: 'https://dsssbonline.nic.in',
    date_of_notification: '2026-01-09',
    application_start_date: '2026-01-09',
    application_closing_date: '2026-02-07',
    tentative_exam_date: '2026-07-08',
    min_age: 18,
    max_age: 32,
    educational_qualification: 'Graduation / Post Graduation with B.Ed / D.El.Ed and CTET Paper-I/II qualified.',
    fee_details: { general: 100, obc: 100, ews: 100, sc: 0, st: 0, female: 0 },
    stages: [
      { name: 'One Tier Computer Based Examination (200 Marks)', order: 1, type: 'prelims', mode: 'online_cbt', duration: 120, marks: 200, qual_marks: 80, status: 'scheduled', start_date: '2026-07-08' }
    ]
  },
  {
    org_slug: 'delhi-police',
    category_slug: 'state-police',
    state_code: 'DL',
    title: 'Delhi Police Executive Constable (Male & Female) Computer Based Examination 2026',
    short_title: 'Delhi Police Constable 2026',
    slug: 'delhi-police-constable-executive-2026',
    exam_code: 'DP-CONSTABLE-2026',
    mode: 'online_cbt',
    frequency: 'annual',
    description: 'National recruitment conducted through SSC for Executive Constables in Delhi Police with all-India posting in National Capital Territory.',
    syllabus_summary: 'Reasoning (25 Qs), General Knowledge / Current Affairs (50 Qs), Numerical Ability (15 Qs), Computer Fundamentals / MS Office / Internet (10 Qs) - 100 Questions (100 Marks).',
    marking_scheme: '0.25 marks negative marking.',
    pattern_description: 'Computer Based Test (100 marks) followed by Physical Endurance & Measurement Test (PE&MT: 1600m run, long jump, high jump).',
    application_process_guide: 'Apply online at ssc.gov.in / delhipolice.gov.in.',
    official_notification_url: 'https://delhipolice.gov.in/notices/DP_Constable_2026.pdf',
    official_website_url: 'https://delhipolice.gov.in',
    date_of_notification: '2026-09-01',
    application_start_date: '2026-09-01',
    application_closing_date: '2026-09-30',
    tentative_exam_date: '2026-11-14',
    min_age: 18,
    max_age: 25,
    educational_qualification: '10+2 (Senior Secondary) pass from a recognized Board. Male candidates must possess a valid driving license for LMV.',
    fee_details: { general: 100, obc: 100, ews: 100, sc: 0, st: 0, female: 0 },
    stages: [
      { name: 'Computer Based Examination (100 Questions)', order: 1, type: 'prelims', mode: 'online_cbt', duration: 90, marks: 100, qual_marks: 40, status: 'scheduled', start_date: '2026-11-14' },
      { name: 'Physical Endurance & Measurement Test (PE&MT)', order: 2, type: 'physical', mode: 'hybrid', duration: 60, marks: 0, qual_marks: 0, status: 'upcoming' }
    ]
  },

  // HARYANA
  {
    org_slug: 'hpsc',
    category_slug: 'state-govt',
    state_code: 'HR',
    title: 'HPSC Haryana Civil Services (Executive Branch) & Allied Services Examination 2026',
    short_title: 'HPSC HCS 2026',
    slug: 'hpsc-haryana-civil-services-hcs-2026',
    exam_code: 'HPSC-HCS-2026',
    mode: 'offline_omr',
    frequency: 'annual',
    description: "Haryana's premier competitive examination for HCS (Executive Branch), DSP, Excise & Taxation Officer, District Food & Supplies Controller, and 'A' Class Tehsildar.",
    syllabus_summary: 'Prelims: Paper-I General Studies (100 marks) & Paper-II CSAT (100 marks qualifying 33%). Mains: English (100), Hindi (100), General Studies (200), One Optional Subject (200) - 600 Marks total.',
    marking_scheme: '0.25 marks penalty per wrong response in Prelims. 5th option mandatory on OMR sheet.',
    pattern_description: 'Prelims OMR Exam (200 marks), Mains Written Conventional Exam (600 marks), and Personality Test (75 marks).',
    application_process_guide: 'Apply online at hpsc.gov.in using Haryana Parivar Pehchan Patra (PPP) / Aadhaar.',
    official_notification_url: 'https://hpsc.gov.in/notices/HCS_2026_Advt.pdf',
    official_website_url: 'https://hpsc.gov.in',
    date_of_notification: '2026-11-17',
    application_start_date: '2026-11-17',
    application_closing_date: '2026-12-25',
    tentative_exam_date: '2026-02-11',
    min_age: 18,
    max_age: 42,
    educational_qualification: 'Bachelor of Arts / Science / Commerce or an equivalent degree of a recognized University.',
    fee_details: { general: 1000, obc: 250, ews: 250, sc: 250, st: 250, female: 250 },
    stages: [
      { name: 'Preliminary Examination (GS & CSAT)', order: 1, type: 'prelims', mode: 'offline_omr', duration: 240, marks: 200, qual_marks: 66, status: 'scheduled', start_date: '2026-02-11' },
      { name: 'Main Written Examination (4 Papers - 600 Marks)', order: 2, type: 'mains', mode: 'pen_paper', duration: 720, marks: 600, qual_marks: 270, status: 'upcoming' },
      { name: 'Personality Test (Interview)', order: 3, type: 'interview', mode: 'hybrid', duration: 30, marks: 75, qual_marks: 0, status: 'upcoming' }
    ]
  },
  {
    org_slug: 'hssc',
    category_slug: 'state-govt',
    state_code: 'HR',
    title: 'HSSC Common Eligibility Test (CET Group C & Group D) 2026',
    short_title: 'HSSC CET 2026',
    slug: 'hssc-common-eligibility-test-cet-2026',
    exam_code: 'HSSC-CET-2026',
    mode: 'offline_omr',
    frequency: 'annual',
    description: "Foundation recruitment examination for all Group 'C' and Group 'D' government positions across boards, corporations, and departments in Haryana.",
    syllabus_summary: '75% Weightage: General Awareness, Reasoning, Maths, Science, Computer, English, Hindi. 25% Weightage: Haryana History, Current Affairs, Literature, Geography, Civics, Environment, Culture (100 Qs - 95 Marks + 5 Socio-Economic marks).',
    marking_scheme: '0.95 marks per question. No negative marking, but mandatory 5th bubble to prevent tampering.',
    pattern_description: 'Statewide Pen-Paper OMR Examination (95 marks + 5 socio-economic criteria marks).',
    application_process_guide: 'Apply online at onetimeregn.haryana.gov.in using PPP (Family ID).',
    official_notification_url: 'https://hssc.gov.in/notices/CET_2026_Advt.pdf',
    official_website_url: 'https://hssc.gov.in',
    date_of_notification: '2026-05-30',
    application_start_date: '2026-05-30',
    application_closing_date: '2026-06-25',
    tentative_exam_date: '2026-08-17',
    min_age: 18,
    max_age: 42,
    educational_qualification: '10+2 / Graduation depending on Group level with Hindi/Sanskrit up to Matriculation standard.',
    fee_details: { general: 500, obc: 250, ews: 250, sc: 250, st: 250, female: 250 },
    stages: [
      { name: 'Common Eligibility Test (100 Questions - 95 Marks)', order: 1, type: 'prelims', mode: 'offline_omr', duration: 105, marks: 95, qual_marks: 47.5, status: 'scheduled', start_date: '2026-08-17' }
    ]
  },

  // JHARKHAND
  {
    org_slug: 'jpsc',
    category_slug: 'state-govt',
    state_code: 'JH',
    title: 'JPSC Combined Civil Services Examination 2026 (12th, 13th, 14th JPSC CCE)',
    short_title: 'JPSC CCE 2026',
    slug: 'jpsc-combined-civil-services-cce-2026',
    exam_code: 'JPSC-CCE-2026',
    mode: 'offline_omr',
    frequency: 'annual',
    description: "Jharkhand's premier civil services competitive examination for Jharkhand Administrative Service (JAS), Police Service (JPS), and Accounts Service.",
    syllabus_summary: 'Prelims: Paper-I General Studies (200 marks) & Paper-II Jharkhand Specific General Studies (200 marks). Mains: 6 Descriptive Papers (General Hindi/English, Language/Literature, Social Sciences, Indian Constitution, Indian Economy, General Science/Tech - 1050 Marks total).',
    marking_scheme: 'No negative marking in JPSC Combined Civil Services Preliminary Examination.',
    pattern_description: 'Prelims OMR Exam (400 marks), Mains Written Descriptive Exam (1050 marks), and Interview (100 marks).',
    application_process_guide: 'Apply online at jpsc.gov.in.',
    official_notification_url: 'https://jpsc.gov.in/notices/CCE_2026_Advt.pdf',
    official_website_url: 'https://jpsc.gov.in',
    date_of_notification: '2026-01-27',
    application_start_date: '2026-01-27',
    application_closing_date: '2026-02-29',
    tentative_exam_date: '2026-03-17',
    min_age: 21,
    max_age: 35,
    educational_qualification: 'Graduation in any discipline from a recognized University.',
    fee_details: { general: 100, obc: 100, ews: 100, sc: 50, st: 50, female: 50 },
    stages: [
      { name: 'Preliminary Examination (Paper I & II - 400 Marks)', order: 1, type: 'prelims', mode: 'offline_omr', duration: 240, marks: 400, qual_marks: 160, status: 'scheduled', start_date: '2026-03-17' },
      { name: 'Main Written Examination (6 Descriptive Papers)', order: 2, type: 'mains', mode: 'pen_paper', duration: 1080, marks: 1050, qual_marks: 420, status: 'upcoming' },
      { name: 'Interview / Personality Test', order: 3, type: 'interview', mode: 'hybrid', duration: 30, marks: 100, qual_marks: 0, status: 'upcoming' }
    ]
  },
  {
    org_slug: 'jssc',
    category_slug: 'state-govt',
    state_code: 'JH',
    title: 'JSSC Jharkhand General Graduate Level Combined Competitive Exam (JGGLCCE / CGL) 2026',
    short_title: 'JSSC CGL 2026',
    slug: 'jssc-graduate-level-cgl-jgglcce-2026',
    exam_code: 'JSSC-JGGLCCE-2026',
    mode: 'offline_omr',
    frequency: 'as_needed',
    description: 'State recruitment examination for Assistant Branch Officers, Block Supply Officers, Junior Secretariat Assistants, and Planning Assistants in Jharkhand.',
    syllabus_summary: 'Paper-1: Language Knowledge (Hindi & English qualifying 30%). Paper-2: Regional / Tribal Language (100 Qs - 300 Marks). Paper-3: General Knowledge, General Science, Maths, Mental Ability, Computer, Jharkhand Specific GK (150 Qs - 450 Marks).',
    marking_scheme: '3 marks per correct answer, 1 mark deducted per incorrect answer.',
    pattern_description: 'Main Written Examination in 3 shifts (OMR Based - 750 Merit Marks) followed by Document Verification.',
    application_process_guide: 'Apply online at jssc.nic.in.',
    official_notification_url: 'https://jssc.nic.in/notices/JGGLCCE_2026_Advt.pdf',
    official_website_url: 'https://jssc.nic.in',
    date_of_notification: '2026-06-20',
    application_start_date: '2026-06-20',
    application_closing_date: '2026-07-19',
    tentative_exam_date: '2026-09-21',
    min_age: 21,
    max_age: 35,
    educational_qualification: 'Graduation in any stream from recognized University.',
    fee_details: { general: 100, obc: 100, ews: 100, sc: 50, st: 50, female: 50 },
    stages: [
      { name: 'Written Examination (Papers 1, 2, 3 - 3 Shifts)', order: 1, type: 'prelims', mode: 'offline_omr', duration: 360, marks: 750, qual_marks: 300, status: 'scheduled', start_date: '2026-09-21' }
    ]
  },

  // UTTARAKHAND
  {
    org_slug: 'ukpsc',
    category_slug: 'state-govt',
    state_code: 'UK',
    title: 'UKPSC Uttarakhand Combined State Civil / Upper Subordinate Services Exam 2026 (UKPSC PCS)',
    short_title: 'UKPSC PCS 2026',
    slug: 'ukpsc-uttarakhand-civil-services-pcs-2026',
    exam_code: 'UKPSC-PCS-2026',
    mode: 'offline_omr',
    frequency: 'annual',
    description: "Uttarakhand's state civil services competitive examination for Deputy Collector, Deputy SP, District Commandant Homeguards, and Finance Officers.",
    syllabus_summary: 'Prelims: Paper-I General Studies (150 marks) & Paper-II General Aptitude (150 marks). Mains: Language (300), History/Culture (200), Polity/Ethics (200), Economy/Geo (200), Science/Tech (200), Uttarakhand Specific Papers (400) - 1500 Marks total.',
    marking_scheme: '0.25 marks penalty per wrong answer in Prelims.',
    pattern_description: 'Prelims OMR Exam (300 marks), Mains Written Descriptive Exam (1500 marks), and Interview (150 marks).',
    application_process_guide: 'Apply online at psc.uk.gov.in.',
    official_notification_url: 'https://psc.uk.gov.in/notices/PCS_2026_Advt.pdf',
    official_website_url: 'https://psc.uk.gov.in',
    date_of_notification: '2026-03-14',
    application_start_date: '2026-03-14',
    application_closing_date: '2026-04-03',
    tentative_exam_date: '2026-07-14',
    min_age: 21,
    max_age: 42,
    educational_qualification: "Bachelor's Degree from any recognized University.",
    fee_details: { general: 172.3, obc: 172.3, ews: 172.3, sc: 82.3, st: 82.3, female: 172.3 },
    stages: [
      { name: 'Preliminary Examination (GS & Aptitude - 300 Marks)', order: 1, type: 'prelims', mode: 'offline_omr', duration: 240, marks: 300, qual_marks: 100, status: 'scheduled', start_date: '2026-07-14' },
      { name: 'Main Written Examination (Descriptive 1500 Marks)', order: 2, type: 'mains', mode: 'pen_paper', duration: 1260, marks: 1500, qual_marks: 600, status: 'upcoming' },
      { name: 'Interview / Personality Evaluation', order: 3, type: 'interview', mode: 'hybrid', duration: 30, marks: 150, qual_marks: 0, status: 'upcoming' }
    ]
  },

  // WEST BENGAL
  {
    org_slug: 'wbpsc',
    category_slug: 'state-govt',
    state_code: 'WB',
    title: 'WBPSC West Bengal Civil Service (Executive) etc. Examination, 2026 (WBCS 2026)',
    short_title: 'WBCS 2026',
    slug: 'wbpsc-west-bengal-civil-service-wbcs-2026',
    exam_code: 'WBPSC-WBCS-2026',
    mode: 'offline_omr',
    frequency: 'annual',
    description: "West Bengal's premier administrative examination for WBCS (Exe), West Bengal Police Service (WBPS), Revenue Service, and Cooperative Service across Group A, B, C, D cadres.",
    syllabus_summary: 'Prelims: English, General Science, Current Events, Indian History, Geography of India with special reference to West Bengal, Indian Polity & Economy, Indian National Movement, General Mental Ability (200 Qs - 200 Marks). Mains: 6 Compulsory Papers + 2 Optional Papers.',
    marking_scheme: 'Negative marking for incorrect answers as specified by the commission (0.33 mark).',
    pattern_description: 'Prelims OMR Exam (200 marks), Mains Written Exam (1600 marks for Gr A & B), and Personality Test (200 marks).',
    application_process_guide: 'Apply online at psc.wb.gov.in using WBPSC Enrolment ID.',
    official_notification_url: 'https://psc.wb.gov.in/notices/WBCS_2026_Advt.pdf',
    official_website_url: 'https://psc.wb.gov.in',
    date_of_notification: '2026-02-28',
    application_start_date: '2026-02-28',
    application_closing_date: '2026-03-21',
    tentative_exam_date: '2026-12-16',
    min_age: 21,
    max_age: 36,
    educational_qualification: 'A degree of a recognized University and ability to read, write and speak in Bengali (not required for Nepali speaking candidates of Darjeeling/Kalimpong).',
    fee_details: { general: 210, obc: 210, ews: 210, sc: 0, st: 0, female: 210 },
    is_featured: true,
    stages: [
      { name: 'Preliminary Examination (200 Questions - 200 Marks)', order: 1, type: 'prelims', mode: 'offline_omr', duration: 150, marks: 200, qual_marks: 110, status: 'scheduled', start_date: '2026-12-16' },
      { name: 'Main Written Examination (8 Papers - 1600 Marks)', order: 2, type: 'mains', mode: 'pen_paper', duration: 1440, marks: 1600, qual_marks: 700, status: 'upcoming' },
      { name: 'Personality Test', order: 3, type: 'interview', mode: 'hybrid', duration: 30, marks: 200, qual_marks: 0, status: 'upcoming' }
    ]
  },
  {
    org_slug: 'wbprb',
    category_slug: 'state-police',
    state_code: 'WB',
    title: 'WBPRB West Bengal Police Sub-Inspector & Constable Combined Recruitment 2026',
    short_title: 'WB Police SI & Constable 2026',
    slug: 'wb-police-sub-inspector-constable-wbprb-2026',
    exam_code: 'WBPRB-POLICE-2026',
    mode: 'offline_omr',
    frequency: 'annual',
    description: 'State recruitment for Armed and Unarmed Sub-Inspectors and Constables in West Bengal Police and Kolkata Police.',
    syllabus_summary: 'Preliminary: General Studies (50 Qs), Logical & Analytical Reasoning (25 Qs), Arithmetic (25 Qs) - 200 Marks total. Final Combined Exam: Paper-I GS & Arithmetic, Paper-II English, Paper-III Bengali/Hindi/Urdu/Nepali.',
    marking_scheme: '0.25 marks deducted per wrong answer.',
    pattern_description: 'Preliminary Screening Test (200 marks), Physical Measurement Test (PMT) & Physical Efficiency Test (PET: 800m run), Final Combined Competitive Exam (200 marks), Personality Test (30 marks).',
    application_process_guide: 'Apply online at prb.wb.gov.in.',
    official_notification_url: 'https://prb.wb.gov.in/notices/WB_Police_2026_Advt.pdf',
    official_website_url: 'https://prb.wb.gov.in',
    date_of_notification: '2026-03-07',
    application_start_date: '2026-03-07',
    application_closing_date: '2026-04-05',
    tentative_exam_date: '2026-06-18',
    min_age: 18,
    max_age: 30,
    educational_qualification: "SI: Bachelor's degree in any discipline. Constable: Madhyamik (10th) examination pass with fluency in Bengali.",
    fee_details: { general: 270, obc: 270, ews: 270, sc: 20, st: 20, female: 270 },
    stages: [
      { name: 'Preliminary Written Test (100 Qs - 200 Marks)', order: 1, type: 'prelims', mode: 'offline_omr', duration: 90, marks: 200, qual_marks: 80, status: 'scheduled', start_date: '2026-06-18' },
      { name: 'PMT & Physical Efficiency Test (PET)', order: 2, type: 'physical', mode: 'hybrid', duration: 30, marks: 0, qual_marks: 0, status: 'upcoming' },
      { name: 'Final Combined Competitive Examination (200 Marks)', order: 3, type: 'mains', mode: 'pen_paper', duration: 240, marks: 200, qual_marks: 80, status: 'upcoming' }
    ]
  },

  // ODISHA
  {
    org_slug: 'opsc',
    category_slug: 'state-govt',
    state_code: 'OD',
    title: 'Odisha Civil Services Examination 2026 (OCS-2026) for Group A & Group B Posts',
    short_title: 'OPSC OCS 2026',
    slug: 'opsc-odisha-civil-services-examination-ocs-2026',
    exam_code: 'OPSC-OCS-2026',
    mode: 'offline_omr',
    frequency: 'annual',
    description: "Odisha premier administrative recruitment examination for Odisha Administrative Service (OAS), Odisha Police Service (OPS), and Odisha Finance Service (OFS).",
    syllabus_summary: 'Prelims: Paper-I General Studies (200 marks) & Paper-II CSAT (200 marks qualifying 33%). Mains: Odia (250), English (250), Essay (250), GS-I to IV (250 each), Two Optional Papers (250 each) - 2000 Marks total.',
    marking_scheme: '1/3rd (0.33) marks penalty per wrong answer in Prelims.',
    pattern_description: 'Prelims OMR Exam (400 marks), Mains Written Conventional Exam (2000 marks), and Personality Test (250 marks).',
    application_process_guide: 'Apply online at opsc.gov.in using OPSC candidate portal.',
    official_notification_url: 'https://opsc.gov.in/notices/OCS_2026_Advt.pdf',
    official_website_url: 'https://opsc.gov.in',
    date_of_notification: '2026-01-01',
    application_start_date: '2026-01-01',
    application_closing_date: '2026-02-16',
    tentative_exam_date: '2026-10-27',
    min_age: 21,
    max_age: 38,
    educational_qualification: "Bachelor's Degree from recognized University and ability to read, write and speak Odia (passed Middle School exam with Odia language).",
    fee_details: { general: 0, obc: 0, ews: 0, sc: 0, st: 0, female: 0 },
    is_featured: true,
    stages: [
      { name: 'Preliminary Examination (Paper I & II - 400 Marks)', order: 1, type: 'prelims', mode: 'offline_omr', duration: 240, marks: 400, qual_marks: 140, status: 'scheduled', start_date: '2026-10-27' },
      { name: 'Main Written Examination (9 Descriptive Papers)', order: 2, type: 'mains', mode: 'pen_paper', duration: 1620, marks: 2000, qual_marks: 800, status: 'upcoming' },
      { name: 'Personality Test / Interview', order: 3, type: 'interview', mode: 'hybrid', duration: 30, marks: 250, qual_marks: 0, status: 'upcoming' }
    ]
  },
  {
    org_slug: 'osssc',
    category_slug: 'state-govt',
    state_code: 'OD',
    title: 'OSSSC Combined Recruitment Examination (CRE for RI, ARI, Amin, ICDS Supervisor) 2026',
    short_title: 'OSSSC CRE 2026',
    slug: 'osssc-combined-recruitment-examination-cre-2026',
    exam_code: 'OSSSC-CRE-2026',
    mode: 'online_cbt',
    frequency: 'annual',
    description: 'State recruitment for Revenue Inspectors (RI), Assistant Revenue Inspectors (ARI), Amin, and ICDS Supervisors across 30 revenue districts of Odisha.',
    syllabus_summary: 'Prelims: Mathematics (40 Qs), General Studies (40 Qs), English (40 Qs), Odia (20 Qs), Logical Reasoning (40 Qs) - 100 Marks. Mains: Mathematics, General Studies, English, Odia, Computer (180 Marks) + Practical Skill Test in Basic Computer Skills (50 Marks).',
    marking_scheme: '1/3rd marks deducted per incorrect answer in CBT.',
    pattern_description: 'Preliminary Online CBT (100 marks), Main Online CBT (180 marks), and Practical Skill Test in Computer.',
    application_process_guide: 'Apply online at osssc.gov.in using OSSSC One Time Registration.',
    official_notification_url: 'https://osssc.gov.in/notices/CRE_2026_Advt.pdf',
    official_website_url: 'https://osssc.gov.in',
    date_of_notification: '2026-02-15',
    application_start_date: '2026-02-15',
    application_closing_date: '2026-03-20',
    tentative_exam_date: '2026-09-20',
    min_age: 21,
    max_age: 38,
    educational_qualification: 'Graduation in any discipline for RI/Supervisor; Higher Secondary (10+2) for ARI/Amin with Odia language proficiency.',
    fee_details: { general: 0, obc: 0, ews: 0, sc: 0, st: 0, female: 0 },
    stages: [
      { name: 'Preliminary Examination (100 Questions - 100 Marks)', order: 1, type: 'prelims', mode: 'online_cbt', duration: 90, marks: 100, qual_marks: 40, status: 'scheduled', start_date: '2026-09-20' },
      { name: 'Main Examination & Computer Skill Test', order: 2, type: 'mains', mode: 'online_cbt', duration: 180, marks: 230, qual_marks: 90, status: 'upcoming' }
    ]
  },

  // ASSAM
  {
    org_slug: 'apsc',
    category_slug: 'state-govt',
    state_code: 'AS',
    title: 'APSC Combined Competitive Examination 2026 (APSC CCE) for Assam Civil Service & Police Service',
    short_title: 'APSC CCE 2026',
    slug: 'apsc-combined-competitive-examination-cce-2026',
    exam_code: 'APSC-CCE-2026',
    mode: 'offline_omr',
    frequency: 'annual',
    description: "Assam's state premier competitive examination for Assam Civil Service (Junior Grade), Assam Police Service (APS), Superintendent of Taxes, and Block Development Officers.",
    syllabus_summary: 'Prelims: Paper-I General Studies-I (200 marks) & Paper-II General Studies-II (CSAT 200 marks qualifying 33%). Mains: 6 Papers (Essay, GS I-IV, Assam Specific GS-V - 1500 Marks total). Interview.',
    marking_scheme: '0.25 marks penalty per wrong answer in Prelims.',
    pattern_description: 'Prelims OMR Exam (400 marks), Mains Written Conventional Exam (1500 marks), and Interview (180 marks).',
    application_process_guide: 'Apply online at apscrecruitment.in with Assam District Employment Exchange registration details.',
    official_notification_url: 'https://apsc.nic.in/notices/CCE_2026_Advt.pdf',
    official_website_url: 'https://apscrecruitment.in',
    date_of_notification: '2026-01-12',
    application_start_date: '2026-01-12',
    application_closing_date: '2026-02-06',
    tentative_exam_date: '2026-03-18',
    min_age: 21,
    max_age: 38,
    educational_qualification: 'Degree from any recognized University. Candidate must be registered in a District Employment Exchange in Assam.',
    fee_details: { general: 297, obc: 197, ews: 197, sc: 197, st: 197, female: 47 },
    is_featured: true,
    stages: [
      { name: 'Preliminary Examination (GS-I & GS-II - 400 Marks)', order: 1, type: 'prelims', mode: 'offline_omr', duration: 240, marks: 400, qual_marks: 140, status: 'scheduled', start_date: '2026-03-18' },
      { name: 'Main Written Examination (6 Descriptive Papers - 1500 Marks)', order: 2, type: 'mains', mode: 'pen_paper', duration: 1080, marks: 1500, qual_marks: 600, status: 'upcoming' },
      { name: 'Interview / Personality Test', order: 3, type: 'interview', mode: 'hybrid', duration: 30, marks: 180, qual_marks: 0, status: 'upcoming' }
    ]
  },
  {
    org_slug: 'slprb-assam',
    category_slug: 'state-police',
    state_code: 'AS',
    title: 'Assam Police State Level Police Recruitment Board (SLPRB) Constable & SI Examination 2026',
    short_title: 'Assam Police SLPRB 2026',
    slug: 'assam-police-slprb-constable-sub-inspector-2026',
    exam_code: 'SLPRB-POLICE-2026',
    mode: 'offline_omr',
    frequency: 'annual',
    description: 'Direct recruitment for Unarmed / Armed Branch Constables, Sub-Inspectors, Commando Battalions, and Forest Guards in Assam Police.',
    syllabus_summary: 'Logical Reasoning, Aptitude, History & Culture of Assam and India, General Awareness / General Knowledge (100 Qs - 50/100 Marks).',
    marking_scheme: '0.50 negative marks for SI examination. No negative marking for Constable test.',
    pattern_description: 'Physical Standard Test (PST) & Physical Efficiency Test (PET: 3.2km run for male, 1.6km for female) followed by Written Examination.',
    application_process_guide: 'Apply online at slprbassam.in with Assamese language certificate and employment exchange card.',
    official_notification_url: 'https://slprbassam.in/notices/Assam_Police_2026_Advt.pdf',
    official_website_url: 'https://slprbassam.in',
    date_of_notification: '2026-03-01',
    application_start_date: '2026-03-01',
    application_closing_date: '2026-03-25',
    tentative_exam_date: '2026-06-20',
    min_age: 18,
    max_age: 25,
    educational_qualification: 'H.S.L.C (10th) / HSSLC (12th) for Constable or Graduation for Sub-Inspector.',
    fee_details: { general: 0, obc: 0, ews: 0, sc: 0, st: 0, female: 0 },
    stages: [
      { name: 'Physical Standards (PST) & Physical Efficiency Test (PET)', order: 1, type: 'physical', mode: 'hybrid', duration: 60, marks: 40, qual_marks: 20, status: 'scheduled', start_date: '2026-06-20' },
      { name: 'Written Examination (100 Questions)', order: 2, type: 'prelims', mode: 'offline_omr', duration: 120, marks: 100, qual_marks: 40, status: 'upcoming' }
    ]
  },

  // PUNJAB
  {
    org_slug: 'ppsc',
    category_slug: 'state-govt',
    state_code: 'PB',
    title: 'PPSC Punjab State Civil Services Combined Competitive Examination (PSCSCCE) 2026',
    short_title: 'PPSC Civil Services 2026',
    slug: 'ppsc-punjab-state-civil-services-psc-scce-2026',
    exam_code: 'PPSC-CCE-2026',
    mode: 'offline_omr',
    frequency: 'annual',
    description: "Punjab's premier administrative examination for Punjab Civil Service (Executive Branch), DSP, Excise & Taxation Officer, Tehsildar, and Block Development & Panchayat Officers.",
    syllabus_summary: 'Prelims: Paper-I General Studies (100 Qs - 200 marks) & Paper-II Civil Services Aptitude Test CSAT (80 Qs - 200 marks). Mains: Punjabi (100), English (100), Essay (150), GS-I History/Geo (250), GS-II Polity/Governance (250), GS-III Economy/Stats (250), GS-IV Science/Security (250) - 1350 Marks total.',
    marking_scheme: 'No negative marking in PPSC Preliminary Examination.',
    pattern_description: 'Prelims OMR Exam (400 marks), Mains Written Descriptive Exam (1350 marks), and Interview (150 marks).',
    application_process_guide: 'Apply online at ppsc.gov.in with Punjabi language matriculation credentials.',
    official_notification_url: 'https://ppsc.gov.in/notices/PSCSCCE_2026_Advt.pdf',
    official_website_url: 'https://ppsc.gov.in',
    date_of_notification: '2026-04-10',
    application_start_date: '2026-04-10',
    application_closing_date: '2026-05-10',
    tentative_exam_date: '2026-08-08',
    min_age: 21,
    max_age: 37,
    educational_qualification: "Bachelor's degree in any discipline. Passed Matriculation examination with Punjabi as one of the compulsory or elective subjects.",
    fee_details: { general: 1500, obc: 750, ews: 500, sc: 750, st: 750, female: 1500 },
    stages: [
      { name: 'Preliminary Examination (GS & CSAT - 400 Marks)', order: 1, type: 'prelims', mode: 'offline_omr', duration: 240, marks: 400, qual_marks: 150, status: 'scheduled', start_date: '2026-08-08' },
      { name: 'Main Written Examination (7 Descriptive Papers - 1350 Marks)', order: 2, type: 'mains', mode: 'pen_paper', duration: 1260, marks: 1350, qual_marks: 540, status: 'upcoming' },
      { name: 'Interview / Personality Evaluation', order: 3, type: 'interview', mode: 'hybrid', duration: 30, marks: 150, qual_marks: 0, status: 'upcoming' }
    ]
  },
  {
    org_slug: 'psssb',
    category_slug: 'state-govt',
    state_code: 'PB',
    title: 'PSSSB Patwari, Senior Assistant, and Clerical Cadre Combined Examination 2026',
    short_title: 'PSSSB Patwari & Clerk 2026',
    slug: 'psssb-patwari-clerk-senior-assistant-2026',
    exam_code: 'PSSSB-PATWARI-2026',
    mode: 'offline_omr',
    frequency: 'annual',
    description: 'State recruitment for Revenue Patwaris, Senior Assistants, and Clerks across Punjab government revenue departments and district boards.',
    syllabus_summary: 'Part-A: Mandatory Punjabi Language Qualifying Paper (50 MCQs - 50 Marks, 50% qualifying). Part-B: General Knowledge, Reasoning, Quantitative Ability, English, Punjabi, Computers, Punjab History & Culture (100 MCQs - 100 Marks).',
    marking_scheme: '0.25 marks penalty per wrong answer in Part-B.',
    pattern_description: 'Single Stage OMR Based Written Examination (Part A + Part B) followed by Punjabi Typing Test (30 wpm) for Clerk posts.',
    application_process_guide: 'Apply online at sssb.punjab.gov.in.',
    official_notification_url: 'https://sssb.punjab.gov.in/notices/Patwari_2026_Advt.pdf',
    official_website_url: 'https://sssb.punjab.gov.in',
    date_of_notification: '2026-03-20',
    application_start_date: '2026-03-20',
    application_closing_date: '2026-04-18',
    tentative_exam_date: '2026-06-15',
    min_age: 18,
    max_age: 37,
    educational_qualification: 'Graduation in any discipline + 120 Hours ISO Certified Computer Course certificate.',
    fee_details: { general: 1000, obc: 250, ews: 250, sc: 250, st: 250, female: 250 },
    stages: [
      { name: 'Written Examination (Part A Punjabi Qualifying + Part B Merit)', order: 1, type: 'prelims', mode: 'offline_omr', duration: 150, marks: 150, qual_marks: 65, status: 'scheduled', start_date: '2026-06-15' },
      { name: 'Punjabi & English Typing Test (30 WPM)', order: 2, type: 'skill', mode: 'hybrid', duration: 20, marks: 0, qual_marks: 0, status: 'upcoming' }
    ]
  },
  {
    org_slug: 'punjab-police',
    category_slug: 'state-police',
    state_code: 'PB',
    title: 'Punjab Police Sub-Inspector (SI) & Constable Direct Recruitment Examination 2026',
    short_title: 'Punjab Police SI & Constable 2026',
    slug: 'punjab-police-sub-inspector-constable-2026',
    exam_code: 'PB-POLICE-2026',
    mode: 'online_cbt',
    frequency: 'annual',
    description: 'Recruitment examination for Sub-Inspectors and Constables in District Police and Armed Police Cadres of Punjab Police.',
    syllabus_summary: 'Paper-1: General Awareness, Quantitative Aptitude & Numerical Skills, Punjabi Language (100 Qs - 400 Marks). Paper-2: Logical & Analytical Reasoning, English Language, Digital Literacy & Computer (100 Qs - 400 Marks). Paper-3: Mandatory Punjabi Qualifying Test (50 Qs - 50 Marks).',
    marking_scheme: 'No negative marking in Punjab Police Computer Based Test.',
    pattern_description: 'Computer Based Test (CBT - 3 Papers), Physical Screening Test (PST: 1600m run, long jump, high jump), Physical Measurement Test (PMT), and Document Verification.',
    application_process_guide: 'Apply online at punjabpolice.gov.in using recruitment portal registration.',
    official_notification_url: 'https://punjabpolice.gov.in/notices/Punjab_Police_2026_Advt.pdf',
    official_website_url: 'https://punjabpolice.gov.in',
    date_of_notification: '2026-02-28',
    application_start_date: '2026-02-28',
    application_closing_date: '2026-03-24',
    tentative_exam_date: '2026-07-01',
    min_age: 18,
    max_age: 28,
    educational_qualification: 'Constable: 10+2 (Senior Secondary). SI: Graduation in any discipline with Punjabi passed at Matric level.',
    fee_details: { general: 1100, obc: 600, ews: 600, sc: 600, st: 600, female: 1100 },
    stages: [
      { name: 'Computer Based Test (Paper 1, 2, and 3)', order: 1, type: 'prelims', mode: 'online_cbt', duration: 300, marks: 850, qual_marks: 350, status: 'scheduled', start_date: '2026-07-01' },
      { name: 'Physical Screening Test (PST) & PMT', order: 2, type: 'physical', mode: 'hybrid', duration: 60, marks: 0, qual_marks: 0, status: 'upcoming' }
    ]
  }
];

async function syncComprehensiveExams() {
  console.log('🚀 Starting Comprehensive Central & State Examinations Expansion Sync...');
  console.log(`Processing ${COMPREHENSIVE_EXAMS.length} canonical examination profiles across national and 12 states...\n`);

  // 1. Resolve Organization & Category Maps
  const { data: orgs } = await supabase.from('organizations').select('id, slug, name, state_code');
  const orgMap = {};
  orgs.forEach(o => orgMap[o.slug] = o);

  const { data: cats } = await supabase.from('categories').select('id, slug');
  const catMap = {};
  cats.forEach(c => catMap[c.slug] = c.id);

  let insertedCount = 0;
  let updatedCount = 0;

  for (const item of COMPREHENSIVE_EXAMS) {
    const org = orgMap[item.org_slug];
    const categoryId = catMap[item.category_slug] || catMap['central-govt'] || catMap['state-govt'];

    if (!org) {
      console.warn(`⚠️ Organization not found for slug: ${item.org_slug}. Skipping ${item.title}`);
      continue;
    }

    const slug = item.slug || slugify(item.title);

    const freq = item.frequency === 'biannual' ? 'bi_annual' : (item.frequency === 'as_needed' ? 'irregular' : (item.frequency || 'annual'));

    const examData = {
      title: item.title,
      short_title: item.short_title,
      slug: slug,
      exam_code: item.exam_code,
      organization_id: org.id,
      category_id: categoryId,
      state_code: item.state_code || org.state_code || 'DL',
      mode: item.mode,
      frequency: freq,
      description: item.description,
      syllabus_summary: item.syllabus_summary,
      marking_scheme: item.marking_scheme,
      pattern_description: item.pattern_description,
      application_process_guide: item.application_process_guide,
      official_notification_url: item.official_notification_url,
      official_website_url: item.official_website_url,
      application_fee_details: item.fee_details,
      status: 'published',
      is_featured: item.is_featured || false,
      published_at: item.date_of_notification ? new Date(item.date_of_notification).toISOString() : new Date().toISOString()
    };

    // Upsert into gov_exams
    const { data: existingExam } = await supabase.from('gov_exams').select('id').eq('slug', slug).maybeSingle();
    let examId;

    if (existingExam) {
      examId = existingExam.id;
      await supabase.from('gov_exams').update(examData).eq('id', examId);
      updatedCount++;
    } else {
      const { data: inserted, error: insertErr } = await supabase.from('gov_exams').insert(examData).select('id').single();
      if (insertErr) {
        console.error(`❌ Failed to insert exam: ${item.title} -> ${insertErr.message}`);
        continue;
      }
      examId = inserted.id;
      insertedCount++;
    }

    // Upsert Stages
    if (item.stages && item.stages.length > 0) {
      await supabase.from('exam_stages').delete().eq('exam_id', examId);
      const stagesToInsert = item.stages.map((s, idx) => ({
        exam_id: examId,
        stage_name: s.name,
        stage_order: s.order || idx + 1,
        stage_type: s.type || 'prelims',
        mode: s.mode || item.mode,
        duration_minutes: s.duration || 120,
        total_marks: s.marks || 100,
        qualifying_marks: s.qual_marks || 40,
        status: s.status || 'scheduled',
        start_date: s.start_date || null
      }));
      await supabase.from('exam_stages').insert(stagesToInsert);
    }

    // Upsert Important Dates
    const dates = [];
    if (item.date_of_notification) {
      dates.push({
        exam_id: examId,
        title: 'Official Notification Release',
        event_date: item.date_of_notification,
        date_type: 'notification',
        is_tentative: false,
        display_order: 1
      });
    }
    if (item.application_start_date) {
      dates.push({
        exam_id: examId,
        title: 'Online Application Window Opens',
        event_date: item.application_start_date,
        date_type: 'application_start',
        is_tentative: false,
        display_order: 2
      });
    }
    if (item.application_closing_date) {
      dates.push({
        exam_id: examId,
        title: 'Last Date for Online Application',
        event_date: item.application_closing_date,
        date_type: 'application_end',
        is_tentative: false,
        display_order: 3
      });
    }
    if (item.tentative_exam_date) {
      dates.push({
        exam_id: examId,
        title: 'Examination Commencement Date',
        event_date: item.tentative_exam_date,
        date_type: 'exam_start',
        is_tentative: false,
        display_order: 4
      });
    }

    if (dates.length > 0) {
      await supabase.from('exam_important_dates').delete().eq('exam_id', examId);
      await supabase.from('exam_important_dates').insert(dates);
    }

    // Upsert Eligibility
    await supabase.from('exam_eligibility').delete().eq('exam_id', examId);
    await supabase.from('exam_eligibility').insert({
      exam_id: examId,
      min_age: item.min_age || 18,
      max_age: item.max_age || 35,
      age_relaxation_rules: 'Standard relaxation: SC/ST (5 yrs), OBC (3 yrs), PwD (10 yrs), Ex-Servicemen as per government directives.',
      educational_qualification_description: item.educational_qualification,
      nationality_criteria: 'Citizen of India'
    });

    // Upsert Document
    await supabase.from('exam_official_documents').delete().eq('exam_id', examId);
    await supabase.from('exam_official_documents').insert([
      {
        exam_id: examId,
        title: 'Official Notification Gazette & Examination Scheme',
        file_url: item.official_notification_url,
        document_type: 'notification',
        published_date: item.date_of_notification || '2026-08-01'
      }
    ]);

    console.log(`✅ Synced exam: [${item.state_code || org.state_code || 'CENTRAL'}] [${org.acronym || org.name}] ${item.title}`);
  }

  console.log(`\n🎉 Comprehensive Exams Sync Completed!`);
  console.log(`   - Newly Inserted: ${insertedCount}`);
  console.log(`   - Updated/Refreshed: ${updatedCount}`);
  console.log(`   - Total Processed: ${insertedCount + updatedCount}`);
}

syncComprehensiveExams();
