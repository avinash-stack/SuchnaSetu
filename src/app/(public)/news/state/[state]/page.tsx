import { Metadata } from "next";
import Link from "next/link";
import { fetchNewsFeed } from "@/modules/news/services/news-query-service";
import { NewsHeader } from "@/modules/news/components/news-header";
import { NewsFeedCard } from "@/modules/news/components/news-feed-card";
import { EmptyState } from "@/components/shared/empty-state";
import { constructMetadata, buildBreadcrumbJsonLd } from "@/lib/seo";
import { getLocalizedStateName } from "@/lib/i18n/config";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";

interface StateNewsPageProps {
  params: Promise<{
    state: string;
  }>;
  searchParams: Promise<{
    page?: string;
  }>;
}

export const revalidate = 180;

export async function generateMetadata({ params }: StateNewsPageProps): Promise<Metadata> {
  const { state: rawState } = await params;
  const stateCode = rawState.toUpperCase();
  const stateName = getLocalizedStateName(stateCode, "en") || stateCode;

  return constructMetadata({
    title: `${stateName} News & Regional Updates — SuchnaSetu News`,
    description: `Latest verified news, state government announcements, cabinet decisions, and local updates from ${stateName}.`,
    path: `/news/state/${rawState.toLowerCase()}`,
    canonicalPath: `/news/state/${rawState.toLowerCase()}`,
  });
}

export default async function StateNewsPage({ params, searchParams }: StateNewsPageProps) {
  const { state: rawState } = await params;
  const sParams = await searchParams;
  const stateCode = rawState.toUpperCase();
  const stateName = getLocalizedStateName(stateCode, "en") || stateCode;
  const stateNameHi = getLocalizedStateName(stateCode, "hi") || stateName;

  const currentPage = parseInt(sParams.page || "1", 10) || 1;
  const { articles, total, totalPages } = await fetchNewsFeed({
    state: stateCode,
    page: currentPage,
    limit: 15,
    sort: "latest",
  });

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "News", url: "/news" },
    { name: `${stateName} News`, url: `/news/state/${rawState.toLowerCase()}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="min-h-screen bg-slate-50/50 pb-16 font-sans">
        <NewsHeader />

        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          {/* Header Banner */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#013089]">
              <MapPin className="h-4 w-4 text-[#FE8D01]" />
              <span>State &amp; Regional News Desk</span>
            </div>
            <div className="flex items-baseline justify-between flex-wrap gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
                {stateName} News <span className="text-slate-400 font-normal text-lg">({stateNameHi})</span>
              </h1>
              <span className="text-xs text-slate-500 font-mono font-medium">
                {total} Articles Total
              </span>
            </div>
            <p className="text-sm text-slate-600 max-w-2xl">
              Verified public communiques, state cabinet policies, administrative decisions, and regional reporting for {stateName}.
            </p>
          </div>

          {/* Articles Stream */}
          {articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {articles.map((article) => (
                <NewsFeedCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <EmptyState
              title={`No articles found for ${stateName}`}
              description="Regional reporting is updating. Browse all national news in the meantime."
            />
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              {currentPage > 1 && (
                <Link
                  href={`/news/state/${rawState.toLowerCase()}?page=${currentPage - 1}`}
                  className="px-4 py-2 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 inline-flex items-center gap-1 shadow-2xs"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Previous</span>
                </Link>
              )}

              <span className="text-xs font-bold text-slate-600 px-3">
                Page {currentPage} of {totalPages}
              </span>

              {currentPage < totalPages && (
                <Link
                  href={`/news/state/${rawState.toLowerCase()}?page=${currentPage + 1}`}
                  className="px-4 py-2 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 inline-flex items-center gap-1 shadow-2xs"
                >
                  <span>Next</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              )}
            </div>
          )}
        </main>
      </div>
    </>
  );
}
