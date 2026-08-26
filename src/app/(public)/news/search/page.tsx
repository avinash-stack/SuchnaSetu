import { Metadata } from "next";
import Link from "next/link";
import {
  fetchNewsFeed,
  fetchCategoryList,
} from "@/modules/news/services/news-query-service";
import { NewsHeader } from "@/modules/news/components/news-header";
import { NewsListViewItem } from "@/modules/news/components/news-list-view-item";
import { NewsPagination } from "@/modules/news/components/news-pagination";
import { NewsLanguageFilter } from "@/modules/news/components/news-language-filter";
import { NewsSearchBar } from "@/modules/news/components/news-search-bar";
import { EmptyState } from "@/components/shared/empty-state";
import { constructMetadata } from "@/lib/seo";
import { Search } from "lucide-react";

interface NewsSearchPageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    page?: string;
    limit?: string;
    lang?: string;
  }>;
}

export async function generateMetadata({ searchParams }: NewsSearchPageProps): Promise<Metadata> {
  const params = await searchParams;
  const query = params.q || "";
  const isHindi = params.lang === "hi";
  const title = query
    ? `"${query}" — ${isHindi ? "समाचार खोज" : "News Search"} | SuchnaSetu News`
    : `${isHindi ? "समाचार खोज" : "Search News & Public Affairs"} | SuchnaSetu News`;

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
  const currentPage = Math.max(1, parseInt(params.page || "1", 10) || 1);
  const rawLimit = parseInt(params.limit || "20", 10);
  const limit = [20, 50, 100].includes(rawLimit) ? rawLimit : 20;
  const lang = params.lang === "hi" ? "hi" : "en";
  const isHindi = lang === "hi";

  const [categories, searchResult] = await Promise.all([
    fetchCategoryList(),
    fetchNewsFeed({
      search: query,
      category: category !== "all" ? category : undefined,
      page: currentPage,
      limit,
      sort: "latest",
      lang,
    }),
  ]);

  const { articles, total, totalPages } = searchResult;

  return (
    <div className="min-h-screen bg-slate-50/50 pb-16 font-sans">
      <NewsHeader />

      <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Search Input Banner */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="max-w-2xl mx-auto space-y-3">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <Search className="h-5 w-5 text-[#013089]" />
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-heading">
                  {isHindi ? "समाचार एवं सार्वजनिक मामले खोजें" : "Search News & Public Affairs"}
                </h1>
              </div>
              <NewsLanguageFilter
                currentLang={lang}
                pathname="/news/search"
                searchParams={params}
              />
            </div>

            <NewsSearchBar initialQuery={query} lang={lang} />

            {/* Quick Category Filters */}
            <div className="flex items-center gap-1.5 overflow-x-auto pt-2 no-scrollbar text-xs font-semibold">
              <Link
                href={`/news/search?q=${encodeURIComponent(query)}&category=all${isHindi ? "&lang=hi" : ""}`}
                className={`px-3 py-1 rounded-full transition-colors shrink-0 ${
                  category === "all"
                    ? "bg-[#013089] text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {isHindi ? "सभी डेस्क" : "All Desks"}
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/news/search?q=${encodeURIComponent(query)}&category=${cat.slug}${isHindi ? "&lang=hi" : ""}`}
                  className={`px-3 py-1 rounded-full transition-colors shrink-0 ${
                    category === cat.slug
                      ? "bg-[#013089] text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {isHindi ? cat.name_hi : cat.name}
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
                {isHindi ? "खोज परिणाम: " : "Search Results for "}&ldquo;
                <span className="text-[#013089]">{query}</span>&rdquo;
              </span>
            ) : (
              <span>{isHindi ? "सभी ताज़ा समाचार" : "All Recent News"}</span>
            )}
          </h2>
          <span className="text-xs text-slate-400 font-mono">
            {total} {isHindi ? "परिणाम प्राप्त" : "Stories Found"}
          </span>
        </div>

        {/* Results Stream in List View */}
        <section className="space-y-3" aria-label="Search Results">
          {articles.length > 0 ? (
            <div className="space-y-3">
              {articles.map((article) => (
                <NewsListViewItem key={article.id} article={article} lang={lang} />
              ))}
            </div>
          ) : (
            <EmptyState
              title={isHindi ? "कोई संबंधित समाचार नहीं मिला" : "No matching news articles found"}
              description={
                isHindi
                  ? "अन्य कीवर्ड या श्रेणी से खोजें अथवा सभी समाचार देखें।"
                  : "Try searching with broader terms or browse the desks above."
              }
            />
          )}
        </section>

        {/* Server-Side Pagination */}
        {total > 0 && (
          <NewsPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={total}
            currentLimit={limit}
            lang={lang}
            pathname="/news/search"
            searchParams={params}
          />
        )}
      </main>
    </div>
  );
}
