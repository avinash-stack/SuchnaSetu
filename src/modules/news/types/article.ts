export type NewsImportance = "breaking" | "high" | "standard" | "digest";
export type NewsAiStatus = "pending" | "enriched" | "failed" | "skipped";

export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content?: string | null;
  source_id?: string | null;
  source_name: string;
  source_url: string;
  canonical_url?: string | null;
  author?: string | null;
  image_url?: string | null;
  image_caption?: string | null;
  category_slug: string;
  subcategory?: string | null;
  state_code?: string | null;
  tags?: string[] | null;
  entities?: {
    organizations?: string[];
    persons?: string[];
    locations?: string[];
    schemes?: string[];
  } | null;
  importance: NewsImportance;
  ai_status: NewsAiStatus;
  ai_model?: string | null;
  content_hash: string;
  published_at: string;
  is_published: boolean;
  views_count: number;
  created_at: string;
  updated_at: string;
  translations?: NewsTranslation[];
}

export interface NewsTranslation {
  id: string;
  article_id: string;
  language_code: string;
  title: string;
  summary: string;
  content?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface NewsArticleDetailed extends NewsArticle {
  category?: {
    slug: string;
    name: string;
    name_hi?: string;
  } | null;
  source?: {
    id: string;
    name: string;
    website_url: string;
    state_code?: string | null;
  } | null;
  related_articles?: NewsArticle[];
}

export interface NewsFilterParams {
  category?: string;
  state?: string;
  importance?: NewsImportance;
  search?: string;
  page?: number;
  limit?: number;
  sort?: "latest" | "popular" | "importance";
  lang?: "en" | "hi";
}
