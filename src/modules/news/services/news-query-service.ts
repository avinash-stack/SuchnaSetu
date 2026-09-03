import {
  getNewsArticles,
  getTopStories,
  getNewsArticleBySlug,
  getRelatedNewsArticles,
  resolveNewsArticleSlug,
  NewsResolutionResult,
} from "../repositories/article-repository";
import { getActiveNewsCategories, getNewsCategoryBySlug } from "../repositories/category-repository";
import { NewsArticle, NewsArticleDetailed, NewsFilterParams } from "../types/article";
import { NewsCategory } from "../types/category";
import { ArticleContentExtractor } from "./article-content-extractor";
import { enrichNewsArticleWithAi } from "./ai-enrichment-service";
import { NewsImageGenerator } from "./news-image-generator";
import { createAdminClient } from "@/lib/supabase/admin";
import { createPublicClient } from "@/lib/supabase/public";

export async function fetchNewsFeed(
  filter: NewsFilterParams = {}
): Promise<{ articles: NewsArticle[]; total: number; totalPages: number }> {
  return getNewsArticles(filter);
}

export async function fetchTopStories(limit = 7): Promise<NewsArticle[]> {
  return getTopStories(limit);
}

export type NewsResolutionServiceResult =
  | { type: "found"; article: NewsArticleDetailed; redirectUrl?: string }
  | { type: "cross_module_redirect"; redirectUrl: string }
  | { type: "not_found" };

export async function resolveArticleBySlug(slug: string): Promise<NewsResolutionServiceResult> {
  const result = await resolveNewsArticleSlug(slug);
  if (result.type === "cross_module_redirect") {
    return result;
  }
  if (result.type === "not_found" || !result.article) {
    return { type: "not_found" };
  }

  const article = result.article;

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
        article.content = extracted;

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

  // 3. Attach contextual related jobs and related exams
  try {
    const publicClient = createPublicClient();
    const [jobsRes, examsRes] = await Promise.all([
      (publicClient as any)
        .from("gov_jobs")
        .select("id, slug, title, total_vacancies, application_end_date, state_code, organization:organizations(name, acronym)")
        .eq("status", "published")
        .is("deleted_at", null)
        .order("published_at", { ascending: false })
        .limit(3),
      (publicClient as any)
        .from("gov_exams")
        .select("id, slug, title, mode, exam_code, published_at, organization:organizations(name, acronym)")
        .eq("status", "published")
        .is("deleted_at", null)
        .order("published_at", { ascending: false })
        .limit(3),
    ]);

    article.related_jobs = (jobsRes.data || []) as any[];
    article.related_exams = (examsRes.data || []) as any[];
  } catch {
    article.related_jobs = [];
    article.related_exams = [];
  }

  return {
    type: "found",
    article,
    redirectUrl: result.redirectUrl,
  };
}

export async function fetchArticleBySlug(slug: string): Promise<NewsArticleDetailed | null> {
  const res = await resolveArticleBySlug(slug);
  if (res.type === "found") return res.article;
  return null;
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
