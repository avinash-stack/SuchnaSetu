import { createAdminClient } from "@/lib/supabase/admin";
import { LanguageCode } from "@/lib/i18n/config";
import { GovJobDetailed } from "@/modules/jobs/types";
import { NewsArticle, NewsTranslation } from "@/modules/news/types/article";
import { GovJobTranslation, resolveLocalizedJob } from "@/lib/i18n/localize";
import {
  translateTextWithGoogle,
  clearTranslationCache,
  getTranslationCacheStats,
} from "./google-translate-engine";
import { TranslationInputItem, TranslatedOutputItem, TranslationBatchResult } from "./types";

export { translateTextWithGoogle, clearTranslationCache, getTranslationCacheStats };

/**
 * Translates and caches a Government Job Notice between English and Hindi using Google Translate.
 * Translates title, post name, summary, description, qualification, age limit, pay scale, and selection process.
 */
export async function translateJobNotice(
  job: GovJobDetailed,
  targetLang: "hi" | "en" = "hi"
): Promise<{
  job: GovJobDetailed;
  translation: GovJobTranslation | null;
  isTranslated: boolean;
}> {
  if (!job) {
    return { job, translation: null, isTranslated: false };
  }

  if (targetLang === "en") {
    return {
      job: resolveLocalizedJob(job, "en"),
      translation: null,
      isTranslated: false,
    };
  }

  const isGenuineHindi = (t?: string | null) => Boolean(t && /[\u0900-\u097F]/.test(t));

  // 1. Check existing translations attached to the job object
  const existingAttached = Array.isArray(job.translations)
    ? job.translations.find((t: any) => t.language_code === targetLang)
    : null;

  if (existingAttached && isGenuineHindi(existingAttached.title)) {
    return {
      job: resolveLocalizedJob(job, targetLang),
      translation: existingAttached as GovJobTranslation,
      isTranslated: true,
    };
  }

  // 2. Check Supabase DB for cached translation
  try {
    const supabase = createAdminClient();
    const { data: dbTranslation } = await (supabase as any)
      .from("gov_job_translations")
      .select("*")
      .eq("job_id", job.id)
      .eq("language_code", targetLang)
      .maybeSingle();

    if (dbTranslation && isGenuineHindi(dbTranslation.title)) {
      const updatedJob = {
        ...job,
        translations: [...(job.translations || []), dbTranslation],
      };
      return {
        job: resolveLocalizedJob(updatedJob, targetLang),
        translation: dbTranslation as GovJobTranslation,
        isTranslated: true,
      };
    }
  } catch (err: any) {
    console.warn(`[Job Translation DB Cache Check Warning]: ${err.message}`);
  }

  // 3. Translate all non-empty fields using Google Translate Engine
  try {
    const [
      translatedTitle,
      translatedPostName,
      translatedSummary,
      translatedDescription,
      translatedQual,
      translatedAge,
      translatedPay,
      translatedSelection,
    ] = await Promise.all([
      translateTextWithGoogle(job.title, targetLang),
      job.post_name ? translateTextWithGoogle(job.post_name, targetLang) : Promise.resolve(null),
      job.summary ? translateTextWithGoogle(job.summary, targetLang) : Promise.resolve(null),
      job.description ? translateTextWithGoogle(job.description, targetLang) : Promise.resolve(null),
      job.qualification_summary ? translateTextWithGoogle(job.qualification_summary, targetLang) : Promise.resolve(null),
      job.age_limit_summary ? translateTextWithGoogle(job.age_limit_summary, targetLang) : Promise.resolve(null),
      job.pay_scale_details ? translateTextWithGoogle(job.pay_scale_details, targetLang) : Promise.resolve(null),
      job.selection_process ? translateTextWithGoogle(job.selection_process, targetLang) : Promise.resolve(null),
    ]);

    const newTranslation: GovJobTranslation = {
      id: `${job.id}-${targetLang}`,
      job_id: job.id,
      language_code: targetLang,
      title: translatedTitle || job.title,
      post_name: translatedPostName || job.post_name,
      summary: translatedSummary || job.summary,
      description: translatedDescription || job.description,
      qualification_summary: translatedQual || job.qualification_summary,
      age_limit_summary: translatedAge || job.age_limit_summary,
      pay_scale_summary: translatedPay || job.pay_scale_details,
      selection_process: translatedSelection || job.selection_process,
    };

    // 4. Persist to Supabase DB asynchronously so future page views are instant
    try {
      const supabase = createAdminClient();
      await (supabase as any).from("gov_job_translations").upsert(
        {
          job_id: job.id,
          language_code: targetLang,
          title: newTranslation.title,
          post_name: newTranslation.post_name,
          qualification_summary: newTranslation.qualification_summary,
          age_limit_summary: newTranslation.age_limit_summary,
          pay_scale_summary: newTranslation.pay_scale_summary,
          selection_process: newTranslation.selection_process,
          description: newTranslation.description,
          summary: newTranslation.summary,
          is_verified: true,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "job_id,language_code" }
      );
    } catch (saveErr: any) {
      console.warn(`[Job Translation DB Save Warning]: ${saveErr.message}`);
    }

    const updatedJob = {
      ...job,
      translations: [...(job.translations || []), newTranslation],
    };

    return {
      job: resolveLocalizedJob(updatedJob, targetLang),
      translation: newTranslation,
      isTranslated: true,
    };
  } catch (err: any) {
    console.warn(`[Job Translation Engine Error]: ${err.message}. Retaining English.`);
    return {
      job: resolveLocalizedJob(job, "en"),
      translation: null,
      isTranslated: false,
    };
  }
}

