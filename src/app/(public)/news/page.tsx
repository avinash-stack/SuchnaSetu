import { Metadata } from "next";
import Link from "next/link";
import {
  fetchTopStories,
  fetchNewsFeed,
  fetchCategoryList,
} from "@/modules/news/services/news-query-service";
import { NewsHeader } from "@/modules/news/components/news-header";
import { NewsHeroTopStories } from "@/modules/news/components/news-hero-top-stories";
import { NewsFeedCard } from "@/modules/news/components/news-feed-card";
import { NewsCategoryBlock } from "@/modules/news/components/news-category-block";
import { constructMetadata, buildBreadcrumbJsonLd } from "@/lib/seo";
import { ChevronRight, Newspaper, Sparkles, Filter } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";

export const revalidate = 180; // 3 minutes ISR cache

export async function generateMetadata(): Promise<Metadata> {
  return constructMetadata({
    title: "SuchnaSetu News — Verified Indian Public Affairs, Policy & National Updates",
    description:
      "Direct verified reporting on national developments, education reforms, cabinet decisions, government policies, state circulars, and civic advisories.",
    path: "/news",
    canonicalPath: "/news",
  });
}

export default async function NewsPortalPage() {
  const [topStories, latestResult, categories] = await Promise.all([
    fetchTopStories(7),
    fetchNewsFeed({ limit: 12, sort: "latest" }),
    fetchCategoryList(),
  ]);

  const latestArticles = latestResult.articles;

  // Filter category highlights for 3 key domains
  const educationArticles = latestArticles.filter((a) => a.category_slug === "education");
  const governanceArticles = latestArticles.filter((a) => a.category_slug === "governance");
  const techArticles = latestArticles.filter((a) => a.category_slug === "technology");

  const eduCategory = categories.find((c) => c.slug === "education");
  const govCategory = categories.find((c) => c.slug === "governance");
  const techCategory = categories.find((c) => c.slug === "technology");

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "News", url: "/news" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="min-h-screen bg-slate-50/50 pb-16 font-sans">
        {/* Dedicated News Header & Navigation */}
        <NewsHeader />

        {/* 1. Hero Top Stories & Breaking Grid */}
        {topStories.length > 0 && <NewsHeroTopStories articles={topStories} />}

        {/* 2. Main Content Container */}
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-10">
          {/* Latest News Feed Stream */}
          <section className="space-y-4" aria-label="Latest News Stream">
            <div className="flex items-center justify-between border-b border-slate-200/90 pb-2">
              <div className="flex items-center gap-2">
                <Newspaper className="h-4 w-4 text-[#013089]" />
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 font-heading">
                  Latest Public Updates &amp; Reporting
                </h2>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                {latestResult.total} Articles Indexed
              </span>
            </div>

            {latestArticles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {latestArticles.slice(0, 9).map((article) => (
                  <NewsFeedCard key={article.id} article={article} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No news articles found"
                description="Live news sync is updating feeds. Check back shortly for latest coverage."
              />
            )}
          </section>

          {/* 3. Category Feature Blocks */}
          <div className="space-y-8 pt-4">
            {govCategory && governanceArticles.length > 0 && (
              <NewsCategoryBlock category={govCategory} articles={governanceArticles} />
            )}

            {eduCategory && educationArticles.length > 0 && (
              <NewsCategoryBlock category={eduCategory} articles={educationArticles} />
            )}

            {techCategory && techArticles.length > 0 && (
              <NewsCategoryBlock category={techCategory} articles={techArticles} />
            )}
          </div>

          {/* 4. Browse by Category Grid */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4 shadow-2xs">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <Sparkles className="h-4 w-4 text-[#FE8D01]" />
              <h3 className="font-bold text-base text-slate-900 font-heading">
                Explore All News Desks
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/news/category/${cat.slug}`}
                  className="p-3 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-blue-50/60 hover:border-blue-200 text-center transition-all group"
                >
                  <span className="block font-bold text-xs sm:text-sm text-slate-800 group-hover:text-[#013089] transition-colors truncate">
                    {cat.name}
                  </span>
                  <span className="block text-[10.5px] text-slate-400 mt-0.5 truncate">
                    {cat.name_hi}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
