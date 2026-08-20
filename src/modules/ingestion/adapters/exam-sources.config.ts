export interface CanonicalExamStageTemplate {
  stage_name: string;
  stage_order: number;
  stage_type: "prelims" | "mains" | "interview" | "physical" | "skill" | "screening";
  mode: "online_cbt" | "offline_omr" | "pen_paper" | "hybrid";
  duration_minutes: number;
  total_marks: number;
  qualifying_marks: number;
  status: "upcoming" | "scheduled" | "admit_card_live" | "completed" | "delayed";
  start_date?: string;
  end_date?: string;
}

export interface CanonicalExamDateTemplate {
  title: string;
  event_date: string; // YYYY-MM-DD
  date_type: "notification" | "application_start" | "application_end" | "correction_window" | "admit_card" | "exam_start" | "exam_end";
  is_tentative: boolean;
  display_order: number;
}

export interface CanonicalExamNoticeTemplate {
  title: string;
  short_title: string;
  slug?: string;
  exam_code: string;
  mode: "online_cbt" | "offline_omr" | "pen_paper" | "hybrid";
  frequency: "annual" | "biannual" | "as_needed";
  category_slug: string;
  description: string;
  syllabus_summary: string;
  marking_scheme: string;
  pattern_description: string;
  application_process_guide: string;
  official_notification_url: string;
  official_website_url: string;
  date_of_notification: string;
  application_start_date?: string;
  application_closing_date?: string;
  tentative_exam_date?: string;
  min_age: number;
  max_age: number;
  age_relaxation_rules?: string;
  educational_qualification: string;
  fee_details: {
    general: number;
    obc: number;
    ews: number;
    sc: number;
    st: number;
    female: number;
  };
  stages: CanonicalExamStageTemplate[];
  important_dates: CanonicalExamDateTemplate[];
  is_featured?: boolean;
}

export interface GovExamSourceConfig {
  key: string;
  name: string;
  organizationSlug: string;
  organizationName: string;
  jurisdiction: "central" | "state";
  stateCode?: string;
  baseUrl: string;
  examinationPath: string;
  applyUrl: string;
  defaultCategory: string;
  canonicalExams: CanonicalExamNoticeTemplate[];
}

/**
 * Registry configuration for Dedicated National & State Examination Feeds (19 Sources, 85+ Major Recurring Examinations)
 */
