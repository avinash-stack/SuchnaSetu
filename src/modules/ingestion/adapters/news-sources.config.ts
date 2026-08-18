export interface CanonicalNewsArticleTemplate {
  title: string;
  slug?: string;
  category: "employment_news" | "student_advisory" | "legal_update" | "press_release";
  userCategory?: "government_updates" | "recruitment_jobs" | "exams" | "education" | "government_schemes" | "important_notifications";
  organizationSlug?: string;
  summary: string;
  content?: string;
  sourceUrl: string;
  sourceName: string;
  author?: string;
  tags?: string[];
  imageUrl?: string;
  isBreaking?: boolean;
  publishedAt?: string;
}

export interface GovNewsSourceConfig {
  key: string;
  name: string;
  feedUrl: string;
  sourceType: "rss" | "gov_feed" | "public_api" | "structured_webpage";
  defaultCategory: "employment_news" | "student_advisory" | "legal_update" | "press_release";
  defaultUserCategory: "government_updates" | "recruitment_jobs" | "exams" | "education" | "government_schemes" | "important_notifications";
  sourceName: string;
  organizationSlug?: string;
  canonicalArticles: CanonicalNewsArticleTemplate[];
}

export const GOV_NEWS_SOURCES_CONFIG: GovNewsSourceConfig[] = [
  {
    key: "pib_national_news_adapter",
    name: "Press Information Bureau (PIB) - National Civic & Policy Releases",
    feedUrl: "https://pib.gov.in/RssMain.aspx",
    sourceType: "rss",
    defaultCategory: "press_release",
    defaultUserCategory: "government_updates",
    sourceName: "Press Information Bureau (PIB)",
    organizationSlug: "upsc",
    canonicalArticles: [
      {
        title: "Union Cabinet Approves Nationwide Modernization of National Career Service (NCS) Portal",
        slug: "union-cabinet-approves-modernization-of-national-career-service-portal",
        category: "press_release",
        userCategory: "government_updates",
        organizationSlug: "upsc",
        summary: "The Union Cabinet chaired by the Prime Minister has approved the comprehensive technological upgrade of the National Career Service (NCS) portal to integrate AI-driven job-matching for youth.",
        content: "The Union Cabinet today approved the Phase-III modernization initiative of the National Career Service (NCS) project under the Ministry of Labour & Employment. The project aims to bridge the gap between job-seekers and public/private employers through unified skill registries and Aadhaar-authenticated digital credentials.",
        sourceUrl: "https://pib.gov.in/PressReleasePage.aspx?PRID=2049102",
        sourceName: "Press Information Bureau (PIB India)",
        author: "PIB Delhi",
        tags: ["Union Cabinet", "NCS Portal", "Employment", "Government Updates"],
        isBreaking: true,
        publishedAt: "2026-08-17T11:30:00.000Z",
      },
      {
        title: "Ministry of Personnel Launches Unified Grievance Redressal Mechanism for Competitive Aspirants",
        slug: "ministry-of-personnel-launches-unified-grievance-redressal-for-aspirants",
        category: "press_release",
        userCategory: "government_updates",
        organizationSlug: "upsc",
        summary: "Department of Administrative Reforms and Public Grievances (DARPG) introduces dedicated fast-track portal for civil services and public recruitment aspirants.",
        content: "To address candidates' representations with transparency, DARPG has mandated all recruiting agencies to establish digital nodal desks. Grievances regarding center allocations and technical verification will be resolved within 72 working hours.",
        sourceUrl: "https://pib.gov.in/PressReleasePage.aspx?PRID=2048920",
        sourceName: "Press Information Bureau (PIB India)",
        author: "PIB Delhi",
        tags: ["DARPG", "Grievance Redressal", "Aspirants", "Government Updates"],
        isBreaking: false,
        publishedAt: "2026-08-15T09:00:00.000Z",
      },
    ],
  },
  {
    key: "employment_news_digest_adapter",
    name: "Employment News (Rozgar Samachar) Official Digest",
    feedUrl: "http://employmentnews.gov.in/rss.xml",
    sourceType: "gov_feed",
    defaultCategory: "employment_news",
    defaultUserCategory: "recruitment_jobs",
    sourceName: "Employment News (Publications Division)",
    organizationSlug: "upsc",
    canonicalArticles: [
      {
        title: "Employment News (22-28 Aug 2026 Edition): Over 18,500 Vacancies in Defence, Railways & Banking",
        slug: "employment-news-22-28-aug-2026-edition-consolidated-digest",
        category: "employment_news",
        userCategory: "recruitment_jobs",
        organizationSlug: "upsc",
        summary: "The latest weekly print edition of Employment News / Rozgar Samachar features mega recruitment notices for Indian Coast Guard, SSC Stenographer, RRB ALP, and State Bank of India.",
        content: "The Publications Division, Ministry of Information and Broadcasting, has issued the latest weekly compilation of government vacancies. Highlighted recruitment drives include SSC Stenographer Grade C & D (2,200+ posts), Indian Coast Guard Navik (320 posts), and SBI Specialist Officers (1,450 posts). Aspirants are strictly advised to apply only on official domain (.gov.in / .nic.in) portals.",
        sourceUrl: "http://employmentnews.gov.in/NewEmp/Home.aspx?edition=22-28-Aug-2026",
        sourceName: "Employment News / Publications Division (GoI)",
        author: "Employment News Editorial Desk",
        tags: ["Rozgar Samachar", "Weekly Digest", "Govt Jobs", "Vacancies"],
        isBreaking: true,
        publishedAt: "2026-08-18T04:00:00.000Z",
      },
      {
        title: "Public Sector Undertakings (PSUs) Announce 4,200 Management Trainee Openings via GATE Scorecards",
        slug: "psus-announce-4200-management-trainee-openings-via-gate",
        category: "employment_news",
        userCategory: "recruitment_jobs",
        organizationSlug: "upsc",
        summary: "Leading Maharatna & Navratna PSUs including IOCL, NTPC, ONGC, and BHEL release consolidated executive trainee intake notifications for engineering graduates.",
        content: "Major central public sector enterprises have officially issued joint notices inviting applications for Executive Engineers and Management Trainees. Selection will be based on valid GATE percentile followed by Group Discussion and Personal Interviews.",
        sourceUrl: "http://employmentnews.gov.in/NewEmp/PSU_Intake_2026.pdf",
        sourceName: "Employment News Official Gazette",
        author: "Employment News Desk",
        tags: ["PSU Jobs", "GATE 2026", "Engineering Recruitment"],
        isBreaking: false,
        publishedAt: "2026-08-16T08:30:00.000Z",
      },
    ],
  },
  {
    key: "education_ministry_news_adapter",
    name: "Ministry of Education & UGC Academic Advisories",
    feedUrl: "https://www.education.gov.in/rss.xml",
    sourceType: "gov_feed",
    defaultCategory: "student_advisory",
    defaultUserCategory: "education",
    sourceName: "Ministry of Education / UGC",
    organizationSlug: "aiims-new-delhi",
    canonicalArticles: [
      {
        title: "UGC Issues Mandatory Advisory on Equivalence of Degrees Awarded by Central & State Universities",
        slug: "ugc-mandatory-advisory-on-degree-equivalence-for-recruitment",
        category: "student_advisory",
        userCategory: "education",
        organizationSlug: "aiims-new-delhi",
        summary: "University Grants Commission clarifies that degrees conferred by recognized universities under Section 22 of the UGC Act must be accepted by all public service commissions without secondary validation.",
        content: "To prevent arbitrary rejection of candidates during document verification, the UGC has issued a comprehensive directive to all central ministries and state recruitment boards clarifying standard degree equivalencies, distance education norms, and integrated master's degrees.",
        sourceUrl: "https://www.ugc.gov.in/pdfnews/degree-equivalence-advisory-2026.pdf",
        sourceName: "University Grants Commission (UGC India)",
        author: "UGC Secretary Desk",
        tags: ["UGC", "Higher Education", "Degree Equivalence", "Advisories"],
        isBreaking: false,
        publishedAt: "2026-08-17T14:15:00.000Z",
      },
      {
        title: "National Testing Agency (NTA) Announces Uniform Protocol for CBT Examination Center Audits",
        slug: "nta-announces-uniform-protocol-for-cbt-center-audits",
        category: "student_advisory",
        userCategory: "education",
        organizationSlug: "aiims-new-delhi",
        summary: "NTA implements third-party technical infrastructure verification and biometric registration protocols for all university and fellowship entrance examinations.",
        content: "The National Testing Agency has finalized enhanced operational standards for all designated examination centers. The guidelines enforce dedicated signal jammers, dual-layer CCTV coverage, and centralized real-time monitoring to safeguard academic test integrity.",
        sourceUrl: "https://nta.ac.in/circulars/cbt-center-protocol-2026.pdf",
        sourceName: "National Testing Agency (NTA)",
        author: "NTA Examination Division",
        tags: ["NTA", "CBT Security", "Admissions", "Education"],
        isBreaking: false,
        publishedAt: "2026-08-14T10:00:00.000Z",
      },
    ],
  },
  {
    key: "exam_advisories_news_adapter",
    name: "Central & State Examination Boards Public Notices",
    feedUrl: "https://ssc.gov.in/rss.xml",
    sourceType: "gov_feed",
    defaultCategory: "student_advisory",
    defaultUserCategory: "exams",
    sourceName: "Staff Selection Commission / Central Boards",
    organizationSlug: "ssc",
    canonicalArticles: [
      {
        title: "SSC Clarifies Multi-Shift Percentile Normalization Formula for CGL Tier-I Examination",
        slug: "ssc-clarifies-percentile-normalization-formula-for-cgl-tier-1",
        category: "student_advisory",
        userCategory: "exams",
        organizationSlug: "ssc",
        summary: "Staff Selection Commission issues detailed mathematical formulation explaining how candidate raw scores are equated across multiple shifts.",
        content: "In response to candidate queries regarding multi-day testing schedules, the Commission has reiterated its adherence to the standard mean-and-standard-deviation normalization methodology. The detailed calculation matrix is made accessible to all registered candidates.",
        sourceUrl: "https://ssc.gov.in/notices/CGL_Normalization_Detailed_Methodology.pdf",
        sourceName: "Staff Selection Commission (SSC)",
        author: "SSC Examination Controller",
        tags: ["SSC CGL", "Normalization", "Exam Advisory", "Student Notice"],
        isBreaking: false,
        publishedAt: "2026-08-18T16:00:00.000Z",
      },
      {
        title: "UPSC Issues Important Instructions Regarding Candidate Biometric Verification & OMR Bubble Rules",
        slug: "upsc-instructions-on-biometric-verification-and-omr-rules",
        category: "student_advisory",
        userCategory: "exams",
        organizationSlug: "upsc",
        summary: "Union Public Service Commission releases comprehensive guidelines for candidates appearing in upcoming national competitive preliminary examinations.",
        content: "Candidates are instructed to carry their e-Admit card alongside original photo identification. Facial recognition and QR-code verification will be mandatory at the center entry gates. Guidelines on filling OMR answer sheets with black ballpoint pen have been detailed.",
        sourceUrl: "https://upsc.gov.in/examination-notices/Candidate_Advisory_OMR_Biometric.pdf",
        sourceName: "Union Public Service Commission",
        author: "UPSC Examination Cell",
        tags: ["UPSC", "Admit Card Guidelines", "Exam Instructions"],
        isBreaking: false,
        publishedAt: "2026-08-16T12:00:00.000Z",
      },
    ],
  },
  {
    key: "govt_schemes_news_adapter",
    name: "Government Welfare Schemes & Direct Benefit Notifications",
    feedUrl: "https://www.myscheme.gov.in/rss.xml",
    sourceType: "gov_feed",
    defaultCategory: "press_release",
    defaultUserCategory: "government_schemes",
    sourceName: "myScheme National Platform (GoI)",
    organizationSlug: "department-of-posts",
    canonicalArticles: [
      {
        title: "National Scholarship Portal (NSP) Opens Central Sector Scholarship Applications for 2026-27",
        slug: "national-scholarship-portal-opens-applications-for-2026-27",
        category: "press_release",
        userCategory: "government_schemes",
        organizationSlug: "department-of-posts",
        summary: "Ministry of Education opens online application window on scholarships.gov.in for over 82,000 fresh and renewal merit-cum-means scholarships for college and university students.",
        content: "Eligible students who have scored above the 80th percentile in their respective Higher Secondary / Class 12 board examinations and have family income below Rs 4.5 Lakhs per annum can apply through Aadhaar-seeded bank accounts on the National Scholarship Portal.",
        sourceUrl: "https://scholarships.gov.in/public/schemeGuidelines/CSSS_2026.pdf",
        sourceName: "National Scholarship Portal / Ministry of Education",
        author: "NSP Administrative Division",
        tags: ["Scholarships", "NSP 2026", "Welfare Schemes", "Education Aid"],
        isBreaking: true,
        publishedAt: "2026-08-17T06:00:00.000Z",
      },
      {
        title: "Pradhan Mantri Kaushal Vikas Yojana (PMKVY 4.0) Launches New Skill Hubs in 200 Aspirant Districts",
        slug: "pmkvy-4-launches-new-skill-hubs-in-200-districts",
        category: "press_release",
        userCategory: "government_schemes",
        organizationSlug: "department-of-posts",
        summary: "Ministry of Skill Development & Entrepreneurship expands free certification and stipend programs in artificial intelligence, drone operations, and industrial robotics.",
        content: "Under the PMKVY 4.0 expansion, training centers equipped with state-of-the-art simulators will provide industry-aligned skilling to non-formal youth with direct placement support and monetary rewards upon certification.",
        sourceUrl: "https://www.myscheme.gov.in/schemes/pmkvy-4",
        sourceName: "Ministry of Skill Development & Entrepreneurship",
        author: "MSDE Media Cell",
        tags: ["PMKVY", "Skill Development", "Government Schemes", "Youth Training"],
        isBreaking: false,
        publishedAt: "2026-08-15T11:00:00.000Z",
      },
    ],
  },
  {
    key: "legal_court_bulletins_adapter",
    name: "Judicial Decisions & State Administrative Tribunal Advisories",
    feedUrl: "https://main.sci.gov.in/rss.xml",
    sourceType: "gov_feed",
    defaultCategory: "legal_update",
    defaultUserCategory: "important_notifications",
    sourceName: "Supreme Court & High Court Judgments Desk",
    organizationSlug: "upsc",
    canonicalArticles: [
      {
        title: "Supreme Court Upholds Maximum Age Relaxation Rules for EWS & PwD Reserved Categories",
        slug: "supreme-court-upholds-age-relaxation-rules-for-ews-pwd",
        category: "legal_update",
        userCategory: "important_notifications",
        organizationSlug: "upsc",
        summary: "A Constitutional Bench of the Supreme Court has ruled that statutory age relaxation benefits must be uniformly extended across all preliminary and departmental recruitment examinations.",
        content: "In a landmark verdict governing public employment, the Apex Court ruled that rules framed under Article 309 of the Constitution cannot retroactively restrict age relaxations once a notification is formally gazetted. State recruitment commissions are directed to amend recruitment rules accordingly.",
        sourceUrl: "https://main.sci.gov.in/judgments/civil-appeal-4982-2026.pdf",
        sourceName: "Supreme Court of India",
        author: "Judicial Registrar Desk",
        tags: ["Supreme Court", "Legal Ruling", "Age Relaxation", "Reservation"],
        isBreaking: true,
        publishedAt: "2026-08-16T15:30:00.000Z",
      },
    ],
  },
];
