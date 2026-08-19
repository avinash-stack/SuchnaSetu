import { ParsedSearchQuery } from "./types";

// Indian States and Union Territories dictionary for high-precision entity resolution
const STATE_ALIASES: Record<string, string> = {
  bihar: "BR",
  patna: "BR",
  br: "BR",
  "uttar pradesh": "UP",
  up: "UP",
  lucknow: "UP",
  prayagraj: "UP",
  kanpur: "UP",
  delhi: "DL",
  dl: "DL",
  nct: "DL",
  rajasthan: "RJ",
  rj: "RJ",
  jaipur: "RJ",
  "madhya pradesh": "MP",
  mp: "MP",
  bhopal: "MP",
  indore: "MP",
  maharashtra: "MH",
  mh: "MH",
  mumbai: "MH",
  pune: "MH",
  punjab: "PB",
  pb: "PB",
  haryana: "HR",
  hr: "HR",
  gujarat: "GJ",
  gj: "GJ",
  ahmedabad: "GJ",
  karnataka: "KA",
  ka: "KA",
  bengaluru: "KA",
  bangalore: "KA",
  "tamil nadu": "TN",
  tamilnadu: "TN",
  tn: "TN",
  chennai: "TN",
  kerala: "KL",
  kl: "KL",
  thiruvananthapuram: "KL",
  odisha: "OD",
  orissa: "OD",
  od: "OD",
  bhubaneswar: "OD",
  jharkhand: "JH",
  jh: "JH",
  ranchi: "JH",
  chhattisgarh: "CG",
  cg: "CG",
  raipur: "CG",
  "west bengal": "WB",
  bengal: "WB",
  wb: "WB",
  kolkata: "WB",
  assam: "AS",
  as: "AS",
  guwahati: "AS",
  uttarakhand: "UK",
  uk: "UK",
  dehradun: "UK",
  "himachal pradesh": "HP",
  himachal: "HP",
  hp: "HP",
  shimla: "HP",
  jammu: "JK",
  kashmir: "JK",
  jk: "JK",
  srinagar: "JK",
  "andhra pradesh": "AP",
  andhra: "AP",
  ap: "AP",
  telangana: "TS",
  ts: "TS",
  hyderabad: "TS",
  goa: "GA",
  chandigarh: "CH",
  tripura: "TR",
  meghalaya: "ML",
  manipur: "MN",
  nagaland: "NL",
  mizoram: "MZ",
  "arunachal pradesh": "AR",
  sikkim: "SK",
  ladakh: "LA",
  puducherry: "PY",
  pondicherry: "PY",
};

// Known Organization and Commission Keywords / Acronyms
const KNOWN_ORGANIZATIONS = [
  "upsc",
  "ssc",
  "ibps",
  "rrb",
  "nta",
  "drdo",
  "isro",
  "bpsc",
  "uppsc",
  "rpsc",
  "mppsc",
  "kpsc",
  "wbpsc",
  "sbi",
  "rbi",
  "nabard",
  "lic",
  "epfo",
  "sebi",
  "fci",
  "dsssb",
  "hssc",
  "tspsc",
  "appsc",
  "gpsc",
  "opsc",
  "bssc",
  "csbc",
  "bpssc",
  "upsssc",
  "upprpb",
  "rsmssb",
  "mpesb",
  "vyapam",
  "jeevika",
  "shsb",
  "up-nhm",
  "bsphcl",
  "uppcl",
  "dlrs",
  "kvs",
  "nvs",
  "aai",
  "ongc",
  "ntpc",
  "bhel",
  "sci",
  "ecourts",
  "railway",
  "railways",
  "police",
  "army",
  "navy",
  "airforce",
  "aiims",
  "cbse",
  "ugc",
  "csir",
  "icar",
  "iit",
  "nit",
  "patna high court",
  "allahabad high court",
  "delhi high court",
  "supreme court",
  "high court",
  "district court",
];

