/**
 * Topic Relevance & Semantic Entity Classifier for SuchnaSetu News.
 * Deterministic rule-based engine with optional AI enhancement.
 */

export interface ArticleClassification {
  category: "exam_recruitment" | "student_aspirant" | "education_govt" | "results_admit_cards";
  topics: string[];
  state?: string;
  stateCode?: string;
  organizations: string[];
  importance: "breaking" | "high" | "normal";
  isRelevantForAspirants: boolean;
  relevanceScore: number; // 0 to 100
}

// Known State and UT mappings
const STATE_PATTERNS: Array<{ name: string; code: string; patterns: RegExp[] }> = [
  { name: "Bihar", code: "BR", patterns: [/\bbihar\b/i, /\bpatna\b/i, /\bbpsc\b/i, /\bbbssc\b/i, /\bstet\b/i, /\btre\b/i, /\bbtsc\b/i] },
  { name: "Jharkhand", code: "JH", patterns: [/\bjharkhand\b/i, /\branchi\b/i, /\bjpsc\b/i, /\bjssc\b/i, /\bjtet\b/i] },
  { name: "Uttar Pradesh", code: "UP", patterns: [/\buttar pradesh\b/i, /\bu\.?p\.?\b/i, /\blucknow\b/i, /\buppsc\b/i, /\bupsssc\b/i, /\buptet\b/i, /\bprayagraj\b/i, /\ballahabad\b/i] },
  { name: "Rajasthan", code: "RJ", patterns: [/\brajasthan\b/i, /\bjaipur\b/i, /\brpsc\b/i, /\brssb\b/i, /\breet\b/i] },
  { name: "Madhya Pradesh", code: "MP", patterns: [/\bmadhya pradesh\b/i, /\bm\.?p\.?\b/i, /\bbhopal\b/i, /\bmppsc\b/i, /\bmppesb\b/i, /\bvyapam\b/i] },
  { name: "West Bengal", code: "WB", patterns: [/\bwest bengal\b/i, /\bkolkata\b/i, /\bwbpsc\b/i, /\bwbssc\b/i, /\bwbtet\b/i] },
  { name: "Odisha", code: "OR", patterns: [/\bodisha\b/i, /\borissa\b/i, /\bbhubaneswar\b/i, /\bopsc\b/i, /\bossc\b/i, /\bosssc\b/i] },
  { name: "Assam", code: "AS", patterns: [/\bassam\b/i, /\bguwahati\b/i, /\bapsc\b/i, /\badre\b/i] },
  { name: "Punjab", code: "PB", patterns: [/\bpunjab\b/i, /\bchandigarh\b/i, /\bppsc\b/i, /\bpsssb\b/i] },
  { name: "Haryana", code: "HR", patterns: [/\bharyana\b/i, /\bhpsc\b/i, /\bhssc\b/i, /\bhtet\b/i] },
  { name: "Delhi", code: "DL", patterns: [/\bdelhi\b/i, /\bdsssb\b/i] },
  { name: "Maharashtra", code: "MH", patterns: [/\bmaharashtra\b/i, /\bmumbai\b/i, /\bmpsc\b/i] },
  { name: "Uttarakhand", code: "UK", patterns: [/\buttarakhand\b/i, /\bukpsc\b/i, /\buksssc\b/i, /\bdehradun\b/i] },
  { name: "Himachal Pradesh", code: "HP", patterns: [/\bhimachal\b/i, /\bhppsc\b/i, /\bshimla\b/i] },
  { name: "Chhattisgarh", code: "CG", patterns: [/\bchhattisgarh\b/i, /\bcgpsc\b/i, /\braipur\b/i] },
];