/**
 * Translates and caches a News Article between English and Hindi using Google Translate.
 * Translates headline, summary, and full multi-paragraph article body.
 */
export async function translateNewsArticle(
  article: NewsArticle,
  targetLang: "hi" | "en" = "hi"
): Promise<{
  article: NewsArticle;
  translation: NewsTranslation | null;
  isTranslated: boolean;
}> {
  if (!article) {
    return { article, translation: null, isTranslated: false };
  }

  if (targetLang === "en") {
    return { article, translation: null, isTranslated: false };
  }

  const isGenuineHindi = (t?: string | null) => Boolean(t && /[\u0900-\u097F]/.test(t));

  // 1. Check existing translations attached to the article
  const existingAttached = Array.isArray(article.translations)
    ? article.translations.find((t) => t.language_code === targetLang)
    : null;

  if (existingAttached && isGenuineHindi(existingAttached.title) && isGenuineHindi(existingAttached.summary)) {
    return {
      article: {
        ...article,
        title: existingAttached.title,
        summary: existingAttached.summary,
        content: existingAttached.content || article.content,
      },
      translation: existingAttached,
      isTranslated: true,
    };
  }

  // 2. Check Supabase DB for cached translation
  try {
    const supabase = createAdminClient();
    const { data: dbTranslation } = await (supabase as any)
      .from("news_translations")
      .select("*")
      .eq("article_id", article.id)
      .eq("language_code", targetLang)
      .maybeSingle();

    if (dbTranslation && isGenuineHindi(dbTranslation.title) && isGenuineHindi(dbTranslation.summary)) {
      return {
        article: {
          ...article,
          title: dbTranslation.title,
          summary: dbTranslation.summary,
          content: dbTranslation.content || article.content,
        },
        translation: dbTranslation as NewsTranslation,
        isTranslated: true,
      };
    }
  } catch (err: any) {
    console.warn(`[News Translation DB Cache Check Warning]: ${err.message}`);
  }

  // 3. Translate full content via Google Translate Engine
  try {
    const [translatedTitle, translatedSummary, translatedContent] = await Promise.all([
      translateTextWithGoogle(article.title, targetLang),
      translateTextWithGoogle(article.summary, targetLang),
      article.content ? translateTextWithGoogle(article.content, targetLang) : Promise.resolve(null),
    ]);

    const newTranslation: NewsTranslation = {
      id: `${article.id}-${targetLang}`,
      article_id: article.id,
      language_code: targetLang,
      title: translatedTitle || article.title,
      summary: translatedSummary || article.summary,
      content: translatedContent || article.content || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // 4. Persist to Supabase DB asynchronously
    try {
      const supabase = createAdminClient();
      await (supabase as any).from("news_translations").upsert(
        {
          article_id: article.id,
          language_code: targetLang,
          title: newTranslation.title,
          summary: newTranslation.summary,
          content: newTranslation.content,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "article_id,language_code" }
      );
    } catch (saveErr: any) {
      console.warn(`[News Translation DB Save Warning]: ${saveErr.message}`);
    }

    return {
      article: {
        ...article,
        title: newTranslation.title,
        summary: newTranslation.summary,
        content: newTranslation.content || article.content,
      },
      translation: newTranslation,
      isTranslated: true,
    };
  } catch (err: any) {
    console.warn(`[News Translation Engine Error]: ${err.message}. Retaining English.`);
    return {
      article,
      translation: null,
      isTranslated: false,
    };
  }
}

/**
 * Backward-compatible helper for News Portal:
 * Resolves or fetches on-demand translation for a detailed news article.
 */
export async function getOrTranslateNewsArticle<T extends NewsArticle>(
  article: T,
  targetLang: "en" | "hi" = "en"
): Promise<{
  article: T;
  isTranslated: boolean;
  originalLang: "en" | "hi";
  targetLang: "en" | "hi";
}> {
  if (targetLang === "en") {
    return {
      article,
      isTranslated: false,
      originalLang: "en",
      targetLang: "en",
    };
  }

  const { article: translatedArticle, isTranslated } = await translateNewsArticle(article, "hi");
  return {
    article: translatedArticle as T,
    isTranslated,
    originalLang: "en",
    targetLang: "hi",
  };
}

/**
 * Translates a batch of items into the target language using Google Translate Engine
 * (Zero Groq/LLM calls).
 */
export async function translateContentBatch(
  items: TranslationInputItem[],
  targetLang: LanguageCode
): Promise<TranslatedOutputItem[]> {
  if (!items || items.length === 0 || targetLang === "en") {
    return [];
  }

  const results: TranslatedOutputItem[] = [];

  for (const item of items) {
    try {
      const [
        title,
        post_name,
        summary,
        description,
        qualification_summary,
        age_limit_summary,
        pay_scale_summary,
        selection_process,
      ] = await Promise.all([
        translateTextWithGoogle(item.title, targetLang),
        item.post_name ? translateTextWithGoogle(item.post_name, targetLang) : Promise.resolve(null),
        item.summary ? translateTextWithGoogle(item.summary, targetLang) : Promise.resolve(null),
        item.description ? translateTextWithGoogle(item.description, targetLang) : Promise.resolve(null),
        item.qualification_summary ? translateTextWithGoogle(item.qualification_summary, targetLang) : Promise.resolve(null),
        item.age_limit_summary ? translateTextWithGoogle(item.age_limit_summary, targetLang) : Promise.resolve(null),
        item.pay_scale_summary ? translateTextWithGoogle(item.pay_scale_summary, targetLang) : Promise.resolve(null),
        item.selection_process ? translateTextWithGoogle(item.selection_process, targetLang) : Promise.resolve(null),
      ]);

      results.push({
        id: item.id,
        language_code: targetLang,
        title: title || item.title,
        post_name: post_name || item.post_name || null,
        summary: summary || item.summary || null,
        description: description || item.description || null,
        qualification_summary: qualification_summary || item.qualification_summary || null,
        age_limit_summary: age_limit_summary || item.age_limit_summary || null,
        pay_scale_summary: pay_scale_summary || item.pay_scale_summary || null,
        selection_process: selection_process || item.selection_process || null,
        short_title: item.short_title || null,
        eligibility_summary: item.eligibility_summary || null,
        meta_title: null,
        meta_description: null,
      });
    } catch (err: any) {
      console.warn(`[Batch Translation Item Error for ${item.id}]:`, err.message);
    }
  }

  return results;
}

/**
 * Persists translated output items directly into Supabase translation tables
 */
export async function persistTranslations(
  translations: TranslatedOutputItem[],
  type: "job" | "exam" | "bulletin"
): Promise<TranslationBatchResult> {
  const result: TranslationBatchResult = {
    total: translations.length,
    successful: 0,
    failed: 0,
    errors: [],
  };

  if (translations.length === 0) return result;

  const supabase = createAdminClient() as any;

  for (const item of translations) {
    try {
      if (type === "job") {
        const { error } = await supabase.from("gov_job_translations").upsert(
          {
            job_id: item.id,
            language_code: item.language_code,
            title: item.title,
            post_name: item.post_name,
            qualification_summary: item.qualification_summary,
            age_limit_summary: item.age_limit_summary,
            pay_scale_summary: item.pay_scale_summary,
            selection_process: item.selection_process,
            description: item.description,
            summary: item.summary,
            is_verified: true,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "job_id,language_code" }
        );

        if (error) throw error;
        result.successful++;
      } else if (type === "exam") {
        const { error } = await supabase.from("gov_exam_translations").upsert(
          {
            exam_id: item.id,
            language_code: item.language_code,
            title: item.title,
            short_title: item.short_title,
            description: item.description,
            eligibility_summary: item.eligibility_summary,
            is_verified: true,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "exam_id,language_code" }
        );

        if (error) throw error;
        result.successful++;
      } else if (type === "bulletin") {
        const { error } = await supabase.from("bulletin_translations").upsert(
          {
            bulletin_id: item.id,
            language_code: item.language_code,
            title: item.title,
            summary: item.summary,
            content: item.content,
            is_verified: true,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "bulletin_id,language_code" }
        );

        if (error) throw error;
        result.successful++;
      }
    } catch (err: any) {
      result.failed++;
      result.errors.push(`Failed to save ${type} ${item.id}: ${err.message}`);
    }
  }

  return result;
}