// Sector and Category Synonyms Mapping to standard category slugs
const CATEGORY_SYNONYMS: Record<string, string> = {
  banking: "banking-finance",
  bank: "banking-finance",
  banks: "banking-finance",
  finance: "banking-finance",
  financial: "banking-finance",
  ibps: "banking-finance",
  sbi: "banking-finance",
  rbi: "banking-finance",

  teaching: "teaching-research",
  teacher: "teaching-research",
  teachers: "teaching-research",
  professor: "teaching-research",
  professors: "teaching-research",
  lecturer: "teaching-research",
  lecturers: "teaching-research",
  faculty: "teaching-research",
  kvs: "teaching-research",
  nvs: "teaching-research",
  prt: "teaching-research",
  tgt: "teaching-research",
  pgt: "teaching-research",
  bed: "teaching-research",
  "b.ed": "teaching-research",
  ctet: "teaching-research",
  tet: "teaching-research",
  school: "teaching-research",
  education: "teaching-research",

  defence: "defence-police",
  defense: "defence-police",
  police: "defence-police",
  csbc: "defence-police",
  bpssc: "defence-police",
  upprpb: "defence-police",
  army: "defence-police",
  navy: "defence-police",
  airforce: "defence-police",
  constable: "defence-police",
  constables: "defence-police",
  daroga: "defence-police",
  si: "defence-police",
  inspector: "defence-police",
  capf: "defence-police",
  nda: "defence-police",
  cds: "defence-police",
  afcat: "defence-police",
  paramilitary: "defence-police",

  railway: "railways",
  railways: "railways",
  rrb: "railways",
  alp: "railways",
  "loco pilot": "railways",
  "group d": "railways",
  metro: "railways",

  engineering: "engineering-technical",
  engineer: "engineering-technical",
  engineers: "engineering-technical",
  technical: "engineering-technical",
  bsphcl: "engineering-technical",
  uppcl: "engineering-technical",
  ongc: "engineering-technical",
  aai: "engineering-technical",
  bhel: "engineering-technical",
  je: "engineering-technical",
  ae: "engineering-technical",
  diploma: "engineering-technical",
  btech: "engineering-technical",
  gate: "engineering-technical",
  ese: "engineering-technical",

  medical: "medical-healthcare",
  nurse: "medical-healthcare",
  nursing: "medical-healthcare",
  doctor: "medical-healthcare",
  doctors: "medical-healthcare",
  aiims: "medical-healthcare",
  shsb: "medical-healthcare",
  nhm: "medical-healthcare",
  cho: "medical-healthcare",
  anm: "medical-healthcare",
  mbbs: "medical-healthcare",
  pharmacist: "medical-healthcare",
  health: "medical-healthcare",
  healthcare: "medical-healthcare",

  "civil services": "civil-services",
  "civil service": "civil-services",
  ias: "civil-services",
  ips: "civil-services",
  ifs: "civil-services",
  upsc: "civil-services",
  administrative: "civil-services",

  judiciary: "judiciary-law",
  court: "judiciary-law",
  courts: "judiciary-law",
  judge: "judiciary-law",
  law: "judiciary-law",
  legal: "judiciary-law",
  clat: "judiciary-law",
  advocate: "judiciary-law",
  sci: "judiciary-law",
  ecourts: "judiciary-law",
  "high court": "judiciary-law",
  "district court": "judiciary-law",

  agriculture: "agriculture-rural",
  agri: "agriculture-rural",
  farming: "agriculture-rural",
  krishi: "agriculture-rural",
  jeevika: "agriculture-rural",
  brlps: "agriculture-rural",
  rural: "agriculture-rural",

  postal: "postal-telecom",
  post: "postal-telecom",
  "post office": "postal-telecom",
  gds: "postal-telecom",
  dak: "postal-telecom",

  lekhpal: "state-govt",
  patwari: "state-govt",
  amin: "state-govt",
  bssc: "state-govt",
  upsssc: "state-govt",
  rsmssb: "state-govt",
  mpesb: "state-govt",
  hssc: "state-govt",
  dsssb: "state-govt",
  fci: "central-govt",
};

// Generic stop words / domain qualifiers in Indian government recruitment context
const DOMAIN_STOPWORDS = new Set([
  "govt",
  "government",
  "job",
  "jobs",
  "vacancy",
  "vacancies",
  "recruitment",
  "recruitments",
  "post",
  "posts",
  "exam",
  "exams",
  "examination",
  "examinations",
  "news",
  "notice",
  "notices",
  "notification",
  "notifications",
  "bulletin",
  "bulletins",
  "latest",
  "new",
  "official",
  "form",
  "forms",
  "online",
  "apply",
  "admit",
  "card",
  "cards",
  "result",
  "results",
  "update",
  "updates",
  "alert",
  "alerts",
  "portal",
  "2024",
  "2025",
  "2026",
  "in",
  "for",
  "of",
  "and",
  "the",
  "all",
  "at",
  "to",
  "a",
  "an",
]);

