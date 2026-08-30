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
  { key: "ssc_official_feed",
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
  { key: "rrb_official_feed",
    name: "Railway Recruitment Boards (RRB) Official Feed",
    organizationSlug: "rrb",
    organizationName: "Railway Recruitment Boards (Indian Railways)",
    jurisdiction: "central",
    baseUrl: "https://www.rrbcdg.gov.in",
    recruitmentPath: "/",
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
        pdf_url: "https://www.rrbcdg.gov.in/uploads/CEN_01_2026_ALP.pdf",
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
  { key: "ibps_official_feed",
    name: "Institute of Banking Personnel Selection (IBPS) Official Feed",
    organizationSlug: "ibps",
    organizationName: "Institute of Banking Personnel Selection",
    jurisdiction: "autonomous",
    baseUrl: "https://www.ibps.in",
    recruitmentPath: "/",
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
        pdf_url: "https://www.ibps.in/wp-content/uploads/CRP_PO_XVI_Detailed_Advertisement.pdf",
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
  { key: "sbi_official_feed",
    name: "State Bank of India (SBI Careers) Official Feed",
    organizationSlug: "sbi",
    organizationName: "State Bank of India",
    jurisdiction: "psu",
    baseUrl: "https://sbi.co.in",
    recruitmentPath: "/web/careers",
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
  { key: "india_post_official_feed",
    name: "Department of Posts (India Post GDS) Official Feed",
    organizationSlug: "india-post",
    organizationName: "Department of Posts (India Post)",
    jurisdiction: "central",
    baseUrl: "https://indiapostgdsonline.gov.in",
    recruitmentPath: "/",
    applyUrl: "https://indiapostgdsonline.gov.in/Registration_Registration.aspx",
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
        apply_url: "https://indiapostgdsonline.gov.in/Registration_Registration.aspx",
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
  { key: "drdo_official_feed",
    name: "DRDO (Recruitment & Assessment Centre) Official Feed",
    organizationSlug: "drdo",
    organizationName: "Defence Research and Development Organisation",
    jurisdiction: "autonomous",
    baseUrl: "https://rac.gov.in",
    recruitmentPath: "/",
    applyUrl: "https://rac.gov.in/index.php?lang=en&id=0",
    defaultCategory: "defence-police",
    canonicalNotices: [
      {
        advertisement_number: "DRDO-RAC-ADV-148/2026",
        title: "Recruitment of Scientist 'B' in DRDO & ADA via GATE / Descriptive Exam",
        ministry_or_department: "Ministry of Defence, Department of Defence R&D",
        post_name: "Scientist 'B'",
        total_vacancies: 224,
        category_code: "defence-police",
        date_of_notification: "14/08/2026",
        closing_date: "08/09/2026",
        pdf_url: "https://rac.gov.in/download/advt_148_scientist_b.pdf",
        apply_url: "https://rac.gov.in/index.php?lang=en&id=0",
        qualification_summary: "First Class Bachelor's Degree in Engineering or Technology in relevant discipline and valid GATE score.",
        age_limit_summary: "Not exceeding 28 years for Unreserved (UR). Relaxations: OBC (31 yrs), SC/ST (33 yrs).",
        pay_scale: "Level-10 of 7th CPC (Rs. 56,100 - 1,77,500)",
        selection_process: "Shortlisting based on GATE Score followed by Personal Interview at RAC Delhi.",
        fee_details: { general_obc_ews: 100, sc_st_pwd_women: 0, payment_mode: "RAC Online Payment Portal" }
      }
    ]
  },
  { key: "isro_official_feed",
    name: "ISRO (Centralised Recruitment Board - ICRB) Official Feed",
    organizationSlug: "isro",
    organizationName: "Indian Space Research Organisation",
    jurisdiction: "autonomous",
    baseUrl: "https://www.isro.gov.in",
    recruitmentPath: "/Careers.html",
    applyUrl: "https://www.isro.gov.in/Careers.html",
    defaultCategory: "engineering-technical",
    canonicalNotices: [
      {
        advertisement_number: "ISRO-ICRB-02(EM)/2026",
        title: "Recruitment of Scientist/Engineer 'SC' (Electronics, Mechanical, Computer Science)",
        ministry_or_department: "Department of Space, Government of India",
        post_name: "Scientist / Engineer 'SC'",
        total_vacancies: 303,
        category_code: "engineering-technical",
        date_of_notification: "01/08/2026",
        closing_date: "25/08/2026",
        pdf_url: "https://www.isro.gov.in/media_isro/pdf/Careers/ICRB_02_2026.pdf",
        apply_url: "https://www.isro.gov.in/Careers.html",
        qualification_summary: "BE/B.Tech or equivalent in relevant discipline with an aggregate minimum of 65% marks or CGPA 6.84/10.",
        age_limit_summary: "Maximum 28 years as on closing date.",
        pay_scale: "Level-10 (Rs. 56,100 basic + DA, HRA, Transport Allowance)",
        selection_process: "Written Test (80 MCQs) followed by Interview (1:5 ratio).",
        fee_details: { general_obc_ews: 250, sc_st_pwd_women: 0, payment_mode: "SBI Collect Online" }
      }
    ]
  },
  { key: "aiims_official_feed",
    name: "AIIMS (Examination Section) Official Feed",
    organizationSlug: "aiims",
    organizationName: "All India Institute of Medical Sciences (New Delhi)",
    jurisdiction: "autonomous",
    baseUrl: "https://aiimsexams.ac.in",
    recruitmentPath: "/",
    applyUrl: "https://rrp.aiimsexams.ac.in",
    defaultCategory: "medical-health",
    canonicalNotices: [
      {
        advertisement_number: "AIIMS/NORCET-07/2026",
        title: "Nursing Officer Recruitment Common Eligibility Test (NORCET-07) for AIIMS",
        ministry_or_department: "Ministry of Health & Family Welfare / AIIMS Institutions",
        post_name: "Nursing Officer (Staff Nurse Grade-II)",
        total_vacancies: 3500,
        category_code: "medical-health",
        date_of_notification: "15/08/2026",
        closing_date: "10/09/2026",
        pdf_url: "https://aiimsexams.ac.in/pdf/NORCET_07_Advertisement.pdf",
        apply_url: "https://rrp.aiimsexams.ac.in",
        qualification_summary: "B.Sc. (Hons.) Nursing / B.Sc. Nursing or Diploma in GNM with 2 years' experience in 50 bedded hospital.",
        age_limit_summary: "18 to 30 years as on closing date.",
        pay_scale: "Level-7 in Pay Matrix (Pre-revised PB-2 Rs. 9300-34800 with GP Rs. 4600)",
        selection_process: "NORCET Preliminary Stage-I followed by Stage-II Main CBT Examination.",
        fee_details: { general_obc_ews: 3000, sc_st_pwd_women: 2400, payment_mode: "Debit Card / Credit Card / Netbanking" }
      }
    ]
  },
  { key: "esic_official_feed",
    name: "Employees' State Insurance Corporation (ESIC) Official Feed",
    organizationSlug: "esic",
    organizationName: "Employees' State Insurance Corporation",
    jurisdiction: "autonomous",
    baseUrl: "https://www.esic.gov.in",
    recruitmentPath: "/recruitments",
    applyUrl: "https://www.esic.gov.in/recruitments",
    defaultCategory: "medical-health",
    canonicalNotices: [
      {
        advertisement_number: "ESIC-HQ-RECTT-2026/08",
        title: "Recruitment of Upper Division Clerk (UDC), Stenographer, and MTS across Regions",
        ministry_or_department: "Ministry of Labour & Employment, Government of India",
        post_name: "UDC / Stenographer / Multi-Tasking Staff (MTS)",
        total_vacancies: 3847,
        category_code: "central-govt",
        date_of_notification: "05/08/2026",
        closing_date: "31/08/2026",
        pdf_url: "https://www.esic.gov.in/attachments/recruitmentfile/ESIC_UDC_MTS_2026.pdf",
        apply_url: "https://www.esic.gov.in/recruitments",
        qualification_summary: "UDC: Degree; Steno: 12th Pass with 80 wpm typing; MTS: Matriculation 10th pass.",
        age_limit_summary: "18 to 27 years for UDC/Steno, 18 to 25 years for MTS.",
        pay_scale: "UDC/Steno: Level-4 (Rs. 25,500 - 81,100); MTS: Level-1 (Rs. 18,000 - 56,900)",
        selection_process: "Phase-I Prelims, Phase-II Mains, Phase-III Skill/Computer Test.",
        fee_details: { general_obc_ews: 500, sc_st_pwd_women: 250, payment_mode: "Online Payment Gateway" }
      }
    ]
  },
  { key: "epfo_official_feed",
    name: "Employees' Provident Fund Organisation (EPFO) Official Feed",
    organizationSlug: "epfo",
    organizationName: "Employees' Provident Fund Organisation",
    jurisdiction: "autonomous",
    baseUrl: "https://www.epfindia.gov.in",
    recruitmentPath: "/site_en/Recruitments.php",
    applyUrl: "https://www.epfindia.gov.in/site_en/Recruitments.php",
    defaultCategory: "central-govt",
    canonicalNotices: [
      {
        advertisement_number: "EPFO-SSA-2026/01",
        title: "Direct Recruitment to the Post of Social Security Assistant (SSA) & Stenographer",
        ministry_or_department: "Ministry of Labour and Employment, Govt. of India",
        post_name: "Social Security Assistant (SSA) / Stenographer",
        total_vacancies: 2859,
        category_code: "central-govt",
        date_of_notification: "12/08/2026",
        closing_date: "06/09/2026",
        pdf_url: "https://www.epfindia.gov.in/site_docs/PDFs/Recruitments_PDFs/SSA_2026_Advt.pdf",
        apply_url: "https://www.epfindia.gov.in/site_en/Recruitments.php",
        qualification_summary: "SSA: Bachelor's Degree with typing speed 35 wpm English / 30 wpm Hindi; Steno: 12th pass.",
        age_limit_summary: "18 to 27 years as on closing date.",
        pay_scale: "SSA: Level-5 (Rs. 29,200 - 92,300); Steno: Level-4 (Rs. 25,500 - 81,100)",
        selection_process: "Phase-I Computer Based Examination, Phase-II Computer Skill / Typing Test.",
        fee_details: { general_obc_ews: 700, sc_st_pwd_women: 0, payment_mode: "Online NTA Gateway" }
      }
    ]
  },
  { key: "bsf_official_feed",
    name: "Border Security Force (BSF Recruitment) Official Feed",
    organizationSlug: "bsf",
    organizationName: "Border Security Force (Ministry of Home Affairs)",
    jurisdiction: "central_police",
    baseUrl: "https://rectt.bsf.gov.in",
    recruitmentPath: "/",
    applyUrl: "https://rectt.bsf.gov.in/candidate/login",
    defaultCategory: "defence-police",
    canonicalNotices: [
      {
        advertisement_number: "BSF-RO-RM-2026/03",
        title: "Recruitment for the Post of Head Constable (Radio Operator) & HC (Radio Mechanic)",
        ministry_or_department: "Border Security Force, Ministry of Home Affairs",
        post_name: "Head Constable (RO) / Head Constable (RM)",
        total_vacancies: 1526,
        category_code: "defence-police",
        date_of_notification: "01/08/2026",
        closing_date: "30/08/2026",
        pdf_url: "https://rectt.bsf.gov.in/static/bsf_ro_rm_2026_advt.pdf",
        apply_url: "https://rectt.bsf.gov.in/candidate/login",
        qualification_summary: "Matriculation with 2-year ITI in Radio/TV/Electronics OR 12th Standard with PCM (minimum 60% aggregate).",
        age_limit_summary: "18 to 25 years as on closing date.",
        pay_scale: "Level-4 in Pay Matrix (Rs. 25,500 - 81,100)",
        selection_process: "Phase-I Written Exam (OMR), Phase-II PST/PET & Dictation Test, Phase-III Detailed Medical Exam.",
        fee_details: { general_obc_ews: 100, sc_st_pwd_women: 0, payment_mode: "BSF Online Portal SBI Gateway" }
      }
    ]
  },
  { key: "crpf_official_feed",
    name: "Central Reserve Police Force (CRPF Rectt) Official Feed",
    organizationSlug: "crpf",
    organizationName: "Central Reserve Police Force",
    jurisdiction: "central_police",
    baseUrl: "https://rect.crpf.gov.in",
    recruitmentPath: "/",
    applyUrl: "https://rect.crpf.gov.in/Application/Register",
    defaultCategory: "defence-police",
    canonicalNotices: [
      {
        advertisement_number: "CRPF-GD-CONSTABLE-2026",
        title: "Recruitment of Constable (General Duty) Male & Female in CRPF",
        ministry_or_department: "Central Reserve Police Force, MHA",
        post_name: "Constable (General Duty)",
        total_vacancies: 9212,
        category_code: "defence-police",
        date_of_notification: "10/08/2026",
        closing_date: "05/09/2026",
        pdf_url: "https://rect.crpf.gov.in/pdf/CRPF_GD_2026_Notice.pdf",
        apply_url: "https://rect.crpf.gov.in/Application/Register",
        qualification_summary: "Matriculation (10th Class Pass) from a recognized Board/University.",
        age_limit_summary: "18 to 23 years as on 01-08-2026.",
        pay_scale: "Pay Level-3 (Rs. 21,700 - 69,100)",
        selection_process: "Computer Based Test (CBT), Physical Standard Test (PST), Physical Efficiency Test (PET), Medical Exam.",
        fee_details: { general_obc_ews: 100, sc_st_pwd_women: 0, payment_mode: "Online Netbanking/UPI/Cards" }
      }
    ]
  },
  { key: "cisf_official_feed",
    name: "Central Industrial Security Force (CISF Rectt) Official Feed",
    organizationSlug: "cisf",
    organizationName: "Central Industrial Security Force",
    jurisdiction: "central_police",
    baseUrl: "https://cisfrectt.cisf.gov.in",
    recruitmentPath: "/",
    applyUrl: "https://cisfrectt.cisf.gov.in",
    defaultCategory: "defence-police",
    canonicalNotices: [
      {
        advertisement_number: "CISF-ASI-EXEC-2026",
        title: "Recruitment of Assistant Sub-Inspector (Executive) & Head Constable (Ministerial)",
        ministry_or_department: "Directorate General, Central Industrial Security Force",
        post_name: "ASI (Executive) / Head Constable (Ministerial)",
        total_vacancies: 836,
        category_code: "defence-police",
        date_of_notification: "08/08/2026",
        closing_date: "02/09/2026",
        pdf_url: "https://cisfrectt.cisf.gov.in/documents/ASI_HC_2026.pdf",
        apply_url: "https://cisfrectt.cisf.gov.in",
        qualification_summary: "Intermediate or Senior Secondary School Certificate (10+2) examination from recognized Board.",
        age_limit_summary: "18 to 25 years as on closing date.",
        pay_scale: "ASI: Level-5 (Rs. 29,200 - 92,300); HC: Level-4 (Rs. 25,500 - 81,100)",
        selection_process: "Physical Standard Test (PST) & Documentation, Written Exam (CBT/OMR), Skill Test, Medical Exam.",
        fee_details: { general_obc_ews: 100, sc_st_pwd_women: 0, payment_mode: "SBI e-Pay Online" }
      }
    ]
  },
  { key: "itbp_official_feed",
    name: "Indo-Tibetan Border Police (ITBP Recruitment) Official Feed",
    organizationSlug: "itbp",
    organizationName: "Indo-Tibetan Border Police",
    jurisdiction: "central_police",
    baseUrl: "https://recruitment.itbpolice.nic.in",
    recruitmentPath: "/",
    applyUrl: "https://recruitment.itbpolice.nic.in/applicant-profile-details/applicant-login",
    defaultCategory: "defence-police",
    canonicalNotices: [
      {
        advertisement_number: "ITBP-SI-OVERSEER-2026",
        title: "Recruitment to the Post of Sub-Inspector (Overseer / Civil Engineering)",
        ministry_or_department: "Indo-Tibetan Border Police Force, MHA",
        post_name: "Sub-Inspector (Overseer)",
        total_vacancies: 110,
        category_code: "defence-police",
        date_of_notification: "15/08/2026",
        closing_date: "12/09/2026",
        pdf_url: "https://recruitment.itbpolice.nic.in/notices/ITBP_SI_Overseer_2026.pdf",
        apply_url: "https://recruitment.itbpolice.nic.in/applicant-profile-details/applicant-login",
        qualification_summary: "Matriculation with Diploma in Civil Engineering from recognized institute.",
        age_limit_summary: "20 to 25 years as on closing date.",
        pay_scale: "Level-6 in Pay Matrix (Rs. 35,400 - 1,12,400)",
        selection_process: "PET/PST, Written Test, Documentation, Detailed Medical Examination (DME).",
        fee_details: { general_obc_ews: 200, sc_st_pwd_women: 0, payment_mode: "ITBP Portal Online Gateway" }
      }
    ]
  },
  { key: "ssb_official_feed",
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
  { key: "indian_army_official_feed",
    name: "Join Indian Army (Agniveer & Officers) Official Feed",
    organizationSlug: "indian-army",
    organizationName: "Indian Army",
    jurisdiction: "defence",
    baseUrl: "https://joinindianarmy.nic.in",
    recruitmentPath: "/army-openings",
    applyUrl: "https://joinindianarmy.nic.in/default.aspx",
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
        apply_url: "https://joinindianarmy.nic.in/default.aspx",
        qualification_summary: "Class 10th / Matric with 45% marks in aggregate (GD) or 10+2 with Physics, Chemistry, Math & English (Technical).",
        age_limit_summary: "17.5 to 21 years as on 01-10-2026.",
        pay_scale: "Customized Package Rs. 30,000 - 40,000/month plus Seva Nidhi Package on completion",
        selection_process: "Phase-I Online Common Entrance Examination (CEE), Phase-II Recruitment Rally & Medical.",
        fee_details: { general_obc_ews: 250, sc_st_pwd_women: 250, payment_mode: "Online Payment Gateway" }
      }
    ]
  },
  { key: "indian_navy_official_feed",
    name: "Join Indian Navy (Agniveer SSR/MR & Officers) Official Feed",
    organizationSlug: "indian-navy",
    organizationName: "Indian Navy",
    jurisdiction: "defence",
    baseUrl: "https://joinindiannavy.gov.in",
    recruitmentPath: "/navy-vacancies",
    applyUrl: "https://www.joinindiannavy.gov.in/en/account/login",
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
        apply_url: "https://www.joinindiannavy.gov.in/en/account/login",
        qualification_summary: "Passed 10+2 examination with Maths & Physics and at least one of these subjects: Chemistry/Biology/Computer Science.",
        age_limit_summary: "Born between 01 Nov 2005 and 30 Apr 2009 (both dates inclusive).",
        pay_scale: "Agniveer Package Rs. 30,000 to Rs. 40,000 with Seva Nidhi corpus",
        selection_process: "Shortlisting via INET / Computer Based Exam, Physical Fitness Test (PFT), and Final Medical at INS Chilka.",
        fee_details: { general_obc_ews: 550, sc_st_pwd_women: 550, payment_mode: "Online Netbanking/UPI" }
      }
    ]
  },
  { key: "indian_air_force_official_feed",
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
  { key: "bpsc_official_feed",
    name: "Bihar Public Service Commission (BPSC) Official Feed",
    organizationSlug: "bpsc",
    organizationName: "Bihar Public Service Commission",
    jurisdiction: "state",
    stateCode: "BR",
    baseUrl: "https://bpsc.bihar.gov.in",
    recruitmentPath: "/",
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
  { key: "uppsc_official_feed",
    name: "Uttar Pradesh Public Service Commission (UPPSC) Official Feed",
    organizationSlug: "uppsc",
    organizationName: "Uttar Pradesh Public Service Commission",
    jurisdiction: "state",
    stateCode: "UP",
    baseUrl: "https://uppsc.up.nic.in",
    recruitmentPath: "/CandidatePages/Notifications.aspx",
    applyUrl: "https://otr.pariksha.nic.in",
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
        apply_url: "https://otr.pariksha.nic.in",
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
  { key: "mppsc_official_feed",
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
  { key: "rpsc_official_feed",
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
  { key: "ukpsc_official_feed",
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
  { key: "jpsc_official_feed",
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
        apply_url: "https://jpsc.gov.in/online_application",
        qualification_summary: "Degree of any of the Universities incorporated by an Act of Central or State Legislature.",
        age_limit_summary: "21 to 35 years (General) as on 01-08-2026 (relaxations up to 40 years for SC/ST).",
        pay_scale: "Pay Level 9 (Rs. 53,100 - 1,67,800)",
        selection_process: "Preliminary Examination (2 Papers of 200 marks each), Main Written Examination (6 Papers), and Personality Test (100 Marks).",
        fee_details: { general_obc_ews: 100, sc_st_pwd_women: 50, payment_mode: "Online SBI Collect" }
      }
    ]
  },
  { key: "hpsc_official_feed",
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
        apply_url: "https://hpsc.gov.in/en-us/Online-Application-Form",
        qualification_summary: "Bachelor of Arts/Science/Commerce or an equivalent degree of a recognized University.",
        age_limit_summary: "18 to 42 years as on 01-01-2026 (DSP: 18 to 27 years).",
        pay_scale: "Level-10 (Rs. 56,100 - 1,77,500) and Level-7/8/9",
        selection_process: "Preliminary Examination (General Studies & CSAT), Main Written Examination (4 Papers), and Personality Test.",
        fee_details: { general_obc_ews: 1000, sc_st_pwd_women: 250, payment_mode: "Online Payment Gateway" }
      }
    ]
  },
  { key: "wbpsc_official_feed",
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
  { key: "opsc_official_feed",
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
  { key: "apsc_official_feed",
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
  { key: "sci_official_feed",
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
  { key: "patna_hc_official_feed",
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
  { key: "allahabad_hc_official_feed",
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
  { key: "delhi_hc_official_feed",
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
  { key: "ecourts_national_feed",
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
  { key: "bssc_official_feed",
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
  { key: "csbc_bihar_police_feed",
    name: "Central Selection Board of Constable (CSBC) Bihar Police Feed",
    organizationSlug: "csbc",
    organizationName: "Central Selection Board of Constable (Bihar Police)",
    jurisdiction: "state",
    stateCode: "BR",
    baseUrl: "https://csbc.bihar.gov.in",
    recruitmentPath: "/",
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
        apply_url: "https://csbc.bihar.gov.in/Advt/AdvtList.aspx",
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
  { key: "bpssc_police_feed",
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
        apply_url: "https://bpssc.bihar.gov.in/Advt/AdvtList.aspx",
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
  { key: "upsssc_official_feed",
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
        apply_url: "https://upsssc.gov.in/Default.aspx#candidate_login",
        qualification_summary: "Intermediate (10+2) passed with valid UPSSSC Preliminary Eligibility Test (PET) 2025/2026 Scorecard + CCC Certificate.",
        age_limit_summary: "18 to 40 years as on 01-07-2026 (relaxations applicable as per UP rules).",
        pay_scale: "Pay Band 1 (Rs. 5200-20200) Grade Pay Rs. 2000 (Revised Level 3: Rs. 21,700 - 69,100)",
        selection_process: "Shortlisting based on UPSSSC PET Score followed by Main Written Examination (100 Marks).",
        fee_details: { general_obc_ews: 25, sc_st_pwd_women: 25, payment_mode: "Online State Bank Collect / E-Challan" }
      }
    ]
  },
  { key: "upprpb_police_feed",
    name: "UP Police Recruitment and Promotion Board (UPPRPB) Official Feed",
    organizationSlug: "upprpb",
    organizationName: "Uttar Pradesh Police Recruitment and Promotion Board",
    jurisdiction: "state",
    stateCode: "UP",
    baseUrl: "https://uppbpb.gov.in",
    recruitmentPath: "/",
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
        apply_url: "https://uppbpb.gov.in/Notices",
        qualification_summary: "10+2 (Intermediate) passed from Board of High School and Intermediate Education UP or equivalent.",
        age_limit_summary: "18 to 25 years for Male, 18 to 28 years for Female (with 3-year age concession as per government order).",
        pay_scale: "Pay Band Rs. 5,200-20,200 with Grade Pay Rs. 2,000 (Pay Matrix Level 3: Rs. 21,700 - 69,100)",
        selection_process: "OMR Based Written Exam (300 Marks, 150 MCQs), Document Verification & Physical Standard Test (PST), Physical Efficiency Test (PET).",
        fee_details: { general_obc_ews: 400, sc_st_pwd_women: 400, payment_mode: "Online Payment Gateway" }
      }
    ]
  },
  { key: "rsmssb_official_feed",
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
  { key: "mpesb_vyapam_feed",
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
  { key: "hssc_official_feed",
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
        apply_url: "https://adv12024.hryssc.com",
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
  { key: "dsssb_official_feed",
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
  { key: "jeevika_bihar_feed",
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
  { key: "shsb_bihar_health_feed",
    name: "State Health Society Bihar (SHSB) Official Feed",
    organizationSlug: "shsb",
    organizationName: "State Health Society Bihar (NHM)",
    jurisdiction: "state",
    stateCode: "BR",
    baseUrl: "https://shs.bihar.gov.in",
    recruitmentPath: "/recruitment",
    applyUrl: "https://shs.bihar.gov.in/recruitment",
    defaultCategory: "medical-health",
    canonicalNotices: [
      {
        advertisement_number: "SHSB-CHO-2026/03",
        title: "Recruitment of Community Health Officers (CHO) under National Health Mission Bihar",
        ministry_or_department: "Health Department, Government of Bihar",
        post_name: "Community Health Officer (CHO)",
        total_vacancies: 4500,
        category_code: "medical-health",
        date_of_notification: "05/08/2026",
        closing_date: "05/09/2026",
        pdf_url: "https://shs.bihar.gov.in/recruitment/CHO_2026_Notification.pdf",
        apply_url: "https://shs.bihar.gov.in/recruitment",
        qualification_summary: "B.Sc. Nursing / Post Basic B.Sc. Nursing with Integrated Curriculum of Certificate Course in Community Health (CCH).",
        age_limit_summary: "21 to 42 years for UR (Male), 21 to 45 years for UR (Female)/BC/EBC, 21 to 47 years for SC/ST.",
        pay_scale: "Consolidated monthly pay of Rs. 40,000 (Rs. 32,000 fixed + Rs. 8,000 performance incentive)",
        selection_process: "Merit list based on aggregate marks in B.Sc Nursing and CCH followed by Document Verification.",
        fee_details: { general_obc_ews: 500, sc_st_pwd_women: 250, payment_mode: "Online Payment via Debit/Credit Card, Net Banking" },
        min_age: 21,
        max_age: 42,
        selection_stages: ["Academic Merit Evaluation (B.Sc Nursing / CCH score)", "Document Verification & Medical Fitness Test"]
      }
    ]
  },
  { key: "up_nhm_health_feed",
    name: "National Health Mission Uttar Pradesh (UP NHM) Official Feed",
    organizationSlug: "up-nhm",
    organizationName: "National Health Mission, Uttar Pradesh",
    jurisdiction: "state",
    stateCode: "UP",
    baseUrl: "https://upnrhm.gov.in",
    recruitmentPath: "/careers",
    applyUrl: "https://upnrhm.gov.in/careers",
    defaultCategory: "medical-health",
    canonicalNotices: [
      {
        advertisement_number: "UP-NHM-STAFFNURSE-2026",
        title: "Recruitment of Staff Nurses and ANMs under NHM Uttar Pradesh",
        ministry_or_department: "Medical Health and Family Welfare Department, UP",
        post_name: "Staff Nurse / Auxiliary Nurse Midwife (ANM)",
        total_vacancies: 5200,
        category_code: "medical-health",
        date_of_notification: "12/08/2026",
        closing_date: "12/09/2026",
        pdf_url: "https://upnrhm.gov.in/careers/Staff_Nurse_Advt_2026.pdf",
        apply_url: "https://upnrhm.gov.in/careers",
        qualification_summary: "Diploma in General Nursing and Midwifery (GNM) or B.Sc Nursing from a recognized Institution.",
        age_limit_summary: "18 to 40 years as on 01-08-2026.",
        pay_scale: "Honorarium Rs. 20,500 - Rs. 25,000 per month consolidated",
        selection_process: "Computer Based Test (CBT) followed by Document Verification.",
        fee_details: { general_obc_ews: 0, sc_st_pwd_women: 0, payment_mode: "Free Application" },
        min_age: 18,
        max_age: 40,
        selection_stages: ["Computer Based Test (100 Objective Questions)", "Document Verification"]
      }
    ]
  },
  { key: "bsphcl_power_feed",
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
  { key: "uppcl_power_feed",
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
  { key: "dlrs_bihar_revenue_feed",
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
  { key: "kvs_official_feed",
    name: "Kendriya Vidyalaya Sangathan (KVS) Official Feed",
    organizationSlug: "kvs",
    organizationName: "Kendriya Vidyalaya Sangathan",
    jurisdiction: "central",
    baseUrl: "https://kvsangathan.nic.in",
    recruitmentPath: "/employment-notice",
    applyUrl: "https://kvsangathan.nic.in/employment-notice",
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
        apply_url: "https://kvsangathan.nic.in/employment-notice",
        qualification_summary: "Senior Secondary with 50% marks + 2-year D.El.Ed / B.El.Ed + CTET Paper-I for PRT; Graduation + B.Ed + CTET Paper-II for TGT; Master's + B.Ed for PGT.",
        age_limit_summary: "30 years for PRT, 35 years for TGT, 40 years for PGT (10 years age relaxation for Women candidates).",
        pay_scale: "Pay Matrix Level 6 (Rs. 35,400 - 1,12,400) for PRT; Level 7 for TGT; Level 8 for PGT",
        selection_process: "Computer Based Test (CBT 180 Marks), Class Demo / Teaching Skill Test, and Professional Interview.",
        fee_details: { general_obc_ews: 1500, sc_st_pwd_women: 0, payment_mode: "Online Payment Gateway" }
      }
    ]
  },
  { key: "nvs_official_feed",
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
  { key: "fci_official_feed",
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
  { key: "aai_official_feed",
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
  { key: "ongc_official_feed",
    name: "Oil and Natural Gas Corporation (ONGC) Official Feed",
    organizationSlug: "ongc",
    organizationName: "Oil and Natural Gas Corporation Limited",
    jurisdiction: "psu",
    baseUrl: "https://ongcindia.com",
    recruitmentPath: "/web/eng/career",
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
  { key: "ntpc_official_feed",
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
  { key: "bhel_official_feed",
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
  { key: "nta_recruitment_feed",
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
  },
  {
    "key": "mpsc_official_feed",
    "name": "Maharashtra Public Service Commission (MPSC) Official Feed",
    "organizationSlug": "mpsc",
    "organizationName": "Maharashtra Public Service Commission",
    "jurisdiction": "state",
    "stateCode": "MH",
    "baseUrl": "https://mpsc.gov.in",
    "recruitmentPath": "/adv-notification",
    "applyUrl": "https://mpsconline.gov.in",
    "defaultCategory": "state-psc",
    "canonicalNotices": [
      {
        "advertisement_number": "MPSC/2026/01",
        "title": "Maharashtra Civil Services Combined Preliminary Examination 2026",
        "post_name": "Assistant Commissioner, Deputy Collector, DSP, Tehsildar",
        "total_vacancies": 685,
        "date_of_notification": "2026-02-15",
        "closing_date": "2026-03-30",
        "pdf_url": "https://mpsc.gov.in/download/adv_2026_01.pdf",
        "apply_url": "https://mpsconline.gov.in",
        "qualification_summary": "Bachelor's Degree in any discipline from a recognized University.",
        "age_limit_summary": "19 to 38 years (Age relaxation applicable as per Maharashtra Govt rules).",
        "pay_scale": "Pay Matrix Level S-15 to S-20 (₹41,800 - ₹1,77,500)",
        "min_age": 19,
        "max_age": 38
      }
    ]
  },

  {
    "key": "gpsc_official_feed",
    "name": "Gujarat Public Service Commission (GPSC) Official Feed",
    "organizationSlug": "gpsc",
    "organizationName": "Gujarat Public Service Commission",
    "jurisdiction": "state",
    "stateCode": "GJ",
    "baseUrl": "https://gpsc.gujarat.gov.in",
    "recruitmentPath": "/Advertisements",
    "applyUrl": "https://gpsc-ojas.gujarat.gov.in",
    "defaultCategory": "state-psc",
    "canonicalNotices": [
      {
        "advertisement_number": "GPSC/202627/01",
        "title": "Gujarat Administrative Service Class-1 and Gujarat Civil Services Class-1 & Class-2 Examination 2026",
        "post_name": "GAS Class-1, GPS Class-1, DDO Class-2",
        "total_vacancies": 420,
        "date_of_notification": "2026-02-20",
        "closing_date": "2026-03-28",
        "pdf_url": "https://gpsc.gujarat.gov.in/adv/202627_01.pdf",
        "apply_url": "https://gpsc-ojas.gujarat.gov.in",
        "qualification_summary": "Graduate in any faculty of any University established by law in India.",
        "age_limit_summary": "20 to 36 years as on application cutoff.",
        "pay_scale": "Pay Matrix Level 8 to 10 (₹44,900 - ₹1,42,400)",
        "min_age": 20,
        "max_age": 36
      }
    ]
  },

  {
    "key": "kpsc_official_feed",
    "name": "Karnataka Public Service Commission (KPSC) Official Feed",
    "organizationSlug": "kpsc",
    "organizationName": "Karnataka Public Service Commission",
    "jurisdiction": "state",
    "stateCode": "KA",
    "baseUrl": "https://kpsc.kar.nic.in",
    "recruitmentPath": "/notification.html",
    "applyUrl": "https://kpsconline.karnataka.gov.in",
    "defaultCategory": "state-psc",
    "canonicalNotices": [
      {
        "advertisement_number": "KPSC/KAS/2026",
        "title": "Karnataka Administrative Services (KAS Gazetted Probationers) Recruitment 2026",
        "post_name": "Assistant Commissioner, Tahsildar, Commercial Tax Officer",
        "total_vacancies": 384,
        "date_of_notification": "2026-02-18",
        "closing_date": "2026-03-25",
        "pdf_url": "https://kpsc.kar.nic.in/docs/kas_2026_notification.pdf",
        "apply_url": "https://kpsconline.karnataka.gov.in",
        "qualification_summary": "Must possess Bachelor's Degree or equivalent qualification.",
        "age_limit_summary": "21 to 35 years (Age relaxation applicable for Category 2A/2B/3A/3B/SC/ST).",
        "pay_scale": "Group A & B Scale (₹43,100 - ₹83,900)",
        "min_age": 21,
        "max_age": 35
      }
    ]
  },

  {
    "key": "tnpsc_official_feed",
    "name": "Tamil Nadu Public Service Commission (TNPSC) Official Feed",
    "organizationSlug": "tnpsc",
    "organizationName": "Tamil Nadu Public Service Commission",
    "jurisdiction": "state",
    "stateCode": "TN",
    "baseUrl": "https://www.tnpsc.gov.in",
    "recruitmentPath": "/english/notifications.aspx",
    "applyUrl": "https://apply.tnpscexams.in",
    "defaultCategory": "state-psc",
    "canonicalNotices": [
      {
        "advertisement_number": "TNPSC/02/2026",
        "title": "Combined Civil Services Examination-I (Group-I Services) Recruitment 2026",
        "post_name": "Deputy Collector, DSP (Category-I), Assistant Commissioner (Commercial Taxes)",
        "total_vacancies": 290,
        "date_of_notification": "2026-02-12",
        "closing_date": "2026-03-20",
        "pdf_url": "https://www.tnpsc.gov.in/notifications/02_2026_group1.pdf",
        "apply_url": "https://apply.tnpscexams.in",
        "qualification_summary": "A degree of any of the Universities incorporated by an Act of the Central or State Legislature in India.",
        "age_limit_summary": "21 to 34 years (40 years for SCs, SC(A)s, STs, MBCs/DCs, BC(OBCM)s, BCMs).",
        "pay_scale": "Level 22 (₹56,100 - ₹2,05,700)",
        "min_age": 21,
        "max_age": 34
      }
    ]
  },

  {
    "key": "tspsc_official_feed",
    "name": "Telangana Public Service Commission (TGPSC) Official Feed",
    "organizationSlug": "tspsc",
    "organizationName": "Telangana Public Service Commission",
    "jurisdiction": "state",
    "stateCode": "TS",
    "baseUrl": "https://www.tspsc.gov.in",
    "recruitmentPath": "/notifications",
    "applyUrl": "https://www.tspsc.gov.in",
    "defaultCategory": "state-psc",
    "canonicalNotices": [
      {
        "advertisement_number": "TGPSC/03/2026",
        "title": "Group-I Services Examination Recruitment 2026",
        "post_name": "Deputy Collector, DSP, District Registrar, Commercial Tax Officer",
        "total_vacancies": 563,
        "date_of_notification": "2026-02-10",
        "closing_date": "2026-03-22",
        "pdf_url": "https://www.tspsc.gov.in/docs/group1_2026.pdf",
        "apply_url": "https://www.tspsc.gov.in",
        "qualification_summary": "Bachelor's Degree in any discipline from a recognized University.",
        "age_limit_summary": "18 to 44 years as on July 1 of examination year.",
        "pay_scale": "Revised Pay Scale 2020 (₹54,220 - ₹1,33,630)",
        "min_age": 18,
        "max_age": 44
      }
    ]
  },

  {
    "key": "appsc_official_feed",
    "name": "Andhra Pradesh Public Service Commission (APPSC) Official Feed",
    "organizationSlug": "appsc",
    "organizationName": "Andhra Pradesh Public Service Commission",
    "jurisdiction": "state",
    "stateCode": "AP",
    "baseUrl": "https://psc.ap.gov.in",
    "recruitmentPath": "/Default.aspx",
    "applyUrl": "https://psc.ap.gov.in",
    "defaultCategory": "state-psc",
    "canonicalNotices": [
      {
        "advertisement_number": "APPSC/01/2026",
        "title": "Group-I Services Executive & Non-Executive Officers Recruitment 2026",
        "post_name": "Deputy Collector, DSP, Commercial Tax Officer, Municipal Commissioner",
        "total_vacancies": 310,
        "date_of_notification": "2026-02-14",
        "closing_date": "2026-03-26",
        "pdf_url": "https://psc.ap.gov.in/docs/group1_notif_2026.pdf",
        "apply_url": "https://psc.ap.gov.in",
        "qualification_summary": "Must hold a Bachelor's Degree of any recognized University in India.",
        "age_limit_summary": "18 to 42 years with standard government age relaxations.",
        "pay_scale": "RPS 2022 (₹54,060 - ₹1,40,510)",
        "min_age": 18,
        "max_age": 42
      }
    ]
  },

  {
    "key": "kpsc_kerala_official_feed",
    "name": "Kerala Public Service Commission (Kerala PSC) Official Feed",
    "organizationSlug": "kpsc-kerala",
    "organizationName": "Kerala Public Service Commission",
    "jurisdiction": "state",
    "stateCode": "KL",
    "baseUrl": "https://www.keralapsc.gov.in",
    "recruitmentPath": "/notifications",
    "applyUrl": "https://thulasi.psc.kerala.gov.in",
    "defaultCategory": "state-psc",
    "canonicalNotices": [
      {
        "advertisement_number": "KPSC/CAT/2026/01",
        "title": "Kerala Administrative Service (KAS Junior Time Scale) Recruitment 2026",
        "post_name": "KAS Officer (Junior Time Scale Trainee)",
        "total_vacancies": 105,
        "date_of_notification": "2026-02-11",
        "closing_date": "2026-03-24",
        "pdf_url": "https://www.keralapsc.gov.in/notif/kas_2026.pdf",
        "apply_url": "https://thulasi.psc.kerala.gov.in",
        "qualification_summary": "Must have acquired a Bachelor Degree in any subject including professional course from a recognized University.",
        "age_limit_summary": "21 to 32 years (Relaxations applicable for OBC/SC/ST).",
        "pay_scale": "KAS Junior Time Scale (₹55,200 - ₹1,15,300)",
        "min_age": 21,
        "max_age": 32
      }
    ]
  },

  {
    "key": "cgpsc_official_feed",
    "name": "Chhattisgarh Public Service Commission (CGPSC) Official Feed",
    "organizationSlug": "cgpsc",
    "organizationName": "Chhattisgarh Public Service Commission",
    "jurisdiction": "state",
    "stateCode": "CG",
    "baseUrl": "https://psc.cg.gov.in",
    "recruitmentPath": "/Advertisements.htm",
    "applyUrl": "https://psc.cg.gov.in",
    "defaultCategory": "state-psc",
    "canonicalNotices": [
      {
        "advertisement_number": "CGPSC/SSE/2026",
        "title": "State Service Examination 2026 (State Civil & Police Services)",
        "post_name": "Deputy Collector, DSP, Accounts Officer, Naib Tehsildar",
        "total_vacancies": 242,
        "date_of_notification": "2026-02-16",
        "closing_date": "2026-03-25",
        "pdf_url": "https://psc.cg.gov.in/pdf/Advt_SSE_2026.pdf",
        "apply_url": "https://psc.cg.gov.in",
        "qualification_summary": "Degree of a University incorporated by an Act of the Central or State Legislature in India.",
        "age_limit_summary": "21 to 35 years (Domicile relaxation up to 40 years).",
        "pay_scale": "Pay Matrix Level 12 (₹56,100 - ₹1,77,500)",
        "min_age": 21,
        "max_age": 35
      }
    ]
  },

  {
    "key": "hppsc_official_feed",
    "name": "Himachal Pradesh Public Service Commission (HPPSC) Official Feed",
    "organizationSlug": "hppsc",
    "organizationName": "Himachal Pradesh Public Service Commission",
    "jurisdiction": "state",
    "stateCode": "HP",
    "baseUrl": "http://www.hppsc.hp.gov.in",
    "recruitmentPath": "/hppsc/Advertisements",
    "applyUrl": "http://www.hppsc.hp.gov.in/hppsc",
    "defaultCategory": "state-psc",
    "canonicalNotices": [
      {
        "advertisement_number": "HPPSC/HPAS/2026",
        "title": "Himachal Pradesh Administrative Services Combined Competitive Examination 2026",
        "post_name": "HPAS, Himachal Pradesh Police Service, Tehsildar, BDO",
        "total_vacancies": 88,
        "date_of_notification": "2026-02-15",
        "closing_date": "2026-03-28",
        "pdf_url": "http://www.hppsc.hp.gov.in/docs/hpas_2026.pdf",
        "apply_url": "http://www.hppsc.hp.gov.in/hppsc",
        "qualification_summary": "A candidate must possess a Bachelor's Degree or its equivalent from a recognized University.",
        "age_limit_summary": "21 to 35 years as on 1st January 2026.",
        "pay_scale": "Pay Matrix Level 18 (₹56,100 - ₹1,77,500)",
        "min_age": 21,
        "max_age": 35
      }
    ]
  },

  {
    "key": "jkpsc_official_feed",
    "name": "Jammu and Kashmir Public Service Commission (JKPSC) Official Feed",
    "organizationSlug": "jkpsc",
    "organizationName": "Jammu & Kashmir Public Service Commission",
    "jurisdiction": "state",
    "stateCode": "JK",
    "baseUrl": "https://jkpsc.nic.in",
    "recruitmentPath": "/notifications.html",
    "applyUrl": "https://jkpsc.nic.in",
    "defaultCategory": "state-psc",
    "canonicalNotices": [
      {
        "advertisement_number": "JKPSC/CCE/2026",
        "title": "J&K Combined Competitive (Preliminary & Main) Examination 2026",
        "post_name": "Junior Scale of J&K Administrative Service, Police Service, Accounts Service",
        "total_vacancies": 195,
        "date_of_notification": "2026-02-12",
        "closing_date": "2026-03-25",
        "pdf_url": "https://jkpsc.nic.in/docs/cce_2026.pdf",
        "apply_url": "https://jkpsc.nic.in",
        "qualification_summary": "Bachelor's Degree in any subject from a recognized Indian University.",
        "age_limit_summary": "21 to 32 years (Relaxations for reserved categories as per UT rules).",
        "pay_scale": "Level 8 (₹47,600 - ₹1,51,100)",
        "min_age": 21,
        "max_age": 32
      }
    ]
  },

  {
    "key": "rbi_nabard_official_feed",
    "name": "Reserve Bank of India & NABARD Official Recruitment Feed",
    "organizationSlug": "rbi",
    "organizationName": "Reserve Bank of India",
    "jurisdiction": "central",
    "stateCode": "MH",
    "baseUrl": "https://www.rbi.org.in",
    "recruitmentPath": "/Scripts/bs_viewcontent.aspx?Id=1060",
    "applyUrl": "https://ibpsonline.ibps.in/rbioffjan26",
    "defaultCategory": "banking",
    "canonicalNotices": [
      {
        "advertisement_number": "RBI/2026/01",
        "title": "Recruitment for the Posts of Officers in Grade 'B' (General / DEPR / DSIM) - PY 2026",
        "post_name": "Officers in Grade 'B' (General, DEPR, DSIM)",
        "total_vacancies": 291,
        "date_of_notification": "2026-02-10",
        "closing_date": "2026-03-20",
        "pdf_url": "https://rbidocs.rbi.org.in/rdocs/Content/PDFs/GRBOFF2026.pdf",
        "apply_url": "https://ibpsonline.ibps.in/rbioffjan26",
        "qualification_summary": "Graduation in any discipline with minimum 60% marks (50% for SC/ST/PwBD) or equivalent technical qualification.",
        "age_limit_summary": "21 to 30 years as on 1st January 2026.",
        "pay_scale": "Basic Pay ₹55,200 per month (Total gross emoluments approximately ₹1,16,684/month)",
        "min_age": 21,
        "max_age": 30
      }
    ]
  },

  {
    "key": "hal_bel_official_feed",
    "name": "Defence PSUs Recruitment Feed (HAL / BEL / BDL / MDL)",
    "organizationSlug": "hal",
    "organizationName": "Hindustan Aeronautics Limited",
    "jurisdiction": "psu",
    "stateCode": "KA",
    "baseUrl": "https://hal-india.co.in",
    "recruitmentPath": "/Careers/30",
    "applyUrl": "https://hal-india.co.in/careers",
    "defaultCategory": "psu-jobs",
    "canonicalNotices": [
      {
        "advertisement_number": "HAL/HR/MT-ET/2026",
        "title": "Recruitment of Management Trainees (Technical & Non-Technical) and Design Trainees 2026",
        "post_name": "Management Trainee (Technical), Design Trainee",
        "total_vacancies": 380,
        "date_of_notification": "2026-02-14",
        "closing_date": "2026-03-24",
        "pdf_url": "https://hal-india.co.in/docs/MT_DT_2026_Advt.pdf",
        "apply_url": "https://hal-india.co.in/careers",
        "qualification_summary": "Full Time Bachelor's Degree in Engineering / Technology (Mechanical, Electrical, Electronics, Aeronautical, Computer Science) with minimum 65% aggregate.",
        "age_limit_summary": "Upper age limit 28 years as on closing date.",
        "pay_scale": "Grade II (₹40,000 - ₹1,40,000 during training; ₹50,000 - ₹1,60,000 on absorption)",
        "min_age": 21,
        "max_age": 28
      }
    ]
  },

  {
    "key": "rfcl_official_feed",
    "name": "Ramagundam Fertilizers and Chemicals Limited (RFCL) Official Feed",
    "organizationSlug": "rfcl",
    "organizationName": "Ramagundam Fertilizers and Chemicals Limited",
    "jurisdiction": "psu",
    "baseUrl": "https://www.rfcl.co.in",
    "recruitmentPath": "/careers.php",
    "applyUrl": "https://www.rfcl.co.in/careers.php",
    "defaultCategory": "psu-jobs",
    "canonicalNotices": [
      {
        "advertisement_number": "RFCL/Rectt/2026/01",
        "title": "RFCL Management Trainee & Non-Executive Recruitment 2026",
        "ministry_or_department": "Ministry of Chemicals and Fertilizers, Government of India",
        "post_name": "Management Trainee (Chemical / Mechanical / Electrical / Accounts)",
        "total_vacancies": 48,
        "date_of_notification": "2026-02-12",
        "closing_date": "2026-03-25",
        "pdf_url": "https://www.rfcl.co.in/careers.php",
        "apply_url": "https://www.rfcl.co.in/careers.php",
        "qualification_summary": "Degree in Engineering (Chemical/Mechanical/Electrical) with minimum 60% marks OR CA/CMA/MBA for Finance.",
        "age_limit_summary": "18 to 30 years as on closing date (relaxations for SC/ST/OBC).",
        "pay_scale": "E-1 Scale: Rs. 40,000 - 1,40,000",
        "min_age": 18,
        "max_age": 30
      }
    ]
  },

  {
    "key": "eil_official_feed",
    "name": "Engineers India Limited (EIL) Official Feed",
    "organizationSlug": "eil",
    "organizationName": "Engineers India Limited",
    "jurisdiction": "psu",
    "baseUrl": "https://engineersindia.com",
    "recruitmentPath": "/careers",
    "applyUrl": "https://recruitment.eil.co.in",
    "defaultCategory": "psu-jobs",
    "canonicalNotices": [
      {
        "advertisement_number": "HRD/Rectt/Advt/2026-02",
        "title": "Engineers India Limited (EIL) Management Trainee & Executive Recruitment 2026",
        "ministry_or_department": "Ministry of Petroleum and Natural Gas, Government of India",
        "post_name": "Management Trainee (Engineering / Civil / Mechanical / Chemical / Electrical)",
        "total_vacancies": 65,
        "date_of_notification": "2026-02-10",
        "closing_date": "2026-03-20",
        "pdf_url": "https://recruitment.eil.co.in/hrd/advt2026.asp",
        "apply_url": "https://recruitment.eil.co.in",
        "qualification_summary": "Full time Engineering Degree (B.E./B.Tech/B.Sc. Engg) in relevant discipline with minimum 65% marks.",
        "age_limit_summary": "Maximum 25 years as on 01-02-2026 (relaxations applicable as per GOI norms).",
        "pay_scale": "Executive Grade (E-1): Rs. 60,000 - 1,80,000",
        "min_age": 21,
        "max_age": 25
      }
    ]
  },

  {
    "key": "nic_nielit_official_feed",
    "name": "National Informatics Centre (NIC) / NIELIT Official Feed",
    "organizationSlug": "nic",
    "organizationName": "National Informatics Centre",
    "jurisdiction": "central",
    "baseUrl": "https://www.nic.in",
    "recruitmentPath": "/recruitment",
    "applyUrl": "https://www.calicut.nielit.in/nic2026",
    "defaultCategory": "central-govt",
    "canonicalNotices": [
      {
        "advertisement_number": "NIELIT/NIC/2026/1",
        "title": "National Informatics Centre (NIC) Scientist-B & Scientific Officer Recruitment 2026",
        "ministry_or_department": "Ministry of Electronics and Information Technology (MeitY), Government of India",
        "post_name": "Scientist-B / Scientific Officer / Scientific/Technical Assistant-A",
        "total_vacancies": 598,
        "date_of_notification": "2026-02-05",
        "closing_date": "2026-03-18",
        "pdf_url": "https://www.calicut.nielit.in/nic2026/advt.pdf",
        "apply_url": "https://www.calicut.nielit.in/nic2026",
        "qualification_summary": "Bachelor Degree in Engineering / Technology (CS, IT, Electronics, ECE) or M.Sc / MCA.",
        "age_limit_summary": "Up to 30 years as on closing date (33 for OBC, 35 for SC/ST).",
        "pay_scale": "Level-10 (Rs. 56,100 - 1,77,500) for Scientist-B; Level-6 for Scientific Assistant",
        "min_age": 21,
        "max_age": 30
      }
    ]
  },

  {
    "key": "indiapost_official_feed",
    "name": "Department of Posts (India Post) Official Feed",
    "organizationSlug": "india-post",
    "organizationName": "Department of Posts (India Post)",
    "jurisdiction": "central",
    "baseUrl": "https://www.indiapost.gov.in",
    "recruitmentPath": "/VAS/Pages/Recruitment.aspx",
    "applyUrl": "https://indiapostgdsonline.gov.in",
    "defaultCategory": "central-govt",
    "canonicalNotices": [
      {
        "advertisement_number": "17-21/2026-GDS",
        "title": "India Post Gramin Dak Sevak (GDS) & Staff Car Driver Recruitment 2026",
        "ministry_or_department": "Ministry of Communications, Government of India",
        "post_name": "Branch Postmaster (BPM) / Assistant Branch Postmaster (ABPM) / Dak Sevak",
        "total_vacancies": 44228,
        "date_of_notification": "2026-02-08",
        "closing_date": "2026-03-15",
        "pdf_url": "https://indiapostgdsonline.gov.in/notification_2026.pdf",
        "apply_url": "https://indiapostgdsonline.gov.in",
        "qualification_summary": "Secondary School Examination pass certificate of 10th standard with passing marks in Mathematics and English.",
        "age_limit_summary": "18 to 40 years as on closing date.",
        "pay_scale": "TRCA Slab: Rs. 12,000 - 29,380 (BPM) / Rs. 10,000 - 24,470 (ABPM/Dak Sevak)",
        "min_age": 18,
        "max_age": 40
      }
    ]
  },

  {
    "key": "incometax_official_feed",
    "name": "Income Tax Department Official Feed",
    "organizationSlug": "income-tax-department",
    "organizationName": "Income Tax Department",
    "jurisdiction": "central",
    "baseUrl": "https://incometaxindia.gov.in",
    "recruitmentPath": "/Pages/recruitment.aspx",
    "applyUrl": "https://incometaxindia.gov.in",
    "defaultCategory": "central-govt",
    "canonicalNotices": [
      {
        "advertisement_number": "Pr.CCIT/Admn/Canteen/2026/04",
        "title": "Income Tax Department Recruitment 2026 – 7 Canteen Attendant Posts",
        "ministry_or_department": "Central Board of Direct Taxes (CBDT), Department of Revenue, Ministry of Finance",
        "post_name": "Canteen Attendant (Departmental Canteen)",
        "total_vacancies": 7,
        "date_of_notification": "2026-02-14",
        "closing_date": "2026-03-28",
        "pdf_url": "https://incometaxindia.gov.in/Documents/canteen-attendant-2026.pdf",
        "apply_url": "https://incometaxindia.gov.in",
        "qualification_summary": "10th Class / Matriculation pass or equivalent from a recognized Board.",
        "age_limit_summary": "18 to 25 years as on closing date (relaxations for reserved categories).",
        "pay_scale": "Level-1 in the Pay Matrix (Rs. 18,000 - 56,900)",
        "min_age": 18,
        "max_age": 25
      }
    ]
  },

  {
    "key": "incometax_pune_official_feed",
    "name": "Income Tax Department Pune Sports Quota Official Feed",
    "organizationSlug": "income-tax-pune",
    "organizationName": "Income Tax Department (Pune Region)",
    "jurisdiction": "central",
    "stateCode": "MH",
    "baseUrl": "https://incometaxpune.gov.in",
    "recruitmentPath": "/sports-quota",
    "applyUrl": "https://incometaxpune.gov.in",
    "defaultCategory": "central-govt",
    "canonicalNotices": [
      {
        "advertisement_number": "CCIT/PUNE/SPORTS/2026-27",
        "title": "Income Tax Department Pune Sports Quota Recruitment 2026",
        "ministry_or_department": "Office of the Principal Chief Commissioner of Income Tax, Pune (Maharashtra Region)",
        "post_name": "Income Tax Inspector / Tax Assistant / Multi-Tasking Staff (MTS)",
        "total_vacancies": 24,
        "date_of_notification": "2026-02-12",
        "closing_date": "2026-03-26",
        "pdf_url": "https://incometaxpune.gov.in/sports-quota-advt-2026.pdf",
        "apply_url": "https://incometaxpune.gov.in",
        "qualification_summary": "Degree from recognized University for Inspector & Tax Assistant; 10th/12th for MTS + Meritorious sports achievements.",
        "age_limit_summary": "18 to 30 years for Inspector; 18 to 27 years for Tax Assistant; 18 to 25 years for MTS.",
        "pay_scale": "Pay Level 7 (Inspector) / Level 4 (Tax Assistant) / Level 1 (MTS)",
        "min_age": 18,
        "max_age": 30
      }
    ]
  },

  // =========================================================================
  // CENTRAL GOVERNMENT & AUTONOMOUS RECRUITING BODIES
  // =========================================================================
  {
    "key": "cbic_official_feed",
    "name": "Central Board of Indirect Taxes & Customs (CBIC) Official Feed",
    "organizationSlug": "cbic",
    "organizationName": "Central Board of Indirect Taxes & Customs",
    "jurisdiction": "central",
    "baseUrl": "https://www.cbic.gov.in",
    "recruitmentPath": "/departmental-officers/recruitment",
    "applyUrl": "https://ssc.gov.in",
    "defaultCategory": "central-govt",
    "canonicalNotices": [
      {
        "advertisement_number": "CBIC/Rectt/Havaldar-Driver/2026",
        "title": "CBIC Inspector, Havaldar & Staff Car Driver Recruitment 2026",
        "ministry_or_department": "Department of Revenue, Ministry of Finance, Government of India",
        "post_name": "Inspector (Central Excise / Preventive Officer / Examiner) / Havaldar",
        "total_vacancies": 1420,
        "date_of_notification": "2026-02-16",
        "closing_date": "2026-03-30",
        "pdf_url": "https://www.cbic.gov.in/notices/CBIC_Havaldar_Recruitment_2026.pdf",
        "apply_url": "https://ssc.gov.in",
        "qualification_summary": "Graduation for Inspector posts; 10th/Matriculation pass for Havaldar posts.",
        "age_limit_summary": "18 to 27 years (Inspector/Havaldar) with statutory relaxations.",
        "pay_scale": "Level 7 (Inspector) / Level 1 (Havaldar)",
        "min_age": 18,
        "max_age": 27
      }
    ]
  },

  {
    "key": "csir_official_feed",
    "name": "Council of Scientific & Industrial Research (CSIR) Official Feed",
    "organizationSlug": "csir",
    "organizationName": "Council of Scientific and Industrial Research",
    "jurisdiction": "autonomous",
    "baseUrl": "https://www.csir.res.in",
    "recruitmentPath": "/career-opportunities/recruitment",
    "applyUrl": "https://www.csir.res.in/career-opportunities/recruitment",
    "defaultCategory": "engineering-technical",
    "canonicalNotices": [
      {
        "advertisement_number": "CSIR/CASE/SO-ASO/2026",
        "title": "CSIR Combined Administrative Services Examination (CASE) 2026 for SO & ASO",
        "ministry_or_department": "Ministry of Science and Technology, Government of India",
        "post_name": "Section Officer (Gen/F&A/S&P) and Assistant Section Officer (Gen/F&A/S&P)",
        "total_vacancies": 444,
        "date_of_notification": "2026-02-14",
        "closing_date": "2026-03-28",
        "pdf_url": "https://www.csir.res.in/sites/default/files/CASE_2026_Advt.pdf",
        "apply_url": "https://www.csir.res.in",
        "qualification_summary": "University Degree in any discipline from a recognized University or Institution.",
        "age_limit_summary": "Not exceeding 33 years as on closing date.",
        "pay_scale": "Pay Level 8 (SO) / Level 7 (ASO)",
        "min_age": 21,
        "max_age": 33
      }
    ]
  },

  {
    "key": "icmr_official_feed",
    "name": "Indian Council of Medical Research (ICMR) Official Feed",
    "organizationSlug": "icmr",
    "organizationName": "Indian Council of Medical Research",
    "jurisdiction": "autonomous",
    "baseUrl": "https://main.icmr.nic.in",
    "recruitmentPath": "/career-opportunity",
    "applyUrl": "https://main.icmr.nic.in/career-opportunity",
    "defaultCategory": "medical-health",
    "canonicalNotices": [
      {
        "advertisement_number": "ICMR/HQ/Scientist-B-C/2026",
        "title": "ICMR National Recruitment for Scientists (Medical / Non-Medical) & Technical Officers",
        "ministry_or_department": "Department of Health Research, Ministry of Health and Family Welfare",
        "post_name": "Scientist-B / Scientist-C / Technical Officer-A",
        "total_vacancies": 168,
        "date_of_notification": "2026-02-18",
        "closing_date": "2026-03-31",
        "pdf_url": "https://main.icmr.nic.in/content/recruitment-scientists-2026",
        "apply_url": "https://main.icmr.nic.in",
        "qualification_summary": "MBBS / First Class Master's Degree in Life Sciences, Biotechnology, Microbiology or B.Tech.",
        "age_limit_summary": "35 years for Scientist-B; 40 years for Scientist-C.",
        "pay_scale": "Level 10 (Rs. 56,100 - 1,77,500) to Level 11",
        "min_age": 21,
        "max_age": 40
      }
    ]
  },

  {
    "key": "icar_official_feed",
    "name": "Indian Council of Agricultural Research & ASRB Official Feed",
    "organizationSlug": "icar",
    "organizationName": "Indian Council of Agricultural Research (ASRB)",
    "jurisdiction": "autonomous",
    "baseUrl": "https://icar.org.in",
    "recruitmentPath": "/recruitment",
    "applyUrl": "http://asrb.org.in",
    "defaultCategory": "central-govt",
    "canonicalNotices": [
      {
        "advertisement_number": "ASRB/NET-ARS/2026/01",
        "title": "Agricultural Research Service (ARS) & Administrative Officer Recruitment 2026",
        "ministry_or_department": "Department of Agricultural Research and Education (DARE), Ministry of Agriculture",
        "post_name": "Scientist / Administrative Officer (AO) / Finance & Accounts Officer (FAO)",
        "total_vacancies": 260,
        "date_of_notification": "2026-02-10",
        "closing_date": "2026-03-24",
        "pdf_url": "http://asrb.org.in/notices/ARS_2026_Notification.pdf",
        "apply_url": "http://asrb.org.in",
        "qualification_summary": "Master's Degree in relevant agricultural discipline or Graduation for AO/FAO.",
        "age_limit_summary": "21 to 35 years as on 01-01-2026.",
        "pay_scale": "Pay Level 10 (Rs. 56,100 - 1,77,500)",
        "min_age": 21,
        "max_age": 35
      }
    ]
  },

  {
    "key": "bis_official_feed",
    "name": "Bureau of Indian Standards (BIS) Official Feed",
    "organizationSlug": "bis",
    "organizationName": "Bureau of Indian Standards",
    "jurisdiction": "autonomous",
    "baseUrl": "https://www.bis.gov.in",
    "recruitmentPath": "/recruitment",
    "applyUrl": "https://www.bis.gov.in",
    "defaultCategory": "central-govt",
    "canonicalNotices": [
      {
        "advertisement_number": "BIS/Rectt/2026/01",
        "title": "Bureau of Indian Standards (BIS) Scientist-B & Assistant Section Officer Recruitment 2026",
        "ministry_or_department": "Ministry of Consumer Affairs, Food & Public Distribution",
        "post_name": "Scientist-B (Engineering/Chemistry) & Graduate Group B/C Posts",
        "total_vacancies": 345,
        "date_of_notification": "2026-02-15",
        "closing_date": "2026-03-29",
        "pdf_url": "https://www.bis.gov.in/wp-content/uploads/2026/02/BIS_Recruitment_2026.pdf",
        "apply_url": "https://www.bis.gov.in",
        "qualification_summary": "Bachelor Degree in Engineering/Technology with valid GATE score or Master's Degree.",
        "age_limit_summary": "21 to 30 years as on closing date.",
        "pay_scale": "Level 10 (Scientist-B) / Level 6 (ASO)",
        "min_age": 21,
        "max_age": 30
      }
    ]
  },

  {
    "key": "cbi_official_feed",
    "name": "Central Bureau of Investigation (CBI) Official Feed",
    "organizationSlug": "cbi",
    "organizationName": "Central Bureau of Investigation",
    "jurisdiction": "central",
    "baseUrl": "https://cbi.gov.in",
    "recruitmentPath": "/vacancies",
    "applyUrl": "https://cbi.gov.in",
    "defaultCategory": "police-jobs",
    "canonicalNotices": [
      {
        "advertisement_number": "CBI/Estt/SI-Law/2026",
        "title": "CBI Direct Recruitment for Sub-Inspectors, Public Prosecutors & Cyber Forensic Experts",
        "ministry_or_department": "Department of Personnel and Training (DoPT), Government of India",
        "post_name": "Sub-Inspector (CBI) / Assistant Public Prosecutor / Cyber Technical Officer",
        "total_vacancies": 125,
        "date_of_notification": "2026-02-12",
        "closing_date": "2026-03-26",
        "pdf_url": "https://cbi.gov.in/vacancies_pdf/CBI_Recruitment_2026.pdf",
        "apply_url": "https://cbi.gov.in",
        "qualification_summary": "Graduation in Law / Computer Science / IT or Degree from recognized University.",
        "age_limit_summary": "20 to 30 years as on closing date.",
        "pay_scale": "Pay Level 7 (Rs. 44,900 - 1,42,400) plus 25% Special Security Allowance",
        "min_age": 20,
        "max_age": 30
      }
    ]
  },

  {
    "key": "barc_official_feed",
    "name": "Bhabha Atomic Research Centre (BARC) & DAE Official Feed",
    "organizationSlug": "barc",
    "organizationName": "Bhabha Atomic Research Centre",
    "jurisdiction": "central",
    "baseUrl": "https://barc.gov.in",
    "recruitmentPath": "/careers/recruitment.html",
    "applyUrl": "https://barcrecruit.gov.in",
    "defaultCategory": "engineering-technical",
    "canonicalNotices": [
      {
        "advertisement_number": "BARC/OCES-DGFS/2026",
        "title": "BARC Scientific Officers Recruitment 2026 through OCES / DGFS Schemes",
        "ministry_or_department": "Department of Atomic Energy (DAE), Government of India",
        "post_name": "Scientific Officer Grade C (Engineering / Physics / Chemistry / Bioscience)",
        "total_vacancies": 410,
        "date_of_notification": "2026-02-08",
        "closing_date": "2026-03-22",
        "pdf_url": "https://barcrecruit.gov.in/barcrecruit/main_page.jsp?doc=OCES_2026.pdf",
        "apply_url": "https://barcrecruit.gov.in",
        "qualification_summary": "B.E. / B.Tech / B.Sc (Engineering) / 5-year Integrated M.Tech with minimum 60% aggregate marks.",
        "age_limit_summary": "18 to 26 years as on 01-08-2026 (relaxations applicable).",
        "pay_scale": "Level 10 (Rs. 56,100 - 1,77,500) plus DAE special allowances",
        "min_age": 18,
        "max_age": 26
      }
    ]
  },

  // =========================================================================
  // PUBLIC SECTOR UNDERTAKINGS (MAHARATNA / NAVRATNA / MINIRATNA PSUs)
  // =========================================================================
  {
    "key": "sail_official_feed",
    "name": "Steel Authority of India Limited (SAIL) Official Feed",
    "organizationSlug": "sail",
    "organizationName": "Steel Authority of India Limited",
    "jurisdiction": "psu",
    "baseUrl": "https://sailcareers.com",
    "recruitmentPath": "/careers/jobs.html",
    "applyUrl": "https://sailcareers.com",
    "defaultCategory": "psu-jobs",
    "canonicalNotices": [
      {
        "advertisement_number": "SAIL/MT-OCTT/2026/01",
        "title": "SAIL Management Trainee (Technical & Admin) & OCTT Recruitment 2026",
        "ministry_or_department": "Ministry of Steel, Government of India",
        "post_name": "Management Trainee (Technical) / Operator-cum-Technician Trainee (OCTT)",
        "total_vacancies": 680,
        "date_of_notification": "2026-02-14",
        "closing_date": "2026-03-28",
        "pdf_url": "https://sailcareers.com/docs/MT_OCTT_2026.pdf",
        "apply_url": "https://sailcareers.com",
        "qualification_summary": "Degree in Engineering (Metallurgy, Mechanical, Electrical, Chemical, Mining) with 65% marks or Diploma in Engineering.",
        "age_limit_summary": "18 to 28 years as on closing date.",
        "pay_scale": "E-1 Grade (Rs. 50,000 - 1,60,000) / S-3 Grade (Rs. 26,600 - 38,920)",
        "min_age": 18,
        "max_age": 28
      }
    ]
  },

  {
    "key": "gail_official_feed",
    "name": "GAIL (India) Limited Official Feed",
    "organizationSlug": "gail",
    "organizationName": "GAIL (India) Limited",
    "jurisdiction": "psu",
    "baseUrl": "https://gailonline.com",
    "recruitmentPath": "/careers/current-openings",
    "applyUrl": "https://gailonline.com/CRApplyingGAIL.html",
    "defaultCategory": "psu-jobs",
    "canonicalNotices": [
      {
        "advertisement_number": "GAIL/OPEN/MISC/1/2026",
        "title": "GAIL Executive Trainee & Non-Executive Recruitment 2026",
        "ministry_or_department": "Ministry of Petroleum and Natural Gas, Government of India",
        "post_name": "Executive Trainee (Chemical, Mechanical, Electrical, Instrumentation, GAILTEL)",
        "total_vacancies": 190,
        "date_of_notification": "2026-02-11",
        "closing_date": "2026-03-25",
        "pdf_url": "https://gailonline.com/pdf/Careers/Advt_2026.pdf",
        "apply_url": "https://gailonline.com",
        "qualification_summary": "Bachelor Degree in Engineering in relevant discipline with minimum 65% marks.",
        "age_limit_summary": "26 years for Executive Trainee (relaxations for SC/ST/OBC/PwD).",
        "pay_scale": "E-2 Grade (Rs. 60,000 - 1,80,000)",
        "min_age": 21,
        "max_age": 26
      }
    ]
  },

  {
    "key": "iocl_official_feed",
    "name": "Indian Oil Corporation Limited (IOCL) Official Feed",
    "organizationSlug": "iocl",
    "organizationName": "Indian Oil Corporation Limited",
    "jurisdiction": "psu",
    "baseUrl": "https://iocl.com",
    "recruitmentPath": "/latest-job-openings",
    "applyUrl": "https://iocl.com/latest-job-openings",
    "defaultCategory": "psu-jobs",
    "canonicalNotices": [
      {
        "advertisement_number": "IOCL/RD/2026/02",
        "title": "IOCL Engineers & Officers Recruitment 2026 through GATE 2026 & Non-Executive Technical",
        "ministry_or_department": "Ministry of Petroleum and Natural Gas, Government of India",
        "post_name": "Engineers / Officers / Junior Engineering Assistant-IV (Refineries Division)",
        "total_vacancies": 820,
        "date_of_notification": "2026-02-15",
        "closing_date": "2026-03-31",
        "pdf_url": "https://iocl.com/download/IOCL_Engineers_2026_Detailed_Advt.pdf",
        "apply_url": "https://iocl.com",
        "qualification_summary": "B.Tech / B.E. in Chemical, Mechanical, Electrical, Civil or 3-year Diploma in Engineering.",
        "age_limit_summary": "26 years for Officers / 18-26 years for Junior Engineering Assistant.",
        "pay_scale": "Grade A (Rs. 50,000 - 1,60,000) / Grade IV (Rs. 25,000 - 1,05,000)",
        "min_age": 18,
        "max_age": 26
      }
    ]
  },

  {
    "key": "bpcl_official_feed",
    "name": "Bharat Petroleum Corporation Limited (BPCL) Official Feed",
    "organizationSlug": "bpcl",
    "organizationName": "Bharat Petroleum Corporation Limited",
    "jurisdiction": "psu",
    "baseUrl": "https://www.bharatpetroleum.in",
    "recruitmentPath": "/careers",
    "applyUrl": "https://www.bharatpetroleum.in/careers",
    "defaultCategory": "psu-jobs",
    "canonicalNotices": [
      {
        "advertisement_number": "BPCL/HR/2026/01",
        "title": "BPCL Management Trainee & Executive Recruitment 2026",
        "ministry_or_department": "Ministry of Petroleum and Natural Gas, Government of India",
        "post_name": "Management Trainee (Chemical / Mechanical / Electrical / Finance / HR)",
        "total_vacancies": 210,
        "date_of_notification": "2026-02-12",
        "closing_date": "2026-03-27",
        "pdf_url": "https://www.bharatpetroleum.in/careers/bpcl-advt-2026.pdf",
        "apply_url": "https://www.bharatpetroleum.in",
        "qualification_summary": "B.E. / B.Tech / B.Sc (Engg) with minimum 60% marks or MBA/CA.",
        "age_limit_summary": "Maximum 25 years as on 01-02-2026.",
        "pay_scale": "Job Group A (Rs. 50,000 - 1,60,000)",
        "min_age": 21,
        "max_age": 25
      }
    ]
  },

  {
    "key": "hpcl_official_feed",
    "name": "Hindustan Petroleum Corporation Limited (HPCL) Official Feed",
    "organizationSlug": "hpcl",
    "organizationName": "Hindustan Petroleum Corporation Limited",
    "jurisdiction": "psu",
    "baseUrl": "https://www.hindustanpetroleum.com",
    "recruitmentPath": "/job-openings",
    "applyUrl": "https://jobs.hpcl.co.in",
    "defaultCategory": "psu-jobs",
    "canonicalNotices": [
      {
        "advertisement_number": "HPCL/Rectt/Engg/2026",
        "title": "HPCL Officers & Graduate Engineers Recruitment 2026",
        "ministry_or_department": "Ministry of Petroleum and Natural Gas, Government of India",
        "post_name": "Engineer (Mechanical, Chemical, Electrical, Civil, Instrumentation, Safety)",
        "total_vacancies": 320,
        "date_of_notification": "2026-02-16",
        "closing_date": "2026-03-30",
        "pdf_url": "https://jobs.hpcl.co.in/Recruit_New/pdf/Advt_2026.pdf",
        "apply_url": "https://jobs.hpcl.co.in",
        "qualification_summary": "4-year regular Engineering Degree in relevant branch with 60% marks (50% for SC/ST/PwBD).",
        "age_limit_summary": "Max 25 years for E2 level.",
        "pay_scale": "E2 Grade (Rs. 50,000 - 1,60,000)",
        "min_age": 21,
        "max_age": 25
      }
    ]
  },

  {
    "key": "coal_india_official_feed",
    "name": "Coal India Limited (CIL) Official Feed",
    "organizationSlug": "coal-india",
    "organizationName": "Coal India Limited",
    "jurisdiction": "psu",
    "baseUrl": "https://www.coalindia.in",
    "recruitmentPath": "/careers/recruitment",
    "applyUrl": "https://www.coalindia.in",
    "defaultCategory": "psu-jobs",
    "canonicalNotices": [
      {
        "advertisement_number": "CIL/MT-GATE/2026/01",
        "title": "Coal India Management Trainee (Mining, Civil, Electrical, Systems, Finance) Recruitment 2026",
        "ministry_or_department": "Ministry of Coal, Government of India",
        "post_name": "Management Trainee (E-2 Grade)",
        "total_vacancies": 1280,
        "date_of_notification": "2026-02-10",
        "closing_date": "2026-03-25",
        "pdf_url": "https://www.coalindia.in/DesktopModules/DocumentList/documents/MT2026_Advt.pdf",
        "apply_url": "https://www.coalindia.in",
        "qualification_summary": "B.E. / B.Tech / B.Sc (Engg) in relevant discipline with 60% marks or CA/ICWA/MBA.",
        "age_limit_summary": "30 years as on closing date for General (relaxations as per GOI norms).",
        "pay_scale": "E-2 Grade (Rs. 50,000 - 1,60,000)",
        "min_age": 21,
        "max_age": 30
      }
    ]
  },

  {
    "key": "powergrid_official_feed",
    "name": "Power Grid Corporation of India (POWERGRID) Official Feed",
    "organizationSlug": "powergrid",
    "organizationName": "Power Grid Corporation of India Limited",
    "jurisdiction": "psu",
    "baseUrl": "https://www.powergrid.in",
    "recruitmentPath": "/careers/job-opportunities",
    "applyUrl": "https://www.powergrid.in/job-opportunities",
    "defaultCategory": "psu-jobs",
    "canonicalNotices": [
      {
        "advertisement_number": "POWERGRID/CC/ET/2026",
        "title": "POWERGRID Engineer Trainee (Electrical, Civil, Electronics, Computer Science) 2026",
        "ministry_or_department": "Ministry of Power, Government of India",
        "post_name": "Engineer Trainee (ET) & Diploma Trainee (DT)",
        "total_vacancies": 490,
        "date_of_notification": "2026-02-14",
        "closing_date": "2026-03-29",
        "pdf_url": "https://www.powergrid.in/sites/default/files/careers/ET_2026_Notification.pdf",
        "apply_url": "https://www.powergrid.in",
        "qualification_summary": "Full-time B.E. / B.Tech / B.Sc (Engg) with valid GATE score or 3-year Diploma in Engineering.",
        "age_limit_summary": "28 years for ET; 27 years for DT.",
        "pay_scale": "E-2 Grade (Rs. 50,000 - 1,60,000) / W-4 Grade for DT",
        "min_age": 18,
        "max_age": 28
      }
    ]
  },

  {
    "key": "bel_official_feed",
    "name": "Bharat Electronics Limited (BEL) Official Feed",
    "organizationSlug": "bel",
    "organizationName": "Bharat Electronics Limited",
    "jurisdiction": "psu",
    "baseUrl": "https://bel-india.in",
    "recruitmentPath": "/careers",
    "applyUrl": "https://bel-india.in/careers",
    "defaultCategory": "psu-jobs",
    "canonicalNotices": [
      {
        "advertisement_number": "BEL/Bangalore/PE-TE/2026",
        "title": "BEL Project Engineers, Trainee Engineers & Probationary Engineers Recruitment 2026",
        "ministry_or_department": "Ministry of Defence, Government of India",
        "post_name": "Project Engineer-I / Trainee Engineer-I / Probationary Engineer",
        "total_vacancies": 520,
        "date_of_notification": "2026-02-12",
        "closing_date": "2026-03-27",
        "pdf_url": "https://bel-india.in/wp-content/uploads/2026/02/BEL_PE_TE_2026.pdf",
        "apply_url": "https://bel-india.in/careers",
        "qualification_summary": "B.E. / B.Tech / B.Sc (Engg) in Electronics, Mechanical, Computer Science, Electrical with 55% marks.",
        "age_limit_summary": "28 years for Project Engineer; 25 years for Trainee Engineer.",
        "pay_scale": "Rs. 40,000 - 1,40,000 (PE-I) / Consolidated Trainee Stipend",
        "min_age": 21,
        "max_age": 28
      }
    ]
  },

  {
    "key": "nhpc_official_feed",
    "name": "NHPC Limited Official Feed",
    "organizationSlug": "nhpc",
    "organizationName": "NHPC Limited",
    "jurisdiction": "psu",
    "baseUrl": "https://www.nhpcindia.com",
    "recruitmentPath": "/careers",
    "applyUrl": "https://www.nhpcindia.com/careers.htm",
    "defaultCategory": "psu-jobs",
    "canonicalNotices": [
      {
        "advertisement_number": "NHPC/Rectt/01/2026",
        "title": "NHPC Trainee Engineer & Trainee Officer Recruitment 2026",
        "ministry_or_department": "Ministry of Power, Government of India",
        "post_name": "Trainee Engineer (Civil / Electrical / Mechanical / Geo-tech) and Trainee Officer",
        "total_vacancies": 185,
        "date_of_notification": "2026-02-16",
        "closing_date": "2026-03-31",
        "pdf_url": "https://www.nhpcindia.com/writereaddata/Images/pdf/Advt_2026_TE_TO.pdf",
        "apply_url": "https://www.nhpcindia.com",
        "qualification_summary": "Full time regular Bachelor's Degree in Engineering with minimum 60% marks or CA/ICWA/MBA.",
        "age_limit_summary": "30 years as on closing date.",
        "pay_scale": "E-2 Grade (Rs. 50,000 - 1,60,000)",
        "min_age": 21,
        "max_age": 30
      }
    ]
  },

  {
    "key": "nmdc_official_feed",
    "name": "NMDC Limited Official Feed",
    "organizationSlug": "nmdc",
    "organizationName": "NMDC Limited",
    "jurisdiction": "psu",
    "baseUrl": "https://www.nmdc.co.in",
    "recruitmentPath": "/careers",
    "applyUrl": "https://www.nmdc.co.in/careers",
    "defaultCategory": "psu-jobs",
    "canonicalNotices": [
      {
        "advertisement_number": "NMDC/Rectt/Executive/2026",
        "title": "NMDC Executive Trainee (Mining, Electrical, Mechanical, Civil) & Maintenance Staff 2026",
        "ministry_or_department": "Ministry of Steel, Government of India",
        "post_name": "Executive Trainee / Maintenance Assistant / Field Attendant",
        "total_vacancies": 310,
        "date_of_notification": "2026-02-11",
        "closing_date": "2026-03-26",
        "pdf_url": "https://www.nmdc.co.in/docs/NMDC_ET_2026.pdf",
        "apply_url": "https://www.nmdc.co.in",
        "qualification_summary": "Engineering Degree with GATE score for ET; ITI / Diploma for Maintenance Assistant.",
        "age_limit_summary": "27 years for Executive Trainee; 30 years for Maintenance Assistant.",
        "pay_scale": "E-2 Scale (Rs. 50,000 - 1,60,000) / Industrial Pay Scale",
        "min_age": 18,
        "max_age": 30
      }
    ]
  },

  {
    "key": "mazagon_dock_official_feed",
    "name": "Mazagon Dock Shipbuilders Limited (MDL) Official Feed",
    "organizationSlug": "mazagon-dock",
    "organizationName": "Mazagon Dock Shipbuilders Limited",
    "jurisdiction": "psu",
    "baseUrl": "https://mazagondock.in",
    "recruitmentPath": "/careers-overview",
    "applyUrl": "https://mazagondock.in/careers-overview",
    "defaultCategory": "psu-jobs",
    "canonicalNotices": [
      {
        "advertisement_number": "MDL/HR-CR/REC/2026/02",
        "title": "Mazagon Dock Executive Trainee & Non-Executive Technical Staff Recruitment 2026",
        "ministry_or_department": "Ministry of Defence, Government of India",
        "post_name": "Executive Trainee (Naval Architecture, Mechanical, Electrical) / Skilled Operative",
        "total_vacancies": 420,
        "date_of_notification": "2026-02-15",
        "closing_date": "2026-03-29",
        "pdf_url": "https://mazagondock.in/writereaddata/career/MDL_Advt_2026.pdf",
        "apply_url": "https://mazagondock.in",
        "qualification_summary": "Degree in Engineering in relevant branch or National Apprenticeship Certificate in relevant trade.",
        "age_limit_summary": "28 years for Executives; 38 years for Non-Executives.",
        "pay_scale": "E-1 Scale (Rs. 40,000 - 1,40,000) / Semi-skilled & Skilled Scales",
        "min_age": 18,
        "max_age": 38
      }
    ]
  },

  {
    "key": "nfl_rcf_fertilizers_feed",
    "name": "National Fertilizers (NFL) & RCF Recruitment Feed",
    "organizationSlug": "nfl-rcf",
    "organizationName": "National Fertilizers Limited (NFL)",
    "jurisdiction": "psu",
    "baseUrl": "https://www.nationalfertilizers.com",
    "recruitmentPath": "/careers",
    "applyUrl": "https://www.nationalfertilizers.com/careers",
    "defaultCategory": "psu-jobs",
    "canonicalNotices": [
      {
        "advertisement_number": "NFL/01(Rectt)/2026",
        "title": "NFL Management Trainee & Non-Executive Staff Recruitment 2026",
        "ministry_or_department": "Ministry of Chemicals and Fertilizers, Government of India",
        "post_name": "Management Trainee (Chemical, Mechanical, Electrical, Instrumentation, HR, Finance)",
        "total_vacancies": 164,
        "date_of_notification": "2026-02-10",
        "closing_date": "2026-03-24",
        "pdf_url": "https://www.nationalfertilizers.com/career/NFL_MT_2026.pdf",
        "apply_url": "https://www.nationalfertilizers.com",
        "qualification_summary": "Engineering Degree with minimum 60% marks or MBA/CA/CMA for non-tech disciplines.",
        "age_limit_summary": "27 years as on 01-02-2026.",
        "pay_scale": "E-1 Grade (Rs. 40,000 - 1,40,000)",
        "min_age": 21,
        "max_age": 27
      }
    ]
  },

  {
    "key": "npcil_official_feed",
    "name": "Nuclear Power Corporation of India (NPCIL) Official Feed",
    "organizationSlug": "npcil",
    "organizationName": "Nuclear Power Corporation of India Limited",
    "jurisdiction": "psu",
    "baseUrl": "https://www.npcilcareers.co.in",
    "recruitmentPath": "/careers",
    "applyUrl": "https://www.npcilcareers.co.in",
    "defaultCategory": "psu-jobs",
    "canonicalNotices": [
      {
        "advertisement_number": "NPCIL/HRM/ET/2026/01",
        "title": "NPCIL Executive Trainee (Mechanical, Chemical, Electrical, Electronics, Instrumentation, Civil)",
        "ministry_or_department": "Department of Atomic Energy (DAE), Government of India",
        "post_name": "Executive Trainee (ET) & Scientific Officer-C",
        "total_vacancies": 380,
        "date_of_notification": "2026-02-12",
        "closing_date": "2026-03-28",
        "pdf_url": "https://www.npcilcareers.co.in/docs/NPCIL_ET_2026_Advt.pdf",
        "apply_url": "https://www.npcilcareers.co.in",
        "qualification_summary": "B.E. / B.Tech / B.Sc (Engg) / 5 year Integrated M.Tech with minimum 60% marks and valid GATE score.",
        "age_limit_summary": "Maximum 26 years as on closing date.",
        "pay_scale": "Level 10 (Rs. 56,100 - 1,77,500) upon absorption",
        "min_age": 21,
        "max_age": 26
      }
    ]
  },

  // =========================================================================
  // BANKING, INSURANCE & FINANCIAL REGULATORY INSTITUTIONS
  // =========================================================================
  {
    "key": "sebi_official_feed",
    "name": "Securities and Exchange Board of India (SEBI) Official Feed",
    "organizationSlug": "sebi",
    "organizationName": "Securities and Exchange Board of India",
    "jurisdiction": "autonomous",
    "baseUrl": "https://www.sebi.gov.in",
    "recruitmentPath": "/department/human-resources-department-14/careers.html",
    "applyUrl": "https://www.sebi.gov.in",
    "defaultCategory": "banking-jobs",
    "canonicalNotices": [
      {
        "advertisement_number": "SEBI/HRD/Grade-A/2026",
        "title": "SEBI Recruitment of Officer Grade A (Assistant Manager) 2026",
        "ministry_or_department": "Statutory Regulatory Body, Government of India",
        "post_name": "Officer Grade A - General, Legal, Information Technology, Engineering, Research",
        "total_vacancies": 97,
        "date_of_notification": "2026-02-14",
        "closing_date": "2026-03-28",
        "pdf_url": "https://www.sebi.gov.in/sebi_data/careerfiles/SEBI_Grade_A_2026.pdf",
        "apply_url": "https://www.sebi.gov.in",
        "qualification_summary": "Master's Degree in any discipline / Bachelor's in Law or Engineering / CA / CFA.",
        "age_limit_summary": "Must not have exceeded the age of 30 years as on 01-01-2026.",
        "pay_scale": "Pay Scale: Rs. 44,500 - 89,150 (Total Gross Emoluments ~ Rs. 1,49,000/month)",
        "min_age": 21,
        "max_age": 30
      }
    ]
  },

  {
    "key": "sidbi_official_feed",
    "name": "Small Industries Development Bank of India (SIDBI) Official Feed",
    "organizationSlug": "sidbi",
    "organizationName": "Small Industries Development Bank of India",
    "jurisdiction": "autonomous",
    "baseUrl": "https://www.sidbi.in",
    "recruitmentPath": "/careers",
    "applyUrl": "https://www.sidbi.in/careers",
    "defaultCategory": "banking-jobs",
    "canonicalNotices": [
      {
        "advertisement_number": "SIDBI/Grade-A-B/2026",
        "title": "SIDBI Assistant Manager (Grade 'A') & Manager (Grade 'B') Recruitment 2026",
        "ministry_or_department": "Financial Institution under Ministry of Finance",
        "post_name": "Assistant Manager Grade 'A' (General Stream & IT)",
        "total_vacancies": 72,
        "date_of_notification": "2026-02-10",
        "closing_date": "2026-03-24",
        "pdf_url": "https://www.sidbi.in/files/careers/SIDBI_Advt_2026.pdf",
        "apply_url": "https://www.sidbi.in",
        "qualification_summary": "Post Graduate Degree in Commerce / Economics / Management or Bachelor's in Law / Engineering.",
        "age_limit_summary": "21 to 28 years for Grade A.",
        "pay_scale": "Grade A: Rs. 44,500 - 89,150 (Gross ~ Rs. 1,00,000/month)",
        "min_age": 21,
        "max_age": 28
      }
    ]
  },

  {
    "key": "exim_bank_official_feed",
    "name": "Export-Import Bank of India (EXIM Bank) Official Feed",
    "organizationSlug": "exim-bank",
    "organizationName": "Export-Import Bank of India",
    "jurisdiction": "psu",
    "baseUrl": "https://www.eximbankindia.in",
    "recruitmentPath": "/careers",
    "applyUrl": "https://www.eximbankindia.in/careers",
    "defaultCategory": "banking-jobs",
    "canonicalNotices": [
      {
        "advertisement_number": "EXIM/HR/MT/2026/01",
        "title": "EXIM Bank Management Trainee (Corporate Banking, IT, Legal, Risk Management) 2026",
        "ministry_or_department": "Export-Import Bank of India, Ministry of Finance",
        "post_name": "Management Trainee (MT)",
        "total_vacancies": 45,
        "date_of_notification": "2026-02-15",
        "closing_date": "2026-03-30",
        "pdf_url": "https://www.eximbankindia.in/Assets/Dynamic/PDF/Careers/Advt_MT_2026.pdf",
        "apply_url": "https://www.eximbankindia.in",
        "qualification_summary": "MBA / PGDBA with specialization in Finance or Chartered Accountant (CA) or B.E./B.Tech (CS/IT).",
        "age_limit_summary": "21 to 28 years as on 01-02-2026.",
        "pay_scale": "Stipend of Rs. 65,000/month during training; absorbed as Deputy Manager (Scale I)",
        "min_age": 21,
        "max_age": 28
      }
    ]
  },

  {
    "key": "lic_official_feed",
    "name": "Life Insurance Corporation of India (LIC) Official Feed",
    "organizationSlug": "lic",
    "organizationName": "Life Insurance Corporation of India",
    "jurisdiction": "psu",
    "baseUrl": "https://licindia.in",
    "recruitmentPath": "/careers",
    "applyUrl": "https://licindia.in/Bottom-Links/careers",
    "defaultCategory": "banking-jobs",
    "canonicalNotices": [
      {
        "advertisement_number": "LIC/AAO-ADO/2026",
        "title": "LIC Assistant Administrative Officer (AAO Generalist/IT/CA) & ADO Recruitment 2026",
        "ministry_or_department": "Life Insurance Corporation of India, Ministry of Finance",
        "post_name": "Assistant Administrative Officer (AAO) & Apprentice Development Officer (ADO)",
        "total_vacancies": 9200,
        "date_of_notification": "2026-02-12",
        "closing_date": "2026-03-27",
        "pdf_url": "https://licindia.in/documents/AAO_2026_Advt.pdf",
        "apply_url": "https://licindia.in",
        "qualification_summary": "Bachelor's Degree in any discipline from a recognized Indian University.",
        "age_limit_summary": "21 to 30 years as on 01-01-2026.",
        "pay_scale": "Basic Pay: Rs. 53,600/- per month in the scale of Rs. 53600-102090 (Gross ~ Rs. 92,870/month)",
        "min_age": 21,
        "max_age": 30
      }
    ]
  },

  {
    "key": "niacl_gic_official_feed",
    "name": "New India Assurance (NIACL) & GIC Re Official Feed",
    "organizationSlug": "niacl",
    "organizationName": "New India Assurance Company Limited",
    "jurisdiction": "psu",
    "baseUrl": "https://www.newindia.co.in",
    "recruitmentPath": "/recruitment",
    "applyUrl": "https://www.newindia.co.in/portal/recruitment",
    "defaultCategory": "banking-jobs",
    "canonicalNotices": [
      {
        "advertisement_number": "NIACL/AO-Assistant/2026",
        "title": "NIACL Administrative Officer (Scale-I Generalist & Specialist) & Assistants Recruitment 2026",
        "ministry_or_department": "Public Sector General Insurance Companies",
        "post_name": "Administrative Officer (Scale-I) & Assistant",
        "total_vacancies": 585,
        "date_of_notification": "2026-02-16",
        "closing_date": "2026-03-31",
        "pdf_url": "https://www.newindia.co.in/downloads/NIACL_AO_2026.pdf",
        "apply_url": "https://www.newindia.co.in",
        "qualification_summary": "Graduate / Post Graduate in any discipline with minimum 60% marks (55% for SC/ST/PwBD).",
        "age_limit_summary": "21 to 30 years as on closing date.",
        "pay_scale": "Basic Pay Rs. 50,925/- (Total gross emoluments ~ Rs. 88,000/month)",
        "min_age": 21,
        "max_age": 30
      }
    ]
  },

  {
    "key": "pnb_official_feed",
    "name": "Punjab National Bank (PNB) Official Feed",
    "organizationSlug": "pnb",
    "organizationName": "Punjab National Bank",
    "jurisdiction": "psu",
    "baseUrl": "https://www.pnbindia.in",
    "recruitmentPath": "/recruitments.aspx",
    "applyUrl": "https://www.pnbindia.in/recruitments.aspx",
    "defaultCategory": "banking-jobs",
    "canonicalNotices": [
      {
        "advertisement_number": "PNB/HRD/Rectt/2026/01",
        "title": "Punjab National Bank Specialist Officers (Credit, Forex, IT, Cyber Security, Law) 2026",
        "ministry_or_department": "Public Sector Banking, Government of India",
        "post_name": "Officer (Credit), Manager (Forex), Manager (Cyber Security), Senior Manager",
        "total_vacancies": 1025,
        "date_of_notification": "2026-02-10",
        "closing_date": "2026-03-25",
        "pdf_url": "https://www.pnbindia.in/Upload/En/PNB_SO_2026_Advt.pdf",
        "apply_url": "https://www.pnbindia.in",
        "qualification_summary": "CA / CMA / CFA / MBA or B.E./B.Tech in Computer Science / IT / Law Graduate.",
        "age_limit_summary": "21 to 28 years (Officer); 25 to 35 years (Manager).",
        "pay_scale": "Scale I (Rs. 48,480 - 85,920) / Scale II (Rs. 64,820 - 93,960)",
        "min_age": 21,
        "max_age": 35
      }
    ]
  },

  {
    "key": "bob_official_feed",
    "name": "Bank of Baroda (BOB) Official Feed",
    "organizationSlug": "bank-of-baroda",
    "organizationName": "Bank of Baroda",
    "jurisdiction": "psu",
    "baseUrl": "https://www.bankofbaroda.in",
    "recruitmentPath": "/careers/current-opportunities",
    "applyUrl": "https://www.bankofbaroda.in/careers/current-opportunities",
    "defaultCategory": "banking-jobs",
    "canonicalNotices": [
      {
        "advertisement_number": "BOB/HRM/REC/ADVT/2026/02",
        "title": "Bank of Baroda Specialist Officers & Wealth Management Professionals Recruitment 2026",
        "ministry_or_department": "Public Sector Banking, Government of India",
        "post_name": "Relationship Manager, Credit Analyst, Forex Acquisition Officer, IT Specialist",
        "total_vacancies": 620,
        "date_of_notification": "2026-02-15",
        "closing_date": "2026-03-29",
        "pdf_url": "https://www.bankofbaroda.in/careers/BOB_SO_2026.pdf",
        "apply_url": "https://www.bankofbaroda.in",
        "qualification_summary": "Graduation / MBA / CA / B.E./B.Tech in Computer Science / IT with relevant experience.",
        "age_limit_summary": "24 to 36 years as on 01-02-2026.",
        "pay_scale": "Scale-I / Scale-II / Scale-III (Rs. 48,480 - 1,00,000+)",
        "min_age": 24,
        "max_age": 36
      }
    ]
  },

  {
    "key": "canara_bank_official_feed",
    "name": "Canara Bank Official Feed",
    "organizationSlug": "canara-bank",
    "organizationName": "Canara Bank",
    "jurisdiction": "psu",
    "baseUrl": "https://canarabank.com",
    "recruitmentPath": "/careers/recruitment",
    "applyUrl": "https://canarabank.com/careers/recruitment",
    "defaultCategory": "banking-jobs",
    "canonicalNotices": [
      {
        "advertisement_number": "CB/RP/SO/2026",
        "title": "Canara Bank Specialist Officers (JMGS-I & MMGS-II) Recruitment 2026",
        "ministry_or_department": "Public Sector Banking, Government of India",
        "post_name": "Specialist Officer (JMGS-I & MMGS-II) and Graduate Apprentice",
        "total_vacancies": 3000,
        "date_of_notification": "2026-02-12",
        "closing_date": "2026-03-26",
        "pdf_url": "https://canarabank.com/Upload/English/Careers/SO_2026_Advt.pdf",
        "apply_url": "https://canarabank.com",
        "qualification_summary": "Graduate Degree in any discipline from a recognized University or B.E./B.Tech / MBA / CA.",
        "age_limit_summary": "20 to 28 years for Apprentice / 22 to 35 years for SO.",
        "pay_scale": "JMGS-I (Rs. 48,480 - 85,920) / Apprentice Monthly Stipend",
        "min_age": 20,
        "max_age": 35
      }
    ]
  },

  {
    "key": "union_bank_official_feed",
    "name": "Union Bank of India Official Feed",
    "organizationSlug": "union-bank",
    "organizationName": "Union Bank of India",
    "jurisdiction": "psu",
    "baseUrl": "https://www.unionbankofindia.co.in",
    "recruitmentPath": "/careers/recruitment",
    "applyUrl": "https://www.unionbankofindia.co.in/english/recruitment.aspx",
    "defaultCategory": "banking-jobs",
    "canonicalNotices": [
      {
        "advertisement_number": "UBI/SO/2026/01",
        "title": "Union Bank of India Specialist Officers (Chief Manager, Senior Manager, Manager) 2026",
        "ministry_or_department": "Public Sector Banking, Government of India",
        "post_name": "Specialist Officer (Credit, Risk, IT, Treasury, Chartered Accountant, Law)",
        "total_vacancies": 606,
        "date_of_notification": "2026-02-14",
        "closing_date": "2026-03-28",
        "pdf_url": "https://www.unionbankofindia.co.in/pdf/UBI_SO_Recruitment_2026.pdf",
        "apply_url": "https://www.unionbankofindia.co.in",
        "qualification_summary": "B.Sc/B.E./B.Tech in Computer Science / IT or CA / MBA (Finance) or Degree in Law.",
        "age_limit_summary": "25 to 38 years depending on scale.",
        "pay_scale": "MMGS-II (Rs. 64,820 - 93,960) / MMGS-III (Rs. 85,920 - 1,05,280)",
        "min_age": 25,
        "max_age": 38
      }
    ]
  },

  // =========================================================================
  // RAILWAYS & URBAN TRANSIT CORPORATIONS
  // =========================================================================
  {
    "key": "rrc_national_feed",
    "name": "Railway Recruitment Cells (RRC National) Official Feed",
    "organizationSlug": "rrc",
    "organizationName": "Railway Recruitment Cells (Indian Railways)",
    "jurisdiction": "central",
    "baseUrl": "https://www.rrcnr.org",
    "recruitmentPath": "/recruitment",
    "applyUrl": "https://www.rrcnr.org",
    "defaultCategory": "railway-jobs",
    "canonicalNotices": [
      {
        "advertisement_number": "RRC/CEN-01/2026",
        "title": "Railway Recruitment Cell Level-1 (Track Maintainer, Pointsman, Assistant) Recruitment 2026",
        "ministry_or_department": "Ministry of Railways, Government of India",
        "post_name": "Level-1 Posts (formerly Group D) across Northern, Western, Eastern, Southern & Central Zones",
        "total_vacancies": 32500,
        "date_of_notification": "2026-02-18",
        "closing_date": "2026-03-31",
        "pdf_url": "https://www.rrcnr.org/notices/CEN_01_2026_Level1.pdf",
        "apply_url": "https://www.rrcnr.org",
        "qualification_summary": "10th pass from recognized Board / NCVT or National Apprenticeship Certificate (NAC) / ITI.",
        "age_limit_summary": "18 to 33 years as on 01-07-2026 (relaxations for SC/ST/OBC/Ex-SM).",
        "pay_scale": "Level 1 of 7th CPC Pay Matrix (Rs. 18,000 - 56,900) plus allowances",
        "min_age": 18,
        "max_age": 33
      }
    ]
  },

  {
    "key": "dfccil_official_feed",
    "name": "Dedicated Freight Corridor Corporation (DFCCIL) Official Feed",
    "organizationSlug": "dfccil",
    "organizationName": "Dedicated Freight Corridor Corporation of India Limited",
    "jurisdiction": "psu",
    "baseUrl": "https://dfccil.com",
    "recruitmentPath": "/career",
    "applyUrl": "https://dfccil.com/Home/ActiveCareer",
    "defaultCategory": "railway-jobs",
    "canonicalNotices": [
      {
        "advertisement_number": "DFCCIL/Advt/01/2026",
        "title": "DFCCIL Executive & Junior Executive (Civil, Electrical, Operations & BD, Signal & Telecom)",
        "ministry_or_department": "Public Sector Enterprise under Ministry of Railways",
        "post_name": "Executive & Junior Executive (Operations & BD, Civil, Electrical, S&T)",
        "total_vacancies": 535,
        "date_of_notification": "2026-02-11",
        "closing_date": "2026-03-25",
        "pdf_url": "https://dfccil.com/upload/Advt_2026_Executive.pdf",
        "apply_url": "https://dfccil.com",
        "qualification_summary": "Graduation with not less than 60% marks or 3-year Diploma in Engineering or ITI.",
        "age_limit_summary": "18 to 30 years as on closing date.",
        "pay_scale": "Executive Scale: Rs. 30,000 - 1,20,000 (E-0) / Junior Executive: Rs. 25,000 - 68,000",
        "min_age": 18,
        "max_age": 30
      }
    ]
  },

  {
    "key": "dmrc_metro_official_feed",
    "name": "Delhi Metro Rail Corporation (DMRC) Official Feed",
    "organizationSlug": "dmrc",
    "organizationName": "Delhi Metro Rail Corporation Limited",
    "jurisdiction": "autonomous",
    "baseUrl": "https://www.delhimetrorail.com",
    "recruitmentPath": "/careers",
    "applyUrl": "https://www.delhimetrorail.com/careers",
    "defaultCategory": "railway-jobs",
    "canonicalNotices": [
      {
        "advertisement_number": "DMRC/HR/Rectt/2026/01",
        "title": "DMRC Assistant Manager, Station Controller / Train Operator (SC/TO) & Maintainer 2026",
        "ministry_or_department": "Joint Venture of Government of India and Government of NCT of Delhi",
        "post_name": "Assistant Manager (Operations/Electrical/S&T) / Station Controller (SC/TO) / Maintainer",
        "total_vacancies": 1492,
        "date_of_notification": "2026-02-15",
        "closing_date": "2026-03-29",
        "pdf_url": "https://www.delhimetrorail.com/career_files/DMRC_Advt_2026.pdf",
        "apply_url": "https://www.delhimetrorail.com",
        "qualification_summary": "B.E./B.Tech in relevant engineering discipline or 3-year Engineering Diploma or ITI.",
        "age_limit_summary": "18 to 28 years for Non-Executive; 18 to 30 years for Executive.",
        "pay_scale": "Assistant Manager: Rs. 50,000 - 1,60,000 / SC/TO: Rs. 37,000 - 1,15,000 / Maintainer: Rs. 20,000 - 60,000",
        "min_age": 18,
        "max_age": 30
      }
    ]
  },

  // =========================================================================
  // DEFENCE, COAST GUARD & PARAMILITARY FORCES
  // =========================================================================
  {
    "key": "indian_coast_guard_official_feed",
    "name": "Indian Coast Guard (ICG) Official Feed",
    "organizationSlug": "indian-coast-guard",
    "organizationName": "Indian Coast Guard",
    "jurisdiction": "defence",
    "baseUrl": "https://joinindiancoastguard.cdac.in",
    "recruitmentPath": "/cgept",
    "applyUrl": "https://joinindiancoastguard.cdac.in",
    "defaultCategory": "defence-jobs",
    "canonicalNotices": [
      {
        "advertisement_number": "ICG/CGEPT-02/2026",
        "title": "Indian Coast Guard Navik (General Duty), Navik (Domestic Branch) & Yantrik Recruitment 2026",
        "ministry_or_department": "Ministry of Defence, Government of India",
        "post_name": "Navik (GD) / Navik (DB) / Yantrik (Mechanical, Electrical, Electronics)",
        "total_vacancies": 320,
        "date_of_notification": "2026-02-14",
        "closing_date": "2026-03-27",
        "pdf_url": "https://joinindiancoastguard.cdac.in/cgept/assets/img/news/CGEPT_02_2026.pdf",
        "apply_url": "https://joinindiancoastguard.cdac.in",
        "qualification_summary": "10+2 with Maths and Physics for Navik GD; 10th pass for Navik DB; 10th + Engineering Diploma for Yantrik.",
        "age_limit_summary": "18 to 22 years (5 years relaxation for SC/ST, 3 years for OBC).",
        "pay_scale": "Pay Level 3 (Rs. 21,700 - 69,100) for Navik; Level 5 (Rs. 29,200 - 92,300) for Yantrik",
        "min_age": 18,
        "max_age": 22
      }
    ]
  },

  {
    "key": "assam_rifles_official_feed",
    "name": "Assam Rifles Official Feed",
    "organizationSlug": "assam-rifles",
    "organizationName": "Assam Rifles (Ministry of Home Affairs)",
    "jurisdiction": "central_police",
    "baseUrl": "https://www.assamrifles.gov.in",
    "recruitmentPath": "/recruitment",
    "applyUrl": "https://www.assamrifles.gov.in",
    "defaultCategory": "defence-jobs",
    "canonicalNotices": [
      {
        "advertisement_number": "AR/Rally/Technical-Tradesmen/2026",
        "title": "Assam Rifles Technical & Tradesmen Recruitment Rally 2026 across All States",
        "ministry_or_department": "Ministry of Home Affairs, Government of India",
        "post_name": "Havildar (Clerk), Naib Subedar (Bridge & Road), Rifleman/Riflewoman (General Duty & Trades)",
        "total_vacancies": 616,
        "date_of_notification": "2026-02-12",
        "closing_date": "2026-03-26",
        "pdf_url": "https://www.assamrifles.gov.in/DOCS/RECRUITMENT/AR_Rally_2026.pdf",
        "apply_url": "https://www.assamrifles.gov.in",
        "qualification_summary": "10th / 10+2 pass or Diploma in Civil Engineering / ITI in relevant trade.",
        "age_limit_summary": "18 to 23 years (up to 28 for clerk/specialist trades).",
        "pay_scale": "Pay Level 3 (Rs. 21,700 - 69,100) to Level 6",
        "min_age": 18,
        "max_age": 28
      }
    ]
  },

  {
    "key": "bro_gref_official_feed",
    "name": "Border Roads Organisation (BRO / GREF) Official Feed",
    "organizationSlug": "bro-gref",
    "organizationName": "Border Roads Organisation (General Reserve Engineer Force)",
    "jurisdiction": "defence",
    "baseUrl": "http://www.bro.gov.in",
    "recruitmentPath": "/recruitment",
    "applyUrl": "http://www.bro.gov.in",
    "defaultCategory": "defence-jobs",
    "canonicalNotices": [
      {
        "advertisement_number": "BRO/GREF-01/2026",
        "title": "BRO GREF Draughtsman, Supervisor, Multi Skilled Worker (MSW) & Vehicle Mechanic 2026",
        "ministry_or_department": "Border Roads Development Board, Ministry of Defence",
        "post_name": "Draughtsman / Supervisor Store / MSW (Driver Engine Static / Mason) / Vehicle Mechanic",
        "total_vacancies": 482,
        "date_of_notification": "2026-02-10",
        "closing_date": "2026-03-25",
        "pdf_url": "http://www.bro.gov.in/WriteReadData/Advt_01_2026.pdf",
        "apply_url": "http://www.bro.gov.in",
        "qualification_summary": "10th / 10+2 pass with ITI Certificate in Motor Mechanic / Mason / Draughtsman trade.",
        "age_limit_summary": "18 to 27 years for technical posts; 18 to 25 years for MSW.",
        "pay_scale": "Level 1 (Rs. 18,000 - 56,900) to Level 5 (Rs. 29,200 - 92,300)",
        "min_age": 18,
        "max_age": 27
      }
    ]
  },

  // =========================================================================
  // STATE POLICE RECRUITMENT BOARDS
  // =========================================================================
  {
    "key": "delhi_police_official_feed",
    "name": "Delhi Police Recruitment Cell Official Feed",
    "organizationSlug": "delhi-police",
    "organizationName": "Delhi Police",
    "jurisdiction": "central_police",
    "stateCode": "DL",
    "baseUrl": "https://delhipolice.gov.in",
    "recruitmentPath": "/recruitment",
    "applyUrl": "https://ssc.gov.in",
    "defaultCategory": "police-jobs",
    "canonicalNotices": [
      {
        "advertisement_number": "DP/Rectt/Constable-SI/2026",
        "title": "Delhi Police Constable (Executive) & Sub-Inspector Recruitment 2026",
        "ministry_or_department": "Delhi Police, Ministry of Home Affairs",
        "post_name": "Constable (Executive) Male & Female / Sub-Inspector (Executive)",
        "total_vacancies": 7547,
        "date_of_notification": "2026-02-15",
        "closing_date": "2026-03-30",
        "pdf_url": "https://delhipolice.gov.in/recruitment_notice_2026.pdf",
        "apply_url": "https://ssc.gov.in",
        "qualification_summary": "10+2 (Senior Secondary) pass for Constable; Graduation for Sub-Inspector.",
        "age_limit_summary": "18 to 25 years for Constable; 20 to 25 years for Sub-Inspector.",
        "pay_scale": "Level 3 (Rs. 21,700 - 69,100) for Constable; Level 6 for Sub-Inspector",
        "min_age": 18,
        "max_age": 25
      }
    ]
  },

  {
    "key": "mahapolice_official_feed",
    "name": "Maharashtra State Police (MahaPolice) Official Feed",
    "organizationSlug": "mahapolice",
    "organizationName": "Maharashtra State Police",
    "jurisdiction": "state",
    "stateCode": "MH",
    "baseUrl": "https://mahapolice.gov.in",
    "recruitmentPath": "/police-recruitment",
    "applyUrl": "https://policerecruitment2024.mahait.org",
    "defaultCategory": "police-jobs",
    "canonicalNotices": [
      {
        "advertisement_number": "MAHAPOLICE/CONST/2026",
        "title": "Maharashtra Police Constable (Shipai), SRPF & Police Driver Recruitment 2026",
        "ministry_or_department": "Home Department, Government of Maharashtra",
        "post_name": "Police Constable (Shipai) / Police Driver / SRPF Armed Police Constable / Bandsman",
        "total_vacancies": 17471,
        "date_of_notification": "2026-02-14",
        "closing_date": "2026-03-31",
        "pdf_url": "https://mahapolice.gov.in/writereaddata/Police_Recruitment_2026.pdf",
        "apply_url": "https://mahapolice.gov.in",
        "qualification_summary": "HSC / 12th standard pass or equivalent from Maharashtra State Board or recognized board.",
        "age_limit_summary": "18 to 28 years for Open Category; 18 to 33 years for Reserved Categories.",
        "pay_scale": "Pay Matrix S-6: Rs. 21,700 - 69,100 plus special duty allowance",
        "min_age": 18,
        "max_age": 33
      }
    ]
  },

  {
    "key": "rajasthan_police_official_feed",
    "name": "Rajasthan Police Recruitment Official Feed",
    "organizationSlug": "rajasthan-police",
    "organizationName": "Rajasthan Police",
    "jurisdiction": "state",
    "stateCode": "RJ",
    "baseUrl": "https://police.rajasthan.gov.in",
    "recruitmentPath": "/recruitment",
    "applyUrl": "https://sso.rajasthan.gov.in",
    "defaultCategory": "police-jobs",
    "canonicalNotices": [
      {
        "advertisement_number": "RAJ-POLICE/CONST-CET/2026",
        "title": "Rajasthan Police Constable (General, Driver, Telecommunication, Band, Mounted) 2026",
        "ministry_or_department": "Police Headquarters, Rajasthan, Jaipur",
        "post_name": "Constable (General Duty / Driver / Police Telecommunication / RAC / MBC)",
        "total_vacancies": 4500,
        "date_of_notification": "2026-02-12",
        "closing_date": "2026-03-27",
        "pdf_url": "https://police.rajasthan.gov.in/docs/Constable_Recruitment_2026.pdf",
        "apply_url": "https://sso.rajasthan.gov.in",
        "qualification_summary": "Senior Secondary (12th) with Physics & Maths for Telecom; 12th pass for General Duty.",
        "age_limit_summary": "18 to 24 years as on 01-01-2027 (relaxations as per state rules).",
        "pay_scale": "Pay Matrix L-5 (Stipend Rs. 14,600 during probation; regular pay Rs. 20,800 - 65,900)",
        "min_age": 18,
        "max_age": 24
      }
    ]
  },

  {
    "key": "wbprb_police_feed",
    "name": "West Bengal Police Recruitment Board (WBPRB) Official Feed",
    "organizationSlug": "wbprb",
    "organizationName": "West Bengal Police Recruitment Board",
    "jurisdiction": "state",
    "stateCode": "WB",
    "baseUrl": "https://prb.wb.gov.in",
    "recruitmentPath": "/all-recruitment-notices",
    "applyUrl": "https://prb.wb.gov.in",
    "defaultCategory": "police-jobs",
    "canonicalNotices": [
      {
        "advertisement_number": "WBPRB/NOTICE-2026/04",
        "title": "WBPRB Recruitment of Constables & Lady Constables in West Bengal & Kolkata Police 2026",
        "ministry_or_department": "West Bengal Police Directorate, Government of West Bengal",
        "post_name": "Constable & Lady Constable (WBP / Kolkata Police)",
        "total_vacancies": 10255,
        "date_of_notification": "2026-02-15",
        "closing_date": "2026-03-29",
        "pdf_url": "https://prb.wb.gov.in/sites/default/files/Notices/Constable_2026_Advt.pdf",
        "apply_url": "https://prb.wb.gov.in",
        "qualification_summary": "Madhyamik Examination pass from West Bengal Board of Secondary Education or equivalent.",
        "age_limit_summary": "18 to 30 years as on 01-01-2026 (relaxations for SC/ST/OBC/NVF/Home Guards).",
        "pay_scale": "Level-6 in the Pay Matrix (Rs. 22,700 - 58,500)",
        "min_age": 18,
        "max_age": 30
      }
    ]
  },

  {
    "key": "punjab_police_official_feed",
    "name": "Punjab Police Recruitment Board Official Feed",
    "organizationSlug": "punjab-police",
    "organizationName": "Punjab Police",
    "jurisdiction": "state",
    "stateCode": "PB",
    "baseUrl": "https://punjabpolice.gov.in",
    "recruitmentPath": "/recruitment.html",
    "applyUrl": "https://punjabpolice.gov.in",
    "defaultCategory": "police-jobs",
    "canonicalNotices": [
      {
        "advertisement_number": "PB-POLICE/CONST-SI/2026",
        "title": "Punjab Police Constable (District & Armed Cadres) and Sub-Inspector Recruitment 2026",
        "ministry_or_department": "Department of Home Affairs and Justice, Government of Punjab",
        "post_name": "Constable (District & Armed Police Cadres) / Sub-Inspector",
        "total_vacancies": 1800,
        "date_of_notification": "2026-02-11",
        "closing_date": "2026-03-25",
        "pdf_url": "https://punjabpolice.gov.in/docs/Punjab_Police_Recruitment_2026.pdf",
        "apply_url": "https://punjabpolice.gov.in",
        "qualification_summary": "10+2 or equivalent; Punjabi at Matriculation level is compulsory.",
        "age_limit_summary": "18 to 28 years as on 01-01-2026.",
        "pay_scale": "Level 2 (Rs. 19,900/- minimum pay admissible during 3 years probation)",
        "min_age": 18,
        "max_age": 28
      }
    ]
  },

  {
    "key": "tnusrb_official_feed",
    "name": "Tamil Nadu Uniformed Services (TNUSRB) Official Feed",
    "organizationSlug": "tnusrb",
    "organizationName": "Tamil Nadu Uniformed Services Recruitment Board",
    "jurisdiction": "state",
    "stateCode": "TN",
    "baseUrl": "https://www.tnusrb.tn.gov.in",
    "recruitmentPath": "/recruitment",
    "applyUrl": "https://www.tnusrb.tn.gov.in",
    "defaultCategory": "police-jobs",
    "canonicalNotices": [
      {
        "advertisement_number": "TNUSRB/CR-2026/01",
        "title": "TNUSRB Common Recruitment 2026 for Gr.II Police Constables, Jail Warders & Firemen",
        "ministry_or_department": "Home Department, Government of Tamil Nadu",
        "post_name": "Grade II Police Constable (Armed Reserve / Special Force), Jail Warder, Fireman",
        "total_vacancies": 3359,
        "date_of_notification": "2026-02-16",
        "closing_date": "2026-03-31",
        "pdf_url": "https://www.tnusrb.tn.gov.in/docs/TNUSRB_CR_2026.pdf",
        "apply_url": "https://www.tnusrb.tn.gov.in",
        "qualification_summary": "10th Standard (SSLC) pass or equivalent with Tamil as one of the subjects.",
        "age_limit_summary": "18 to 26 years for General; up to 31 years for BC/MBC/SC/ST.",
        "pay_scale": "Pay Scale: Rs. 18,200 - 58,000",
        "min_age": 18,
        "max_age": 31
      }
    ]
  },

  {
    "key": "tslprb_official_feed",
    "name": "Telangana Police (TSLPRB) Official Feed",
    "organizationSlug": "tslprb",
    "organizationName": "Telangana State Level Police Recruitment Board",
    "jurisdiction": "state",
    "stateCode": "TS",
    "baseUrl": "https://www.tslprb.in",
    "recruitmentPath": "/notifications",
    "applyUrl": "https://www.tslprb.in",
    "defaultCategory": "police-jobs",
    "canonicalNotices": [
      {
        "advertisement_number": "TSLPRB/SCT-PC-SI/2026",
        "title": "Telangana State Police SCT Sub-Inspector & Police Constable Recruitment 2026",
        "ministry_or_department": "Home Department, Government of Telangana",
        "post_name": "Stipendiary Cadet Trainee (SCT) Police Constable (Civil/AR/TSSP) & Sub-Inspector",
        "total_vacancies": 16614,
        "date_of_notification": "2026-02-14",
        "closing_date": "2026-03-28",
        "pdf_url": "https://www.tslprb.in/docs/TSLPRB_Notification_2026.pdf",
        "apply_url": "https://www.tslprb.in",
        "qualification_summary": "Intermediate (10+2) pass for Constable; Graduation for Sub-Inspector.",
        "age_limit_summary": "18 to 22 years for PC; 21 to 25 years for SI (+5 years state relaxation).",
        "pay_scale": "Rs. 24,280 - 72,850 (PC) / Rs. 42,300 - 1,15,270 (SI)",
        "min_age": 18,
        "max_age": 30
      }
    ]
  },

  {
    "key": "ksp_police_official_feed",
    "name": "Karnataka State Police (KSP) Official Feed",
    "organizationSlug": "ksp",
    "organizationName": "Karnataka State Police",
    "jurisdiction": "state",
    "stateCode": "KA",
    "baseUrl": "https://ksp.karnataka.gov.in",
    "recruitmentPath": "/recruitment",
    "applyUrl": "https://ksp.karnataka.gov.in",
    "defaultCategory": "police-jobs",
    "canonicalNotices": [
      {
        "advertisement_number": "KSP/CPC-PSI/2026",
        "title": "Karnataka State Police Civil Police Constable (CPC) & Police Sub-Inspector (PSI) 2026",
        "ministry_or_department": "Home Department, Government of Karnataka",
        "post_name": "Civil Police Constable (Men & Women) / Armed Police Constable / PSI (Civil)",
        "total_vacancies": 4100,
        "date_of_notification": "2026-02-12",
        "closing_date": "2026-03-27",
        "pdf_url": "https://ksp.karnataka.gov.in/docs/KSP_CPC_2026.pdf",
        "apply_url": "https://ksp.karnataka.gov.in",
        "qualification_summary": "PUC / 12th Standard for Constable; Bachelor's Degree for PSI.",
        "age_limit_summary": "19 to 27 years for GM; 19 to 30 years for SC/ST/OBC.",
        "pay_scale": "Pay Matrix: Rs. 23,500 - 47,650 (CPC) / Rs. 37,900 - 70,850 (PSI)",
        "min_age": 19,
        "max_age": 30
      }
    ]
  },

  // =========================================================================
  // STATE STAFF SELECTION & SUBORDINATE BOARDS
  // =========================================================================
  {
    "key": "osssc_official_feed",
    "name": "Odisha Sub-ordinate Staff Selection Commission (OSSSC) Official Feed",
    "organizationSlug": "osssc",
    "organizationName": "Odisha Sub-ordinate Staff Selection Commission",
    "jurisdiction": "state",
    "stateCode": "OR",
    "baseUrl": "https://www.osssc.gov.in",
    "recruitmentPath": "/notices",
    "applyUrl": "https://www.osssc.gov.in",
    "defaultCategory": "state-govt",
    "canonicalNotices": [
      {
        "advertisement_number": "OSSSC/CRE-2026/02",
        "title": "OSSSC Combined Recruitment Examination (CRE) for RI, ARI, Amin, ICDS & Panchayat Executive Officer",
        "ministry_or_department": "Revenue and Disaster Management / Panchayati Raj, Government of Odisha",
        "post_name": "Revenue Inspector (RI), Assistant RI, Amin, PEO, Junior Assistant",
        "total_vacancies": 2895,
        "date_of_notification": "2026-02-15",
        "closing_date": "2026-03-30",
        "pdf_url": "https://www.osssc.gov.in/Public/Notices/CRE_2026_Advt.pdf",
        "apply_url": "https://www.osssc.gov.in",
        "qualification_summary": "Bachelor's Degree for RI; Higher Secondary (10+2) for ARI/Amin with Odia proficiency.",
        "age_limit_summary": "21 to 38 years as on 01-01-2026.",
        "pay_scale": "Pay Matrix Level 9 (RI) / Level 4 (ARI/Amin)",
        "min_age": 21,
        "max_age": 38
      }
    ]
  },

  {
    "key": "uksssc_official_feed",
    "name": "Uttarakhand Subordinate Service Selection Commission (UKSSSC) Official Feed",
    "organizationSlug": "uksssc",
    "organizationName": "Uttarakhand Subordinate Service Selection Commission",
    "jurisdiction": "state",
    "stateCode": "UK",
    "baseUrl": "https://sssc.uk.gov.in",
    "recruitmentPath": "/recruitment",
    "applyUrl": "https://sssc.uk.gov.in",
    "defaultCategory": "state-govt",
    "canonicalNotices": [
      {
        "advertisement_number": "UKSSSC/Group-C/2026/01",
        "title": "UKSSSC Group C Combined Graduate & Intermediate Level Recruitment 2026",
        "ministry_or_department": "Personnel and Administrative Reforms, Government of Uttarakhand",
        "post_name": "Village Development Officer (VDO), VPDO, Junior Assistant, Forest Guard",
        "total_vacancies": 1410,
        "date_of_notification": "2026-02-12",
        "closing_date": "2026-03-28",
        "pdf_url": "https://sssc.uk.gov.in/files/Group_C_2026_Advt.pdf",
        "apply_url": "https://sssc.uk.gov.in",
        "qualification_summary": "Graduation for VDO/VPDO; 10+2 for Junior Assistant & Forest Guard.",
        "age_limit_summary": "18 to 42 years as on 01-07-2026.",
        "pay_scale": "Pay Level 2 to Level 5 (Rs. 19,900 - 92,300)",
        "min_age": 18,
        "max_age": 42
      }
    ]
  },

  {
    "key": "jssc_official_feed",
    "name": "Jharkhand Staff Selection Commission (JSSC) Official Feed",
    "organizationSlug": "jssc",
    "organizationName": "Jharkhand Staff Selection Commission",
    "jurisdiction": "state",
    "stateCode": "JH",
    "baseUrl": "https://jssc.nic.in",
    "recruitmentPath": "/notices",
    "applyUrl": "https://jssc.nic.in",
    "defaultCategory": "state-govt",
    "canonicalNotices": [
      {
        "advertisement_number": "JSSC/JGGLCCE-2026",
        "title": "Jharkhand General Graduate Level Combined Competitive Exam (JGGLCCE / CGL) 2026",
        "ministry_or_department": "Department of Personnel, Administrative Reforms, Government of Jharkhand",
        "post_name": "Assistant Branch Officer (ABO), Junior Secretariat Assistant (JSA), Block Supply Officer",
        "total_vacancies": 2017,
        "date_of_notification": "2026-02-14",
        "closing_date": "2026-03-29",
        "pdf_url": "https://jssc.nic.in/sites/default/files/JGGLCCE_2026_Brochure.pdf",
        "apply_url": "https://jssc.nic.in",
        "qualification_summary": "Graduation from a recognized University.",
        "age_limit_summary": "21 to 35 years for UR; 37 for BC/EBC; 40 for SC/ST.",
        "pay_scale": "Pay Level 2 to Level 7 (Rs. 19,900 - 1,42,400)",
        "min_age": 21,
        "max_age": 35
      }
    ]
  },

  {
    "key": "kea_karnataka_official_feed",
    "name": "Karnataka Examinations Authority (KEA Non-Gazetted) Official Feed",
    "organizationSlug": "kea",
    "organizationName": "Karnataka Examinations Authority",
    "jurisdiction": "state",
    "stateCode": "KA",
    "baseUrl": "https://cetonline.karnataka.gov.in/kea",
    "recruitmentPath": "/recruitment",
    "applyUrl": "https://cetonline.karnataka.gov.in/kea",
    "defaultCategory": "state-govt",
    "canonicalNotices": [
      {
        "advertisement_number": "KEA/RECT/FDA-SDA-VAO/2026",
        "title": "KEA Village Administrative Officer (VAO), FDA & SDA State Recruitment 2026",
        "ministry_or_department": "Revenue Department & Boards / Corporations, Government of Karnataka",
        "post_name": "Village Administrative Officer (VAO), First Division Assistant (FDA), SDA",
        "total_vacancies": 3200,
        "date_of_notification": "2026-02-10",
        "closing_date": "2026-03-26",
        "pdf_url": "https://cetonline.karnataka.gov.in/kea/docs/VAO_2026_Notification.pdf",
        "apply_url": "https://cetonline.karnataka.gov.in/kea",
        "qualification_summary": "PUC / 12th standard pass from recognized board for VAO; Degree for FDA.",
        "age_limit_summary": "18 to 35 years for General Merit; 18 to 38 for 2A/2B/3A/3B; 18 to 40 for SC/ST/Cat-I.",
        "pay_scale": "Rs. 21,400 - 42,000 (VAO/SDA) / Rs. 27,650 - 52,650 (FDA)",
        "min_age": 18,
        "max_age": 35
      }
    ]
  },

  {
    "key": "psssb_official_feed",
    "name": "Punjab Subordinate Services Selection Board (PSSSB) Official Feed",
    "organizationSlug": "psssb",
    "organizationName": "Punjab Subordinate Services Selection Board",
    "jurisdiction": "state",
    "stateCode": "PB",
    "baseUrl": "https://sssb.punjab.gov.in",
    "recruitmentPath": "/advertisements.html",
    "applyUrl": "https://sssb.punjab.gov.in",
    "defaultCategory": "state-govt",
    "canonicalNotices": [
      {
        "advertisement_number": "PSSSB/Advt-02/2026",
        "title": "PSSSB Clerk, Revenue Patwari, Junior Draftsman & Veterinary Inspector 2026",
        "ministry_or_department": "Department of General Administration / Revenue, Government of Punjab",
        "post_name": "Clerk / Clerk-IT / Revenue Patwari / Junior Draftsman",
        "total_vacancies": 1650,
        "date_of_notification": "2026-02-15",
        "closing_date": "2026-03-30",
        "pdf_url": "https://sssb.punjab.gov.in/docs/Advt_02_2026_Clerk.pdf",
        "apply_url": "https://sssb.punjab.gov.in",
        "qualification_summary": "Bachelor's Degree in any discipline + Computer Course certificate (ISO certified 120 hours).",
        "age_limit_summary": "18 to 37 years as on 01-01-2026 (relaxations up to 42 for SC/BC).",
        "pay_scale": "Pay Scale: Rs. 19,900/- to Rs. 29,200/- minimum pay admissible",
        "min_age": 18,
        "max_age": 37
      }
    ]
  },

  {
    "key": "gsssb_official_feed",
    "name": "Gujarat Subordinate Service Selection Board (GSSSB) Official Feed",
    "organizationSlug": "gsssb",
    "organizationName": "Gujarat Subordinate Service Selection Board",
    "jurisdiction": "state",
    "stateCode": "GJ",
    "baseUrl": "https://gsssb.gujarat.gov.in",
    "recruitmentPath": "/advertisements",
    "applyUrl": "https://ojas.gujarat.gov.in",
    "defaultCategory": "state-govt",
    "canonicalNotices": [
      {
        "advertisement_number": "GSSSB/CCE/2026/01",
        "title": "GSSSB Combined Competitive Examination (CCE) for Junior Clerk, Senior Clerk, Head Clerk & Office Assistant",
        "ministry_or_department": "General Administration Department, Government of Gujarat",
        "post_name": "Junior Clerk, Senior Clerk, Head Clerk, Office Assistant, Sub-Accountant",
        "total_vacancies": 5554,
        "date_of_notification": "2026-02-12",
        "closing_date": "2026-03-27",
        "pdf_url": "https://gsssb.gujarat.gov.in/docs/CCE_2026_Detailed_Advt.pdf",
        "apply_url": "https://ojas.gujarat.gov.in",
        "qualification_summary": "Bachelor's Degree in any stream from recognized University with basic computer knowledge.",
        "age_limit_summary": "20 to 35 years as on closing date.",
        "pay_scale": "Fixed Pay Rs. 26,000/- for 5 years; regular Pay Matrix Level 2 to Level 7",
        "min_age": 20,
        "max_age": 35
      }
    ]
  },

  // =========================================================================
  // UNIVERSITIES, PREMIER INSTITUTES & MEDICAL CENTERS
  // =========================================================================
  {
    "key": "iit_institutes_official_feed",
    "name": "Indian Institutes of Technology (IITs Non-Teaching & Faculty) Feed",
    "organizationSlug": "iit-institutes",
    "organizationName": "Indian Institutes of Technology (IIT Delhi / Bombay / Madras / Kanpur / KGP)",
    "jurisdiction": "autonomous",
    "baseUrl": "https://home.iitd.ac.in",
    "recruitmentPath": "/jobs-iitd",
    "applyUrl": "https://home.iitd.ac.in/jobs-iitd",
    "defaultCategory": "teaching-jobs",
    "canonicalNotices": [
      {
        "advertisement_number": "IIT/Non-Teaching/2026/01",
        "title": "IIT Centralized Non-Teaching Staff (Junior Assistant, Technical Superintendent, Registrar) 2026",
        "ministry_or_department": "Ministry of Education, Government of India",
        "post_name": "Junior Assistant / Junior Technical Superintendent / Assistant Registrar / Executive Engineer",
        "total_vacancies": 420,
        "date_of_notification": "2026-02-14",
        "closing_date": "2026-03-28",
        "pdf_url": "https://home.iitd.ac.in/career/IITD_Staff_Recruitment_2026.pdf",
        "apply_url": "https://home.iitd.ac.in",
        "qualification_summary": "Bachelor's Degree for Junior Assistant; B.Tech / M.Sc / MCA for Technical Superintendent.",
        "age_limit_summary": "27 years for Junior Assistant; 35 years for Superintendent; 45 for Registrar.",
        "pay_scale": "Level 3 (Junior Assistant) to Level 10 (Assistant Registrar)",
        "min_age": 21,
        "max_age": 45
      }
    ]
  },

  {
    "key": "nit_institutes_official_feed",
    "name": "National Institutes of Technology (NITs Staff & Faculty) Feed",
    "organizationSlug": "nit-institutes",
    "organizationName": "National Institutes of Technology (NIT Trichy / Surathkal / Warangal / Calicut / Rourkela)",
    "jurisdiction": "autonomous",
    "baseUrl": "https://www.nitt.edu",
    "recruitmentPath": "/recruitment",
    "applyUrl": "https://www.nitt.edu",
    "defaultCategory": "teaching-jobs",
    "canonicalNotices": [
      {
        "advertisement_number": "NTA/NIT-NonTeaching/2026",
        "title": "NIT Non-Teaching Staff Centralized Recruitment (Junior Assistant, Technician, SAS Assistant) 2026",
        "ministry_or_department": "Ministry of Education, Government of India",
        "post_name": "Junior Assistant / Technician / Senior Technician / Technical Assistant / Superintendent",
        "total_vacancies": 650,
        "date_of_notification": "2026-02-16",
        "closing_date": "2026-03-31",
        "pdf_url": "https://recruitment.nta.nic.in/docs/NIT_Recruitment_2026.pdf",
        "apply_url": "https://recruitment.nta.nic.in",
        "qualification_summary": "Senior Secondary (10+2) with 60% or ITI for Technician; Bachelor's Degree for JA / Technical Assistant.",
        "age_limit_summary": "27 years for JA / Technician; 30 years for Technical Assistant.",
        "pay_scale": "Level 3 (Technician/JA) / Level 6 (Technical Assistant)",
        "min_age": 18,
        "max_age": 30
      }
    ]
  },

  {
    "key": "central_universities_official_feed",
    "name": "Central Universities Non-Teaching Recruitment Feed",
    "organizationSlug": "central-universities",
    "organizationName": "Central Universities (DU / JNU / BHU / AMU / Jamia)",
    "jurisdiction": "autonomous",
    "baseUrl": "http://www.du.ac.in",
    "recruitmentPath": "/recruitment",
    "applyUrl": "http://www.du.ac.in",
    "defaultCategory": "teaching-jobs",
    "canonicalNotices": [
      {
        "advertisement_number": "CU/NTA/Non-Teaching/2026",
        "title": "Central Universities Combined Non-Teaching Staff Recruitment (DU, BHU, JNU, AMU) 2026",
        "ministry_or_department": "University Grants Commission (UGC) / Ministry of Education",
        "post_name": "Junior Assistant / Laboratory Assistant / Section Officer / Senior Technical Assistant",
        "total_vacancies": 1180,
        "date_of_notification": "2026-02-12",
        "closing_date": "2026-03-27",
        "pdf_url": "http://www.du.ac.in/uploads/advt2026/NonTeaching_Advt.pdf",
        "apply_url": "http://www.du.ac.in",
        "qualification_summary": "10+2 / Diploma / Bachelor's Degree / Master's Degree depending on post.",
        "age_limit_summary": "27 to 35 years as per post norms (relaxations for reserved categories).",
        "pay_scale": "Pay Level 2 to Level 7",
        "min_age": 18,
        "max_age": 35
      }
    ]
  },

  {
    "key": "aiims_regional_official_feed",
    "name": "AIIMS Regional Institutes (NORCET & Staff) Official Feed",
    "organizationSlug": "aiims-regional",
    "organizationName": "All India Institute of Medical Sciences (Regional Centers)",
    "jurisdiction": "autonomous",
    "baseUrl": "https://aiimspatna.edu.in",
    "recruitmentPath": "/recruitment",
    "applyUrl": "https://aiimsexams.ac.in",
    "defaultCategory": "medical-health",
    "canonicalNotices": [
      {
        "advertisement_number": "AIIMS/NORCET-07/2026",
        "title": "Nursing Officer Recruitment Common Eligibility Test (NORCET-7) for All AIIMS Institutes 2026",
        "ministry_or_department": "Ministry of Health and Family Welfare, Government of India",
        "post_name": "Nursing Officer (Group B) at AIIMS New Delhi, Patna, Bhopal, Bhubaneswar, Rishikesh, Jodhpur, Raipur",
        "total_vacancies": 3550,
        "date_of_notification": "2026-02-15",
        "closing_date": "2026-03-29",
        "pdf_url": "https://aiimsexams.ac.in/pdf/NORCET_07_2026_Advt.pdf",
        "apply_url": "https://aiimsexams.ac.in",
        "qualification_summary": "B.Sc. (Hons.) Nursing / B.Sc. Nursing or GNM with 2 years experience in min. 50 bedded hospital.",
        "age_limit_summary": "18 to 30 years as on closing date.",
        "pay_scale": "Level 07 in Pay Matrix (Rs. 44,900 - 1,42,400)",
        "min_age": 18,
        "max_age": 30
      }
    ]
  },

  // =========================================================================
  // HIGH COURTS & STATE JUDICIAL SERVICES
  // =========================================================================
  {
    "key": "bombay_hc_official_feed",
    "name": "High Court of Judicature at Bombay Official Feed",
    "organizationSlug": "bombay-hc",
    "organizationName": "High Court of Judicature at Bombay",
    "jurisdiction": "state",
    "stateCode": "MH",
    "baseUrl": "https://bombayhighcourt.nic.in",
    "recruitmentPath": "/recruitment.php",
    "applyUrl": "https://bombayhighcourt.nic.in",
    "defaultCategory": "central-govt",
    "canonicalNotices": [
      {
        "advertisement_number": "BHC/Recruitment/Clerk-Steno/2026",
        "title": "Bombay High Court Clerk, Stenographer & Peon / Hamal Recruitment 2026",
        "ministry_or_department": "High Court Administration, Bombay",
        "post_name": "Clerk (Junior Judicial Assistant), Stenographer (L.G./H.G.), Peon / Hamal",
        "total_vacancies": 4629,
        "date_of_notification": "2026-02-14",
        "closing_date": "2026-03-28",
        "pdf_url": "https://bombayhighcourt.nic.in/recruitment/BHC_Clerk_2026.pdf",
        "apply_url": "https://bombayhighcourt.nic.in",
        "qualification_summary": "Bachelor's Degree in any faculty with English typing (40 wpm) and Marathi typing (30 wpm) for Clerk; 7th pass for Peon.",
        "age_limit_summary": "18 to 38 years for General; 18 to 43 years for Reserved categories.",
        "pay_scale": "S-6 (Rs. 19,900 - 63,200) for Clerk; S-1 (Rs. 15,000 - 47,600) for Peon",
        "min_age": 18,
        "max_age": 43
      }
    ]
  },

  {
    "key": "calcutta_hc_official_feed",
    "name": "High Court at Calcutta Official Feed",
    "organizationSlug": "calcutta-hc",
    "organizationName": "High Court at Calcutta",
    "jurisdiction": "state",
    "stateCode": "WB",
    "baseUrl": "https://www.calcuttahighcourt.gov.in",
    "recruitmentPath": "/notices/recruitment",
    "applyUrl": "https://www.calcuttahighcourt.gov.in",
    "defaultCategory": "central-govt",
    "canonicalNotices": [
      {
        "advertisement_number": "CHC/Estt/PA-LDC/2026",
        "title": "Calcutta High Court Lower Division Assistant (LDA), Personal Assistant & Process Server 2026",
        "ministry_or_department": "High Court of Judicature at Calcutta (Appellate & Original Side)",
        "post_name": "Lower Division Assistant (LDA), Personal Assistant, Stenographer, Process Server",
        "total_vacancies": 294,
        "date_of_notification": "2026-02-11",
        "closing_date": "2026-03-25",
        "pdf_url": "https://www.calcuttahighcourt.gov.in/pdf/recruitment/LDA_2026_Advt.pdf",
        "apply_url": "https://www.calcuttahighcourt.gov.in",
        "qualification_summary": "Higher Secondary (10+2) or Degree from recognized University with Computer Operations.",
        "age_limit_summary": "18 to 40 years as on 01-01-2026 (relaxations as per WB rules).",
        "pay_scale": "Pay Level 6 (Rs. 22,700 - 58,500) to Level 12",
        "min_age": 18,
        "max_age": 40
      }
    ]
  },

  {
    "key": "madras_hc_official_feed",
    "name": "High Court of Judicature at Madras Official Feed",
    "organizationSlug": "madras-hc",
    "organizationName": "High Court of Judicature at Madras",
    "jurisdiction": "state",
    "stateCode": "TN",
    "baseUrl": "https://www.mhc.tn.gov.in",
    "recruitmentPath": "/recruitment",
    "applyUrl": "https://www.mhc.tn.gov.in/recruitment",
    "defaultCategory": "central-govt",
    "canonicalNotices": [
      {
        "advertisement_number": "MHC/Notification-01/2026",
        "title": "Madras High Court Examiner, Reader, Senior Bailiff, Junior Bailiff, Process Server & Office Assistant",
        "ministry_or_department": "Judicial Department, Government of Tamil Nadu",
        "post_name": "Examiner, Reader, Senior Bailiff, Driver, Process Server, Office Assistant",
        "total_vacancies": 2329,
        "date_of_notification": "2026-02-15",
        "closing_date": "2026-03-30",
        "pdf_url": "https://www.mhc.tn.gov.in/recruitment/docs/MHC_Subordinate_2026.pdf",
        "apply_url": "https://www.mhc.tn.gov.in/recruitment",
        "qualification_summary": "10th / SSLC pass for Bailiff/Examiner; 8th pass for Office Assistant.",
        "age_limit_summary": "18 to 32 years for General; 18 to 37 years for SC/ST; 18 to 34 for BC/MBC.",
        "pay_scale": "Level 8 (Rs. 19,500 - 71,900) / Level 1 (Rs. 15,700 - 58,100)",
        "min_age": 18,
        "max_age": 37
      }
    ]
  },

  {
    "key": "rajasthan_hc_official_feed",
    "name": "High Court of Judicature for Rajasthan Official Feed",
    "organizationSlug": "rajasthan-hc",
    "organizationName": "High Court of Judicature for Rajasthan (Jodhpur)",
    "jurisdiction": "state",
    "stateCode": "RJ",
    "baseUrl": "https://hcraj.nic.in",
    "recruitmentPath": "/recruitment.php",
    "applyUrl": "https://hcraj.nic.in",
    "defaultCategory": "central-govt",
    "canonicalNotices": [
      {
        "advertisement_number": "HCRAJ/Estt/JJA-Clerk/2026",
        "title": "Rajasthan High Court Junior Judicial Assistant (JJA), Junior Assistant & Clerk Grade II 2026",
        "ministry_or_department": "Rajasthan High Court Administration",
        "post_name": "Junior Judicial Assistant (JJA), Clerk Grade-II, Junior Assistant (DLSA / RSLSA)",
        "total_vacancies": 2756,
        "date_of_notification": "2026-02-10",
        "closing_date": "2026-03-26",
        "pdf_url": "https://hcraj.nic.in/recruitment/JJA_Clerk_2026_Advt.pdf",
        "apply_url": "https://hcraj.nic.in",
        "qualification_summary": "Graduation of any University established by law in India and basic computer knowledge.",
        "age_limit_summary": "18 to 40 years as on 01-01-2027.",
        "pay_scale": "Pay Matrix L-5 (Stipend Rs. 14,600 during 2 years probation; running pay Rs. 20,800 - 65,900)",
        "min_age": 18,
        "max_age": 40
      }
    ]
  },

  {
    "key": "punjab_haryana_hc_official_feed",
    "name": "High Court of Punjab & Haryana Official Feed",
    "organizationSlug": "punjab-haryana-hc",
    "organizationName": "High Court of Punjab and Haryana (Chandigarh)",
    "jurisdiction": "state",
    "stateCode": "PB",
    "baseUrl": "https://highcourtchd.gov.in",
    "recruitmentPath": "/recruitment.php",
    "applyUrl": "https://sssc.gov.in",
    "defaultCategory": "central-govt",
    "canonicalNotices": [
      {
        "advertisement_number": "SSSC/PB-HR/Clerk/2026",
        "title": "Punjab & Haryana High Court Society for Centralized Recruitment (SSSC) Clerk & Steno 2026",
        "ministry_or_department": "High Court Administration, Chandigarh",
        "post_name": "Clerk (Subordinate Courts of Punjab & Haryana) / Stenographer Grade-III",
        "total_vacancies": 1280,
        "date_of_notification": "2026-02-12",
        "closing_date": "2026-03-27",
        "pdf_url": "https://highcourtchd.gov.in/pdf/Clerk_Recruitment_2026.pdf",
        "apply_url": "https://sssc.gov.in",
        "qualification_summary": "Degree of Bachelor of Arts or Bachelor of Science or equivalent + Matriculation with Punjabi / Hindi.",
        "age_limit_summary": "18 to 37 years for Punjab; 18 to 42 years for Haryana as on 01-01-2026.",
        "pay_scale": "Pay Matrix Level 2 (Rs. 19,900 - 63,200)",
        "min_age": 18,
        "max_age": 42
      }
    ]
  },

  {
    "key": "gujarat_hc_official_feed",
    "name": "High Court of Gujarat Official Feed",
    "organizationSlug": "gujarat-hc",
    "organizationName": "High Court of Gujarat (Ahmedabad)",
    "jurisdiction": "state",
    "stateCode": "GJ",
    "baseUrl": "https://gujarathighcourt.nic.in",
    "recruitmentPath": "/current-openings",
    "applyUrl": "https://hc-ojas.gujarat.gov.in",
    "defaultCategory": "central-govt",
    "canonicalNotices": [
      {
        "advertisement_number": "HCG/Recruitment/Assistant-Peon/2026",
        "title": "Gujarat High Court Assistant, Deputy Section Officer (DySO) & Class IV Staff 2026",
        "ministry_or_department": "Gujarat High Court Administration & Subordinate Courts",
        "post_name": "Assistant (Junior Clerk), Deputy Section Officer, English/Gujarati Stenographer, Peon",
        "total_vacancies": 1948,
        "date_of_notification": "2026-02-14",
        "closing_date": "2026-03-29",
        "pdf_url": "https://gujarathighcourt.nic.in/pdf/Advt_Assistant_2026.pdf",
        "apply_url": "https://hc-ojas.gujarat.gov.in",
        "qualification_summary": "Bachelor's Degree from recognized University with basic computer operations knowledge and Gujarati/English typing.",
        "age_limit_summary": "21 to 35 years as on closing date.",
        "pay_scale": "Pay Matrix: Rs. 19,900 - 63,200 (Assistant) / Rs. 39,900 - 1,26,600 (DySO)",
        "min_age": 21,
        "max_age": 35
      }
    ]
  },
];


