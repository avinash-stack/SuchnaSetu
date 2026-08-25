import { createAdminClient } from "@/lib/supabase/admin";
import { NewsSource } from "../types/source";
import { DEFAULT_NEWS_SOURCES } from "../constants/sources";

export async function getEnabledNewsSources(): Promise<NewsSource[]> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await (supabase as any)
      .from("news_sources")
      .select("*")
      .eq("is_enabled", true)
      .order("priority", { ascending: true });

    if (error || !data || data.length === 0) {
      return DEFAULT_NEWS_SOURCES.map((s, idx) => ({
        ...s,
        id: `source-seed-${idx + 1}`,
      }));
    }

    return data as NewsSource[];
  } catch {
    return DEFAULT_NEWS_SOURCES.map((s, idx) => ({
      ...s,
      id: `source-seed-${idx + 1}`,
    }));
  }
}

export async function updateSourceSyncStatus(
  sourceId: string,
  status: { lastSyncedAt?: string; lastError?: string | null; failureCount?: number }
): Promise<void> {
  try {
    const supabase = createAdminClient();
    await (supabase as any)
      .from("news_sources")
      .update({
        last_synced_at: status.lastSyncedAt || new Date().toISOString(),
        last_error: status.lastError ?? null,
        failure_count: status.failureCount ?? 0,
        updated_at: new Date().toISOString(),
      })
      .eq("id", sourceId);
  } catch (err) {
    console.warn(`Failed to update source sync status for ${sourceId}:`, err);
  }
}
