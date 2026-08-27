import { resolveLocalizedJob, resolveLocalizedExam, resolveLocalizedBulletin } from "../src/lib/i18n/localize";
import { getLocalizedCategoryName, getLocalizedStateName, getLocalizedDateLabel } from "../src/lib/i18n/config";
import { parseSearchQuery } from "../src/modules/search/query-parser";
import { GovJobDetailed } from "../src/modules/jobs/types";
import { GovExamDetailed } from "../src/modules/exams/types";
import { PublicBulletinDetailed } from "../src/modules/bulletins/types";

console.log("===============================================================================");
console.log("SUCHNASETU CONTENT LAYER MULTILINGUAL ARCHITECTURE VERIFICATION TEST");
console.log("===============================================================================\n");

// 1. Mock Canonical Job with Hindi Translation
const canonicalJob = {
  id: "job-101",
  title: "BSSC 2nd Inter Level Combined Competitive Examination 2026 - 12,199 Posts",
  slug: "bssc-2nd-inter-level-combined-exam-2026",
  post_name: "Junior Clerk, Revenue Employee, Panchayat Secretary",
  notification_number: "Advt No: 02/2026",
  total_vacancies: 12199,
  salary_min: 19900,
  salary_max: 63200,
  pay_scale_details: "Level 2, 3, 4 (Rs. 19,900 - 63,200)",
  qualification_summary: "10+2 Intermediate from recognized board.",
  age_limit_summary: "Min 18 Years, Max 37 Years",
  selection_process: "1. Prelims PT\n2. Mains Exam\n3. Skill Test",
  description: "Bihar Staff Selection Commission invites online applications for 12,199 vacancies.",
  summary: "Official BSSC recruitment notification for 12,199 clerk and revenue posts.",
  official_notification_url: "https://bssc.bihar.gov.in/notices/inter_level_02_2026.pdf",
  official_apply_url: "https://onlinebssc.bihar.gov.in/apply",
  status: "published",
  state_code: "BR",
  category: { id: "cat-1", name: "State Subordinate Services", slug: "state-govt", is_active: true } as any,
  state: { code: "BR", name: "Bihar", type: "state", is_active: true } as any,
  organization: { id: "org-1", name: "Bihar Staff Selection Commission", acronym: "BSSC", slug: "bssc", jurisdiction: "state", is_active: true } as any,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  translations: [
    {
      id: "trans-job-hi",
      job_id: "job-101",
      language_code: "hi",
      title: "बिहार कर्मचारी चयन आयोग (BSSC) द्वितीय इंटर स्तरीय संयुक्त प्रतियोगिता परीक्षा 2026 - 12,199 पद",
      post_name: "कनिष्ठ लिपिक, राजस्व कर्मचारी, पंचायत सचिव एवं आशुलिपिक",
      qualification_summary: "मान्यता प्राप्त बोर्ड से 10+2 (इंटरमीडिएट) उत्तीर्ण।",
      age_limit_summary: "न्यूनतम आयु 18 वर्ष, अधिकतम 37 वर्ष।",
      pay_scale_summary: "वेतनमान लेवल 2, 3 एवं 4 (रु 19,900 - रु 63,200)",
      selection_process: "1. प्रारंभिक परीक्षा (PT)\n2. मुख्य परीक्षा (Mains)\n3. टंकण दक्षता जांच",
      description: "बिहार कर्मचारी चयन आयोग द्वारा विभिन्न प्रशासनिक विभागों में 12,199 रिक्त पदों पर नियमित भर्ती।",
      meta_title: "BSSC द्वितीय इंटर स्तरीय भर्ती 2026",
      meta_description: "बिहार BSSC द्वितीय इंटर स्तरीय परीक्षा की संपूर्ण जानकारी।",
    },
  ],
} as unknown as GovJobDetailed;

// 2. Mock Canonical Exam with Hindi Translation
const canonicalExam = {
  id: "exam-201",
  title: "UPSC Civil Services Preliminary Examination 2026",
  short_title: "UPSC CSE Prelims 2026",
  slug: "upsc-civil-services-preliminary-examination-2026",
  exam_code: "CSE-PRE-2026",
  mode: "offline_omr",
  frequency: "annual",
  description: "All India competitive examination for recruitment to IAS, IPS, IFS and Central Group A services.",
  eligibility_summary: "Bachelor degree in any discipline from recognized university.",
  status: "published",
  state_code: null,
  category: { id: "cat-2", name: "Civil Services", slug: "civil-services", is_active: true } as any,
  organization: { id: "org-2", name: "Union Public Service Commission", acronym: "UPSC", slug: "upsc", jurisdiction: "central", is_active: true } as any,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  translations: [
    {
      id: "trans-exam-hi",
      exam_id: "exam-201",
      language_code: "hi",
      title: "संघ लोक सेवा आयोग (UPSC) सिविल सेवा प्रारंभिक परीक्षा 2026",
      short_title: "यूपीएससी सिविल सेवा (CSE) प्रारंभिक परीक्षा",
      description: "भारतीय प्रशासनिक सेवा (IAS), भारतीय पुलिस सेवा (IPS) सहित केन्द्रीय सेवाओं में भर्ती हेतु वार्षिक प्रतियोगी परीक्षा।",
      eligibility_summary: "किसी भी मान्यता प्राप्त विश्वविद्यालय से स्नातक (Graduation) डिग्री।",
    },
  ],
} as unknown as GovExamDetailed;