// Known Recruiting & Educational Authorities
const ORG_PATTERNS: Array<{ acronym: string; patterns: RegExp[] }> = [
  { acronym: "UPSC", patterns: [/\bupsc\b/i, /\bunion public service commission\b/i, /\bcivil services\b/i] },
  { acronym: "SSC", patterns: [/\bssc\b/i, /\bstaff selection commission\b/i, /\bssc cgl\b/i, /\bssc chsl\b/i, /\bssc gd\b/i, /\bssc mts\b/i] },
  { acronym: "NTA", patterns: [/\bnta\b/i, /\bnational testing agency\b/i, /\bneet\b/i, /\bjee main\b/i, /\bugc net\b/i, /\bcuet\b/i] },
  { acronym: "UGC", patterns: [/\bugc\b/i, /\buniversity grants commission\b/i] },
  { acronym: "AICTE", patterns: [/\baicte\b/i] },
  { acronym: "BPSC", patterns: [/\bbpsc\b/i, /\bbihar public service commission\b/i, /\btre[-\s]?4\b/i, /\btre[-\s]?3\b/i] },
  { acronym: "BSSC", patterns: [/\bbssc\b/i, /\bbihar staff selection commission\b/i] },
  { acronym: "JPSC", patterns: [/\bjpsc\b/i, /\bjharkhand public service commission\b/i] },
  { acronym: "JSSC", patterns: [/\bjssc\b/i, /\bjharkhand staff selection commission\b/i, /\bjglcce\b/i] },
  { acronym: "UPPSC", patterns: [/\buppsc\b/i, /\bup public service commission\b/i, /\bro\/aro\b/i] },
  { acronym: "UPSSSC", patterns: [/\bupsssc\b/i, /\bpet exam\b/i] },
  { acronym: "RPSC", patterns: [/\brpsc\b/i, /\bras exam\b/i] },
  { acronym: "RRB", patterns: [/\brrb\b/i, /\brailway recruitment board\b/i, /\brrc\b/i, /\balp\b/i, /\btechnician\b/i, /\bntpc\b/i] },
  { acronym: "IBPS", patterns: [/\bibps\b/i, /\binstitute of banking personnel\b/i, /\bbank po\b/i, /\bbank clerk\b/i] },
  { acronym: "SBI", patterns: [/\bsbi\b/i, /\bstate bank of india\b/i] },
  { acronym: "CBSE", patterns: [/\bcbse\b/i, /\bctet\b/i] },
  { acronym: "Supreme Court", patterns: [/\bsupreme court\b/i, /\bapex court\b/i, /\bsc bench\b/i] },
  { acronym: "High Court", patterns: [/\bhigh court\b/i, /\bpatna high court\b/i, /\ballahabad high court\b/i, /\branchi high court\b/i] },
];

// Topic Matchers
const TOPIC_PATTERNS: Array<{
  topic: string;
  category: "exam_recruitment" | "student_aspirant" | "education_govt" | "results_admit_cards";
  importance: "breaking" | "high" | "normal";
  patterns: RegExp[];
}> = [
  // Student & Aspirant Updates (Highest priority)
  {
    topic: "student_protest",
    category: "student_aspirant",
    importance: "breaking",
    patterns: [/\bprotest\b/i, /\bdharna\b/i, /\bhungama\b/i, /\bdemonstrat\w+\b/i, /\bagitat\w+\b/i, /\baspirants? protest\b/i, /\bcandidates? protest\b/i, /\brail roko\b/i, /\bsarak par\b/i],
  },
  {
    topic: "paper_leak",
    category: "student_aspirant",
    importance: "breaking",
    patterns: [/\bpaper leak\b/i, /\bleaked\b/i, /\bsolver gang\b/i, /\bcheating\b/i, /\birregularit\w+\b/i, /\bmalpractice\b/i, /\bcbi probe\b/i, /\beou probe\b/i],
  },
  {
    topic: "exam_cancellation",
    category: "student_aspirant",
    importance: "breaking",
    patterns: [/\bcancel\w+\b/i, /\bradd\b/i, /\bscrap\w+\b/i, /\bannul\w+\b/i, /\bexam cancelled\b/i, /\brecruitment cancelled\b/i],
  },
  {
    topic: "exam_postponement",
    category: "exam_recruitment",
    importance: "high",
    patterns: [/\bpostpone\w+\b/i, /\bsthagit\b/i, /\bdelay\w+\b/i, /\bdeferred\b/i, /\breschedule\w+\b/i, /\bexam postponed\b/i],
  },
  {
    topic: "court_verdict",
    category: "student_aspirant",
    importance: "high",
    patterns: [/\bcourt\b/i, /\bjudg\w+\b/i, /\bverdict\b/i, /\border\b/i, /\bstay order\b/i, /\bquash\w+\b/i, /\bbench\b/i, /\bplea\b/i, /\bhearing\b/i],
  },
  {
    topic: "new_exam_date",
    category: "exam_recruitment",
    importance: "high",
    patterns: [/\bnew date\b/i, /\bexam date\b/i, /\bschedule announced\b/i, /\btimetable\b/i, /\btariqh\b/i, /\bexam on\b/i],
  },
  {
    topic: "admit_card_released",
    category: "results_admit_cards",
    importance: "high",
    patterns: [/\badmit card\b/i, /\bhall ticket\b/i, /\bcall letter\b/i, /\be-admit card\b/i, /\bcity slip\b/i, /\bdownload admit card\b/i],
  },
  {
    topic: "result_declared",
    category: "results_admit_cards",
    importance: "high",
    patterns: [/\bresult\b/i, /\bmerit list\b/i, /\bcut[-\s]?off\b/i, /\bscorecard\b/i, /\bresult declared\b/i, /\bselected candidates\b/i],
  },
  {
    topic: "answer_key",
    category: "results_admit_cards",
    importance: "high",
    patterns: [/\banswer key\b/i, /\bresponse sheet\b/i, /\bprovisional key\b/i, /\bfinal key\b/i, /\bobjection window\b/i],
  },
  {
    topic: "vacancy_announcement",
    category: "exam_recruitment",
    importance: "high",
    patterns: [/\bvacancy\b/i, /\bvacancies\b/i, /\bposts?\b/i, /\brecruitment\b/i, /\bnotif\w+\b/i, /\bbharti\b/i, /\bapply online\b/i, /\bjobs?\b/i],
  },
  {
    topic: "application_extension",
    category: "exam_recruitment",
    importance: "high",
    patterns: [/\bdate extended\b/i, /\blast date extend\w+\b/i, /\bdeadline extended\b/i, /\bre-open\w+\b/i],
  },
  {
    topic: "rule_change",
    category: "exam_recruitment",
    importance: "high",
    patterns: [/\brule change\b/i, /\bage relaxation\b/i, /\beligibility criteria\b/i, /\bpattern changed\b/i, /\bsyllabus changed\b/i, /\bnormalisation\b/i],
  },
  {
    topic: "education_policy",
    category: "education_govt",
    importance: "normal",
    patterns: [/\bministry of education\b/i, /\bpolicy\b/i, /\bnep 2020\b/i, /\bguidelines\b/i, /\badvisory\b/i, /\baccreditation\b/i, /\bequivalence\b/i],
  },
];

