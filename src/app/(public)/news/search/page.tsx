import { Metadata } from "next";
import Link from "next/link";
import {
  fetchNewsFeed,
  fetchCategoryList,
} from "@/modules/news/services/news-query-service";
import { NewsHeader } from "@/modules/news/components/news-header";
import { NewsFeedCard } from "@/modules/news/components/news-feed-card";
import { NewsSearchBar } from "@/modules/news/components/news-search-bar";
import { EmptyState } from "@/components/shared/empty-state";
import { constructMetadata } from "@/lib/seo";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

interface NewsSearchPageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    page?: string;
  }>;
}

export async function generateMetadata({ searchParams }: NewsSearchPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  const title = q ? `"${q}" — News Search | SuchnaSetu News` : "Search News & Public Affairs | SuchnaSetu News";

  return constructMetadata({
    title,
    description: "Search verified Indian government news, public announcements, policy decisions, and state reports.",
    path: "/news/search",
    canonicalPath: "/news/search",
  });
}

export default async function NewsSearchPage({ searchParams }: NewsSearchPageProps) {
  const params = await searchParams;
  const query = (params.q || "").trim();
  const category = params.category || "all";
  const currentPage = parseInt(params.page || "1", 10) || 1;

  const [categories, searchResult] = await Promise.all([
    fetchCategoryList(),
    fetchNewsFeed({
      search: query,
      category: category !== "all" ? category : undefined,
      page: currentPage,
      limit: 15,
      sort: "latest",
    }),
  ]);

  const { articles, total, totalPages } = searchResult;

  return (
    <div className="min-h-screen bg-slate-50/50 pb-16 font-sans">
      <NewsHeader />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Search Input Banner */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs space-y-4">
          <div className="max-w-2xl mx-auto space-y-3">
            <div className="flex items-center gap-2">
              <Search className="h-5 w-5 text-[#013089]" />
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-heading">
                Search News &amp; Public Affairs
              </h1>
            </div>

            <NewsSearchBar initialQuery={query} />

            {/* Quick Category Filters */}
            <div className="flex items-center gap-1.5 overflow-x-auto pt-2 no-scrollbar text-xs font-semibold">
              <Link
                href={`/news/search?q=${encodeURIComponent(query)}&category=all`}
                className={`px-3 py-1 rounded-full transition-colors shrink-0 ${
                  category === "all"
                    ? "bg-[#013089] text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                All Desks
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/news/search?q=${encodeURIComponent(query)}&category=${cat.slug}`}
                  className={`px-3 py-1 rounded-full transition-colors shrink-0 ${
                    category === cat.slug
                      ? "bg-[#013089] text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between border-b border-slate-200/90 pb-2">
          <h2 className="text-base font-bold text-slate-800">
            {query ? (
              <span>
                Search Results for &ldquo;<span className="text-[#013089]">{query}</span>&rdquo;
              </span>
            ) : (
              <span>All Recent News</span>
            )}
          </h2>
          <span className="text-xs text-slate-400 font-mono">{total} Stories Found</span>
        </div>

        {/* Results Stream */}
        {articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {articles.map((article) => (
              <NewsFeedCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No matching stories found"
            description="Try searching with broader terms (e.g. 'Cabinet', 'Education', 'Railway', 'ISRO')."
          />
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-6">
            {currentPage > 1 && (
              <Link
                href={`/news/search?q=${encodeURIComponent(query)}&category=${category}&page=${currentPage - 1}`}
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
                href={`/news/search?q=${encodeURIComponent(query)}&category=${category}&page=${currentPage + 1}`}
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
  );
}