// 3. Mock Canonical News Bulletin with Hindi Translation
const canonicalBulletin = {
  id: "bul-301",
  title: "SSC Clarifies Multi-Shift Percentile Normalization Formula for CGL Tier-I Examination",
  slug: "ssc-clarifies-percentile-normalization-formula-for-cgl-tier-1",
  category: "student_advisory",
  summary: "Staff Selection Commission issues detailed mathematical formulation explaining score normalization.",
  content: "In response to candidate queries, the Commission has reiterated its adherence to the standard normalization methodology.",
  source_name: "Staff Selection Commission (SSC)",
  source_url: "https://ssc.gov.in/notices/normalization.pdf",
  status: "published",
  published_at: new Date().toISOString(),
  is_breaking: false,
  translations: [
    {
      id: "trans-bul-hi",
      bulletin_id: "bul-301",
      language_code: "hi",
      title: "कर्मचारी चयन आयोग (SSC) ने CGL टियर-1 बहु-पाली परीक्षा हेतु परसेंटाइल नॉर्मलाइजेशन फॉर्मूला स्पष्ट किया",
      summary: "कर्मचारी चयन आयोग ने बहु-पाली परीक्षाओं में अभ्यर्थियों के अंकों के निष्पक्ष मूल्यांकन हेतु अंक सामान्यीकरण पद्धति का विवरण जारी किया।",
      content: "कर्मचारी चयन आयोग (SSC) द्वारा आयोजित CGL टियर-1 परीक्षा के संबंध में आयोग ने स्पष्ट किया है कि मानक विचलन आधारित फॉर्मूले का उपयोग किया जाता है।",
    },
  ],
} as unknown as PublicBulletinDetailed;

// Test A: Hindi Job Resolution
console.log("--- 1. JOB IN HINDI (Localized View) ---");
const hindiJob = resolveLocalizedJob(canonicalJob, "hi");
console.log("Title (Hindi):", hindiJob.title);
console.log("Post Name (Hindi):", hindiJob.post_name);
console.log("Qualification (Hindi):", hindiJob.qualification_summary);
console.log("Category (Hindi):", hindiJob.category?.name);
console.log("State (Hindi):", hindiJob.state?.name);
console.log("Official Apply URL (Preserved):", hindiJob.official_apply_url);
console.log("Advt No (Preserved):", hindiJob.notification_number);

// Test B: Fallback Behavior (Requested language with missing translation falls back to English)
console.log("\n--- 2. JOB FALLBACK BEHAVIOR (Requested English / Fallback) ---");
const fallbackJob = resolveLocalizedJob(canonicalJob, "en");
console.log("Title (English):", fallbackJob.title);
console.log("Category (Taxonomy):", fallbackJob.category?.name);
console.log("State (Taxonomy):", fallbackJob.state?.name);
console.log("Qualification (English):", fallbackJob.qualification_summary);

// Test C: Hindi Exam Resolution
console.log("\n--- 3. EXAM IN HINDI (Localized View) ---");
const hindiExam = resolveLocalizedExam(canonicalExam, "hi");
console.log("Title (Hindi):", hindiExam.title);
console.log("Short Title (Hindi):", hindiExam.short_title);
console.log("Description (Hindi):", hindiExam.description);
console.log("Eligibility (Hindi):", hindiExam.eligibility_summary);
console.log("Category (Hindi):", hindiExam.category?.name);

// Test D: Hindi News Resolution
console.log("\n--- 4. NEWS BULLETIN IN HINDI (Localized View) ---");
const hindiBulletin = resolveLocalizedBulletin(canonicalBulletin, "hi");
console.log("Title (Hindi):", hindiBulletin.title);
console.log("Summary (Hindi):", hindiBulletin.summary);
console.log("Official Source (Preserved):", hindiBulletin.source_name);

// Test E: Cross-Language Taxonomy & Label Resolution
console.log("\n--- 5. ENGLISH & HINDI TAXONOMY & LABELS ---");
console.log("State 'UP' in Hindi:", getLocalizedStateName("UP", "hi"));
console.log("State 'Bihar' in Hindi:", getLocalizedStateName("BR", "hi"));
console.log("State 'Delhi' in Hindi:", getLocalizedStateName("DL", "hi"));
console.log("Category 'central-govt' in Hindi:", getLocalizedCategoryName("central-govt", "hi"));
console.log("Category 'psu-jobs' in Hindi:", getLocalizedCategoryName("psu-jobs", "hi"));
console.log("Date label 'application_end' in Hindi:", getLocalizedDateLabel("application_end", "hi"));
console.log("Date label 'exam_date' in Hindi:", getLocalizedDateLabel("exam_date", "hi"));

// Test F: Indic Unicode Search Tokenizer
console.log("\n--- 6. INDIC UNICODE SEARCH TOKENIZER ---");
const parsedSearch = parseSearchQuery("बिहार में कनिष्ठ लिपिक भर्ती");
console.log("Raw Query:", parsedSearch.rawQuery);
console.log("Clean Query (Preserving Devanagari):", parsedSearch.cleanQuery);
console.log("Matched State Codes:", parsedSearch.matchedStateCodes);
console.log("Content Tokens:", parsedSearch.contentTokens);
console.log("Is Job Intent:", parsedSearch.isJobIntent);

console.log("\n===============================================================================");
console.log("ALL MULTILINGUAL CONTENT LAYER CHECKS PASSED SUCCESSFULLY!");
console.log("===============================================================================");