// Negative filters for irrelevant news (Bollywood, cricket, general crime/traffic, cinema)
const IRRELEVANT_PATTERNS: RegExp[] = [
  /\bbox office\b/i,
  /\bmovie review\b/i,
  /\bcricket score\b/i,
  /\bipl 202\d\b/i,
  /\bbollywood\b/i,
  /\bhoroscope\b/i,
  /\bzodiac\b/i,
  /\bweb series\b/i,
  /\bfashion\b/i,
  /\bcelebrity\b/i,
  /\bgold price\b/i,
  /\bpetrol price\b/i,
  /\bweather forecast\b/i,
  /\bmonsoon update\b/i,
];

/**
 * Classifies an incoming article using deterministic regex & entity matching.
 */
export function classifyArticle(title: string, summary: string = ""): ArticleClassification {
  const combinedText = `${title} ${summary}`.toLowerCase();

  // 1. Check for negative/irrelevant news
  for (const irrel of IRRELEVANT_PATTERNS) {
    if (irrel.test(title)) {
      return {
        category: "exam_recruitment",
        topics: [],
        organizations: [],
        importance: "normal",
        isRelevantForAspirants: false,
        relevanceScore: 0,
      };
    }
  }

  // 2. Extract Matching State
  let detectedState: string | undefined;
  let detectedStateCode: string | undefined;

  for (const stateObj of STATE_PATTERNS) {
    if (stateObj.patterns.some((p) => p.test(combinedText))) {
      detectedState = stateObj.name;
      detectedStateCode = stateObj.code;
      break;
    }
  }

  // 3. Extract Matching Organizations
  const detectedOrgs: string[] = [];
  for (const orgObj of ORG_PATTERNS) {
    if (orgObj.patterns.some((p) => p.test(combinedText))) {
      detectedOrgs.push(orgObj.acronym);
    }
  }

  // 4. Extract Matching Topics & Categories
  const matchedTopics: string[] = [];
  let highestCategory: "exam_recruitment" | "student_aspirant" | "education_govt" | "results_admit_cards" = "exam_recruitment";
  let maxImportance: "breaking" | "high" | "normal" = "normal";
  let relevanceScore = 0;

  for (const t of TOPIC_PATTERNS) {
    if (t.patterns.some((p) => p.test(combinedText))) {
      matchedTopics.push(t.topic);

      // Prioritize student_aspirant or results over general recruitment
      if (t.category === "student_aspirant") {
        highestCategory = "student_aspirant";
      } else if (t.category === "results_admit_cards" && highestCategory !== "student_aspirant") {
        highestCategory = "results_admit_cards";
      } else if (t.category === "education_govt" && highestCategory === "exam_recruitment") {
        highestCategory = "education_govt";
      }

      if (t.importance === "breaking") {
        maxImportance = "breaking";
        relevanceScore += 40;
      } else if (t.importance === "high") {
        if (maxImportance !== "breaking") maxImportance = "high";
        relevanceScore += 25;
      } else {
        relevanceScore += 15;
      }
    }
  }

  if (detectedOrgs.length > 0) relevanceScore += 20;
  if (detectedState) relevanceScore += 10;

  // An article is considered relevant if it matched any student/exam topic or a known recruiting authority
  const isRelevant = matchedTopics.length > 0 || detectedOrgs.length > 0 || /\bexam|recruitment|vacancy|student|teacher|constable|admit|result\b/i.test(combinedText);

  return {
    category: highestCategory,
    topics: Array.from(new Set(matchedTopics)),
    state: detectedState,
    stateCode: detectedStateCode,
    organizations: Array.from(new Set(detectedOrgs)),
    importance: maxImportance,
    isRelevantForAspirants: isRelevant,
    relevanceScore: Math.min(100, Math.max(0, relevanceScore)),
  };
}
