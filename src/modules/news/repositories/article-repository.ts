import { createPublicClient } from "@/lib/supabase/public";
import { createAdminClient } from "@/lib/supabase/admin";
import { isUuid } from "@/lib/utils";
import { NewsArticle, NewsArticleDetailed, NewsFilterParams } from "../types/article";
import { CANONICAL_NEWS_ARTICLES } from "../constants/seed-articles";
import { ArticleContentExtractor } from "../services/article-content-extractor";

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

export type NewsResolutionResult =
  | { type: "found"; article: NewsArticleDetailed; redirectUrl?: string }
  | { type: "cross_module_redirect"; redirectUrl: string }
  | { type: "not_found" };

/**
 * Robust multi-tier slug resolution:
 * 1. Exact case-insensitive match (.ilike)
 * 2. Hash variation matching (strips hash or matches prefix)
 * 3. Public bulletins legacy match
 * 4. Cross-module match (Job or Exam slugs accidentally routed to /news/)
 * 5. Title token keyword search
 * 6. UUID lookup
 * 7. Canonical fallback seed articles
 */
export async function resolveNewsArticleSlug(slug: string): Promise<NewsResolutionResult> {
  try {
    const supabase = createPublicClient();
    const rawClean = decodeURIComponent(slug).trim().toLowerCase().replace(/\/+$/, "");
    if (!rawClean) return { type: "not_found" };

    const prepareArticle = (item: any): NewsArticleDetailed => {
      if (item.content) {
        item.content = ArticleContentExtractor.cleanArticleText(item.content) || item.summary;
      }
      if (item.summary) {
        item.summary = ArticleContentExtractor.sanitizeParagraph(item.summary) || item.summary;
      }
      return item as NewsArticleDetailed;
    };

    // 1. Primary lookup: Case-insensitive exact match in news_articles
    let { data: article } = await (supabase as any)
      .from("news_articles")
      .select("*, translations:news_translations(*)")
      .ilike("slug", rawClean)
      .limit(1)
      .maybeSingle();

    if (article) {
      const redirectUrl = article.slug !== slug ? `/news/${article.slug}` : undefined;
      return { type: "found", article: prepareArticle(article), redirectUrl };
    }

    // 2. Hash Variation Matching:
    // If input slug ends with a hash (e.g. "title-foo-bar-1a2b3c" where 1a2b3c is 4-8 hex chars)
    const hashMatch = rawClean.match(/^(.*?)-([a-f0-9]{4,8})$/);
    if (hashMatch) {
      const baseSlug = hashMatch[1];
      const { data: prefixArticles } = await (supabase as any)
        .from("news_articles")
        .select("*, translations:news_translations(*)")
        .ilike("slug", `${baseSlug}-%`)
        .order("published_at", { ascending: false })
        .limit(1);

      if (prefixArticles && prefixArticles.length > 0) {
        const matched = prefixArticles[0];
        return {
          type: "found",
          article: prepareArticle(matched),
          redirectUrl: `/news/${matched.slug}`,
        };
      }
    } else {
      // Input slug did NOT have a hash (e.g. truncated URL or indexed without hash)
      const { data: suffixArticles } = await (supabase as any)
        .from("news_articles")
        .select("*, translations:news_translations(*)")
        .ilike("slug", `${rawClean}-%`)
        .order("published_at", { ascending: false })
        .limit(1);

      if (suffixArticles && suffixArticles.length > 0) {
        const matched = suffixArticles[0];
        return {
          type: "found",
          article: prepareArticle(matched),
          redirectUrl: `/news/${matched.slug}`,
        };
      }
    }

    // 3. Check public_bulletins for legacy bulletin URLs
    const { data: bulletin } = await (supabase as any)
      .from("public_bulletins")
      .select("*, organization:organizations(*), translations:bulletin_translations(*)")
      .ilike("slug", rawClean)
      .eq("status", "published")
      .limit(1)
      .maybeSingle();

    if (bulletin) {
      const converted: NewsArticleDetailed = {
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

      return { type: "found", article: prepareArticle(converted) };
    }

    // 4. Cross-Module Resolution: Check if this slug belongs to a Job or Exam!
    const { data: jobMatch } = await (supabase as any)
      .from("gov_jobs")
      .select("slug")
      .ilike("slug", rawClean)
      .limit(1)
      .maybeSingle();

    if (jobMatch?.slug) {
      return { type: "cross_module_redirect", redirectUrl: `/jobs/${jobMatch.slug}` };
    }

    const { data: examMatch } = await (supabase as any)
      .from("gov_exams")
      .select("slug")
      .ilike("slug", rawClean)
      .limit(1)
      .maybeSingle();

    if (examMatch?.slug) {
      return { type: "cross_module_redirect", redirectUrl: `/exams/${examMatch.slug}` };
    }

    // 5. Keyword search in news_articles for partial/migrated slugs
    const cleanWords = rawClean
      .split(/[-_]+/)
      .filter((w: string) => w.length >= 4 && !["news", "suchna", "setu", "india", "govt", "post", "with", "this", "that", "from", "2024", "2025", "2026"].includes(w));

    if (cleanWords.length >= 2) {
      const searchPattern = `%${cleanWords.slice(0, 3).join("%")}%`;
      const { data: fuzzyArticles } = await (supabase as any)
        .from("news_articles")
        .select("*, translations:news_translations(*)")
        .ilike("title", searchPattern)
        .order("published_at", { ascending: false })
        .limit(1);

      if (fuzzyArticles && fuzzyArticles.length > 0) {
        const matched = fuzzyArticles[0];
        return {
          type: "found",
          article: prepareArticle(matched),
          redirectUrl: `/news/${matched.slug}`,
        };
      }
    }

    // 6. Fallback: only if cleanSlug is a valid UUID, allow ID lookup
    if (isUuid(rawClean)) {
      const { data: byId } = await (supabase as any)
        .from("news_articles")
        .select("*, translations:news_translations(*)")
        .eq("id", rawClean)
        .limit(1)
        .maybeSingle();

      if (byId) {
        return {
          type: "found",
          article: prepareArticle(byId),
          redirectUrl: `/news/${byId.slug}`,
        };
      }
    }

    // 7. Canonical Seed Articles fallback
    const canonicalMatch = CANONICAL_NEWS_ARTICLES.find(
      (a) => a.slug.toLowerCase() === rawClean || a.slug.toLowerCase().startsWith(rawClean)
    );
    if (canonicalMatch) {
      return { type: "found", article: canonicalMatch };
    }

    return { type: "not_found" };
  } catch (err) {
    console.error("[resolveNewsArticleSlug Error]", err);
    const canonicalMatch = CANONICAL_NEWS_ARTICLES.find(
      (a) => a.slug.toLowerCase() === slug.toLowerCase()
    );
    if (canonicalMatch) {
      return { type: "found", article: canonicalMatch };
    }
    return { type: "not_found" };
  }
}

export async function getNewsArticleBySlug(slug: string): Promise<NewsArticleDetailed | null> {
  const result = await resolveNewsArticleSlug(slug);
  if (result.type === "found") {
    return result.article;
  }
  return null;
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

    // Filter out same article in-memory if non-UUID ID and sanitize
    const filtered = (data as NewsArticle[])
      .filter((a) => a.id !== articleId)
      .map((a) => ({
        ...a,
        summary: ArticleContentExtractor.sanitizeParagraph(a.summary) || a.summary,
        content: a.content ? ArticleContentExtractor.cleanArticleText(a.content) || a.summary : null,
      }));
    return filtered.slice(0, limit);
  } catch {
    return CANONICAL_NEWS_ARTICLES.filter((a) => a.id !== articleId).slice(0, limit);
  }
}

