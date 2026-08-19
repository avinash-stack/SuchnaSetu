import { createClient } from "@/lib/supabase/server";
import { PublicBulletinDetailed, BulletinFilterParams } from "./types";
import { BULLETIN_CATEGORIES } from "./constants";

import { searchBulletins } from "@/modules/search/service";
import { parseSearchQuery } from "@/modules/search/query-parser";

/**
 * Maps a user-facing category key to database categories.
 */
function resolveDbCategory(categoryKey?: string): string[] | null {
  if (!categoryKey || categoryKey === "all") return null;

  const found = BULLETIN_CATEGORIES.find((c) => c.key === categoryKey);
  if (found) {
    return Array.from(new Set([found.dbCategory, found.key]));
  }
  return [categoryKey];
}

/**
 * Fetch published public bulletins with multi-category filtering for public news desk.
 * Uses the common search engine for intelligent tokenization, taxonomy matching, and ranking.
 */
export async function getPublicBulletins(params: BulletinFilterParams = {}): Promise<{
  bulletins: PublicBulletinDetailed[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}> {
  return searchBulletins(params);
}

/**
 * Fetch top breaking news headlines for live marquee ticker.
 */
export async function getBreakingBulletins(limit: number = 5): Promise<PublicBulletinDetailed[]> {
  const supabase = await createClient();

  const { data, error } = await (supabase.from("public_bulletins") as any)
    .select(
      `
      *,
      organization:organizations(*)
    `
    )
    .eq("status", "published")
    .order("is_breaking", { ascending: false })
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error || !data) {
    return [];
  }

  return data as PublicBulletinDetailed[];
}

/**
 * Fetch a single public bulletin by slug.
 */
export async function getPublicBulletinBySlug(slug: string): Promise<PublicBulletinDetailed | null> {
  const supabase = await createClient();

  const { data, error } = await (supabase.from("public_bulletins") as any)
    .select(
      `
      *,
      organization:organizations(*),
      related_job:gov_jobs(*)
    `
    )
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error || !data) {
    return null;
  }

  return data as PublicBulletinDetailed;
}

/**
 * Fetch related bulletins in the same category or authority.
 */
export async function getRelatedBulletins(
  currentId: string,
  category: string,
  limit: number = 3
): Promise<PublicBulletinDetailed[]> {
  const supabase = await createClient();

  const { data, error } = await (supabase.from("public_bulletins") as any)
    .select(
      `
      *,
      organization:organizations(*)
    `
    )
    .eq("status", "published")
    .neq("id", currentId)
    .eq("category", category)
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error || !data) {
    return [];
  }

  return data as PublicBulletinDetailed[];
}

/**
 * Fetch all bulletins for Admin management console.
 */
export async function getAdminBulletins(params: {
  category?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
} = {}): Promise<{
  bulletins: PublicBulletinDetailed[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}> {
  const supabase = await createClient();
  const page = Math.max(1, params.page || 1);
  const limit = Math.min(50, Math.max(1, params.limit || 15));
  const offset = (page - 1) * limit;

  let query = (supabase.from("public_bulletins") as any)
    .select(
      `
      *,
      organization:organizations(*)
    `,
      { count: "exact" }
    )
    .order("created_at", { ascending: false });

  if (params.status && params.status !== "all") {
    query = query.eq("status", params.status);
  }

  if (params.category && params.category !== "all") {
    const dbCats = resolveDbCategory(params.category);
    if (dbCats && dbCats.length === 1) {
      query = query.eq("category", dbCats[0]);
    } else if (dbCats && dbCats.length > 1) {
      query = query.in("category", dbCats);
    }
  }

  if (params.search && params.search.trim()) {
    const parsed = parseSearchQuery(params.search);
    const orClauses: string[] = [];
    if (parsed.cleanQuery) {
      orClauses.push(`title.ilike.%${parsed.cleanQuery}%`);
      orClauses.push(`source_name.ilike.%${parsed.cleanQuery}%`);
      orClauses.push(`summary.ilike.%${parsed.cleanQuery}%`);
      orClauses.push(`slug.ilike.%${parsed.cleanQuery}%`);
    }
    for (const token of parsed.contentTokens) {
      orClauses.push(`title.ilike.%${token}%`);
      orClauses.push(`source_name.ilike.%${token}%`);
      orClauses.push(`summary.ilike.%${token}%`);
      orClauses.push(`slug.ilike.%${token}%`);
    }
    const unique = Array.from(new Set(orClauses)).filter(Boolean);
    if (unique.length > 0) {
      query = query.or(unique.join(","));
    }
  }

  query = query.range(offset, offset + limit - 1);

  const { data, count, error } = await query;

  if (error) {
    console.error("Error fetching admin bulletins:", error);
    return { bulletins: [], total: 0, page, limit, totalPages: 0 };
  }

  const total = count || 0;
  const totalPages = Math.ceil(total / limit);

  return {
    bulletins: (data || []) as PublicBulletinDetailed[],
    total,
    page,
    limit,
    totalPages,
  };
}

/**
 * Fetch single bulletin for Admin editing.
 */
export async function getAdminBulletinById(id: string): Promise<PublicBulletinDetailed | null> {
  const supabase = await createClient();

  const { data, error } = await (supabase.from("public_bulletins") as any)
    .select(
      `
      *,
      organization:organizations(*),
      related_job:gov_jobs(*)
    `
    )
    .eq("id", id)
    .single();

  if (error || !data) {
    return null;
  }

  return data as PublicBulletinDetailed;
}
