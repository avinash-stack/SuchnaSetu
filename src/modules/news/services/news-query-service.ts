import { cache } from "react";
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

/**
 * Resolves a news article by slug with React per-request deduplication cache.
 * STRICTLY reads pre-ingested content from database; does NOT trigger on-demand scraping,
 * LLM generation, or runtime image generation during SSR user requests.
 */
export const resolveArticleBySlug = cache(
  async (slug: string): Promise<NewsResolutionServiceResult> => {
    const result = await resolveNewsArticleSlug(slug);
    if (result.type === "cross_module_redirect") {
      return result;
    }
    if (result.type === "not_found" || !result.article) {
      return { type: "not_found" };
    }

    const article = { ...result.article };

    // Attach contextual related jobs and related exams
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
);

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