export async function checkDuplicateArticle(
  contentHash: string,
  sourceUrl: string,
  slug?: string
): Promise<boolean> {
  try {
    const supabase = createAdminClient();

    // 1. Check content_hash
    if (contentHash) {
      const { data: byHash } = await (supabase as any)
        .from("news_articles")
        .select("id")
        .eq("content_hash", contentHash)
        .limit(1)
        .maybeSingle();

      if (byHash?.id) return true;
    }

    // 2. Check source_url safely using exact equality
    if (sourceUrl) {
      const { data: byUrl } = await (supabase as any)
        .from("news_articles")
        .select("id")
        .eq("source_url", sourceUrl)
        .limit(1)
        .maybeSingle();

      if (byUrl?.id) return true;
    }

    // 3. Check slug
    if (slug) {
      const { data: bySlug } = await (supabase as any)
        .from("news_articles")
        .select("id")
        .eq("slug", slug)
        .limit(1)
        .maybeSingle();

      if (bySlug?.id) return true;
    }

    return false;
  } catch {
    return false;
  }
}

export async function upsertNewsArticle(
  article: Partial<NewsArticle>
): Promise<{ id?: string; isUpdated?: boolean; error?: string }> {
  try {
    const supabase = createAdminClient();
    if (!article.slug || !article.title) {
      return { error: "Missing required slug or title for news article" };
    }

    // 1. Idempotency Check: find existing article by slug, source_url, or content_hash
    let existingId: string | null = null;

    if (article.slug) {
      const { data: bySlug } = await (supabase as any)
        .from("news_articles")
        .select("id")
        .eq("slug", article.slug)
        .limit(1)
        .maybeSingle();
      if (bySlug?.id) existingId = bySlug.id;
    }

    if (!existingId && article.source_url) {
      const { data: byUrl } = await (supabase as any)
        .from("news_articles")
        .select("id")
        .eq("source_url", article.source_url)
        .limit(1)
        .maybeSingle();
      if (byUrl?.id) existingId = byUrl.id;
    }

    if (!existingId && article.content_hash) {
      const { data: byHash } = await (supabase as any)
        .from("news_articles")
        .select("id")
        .eq("content_hash", article.content_hash)
        .limit(1)
        .maybeSingle();
      if (byHash?.id) existingId = byHash.id;
    }

    // 2. If article already exists, perform an UPDATE instead of a duplicate INSERT
    if (existingId) {
      const updatePayload: Record<string, any> = {
        title: article.title,
        summary: article.summary,
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
        updated_at: new Date().toISOString(),
      };

      if (article.content) {
        updatePayload.content = article.content;
      }

      const { error: updateError } = await (supabase as any)
        .from("news_articles")
        .update(updatePayload)
        .eq("id", existingId);

      if (updateError) {
        return { error: updateError.message };
      }

      return { id: existingId, isUpdated: true };
    }

    // 3. If new, perform INSERT
    const insertPayload = {
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
      updated_at: new Date().toISOString(),
    };

    const { data: inserted, error: insertError } = await (supabase as any)
      .from("news_articles")
      .insert(insertPayload)
      .select("id")
      .single();

    if (insertError) {
      // Graceful fallback for concurrent conflict on news_articles_slug_key
      if (
        insertError.code === "23505" ||
        insertError.message?.includes("news_articles_slug_key")
      ) {
        const { data: conflictRow } = await (supabase as any)
          .from("news_articles")
          .select("id")
          .eq("slug", article.slug)
          .limit(1)
          .maybeSingle();

        if (conflictRow?.id) {
          await (supabase as any)
            .from("news_articles")
            .update({
              title: article.title,
              summary: article.summary,
              content: article.content || undefined,
              updated_at: new Date().toISOString(),
            })
            .eq("id", conflictRow.id);

          return { id: conflictRow.id, isUpdated: true };
        }
      }

      return { error: insertError.message };
    }

    return { id: inserted.id, isUpdated: false };
  } catch (err: any) {
    return { error: err.message || "Failed to save news article" };
  }
}

export const insertNewsArticle = upsertNewsArticle;

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