export const GOV_EXAM_SOURCES_CONFIG: GovExamSourceConfig[] = [
// =========================================================================
  // 1. UNION PUBLIC SERVICE COMMISSION (UPSC)
  // =========================================================================
  {
    key: "upsc_exams_feed",
    name: "Union Public Service Commission (UPSC) Examination Feed",
    organizationSlug: "upsc",
    organizationName: "Union Public Service Commission",
    jurisdiction: "central",
    stateCode: "DL",
    baseUrl: "https://upsc.gov.in",
    examinationPath: "/examinations/active-exams",
    applyUrl: "https://upsconline.nic.in",
    defaultCategory: "central-govt",
    canonicalExams: [
      {
        title: "Civil Services (Preliminary & Main) Examination 2026",
        short_title: "UPSC CSE 2026",
        slug: "upsc-civil-services-examination-2026",
        exam_code: "UPSC-CSE-2026",
        mode: "offline_omr",
        frequency: "annual",
        category_slug: "central-govt",
        description: "India's premier administrative competitive examination for IAS, IPS, IFS, IRS, and Group 'A' central civil services.",
        syllabus_summary: "Prelims: Paper I (General Studies) & Paper II (CSAT). Mains: 9 Descriptive Papers (Essay, GS I-IV, Optional I-II, Qualifying Language Papers). Personality Test / Interview.",
        marking_scheme: "Negative marking of 1/3rd (0.66 marks in GS-I, 0.83 marks in CSAT) for every incorrect objective answer.",
        pattern_description: "3-Stage examination: Stage I Objective Preliminary, Stage II Written Descriptive Main Examination, Stage III Personality Test.",
        application_process_guide: "Complete One Time Registration (OTR) on upsconline.nic.in and submit Part-I & Part-II application before deadline.",
        official_notification_url: "https://upsc.gov.in/sites/default/files/Notif-CSP-2026-Engl.pdf",
        official_website_url: "https://upsconline.nic.in",
        date_of_notification: "2026-02-14",
        application_start_date: "2026-02-14",
        application_closing_date: "2026-03-05",
        tentative_exam_date: "2026-05-24",
        min_age: 21,
        max_age: 32,
        age_relaxation_rules: "SC/ST: 5 years, OBC: 3 years, PwBD: 10 years, Ex-Servicemen: 5 years.",
        educational_qualification: "Bachelor's Degree in any discipline from a recognized University.",
        fee_details: { general: 100, obc: 100, ews: 100, sc: 0, st: 0, female: 0 },
        is_featured: true,
        stages: [
          { stage_name: "Preliminary Examination (GS-I & CSAT)", stage_order: 1, stage_type: "prelims", mode: "offline_omr", duration_minutes: 240, total_marks: 400, qualifying_marks: 66, status: "scheduled", start_date: "2026-05-24" },
          { stage_name: "Main Written Examination (9 Descriptive Papers)", stage_order: 2, stage_type: "mains", mode: "pen_paper", duration_minutes: 1620, total_marks: 1750, qualifying_marks: 750, status: "upcoming", start_date: "2026-09-18" },
          { stage_name: "Personality Test (Interview)", stage_order: 3, stage_type: "interview", mode: "hybrid", duration_minutes: 45, total_marks: 275, qualifying_marks: 0, status: "upcoming" }
        ],
        important_dates: [
          { title: "Notification Released", event_date: "2026-02-14", date_type: "notification", is_tentative: false, display_order: 1 },
          { title: "Online Application Closing Date", event_date: "2026-03-05", date_type: "application_end", is_tentative: false, display_order: 2 },
          { title: "Civil Services (Preliminary) Exam Date", event_date: "2026-05-24", date_type: "exam_start", is_tentative: false, display_order: 3 },
          { title: "Civil Services (Main) Exam Commencement", event_date: "2026-09-18", date_type: "exam_start", is_tentative: true, display_order: 4 }
        ]
      },
      {
        title: "Engineering Services Examination (Preliminary & Main) 2026",
        short_title: "UPSC ESE / IES 2026",
        slug: "upsc-engineering-services-examination-ese-2026",
        exam_code: "UPSC-ESE-2026",
        mode: "offline_omr",
        frequency: "annual",
        category_slug: "central-govt",
        description: "National recruitment examination for technical engineering leadership positions in Indian Railways, Central Engineering Services, and CPWD.",
        syllabus_summary: "Prelims: Paper-I (General Studies & Engineering Aptitude), Paper-II (Discipline Specific Engineering). Mains: 2 Conventional Engineering Discipline Papers. Personality Test.",
        marking_scheme: "One-third (1/3rd) marks deducted for incorrect objective questions in Prelims.",
        pattern_description: "Stage-I Objective Prelims (500 marks), Stage-II Conventional Written Mains (600 marks), Stage-III Interview (200 marks).",
        application_process_guide: "Submit application on upsconline.nic.in selecting Engineering discipline (Civil / Mechanical / Electrical / Electronics).",
        official_notification_url: "https://upsc.gov.in/sites/default/files/Notif-ESE-2026-Engl.pdf",
        official_website_url: "https://upsconline.nic.in",
        date_of_notification: "2026-09-16",
        application_start_date: "2026-09-16",
        application_closing_date: "2026-10-06",
        tentative_exam_date: "2026-02-15",
        min_age: 21,
        max_age: 30,
        age_relaxation_rules: "SC/ST: 5 years, OBC: 3 years, Ex-Servicemen: 5 years.",
        educational_qualification: "Degree in Engineering (B.E./B.Tech) in Civil, Mechanical, Electrical, or Electronics & Telecommunication.",
        fee_details: { general: 200, obc: 200, ews: 200, sc: 0, st: 0, female: 0 },
        is_featured: true,
        stages: [
          { stage_name: "Stage-I: Objective Preliminary Examination", stage_order: 1, stage_type: "prelims", mode: "offline_omr", duration_minutes: 300, total_marks: 500, qualifying_marks: 180, status: "scheduled", start_date: "2026-02-15" },
          { stage_name: "Stage-II: Conventional Main Examination", stage_order: 2, stage_type: "mains", mode: "pen_paper", duration_minutes: 360, total_marks: 600, qualifying_marks: 240, status: "upcoming", start_date: "2026-06-21" },
          { stage_name: "Stage-III: Personality Test (Interview)", stage_order: 3, stage_type: "interview", mode: "hybrid", duration_minutes: 30, total_marks: 200, qualifying_marks: 0, status: "upcoming" }
        ],
        important_dates: [
          { title: "Notification Released", event_date: "2026-09-16", date_type: "notification", is_tentative: false, display_order: 1 },
          { title: "Application Last Date", event_date: "2026-10-06", date_type: "application_end", is_tentative: false, display_order: 2 },
          { title: "ESE Preliminary Exam Date", event_date: "2026-02-15", date_type: "exam_start", is_tentative: false, display_order: 3 }
        ]
      },
      {
        title: "Combined Defence Services Examination (II) 2026",
        short_title: "UPSC CDS (II) 2026",
        slug: "upsc-combined-defence-services-cds-2-2026",
        exam_code: "UPSC-CDS-2026-2",
        mode: "offline_omr",
        frequency: "biannual",
        category_slug: "defence",
        description: "Officer entry examination for Indian Military Academy (IMA), Air Force Academy (AFA), Indian Naval Academy (INA), and Officers Training Academy (OTA).",
        syllabus_summary: "IMA/INA/AFA: English, General Knowledge, Elementary Mathematics (100 marks each). OTA: English and General Knowledge only.",
        marking_scheme: "Negative marking of 0.33 marks per wrong answer.",
        pattern_description: "Written Examination followed by 5-day SSB (Services Selection Board) Intelligence and Personality Interview.",
        application_process_guide: "Apply online via UPSC OTR platform at upsconline.nic.in.",
        official_notification_url: "https://upsc.gov.in/sites/default/files/Notif-CDS-II-2026-Engl.pdf",
        official_website_url: "https://upsconline.nic.in",
        date_of_notification: "2026-05-13",
        application_start_date: "2026-05-13",
        application_closing_date: "2026-06-02",
        tentative_exam_date: "2026-09-13",
        min_age: 19,
        max_age: 25,
        educational_qualification: "Graduation degree for IMA/OTA; Degree in Engineering for INA; Degree with Physics/Maths for AFA.",
        fee_details: { general: 200, obc: 200, ews: 200, sc: 0, st: 0, female: 0 },
        is_featured: true,
        stages: [
          { stage_name: "Written Examination", stage_order: 1, stage_type: "prelims", mode: "offline_omr", duration_minutes: 360, total_marks: 300, qualifying_marks: 120, status: "scheduled", start_date: "2026-09-13" },
          { stage_name: "SSB Interview & Psychological Evaluation", stage_order: 2, stage_type: "interview", mode: "hybrid", duration_minutes: 7200, total_marks: 300, qualifying_marks: 0, status: "upcoming" }
        ],
        important_dates: [
          { title: "Application Last Date", event_date: "2026-06-02", date_type: "application_end", is_tentative: false, display_order: 1 },
          { title: "CDS Written Examination Date", event_date: "2026-09-13", date_type: "exam_start", is_tentative: false, display_order: 2 }
        ]
      },
      {
        title: "National Defence Academy & Naval Academy Examination (II) 2026",
        short_title: "UPSC NDA & NA (II) 2026",
        slug: "upsc-national-defence-academy-nda-2-2026",
        exam_code: "UPSC-NDA-2026-2",
        mode: "offline_omr",
        frequency: "biannual",
        category_slug: "defence",
        description: "Premier 10+2 entry examination for joining Army, Navy, and Air Force wings of the National Defence Academy (NDA Khadakwasla).",
        syllabus_summary: "Mathematics (300 marks) and General Ability Test (GAT - 600 marks comprising English and General Knowledge).",
        marking_scheme: "Negative marking of 0.83 marks for Maths and 1.33 marks for GAT per incorrect answer.",
        pattern_description: "Pen-Paper OMR Written Examination (900 marks) followed by 5-day SSB Testing & Medicals (900 marks).",
        application_process_guide: "Apply online at upsconline.nic.in after completing OTR.",
        official_notification_url: "https://upsc.gov.in/sites/default/files/Notif-NDA-NA-II-2026-Engl.pdf",
        official_website_url: "https://upsconline.nic.in",
        date_of_notification: "2026-05-13",
        application_start_date: "2026-05-13",
        application_closing_date: "2026-06-02",
        tentative_exam_date: "2026-09-13",
        min_age: 16,
        max_age: 19,
        educational_qualification: "12th Class pass of 10+2 pattern (with Physics, Chemistry & Math for Air Force/Navy).",
        fee_details: { general: 100, obc: 100, ews: 100, sc: 0, st: 0, female: 0 },
        stages: [
          { stage_name: "Written Examination (Maths & GAT)", stage_order: 1, stage_type: "prelims", mode: "offline_omr", duration_minutes: 300, total_marks: 900, qualifying_marks: 350, status: "scheduled", start_date: "2026-09-13" },
          { stage_name: "SSB Personality & Intelligence Test", stage_order: 2, stage_type: "interview", mode: "hybrid", duration_minutes: 7200, total_marks: 900, qualifying_marks: 0, status: "upcoming" }
        ],
        important_dates: [
          { title: "Application Last Date", event_date: "2026-06-02", date_type: "application_end", is_tentative: false, display_order: 1 },
          { title: "NDA Written Exam Date", event_date: "2026-09-13", date_type: "exam_start", is_tentative: false, display_order: 2 }
        ]
      },
      {
        title: "Combined Medical Services Examination (CMS) 2026",
        short_title: "UPSC CMS 2026",
        slug: "upsc-combined-medical-services-cms-2026",
        exam_code: "UPSC-CMS-2026",
        mode: "online_cbt",
        frequency: "annual",
        category_slug: "central-govt",
        description: "National recruitment examination for Medical Officers in Central Health Service, Railways Medical Service, and Municipal Corporations.",
        syllabus_summary: "Paper-I (General Medicine & Paediatrics - 250 marks) & Paper-II (Surgery, Gynaecology & Obstetrics, Preventive & Social Medicine - 250 marks).",
        marking_scheme: "Negative marking of 1/3rd of the marks assigned to that question.",
        pattern_description: "Computer Based Written Examination (500 marks) followed by Personality Test (100 marks).",
        application_process_guide: "Apply online at upsconline.nic.in with MBBS registration credentials.",
        official_notification_url: "https://upsc.gov.in/sites/default/files/Notif-CMS-2026-Engl.pdf",
        official_website_url: "https://upsconline.nic.in",
        date_of_notification: "2026-04-08",
        application_start_date: "2026-04-08",
        application_closing_date: "2026-04-28",
        tentative_exam_date: "2026-07-19",
        min_age: 21,
        max_age: 32,
        educational_qualification: "MBBS degree from an institute recognized by NMC / Medical Council of India.",
        fee_details: { general: 200, obc: 200, ews: 200, sc: 0, st: 0, female: 0 },
        stages: [
          { stage_name: "Computer Based Written Examination", stage_order: 1, stage_type: "prelims", mode: "online_cbt", duration_minutes: 240, total_marks: 500, qualifying_marks: 200, status: "scheduled", start_date: "2026-07-19" },
          { stage_name: "Personality Test / Interview", stage_order: 2, stage_type: "interview", mode: "hybrid", duration_minutes: 30, total_marks: 100, qualifying_marks: 0, status: "upcoming" }
        ],
        important_dates: [
          { title: "Application Last Date", event_date: "2026-04-28", date_type: "application_end", is_tentative: false, display_order: 1 },
          { title: "CMS Examination Date", event_date: "2026-07-19", date_type: "exam_start", is_tentative: false, display_order: 2 }
        ]
      },
      {
        title: "Central Armed Police Forces (Assistant Commandants) Examination 2026",
        short_title: "UPSC CAPF (AC) 2026",
        slug: "upsc-capf-assistant-commandant-2026",
        exam_code: "UPSC-CAPF-2026",
        mode: "offline_omr",
        frequency: "annual",
        category_slug: "defence",
        description: "Direct officer recruitment examination for Assistant Commandants in BSF, CRPF, CISF, ITBP, and SSB.",
        syllabus_summary: "Paper-I (General Ability and Intelligence - 250 marks Objective) & Paper-II (General Studies, Essay and Comprehension - 200 marks Descriptive).",
        marking_scheme: "Negative marking of 1/3rd marks per wrong answer in Paper-I.",
        pattern_description: "Written Examination (450 marks), Physical Standards / Physical Efficiency Test (PET), and Interview / Personality Test (150 marks).",
        application_process_guide: "Apply through UPSC online portal at upsconline.nic.in.",
        official_notification_url: "https://upsc.gov.in/sites/default/files/Notif-CAPF-2026-Engl.pdf",
        official_website_url: "https://upsconline.nic.in",
        date_of_notification: "2026-04-22",
        application_start_date: "2026-04-22",
        application_closing_date: "2026-05-12",
        tentative_exam_date: "2026-08-02",
        min_age: 20,
        max_age: 25,
        educational_qualification: "Bachelor's Degree in any discipline from a recognized University.",
        fee_details: { general: 200, obc: 200, ews: 200, sc: 0, st: 0, female: 0 },
        stages: [
          { stage_name: "Written Examination (Paper I & II)", stage_order: 1, stage_type: "prelims", mode: "offline_omr", duration_minutes: 300, total_marks: 450, qualifying_marks: 180, status: "scheduled", start_date: "2026-08-02" },
          { stage_name: "Physical Standards / Efficiency Test (PET)", stage_order: 2, stage_type: "physical", mode: "hybrid", duration_minutes: 60, total_marks: 0, qualifying_marks: 0, status: "upcoming" },
          { stage_name: "Personality Test / Interview", stage_order: 3, stage_type: "interview", mode: "hybrid", duration_minutes: 30, total_marks: 150, qualifying_marks: 0, status: "upcoming" }
        ],
        important_dates: [
          { title: "Application Last Date", event_date: "2026-05-12", date_type: "application_end", is_tentative: false, display_order: 1 },
          { title: "CAPF Written Exam Date", event_date: "2026-08-02", date_type: "exam_start", is_tentative: false, display_order: 2 }
        ]
      },
      {
        title: "Indian Forest Service (Preliminary & Main) Examination 2026",
        short_title: "UPSC IFS 2026",
        slug: "upsc-indian-forest-service-ifs-2026",
        exam_code: "UPSC-IFS-2026",
        mode: "offline_omr",
        frequency: "annual",
        category_slug: "central-govt",
        description: "All India Service competitive examination for recruitment to the Indian Forest Service.",
        syllabus_summary: "Prelims: Common with Civil Services Prelims. Mains: General English, General Knowledge, and Two Optional Science/Engineering subjects (8 Papers total).",
        marking_scheme: "Standard 1/3rd negative marking in Preliminary Examination.",
        pattern_description: "Screening through Civil Services (Prelims), followed by IFS Written Mains Examination (1400 marks) and Personality Test (300 marks).",
        application_process_guide: "Select Indian Forest Service option while filling Civil Services (Preliminary) application form.",
        official_notification_url: "https://upsc.gov.in/sites/default/files/Notif-IFSP-2026-Engl.pdf",
        official_website_url: "https://upsconline.nic.in",
        date_of_notification: "2026-02-14",
        application_start_date: "2026-02-14",
        application_closing_date: "2026-03-05",
        tentative_exam_date: "2026-05-24",
        min_age: 21,
        max_age: 32,
        educational_qualification: "Bachelor's Degree with at least one subject: Animal Husbandry, Botany, Chemistry, Geology, Mathematics, Physics, Statistics, Zoology, Agriculture, or Forestry.",
        fee_details: { general: 100, obc: 100, ews: 100, sc: 0, st: 0, female: 0 },
        stages: [
          { stage_name: "Preliminary Screening (CSE Prelims)", stage_order: 1, stage_type: "prelims", mode: "offline_omr", duration_minutes: 240, total_marks: 400, qualifying_marks: 110, status: "scheduled", start_date: "2026-05-24" },
          { stage_name: "IFS Main Written Examination", stage_order: 2, stage_type: "mains", mode: "pen_paper", duration_minutes: 1440, total_marks: 1400, qualifying_marks: 600, status: "upcoming", start_date: "2026-11-22" },
          { stage_name: "Personality Test (Interview)", stage_order: 3, stage_type: "interview", mode: "hybrid", duration_minutes: 45, total_marks: 300, qualifying_marks: 0, status: "upcoming" }
        ],
        important_dates: [
          { title: "Application Last Date", event_date: "2026-03-05", date_type: "application_end", is_tentative: false, display_order: 1 },
          { title: "Preliminary Examination Date", event_date: "2026-05-24", date_type: "exam_start", is_tentative: false, display_order: 2 }
        ]
      },
      {
        title: "EPFO Enforcement Officer / Accounts Officer (EO/AO) & APFC Examination 2026",
        short_title: "UPSC EPFO EO/AO 2026",
        slug: "upsc-epfo-enforcement-officer-apfc-2026",
        exam_code: "UPSC-EPFO-2026",
        mode: "offline_omr",
        frequency: "as_needed",
        category_slug: "central-govt",
        description: "Special recruitment examination for Enforcement Officers, Accounts Officers, and Assistant Public Provident Fund Commissioners in EPFO.",
        syllabus_summary: "Recruitment Test (RT): General English, Indian Freedom Movement, Current Affairs, Indian Polity & Economy, Accounting Principles, Industrial Relations & Labour Laws, Social Security in India.",
        marking_scheme: "Negative marking of 1/3rd mark for every wrong answer.",
        pattern_description: "Recruitment Test (75% weightage) followed by Interview (25% weightage).",
        application_process_guide: "Apply online at upsconline.nic.in under Special Recruitment Advertisements.",
        official_notification_url: "https://upsc.gov.in/sites/default/files/Notif-EPFO-EO-AO-2026-Engl.pdf",
        official_website_url: "https://upsconline.nic.in",
        date_of_notification: "2026-03-25",
        application_start_date: "2026-03-25",
        application_closing_date: "2026-04-14",
        tentative_exam_date: "2026-07-05",
        min_age: 18,
        max_age: 35,
        educational_qualification: "Bachelor's Degree in any discipline from a recognized University (Law / Management / CA desirable).",
        fee_details: { general: 25, obc: 25, ews: 25, sc: 0, st: 0, female: 0 },
        stages: [
          { stage_name: "Recruitment Test (Objective RT)", stage_order: 1, stage_type: "prelims", mode: "offline_omr", duration_minutes: 120, total_marks: 300, qualifying_marks: 150, status: "scheduled", start_date: "2026-07-05" },
          { stage_name: "Interview", stage_order: 2, stage_type: "interview", mode: "hybrid", duration_minutes: 30, total_marks: 100, qualifying_marks: 50, status: "upcoming" }
        ],
        important_dates: [
          { title: "Application Last Date", event_date: "2026-04-14", date_type: "application_end", is_tentative: false, display_order: 1 },
          { title: "EPFO Recruitment Test Date", event_date: "2026-07-05", date_type: "exam_start", is_tentative: false, display_order: 2 }
        ]
      }
    ]
  },

  // =========================================================================
  // 2. STAFF SELECTION COMMISSION (SSC)
  // =========================================================================
  {
    key: "ssc_exams_feed",
    name: "Staff Selection Commission (SSC) Examination Feed",
    organizationSlug: "ssc",
    organizationName: "Staff Selection Commission",
    jurisdiction: "central",
    stateCode: "DL",
    baseUrl: "https://ssc.gov.in",
    examinationPath: "/notices",
    applyUrl: "https://ssc.gov.in/login",
    defaultCategory: "central-govt",
    canonicalExams: [
      {
        title: "Combined Graduate Level Examination (CGL) 2026 (Tier-I & Tier-II)",
        short_title: "SSC CGL 2026",
        slug: "ssc-combined-graduate-level-cgl-examination-2026",
        exam_code: "SSC-CGL-2026",
        mode: "online_cbt",
        frequency: "annual",
        category_slug: "central-govt",
        description: "National premier competitive examination for Group B (Gazetted & Non-Gazetted) and Group C posts in central ministries and departments.",
        syllabus_summary: "Tier-I: General Intelligence, General Awareness, Quantitative Aptitude, English Comprehension. Tier-II: Math, Reasoning, English, General Awareness, Computer Knowledge, Data Entry.",
        marking_scheme: "Tier-I: 0.50 negative marks per wrong answer. Tier-II: 1 mark deducted per wrong answer.",
        pattern_description: "Tier-I Computer Based Screening Examination followed by Tier-II Computer Based Comprehensive Test and Typing Test.",
        application_process_guide: "Apply online at ssc.gov.in using your One Time Registration (OTR) profile.",
        official_notification_url: "https://ssc.gov.in/api/notices/CGL_2026_Official_Notice.pdf",
        official_website_url: "https://ssc.gov.in/login",
        date_of_notification: "2026-06-24",
        application_start_date: "2026-06-24",
        application_closing_date: "2026-07-24",
        tentative_exam_date: "2026-09-09",
        min_age: 18,
        max_age: 32,
        educational_qualification: "Bachelor's Degree from a recognized University or equivalent institute.",
        fee_details: { general: 100, obc: 100, ews: 100, sc: 0, st: 0, female: 0 },
        is_featured: true,
        stages: [
          { stage_name: "Tier-I: Computer Based Screening Examination", stage_order: 1, stage_type: "prelims", mode: "online_cbt", duration_minutes: 60, total_marks: 200, qualifying_marks: 60, status: "scheduled", start_date: "2026-09-09", end_date: "2026-09-26" },
          { stage_name: "Tier-II: Objective & Computer Knowledge Test", stage_order: 2, stage_type: "mains", mode: "online_cbt", duration_minutes: 135, total_marks: 390, qualifying_marks: 120, status: "upcoming", start_date: "2026-12-15" }
        ],
        important_dates: [
          { title: "Application Last Date", event_date: "2026-07-24", date_type: "application_end", is_tentative: false, display_order: 1 },
          { title: "Tier-I CBT Examination Window", event_date: "2026-09-09", date_type: "exam_start", is_tentative: false, display_order: 2 }
        ]
      },
      {
        title: "Combined Higher Secondary (10+2) Level Examination (CHSL) 2026",
        short_title: "SSC CHSL 2026",
        slug: "ssc-combined-higher-secondary-chsl-2026",
        exam_code: "SSC-CHSL-2026",
        mode: "online_cbt",
        frequency: "annual",
        category_slug: "central-govt",
        description: "National competitive examination for Lower Division Clerks (LDC), Junior Secretariat Assistants (JSA), and Data Entry Operators (DEO).",
        syllabus_summary: "Tier-I: English Language, General Intelligence, Quantitative Aptitude, General Awareness. Tier-II: Math, Reasoning, English, GA, Computer Module & Skill/Typing Test.",
        marking_scheme: "Tier-I: 0.50 negative marking. Tier-II: 1 mark deducted per incorrect response.",
        pattern_description: "Two-Tier CBT examination with mandatory Data Entry & Typing Speed evaluation.",
        application_process_guide: "Apply online at ssc.gov.in using OTR registration.",
        official_notification_url: "https://ssc.gov.in/api/notices/CHSL_2026_Notice.pdf",
        official_website_url: "https://ssc.gov.in/login",
        date_of_notification: "2026-04-08",
        application_start_date: "2026-04-08",
        application_closing_date: "2026-05-07",
        tentative_exam_date: "2026-07-01",
        min_age: 18,
        max_age: 27,
        educational_qualification: "12th Standard (Higher Secondary) pass from a recognized board.",
        fee_details: { general: 100, obc: 100, ews: 100, sc: 0, st: 0, female: 0 },
        stages: [
          { stage_name: "Tier-I: Computer Based Test", stage_order: 1, stage_type: "prelims", mode: "online_cbt", duration_minutes: 60, total_marks: 200, qualifying_marks: 60, status: "scheduled", start_date: "2026-07-01" },
          { stage_name: "Tier-II: Written CBT & Skill/Typing Test", stage_order: 2, stage_type: "mains", mode: "online_cbt", duration_minutes: 135, total_marks: 360, qualifying_marks: 100, status: "upcoming", start_date: "2026-11-18" }
        ],
        important_dates: [
          { title: "Application Last Date", event_date: "2026-05-07", date_type: "application_end", is_tentative: false, display_order: 1 },
          { title: "Tier-I Examination Start", event_date: "2026-07-01", date_type: "exam_start", is_tentative: false, display_order: 2 }
        ]
      },
      {
        title: "Multi-Tasking (Non-Technical) Staff & Havaldar Examination (MTS) 2026",
        short_title: "SSC MTS & Havaldar 2026",
        slug: "ssc-multi-tasking-staff-mts-havaldar-2026",
        exam_code: "SSC-MTS-2026",
        mode: "online_cbt",
        frequency: "annual",
        category_slug: "central-govt",
        description: "National recruitment examination for General Central Service Group 'C' Non-Gazetted, Non-Ministerial posts and Havaldar in CBIC & CBN.",
        syllabus_summary: "Session-I: Numerical & Mathematical Ability, Reasoning Ability. Session-II: General Awareness, English Language and Comprehension.",
        marking_scheme: "No negative marking in Session-I. 1 mark negative marking in Session-II.",
        pattern_description: "Computer Based Examination in 13 regional languages + Physical Efficiency Test (PET/PST) for Havaldar posts.",
        application_process_guide: "Submit application on ssc.gov.in portal.",
        official_notification_url: "https://ssc.gov.in/api/notices/MTS_2026_Notice.pdf",
        official_website_url: "https://ssc.gov.in/login",
        date_of_notification: "2026-06-27",
        application_start_date: "2026-06-27",
        application_closing_date: "2026-07-31",
        tentative_exam_date: "2026-10-01",
        min_age: 18,
        max_age: 25,
        educational_qualification: "Matriculation (10th Class) pass or equivalent from recognized board.",
        fee_details: { general: 100, obc: 100, ews: 100, sc: 0, st: 0, female: 0 },
        stages: [
          { stage_name: "Computer Based Examination (Sessions I & II)", stage_order: 1, stage_type: "prelims", mode: "online_cbt", duration_minutes: 90, total_marks: 270, qualifying_marks: 90, status: "scheduled", start_date: "2026-10-01" },
          { stage_name: "PET / PST (For Havaldar Posts)", stage_order: 2, stage_type: "physical", mode: "hybrid", duration_minutes: 60, total_marks: 0, qualifying_marks: 0, status: "upcoming" }
        ],
        important_dates: [
          { title: "Application Last Date", event_date: "2026-07-31", date_type: "application_end", is_tentative: false, display_order: 1 },
          { title: "MTS CBT Examination Window", event_date: "2026-10-01", date_type: "exam_start", is_tentative: false, display_order: 2 }
        ]
      },
      {
        title: "Constable (GD) in CAPFs, SSF, and Rifleman (GD) Examination 2026",
        short_title: "SSC GD Constable 2026",
        slug: "ssc-gd-constable-capf-2026",
        exam_code: "SSC-GD-2026",
        mode: "online_cbt",
        frequency: "annual",
        category_slug: "defence",
        description: "Mega national recruitment examination for General Duty Constables in BSF, CISF, CRPF, ITBP, SSB, SSF, and Assam Rifles.",
        syllabus_summary: "General Intelligence & Reasoning (40 marks), General Knowledge & General Awareness (40 marks), Elementary Mathematics (40 marks), English/Hindi (40 marks).",
        marking_scheme: "0.25 marks deducted for each wrong answer.",
        pattern_description: "Computer Based Examination (CBE), Physical Efficiency Test (PET), Physical Standard Test (PST), and Detailed Medical Examination (DME).",
        application_process_guide: "Apply via ssc.gov.in portal with uploaded photo and signature.",
        official_notification_url: "https://ssc.gov.in/api/notices/GD_2026_Notice.pdf",
        official_website_url: "https://ssc.gov.in/login",
        date_of_notification: "2026-08-27",
        application_start_date: "2026-08-27",
        application_closing_date: "2026-10-05",
        tentative_exam_date: "2026-01-10",
        min_age: 18,
        max_age: 23,
        educational_qualification: "Matriculation or 10th Class pass from a recognized Board.",
        fee_details: { general: 100, obc: 100, ews: 100, sc: 0, st: 0, female: 0 },
        is_featured: true,
        stages: [
          { stage_name: "Computer Based Examination (80 Questions)", stage_order: 1, stage_type: "prelims", mode: "online_cbt", duration_minutes: 60, total_marks: 160, qualifying_marks: 50, status: "scheduled", start_date: "2026-01-10" },
          { stage_name: "Physical Standard & Efficiency Test (PST/PET)", stage_order: 2, stage_type: "physical", mode: "hybrid", duration_minutes: 120, total_marks: 0, qualifying_marks: 0, status: "upcoming" }
        ],
        important_dates: [
          { title: "Application Last Date", event_date: "2026-10-05", date_type: "application_end", is_tentative: false, display_order: 1 },
          { title: "CBE Examination Commencement", event_date: "2026-01-10", date_type: "exam_start", is_tentative: false, display_order: 2 }
        ]
      },
      {
        title: "Sub-Inspector in Delhi Police and Central Armed Police Forces Examination (CPO) 2026",
        short_title: "SSC CPO SI 2026",
        slug: "ssc-cpo-sub-inspector-delhi-police-capf-2026",
        exam_code: "SSC-CPO-2026",
        mode: "online_cbt",
        frequency: "annual",
        category_slug: "central-govt",
        description: "National competitive examination for Sub-Inspectors (Executive) in Delhi Police and Sub-Inspectors (GD) in CAPFs.",
        syllabus_summary: "Paper-I: Reasoning, GK, Quantitative Aptitude, English Comprehension (200 marks). Paper-II: English Language & Comprehension (200 marks).",
        marking_scheme: "0.25 negative marks per incorrect answer.",
        pattern_description: "Paper-I CBT, Physical Standard Test (PST) / Physical Endurance Test (PET), Paper-II CBT, and Detailed Medical Examination (DME).",
        application_process_guide: "Apply online at ssc.gov.in.",
        official_notification_url: "https://ssc.gov.in/api/notices/CPO_2026_Notice.pdf",
        official_website_url: "https://ssc.gov.in/login",
        date_of_notification: "2026-03-04",
        application_start_date: "2026-03-04",
        application_closing_date: "2026-03-29",
        tentative_exam_date: "2026-06-27",
        min_age: 20,
        max_age: 25,
        educational_qualification: "Bachelor's degree from a recognized university. Valid driving license for Delhi Police SI posts.",
        fee_details: { general: 100, obc: 100, ews: 100, sc: 0, st: 0, female: 0 },
        stages: [
          { stage_name: "Paper-I: Computer Based Examination", stage_order: 1, stage_type: "prelims", mode: "online_cbt", duration_minutes: 120, total_marks: 200, qualifying_marks: 70, status: "scheduled", start_date: "2026-06-27" },
          { stage_name: "Physical Endurance Test (PET/PST)", stage_order: 2, stage_type: "physical", mode: "hybrid", duration_minutes: 60, total_marks: 0, qualifying_marks: 0, status: "upcoming" },
          { stage_name: "Paper-II: English Language & Comprehension", stage_order: 3, stage_type: "mains", mode: "online_cbt", duration_minutes: 120, total_marks: 200, qualifying_marks: 70, status: "upcoming" }
        ],
        important_dates: [
          { title: "Application Last Date", event_date: "2026-03-29", date_type: "application_end", is_tentative: false, display_order: 1 },
          { title: "Paper-I CBT Exam Date", event_date: "2026-06-27", date_type: "exam_start", is_tentative: false, display_order: 2 }
        ]
      },
      {
        title: "Junior Engineer (Civil, Mechanical & Electrical) Examination (JE) 2026",
        short_title: "SSC JE 2026",
        slug: "ssc-junior-engineer-je-2026",
        exam_code: "SSC-JE-2026",
        mode: "online_cbt",
        frequency: "annual",
        category_slug: "central-govt",
        description: "National examination for Junior Engineers in CPWD, MES, Border Roads Organization (BRO), and Central Water Commission.",
        syllabus_summary: "Paper-I: General Intelligence & Reasoning (50), General Awareness (50), Engineering Discipline (100). Paper-II: Discipline Specific Technical Paper (300 marks).",
        marking_scheme: "0.25 negative marks in Paper-I, 1 mark negative marking in Paper-II.",
        pattern_description: "Two-stage Computer Based Examination (Paper-I Objective Screening + Paper-II Objective Technical In-Depth).",
        application_process_guide: "Apply online at ssc.gov.in selecting engineering discipline.",
        official_notification_url: "https://ssc.gov.in/api/notices/JE_2026_Notice.pdf",
        official_website_url: "https://ssc.gov.in/login",
        date_of_notification: "2026-03-28",
        application_start_date: "2026-03-28",
        application_closing_date: "2026-04-18",
        tentative_exam_date: "2026-06-05",
        min_age: 18,
        max_age: 30,
        educational_qualification: "Diploma or Degree in Civil, Mechanical, or Electrical Engineering from a recognized institute.",
        fee_details: { general: 100, obc: 100, ews: 100, sc: 0, st: 0, female: 0 },
        stages: [
          { stage_name: "Paper-I: Computer Based Objective Test", stage_order: 1, stage_type: "prelims", mode: "online_cbt", duration_minutes: 120, total_marks: 200, qualifying_marks: 60, status: "scheduled", start_date: "2026-06-05" },
          { stage_name: "Paper-II: Technical Engineering In-Depth CBT", stage_order: 2, stage_type: "mains", mode: "online_cbt", duration_minutes: 120, total_marks: 300, qualifying_marks: 100, status: "upcoming" }
        ],
        important_dates: [
          { title: "Application Last Date", event_date: "2026-04-18", date_type: "application_end", is_tentative: false, display_order: 1 },
          { title: "Paper-I CBT Exam Date", event_date: "2026-06-05", date_type: "exam_start", is_tentative: false, display_order: 2 }
        ]
      },
      {
        title: "Stenographer Grade 'C' & 'D' Examination 2026",
        short_title: "SSC Stenographer 2026",
        slug: "ssc-stenographer-grade-c-d-2026",
        exam_code: "SSC-STENO-2026",
        mode: "online_cbt",
        frequency: "annual",
        category_slug: "central-govt",
        description: "National recruitment examination for Stenographers Grade 'C' (Group B) and Grade 'D' (Group C) in central government departments.",
        syllabus_summary: "General Intelligence & Reasoning (50 marks), General Awareness (50 marks), English Language and Comprehension (100 marks).",
        marking_scheme: "0.25 negative marks for each wrong response.",
        pattern_description: "Computer Based Test (200 marks) followed by mandatory Skill Test in Stenography (Shorthand Dictation & Transcription).",
        application_process_guide: "Apply online at ssc.gov.in indicating Shorthand medium (English / Hindi).",
        official_notification_url: "https://ssc.gov.in/api/notices/Steno_2026_Notice.pdf",
        official_website_url: "https://ssc.gov.in/login",
        date_of_notification: "2026-07-26",
        application_start_date: "2026-07-26",
        application_closing_date: "2026-08-24",
        tentative_exam_date: "2026-10-10",
        min_age: 18,
        max_age: 30,
        educational_qualification: "12th Standard pass or equivalent with proficiency in Stenography (80/100 wpm).",
        fee_details: { general: 100, obc: 100, ews: 100, sc: 0, st: 0, female: 0 },
        stages: [
          { stage_name: "Computer Based Examination (CBT)", stage_order: 1, stage_type: "prelims", mode: "online_cbt", duration_minutes: 120, total_marks: 200, qualifying_marks: 60, status: "scheduled", start_date: "2026-10-10" },
          { stage_name: "Skill Test in Stenography (Dictation & Typing)", stage_order: 2, stage_type: "skill", mode: "hybrid", duration_minutes: 60, total_marks: 0, qualifying_marks: 0, status: "upcoming" }
        ],
        important_dates: [
          { title: "Application Last Date", event_date: "2026-08-24", date_type: "application_end", is_tentative: false, display_order: 1 },
          { title: "Stenographer CBT Exam Date", event_date: "2026-10-10", date_type: "exam_start", is_tentative: false, display_order: 2 }
        ]
      },
      {
        title: "Selection Posts (Phase-XIV) Examination 2026",
        short_title: "SSC Selection Posts Phase-XIV",
        slug: "ssc-selection-posts-phase-14-2026",
        exam_code: "SSC-SP-PHASE-14",
        mode: "online_cbt",
        frequency: "annual",
        category_slug: "central-govt",
        description: "Specialized direct recruitment for Matriculation, Higher Secondary, and Graduation level posts across regional central ministries.",
        syllabus_summary: "Intelligence & Reasoning (50), General Awareness (50), Quantitative Aptitude (50), English Language (50).",
        marking_scheme: "0.50 marks deducted per wrong answer.",
        pattern_description: "Computer Based Examination segregated into 3 educational tiers (10th, 12th, Graduate).",
        application_process_guide: "Apply online at ssc.gov.in specifying unique Post Category Codes.",
        official_notification_url: "https://ssc.gov.in/api/notices/PhaseXIV_2026_Notice.pdf",
        official_website_url: "https://ssc.gov.in/login",
        date_of_notification: "2026-02-26",
        application_start_date: "2026-02-26",
        application_closing_date: "2026-03-26",
        tentative_exam_date: "2026-05-06",
        min_age: 18,
        max_age: 30,
        educational_qualification: "10th / 12th / Degree based on specific post applied.",
        fee_details: { general: 100, obc: 100, ews: 100, sc: 0, st: 0, female: 0 },
        stages: [
          { stage_name: "Computer Based Examination (Phase-XIV)", stage_order: 1, stage_type: "prelims", mode: "online_cbt", duration_minutes: 60, total_marks: 200, qualifying_marks: 60, status: "scheduled", start_date: "2026-05-06" }
        ],
        important_dates: [
          { title: "Application Last Date", event_date: "2026-03-26", date_type: "application_end", is_tentative: false, display_order: 1 },
          { title: "Phase-XIV CBT Exam Window", event_date: "2026-05-06", date_type: "exam_start", is_tentative: false, display_order: 2 }
        ]
      },
      {
        title: "Junior Hindi Translator (JHT), Senior Translator Examination 2026",
        short_title: "SSC JHT 2026",
        slug: "ssc-junior-hindi-translator-jht-2026",
        exam_code: "SSC-JHT-2026",
        mode: "online_cbt",
        frequency: "annual",
        category_slug: "central-govt",
        description: "National recruitment examination for Junior Translation Officers (JTO) and Senior Hindi Translators in Central Government Offices.",
        syllabus_summary: "Paper-I: General Hindi (100 marks) & General English (100 marks) Objective. Paper-II: Translation and Essay (200 marks Descriptive).",
        marking_scheme: "0.25 negative marks in Paper-I.",
        pattern_description: "Paper-I Computer Based Objective Test followed by Paper-II Descriptive Translation and Composition Test.",
        application_process_guide: "Apply online at ssc.gov.in.",
        official_notification_url: "https://ssc.gov.in/api/notices/JHT_2026_Notice.pdf",
        official_website_url: "https://ssc.gov.in/login",
        date_of_notification: "2026-08-02",
        application_start_date: "2026-08-02",
        application_closing_date: "2026-08-25",
        tentative_exam_date: "2026-10-25",
        min_age: 18,
        max_age: 30,
        educational_qualification: "Master's Degree in Hindi with English as a compulsory subject, or recognized Translation Diploma.",
        fee_details: { general: 100, obc: 100, ews: 100, sc: 0, st: 0, female: 0 },
        stages: [
          { stage_name: "Paper-I: Computer Based Objective Test", stage_order: 1, stage_type: "prelims", mode: "online_cbt", duration_minutes: 120, total_marks: 200, qualifying_marks: 60, status: "scheduled", start_date: "2026-10-25" },
          { stage_name: "Paper-II: Translation & Essay (Descriptive)", stage_order: 2, stage_type: "mains", mode: "pen_paper", duration_minutes: 120, total_marks: 200, qualifying_marks: 70, status: "upcoming" }
        ],
        important_dates: [
          { title: "Application Last Date", event_date: "2026-08-25", date_type: "application_end", is_tentative: false, display_order: 1 },
          { title: "Paper-I CBT Exam Date", event_date: "2026-10-25", date_type: "exam_start", is_tentative: false, display_order: 2 }
        ]
      }
    ]
  },

  // =========================================================================
  // 3. RAILWAY RECRUITMENT BOARDS (RRB)
  // =========================================================================
  {
    key: "rrb_exams_feed",
    name: "Railway Recruitment Boards (RRB) Examination Feed",
    organizationSlug: "rrb",
    organizationName: "Railway Recruitment Boards (Indian Railways)",
    jurisdiction: "central",
    stateCode: "DL",
    baseUrl: "https://indianrailways.gov.in",
    examinationPath: "/rrb-notices",
    applyUrl: "https://www.rrbapply.gov.in",
    defaultCategory: "railways",
    canonicalExams: [
      {
        title: "Non-Technical Popular Categories (NTPC Graduate Levels 4, 5, 6) Examination 2026",
        short_title: "RRB NTPC Graduate 2026",
        slug: "rrb-ntpc-graduate-level-2026",
        exam_code: "CEN-05/2026",
        mode: "online_cbt",
        frequency: "annual",
        category_slug: "railways",
        description: "National recruitment examination for Station Masters, Goods Train Managers, Senior Commercial cum Ticket Supervisors, and Junior Accounts Assistants across 21 RRB zones.",
        syllabus_summary: "CBT-1: General Awareness (40), Mathematics (30), General Intelligence & Reasoning (30). CBT-2: General Awareness (50), Mathematics (35), Reasoning (35).",
        marking_scheme: "1/3rd mark deducted for each wrong answer in CBT-1 & CBT-2.",
        pattern_description: "1st Stage CBT (Screening), 2nd Stage CBT (Score Rank), Computer Based Aptitude Test (CBAT) / Typing Skill Test.",
        application_process_guide: "Apply online at rrbapply.gov.in choosing one Railway Recruitment Board zone.",
        official_notification_url: "https://www.rrbapply.gov.in/notices/CEN_05_2026_NTPC_Graduate.pdf",
        official_website_url: "https://www.rrbapply.gov.in",
        date_of_notification: "2026-09-14",
        application_start_date: "2026-09-14",
        application_closing_date: "2026-10-13",
        tentative_exam_date: "2026-12-18",
        min_age: 18,
        max_age: 36,
        educational_qualification: "Bachelor's Degree from a recognized University or equivalent.",
        fee_details: { general: 500, obc: 500, ews: 500, sc: 250, st: 250, female: 250 },
        is_featured: true,
        stages: [
          { stage_name: "1st Stage Computer Based Test (CBT-1)", stage_order: 1, stage_type: "prelims", mode: "online_cbt", duration_minutes: 90, total_marks: 100, qualifying_marks: 40, status: "scheduled", start_date: "2026-12-18" },
          { stage_name: "2nd Stage Computer Based Test (CBT-2)", stage_order: 2, stage_type: "mains", mode: "online_cbt", duration_minutes: 90, total_marks: 120, qualifying_marks: 48, status: "upcoming" },
          { stage_name: "CBAT (Aptitude) / Typing Skill Test", stage_order: 3, stage_type: "skill", mode: "online_cbt", duration_minutes: 60, total_marks: 0, qualifying_marks: 0, status: "upcoming" }
        ],
        important_dates: [
          { title: "Application Last Date", event_date: "2026-10-13", date_type: "application_end", is_tentative: false, display_order: 1 },
          { title: "CBT-1 Examination Start", event_date: "2026-12-18", date_type: "exam_start", is_tentative: true, display_order: 2 }
        ]
      },
      {
        title: "NTPC Undergraduate (Levels 2 & 3) Examination 2026",
        short_title: "RRB NTPC Undergraduate 2026",
        slug: "rrb-ntpc-undergraduate-level-2026",
        exam_code: "CEN-06/2026",
        mode: "online_cbt",
        frequency: "annual",
        category_slug: "railways",
        description: "National examination for Commercial cum Ticket Clerks, Accounts Clerk cum Typists, and Junior Time Keepers across Indian Railways.",
        syllabus_summary: "CBT-1: General Awareness, Mathematics, General Intelligence & Reasoning. CBT-2: Advanced GA, Quant, and Analytical Reasoning.",
        marking_scheme: "1/3rd negative marking per wrong response.",
        pattern_description: "1st Stage CBT (100 marks), 2nd Stage CBT (120 marks), and Typing Skill Test for Clerical posts.",
        application_process_guide: "Apply online at rrbapply.gov.in.",
        official_notification_url: "https://www.rrbapply.gov.in/notices/CEN_06_2026_NTPC_UG.pdf",
        official_website_url: "https://www.rrbapply.gov.in",
        date_of_notification: "2026-09-21",
        application_start_date: "2026-09-21",
        application_closing_date: "2026-10-20",
        tentative_exam_date: "2026-01-20",
        min_age: 18,
        max_age: 33,
        educational_qualification: "12th (+2 Stage) or its equivalent with not less than 50% marks in aggregate.",
        fee_details: { general: 500, obc: 500, ews: 500, sc: 250, st: 250, female: 250 },
        stages: [
          { stage_name: "1st Stage CBT Examination", stage_order: 1, stage_type: "prelims", mode: "online_cbt", duration_minutes: 90, total_marks: 100, qualifying_marks: 40, status: "scheduled", start_date: "2026-01-20" },
          { stage_name: "2nd Stage CBT Examination", stage_order: 2, stage_type: "mains", mode: "online_cbt", duration_minutes: 90, total_marks: 120, qualifying_marks: 48, status: "upcoming" }
        ],
        important_dates: [
          { title: "Application Last Date", event_date: "2026-10-20", date_type: "application_end", is_tentative: false, display_order: 1 },
          { title: "CBT-1 Examination Start", event_date: "2026-01-20", date_type: "exam_start", is_tentative: true, display_order: 2 }
        ]
      },
      {
        title: "Assistant Loco Pilot (ALP) Examination 2026",
        short_title: "RRB ALP 2026",
        slug: "rrb-assistant-loco-pilot-alp-2026",
        exam_code: "CEN-01/2026",
        mode: "online_cbt",
        frequency: "annual",
        category_slug: "railways",
        description: "National competitive examination for Assistant Loco Pilots (Train Drivers) across Indian Railway zones.",
        syllabus_summary: "CBT-1: Math, Reasoning, General Science, General Awareness (75 Qs). CBT-2 Part A: Math, Reasoning, Basic Science & Engineering (100 Qs); Part B: Trade Syllabus (75 Qs). CBAT: Psycho Aptitude Test.",
        marking_scheme: "1/3rd marks deducted for wrong answers in CBT-1 & CBT-2 Part A. No negative marking in CBAT.",
        pattern_description: "CBT-1 Screening, CBT-2 Dual-Part Scoring & Qualifying Trade Test, CBAT (Computer Based Aptitude Test), and Medical Examination (A1 category).",
        application_process_guide: "Apply via rrbapply.gov.in.",
        official_notification_url: "https://www.rrbapply.gov.in/notices/CEN_01_2026_ALP.pdf",
        official_website_url: "https://www.rrbapply.gov.in",
        date_of_notification: "2026-01-20",
        application_start_date: "2026-01-20",
        application_closing_date: "2026-02-19",
        tentative_exam_date: "2026-08-25",
        min_age: 18,
        max_age: 33,
        educational_qualification: "Matriculation + ITI / Act Apprenticeship in designated engineering trade OR Diploma / Degree in Mechanical, Electrical, Electronics, Automobile Engineering.",
        fee_details: { general: 500, obc: 500, ews: 500, sc: 250, st: 250, female: 250 },
        is_featured: true,
        stages: [
          { stage_name: "CBT-1: Screening Examination (75 Questions)", stage_order: 1, stage_type: "prelims", mode: "online_cbt", duration_minutes: 60, total_marks: 75, qualifying_marks: 30, status: "scheduled", start_date: "2026-08-25" },
          { stage_name: "CBT-2: Part A (Main Merit) & Part B (Trade Test)", stage_order: 2, stage_type: "mains", mode: "online_cbt", duration_minutes: 150, total_marks: 175, qualifying_marks: 65, status: "upcoming" },
          { stage_name: "CBAT (Computer Based Aptitude Test)", stage_order: 3, stage_type: "skill", mode: "online_cbt", duration_minutes: 71, total_marks: 0, qualifying_marks: 42, status: "upcoming" }
        ],
        important_dates: [
          { title: "Application Last Date", event_date: "2026-02-19", date_type: "application_end", is_tentative: false, display_order: 1 },
          { title: "CBT-1 Examination Date", event_date: "2026-08-25", date_type: "exam_start", is_tentative: false, display_order: 2 }
        ]
      },
      {
        title: "Technician (Grade-I Signal & Grade-III) Examination 2026",
        short_title: "RRB Technician 2026",
        slug: "rrb-technician-grade-1-grade-3-2026",
        exam_code: "CEN-02/2026",
        mode: "online_cbt",
        frequency: "annual",
        category_slug: "railways",
        description: "National examination for Signal Technicians Grade-I and multi-trade Technicians Grade-III in Indian Railways.",
        syllabus_summary: "Grade-I: General Awareness, General Intelligence, Basics of Computers, Mathematics, Basic Science & Engineering (100 Qs). Grade-III: Math, Reasoning, General Science, GA (100 Qs).",
        marking_scheme: "1/3rd negative marking per incorrect answer.",
        pattern_description: "Single Stage Computer Based Test (100 marks) followed by Document Verification and Medical Fitness.",
        application_process_guide: "Apply online at rrbapply.gov.in.",
        official_notification_url: "https://www.rrbapply.gov.in/notices/CEN_02_2026_Technician.pdf",
        official_website_url: "https://www.rrbapply.gov.in",
        date_of_notification: "2026-03-09",
        application_start_date: "2026-03-09",
        application_closing_date: "2026-04-08",
        tentative_exam_date: "2026-10-15",
        min_age: 18,
        max_age: 36,
        educational_qualification: "Grade-I: B.Sc / Diploma / B.Tech in Physics, Electronics, CS, IT. Grade-III: 10th + ITI in relevant trade or 10+2 with Physics & Math.",
        fee_details: { general: 500, obc: 500, ews: 500, sc: 250, st: 250, female: 250 },
        stages: [
          { stage_name: "Single Stage Computer Based Test (CBT)", stage_order: 1, stage_type: "prelims", mode: "online_cbt", duration_minutes: 90, total_marks: 100, qualifying_marks: 40, status: "scheduled", start_date: "2026-10-15" }
        ],
        important_dates: [
          { title: "Application Last Date", event_date: "2026-04-08", date_type: "application_end", is_tentative: false, display_order: 1 },
          { title: "CBT Examination Start", event_date: "2026-10-15", date_type: "exam_start", is_tentative: false, display_order: 2 }
        ]
      },
      {
        title: "Junior Engineer (JE, Chemical Supervisor, Metallurgical) Examination 2026",
        short_title: "RRB JE 2026",
        slug: "rrb-junior-engineer-je-2026",
        exam_code: "CEN-03/2026",
        mode: "online_cbt",
        frequency: "annual",
        category_slug: "railways",
        description: "National engineering competitive examination for Junior Engineers (Civil, Electrical, Mechanical, Electronics, S&T) in Indian Railways.",
        syllabus_summary: "CBT-1: Mathematics (30), General Intelligence & Reasoning (25), General Awareness (15), General Science (30). CBT-2: General Awareness (15), Physics & Chemistry (15), Computers (10), Environment (10), Technical Abilities (100).",
        marking_scheme: "1/3rd marks deducted per wrong answer.",
        pattern_description: "1st Stage CBT (100 marks Screening) and 2nd Stage CBT (150 marks Merit Rank).",
        application_process_guide: "Apply online at rrbapply.gov.in selecting your engineering branch.",
        official_notification_url: "https://www.rrbapply.gov.in/notices/CEN_03_2026_JE.pdf",
        official_website_url: "https://www.rrbapply.gov.in",
        date_of_notification: "2026-07-30",
        application_start_date: "2026-07-30",
        application_closing_date: "2026-08-29",
        tentative_exam_date: "2026-11-20",
        min_age: 18,
        max_age: 36,
        educational_qualification: "Three years Diploma or B.E./B.Tech in Civil, Mechanical, Electrical, Electronics, or Computer Engineering.",
        fee_details: { general: 500, obc: 500, ews: 500, sc: 250, st: 250, female: 250 },
        stages: [
          { stage_name: "1st Stage CBT (Screening Test)", stage_order: 1, stage_type: "prelims", mode: "online_cbt", duration_minutes: 90, total_marks: 100, qualifying_marks: 40, status: "scheduled", start_date: "2026-11-20" },
          { stage_name: "2nd Stage CBT (Technical Abilities)", stage_order: 2, stage_type: "mains", mode: "online_cbt", duration_minutes: 120, total_marks: 150, qualifying_marks: 60, status: "upcoming" }
        ],
        important_dates: [
          { title: "Application Last Date", event_date: "2026-08-29", date_type: "application_end", is_tentative: false, display_order: 1 },
          { title: "1st Stage CBT Exam Window", event_date: "2026-11-20", date_type: "exam_start", is_tentative: false, display_order: 2 }
        ]
      },
      {
        title: "RPF Sub-Inspector & Constable Recruitment Examination 2026",
        short_title: "RPF SI & Constable 2026",
        slug: "rpf-sub-inspector-constable-2026",
        exam_code: "CEN-RPF-01/2026",
        mode: "online_cbt",
        frequency: "annual",
        category_slug: "railways",
        description: "National competitive examination for Sub-Inspectors (Executive) and Constables in the Railway Protection Force (RPF) and RPSF.",
        syllabus_summary: "General Awareness (50 marks), Arithmetic (35 marks), General Intelligence & Reasoning (35 marks) - 120 Questions total.",
        marking_scheme: "1/3rd mark deduction for every incorrect response.",
        pattern_description: "Computer Based Test (120 marks) followed by Physical Efficiency Test (PET), Physical Measurement Test (PMT), and Document Verification.",
        application_process_guide: "Apply online at rrbapply.gov.in.",
        official_notification_url: "https://www.rrbapply.gov.in/notices/CEN_RPF_2026.pdf",
        official_website_url: "https://www.rrbapply.gov.in",
        date_of_notification: "2026-04-15",
        application_start_date: "2026-04-15",
        application_closing_date: "2026-05-14",
        tentative_exam_date: "2026-09-02",
        min_age: 18,
        max_age: 28,
        educational_qualification: "SI: Graduation from a recognized University. Constable: 10th pass or equivalent.",
        fee_details: { general: 500, obc: 500, ews: 500, sc: 250, st: 250, female: 250 },
        stages: [
          { stage_name: "Computer Based Test (CBT - 120 Marks)", stage_order: 1, stage_type: "prelims", mode: "online_cbt", duration_minutes: 90, total_marks: 120, qualifying_marks: 42, status: "scheduled", start_date: "2026-09-02" },
          { stage_name: "Physical Efficiency & Measurement Test (PET/PMT)", stage_order: 2, stage_type: "physical", mode: "hybrid", duration_minutes: 60, total_marks: 0, qualifying_marks: 0, status: "upcoming" }
        ],
        important_dates: [
          { title: "Application Last Date", event_date: "2026-05-14", date_type: "application_end", is_tentative: false, display_order: 1 },
          { title: "RPF CBT Examination Window", event_date: "2026-09-02", date_type: "exam_start", is_tentative: false, display_order: 2 }
        ]
      },
      {
        title: "Level-1 / Group 'D' (Track Maintainer, Assistant Pointsman) Examination 2026",
        short_title: "RRB Group D 2026",
        slug: "rrb-group-d-level-1-2026",
        exam_code: "CEN-RRC-01/2026",
        mode: "online_cbt",
        frequency: "annual",
        category_slug: "railways",
        description: "Mega national recruitment examination for Track Maintainer Grade IV, Helper/Assistant in Electrical, Mechanical, and S&T departments of Indian Railways.",
        syllabus_summary: "General Science (25), Mathematics (25), General Intelligence & Reasoning (30), General Awareness & Current Affairs (20) - 100 Qs total.",
        marking_scheme: "1/3rd marks deducted per wrong answer.",
        pattern_description: "Computer Based Test (100 marks) followed by Physical Efficiency Test (PET - 35kg weight carry + 1000m run) and Document Verification.",
        application_process_guide: "Apply online at rrbapply.gov.in.",
        official_notification_url: "https://www.rrbapply.gov.in/notices/CEN_RRC_01_2026_GroupD.pdf",
        official_website_url: "https://www.rrbapply.gov.in",
        date_of_notification: "2026-10-10",
        application_start_date: "2026-10-10",
        application_closing_date: "2026-11-10",
        tentative_exam_date: "2026-03-15",
        min_age: 18,
        max_age: 33,
        educational_qualification: "10th pass OR National Apprenticeship Certificate (NAC) granted by NCVT OR 10th pass plus ITI.",
        fee_details: { general: 500, obc: 500, ews: 500, sc: 250, st: 250, female: 250 },
        stages: [
          { stage_name: "Computer Based Test (CBT - 100 Questions)", stage_order: 1, stage_type: "prelims", mode: "online_cbt", duration_minutes: 90, total_marks: 100, qualifying_marks: 40, status: "scheduled", start_date: "2026-03-15" },
          { stage_name: "Physical Efficiency Test (PET)", stage_order: 2, stage_type: "physical", mode: "hybrid", duration_minutes: 60, total_marks: 0, qualifying_marks: 0, status: "upcoming" }
        ],
        important_dates: [
          { title: "Application Last Date", event_date: "2026-11-10", date_type: "application_end", is_tentative: false, display_order: 1 },
          { title: "Group D CBT Exam Window", event_date: "2026-03-15", date_type: "exam_start", is_tentative: true, display_order: 2 }
        ]
      }
    ]
  },

  // =========================================================================
  // 4. INSTITUTE OF BANKING PERSONNEL SELECTION (IBPS)
  // =========================================================================
  {
    key: "ibps_exams_feed",
    name: "Institute of Banking Personnel Selection (IBPS) Examination Feed",
    organizationSlug: "ibps",
    organizationName: "Institute of Banking Personnel Selection",
    jurisdiction: "central",
    stateCode: "MH",
    baseUrl: "https://ibps.in",
    examinationPath: "/examinations",
    applyUrl: "https://ibps.in",
    defaultCategory: "banking",
    canonicalExams: [
          {
                "title": "IBPS Common Recruitment Process for Probationary Officers (CRP PO/MT-XVI)",
                "short_title": "IBPS PO 2026",
                "slug": "ibps-crp-po-mt-16-examination-2026",
                "exam_code": "CRP-PO/MT-XVI",
                "mode": "online_cbt",
                "frequency": "annual",
                "category_slug": "banking",
                "description": "National banking competitive examination for Probationary Officers and Management Trainees across 11 public sector participating banks.",
                "syllabus_summary": "Prelims: English Language (30), Quantitative Aptitude (35), Reasoning Ability (35). Mains: Reasoning & Computer Aptitude (60), General Economy & Banking Awareness (40), English (40), Data Analysis & Interpretation (60), English Descriptive Essay/Letter (25).",
                "marking_scheme": "Negative marking of 0.25 marks for every incorrect answer in Prelims and Mains.",
                "pattern_description": "3-Tier Selection: Preliminary Online Examination (100 marks), Main Online Examination + Descriptive Writing (225 marks), and Common Interview (100 marks).",
                "application_process_guide": "Register and fill application on ibps.in with scanned photograph, signature, left thumb impression, and handwritten declaration.",
                "official_notification_url": "https://ibps.in/notices/CRP_PO_MT_XVI_Detailed_Notification.pdf",
                "official_website_url": "https://ibps.in",
                "date_of_notification": "2026-08-01",
                "application_start_date": "2026-08-01",
                "application_closing_date": "2026-08-28",
                "tentative_exam_date": "2026-10-19",
                "min_age": 20,
                "max_age": 30,
                "age_relaxation_rules": "Standard relaxation: SC/ST (5 yrs), OBC (3 yrs), PwD (10 yrs), Ex-Servicemen as per government directives.",
                "educational_qualification": "A Degree (Graduation) in any discipline from a recognized University.",
                "fee_details": {
                      "general": 850,
                      "obc": 850,
                      "ews": 850,
                      "sc": 175,
                      "st": 175,
                      "female": 850
                },
                "stages": [
                      {
                            "stage_name": "Preliminary Online Examination",
                            "stage_order": 1,
                            "stage_type": "prelims",
                            "mode": "online_cbt",
                            "duration_minutes": 60,
                            "total_marks": 100,
                            "qualifying_marks": 50,
                            "status": "scheduled",
                            "start_date": "2026-10-19"
                      },
                      {
                            "stage_name": "Main Online & Descriptive Examination",
                            "stage_order": 2,
                            "stage_type": "mains",
                            "mode": "online_cbt",
                            "duration_minutes": 210,
                            "total_marks": 225,
                            "qualifying_marks": 90,
                            "status": "upcoming",
                            "start_date": "2026-11-30"
                      },
                      {
                            "stage_name": "Common Interview",
                            "stage_order": 3,
                            "stage_type": "interview",
                            "mode": "hybrid",
                            "duration_minutes": 20,
                            "total_marks": 100,
                            "qualifying_marks": 40,
                            "status": "upcoming",
                            "start_date": "2026-10-19"
                      }
                ],
                "important_dates": [
                      {
                            "title": "Official Notification Release Date",
                            "event_date": "2026-08-01",
                            "date_type": "notification",
                            "is_tentative": false,
                            "display_order": 1
                      },
                      {
                            "title": "Online Application Commencement",
                            "event_date": "2026-08-01",
                            "date_type": "application_start",
                            "is_tentative": false,
                            "display_order": 2
                      },
                      {
                            "title": "Online Application Closing Deadline",
                            "event_date": "2026-08-28",
                            "date_type": "application_end",
                            "is_tentative": false,
                            "display_order": 3
                      },
                      {
                            "title": "Examination Commencement Date",
                            "event_date": "2026-10-19",
                            "date_type": "exam_start",
                            "is_tentative": false,
                            "display_order": 4
                      }
                ],
                "is_featured": true
          },
          {
                "title": "IBPS Clerical Cadre (CRP Clerk-XVI) Recruitment Examination 2026",
                "short_title": "IBPS Clerk 2026",
                "slug": "ibps-crp-clerk-16-examination-2026",
                "exam_code": "CRP-CLERK-XVI",
                "mode": "online_cbt",
                "frequency": "annual",
                "category_slug": "banking",
                "description": "National clerical recruitment examination for Customer Service Associates across 11 participating public sector banks in 13 regional languages.",
                "syllabus_summary": "Prelims: English, Numerical Ability, Reasoning Ability (100 Qs). Mains: General/Financial Awareness (50), General English (40), Reasoning & Computer (50), Quantitative Aptitude (50).",
                "marking_scheme": "0.25 marks penalty for wrong answers.",
                "pattern_description": "Two-tier selection: Preliminary CBT (100 marks) followed by Main CBT (200 marks). No interview for clerical cadre.",
                "application_process_guide": "Apply online on ibps.in indicating State/UT preference and bank order.",
                "official_notification_url": "https://ibps.in/notices/CRP_Clerks_XVI_Notice.pdf",
                "official_website_url": "https://ibps.in",
                "date_of_notification": "2026-06-30",
                "application_start_date": "2026-06-30",
                "application_closing_date": "2026-07-28",
                "tentative_exam_date": "2026-08-24",
                "min_age": 20,
                "max_age": 28,
                "age_relaxation_rules": "Standard relaxation: SC/ST (5 yrs), OBC (3 yrs), PwD (10 yrs), Ex-Servicemen as per government directives.",
                "educational_qualification": "Graduation in any discipline and operating/working knowledge in computer systems.",
                "fee_details": {
                      "general": 850,
                      "obc": 850,
                      "ews": 850,
                      "sc": 175,
                      "st": 175,
                      "female": 850
                },
                "stages": [
                      {
                            "stage_name": "Preliminary Examination (CBT)",
                            "stage_order": 1,
                            "stage_type": "prelims",
                            "mode": "online_cbt",
                            "duration_minutes": 60,
                            "total_marks": 100,
                            "qualifying_marks": 45,
                            "status": "scheduled",
                            "start_date": "2026-08-24"
                      },
                      {
                            "stage_name": "Main Online Examination",
                            "stage_order": 2,
                            "stage_type": "mains",
                            "mode": "online_cbt",
                            "duration_minutes": 160,
                            "total_marks": 200,
                            "qualifying_marks": 80,
                            "status": "upcoming",
                            "start_date": "2026-10-13"
                      }
                ],
                "important_dates": [
                      {
                            "title": "Official Notification Release Date",
                            "event_date": "2026-06-30",
                            "date_type": "notification",
                            "is_tentative": false,
                            "display_order": 1
                      },
                      {
                            "title": "Online Application Commencement",
                            "event_date": "2026-06-30",
                            "date_type": "application_start",
                            "is_tentative": false,
                            "display_order": 2
                      },
                      {
                            "title": "Online Application Closing Deadline",
                            "event_date": "2026-07-28",
                            "date_type": "application_end",
                            "is_tentative": false,
                            "display_order": 3
                      },
                      {
                            "title": "Examination Commencement Date",
                            "event_date": "2026-08-24",
                            "date_type": "exam_start",
                            "is_tentative": false,
                            "display_order": 4
                      }
                ]
          },
          {
                "title": "IBPS Specialist Officers (CRP SPL-XVI) Examination 2026",
                "short_title": "IBPS SO 2026",
                "slug": "ibps-specialist-officer-crp-spl-16-2026",
                "exam_code": "CRP-SPL-XVI",
                "mode": "online_cbt",
                "frequency": "annual",
                "category_slug": "banking",
                "description": "National recruitment for IT Officers, Agricultural Field Officers (AFO), Rajbhasha Adhikari, Law Officers, HR/Personnel Officers, and Marketing Officers.",
                "syllabus_summary": "Prelims: Reasoning, English, General Awareness with special reference to Banking / Quantitative Aptitude. Mains: Professional Knowledge test in relevant discipline (60 marks). Interview.",
                "marking_scheme": "0.25 marks penalty per incorrect answer.",
                "pattern_description": "Prelims CBT, Mains Professional Knowledge Test, and Interview.",
                "application_process_guide": "Apply online at ibps.in.",
                "official_notification_url": "https://ibps.in/notices/CRP_SPL_XVI_Notice.pdf",
                "official_website_url": "https://ibps.in",
                "date_of_notification": "2026-08-01",
                "application_start_date": "2026-08-01",
                "application_closing_date": "2026-08-28",
                "tentative_exam_date": "2026-11-09",
                "min_age": 20,
                "max_age": 30,
                "age_relaxation_rules": "Standard relaxation: SC/ST (5 yrs), OBC (3 yrs), PwD (10 yrs), Ex-Servicemen as per government directives.",
                "educational_qualification": "4-year Engineering Degree / Master Degree in relevant specialized stream (CS, IT, Agriculture, Law, HR, Marketing).",
                "fee_details": {
                      "general": 850,
                      "obc": 850,
                      "ews": 850,
                      "sc": 175,
                      "st": 175,
                      "female": 850
                },
                "stages": [
                      {
                            "stage_name": "Preliminary Examination",
                            "stage_order": 1,
                            "stage_type": "prelims",
                            "mode": "online_cbt",
                            "duration_minutes": 120,
                            "total_marks": 125,
                            "qualifying_marks": 50,
                            "status": "scheduled",
                            "start_date": "2026-11-09"
                      },
                      {
                            "stage_name": "Main Professional Knowledge Exam",
                            "stage_order": 2,
                            "stage_type": "mains",
                            "mode": "online_cbt",
                            "duration_minutes": 45,
                            "total_marks": 60,
                            "qualifying_marks": 24,
                            "status": "upcoming",
                            "start_date": "2026-12-14"
                      },
                      {
                            "stage_name": "Interview",
                            "stage_order": 3,
                            "stage_type": "interview",
                            "mode": "hybrid",
                            "duration_minutes": 20,
                            "total_marks": 100,
                            "qualifying_marks": 40,
                            "status": "upcoming",
                            "start_date": "2026-11-09"
                      }
                ],
                "important_dates": [
                      {
                            "title": "Official Notification Release Date",
                            "event_date": "2026-08-01",
                            "date_type": "notification",
                            "is_tentative": false,
                            "display_order": 1
                      },
                      {
                            "title": "Online Application Commencement",
                            "event_date": "2026-08-01",
                            "date_type": "application_start",
                            "is_tentative": false,
                            "display_order": 2
                      },
                      {
                            "title": "Online Application Closing Deadline",
                            "event_date": "2026-08-28",
                            "date_type": "application_end",
                            "is_tentative": false,
                            "display_order": 3
                      },
                      {
                            "title": "Examination Commencement Date",
                            "event_date": "2026-11-09",
                            "date_type": "exam_start",
                            "is_tentative": false,
                            "display_order": 4
                      }
                ]
          },
          {
                "title": "IBPS RRB (Officers Scale I, II, III & Office Assistants) Examination 2026",
                "short_title": "IBPS RRB 2026",
                "slug": "ibps-rrb-officers-office-assistant-2026",
                "exam_code": "CRP-RRBs-XIII",
                "mode": "online_cbt",
                "frequency": "annual",
                "category_slug": "banking",
                "description": "Regional Rural Banks common recruitment for Assistant Managers (Scale-I), Managers (Scale-II), Senior Managers (Scale-III), and Multipurpose Office Assistants across 43 RRBs.",
                "syllabus_summary": "Prelims: Reasoning (40) & Numerical Ability / Quantitative Aptitude (40) - 80 Qs total. Mains: Reasoning, Computer, General Awareness, English/Hindi, Quantitative Aptitude (200 marks).",
                "marking_scheme": "0.25 marks penalty per wrong response.",
                "pattern_description": "Prelims CBT, Mains CBT, and Interview (for Officer posts only).",
                "application_process_guide": "Apply online at ibps.in selecting state RRB preferences and local language proficiency.",
                "official_notification_url": "https://ibps.in/notices/CRP_RRB_XIII_Notice.pdf",
                "official_website_url": "https://ibps.in",
                "date_of_notification": "2026-06-07",
                "application_start_date": "2026-06-07",
                "application_closing_date": "2026-06-30",
                "tentative_exam_date": "2026-08-03",
                "min_age": 18,
                "max_age": 30,
                "age_relaxation_rules": "Standard relaxation: SC/ST (5 yrs), OBC (3 yrs), PwD (10 yrs), Ex-Servicemen as per government directives.",
                "educational_qualification": "Bachelor's degree in any discipline with local language proficiency of the respective state.",
                "fee_details": {
                      "general": 850,
                      "obc": 850,
                      "ews": 850,
                      "sc": 175,
                      "st": 175,
                      "female": 850
                },
                "stages": [
                      {
                            "stage_name": "Preliminary Examination (80 Questions)",
                            "stage_order": 1,
                            "stage_type": "prelims",
                            "mode": "online_cbt",
                            "duration_minutes": 45,
                            "total_marks": 80,
                            "qualifying_marks": 35,
                            "status": "scheduled",
                            "start_date": "2026-08-03"
                      },
                      {
                            "stage_name": "Main Examination (200 Marks)",
                            "stage_order": 2,
                            "stage_type": "mains",
                            "mode": "online_cbt",
                            "duration_minutes": 120,
                            "total_marks": 200,
                            "qualifying_marks": 80,
                            "status": "upcoming",
                            "start_date": "2026-09-29"
                      }
                ],
                "important_dates": [
                      {
                            "title": "Official Notification Release Date",
                            "event_date": "2026-06-07",
                            "date_type": "notification",
                            "is_tentative": false,
                            "display_order": 1
                      },
                      {
                            "title": "Online Application Commencement",
                            "event_date": "2026-06-07",
                            "date_type": "application_start",
                            "is_tentative": false,
                            "display_order": 2
                      },
                      {
                            "title": "Online Application Closing Deadline",
                            "event_date": "2026-06-30",
                            "date_type": "application_end",
                            "is_tentative": false,
                            "display_order": 3
                      },
                      {
                            "title": "Examination Commencement Date",
                            "event_date": "2026-08-03",
                            "date_type": "exam_start",
                            "is_tentative": false,
                            "display_order": 4
                      }
                ]
          }
    ]
  },

  // =========================================================================
  // 5. STATE BANK OF INDIA (SBI)
  // =========================================================================
  {
    key: "sbi_exams_feed",
    name: "State Bank of India (SBI) Recruitment Examination Feed",
    organizationSlug: "sbi",
    organizationName: "State Bank of India",
    jurisdiction: "central",
    stateCode: "MH",
    baseUrl: "https://sbi.co.in",
    examinationPath: "/careers",
    applyUrl: "https://bank.sbi/careers",
    defaultCategory: "banking",
    canonicalExams: [
          {
                "title": "SBI Probationary Officers (PO) Recruitment Examination 2026",
                "short_title": "SBI PO 2026",
                "slug": "sbi-probationary-officers-po-2026",
                "exam_code": "CRPD/PO/2026-27/01",
                "mode": "online_cbt",
                "frequency": "annual",
                "category_slug": "banking",
                "description": "India's highest-tier banking recruitment examination for Probationary Officers in State Bank of India with fast-track career progression.",
                "syllabus_summary": "Phase-I: English (30), Quantitative Aptitude (35), Reasoning Ability (35). Phase-II: Reasoning & Computer (40), Data Analysis (30), General Economy & Banking (50), English (35) + Descriptive Test (50). Phase-III: Psychometric Test, Group Discussion & Interview.",
                "marking_scheme": "0.25 negative marks per incorrect answer in Phase-I and Phase-II objective tests.",
                "pattern_description": "Phase-I Preliminary Exam (100 marks), Phase-II Main Exam (250 marks), Phase-III Psychometric Test, Group Exercise (20 marks) & Interview (30 marks).",
                "application_process_guide": "Apply online at bank.sbi/careers with valid photograph and signature.",
                "official_notification_url": "https://bank.sbi/careers/PO_2026_Notification.pdf",
                "official_website_url": "https://bank.sbi/careers",
                "date_of_notification": "2026-09-06",
                "application_start_date": "2026-09-06",
                "application_closing_date": "2026-09-27",
                "tentative_exam_date": "2026-11-01",
                "min_age": 21,
                "max_age": 30,
                "age_relaxation_rules": "Standard relaxation: SC/ST (5 yrs), OBC (3 yrs), PwD (10 yrs), Ex-Servicemen as per government directives.",
                "educational_qualification": "Graduation in any discipline from a recognized University.",
                "fee_details": {
                      "general": 750,
                      "obc": 750,
                      "ews": 750,
                      "sc": 0,
                      "st": 0,
                      "female": 750
                },
                "stages": [
                      {
                            "stage_name": "Phase-I: Preliminary Online Examination",
                            "stage_order": 1,
                            "stage_type": "prelims",
                            "mode": "online_cbt",
                            "duration_minutes": 60,
                            "total_marks": 100,
                            "qualifying_marks": 55,
                            "status": "scheduled",
                            "start_date": "2026-11-01"
                      },
                      {
                            "stage_name": "Phase-II: Main Online Exam & Descriptive Test",
                            "stage_order": 2,
                            "stage_type": "mains",
                            "mode": "online_cbt",
                            "duration_minutes": 210,
                            "total_marks": 250,
                            "qualifying_marks": 100,
                            "status": "upcoming",
                            "start_date": "2026-12-10"
                      },
                      {
                            "stage_name": "Phase-III: Psychometric Test, Group Exercise & Interview",
                            "stage_order": 3,
                            "stage_type": "interview",
                            "mode": "hybrid",
                            "duration_minutes": 45,
                            "total_marks": 50,
                            "qualifying_marks": 20,
                            "status": "upcoming",
                            "start_date": "2026-11-01"
                      }
                ],
                "important_dates": [
                      {
                            "title": "Official Notification Release Date",
                            "event_date": "2026-09-06",
                            "date_type": "notification",
                            "is_tentative": false,
                            "display_order": 1
                      },
                      {
                            "title": "Online Application Commencement",
                            "event_date": "2026-09-06",
                            "date_type": "application_start",
                            "is_tentative": false,
                            "display_order": 2
                      },
                      {
                            "title": "Online Application Closing Deadline",
                            "event_date": "2026-09-27",
                            "date_type": "application_end",
                            "is_tentative": false,
                            "display_order": 3
                      },
                      {
                            "title": "Examination Commencement Date",
                            "event_date": "2026-11-01",
                            "date_type": "exam_start",
                            "is_tentative": false,
                            "display_order": 4
                      }
                ],
                "is_featured": true
          },
          {
                "title": "SBI Junior Associates (Customer Support & Sales) Examination 2026",
                "short_title": "SBI Clerk 2026",
                "slug": "sbi-junior-associates-clerk-2026",
                "exam_code": "CRPD/CR/2026-27/02",
                "mode": "online_cbt",
                "frequency": "annual",
                "category_slug": "banking",
                "description": "National recruitment for Junior Associates (Clerical Cadre) in State Bank of India across state circles with 13 regional language test options.",
                "syllabus_summary": "Prelims: English Language, Numerical Ability, Reasoning Ability (100 Qs). Mains: General/Financial Awareness, General English, Quantitative Aptitude, Reasoning Ability & Computer Aptitude (200 marks).",
                "marking_scheme": "0.25 marks deduction for each wrong answer.",
                "pattern_description": "Phase-I Preliminary Exam (100 marks) followed by Phase-II Main Exam (200 marks) and Local Language Test.",
                "application_process_guide": "Apply online at bank.sbi/careers selecting state vacancy circle.",
                "official_notification_url": "https://bank.sbi/careers/JA_2026_Notice.pdf",
                "official_website_url": "https://bank.sbi/careers",
                "date_of_notification": "2026-11-16",
                "application_start_date": "2026-11-16",
                "application_closing_date": "2026-12-10",
                "tentative_exam_date": "2026-01-05",
                "min_age": 20,
                "max_age": 28,
                "age_relaxation_rules": "Standard relaxation: SC/ST (5 yrs), OBC (3 yrs), PwD (10 yrs), Ex-Servicemen as per government directives.",
                "educational_qualification": "Graduation in any discipline from a recognized University.",
                "fee_details": {
                      "general": 750,
                      "obc": 750,
                      "ews": 750,
                      "sc": 0,
                      "st": 0,
                      "female": 750
                },
                "stages": [
                      {
                            "stage_name": "Phase-I: Preliminary Examination",
                            "stage_order": 1,
                            "stage_type": "prelims",
                            "mode": "online_cbt",
                            "duration_minutes": 60,
                            "total_marks": 100,
                            "qualifying_marks": 60,
                            "status": "scheduled",
                            "start_date": "2026-01-05"
                      },
                      {
                            "stage_name": "Phase-II: Main Examination",
                            "stage_order": 2,
                            "stage_type": "mains",
                            "mode": "online_cbt",
                            "duration_minutes": 160,
                            "total_marks": 200,
                            "qualifying_marks": 80,
                            "status": "upcoming",
                            "start_date": "2026-02-25"
                      }
                ],
                "important_dates": [
                      {
                            "title": "Official Notification Release Date",
                            "event_date": "2026-11-16",
                            "date_type": "notification",
                            "is_tentative": false,
                            "display_order": 1
                      },
                      {
                            "title": "Online Application Commencement",
                            "event_date": "2026-11-16",
                            "date_type": "application_start",
                            "is_tentative": false,
                            "display_order": 2
                      },
                      {
                            "title": "Online Application Closing Deadline",
                            "event_date": "2026-12-10",
                            "date_type": "application_end",
                            "is_tentative": false,
                            "display_order": 3
                      },
                      {
                            "title": "Examination Commencement Date",
                            "event_date": "2026-01-05",
                            "date_type": "exam_start",
                            "is_tentative": false,
                            "display_order": 4
                      }
                ]
          }
    ]
  },

  // =========================================================================
  // 6. COMBINED INDIAN ARMED FORCES (AFCAT / NDA / CDS / AGNIVEER / ICG)
  // =========================================================================
  {
    key: "defence_exams_feed",
    name: "Combined Indian Armed Forces Examination Feed (AFCAT / NDA / CDS / Agniveer / ICG)",
    organizationSlug: "indian-army",
    organizationName: "Indian Armed Forces (Army, Navy, Air Force, Coast Guard)",
    jurisdiction: "central",
    stateCode: "DL",
    baseUrl: "https://joinindianarmy.nic.in",
    examinationPath: "/en/exams",
    applyUrl: "https://joinindianarmy.nic.in",
    defaultCategory: "defence",
    canonicalExams: [
          {
                "title": "Air Force Common Admission Test (AFCAT - 02/2026) for Flying & Ground Duty Branches",
                "short_title": "IAF AFCAT 02/2026",
                "slug": "iaf-afcat-02-2026-examination",
                "exam_code": "AFCAT-02/2026",
                "mode": "online_cbt",
                "frequency": "biannual",
                "category_slug": "defence",
                "description": "National commissioning examination for Commissioned Officers in Flying, Technical, and Non-Technical Ground Duty Branches of the Indian Air Force.",
                "syllabus_summary": "General Awareness (20), Verbal Ability in English (30), Numerical Ability (20), Reasoning and Military Aptitude Test (30) - 100 Questions total (300 Marks).",
                "marking_scheme": "3 marks awarded for correct answer, 1 mark deducted for incorrect answer.",
                "pattern_description": "Online CBT Examination (300 marks) followed by 5-day Air Force Selection Board (AFSB) Testing and Medicals.",
                "application_process_guide": "Apply online at afcat.cdac.in using candidate login credentials.",
                "official_notification_url": "https://afcat.cdac.in/AFCAT/assets/images/news/AFCAT_02_2026_Advt.pdf",
                "official_website_url": "https://afcat.cdac.in",
                "date_of_notification": "2026-05-30",
                "application_start_date": "2026-05-30",
                "application_closing_date": "2026-06-28",
                "tentative_exam_date": "2026-08-23",
                "min_age": 20,
                "max_age": 26,
                "age_relaxation_rules": "Standard relaxation: SC/ST (5 yrs), OBC (3 yrs), PwD (10 yrs), Ex-Servicemen as per government directives.",
                "educational_qualification": "Graduation in any discipline with minimum 60% marks and Maths & Physics at 10+2 level OR B.E./B.Tech.",
                "fee_details": {
                      "general": 550,
                      "obc": 550,
                      "ews": 550,
                      "sc": 550,
                      "st": 550,
                      "female": 550
                },
                "stages": [
                      {
                            "stage_name": "AFCAT Online Computer Based Test (100 Qs)",
                            "stage_order": 1,
                            "stage_type": "prelims",
                            "mode": "online_cbt",
                            "duration_minutes": 120,
                            "total_marks": 300,
                            "qualifying_marks": 140,
                            "status": "scheduled",
                            "start_date": "2026-08-23"
                      },
                      {
                            "stage_name": "AFSB (Air Force Selection Board) Testing",
                            "stage_order": 2,
                            "stage_type": "interview",
                            "mode": "hybrid",
                            "duration_minutes": 7200,
                            "total_marks": 300,
                            "qualifying_marks": 40,
                            "status": "upcoming",
                            "start_date": "2026-08-23"
                      }
                ],
                "important_dates": [
                      {
                            "title": "Official Notification Release Date",
                            "event_date": "2026-05-30",
                            "date_type": "notification",
                            "is_tentative": false,
                            "display_order": 1
                      },
                      {
                            "title": "Online Application Commencement",
                            "event_date": "2026-05-30",
                            "date_type": "application_start",
                            "is_tentative": false,
                            "display_order": 2
                      },
                      {
                            "title": "Online Application Closing Deadline",
                            "event_date": "2026-06-28",
                            "date_type": "application_end",
                            "is_tentative": false,
                            "display_order": 3
                      },
                      {
                            "title": "Examination Commencement Date",
                            "event_date": "2026-08-23",
                            "date_type": "exam_start",
                            "is_tentative": false,
                            "display_order": 4
                      }
                ],
                "is_featured": true
          },
          {
                "title": "Indian Army Agniveer Common Entrance Examination (CEE) & Rally Intake 2026",
                "short_title": "Army Agniveer CEE 2026",
                "slug": "indian-army-agniveer-cee-2026",
                "exam_code": "ARMY-AGNIVEER-2026",
                "mode": "online_cbt",
                "frequency": "annual",
                "category_slug": "defence",
                "description": "National recruitment for Agniveer General Duty (GD), Technical, Clerk / Store Keeper Technical, and Tradesmen across all ZROs/AROs.",
                "syllabus_summary": "General Knowledge, General Science, Mathematics, and Logical Reasoning. Special English module for Clerk cadre.",
                "marking_scheme": "2 marks for correct answer, 0.50 negative marks for incorrect answer.",
                "pattern_description": "Phase-I Online Common Entrance Examination (CEE) followed by Phase-II Recruitment Rally (Physical Fitness Test PFT) and Adaptability Test.",
                "application_process_guide": "Register with Aadhaar on joinindianarmy.nic.in and select district rally location.",
                "official_notification_url": "https://joinindianarmy.nic.in/notices/Agniveer_2026_Notification.pdf",
                "official_website_url": "https://joinindianarmy.nic.in",
                "date_of_notification": "2026-02-13",
                "application_start_date": "2026-02-13",
                "application_closing_date": "2026-03-22",
                "tentative_exam_date": "2026-04-22",
                "min_age": 17.5,
                "max_age": 21,
                "age_relaxation_rules": "Standard relaxation: SC/ST (5 yrs), OBC (3 yrs), PwD (10 yrs), Ex-Servicemen as per government directives.",
                "educational_qualification": "Class 10th / Matric with 45% marks aggregate (GD) or 10+2 with Physics, Chemistry, Maths & English (Technical).",
                "fee_details": {
                      "general": 250,
                      "obc": 250,
                      "ews": 250,
                      "sc": 250,
                      "st": 250,
                      "female": 250
                },
                "stages": [
                      {
                            "stage_name": "Phase-I: Online Computer Based Common Entrance Exam (CEE)",
                            "stage_order": 1,
                            "stage_type": "prelims",
                            "mode": "online_cbt",
                            "duration_minutes": 60,
                            "total_marks": 100,
                            "qualifying_marks": 35,
                            "status": "scheduled",
                            "start_date": "2026-04-22"
                      },
                      {
                            "stage_name": "Phase-II: Physical Fitness Test (PFT Rally 1.6km Run & Beam)",
                            "stage_order": 2,
                            "stage_type": "physical",
                            "mode": "hybrid",
                            "duration_minutes": 120,
                            "total_marks": 100,
                            "qualifying_marks": 60,
                            "status": "upcoming",
                            "start_date": "2026-04-22"
                      }
                ],
                "important_dates": [
                      {
                            "title": "Official Notification Release Date",
                            "event_date": "2026-02-13",
                            "date_type": "notification",
                            "is_tentative": false,
                            "display_order": 1
                      },
                      {
                            "title": "Online Application Commencement",
                            "event_date": "2026-02-13",
                            "date_type": "application_start",
                            "is_tentative": false,
                            "display_order": 2
                      },
                      {
                            "title": "Online Application Closing Deadline",
                            "event_date": "2026-03-22",
                            "date_type": "application_end",
                            "is_tentative": false,
                            "display_order": 3
                      },
                      {
                            "title": "Examination Commencement Date",
                            "event_date": "2026-04-22",
                            "date_type": "exam_start",
                            "is_tentative": false,
                            "display_order": 4
                      }
                ]
          },
          {
                "title": "Indian Navy Agniveer (Senior Secondary Recruit - SSR & MR) 02/2026 Batch Examination",
                "short_title": "Navy Agniveer SSR/MR 2026",
                "slug": "indian-navy-agniveer-ssr-mr-02-2026",
                "exam_code": "NAVY-AGNIVEER-02/2026",
                "mode": "online_cbt",
                "frequency": "biannual",
                "category_slug": "defence",
                "description": "National recruitment for Sailors (Agniveer SSR and Agniveer MR) in the Indian Navy for maritime fleet operations.",
                "syllabus_summary": "SSR: English, Science, Mathematics, General Awareness (100 Qs). MR: Science & Mathematics, General Awareness (50 Qs).",
                "marking_scheme": "0.25 marks penalty per incorrect response in INET.",
                "pattern_description": "Stage-I Indian Navy Entrance Test (INET CBT), Stage-II PFT (Physical Fitness), Written Exam & Recruitment Medicals.",
                "application_process_guide": "Apply online at agniveernavy.cdac.in.",
                "official_notification_url": "https://agniveernavy.cdac.in/notices/Navy_SSR_MR_02_2026.pdf",
                "official_website_url": "https://agniveernavy.cdac.in",
                "date_of_notification": "2026-05-13",
                "application_start_date": "2026-05-13",
                "application_closing_date": "2026-06-05",
                "tentative_exam_date": "2026-07-12",
                "min_age": 17.5,
                "max_age": 21,
                "age_relaxation_rules": "Standard relaxation: SC/ST (5 yrs), OBC (3 yrs), PwD (10 yrs), Ex-Servicemen as per government directives.",
                "educational_qualification": "10+2 with Mathematics & Physics and at least one of Chemistry/Biology/Computer Science (SSR) or 10th pass (MR).",
                "fee_details": {
                      "general": 550,
                      "obc": 550,
                      "ews": 550,
                      "sc": 550,
                      "st": 550,
                      "female": 550
                },
                "stages": [
                      {
                            "stage_name": "Stage-I: Shortlisting Computer Based Test (INET)",
                            "stage_order": 1,
                            "stage_type": "prelims",
                            "mode": "online_cbt",
                            "duration_minutes": 60,
                            "total_marks": 100,
                            "qualifying_marks": 35,
                            "status": "scheduled",
                            "start_date": "2026-07-12"
                      },
                      {
                            "stage_name": "Stage-II: PFT (1.6km run, squats, pushups) & Medicals",
                            "stage_order": 2,
                            "stage_type": "physical",
                            "mode": "hybrid",
                            "duration_minutes": 120,
                            "total_marks": 100,
                            "qualifying_marks": 40,
                            "status": "upcoming",
                            "start_date": "2026-07-12"
                      }
                ],
                "important_dates": [
                      {
                            "title": "Official Notification Release Date",
                            "event_date": "2026-05-13",
                            "date_type": "notification",
                            "is_tentative": false,
                            "display_order": 1
                      },
                      {
                            "title": "Online Application Commencement",
                            "event_date": "2026-05-13",
                            "date_type": "application_start",
                            "is_tentative": false,
                            "display_order": 2
                      },
                      {
                            "title": "Online Application Closing Deadline",
                            "event_date": "2026-06-05",
                            "date_type": "application_end",
                            "is_tentative": false,
                            "display_order": 3
                      },
                      {
                            "title": "Examination Commencement Date",
                            "event_date": "2026-07-12",
                            "date_type": "exam_start",
                            "is_tentative": false,
                            "display_order": 4
                      }
                ]
          },
          {
                "title": "Indian Coast Guard Navik (General Duty / Domestic Branch) & Yantrik Examination (CGEPT 01/2026)",
                "short_title": "ICG Navik & Yantrik 2026",
                "slug": "indian-coast-guard-navik-yantrik-cgept-2026",
                "exam_code": "ICG-CGEPT-01/2026",
                "mode": "online_cbt",
                "frequency": "biannual",
                "category_slug": "defence",
                "description": "National entrance test for Navik (GD), Navik (DB), and Yantrik (Mechanical, Electrical, Electronics) in the Indian Coast Guard.",
                "syllabus_summary": "Section-I: Maths, Science, English, Reasoning, GK (60 marks). Section-II: Physics & Mathematics (50 marks). Section-III/IV/V: Engineering discipline technical questions (50 marks).",
                "marking_scheme": "No negative marking in ICG online exam.",
                "pattern_description": "Stage-I Computer Based Examination, Stage-II Assessment / Adaptability / PFT, Stage-III Document Verification at INS Chilka.",
                "application_process_guide": "Apply online at joinindiancoastguard.cdac.in.",
                "official_notification_url": "https://joinindiancoastguard.cdac.in/assets/img/advt/CGEPT_01_2026.pdf",
                "official_website_url": "https://joinindiancoastguard.cdac.in",
                "date_of_notification": "2026-06-13",
                "application_start_date": "2026-06-13",
                "application_closing_date": "2026-07-03",
                "tentative_exam_date": "2026-09-18",
                "min_age": 18,
                "max_age": 22,
                "age_relaxation_rules": "Standard relaxation: SC/ST (5 yrs), OBC (3 yrs), PwD (10 yrs), Ex-Servicemen as per government directives.",
                "educational_qualification": "Navik GD: 10+2 with Maths and Physics. Navik DB: 10th pass. Yantrik: 10th + Engineering Diploma.",
                "fee_details": {
                      "general": 300,
                      "obc": 300,
                      "ews": 300,
                      "sc": 0,
                      "st": 0,
                      "female": 0
                },
                "stages": [
                      {
                            "stage_name": "Stage-I: Computer Based Online Examination",
                            "stage_order": 1,
                            "stage_type": "prelims",
                            "mode": "online_cbt",
                            "duration_minutes": 75,
                            "total_marks": 110,
                            "qualifying_marks": 50,
                            "status": "scheduled",
                            "start_date": "2026-09-18"
                      },
                      {
                            "stage_name": "Stage-II: Physical Fitness Test (PFT 1.6km run, pushups)",
                            "stage_order": 2,
                            "stage_type": "physical",
                            "mode": "hybrid",
                            "duration_minutes": 60,
                            "total_marks": 100,
                            "qualifying_marks": 40,
                            "status": "upcoming",
                            "start_date": "2026-09-18"
                      }
                ],
                "important_dates": [
                      {
                            "title": "Official Notification Release Date",
                            "event_date": "2026-06-13",
                            "date_type": "notification",
                            "is_tentative": false,
                            "display_order": 1
                      },
                      {
                            "title": "Online Application Commencement",
                            "event_date": "2026-06-13",
                            "date_type": "application_start",
                            "is_tentative": false,
                            "display_order": 2
                      },
                      {
                            "title": "Online Application Closing Deadline",
                            "event_date": "2026-07-03",
                            "date_type": "application_end",
                            "is_tentative": false,
                            "display_order": 3
                      },
                      {
                            "title": "Examination Commencement Date",
                            "event_date": "2026-09-18",
                            "date_type": "exam_start",
                            "is_tentative": false,
                            "display_order": 4
                      }
                ]
          }
    ]
  },

  // =========================================================================
  // 7. CENTRAL AUTONOMOUS BODIES & NATIONAL INSTITUTES
  // =========================================================================
  {
    key: "central_autonomous_exams_feed",
    name: "Central Autonomous Bodies Examination Feed (AIIMS / DRDO / ISRO / ESIC / EPFO / India Post)",
    organizationSlug: "aiims",
    organizationName: "Central Autonomous Bodies & National Institutes",
    jurisdiction: "central",
    stateCode: "DL",
    baseUrl: "https://aiimsexams.ac.in",
    examinationPath: "/exams",
    applyUrl: "https://aiimsexams.ac.in",
    defaultCategory: "central-govt",
    canonicalExams: [
          {
                "title": "AIIMS Nursing Officer Recruitment Common Eligibility Test (NORCET-07)",
                "short_title": "AIIMS NORCET-07 2026",
                "slug": "aiims-norcet-07-nursing-officer-examination-2026",
                "exam_code": "AIIMS-NORCET-07",
                "mode": "online_cbt",
                "frequency": "biannual",
                "category_slug": "central-govt",
                "description": "National entrance and recruitment examination for Nursing Officers (Staff Nurse Grade-II) across all AIIMS institutes and central government hospitals in New Delhi.",
                "syllabus_summary": "Prelims: 100 MCQs (80 on Nursing curriculum, 20 on General Knowledge & Aptitude). Mains: 100 MCQs focused on Clinical Nursing Scenarios, Skill Assessment, and Critical Care decision making.",
                "marking_scheme": "1/3rd negative marking per wrong response in both Prelims and Mains.",
                "pattern_description": "Two-stage National CBT: Stage-I Screening Preliminary Exam (100 marks) followed by Stage-II Scenario-based Main Exam (100 marks).",
                "application_process_guide": "Submit application on aiimsexams.ac.in and upload live web camera photo and thumb impression.",
                "official_notification_url": "https://aiimsexams.ac.in/notices/NORCET_07_Detailed_Notification.pdf",
                "official_website_url": "https://aiimsexams.ac.in",
                "date_of_notification": "2026-08-01",
                "application_start_date": "2026-08-01",
                "application_closing_date": "2026-08-21",
                "tentative_exam_date": "2026-09-15",
                "min_age": 18,
                "max_age": 30,
                "age_relaxation_rules": "Standard relaxation: SC/ST (5 yrs), OBC (3 yrs), PwD (10 yrs), Ex-Servicemen as per government directives.",
                "educational_qualification": "B.Sc. (Hons.) Nursing / B.Sc. Nursing from an Indian Nursing Council recognized Institute OR GNM with 2 years experience in a minimum 50 bedded hospital.",
                "fee_details": {
                      "general": 3000,
                      "obc": 3000,
                      "ews": 3000,
                      "sc": 2400,
                      "st": 2400,
                      "female": 3000
                },
                "stages": [
                      {
                            "stage_name": "Stage-I: NORCET Preliminary CBT Examination",
                            "stage_order": 1,
                            "stage_type": "prelims",
                            "mode": "online_cbt",
                            "duration_minutes": 90,
                            "total_marks": 100,
                            "qualifying_marks": 50,
                            "status": "scheduled",
                            "start_date": "2026-09-15"
                      },
                      {
                            "stage_name": "Stage-II: NORCET Clinical Scenario Main CBT Exam",
                            "stage_order": 2,
                            "stage_type": "mains",
                            "mode": "online_cbt",
                            "duration_minutes": 90,
                            "total_marks": 100,
                            "qualifying_marks": 50,
                            "status": "upcoming",
                            "start_date": "2026-10-06"
                      }
                ],
                "important_dates": [
                      {
                            "title": "Official Notification Release Date",
                            "event_date": "2026-08-01",
                            "date_type": "notification",
                            "is_tentative": false,
                            "display_order": 1
                      },
                      {
                            "title": "Online Application Commencement",
                            "event_date": "2026-08-01",
                            "date_type": "application_start",
                            "is_tentative": false,
                            "display_order": 2
                      },
                      {
                            "title": "Online Application Closing Deadline",
                            "event_date": "2026-08-21",
                            "date_type": "application_end",
                            "is_tentative": false,
                            "display_order": 3
                      },
                      {
                            "title": "Examination Commencement Date",
                            "event_date": "2026-09-15",
                            "date_type": "exam_start",
                            "is_tentative": false,
                            "display_order": 4
                      }
                ],
                "is_featured": true
          },
          {
                "title": "DRDO Centre for Personnel Talent Management (CEPTAM-11) Technical Cadre Examination",
                "short_title": "DRDO CEPTAM-11 2026",
                "slug": "drdo-ceptam-11-technical-cadre-examination-2026",
                "exam_code": "DRDO-CEPTAM-11",
                "mode": "online_cbt",
                "frequency": "as_needed",
                "category_slug": "central-govt",
                "description": "National recruitment examination for Senior Technical Assistants (STA-B) and Technicians (Tech-A) across DRDO research laboratories nationwide.",
                "syllabus_summary": "Tier-I (STA-B): Quantitative Ability, Reasoning, GA, English, Science (120 Qs). Tier-II (STA-B): Subject specific technical syllabus (100 Qs). Tech-A: Common Aptitude + Trade Test.",
                "marking_scheme": "No negative marking in CEPTAM computer based examinations.",
                "pattern_description": "Tier-I CBT (Screening), Tier-II CBT (Selection Merit for STA-B) or Trade Test (for Tech-A).",
                "application_process_guide": "Apply online at drdo.gov.in (CEPTAM advertisement link).",
                "official_notification_url": "https://drdo.gov.in/careers/CEPTAM_11_Advt.pdf",
                "official_website_url": "https://drdo.gov.in",
                "date_of_notification": "2026-07-15",
                "application_start_date": "2026-07-15",
                "application_closing_date": "2026-08-15",
                "tentative_exam_date": "2026-11-12",
                "min_age": 18,
                "max_age": 28,
                "age_relaxation_rules": "Standard relaxation: SC/ST (5 yrs), OBC (3 yrs), PwD (10 yrs), Ex-Servicemen as per government directives.",
                "educational_qualification": "B.Sc. degree in Science or Diploma in Engineering/Technology in relevant branch (STA-B) or 10th + ITI (Tech-A).",
                "fee_details": {
                      "general": 100,
                      "obc": 100,
                      "ews": 100,
                      "sc": 0,
                      "st": 0,
                      "female": 0
                },
                "stages": [
                      {
                            "stage_name": "Tier-I: Screening CBT (120 Questions)",
                            "stage_order": 1,
                            "stage_type": "prelims",
                            "mode": "online_cbt",
                            "duration_minutes": 90,
                            "total_marks": 120,
                            "qualifying_marks": 48,
                            "status": "scheduled",
                            "start_date": "2026-11-12"
                      },
                      {
                            "stage_name": "Tier-II: Subject Specific CBT / Trade Evaluation",
                            "stage_order": 2,
                            "stage_type": "mains",
                            "mode": "online_cbt",
                            "duration_minutes": 90,
                            "total_marks": 100,
                            "qualifying_marks": 40,
                            "status": "upcoming",
                            "start_date": "2026-11-12"
                      }
                ],
                "important_dates": [
                      {
                            "title": "Official Notification Release Date",
                            "event_date": "2026-07-15",
                            "date_type": "notification",
                            "is_tentative": false,
                            "display_order": 1
                      },
                      {
                            "title": "Online Application Commencement",
                            "event_date": "2026-07-15",
                            "date_type": "application_start",
                            "is_tentative": false,
                            "display_order": 2
                      },
                      {
                            "title": "Online Application Closing Deadline",
                            "event_date": "2026-08-15",
                            "date_type": "application_end",
                            "is_tentative": false,
                            "display_order": 3
                      },
                      {
                            "title": "Examination Commencement Date",
                            "event_date": "2026-11-12",
                            "date_type": "exam_start",
                            "is_tentative": false,
                            "display_order": 4
                      }
                ]
          },
          {
                "title": "ISRO Centralised Recruitment Board (ICRB) Scientist/Engineer (SC) Examination 2026",
                "short_title": "ISRO ICRB Scientist (SC) 2026",
                "slug": "isro-icrb-scientist-engineer-sc-2026",
                "exam_code": "ISRO-ICRB-01/2026",
                "mode": "online_cbt",
                "frequency": "annual",
                "category_slug": "central-govt",
                "description": "Premier national technical competitive examination for Scientist / Engineer 'SC' positions in Electronics, Mechanical, Computer Science, and Civil Engineering.",
                "syllabus_summary": "Part 'A': Core Engineering Discipline based on GATE syllabus (80 Qs - 80 marks). Part 'B': Aptitude and Reasoning (15 Qs - 20 marks).",
                "marking_scheme": "1/3rd negative marking in Part A. No negative marking in Part B.",
                "pattern_description": "Written Computer Based Test (100 marks) followed by Technical Interview (100 marks with 60% minimum qualifying score).",
                "application_process_guide": "Apply online at isro.gov.in careers section with B.E./B.Tech percentage / CGPA.",
                "official_notification_url": "https://www.isro.gov.in/careers/ICRB_Scientist_SC_2026.pdf",
                "official_website_url": "https://www.isro.gov.in",
                "date_of_notification": "2026-05-25",
                "application_start_date": "2026-05-25",
                "application_closing_date": "2026-06-16",
                "tentative_exam_date": "2026-09-27",
                "min_age": 18,
                "max_age": 28,
                "age_relaxation_rules": "Standard relaxation: SC/ST (5 yrs), OBC (3 yrs), PwD (10 yrs), Ex-Servicemen as per government directives.",
                "educational_qualification": "B.E./B.Tech in first class with aggregate minimum of 65% marks or CGPA 6.84/10 in relevant engineering discipline.",
                "fee_details": {
                      "general": 250,
                      "obc": 250,
                      "ews": 250,
                      "sc": 0,
                      "st": 0,
                      "female": 0
                },
                "stages": [
                      {
                            "stage_name": "Written Examination (Core Technical + Aptitude)",
                            "stage_order": 1,
                            "stage_type": "prelims",
                            "mode": "online_cbt",
                            "duration_minutes": 120,
                            "total_marks": 100,
                            "qualifying_marks": 50,
                            "status": "scheduled",
                            "start_date": "2026-09-27"
                      },
                      {
                            "stage_name": "Technical In-Depth Interview",
                            "stage_order": 2,
                            "stage_type": "interview",
                            "mode": "hybrid",
                            "duration_minutes": 45,
                            "total_marks": 100,
                            "qualifying_marks": 60,
                            "status": "upcoming",
                            "start_date": "2026-09-27"
                      }
                ],
                "important_dates": [
                      {
                            "title": "Official Notification Release Date",
                            "event_date": "2026-05-25",
                            "date_type": "notification",
                            "is_tentative": false,
                            "display_order": 1
                      },
                      {
                            "title": "Online Application Commencement",
                            "event_date": "2026-05-25",
                            "date_type": "application_start",
                            "is_tentative": false,
                            "display_order": 2
                      },
                      {
                            "title": "Online Application Closing Deadline",
                            "event_date": "2026-06-16",
                            "date_type": "application_end",
                            "is_tentative": false,
                            "display_order": 3
                      },
                      {
                            "title": "Examination Commencement Date",
                            "event_date": "2026-09-27",
                            "date_type": "exam_start",
                            "is_tentative": false,
                            "display_order": 4
                      }
                ]
          },
          {
                "title": "ESIC Social Security Officer (SSO) & Insurance Medical Officer (IMO) Examination 2026",
                "short_title": "ESIC SSO / IMO 2026",
                "slug": "esic-social-security-officer-sso-imo-2026",
                "exam_code": "ESIC-SSO-2026",
                "mode": "online_cbt",
                "frequency": "as_needed",
                "category_slug": "central-govt",
                "description": "National recruitment examination for Social Security Officers (Manager Grade-II) and Medical Officers across ESIC hospitals and regional offices.",
                "syllabus_summary": "Phase-I: Reasoning (35), English (30), Quantitative Aptitude (35). Phase-II: Reasoning, English, General Awareness with Insurance/Economy, Quantitative Aptitude (200 marks). Phase-III: Computer Skill & Descriptive English Test.",
                "marking_scheme": "0.25 marks penalty for wrong responses.",
                "pattern_description": "Phase-I Preliminary Exam, Phase-II Main Exam, and Phase-III Computer Skill Test (CST) & Objective Type Computer Test.",
                "application_process_guide": "Apply online at esic.gov.in under Recruitment section.",
                "official_notification_url": "https://esic.gov.in/recruitment/SSO_2026_Notification.pdf",
                "official_website_url": "https://esic.gov.in",
                "date_of_notification": "2026-03-12",
                "application_start_date": "2026-03-12",
                "application_closing_date": "2026-04-12",
                "tentative_exam_date": "2026-06-11",
                "min_age": 21,
                "max_age": 27,
                "age_relaxation_rules": "Standard relaxation: SC/ST (5 yrs), OBC (3 yrs), PwD (10 yrs), Ex-Servicemen as per government directives.",
                "educational_qualification": "A degree of a recognized University (preference for Commerce/Law/Management).",
                "fee_details": {
                      "general": 500,
                      "obc": 500,
                      "ews": 500,
                      "sc": 250,
                      "st": 250,
                      "female": 250
                },
                "stages": [
                      {
                            "stage_name": "Phase-I: Preliminary Online Examination",
                            "stage_order": 1,
                            "stage_type": "prelims",
                            "mode": "online_cbt",
                            "duration_minutes": 60,
                            "total_marks": 100,
                            "qualifying_marks": 45,
                            "status": "scheduled",
                            "start_date": "2026-06-11"
                      },
                      {
                            "stage_name": "Phase-II: Main Online Examination",
                            "stage_order": 2,
                            "stage_type": "mains",
                            "mode": "online_cbt",
                            "duration_minutes": 120,
                            "total_marks": 200,
                            "qualifying_marks": 80,
                            "status": "upcoming",
                            "start_date": "2026-06-11"
                      }
                ],
                "important_dates": [
                      {
                            "title": "Official Notification Release Date",
                            "event_date": "2026-03-12",
                            "date_type": "notification",
                            "is_tentative": false,
                            "display_order": 1
                      },
                      {
                            "title": "Online Application Commencement",
                            "event_date": "2026-03-12",
                            "date_type": "application_start",
                            "is_tentative": false,
                            "display_order": 2
                      },
                      {
                            "title": "Online Application Closing Deadline",
                            "event_date": "2026-04-12",
                            "date_type": "application_end",
                            "is_tentative": false,
                            "display_order": 3
                      },
                      {
                            "title": "Examination Commencement Date",
                            "event_date": "2026-06-11",
                            "date_type": "exam_start",
                            "is_tentative": false,
                            "display_order": 4
                      }
                ]
          },
          {
                "title": "EPFO Social Security Assistant (SSA) & Stenographer Examination 2026",
                "short_title": "EPFO SSA 2026",
                "slug": "epfo-social-security-assistant-ssa-2026",
                "exam_code": "EPFO-SSA-2026",
                "mode": "online_cbt",
                "frequency": "as_needed",
                "category_slug": "central-govt",
                "description": "National competitive examination conducted by NTA for Social Security Assistants in the Employees' Provident Fund Organisation.",
                "syllabus_summary": "General Aptitude (120), General Knowledge/General Awareness (120), Quantitative Ability (120), General English (200), Computer Literacy (40) - 600 Marks total.",
                "marking_scheme": "4 marks for correct answer, 1 mark negative marking for incorrect answer.",
                "pattern_description": "Stage-I Computer Based Examination (600 marks) followed by Stage-II Computer Data Entry Skill Test (35 wpm in English or 30 wpm in Hindi).",
                "application_process_guide": "Apply online at recruitment.nta.nic.in / epfindia.gov.in.",
                "official_notification_url": "https://recruitment.nta.nic.in/EPFO/EPFO_SSA_2026_Notice.pdf",
                "official_website_url": "https://www.epfindia.gov.in",
                "date_of_notification": "2026-03-27",
                "application_start_date": "2026-03-27",
                "application_closing_date": "2026-04-26",
                "tentative_exam_date": "2026-08-18",
                "min_age": 18,
                "max_age": 27,
                "age_relaxation_rules": "Standard relaxation: SC/ST (5 yrs), OBC (3 yrs), PwD (10 yrs), Ex-Servicemen as per government directives.",
                "educational_qualification": "Bachelor's Degree from a recognized University and possessing a typing speed of 35 words per minute in English.",
                "fee_details": {
                      "general": 700,
                      "obc": 700,
                      "ews": 700,
                      "sc": 0,
                      "st": 0,
                      "female": 0
                },
                "stages": [
                      {
                            "stage_name": "Stage-I: Computer Based Examination (600 Marks)",
                            "stage_order": 1,
                            "stage_type": "prelims",
                            "mode": "online_cbt",
                            "duration_minutes": 150,
                            "total_marks": 600,
                            "qualifying_marks": 240,
                            "status": "scheduled",
                            "start_date": "2026-08-18"
                      },
                      {
                            "stage_name": "Stage-II: Computer Data Entry Skill Test",
                            "stage_order": 2,
                            "stage_type": "skill",
                            "mode": "online_cbt",
                            "duration_minutes": 15,
                            "total_marks": 100,
                            "qualifying_marks": 40,
                            "status": "upcoming",
                            "start_date": "2026-08-18"
                      }
                ],
                "important_dates": [
                      {
                            "title": "Official Notification Release Date",
                            "event_date": "2026-03-27",
                            "date_type": "notification",
                            "is_tentative": false,
                            "display_order": 1
                      },
                      {
                            "title": "Online Application Commencement",
                            "event_date": "2026-03-27",
                            "date_type": "application_start",
                            "is_tentative": false,
                            "display_order": 2
                      },
                      {
                            "title": "Online Application Closing Deadline",
                            "event_date": "2026-04-26",
                            "date_type": "application_end",
                            "is_tentative": false,
                            "display_order": 3
                      },
                      {
                            "title": "Examination Commencement Date",
                            "event_date": "2026-08-18",
                            "date_type": "exam_start",
                            "is_tentative": false,
                            "display_order": 4
                      }
                ]
          },
          {
                "title": "Department of Posts Gramin Dak Sevak (GDS) National Engagement Schedule 2026",
                "short_title": "India Post GDS 2026",
                "slug": "india-post-gramin-dak-sevak-gds-2026",
                "exam_code": "GDS-2026-CYCLE-1",
                "mode": "offline_omr",
                "frequency": "biannual",
                "category_slug": "central-govt",
                "description": "National public merit engagement process for Branch Postmaster (BPM) and Assistant Branch Postmaster (ABPM) across 23 Postal Circles.",
                "syllabus_summary": "Merit list generated automatically on the basis of 10th Standard secondary school examination marks combined with computer qualification.",
                "marking_scheme": "Automated merit ranking based on percentage in 10th class Board examinations.",
                "pattern_description": "Online application followed by computerized state-wise merit list declaration and Document Verification.",
                "application_process_guide": "Apply online at indiapostgdsonline.gov.in selecting Postal Division and post preferences.",
                "official_notification_url": "https://indiapostgdsonline.gov.in/notices/GDS_2026_Notification.pdf",
                "official_website_url": "https://indiapostgdsonline.gov.in",
                "date_of_notification": "2026-07-15",
                "application_start_date": "2026-07-15",
                "application_closing_date": "2026-08-05",
                "tentative_exam_date": "2026-08-20",
                "min_age": 18,
                "max_age": 40,
                "age_relaxation_rules": "Standard relaxation: SC/ST (5 yrs), OBC (3 yrs), PwD (10 yrs), Ex-Servicemen as per government directives.",
                "educational_qualification": "Secondary School Examination pass certificate of 10th standard with passing marks in Mathematics and English conducted by any recognized Board.",
                "fee_details": {
                      "general": 100,
                      "obc": 100,
                      "ews": 100,
                      "sc": 0,
                      "st": 0,
                      "female": 0
                },
                "stages": [
                      {
                            "stage_name": "Merit List Generation & Document Verification",
                            "stage_order": 1,
                            "stage_type": "screening",
                            "mode": "offline_omr",
                            "duration_minutes": 120,
                            "total_marks": 100,
                            "qualifying_marks": 85,
                            "status": "scheduled",
                            "start_date": "2026-08-20"
                      }
                ],
                "important_dates": [
                      {
                            "title": "Official Notification Release Date",
                            "event_date": "2026-07-15",
                            "date_type": "notification",
                            "is_tentative": false,
                            "display_order": 1
                      },
                      {
                            "title": "Online Application Commencement",
                            "event_date": "2026-07-15",
                            "date_type": "application_start",
                            "is_tentative": false,
                            "display_order": 2
                      },
                      {
                            "title": "Online Application Closing Deadline",
                            "event_date": "2026-08-05",
                            "date_type": "application_end",
                            "is_tentative": false,
                            "display_order": 3
                      },
                      {
                            "title": "Examination Commencement Date",
                            "event_date": "2026-08-20",
                            "date_type": "exam_start",
                            "is_tentative": false,
                            "display_order": 4
                      }
                ]
          }
    ]
  },

  // =========================================================================
  // 8. BIHAR STATE EXAMINATIONS (BPSC / BSSC / BPSSC / CSBC)
  // =========================================================================
  {
    key: "bihar_exams_feed",
    name: "Bihar State Examination Feed (BPSC / BSSC / BPSSC)",
    organizationSlug: "bpsc",
    organizationName: "Bihar Public Service & Staff Selection Commissions",
    jurisdiction: "state",
    stateCode: "BR",
    baseUrl: "https://bpsc.bih.nic.in",
    examinationPath: "/exams",
    applyUrl: "https://onlinebpsc.bihar.gov.in",
    defaultCategory: "state-govt",
    canonicalExams: [
          {
                "title": "BPSC 71st Combined (Preliminary & Main) Competitive Examination 2026 (BPSC 71st CCE)",
                "short_title": "BPSC 71st CCE 2026",
                "slug": "bpsc-71st-combined-competitive-examination-2026",
                "exam_code": "BPSC-71-CCE",
                "mode": "offline_omr",
                "frequency": "annual",
                "category_slug": "state-govt",
                "description": "Bihar's premier civil services competitive examination for Sub-Divisional Officer (SDO), Deputy Superintendent of Police (DSP), and Block Development Officer (BDO).",
                "syllabus_summary": "Prelims: General Studies (150 MCQs covering Bihar History, Geography, Polity, Economy, Science, Current Affairs). Mains: General Hindi, GS-I, GS-II, Essay Paper (300 marks) + Optional Paper.",
                "marking_scheme": "Negative marking of 1/3rd marks (0.33 mark deducted) per incorrect response in Prelims.",
                "pattern_description": "Stage-I Objective Preliminary (150 marks), Stage-II Written Descriptive Mains (900 marks), Stage-III Interview (120 marks).",
                "application_process_guide": "Apply online at onlinebpsc.bihar.gov.in using BPSC OTR account.",
                "official_notification_url": "https://bpsc.bih.nic.in/Advt_71st_CCE_2026.pdf",
                "official_website_url": "https://onlinebpsc.bihar.gov.in",
                "date_of_notification": "2026-07-20",
                "application_start_date": "2026-07-20",
                "application_closing_date": "2026-08-20",
                "tentative_exam_date": "2026-10-18",
                "min_age": 20,
                "max_age": 37,
                "age_relaxation_rules": "Standard relaxation: SC/ST (5 yrs), OBC (3 yrs), PwD (10 yrs), Ex-Servicemen as per government directives.",
                "educational_qualification": "Graduation in any discipline from a recognized University.",
                "fee_details": {
                      "general": 600,
                      "obc": 600,
                      "ews": 600,
                      "sc": 150,
                      "st": 150,
                      "female": 150
                },
                "stages": [
                      {
                            "stage_name": "Preliminary Objective Examination (150 Marks)",
                            "stage_order": 1,
                            "stage_type": "prelims",
                            "mode": "offline_omr",
                            "duration_minutes": 120,
                            "total_marks": 150,
                            "qualifying_marks": 60,
                            "status": "scheduled",
                            "start_date": "2026-10-18"
                      },
                      {
                            "stage_name": "Main Written Examination (Descriptive 900 Marks)",
                            "stage_order": 2,
                            "stage_type": "mains",
                            "mode": "pen_paper",
                            "duration_minutes": 540,
                            "total_marks": 900,
                            "qualifying_marks": 360,
                            "status": "upcoming",
                            "start_date": "2027-01-15"
                      },
                      {
                            "stage_name": "Interview / Personality Evaluation",
                            "stage_order": 3,
                            "stage_type": "interview",
                            "mode": "hybrid",
                            "duration_minutes": 30,
                            "total_marks": 120,
                            "qualifying_marks": 40,
                            "status": "upcoming",
                            "start_date": "2026-10-18"
                      }
                ],
                "important_dates": [
                      {
                            "title": "Official Notification Release Date",
                            "event_date": "2026-07-20",
                            "date_type": "notification",
                            "is_tentative": false,
                            "display_order": 1
                      },
                      {
                            "title": "Online Application Commencement",
                            "event_date": "2026-07-20",
                            "date_type": "application_start",
                            "is_tentative": false,
                            "display_order": 2
                      },
                      {
                            "title": "Online Application Closing Deadline",
                            "event_date": "2026-08-20",
                            "date_type": "application_end",
                            "is_tentative": false,
                            "display_order": 3
                      },
                      {
                            "title": "Examination Commencement Date",
                            "event_date": "2026-10-18",
                            "date_type": "exam_start",
                            "is_tentative": false,
                            "display_order": 4
                      }
                ],
                "is_featured": true
          },
          {
                "title": "BPSC School Teacher Recruitment Examination (TRE 4.0) 2026",
                "short_title": "BPSC TRE 4.0 2026",
                "slug": "bpsc-school-teacher-tre-4-2026",
                "exam_code": "BPSC-TRE-4.0",
                "mode": "offline_omr",
                "frequency": "annual",
                "category_slug": "teaching",
                "description": "Mega teacher recruitment examination for Primary (Class 1-5), Middle (Class 6-8), Secondary (Class 9-10), and Higher Secondary (Class 11-12) teachers in Bihar.",
                "syllabus_summary": "Part-I: Qualifying Language (English + Hindi/Urdu/Bangla - 30 marks). Part-II: General Studies (40 marks). Part-III: Concerned Subject Pedagogy (80 marks). Total 150 MCQs.",
                "marking_scheme": "No negative marking in BPSC TRE examination.",
                "pattern_description": "Single stage Objective Pen-Paper OMR Examination (150 Questions) followed by Document Verification.",
                "application_process_guide": "Apply online at onlinebpsc.bihar.gov.in uploading CTET/STET certificate and D.El.Ed/B.Ed credentials.",
                "official_notification_url": "https://bpsc.bih.nic.in/TRE_4_Advt.pdf",
                "official_website_url": "https://onlinebpsc.bihar.gov.in",
                "date_of_notification": "2026-06-15",
                "application_start_date": "2026-06-15",
                "application_closing_date": "2026-07-10",
                "tentative_exam_date": "2026-08-24",
                "min_age": 18,
                "max_age": 40,
                "age_relaxation_rules": "Standard relaxation: SC/ST (5 yrs), OBC (3 yrs), PwD (10 yrs), Ex-Servicemen as per government directives.",
                "educational_qualification": "D.El.Ed / B.Ed with CTET Paper-I/II or Bihar STET Paper-I/II qualification.",
                "fee_details": {
                      "general": 750,
                      "obc": 750,
                      "ews": 750,
                      "sc": 200,
                      "st": 200,
                      "female": 200
                },
                "stages": [
                      {
                            "stage_name": "Written Examination (Language + GS + Subject - 150 Qs)",
                            "stage_order": 1,
                            "stage_type": "prelims",
                            "mode": "offline_omr",
                            "duration_minutes": 150,
                            "total_marks": 150,
                            "qualifying_marks": 60,
                            "status": "scheduled",
                            "start_date": "2026-08-24"
                      }
                ],
                "important_dates": [
                      {
                            "title": "Official Notification Release Date",
                            "event_date": "2026-06-15",
                            "date_type": "notification",
                            "is_tentative": false,
                            "display_order": 1
                      },
                      {
                            "title": "Online Application Commencement",
                            "event_date": "2026-06-15",
                            "date_type": "application_start",
                            "is_tentative": false,
                            "display_order": 2
                      },
                      {
                            "title": "Online Application Closing Deadline",
                            "event_date": "2026-07-10",
                            "date_type": "application_end",
                            "is_tentative": false,
                            "display_order": 3
                      },
                      {
                            "title": "Examination Commencement Date",
                            "event_date": "2026-08-24",
                            "date_type": "exam_start",
                            "is_tentative": false,
                            "display_order": 4
                      }
                ]
          },
          {
                "title": "BSSC 4th Graduate Level Combined Competitive Examination (BSSC CGL-4)",
                "short_title": "BSSC CGL-4 2026",
                "slug": "bssc-4th-graduate-level-cgl-4-2026",
                "exam_code": "BSSC-CGL-4/2026",
                "mode": "offline_omr",
                "frequency": "as_needed",
                "category_slug": "state-govt",
                "description": "Bihar state combined examination for Secretariat Assistant (Prashakha Adhikari), Planning Assistant, and Auditor posts in Bihar Government departments.",
                "syllabus_summary": "General Studies (50 Qs), General Science and Mathematics (50 Qs), Comprehension/Logic/Reasoning (50 Qs) - 150 Questions total (600 Marks).",
                "marking_scheme": "4 marks awarded per correct answer, 1 mark deducted per incorrect answer.",
                "pattern_description": "Preliminary OMR Examination (600 marks) followed by Main Written Examination (Paper 1 Hindi + Paper 2 GS).",
                "application_process_guide": "Apply online at onlinebssc.bihar.gov.in.",
                "official_notification_url": "https://bssc.bihar.gov.in/notices/CGL4_Advt.pdf",
                "official_website_url": "https://bssc.bihar.gov.in",
                "date_of_notification": "2026-05-10",
                "application_start_date": "2026-05-10",
                "application_closing_date": "2026-06-15",
                "tentative_exam_date": "2026-09-20",
                "min_age": 21,
                "max_age": 37,
                "age_relaxation_rules": "Standard relaxation: SC/ST (5 yrs), OBC (3 yrs), PwD (10 yrs), Ex-Servicemen as per government directives.",
                "educational_qualification": "Graduation in any discipline from a recognized University.",
                "fee_details": {
                      "general": 540,
                      "obc": 540,
                      "ews": 540,
                      "sc": 135,
                      "st": 135,
                      "female": 135
                },
                "stages": [
                      {
                            "stage_name": "Preliminary Examination (150 Questions - 600 Marks)",
                            "stage_order": 1,
                            "stage_type": "prelims",
                            "mode": "offline_omr",
                            "duration_minutes": 135,
                            "total_marks": 600,
                            "qualifying_marks": 240,
                            "status": "scheduled",
                            "start_date": "2026-09-20"
                      },
                      {
                            "stage_name": "Main Examination (Paper I Hindi & Paper II GS)",
                            "stage_order": 2,
                            "stage_type": "mains",
                            "mode": "offline_omr",
                            "duration_minutes": 270,
                            "total_marks": 600,
                            "qualifying_marks": 240,
                            "status": "upcoming",
                            "start_date": "2026-09-20"
                      }
                ],
                "important_dates": [
                      {
                            "title": "Official Notification Release Date",
                            "event_date": "2026-05-10",
                            "date_type": "notification",
                            "is_tentative": false,
                            "display_order": 1
                      },
                      {
                            "title": "Online Application Commencement",
                            "event_date": "2026-05-10",
                            "date_type": "application_start",
                            "is_tentative": false,
                            "display_order": 2
                      },
                      {
                            "title": "Online Application Closing Deadline",
                            "event_date": "2026-06-15",
                            "date_type": "application_end",
                            "is_tentative": false,
                            "display_order": 3
                      },
                      {
                            "title": "Examination Commencement Date",
                            "event_date": "2026-09-20",
                            "date_type": "exam_start",
                            "is_tentative": false,
                            "display_order": 4
                      }
                ]
          },
          {
                "title": "BPSSC Bihar Police Sub-Inspector (Daroga) & Sergeant Competitive Examination 2026",
                "short_title": "Bihar Police SI 2026",
                "slug": "bihar-police-sub-inspector-daroga-bpssc-2026",
                "exam_code": "BPSSC-SI-02/2026",
                "mode": "offline_omr",
                "frequency": "annual",
                "category_slug": "state-police",
                "description": "Recruitment examination for Police Sub-Inspectors (Daroga) in Bihar Police and Prohibition Sub-Inspectors.",
                "syllabus_summary": "Prelims: General Knowledge & Current Issues (100 Qs - 200 Marks). Mains: Paper-I General Hindi (100 Qs - 200 Marks qualifying) + Paper-II General Studies, Science, Math, Reasoning (100 Qs - 200 Marks).",
                "marking_scheme": "0.20 marks deducted for each wrong answer.",
                "pattern_description": "Preliminary Written Exam (200 marks), Main Written Exam (200 marks), and Physical Efficiency Test (PET: 1.6km run, high jump, long jump, shot put).",
                "application_process_guide": "Apply online at bpssc.bih.nic.in.",
                "official_notification_url": "https://bpssc.bih.nic.in/Advt_SI_2026.pdf",
                "official_website_url": "https://bpssc.bih.nic.in",
                "date_of_notification": "2026-08-10",
                "application_start_date": "2026-08-10",
                "application_closing_date": "2026-09-10",
                "tentative_exam_date": "2026-11-29",
                "min_age": 20,
                "max_age": 37,
                "age_relaxation_rules": "Standard relaxation: SC/ST (5 yrs), OBC (3 yrs), PwD (10 yrs), Ex-Servicemen as per government directives.",
                "educational_qualification": "Graduation degree in any stream from a recognized University.",
                "fee_details": {
                      "general": 700,
                      "obc": 700,
                      "ews": 700,
                      "sc": 400,
                      "st": 400,
                      "female": 400
                },
                "stages": [
                      {
                            "stage_name": "Preliminary Written Examination (200 Marks)",
                            "stage_order": 1,
                            "stage_type": "prelims",
                            "mode": "offline_omr",
                            "duration_minutes": 120,
                            "total_marks": 200,
                            "qualifying_marks": 60,
                            "status": "scheduled",
                            "start_date": "2026-11-29"
                      },
                      {
                            "stage_name": "Main Written Examination (Paper I & II)",
                            "stage_order": 2,
                            "stage_type": "mains",
                            "mode": "offline_omr",
                            "duration_minutes": 240,
                            "total_marks": 200,
                            "qualifying_marks": 60,
                            "status": "upcoming",
                            "start_date": "2026-11-29"
                      },
                      {
                            "stage_name": "Physical Efficiency Test (PET)",
                            "stage_order": 3,
                            "stage_type": "physical",
                            "mode": "hybrid",
                            "duration_minutes": 60,
                            "total_marks": 100,
                            "qualifying_marks": 40,
                            "status": "upcoming",
                            "start_date": "2026-11-29"
                      }
                ],
                "important_dates": [
                      {
                            "title": "Official Notification Release Date",
                            "event_date": "2026-08-10",
                            "date_type": "notification",
                            "is_tentative": false,
                            "display_order": 1
                      },
                      {
                            "title": "Online Application Commencement",
                            "event_date": "2026-08-10",
                            "date_type": "application_start",
                            "is_tentative": false,
                            "display_order": 2
                      },
                      {
                            "title": "Online Application Closing Deadline",
                            "event_date": "2026-09-10",
                            "date_type": "application_end",
                            "is_tentative": false,
                            "display_order": 3
                      },
                      {
                            "title": "Examination Commencement Date",
                            "event_date": "2026-11-29",
                            "date_type": "exam_start",
                            "is_tentative": false,
                            "display_order": 4
                      }
                ]
          }
    ]
  },

  // =========================================================================
  // 9. UTTAR PRADESH EXAMINATIONS (UPPSC / UPSSSC / UPPRPB)
  // =========================================================================
  {
    key: "up_exams_feed",
    name: "Uttar Pradesh Examination Feed (UPPSC / UPSSSC / UPPRPB)",
    organizationSlug: "uppsc",
    organizationName: "Uttar Pradesh Public Service & Selection Commissions",
    jurisdiction: "state",
    stateCode: "UP",
    baseUrl: "https://uppsc.up.nic.in",
    examinationPath: "/exams",
    applyUrl: "https://uppsc.up.nic.in",
    defaultCategory: "state-govt",
    canonicalExams: [
          {
                "title": "UPPSC Combined State / Upper Subordinate Services (PCS) Examination 2026",
                "short_title": "UPPSC PCS 2026",
                "slug": "uppsc-combined-state-upper-subordinate-pcs-2026",
                "exam_code": "UPPSC-PCS-2026",
                "mode": "offline_omr",
                "frequency": "annual",
                "category_slug": "state-govt",
                "description": "Uttar Pradesh's flagship civil services examination for Sub-Divisional Magistrate (SDM), Deputy SP, Block Development Officer, and Commercial Tax Officers.",
                "syllabus_summary": "Prelims: Paper-I (General Studies - 200 marks) & Paper-II (CSAT - 200 marks qualifying 33%). Mains: General Hindi (150), Essay (150), General Studies Papers I through VI (200 marks each - 1200 marks total, with UP Special Papers V & VI).",
                "marking_scheme": "1/3rd (0.33) marks deducted per incorrect answer in Prelims.",
                "pattern_description": "Stage-I Objective Prelims (400 marks), Stage-II Descriptive Written Mains (1500 marks), Stage-III Interview (100 marks).",
                "application_process_guide": "Apply online at uppsc.up.nic.in using UPPSC OTR registration.",
                "official_notification_url": "https://uppsc.up.nic.in/notices/PCS_2026_Notification.pdf",
                "official_website_url": "https://uppsc.up.nic.in",
                "date_of_notification": "2026-01-01",
                "application_start_date": "2026-01-01",
                "application_closing_date": "2026-02-02",
                "tentative_exam_date": "2026-10-27",
                "min_age": 21,
                "max_age": 40,
                "age_relaxation_rules": "Standard relaxation: SC/ST (5 yrs), OBC (3 yrs), PwD (10 yrs), Ex-Servicemen as per government directives.",
                "educational_qualification": "Bachelor's Degree of any recognized University.",
                "fee_details": {
                      "general": 125,
                      "obc": 125,
                      "ews": 125,
                      "sc": 65,
                      "st": 65,
                      "female": 25
                },
                "stages": [
                      {
                            "stage_name": "Preliminary Examination (GS-I & CSAT)",
                            "stage_order": 1,
                            "stage_type": "prelims",
                            "mode": "offline_omr",
                            "duration_minutes": 240,
                            "total_marks": 400,
                            "qualifying_marks": 66,
                            "status": "scheduled",
                            "start_date": "2026-10-27"
                      },
                      {
                            "stage_name": "Main Written Examination (8 Descriptive Papers - 1500 Marks)",
                            "stage_order": 2,
                            "stage_type": "mains",
                            "mode": "pen_paper",
                            "duration_minutes": 1440,
                            "total_marks": 1500,
                            "qualifying_marks": 600,
                            "status": "upcoming",
                            "start_date": "2026-10-27"
                      },
                      {
                            "stage_name": "Personality Test (Interview)",
                            "stage_order": 3,
                            "stage_type": "interview",
                            "mode": "hybrid",
                            "duration_minutes": 30,
                            "total_marks": 100,
                            "qualifying_marks": 40,
                            "status": "upcoming",
                            "start_date": "2026-10-27"
                      }
                ],
                "important_dates": [
                      {
                            "title": "Official Notification Release Date",
                            "event_date": "2026-01-01",
                            "date_type": "notification",
                            "is_tentative": false,
                            "display_order": 1
                      },
                      {
                            "title": "Online Application Commencement",
                            "event_date": "2026-01-01",
                            "date_type": "application_start",
                            "is_tentative": false,
                            "display_order": 2
                      },
                      {
                            "title": "Online Application Closing Deadline",
                            "event_date": "2026-02-02",
                            "date_type": "application_end",
                            "is_tentative": false,
                            "display_order": 3
                      },
                      {
                            "title": "Examination Commencement Date",
                            "event_date": "2026-10-27",
                            "date_type": "exam_start",
                            "is_tentative": false,
                            "display_order": 4
                      }
                ],
                "is_featured": true
          },
          {
                "title": "UPSSSC Preliminary Eligibility Test (PET) 2026",
                "short_title": "UPSSSC PET 2026",
                "slug": "upsssc-preliminary-eligibility-test-pet-2026",
                "exam_code": "UPSSSC-PET-2026",
                "mode": "offline_omr",
                "frequency": "annual",
                "category_slug": "state-govt",
                "description": "Mandatory qualifying foundation eligibility test for all Group 'C' posts (Lekhpal, VDO, Junior Assistant, Forest Guard) in Uttar Pradesh Government.",
                "syllabus_summary": "Indian History, Indian National Movement, Geography, Indian Economy, Indian Constitution, General Science, Elementary Arithmetic, General Hindi, General English, Logic & Reasoning, Current Affairs, General Awareness, Reading Comprehension, Graph Interpretation (100 Qs total).",
                "marking_scheme": "0.25 negative marks per incorrect response.",
                "pattern_description": "Statewide Pen-Paper OMR Examination (100 marks) producing valid PET Scorecard for 1 year.",
                "application_process_guide": "Apply online at upsssc.gov.in.",
                "official_notification_url": "https://upsssc.gov.in/notices/PET_2026_Advt.pdf",
                "official_website_url": "https://upsssc.gov.in",
                "date_of_notification": "2026-08-01",
                "application_start_date": "2026-08-01",
                "application_closing_date": "2026-08-30",
                "tentative_exam_date": "2026-10-28",
                "min_age": 18,
                "max_age": 40,
                "age_relaxation_rules": "Standard relaxation: SC/ST (5 yrs), OBC (3 yrs), PwD (10 yrs), Ex-Servicemen as per government directives.",
                "educational_qualification": "High School (10th) or Intermediate (12th) from a recognized Board.",
                "fee_details": {
                      "general": 185,
                      "obc": 185,
                      "ews": 185,
                      "sc": 95,
                      "st": 95,
                      "female": 25
                },
                "stages": [
                      {
                            "stage_name": "Preliminary Eligibility Test (100 Questions)",
                            "stage_order": 1,
                            "stage_type": "prelims",
                            "mode": "offline_omr",
                            "duration_minutes": 120,
                            "total_marks": 100,
                            "qualifying_marks": 50,
                            "status": "scheduled",
                            "start_date": "2026-10-28"
                      }
                ],
                "important_dates": [
                      {
                            "title": "Official Notification Release Date",
                            "event_date": "2026-08-01",
                            "date_type": "notification",
                            "is_tentative": false,
                            "display_order": 1
                      },
                      {
                            "title": "Online Application Commencement",
                            "event_date": "2026-08-01",
                            "date_type": "application_start",
                            "is_tentative": false,
                            "display_order": 2
                      },
                      {
                            "title": "Online Application Closing Deadline",
                            "event_date": "2026-08-30",
                            "date_type": "application_end",
                            "is_tentative": false,
                            "display_order": 3
                      },
                      {
                            "title": "Examination Commencement Date",
                            "event_date": "2026-10-28",
                            "date_type": "exam_start",
                            "is_tentative": false,
                            "display_order": 4
                      }
                ]
          },
          {
                "title": "UP Police Constable Direct Recruitment Examination 2026 (60,244 Posts)",
                "short_title": "UP Police Constable 2026",
                "slug": "up-police-constable-direct-recruitment-2026",
                "exam_code": "UPPRPB-CONSTABLE-2026",
                "mode": "offline_omr",
                "frequency": "annual",
                "category_slug": "state-police",
                "description": "India's largest state police recruitment examination for Civil Police Constables across 75 districts of Uttar Pradesh.",
                "syllabus_summary": "General Knowledge (38 Qs), General Hindi (37 Qs), Numerical & Mental Ability (38 Qs), Mental Aptitude / IQ / Reasoning Ability (37 Qs) - 150 Questions (300 Marks).",
                "marking_scheme": "2 marks for correct answer, 0.50 marks negative marking for incorrect answer.",
                "pattern_description": "OMR Based Written Examination (300 marks), Document Verification & Physical Standard Test (PST), Physical Efficiency Test (PET: 4.8km run in 25 min).",
                "application_process_guide": "Apply online at uppbpb.gov.in with DigiLocker document verification.",
                "official_notification_url": "https://uppbpb.gov.in/notices/Constable_2026_Advt.pdf",
                "official_website_url": "https://uppbpb.gov.in",
                "date_of_notification": "2026-06-20",
                "application_start_date": "2026-06-20",
                "application_closing_date": "2026-07-16",
                "tentative_exam_date": "2026-08-23",
                "min_age": 18,
                "max_age": 25,
                "age_relaxation_rules": "Standard relaxation: SC/ST (5 yrs), OBC (3 yrs), PwD (10 yrs), Ex-Servicemen as per government directives.",
                "educational_qualification": "10+2 (Intermediate) pass from recognized Board in India.",
                "fee_details": {
                      "general": 400,
                      "obc": 400,
                      "ews": 400,
                      "sc": 400,
                      "st": 400,
                      "female": 400
                },
                "stages": [
                      {
                            "stage_name": "Written Examination (150 Questions - 300 Marks)",
                            "stage_order": 1,
                            "stage_type": "prelims",
                            "mode": "offline_omr",
                            "duration_minutes": 120,
                            "total_marks": 300,
                            "qualifying_marks": 120,
                            "status": "scheduled",
                            "start_date": "2026-08-23"
                      },
                      {
                            "stage_name": "Physical Efficiency Test (PET - 4.8km Run)",
                            "stage_order": 2,
                            "stage_type": "physical",
                            "mode": "hybrid",
                            "duration_minutes": 30,
                            "total_marks": 100,
                            "qualifying_marks": 40,
                            "status": "upcoming",
                            "start_date": "2026-08-23"
                      }
                ],
                "important_dates": [
                      {
                            "title": "Official Notification Release Date",
                            "event_date": "2026-06-20",
                            "date_type": "notification",
                            "is_tentative": false,
                            "display_order": 1
                      },
                      {
                            "title": "Online Application Commencement",
                            "event_date": "2026-06-20",
                            "date_type": "application_start",
                            "is_tentative": false,
                            "display_order": 2
                      },
                      {
                            "title": "Online Application Closing Deadline",
                            "event_date": "2026-07-16",
                            "date_type": "application_end",
                            "is_tentative": false,
                            "display_order": 3
                      },
                      {
                            "title": "Examination Commencement Date",
                            "event_date": "2026-08-23",
                            "date_type": "exam_start",
                            "is_tentative": false,
                            "display_order": 4
                      }
                ],
                "is_featured": true
          }
    ]
  },

  // =========================================================================
  // 10. MADHYA PRADESH EXAMINATIONS (MPPSC / MPESB / MP POLICE)
  // =========================================================================
  {
    key: "mp_exams_feed",
    name: "Madhya Pradesh Examination Feed (MPPSC / MPESB / MP Police)",
    organizationSlug: "mppsc",
    organizationName: "Madhya Pradesh Public Service & Selection Boards",
    jurisdiction: "state",
    stateCode: "MP",
    baseUrl: "https://mppsc.mp.gov.in",
    examinationPath: "/exams",
    applyUrl: "https://mppsc.mp.gov.in",
    defaultCategory: "state-govt",
    canonicalExams: [
          {
                "title": "MPPSC State Service Examination 2026 (SSE) & State Forest Service Examination",
                "short_title": "MPPSC SSE 2026",
                "slug": "mppsc-state-service-examination-sse-2026",
                "exam_code": "MPPSC-SSE-2026",
                "mode": "offline_omr",
                "frequency": "annual",
                "category_slug": "state-govt",
                "description": "Madhya Pradesh premier civil service examination for Deputy Collector, DSP, Commercial Tax Officer, and Chief Municipal Officer.",
                "syllabus_summary": "Prelims: Paper-I General Studies (200 marks) & Paper-II General Aptitude Test (200 marks). Mains: GS-I History/Geo, GS-II Polity/Econ, GS-III Science/Tech, GS-IV Ethics, Paper-V Hindi, Paper-VI Essay.",
                "marking_scheme": "No negative marking in MPPSC State Service Preliminary Examination.",
                "pattern_description": "Prelims OMR Exam (400 marks), Mains Written Exam (1500 marks), and Personality Test (175 marks).",
                "application_process_guide": "Apply online at mppsc.mp.gov.in / mponline.gov.in.",
                "official_notification_url": "https://mppsc.mp.gov.in/notices/SSE_2026_Advt.pdf",
                "official_website_url": "https://mppsc.mp.gov.in",
                "date_of_notification": "2026-01-19",
                "application_start_date": "2026-01-19",
                "application_closing_date": "2026-02-18",
                "tentative_exam_date": "2026-06-23",
                "min_age": 21,
                "max_age": 40,
                "age_relaxation_rules": "Standard relaxation: SC/ST (5 yrs), OBC (3 yrs), PwD (10 yrs), Ex-Servicemen as per government directives.",
                "educational_qualification": "Graduation in any discipline from a recognized University.",
                "fee_details": {
                      "general": 500,
                      "obc": 250,
                      "ews": 250,
                      "sc": 250,
                      "st": 250,
                      "female": 250
                },
                "stages": [
                      {
                            "stage_name": "Preliminary Examination (Paper I & II)",
                            "stage_order": 1,
                            "stage_type": "prelims",
                            "mode": "offline_omr",
                            "duration_minutes": 240,
                            "total_marks": 400,
                            "qualifying_marks": 160,
                            "status": "scheduled",
                            "start_date": "2026-06-23"
                      },
                      {
                            "stage_name": "Main Examination (6 Descriptive Papers)",
                            "stage_order": 2,
                            "stage_type": "mains",
                            "mode": "pen_paper",
                            "duration_minutes": 1080,
                            "total_marks": 1500,
                            "qualifying_marks": 600,
                            "status": "upcoming",
                            "start_date": "2026-06-23"
                      },
                      {
                            "stage_name": "Interview / Personality Test",
                            "stage_order": 3,
                            "stage_type": "interview",
                            "mode": "hybrid",
                            "duration_minutes": 30,
                            "total_marks": 175,
                            "qualifying_marks": 40,
                            "status": "upcoming",
                            "start_date": "2026-06-23"
                      }
                ],
                "important_dates": [
                      {
                            "title": "Official Notification Release Date",
                            "event_date": "2026-01-19",
                            "date_type": "notification",
                            "is_tentative": false,
                            "display_order": 1
                      },
                      {
                            "title": "Online Application Commencement",
                            "event_date": "2026-01-19",
                            "date_type": "application_start",
                            "is_tentative": false,
                            "display_order": 2
                      },
                      {
                            "title": "Online Application Closing Deadline",
                            "event_date": "2026-02-18",
                            "date_type": "application_end",
                            "is_tentative": false,
                            "display_order": 3
                      },
                      {
                            "title": "Examination Commencement Date",
                            "event_date": "2026-06-23",
                            "date_type": "exam_start",
                            "is_tentative": false,
                            "display_order": 4
                      }
                ]
          },
          {
                "title": "MPESB Group-2 Sub-Group-4 (Patwari & Samarth Cadre) Combined Recruitment Examination 2026",
                "short_title": "MPESB Patwari & Group-2 2026",
                "slug": "mpesb-group-2-subgroup-4-patwari-2026",
                "exam_code": "MPESB-GRP2-2026",
                "mode": "online_cbt",
                "frequency": "as_needed",
                "category_slug": "state-govt",
                "description": "Madhya Pradesh state examination for Patwaris, Junior Accountants, Auditors, and Assistant Managers across state revenue offices.",
                "syllabus_summary": "Part-A: General Science, General Hindi, General English, General Mathematics (100 Marks). Part-B: General Knowledge & Aptitude, Computer Knowledge, Reasoning Ability, Management (100 Marks) - Total 200 Marks.",
                "marking_scheme": "No negative marking.",
                "pattern_description": "Single-tier Online Computer Based Test (200 marks) followed by Document Verification.",
                "application_process_guide": "Apply online at esb.mp.gov.in using MP Online portal profile.",
                "official_notification_url": "https://esb.mp.gov.in/notices/Group2_2026_Advt.pdf",
                "official_website_url": "https://esb.mp.gov.in",
                "date_of_notification": "2026-03-05",
                "application_start_date": "2026-03-05",
                "application_closing_date": "2026-03-25",
                "tentative_exam_date": "2026-07-15",
                "min_age": 18,
                "max_age": 40,
                "age_relaxation_rules": "Standard relaxation: SC/ST (5 yrs), OBC (3 yrs), PwD (10 yrs), Ex-Servicemen as per government directives.",
                "educational_qualification": "Graduation in any discipline + CPCT scorecard with Hindi typing.",
                "fee_details": {
                      "general": 500,
                      "obc": 250,
                      "ews": 250,
                      "sc": 250,
                      "st": 250,
                      "female": 250
                },
                "stages": [
                      {
                            "stage_name": "Computer Based Online Exam (200 Marks)",
                            "stage_order": 1,
                            "stage_type": "prelims",
                            "mode": "online_cbt",
                            "duration_minutes": 180,
                            "total_marks": 200,
                            "qualifying_marks": 80,
                            "status": "scheduled",
                            "start_date": "2026-07-15"
                      }
                ],
                "important_dates": [
                      {
                            "title": "Official Notification Release Date",
                            "event_date": "2026-03-05",
                            "date_type": "notification",
                            "is_tentative": false,
                            "display_order": 1
                      },
                      {
                            "title": "Online Application Commencement",
                            "event_date": "2026-03-05",
                            "date_type": "application_start",
                            "is_tentative": false,
                            "display_order": 2
                      },
                      {
                            "title": "Online Application Closing Deadline",
                            "event_date": "2026-03-25",
                            "date_type": "application_end",
                            "is_tentative": false,
                            "display_order": 3
                      },
                      {
                            "title": "Examination Commencement Date",
                            "event_date": "2026-07-15",
                            "date_type": "exam_start",
                            "is_tentative": false,
                            "display_order": 4
                      }
                ]
          }
    ]
  },

  // =========================================================================
  // 11. RAJASTHAN EXAMINATIONS (RPSC / RSMSSB / RAJASTHAN POLICE)
  // =========================================================================
  {
    key: "rajasthan_exams_feed",
    name: "Rajasthan Examination Feed (RPSC / RSMSSB / Rajasthan Police)",
    organizationSlug: "rpsc",
    organizationName: "Rajasthan Public Service & Staff Selection Boards",
    jurisdiction: "state",
    stateCode: "RJ",
    baseUrl: "https://rpsc.rajasthan.gov.in",
    examinationPath: "/exams",
    applyUrl: "https://sso.rajasthan.gov.in",
    defaultCategory: "state-govt",
    canonicalExams: [
          {
                "title": "RPSC Rajasthan State and Subordinate Services Combined Competitive Exam 2026 (RAS/RTS)",
                "short_title": "RPSC RAS/RTS 2026",
                "slug": "rpsc-rajasthan-administrative-services-ras-rts-2026",
                "exam_code": "RPSC-RAS-2026",
                "mode": "offline_omr",
                "frequency": "annual",
                "category_slug": "state-govt",
                "description": "Rajasthan's premier administrative examination for RAS (Rajasthan Administrative Service), RPS (Police Service), and Rajasthan Accounts Service.",
                "syllabus_summary": "Prelims: General Knowledge & General Science (200 marks - 150 Qs with Rajasthan Art, Culture, History & Economy). Mains: GS-I (History/Econ), GS-II (Ethics/Science), GS-III (Polity/PubAd), GS-IV (General Hindi & General English) - 200 marks each (800 marks total).",
                "marking_scheme": "1/3rd marks deducted per incorrect question in Prelims.",
                "pattern_description": "Prelims OMR Exam (200 marks), Mains Written Descriptive Exam (800 marks), and Personality Test (100 marks).",
                "application_process_guide": "Apply online via SSO portal at sso.rajasthan.gov.in using One Time Registration (OTR).",
                "official_notification_url": "https://rpsc.rajasthan.gov.in/notices/RAS_2026_Advt.pdf",
                "official_website_url": "https://rpsc.rajasthan.gov.in",
                "date_of_notification": "2026-07-01",
                "application_start_date": "2026-07-01",
                "application_closing_date": "2026-07-31",
                "tentative_exam_date": "2026-10-01",
                "min_age": 21,
                "max_age": 40,
                "age_relaxation_rules": "Standard relaxation: SC/ST (5 yrs), OBC (3 yrs), PwD (10 yrs), Ex-Servicemen as per government directives.",
                "educational_qualification": "Graduation in any discipline from a recognized University.",
                "fee_details": {
                      "general": 600,
                      "obc": 400,
                      "ews": 400,
                      "sc": 400,
                      "st": 400,
                      "female": 400
                },
                "stages": [
                      {
                            "stage_name": "Preliminary Examination (150 Questions - 200 Marks)",
                            "stage_order": 1,
                            "stage_type": "prelims",
                            "mode": "offline_omr",
                            "duration_minutes": 180,
                            "total_marks": 200,
                            "qualifying_marks": 70,
                            "status": "scheduled",
                            "start_date": "2026-10-01"
                      },
                      {
                            "stage_name": "Main Written Examination (4 Papers - 800 Marks)",
                            "stage_order": 2,
                            "stage_type": "mains",
                            "mode": "pen_paper",
                            "duration_minutes": 720,
                            "total_marks": 800,
                            "qualifying_marks": 320,
                            "status": "upcoming",
                            "start_date": "2026-10-01"
                      },
                      {
                            "stage_name": "Personality Test & Viva-voce",
                            "stage_order": 3,
                            "stage_type": "interview",
                            "mode": "hybrid",
                            "duration_minutes": 30,
                            "total_marks": 100,
                            "qualifying_marks": 40,
                            "status": "upcoming",
                            "start_date": "2026-10-01"
                      }
                ],
                "important_dates": [
                      {
                            "title": "Official Notification Release Date",
                            "event_date": "2026-07-01",
                            "date_type": "notification",
                            "is_tentative": false,
                            "display_order": 1
                      },
                      {
                            "title": "Online Application Commencement",
                            "event_date": "2026-07-01",
                            "date_type": "application_start",
                            "is_tentative": false,
                            "display_order": 2
                      },
                      {
                            "title": "Online Application Closing Deadline",
                            "event_date": "2026-07-31",
                            "date_type": "application_end",
                            "is_tentative": false,
                            "display_order": 3
                      },
                      {
                            "title": "Examination Commencement Date",
                            "event_date": "2026-10-01",
                            "date_type": "exam_start",
                            "is_tentative": false,
                            "display_order": 4
                      }
                ],
                "is_featured": true
          },
          {
                "title": "RSMSSB Common Eligibility Test (CET Graduate & Senior Secondary Level) 2026",
                "short_title": "RSMSSB CET 2026",
                "slug": "rsmssb-common-eligibility-test-cet-2026",
                "exam_code": "RSMSSB-CET-2026",
                "mode": "offline_omr",
                "frequency": "annual",
                "category_slug": "state-govt",
                "description": "Mandatory eligibility examination for Patwari, Junior Accountant, Platoon Commander, Clerk Grade-II, and Constable positions in Rajasthan.",
                "syllabus_summary": "Rajasthan History, Art, Culture, Geography, Indian Polity, Economy, General Science, Reasoning, Math, General Hindi, General English, Computers (150 Qs - 300 Marks).",
                "marking_scheme": "No negative marking in Rajasthan CET.",
                "pattern_description": "Single Stage Pen-Paper OMR Examination (300 marks) with a 3-year validity certificate.",
                "application_process_guide": "Apply online through Rajasthan SSO Portal (sso.rajasthan.gov.in).",
                "official_notification_url": "https://rsmssb.rajasthan.gov.in/notices/CET_2026_Advt.pdf",
                "official_website_url": "https://rsmssb.rajasthan.gov.in",
                "date_of_notification": "2026-08-05",
                "application_start_date": "2026-08-05",
                "application_closing_date": "2026-09-07",
                "tentative_exam_date": "2026-10-21",
                "min_age": 18,
                "max_age": 40,
                "age_relaxation_rules": "Standard relaxation: SC/ST (5 yrs), OBC (3 yrs), PwD (10 yrs), Ex-Servicemen as per government directives.",
                "educational_qualification": "Senior Secondary (12th) or Graduation based on CET level.",
                "fee_details": {
                      "general": 600,
                      "obc": 400,
                      "ews": 400,
                      "sc": 400,
                      "st": 400,
                      "female": 400
                },
                "stages": [
                      {
                            "stage_name": "Written Examination (150 Questions - 300 Marks)",
                            "stage_order": 1,
                            "stage_type": "prelims",
                            "mode": "offline_omr",
                            "duration_minutes": 180,
                            "total_marks": 300,
                            "qualifying_marks": 120,
                            "status": "scheduled",
                            "start_date": "2026-10-21"
                      }
                ],
                "important_dates": [
                      {
                            "title": "Official Notification Release Date",
                            "event_date": "2026-08-05",
                            "date_type": "notification",
                            "is_tentative": false,
                            "display_order": 1
                      },
                      {
                            "title": "Online Application Commencement",
                            "event_date": "2026-08-05",
                            "date_type": "application_start",
                            "is_tentative": false,
                            "display_order": 2
                      },
                      {
                            "title": "Online Application Closing Deadline",
                            "event_date": "2026-09-07",
                            "date_type": "application_end",
                            "is_tentative": false,
                            "display_order": 3
                      },
                      {
                            "title": "Examination Commencement Date",
                            "event_date": "2026-10-21",
                            "date_type": "exam_start",
                            "is_tentative": false,
                            "display_order": 4
                      }
                ]
          }
    ]
  },

  // =========================================================================
  // 12. DELHI EXAMINATIONS (DSSSB / DELHI POLICE)
  // =========================================================================
  {
    key: "delhi_exams_feed",
    name: "Delhi Examination Feed (DSSSB / Delhi Police)",
    organizationSlug: "dsssb",
    organizationName: "Delhi Subordinate Services Selection Board",
    jurisdiction: "state",
    stateCode: "DL",
    baseUrl: "https://dsssb.delhi.gov.in",
    examinationPath: "/exams",
    applyUrl: "https://dsssbonline.nic.in",
    defaultCategory: "state-govt",
    canonicalExams: [
          {
                "title": "DSSSB Special Educator, TGT, PGT & Assistant Teacher Combined Examination 2026",
                "short_title": "DSSSB Teaching Exam 2026",
                "slug": "dsssb-special-educator-tgt-pgt-teacher-2026",
                "exam_code": "DSSSB-TEACHER-2026",
                "mode": "online_cbt",
                "frequency": "annual",
                "category_slug": "teaching",
                "description": "National competitive examination for Teachers and Special Educators under the Directorate of Education (DoE), Govt of NCT of Delhi.",
                "syllabus_summary": "Section-A: General Awareness, General Intelligence & Reasoning, Arithmetical & Numerical Ability, Hindi Language, English Language (100 marks). Section-B: Subject Specific Methodology, Pedagogy, Teaching Aptitude (100 marks).",
                "marking_scheme": "0.25 negative marks per incorrect answer.",
                "pattern_description": "One Tier Computer Based Examination (200 marks total) followed by Document Verification.",
                "application_process_guide": "Apply online at dsssbonline.nic.in after completing OARS user registration.",
                "official_notification_url": "https://dsssb.delhi.gov.in/notices/Teacher_2026_Advt.pdf",
                "official_website_url": "https://dsssbonline.nic.in",
                "date_of_notification": "2026-01-09",
                "application_start_date": "2026-01-09",
                "application_closing_date": "2026-02-07",
                "tentative_exam_date": "2026-07-08",
                "min_age": 18,
                "max_age": 32,
                "age_relaxation_rules": "Standard relaxation: SC/ST (5 yrs), OBC (3 yrs), PwD (10 yrs), Ex-Servicemen as per government directives.",
                "educational_qualification": "Graduation / Post Graduation with B.Ed / D.El.Ed and CTET Paper-I/II qualified.",
                "fee_details": {
                      "general": 100,
                      "obc": 100,
                      "ews": 100,
                      "sc": 0,
                      "st": 0,
                      "female": 0
                },
                "stages": [
                      {
                            "stage_name": "One Tier Computer Based Examination (200 Marks)",
                            "stage_order": 1,
                            "stage_type": "prelims",
                            "mode": "online_cbt",
                            "duration_minutes": 120,
                            "total_marks": 200,
                            "qualifying_marks": 80,
                            "status": "scheduled",
                            "start_date": "2026-07-08"
                      }
                ],
                "important_dates": [
                      {
                            "title": "Official Notification Release Date",
                            "event_date": "2026-01-09",
                            "date_type": "notification",
                            "is_tentative": false,
                            "display_order": 1
                      },
                      {
                            "title": "Online Application Commencement",
                            "event_date": "2026-01-09",
                            "date_type": "application_start",
                            "is_tentative": false,
                            "display_order": 2
                      },
                      {
                            "title": "Online Application Closing Deadline",
                            "event_date": "2026-02-07",
                            "date_type": "application_end",
                            "is_tentative": false,
                            "display_order": 3
                      },
                      {
                            "title": "Examination Commencement Date",
                            "event_date": "2026-07-08",
                            "date_type": "exam_start",
                            "is_tentative": false,
                            "display_order": 4
                      }
                ]
          },
          {
                "title": "Delhi Police Executive Constable (Male & Female) Computer Based Examination 2026",
                "short_title": "Delhi Police Constable 2026",
                "slug": "delhi-police-constable-executive-2026",
                "exam_code": "DP-CONSTABLE-2026",
                "mode": "online_cbt",
                "frequency": "annual",
                "category_slug": "state-police",
                "description": "National recruitment conducted through SSC for Executive Constables in Delhi Police with all-India posting in National Capital Territory.",
                "syllabus_summary": "Reasoning (25 Qs), General Knowledge / Current Affairs (50 Qs), Numerical Ability (15 Qs), Computer Fundamentals / MS Office / Internet (10 Qs) - 100 Questions (100 Marks).",
                "marking_scheme": "0.25 marks negative marking.",
                "pattern_description": "Computer Based Test (100 marks) followed by Physical Endurance & Measurement Test (PE&MT: 1600m run, long jump, high jump).",
                "application_process_guide": "Apply online at ssc.gov.in / delhipolice.gov.in.",
                "official_notification_url": "https://delhipolice.gov.in/notices/DP_Constable_2026.pdf",
                "official_website_url": "https://delhipolice.gov.in",
                "date_of_notification": "2026-09-01",
                "application_start_date": "2026-09-01",
                "application_closing_date": "2026-09-30",
                "tentative_exam_date": "2026-11-14",
                "min_age": 18,
                "max_age": 25,
                "age_relaxation_rules": "Standard relaxation: SC/ST (5 yrs), OBC (3 yrs), PwD (10 yrs), Ex-Servicemen as per government directives.",
                "educational_qualification": "10+2 (Senior Secondary) pass from a recognized Board. Male candidates must possess a valid driving license for LMV.",
                "fee_details": {
                      "general": 100,
                      "obc": 100,
                      "ews": 100,
                      "sc": 0,
                      "st": 0,
                      "female": 0
                },
                "stages": [
                      {
                            "stage_name": "Computer Based Examination (100 Questions)",
                            "stage_order": 1,
                            "stage_type": "prelims",
                            "mode": "online_cbt",
                            "duration_minutes": 90,
                            "total_marks": 100,
                            "qualifying_marks": 40,
                            "status": "scheduled",
                            "start_date": "2026-11-14"
                      },
                      {
                            "stage_name": "Physical Endurance & Measurement Test (PE&MT)",
                            "stage_order": 2,
                            "stage_type": "physical",
                            "mode": "hybrid",
                            "duration_minutes": 60,
                            "total_marks": 100,
                            "qualifying_marks": 40,
                            "status": "upcoming",
                            "start_date": "2026-11-14"
                      }
                ],
                "important_dates": [
                      {
                            "title": "Official Notification Release Date",
                            "event_date": "2026-09-01",
                            "date_type": "notification",
                            "is_tentative": false,
                            "display_order": 1
                      },
                      {
                            "title": "Online Application Commencement",
                            "event_date": "2026-09-01",
                            "date_type": "application_start",
                            "is_tentative": false,
                            "display_order": 2
                      },
                      {
                            "title": "Online Application Closing Deadline",
                            "event_date": "2026-09-30",
                            "date_type": "application_end",
                            "is_tentative": false,
                            "display_order": 3
                      },
                      {
                            "title": "Examination Commencement Date",
                            "event_date": "2026-11-14",
                            "date_type": "exam_start",
                            "is_tentative": false,
                            "display_order": 4
                      }
                ]
          }
    ]
  },

  // =========================================================================
  // 13. HARYANA EXAMINATIONS (HPSC / HSSC / HTET)
  // =========================================================================
  {
    key: "haryana_exams_feed",
    name: "Haryana Examination Feed (HPSC / HSSC / HTET)",
    organizationSlug: "hpsc",
    organizationName: "Haryana Public Service & Staff Selection Commissions",
    jurisdiction: "state",
    stateCode: "HR",
    baseUrl: "https://hpsc.gov.in",
    examinationPath: "/exams",
    applyUrl: "https://hpsc.gov.in",
    defaultCategory: "state-govt",
    canonicalExams: [
          {
                "title": "HPSC Haryana Civil Services (Executive Branch) & Allied Services Examination 2026",
                "short_title": "HPSC HCS 2026",
                "slug": "hpsc-haryana-civil-services-hcs-2026",
                "exam_code": "HPSC-HCS-2026",
                "mode": "offline_omr",
                "frequency": "annual",
                "category_slug": "state-govt",
                "description": "Haryana's premier competitive examination for HCS (Executive Branch), DSP, Excise & Taxation Officer, District Food & Supplies Controller, and 'A' Class Tehsildar.",
                "syllabus_summary": "Prelims: Paper-I General Studies (100 marks) & Paper-II CSAT (100 marks qualifying 33%). Mains: English (100), Hindi (100), General Studies (200), One Optional Subject (200) - 600 Marks total.",
                "marking_scheme": "0.25 marks penalty per wrong response in Prelims. 5th option mandatory on OMR sheet.",
                "pattern_description": "Prelims OMR Exam (200 marks), Mains Written Conventional Exam (600 marks), and Personality Test (75 marks).",
                "application_process_guide": "Apply online at hpsc.gov.in using Haryana Parivar Pehchan Patra (PPP) / Aadhaar.",
                "official_notification_url": "https://hpsc.gov.in/notices/HCS_2026_Advt.pdf",
                "official_website_url": "https://hpsc.gov.in",
                "date_of_notification": "2026-11-17",
                "application_start_date": "2026-11-17",
                "application_closing_date": "2026-12-25",
                "tentative_exam_date": "2026-02-11",
                "min_age": 18,
                "max_age": 42,
                "age_relaxation_rules": "Standard relaxation: SC/ST (5 yrs), OBC (3 yrs), PwD (10 yrs), Ex-Servicemen as per government directives.",
                "educational_qualification": "Bachelor of Arts / Science / Commerce or an equivalent degree of a recognized University.",
                "fee_details": {
                      "general": 1000,
                      "obc": 250,
                      "ews": 250,
                      "sc": 250,
                      "st": 250,
                      "female": 250
                },
                "stages": [
                      {
                            "stage_name": "Preliminary Examination (GS & CSAT)",
                            "stage_order": 1,
                            "stage_type": "prelims",
                            "mode": "offline_omr",
                            "duration_minutes": 240,
                            "total_marks": 200,
                            "qualifying_marks": 66,
                            "status": "scheduled",
                            "start_date": "2026-02-11"
                      },
                      {
                            "stage_name": "Main Written Examination (4 Papers - 600 Marks)",
                            "stage_order": 2,
                            "stage_type": "mains",
                            "mode": "pen_paper",
                            "duration_minutes": 720,
                            "total_marks": 600,
                            "qualifying_marks": 270,
                            "status": "upcoming",
                            "start_date": "2026-02-11"
                      },
                      {
                            "stage_name": "Personality Test (Interview)",
                            "stage_order": 3,
                            "stage_type": "interview",
                            "mode": "hybrid",
                            "duration_minutes": 30,
                            "total_marks": 75,
                            "qualifying_marks": 40,
                            "status": "upcoming",
                            "start_date": "2026-02-11"
                      }
                ],
                "important_dates": [
                      {
                            "title": "Official Notification Release Date",
                            "event_date": "2026-11-17",
                            "date_type": "notification",
                            "is_tentative": false,
                            "display_order": 1
                      },
                      {
                            "title": "Online Application Commencement",
                            "event_date": "2026-11-17",
                            "date_type": "application_start",
                            "is_tentative": false,
                            "display_order": 2
                      },
                      {
                            "title": "Online Application Closing Deadline",
                            "event_date": "2026-12-25",
                            "date_type": "application_end",
                            "is_tentative": false,
                            "display_order": 3
                      },
                      {
                            "title": "Examination Commencement Date",
                            "event_date": "2026-02-11",
                            "date_type": "exam_start",
                            "is_tentative": false,
                            "display_order": 4
                      }
                ]
          },
          {
                "title": "HSSC Common Eligibility Test (CET Group C & Group D) 2026",
                "short_title": "HSSC CET 2026",
                "slug": "hssc-common-eligibility-test-cet-2026",
                "exam_code": "HSSC-CET-2026",
                "mode": "offline_omr",
                "frequency": "annual",
                "category_slug": "state-govt",
                "description": "Foundation recruitment examination for all Group 'C' and Group 'D' government positions across boards, corporations, and departments in Haryana.",
                "syllabus_summary": "75% Weightage: General Awareness, Reasoning, Maths, Science, Computer, English, Hindi. 25% Weightage: Haryana History, Current Affairs, Literature, Geography, Civics, Environment, Culture (100 Qs - 95 Marks + 5 Socio-Economic marks).",
                "marking_scheme": "0.95 marks per question. No negative marking, but mandatory 5th bubble to prevent tampering.",
                "pattern_description": "Statewide Pen-Paper OMR Examination (95 marks + 5 socio-economic criteria marks).",
                "application_process_guide": "Apply online at onetimeregn.haryana.gov.in using PPP (Family ID).",
                "official_notification_url": "https://hssc.gov.in/notices/CET_2026_Advt.pdf",
                "official_website_url": "https://hssc.gov.in",
                "date_of_notification": "2026-05-30",
                "application_start_date": "2026-05-30",
                "application_closing_date": "2026-06-25",
                "tentative_exam_date": "2026-08-17",
                "min_age": 18,
                "max_age": 42,
                "age_relaxation_rules": "Standard relaxation: SC/ST (5 yrs), OBC (3 yrs), PwD (10 yrs), Ex-Servicemen as per government directives.",
                "educational_qualification": "10+2 / Graduation depending on Group level with Hindi/Sanskrit up to Matriculation standard.",
                "fee_details": {
                      "general": 500,
                      "obc": 250,
                      "ews": 250,
                      "sc": 250,
                      "st": 250,
                      "female": 250
                },
                "stages": [
                      {
                            "stage_name": "Common Eligibility Test (100 Questions - 95 Marks)",
                            "stage_order": 1,
                            "stage_type": "prelims",
                            "mode": "offline_omr",
                            "duration_minutes": 105,
                            "total_marks": 95,
                            "qualifying_marks": 47.5,
                            "status": "scheduled",
                            "start_date": "2026-08-17"
                      }
                ],
                "important_dates": [
                      {
                            "title": "Official Notification Release Date",
                            "event_date": "2026-05-30",
                            "date_type": "notification",
                            "is_tentative": false,
                            "display_order": 1
                      },
                      {
                            "title": "Online Application Commencement",
                            "event_date": "2026-05-30",
                            "date_type": "application_start",
                            "is_tentative": false,
                            "display_order": 2
                      },
                      {
                            "title": "Online Application Closing Deadline",
                            "event_date": "2026-06-25",
                            "date_type": "application_end",
                            "is_tentative": false,
                            "display_order": 3
                      },
                      {
                            "title": "Examination Commencement Date",
                            "event_date": "2026-08-17",
                            "date_type": "exam_start",
                            "is_tentative": false,
                            "display_order": 4
                      }
                ]
          }
    ]
  },

  // =========================================================================
  // 14. JHARKHAND EXAMINATIONS (JPSC / JSSC / JHARKHAND POLICE)
  // =========================================================================
  {
    key: "jharkhand_exams_feed",
    name: "Jharkhand Examination Feed (JPSC / JSSC / Jharkhand Police)",
    organizationSlug: "jpsc",
    organizationName: "Jharkhand Public Service & Staff Selection Commissions",
    jurisdiction: "state",
    stateCode: "JH",
    baseUrl: "https://jpsc.gov.in",
    examinationPath: "/exams",
    applyUrl: "https://jpsc.gov.in",
    defaultCategory: "state-govt",
    canonicalExams: [
          {
                "title": "JPSC Combined Civil Services Examination 2026 (12th, 13th, 14th JPSC CCE)",
                "short_title": "JPSC CCE 2026",
                "slug": "jpsc-combined-civil-services-cce-2026",
                "exam_code": "JPSC-CCE-2026",
                "mode": "offline_omr",
                "frequency": "annual",
                "category_slug": "state-govt",
                "description": "Jharkhand's premier civil services competitive examination for Jharkhand Administrative Service (JAS), Police Service (JPS), and Accounts Service.",
                "syllabus_summary": "Prelims: Paper-I General Studies (200 marks) & Paper-II Jharkhand Specific General Studies (200 marks). Mains: 6 Descriptive Papers (General Hindi/English, Language/Literature, Social Sciences, Indian Constitution, Indian Economy, General Science/Tech - 1050 Marks total).",
                "marking_scheme": "No negative marking in JPSC Combined Civil Services Preliminary Examination.",
                "pattern_description": "Prelims OMR Exam (400 marks), Mains Written Descriptive Exam (1050 marks), and Interview (100 marks).",
                "application_process_guide": "Apply online at jpsc.gov.in.",
                "official_notification_url": "https://jpsc.gov.in/notices/CCE_2026_Advt.pdf",
                "official_website_url": "https://jpsc.gov.in",
                "date_of_notification": "2026-01-27",
                "application_start_date": "2026-01-27",
                "application_closing_date": "2026-02-29",
                "tentative_exam_date": "2026-03-17",
                "min_age": 21,
                "max_age": 35,
                "age_relaxation_rules": "Standard relaxation: SC/ST (5 yrs), OBC (3 yrs), PwD (10 yrs), Ex-Servicemen as per government directives.",
                "educational_qualification": "Graduation in any discipline from a recognized University.",
                "fee_details": {
                      "general": 100,
                      "obc": 100,
                      "ews": 100,
                      "sc": 50,
                      "st": 50,
                      "female": 50
                },
                "stages": [
                      {
                            "stage_name": "Preliminary Examination (Paper I & II - 400 Marks)",
                            "stage_order": 1,
                            "stage_type": "prelims",
                            "mode": "offline_omr",
                            "duration_minutes": 240,
                            "total_marks": 400,
                            "qualifying_marks": 160,
                            "status": "scheduled",
                            "start_date": "2026-03-17"
                      },
                      {
                            "stage_name": "Main Written Examination (6 Descriptive Papers)",
                            "stage_order": 2,
                            "stage_type": "mains",
                            "mode": "pen_paper",
                            "duration_minutes": 1080,
                            "total_marks": 1050,
                            "qualifying_marks": 420,
                            "status": "upcoming",
                            "start_date": "2026-03-17"
                      },
                      {
                            "stage_name": "Interview / Personality Test",
                            "stage_order": 3,
                            "stage_type": "interview",
                            "mode": "hybrid",
                            "duration_minutes": 30,
                            "total_marks": 100,
                            "qualifying_marks": 40,
                            "status": "upcoming",
                            "start_date": "2026-03-17"
                      }
                ],
                "important_dates": [
                      {
                            "title": "Official Notification Release Date",
                            "event_date": "2026-01-27",
                            "date_type": "notification",
                            "is_tentative": false,
                            "display_order": 1
                      },
                      {
                            "title": "Online Application Commencement",
                            "event_date": "2026-01-27",
                            "date_type": "application_start",
                            "is_tentative": false,
                            "display_order": 2
                      },
                      {
                            "title": "Online Application Closing Deadline",
                            "event_date": "2026-02-29",
                            "date_type": "application_end",
                            "is_tentative": false,
                            "display_order": 3
                      },
                      {
                            "title": "Examination Commencement Date",
                            "event_date": "2026-03-17",
                            "date_type": "exam_start",
                            "is_tentative": false,
                            "display_order": 4
                      }
                ]
          },
          {
                "title": "JSSC Jharkhand General Graduate Level Combined Competitive Exam (JGGLCCE / CGL) 2026",
                "short_title": "JSSC CGL 2026",
                "slug": "jssc-graduate-level-cgl-jgglcce-2026",
                "exam_code": "JSSC-JGGLCCE-2026",
                "mode": "offline_omr",
                "frequency": "as_needed",
                "category_slug": "state-govt",
                "description": "State recruitment examination for Assistant Branch Officers, Block Supply Officers, Junior Secretariat Assistants, and Planning Assistants in Jharkhand.",
                "syllabus_summary": "Paper-1: Language Knowledge (Hindi & English qualifying 30%). Paper-2: Regional / Tribal Language (100 Qs - 300 Marks). Paper-3: General Knowledge, General Science, Maths, Mental Ability, Computer, Jharkhand Specific GK (150 Qs - 450 Marks).",
                "marking_scheme": "3 marks per correct answer, 1 mark deducted per incorrect answer.",
                "pattern_description": "Main Written Examination in 3 shifts (OMR Based - 750 Merit Marks) followed by Document Verification.",
                "application_process_guide": "Apply online at jssc.nic.in.",
                "official_notification_url": "https://jssc.nic.in/notices/JGGLCCE_2026_Advt.pdf",
                "official_website_url": "https://jssc.nic.in",
                "date_of_notification": "2026-06-20",
                "application_start_date": "2026-06-20",
                "application_closing_date": "2026-07-19",
                "tentative_exam_date": "2026-09-21",
                "min_age": 21,
                "max_age": 35,
                "age_relaxation_rules": "Standard relaxation: SC/ST (5 yrs), OBC (3 yrs), PwD (10 yrs), Ex-Servicemen as per government directives.",
                "educational_qualification": "Graduation in any stream from recognized University.",
                "fee_details": {
                      "general": 100,
                      "obc": 100,
                      "ews": 100,
                      "sc": 50,
                      "st": 50,
                      "female": 50
                },
                "stages": [
                      {
                            "stage_name": "Written Examination (Papers 1, 2, 3 - 3 Shifts)",
                            "stage_order": 1,
                            "stage_type": "prelims",
                            "mode": "offline_omr",
                            "duration_minutes": 360,
                            "total_marks": 750,
                            "qualifying_marks": 300,
                            "status": "scheduled",
                            "start_date": "2026-09-21"
                      }
                ],
                "important_dates": [
                      {
                            "title": "Official Notification Release Date",
                            "event_date": "2026-06-20",
                            "date_type": "notification",
                            "is_tentative": false,
                            "display_order": 1
                      },
                      {
                            "title": "Online Application Commencement",
                            "event_date": "2026-06-20",
                            "date_type": "application_start",
                            "is_tentative": false,
                            "display_order": 2
                      },
                      {
                            "title": "Online Application Closing Deadline",
                            "event_date": "2026-07-19",
                            "date_type": "application_end",
                            "is_tentative": false,
                            "display_order": 3
                      },
                      {
                            "title": "Examination Commencement Date",
                            "event_date": "2026-09-21",
                            "date_type": "exam_start",
                            "is_tentative": false,
                            "display_order": 4
                      }
                ]
          }
    ]
  },

  // =========================================================================
  // 15. UTTARAKHAND EXAMINATIONS (UKPSC / UKSSSC / UTTARAKHAND POLICE)
  // =========================================================================
  {
    key: "uk_exams_feed",
    name: "Uttarakhand Examination Feed (UKPSC / UKSSSC / Uttarakhand Police)",
    organizationSlug: "ukpsc",
    organizationName: "Uttarakhand Public Service & Selection Commissions",
    jurisdiction: "state",
    stateCode: "UK",
    baseUrl: "https://psc.uk.gov.in",
    examinationPath: "/exams",
    applyUrl: "https://ukpsc.net.in",
    defaultCategory: "state-govt",
    canonicalExams: [
          {
                "title": "UKPSC Uttarakhand Combined State Civil / Upper Subordinate Services Exam 2026 (UKPSC PCS)",
                "short_title": "UKPSC PCS 2026",
                "slug": "ukpsc-uttarakhand-civil-services-pcs-2026",
                "exam_code": "UKPSC-PCS-2026",
                "mode": "offline_omr",
                "frequency": "annual",
                "category_slug": "state-govt",
                "description": "Uttarakhand's state civil services competitive examination for Deputy Collector, Deputy SP, District Commandant Homeguards, and Finance Officers.",
                "syllabus_summary": "Prelims: Paper-I General Studies (150 marks) & Paper-II General Aptitude (150 marks). Mains: Language (300), History/Culture (200), Polity/Ethics (200), Economy/Geo (200), Science/Tech (200), Uttarakhand Specific Papers (400) - 1500 Marks total.",
                "marking_scheme": "0.25 marks penalty per wrong answer in Prelims.",
                "pattern_description": "Prelims OMR Exam (300 marks), Mains Written Descriptive Exam (1500 marks), and Interview (150 marks).",
                "application_process_guide": "Apply online at psc.uk.gov.in.",
                "official_notification_url": "https://psc.uk.gov.in/notices/PCS_2026_Advt.pdf",
                "official_website_url": "https://psc.uk.gov.in",
                "date_of_notification": "2026-03-14",
                "application_start_date": "2026-03-14",
                "application_closing_date": "2026-04-03",
                "tentative_exam_date": "2026-07-14",
                "min_age": 21,
                "max_age": 42,
                "age_relaxation_rules": "Standard relaxation: SC/ST (5 yrs), OBC (3 yrs), PwD (10 yrs), Ex-Servicemen as per government directives.",
                "educational_qualification": "Bachelor's Degree from any recognized University.",
                "fee_details": {
                      "general": 172.3,
                      "obc": 172.3,
                      "ews": 172.3,
                      "sc": 82.3,
                      "st": 82.3,
                      "female": 172.3
                },
                "stages": [
                      {
                            "stage_name": "Preliminary Examination (GS & Aptitude - 300 Marks)",
                            "stage_order": 1,
                            "stage_type": "prelims",
                            "mode": "offline_omr",
                            "duration_minutes": 240,
                            "total_marks": 300,
                            "qualifying_marks": 100,
                            "status": "scheduled",
                            "start_date": "2026-07-14"
                      },
                      {
                            "stage_name": "Main Written Examination (Descriptive 1500 Marks)",
                            "stage_order": 2,
                            "stage_type": "mains",
                            "mode": "pen_paper",
                            "duration_minutes": 1260,
                            "total_marks": 1500,
                            "qualifying_marks": 600,
                            "status": "upcoming",
                            "start_date": "2026-07-14"
                      },
                      {
                            "stage_name": "Interview / Personality Evaluation",
                            "stage_order": 3,
                            "stage_type": "interview",
                            "mode": "hybrid",
                            "duration_minutes": 30,
                            "total_marks": 150,
                            "qualifying_marks": 40,
                            "status": "upcoming",
                            "start_date": "2026-07-14"
                      }
                ],
                "important_dates": [
                      {
                            "title": "Official Notification Release Date",
                            "event_date": "2026-03-14",
                            "date_type": "notification",
                            "is_tentative": false,
                            "display_order": 1
                      },
                      {
                            "title": "Online Application Commencement",
                            "event_date": "2026-03-14",
                            "date_type": "application_start",
                            "is_tentative": false,
                            "display_order": 2
                      },
                      {
                            "title": "Online Application Closing Deadline",
                            "event_date": "2026-04-03",
                            "date_type": "application_end",
                            "is_tentative": false,
                            "display_order": 3
                      },
                      {
                            "title": "Examination Commencement Date",
                            "event_date": "2026-07-14",
                            "date_type": "exam_start",
                            "is_tentative": false,
                            "display_order": 4
                      }
                ]
          }
    ]
  },

  // =========================================================================
  // 16. WEST BENGAL EXAMINATIONS (WBPSC / WBPRB / WBBPE)
  // =========================================================================
  {
    key: "wb_exams_feed",
    name: "West Bengal Examination Feed (WBPSC / WBPRB / WBBPE)",
    organizationSlug: "wbpsc",
    organizationName: "West Bengal Public Service & Police Recruitment Boards",
    jurisdiction: "state",
    stateCode: "WB",
    baseUrl: "https://psc.wb.gov.in",
    examinationPath: "/exams",
    applyUrl: "https://psc.wb.gov.in",
    defaultCategory: "state-govt",
    canonicalExams: [
          {
                "title": "WBPSC West Bengal Civil Service (Executive) etc. Examination, 2026 (WBCS 2026)",
                "short_title": "WBCS 2026",
                "slug": "wbpsc-west-bengal-civil-service-wbcs-2026",
                "exam_code": "WBPSC-WBCS-2026",
                "mode": "offline_omr",
                "frequency": "annual",
                "category_slug": "state-govt",
                "description": "West Bengal's premier administrative examination for WBCS (Exe), West Bengal Police Service (WBPS), Revenue Service, and Cooperative Service across Group A, B, C, D cadres.",
                "syllabus_summary": "Prelims: English, General Science, Current Events, Indian History, Geography of India with special reference to West Bengal, Indian Polity & Economy, Indian National Movement, General Mental Ability (200 Qs - 200 Marks). Mains: 6 Compulsory Papers + 2 Optional Papers.",
                "marking_scheme": "Negative marking for incorrect answers as specified by the commission (0.33 mark).",
                "pattern_description": "Prelims OMR Exam (200 marks), Mains Written Exam (1600 marks for Gr A & B), and Personality Test (200 marks).",
                "application_process_guide": "Apply online at psc.wb.gov.in using WBPSC Enrolment ID.",
                "official_notification_url": "https://psc.wb.gov.in/notices/WBCS_2026_Advt.pdf",
                "official_website_url": "https://psc.wb.gov.in",
                "date_of_notification": "2026-02-28",
                "application_start_date": "2026-02-28",
                "application_closing_date": "2026-03-21",
                "tentative_exam_date": "2026-12-16",
                "min_age": 21,
                "max_age": 36,
                "age_relaxation_rules": "Standard relaxation: SC/ST (5 yrs), OBC (3 yrs), PwD (10 yrs), Ex-Servicemen as per government directives.",
                "educational_qualification": "A degree of a recognized University and ability to read, write and speak in Bengali (not required for Nepali speaking candidates of Darjeeling/Kalimpong).",
                "fee_details": {
                      "general": 210,
                      "obc": 210,
                      "ews": 210,
                      "sc": 0,
                      "st": 0,
                      "female": 210
                },
                "stages": [
                      {
                            "stage_name": "Preliminary Examination (200 Questions - 200 Marks)",
                            "stage_order": 1,
                            "stage_type": "prelims",
                            "mode": "offline_omr",
                            "duration_minutes": 150,
                            "total_marks": 200,
                            "qualifying_marks": 110,
                            "status": "scheduled",
                            "start_date": "2026-12-16"
                      },
                      {
                            "stage_name": "Main Written Examination (8 Papers - 1600 Marks)",
                            "stage_order": 2,
                            "stage_type": "mains",
                            "mode": "pen_paper",
                            "duration_minutes": 1440,
                            "total_marks": 1600,
                            "qualifying_marks": 700,
                            "status": "upcoming",
                            "start_date": "2026-12-16"
                      },
                      {
                            "stage_name": "Personality Test",
                            "stage_order": 3,
                            "stage_type": "interview",
                            "mode": "hybrid",
                            "duration_minutes": 30,
                            "total_marks": 200,
                            "qualifying_marks": 40,
                            "status": "upcoming",
                            "start_date": "2026-12-16"
                      }
                ],
                "important_dates": [
                      {
                            "title": "Official Notification Release Date",
                            "event_date": "2026-02-28",
                            "date_type": "notification",
                            "is_tentative": false,
                            "display_order": 1
                      },
                      {
                            "title": "Online Application Commencement",
                            "event_date": "2026-02-28",
                            "date_type": "application_start",
                            "is_tentative": false,
                            "display_order": 2
                      },
                      {
                            "title": "Online Application Closing Deadline",
                            "event_date": "2026-03-21",
                            "date_type": "application_end",
                            "is_tentative": false,
                            "display_order": 3
                      },
                      {
                            "title": "Examination Commencement Date",
                            "event_date": "2026-12-16",
                            "date_type": "exam_start",
                            "is_tentative": false,
                            "display_order": 4
                      }
                ],
                "is_featured": true
          },
          {
                "title": "WBPRB West Bengal Police Sub-Inspector & Constable Combined Recruitment 2026",
                "short_title": "WB Police SI & Constable 2026",
                "slug": "wb-police-sub-inspector-constable-wbprb-2026",
                "exam_code": "WBPRB-POLICE-2026",
                "mode": "offline_omr",
                "frequency": "annual",
                "category_slug": "state-police",
                "description": "State recruitment for Armed and Unarmed Sub-Inspectors and Constables in West Bengal Police and Kolkata Police.",
                "syllabus_summary": "Preliminary: General Studies (50 Qs), Logical & Analytical Reasoning (25 Qs), Arithmetic (25 Qs) - 200 Marks total. Final Combined Exam: Paper-I GS & Arithmetic, Paper-II English, Paper-III Bengali/Hindi/Urdu/Nepali.",
                "marking_scheme": "0.25 marks deducted per wrong answer.",
                "pattern_description": "Preliminary Screening Test (200 marks), Physical Measurement Test (PMT) & Physical Efficiency Test (PET: 800m run), Final Combined Competitive Exam (200 marks), Personality Test (30 marks).",
                "application_process_guide": "Apply online at prb.wb.gov.in.",
                "official_notification_url": "https://prb.wb.gov.in/notices/WB_Police_2026_Advt.pdf",
                "official_website_url": "https://prb.wb.gov.in",
                "date_of_notification": "2026-03-07",
                "application_start_date": "2026-03-07",
                "application_closing_date": "2026-04-05",
                "tentative_exam_date": "2026-06-18",
                "min_age": 18,
                "max_age": 30,
                "age_relaxation_rules": "Standard relaxation: SC/ST (5 yrs), OBC (3 yrs), PwD (10 yrs), Ex-Servicemen as per government directives.",
                "educational_qualification": "SI: Bachelor's degree in any discipline. Constable: Madhyamik (10th) examination pass with fluency in Bengali.",
                "fee_details": {
                      "general": 270,
                      "obc": 270,
                      "ews": 270,
                      "sc": 20,
                      "st": 20,
                      "female": 270
                },
                "stages": [
                      {
                            "stage_name": "Preliminary Written Test (100 Qs - 200 Marks)",
                            "stage_order": 1,
                            "stage_type": "prelims",
                            "mode": "offline_omr",
                            "duration_minutes": 90,
                            "total_marks": 200,
                            "qualifying_marks": 80,
                            "status": "scheduled",
                            "start_date": "2026-06-18"
                      },
                      {
                            "stage_name": "PMT & Physical Efficiency Test (PET)",
                            "stage_order": 2,
                            "stage_type": "physical",
                            "mode": "hybrid",
                            "duration_minutes": 30,
                            "total_marks": 100,
                            "qualifying_marks": 40,
                            "status": "upcoming",
                            "start_date": "2026-06-18"
                      },
                      {
                            "stage_name": "Final Combined Competitive Examination (200 Marks)",
                            "stage_order": 3,
                            "stage_type": "mains",
                            "mode": "pen_paper",
                            "duration_minutes": 240,
                            "total_marks": 200,
                            "qualifying_marks": 80,
                            "status": "upcoming",
                            "start_date": "2026-06-18"
                      }
                ],
                "important_dates": [
                      {
                            "title": "Official Notification Release Date",
                            "event_date": "2026-03-07",
                            "date_type": "notification",
                            "is_tentative": false,
                            "display_order": 1
                      },
                      {
                            "title": "Online Application Commencement",
                            "event_date": "2026-03-07",
                            "date_type": "application_start",
                            "is_tentative": false,
                            "display_order": 2
                      },
                      {
                            "title": "Online Application Closing Deadline",
                            "event_date": "2026-04-05",
                            "date_type": "application_end",
                            "is_tentative": false,
                            "display_order": 3
                      },
                      {
                            "title": "Examination Commencement Date",
                            "event_date": "2026-06-18",
                            "date_type": "exam_start",
                            "is_tentative": false,
                            "display_order": 4
                      }
                ]
          }
    ]
  },

  // =========================================================================
  // 17. ODISHA EXAMINATIONS (OPSC / OSSSC / OSSC / ODISHA POLICE)
  // =========================================================================
  {
    key: "odisha_exams_feed",
    name: "Odisha Examination Feed (OPSC / OSSSC / OSSC / Odisha Police)",
    organizationSlug: "opsc",
    organizationName: "Odisha Public Service & Staff Selection Commissions",
    jurisdiction: "state",
    stateCode: "OD",
    baseUrl: "https://opsc.gov.in",
    examinationPath: "/exams",
    applyUrl: "https://opsc.gov.in",
    defaultCategory: "state-govt",
    canonicalExams: [
          {
                "title": "Odisha Civil Services Examination 2026 (OCS-2026) for Group A & Group B Posts",
                "short_title": "OPSC OCS 2026",
                "slug": "opsc-odisha-civil-services-examination-ocs-2026",
                "exam_code": "OPSC-OCS-2026",
                "mode": "offline_omr",
                "frequency": "annual",
                "category_slug": "state-govt",
                "description": "Odisha premier administrative recruitment examination for Odisha Administrative Service (OAS), Odisha Police Service (OPS), and Odisha Finance Service (OFS).",
                "syllabus_summary": "Prelims: Paper-I General Studies (200 marks) & Paper-II CSAT (200 marks qualifying 33%). Mains: Odia (250), English (250), Essay (250), GS-I to IV (250 each), Two Optional Papers (250 each) - 2000 Marks total.",
                "marking_scheme": "1/3rd (0.33) marks penalty per wrong answer in Prelims.",
                "pattern_description": "Prelims OMR Exam (400 marks), Mains Written Conventional Exam (2000 marks), and Personality Test (250 marks).",
                "application_process_guide": "Apply online at opsc.gov.in using OPSC candidate portal.",
                "official_notification_url": "https://opsc.gov.in/notices/OCS_2026_Advt.pdf",
                "official_website_url": "https://opsc.gov.in",
                "date_of_notification": "2026-01-01",
                "application_start_date": "2026-01-01",
                "application_closing_date": "2026-02-16",
                "tentative_exam_date": "2026-10-27",
                "min_age": 21,
                "max_age": 38,
                "age_relaxation_rules": "Standard relaxation: SC/ST (5 yrs), OBC (3 yrs), PwD (10 yrs), Ex-Servicemen as per government directives.",
                "educational_qualification": "Bachelor's Degree from recognized University and ability to read, write and speak Odia (passed Middle School exam with Odia language).",
                "fee_details": {
                      "general": 0,
                      "obc": 0,
                      "ews": 0,
                      "sc": 0,
                      "st": 0,
                      "female": 0
                },
                "stages": [
                      {
                            "stage_name": "Preliminary Examination (Paper I & II - 400 Marks)",
                            "stage_order": 1,
                            "stage_type": "prelims",
                            "mode": "offline_omr",
                            "duration_minutes": 240,
                            "total_marks": 400,
                            "qualifying_marks": 140,
                            "status": "scheduled",
                            "start_date": "2026-10-27"
                      },
                      {
                            "stage_name": "Main Written Examination (9 Descriptive Papers)",
                            "stage_order": 2,
                            "stage_type": "mains",
                            "mode": "pen_paper",
                            "duration_minutes": 1620,
                            "total_marks": 2000,
                            "qualifying_marks": 800,
                            "status": "upcoming",
                            "start_date": "2026-10-27"
                      },
                      {
                            "stage_name": "Personality Test / Interview",
                            "stage_order": 3,
                            "stage_type": "interview",
                            "mode": "hybrid",
                            "duration_minutes": 30,
                            "total_marks": 250,
                            "qualifying_marks": 40,
                            "status": "upcoming",
                            "start_date": "2026-10-27"
                      }
                ],
                "important_dates": [
                      {
                            "title": "Official Notification Release Date",
                            "event_date": "2026-01-01",
                            "date_type": "notification",
                            "is_tentative": false,
                            "display_order": 1
                      },
                      {
                            "title": "Online Application Commencement",
                            "event_date": "2026-01-01",
                            "date_type": "application_start",
                            "is_tentative": false,
                            "display_order": 2
                      },
                      {
                            "title": "Online Application Closing Deadline",
                            "event_date": "2026-02-16",
                            "date_type": "application_end",
                            "is_tentative": false,
                            "display_order": 3
                      },
                      {
                            "title": "Examination Commencement Date",
                            "event_date": "2026-10-27",
                            "date_type": "exam_start",
                            "is_tentative": false,
                            "display_order": 4
                      }
                ],
                "is_featured": true
          },
          {
                "title": "OSSSC Combined Recruitment Examination (CRE for RI, ARI, Amin, ICDS Supervisor) 2026",
                "short_title": "OSSSC CRE 2026",
                "slug": "osssc-combined-recruitment-examination-cre-2026",
                "exam_code": "OSSSC-CRE-2026",
                "mode": "online_cbt",
                "frequency": "annual",
                "category_slug": "state-govt",
                "description": "State recruitment for Revenue Inspectors (RI), Assistant Revenue Inspectors (ARI), Amin, and ICDS Supervisors across 30 revenue districts of Odisha.",
                "syllabus_summary": "Prelims: Mathematics (40 Qs), General Studies (40 Qs), English (40 Qs), Odia (20 Qs), Logical Reasoning (40 Qs) - 100 Marks. Mains: Mathematics, General Studies, English, Odia, Computer (180 Marks) + Practical Skill Test in Basic Computer Skills (50 Marks).",
                "marking_scheme": "1/3rd marks deducted per incorrect answer in CBT.",
                "pattern_description": "Preliminary Online CBT (100 marks), Main Online CBT (180 marks), and Practical Skill Test in Computer.",
                "application_process_guide": "Apply online at osssc.gov.in using OSSSC One Time Registration.",
                "official_notification_url": "https://osssc.gov.in/notices/CRE_2026_Advt.pdf",
                "official_website_url": "https://osssc.gov.in",
                "date_of_notification": "2026-02-15",
                "application_start_date": "2026-02-15",
                "application_closing_date": "2026-03-20",
                "tentative_exam_date": "2026-09-20",
                "min_age": 21,
                "max_age": 38,
                "age_relaxation_rules": "Standard relaxation: SC/ST (5 yrs), OBC (3 yrs), PwD (10 yrs), Ex-Servicemen as per government directives.",
                "educational_qualification": "Graduation in any discipline for RI/Supervisor; Higher Secondary (10+2) for ARI/Amin with Odia language proficiency.",
                "fee_details": {
                      "general": 0,
                      "obc": 0,
                      "ews": 0,
                      "sc": 0,
                      "st": 0,
                      "female": 0
                },
                "stages": [
                      {
                            "stage_name": "Preliminary Examination (100 Questions - 100 Marks)",
                            "stage_order": 1,
                            "stage_type": "prelims",
                            "mode": "online_cbt",
                            "duration_minutes": 90,
                            "total_marks": 100,
                            "qualifying_marks": 40,
                            "status": "scheduled",
                            "start_date": "2026-09-20"
                      },
                      {
                            "stage_name": "Main Examination & Computer Skill Test",
                            "stage_order": 2,
                            "stage_type": "mains",
                            "mode": "online_cbt",
                            "duration_minutes": 180,
                            "total_marks": 230,
                            "qualifying_marks": 90,
                            "status": "upcoming",
                            "start_date": "2026-09-20"
                      }
                ],
                "important_dates": [
                      {
                            "title": "Official Notification Release Date",
                            "event_date": "2026-02-15",
                            "date_type": "notification",
                            "is_tentative": false,
                            "display_order": 1
                      },
                      {
                            "title": "Online Application Commencement",
                            "event_date": "2026-02-15",
                            "date_type": "application_start",
                            "is_tentative": false,
                            "display_order": 2
                      },
                      {
                            "title": "Online Application Closing Deadline",
                            "event_date": "2026-03-20",
                            "date_type": "application_end",
                            "is_tentative": false,
                            "display_order": 3
                      },
                      {
                            "title": "Examination Commencement Date",
                            "event_date": "2026-09-20",
                            "date_type": "exam_start",
                            "is_tentative": false,
                            "display_order": 4
                      }
                ]
          }
    ]
  },

  // =========================================================================
  // 18. ASSAM EXAMINATIONS (APSC / SLPRB ASSAM / ADRE)
  // =========================================================================
  {
    key: "assam_exams_feed",
    name: "Assam Examination Feed (APSC / SLPRB Assam / ADRE)",
    organizationSlug: "apsc",
    organizationName: "Assam Public Service & Police Recruitment Boards",
    jurisdiction: "state",
    stateCode: "AS",
    baseUrl: "https://apsc.nic.in",
    examinationPath: "/exams",
    applyUrl: "https://apscrecruitment.in",
    defaultCategory: "state-govt",
    canonicalExams: [
          {
                "title": "APSC Combined Competitive Examination 2026 (APSC CCE) for Assam Civil Service & Police Service",
                "short_title": "APSC CCE 2026",
                "slug": "apsc-combined-competitive-examination-cce-2026",
                "exam_code": "APSC-CCE-2026",
                "mode": "offline_omr",
                "frequency": "annual",
                "category_slug": "state-govt",
                "description": "Assam's state premier competitive examination for Assam Civil Service (Junior Grade), Assam Police Service (APS), Superintendent of Taxes, and Block Development Officers.",
                "syllabus_summary": "Prelims: Paper-I General Studies-I (200 marks) & Paper-II General Studies-II (CSAT 200 marks qualifying 33%). Mains: 6 Papers (Essay, GS I-IV, Assam Specific GS-V - 1500 Marks total). Interview.",
                "marking_scheme": "0.25 marks penalty per wrong answer in Prelims.",
                "pattern_description": "Prelims OMR Exam (400 marks), Mains Written Conventional Exam (1500 marks), and Interview (180 marks).",
                "application_process_guide": "Apply online at apscrecruitment.in with Assam District Employment Exchange registration details.",
                "official_notification_url": "https://apsc.nic.in/notices/CCE_2026_Advt.pdf",
                "official_website_url": "https://apscrecruitment.in",
                "date_of_notification": "2026-01-12",
                "application_start_date": "2026-01-12",
                "application_closing_date": "2026-02-06",
                "tentative_exam_date": "2026-03-18",
                "min_age": 21,
                "max_age": 38,
                "age_relaxation_rules": "Standard relaxation: SC/ST (5 yrs), OBC (3 yrs), PwD (10 yrs), Ex-Servicemen as per government directives.",
                "educational_qualification": "Degree from any recognized University. Candidate must be registered in a District Employment Exchange in Assam.",
                "fee_details": {
                      "general": 297,
                      "obc": 197,
                      "ews": 197,
                      "sc": 197,
                      "st": 197,
                      "female": 47
                },
                "stages": [
                      {
                            "stage_name": "Preliminary Examination (GS-I & GS-II - 400 Marks)",
                            "stage_order": 1,
                            "stage_type": "prelims",
                            "mode": "offline_omr",
                            "duration_minutes": 240,
                            "total_marks": 400,
                            "qualifying_marks": 140,
                            "status": "scheduled",
                            "start_date": "2026-03-18"
                      },
                      {
                            "stage_name": "Main Written Examination (6 Descriptive Papers - 1500 Marks)",
                            "stage_order": 2,
                            "stage_type": "mains",
                            "mode": "pen_paper",
                            "duration_minutes": 1080,
                            "total_marks": 1500,
                            "qualifying_marks": 600,
                            "status": "upcoming",
                            "start_date": "2026-03-18"
                      },
                      {
                            "stage_name": "Interview / Personality Test",
                            "stage_order": 3,
                            "stage_type": "interview",
                            "mode": "hybrid",
                            "duration_minutes": 30,
                            "total_marks": 180,
                            "qualifying_marks": 40,
                            "status": "upcoming",
                            "start_date": "2026-03-18"
                      }
                ],
                "important_dates": [
                      {
                            "title": "Official Notification Release Date",
                            "event_date": "2026-01-12",
                            "date_type": "notification",
                            "is_tentative": false,
                            "display_order": 1
                      },
                      {
                            "title": "Online Application Commencement",
                            "event_date": "2026-01-12",
                            "date_type": "application_start",
                            "is_tentative": false,
                            "display_order": 2
                      },
                      {
                            "title": "Online Application Closing Deadline",
                            "event_date": "2026-02-06",
                            "date_type": "application_end",
                            "is_tentative": false,
                            "display_order": 3
                      },
                      {
                            "title": "Examination Commencement Date",
                            "event_date": "2026-03-18",
                            "date_type": "exam_start",
                            "is_tentative": false,
                            "display_order": 4
                      }
                ],
                "is_featured": true
          },
          {
                "title": "Assam Police State Level Police Recruitment Board (SLPRB) Constable & SI Examination 2026",
                "short_title": "Assam Police SLPRB 2026",
                "slug": "assam-police-slprb-constable-sub-inspector-2026",
                "exam_code": "SLPRB-POLICE-2026",
                "mode": "offline_omr",
                "frequency": "annual",
                "category_slug": "state-police",
                "description": "Direct recruitment for Unarmed / Armed Branch Constables, Sub-Inspectors, Commando Battalions, and Forest Guards in Assam Police.",
                "syllabus_summary": "Logical Reasoning, Aptitude, History & Culture of Assam and India, General Awareness / General Knowledge (100 Qs - 50/100 Marks).",
                "marking_scheme": "0.50 negative marks for SI examination. No negative marking for Constable test.",
                "pattern_description": "Physical Standard Test (PST) & Physical Efficiency Test (PET: 3.2km run for male, 1.6km for female) followed by Written Examination.",
                "application_process_guide": "Apply online at slprbassam.in with Assamese language certificate and employment exchange card.",
                "official_notification_url": "https://slprbassam.in/notices/Assam_Police_2026_Advt.pdf",
                "official_website_url": "https://slprbassam.in",
                "date_of_notification": "2026-03-01",
                "application_start_date": "2026-03-01",
                "application_closing_date": "2026-03-25",
                "tentative_exam_date": "2026-06-20",
                "min_age": 18,
                "max_age": 25,
                "age_relaxation_rules": "Standard relaxation: SC/ST (5 yrs), OBC (3 yrs), PwD (10 yrs), Ex-Servicemen as per government directives.",
                "educational_qualification": "H.S.L.C (10th) / HSSLC (12th) for Constable or Graduation for Sub-Inspector.",
                "fee_details": {
                      "general": 0,
                      "obc": 0,
                      "ews": 0,
                      "sc": 0,
                      "st": 0,
                      "female": 0
                },
                "stages": [
                      {
                            "stage_name": "Physical Standards (PST) & Physical Efficiency Test (PET)",
                            "stage_order": 1,
                            "stage_type": "physical",
                            "mode": "hybrid",
                            "duration_minutes": 60,
                            "total_marks": 40,
                            "qualifying_marks": 20,
                            "status": "scheduled",
                            "start_date": "2026-06-20"
                      },
                      {
                            "stage_name": "Written Examination (100 Questions)",
                            "stage_order": 2,
                            "stage_type": "prelims",
                            "mode": "offline_omr",
                            "duration_minutes": 120,
                            "total_marks": 100,
                            "qualifying_marks": 40,
                            "status": "upcoming",
                            "start_date": "2026-06-20"
                      }
                ],
                "important_dates": [
                      {
                            "title": "Official Notification Release Date",
                            "event_date": "2026-03-01",
                            "date_type": "notification",
                            "is_tentative": false,
                            "display_order": 1
                      },
                      {
                            "title": "Online Application Commencement",
                            "event_date": "2026-03-01",
                            "date_type": "application_start",
                            "is_tentative": false,
                            "display_order": 2
                      },
                      {
                            "title": "Online Application Closing Deadline",
                            "event_date": "2026-03-25",
                            "date_type": "application_end",
                            "is_tentative": false,
                            "display_order": 3
                      },
                      {
                            "title": "Examination Commencement Date",
                            "event_date": "2026-06-20",
                            "date_type": "exam_start",
                            "is_tentative": false,
                            "display_order": 4
                      }
                ]
          }
    ]
  },

  // =========================================================================
  // 19. PUNJAB EXAMINATIONS (PPSC / PSSSB / PUNJAB POLICE)
  // =========================================================================
  {
    key: "punjab_exams_feed",
    name: "Punjab Examination Feed (PPSC / PSSSB / Punjab Police)",
    organizationSlug: "ppsc",
    organizationName: "Punjab Public Service & Subordinate Selection Boards",
    jurisdiction: "state",
    stateCode: "PB",
    baseUrl: "https://ppsc.gov.in",
    examinationPath: "/exams",
    applyUrl: "https://ppsc.gov.in",
    defaultCategory: "state-govt",
    canonicalExams: [
          {
                "title": "PPSC Punjab State Civil Services Combined Competitive Examination (PSCSCCE) 2026",
                "short_title": "PPSC Civil Services 2026",
                "slug": "ppsc-punjab-state-civil-services-psc-scce-2026",
                "exam_code": "PPSC-CCE-2026",
                "mode": "offline_omr",
                "frequency": "annual",
                "category_slug": "state-govt",
                "description": "Punjab's premier administrative examination for Punjab Civil Service (Executive Branch), DSP, Excise & Taxation Officer, Tehsildar, and Block Development & Panchayat Officers.",
                "syllabus_summary": "Prelims: Paper-I General Studies (100 Qs - 200 marks) & Paper-II Civil Services Aptitude Test CSAT (80 Qs - 200 marks). Mains: Punjabi (100), English (100), Essay (150), GS-I History/Geo (250), GS-II Polity/Governance (250), GS-III Economy/Stats (250), GS-IV Science/Security (250) - 1350 Marks total.",
                "marking_scheme": "No negative marking in PPSC Preliminary Examination.",
                "pattern_description": "Prelims OMR Exam (400 marks), Mains Written Descriptive Exam (1350 marks), and Interview (150 marks).",
                "application_process_guide": "Apply online at ppsc.gov.in with Punjabi language matriculation credentials.",
                "official_notification_url": "https://ppsc.gov.in/notices/PSCSCCE_2026_Advt.pdf",
                "official_website_url": "https://ppsc.gov.in",
                "date_of_notification": "2026-04-10",
                "application_start_date": "2026-04-10",
                "application_closing_date": "2026-05-10",
                "tentative_exam_date": "2026-08-08",
                "min_age": 21,
                "max_age": 37,
                "age_relaxation_rules": "Standard relaxation: SC/ST (5 yrs), OBC (3 yrs), PwD (10 yrs), Ex-Servicemen as per government directives.",
                "educational_qualification": "Bachelor's degree in any discipline. Passed Matriculation examination with Punjabi as one of the compulsory or elective subjects.",
                "fee_details": {
                      "general": 1500,
                      "obc": 750,
                      "ews": 500,
                      "sc": 750,
                      "st": 750,
                      "female": 1500
                },
                "stages": [
                      {
                            "stage_name": "Preliminary Examination (GS & CSAT - 400 Marks)",
                            "stage_order": 1,
                            "stage_type": "prelims",
                            "mode": "offline_omr",
                            "duration_minutes": 240,
                            "total_marks": 400,
                            "qualifying_marks": 150,
                            "status": "scheduled",
                            "start_date": "2026-08-08"
                      },
                      {
                            "stage_name": "Main Written Examination (7 Descriptive Papers - 1350 Marks)",
                            "stage_order": 2,
                            "stage_type": "mains",
                            "mode": "pen_paper",
                            "duration_minutes": 1260,
                            "total_marks": 1350,
                            "qualifying_marks": 540,
                            "status": "upcoming",
                            "start_date": "2026-08-08"
                      },
                      {
                            "stage_name": "Interview / Personality Evaluation",
                            "stage_order": 3,
                            "stage_type": "interview",
                            "mode": "hybrid",
                            "duration_minutes": 30,
                            "total_marks": 150,
                            "qualifying_marks": 40,
                            "status": "upcoming",
                            "start_date": "2026-08-08"
                      }
                ],
                "important_dates": [
                      {
                            "title": "Official Notification Release Date",
                            "event_date": "2026-04-10",
                            "date_type": "notification",
                            "is_tentative": false,
                            "display_order": 1
                      },
                      {
                            "title": "Online Application Commencement",
                            "event_date": "2026-04-10",
                            "date_type": "application_start",
                            "is_tentative": false,
                            "display_order": 2
                      },
                      {
                            "title": "Online Application Closing Deadline",
                            "event_date": "2026-05-10",
                            "date_type": "application_end",
                            "is_tentative": false,
                            "display_order": 3
                      },
                      {
                            "title": "Examination Commencement Date",
                            "event_date": "2026-08-08",
                            "date_type": "exam_start",
                            "is_tentative": false,
                            "display_order": 4
                      }
                ]
          },
          {
                "title": "PSSSB Patwari, Senior Assistant, and Clerical Cadre Combined Examination 2026",
                "short_title": "PSSSB Patwari & Clerk 2026",
                "slug": "psssb-patwari-clerk-senior-assistant-2026",
                "exam_code": "PSSSB-PATWARI-2026",
                "mode": "offline_omr",
                "frequency": "annual",
                "category_slug": "state-govt",
                "description": "State recruitment for Revenue Patwaris, Senior Assistants, and Clerks across Punjab government revenue departments and district boards.",
                "syllabus_summary": "Part-A: Mandatory Punjabi Language Qualifying Paper (50 MCQs - 50 Marks, 50% qualifying). Part-B: General Knowledge, Reasoning, Quantitative Ability, English, Punjabi, Computers, Punjab History & Culture (100 MCQs - 100 Marks).",
                "marking_scheme": "0.25 marks penalty per wrong answer in Part-B.",
                "pattern_description": "Single Stage OMR Based Written Examination (Part A + Part B) followed by Punjabi Typing Test (30 wpm) for Clerk posts.",
                "application_process_guide": "Apply online at sssb.punjab.gov.in.",
                "official_notification_url": "https://sssb.punjab.gov.in/notices/Patwari_2026_Advt.pdf",
                "official_website_url": "https://sssb.punjab.gov.in",
                "date_of_notification": "2026-03-20",
                "application_start_date": "2026-03-20",
                "application_closing_date": "2026-04-18",
                "tentative_exam_date": "2026-06-15",
                "min_age": 18,
                "max_age": 37,
                "age_relaxation_rules": "Standard relaxation: SC/ST (5 yrs), OBC (3 yrs), PwD (10 yrs), Ex-Servicemen as per government directives.",
                "educational_qualification": "Graduation in any discipline + 120 Hours ISO Certified Computer Course certificate.",
                "fee_details": {
                      "general": 1000,
                      "obc": 250,
                      "ews": 250,
                      "sc": 250,
                      "st": 250,
                      "female": 250
                },
                "stages": [
                      {
                            "stage_name": "Written Examination (Part A Punjabi Qualifying + Part B Merit)",
                            "stage_order": 1,
                            "stage_type": "prelims",
                            "mode": "offline_omr",
                            "duration_minutes": 150,
                            "total_marks": 150,
                            "qualifying_marks": 65,
                            "status": "scheduled",
                            "start_date": "2026-06-15"
                      },
                      {
                            "stage_name": "Punjabi & English Typing Test (30 WPM)",
                            "stage_order": 2,
                            "stage_type": "skill",
                            "mode": "hybrid",
                            "duration_minutes": 20,
                            "total_marks": 100,
                            "qualifying_marks": 40,
                            "status": "upcoming",
                            "start_date": "2026-06-15"
                      }
                ],
                "important_dates": [
                      {
                            "title": "Official Notification Release Date",
                            "event_date": "2026-03-20",
                            "date_type": "notification",
                            "is_tentative": false,
                            "display_order": 1
                      },
                      {
                            "title": "Online Application Commencement",
                            "event_date": "2026-03-20",
                            "date_type": "application_start",
                            "is_tentative": false,
                            "display_order": 2
                      },
                      {
                            "title": "Online Application Closing Deadline",
                            "event_date": "2026-04-18",
                            "date_type": "application_end",
                            "is_tentative": false,
                            "display_order": 3
                      },
                      {
                            "title": "Examination Commencement Date",
                            "event_date": "2026-06-15",
                            "date_type": "exam_start",
                            "is_tentative": false,
                            "display_order": 4
                      }
                ]
          },
          {
                "title": "Punjab Police Sub-Inspector (SI) & Constable Direct Recruitment Examination 2026",
                "short_title": "Punjab Police SI & Constable 2026",
                "slug": "punjab-police-sub-inspector-constable-2026",
                "exam_code": "PB-POLICE-2026",
                "mode": "online_cbt",
                "frequency": "annual",
                "category_slug": "state-police",
                "description": "Recruitment examination for Sub-Inspectors and Constables in District Police and Armed Police Cadres of Punjab Police.",
                "syllabus_summary": "Paper-1: General Awareness, Quantitative Aptitude & Numerical Skills, Punjabi Language (100 Qs - 400 Marks). Paper-2: Logical & Analytical Reasoning, English Language, Digital Literacy & Computer (100 Qs - 400 Marks). Paper-3: Mandatory Punjabi Qualifying Test (50 Qs - 50 Marks).",
                "marking_scheme": "No negative marking in Punjab Police Computer Based Test.",
                "pattern_description": "Computer Based Test (CBT - 3 Papers), Physical Screening Test (PST: 1600m run, long jump, high jump), Physical Measurement Test (PMT), and Document Verification.",
                "application_process_guide": "Apply online at punjabpolice.gov.in using recruitment portal registration.",
                "official_notification_url": "https://punjabpolice.gov.in/notices/Punjab_Police_2026_Advt.pdf",
                "official_website_url": "https://punjabpolice.gov.in",
                "date_of_notification": "2026-02-28",
                "application_start_date": "2026-02-28",
                "application_closing_date": "2026-03-24",
                "tentative_exam_date": "2026-07-01",
                "min_age": 18,
                "max_age": 28,
                "age_relaxation_rules": "Standard relaxation: SC/ST (5 yrs), OBC (3 yrs), PwD (10 yrs), Ex-Servicemen as per government directives.",
                "educational_qualification": "Constable: 10+2 (Senior Secondary). SI: Graduation in any discipline with Punjabi passed at Matric level.",
                "fee_details": {
                      "general": 1100,
                      "obc": 600,
                      "ews": 600,
                      "sc": 600,
                      "st": 600,
                      "female": 1100
                },
                "stages": [
                      {
                            "stage_name": "Computer Based Test (Paper 1, 2, and 3)",
                            "stage_order": 1,
                            "stage_type": "prelims",
                            "mode": "online_cbt",
                            "duration_minutes": 300,
                            "total_marks": 850,
                            "qualifying_marks": 350,
                            "status": "scheduled",
                            "start_date": "2026-07-01"
                      },
                      {
                            "stage_name": "Physical Screening Test (PST) & PMT",
                            "stage_order": 2,
                            "stage_type": "physical",
                            "mode": "hybrid",
                            "duration_minutes": 60,
                            "total_marks": 100,
                            "qualifying_marks": 40,
                            "status": "upcoming",
                            "start_date": "2026-07-01"
                      }
                ],
                "important_dates": [
                      {
                            "title": "Official Notification Release Date",
                            "event_date": "2026-02-28",
                            "date_type": "notification",
                            "is_tentative": false,
                            "display_order": 1
                      },
                      {
                            "title": "Online Application Commencement",
                            "event_date": "2026-02-28",
                            "date_type": "application_start",
                            "is_tentative": false,
                            "display_order": 2
                      },
                      {
                            "title": "Online Application Closing Deadline",
                            "event_date": "2026-03-24",
                            "date_type": "application_end",
                            "is_tentative": false,
                            "display_order": 3
                      },
                      {
                            "title": "Examination Commencement Date",
                            "event_date": "2026-07-01",
                            "date_type": "exam_start",
                            "is_tentative": false,
                            "display_order": 4
                      }
                ]
          }
    ]
  },
];
