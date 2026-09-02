import { createPublicClient } from "@/lib/supabase/public";
import { createAdminClient } from "@/lib/supabase/admin";
import { isUuid } from "@/lib/utils";
import { NewsArticle, NewsArticleDetailed, NewsFilterParams } from "../types/article";
import { CANONICAL_NEWS_ARTICLES } from "../constants/seed-articles";

export async function getNewsArticles(
  filter: NewsFilterParams = {}
): Promise<{ articles: NewsArticle[]; total: number; totalPages: number }> {
  try {
    const supabase = createPublicClient();
    const page = filter.page && filter.page > 0 ? filter.page : 1;
    const limit = filter.limit && filter.limit > 0 ? filter.limit : 20;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = (supabase as any)
      .from("news_articles")
      .select("*, translations:news_translations(*)", { count: "exact" })
      .eq("is_published", true);

    if (filter.category && filter.category !== "all") {
      query = query.eq("category_slug", filter.category.toLowerCase());
    }

    if (filter.state && filter.state !== "all") {
      query = query.eq("state_code", filter.state.toUpperCase());
    }

    if (filter.importance) {
      query = query.eq("importance", filter.importance);
    }

    if (filter.search && filter.search.trim()) {
      const searchTerms = filter.search.trim();
      query = query.or(`title.ilike.%${searchTerms}%,summary.ilike.%${searchTerms}%,source_name.ilike.%${searchTerms}%`);
    }

    if (filter.sort === "popular") {
      query = query.order("views_count", { ascending: false });
    } else {
      query = query.order("published_at", { ascending: false });
    }

    const { data, error, count } = await query.range(from, to);

    if (error || !data || data.length === 0) {
      // Graceful fallback to rich canonical news seed
      let filtered = [...CANONICAL_NEWS_ARTICLES];
      if (filter.category && filter.category !== "all") {
        filtered = filtered.filter((a) => a.category_slug === filter.category!.toLowerCase());
      }
      if (filter.state && filter.state !== "all") {
        filtered = filtered.filter((a) => a.state_code?.toUpperCase() === filter.state!.toUpperCase());
      }
      if (filter.search && filter.search.trim()) {
        const q = filter.search.trim().toLowerCase();
        filtered = filtered.filter(
          (a) =>
            a.title.toLowerCase().includes(q) ||
            a.summary.toLowerCase().includes(q) ||
            a.source_name.toLowerCase().includes(q) ||
            (a.tags && a.tags.some((t) => t.toLowerCase().includes(q)))
        );
      }
      const total = filtered.length;
      const paginated = filtered.slice(from, from + limit);
      return {
        articles: paginated,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      };
    }

    const total = count || data.length;
    return {
      articles: data as NewsArticle[],
      total,
      totalPages: Math.ceil(total / limit) || 1,
    };
  } catch (err) {
    let filtered = [...CANONICAL_NEWS_ARTICLES];
    if (filter.category && filter.category !== "all") {
      filtered = filtered.filter((a) => a.category_slug === filter.category!.toLowerCase());
    }
    if (filter.state && filter.state !== "all") {
      filtered = filtered.filter((a) => a.state_code?.toUpperCase() === filter.state!.toUpperCase());
    }
    const limit = filter.limit && filter.limit > 0 ? filter.limit : 20;
    return { articles: filtered.slice(0, limit), total: filtered.length, totalPages: Math.ceil(filtered.length / limit) || 1 };
  }
}

export async function getTopStories(limit = 7): Promise<NewsArticle[]> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await (supabase as any)
      .from("news_articles")
      .select("*, translations:news_translations(*)")
      .eq("is_published", true)
      .order("importance", { ascending: false }) // breaking/high first
      .order("published_at", { ascending: false })
      .limit(limit);

    if (error || !data || data.length === 0) {
      return CANONICAL_NEWS_ARTICLES.slice(0, limit);
    }
    return data as NewsArticle[];
  } catch {
    return CANONICAL_NEWS_ARTICLES.slice(0, limit);
  }
}

