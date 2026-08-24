export interface CanonicalNewsArticleTemplate {
  title: string;
  slug?: string;
  category: "employment_news" | "student_advisory" | "legal_update" | "press_release";
  userCategory?: "exam_recruitment" | "student_aspirant" | "education_govt" | "results_admit_cards";
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
  topics?: string[];
  state?: string;
  stateCode?: string;
}

export interface GovNewsSourceConfig {
  key: string;
  name: string;
  feedUrl: string;
  sourceType: "rss" | "gov_feed" | "public_api" | "structured_webpage";
  defaultCategory: "employment_news" | "student_advisory" | "legal_update" | "press_release";
  defaultUserCategory: "exam_recruitment" | "student_aspirant" | "education_govt" | "results_admit_cards";
  sourceName: string;
  organizationSlug?: string;
  canonicalArticles: CanonicalNewsArticleTemplate[];
}

export const GOV_NEWS_SOURCES_CONFIG: GovNewsSourceConfig[] = [
  {
    key: "indian_express_education_adapter",
    name: "The Indian Express - Student & Competitive Exam Desk",
    feedUrl: "https://indianexpress.com/section/education/feed/",
    sourceType: "rss",
    defaultCategory: "student_advisory",
    defaultUserCategory: "student_aspirant",
    sourceName: "The Indian Express Education Desk",
    organizationSlug: "nta",
    canonicalArticles: [
      {
        title: "Aspirants Stage Protest Over Exam Schedule & Center Allocations; Commission Releases Assurance Note",
        slug: "aspirants-stage-protest-over-exam-schedule-center-allocations",
        category: "student_advisory",
        userCategory: "student_aspirant",
        organizationSlug: "jssc",
        summary: "Hundreds of competitive aspirants gathered outside the state commission office demanding uniform shift normalization and transparent grievance disposal for upcoming recruitment examinations.",
        content: "A delegation of candidate representatives met senior commission officials today regarding multi-shift center allocations. The commission formally notified that biometric checks will be enforced at all test venues and any complaints will be resolved within 48 hours.",
        sourceUrl: "https://indianexpress.com/article/education/competitive-aspirants-protest-grievance-resolution",
        sourceName: "The Indian Express Education Desk",
        author: "Express Education Bureau",
        tags: ["Student Protest", "Recruitment Exam", "Grievance", "Aspirant Updates"],
        topics: ["student_protest", "exam_irregularity"],
        state: "Jharkhand",
        stateCode: "JH",
        isBreaking: true,
      },
      {
        title: "Supreme Court Issues Direction on Normalization Formula and Age Relaxations for State Recruitment",
        slug: "supreme-court-direction-normalization-age-relaxation-recruitment",
        category: "legal_update",
        userCategory: "student_aspirant",
        organizationSlug: "upsc",
        summary: "The Apex Court clarified that statutory age relaxation once notified cannot be curtailed retroactively, protecting candidates affected by pandemic-era exam delays.",
        content: "A bench of the Supreme Court heard appeals regarding the recruitment rules across state commissions. The court mandated all state bodies to publish shift-wise raw and normalized score distribution matrices along with provisional answer keys.",
        sourceUrl: "https://indianexpress.com/article/education/supreme-court-recruitment-normalization-verdict",
        sourceName: "The Indian Express / Court Bureau",
        author: "Legal Correspondent",
        tags: ["Supreme Court", "Court Verdict", "Age Relaxation", "Recruitment Rules"],
        topics: ["court_verdict", "rule_change"],
        isBreaking: true,
      },
    ],
  },
  {
    key: "pib_national_news_adapter",
    name: "Press Information Bureau (PIB) - Ministry of Personnel & Education",
    feedUrl: "https://pib.gov.in/RssMain.aspx",
    sourceType: "rss",
    defaultCategory: "press_release",
    defaultUserCategory: "education_govt",
    sourceName: "Press Information Bureau (PIB)",
    organizationSlug: "upsc",
    canonicalArticles: [
      {
        title: "National Testing Agency (NTA) & Ministry of Education Release Standard Operating Procedure for National Entrance Tests",
        slug: "nta-ministry-of-education-release-sop-national-entrance-tests",
        category: "press_release",
        userCategory: "education_govt",
        organizationSlug: "nta",
        summary: "Ministry of Education enforces dedicated CCTV live streaming, high-frequency signal jammers, and DigiLocker credential validation across all examination centers.",
        content: "To guarantee foolproof exam integrity, the Ministry of Education has released updated protocol for all CBT examinations conducted by NTA. Designated government officials will serve as center observers with real-time audit dashboards.",
        sourceUrl: "https://pib.gov.in/PressReleasePage.aspx?PRID=2050114",
        sourceName: "Press Information Bureau (PIB India)",
        author: "PIB Delhi",
        tags: ["NTA", "Ministry of Education", "Exam Security", "DigiLocker"],
        topics: ["nta_update", "policy_announcement"],
        isBreaking: false,
      },
      {
        title: "Union Public Service Commission (UPSC) Implements Mandatory Aadhaar-Based Biometric Verification at Entry Gates",
        slug: "upsc-implements-mandatory-aadhaar-biometric-verification-entry",
        category: "press_release",
        userCategory: "exam_recruitment",
        organizationSlug: "upsc",
        summary: "UPSC notifies standardized e-Admit card verification guidelines with QR code checks to ensure zero impersonation during preliminary and mains examinations.",
        content: "Candidates appearing for UPSC Civil Services and allied national examinations must carry their QR-encoded admit cards alongside original government ID. Facial recognition check will be synchronized with center attendance.",
        sourceUrl: "https://pib.gov.in/PressReleasePage.aspx?PRID=2049920",
        sourceName: "Press Information Bureau (PIB India)",
        author: "PIB Delhi",
        tags: ["UPSC", "Exam Advisory", "Biometric Verification"],
        topics: ["new_exam_date", "admit_card_released"],
        isBreaking: false,
      },
    ],
  },
  {
    key: "livelaw_judiciary_news_adapter",
    name: "Live Law / Legal Orders on Public Examinations & Recruitment",
    feedUrl: "https://www.livelaw.in/rss/all",
    sourceType: "rss",
    defaultCategory: "legal_update",
    defaultUserCategory: "student_aspirant",
    sourceName: "Live Law Judicial News Desk",
    organizationSlug: "bpsc",
    canonicalArticles: [
      {
        title: "High Court Dismisses Stay Plea on Teacher Recruitment Examination; Directs Timely Declaration of Results",
        slug: "high-court-dismisses-stay-plea-teacher-recruitment-examination",
        category: "legal_update",
        userCategory: "student_aspirant",
        organizationSlug: "bpsc",
        summary: "The High Court refused to stay ongoing teacher recruitment stages, observing that public interest requires timely filling of teaching vacancies without indefinite litigation.",
        content: "Hearing a batch of writ petitions challenging qualification eligibility rules, the division bench ruled that candidates who fulfilled gazetted criteria on the notification cutoff date are fully eligible to proceed to merit evaluation.",
        sourceUrl: "https://www.livelaw.in/news-updates/high-court-teacher-recruitment-stay-plea-verdict",
        sourceName: "Live Law Judicial Desk",
        author: "High Court Reporter",
        tags: ["High Court", "Teacher Recruitment", "Court Verdict", "BPSC TRE"],
        topics: ["court_verdict", "teacher_recruitment"],
        state: "Bihar",
        stateCode: "BR",
        isBreaking: true,
      },
    ],
  },
  {
    key: "employment_news_digest_adapter",
    name: "Employment News (Rozgar Samachar) Official Digest",
    feedUrl: "http://employmentnews.gov.in/rss.xml",
    sourceType: "gov_feed",
    defaultCategory: "employment_news",
    defaultUserCategory: "exam_recruitment",
    sourceName: "Employment News (Publications Division)",
    organizationSlug: "ssc",
    canonicalArticles: [
      {
        title: "Employment News Weekly Digest: Major Intake Announced Across Railways, SSC & Banking Cadres",
        slug: "employment-news-weekly-digest-railways-ssc-banking-intake",
        category: "employment_news",
        userCategory: "exam_recruitment",
        organizationSlug: "ssc",
        summary: "Over 22,000 verified public sector vacancies announced in the latest official gazette edition including SSC CGL, RRB ALP, and State Bank of India specialist cadres.",
        content: "The Publications Division, Ministry of Information and Broadcasting, has released the weekly consolidated recruitment circular. Candidates are strictly advised to apply only through verified government domains (.gov.in / .nic.in).",
        sourceUrl: "http://employmentnews.gov.in/NewEmp/Home.aspx",
        sourceName: "Employment News (GoI)",
        author: "Employment News Editorial Team",
        tags: ["Rozgar Samachar", "Weekly Digest", "Govt Jobs", "Vacancies"],
        topics: ["vacancy_announcement"],
        isBreaking: false,
      },
    ],
  },
  {
    key: "ndtv_education_adapter",
    name: "NDTV Education & Competitive Examination Feed",
    feedUrl: "https://feeds.feedburner.com/ndtvnews-latest",
    sourceType: "rss",
    defaultCategory: "student_advisory",
    defaultUserCategory: "results_admit_cards",
    sourceName: "NDTV Education Desk",
    organizationSlug: "nta",
    canonicalArticles: [
      {
        title: "UGC NET & CSIR NET Scorecards & Final Answer Keys Released on Official Portal; Direct Link Here",
        slug: "ugc-net-csir-net-scorecards-final-answer-keys-released",
        category: "student_advisory",
        userCategory: "results_admit_cards",
        organizationSlug: "nta",
        summary: "National Testing Agency (NTA) has officially published the final revised answer keys and qualifying cutoffs for JRF and Assistant Professorship.",
        content: "Candidates can log in using their application number and date of birth on the official examination portal to download scorecards. The qualifying cutoffs for all subjects have been declared in percentile format.",
        sourceUrl: "https://ndtv.com/education/ugc-net-scorecard-final-answer-key-released",
        sourceName: "NDTV Education Desk",
        author: "Education Bureau",
        tags: ["UGC NET", "Scorecard", "Answer Key", "NTA"],
        topics: ["result_declared", "answer_key"],
        isBreaking: true,
      },
    ],
  },
];
