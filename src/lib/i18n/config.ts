export type LanguageCode = "en" | "hi";

export interface LanguageInfo {
  code: LanguageCode;
  name: string;
  nativeName: string;
  script: string;
  fontFamily: string;
  direction: "ltr";
}

export const SUPPORTED_LANGUAGES: Record<LanguageCode, LanguageInfo> = {
  en: {
    code: "en",
    name: "English",
    nativeName: "English",
    script: "Latin",
    fontFamily: "var(--font-inter), sans-serif",
    direction: "ltr",
  },
  hi: {
    code: "hi",
    name: "Hindi",
    nativeName: "हिन्दी",
    script: "Devanagari",
    fontFamily: "var(--font-noto-devanagari), var(--font-inter), sans-serif",
    direction: "ltr",
  },
};

export const DEFAULT_LANGUAGE: LanguageCode = "en";
export const LANGUAGE_COOKIE_NAME = "suchnasetu_lang";
export const LANGUAGE_STORAGE_KEY = "suchnasetu_user_language";
export const LANGUAGE_DISMISSED_SUGGESTION_KEY = "suchnasetu_dismissed_lang_suggestion";

/**
 * State to Regional Language Mapping according to official state languages.
 */
export const STATE_TO_LANGUAGE_MAP: Record<string, LanguageCode> = {
  BR: "hi", // Bihar
  UP: "hi", // Uttar Pradesh
  MP: "hi", // Madhya Pradesh
  RJ: "hi", // Rajasthan
  UK: "hi", // Uttarakhand
  JH: "hi", // Jharkhand
  DL: "hi", // Delhi
  HR: "hi", // Haryana
  HP: "hi", // Himachal Pradesh
  CG: "hi", // Chhattisgarh
};

/**
 * State names dictionary in English.
 */
export const STATE_NAMES: Record<string, string> = {
  BR: "Bihar",
  UP: "Uttar Pradesh",
  MP: "Madhya Pradesh",
  RJ: "Rajasthan",
  UK: "Uttarakhand",
  JH: "Jharkhand",
  DL: "Delhi",
  HR: "Haryana",
  HP: "Himachal Pradesh",
  CG: "Chhattisgarh",
  WB: "West Bengal",
  OR: "Odisha",
  OD: "Odisha",
  AS: "Assam",
  PB: "Punjab",
  MH: "Maharashtra",
  GJ: "Gujarat",
  TN: "Tamil Nadu",
  KA: "Karnataka",
  KL: "Kerala",
  TS: "Telangana",
  AP: "Andhra Pradesh",
};

/**
 * State localized translations for English and Hindi.
 */
export const STATE_TRANSLATIONS: Record<string, Record<LanguageCode, string>> = {
  ALL: {
    en: "All India",
    hi: "अखिल भारतीय (केन्द्रीय)",
  },
  BR: {
    en: "Bihar",
    hi: "बिहार",
  },
  UP: {
    en: "Uttar Pradesh",
    hi: "उत्तर प्रदेश",
  },
  MP: {
    en: "Madhya Pradesh",
    hi: "मध्य प्रदेश",
  },
  RJ: {
    en: "Rajasthan",
    hi: "राजस्थान",
  },
  UK: {
    en: "Uttarakhand",
    hi: "उत्तराखंड",
  },
  JH: {
    en: "Jharkhand",
    hi: "झारखंड",
  },
  DL: {
    en: "Delhi",
    hi: "दिल्ली",
  },
  HR: {
    en: "Haryana",
    hi: "हरियाणा",
  },
  HP: {
    en: "Himachal Pradesh",
    hi: "हिमाचल प्रदेश",
  },
  CG: {
    en: "Chhattisgarh",
    hi: "छत्तीसगढ़",
  },
  WB: {
    en: "West Bengal",
    hi: "पश्चिम बंगाल",
  },
  OR: {
    en: "Odisha",
    hi: "ओडिशा",
  },
  OD: {
    en: "Odisha",
    hi: "ओडिशा",
  },
  AS: {
    en: "Assam",
    hi: "असम",
  },
  PB: {
    en: "Punjab",
    hi: "पंजाब",
  },
  MH: {
    en: "Maharashtra",
    hi: "महाराष्ट्र",
  },
  GJ: {
    en: "Gujarat",
    hi: "गुजरात",
  },
  TN: {
    en: "Tamil Nadu",
    hi: "तमिलनाडु",
  },
  KA: {
    en: "Karnataka",
    hi: "कर्नाटक",
  },
  KL: {
    en: "Kerala",
    hi: "केरल",
  },
  TS: {
    en: "Telangana",
    hi: "तेलंगाना",
  },
  AP: {
    en: "Andhra Pradesh",
    hi: "आंध्र प्रदेश",
  },
};

/**
 * Category localized translations for English and Hindi.
 */
