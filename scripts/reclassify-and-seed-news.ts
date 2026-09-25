import { createAdminClient } from "../src/lib/supabase/admin";
import { DEFAULT_NEWS_SOURCES } from "../src/modules/news/constants/sources";
import { CategoryClassifier } from "../src/modules/news/services/category-classifier";

async function reclassifyAndSeed() {
  console.log("=== 1. Seeding / Updating News Sources in Supabase ===");
  const sb = createAdminClient() as any;

  const { error: seedError } = await sb
    .from("news_sources")
    .upsert(DEFAULT_NEWS_SOURCES, { onConflict: "code", ignoreDuplicates: false });

  if (seedError) {
    console.error("Failed to seed news sources:", seedError);
  } else {
    console.log(`Successfully seeded/updated ${DEFAULT_NEWS_SOURCES.length} news sources in DB.`);
  }

  // Count active sources by category in DB
  const { data: sourcesData } = await sb
    .from("news_sources")
    .select("code, default_category, is_enabled")
    .eq("is_enabled", true);

  const sourceCounts: Record<string, number> = {};
  for (const s of (sourcesData || []) as any[]) {
    sourceCounts[s.default_category] = (sourceCounts[s.default_category] || 0) + 1;
  }
  console.log("Active news sources by category:", sourceCounts);

  console.log("\n=== 2. Reclassifying Existing Articles in Supabase ===");
  // Fetch articles currently published
  const { data: articles, error: fetchErr } = await sb
    .from("news_articles")
    .select("id, title, summary, content, category_slug, source_url, tags")
    .eq("is_published", true)
    .limit(3000);

  if (fetchErr || !articles) {
    console.error("Failed to fetch articles:", fetchErr);
    return;
  }

  console.log(`Fetched ${articles.length} articles to inspect.`);

  const beforeCounts: Record<string, number> = {};
  for (const a of articles as any[]) {
    beforeCounts[a.category_slug] = (beforeCounts[a.category_slug] || 0) + 1;
  }
  console.log("Category counts BEFORE reclassification:", beforeCounts);

  let updatedCount = 0;
  const afterCounts: Record<string, number> = {};

  for (const article of articles as any[]) {
    const newCategory = CategoryClassifier.classify({
      title: article.title,
      summary: article.summary,
      content: article.content,
      sourceDefaultCategory: article.category_slug,
      sourceUrl: article.source_url,
      tags: article.tags,
    });

    afterCounts[newCategory] = (afterCounts[newCategory] || 0) + 1;

    if (newCategory !== article.category_slug) {
      const { error: updateErr } = await sb
        .from("news_articles")
        .update({ category_slug: newCategory })
        .eq("id", article.id);

      if (!updateErr) {
        updatedCount++;
      }
    }
  }

  console.log(`\nReclassification finished! Updated ${updatedCount} articles to more specific categories.`);
  console.log("Category counts AFTER reclassification:", afterCounts);
}

reclassifyAndSeed().catch((err) => {
  console.error("Unhandled error:", err);
  process.exit(1);
});