/**
 * Parses, tokenizes, and extracts domain entities from a raw natural search query.
 */
export function parseSearchQuery(rawQuery?: string): ParsedSearchQuery {
  if (!rawQuery || !rawQuery.trim()) {
    return {
      rawQuery: "",
      cleanQuery: "",
      tokens: [],
      contentTokens: [],
      matchedStateCodes: [],
      matchedOrgKeywords: [],
      matchedCategorySlugs: [],
      isJobIntent: false,
      isExamIntent: false,
      isNewsIntent: false,
    };
  }

  const cleanQuery = rawQuery
    .replace(/[^\w\s\-\.\,\(\)]/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

  const lowerQuery = cleanQuery.toLowerCase();

  // Split into word tokens (min length 2 characters unless specific short codes)
  const rawTokens = lowerQuery
    .split(/[\s,\(\)\-]+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 0);

  const matchedStateCodes = new Set<string>();
  const matchedOrgKeywords = new Set<string>();
  const matchedCategorySlugs = new Set<string>();

  // 1. Check multi-word state aliases (e.g. "Uttar Pradesh", "West Bengal", "Madhya Pradesh")
  for (const [stateName, code] of Object.entries(STATE_ALIASES)) {
    if (stateName.includes(" ") && lowerQuery.includes(stateName)) {
      matchedStateCodes.add(code);
    }
  }

  // 2. Check multi-word category phrases (e.g. "civil services", "loco pilot", "post office")
  for (const [phrase, catSlug] of Object.entries(CATEGORY_SYNONYMS)) {
    if (phrase.includes(" ") && lowerQuery.includes(phrase)) {
      matchedCategorySlugs.add(catSlug);
    }
  }

  // 3. Check known multi-word organizations (e.g. "patna high court", "supreme court")
  for (const org of KNOWN_ORGANIZATIONS) {
    if (org.includes(" ") && lowerQuery.includes(org)) {
      matchedOrgKeywords.add(org);
    }
  }

  // 4. Token-level matching
  const tokens: string[] = [];
  const contentTokens: string[] = [];

  for (const token of rawTokens) {
    if (token.length < 2 && !["br", "up", "mp", "dl", "wb", "ap", "ts", "hp", "jk", "uk", "tn", "kl"].includes(token)) {
      continue;
    }

    tokens.push(token);

    // Check single-word state alias
    if (STATE_ALIASES[token]) {
      matchedStateCodes.add(STATE_ALIASES[token]);
    }

    // Check single-word category synonym
    if (CATEGORY_SYNONYMS[token]) {
      matchedCategorySlugs.add(CATEGORY_SYNONYMS[token]);
    }

    // Check known organizations
    if (KNOWN_ORGANIZATIONS.includes(token)) {
      matchedOrgKeywords.add(token);
    }

    // Content tokens (strip pure generic stopwords if there are other terms)
    if (!DOMAIN_STOPWORDS.has(token)) {
      contentTokens.push(token);
    }
  }

  // If all tokens were stopwords (e.g. query was just "Govt Jobs"), keep the tokens so search doesn't collapse
  const finalContentTokens = contentTokens.length > 0 ? contentTokens : tokens;

  // Domain Intent Detection
  const isJobIntent =
    lowerQuery.includes("job") ||
    lowerQuery.includes("recruitment") ||
    lowerQuery.includes("vacancy") ||
    lowerQuery.includes("post") ||
    lowerQuery.includes("salary");

  const isExamIntent =
    lowerQuery.includes("exam") ||
    lowerQuery.includes("syllabus") ||
    lowerQuery.includes("pattern") ||
    lowerQuery.includes("stage") ||
    lowerQuery.includes("schedule") ||
    lowerQuery.includes("admit card");

  const isNewsIntent =
    lowerQuery.includes("news") ||
    lowerQuery.includes("bulletin") ||
    lowerQuery.includes("advisory") ||
    lowerQuery.includes("digest") ||
    lowerQuery.includes("rozgar samachar") ||
    lowerQuery.includes("stay order") ||
    lowerQuery.includes("court");

  return {
    rawQuery,
    cleanQuery,
    tokens,
    contentTokens: finalContentTokens,
    matchedStateCodes: Array.from(matchedStateCodes),
    matchedOrgKeywords: Array.from(matchedOrgKeywords),
    matchedCategorySlugs: Array.from(matchedCategorySlugs),
    isJobIntent,
    isExamIntent,
    isNewsIntent,
  };
}
