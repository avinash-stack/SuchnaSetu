import type { GovJobSourceConfig } from "./sources.config";

/**
 * State-wise Job Sources Expansion for 12 Priority States:
 * UP, BR, MP, JH, RJ, MH, WB, HR, PB, OD, CG, UK
 *
 * Covers: State PSC, SSSB, Police, Health/Medical, Education/Teacher,
 * High Courts, Power/Electricity Corporations, and State Transport Corporations.
 */
export const STATE_JOB_SOURCES_EXPANSION_CONFIG: GovJobSourceConfig[] = [
  // =========================================================================
  // 1. UTTAR PRADESH (UP) - High-Volume State Recruitment Boards
  // =========================================================================
  {
    key: "upsessb_official_feed",
    name: "UP Secondary Education Service Selection Board (UPSESSB) Official Feed",
    organizationSlug: "upsessb",
    organizationName: "Uttar Pradesh Secondary Education Service Selection Board",
    jurisdiction: "state",
    stateCode: "UP",
    baseUrl: "https://upsessb.org",
    recruitmentPath: "/notifications",
    applyUrl: "https://pariksha.up.nic.in",
    defaultCategory: "teaching",
    canonicalNotices: [
      {
        advertisement_number: "UPSESSB/TGT-PGT/2026/01",
        title: "UPSESSB Trained Graduate Teacher (TGT) & Post Graduate Teacher (PGT) 2026",
        ministry_or_department: "Department of Secondary Education, Government of Uttar Pradesh",
        post_name: "Trained Graduate Teacher (TGT) & Post Graduate Teacher (PGT)",
        total_vacancies: 4163,
        category_code: "teaching",
        date_of_notification: "2026-02-12",
        closing_date: "2026-03-31",
        pdf_url: "https://upsessb.org/docs/TGT_PGT_2026_Notification.pdf",
        apply_url: "https://pariksha.up.nic.in",
        qualification_summary: "Graduate Degree in relevant discipline with B.Ed for TGT; Master Degree in concerned subject for PGT from a recognized university.",
        age_limit_summary: "Minimum 21 years as on 01-07-2026 (No upper age limit for eligible candidates).",
        pay_scale: "Pay Level 7 (Rs. 44,900 - 1,42,400) for TGT; Pay Level 8 (Rs. 47,600 - 1,51,100) for PGT",
        selection_process: "Written Competitive Examination (500 Marks) followed by Document Verification.",
        min_age: 21,
        max_age: 60,
        fee_details: { general_obc_ews: 750, sc_st_pwd_women: 450, payment_mode: "Online Net Banking / SBI E-Challan" }
      }
    ]
  },
  {
    key: "uphesc_official_feed",
    name: "UP Higher Education Services Commission (UPHESC) Official Feed",
    organizationSlug: "uphesc",
    organizationName: "Uttar Pradesh Higher Education Services Commission",
    jurisdiction: "state",
    stateCode: "UP",
    baseUrl: "https://uphesc.org",
    recruitmentPath: "/vacancies",
    applyUrl: "https://uphesc2026.org",
    defaultCategory: "teaching",
    canonicalNotices: [
      {
        advertisement_number: "UPHESC/Advt-51/2026",
        title: "UPHESC Assistant Professor Recruitment in Aided Degree Colleges 2026",
        ministry_or_department: "Department of Higher Education, Uttar Pradesh",
        post_name: "Assistant Professor (Arts, Science, Commerce, B.Ed & Law)",
        total_vacancies: 1017,
        category_code: "teaching",
        date_of_notification: "2026-01-28",
        closing_date: "2026-03-15",
        pdf_url: "https://uphesc.org/files/Advt_51_Detailed_Notice.pdf",
        apply_url: "https://uphesc2026.org",
        qualification_summary: "Master's Degree with minimum 55% marks in concerned subject and qualified UGC-NET / CSIR-NET or Ph.D. as per UGC regulations.",
        age_limit_summary: "Maximum 62 years as on 01-07-2026.",
        pay_scale: "Academic Level 10 (Pay Band Rs. 57,700 - 1,82,400)",
        selection_process: "Objective Written Examination (200 Marks) followed by Interview (30 Marks).",
        min_age: 21,
        max_age: 62
      }
    ]
  },
  {
    key: "upmsb_medical_feed",
    name: "UP Directorate of Medical Education & Training (UPDGME) Official Feed",
    organizationSlug: "updgme",
    organizationName: "Directorate of Medical Education and Training Uttar Pradesh",
    jurisdiction: "state",
    stateCode: "UP",
    baseUrl: "https://dgme.up.gov.in",
    recruitmentPath: "/recruitments",
    applyUrl: "https://dgme.up.gov.in/apply",
    defaultCategory: "medical",
    canonicalNotices: [
      {
        advertisement_number: "DGME/Faculty-SR/2026/04",
        title: "UP Medical Colleges Faculty, Senior Resident & Medical Officer Recruitment 2026",
        ministry_or_department: "Medical Education Department, Government of Uttar Pradesh",
        post_name: "Assistant Professor, Senior Resident & Medical Officer",
        total_vacancies: 2248,
        category_code: "medical",
        date_of_notification: "2026-02-10",
        closing_date: "2026-03-25",
        pdf_url: "https://dgme.up.gov.in/notices/Medical_Faculty_2026.pdf",
        apply_url: "https://dgme.up.gov.in/apply",
        qualification_summary: "MBBS with MD/MS/DNB in relevant specialty and NMC registration.",
        age_limit_summary: "Up to 45 years (relaxation for reserved categories).",
        pay_scale: "Level 11 / Level 12 (Rs. 67,700 - 2,09,200)",
        min_age: 25,
        max_age: 45
      }
    ]
  },
  {
    key: "upsrtc_transport_feed",
    name: "UP State Road Transport Corporation (UPSRTC) Official Feed",
    organizationSlug: "upsrtc",
    organizationName: "Uttar Pradesh State Road Transport Corporation",
    jurisdiction: "state",
    stateCode: "UP",
    baseUrl: "https://upsrtc.up.gov.in",
    recruitmentPath: "/recruitment",
    applyUrl: "https://sewayojan.up.nic.in",
    defaultCategory: "central-govt",
    canonicalNotices: [
      {
        advertisement_number: "UPSRTC/Conductor-Driver/2026/08",
        title: "UPSRTC Samvida Conductor & Heavy Driver Recruitment 2026",
        ministry_or_department: "Transport Department, Government of Uttar Pradesh",
        post_name: "Samvida Bus Conductor & Heavy Vehicle Driver",
        total_vacancies: 3114,
        category_code: "central-govt",
        date_of_notification: "2026-01-18",
        closing_date: "2026-03-10",
        pdf_url: "https://upsrtc.up.gov.in/notices/UPSRTC_Conductor_2026.pdf",
        apply_url: "https://sewayojan.up.nic.in",
        qualification_summary: "Intermediate (10+2) with CCC Certificate / ITI from recognized board; valid HMV Commercial Driving License for Drivers.",
        age_limit_summary: "18 to 40 years as on 01-01-2026.",
        pay_scale: "Kilometer-based Incentive & Consolidated Pay (Rs. 18,500 - 24,000 / month)",
        min_age: 18,
        max_age: 40
      }
    ]
  },
  {
    key: "up_revenue_board_feed",
    name: "UP Board of Revenue (Revenue Council) Official Feed",
    organizationSlug: "up-revenue-board",
    organizationName: "Board of Revenue Uttar Pradesh",
    jurisdiction: "state",
    stateCode: "UP",
    baseUrl: "https://bor.up.nic.in",
    recruitmentPath: "/recruitment-notices",
    applyUrl: "https://upsssc.gov.in",
    defaultCategory: "central-govt",
    canonicalNotices: [
      {
        advertisement_number: "UP-BOR/Rajasva-Nirikshak/2026",
        title: "Uttar Pradesh Rajasva Parishad Revenue Inspector (Kanoongo) Recruitment 2026",
        ministry_or_department: "Board of Revenue, Government of Uttar Pradesh",
        post_name: "Rajasva Nirikshak (Revenue Inspector) & Naib Tehsildar Cadre",
        total_vacancies: 1850,
        category_code: "central-govt",
        date_of_notification: "2026-02-05",
        closing_date: "2026-03-20",
        pdf_url: "https://bor.up.nic.in/notices/Revenue_Inspector_2026.pdf",
        apply_url: "https://upsssc.gov.in",
        qualification_summary: "Bachelor's Degree in Commerce or Economics or Arts/Science with valid UP PET score.",
        age_limit_summary: "21 to 40 years as on 01-07-2026.",
        pay_scale: "Pay Level 5 (Rs. 29,200 - 92,300)",
        min_age: 21,
        max_age: 40
      }
    ]
  },

  // =========================================================================
  // 2. BIHAR (BR) - High-Volume State Recruitment Boards
  // =========================================================================
  {
    key: "btsc_bihar_feed",
    name: "Bihar Technical Service Commission (BTSC) Official Feed",
    organizationSlug: "btsc-bihar",
    organizationName: "Bihar Technical Service Commission",
    jurisdiction: "state",
    stateCode: "BR",
    baseUrl: "https://btsc.bihar.gov.in",
    recruitmentPath: "/advertisements",
    applyUrl: "https://btsc.bihar.gov.in/apply",
    defaultCategory: "engineering",
    canonicalNotices: [
      {
        advertisement_number: "BTSC-JE-ANM/2026/01",
        title: "BTSC Junior Engineer (Civil/Mech/Elec) & Staff Nurse / ANM Recruitment 2026",
        ministry_or_department: "Building Construction, Water Resources & Health Department, Bihar",
        post_name: "Junior Engineer (Civil/Mechanical/Electrical), ANM & Medical Technologist",
        total_vacancies: 9216,
        category_code: "engineering",
        date_of_notification: "2026-02-01",
        closing_date: "2026-03-28",
        pdf_url: "https://btsc.bihar.gov.in/docs/Advt_JE_ANM_2026.pdf",
        apply_url: "https://btsc.bihar.gov.in/apply",
        qualification_summary: "Diploma in Civil/Mechanical/Electrical Engineering or Diploma in Nursing/ANM from recognized institution registered with Bihar Nursing Council.",
        age_limit_summary: "18 to 37 years for Males; up to 40 years for BC/EBC and Unreserved Females; 42 years for SC/ST.",
        pay_scale: "Level 7 (Grade Pay 4600) for JE; Level 4 for ANM",
        min_age: 18,
        max_age: 40
      }
    ]
  },
  {
    key: "bsrtc_transport_feed",
    name: "Bihar State Road Transport Corporation (BSRTC) Official Feed",
    organizationSlug: "bsrtc",
    organizationName: "Bihar State Road Transport Corporation",
    jurisdiction: "state",
    stateCode: "BR",
    baseUrl: "https://bsrtc.bihar.gov.in",
    recruitmentPath: "/recruitment",
    applyUrl: "https://bsrtc.bihar.gov.in/career",
    defaultCategory: "central-govt",
    canonicalNotices: [
      {
        advertisement_number: "BSRTC/Depot-Driver/2026/03",
        title: "BSRTC Depot Incharge, Bus Conductor & Electric Bus Driver Recruitment 2026",
        ministry_or_department: "Transport Department, Government of Bihar",
        post_name: "Assistant Depot Manager, Conductor & Heavy Commercial Driver",
        total_vacancies: 1420,
        category_code: "central-govt",
        date_of_notification: "2026-01-22",
        closing_date: "2026-03-12",
        pdf_url: "https://bsrtc.bihar.gov.in/docs/BSRTC_Recruitment_2026.pdf",
        apply_url: "https://bsrtc.bihar.gov.in/career",
        qualification_summary: "Class 10th / 12th pass with commercial HMV driving license or conductor badge.",
        age_limit_summary: "18 to 37 years (relaxations as per Bihar Govt norms).",
        pay_scale: "Pay Band Rs. 15,500 - 45,000 plus allowances",
        min_age: 18,
        max_age: 37
      }
    ]
  },
  {
    key: "bsusc_bihar_feed",
    name: "Bihar State University Service Commission (BSUSC) Official Feed",
    organizationSlug: "bsusc",
    organizationName: "Bihar State University Service Commission",
    jurisdiction: "state",
    stateCode: "BR",
    baseUrl: "https://bsusc.bihar.gov.in",
    recruitmentPath: "/vacancies",
    applyUrl: "https://bsusc.bihar.gov.in/login",
    defaultCategory: "teaching",
    canonicalNotices: [
      {
        advertisement_number: "BSUSC/AP-Regular/2026/02",
        title: "BSUSC Assistant Professor Recruitment in 13 State Universities of Bihar 2026",
        ministry_or_department: "Department of Education (Higher Education), Government of Bihar",
        post_name: "Assistant Professor (Various University Disciplines)",
        total_vacancies: 4638,
        category_code: "teaching",
        date_of_notification: "2026-02-15",
        closing_date: "2026-03-31",
        pdf_url: "https://bsusc.bihar.gov.in/notices/AP_State_Universities_2026.pdf",
        apply_url: "https://bsusc.bihar.gov.in/login",
        qualification_summary: "Master's degree with 55% marks and qualifying UGC/CSIR NET or Ph.D.",
        age_limit_summary: "Up to 55 years as on 01-01-2026.",
        pay_scale: "Academic Level 10 (Pay Matrix Rs. 57,700 - 1,82,400)",
        min_age: 22,
        max_age: 55
      }
    ]
  },
  {
    key: "bsmcl_mining_feed",
    name: "Bihar State Mining Corporation (BSMCL) Official Feed",
    organizationSlug: "bsmcl",
    organizationName: "Bihar State Mining Corporation Limited",
    jurisdiction: "state",
    stateCode: "BR",
    baseUrl: "https://bsmcl.bihar.gov.in",
    recruitmentPath: "/notices",
    applyUrl: "https://bsmcl.bihar.gov.in/careers",
    defaultCategory: "engineering",
    canonicalNotices: [
      {
        advertisement_number: "BSMCL/Mining-Staff/2026/01",
        title: "BSMCL Mining Inspector, Mines Geologist & Surveyor Recruitment 2026",
        ministry_or_department: "Mines and Geology Department, Government of Bihar",
        post_name: "Mines Inspector, Surveyor & Assistant Geologist",
        total_vacancies: 382,
        category_code: "engineering",
        date_of_notification: "2026-01-30",
        closing_date: "2026-03-18",
        pdf_url: "https://bsmcl.bihar.gov.in/pdf/Mining_Notice_2026.pdf",
        apply_url: "https://bsmcl.bihar.gov.in/careers",
        qualification_summary: "Diploma in Mining Engineering / B.Sc or M.Sc in Geology from recognized institute.",
        age_limit_summary: "21 to 37 years as on closing date.",
        pay_scale: "Pay Level 6 to Level 9 (Rs. 35,400 - 1,67,800)",
        min_age: 21,
        max_age: 37
      }
    ]
  },

  // =========================================================================
  // 3. MADHYA PRADESH (MP) - High-Volume State Recruitment Boards
  // =========================================================================
  {
    key: "mphc_official_feed",
    name: "High Court of Madhya Pradesh Official Feed",
    organizationSlug: "mp-high-court",
    organizationName: "High Court of Madhya Pradesh (Jabalpur)",
    jurisdiction: "state",
    stateCode: "MP",
    baseUrl: "https://mphc.gov.in",
    recruitmentPath: "/recruitment",
    applyUrl: "https://mphc.gov.in/online-application",
    defaultCategory: "central-govt",
    canonicalNotices: [
      {
        advertisement_number: "MPHC/Exam-Cell/2026/112",
        title: "MP High Court Stenographer, Assistant Grade-3, Junior Judicial Assistant & Civil Judge 2026",
        ministry_or_department: "High Court Administration & District Judiciary, Madhya Pradesh",
        post_name: "Assistant Grade-3, Steno Grade-2/3, Junior Judicial Assistant & Civil Judge",
        total_vacancies: 1640,
        category_code: "central-govt",
        date_of_notification: "2026-02-08",
        closing_date: "2026-03-24",
        pdf_url: "https://mphc.gov.in/pdf/MPHC_AG3_Steno_2026.pdf",
        apply_url: "https://mphc.gov.in/online-application",
        qualification_summary: "Graduate Degree in any discipline with CPCT score card and Hindi/English Shorthand/Typing certificate.",
        age_limit_summary: "18 to 40 years (up to 45 years for female and reserved category MP residents).",
        pay_scale: "Pay Matrix Level 4 to Level 7 (Rs. 25,300 - 1,12,400)",
        min_age: 18,
        max_age: 45
      }
    ]
  },
  {
    key: "mppolice_official_feed",
    name: "Madhya Pradesh Police Headquarters (PHQ Bhopal) Official Feed",
    organizationSlug: "mp-police",
    organizationName: "Madhya Pradesh Police",
    jurisdiction: "state",
    stateCode: "MP",
    baseUrl: "https://mppolice.gov.in",
    recruitmentPath: "/recruitment",
    applyUrl: "https://esb.mp.gov.in",
    defaultCategory: "defence",
    canonicalNotices: [
      {
        advertisement_number: "MP-POLICE/Constable-SI/2026/01",
        title: "MP Police Constable (General Duty & Radio), Sub-Inspector & Special Armed Force (SAF) 2026",
        ministry_or_department: "Home Department, Government of Madhya Pradesh",
        post_name: "Constable (GD/Radio), Sub-Inspector & SAF Jawan",
        total_vacancies: 7500,
        category_code: "defence",
        date_of_notification: "2026-01-20",
        closing_date: "2026-03-15",
        pdf_url: "https://mppolice.gov.in/docs/Police_Constable_SI_2026.pdf",
        apply_url: "https://esb.mp.gov.in",
        qualification_summary: "10th/12th Pass for Constable; Graduate in any discipline for Sub-Inspector from recognized university.",
        age_limit_summary: "18 to 36 years as on 01-01-2026 (including COVID upper age relief).",
        pay_scale: "Pay Matrix Level 4 (Rs. 19,500 - 62,000) for Constable; Level 8 for SI",
        min_age: 18,
        max_age: 36
      }
    ]
  },
  {
    key: "mppgcl_power_feed",
    name: "MP Power Generating Company & Discoms Official Feed",
    organizationSlug: "mppgcl",
    organizationName: "Madhya Pradesh Power Generating Company Limited (MPPGCL)",
    jurisdiction: "state",
    stateCode: "MP",
    baseUrl: "https://mppgcl.mp.gov.in",
    recruitmentPath: "/careers",
    applyUrl: "https://mponline.gov.in",
    defaultCategory: "engineering",
    canonicalNotices: [
      {
        advertisement_number: "MPPGCL/HR/2026/02",
        title: "MP Power Companies Assistant Engineer, Junior Engineer, Plant Assistant & Office Assistant 2026",
        ministry_or_department: "Energy Department, Government of Madhya Pradesh",
        post_name: "Assistant Engineer (Technical), Junior Engineer, Plant Assistant & Accounts Officer",
        total_vacancies: 1980,
        category_code: "engineering",
        date_of_notification: "2026-02-04",
        closing_date: "2026-03-22",
        pdf_url: "https://mppgcl.mp.gov.in/pdf/Advt_Power_Staff_2026.pdf",
        apply_url: "https://mponline.gov.in",
        qualification_summary: "B.E./B.Tech or Diploma in Electrical/Mechanical/Electronics or ITI in relevant trade.",
        age_limit_summary: "18 to 43 years as on closing date.",
        pay_scale: "Pay Level 6 to Level 12 (Rs. 32,800 - 1,77,500)",
        min_age: 18,
        max_age: 43
      }
    ]
  },
  {
    key: "nhm_mp_health_feed",
    name: "National Health Mission Madhya Pradesh (NHM MP) Official Feed",
    organizationSlug: "nhm-mp",
    organizationName: "National Health Mission Madhya Pradesh",
    jurisdiction: "state",
    stateCode: "MP",
    baseUrl: "https://nhmmp.gov.in",
    recruitmentPath: "/vacancy",
    applyUrl: "https://mponline.gov.in",
    defaultCategory: "medical",
    canonicalNotices: [
      {
        advertisement_number: "NHM-MP/HR/CHO-StaffNurse/2026/05",
        title: "NHM MP Community Health Officer (CHO), Staff Nurse & Laboratory Technician 2026",
        ministry_or_department: "Public Health & Family Welfare Department, Madhya Pradesh",
        post_name: "Community Health Officer (CHO), Staff Nurse & Lab Technician",
        total_vacancies: 3570,
        category_code: "medical",
        date_of_notification: "2026-01-25",
        closing_date: "2026-03-14",
        pdf_url: "https://nhmmp.gov.in/files/CHO_StaffNurse_2026.pdf",
        apply_url: "https://mponline.gov.in",
        qualification_summary: "B.Sc. Nursing / Post Basic B.Sc. Nursing with CCH or DMLT/BMLT with valid MP Paramedical/Nursing Council registration.",
        age_limit_summary: "21 to 40 years (up to 45 years for female and reserved categories).",
        pay_scale: "Honorarium Rs. 28,700 - 35,000 per month plus performance incentives",
        min_age: 21,
        max_age: 45
      }
    ]
  },
  {
    key: "mpforest_official_feed",
    name: "Madhya Pradesh Forest Department Official Feed",
    organizationSlug: "mp-forest",
    organizationName: "Madhya Pradesh Forest Department",
    jurisdiction: "state",
    stateCode: "MP",
    baseUrl: "https://mpforest.gov.in",
    recruitmentPath: "/recruitment",
    applyUrl: "https://esb.mp.gov.in",
    defaultCategory: "central-govt",
    canonicalNotices: [
      {
        advertisement_number: "MPFD/Vanrakshak/2026/01",
        title: "MP Van Vibhag Forest Guard (Vanrakshak), Kshetrapal & Deputy Ranger Recruitment 2026",
        ministry_or_department: "Forest Department, Government of Madhya Pradesh",
        post_name: "Forest Guard (Vanrakshak) & Field Guard (Kshetrapal)",
        total_vacancies: 2112,
        category_code: "central-govt",
        date_of_notification: "2026-02-11",
        closing_date: "2026-03-30",
        pdf_url: "https://mpforest.gov.in/docs/Vanrakshak_2026.pdf",
        apply_url: "https://esb.mp.gov.in",
        qualification_summary: "10+2 High School pass from recognized board with prescribed physical fitness standards.",
        age_limit_summary: "18 to 33 years (relaxations for MP domiciliaries).",
        pay_scale: "Pay Level 4 (Rs. 19,500 - 62,000)",
        min_age: 18,
        max_age: 38
      }
    ]
  },

  // =========================================================================
  // 4. JHARKHAND (JH) - High-Volume State Recruitment Boards
  // =========================================================================
  {
    key: "jharkhand_hc_official_feed",
    name: "High Court of Jharkhand Official Feed",
    organizationSlug: "jharkhand-hc",
    organizationName: "High Court of Jharkhand (Ranchi)",
    jurisdiction: "state",
    stateCode: "JH",
    baseUrl: "https://jharkhandhighcourt.nic.in",
    recruitmentPath: "/recruitment",
    applyUrl: "https://jharkhandhighcourt.nic.in/recruitment.php",
    defaultCategory: "central-govt",
    canonicalNotices: [
      {
        advertisement_number: "HCJ/Recruitment/Assistant-Clerk/2026/01",
        title: "Jharkhand High Court Assistant, Clerk, Typist & Deputation Staff Recruitment 2026",
        ministry_or_department: "High Court of Jharkhand Administration",
        post_name: "Assistant, English Typist, Court Officer & Deposition Clerk",
        total_vacancies: 825,
        category_code: "central-govt",
        date_of_notification: "2026-02-06",
        closing_date: "2026-03-26",
        pdf_url: "https://jharkhandhighcourt.nic.in/pdf/Assistant_Recruitment_2026.pdf",
        apply_url: "https://jharkhandhighcourt.nic.in/recruitment.php",
        qualification_summary: "Graduation in any discipline with typing speed of 40 wpm in English and DCA certificate.",
        age_limit_summary: "21 to 35 years as on 01-01-2026 (relaxations as per Jharkhand Govt rules).",
        pay_scale: "Level 7 (Rs. 44,900 - 1,42,400) for Assistant; Level 4 for Clerk/Typist",
        min_age: 21,
        max_age: 38
      }
    ]
  },
  {
    key: "jhpolice_official_feed",
    name: "Jharkhand Police Recruitment Board Official Feed",
    organizationSlug: "jharkhand-police",
    organizationName: "Jharkhand Police",
    jurisdiction: "state",
    stateCode: "JH",
    baseUrl: "https://jhpolice.gov.in",
    recruitmentPath: "/recruitment",
    applyUrl: "https://jssc.nic.in",
    defaultCategory: "defence",
    canonicalNotices: [
      {
        advertisement_number: "JCCE/Police/2026/03",
        title: "Jharkhand Police Constable (JCCE), Sub-Inspector & Home Guard Notification 2026",
        ministry_or_department: "Department of Home, Prison & Disaster Management, Jharkhand",
        post_name: "Constable (District & Special Branch) and Sub-Inspector",
        total_vacancies: 4919,
        category_code: "defence",
        date_of_notification: "2026-01-15",
        closing_date: "2026-03-10",
        pdf_url: "https://jhpolice.gov.in/docs/JCCE_Constable_2026.pdf",
        apply_url: "https://jssc.nic.in",
        qualification_summary: "10th Pass from recognized board in Jharkhand for Constable; Degree for SI.",
        age_limit_summary: "18 to 25 years for UR; up to 28 years for BC/EBC; 30 years for SC/ST.",
        pay_scale: "Pay Level 3 (Rs. 21,700 - 69,100)",
        min_age: 18,
        max_age: 30
      }
    ]
  },
  {
    key: "jbvnl_power_feed",
    name: "Jharkhand Bijli Vitran Nigam Limited (JBVNL) Official Feed",
    organizationSlug: "jbvnl",
    organizationName: "Jharkhand Bijli Vitran Nigam Limited",
    jurisdiction: "state",
    stateCode: "JH",
    baseUrl: "https://jbvnl.co.in",
    recruitmentPath: "/career",
    applyUrl: "https://jbvnl.co.in/career.php",
    defaultCategory: "engineering",
    canonicalNotices: [
      {
        advertisement_number: "JBVNL/Technical/2026/02",
        title: "JBVNL Assistant Electrical Engineer, Junior Engineer & Technical Lineman Recruitment 2026",
        ministry_or_department: "Energy Department, Government of Jharkhand",
        post_name: "Assistant Electrical Engineer, Junior Engineer (Electrical) & Lineman",
        total_vacancies: 1120,
        category_code: "engineering",
        date_of_notification: "2026-02-02",
        closing_date: "2026-03-20",
        pdf_url: "https://jbvnl.co.in/docs/JBVNL_AE_JE_2026.pdf",
        apply_url: "https://jbvnl.co.in/career.php",
        qualification_summary: "Degree/Diploma in Electrical/Electronic Engineering or ITI Electrician.",
        age_limit_summary: "21 to 35 years (relaxations for Jharkhand residents).",
        pay_scale: "Pay Band Rs. 35,400 - 1,12,400",
        min_age: 21,
        max_age: 40
      }
    ]
  },
  {
    key: "jrhms_health_feed",
    name: "Jharkhand Rural Health Mission Society (JRHMS / NHM) Official Feed",
    organizationSlug: "jrhms-nhm",
    organizationName: "Jharkhand Rural Health Mission Society (NHM Jharkhand)",
    jurisdiction: "state",
    stateCode: "JH",
    baseUrl: "https://jrhms.jharkhand.gov.in",
    recruitmentPath: "/careers",
    applyUrl: "https://jrhms.jharkhand.gov.in/apply",
    defaultCategory: "medical",
    canonicalNotices: [
      {
        advertisement_number: "JRHMS/NHM-Health/2026/01",
        title: "JRHMS Community Health Officer (CHO), Staff Nurse & ANM Recruitment 2026",
        ministry_or_department: "Health, Medical Education and Family Welfare Department, Jharkhand",
        post_name: "Community Health Officer (CHO), Staff Nurse & ANM",
        total_vacancies: 2460,
        category_code: "medical",
        date_of_notification: "2026-01-29",
        closing_date: "2026-03-18",
        pdf_url: "https://jrhms.jharkhand.gov.in/files/CHO_Staff_Nurse_2026.pdf",
        apply_url: "https://jrhms.jharkhand.gov.in/apply",
        qualification_summary: "B.Sc. Nursing / Post Basic B.Sc. with integrated CCH or GNM.",
        age_limit_summary: "21 to 35 years (up to 40 years for reserved categories).",
        pay_scale: "Rs. 25,000 - 32,000 consolidated per month",
        min_age: 21,
        max_age: 40
      }
    ]
  },
  {
    key: "jsmdc_mining_feed",
    name: "Jharkhand State Mineral Development Corporation (JSMDC) Official Feed",
    organizationSlug: "jsmdc",
    organizationName: "Jharkhand State Mineral Development Corporation Limited",
    jurisdiction: "state",
    stateCode: "JH",
    baseUrl: "https://jsmdc.in",
    recruitmentPath: "/recruitment",
    applyUrl: "https://jsmdc.in/career",
    defaultCategory: "engineering",
    canonicalNotices: [
      {
        advertisement_number: "JSMDC/Mining-Engineers/2026/04",
        title: "JSMDC Mining Officer, Geologist, Mine Surveyor & Technical Assistant 2026",
        ministry_or_department: "Department of Mines and Geology, Government of Jharkhand",
        post_name: "Mining Officer, Geologist & Surveyor",
        total_vacancies: 345,
        category_code: "engineering",
        date_of_notification: "2026-02-14",
        closing_date: "2026-03-29",
        pdf_url: "https://jsmdc.in/pdf/Mining_Staff_2026.pdf",
        apply_url: "https://jsmdc.in/career",
        qualification_summary: "Degree or Diploma in Mining Engineering / Master in Geology.",
        age_limit_summary: "21 to 35 years as on closing date.",
        pay_scale: "Pay Level 7 to Level 11 (Rs. 44,900 - 1,77,500)",
        min_age: 21,
        max_age: 38
      }
    ]
  },

  // =========================================================================
  // 5. RAJASTHAN (RJ) - High-Volume State Recruitment Boards
  // =========================================================================
  {
    key: "rvunl_power_feed",
    name: "Rajasthan Rajya Vidyut Utpadan Nigam (RVUNL & Discoms) Official Feed",
    organizationSlug: "rvunl",
    organizationName: "Rajasthan Rajya Vidyut Utpadan Nigam Limited",
    jurisdiction: "state",
    stateCode: "RJ",
    baseUrl: "https://energy.rajasthan.gov.in",
    recruitmentPath: "/rvunl/career",
    applyUrl: "https://energy.rajasthan.gov.in/rvunl",
    defaultCategory: "engineering",
    canonicalNotices: [
      {
        advertisement_number: "RVUNL/Power-Engineers/2026/01",
        title: "Rajasthan Energy Companies Junior Engineer, Assistant Engineer & Accounts Officer 2026",
        ministry_or_department: "Energy Department, Government of Rajasthan",
        post_name: "Junior Engineer (I), Assistant Engineer, Junior Chemist & Informatics Assistant",
        total_vacancies: 2870,
        category_code: "engineering",
        date_of_notification: "2026-02-03",
        closing_date: "2026-03-25",
        pdf_url: "https://energy.rajasthan.gov.in/rvunl/Advt_Power_2026.pdf",
        apply_url: "https://energy.rajasthan.gov.in/rvunl",
        qualification_summary: "Degree in Engineering (Civil/Mech/Elec/IT) or MCA / CA / ICWA.",
        age_limit_summary: "21 to 40 years as on 01-01-2026.",
        pay_scale: "Pay Matrix Level 10 (Rs. 33,800 - 1,06,700) for JE; Level 14 for AE",
        min_age: 21,
        max_age: 40
      }
    ]
  },
  {
    key: "rsrtc_transport_feed",
    name: "Rajasthan State Road Transport Corporation (RSRTC) Official Feed",
    organizationSlug: "rsrtc",
    organizationName: "Rajasthan State Road Transport Corporation",
    jurisdiction: "state",
    stateCode: "RJ",
    baseUrl: "https://transport.rajasthan.gov.in",
    recruitmentPath: "/rsrtc/recruitment",
    applyUrl: "https://transport.rajasthan.gov.in/rsrtc",
    defaultCategory: "central-govt",
    canonicalNotices: [
      {
        advertisement_number: "RSRTC/Driver-Conductor/2026/09",
        title: "RSRTC Conductor, Heavy Vehicle Driver & Artisan Grade-III 2026",
        ministry_or_department: "Transport Department, Government of Rajasthan",
        post_name: "Bus Conductor, Heavy Passenger Vehicle Driver & Depot Artisan",
        total_vacancies: 5200,
        category_code: "central-govt",
        date_of_notification: "2026-01-27",
        closing_date: "2026-03-16",
        pdf_url: "https://transport.rajasthan.gov.in/rsrtc/Driver_Conductor_Notice_2026.pdf",
        apply_url: "https://transport.rajasthan.gov.in/rsrtc",
        qualification_summary: "10th pass with conductor license and badge, or HMV commercial license with 3 years driving experience.",
        age_limit_summary: "18 to 40 years as on closing date.",
        pay_scale: "Pay Matrix Level 2 to Level 4 (Rs. 19,200 - 62,000)",
        min_age: 18,
        max_age: 40
      }
    ]
  },
  {
    key: "bser_reet_feed",
    name: "Board of Secondary Education Rajasthan (BSER / REET) Official Feed",
    organizationSlug: "bser-rajasthan",
    organizationName: "Board of Secondary Education Rajasthan (BSER)",
    jurisdiction: "state",
    stateCode: "RJ",
    baseUrl: "https://rajeduboard.rajasthan.gov.in",
    recruitmentPath: "/news",
    applyUrl: "https://rajeduboard.rajasthan.gov.in/reet2026",
    defaultCategory: "teaching",
    canonicalNotices: [
      {
        advertisement_number: "BSER/REET-Level1-2/2026",
        title: "Rajasthan Eligibility Examination for Teachers (REET) Level-1 & Level-2 Recruitment 2026",
        ministry_or_department: "Primary and Secondary Education Department, Rajasthan",
        post_name: "Third Grade Teacher (Level-1 Primary & Level-2 Upper Primary)",
        total_vacancies: 28000,
        category_code: "teaching",
        date_of_notification: "2026-01-10",
        closing_date: "2026-03-05",
        pdf_url: "https://rajeduboard.rajasthan.gov.in/docs/REET_2026_Rules.pdf",
        apply_url: "https://rajeduboard.rajasthan.gov.in/reet2026",
        qualification_summary: "12th with D.El.Ed for Level 1; Graduation with B.Ed / D.El.Ed for Level 2.",
        age_limit_summary: "18 to 40 years as on 01-01-2026.",
        pay_scale: "Pay Matrix Level 10 (Rs. 33,800 - 1,06,700)",
        min_age: 18,
        max_age: 40
      }
    ]
  },
  {
    key: "ruhs_health_feed",
    name: "Rajasthan University of Health Sciences & Medical Dept Official Feed",
    organizationSlug: "rajswasthya",
    organizationName: "Rajasthan Directorate of Medical, Health & Family Welfare",
    jurisdiction: "state",
    stateCode: "RJ",
    baseUrl: "https://rajswasthya.nic.in",
    recruitmentPath: "/current-openings",
    applyUrl: "https://ruhsraj.org",
    defaultCategory: "medical",
    canonicalNotices: [
      {
        advertisement_number: "DMHFW/StaffNurse-Pharma/2026/02",
        title: "Rajasthan Health Department Nursing Officer, Pharmacist, Lab Technician & ANM 2026",
        ministry_or_department: "Medical, Health and Family Welfare Department, Rajasthan",
        post_name: "Nursing Officer, Pharmacist, Lab Technician & Assistant Radiographer",
        total_vacancies: 9879,
        category_code: "medical",
        date_of_notification: "2026-02-09",
        closing_date: "2026-03-27",
        pdf_url: "https://rajswasthya.nic.in/pdf/Nursing_Officer_2026.pdf",
        apply_url: "https://ruhsraj.org",
        qualification_summary: "GNM / B.Sc. Nursing with RNC registration; Diploma in Pharmacy with Rajasthan Pharmacy Council registration.",
        age_limit_summary: "18 to 40 years (relaxations for reserved categories).",
        pay_scale: "Pay Matrix Level 11 (Rs. 37,800 - 1,19,700) for Nursing Officer; Level 10 for Pharmacist",
        min_age: 18,
        max_age: 40
      }
    ]
  },

  // =========================================================================
  // 6. MAHARASHTRA (MH) - High-Volume State Recruitment Boards
  // =========================================================================
  {
    key: "mahadiscom_power_feed",
    name: "Maharashtra State Electricity Distribution Company (MahaVitaran) Official Feed",
    organizationSlug: "mahadiscom",
    organizationName: "Maharashtra State Electricity Distribution Company Limited",
    jurisdiction: "state",
    stateCode: "MH",
    baseUrl: "https://www.mahadiscom.in",
    recruitmentPath: "/career",
    applyUrl: "https://ibpsonline.ibps.in/msedcl2026",
    defaultCategory: "engineering",
    canonicalNotices: [
      {
        advertisement_number: "MSEDCL/Vidyut-Sahayak/2026/01",
        title: "MahaVitaran Vidyut Sahayak, Up-Kendra Sahayak & Junior Assistant (Accounts) 2026",
        ministry_or_department: "Energy Department, Government of Maharashtra",
        post_name: "Vidyut Sahayak (Lineman), Up-Kendra Sahayak (Substation Attendant) & Junior Assistant",
        total_vacancies: 5347,
        category_code: "engineering",
        date_of_notification: "2026-01-20",
        closing_date: "2026-03-12",
        pdf_url: "https://www.mahadiscom.in/career/Vidyut_Sahayak_Advt_2026.pdf",
        apply_url: "https://ibpsonline.ibps.in/msedcl2026",
        qualification_summary: "10th pass with ITI in Electrician / Wireman trade from NCVT/SCVT.",
        age_limit_summary: "18 to 27 years as on closing date (up to 32 years for backward classes).",
        pay_scale: "Consolidated Stipend Rs. 15,000 - 17,000/month during trainee period, then regular scale Level 4",
        min_age: 18,
        max_age: 32
      }
    ]
  },
  {
    key: "msrtc_maharashtra_feed",
    name: "Maharashtra State Road Transport Corporation (MSRTC) Official Feed",
    organizationSlug: "msrtc",
    organizationName: "Maharashtra State Road Transport Corporation",
    jurisdiction: "state",
    stateCode: "MH",
    baseUrl: "https://msrtc.maharashtra.gov.in",
    recruitmentPath: "/recruitment",
    applyUrl: "https://msrtc.maharashtra.gov.in/recruitment.html",
    defaultCategory: "central-govt",
    canonicalNotices: [
      {
        advertisement_number: "MSRTC/Driver-Conductor/2026/04",
        title: "MSRTC Bus Driver-cum-Conductor, Mechanical Staff & Traffic Controller Recruitment 2026",
        ministry_or_department: "Transport Department, Government of Maharashtra",
        post_name: "Driver-cum-Conductor & Assistant Workshop Mechanic",
        total_vacancies: 8740,
        category_code: "central-govt",
        date_of_notification: "2026-02-05",
        closing_date: "2026-03-24",
        pdf_url: "https://msrtc.maharashtra.gov.in/docs/MSRTC_Driver_2026.pdf",
        apply_url: "https://msrtc.maharashtra.gov.in/recruitment.html",
        qualification_summary: "10th pass with heavy commercial vehicle driving license and RTO conductor badge with 3 years driving record.",
        age_limit_summary: "24 to 38 years (up to 43 years for backward classes).",
        pay_scale: "Pay Band Rs. 14,000 - 45,000 plus allowances",
        min_age: 24,
        max_age: 43
      }
    ]
  },
  {
    key: "mcgm_bmc_official_feed",
    name: "Brihanmumbai Municipal Corporation (BMC / MCGM) Official Feed",
    organizationSlug: "mcgm-bmc",
    organizationName: "Brihanmumbai Municipal Corporation",
    jurisdiction: "state",
    stateCode: "MH",
    baseUrl: "https://www.mcgm.gov.in",
    recruitmentPath: "/recruitment",
    applyUrl: "https://portal.mcgm.gov.in/irj/portal/anonymous/qlrecruitment",
    defaultCategory: "central-govt",
    canonicalNotices: [
      {
        advertisement_number: "BMC/Engg-Clerk/2026/02",
        title: "BMC Mumbai Junior Engineer (Civil/Mechanical), Executive Assistant & Healthcare Staff 2026",
        ministry_or_department: "Municipal Corporation of Greater Mumbai",
        post_name: "Junior Engineer (Civil/Mechanical/Electrical), Executive Assistant & Staff Nurse",
        total_vacancies: 3415,
        category_code: "central-govt",
        date_of_notification: "2026-02-12",
        closing_date: "2026-03-31",
        pdf_url: "https://www.mcgm.gov.in/docs/BMC_JE_EA_2026.pdf",
        apply_url: "https://portal.mcgm.gov.in/irj/portal/anonymous/qlrecruitment",
        qualification_summary: "Diploma/Degree in Civil/Mechanical/Electrical Engineering or Graduate in any discipline with typing proficiency in Marathi and English.",
        age_limit_summary: "18 to 38 years for open category (up to 43 years for reserved categories).",
        pay_scale: "Pay Matrix Level M-14 to M-16 (Rs. 38,600 - 1,22,800)",
        min_age: 18,
        max_age: 43
      }
    ]
  },
  {
    key: "arogya_maharashtra_feed",
    name: "Public Health Department Maharashtra (Arogya Vibhag) Official Feed",
    organizationSlug: "maharashtra-arogya",
    organizationName: "Public Health Department Government of Maharashtra",
    jurisdiction: "state",
    stateCode: "MH",
    baseUrl: "https://arogya.maharashtra.gov.in",
    recruitmentPath: "/recruitment",
    applyUrl: "https://arogya.maharashtra.gov.in/apply",
    defaultCategory: "medical",
    canonicalNotices: [
      {
        advertisement_number: "AROGYA/Group-CD/2026/01",
        title: "Maharashtra Arogya Vibhag Group C & Group D Staff Nurse, Lab Tech & Medical Assistant 2026",
        ministry_or_department: "Public Health Department, Government of Maharashtra",
        post_name: "Staff Nurse, Lab Scientific Officer, Pharmacist, X-Ray Tech & Ward Attendant",
        total_vacancies: 10949,
        category_code: "medical",
        date_of_notification: "2026-01-14",
        closing_date: "2026-03-08",
        pdf_url: "https://arogya.maharashtra.gov.in/notices/Arogya_Group_CD_2026.pdf",
        apply_url: "https://arogya.maharashtra.gov.in/apply",
        qualification_summary: "GNM / B.Sc Nursing or D.Pharm or B.Sc in Laboratory Technology or 10th pass.",
        age_limit_summary: "18 to 38 years as on 01-01-2026.",
        pay_scale: "Level S-8 to Level S-13 (Rs. 25,500 - 1,12,400)",
        min_age: 18,
        max_age: 43
      }
    ]
  },
  {
    key: "pavitra_portal_teacher_feed",
    name: "Maharashtra School Education Pavitra Portal Official Feed",
    organizationSlug: "pavitra-shikshak",
    organizationName: "School Education Department Maharashtra (Pavitra Portal)",
    jurisdiction: "state",
    stateCode: "MH",
    baseUrl: "https://mahateacherrecruitment.org.in",
    recruitmentPath: "/advertisements",
    applyUrl: "https://mahateacherrecruitment.org.in/login",
    defaultCategory: "teaching",
    canonicalNotices: [
      {
        advertisement_number: "PAVITRA/TAIT-Shikshak/2026",
        title: "Maharashtra Pavitra Portal Shikshak Sevak Primary & Secondary Teacher Recruitment 2026",
        ministry_or_department: "School Education & Sports Department, Maharashtra",
        post_name: "Shikshak Sevak (Primary, Upper Primary & Secondary)",
        total_vacancies: 21678,
        category_code: "teaching",
        date_of_notification: "2026-02-01",
        closing_date: "2026-03-22",
        pdf_url: "https://mahateacherrecruitment.org.in/docs/Shikshak_Sevak_2026.pdf",
        apply_url: "https://mahateacherrecruitment.org.in/login",
        qualification_summary: "D.T.Ed / B.Ed with valid MAHATET / CTET and TAIT exam qualification.",
        age_limit_summary: "18 to 38 years (up to 43 years for backward classes).",
        pay_scale: "Shikshak Sevak Honorarium Rs. 16,000 - 20,000/month, followed by Level S-10 regular pay scale",
        min_age: 18,
        max_age: 43
      }
    ]
  },

  // =========================================================================
  // 7. WEST BENGAL (WB) - High-Volume State Recruitment Boards
  // =========================================================================
  {
    key: "wbssc_education_feed",
    name: "West Bengal Central School Service Commission (WBSSC) Official Feed",
    organizationSlug: "wbssc-education",
    organizationName: "West Bengal Central School Service Commission",
    jurisdiction: "state",
    stateCode: "WB",
    baseUrl: "https://westbengalssc.com",
    recruitmentPath: "/notice",
    applyUrl: "https://westbengalssc.com/apply",
    defaultCategory: "teaching",
    canonicalNotices: [
      {
        advertisement_number: "WBSSC/SLST-AssistantTeacher/2026/01",
        title: "WBSSC Assistant Teacher & Headmaster Recruitment in Secondary / Higher Secondary Schools 2026",
        ministry_or_department: "School Education Department, Government of West Bengal",
        post_name: "Assistant Teacher (Class IX-X & XI-XII) and Headmaster",
        total_vacancies: 14500,
        category_code: "teaching",
        date_of_notification: "2026-01-18",
        closing_date: "2026-03-15",
        pdf_url: "https://westbengalssc.com/docs/SLST_Notification_2026.pdf",
        apply_url: "https://westbengalssc.com/apply",
        qualification_summary: "Graduate/Post Graduate in concerned subject with at least 50% marks and B.Ed degree from NCTE recognized institute.",
        age_limit_summary: "21 to 40 years as on 01-01-2026 (relaxations for SC/ST/OBC).",
        pay_scale: "Pay Level 11 to Level 15 (Rs. 35,800 - 1,15,300)",
        min_age: 21,
        max_age: 45
      }
    ]
  },
  {
    key: "wbbpe_primary_feed",
    name: "West Bengal Board of Primary Education (WBBPE) Official Feed",
    organizationSlug: "wbbpe",
    organizationName: "West Bengal Board of Primary Education",
    jurisdiction: "state",
    stateCode: "WB",
    baseUrl: "https://wbbpe.org",
    recruitmentPath: "/notices",
    applyUrl: "https://wbbpeonline.com",
    defaultCategory: "teaching",
    canonicalNotices: [
      {
        advertisement_number: "WBBPE/TET-PrimaryTeacher/2026",
        title: "WBBPE Primary School Teacher (TET-qualified) Mass Recruitment Notification 2026",
        ministry_or_department: "School Education Department, Government of West Bengal",
        post_name: "Assistant Teacher in Primary/Junior Basic Schools",
        total_vacancies: 11765,
        category_code: "teaching",
        date_of_notification: "2026-02-02",
        closing_date: "2026-03-24",
        pdf_url: "https://wbbpe.org/docs/Primary_Teacher_Notice_2026.pdf",
        apply_url: "https://wbbpeonline.com",
        qualification_summary: "Senior Secondary with 50% marks and 2-year D.El.Ed, along with valid WB Primary TET clearance.",
        age_limit_summary: "18 to 40 years as on 01-01-2026.",
        pay_scale: "Pay Level 6 (Rs. 28,900 - 74,500)",
        min_age: 18,
        max_age: 40
      }
    ]
  },
  {
    key: "wbhrb_health_feed",
    name: "West Bengal Health Recruitment Board (WBHRB) Official Feed",
    organizationSlug: "wbhrb",
    organizationName: "West Bengal Health Recruitment Board",
    jurisdiction: "state",
    stateCode: "WB",
    baseUrl: "https://wbhrb.in",
    recruitmentPath: "/advertisements",
    applyUrl: "https://wbhrb.in/online-application",
    defaultCategory: "medical",
    canonicalNotices: [
      {
        advertisement_number: "WBHRB/StaffNurse-MO/2026/03",
        title: "WBHRB Medical Technologist, Staff Nurse Grade-II & Medical Officer Recruitment 2026",
        ministry_or_department: "Department of Health & Family Welfare, West Bengal",
        post_name: "Staff Nurse Grade-II, Medical Officer (General/Specialist) & Medical Technologist",
        total_vacancies: 6092,
        category_code: "medical",
        date_of_notification: "2026-01-24",
        closing_date: "2026-03-16",
        pdf_url: "https://wbhrb.in/pdf/Staff_Nurse_MO_2026.pdf",
        apply_url: "https://wbhrb.in/online-application",
        qualification_summary: "General Nursing and Midwifery (GNM) / Basic B.Sc. (Nursing) / Post Basic B.Sc. with WB Nursing Council registration.",
        age_limit_summary: "18 to 39 years as on 01-01-2026.",
        pay_scale: "Pay Level 9 (Rs. 28,900 - 74,500) for Staff Nurse; Level 16 for Medical Officers",
        min_age: 18,
        max_age: 44
      }
    ]
  },
  {
    key: "wbsedcl_power_feed",
    name: "West Bengal State Electricity Distribution Company (WBSEDCL) Official Feed",
    organizationSlug: "wbsedcl",
    organizationName: "West Bengal State Electricity Distribution Company Limited",
    jurisdiction: "state",
    stateCode: "WB",
    baseUrl: "https://www.wbsedcl.in",
    recruitmentPath: "/career",
    applyUrl: "https://www.wbsedcl.in/career.html",
    defaultCategory: "engineering",
    canonicalNotices: [
      {
        advertisement_number: "WBSEDCL/MPP/2026/01",
        title: "WBSEDCL Assistant Engineer, Junior Executive, Sub-Assistant Engineer & Office Executive 2026",
        ministry_or_department: "Department of Power, Government of West Bengal",
        post_name: "Assistant Engineer (Electrical/Civil), Sub-Assistant Engineer & Office Executive",
        total_vacancies: 1280,
        category_code: "engineering",
        date_of_notification: "2026-02-07",
        closing_date: "2026-03-27",
        pdf_url: "https://www.wbsedcl.in/career/Advt_MPP_2026.pdf",
        apply_url: "https://www.wbsedcl.in/career.html",
        qualification_summary: "B.Tech/BE or Diploma in Electrical/Civil Engineering or Graduation with Certificate in Computer Applications.",
        age_limit_summary: "18 to 38 years as on 01-01-2026.",
        pay_scale: "Pay Band Rs. 29,000 - 1,20,500",
        min_age: 18,
        max_age: 38
      }
    ]
  },
  {
    key: "wbmsc_municipal_feed",
    name: "West Bengal Municipal Service Commission (WBMSC) Official Feed",
    organizationSlug: "wbmsc",
    organizationName: "West Bengal Municipal Service Commission",
    jurisdiction: "state",
    stateCode: "WB",
    baseUrl: "https://www.mscwb.org",
    recruitmentPath: "/employment-notice",
    applyUrl: "https://www.mscwb.org/apply",
    defaultCategory: "central-govt",
    canonicalNotices: [
      {
        advertisement_number: "MSCWB/Advt-04/2026",
        title: "WBMSC Sub-Assistant Engineer, Ward Executive, Clerk & Technical Staff in Municipalities 2026",
        ministry_or_department: "Urban Development & Municipal Affairs Department, West Bengal",
        post_name: "Sub-Assistant Engineer, Sub-Inspector, Lower Division Clerk & Conservancies",
        total_vacancies: 2190,
        category_code: "central-govt",
        date_of_notification: "2026-02-11",
        closing_date: "2026-03-29",
        pdf_url: "https://www.mscwb.org/notices/MSCWB_Advt_04_2026.pdf",
        apply_url: "https://www.mscwb.org/apply",
        qualification_summary: "Madhyamik (10th), Higher Secondary or Diploma/Degree in Engineering.",
        age_limit_summary: "18 to 40 years as on closing date.",
        pay_scale: "Pay Level 6 to Level 12 (Rs. 22,700 - 82,900)",
        min_age: 18,
        max_age: 40
      }
    ]
  },

  // =========================================================================
  // 8. HARYANA (HR) - High-Volume State Recruitment Boards
  // =========================================================================
  {
    key: "haryana_police_feed",
    name: "Haryana Police Recruitment Board Official Feed",
    organizationSlug: "haryana-police",
    organizationName: "Haryana Police",
    jurisdiction: "state",
    stateCode: "HR",
    baseUrl: "https://haryanapolice.gov.in",
    recruitmentPath: "/recruitment",
    applyUrl: "https://hssc.gov.in",
    defaultCategory: "defence",
    canonicalNotices: [
      {
        advertisement_number: "HSSC/Police-Constable/2026/01",
        title: "Haryana Police Male & Female Constable (General Duty) & Sub-Inspector 2026",
        ministry_or_department: "Home Department, Government of Haryana",
        post_name: "Male Constable (GD), Female Constable (GD) & Police Sub-Inspector",
        total_vacancies: 6000,
        category_code: "defence",
        date_of_notification: "2026-01-22",
        closing_date: "2026-03-10",
        pdf_url: "https://haryanapolice.gov.in/docs/Police_Constable_2026.pdf",
        apply_url: "https://hssc.gov.in",
        qualification_summary: "10+2 from a recognized education Board/Institution with Hindi/Sanskrit up to Matriculation standard; Common Eligibility Test (CET) qualified.",
        age_limit_summary: "18 to 25 years (3 years relaxation given to all categories by Haryana Govt).",
        pay_scale: "Level 3 (Rs. 21,700 - 69,100)",
        min_age: 18,
        max_age: 28
      }
    ]
  },
  {
    key: "haryana_power_feed",
    name: "Haryana Power Utilities (HVPNL / DHBVN / UHBVN / HPGCL) Official Feed",
    organizationSlug: "haryana-power-utilities",
    organizationName: "Haryana Vidyut Prasaran Nigam Limited (HVPNL)",
    jurisdiction: "state",
    stateCode: "HR",
    baseUrl: "https://www.hvpn.org.in",
    recruitmentPath: "/career",
    applyUrl: "https://www.hvpn.org.in/recruitments",
    defaultCategory: "engineering",
    canonicalNotices: [
      {
        advertisement_number: "HPUs/AE-JE/2026/01",
        title: "Haryana Power Utilities Assistant Engineer (GATE), Junior Engineer & ALM Notification 2026",
        ministry_or_department: "Power Department, Government of Haryana",
        post_name: "Assistant Engineer (Electrical/Civil/IT) & Assistant Lineman (ALM)",
        total_vacancies: 1840,
        category_code: "engineering",
        date_of_notification: "2026-02-04",
        closing_date: "2026-03-24",
        pdf_url: "https://www.hvpn.org.in/pdf/HPUs_AE_JE_2026.pdf",
        apply_url: "https://www.hvpn.org.in/recruitments",
        qualification_summary: "Full-Time Bachelor of Engineering / B.Tech or ITI Wireman/Electrician.",
        age_limit_summary: "18 to 42 years as on closing date.",
        pay_scale: "Pay Matrix Level 9 (Rs. 53,100 - 1,67,800) for AE; Level 4 for ALM",
        min_age: 18,
        max_age: 42
      }
    ]
  },
  {
    key: "bseh_htet_feed",
    name: "Board of School Education Haryana (BSEH / HTET) Official Feed",
    organizationSlug: "bseh-haryana",
    organizationName: "Board of School Education Haryana (BSEH)",
    jurisdiction: "state",
    stateCode: "HR",
    baseUrl: "https://bseh.org.in",
    recruitmentPath: "/announcements",
    applyUrl: "https://hssc.gov.in",
    defaultCategory: "teaching",
    canonicalNotices: [
      {
        advertisement_number: "HSSC/TGT-PGT-Teachers/2026/02",
        title: "Haryana PRT, TGT & PGT School Teacher Recruitment via HTET 2026",
        ministry_or_department: "Department of Elementary & Secondary Education, Haryana",
        post_name: "Trained Graduate Teacher (TGT) & Post Graduate Teacher (PGT)",
        total_vacancies: 7471,
        category_code: "teaching",
        date_of_notification: "2026-01-26",
        closing_date: "2026-03-18",
        pdf_url: "https://bseh.org.in/docs/TGT_PGT_Haryana_2026.pdf",
        apply_url: "https://hssc.gov.in",
        qualification_summary: "Graduation/Post Graduation with B.Ed and valid Haryana Teacher Eligibility Test (HTET) certificate in relevant subject.",
        age_limit_summary: "18 to 42 years as on closing date.",
        pay_scale: "Pay Matrix Level 7 (Rs. 44,900 - 1,42,400) for TGT; Level 8 for PGT",
        min_age: 18,
        max_age: 42
      }
    ]
  },
  {
    key: "nhm_haryana_health_feed",
    name: "National Health Mission Haryana (NHM Haryana) Official Feed",
    organizationSlug: "nhm-haryana",
    organizationName: "National Health Mission Haryana",
    jurisdiction: "state",
    stateCode: "HR",
    baseUrl: "http://nhmharyana.gov.in",
    recruitmentPath: "/career",
    applyUrl: "http://nhmharyana.gov.in/career",
    defaultCategory: "medical",
    canonicalNotices: [
      {
        advertisement_number: "NHM-HR/MLHP-CHO/2026/01",
        title: "NHM Haryana Community Health Officer (MLHP-cum-CHO), Staff Nurse & Pharmacist 2026",
        ministry_or_department: "Health Department, Government of Haryana",
        post_name: "Mid-Level Health Provider-cum-CHO, Staff Nurse & Lab Technician",
        total_vacancies: 1250,
        category_code: "medical",
        date_of_notification: "2026-02-08",
        closing_date: "2026-03-26",
        pdf_url: "http://nhmharyana.gov.in/docs/CHO_Haryana_2026.pdf",
        apply_url: "http://nhmharyana.gov.in/career",
        qualification_summary: "BAMS or B.Sc. Nursing / Post-Basic B.Sc. Nursing with integrated BPCCHN certificate.",
        age_limit_summary: "18 to 42 years as on closing date.",
        pay_scale: "Pay Band Rs. 25,000 - 32,500/month plus allowances",
        min_age: 18,
        max_age: 42
      }
    ]
  },
  {
    key: "haryana_roadways_feed",
    name: "Haryana State Transport (Haryana Roadways) Official Feed",
    organizationSlug: "haryana-roadways",
    organizationName: "State Transport Haryana (Haryana Roadways)",
    jurisdiction: "state",
    stateCode: "HR",
    baseUrl: "https://hartrans.gov.in",
    recruitmentPath: "/tenders-and-vacancies",
    applyUrl: "https://hssc.gov.in",
    defaultCategory: "central-govt",
    canonicalNotices: [
      {
        advertisement_number: "HR-ROADS/Driver-Helper/2026/05",
        title: "Haryana Roadways Heavy Passenger Driver, Conductor & Mechanical Helper 2026",
        ministry_or_department: "Transport Department, Government of Haryana",
        post_name: "Heavy Bus Driver, Conductor & Workshop Assistant",
        total_vacancies: 2850,
        category_code: "central-govt",
        date_of_notification: "2026-02-12",
        closing_date: "2026-03-31",
        pdf_url: "https://hartrans.gov.in/docs/Driver_Conductor_Notice_2026.pdf",
        apply_url: "https://hssc.gov.in",
        qualification_summary: "Matric (10th) with Hindi/Sanskrit, heavy transport vehicle driving license with minimum 3 years experience.",
        age_limit_summary: "18 to 42 years as on closing date.",
        pay_scale: "Level 2 (Rs. 19,900 - 63,200)",
        min_age: 18,
        max_age: 42
      }
    ]
  },

  // =========================================================================
  // 9. PUNJAB (PB) - High-Volume State Recruitment Boards
  // =========================================================================
  {
    key: "ppsc_official_feed",
    name: "Punjab Public Service Commission (PPSC) Official Feed",
    organizationSlug: "ppsc",
    organizationName: "Punjab Public Service Commission",
    jurisdiction: "state",
    stateCode: "PB",
    baseUrl: "https://ppsc.gov.in",
    recruitmentPath: "/open-advt",
    applyUrl: "https://ppsc.gov.in/applyonline",
    defaultCategory: "central-govt",
    canonicalNotices: [
      {
        advertisement_number: "PPSC/PCS-CCE/2026/01",
        title: "PPSC Punjab State Civil Services (Executive Branch), DSP & Group A/B Officers 2026",
        ministry_or_department: "Department of Personnel, Government of Punjab",
        post_name: "Punjab Civil Service (Executive), Deputy Superintendent of Police (DSP), Tehsildar & ETO",
        total_vacancies: 672,
        category_code: "central-govt",
        date_of_notification: "2026-01-20",
        closing_date: "2026-03-15",
        pdf_url: "https://ppsc.gov.in/docs/PCS_CCE_2026_Advt.pdf",
        apply_url: "https://ppsc.gov.in/applyonline",
        qualification_summary: "Bachelor's Degree in any discipline from recognized university with Punjabi passed at Matriculation level or equivalent.",
        age_limit_summary: "21 to 37 years as on 01-01-2026 (up to 42 years for SC/BC of Punjab).",
        pay_scale: "Pay Matrix Level 10 (Rs. 56,100 - 1,77,500)",
        min_age: 21,
        max_age: 42
      }
    ]
  },
  {
    key: "pspcl_power_feed",
    name: "Punjab State Power Corporation Limited (PSPCL & PSTCL) Official Feed",
    organizationSlug: "pspcl",
    organizationName: "Punjab State Power Corporation Limited",
    jurisdiction: "state",
    stateCode: "PB",
    baseUrl: "https://www.pspcl.in",
    recruitmentPath: "/recruitment",
    applyUrl: "https://www.pspcl.in/recruitment.aspx",
    defaultCategory: "engineering",
    canonicalNotices: [
      {
        advertisement_number: "PSPCL/CRA-302/2026",
        title: "PSPCL Assistant Lineman (ALM), Junior Engineer (Sub-Station) & Lower Division Clerk 2026",
        ministry_or_department: "Power Department, Government of Punjab",
        post_name: "Assistant Lineman (ALM), Junior Engineer (Electrical) & LDC / Revenue Accountant",
        total_vacancies: 2950,
        category_code: "engineering",
        date_of_notification: "2026-01-28",
        closing_date: "2026-03-20",
        pdf_url: "https://www.pspcl.in/docs/CRA_302_ALM_JE_2026.pdf",
        apply_url: "https://www.pspcl.in/recruitment.aspx",
        qualification_summary: "Matriculation with 2-year National Apprenticeship Certificate in Lineman trade or Diploma in Electrical Engineering.",
        age_limit_summary: "18 to 37 years as on 01-01-2026.",
        pay_scale: "Pay Scale Rs. 19,900 - 35,400 initial pay",
        min_age: 18,
        max_age: 37
      }
    ]
  },
  {
    key: "punjab_education_feed",
    name: "Punjab Department of School Education (Education Recruitment Board) Official Feed",
    organizationSlug: "punjab-education-board",
    organizationName: "Punjab Education Recruitment Board",
    jurisdiction: "state",
    stateCode: "PB",
    baseUrl: "https://educationrecruitmentboard.com",
    recruitmentPath: "/notices",
    applyUrl: "https://educationrecruitmentboard.com/register",
    defaultCategory: "teaching",
    canonicalNotices: [
      {
        advertisement_number: "PERB/Master-Cadre-ETT/2026",
        title: "Punjab Master Cadre, ETT Teacher & DPE/Art Craft Teacher Recruitment 2026",
        ministry_or_department: "Department of School Education, Punjab",
        post_name: "Master Cadre (Math, Science, Social Studies, English, Punjabi) & Elementary Teacher (ETT)",
        total_vacancies: 8393,
        category_code: "teaching",
        date_of_notification: "2026-02-05",
        closing_date: "2026-03-28",
        pdf_url: "https://educationrecruitmentboard.com/pdf/Master_Cadre_2026.pdf",
        apply_url: "https://educationrecruitmentboard.com/register",
        qualification_summary: "Graduation with at least 45% marks and B.Ed with PSTET-2 qualification; or 10+2 with 2-year ETT and PSTET-1.",
        age_limit_summary: "18 to 37 years as on 01-01-2026.",
        pay_scale: "Pay Scale Rs. 35,400/month initial pay",
        min_age: 18,
        max_age: 42
      }
    ]
  },
  {
    key: "bfuhs_health_feed",
    name: "Baba Farid University of Health Sciences & Punjab Health Dept Official Feed",
    organizationSlug: "bfuhs",
    organizationName: "Baba Farid University of Health Sciences (BFUHS Faridkot)",
    jurisdiction: "state",
    stateCode: "PB",
    baseUrl: "https://bfuhs.ac.in",
    recruitmentPath: "/careers",
    applyUrl: "https://bfuhs.ac.in/careers",
    defaultCategory: "medical",
    canonicalNotices: [
      {
        advertisement_number: "BFUHS/Health-Staff/2026/02",
        title: "Punjab Directorate of Health Services Staff Nurse, Medical Officer & Multipurpose Health Worker 2026",
        ministry_or_department: "Health and Family Welfare Department, Punjab",
        post_name: "Staff Nurse, Medical Officer (Specialist/General) & Multipurpose Health Worker (Male/Female)",
        total_vacancies: 2340,
        category_code: "medical",
        date_of_notification: "2026-01-25",
        closing_date: "2026-03-18",
        pdf_url: "https://bfuhs.ac.in/docs/Staff_Nurse_Advt_2026.pdf",
        apply_url: "https://bfuhs.ac.in/careers",
        qualification_summary: "B.Sc Nursing / GNM with Punjab Nursing Registration Council certificate and Matric level Punjabi.",
        age_limit_summary: "18 to 37 years as on 01-01-2026.",
        pay_scale: "Pay Scale Rs. 29,200 initial pay per month",
        min_age: 18,
        max_age: 42
      }
    ]
  },

  // =========================================================================
  // 10. ODISHA (OD) - High-Volume State Recruitment Boards
  // =========================================================================
  {
    key: "ossc_official_feed",
    name: "Odisha Staff Selection Commission (OSSC) Official Feed",
    organizationSlug: "ossc",
    organizationName: "Odisha Staff Selection Commission",
    jurisdiction: "state",
    stateCode: "OD",
    baseUrl: "https://www.ossc.gov.in",
    recruitmentPath: "/notices",
    applyUrl: "https://www.ossc.gov.in/login",
    defaultCategory: "central-govt",
    canonicalNotices: [
      {
        advertisement_number: "OSSC/CGL-CTS/2026/01",
        title: "OSSC Combined Graduate Level (CGL), Combined Technical Services (CTS) & Vital Statistics 2026",
        ministry_or_department: "General Administration & Public Grievance Department, Odisha",
        post_name: "Auditor, Inspector of Supplies, Junior Fisheries Technical Assistant & Sub-Inspector of Excise",
        total_vacancies: 3410,
        category_code: "central-govt",
        date_of_notification: "2026-01-18",
        closing_date: "2026-03-14",
        pdf_url: "https://www.ossc.gov.in/docs/CGL_Advt_2026.pdf",
        apply_url: "https://www.ossc.gov.in/login",
        qualification_summary: "Bachelor's Degree in any discipline with Odia as a subject up to ME standard.",
        age_limit_summary: "21 to 38 years as on 01-01-2026 (relaxations up to 43 years for SC/ST/SEBC/Women).",
        pay_scale: "Pay Matrix Level 9 (Rs. 35,400 - 1,12,400)",
        min_age: 21,
        max_age: 43
      }
    ]
  },
  {
    key: "odisha_police_feed",
    name: "Odisha Police State Selection Board (OPSSB) Official Feed",
    organizationSlug: "odisha-police",
    organizationName: "Odisha Police",
    jurisdiction: "state",
    stateCode: "OD",
    baseUrl: "https://odishapolice.gov.in",
    recruitmentPath: "/recruitment",
    applyUrl: "https://odishapolice.gov.in/recruitment.html",
    defaultCategory: "defence",
    canonicalNotices: [
      {
        advertisement_number: "OPSSB/Sepoy-Constable/2026/02",
        title: "Odisha Police Sepoy/Constable, Sub-Inspector & Driver Battalion Recruitment 2026",
        ministry_or_department: "Home Department, Government of Odisha",
        post_name: "Sepoy/Constable in OSAP/IRB Battalions, Police SI & Motor Driver",
        total_vacancies: 4790,
        category_code: "defence",
        date_of_notification: "2026-01-22",
        closing_date: "2026-03-16",
        pdf_url: "https://odishapolice.gov.in/docs/Sepoy_Constable_2026.pdf",
        apply_url: "https://odishapolice.gov.in/recruitment.html",
        qualification_summary: "Passed High School Certificate Examination (Matriculation) conducted by BSE Odisha.",
        age_limit_summary: "18 to 23 years (upper age relaxed up to 28 years for SC/ST/SEBC).",
        pay_scale: "Pay Matrix Level 5 (Rs. 21,700 - 69,100)",
        min_age: 18,
        max_age: 28
      }
    ]
  },
  {
    key: "orissa_hc_official_feed",
    name: "High Court of Orissa Official Feed",
    organizationSlug: "orissa-hc",
    organizationName: "High Court of Orissa (Cuttack)",
    jurisdiction: "state",
    stateCode: "OD",
    baseUrl: "https://orissahighcourt.nic.in",
    recruitmentPath: "/recruitment",
    applyUrl: "https://orissahighcourt.nic.in/recruitment.php",
    defaultCategory: "central-govt",
    canonicalNotices: [
      {
        advertisement_number: "HCO/ASO-Steno/2026/01",
        title: "Orissa High Court Junior Stenographer, Assistant Section Officer (ASO) & District Judiciary 2026",
        ministry_or_department: "High Court of Orissa Registry",
        post_name: "Assistant Section Officer (ASO), Junior Stenographer & Translator",
        total_vacancies: 715,
        category_code: "central-govt",
        date_of_notification: "2026-02-06",
        closing_date: "2026-03-28",
        pdf_url: "https://orissahighcourt.nic.in/pdf/ASO_Notification_2026.pdf",
        apply_url: "https://orissahighcourt.nic.in/recruitment.php",
        qualification_summary: "Bachelor's Degree in any discipline with adequate knowledge of Computer Applications.",
        age_limit_summary: "21 to 32 years as on 01-08-2026 (relaxed up to 37 years for reserved categories).",
        pay_scale: "Pay Level 9 (Rs. 35,400 - 1,12,400)",
        min_age: 21,
        max_age: 37
      }
    ]
  },
  {
    key: "optcl_power_feed",
    name: "Odisha Power Transmission Corporation & GRIDCO Official Feed",
    organizationSlug: "optcl",
    organizationName: "Odisha Power Transmission Corporation Limited",
    jurisdiction: "state",
    stateCode: "OD",
    baseUrl: "https://www.optcl.co.in",
    recruitmentPath: "/careers",
    applyUrl: "https://www.optcl.co.in/careers.aspx",
    defaultCategory: "engineering",
    canonicalNotices: [
      {
        advertisement_number: "OPTCL/MT-JMOT/2026/01",
        title: "OPTCL Management Trainee (Electrical/Telecom), Junior Maintenance & Operator Trainee 2026",
        ministry_or_department: "Department of Energy, Government of Odisha",
        post_name: "Management Trainee (Electrical/HR/Finance) & Junior Maintenance Operator Trainee (JMOT)",
        total_vacancies: 1140,
        category_code: "engineering",
        date_of_notification: "2026-02-01",
        closing_date: "2026-03-22",
        pdf_url: "https://www.optcl.co.in/docs/Advt_MT_JMOT_2026.pdf",
        apply_url: "https://www.optcl.co.in/careers.aspx",
        qualification_summary: "Degree in Electrical/Electronics Engineering or ITI Electrician from NCVT.",
        age_limit_summary: "21 to 38 years as on closing date.",
        pay_scale: "Pay Matrix Level 12 (Rs. 56,100 - 1,77,500) for MT; Level 3 for JMOT",
        min_age: 18,
        max_age: 38
      }
    ]
  },
  {
    key: "oavs_education_feed",
    name: "Odisha Adarsha Vidyalaya Sangathan (OAVS) Official Feed",
    organizationSlug: "oavs",
    organizationName: "Odisha Adarsha Vidyalaya Sangathan",
    jurisdiction: "state",
    stateCode: "OD",
    baseUrl: "https://oav.edu.in",
    recruitmentPath: "/recruitment",
    applyUrl: "https://oav.edu.in/recruitment.html",
    defaultCategory: "teaching",
    canonicalNotices: [
      {
        advertisement_number: "OAVS/Principal-Teachers/2026/01",
        title: "OAVS Principal, TGT (English/Odia/Math), PGT & Computer Teacher Recruitment 2026",
        ministry_or_department: "School & Mass Education Department, Odisha",
        post_name: "Principal, Post Graduate Teacher (PGT), Trained Graduate Teacher (TGT) & PET",
        total_vacancies: 1342,
        category_code: "teaching",
        date_of_notification: "2026-01-27",
        closing_date: "2026-03-18",
        pdf_url: "https://oav.edu.in/docs/OAVS_Teacher_Recruitment_2026.pdf",
        apply_url: "https://oav.edu.in/recruitment.html",
        qualification_summary: "Master Degree/Bachelor Degree with B.Ed and OSSTET/OTET/CTET qualification.",
        age_limit_summary: "21 to 38 years (up to 50 years for Principal post).",
        pay_scale: "Pay Matrix Level 10 to Level 12 (Rs. 44,900 - 1,77,500)",
        min_age: 21,
        max_age: 43
      }
    ]
  },

  // =========================================================================
  // 11. CHHATTISGARH (CG) - High-Volume State Recruitment Boards
  // =========================================================================
  {
    key: "cgvyapam_official_feed",
    name: "Chhattisgarh Professional Examination Board (CG Vyapam) Official Feed",
    organizationSlug: "cg-vyapam",
    organizationName: "Chhattisgarh Professional Examination Board (CGPEB / Vyapam)",
    jurisdiction: "state",
    stateCode: "CG",
    baseUrl: "https://vyapam.cgstate.gov.in",
    recruitmentPath: "/notice",
    applyUrl: "https://vyapam.cgstate.gov.in/applyonline",
    defaultCategory: "central-govt",
    canonicalNotices: [
      {
        advertisement_number: "CGPEB/Patwari-HostelWarden/2026/01",
        title: "CG Vyapam Patwari, Sub-Engineer, Hostel Warden (Chatrawas Adhikshak) & Mandi Nirikshak 2026",
        ministry_or_department: "General Administration & Revenue Department, Chhattisgarh",
        post_name: "Patwari, Chatrawas Adhikshak (Hostel Warden), Sub-Engineer (Civil) & Mandi Nirikshak",
        total_vacancies: 4280,
        category_code: "central-govt",
        date_of_notification: "2026-01-26",
        closing_date: "2026-03-20",
        pdf_url: "https://vyapam.cgstate.gov.in/docs/Vyapam_Combined_2026.pdf",
        apply_url: "https://vyapam.cgstate.gov.in/applyonline",
        qualification_summary: "Higher Secondary (10+2) with 1-year Diploma in Computer Applications (DCA/PGDCA) and Patwari training certificate.",
        age_limit_summary: "18 to 35 years as on 01-01-2026 (up to 40 years for CG domicile candidates).",
        pay_scale: "Pay Matrix Level 6 (Rs. 25,300 - 80,500)",
        min_age: 18,
        max_age: 40
      }
    ]
  },
  {
    key: "cgpolice_official_feed",
    name: "Chhattisgarh Police Recruitment Board Official Feed",
    organizationSlug: "cg-police",
    organizationName: "Chhattisgarh Police",
    jurisdiction: "state",
    stateCode: "CG",
    baseUrl: "https://cgpolice.gov.in",
    recruitmentPath: "/recruitment",
    applyUrl: "https://cgpolice.gov.in/recruitment.html",
    defaultCategory: "defence",
    canonicalNotices: [
      {
        advertisement_number: "CGP/Constable-SI/2026/02",
        title: "Chhattisgarh Police Constable (DEF/Trade), Sub-Inspector (Subedar) & CAF Recruitment 2026",
        ministry_or_department: "Home (Police) Department, Government of Chhattisgarh",
        post_name: "District Executive Force (DEF) Constable, Subedar, Sub-Inspector & Platoon Commander",
        total_vacancies: 5967,
        category_code: "defence",
        date_of_notification: "2026-01-18",
        closing_date: "2026-03-12",
        pdf_url: "https://cgpolice.gov.in/docs/CG_Police_Constable_2026.pdf",
        apply_url: "https://cgpolice.gov.in/recruitment.html",
        qualification_summary: "10th Class passed under 10+2 system from CG/MP state school (8th class for ST candidates in scheduled areas).",
        age_limit_summary: "18 to 28 years (upper age relaxed up to 33 years for SC/ST/OBC).",
        pay_scale: "Level 4 (Rs. 19,500 - 62,000) for Constable; Level 8 for SI",
        min_age: 18,
        max_age: 33
      }
    ]
  },
  {
    key: "cg_high_court_feed",
    name: "High Court of Chhattisgarh Official Feed",
    organizationSlug: "cg-high-court",
    organizationName: "High Court of Chhattisgarh (Bilaspur)",
    jurisdiction: "state",
    stateCode: "CG",
    baseUrl: "https://highcourt.cg.gov.in",
    recruitmentPath: "/recruitment",
    applyUrl: "https://highcourt.cg.gov.in/recruitment.html",
    defaultCategory: "central-govt",
    canonicalNotices: [
      {
        advertisement_number: "HCG/Recruitment-AG3/2026/01",
        title: "Chhattisgarh High Court Assistant Grade-3, Reader, Stenographer & Civil Judge 2026",
        ministry_or_department: "High Court of Chhattisgarh Administration",
        post_name: "Assistant Grade-3, English/Hindi Stenographer & District Court Staff",
        total_vacancies: 640,
        category_code: "central-govt",
        date_of_notification: "2026-02-04",
        closing_date: "2026-03-25",
        pdf_url: "https://highcourt.cg.gov.in/pdf/AG3_Steno_2026.pdf",
        apply_url: "https://highcourt.cg.gov.in/recruitment.html",
        qualification_summary: "Bachelor's Degree from recognized university with 1-year diploma in Computer Applications and Hindi typing.",
        age_limit_summary: "21 to 30 years (relaxed up to 40 years for bonafide residents of Chhattisgarh).",
        pay_scale: "Pay Level 4 (Rs. 19,500 - 62,000)",
        min_age: 21,
        max_age: 40
      }
    ]
  },
  {
    key: "cspdcl_power_feed",
    name: "Chhattisgarh State Power Companies (CSPDCL / CSPGCL) Official Feed",
    organizationSlug: "cspdcl",
    organizationName: "Chhattisgarh State Power Holding Company Limited",
    jurisdiction: "state",
    stateCode: "CG",
    baseUrl: "https://cspdcl.co.in",
    recruitmentPath: "/recruitment",
    applyUrl: "https://cspdcl.co.in/careers",
    defaultCategory: "engineering",
    canonicalNotices: [
      {
        advertisement_number: "CSPHCL/HR-Tech/2026/03",
        title: "CSPDCL Line Attendant, Junior Engineer (Electrical) & Assistant Engineer Trainee 2026",
        ministry_or_department: "Energy Department, Government of Chhattisgarh",
        post_name: "Line Attendant, Junior Engineer (Electrical/IT) & Assistant Engineer Trainee",
        total_vacancies: 1580,
        category_code: "engineering",
        date_of_notification: "2026-02-10",
        closing_date: "2026-03-28",
        pdf_url: "https://cspdcl.co.in/pdf/Line_Attendant_JE_2026.pdf",
        apply_url: "https://cspdcl.co.in/careers",
        qualification_summary: "10th with ITI Electrician/Wireman or 3-year Diploma/Degree in Electrical Engineering.",
        age_limit_summary: "18 to 40 years (relaxations for CG domiciles).",
        pay_scale: "Pay Level 3 to Level 10 (Rs. 19,500 - 1,12,400)",
        min_age: 18,
        max_age: 40
      }
    ]
  },
  {
    key: "nhm_cg_health_feed",
    name: "National Health Mission Chhattisgarh (NHM CG) Official Feed",
    organizationSlug: "nhm-cg",
    organizationName: "National Health Mission Chhattisgarh",
    jurisdiction: "state",
    stateCode: "CG",
    baseUrl: "https://cghealth.nic.in",
    recruitmentPath: "/advertisements",
    applyUrl: "https://cghealth.nic.in/apply",
    defaultCategory: "medical",
    canonicalNotices: [
      {
        advertisement_number: "NHM-CG/CHO-Nurse/2026/02",
        title: "NHM Chhattisgarh Community Health Officer (CHO), Staff Nurse, ANM & Lab Technician 2026",
        ministry_or_department: "Department of Health & Family Welfare, Chhattisgarh",
        post_name: "Community Health Officer (CHO), Staff Nurse & Multi-Skilled Health Worker",
        total_vacancies: 2715,
        category_code: "medical",
        date_of_notification: "2026-01-22",
        closing_date: "2026-03-15",
        pdf_url: "https://cghealth.nic.in/docs/CHO_Staff_Nurse_2026.pdf",
        apply_url: "https://cghealth.nic.in/apply",
        qualification_summary: "B.Sc Nursing / Post Basic B.Sc Nursing with certificate in Community Health (CCH).",
        age_limit_summary: "21 to 35 years (up to 40 years for CG state residents).",
        pay_scale: "Honorarium Rs. 26,500/month plus performance incentives",
        min_age: 21,
        max_age: 40
      }
    ]
  },

  // =========================================================================
  // 12. UTTARAKHAND (UK) - High-Volume State Recruitment Boards
  // =========================================================================
  {
    key: "uk_high_court_feed",
    name: "High Court of Uttarakhand Official Feed",
    organizationSlug: "uk-high-court",
    organizationName: "High Court of Uttarakhand (Nainital)",
    jurisdiction: "state",
    stateCode: "UK",
    baseUrl: "https://highcourtofuttarakhand.gov.in",
    recruitmentPath: "/recruitment",
    applyUrl: "https://highcourtofuttarakhand.gov.in/recruitment.html",
    defaultCategory: "central-govt",
    canonicalNotices: [
      {
        advertisement_number: "HCUK/Recruitment/ARO-Steno/2026/01",
        title: "Uttarakhand High Court Judicial Magistrate, Personal Assistant & Assistant Review Officer 2026",
        ministry_or_department: "High Court of Uttarakhand Registry",
        post_name: "Assistant Review Officer (ARO), Personal Assistant & Junior Assistant",
        total_vacancies: 412,
        category_code: "central-govt",
        date_of_notification: "2026-02-08",
        closing_date: "2026-03-26",
        pdf_url: "https://highcourtofuttarakhand.gov.in/pdf/ARO_Recruitment_2026.pdf",
        apply_url: "https://highcourtofuttarakhand.gov.in/recruitment.html",
        qualification_summary: "Bachelor's Degree from a University established by law in India with computer typing proficiency in Hindi & English.",
        age_limit_summary: "21 to 42 years as on 01-01-2026.",
        pay_scale: "Pay Matrix Level 7 (Rs. 44,900 - 1,42,400) for ARO",
        min_age: 21,
        max_age: 42
      }
    ]
  },
  {
    key: "uk_police_official_feed",
    name: "Uttarakhand Police Recruitment Board Official Feed",
    organizationSlug: "uk-police",
    organizationName: "Uttarakhand Police",
    jurisdiction: "state",
    stateCode: "UK",
    baseUrl: "https://uttarakhandpolice.gov.in",
    recruitmentPath: "/recruitment",
    applyUrl: "https://psc.uk.gov.in",
    defaultCategory: "defence",
    canonicalNotices: [
      {
        advertisement_number: "UKP/Constable-Fireman/2026/01",
        title: "Uttarakhand Police Constable (Civil/PAC/IRB), Fireman & Sub-Inspector Notification 2026",
        ministry_or_department: "Home Department, Government of Uttarakhand",
        post_name: "Police Constable (Civil Police / PAC / IRB), Fireman & Sub-Inspector",
        total_vacancies: 2280,
        category_code: "defence",
        date_of_notification: "2026-01-25",
        closing_date: "2026-03-16",
        pdf_url: "https://uttarakhandpolice.gov.in/docs/UK_Police_Constable_2026.pdf",
        apply_url: "https://psc.uk.gov.in",
        qualification_summary: "Intermediate (10+2) from Uttarakhand Board or recognized board for Constable; Degree for SI.",
        age_limit_summary: "18 to 22 years for Constable (relaxed for Uttarakhand domicile categories); 21-28 for SI.",
        pay_scale: "Pay Matrix Level 3 (Rs. 21,700 - 69,100)",
        min_age: 18,
        max_age: 28
      }
    ]
  },
  {
    key: "ukmssb_medical_feed",
    name: "Uttarakhand Medical Service Selection Board (UKMSSB) Official Feed",
    organizationSlug: "ukmssb",
    organizationName: "Uttarakhand Medical Service Selection Board",
    jurisdiction: "state",
    stateCode: "UK",
    baseUrl: "https://ukmssb.org",
    recruitmentPath: "/current-openings",
    applyUrl: "https://ukmssb.org/apply",
    defaultCategory: "medical",
    canonicalNotices: [
      {
        advertisement_number: "UKMSSB/Nursing-MO/2026/03",
        title: "UKMSSB Nursing Officer (Male/Female), Medical Officer & Dental Surgeon Recruitment 2026",
        ministry_or_department: "Medical Health & Family Welfare Department, Uttarakhand",
        post_name: "Nursing Officer (Diploma/Degree Holders) & Ordinary Grade Medical Officer",
        total_vacancies: 1564,
        category_code: "medical",
        date_of_notification: "2026-01-30",
        closing_date: "2026-03-20",
        pdf_url: "https://ukmssb.org/pdf/Nursing_Officer_Advt_2026.pdf",
        apply_url: "https://ukmssb.org/apply",
        qualification_summary: "B.Sc Nursing / Post Basic B.Sc / GNM Diploma with registration in Uttarakhand Nursing Council.",
        age_limit_summary: "21 to 42 years as on 01-07-2026.",
        pay_scale: "Pay Matrix Level 7 (Rs. 44,900 - 1,42,400)",
        min_age: 21,
        max_age: 42
      }
    ]
  },
  {
    key: "upcl_ujvnl_power_feed",
    name: "Uttarakhand Power Corporation Limited (UPCL & UJVNL) Official Feed",
    organizationSlug: "upcl-ujvnl",
    organizationName: "Uttarakhand Power Corporation Limited",
    jurisdiction: "state",
    stateCode: "UK",
    baseUrl: "https://www.upcl.org",
    recruitmentPath: "/recruitment",
    applyUrl: "https://www.upcl.org/careers",
    defaultCategory: "engineering",
    canonicalNotices: [
      {
        advertisement_number: "UPCL/AE-JE-Staff/2026/02",
        title: "UPCL Assistant Engineer (Electrical/Mechanical/Civil), Junior Engineer & Office Assistant 2026",
        ministry_or_department: "Energy Department, Government of Uttarakhand",
        post_name: "Assistant Engineer (Trainee), Junior Engineer (Trainee) & Accounts Officer",
        total_vacancies: 890,
        category_code: "engineering",
        date_of_notification: "2026-02-05",
        closing_date: "2026-03-25",
        pdf_url: "https://www.upcl.org/docs/UPCL_AE_JE_Advt_2026.pdf",
        apply_url: "https://www.upcl.org/careers",
        qualification_summary: "Bachelor Degree in Electrical/Mechanical/Civil Engineering or Diploma in relevant discipline.",
        age_limit_summary: "21 to 42 years as on 01-01-2026.",
        pay_scale: "Pay Level 10 (Rs. 56,100 - 1,77,500) for AE; Level 6 for JE",
        min_age: 21,
        max_age: 42
      }
    ]
  },
  {
    key: "utc_transport_feed",
    name: "Uttarakhand Transport Corporation (UTC) Official Feed",
    organizationSlug: "utc-uttarakhand",
    organizationName: "Uttarakhand Transport Corporation",
    jurisdiction: "state",
    stateCode: "UK",
    baseUrl: "https://utc.uk.gov.in",
    recruitmentPath: "/recruitment",
    applyUrl: "https://utc.uk.gov.in/recruitment.html",
    defaultCategory: "central-govt",
    canonicalNotices: [
      {
        advertisement_number: "UTC/Driver-Conductor-Samvida/2026/01",
        title: "UTC Samvida Driver, Conductor & Workshop Technical Assistant Notification 2026",
        ministry_or_department: "Transport Department, Government of Uttarakhand",
        post_name: "Samvida Bus Driver (Hill/Plains Cadre), Conductor & Mechanic",
        total_vacancies: 1620,
        category_code: "central-govt",
        date_of_notification: "2026-02-12",
        closing_date: "2026-03-31",
        pdf_url: "https://utc.uk.gov.in/docs/UTC_Driver_Conductor_2026.pdf",
        apply_url: "https://utc.uk.gov.in/recruitment.html",
        qualification_summary: "8th/10th passed with valid HMV driving license for hilly and plain terrains; or 10th with conductor badge.",
        age_limit_summary: "18 to 42 years as on closing date.",
        pay_scale: "Consolidated Pay Rs. 16,000 - 22,500 per month with kilometer allowances",
        min_age: 18,
        max_age: 42
      }
    ]
  }
];
