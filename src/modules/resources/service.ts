import { createAdminClient } from "@/lib/supabase/admin";
import { getPublicSupabaseClient } from "@/lib/supabase/public";
import { CareerResource, CareerResourceCategory, ResourceFilterParams, ResourceListResult } from "./types";
import { RESOURCE_CATEGORIES, FALLBACK_PILLAR_RESOURCES } from "./constants";

/**
 * Retrieves public career guidance articles with filtering, search, and pagination.
 * Resilient Architecture: Seamlessly falls back to verified pillar resources if database table is empty or unmigrated.
 */
export async function getPublicResources(params: ResourceFilterParams = {}): Promise<ResourceListResult> {
  const { category, tag, search, page = 1, limit = 12 } = params;
  const offset = (page - 1) * limit;
  const supabase = getPublicSupabaseClient();

  try {
    let query = (supabase.from("career_resources") as any)
      .select("*, category:career_resource_categories(*)", { count: "exact" })
      .eq("status", "published")
      .order("published_at", { ascending: false });

    if (category && category !== "all") {
      query = query.eq("category_slug", category);
    }

    if (tag) {
      query = query.contains("tags", [tag]);
    }

    if (search && search.trim()) {
      query = query.or(`title.ilike.%${search.trim()}%,excerpt.ilike.%${search.trim()}%`);
    }

    query = query.range(offset, offset + limit - 1);

    const { data, count, error } = await query;

    if (!error && data && data.length > 0) {
      return {
        items: data as CareerResource[],
        total: count || data.length,
        page,
        totalPages: Math.ceil((count || data.length) / limit),
        limit,
      };
    }
  } catch (err) {
    // Database query failed or table not created yet; fall through to fallback data
  }

  // Fallback to local pillar articles
  let filtered = [...FALLBACK_PILLAR_RESOURCES];

  if (category && category !== "all") {
    filtered = filtered.filter((r) => r.category_slug === category);
  }

  if (tag) {
    filtered = filtered.filter((r) => r.tags.some((t) => t.toLowerCase() === tag.toLowerCase()));
  }

  if (search && search.trim()) {
    const s = search.trim().toLowerCase();
    filtered = filtered.filter(
      (r) =>
        r.title.toLowerCase().includes(s) ||
        r.excerpt.toLowerCase().includes(s) ||
        r.tags.some((t) => t.toLowerCase().includes(s))
    );
  }

  // Populate category objects on fallback items
  const categoryMap = new Map(RESOURCE_CATEGORIES.map((c) => [c.slug, c]));
  const enriched = filtered.map((item) => ({
    ...item,
    category: categoryMap.get(item.category_slug),
  }));

  const total = enriched.length;
  const items = enriched.slice(offset, offset + limit);

  return {
    items,
    total,
    page,
    totalPages: Math.max(1, Math.ceil(total / limit)),
    limit,
  };
}

/**
 * Retrieves a single career guidance resource by its slug.
 */
export async function getResourceBySlug(slug: string): Promise<CareerResource | null> {
  const supabase = getPublicSupabaseClient();

  try {
    const { data, error } = await (supabase.from("career_resources") as any)
      .select("*, category:career_resource_categories(*)")
      .eq("slug", slug)
      .eq("status", "published")
      .single();

    if (!error && data) {
      return data as CareerResource;
    }
  } catch (err) {
    // Fall through to fallback
  }

  const found = FALLBACK_PILLAR_RESOURCES.find((r) => r.slug === slug);
  if (found) {
    const categoryMap = new Map(RESOURCE_CATEGORIES.map((c) => [c.slug, c]));
    return {
      ...found,
      category: categoryMap.get(found.category_slug),
    };
  }

  return null;
}

/**
 * Retrieves all active career resource categories.
 */
export async function getResourceCategories(): Promise<CareerResourceCategory[]> {
  const supabase = getPublicSupabaseClient();

  try {
    const { data, error } = await (supabase.from("career_resource_categories") as any)
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    if (!error && data && data.length > 0) {
      return data as CareerResourceCategory[];
    }
  } catch (err) {
    // Fall through to constants
  }

  return RESOURCE_CATEGORIES;
}

/**
 * Retrieves 3 related career resources for cross-linking.
 */
export async function getRelatedResources(currentSlug: string, categorySlug: string): Promise<CareerResource[]> {
  const result = await getPublicResources({ category: categorySlug, limit: 4 });
  return result.items.filter((r) => r.slug !== currentSlug).slice(0, 3);
}

/**
 * Saves a newly generated resource to Supabase.
 */
export async function saveGeneratedResource(resource: any): Promise<{ success: boolean; id?: string; error?: string }> {
  const supabase = createAdminClient();

  try {
    const { data, error } = await (supabase.from("career_resources") as any)
      .upsert(
        {
          ...resource,
          status: "published",
          updated_at: new Date().toISOString(),
        },
        { onConflict: "slug" }
      )
      .select("id")
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, id: data?.id };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
