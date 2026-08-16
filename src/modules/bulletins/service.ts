import { createClient } from "@/lib/supabase/server";
import { PublicBulletinDetailed, BulletinFilterParams } from "./types";

/**
 * Fetch published public bulletins with multi-category filtering for public news desk.
 */
export async function getPublicBulletins(params: BulletinFilterParams = {}): Promise<{
  bulletins: PublicBulletinDetailed[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}> {
  const supabase = await createClient();
  const page = Math.max(1, params.page || 1);
  const limit = Math.min(50, Math.max(1, params.limit || 10));
  const offset = (page - 1) * limit;

  let query = (supabase.from("public_bulletins") as any)
    .select(
      `
      *,
      organization:organizations(*),
      related_job:gov_jobs(*)
    `,
      { count: "exact" }
    )
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (params.category && params.category !== "all") {
    query = query.eq("category", params.category);
  }

  if (params.isBreaking !== undefined) {
    query = query.eq("is_breaking", params.isBreaking);
  }

  if (params.search) {
    const term = `%${params.search.trim()}%`;
    query = query.or(`title.ilike.${term},summary.ilike.${term},source_name.ilike.${term}`);
  }

  query = query.range(offset, offset + limit - 1);

  const { data, count, error } = await query;

  if (error) {
    console.error("Error fetching public bulletins:", error);
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
    query = query.eq("category", params.category);
  }

  if (params.search) {
    const term = `%${params.search.trim()}%`;
    query = query.or(`title.ilike.${term},source_name.ilike.${term}`);
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
