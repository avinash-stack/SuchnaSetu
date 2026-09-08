import { detectArticleLanguage } from "../utils/language";
import { NewsArticle, NewsTranslation } from "../types/article";
import {
  translateNewsArticle,
  getOrTranslateNewsArticle,
  translateTextWithGoogle,
} from "@/modules/translation/service";

export { detectArticleLanguage, getOrTranslateNewsArticle, translateTextWithGoogle };

/**
 * Translates and caches a news article between English and Hindi using the shared Google Translate service.
 * Translates full content, headline, and summary.
 */
export async function translateAndCacheNewsArticle(
  article: NewsArticle,
  targetLang: "hi" | "en" = "hi"
): Promise<NewsTranslation | null> {
  const result = await translateNewsArticle(article, targetLang);
  return result.translation;
}
