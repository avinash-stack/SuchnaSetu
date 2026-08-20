import { LanguageCode, DEFAULT_LANGUAGE, getLocalizedCategoryName, getLocalizedStateName, getLocalizedDateLabel } from "./config";
import { GovJobDetailed } from "@/modules/jobs/types";
import { GovExamDetailed } from "@/modules/exams/types";
import { PublicBulletinDetailed } from "@/modules/bulletins/types";

export interface GovJobTranslation {
  id: string;
  job_id: string;
  language_code: string;
  title: string;
  post_name?: string | null;
  qualification_summary?: string | null;
  age_limit_summary?: string | null;
  pay_scale_summary?: string | null;
  selection_process?: string | null;
  description?: string | null;
  fee_details?: Record<string, any> | null;
  meta_title?: string | null;
  meta_description?: string | null;
}

export interface GovExamTranslation {
  id: string;
  exam_id: string;
  language_code: string;
  title: string;
  short_title?: string | null;
  description?: string | null;
  eligibility_summary?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
}

export interface BulletinTranslation {
  id: string;
  bulletin_id: string;
  language_code: string;
  title: string;
  summary?: string | null;
  content?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
}

/**
 * Resolves a localized version of a Government Job notice.
 * Strictly falls back to canonical English for missing translations or fields.
 * Preserves all official URLs, organization identifiers, and legal reference codes.
 */
export function resolveLocalizedJob(
  job: GovJobDetailed,
  lang: LanguageCode = DEFAULT_LANGUAGE
): GovJobDetailed {
  if (!job) return job;

  // Localize taxonomy labels (Category & State)
  const localizedCategory = job.category
    ? {
        ...job.category,
        name: getLocalizedCategoryName(job.category.slug, lang, job.category.name),
      }
    : job.category;

  const localizedState = job.state
    ? {
        ...job.state,
        name: getLocalizedStateName(job.state_code || job.state.code, lang),
      }
    : job.state;

  if (lang === "en" || !lang) {
    return {
      ...job,
      category: localizedCategory,
      state: localizedState,
    };
  }

  // Look for translation matching requested language code
  const translations = (job as any).translations as GovJobTranslation[] | GovJobTranslation | undefined;
  let translation: GovJobTranslation | undefined;

  if (Array.isArray(translations)) {
    translation = translations.find((t) => t.language_code === lang);
  } else if (translations && (translations as GovJobTranslation).language_code === lang) {
    translation = translations as GovJobTranslation;
  }

  if (!translation) {
    return {
      ...job,
      category: localizedCategory,
      state: localizedState,
    };
  }

  // Overlay localized fields while preserving canonical base data
  return {
    ...job,
    title: translation.title || job.title,
    post_name: translation.post_name || job.post_name,
    qualification_summary: translation.qualification_summary || job.qualification_summary,
    age_limit_summary: translation.age_limit_summary || job.age_limit_summary,
    pay_scale_details: translation.pay_scale_summary || job.pay_scale_details,
    selection_process: translation.selection_process || job.selection_process,
    description: translation.description || job.description,
    category: localizedCategory,
    state: localizedState,
  };
}

/**
 * Resolves a localized version of a Government Examination notice.
 * Strictly falls back to canonical English for missing translations.
 */
export function resolveLocalizedExam(
  exam: GovExamDetailed,
  lang: LanguageCode = DEFAULT_LANGUAGE
): GovExamDetailed {
  if (!exam) return exam;

  const localizedCategory = exam.category
    ? {
        ...exam.category,
        name: getLocalizedCategoryName(exam.category.slug, lang, exam.category.name),
      }
    : exam.category;

  const localizedState = exam.state
    ? {
        ...exam.state,
        name: getLocalizedStateName(exam.state_code || exam.state.code, lang),
      }
    : exam.state;

  if (lang === "en" || !lang) {
    return {
      ...exam,
      category: localizedCategory,
      state: localizedState,
    };
  }

  const translations = (exam as any).translations as GovExamTranslation[] | GovExamTranslation | undefined;
  let translation: GovExamTranslation | undefined;

  if (Array.isArray(translations)) {
    translation = translations.find((t) => t.language_code === lang);
  } else if (translations && (translations as GovExamTranslation).language_code === lang) {
    translation = translations as GovExamTranslation;
  }

  if (!translation) {
    return {
      ...exam,
      category: localizedCategory,
      state: localizedState,
    };
  }

  return {
    ...exam,
    title: translation.title || exam.title,
    short_title: translation.short_title || exam.short_title,
    description: translation.description || exam.description,
    eligibility_summary: translation.eligibility_summary || exam.eligibility_summary,
    category: localizedCategory,
    state: localizedState,
  };
}

/**
 * Resolves a localized version of a Public Bulletin / News notice.
 * Strictly falls back to canonical English for missing translations.
 */
export function resolveLocalizedBulletin(
  bulletin: PublicBulletinDetailed,
  lang: LanguageCode = DEFAULT_LANGUAGE
): PublicBulletinDetailed {
  if (!bulletin) return bulletin;

  if (lang === "en" || !lang) {
    return bulletin;
  }

  const translations = (bulletin as any).translations as BulletinTranslation[] | BulletinTranslation | undefined;
  let translation: BulletinTranslation | undefined;

  if (Array.isArray(translations)) {
    translation = translations.find((t) => t.language_code === lang);
  } else if (translations && (translations as BulletinTranslation).language_code === lang) {
    translation = translations as BulletinTranslation;
  }

  if (!translation) {
    return bulletin;
  }

  return {
    ...bulletin,
    title: translation.title || bulletin.title,
    summary: translation.summary || bulletin.summary,
    content: translation.content || bulletin.content,
  };
}
