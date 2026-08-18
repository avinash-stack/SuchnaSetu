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
        official_notification_url: "https://upsc.gov.in/examinations/Engineering%20Services%20%28Preliminary%29%20Examination%2C%202026",
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
        official_notification_url: "https://upsc.gov.in/examinations/CDS%20II%202026",
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
        official_notification_url: "https://upsc.gov.in/examinations/NDA%20II%202026",
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
        official_notification_url: "https://upsc.gov.in/examinations/CMS%202026",
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
        official_notification_url: "https://upsc.gov.in/examinations/CAPF%202026",
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
        official_notification_url: "https://upsc.gov.in/examinations/IFS%202026",
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
        official_notification_url: "https://upsc.gov.in/recruitment/special-recruitment-advertisements",
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
  }
];
