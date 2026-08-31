import { Metadata } from "next";
import Link from "next/link";
import {
  fetchTopStories,
  fetchNewsFeed,
  fetchCategoryList,
} from "@/modules/news/services/news-query-service";
import { NewsHeader } from "@/modules/news/components/news-header";
import { NewsListViewItem } from "@/modules/news/components/news-list-view-item";
import { NewsPagination } from "@/modules/news/components/news-pagination";
import { constructMetadata, buildBreadcrumbJsonLd } from "@/lib/seo";
import { Newspaper, Sparkles } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";

export const revalidate = 120; // 2 minutes ISR cache

interface NewsPortalPageProps {
  searchParams?: Promise<{
    page?: string;
    limit?: string;
    lang?: string;
    category?: string;
    state?: string;
    q?: string;
  }>;
}

export async function generateMetadata({ searchParams }: NewsPortalPageProps): Promise<Metadata> {
  const sParams = searchParams ? await searchParams : {};
  const isHindi = sParams.lang === "hi";

  return constructMetadata({
    title: isHindi
      ? "सूचना सेतु समाचार — राष्ट्रीय मामले, शासन, शिक्षा एवं नीतियां"
      : "SuchnaSetu News — Verified Indian Public Affairs, Policy & National Updates",
    description: isHindi
      ? "राष्ट्रीय घटनाक्रम, शिक्षा सुधार, कैबिनेट निर्णय, सरकारी नीतियां एवं राज्य सूचनाओं का सत्यापित और निष्पक्ष समाचार पोर्टल।"
      : "Direct verified reporting on national developments, education reforms, cabinet decisions, government policies, state circulars, and civic advisories.",
    path: "/news",
    canonicalPath: "/news",
    manifest: "/news/manifest.webmanifest",
  });
}

export default async function NewsPortalPage({ searchParams }: NewsPortalPageProps) {
  const sParams = searchParams ? await searchParams : {};
  const currentPage = Math.max(1, parseInt(sParams.page || "1", 10) || 1);
  const rawLimit = parseInt(sParams.limit || "20", 10);
  const limit = [20, 50, 100].includes(rawLimit) ? rawLimit : 20;
  const lang = sParams.lang === "hi" ? "hi" : "en";
  const isHindi = lang === "hi";

  const [topStories, newsResult, categories] = await Promise.all([
    currentPage === 1 ? fetchTopStories(4) : Promise.resolve([]),
    fetchNewsFeed({
      page: currentPage,
      limit,
      category: sParams.category,
      state: sParams.state,
      search: sParams.q,
      sort: "latest",
      lang,
    }),
    fetchCategoryList(),
  ]);

  const { articles, total, totalPages } = newsResult;

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

        {/* Main Content Container */}
        <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {/* Top Control Bar: Stream Title */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/90 pb-4">
            <div className="flex items-center gap-2">
              <Newspaper className="h-5 w-5 text-[#013089]" />
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-heading">
                  {isHindi ? "ताज़ा सार्वजनिक समाचार एवं रिपोर्टिंग" : "Public Affairs & National Reporting"}
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isHindi
                    ? "सत्यापित राष्ट्रीय स्रोत, आयोग एवं सार्वजनिक सूचनाएं"
                    : "Verified reporting from government agencies & national news desks"}
                </p>
              </div>
            </div>
          </div>

          {/* Top Stories Highlights Strip (Only on Page 1) */}
          {currentPage === 1 && topStories.length > 0 && (
            <div className="rounded-2xl border border-blue-200/80 bg-gradient-to-r from-blue-50/70 to-indigo-50/40 p-4 sm:p-5 space-y-3 shadow-2xs">
              <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider text-[#013089]">
                <Sparkles className="h-4 w-4 text-[#FE8D01]" />
                <span>{isHindi ? "शीर्ष राष्ट्रीय सुर्खियां" : "Top Public Headlines"}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {topStories.map((story) => (
                  <Link
                    key={story.id}
                    href={`/news/${story.slug}${isHindi ? "?lang=hi" : ""}`}
                    className="p-3 rounded-xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-2xs transition-all flex flex-col justify-between gap-1.5 group"
                  >
                    <span className="text-xs font-bold text-slate-900 group-hover:text-[#013089] transition-colors line-clamp-2">
                      {story.title}
                    </span>
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span className="font-semibold text-slate-600">{story.source_name}</span>
                      <span className="font-mono">{story.category_slug}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Primary News Listing (High Density Compact List View) */}
          <section className="space-y-3" aria-label="News Articles Feed">
            {articles.length > 0 ? (
              <div className="space-y-3">
                {articles.map((article) => (
                  <NewsListViewItem
                    key={article.id}
                    article={article}
                    lang={lang}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                title={isHindi ? "कोई समाचार नहीं मिला" : "No news articles found"}
                description={
                  isHindi
                    ? "फ़ीड अद्यतित की जा रही है। कृपया कुछ समय पश्चात पुनः प्रयास करें।"
                    : "News sync is refreshing feeds. Please check back in a few minutes."
                }
              />
            )}
          </section>

          {/* Server-Side Pagination & Page-Size Selector */}
          {total > 0 && (
            <NewsPagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={total}
              currentLimit={limit}
              lang={lang}
              pathname="/news"
              searchParams={sParams}
            />
          )}

          {/* Explore All Categories Grid */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3 shadow-2xs mt-8">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <Sparkles className="h-4 w-4 text-[#FE8D01]" />
              <h3 className="font-bold text-sm text-slate-900 font-heading">
                {isHindi ? "सभी समाचार श्रेणियां देखें" : "Explore All News Desks"}
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/news/category/${cat.slug}${isHindi ? "?lang=hi" : ""}`}
                  className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-blue-50/60 hover:border-blue-200 text-center transition-all group"
                >
                  <span className="block font-bold text-xs text-slate-800 group-hover:text-[#013089] transition-colors truncate">
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
