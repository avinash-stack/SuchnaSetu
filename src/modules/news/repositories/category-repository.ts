import { createClient } from "@/lib/supabase/server";
import { NewsCategory } from "../types/category";
import { NEWS_CATEGORIES } from "../constants/categories";

export async function getActiveNewsCategories(): Promise<NewsCategory[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await (supabase as any)
      .from("news_categories")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    if (error || !data || data.length === 0) {
      return NEWS_CATEGORIES;
    }

    return data as NewsCategory[];
  } catch {
    return NEWS_CATEGORIES;
  }
}

export async function getNewsCategoryBySlug(slug: string): Promise<NewsCategory | null> {
  const categories = await getActiveNewsCategories();
  return categories.find((c) => c.slug.toLowerCase() === slug.toLowerCase()) || null;
}
