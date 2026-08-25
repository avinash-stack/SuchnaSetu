import { NewsTranslation } from "../types/article";
import { LanguageCode } from "@/lib/i18n/config";

/**
 * Localizes a NewsArticle instance based on requested language.
 * Falls back to canonical English if translation is missing.
 */
export function resolveLocalizedNewsArticle<
  T extends { title: string; summary: string; translations?: NewsTranslation[] }
>(article: T, lang: LanguageCode = "en"): T {
  if (!article || lang === "en" || !lang) return article;

  const translations = article.translations || [];
  const matched = translations.find((t) => t.language_code === lang);

  if (!matched) return article;

  return {
    ...article,
    title: matched.title || article.title,
    summary: matched.summary || article.summary,
    content: (matched as any).content || (article as any).content,
  };
}
