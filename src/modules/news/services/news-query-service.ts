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
import { enrichNewsArticleWithAi } from "./ai-enrichment-service";
import { NewsImageGenerator } from "./news-image-generator";
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

  // 1. If article has minimal/empty/duplicate content, extract full text on demand and enrich
  const currentContent = (article.content || "").trim();
  const currentSummary = (article.summary || "").trim();
  const needsExtraction =
    currentContent.length < 250 ||
    currentContent === currentSummary ||
    currentContent.includes("Under the approved regulatory framework");

  if (needsExtraction && article.source_url && !article.source_url.includes("news.google.com")) {
    try {
      const extracted = await ArticleContentExtractor.extractFullContent(article.source_url);
      if (extracted && extracted.length > 150) {
        // Run AI enrichment on the real extracted content
        const enriched = await enrichNewsArticleWithAi({
          title: article.title,
          summary: currentSummary || article.title,
          content: extracted,
          sourceUrl: article.source_url,
          canonicalUrl: article.canonical_url || article.source_url,
          author: article.author || article.source_name,
          publishedAt: article.published_at || new Date().toISOString(),
          categorySlug: article.category_slug,
          stateCode: article.state_code || null,
          tags: article.tags || [],
          rawItem: { title: article.title, link: article.source_url },
        });

        article.content = enriched.content || extracted;
        if (enriched.summary && enriched.summary.length > 20) {
          article.summary = enriched.summary;
        }

        // Persist to DB in background
        try {
          const supabase = createAdminClient();
          await (supabase as any)
            .from("news_articles")
            .update({
              content: article.content,
              summary: article.summary,
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

  // 2. If article has no image, generate and persist a story-specific AI image
  if (!article.image_url || article.image_url.trim().length === 0) {
    try {
      const imageUrl = await NewsImageGenerator.getOrGenerateArticleImage(article);
      if (imageUrl) {
        article.image_url = imageUrl;
      }
    } catch {
      // Continue gracefully without breaking article view
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
