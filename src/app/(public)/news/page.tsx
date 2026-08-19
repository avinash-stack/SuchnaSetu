import { Metadata } from "next";
import Link from "next/link";
import { getPublicBulletins, getBreakingBulletins } from "@/modules/bulletins/service";
import { BulletinCard } from "@/modules/bulletins/components/bulletin-card";
import { SearchBar } from "@/components/shared/search-bar";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { constructMetadata } from "@/lib/seo";
import { BULLETIN_CATEGORIES, BulletinCategoryKey } from "@/modules/bulletins/constants";
import { Newspaper, ChevronLeft, ChevronRight, X, Sparkles } from "lucide-react";

interface NewsPageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    page?: string;
  }>;
}

export async function generateMetadata({ searchParams }: NewsPageProps): Promise<Metadata> {
  const params = await searchParams;
  let title = "Government News & Public Bulletins - Employment News & Scheme Advisories";
  if (params.search) {
    title = `Search: "${params.search}" - Govt News | SuchnaSetu`;
  }
  return constructMetadata({
    title,
    description: "Official weekly Employment News digests, government scheme updates, exam notifications, education advisories, court stay orders, and verified public communiques.",
    path: "/news",
  });
}

function buildPageUrl(params: Record<string, string | undefined>, newPage: number) {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v && k !== "page") q.set(k, v);
  });
  if (newPage > 1) {
    q.set("page", String(newPage));
  }
  const qs = q.toString();
  return qs ? `/news?${qs}` : "/news";
}

function buildCategoryUrl(params: Record<string, string | undefined>, categoryKey: string) {
  const q = new URLSearchParams();
  if (categoryKey && categoryKey !== "all") {
    q.set("category", categoryKey);
  }
  if (params.search) {
    q.set("search", params.search);
  }
  const qs = q.toString();
  return qs ? `/news?${qs}` : "/news";
}

function buildClearSearchUrl(params: Record<string, string | undefined>) {
  const q = new URLSearchParams();
  if (params.category && params.category !== "all") {
    q.set("category", params.category);
  }
  const qs = q.toString();
  return qs ? `/news?${qs}` : "/news";
}

export default async function PublicNewsPage({ searchParams }: NewsPageProps) {
  const params = await searchParams;
  const currentPage = parseInt(params.page || "1", 10) || 1;
  const currentCategory = (params.category || "all") as BulletinCategoryKey;

  const { bulletins, total, totalPages } = await getPublicBulletins({
    category: currentCategory,
    search: params.search,
    page: currentPage,
    limit: 12,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Heading */}
      <div className="section-saffron-bar flex flex-col md:flex-row md:items-end justify-between border-b border-slate-200 pb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#013089]">
            <Newspaper className="h-4 w-4" />
            <span>Official Gazette &amp; Information Desk</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F172A] font-heading mt-1">
            Government News, Rozgar Samachar &amp; Advisories
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Verified public-service communiques, weekly Employment News digests, welfare schemes, examination notices, and court rulings.
          </p>
        </div>

        <Badge variant="navy" className="text-xs py-1 px-2.5">
          {total} Active {total === 1 ? "Bulletin" : "Bulletins"}
        </Badge>
      </div>

      {/* Category Filter Pills & Search */}
      <div className="space-y-4">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 no-scrollbar">
          <Link
            href={buildCategoryUrl(params, "all")}
            className={`rounded-xs px-3 py-1.5 text-xs font-semibold transition-colors shrink-0 ${
              currentCategory === "all"
                ? "bg-[#013089] text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
            }`}
          >
            All News
          </Link>

          {BULLETIN_CATEGORIES.map((cat) => {
            const isActive = currentCategory === cat.key;
            return (
              <Link
                key={cat.key}
                href={buildCategoryUrl(params, cat.key)}
                className={`rounded-xs px-3 py-1.5 text-xs font-semibold transition-colors shrink-0 ${
                  isActive
                    ? "bg-[#013089] text-white font-bold"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
                }`}
              >
                {cat.label}
              </Link>
            );
          })}
        </div>

        <div className="max-w-3xl space-y-3">
          <SearchBar placeholder="Search government news, Rozgar Samachar, exam advisories, court rulings, or schemes..." />

          {/* Active Search Pill */}
          {params.search && (
            <div className="flex items-center gap-2 text-xs text-slate-700 bg-slate-100 border border-slate-200 px-3 py-1 rounded-xs w-fit">
              <span>
                Showing results for: <strong>&ldquo;{params.search}&rdquo;</strong> ({total} matches)
              </span>
              <Link
                href={buildClearSearchUrl(params)}
                className="text-slate-500 hover:text-slate-900 p-0.5 rounded-xs transition-colors"
                title="Clear search query"
              >
                <X className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Bulletins Grid / Empty State */}
      {bulletins.length > 0 ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {bulletins.map((bulletin) => (
              <BulletinCard key={bulletin.id} bulletin={bulletin} />
            ))}
          </div>

          {/* Pagination with parameter preservation */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-200 pt-6">
              <div className="text-xs text-slate-500">
                Showing page <span className="font-semibold text-slate-800">{currentPage}</span> of{" "}
                <span className="font-semibold text-slate-800">{totalPages}</span>
              </div>

              <div className="flex items-center gap-2">
                {currentPage > 1 && (
                  <Link href={buildPageUrl(params, currentPage - 1)}>
                    <Button variant="outline" size="sm" className="gap-1 text-xs">
                      <ChevronLeft className="h-4 w-4" />
                      <span>Previous</span>
                    </Button>
                  </Link>
                )}

                {currentPage < totalPages && (
                  <Link href={buildPageUrl(params, currentPage + 1)}>
                    <Button variant="outline" size="sm" className="gap-1 text-xs">
                      <span>Next</span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <EmptyState
            icon={Newspaper}
            title={params.search ? `No bulletins found for "${params.search}"` : "No Bulletins Found"}
            description={
              params.search
                ? "No news articles or bulletins matched your search query. Try searching with different keywords or clearing your search."
                : "There are currently no published bulletins matching this category. Please check back as official weekly releases and public notices are indexed."
            }
          />
          {(params.search || currentCategory !== "all") && (
            <div className="text-center">
              <Link href="/news">
                <Button variant="brand" size="sm">
                  Clear Search &amp; All Categories
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
