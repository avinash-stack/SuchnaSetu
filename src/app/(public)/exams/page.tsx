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
import { Calendar, ChevronLeft, ChevronRight, Sparkles, BookOpen } from "lucide-react";

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
  let title = "Government Examinations 2026 - Official Exam Calendars & Schedules";
  if (params.search) {
    title = `Search: "${params.search}" - Govt Exams | SuchnaSetu`;
  }
  return constructMetadata({
    title,
    description:
      "Structured government examination calendars, syllabus breakdown, shift schedules, eligibility criteria, and verified official PDF circulars from UPSC, SSC, State PSCs, and Railways.",
    path: "/exams",
  });
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
            <span>Official Examination Module</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl font-heading mt-1">
            Government Examinations & Schedules
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Authentic examination calendars, multi-stage test patterns, shift schedules, and syllabus summaries direct from official commission gazettes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="brand" className="text-xs py-1 px-3">
            {total} Active {total === 1 ? "Examination" : "Examinations"}
          </Badge>
        </div>
      </div>

      {/* Search Header */}
      <div className="max-w-4xl">
        <SearchBar placeholder="Search by exam title, commission (UPSC, SSC), exam code, or syllabus topics..." />
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {exams.map((exam) => (
                  <ExamCard key={exam.id} exam={exam} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-slate-200 pt-6">
                  <div className="text-xs text-slate-500">
                    Showing page <span className="font-bold text-slate-800">{currentPage}</span> of{" "}
                    <span className="font-bold text-slate-800">{totalPages}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {currentPage > 1 && (
                      <Link
                        href={`/exams?page=${currentPage - 1}${
                          params.search ? `&search=${params.search}` : ""
                        }${params.organization ? `&organization=${params.organization}` : ""}${
                          params.category ? `&category=${params.category}` : ""
                        }${params.mode ? `&mode=${params.mode}` : ""}${
                          params.state ? `&state=${params.state}` : ""
                        }`}
                      >
                        <Button variant="outline" size="sm" className="gap-1">
                          <ChevronLeft className="h-4 w-4" />
                          <span>Previous</span>
                        </Button>
                      </Link>
                    )}

                    {currentPage < totalPages && (
                      <Link
                        href={`/exams?page=${currentPage + 1}${
                          params.search ? `&search=${params.search}` : ""
                        }${params.organization ? `&organization=${params.organization}` : ""}${
                          params.category ? `&category=${params.category}` : ""
                        }${params.mode ? `&mode=${params.mode}` : ""}${
                          params.state ? `&state=${params.state}` : ""
                        }`}
                      >
                        <Button variant="outline" size="sm" className="gap-1">
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
                title="No examinations found"
                description="No official examination schedules match your filter criteria or search query. Try adjusting filters or searching with a different term."
              />
              <div className="text-center">
                <Link href="/exams">
                  <Button variant="primary" size="sm">
                    View All Examinations
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
