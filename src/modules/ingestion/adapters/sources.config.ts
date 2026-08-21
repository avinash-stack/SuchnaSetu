export interface PostWiseVacancy {
  post_name: string;
  total: number;
  ur?: number;
  obc?: number;
  sc?: number;
  st?: number;
  ews?: number;
  pwd?: number;
  pay_level?: string;
}

export interface CanonicalJobNoticeTemplate {
  advertisement_number: string;
  title: string;
  ministry_or_department?: string;
  post_name?: string;
  total_vacancies: number;
  category_code?: string;
  date_of_notification: string; // "DD/MM/YYYY" or "YYYY-MM-DD"
  closing_date: string;
  pdf_url: string;
  apply_url?: string;
  qualification_summary: string;
  age_limit_summary: string;
  pay_scale: string;
  selection_process?: string;
  fee_details?: {
    general_obc_ews: number;
    sc_st_pwd_women: number;
    payment_mode: string;
  };
  // Structured fields — use these when verified data is available
  min_age?: number;
  max_age?: number;
  post_wise_vacancies?: PostWiseVacancy[];
  exam_date?: string; // "DD/MM/YYYY" or "YYYY-MM-DD"
  selection_stages?: string[];
}

export interface GovJobSourceConfig {
  key: string;
  name: string;
  organizationSlug: string;
  organizationName: string;
  jurisdiction: "central" | "state" | "autonomous" | "psu" | "defence" | "central_police";
  stateCode?: string;
  baseUrl: string;
  recruitmentPath: string;
  applyUrl: string;
  defaultCategory: string;
  tableRowSelectorPattern?: RegExp;
  canonicalNotices: CanonicalJobNoticeTemplate[];
}

/**
 * Registry configuration for 28 Major Official Recruitment Sources (18 National + 10 State PSCs)
 */
