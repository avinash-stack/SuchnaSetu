import { createAdminClient } from "@/lib/supabase/admin";
import { NewsArticle, NewsTranslation } from "../types/article";
import { detectArticleLanguage } from "../utils/language";

export { detectArticleLanguage };

/**
 * Translates text reliably using Google Translate API with chunking and timeout protection.
 */
async function translateWithGoogle(text: string, targetLang: "hi" | "en"): Promise<string> {
  if (!text || text.trim().length === 0) return text;

  // Split into paragraphs to preserve structure and prevent query length truncation
  const paragraphs = text.split(/\n\s*\n/);
  const translatedParas: string[] = [];

  for (const para of paragraphs) {
    const trimmed = para.trim();
    if (!trimmed) {
      translatedParas.push("");
      continue;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(trimmed)}`;
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && Array.isArray(data[0])) {
          const translated = data[0].map((item: any) => (item && item[0] ? item[0] : "")).join("");
          translatedParas.push(translated || trimmed);
        } else {
          translatedParas.push(trimmed);
        }
      } else {
        translatedParas.push(trimmed);
      }
    } catch {
      translatedParas.push(trimmed);
    }
  }

  return translatedParas.join("\n\n");
}

/**
 * Translates and caches a news article between English and Hindi using Google Translate.
 * Translates full content, headline, and summary.
 */
export async function translateAndCacheNewsArticle(
  article: NewsArticle,
  targetLang: "hi" | "en" = "hi"
): Promise<NewsTranslation | null> {
  const sourceLang = detectArticleLanguage(article.title + " " + article.summary);

  // If the target language is identical to the source language, return as-is
  if (sourceLang === targetLang) {
    return {
      id: `${article.id}-${targetLang}`,
      article_id: article.id,
      language_code: targetLang,
      title: article.title,
      summary: article.summary,
      content: article.content || null,
      created_at: article.created_at || new Date().toISOString(),
      updated_at: article.updated_at || new Date().toISOString(),
    };
  }

  // 1. Check existing translations in DB
  try {
    const supabase = createAdminClient();
    const { data: existing } = await (supabase as any)
      .from("news_translations")
      .select("*")
      .eq("article_id", article.id)
      .eq("language_code", targetLang)
      .maybeSingle();

    if (existing && existing.title && existing.summary) {
      return existing as NewsTranslation;
    }
  } catch (err) {
    console.warn("Could not check cached news translation:", err);
  }

  // 2. Translate full content via Google Translate
  try {
    const [title, summary, content] = await Promise.all([
      translateWithGoogle(article.title, targetLang),
      translateWithGoogle(article.summary, targetLang),
      article.content ? translateWithGoogle(article.content, targetLang) : Promise.resolve(null),
    ]);

    if (!title || !summary) return null;

    const supabase = createAdminClient();
    const { data: saved, error } = await (supabase as any)
      .from("news_translations")
      .upsert(
        {
          article_id: article.id,
          language_code: targetLang,
          title,
          summary,
          content: content || null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "article_id,language_code" }
      )
      .select("*")
      .single();

    if (error) {
      console.warn("Failed to persist news translation:", error.message);
      return {
        id: `${article.id}-${targetLang}`,
        article_id: article.id,
        language_code: targetLang,
        title,
        summary,
        content: content || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }

    return saved as NewsTranslation;
  } catch (err) {
    console.warn("Google Translation error:", err);
    return null;
  }
}

/**
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
  const originalLang = detectArticleLanguage(article.title + " " + article.summary);

  // If user requested same language as original source, return original
  if (targetLang === originalLang) {
    return {
      article,
      isTranslated: false,
      originalLang,
      targetLang,
    };
  }

  // Check if translation is already in article.translations
  const matched = article.translations?.find((t) => t.language_code === targetLang);
  if (matched && matched.title && matched.summary) {
    return {
      article: {
        ...article,
        title: matched.title,
        summary: matched.summary,
        content: matched.content || article.content,
      },
      isTranslated: true,
      originalLang,
      targetLang,
    };
  }

  // Otherwise, translate on-demand via Google Translate and cache in DB
  const translation = await translateAndCacheNewsArticle(article, targetLang);
  if (translation) {
    return {
      article: {
        ...article,
        title: translation.title,
        summary: translation.summary,
        content: translation.content || article.content,
      },
      isTranslated: true,
      originalLang,
      targetLang,
    };
  }

  // Fallback to original if translation failed
  return {
    article,
    isTranslated: false,
    originalLang,
    targetLang,
  };
}
