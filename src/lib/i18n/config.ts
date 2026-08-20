export type LanguageCode = "en" | "hi" | "bn" | "or" | "as" | "pa";

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
  bn: {
    code: "bn",
    name: "Bengali",
    nativeName: "বাংলা",
    script: "Bengali",
    fontFamily: "var(--font-noto-bengali), var(--font-inter), sans-serif",
    direction: "ltr",
  },
  or: {
    code: "or",
    name: "Odia",
    nativeName: "ଓଡ଼ିଆ",
    script: "Odia",
    fontFamily: "var(--font-noto-oriya), var(--font-inter), sans-serif",
    direction: "ltr",
  },
  as: {
    code: "as",
    name: "Assamese",
    nativeName: "অসমীয়া",
    script: "Bengali/Assamese",
    fontFamily: "var(--font-noto-bengali), var(--font-inter), sans-serif",
    direction: "ltr",
  },
  pa: {
    code: "pa",
    name: "Punjabi",
    nativeName: "ਪੰਜਾਬੀ",
    script: "Gurmukhi",
    fontFamily: "var(--font-noto-gurmukhi), var(--font-inter), sans-serif",
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
  // Hindi Belt
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

  // Eastern & Regional
  WB: "bn", // West Bengal -> Bengali
  OR: "or", // Odisha -> Odia
  OD: "or", // Odisha alternative code
  AS: "as", // Assam -> Assamese
  PB: "pa", // Punjab -> Punjabi
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
 * State localized translations across all 6 supported languages.
 */
export const STATE_TRANSLATIONS: Record<string, Record<LanguageCode, string>> = {
  ALL: {
    en: "All India",
    hi: "अखिल भारतीय (केन्द्रीय)",
    bn: "সর্বভারতীয় (কেন্দ্রীয়)",
    or: "ସର୍ବଭାରତୀୟ (କେନ୍ଦ୍ରୀୟ)",
    as: "সৰ্বভাৰতীয় (কেন্দ্ৰীয়)",
    pa: "ਆਲ ਇੰਡੀਆ (ਕੇਂਦਰੀ)",
  },
  BR: {
    en: "Bihar",
    hi: "बिहार",
    bn: "বিহার",
    or: "ବିହାର",
    as: "বিহাৰ",
    pa: "ਬਿਹਾਰ",
  },
  UP: {
    en: "Uttar Pradesh",
    hi: "उत्तर प्रदेश",
    bn: "উত্তর প্রদেশ",
    or: "ଉତ୍ତର ପ୍ରଦେଶ",
    as: "উত্তৰ প্ৰদেশ",
    pa: "ਉੱਤਰ ਪ੍ਰਦੇਸ਼",
  },
  WB: {
    en: "West Bengal",
    hi: "पश्चिम बंगाल",
    bn: "পশ্চিমবঙ্গ",
    or: "ପଶ୍ଚିମ ବଙ୍ଗ",
    as: "পশ্চিম বংগ",
    pa: "ਪੱਛਮੀ ਬੰਗਾਲ",
  },
  OR: {
    en: "Odisha",
    hi: "ओडिशा",
    bn: "ওড়িশা",
    or: "ଓଡ଼ିଶା",
    as: "উৰিষ্যা",
    pa: "ਓਡੀਸ਼ਾ",
  },
  OD: {
    en: "Odisha",
    hi: "ओडिशा",
    bn: "ওড়িশা",
    or: "ଓଡ଼ିଶା",
    as: "উৰিষ্যা",
    pa: "ਓਡੀਸ਼ਾ",
  },
  AS: {
    en: "Assam",
    hi: "असम",
    bn: "আসাম",
    or: "ଆସାମ",
    as: "অসম",
    pa: "ਅਸਾਮ",
  },
  PB: {
    en: "Punjab",
    hi: "पंजाब",
    bn: "পাঞ্জাব",
    or: "ପଞ୍ଜାବ",
    as: "পঞ্জাব",
    pa: "ਪੰਜਾਬ",
  },
  RJ: {
    en: "Rajasthan",
    hi: "राजस्थान",
    bn: "রাজস্থান",
    or: "ରାଜସ୍ଥାନ",
    as: "ৰাজস্থান",
    pa: "ਰਾਜਸਥਾਨ",
  },
  MP: {
    en: "Madhya Pradesh",
    hi: "मध्य प्रदेश",
    bn: "মধ্যপ্রদেশ",
    or: "ମଧ୍ୟପ୍ରଦେଶ",
    as: "মধ্যপ্ৰদেশ",
    pa: "ਮੱਧ ਪ੍ਰਦੇਸ਼",
  },
  DL: {
    en: "Delhi",
    hi: "दिल्ली",
    bn: "দিল্লি",
    or: "ଦିଲ୍ଲୀ",
    as: "দিল্লী",
    pa: "ਦਿੱਲੀ",
  },
  HR: {
    en: "Haryana",
    hi: "हरियाणा",
    bn: "হরিয়ানা",
    or: "ହରିୟାଣା",
    as: "হাৰিয়ানা",
    pa: "ਹਰਿਆਣਾ",
  },
  JH: {
    en: "Jharkhand",
    hi: "झारखंड",
    bn: "ঝাড়খণ্ড",
    or: "ଝାଡ଼ଖଣ୍ଡ",
    as: "ঝাৰখণ্ড",
    pa: "ਝਾਰਖੰਡ",
  },
  UK: {
    en: "Uttarakhand",
    hi: "उत्तराखंड",
    bn: "উত্তরাখণ্ড",
    or: "ଉତ୍ତରାଖଣ୍ଡ",
    as: "উত্তৰাখণ্ড",
    pa: "ਉੱਤਰਾਖੰਡ",
  },
};

/**
 * Standard recruitment categories localized across all 6 supported languages.
 */
export const CATEGORY_TRANSLATIONS: Record<string, Record<LanguageCode, string>> = {
  "defence-police": {
    en: "Defence & Police",
    hi: "रक्षा एवं पुलिस",
    bn: "প্রতিরক্ষা ও পুলিশ",
    or: "ପ୍ରତିରକ୍ଷା ଓ ପୋଲିସ",
    as: "প্ৰতিৰক্ষা আৰু আৰক্ষী",
    pa: "ਰੱਖਿਆ ਅਤੇ ਪੁਲਿਸ",
  },
  "banking-finance": {
    en: "Banking & Finance",
    hi: "बैंकिंग एवं वित्त",
    bn: "ব্যাংকিং ও অর্থায়ন",
    or: "ବ୍ୟାଙ୍କିଙ୍ଗ୍ ଓ ଅର୍ଥ",
    as: "বেংকিং আৰু বিত্ত",
    pa: "ਬੈਂਕਿੰਗ ਅਤੇ ਵਿੱਤ",
  },
  railways: {
    en: "Railways",
    hi: "भारतीय रेलवे",
    bn: "রেলওয়ে নিয়োগ",
    or: "ରେଳବାଇ ନିଯୁକ୍ତି",
    as: "ৰে'লৱে নিযুক্তি",
    pa: "ਰੇਲਵੇ ਭਰਤੀ",
  },
  "teaching-research": {
    en: "Teaching & Faculty",
    hi: "शिक्षण एवं प्राध्यापक",
    bn: "শিক্ষকতা ও অনুষদ",
    or: "ଶିକ୍ଷକତା ଓ ଅନୁସନ୍ଧାନ",
    as: "শিক্ষকতা আৰু গৱেষণা",
    pa: "ਅਧਿਆਪਨ ਅਤੇ ਫੈਕਲਟੀ",
  },
  "civil-services": {
    en: "Civil Services",
    hi: "प्रशासनिक एवं सिविल सेवा",
    bn: "প্রশাসনিক ও সিভিল সার্ভিস",
    or: "ପ୍ରଶାସନିକ ଓ ସିଭିଲ ସେବା",
    as: "অসামৰিক সেৱা",
    pa: "ਸਿਵਲ ਸਰਵਿਸਿਜ਼",
  },
  "judiciary-law": {
    en: "Judiciary & Legal",
    hi: "न्यायपालिका एवं कानून",
    bn: "বিচার বিভাগ ও আইন",
    or: "ନ୍ୟାୟପାଳିକା ଓ ଆଇନ",
    as: "ন্যায়পালিক আৰু আইন",
    pa: "ਨਿਆਂਪਾਲਿਕਾ ਅਤੇ ਕਾਨੂੰਨੀ",
  },
  "engineering-technical": {
    en: "Engineering & Technical",
    hi: "इंजीनियरिंग एवं तकनीकी",
    bn: "প্রকৌশল ও কারিগরি",
    or: "ଇଞ୍ଜିନିୟରିଂ ଓ ବୈଷୟିକ",
    as: "ইঞ্জিনিয়াৰিং আৰু কাৰিকৰী",
    pa: "ਇੰਜੀਨੀਅਰਿੰਗ ਅਤੇ ਤਕਨੀਕੀ",
  },
  "medical-healthcare": {
    en: "Medical & Healthcare",
    hi: "चिकित्सा एवं स्वास्थ्य सेवा",
    bn: "চিকিৎসা ও স্বাস্থ্যসেবা",
    or: "ଚିକିତ୍ସା ଓ ସ୍ୱାସ୍ଥ୍ୟସେବା",
    as: "চিকিৎসা আৰু স্বাস্থ্যসেৱা",
    pa: "ਮੈਡੀਕਲ ਅਤੇ ਸਿਹਤ ਸੰਭਾਲ",
  },
  "state-govt": {
    en: "State Subordinate Services",
    hi: "राज्य अधीनस्थ सेवाएं",
    bn: "রাজ্য অধীনস্থ সেবা",
    or: "ରାଜ୍ୟ ଅଧୀନସ୍ଥ ସେବା",
    as: "ৰাজ্যিক অধীনস্থ সেৱা",
    pa: "ਰਾਜ ਅਧੀਨ ਸੇਵਾਵਾਂ",
  },
  "central-govt": {
    en: "Central Ministries & PSUs",
    hi: "केन्द्रीय मंत्रालय एवं उपक्रम",
    bn: "কেন্দ্রীয় মন্ত্রণালয় ও পিএসইউ",
    or: "କେନ୍ଦ୍ରୀୟ ମନ୍ତ୍ରଣାଳୟ ଓ ପିଏସୟୁ",
    as: "কেন্দ্ৰীয় মন্ত্ৰালয় আৰু পিএছইউ",
    pa: "ਕੇਂਦਰੀ ਮੰਤਰਾਲੇ ਅਤੇ ਪੀਐਸਯੂ",
  },
};

/**
 * Standard recruitment date labels localized across all 6 supported languages.
 */
export const DATE_LABEL_TRANSLATIONS: Record<string, Record<LanguageCode, string>> = {
  application_start: {
    en: "Application Start",
    hi: "आवेदन प्रारंभ तिथि",
    bn: "আবেদন শুরুর তারিখ",
    or: "ଆବେଦନ ଆରମ୍ଭ ତାରିଖ",
    as: "আবেদন আৰম্ভৰ তাৰিখ",
    pa: "ਅਰਜ਼ੀ ਸ਼ੁਰੂ ਹੋਣ ਦੀ ਮਿਤੀ",
  },
  application_end: {
    en: "Application Deadline",
    hi: "आवेदन की अंतिम तिथि",
    bn: "আবেদনের শেষ তারিখ",
    or: "ଆବେଦନ ଶେଷ ତାରିଖ",
    as: "আবেদনৰ অন্তিম তাৰিখ",
    pa: "ਅਰਜ਼ੀ ਦੀ ਆਖ਼ਰੀ ਮਿਤੀ",
  },
  fee_payment_end: {
    en: "Fee Payment Last Date",
    hi: "शुल्क भुगतान की अंतिम तिथि",
    bn: "ফি প্রদানের শেষ তারিখ",
    or: "ଫି ଦାଖଲ ଶେଷ ତାରିଖ",
    as: "মাচুল জমা দিয়াৰ অন্তিম তাৰিখ",
    pa: "ਫ਼ੀਸ ਭਰਨ ਦੀ ਆਖ਼ਰੀ ਮਿਤੀ",
  },
  admit_card: {
    en: "Admit Card Release",
    hi: "प्रवेश पत्र जारी होने की तिथि",
    bn: "অ্যাডমিট কার্ড প্রকাশের তারিখ",
    or: "ପ୍ରବେଶ ପତ୍ର ତାରିଖ",
    as: "এডমিট কাৰ্ড প্ৰকাশৰ তাৰিখ",
    pa: "ਐਡਮਿਟ ਕਾਰਡ ਜਾਰੀ ਹੋਣ ਦੀ ਮਿਤੀ",
  },
  exam_start: {
    en: "Examination Date",
    hi: "परीक्षा तिथि",
    bn: "পরীক্ষার তারিখ",
    or: "ପରୀକ୍ଷା ତାରିଖ",
    as: "পৰীক্ষাৰ তাৰিখ",
    pa: "ਪ੍ਰੀਖਿਆ ਦੀ ਮਿਤੀ",
  },
  result_declared: {
    en: "Result Announcement",
    hi: "परिणाम घोषित होने की तिथि",
    bn: "ফলাফল প্রকাশের তারিখ",
    or: "ଫଳାଫଳ ଘୋଷଣା ତାରିଖ",
    as: "ফলাফল ঘোষণাৰ তাৰিখ",
    pa: "ਨਤੀਜਾ ਐਲਾਨਣ ਦੀ ਮਿਤੀ",
  },
};

/**
 * Resolves suggested language for a given state code.
 */
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
