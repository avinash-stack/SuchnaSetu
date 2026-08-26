import { createAdminClient } from "@/lib/supabase/admin";
import { getAiConfig } from "@/modules/ai/config";
import { NewsArticle, NewsTranslation } from "../types/article";
import { detectArticleLanguage } from "../utils/language";

export { detectArticleLanguage };

/**
 * Translates and caches a news article between English and Hindi.
 * Strictly preserves names, numbers, dates, government department names, official designations, and URLs.
 */
export async function translateAndCacheNewsArticle(
  article: NewsArticle,
  targetLang: "hi" | "en" = "hi"
): Promise<NewsTranslation | null> {
  const sourceLang = detectArticleLanguage(article.title + " " + article.summary);

  // If the target language is identical to the source language, no AI translation is required
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

  // 2. Generate on-demand via server-side AI
  const config = getAiConfig();
  if (!config.isEnabled || !config.apiKey) return null;

  const model = process.env.NEWS_AI_MODEL || config.searchModel || "google/gemini-2.5-flash";
  const targetLanguageName = targetLang === "hi" ? "Hindi" : "English";
  const sourceLanguageName = sourceLang === "hi" ? "Hindi" : "English";

  const prompt = `Translate this Indian news story headline and summary from ${sourceLanguageName} into ${targetLanguageName}:
Title: ${article.title}
Summary: ${article.summary}
${article.content ? `Content: ${article.content.slice(0, 1200)}` : ""}

Strict Editorial Rules:
1. Maintain journalistic precision and factual accuracy.
2. DO NOT translate or alter proper nouns, abbreviations (e.g. PIB, ISRO, RBI, UPSC, CSBC, SSC, CBSE, UGC, AIIMS, DRDO, etc.), numbers, dates, official department names, and URLs.
3. DO NOT translate official scheme names (e.g. PM-KISAN, Ayushman Bharat, Digital India).
4. Output valid JSON only with keys: "title", "summary"${article.content ? ', "content"' : ""}.`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 7000);

  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://suchnasetu.in",
        "X-Title": "SuchnaSetu News Translator",
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content: `You are a professional ${targetLanguageName} news translator for SuchnaSetu. Output valid JSON only.`,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        response_format: { type: "json_object" },
        temperature: 0.1,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) return null;

    const data = await res.json();
    const parsed = JSON.parse(data?.choices?.[0]?.message?.content || "{}");

    if (!parsed.title || !parsed.summary) return null;

    const supabase = createAdminClient();
    const { data: saved, error } = await (supabase as any)
      .from("news_translations")
      .upsert(
        {
          article_id: article.id,
          language_code: targetLang,
          title: parsed.title,
          summary: parsed.summary,
          content: parsed.content || null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "article_id,language_code" }
      )
      .select("*")
      .single();

    if (error) {
      console.warn("Failed to persist news translation:", error);
      return {
        id: `${article.id}-${targetLang}`,
        article_id: article.id,
        language_code: targetLang,
        title: parsed.title,
        summary: parsed.summary,
        content: parsed.content || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }

    return saved as NewsTranslation;
  } catch (err) {
    clearTimeout(timeoutId);
    console.warn("News AI translation error:", err);
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

  // Otherwise, translate on-demand and cache in DB
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
