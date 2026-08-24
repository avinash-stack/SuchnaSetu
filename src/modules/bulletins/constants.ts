export const BULLETIN_CATEGORIES = [
  {
    key: "exam_recruitment",
    dbCategory: "employment_news",
    label: "Exam & Recruitment",
    labelHindi: "परीक्षा एवं भर्ती",
    description: "Exam postponements, cancellations, new dates, vacancies & recruitment amendments",
    badge: "Recruitment",
    color: "bg-blue-600 text-white",
  },
  {
    key: "student_aspirant",
    dbCategory: "student_advisory",
    label: "Student & Aspirant Desk",
    labelHindi: "छात्र एवं अभ्यर्थी अपडेट",
    description: "Student protests, paper leaks, exam irregularities, and High Court / Supreme Court verdicts",
    badge: "Aspirant Alert",
    color: "bg-red-600 text-white",
  },
  {
    key: "education_govt",
    dbCategory: "press_release",
    label: "Education & Ministry",
    labelHindi: "शिक्षा एवं आयोग नीति",
    description: "NTA, UGC, AICTE, Ministry of Education announcements and national policy circulars",
    badge: "Govt & NTA",
    color: "bg-indigo-600 text-white",
  },
  {
    key: "results_admit_cards",
    dbCategory: "student_advisory",
    label: "Results & Admit Cards",
    labelHindi: "परिणाम एवं प्रवेश पत्र",
    description: "Direct links to examination scorecards, merit lists, hall tickets & answer keys",
    badge: "Result / Admit",
    color: "bg-emerald-600 text-white",
  },
] as const;

export type BulletinCategoryKey =
  | typeof BULLETIN_CATEGORIES[number]["key"]
  | "all"
  | "employment_news"
  | "student_advisory"
  | "press_release"
  | "legal_update";
