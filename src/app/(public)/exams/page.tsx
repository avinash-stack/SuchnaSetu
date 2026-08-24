import { Metadata } from "next";
import Link from "next/link";
import { getPublicExams, getExamTaxonomies } from "@/modules/exams/service";
import { SearchBar } from "@/components/shared/search-bar";
import { ExamFilterSidebar } from "@/modules/exams/components/exam-filter-sidebar";
import { ExamsListingContainer } from "@/modules/exams/components/exams-listing-container";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { constructMetadata, buildBreadcrumbJsonLd } from "@/lib/seo";
import { Calendar, ChevronLeft, ChevronRight, X } from "lucide-react";

export const revalidate = 120; // 2 minutes ISR cache for instant mobile listing rendering

interface ExamsPageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    organization?: string;
    state?: string;
    mode?: string;
    page?: string;
    limit?: string;
  }>;
}

export async function generateMetadata({ searchParams }: ExamsPageProps): Promise<Metadata> {
  const params = await searchParams;
  let title = "Official Examination Calendar 2026 - Central & State Commission Schedules";
  if (params.search) {
    title = `Search: "${params.search}" - Exam Schedules | SuchnaSetu`;
  }
  return constructMetadata({
    title,
    description:
      "Official examination dates, stages, and admit card notices published by UPSC, SSC, State PSCs, High Courts, and NTA.",
    path: "/exams",
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
  return qs ? `/exams?${qs}` : "/exams";
}

function buildClearSearchUrl(params: Record<string, string | undefined>) {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v && k !== "search" && k !== "page") q.set(k, v);
  });
  const qs = q.toString();
  return qs ? `/exams?${qs}` : "/exams";
}

export default async function PublicExamsPage({ searchParams }: ExamsPageProps) {
  const params = await searchParams;
  const currentPage = parseInt(params.page || "1", 10) || 1;
  const parsedLimit = parseInt(params.limit || "20", 10);
  const currentLimit = [10, 20, 50, 100].includes(parsedLimit) ? parsedLimit : 20;

  const [{ exams, total, totalPages }, taxonomies] = await Promise.all([
    getPublicExams({
      search: params.search,
      categorySlug: params.category,
      organizationSlug: params.organization,
      stateCode: params.state,
      mode: params.mode,
      page: currentPage,
      limit: currentLimit,
    }),
    getExamTaxonomies(),
  ]);

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Government Exams", url: "/exams" },
  ];
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbs);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="min-h-screen">
      {/* 1. Compact Sticky Top Header & Search Bar */}
      <div className="sticky top-14 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs py-2.5 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 shrink-0">
            <Calendar className="h-4 w-4 text-[#013089]" />
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 font-heading whitespace-nowrap">
              Examination Calendar
            </h1>
            <Badge variant="navy" className="text-[10px] py-0.5 px-2">
              {total} Schedules
            </Badge>
          </div>

          <div className="w-full sm:max-w-lg flex items-center gap-2">
            <div className="flex-1">
              <SearchBar placeholder="Search exam name, commission (UPSC, SSC, BPSC), or code..." />
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

      {/* 2. Main Body: Sticky Filter Sidebar + Exam Listings */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4 items-start">
          {/* Sticky Filter Sidebar */}
          <aside className="w-full min-w-0 lg:sticky lg:top-28 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto pr-1 pb-4">
            <ExamFilterSidebar
              categories={taxonomies.categories}
              organizations={taxonomies.organizations}
              states={taxonomies.states}
            />
          </aside>

          {/* Exam Grid / List */}
          <div className="w-full min-w-0 lg:col-span-3 space-y-6">
            {exams.length > 0 ? (
              <>
                <ExamsListingContainer exams={exams} total={total} currentLimit={currentLimit} />

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between border-t border-slate-200 pt-6">
                    <div className="text-xs text-slate-500">
                      Showing page <span className="font-semibold text-slate-800">{currentPage}</span> of{" "}
                      <span className="font-semibold text-slate-800">{totalPages}</span> ({currentLimit} per page)
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
                  icon={Calendar}
                  title={params.search ? `No exams found for "${params.search}"` : "No Examination Schedules Match Your Filters"}
                  description="Try adjusting your filters or search query to find upcoming examination schedules."
                />
                {(params.category || params.organization || params.state || params.mode || params.search) && (
                  <div className="text-center">
                    <Link href="/exams">
                      <Button variant="brand" size="sm">
                        Reset All Filters
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
