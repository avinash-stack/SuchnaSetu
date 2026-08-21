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
import { Newspaper, ChevronLeft, ChevronRight, X } from "lucide-react";

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
    description:
      "Official weekly Employment News digests, government scheme updates, exam notifications, education advisories, court stay orders, and verified public communiques.",
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
    <div className="min-h-screen">
      {/* 1. Compact Sticky Top Header & Search Bar */}
      <div className="sticky top-14 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs py-2.5 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 shrink-0">
            <Newspaper className="h-4 w-4 text-[#013089]" />
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 font-heading whitespace-nowrap">
              News &amp; Employment Advisories
            </h1>
            <Badge variant="navy" className="text-[10px] py-0.5 px-2">
              {total} Bulletins
            </Badge>
          </div>

          <div className="w-full sm:max-w-lg flex items-center gap-2">
            <div className="flex-1">
              <SearchBar placeholder="Search news headlines, PIB releases, or topics..." />
            </div>
            {params.search && (
              <Link
                href={buildClearSearchUrl(params)}
                className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1 bg-slate-100 border border-slate-200 px-2 py-1.5 rounded-md shrink-0"
                title="Clear search"
              >
                <X className="h-3.5 w-3.5" />
                <span className="hidden sm:inline text-[11px]">Clear</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* 2. Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          {BULLETIN_CATEGORIES.map((cat) => {
            const isActive = currentCategory === cat.key;
            return (
              <Link
                key={cat.key}
                href={buildCategoryUrl(params, cat.key)}
                className={`whitespace-nowrap rounded-md px-3 py-1 text-xs font-bold transition-all ${
                  isActive
                    ? "bg-[#013089] text-white shadow-xs"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {cat.label}
              </Link>
            );
          })}
        </div>

        {/* Bulletins Grid */}
        {bulletins.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {bulletins.map((bulletin) => (
                <BulletinCard key={bulletin.id} bulletin={bulletin} />
              ))}
            </div>

            {/* Pagination Controls */}
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
          </>
        ) : (
          <div className="space-y-4">
            <EmptyState
              icon={Newspaper}
              title={params.search ? `No bulletins found for "${params.search}"` : "No Bulletins in this Category"}
              description="No official news communiques match your current filters. Check back shortly for newly published gazette advisories."
            />
            {(currentCategory !== "all" || params.search) && (
              <div className="text-center">
                <Link href="/news">
                  <Button variant="brand" size="sm">
                    Reset Filters
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
