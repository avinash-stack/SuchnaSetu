import { Metadata } from "next";
import Link from "next/link";
import { getPublicBulletins } from "@/modules/bulletins/service";
import { BulletinCard } from "@/modules/bulletins/components/bulletin-card";
import { BULLETIN_CATEGORIES } from "@/modules/bulletins/index";
import { BulletinCategory } from "@/modules/bulletins/types";
import { SearchBar } from "@/components/shared/search-bar";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { constructMetadata } from "@/lib/seo";
import { Newspaper, ChevronLeft, ChevronRight, Flame, Scale, Users, Briefcase } from "lucide-react";

interface NewsPageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    page?: string;
  }>;
}

export async function generateMetadata({ searchParams }: NewsPageProps): Promise<Metadata> {
  const params = await searchParams;
  let title = "Employment News (Rozgar Samachar) & Student Advisories";
  if (params.category) {
    const cat = BULLETIN_CATEGORIES.find((c) => c.key === params.category);
    if (cat) title = `${cat.label} | SuchnaSetu`;
  }
  return constructMetadata({
    title,
    description: "Official weekly Employment News digests, commission statements on student representations, exam cancellations, court stay orders, and verified public bulletins.",
    path: "/news",
  });
}

export default async function PublicNewsPage({ searchParams }: NewsPageProps) {
  const params = await searchParams;
  const currentPage = parseInt(params.page || "1", 10) || 1;
  const currentCategory = (params.category || "all") as BulletinCategory | "all";

  const { bulletins, total, totalPages } = await getPublicBulletins({
    category: currentCategory,
    search: params.search,
    page: currentPage,
    limit: 12,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Heading */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-slate-200 pb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-700">
            <Newspaper className="h-4 w-4" />
            <span>Information Desk & Bulletins</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl font-heading mt-1">
            Employment News & Student Advisories
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Weekly Rozgar Samachar digests, official statements on student protests & representations, court rulings on exams, and verified PIB releases.
          </p>
        </div>

        <Badge variant="brand" className="text-xs py-1 px-3">
          {total} Active Bulletins
        </Badge>
      </div>

      {/* Category Pills & Search Bar */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
          <Link
            href="/news"
            className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors ${
              currentCategory === "all"
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            All Updates
          </Link>

          {BULLETIN_CATEGORIES.map((cat) => {
            const isActive = currentCategory === cat.key;
            return (
              <Link
                key={cat.key}
                href={`/news?category=${cat.key}`}
                className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                  isActive
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {cat.label}
              </Link>
            );
          })}
        </div>

        <div className="max-w-3xl">
          <SearchBar placeholder="Search employment news, student advisories, court stay orders, or commission statements..." />
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-200 pt-6">
              <div className="text-xs text-slate-500">
                Showing page <span className="font-semibold text-slate-800">{currentPage}</span> of{" "}
                <span className="font-semibold text-slate-800">{totalPages}</span>
              </div>

              <div className="flex items-center gap-2">
                {currentPage > 1 && (
                  <Link href={`/news?page=${currentPage - 1}&category=${currentCategory}`}>
                    <Button variant="outline" size="sm" className="gap-1 text-xs">
                      <ChevronLeft className="h-4 w-4" />
                      <span>Previous</span>
                    </Button>
                  </Link>
                )}

                {currentPage < totalPages && (
                  <Link href={`/news?page=${currentPage + 1}&category=${currentCategory}`}>
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
        <EmptyState
          icon={Newspaper}
          title="No Bulletins Found"
          description="There are currently no published bulletins matching this category. Please check back as official weekly releases and student advisories are indexed."
        />
      )}
    </div>
  );
}