export const CATEGORY_TRANSLATIONS: Record<string, Record<LanguageCode, string>> = {
  "central-govt": {
    en: "Central Govt Jobs",
    hi: "केन्द्रीय सरकारी नौकरियां",
  },
  "state-govt": {
    en: "State Govt Jobs",
    hi: "राज्य सरकारी नौकरियां",
  },
  "psu-jobs": {
    en: "PSU Jobs",
    hi: "सार्वजनिक क्षेत्र उपक्रम (PSU) भर्ती",
  },
  "engineering-technical": {
    en: "Engineering & Technical",
    hi: "इंजीनियरिंग एवं तकनीकी",
  },
  "railway-jobs": {
    en: "Railway Jobs (RRB)",
    hi: "रेलवे भर्ती (RRB)",
  },
  "defence-jobs": {
    en: "Defence & Paramilitary",
    hi: "रक्षा एवं अर्धसैनिक बल",
  },
  "banking-jobs": {
    en: "Banking & Financial",
    hi: "बैंक एवं वित्तीय संस्थान",
  },
  "teaching-jobs": {
    en: "Teaching & Faculty",
    hi: "शिक्षक एवं शैक्षणिक भर्ती",
  },
  "police-jobs": {
    en: "Police & Security",
    hi: "पुलिस एवं सुरक्षा बल",
  },
  "medical-health": {
    en: "Medical & Healthcare",
    hi: "चिकित्सा एवं स्वास्थ्य सेवा",
  },
  "upsc": {
    en: "UPSC Civil Services & Engineering",
    hi: "संघ लोक सेवा आयोग (UPSC)",
  },
  "ssc": {
    en: "SSC Examinations (CGL, CHSL, MTS)",
    hi: "कर्मचारी चयन आयोग (SSC)",
  },
};

/**
 * Important Date localized labels.
 */
export const DATE_LABEL_TRANSLATIONS: Record<string, Record<LanguageCode, string>> = {
  application_start: {
    en: "Application Starts",
    hi: "आवेदन प्रारंभ तिथि",
  },
  application_end: {
    en: "Application Deadline",
    hi: "आवेदन की अंतिम तिथि",
  },
  fee_last_date: {
    en: "Last Date for Fee",
    hi: "शुल्क भुगतान की अंतिम तिथि",
  },
  correction_window: {
    en: "Application Correction",
    hi: "आवेदन सुधार विंडो",
  },
  admit_card_release: {
    en: "Admit Card Release",
    hi: "प्रवेश पत्र जारी",
  },
  exam_date: {
    en: "Exam Date",
    hi: "परीक्षा तिथि",
  },
  answer_key_release: {
    en: "Answer Key Release",
    hi: "उत्तर कुंजी जारी",
  },
  result_declaration: {
    en: "Result Declaration",
    hi: "परीक्षा परिणाम घोषणा",
  },
};

export function getSuggestedLanguageForState(stateCode?: string | null): LanguageCode | null {
  if (!stateCode) return null;
  const upper = stateCode.toUpperCase();
  return STATE_TO_LANGUAGE_MAP[upper] || null;
}

export function getStateDisplayName(stateCode?: string | null): string {
  if (!stateCode) return "All India";
  const upper = stateCode.toUpperCase();
  return STATE_NAMES[upper] || upper;
}

/**
 * Localized state name helper with strict English fallback.
 */
export function getLocalizedStateName(stateCode: string | null | undefined, lang: LanguageCode = DEFAULT_LANGUAGE): string {
  if (!stateCode) return STATE_TRANSLATIONS.ALL[lang] || STATE_TRANSLATIONS.ALL.en;
  const upper = stateCode.toUpperCase();
  const dict = STATE_TRANSLATIONS[upper];
  if (!dict) return STATE_NAMES[upper] || stateCode;
  return dict[lang] || dict.en || STATE_NAMES[upper] || stateCode;
}

/**
 * Localized category name helper with strict English fallback.
 */
export function getLocalizedCategoryName(
  categorySlugOrName: string | null | undefined,
  lang: LanguageCode = DEFAULT_LANGUAGE,
  defaultName?: string
): string {
  if (!categorySlugOrName) return defaultName || "";
  const slug = categorySlugOrName.toLowerCase().replace(/\s+/g, "-");
  const dict = CATEGORY_TRANSLATIONS[slug];
  if (!dict) return defaultName || categorySlugOrName;
  return dict[lang] || dict.en || defaultName || categorySlugOrName;
}

/**
 * Localized important date label helper with strict English fallback.
 */
export function getLocalizedDateLabel(
  dateType: string | null | undefined,
  lang: LanguageCode = DEFAULT_LANGUAGE,
  defaultLabel?: string
): string {
  if (!dateType) return defaultLabel || "";
  const normalizedType = dateType.toLowerCase().replace(/[\s\-]+/g, "_");
  const dict = DATE_LABEL_TRANSLATIONS[normalizedType];
  if (!dict) return defaultLabel || dateType;
  return dict[lang] || dict.en || defaultLabel || dateType;
}
