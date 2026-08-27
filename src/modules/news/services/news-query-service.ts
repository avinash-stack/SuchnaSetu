import {
  getNewsArticles,
  getTopStories,
  getNewsArticleBySlug,
  getRelatedNewsArticles,
} from "../repositories/article-repository";
import { getActiveNewsCategories, getNewsCategoryBySlug } from "../repositories/category-repository";
import { NewsArticle, NewsArticleDetailed, NewsFilterParams } from "../types/article";
import { NewsCategory } from "../types/category";
import { ArticleContentExtractor } from "./article-content-extractor";
import { createAdminClient } from "@/lib/supabase/admin";

export async function fetchNewsFeed(
  filter: NewsFilterParams = {}
): Promise<{ articles: NewsArticle[]; total: number; totalPages: number }> {
  return getNewsArticles(filter);
}

export async function fetchTopStories(limit = 7): Promise<NewsArticle[]> {
  return getTopStories(limit);
}

export async function fetchArticleBySlug(slug: string): Promise<NewsArticleDetailed | null> {
  const article = await getNewsArticleBySlug(slug);
  if (!article) return null;

  // If article has minimal/empty content, extract full text on demand and update DB
  const currentContent = article.content || "";
  if (currentContent.length < 250 && article.source_url) {
    try {
      const extracted = await ArticleContentExtractor.extractFullContent(article.source_url);
      if (extracted && extracted.length > 200) {
        article.content = extracted;

        // Persist to DB in background
        try {
          const supabase = createAdminClient();
          await (supabase as any)
            .from("news_articles")
            .update({
              content: extracted,
              updated_at: new Date().toISOString(),
            })
            .eq("id", article.id);
        } catch {
          // Continue gracefully
        }
      }
    } catch {
      // Continue gracefully
    }
  }

  return article;
}

export async function fetchRelatedArticles(
  articleId: string,
  categorySlug: string,
  limit = 4
): Promise<NewsArticle[]> {
  return getRelatedNewsArticles(articleId, categorySlug, limit);
}

export async function fetchCategoryList(): Promise<NewsCategory[]> {
  return getActiveNewsCategories();
}

export async function fetchCategoryBySlug(slug: string): Promise<NewsCategory | null> {
  return getNewsCategoryBySlug(slug);
}

export { resolveLocalizedNewsArticle } from "../utils/localize";
