import { Metadata } from "next";
import Link from "next/link";
import { getPublicExams, getExamTaxonomies } from "@/modules/exams/service";
import { ExamCard } from "@/modules/exams/components/exam-card";
import { ExamFilterSidebar } from "@/modules/exams/components/exam-filter-sidebar";
import { SearchBar } from "@/components/shared/search-bar";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { constructMetadata } from "@/lib/seo";
import { Calendar, ChevronLeft, ChevronRight, X, Sparkles, BookOpen } from "lucide-react";

interface ExamsPageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    organization?: string;
    mode?: string;
    state?: string;
    page?: string;
  }>;
}

export async function generateMetadata({ searchParams }: ExamsPageProps): Promise<Metadata> {
  const params = await searchParams;
  let title = "Exams & Notifications 2026 - Official Exam Calendars & Schedules";
  if (params.search) {
    title = `Search: "${params.search}" - Exams & Notifications | SuchnaSetu`;
  }
  return constructMetadata({
    title,
    description:
      "Government exam notifications, schedules, eligibility and important dates direct from UPSC, SSC, State PSCs, and public authorities.",
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

  const [{ exams, total, totalPages }, taxonomies] = await Promise.all([
    getPublicExams({
      search: params.search,
      categorySlug: params.category,
      organizationSlug: params.organization,
      mode: params.mode,
      stateCode: params.state,
      page: currentPage,
      limit: 12,
    }),
    getExamTaxonomies(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Top Banner / Heading */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-slate-200 pb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-700">
            <Calendar className="h-4 w-4" />
            <span>Exams &amp; Notifications</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl font-heading mt-1">
            Exams &amp; Notifications
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Government exam notifications, schedules, eligibility and important dates direct from official commission gazettes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="brand" className="text-xs py-1 px-3">
            {total} Active {total === 1 ? "Notice" : "Notices"}
          </Badge>
        </div>
      </div>

      {/* Search Header */}
      <div className="max-w-4xl space-y-3">
        <SearchBar placeholder="Search by exam title, commission (UPSC, SSC), exam code, or syllabus topics..." />

        {/* Active Search Pill */}
        {params.search && (
          <div className="flex items-center gap-2 text-xs text-slate-600 bg-brand-50/70 border border-brand-200 px-3 py-1.5 rounded-lg w-fit">
            <span>
              Showing results for: <strong>&ldquo;{params.search}&rdquo;</strong> ({total} matches)
            </span>
            <Link
              href={buildClearSearchUrl(params)}
              className="text-slate-500 hover:text-slate-900 p-0.5 rounded transition-colors"
              title="Clear search query"
            >
              <X className="h-3.5 w-3.5" />
            </Link>
          </div>
        )}
      </div>

      {/* Main Content: Sidebar + Exam Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4 items-start">
        {/* Filter Sidebar */}
        <div className="w-full lg:w-72 flex-shrink-0">
          <ExamFilterSidebar
            categories={taxonomies.categories}
            organizations={taxonomies.organizations}
            states={taxonomies.states}
          />
        </div>

        {/* Exam Grid / Empty State */}
        <div className="lg:col-span-3 space-y-6">
          {exams.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                {exams.map((exam) => (
                  <ExamCard key={exam.id} exam={exam} />
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
            </>
          ) : (
            <div className="space-y-4">
              <EmptyState
                icon={Calendar}
                title={params.search ? `No exams found for "${params.search}"` : "No Examinations Found"}
                description={
                  params.search
                    ? "No official examination calendars matched your search query. Try searching with different keywords, commission acronyms (e.g. UPSC, SSC, BPSC), or clearing your search."
                    : "No official examination schedules match your filter criteria or search query. Try adjusting filters or searching with a different term."
                }
              />
              {(params.search || Object.keys(params).length > 0) && (
                <div className="text-center">
                  <Link href="/exams">
                    <Button variant="brand" size="sm">
                      Clear Search &amp; All Filters
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