export async function getNewsArticleBySlug(slug: string): Promise<NewsArticleDetailed | null> {
  try {
    const supabase = createPublicClient();
    const cleanSlug = decodeURIComponent(slug).trim();

    // 1. Primary lookup: by slug in news_articles
    let { data, error } = await (supabase as any)
      .from("news_articles")
      .select("*, translations:news_translations(*)")
      .eq("slug", cleanSlug)
      .maybeSingle();

    // 2. Secondary fallback: check public_bulletins for legacy bulletin URLs
    if (!data) {
      const { data: bulletin } = await (supabase as any)
        .from("public_bulletins")
        .select("*, organization:organizations(*), translations:bulletin_translations(*)")
        .eq("slug", cleanSlug)
        .eq("status", "published")
        .maybeSingle();

      if (bulletin) {
        return {
          id: bulletin.id,
          slug: bulletin.slug,
          title: bulletin.title,
          summary: bulletin.summary,
          content: bulletin.content,
          source_name: bulletin.source_name,
          source_url: bulletin.source_url,
          canonical_url: bulletin.source_url,
          author: bulletin.author || bulletin.organization?.name || "SuchnaSetu Desk",
          image_url: bulletin.image_url || null,
          image_caption: null,
          category_slug: bulletin.category || "governance",
          subcategory: null,
          state_code: null,
          tags: bulletin.tags || [],
          importance: bulletin.is_breaking ? "breaking" : "standard",
          published_at: bulletin.published_at || bulletin.created_at || new Date().toISOString(),
          created_at: bulletin.created_at || new Date().toISOString(),
          updated_at: bulletin.created_at || new Date().toISOString(),
          views_count: 0,
          is_published: true,
          ai_status: "not_started" as const,
          content_hash: "",
          category: {
            slug: bulletin.category || "governance",
            name: bulletin.category || "Public Notice",
            name_hi: "सार्वजनिक सूचना",
          },
          organization: bulletin.organization || null,
          translations: bulletin.translations || [],
        } as unknown as NewsArticleDetailed;
      }
    }

    // 3. Fallback: only if cleanSlug is a valid UUID, allow ID lookup
    if (!data && isUuid(cleanSlug)) {
      const { data: byId } = await (supabase as any)
        .from("news_articles")
        .select("*, translations:news_translations(*)")
        .eq("id", cleanSlug)
        .maybeSingle();
      if (byId) data = byId;
    }

    if (error || !data) {
      const matched = CANONICAL_NEWS_ARTICLES.find((a) => a.slug === cleanSlug);
      return matched || null;
    }
    return data as NewsArticleDetailed;
  } catch {
    const matched = CANONICAL_NEWS_ARTICLES.find((a) => a.slug === slug);
    return matched || null;
  }
}

export async function getRelatedNewsArticles(
  articleId: string,
  categorySlug: string,
  limit = 4
): Promise<NewsArticle[]> {
  try {
    const supabase = createPublicClient();
    let query = (supabase as any)
      .from("news_articles")
      .select("*, translations:news_translations(*)")
      .eq("is_published", true)
      .eq("category_slug", categorySlug);

    // Guard: Only query .neq("id", articleId) if articleId is a valid UUID
    if (isUuid(articleId)) {
      query = query.neq("id", articleId);
    }

    const { data, error } = await query
      .order("published_at", { ascending: false })
      .limit(limit);

    if (error || !data || data.length === 0) {
      return CANONICAL_NEWS_ARTICLES.filter(
        (a) => a.id !== articleId && (a.category_slug === categorySlug || true)
      ).slice(0, limit);
    }

    // Filter out same article in-memory if non-UUID ID
    const filtered = (data as NewsArticle[]).filter((a) => a.id !== articleId);
    return filtered.slice(0, limit);
  } catch {
    return CANONICAL_NEWS_ARTICLES.filter((a) => a.id !== articleId).slice(0, limit);
  }
}

export async function checkDuplicateArticle(
  contentHash: string,
  sourceUrl: string
): Promise<boolean> {
  try {
    const supabase = createAdminClient();
    const { data } = await (supabase as any)
      .from("news_articles")
      .select("id")
      .or(`content_hash.eq.${contentHash},source_url.eq.${sourceUrl}`)
      .limit(1);

    return !!(data && data.length > 0);
  } catch {
    return false;
  }
}

export async function insertNewsArticle(
  article: Partial<NewsArticle>
): Promise<{ id?: string; error?: string }> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await (supabase as any)
      .from("news_articles")
      .insert({
        slug: article.slug,
        title: article.title,
        summary: article.summary,
        content: article.content || null,
        source_id: article.source_id || null,
        source_name: article.source_name,
        source_url: article.source_url,
        canonical_url: article.canonical_url || article.source_url,
        author: article.author || null,
        image_url: article.image_url || null,
        image_caption: article.image_caption || null,
        category_slug: article.category_slug || "india",
        subcategory: article.subcategory || null,
        state_code: article.state_code || null,
        tags: article.tags || [],
        entities: article.entities || {},
        importance: article.importance || "standard",
        ai_status: article.ai_status || "pending",
        ai_model: article.ai_model || null,
        content_hash: article.content_hash,
        published_at: article.published_at || new Date().toISOString(),
        is_published: true,
        views_count: 0,
      })
      .select("id")
      .single();

    if (error) {
      return { error: error.message };
    }

    return { id: data.id };
  } catch (err: any) {
    return { error: err.message || "Failed to insert news article" };
  }
}

export async function recordIngestionLog(log: {
  sourceId?: string | null;
  status: "success" | "partial" | "failed";
  fetchedCount: number;
  insertedCount: number;
  duplicateCount: number;
  errorMessage?: string | null;
  durationMs: number;
}): Promise<void> {
  try {
    const supabase = createAdminClient();
    await (supabase as any).from("news_ingestion_logs").insert({
      source_id: log.sourceId || null,
      status: log.status,
      fetched_count: log.fetchedCount,
      inserted_count: log.insertedCount,
      duplicate_count: log.duplicateCount,
      error_message: log.errorMessage || null,
      duration_ms: log.durationMs,
    });
  } catch (err) {
    console.warn("Failed to record news ingestion log:", err);
  }
}
