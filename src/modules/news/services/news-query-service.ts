import {
  getNewsArticles,
  getTopStories,
  getNewsArticleBySlug,
  getRelatedNewsArticles,
} from "../repositories/article-repository";
import { getActiveNewsCategories, getNewsCategoryBySlug } from "../repositories/category-repository";
import { NewsArticle, NewsArticleDetailed, NewsFilterParams, NewsTranslation } from "../types/article";
import { NewsCategory } from "../types/category";
import { LanguageCode } from "@/lib/i18n/config";

export async function fetchNewsFeed(
  filter: NewsFilterParams = {}
): Promise<{ articles: NewsArticle[]; total: number; totalPages: number }> {
  return getNewsArticles(filter);
}

export async function fetchTopStories(limit = 7): Promise<NewsArticle[]> {
  return getTopStories(limit);
}

export async function fetchArticleBySlug(slug: string): Promise<NewsArticleDetailed | null> {
  return getNewsArticleBySlug(slug);
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