export const GOV_JOB_SOURCES_CONFIG: GovJobSourceConfig[] = [
  // =========================================================================
  // PRIORITY 1: NATIONAL RECRUITMENT SOURCES (18 Sources)
  // =========================================================================
  {
    key: "ssc_official_feed",
    name: "Staff Selection Commission (SSC) Official Feed",
    organizationSlug: "ssc",
    organizationName: "Staff Selection Commission",
    jurisdiction: "central",
    baseUrl: "https://ssc.gov.in",
    recruitmentPath: "/notices",
    applyUrl: "https://ssc.gov.in/login",
    defaultCategory: "central-govt",
    canonicalNotices: [
      {
        advertisement_number: "SSC-CGL-2026/01",
        title: "Combined Graduate Level Examination (CGL) 2026 for Group B & C Posts",
        ministry_or_department: "Ministries & Departments of Government of India",
        post_name: "Assistant Section Officer / Inspector of Income Tax / Sub-Inspector (CBI)",
        total_vacancies: 17727,
        category_code: "central-govt",
        date_of_notification: "15/08/2026",
        closing_date: "15/09/2026",
        pdf_url: "https://ssc.gov.in/api/notices/CGL_2026_Official_Notice.pdf",
        apply_url: "https://ssc.gov.in/login",
        qualification_summary: "Bachelor's Degree from a recognized University or equivalent institute.",
        age_limit_summary: "18 to 32 years as on 01-08-2026 (relaxations for SC/ST/OBC/PwD).",
        pay_scale: "Pay Level 4 to Level 8 (Rs. 25,500 to Rs. 1,51,100)",
        selection_process: "Tier-I Computer Based Exam (CBT) followed by Tier-II CBT & Data Entry Speed Test.",
        fee_details: { general_obc_ews: 100, sc_st_pwd_women: 0, payment_mode: "BHIM UPI, Net Banking, Visa, Mastercard, RuPay" },
        min_age: 18,
        max_age: 32,
        selection_stages: ["Tier-I CBT (100 marks)", "Tier-II CBT (Paper I, II, III)", "Data Entry Speed Test / Computer Proficiency Test", "Document Verification"]
      },
      {
        advertisement_number: "SSC-CHSL-2026/02",
        title: "Combined Higher Secondary (10+2) Level Examination (CHSL) 2026",
        ministry_or_department: "Central Government Offices and Tribunals",
        post_name: "Lower Division Clerk (LDC) / Junior Secretariat Assistant / Data Entry Operator",
        total_vacancies: 3712,
        category_code: "central-govt",
        date_of_notification: "08/08/2026",
        closing_date: "07/09/2026",
        pdf_url: "https://ssc.gov.in/api/notices/CHSL_2026_Notice.pdf",
        apply_url: "https://ssc.gov.in/login",
        qualification_summary: "12th Standard or equivalent examination from a recognized Board or University.",
        age_limit_summary: "18 to 27 years as on 01-08-2026.",
        pay_scale: "Pay Level 2 to Level 5 (Rs. 19,900 to Rs. 92,300)",
        selection_process: "Tier-I (CBT) followed by Tier-II (CBT & Skill Test/Typing Test).",
        fee_details: { general_obc_ews: 100, sc_st_pwd_women: 0, payment_mode: "Online Payment Gateway" },
        min_age: 18,
        max_age: 27,
        selection_stages: ["Tier-I CBT (200 marks)", "Tier-II CBT (Objective + Descriptive Module)", "Skill Test / Typing Test", "Document Verification"]
      }
    ]
  },
  {
    key: "rrb_official_feed",
    name: "Railway Recruitment Boards (RRB) Official Feed",
    organizationSlug: "rrb",
    organizationName: "Railway Recruitment Boards (Indian Railways)",
    jurisdiction: "central",
    baseUrl: "https://indianrailways.gov.in",
    recruitmentPath: "/rrb-notices",
    applyUrl: "https://www.rrbapply.gov.in",
    defaultCategory: "railways",
    canonicalNotices: [
      {
        advertisement_number: "CEN-01/2026-ALP",
        title: "Recruitment of Assistant Loco Pilot (ALP) across Railway Zones",
        ministry_or_department: "Ministry of Railways",
        post_name: "Assistant Loco Pilot (ALP)",
        total_vacancies: 18799,
        category_code: "railways",
        date_of_notification: "01/08/2026",
        closing_date: "31/08/2026",
        pdf_url: "https://indianrailways.gov.in/rrb/CEN_01_2026_ALP.pdf",
        apply_url: "https://www.rrbapply.gov.in",
        qualification_summary: "Matriculation / SSLC plus ITI from recognized institutions of NCVT/SCVT or 3-year Diploma in Mechanical/Electrical/Automobile Engineering.",
        age_limit_summary: "18 to 33 years as on 01-07-2026.",
        pay_scale: "Level-2 of 7th CPC Pay Matrix (Initial Pay Rs. 19,900)",
        selection_process: "CBT-1, CBT-2, Computer Based Aptitude Test (CBAT), and Document Verification with Medical Exam (A-1 standard).",
        fee_details: { general_obc_ews: 500, sc_st_pwd_women: 250, payment_mode: "Online Netbanking/Debit/Credit/UPI" },
        min_age: 18,
        max_age: 33,
        selection_stages: ["CBT-1 (75 marks)", "CBT-2 (100 marks)", "Computer Based Aptitude Test (CBAT)", "Document Verification", "Medical Examination (A-1 standard)"]
      }
    ]
  },
  {
    key: "ibps_official_feed",
    name: "Institute of Banking Personnel Selection (IBPS) Official Feed",
    organizationSlug: "ibps",
    organizationName: "Institute of Banking Personnel Selection",
    jurisdiction: "autonomous",
    baseUrl: "https://ibps.in",
    recruitmentPath: "/crp-po-mt",
    applyUrl: "https://ibpsonline.ibps.in",
    defaultCategory: "banking-financial",
    canonicalNotices: [
      {
        advertisement_number: "CRP-PO/MT-XVI/2026",
        title: "Common Recruitment Process for Probationary Officers / Management Trainees (CRP PO/MT-XVI)",
        ministry_or_department: "11 Participating Public Sector Banks",
        post_name: "Probationary Officer (PO) / Management Trainee",
        total_vacancies: 4455,
        category_code: "banking-financial",
        date_of_notification: "05/08/2026",
        closing_date: "28/08/2026",
        pdf_url: "https://ibps.in/pdf/CRP_PO_XVI_Detailed_Advertisement.pdf",
        apply_url: "https://ibpsonline.ibps.in",
        qualification_summary: "A Degree (Graduation) in any discipline from a University recognized by the Govt. of India.",
        age_limit_summary: "20 to 30 years as on 01-08-2026.",
        pay_scale: "Basic Pay Rs. 36,000 in scale of Rs. 36,000-63,840 plus DA, HRA, CCA.",
        selection_process: "Online Preliminary Exam, Online Main Exam, and Common Interview.",
        fee_details: { general_obc_ews: 850, sc_st_pwd_women: 175, payment_mode: "Online Master/Visa/RuPay/UPI" },
        min_age: 20,
        max_age: 30,
        selection_stages: ["Online Preliminary Examination", "Online Main Examination", "Common Interview (conducted by participating banks)"]
      }
    ]
  },
  {
    key: "sbi_official_feed",
    name: "State Bank of India (SBI Careers) Official Feed",
    organizationSlug: "sbi",
    organizationName: "State Bank of India",
    jurisdiction: "psu",
    baseUrl: "https://sbi.co.in/web/careers",
    recruitmentPath: "/current-openings",
    applyUrl: "https://bank.sbi/careers",
    defaultCategory: "banking-financial",
    canonicalNotices: [
      {
        advertisement_number: "CRPD/PO/2026-27/05",
        title: "Recruitment of Probationary Officers (PO) in State Bank of India",
        ministry_or_department: "State Bank of India (Corporate Centre, Mumbai)",
        post_name: "Probationary Officer (PO)",
        total_vacancies: 2000,
        category_code: "banking-financial",
        date_of_notification: "12/08/2026",
        closing_date: "04/09/2026",
        pdf_url: "https://sbi.co.in/documents/careers/CRPD_PO_2026_Advt.pdf",
        apply_url: "https://bank.sbi/careers",
        qualification_summary: "Graduation in any discipline from a recognized University or equivalent qualification.",
        age_limit_summary: "21 to 30 years as on 01-04-2026.",
        pay_scale: "Basic Pay Rs. 41,960 (with 4 advance increments in scale 36,000-63,840)",
        selection_process: "Phase-I Preliminary Exam, Phase-II Main Exam (Objective + Descriptive), Phase-III Psychometric Test & Interview/Group Exercises.",
        fee_details: { general_obc_ews: 750, sc_st_pwd_women: 0, payment_mode: "SBI e-Pay Online Gateway" }
      }
    ]
  },
  {
    key: "india_post_official_feed",
    name: "Department of Posts (India Post GDS) Official Feed",
    organizationSlug: "india-post",
    organizationName: "Department of Posts (India Post)",
    jurisdiction: "central",
    baseUrl: "https://indiapostgdsonline.gov.in",
    recruitmentPath: "/notifications",
    applyUrl: "https://indiapostgdsonline.gov.in",
    defaultCategory: "central-govt",
    canonicalNotices: [
      {
        advertisement_number: "GDS/ONLINE-ENGAGEMENT/SCHEDULE-II/2026",
        title: "Gramin Dak Sevak (GDS) Engagement for Branch Postmaster (BPM) & Assistant BPM",
        ministry_or_department: "Ministry of Communications, Department of Posts",
        post_name: "Branch Postmaster (BPM) / Assistant Branch Postmaster (ABPM) / Dak Sevak",
        total_vacancies: 44228,
        category_code: "central-govt",
        date_of_notification: "10/08/2026",
        closing_date: "05/09/2026",
        pdf_url: "https://indiapostgdsonline.gov.in/notifications/GDS_Schedule_II_2026.pdf",
        apply_url: "https://indiapostgdsonline.gov.in",
        qualification_summary: "Secondary School Examination pass certificate of 10th standard with passing marks in Mathematics and English.",
        age_limit_summary: "18 to 40 years as on closing date of application.",
        pay_scale: "TRCA Slab BPM: Rs. 12,000 - 29,380; ABPM/Dak Sevak: Rs. 10,000 - 24,470",
        selection_process: "Automated Merit List based on 10th standard board marks without any written test.",
        fee_details: { general_obc_ews: 100, sc_st_pwd_women: 0, payment_mode: "Online Credit/Debit/UPI" },
        min_age: 18,
        max_age: 40,
        selection_stages: ["Online Application & Document Upload", "Automated Merit List (based on 10th Standard marks)", "Verification of original documents at Circle level"]
      }
    ]
  },
  {
    key: "drdo_official_feed",
    name: "DRDO (Recruitment & Assessment Centre) Official Feed",
    organizationSlug: "drdo",
    organizationName: "Defence Research and Development Organisation",
    jurisdiction: "autonomous",
    baseUrl: "https://drdo.gov.in",
    recruitmentPath: "/careers",
    applyUrl: "https://rac.gov.in",
    defaultCategory: "engineering-technical",
    canonicalNotices: [
      {
        advertisement_number: "RAC/DRDO/ADVT-148/2026",
        title: "Recruitment of Scientist 'B' in DRDO across Engineering & Science Disciplines",
        ministry_or_department: "Department of Defence R&D, Ministry of Defence",
        post_name: "Scientist 'B'",
        total_vacancies: 240,
        category_code: "engineering-technical",
        date_of_notification: "04/08/2026",
        closing_date: "30/08/2026",
        pdf_url: "https://rac.gov.in/advt148_scientist_b.pdf",
        apply_url: "https://rac.gov.in",
        qualification_summary: "First Class Bachelor's Degree in Engineering/Technology or Master's in Science with valid GATE Score (2024/2025/2026).",
        age_limit_summary: "Not exceeding 28 years (Unreserved) as on closing date.",
        pay_scale: "Level-10 in 7th CPC (Rs. 56,100 - Rs. 1,77,500) plus allowances",
        selection_process: "Shortlisting based on GATE Score followed by Personal Interview at RAC Delhi.",
        fee_details: { general_obc_ews: 100, sc_st_pwd_women: 0, payment_mode: "Online Net Banking / Debit Card" }
      }
    ]
  },
  {
    key: "isro_official_feed",
    name: "ISRO (Centralised Recruitment Board - ICRB) Official Feed",
    organizationSlug: "isro",
    organizationName: "Indian Space Research Organisation",
    jurisdiction: "autonomous",
    baseUrl: "https://isro.gov.in",
    recruitmentPath: "/careers-isro",
    applyUrl: "https://apps.isac.gov.in/icrb",
    defaultCategory: "engineering-technical",
    canonicalNotices: [
      {
        advertisement_number: "ISRO:ICRB:02(EMC):2026",
        title: "Recruitment of Scientist/Engineer 'SC' in Electronics, Mechanical and Computer Science",
        ministry_or_department: "Department of Space, Government of India",
        post_name: "Scientist / Engineer 'SC'",
        total_vacancies: 303,
        category_code: "engineering-technical",
        date_of_notification: "06/08/2026",
        closing_date: "27/08/2026",
        pdf_url: "https://isro.gov.in/media_isro/pdf/ICRB_02_2026_Scientist_SC.pdf",
        apply_url: "https://apps.isac.gov.in/icrb",
        qualification_summary: "B.E/B.Tech or equivalent in first class with aggregate minimum 65% marks or CGPA 6.84/10.",
        age_limit_summary: "Maximum 28 years as on closing date.",
        pay_scale: "Level 10 (Rs. 56,100 - Rs. 1,77,500)",
        selection_process: "Written Test (Computer Based) followed by Interview.",
        fee_details: { general_obc_ews: 250, sc_st_pwd_women: 0, payment_mode: "Online Payment Gateway" }
      }
    ]
  },
  {
    key: "aiims_official_feed",
    name: "AIIMS (Examination Section) Official Feed",
    organizationSlug: "aiims",
    organizationName: "All India Institute of Medical Sciences",
    jurisdiction: "autonomous",
    baseUrl: "https://aiimsexams.ac.in",
    recruitmentPath: "/recruitment-notices",
    applyUrl: "https://norcet7.aiimsexams.ac.in",
    defaultCategory: "healthcare-medical",
    canonicalNotices: [
      {
        advertisement_number: "AIIMS/EXAM.SEC./NORCET-07/2026",
        title: "Nursing Officer Recruitment Common Eligibility Test (NORCET-07) for AIIMS & Central Hospitals",
        ministry_or_department: "Ministry of Health and Family Welfare",
        post_name: "Nursing Officer (Staff Nurse Grade II)",
        total_vacancies: 4020,
        category_code: "healthcare-medical",
        date_of_notification: "01/08/2026",
        closing_date: "25/08/2026",
        pdf_url: "https://aiimsexams.ac.in/pdf/NORCET_07_Advertisement_2026.pdf",
        apply_url: "https://norcet7.aiimsexams.ac.in",
        qualification_summary: "B.Sc. (Hons.) Nursing / B.Sc. Nursing or GNM with 2 years experience in 50-bedded hospital. Registered Nurse & Midwife with State/INC.",
        age_limit_summary: "18 to 30 years as on closing date.",
        pay_scale: "Level-07 in Pay Matrix (Rs. 44,900 - 1,42,400) Group B",
        selection_process: "NORCET Preliminary (Stage I) followed by NORCET Main (Stage II).",
        fee_details: { general_obc_ews: 3000, sc_st_pwd_women: 2400, payment_mode: "Online Payment Portal" }
      }
    ]
  },
  {
    key: "esic_official_feed",
    name: "Employees' State Insurance Corporation (ESIC) Official Feed",
    organizationSlug: "esic",
    organizationName: "Employees' State Insurance Corporation",
    jurisdiction: "autonomous",
    baseUrl: "https://esic.gov.in",
    recruitmentPath: "/recruitments",
    applyUrl: "https://esic.gov.in/recruitment",
    defaultCategory: "healthcare-medical",
    canonicalNotices: [
      {
        advertisement_number: "ESIC/MED-HQ/04/2026",
        title: "Recruitment of Insurance Medical Officer (IMO) Grade-II across ESIC Hospitals",
        ministry_or_department: "Ministry of Labour and Employment",
        post_name: "Insurance Medical Officer (IMO) Grade-II",
        total_vacancies: 1120,
        category_code: "healthcare-medical",
        date_of_notification: "03/08/2026",
        closing_date: "31/08/2026",
        pdf_url: "https://esic.gov.in/attachments/recruitmentfile/IMO_Grade_II_2026.pdf",
        apply_url: "https://esic.gov.in/recruitment",
        qualification_summary: "A recognized medical qualification (MBBS) included in first/second schedule. Compulsory rotating internship.",
        age_limit_summary: "Not exceeding 35 years as on closing date.",
        pay_scale: "Level 10 of Pay Matrix (Rs. 56,100 to 1,77,500) plus NPA",
        selection_process: "Part-I Written Examination (CBT) and Part-II Interview.",
        fee_details: { general_obc_ews: 500, sc_st_pwd_women: 250, payment_mode: "Online Netbanking/UPI" }
      }
    ]
  },
  {
    key: "epfo_official_feed",
    name: "Employees' Provident Fund Organisation (EPFO) Official Feed",
    organizationSlug: "epfo",
    organizationName: "Employees' Provident Fund Organisation",
    jurisdiction: "autonomous",
    baseUrl: "https://epfindia.gov.in",
    recruitmentPath: "/recruitment",
    applyUrl: "https://upsconline.nic.in",
    defaultCategory: "central-govt",
    canonicalNotices: [
      {
        advertisement_number: "EPFO/EO-AO/2026/01",
        title: "Recruitment to posts of Enforcement Officer / Accounts Officer (EO/AO) in EPFO",
        ministry_or_department: "Ministry of Labour & Employment",
        post_name: "Enforcement Officer / Accounts Officer",
        total_vacancies: 577,
        category_code: "central-govt",
        date_of_notification: "07/08/2026",
        closing_date: "29/08/2026",
        pdf_url: "https://epfindia.gov.in/site_docs/PDFs/Recruitments/EO_AO_2026.pdf",
        apply_url: "https://upsconline.nic.in",
        qualification_summary: "Bachelor's Degree in any subject from a recognized University.",
        age_limit_summary: "Up to 30 years for General/EWS candidates.",
        pay_scale: "Level-8 in the Pay Matrix (Rs. 47,600 - Rs. 1,51,100)",
        selection_process: "Combined Recruitment Test (RT) and Interview.",
        fee_details: { general_obc_ews: 25, sc_st_pwd_women: 0, payment_mode: "Online Payment" }
      }
    ]
  },
  {
    key: "bsf_official_feed",
    name: "Border Security Force (BSF Recruitment) Official Feed",
    organizationSlug: "bsf",
    organizationName: "Border Security Force",
    jurisdiction: "central_police",
    baseUrl: "https://rectt.bsf.gov.in",
    recruitmentPath: "/bsf-openings",
    applyUrl: "https://rectt.bsf.gov.in",
    defaultCategory: "defence-security",
    canonicalNotices: [
      {
        advertisement_number: "BSF/RECTT/HC-RO-RM/2026",
        title: "Direct Recruitment for Head Constable (Radio Operator) & Head Constable (Radio Mechanic)",
        ministry_or_department: "Ministry of Home Affairs",
        post_name: "Head Constable (RO/RM)",
        total_vacancies: 1526,
        category_code: "defence-security",
        date_of_notification: "02/08/2026",
        closing_date: "26/08/2026",
        pdf_url: "https://rectt.bsf.gov.in/pdf/HC_RO_RM_Advt_2026.pdf",
        apply_url: "https://rectt.bsf.gov.in",
        qualification_summary: "Matriculation with 2-year ITI in Radio/TV/Electronics OR 10+2 Intermediate with Physics, Chemistry & Math (min 60%).",
        age_limit_summary: "18 to 25 years as on closing date.",
        pay_scale: "Level-4 in 7th CPC (Rs. 25,500 - 81,100)",
        selection_process: "Written Examination, PST/PET, Dictation Test & Document Verification with Detailed Medical Exam.",
        fee_details: { general_obc_ews: 100, sc_st_pwd_women: 0, payment_mode: "SBI e-Pay Portal" }
      }
    ]
  },
  {
    key: "crpf_official_feed",
    name: "Central Reserve Police Force (CRPF Rectt) Official Feed",
    organizationSlug: "crpf",
    organizationName: "Central Reserve Police Force",
    jurisdiction: "central_police",
    baseUrl: "https://rect.crpf.gov.in",
    recruitmentPath: "/crpf-vacancies",
    applyUrl: "https://rect.crpf.gov.in",
    defaultCategory: "defence-security",
    canonicalNotices: [
      {
        advertisement_number: "CRPF/RECTT/TRADESMEN/2026",
        title: "Recruitment for Constable (Technical & Tradesmen - Male/Female) in CRPF",
        ministry_or_department: "Ministry of Home Affairs",
        post_name: "Constable (Driver / Fitter / Bugler / Cook / Water Carrier)",
        total_vacancies: 9212,
        category_code: "defence-security",
        date_of_notification: "05/08/2026",
        closing_date: "02/09/2026",
        pdf_url: "https://rect.crpf.gov.in/pdf/CRPF_Tradesman_Notice_2026.pdf",
        apply_url: "https://rect.crpf.gov.in",
        qualification_summary: "10th / Matriculation Pass with valid Driving License (for Driver) or ITI certificate in relevant trade.",
        age_limit_summary: "18 to 26 years (Driver: 21 to 30 years).",
        pay_scale: "Pay Level-3 (Rs. 21,700 - 69,100)",
        selection_process: "Computer Based Test (CBT), Physical Standards & Efficiency Test, Trade Test, and DME.",
        fee_details: { general_obc_ews: 100, sc_st_pwd_women: 0, payment_mode: "Online Gateway" }
      }
    ]
  },
  {
    key: "cisf_official_feed",
    name: "Central Industrial Security Force (CISF Rectt) Official Feed",
    organizationSlug: "cisf",
    organizationName: "Central Industrial Security Force",
    jurisdiction: "central_police",
    baseUrl: "https://cisfrectt.cisf.gov.in",
    recruitmentPath: "/cisf-openings",
    applyUrl: "https://cisfrectt.cisf.gov.in",
    defaultCategory: "defence-security",
    canonicalNotices: [
      {
        advertisement_number: "CISF/RECTT/FIREMAN/2026",
        title: "Recruitment of Constable / Fire (Male) in Central Industrial Security Force",
        ministry_or_department: "Ministry of Home Affairs",
        post_name: "Constable / Fire (Male)",
        total_vacancies: 1130,
        category_code: "defence-security",
        date_of_notification: "04/08/2026",
        closing_date: "30/08/2026",
        pdf_url: "https://cisfrectt.cisf.gov.in/pdf/CISF_Fireman_Advt_2026.pdf",
        apply_url: "https://cisfrectt.cisf.gov.in",
        qualification_summary: "12th Class or equivalent qualification with science subject from a recognized Board/University.",
        age_limit_summary: "18 to 23 years as on closing date.",
        pay_scale: "Pay Level-3 (Rs. 21,700 - 69,100)",
        selection_process: "Physical Efficiency Test (PET/PST), Written Examination (OMR/CBT), DV and Medical Examination.",
        fee_details: { general_obc_ews: 100, sc_st_pwd_women: 0, payment_mode: "Net Banking / UPI" }
      }
    ]
  },
  {
    key: "itbp_official_feed",
    name: "Indo-Tibetan Border Police (ITBP Recruitment) Official Feed",
    organizationSlug: "itbp",
    organizationName: "Indo-Tibetan Border Police",
    jurisdiction: "central_police",
    baseUrl: "https://recruitment.itbpolice.nic.in",
    recruitmentPath: "/itbp-notices",
    applyUrl: "https://recruitment.itbpolice.nic.in",
    defaultCategory: "defence-security",
    canonicalNotices: [
      {
        advertisement_number: "ITBP/RECTT/TELECOM/2026",
        title: "Recruitment to the posts of Sub-Inspector, Head Constable and Constable (Telecommunication)",
        ministry_or_department: "Ministry of Home Affairs",
        post_name: "Sub Inspector / Head Constable / Constable (Telecom)",
        total_vacancies: 526,
        category_code: "defence-security",
        date_of_notification: "06/08/2026",
        closing_date: "04/09/2026",
        pdf_url: "https://recruitment.itbpolice.nic.in/pdf/ITBP_Telecom_2026.pdf",
        apply_url: "https://recruitment.itbpolice.nic.in",
        qualification_summary: "For SI: Bachelor's in Science with Physics/Chemistry/Math or BCA; For HC: 10+2 with PCM (45%) or ITI; For Constable: 10th Pass.",
        age_limit_summary: "18 to 25 years (SI: 20 to 25 years).",
        pay_scale: "Level-6 for SI (Rs. 35,400-1,12,400); Level-4 for HC; Level-3 for Constable",
        selection_process: "Phase-I PET/PST, Phase-II Written Examination, Phase-III DV & DME.",
        fee_details: { general_obc_ews: 100, sc_st_pwd_women: 0, payment_mode: "Online Gateway" }
      }
    ]
  },
  {
    key: "ssb_official_feed",
    name: "Sashastra Seema Bal (SSB Recruitment) Official Feed",
    organizationSlug: "ssb",
    organizationName: "Sashastra Seema Bal",
    jurisdiction: "central_police",
    baseUrl: "https://ssbrectt.gov.in",
    recruitmentPath: "/ssb-advertisements",
    applyUrl: "https://ssbrectt.gov.in",
    defaultCategory: "defence-security",
    canonicalNotices: [
      {
        advertisement_number: "SSB/RECTT/HC-MIN/2026",
        title: "Recruitment of Head Constable (Ministerial) in Sashastra Seema Bal",
        ministry_or_department: "Ministry of Home Affairs",
        post_name: "Head Constable (Ministerial)",
        total_vacancies: 115,
        category_code: "defence-security",
        date_of_notification: "09/08/2026",
        closing_date: "08/09/2026",
        pdf_url: "https://ssbrectt.gov.in/pdf/SSB_HC_Min_2026.pdf",
        apply_url: "https://ssbrectt.gov.in",
        qualification_summary: "Intermediate or Senior Secondary School Certificate (10+2) examination with English typing 35 WPM or Hindi typing 30 WPM.",
        age_limit_summary: "18 to 25 years.",
        pay_scale: "Level-4 (Rs. 25,500 - 81,100)",
        selection_process: "PET/PST, Written Exam, Skill/Typing Test, Document Verification & Medical Examination.",
        fee_details: { general_obc_ews: 100, sc_st_pwd_women: 0, payment_mode: "Online Payment" }
      }
    ]
  },
  {
    key: "indian_army_official_feed",
    name: "Join Indian Army (Agniveer & Officers) Official Feed",
    organizationSlug: "indian-army",
    organizationName: "Indian Army",
    jurisdiction: "defence",
    baseUrl: "https://joinindianarmy.nic.in",
    recruitmentPath: "/army-openings",
    applyUrl: "https://joinindianarmy.nic.in",
    defaultCategory: "defence-security",
    canonicalNotices: [
      {
        advertisement_number: "ARMY/AGNIVEER/RALLY/2026-27",
        title: "Indian Army Agniveer Intake (General Duty, Technical, Clerk, Tradesmen) All ZROs",
        ministry_or_department: "Ministry of Defence",
        post_name: "Agniveer (General Duty / Technical / Office Assistant / Tradesman)",
        total_vacancies: 25000,
        category_code: "defence-security",
        date_of_notification: "01/08/2026",
        closing_date: "25/08/2026",
        pdf_url: "https://joinindianarmy.nic.in/pdf/Agniveer_Intake_2026_Official.pdf",
        apply_url: "https://joinindianarmy.nic.in",
        qualification_summary: "Class 10th / Matric with 45% marks in aggregate (GD) or 10+2 with Physics, Chemistry, Math & English (Technical).",
        age_limit_summary: "17.5 to 21 years as on 01-10-2026.",
        pay_scale: "Customized Package Rs. 30,000 - 40,000/month plus Seva Nidhi Package on completion",
        selection_process: "Phase-I Online Common Entrance Examination (CEE), Phase-II Recruitment Rally & Medical.",
        fee_details: { general_obc_ews: 250, sc_st_pwd_women: 250, payment_mode: "Online Payment Gateway" }
      }
    ]
  },
  {
    key: "indian_navy_official_feed",
    name: "Join Indian Navy (Agniveer SSR/MR & Officers) Official Feed",
    organizationSlug: "indian-navy",
    organizationName: "Indian Navy",
    jurisdiction: "defence",
    baseUrl: "https://joinindiannavy.gov.in",
    recruitmentPath: "/navy-vacancies",
    applyUrl: "https://joinindiannavy.gov.in",
    defaultCategory: "defence-security",
    canonicalNotices: [
      {
        advertisement_number: "NAVY/AGNIVEER-SSR/02-2026",
        title: "Indian Navy Agniveer (Senior Secondary Recruit - SSR) 02/2026 Batch",
        ministry_or_department: "Ministry of Defence",
        post_name: "Agniveer SSR (Male/Female)",
        total_vacancies: 4000,
        category_code: "defence-security",
        date_of_notification: "03/08/2026",
        closing_date: "24/08/2026",
        pdf_url: "https://joinindiannavy.gov.in/pdf/Agniveer_SSR_02_2026.pdf",
        apply_url: "https://joinindiannavy.gov.in",
        qualification_summary: "Passed 10+2 examination with Maths & Physics and at least one of these subjects: Chemistry/Biology/Computer Science.",
        age_limit_summary: "Born between 01 Nov 2005 and 30 Apr 2009 (both dates inclusive).",
        pay_scale: "Agniveer Package Rs. 30,000 to Rs. 40,000 with Seva Nidhi corpus",
        selection_process: "Shortlisting via INET / Computer Based Exam, Physical Fitness Test (PFT), and Final Medical at INS Chilka.",
        fee_details: { general_obc_ews: 550, sc_st_pwd_women: 550, payment_mode: "Online Netbanking/UPI" }
      }
    ]
  },
  {
    key: "indian_air_force_official_feed",
    name: "Indian Air Force (AFCAT & Agniveervayu) Official Feed",
    organizationSlug: "indian-air-force",
    organizationName: "Indian Air Force",
    jurisdiction: "defence",
    baseUrl: "https://careerindianairforce.cdac.in",
    recruitmentPath: "/afcat-notices",
    applyUrl: "https://afcat.cdac.in",
    defaultCategory: "defence-security",
    canonicalNotices: [
      {
        advertisement_number: "AFCAT-02/2026/NCC",
        title: "Air Force Common Admission Test (AFCAT - 02/2026) for Flying & Ground Duty Branches",
        ministry_or_department: "Ministry of Defence",
        post_name: "Commissioned Officer (Flying / Technical / Weapon Systems / Administration / Accounts)",
        total_vacancies: 304,
        category_code: "defence-security",
        date_of_notification: "01/08/2026",
        closing_date: "28/08/2026",
        pdf_url: "https://careerindianairforce.cdac.in/pdf/AFCAT_02_2026_Advt.pdf",
        apply_url: "https://afcat.cdac.in",
        qualification_summary: "Graduation (min 60%) with Math and Physics at 10+2 level or B.E./B.Tech degree (min 60%).",
        age_limit_summary: "Flying: 20 to 24 years; Ground Duty: 20 to 26 years.",
        pay_scale: "Defence Pay Matrix Level 10 (Rs. 56,100 - 1,77,500) plus MSP Rs. 15,500/month",
        selection_process: "Online AFCAT Examination, Air Force Selection Board (AFSB) Interview / Testing, and Medical.",
        fee_details: { general_obc_ews: 550, sc_st_pwd_women: 550, payment_mode: "Online Payment Gateway" }
      }
    ]
  },

  // =========================================================================
  // PRIORITY 2: STATE PUBLIC SERVICE COMMISSIONS (10 Sources)
  // =========================================================================
  {
    key: "bpsc_official_feed",
    name: "Bihar Public Service Commission (BPSC) Official Feed",
    organizationSlug: "bpsc",
    organizationName: "Bihar Public Service Commission",
    jurisdiction: "state",
    stateCode: "BR",
    baseUrl: "https://bpsc.bih.nic.in",
    recruitmentPath: "/notices",
    applyUrl: "https://onlinebpsc.bihar.gov.in",
    defaultCategory: "state-govt",
    canonicalNotices: [
      {
        advertisement_number: "BPSC-CCE-71/2026",
        title: "71st Combined (Preliminary) Competitive Examination 2026 (BPSC 71st CCE)",
        ministry_or_department: "General Administration Department, Government of Bihar",
        post_name: "Sub-Divisional Officer (SDO) / Deputy Superintendent of Police (DSP) / Block Panchayat Officer",
        total_vacancies: 1957,
        category_code: "state-govt",
        date_of_notification: "05/08/2026",
        closing_date: "10/09/2026",
        pdf_url: "https://bpsc.bih.nic.in/Advt/NB-2026-71-CCE.pdf",
        apply_url: "https://onlinebpsc.bihar.gov.in",
        qualification_summary: "Graduate degree in any discipline from a recognized University or equivalent.",
        age_limit_summary: "20/21/22 to 37 years for Male (40 for BC/EBC & Female; 42 for SC/ST).",
        pay_scale: "Pay Level-7 and Level-9 in Bihar State Pay Matrix (Rs. 44,900 - 1,67,800)",
        selection_process: "Preliminary Objective Exam (150 Marks), Main Written Exam (900 Marks), and Personality Test (120 Marks).",
        fee_details: { general_obc_ews: 600, sc_st_pwd_women: 150, payment_mode: "Online Bihar Portal Gateway" },
        min_age: 20,
        max_age: 37,
        selection_stages: ["Preliminary Examination (Objective, 150 Questions, 150 Marks)", "Main Written Examination (6 Papers, 900 Marks)", "Personality Test / Interview (120 Marks)"]
      }
    ]
  },
  {
    key: "uppsc_official_feed",
    name: "Uttar Pradesh Public Service Commission (UPPSC) Official Feed",
    organizationSlug: "uppsc",
    organizationName: "Uttar Pradesh Public Service Commission",
    jurisdiction: "state",
    stateCode: "UP",
    baseUrl: "https://uppsc.up.nic.in",
    recruitmentPath: "/all-notifications",
    applyUrl: "https://uppsc.up.nic.in/CandidatePages/Notifications.aspx",
    defaultCategory: "state-govt",
    canonicalNotices: [
      {
        advertisement_number: "A-1/E-1/2026-PCS",
        title: "Combined State / Upper Subordinate Services (PCS) Examination 2026",
        ministry_or_department: "Personnel & General Administration, Government of Uttar Pradesh",
        post_name: "Deputy Collector / DSP / Block Development Officer (BDO) / ARTO",
        total_vacancies: 820,
        category_code: "state-govt",
        date_of_notification: "01/08/2026",
        closing_date: "02/09/2026",
        pdf_url: "https://uppsc.up.nic.in/notifications/PCS_2026_Notice.pdf",
        apply_url: "https://uppsc.up.nic.in",
        qualification_summary: "Bachelor's Degree of any recognized University or equivalent qualification.",
        age_limit_summary: "21 to 40 years as on 01-07-2026 (relaxations up to 5 years for SC/ST/OBC of UP).",
        pay_scale: "Pay Matrix Level-7 to Level-10 (Rs. 44,900 - 1,77,500)",
        selection_process: "Preliminary Exam (GS-I & CSAT), Main Written Examination (6 GS Papers + Hindi + Essay), and Viva-voce.",
        fee_details: { general_obc_ews: 125, sc_st_pwd_women: 65, payment_mode: "Online Net Banking/E-Challan" },
        min_age: 21,
        max_age: 40,
        selection_stages: ["Preliminary Examination (GS-I & CSAT, 400 Marks)", "Main Written Examination (8 Papers, 1500 Marks)", "Viva-voce / Interview (100 Marks)"]
      }
    ]
  },
  {
    key: "mppsc_official_feed",
    name: "Madhya Pradesh Public Service Commission (MPPSC) Official Feed",
    organizationSlug: "mppsc",
    organizationName: "Madhya Pradesh Public Service Commission",
    jurisdiction: "state",
    stateCode: "MP",
    baseUrl: "https://mppsc.mp.gov.in",
    recruitmentPath: "/advertisements",
    applyUrl: "https://mponline.gov.in",
    defaultCategory: "state-govt",
    canonicalNotices: [
      {
        advertisement_number: "MPPSC/SSE/03/2026",
        title: "State Service Examination 2026 (SSE) & State Forest Service Examination",
        ministry_or_department: "General Administration Department, Government of Madhya Pradesh",
        post_name: "Deputy District President / DSP / Naib Tehsildar / Commercial Tax Officer",
        total_vacancies: 640,
        category_code: "state-govt",
        date_of_notification: "07/08/2026",
        closing_date: "06/09/2026",
        pdf_url: "https://mppsc.mp.gov.in/uploads/advertisement/SSE_2026_Advt.pdf",
        apply_url: "https://mponline.gov.in",
        qualification_summary: "Graduation in any discipline from a recognized University.",
        age_limit_summary: "21 to 40 years (Non-Uniformed) / 21 to 33 years (Uniformed posts).",
        pay_scale: "Rs. 15,600 - 39,100 + GP 5400 / 7th Pay Scale Level 10-12",
        selection_process: "Preliminary Examination (OMR), Main Examination (Descriptive), and Interview.",
        fee_details: { general_obc_ews: 500, sc_st_pwd_women: 250, payment_mode: "MPOnline Kiosk / Net Banking" },
        min_age: 21,
        max_age: 40,
        selection_stages: ["Preliminary Examination (OMR, 200 Marks)", "Main Examination (Descriptive, 1400 Marks)", "Interview / Personality Test (175 Marks)"]
      }
    ]
  },
  {
    key: "rpsc_official_feed",
    name: "Rajasthan Public Service Commission (RPSC) Official Feed",
    organizationSlug: "rpsc",
    organizationName: "Rajasthan Public Service Commission",
    jurisdiction: "state",
    stateCode: "RJ",
    baseUrl: "https://rpsc.rajasthan.gov.in",
    recruitmentPath: "/advertisements",
    applyUrl: "https://sso.rajasthan.gov.in",
    defaultCategory: "state-govt",
    canonicalNotices: [
      {
        advertisement_number: "RPSC/RAS-RTS/02/2026-27",
        title: "Rajasthan State and Subordinate Services Combined Competitive Exam 2026 (RAS/RTS)",
        ministry_or_department: "Department of Personnel, Government of Rajasthan",
        post_name: "RAS (Administrative Service) / RPS (Police Service) / Accounts Service / Tehsildar",
        total_vacancies: 1105,
        category_code: "state-govt",
        date_of_notification: "08/08/2026",
        closing_date: "07/09/2026",
        pdf_url: "https://rpsc.rajasthan.gov.in/Static/RecruitmentAdvertisements/RAS_2026.pdf",
        apply_url: "https://sso.rajasthan.gov.in",
        qualification_summary: "Must hold a Degree of any of the Universities incorporated by an Act of the Central or State Legislature.",
        age_limit_summary: "21 to 40 years as on 01-01-2027.",
        pay_scale: "Pay Matrix Level L-14 (State Services) & L-10/L-11 (Subordinate Services)",
        selection_process: "Preliminary Examination (OMR, 200 Marks), Main Examination (4 Papers, 800 Marks), and Personality Test.",
        fee_details: { general_obc_ews: 600, sc_st_pwd_women: 400, payment_mode: "SSO Portal Online Gateway" },
        min_age: 21,
        max_age: 40,
        selection_stages: ["Preliminary Examination (OMR, 200 Marks)", "Main Written Examination (4 Papers, 800 Marks)", "Personality Test / Interview"]
      }
    ]
  },
  {
    key: "ukpsc_official_feed",
    name: "Uttarakhand Public Service Commission (UKPSC) Official Feed",
    organizationSlug: "ukpsc",
    organizationName: "Uttarakhand Public Service Commission",
    jurisdiction: "state",
    stateCode: "UK",
    baseUrl: "https://psc.uk.gov.in",
    recruitmentPath: "/recruitment-notices",
    applyUrl: "https://ukpscnet.in",
    defaultCategory: "state-govt",
    canonicalNotices: [
      {
        advertisement_number: "UKPSC/A-1/E-2/PCS/2026",
        title: "Uttarakhand Combined State Civil / Upper Subordinate Services Exam 2026 (UKPSC PCS)",
        ministry_or_department: "Personnel Department, Government of Uttarakhand",
        post_name: "Deputy Collector / DSP / Finance Officer / ARTO / Block Development Officer",
        total_vacancies: 295,
        category_code: "state-govt",
        date_of_notification: "04/08/2026",
        closing_date: "28/08/2026",
        pdf_url: "https://psc.uk.gov.in/upload/contents/File-PCS-2026-Advt.pdf",
        apply_url: "https://ukpscnet.in",
        qualification_summary: "Bachelor's Degree from a recognized University or equivalent.",
        age_limit_summary: "21 to 42 years as on 01-07-2026.",
        pay_scale: "Level-10 in Uttarakhand Pay Matrix (Rs. 56,100 - 1,77,500)",
        selection_process: "Preliminary Examination (GS & CSAT), Main Written Examination (7 Papers), and Interview (150 Marks).",
        fee_details: { general_obc_ews: 172, sc_st_pwd_women: 82, payment_mode: "Online Payment Gateway" }
      }
    ]
  },
  {
    key: "jpsc_official_feed",
    name: "Jharkhand Public Service Commission (JPSC) Official Feed",
    organizationSlug: "jpsc",
    organizationName: "Jharkhand Public Service Commission",
    jurisdiction: "state",
    stateCode: "JH",
    baseUrl: "https://jpsc.gov.in",
    recruitmentPath: "/notices",
    applyUrl: "https://jpsc.gov.in/online_application",
    defaultCategory: "state-govt",
    canonicalNotices: [
      {
        advertisement_number: "JPSC/CCE/01/2026",
        title: "Combined Civil Services Examination 2026 (12th-14th JPSC CCE)",
        ministry_or_department: "Personnel, Administrative Reforms, Government of Jharkhand",
        post_name: "Jharkhand Administrative Service / Police Service / Education Service / Planning Service",
        total_vacancies: 342,
        category_code: "state-govt",
        date_of_notification: "06/08/2026",
        closing_date: "05/09/2026",
        pdf_url: "https://jpsc.gov.in/uploads/Advt_No_01_2026_CCE.pdf",
        apply_url: "https://jpsc.gov.in",
        qualification_summary: "Degree of any of the Universities incorporated by an Act of Central or State Legislature.",
        age_limit_summary: "21 to 35 years (General) as on 01-08-2026 (relaxations up to 40 years for SC/ST).",
        pay_scale: "Pay Level 9 (Rs. 53,100 - 1,67,800)",
        selection_process: "Preliminary Examination (2 Papers of 200 marks each), Main Written Examination (6 Papers), and Personality Test (100 Marks).",
        fee_details: { general_obc_ews: 100, sc_st_pwd_women: 50, payment_mode: "Online SBI Collect" }
      }
    ]
  },
  {
    key: "hpsc_official_feed",
    name: "Haryana Public Service Commission (HPSC) Official Feed",
    organizationSlug: "hpsc",
    organizationName: "Haryana Public Service Commission",
    jurisdiction: "state",
    stateCode: "HR",
    baseUrl: "https://hpsc.gov.in",
    recruitmentPath: "/advertisements",
    applyUrl: "https://hpsc.gov.in/en-us/Online-Application-Form",
    defaultCategory: "state-govt",
    canonicalNotices: [
      {
        advertisement_number: "HPSC/Advt-14/2026-HCS",
        title: "Haryana Civil Services (Executive Branch) & Allied Services Examination 2026",
        ministry_or_department: "Chief Secretary Office, Government of Haryana",
        post_name: "HCS (Ex. Br.) / DSP / Excise & Taxation Officer / Assistant Registrar / BDPO",
        total_vacancies: 174,
        category_code: "state-govt",
        date_of_notification: "02/08/2026",
        closing_date: "27/08/2026",
        pdf_url: "https://hpsc.gov.in/Portals/0/Advt_14_2026_HCS.pdf",
        apply_url: "https://hpsc.gov.in",
        qualification_summary: "Bachelor of Arts/Science/Commerce or an equivalent degree of a recognized University.",
        age_limit_summary: "18 to 42 years as on 01-01-2026 (DSP: 18 to 27 years).",
        pay_scale: "Level-10 (Rs. 56,100 - 1,77,500) and Level-7/8/9",
        selection_process: "Preliminary Examination (General Studies & CSAT), Main Written Examination (4 Papers), and Personality Test.",
        fee_details: { general_obc_ews: 1000, sc_st_pwd_women: 250, payment_mode: "Online Payment Gateway" }
      }
    ]
  },
  {
    key: "wbpsc_official_feed",
    name: "West Bengal Public Service Commission (WBPSC) Official Feed",
    organizationSlug: "wbpsc",
    organizationName: "West Bengal Public Service Commission",
    jurisdiction: "state",
    stateCode: "WB",
    baseUrl: "https://psc.wb.gov.in",
    recruitmentPath: "/advertisements",
    applyUrl: "https://psc.wb.gov.in",
    defaultCategory: "state-govt",
    canonicalNotices: [
      {
        advertisement_number: "WBPSC/Advt-05/2026-WBCS",
        title: "West Bengal Civil Service (Executive) etc. Examination, 2026 (WBCS 2026)",
        ministry_or_department: "Personnel & Administrative Reforms, Government of West Bengal",
        post_name: "WBCS (Exe) / West Bengal Police Service / Revenue Service / Co-operative Service",
        total_vacancies: 680,
        category_code: "state-govt",
        date_of_notification: "03/08/2026",
        closing_date: "01/09/2026",
        pdf_url: "https://psc.wb.gov.in/pdf/WBCS_Exe_Advt_05_2026.pdf",
        apply_url: "https://psc.wb.gov.in",
        qualification_summary: "A degree of a recognized University or equivalent. Ability to read, write and speak in Bengali (not mandatory for candidates whose mother tongue is Nepali).",
        age_limit_summary: "21 to 36 years for Group A & C; 20 to 36 years for Group B (Police).",
        pay_scale: "Pay Level 16 (Rs. 56,100 - 1,44,300) for Group A",
        selection_process: "Preliminary Examination (Objective 200 marks), Main Examination (Compulsory & Optional Papers), and Personality Test.",
        fee_details: { general_obc_ews: 210, sc_st_pwd_women: 0, payment_mode: "Online Net Banking/Debit Card" }
      }
    ]
  },
  {
    key: "opsc_official_feed",
    name: "Odisha Public Service Commission (OPSC) Official Feed",
    organizationSlug: "opsc",
    organizationName: "Odisha Public Service Commission",
    jurisdiction: "state",
    stateCode: "OD",
    baseUrl: "https://opsc.gov.in",
    recruitmentPath: "/recruitment-notices",
    applyUrl: "https://opsconline.gov.in",
    defaultCategory: "state-govt",
    canonicalNotices: [
      {
        advertisement_number: "OPSC/Advt-18-of-2026-27",
        title: "Odisha Civil Services Examination 2026 (OCS-2026) for Group A & Group B Posts",
        ministry_or_department: "General Administration & Public Grievance, Government of Odisha",
        post_name: "Odisha Administrative Service (OAS) / Odisha Police Service (OPS) / Odisha Finance Service",
        total_vacancies: 428,
        category_code: "state-govt",
        date_of_notification: "05/08/2026",
        closing_date: "04/09/2026",
        pdf_url: "https://opsc.gov.in/Public/Advt_18_2026_OCS.pdf",
        apply_url: "https://opsconline.gov.in",
        qualification_summary: "Bachelor's Degree from any University recognized by Government. Must be able to read, write and speak Odia (passed ME standard with Odia).",
        age_limit_summary: "21 to 38 years as on 01-01-2026 (relaxations for SC/ST/SEBC/Women).",
        pay_scale: "Level-12 in Pay Matrix (Rs. 56,100 - 1,77,500) Group A",
        selection_process: "Preliminary Examination (GS-I & GS-II), Main Examination (Descriptive), and Personality Test.",
        fee_details: { general_obc_ews: 0, sc_st_pwd_women: 0, payment_mode: "Free Government Citizen Access" }
      }
    ]
  },
  {
    key: "apsc_official_feed",
    name: "Assam Public Service Commission (APSC) Official Feed",
    organizationSlug: "apsc",
    organizationName: "Assam Public Service Commission",
    jurisdiction: "state",
    stateCode: "AS",
    baseUrl: "https://apsc.nic.in",
    recruitmentPath: "/notices",
    applyUrl: "https://apscrecruitment.in",
    defaultCategory: "state-govt",
    canonicalNotices: [
      {
        advertisement_number: "APSC/CCE/02/2026",
        title: "Combined Competitive Examination 2026 (APSC CCE) for Assam Civil Service & Allied Cadres",
        ministry_or_department: "Personnel (A) Department, Government of Assam",
        post_name: "Assam Civil Service (Junior Grade) / Assam Police Service / Superintendent of Taxes / BDO",
        total_vacancies: 375,
        category_code: "state-govt",
        date_of_notification: "06/08/2026",
        closing_date: "06/09/2026",
        pdf_url: "https://apsc.nic.in/advt_2026/Advt_CCE_2026.pdf",
        apply_url: "https://apscrecruitment.in",
        qualification_summary: "Degree from any recognized University. Candidate must be a citizen of India and registered in a District Employment Exchange of Assam.",
        age_limit_summary: "21 to 38 years as on 01-01-2026.",
        pay_scale: "Pay Band 4 (Rs. 30,000 - 1,10,000) with Grade Pay Rs. 13,300",
        selection_process: "Preliminary Examination (Objective 400 marks), Main Written Examination (6 Papers), and Interview (180 Marks).",
        fee_details: { general_obc_ews: 297, sc_st_pwd_women: 197, payment_mode: "Assam e-GRAS Online Gateway" }
      }
    ]
  },

  // =========================================================================
  // PRIORITY 3: COURTS & JUDICIARY (5 Sources)
  // =========================================================================
  {
    key: "sci_official_feed",
    name: "Supreme Court of India (SCI) Official Feed",
    organizationSlug: "sci",
    organizationName: "Supreme Court of India",
    jurisdiction: "central",
    baseUrl: "https://sci.gov.in",
    recruitmentPath: "/recruitment",
    applyUrl: "https://sci.gov.in/recruitment",
    defaultCategory: "judiciary-law",
    canonicalNotices: [
      {
        advertisement_number: "SCI/RECRUITMENT/2026/01",
        title: "Supreme Court of India Junior Court Assistant (JCA) Recruitment 2026",
        ministry_or_department: "Registry of Supreme Court of India",
        post_name: "Junior Court Assistant (Group B Non-Gazetted)",
        total_vacancies: 210,
        category_code: "judiciary-law",
        date_of_notification: "12/08/2026",
        closing_date: "10/09/2026",
        pdf_url: "https://sci.gov.in/recruitment/JCA_2026_Official_Notice.pdf",
        apply_url: "https://sci.gov.in/recruitment",
        qualification_summary: "Bachelor's degree of a recognized University with minimum typing speed of 35 w.p.m. in English on Computer.",
        age_limit_summary: "18 to 30 years as on 01-07-2026 (relaxations applicable as per rules).",
        pay_scale: "Pay Matrix Level 6 (Initial Basic Pay Rs. 35,400 + allowances)",
        selection_process: "Objective Written Test, English Typing Test on Computer, Descriptive Paper, and Interview.",
        fee_details: { general_obc_ews: 500, sc_st_pwd_women: 250, payment_mode: "Online Payment Portal" }
      }
    ]
  },
  {
    key: "patna_hc_official_feed",
    name: "Patna High Court Official Feed",
    organizationSlug: "patna-high-court",
    organizationName: "High Court of Judicature at Patna",
    jurisdiction: "state",
    stateCode: "BR",
    baseUrl: "https://patnahighcourt.gov.in",
    recruitmentPath: "/recruitment",
    applyUrl: "https://patnahighcourt.gov.in/recruitment",
    defaultCategory: "judiciary-law",
    canonicalNotices: [
      {
        advertisement_number: "PHC/01/2026",
        title: "Patna High Court Assistant (Group B) & Translator Recruitment 2026",
        ministry_or_department: "High Court of Judicature at Patna, Bihar",
        post_name: "Assistant / Computer Operator / Translator",
        total_vacancies: 550,
        category_code: "judiciary-law",
        date_of_notification: "14/08/2026",
        closing_date: "14/09/2026",
        pdf_url: "https://patnahighcourt.gov.in/notices/Assistant_Recruitment_2026.pdf",
        apply_url: "https://patnahighcourt.gov.in/recruitment",
        qualification_summary: "Graduation in any discipline with Diploma/Certificate of at least six months' duration in Computer Applications.",
        age_limit_summary: "18 to 37 years for Male, 18 to 40 years for Female as on 01-01-2026.",
        pay_scale: "Level 7 (Rs. 44,900 - 1,42,400) of 7th CPC Pay Matrix",
        selection_process: "Preliminary Test (Objective), Written Test (Descriptive), Computer Proficiency Test, and Interview.",
        fee_details: { general_obc_ews: 1000, sc_st_pwd_women: 500, payment_mode: "Debit Card, Credit Card, Net Banking" }
      }
    ]
  },
  {
    key: "allahabad_hc_official_feed",
    name: "Allahabad High Court Official Feed",
    organizationSlug: "allahabad-high-court",
    organizationName: "High Court of Judicature at Allahabad",
    jurisdiction: "state",
    stateCode: "UP",
    baseUrl: "https://www.allahabadhighcourt.in",
    recruitmentPath: "/recruitment",
    applyUrl: "https://www.allahabadhighcourt.in",
    defaultCategory: "judiciary-law",
    canonicalNotices: [
      {
        advertisement_number: "AHC/02/2026/RO-ARO",
        title: "Review Officer (RO), Assistant Review Officer (ARO) & Group C/D Recruitment 2026",
        ministry_or_department: "Establishment of High Court of Judicature at Allahabad, Uttar Pradesh",
        post_name: "Review Officer (RO) / Assistant Review Officer (ARO) / Junior Assistant / Stenographer",
        total_vacancies: 3306,
        category_code: "judiciary-law",
        date_of_notification: "10/08/2026",
        closing_date: "09/09/2026",
        pdf_url: "https://www.allahabadhighcourt.in/recruitment/RO_ARO_2026_Official.pdf",
        apply_url: "https://www.allahabadhighcourt.in",
        qualification_summary: "Bachelor's Degree from a recognized University + CCC Certificate / 'O' Level by NIELIT / DOEACC.",
        age_limit_summary: "21 to 35 years as on 01-07-2026 (relaxations as per UP rules).",
        pay_scale: "Pay Level 8 (Rs. 47,600 - 1,51,100) for RO; Level 7 for ARO",
        selection_process: "Stage-I Computer Based Test (MCQs) and Stage-II Computer Knowledge Test (Typing).",
        fee_details: { general_obc_ews: 800, sc_st_pwd_women: 600, payment_mode: "Online Portal NTA / High Court" }
      }
    ]
  },
  {
    key: "delhi_hc_official_feed",
    name: "Delhi High Court Official Feed",
    organizationSlug: "delhi-high-court",
    organizationName: "High Court of Delhi",
    jurisdiction: "state",
    stateCode: "DL",
    baseUrl: "https://delhihighcourt.nic.in",
    recruitmentPath: "/recruitment",
    applyUrl: "https://delhihighcourt.nic.in",
    defaultCategory: "judiciary-law",
    canonicalNotices: [
      {
        advertisement_number: "DHC/ESTT./2026/01",
        title: "Delhi High Court Senior Judicial Assistant (SJA) & Personal Assistant Recruitment 2026",
        ministry_or_department: "Establishment Branch, High Court of Delhi",
        post_name: "Senior Judicial Assistant / Personal Assistant / Court Attendant",
        total_vacancies: 127,
        category_code: "judiciary-law",
        date_of_notification: "05/08/2026",
        closing_date: "04/09/2026",
        pdf_url: "https://delhihighcourt.nic.in/openposition/SJA_2026.pdf",
        apply_url: "https://delhihighcourt.nic.in",
        qualification_summary: "Graduate from a recognized University with minimum typing speed of 40 w.p.m. in English on Computer.",
        age_limit_summary: "18 to 27 years as on 01-01-2026.",
        pay_scale: "Level 8 of Pay Matrix (Rs. 47,600 - 1,51,100)",
        selection_process: "Preliminary Exam (OMR/CBT), Main (Descriptive), English Typing Test, and Interview.",
        fee_details: { general_obc_ews: 600, sc_st_pwd_women: 300, payment_mode: "Online Gateway" }
      }
    ]
  },
  {
    key: "ecourts_national_feed",
    name: "eCourts Services National Judicial Recruitment Feed",
    organizationSlug: "ecourts",
    organizationName: "eCourts Integrated Mission Mode Project",
    jurisdiction: "central",
    baseUrl: "https://services.ecourts.gov.in",
    recruitmentPath: "/recruitment",
    applyUrl: "https://services.ecourts.gov.in",
    defaultCategory: "judiciary-law",
    canonicalNotices: [
      {
        advertisement_number: "ECOURTS/DISTRICT/2026/01",
        title: "All India District & Sessions Courts Stenographers, Clerks & Process Servers Recruitment 2026",
        ministry_or_department: "Department of Justice, Ministry of Law and Justice",
        post_name: "District Court Stenographer Grade-III / Peon / Orderly / Process Server",
        total_vacancies: 4890,
        category_code: "judiciary-law",
        date_of_notification: "11/08/2026",
        closing_date: "11/09/2026",
        pdf_url: "https://services.ecourts.gov.in/notices/District_Courts_2026_Aggregated.pdf",
        apply_url: "https://services.ecourts.gov.in",
        qualification_summary: "10th / 12th / Graduate depending on post with relevant typing/shorthand qualifications.",
        age_limit_summary: "18 to 40 years (varies by state district establishment rules).",
        pay_scale: "Pay Level 1 to Level 5 (Rs. 18,000 to Rs. 92,300)",
        selection_process: "Written Examination, Skill/Shorthand/Typing Test, Document Verification.",
        fee_details: { general_obc_ews: 400, sc_st_pwd_women: 200, payment_mode: "Online SBI Collect / e-Challan" }
      }
    ]
  },

  // =========================================================================
  // PRIORITY 4: STATE SUBORDINATE & POLICE BOARDS (9 Sources)
  // =========================================================================
  {
    key: "bssc_official_feed",
    name: "Bihar Staff Selection Commission (BSSC) Official Feed",
    organizationSlug: "bssc",
    organizationName: "Bihar Staff Selection Commission",
    jurisdiction: "state",
    stateCode: "BR",
    baseUrl: "https://bssc.bihar.gov.in",
    recruitmentPath: "/notice_board",
    applyUrl: "https://onlinebssc.com",
    defaultCategory: "state-govt",
    canonicalNotices: [
      {
        advertisement_number: "BSSC-02/23-26",
        title: "2nd Inter Level Combined Competitive Examination 2026 for Panchayat Secretary & Revenue Staff",
        ministry_or_department: "Panchayati Raj & Revenue Departments, Government of Bihar",
        post_name: "Panchayat Sachiv / Rajasva Karmachari / LDC / Typist-Clerk",
        total_vacancies: 12199,
        category_code: "state-govt",
        date_of_notification: "16/08/2026",
        closing_date: "16/09/2026",
        pdf_url: "https://bssc.bihar.gov.in/advt/2nd_Inter_Level_Official_Notice.pdf",
        apply_url: "https://onlinebssc.com",
        qualification_summary: "Intermediate (10+2) passed from recognized Bihar Board or equivalent institute + Computer DCA/Typing for specific posts.",
        age_limit_summary: "18 to 37 years for UR Male, 18 to 40 years for BC/EBC/UR Female, 18 to 42 years for SC/ST.",
        pay_scale: "Pay Level 2 to Level 4 (Rs. 19,900 - 81,100)",
        selection_process: "Preliminary Examination (Objective 150 Questions, 600 Marks) and Main Examination.",
        fee_details: { general_obc_ews: 540, sc_st_pwd_women: 135, payment_mode: "SBI e-Pay Online Gateway" },
        min_age: 18,
        max_age: 37,
        selection_stages: ["Preliminary Examination (Objective, 150 Questions, 600 Marks)", "Main Examination"]
      }
    ]
  },
  {
    key: "csbc_bihar_police_feed",
    name: "Central Selection Board of Constable (CSBC) Bihar Police Feed",
    organizationSlug: "csbc",
    organizationName: "Central Selection Board of Constable (Bihar Police)",
    jurisdiction: "state",
    stateCode: "BR",
    baseUrl: "https://csbc.bihar.gov.in",
    recruitmentPath: "/notices",
    applyUrl: "https://csbc.bihar.gov.in/Advt/AdvtList.aspx",
    defaultCategory: "defence-police",
    canonicalNotices: [
      {
        advertisement_number: "CSBC-01/2026-POLICE",
        title: "Bihar Police Constable & Bihar Special Armed Police (BSAP) Direct Recruitment 2026",
        ministry_or_department: "Home (Police) Department, Government of Bihar",
        post_name: "Constable (General Duty) / District Police / BSAP / Industrial Security Battalions",
        total_vacancies: 21391,
        category_code: "defence-police",
        date_of_notification: "13/08/2026",
        closing_date: "13/09/2026",
        pdf_url: "https://csbc.bihar.gov.in/advt/CSBC_Constable_2026_Notice.pdf",
        apply_url: "https://csbc.bihar.gov.in",
        qualification_summary: "10+2 (Intermediate) passed or Maulvi / Shastri / equivalent qualification as on 01-08-2026.",
        age_limit_summary: "18 to 25 years for UR Male/Female (relaxations for BC/EBC/SC/ST as per Bihar Police Act).",
        pay_scale: "Pay Matrix Level 3 (Rs. 21,700 - 69,100)",
        selection_process: "Written Examination (Qualifying 100 Marks) and Physical Efficiency Test (PET - Running, Shot Put, High Jump - 100 Marks).",
        fee_details: { general_obc_ews: 675, sc_st_pwd_women: 180, payment_mode: "Net Banking / Credit / Debit / UPI" },
        min_age: 18,
        max_age: 25,
        selection_stages: ["Written Examination (Qualifying, 100 Marks)", "Physical Efficiency Test (PET — Running, Shot Put, High Jump, 100 Marks)", "Document Verification & Medical Examination"]
      }
    ]
  },
  {
    key: "bpssc_police_feed",
    name: "Bihar Police Sub-ordinate Services Commission (BPSSC) Official Feed",
    organizationSlug: "bpssc",
    organizationName: "Bihar Police Sub-ordinate Services Commission",
    jurisdiction: "state",
    stateCode: "BR",
    baseUrl: "https://bpssc.bihar.gov.in",
    recruitmentPath: "/notices",
    applyUrl: "https://bpssc.bihar.gov.in/Advt/AdvtList.aspx",
    defaultCategory: "defence-police",
    canonicalNotices: [
      {
        advertisement_number: "BPSSC-02/2026-SI",
        title: "Bihar Police Police Sub-Inspector (Daroga) & Prohibition Sub-Inspector Recruitment 2026",
        ministry_or_department: "Home Department (Special Branch) & Prohibition Department, Bihar",
        post_name: "Police Sub-Inspector / Prohibition SI / Sub-Divisional Fire Station Officer",
        total_vacancies: 1275,
        category_code: "defence-police",
        date_of_notification: "09/08/2026",
        closing_date: "09/09/2026",
        pdf_url: "https://bpssc.bihar.gov.in/advt/BPSSC_SI_2026_Advt.pdf",
        apply_url: "https://bpssc.bihar.gov.in",
        qualification_summary: "Graduation (Bachelor's Degree) in any discipline from a recognized University as on 01-08-2026.",
        age_limit_summary: "20 to 37 years for Male (UR), 20 to 40 years for Female (UR/BC/EBC), 20 to 42 years for SC/ST.",
        pay_scale: "Pay Matrix Level 6 (Rs. 35,400 - 1,12,400)",
        selection_process: "Preliminary Written Exam (200 Marks), Main Written Exam (2 Papers - 400 Marks), Physical Endurance Test (PET), and Medical Verification.",
        fee_details: { general_obc_ews: 700, sc_st_pwd_women: 400, payment_mode: "Online Payment Gateway" },
        min_age: 20,
        max_age: 37,
        selection_stages: ["Preliminary Written Examination (200 Marks)", "Main Written Examination (2 Papers, 400 Marks)", "Physical Endurance Test (PET)", "Medical Verification"]
      }
    ]
  },
  {
    key: "upsssc_official_feed",
    name: "UP Subordinate Services Selection Commission (UPSSSC) Official Feed",
    organizationSlug: "upsssc",
    organizationName: "Uttar Pradesh Subordinate Services Selection Commission",
    jurisdiction: "state",
    stateCode: "UP",
    baseUrl: "https://upsssc.gov.in",
    recruitmentPath: "/all_notifications",
    applyUrl: "https://upsssc.gov.in/Default.aspx#candidate_login",
    defaultCategory: "state-govt",
    canonicalNotices: [
      {
        advertisement_number: "UPSSSC-03-Exam/2026",
        title: "UPSSSC Rajasva Lekhpal, Gram Panchayat Adhikari (VDO) & Junior Assistant Combined Recruitment 2026",
        ministry_or_department: "Board of Revenue & Panchayati Raj, Government of Uttar Pradesh",
        post_name: "Rajasva Lekhpal / Gram Panchayat Adhikari (VDO) / Junior Assistant / Clerk",
        total_vacancies: 8085,
        category_code: "state-govt",
        date_of_notification: "15/08/2026",
        closing_date: "15/09/2026",
        pdf_url: "https://upsssc.gov.in/advt/Lekhpal_VDO_2026_Notice.pdf",
        apply_url: "https://upsssc.gov.in",
        qualification_summary: "Intermediate (10+2) passed with valid UPSSSC Preliminary Eligibility Test (PET) 2025/2026 Scorecard + CCC Certificate.",
        age_limit_summary: "18 to 40 years as on 01-07-2026 (relaxations applicable as per UP rules).",
        pay_scale: "Pay Band 1 (Rs. 5200-20200) Grade Pay Rs. 2000 (Revised Level 3: Rs. 21,700 - 69,100)",
        selection_process: "Shortlisting based on UPSSSC PET Score followed by Main Written Examination (100 Marks).",
        fee_details: { general_obc_ews: 25, sc_st_pwd_women: 25, payment_mode: "Online State Bank Collect / E-Challan" }
      }
    ]
  },
  {
    key: "upprpb_police_feed",
    name: "UP Police Recruitment and Promotion Board (UPPRPB) Official Feed",
    organizationSlug: "upprpb",
    organizationName: "Uttar Pradesh Police Recruitment and Promotion Board",
    jurisdiction: "state",
    stateCode: "UP",
    baseUrl: "https://uppbpb.gov.in",
    recruitmentPath: "/notices",
    applyUrl: "https://uppbpb.gov.in/Notices",
    defaultCategory: "defence-police",
    canonicalNotices: [
      {
        advertisement_number: "PRPB/CONSTABLE/2026/01",
        title: "Uttar Pradesh Police Civil Police Constable & PAC Direct Recruitment 2026",
        ministry_or_department: "Police Department, Government of Uttar Pradesh",
        post_name: "Police Constable (Civil Police) / Provincial Armed Constabulary (PAC)",
        total_vacancies: 60244,
        category_code: "defence-police",
        date_of_notification: "11/08/2026",
        closing_date: "10/09/2026",
        pdf_url: "https://uppbpb.gov.in/notices/UP_Police_Constable_2026.pdf",
        apply_url: "https://uppbpb.gov.in",
        qualification_summary: "10+2 (Intermediate) passed from Board of High School and Intermediate Education UP or equivalent.",
        age_limit_summary: "18 to 25 years for Male, 18 to 28 years for Female (with 3-year age concession as per government order).",
        pay_scale: "Pay Band Rs. 5,200-20,200 with Grade Pay Rs. 2,000 (Pay Matrix Level 3: Rs. 21,700 - 69,100)",
        selection_process: "OMR Based Written Exam (300 Marks, 150 MCQs), Document Verification & Physical Standard Test (PST), Physical Efficiency Test (PET).",
        fee_details: { general_obc_ews: 400, sc_st_pwd_women: 400, payment_mode: "Online Payment Gateway" }
      }
    ]
  },
  {
    key: "rsmssb_official_feed",
    name: "Rajasthan Staff Selection Board (RSMSSB) Official Feed",
    organizationSlug: "rsmssb",
    organizationName: "Rajasthan Staff Selection Board",
    jurisdiction: "state",
    stateCode: "RJ",
    baseUrl: "https://rsmssb.rajasthan.gov.in",
    recruitmentPath: "/advertisements",
    applyUrl: "https://sso.rajasthan.gov.in",
    defaultCategory: "state-govt",
    canonicalNotices: [
      {
        advertisement_number: "RSMSSB/04/2026",
        title: "Rajasthan CET Patwari, Village Development Officer (VDO) & Junior Assistant Combined Recruitment 2026",
        ministry_or_department: "Revenue & Rural Development Departments, Government of Rajasthan",
        post_name: "Patwari / Village Development Officer (VDO) / Junior Assistant (LDC) / Clerk Grade-II",
        total_vacancies: 6843,
        category_code: "state-govt",
        date_of_notification: "07/08/2026",
        closing_date: "07/09/2026",
        pdf_url: "https://rsmssb.rajasthan.gov.in/Static/files/Advt_Patwari_VDO_2026.pdf",
        apply_url: "https://sso.rajasthan.gov.in",
        qualification_summary: "Graduation / 12th with RSCIT or equivalent Computer Diploma + Valid Rajasthan Common Eligibility Test (CET) Scorecard.",
        age_limit_summary: "18 to 40 years as on 01-01-2026.",
        pay_scale: "Pay Matrix Level L-5 to L-8 (Rs. 20,800 to Rs. 85,500)",
        selection_process: "Shortlisting on CET Rank followed by Subject-specific Main Written Examination.",
        fee_details: { general_obc_ews: 600, sc_st_pwd_women: 400, payment_mode: "SSO Rajasthan One Time Registration (OTR)" }
      }
    ]
  },
  {
    key: "mpesb_vyapam_feed",
    name: "MP Employees Selection Board (MPESB / Vyapam) Official Feed",
    organizationSlug: "mpesb",
    organizationName: "Madhya Pradesh Employees Selection Board",
    jurisdiction: "state",
    stateCode: "MP",
    baseUrl: "https://esb.mp.gov.in",
    recruitmentPath: "/rulebooks",
    applyUrl: "https://peb.mponline.gov.in",
    defaultCategory: "state-govt",
    canonicalNotices: [
      {
        advertisement_number: "MPESB-POLICE-GROUP4-2026",
        title: "MP Police Constable & Group 4 Combined Grade-III Stenographer & Assistant Recruitment 2026",
        ministry_or_department: "Home & General Administration Department, Government of Madhya Pradesh",
        post_name: "Police Constable (GD & Radio) / Assistant Grade-3 / Steno Typist / ITI Instructor",
        total_vacancies: 7090,
        category_code: "state-govt",
        date_of_notification: "12/08/2026",
        closing_date: "12/09/2026",
        pdf_url: "https://esb.mp.gov.in/Rulebooks/Police_Group4_2026_Rulebook.pdf",
        apply_url: "https://peb.mponline.gov.in",
        qualification_summary: "10th / 12th passed + CPCT Scorecard for clerk posts; 10th/12th for Constable.",
        age_limit_summary: "18 to 36 years for MP Domicile candidates (with 3-year special relaxation).",
        pay_scale: "Pay Matrix Level 3 & Level 4 (Rs. 19,500 - 62,000)",
        selection_process: "Online Computer Based Test (100 Marks), Physical Efficiency Test (PET), CPCT Typing Verification.",
        fee_details: { general_obc_ews: 500, sc_st_pwd_women: 250, payment_mode: "MP Online Kiosk / Net Banking" }
      }
    ]
  },
  {
    key: "hssc_official_feed",
    name: "Haryana Staff Selection Commission (HSSC) Official Feed",
    organizationSlug: "hssc",
    organizationName: "Haryana Staff Selection Commission",
    jurisdiction: "state",
    stateCode: "HR",
    baseUrl: "https://hssc.gov.in",
    recruitmentPath: "/advertisements",
    applyUrl: "https://adv12024.hryssc.com",
    defaultCategory: "state-govt",
    canonicalNotices: [
      {
        advertisement_number: "HSSC-ADV-01/2026",
        title: "Haryana Common Eligibility Test (CET) Group C & D Direct Recruitment 2026",
        ministry_or_department: "Various Departments & Boards, Government of Haryana",
        post_name: "Haryana Police Constable / Canal Patwari / Gram Sachiv / Clerk / Multi-Tasking Staff (MTS)",
        total_vacancies: 15755,
        category_code: "state-govt",
        date_of_notification: "08/08/2026",
        closing_date: "08/09/2026",
        pdf_url: "https://hssc.gov.in/hssccms/uploads/Advt_CET_Group_C_D_2026.pdf",
        apply_url: "https://hssc.gov.in",
        qualification_summary: "10+2 (Intermediate) with Hindi/Sanskrit as one of the subjects in Matriculation + Valid Haryana CET Score.",
        age_limit_summary: "18 to 42 years as on closing date of application.",
        pay_scale: "Level 2 to Level 6 (Rs. 19,900 to Rs. 1,12,400)",
        selection_process: "CET Score Shortlisting (4x vacancy ratio), Skill / Physical Test, Socio-economic criteria assessment.",
        fee_details: { general_obc_ews: 0, sc_st_pwd_women: 0, payment_mode: "No Fee under Haryana One Time Registration Policy" },
        min_age: 18,
        max_age: 42,
        selection_stages: ["CET Score Shortlisting (4x vacancy ratio)", "Skill / Physical Test", "Socio-economic criteria assessment", "Document Verification"]
      }
    ]
  },
  {
    key: "dsssb_official_feed",
    name: "Delhi Subordinate Services Selection Board (DSSSB) Official Feed",
    organizationSlug: "dsssb",
    organizationName: "Delhi Subordinate Services Selection Board",
    jurisdiction: "state",
    stateCode: "DL",
    baseUrl: "https://dsssb.delhi.gov.in",
    recruitmentPath: "/current-vacancies",
    applyUrl: "https://dsssbonline.nic.in",
    defaultCategory: "state-govt",
    canonicalNotices: [
      {
        advertisement_number: "DSSSB-03/2026",
        title: "Delhi Govt Teaching (TGT/PGT), Nursing Officer & Junior Assistant Combined Recruitment 2026",
        ministry_or_department: "Directorate of Education & Health Services, GNCT of Delhi / MCD",
        post_name: "Trained Graduate Teacher (TGT) / PGT / Nursing Officer / Junior Assistant (Grade-IV)",
        total_vacancies: 4214,
        category_code: "state-govt",
        date_of_notification: "14/08/2026",
        closing_date: "13/09/2026",
        pdf_url: "https://dsssb.delhi.gov.in/sites/default/files/DSSSB_Advt_03_2026.pdf",
        apply_url: "https://dsssbonline.nic.in",
        qualification_summary: "Graduation + B.Ed + CTET Paper-II for TGT; B.Sc Nursing/GNM for Nursing Officer; 12th + Typing for LDC.",
        age_limit_summary: "Below 30 years for TGT/Clerk, Below 36 years for PGT (relaxations for SC/ST/OBC Delhi).",
        pay_scale: "Pay Matrix Level 2 to Level 8 (Rs. 19,900 to Rs. 1,51,100)",
        selection_process: "One Tier / Two Tier Technical Examination (CBT Online 200 Marks) and Skill Verification.",
        fee_details: { general_obc_ews: 100, sc_st_pwd_women: 0, payment_mode: "SBI e-Pay Portal" },
        min_age: 18,
        max_age: 30,
        selection_stages: ["One Tier / Two Tier CBT Examination (200 Marks)", "Skill Verification / Typing Test", "Document Verification"]
      }
    ]
  },

  // =========================================================================
  // PRIORITY 5: STATE DEPARTMENTS & INSTITUTIONS (6 Sources)
  // =========================================================================
  {
    key: "jeevika_bihar_feed",
    name: "JEEViKA Bihar Rural Livelihoods (BRLPS) Official Feed",
    organizationSlug: "jeevika-brlps",
    organizationName: "Bihar Rural Livelihoods Promotion Society (JEEViKA)",
    jurisdiction: "state",
    stateCode: "BR",
    baseUrl: "https://brlps.in",
    recruitmentPath: "/careers",
    applyUrl: "https://jobs.brlps.in",
    defaultCategory: "agriculture-rural",
    canonicalNotices: [
      {
        advertisement_number: "BRLPS/REC/2026/01",
        title: "JEEViKA Community Coordinator, Area Coordinator & Project Manager Recruitment 2026",
        ministry_or_department: "Rural Development Department, Government of Bihar",
        post_name: "Community Coordinator (CC) / Area Coordinator (AC) / Block Project Manager (BPM) / Accountant",
        total_vacancies: 3400,
        category_code: "agriculture-rural",
        date_of_notification: "10/08/2026",
        closing_date: "10/09/2026",
        pdf_url: "https://brlps.in/careers/JEEViKA_Recruitment_Notice_2026.pdf",
        apply_url: "https://jobs.brlps.in",
        qualification_summary: "10th / 12th for Community Coordinator; Bachelor's / Master's degree in Rural Management / MSW / Commerce for Officer cadres.",
        age_limit_summary: "18 to 40 years as on 01-08-2026 (relaxations applicable as per Bihar Government norms).",
        pay_scale: "Monthly Consolidated Honorarium Rs. 18,500 to Rs. 48,000 + Performance Incentive & Health Coverage",
        selection_process: "Computer Based Test (CBT), Group Discussion (GD), Village Immersion / Field Trial, and Personal Interview.",
        fee_details: { general_obc_ews: 400, sc_st_pwd_women: 150, payment_mode: "Online Payment Gateway" }
      }
    ]
  },
  {
    key: "shsb_bihar_health_feed",
    name: "State Health Society Bihar (SHSB) Official Feed",
    organizationSlug: "shsb",
    organizationName: "State Health Society Bihar (National Health Mission)",
    jurisdiction: "state",
    stateCode: "BR",
    baseUrl: "https://shs.bihar.gov.in",
    recruitmentPath: "/recruitment",
    applyUrl: "https://shs.bihar.gov.in",
    defaultCategory: "medical-healthcare",
    canonicalNotices: [
      {
        advertisement_number: "SHSB-NHM/03/2026",
        title: "Community Health Officer (CHO) & Staff Nurse Contractual Recruitment 2026",
        ministry_or_department: "Health Department, Government of Bihar",
        post_name: "Community Health Officer (CHO) / Staff Nurse / ANM / Lab Technician",
        total_vacancies: 4500,
        category_code: "medical-healthcare",
        date_of_notification: "12/08/2026",
        closing_date: "11/09/2026",
        pdf_url: "https://shs.bihar.gov.in/notices/CHO_Staff_Nurse_2026_Advt.pdf",
        apply_url: "https://shs.bihar.gov.in",
        qualification_summary: "B.Sc. (Nursing) / Post Basic B.Sc. (Nursing) with integrated Certificate Course in Community Health (CCH) or GNM registered with Bihar Nurses Registration Council (BNRC).",
        age_limit_summary: "21 to 42 years (UR Male), 21 to 45 years for BC/EBC/UR Female, 21 to 47 years for SC/ST.",
        pay_scale: "Consolidated Monthly Remuneration Rs. 40,000 (Rs. 32,000 fixed + up to Rs. 8,000 performance incentive)",
        selection_process: "Merit based on B.Sc Nursing final marks + CCH qualification and Document Verification.",
        fee_details: { general_obc_ews: 500, sc_st_pwd_women: 250, payment_mode: "Online Payment Gateway" },
        min_age: 21,
        max_age: 42,
        selection_stages: ["Merit List (B.Sc Nursing final marks + CCH qualification)", "Document Verification"]
      }
    ]
  },
  {
    key: "up_nhm_health_feed",
    name: "National Health Mission UP (UP-NHM) Official Feed",
    organizationSlug: "up-nhm",
    organizationName: "National Health Mission Uttar Pradesh",
    jurisdiction: "state",
    stateCode: "UP",
    baseUrl: "https://upnrhm.gov.in",
    recruitmentPath: "/careers",
    applyUrl: "https://upnrhm.gov.in",
    defaultCategory: "medical-healthcare",
    canonicalNotices: [
      {
        advertisement_number: "UP-NHM/HR/2026/02",
        title: "UP NHM Staff Nurse, Community Health Officer (CHO) & Pharmacist Recruitment 2026",
        ministry_or_department: "Medical Health & Family Welfare Department, Uttar Pradesh",
        post_name: "Community Health Officer (CHO) / Staff Nurse (Maternal Health) / Pharmacist / Lab Technician",
        total_vacancies: 5582,
        category_code: "medical-healthcare",
        date_of_notification: "09/08/2026",
        closing_date: "09/09/2026",
        pdf_url: "https://upnrhm.gov.in/careers/CHO_StaffNurse_2026_Advt.pdf",
        apply_url: "https://upnrhm.gov.in",
        qualification_summary: "B.Sc. Nursing / GNM with registration in UP Nurses & Midwives Council or B.Pharm / D.Pharm registered in UP Pharmacy Council.",
        age_limit_summary: "21 to 40 years as on date of notification (relaxations as per UP rules).",
        pay_scale: "Monthly Remuneration Rs. 20,500 to Rs. 35,000 + Performance Incentive",
        selection_process: "Computer Based Test (CBT - 100 Marks) and Document Verification Process (DVP).",
        fee_details: { general_obc_ews: 0, sc_st_pwd_women: 0, payment_mode: "Free Government Application" }
      }
    ]
  },
  {
    key: "bsphcl_power_feed",
    name: "Bihar State Power Holding Company (BSPHCL) Official Feed",
    organizationSlug: "bsphcl",
    organizationName: "Bihar State Power Holding Company Limited",
    jurisdiction: "state",
    stateCode: "BR",
    baseUrl: "https://bsphcl.co.in",
    recruitmentPath: "/recruitment",
    applyUrl: "https://bsphcl.co.in",
    defaultCategory: "engineering-technical",
    canonicalNotices: [
      {
        advertisement_number: "BSPHCL/EMP-01-05/2026",
        title: "BSPHCL Junior Electrical Engineer, Technician Grade III & Correspondence Clerk Recruitment 2026",
        ministry_or_department: "Energy Department, Government of Bihar (NBPDCL / SBPDCL / BSPTCL / BSPGCL)",
        post_name: "Technician Grade-III / Junior Electrical Engineer (JEE) / Correspondence Clerk / Store Assistant",
        total_vacancies: 2610,
        category_code: "engineering-technical",
        date_of_notification: "15/08/2026",
        closing_date: "15/09/2026",
        pdf_url: "https://bsphcl.co.in/advt/BSPHCL_Combined_2026_Notice.pdf",
        apply_url: "https://bsphcl.co.in",
        qualification_summary: "Matriculation (10th) + 2 years ITI Certificate in Electrician trade for Technician; 3-year Diploma in Electrical Engineering for JEE; Graduate for Clerk.",
        age_limit_summary: "18 to 37 years for UR Male, 18 to 40 years for BC/EBC/UR Female, 18 to 42 years for SC/ST.",
        pay_scale: "Level 4 (Rs. 25,500 - 81,100) for Technician / Clerk; Level 7 (Rs. 44,900 - 1,42,400) for JEE",
        selection_process: "Computer Based Test (CBT - 100 Questions) with Sectional Cut-offs and Document Verification.",
        fee_details: { general_obc_ews: 1500, sc_st_pwd_women: 375, payment_mode: "Online Payment Gateway" }
      }
    ]
  },
  {
    key: "uppcl_power_feed",
    name: "UP Power Corporation Limited (UPPCL) Official Feed",
    organizationSlug: "uppcl",
    organizationName: "Uttar Pradesh Power Corporation Limited",
    jurisdiction: "state",
    stateCode: "UP",
    baseUrl: "https://www.upenergy.in",
    recruitmentPath: "/uppcl/en/page/vacancy-results",
    applyUrl: "https://www.upenergy.in",
    defaultCategory: "engineering-technical",
    canonicalNotices: [
      {
        advertisement_number: "UPPCL/ESC/2026/02",
        title: "UPPCL Assistant Engineer (AE), Junior Engineer (JE) & Technician Electrical (TG2) Recruitment 2026",
        ministry_or_department: "Energy Department, Government of Uttar Pradesh (UPPCL / UPPTCL / Discoms)",
        post_name: "Assistant Engineer (Trainee) / Junior Engineer (Trainee) Electrical / Technician (Electrical - TG2)",
        total_vacancies: 1840,
        category_code: "engineering-technical",
        date_of_notification: "08/08/2026",
        closing_date: "08/09/2026",
        pdf_url: "https://www.upenergy.in/notices/UPPCL_JE_TG2_2026_Advt.pdf",
        apply_url: "https://www.upenergy.in",
        qualification_summary: "B.Tech/BE in Electrical/Civil for AE; 3-Year Diploma in Electrical Engineering for JE; 10th + ITI Electrician for TG2.",
        age_limit_summary: "18 to 40 years as on 01-01-2026 (relaxations applicable for UP domiciled SC/ST/OBC).",
        pay_scale: "Pay Matrix Level 4 (Rs. 27,200) for TG2; Level 7 (Rs. 44,900) for JE; Level 10 (Rs. 59,500) for AE",
        selection_process: "Computer Based Test (CBT 200 Marks) including NIELIT CCC Computer Knowledge qualifying test.",
        fee_details: { general_obc_ews: 1180, sc_st_pwd_women: 826, payment_mode: "SBI e-Payment / Net Banking / Debit Card" }
      }
    ]
  },
  {
    key: "dlrs_bihar_revenue_feed",
    name: "Bihar Directorate of Land Records & Survey (DLRS) Official Feed",
    organizationSlug: "dlrs-bihar",
    organizationName: "Directorate of Land Records & Survey (Revenue Dept, Bihar)",
    jurisdiction: "state",
    stateCode: "BR",
    baseUrl: "https://dlrs.bihar.gov.in",
    recruitmentPath: "/recruitment",
    applyUrl: "https://bceceboard.bihar.gov.in",
    defaultCategory: "state-govt",
    canonicalNotices: [
      {
        advertisement_number: "DLRS-BCECEB/2026/01",
        title: "Bihar Special Survey Amin, Kanoongo & Special Survey Clerk Combined Recruitment 2026",
        ministry_or_department: "Revenue and Land Reforms Department, Government of Bihar",
        post_name: "Special Survey Amin / Special Survey Kanoongo / Special Survey Assistant Settlement Officer / Clerk",
        total_vacancies: 10101,
        category_code: "state-govt",
        date_of_notification: "14/08/2026",
        closing_date: "13/09/2026",
        pdf_url: "https://dlrs.bihar.gov.in/notices/DLRS_Special_Survey_2026_Advt.pdf",
        apply_url: "https://bceceboard.bihar.gov.in",
        qualification_summary: "Diploma in Civil Engineering for Amin/Kanoongo; Graduate for Special Survey Clerk; B.Tech Civil + 2 yr exp for ASO.",
        age_limit_summary: "18 to 37 years for Male (UR), 18 to 40 years for Female/BC/EBC, 18 to 42 years for SC/ST.",
        pay_scale: "Honorarium Rs. 31,000/month for Amin; Rs. 36,000/month for Kanoongo; Rs. 25,000/month for Clerk + Laptop/Mobile Allowance",
        selection_process: "Computer Based Test (CBT - 100 MCQs) conducted by BCECEB and Document Verification.",
        fee_details: { general_obc_ews: 800, sc_st_pwd_women: 400, payment_mode: "Online Payment Gateway" }
      }
    ]
  },

  // =========================================================================
  // PRIORITY 6: CENTRAL GOVERNMENT, EDUCATION & PSUs (8 Sources)
  // =========================================================================
  {
    key: "kvs_official_feed",
    name: "Kendriya Vidyalaya Sangathan (KVS) Official Feed",
    organizationSlug: "kvs",
    organizationName: "Kendriya Vidyalaya Sangathan",
    jurisdiction: "central",
    baseUrl: "https://kvsangathan.nic.in",
    recruitmentPath: "/employment-notice",
    applyUrl: "https://kvsangathan.nic.in",
    defaultCategory: "teaching-research",
    canonicalNotices: [
      {
        advertisement_number: "KVS-HQ/ESTT/2026/01",
        title: "KVS Direct Recruitment 2026 for Primary Teachers (PRT), TGT, PGT, Principal & Non-Teaching Posts",
        ministry_or_department: "Ministry of Education, Government of India",
        post_name: "Primary Teacher (PRT) / Trained Graduate Teacher (TGT) / Post Graduate Teacher (PGT) / Junior Secretariat Assistant (JSA)",
        total_vacancies: 13404,
        category_code: "teaching-research",
        date_of_notification: "15/08/2026",
        closing_date: "15/09/2026",
        pdf_url: "https://kvsangathan.nic.in/sites/default/files/KVS_Direct_Recruitment_2026.pdf",
        apply_url: "https://kvsangathan.nic.in",
        qualification_summary: "Senior Secondary with 50% marks + 2-year D.El.Ed / B.El.Ed + CTET Paper-I for PRT; Graduation + B.Ed + CTET Paper-II for TGT; Master's + B.Ed for PGT.",
        age_limit_summary: "30 years for PRT, 35 years for TGT, 40 years for PGT (10 years age relaxation for Women candidates).",
        pay_scale: "Pay Matrix Level 6 (Rs. 35,400 - 1,12,400) for PRT; Level 7 for TGT; Level 8 for PGT",
        selection_process: "Computer Based Test (CBT 180 Marks), Class Demo / Teaching Skill Test, and Professional Interview.",
        fee_details: { general_obc_ews: 1500, sc_st_pwd_women: 0, payment_mode: "Online Payment Gateway" }
      }
    ]
  },
  {
    key: "nvs_official_feed",
    name: "Navodaya Vidyalaya Samiti (NVS) Official Feed",
    organizationSlug: "nvs",
    organizationName: "Navodaya Vidyalaya Samiti",
    jurisdiction: "central",
    baseUrl: "https://navodaya.gov.in",
    recruitmentPath: "/recruitment",
    applyUrl: "https://cbseitms.rcil.gov.in/nvs",
    defaultCategory: "teaching-research",
    canonicalNotices: [
      {
        advertisement_number: "NVS/ESTT/2026/01",
        title: "Navodaya Vidyalaya Samiti TGT, PGT, Miscellaneous Teachers & Female Staff Nurse Recruitment 2026",
        ministry_or_department: "Department of School Education & Literacy, Ministry of Education",
        post_name: "Trained Graduate Teacher (TGT) / Post Graduate Teacher (PGT) / Art & Music Teacher / Female Staff Nurse",
        total_vacancies: 1616,
        category_code: "teaching-research",
        date_of_notification: "10/08/2026",
        closing_date: "10/09/2026",
        pdf_url: "https://navodaya.gov.in/nvs/en/Recruitment/Notification_NVS_2026.pdf",
        apply_url: "https://cbseitms.rcil.gov.in/nvs",
        qualification_summary: "Four years integrated degree course / Bachelor's Degree with at least 50% marks in concerned subjects + B.Ed + CTET Paper-II.",
        age_limit_summary: "Up to 35 years for TGT, up to 40 years for PGT (relaxations for SC/ST/OBC/Women).",
        pay_scale: "Level 7 (Rs. 44,900 - 1,42,400) for TGT; Level 8 (Rs. 47,600 - 1,51,100) for PGT",
        selection_process: "Computer Based Test (CBT), Interview, and Document Verification.",
        fee_details: { general_obc_ews: 1500, sc_st_pwd_women: 0, payment_mode: "Debit / Credit Card, Net Banking" }
      }
    ]
  },
  {
    key: "fci_official_feed",
    name: "Food Corporation of India (FCI) Official Feed",
    organizationSlug: "fci",
    organizationName: "Food Corporation of India",
    jurisdiction: "psu",
    baseUrl: "https://fci.gov.in",
    recruitmentPath: "/current-recruitments",
    applyUrl: "https://ibpsonline.ibps.in/fcig3aug26",
    defaultCategory: "central-govt",
    canonicalNotices: [
      {
        advertisement_number: "FCI-CATEGORY-III/2026/01",
        title: "FCI Category-III Assistant Grade-III (General / Depot / Accounts / Technical / Hindi) Recruitment 2026",
        ministry_or_department: "Ministry of Consumer Affairs, Food and Public Distribution",
        post_name: "Assistant Grade-III (General / Depot / Accounts / Technical) / Junior Engineer (Civil/EM) / Steno Grade-II",
        total_vacancies: 5043,
        category_code: "central-govt",
        date_of_notification: "12/08/2026",
        closing_date: "12/09/2026",
        pdf_url: "https://fci.gov.in/recruitment/FCI_Category_III_2026_Advt.pdf",
        apply_url: "https://ibpsonline.ibps.in/fcig3aug26",
        qualification_summary: "Graduate Degree in any discipline with proficiency in Computer for General/Depot; B.Com for Accounts; B.Sc Agriculture / B.Tech Food Science for Technical.",
        age_limit_summary: "18 to 27 years as on 01-08-2026 (relaxations applicable as per GOI guidelines).",
        pay_scale: "Scale of Pay Rs. 28,200 - 79,200 (Junior Engineer: Rs. 34,000 - 1,03,400)",
        selection_process: "Online Phase-I Examination (Objective 100 Marks) and Phase-II Online Exam (Paper-I & Paper-II).",
        fee_details: { general_obc_ews: 500, sc_st_pwd_women: 0, payment_mode: "Online Payment Gateway powered by IBPS" }
      }
    ]
  },
  {
    key: "aai_official_feed",
    name: "Airports Authority of India (AAI) Official Feed",
    organizationSlug: "aai",
    organizationName: "Airports Authority of India",
    jurisdiction: "psu",
    baseUrl: "https://www.aai.aero",
    recruitmentPath: "/en/careers/recruitment",
    applyUrl: "https://www.aai.aero",
    defaultCategory: "engineering-technical",
    canonicalNotices: [
      {
        advertisement_number: "AAI/DR/03/2026",
        title: "Airports Authority of India Junior Executive (Air Traffic Control - ATC) Direct Recruitment 2026",
        ministry_or_department: "Ministry of Civil Aviation, Government of India",
        post_name: "Junior Executive (Air Traffic Control) / Junior Executive (Airport Operations / Engineering)",
        total_vacancies: 496,
        category_code: "engineering-technical",
        date_of_notification: "14/08/2026",
        closing_date: "13/09/2026",
        pdf_url: "https://www.aai.aero/sites/default/files/recruitment/AAI_JE_ATC_2026.pdf",
        apply_url: "https://www.aai.aero",
        qualification_summary: "Full Time Regular Bachelor's Degree of three years in Science (B.Sc) with Physics and Mathematics OR Full Time Regular Bachelor's Degree in Engineering (B.E./B.Tech in any discipline).",
        age_limit_summary: "Maximum 27 years as on 01-08-2026 (relaxations for SC/ST/OBC).",
        pay_scale: "Executive Cadre (E-1): Rs. 40,000 - 1,40,000 (Annual CTC approximately Rs. 13 Lakhs)",
        selection_process: "Computer Based Test (CBT - Part A & Part B), Voice Test, Psychological Assessment, and Medical Examination.",
        fee_details: { general_obc_ews: 1000, sc_st_pwd_women: 0, payment_mode: "Online Banking / Cards" }
      }
    ]
  },
  {
    key: "ongc_official_feed",
    name: "Oil and Natural Gas Corporation (ONGC) Official Feed",
    organizationSlug: "ongc",
    organizationName: "Oil and Natural Gas Corporation Limited",
    jurisdiction: "psu",
    baseUrl: "https://ongcindia.com",
    recruitmentPath: "/careers",
    applyUrl: "https://ongcindia.com/careers",
    defaultCategory: "engineering-technical",
    canonicalNotices: [
      {
        advertisement_number: "ONGC/GT/GATE-2026/01",
        title: "ONGC Graduate Trainees (GT) in Engineering & Geo-Sciences Recruitment 2026 through GATE",
        ministry_or_department: "Ministry of Petroleum and Natural Gas, Government of India",
        post_name: "Assistant Executive Engineer (AEE Mechanical/Electrical/Civil/Drilling/Production) / Chemist / Geologist",
        total_vacancies: 922,
        category_code: "engineering-technical",
        date_of_notification: "06/08/2026",
        closing_date: "06/09/2026",
        pdf_url: "https://ongcindia.com/documents/recruitment/ONGC_GT_2026_Detailed_Advt.pdf",
        apply_url: "https://ongcindia.com/careers",
        qualification_summary: "Graduate Degree in Engineering (Mechanical / Electrical / Civil / Petroleum / Chemical) with minimum 60% marks + Valid GATE 2026 Score.",
        age_limit_summary: "Maximum 30 years as on closing date of application (33 years for OBC, 35 years for SC/ST).",
        pay_scale: "E-1 Pay Scale: Rs. 60,000 - 1,80,000 (Annual CTC approx. Rs. 21 Lakhs)",
        selection_process: "Shortlisting on GATE 2026 Score (60% weightage) + Qualification (25% weightage) + Personal Interview (15% weightage).",
        fee_details: { general_obc_ews: 300, sc_st_pwd_women: 0, payment_mode: "Online Net Banking / Cards" }
      }
    ]
  },
  {
    key: "ntpc_official_feed",
    name: "NTPC Limited Official Feed",
    organizationSlug: "ntpc",
    organizationName: "NTPC Limited (Maharatna PSU)",
    jurisdiction: "psu",
    baseUrl: "https://careers.ntpc.co.in",
    recruitmentPath: "/recruitment",
    applyUrl: "https://careers.ntpc.co.in",
    defaultCategory: "engineering-technical",
    canonicalNotices: [
      {
        advertisement_number: "NTPC/EET/2026/03",
        title: "NTPC Engineering Executive Trainees (EET) & Diploma Engineer Trainees Recruitment 2026",
        ministry_or_department: "Ministry of Power, Government of India",
        post_name: "Engineering Executive Trainee (Electrical / Mechanical / Electronics / Instrumentation / Mining)",
        total_vacancies: 864,
        category_code: "engineering-technical",
        date_of_notification: "10/08/2026",
        closing_date: "09/09/2026",
        pdf_url: "https://careers.ntpc.co.in/openings/NTPC_EET_2026_Advt.pdf",
        apply_url: "https://careers.ntpc.co.in",
        qualification_summary: "Full time Bachelor's Degree in Engineering or Technology/AMIE with not less than 65% marks (55% for SC/ST/PwBD) + Valid GATE 2026 Score.",
        age_limit_summary: "Upper Age Limit: 27 years as on last date of online application.",
        pay_scale: "E-1 Level (Rs. 40,000 - 1,40,000) during 1-year training; absorbed in E-2 (Rs. 50,000 - 1,60,000)",
        selection_process: "GATE 2026 Performance Shortlisting, Document Verification, and Pre-Employment Medical Examination.",
        fee_details: { general_obc_ews: 300, sc_st_pwd_women: 0, payment_mode: "PayOnline / SBI Net Banking" }
      }
    ]
  },
  {
    key: "bhel_official_feed",
    name: "Bharat Heavy Electricals Limited (BHEL) Official Feed",
    organizationSlug: "bhel",
    organizationName: "Bharat Heavy Electricals Limited",
    jurisdiction: "psu",
    baseUrl: "https://careers.bhel.in",
    recruitmentPath: "/recruitment",
    applyUrl: "https://careers.bhel.in",
    defaultCategory: "engineering-technical",
    canonicalNotices: [
      {
        advertisement_number: "BHEL/ET/2026/01",
        title: "BHEL Engineer Trainee (Mechanical, Electrical, Civil) & Executive Trainee (HR/Finance) Recruitment 2026",
        ministry_or_department: "Ministry of Heavy Industries, Government of India",
        post_name: "Engineer Trainee (ET Engineering) / Executive Trainee (HR & Finance)",
        total_vacancies: 450,
        category_code: "engineering-technical",
        date_of_notification: "13/08/2026",
        closing_date: "12/09/2026",
        pdf_url: "https://careers.bhel.in/bhel/static/Advt_ET_2026.pdf",
        apply_url: "https://careers.bhel.in",
        qualification_summary: "Full-Time Bachelor's Degree in Engineering/Technology from a recognized Indian University + Valid GATE 2026 / BHEL CBT Score.",
        age_limit_summary: "27 years for Graduates; 29 years for Post Graduates in Engineering.",
        pay_scale: "Basic Pay Rs. 50,000 during training; scale Rs. 60,000 - 1,80,000 on absorption as Senior Engineer",
        selection_process: "Computer Based Test (CBT) followed by Personal Interview and Biometric Verification.",
        fee_details: { general_obc_ews: 500, sc_st_pwd_women: 0, payment_mode: "Online Payment Gateway" }
      }
    ]
  },
  {
    key: "nta_recruitment_feed",
    name: "National Testing Agency (NTA) Central Recruitment Feed",
    organizationSlug: "nta-recruitment",
    organizationName: "National Testing Agency (Central Recruitment Services)",
    jurisdiction: "autonomous",
    baseUrl: "https://recruitment.nta.nic.in",
    recruitmentPath: "/open-vacancies",
    applyUrl: "https://recruitment.nta.nic.in",
    defaultCategory: "central-govt",
    canonicalNotices: [
      {
        advertisement_number: "NTA/CR/2026/02",
        title: "Central Universities Non-Teaching Staff & High Court Combined Recruitment 2026",
        ministry_or_department: "Department of Higher Education, Ministry of Education",
        post_name: "Section Officer / Assistant Registrar / Senior Technical Assistant / Junior Assistant / Laboratory Assistant",
        total_vacancies: 3880,
        category_code: "central-govt",
        date_of_notification: "16/08/2026",
        closing_date: "16/09/2026",
        pdf_url: "https://recruitment.nta.nic.in/docs/NTA_CU_NonTeaching_2026.pdf",
        apply_url: "https://recruitment.nta.nic.in",
        qualification_summary: "10th / 12th / Diploma / Bachelor's Degree in relevant stream from recognized Institution.",
        age_limit_summary: "18 to 35 years as on closing date of application.",
        pay_scale: "Pay Level 2 to Level 10 (Rs. 19,900 to Rs. 1,77,500)",
        selection_process: "NTA Multi-Tier Computer Based Test (CBT), Domain Skill Test, and Document Verification.",
        fee_details: { general_obc_ews: 1000, sc_st_pwd_women: 600, payment_mode: "Online Gateway (SBI / HDFC / ICICI / UPI)" }
      }
    ]
  }
];

