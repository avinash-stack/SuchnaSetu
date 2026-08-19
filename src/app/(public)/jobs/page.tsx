import { Metadata } from "next";
import Link from "next/link";
import { getPublicJobs, getJobTaxonomies } from "@/modules/jobs/service";
import { JobCard } from "@/modules/jobs/components/job-card";
import { JobsFilterSidebar } from "@/modules/jobs/components/jobs-filter-sidebar";
import { SearchBar } from "@/components/shared/search-bar";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { constructMetadata } from "@/lib/seo";
import { Briefcase, Filter, ChevronLeft, ChevronRight, X, Sparkles } from "lucide-react";

interface JobsPageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    organization?: string;
    qualification?: string;
    state?: string;
    type?: string;
    page?: string;
  }>;
}

export async function generateMetadata({ searchParams }: JobsPageProps): Promise<Metadata> {
  const params = await searchParams;
  let title = "Government Jobs 2026 - Official Recruitment Notifications";
  if (params.search) {
    title = `Search: "${params.search}" - Govt Jobs | SuchnaSetu`;
  }
  return constructMetadata({
    title,
    description: "Verified central and state government recruitment notifications, post vacancies, eligibility criteria, and direct official PDF notices.",
    path: "/jobs",
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
  return qs ? `/jobs?${qs}` : "/jobs";
}

function buildClearSearchUrl(params: Record<string, string | undefined>) {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v && k !== "search" && k !== "page") q.set(k, v);
  });
  const qs = q.toString();
  return qs ? `/jobs?${qs}` : "/jobs";
}

export default async function PublicJobsPage({ searchParams }: JobsPageProps) {
  const params = await searchParams;
  const currentPage = parseInt(params.page || "1", 10) || 1;

  const [{ jobs, total, totalPages }, taxonomies] = await Promise.all([
    getPublicJobs({
      search: params.search,
      categorySlug: params.category,
      organizationSlug: params.organization,
      qualificationSlug: params.qualification,
      stateCode: params.state,
      employmentType: params.type,
      page: currentPage,
      limit: 12,
    }),
    getJobTaxonomies(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Top Banner / Heading */}
      <div className="section-saffron-bar flex flex-col md:flex-row md:items-end justify-between border-b border-slate-200 pb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#013089]">
            <Briefcase className="h-4 w-4" />
            <span>Official Recruitment Module</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F172A] font-heading mt-1">
            Government Jobs &amp; Recruitment Notifications
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Structured notifications aggregated from UPSC, SSC, State PSCs, High Courts, Banks, and Defence. Every notice links directly to official government PDFs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="navy" className="text-xs py-1 px-2.5">
            {total} Active {total === 1 ? "Notice" : "Notices"}
          </Badge>
        </div>
      </div>

      {/* Search Header */}
      <div className="max-w-3xl space-y-3">
        <SearchBar placeholder="Search by job title, organization (UPSC, SSC, BSSC), post name, or reference..." />

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

      {/* Main Content: Sidebar + Job Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4 items-start">
        {/* Filter Sidebar */}
        <div className="w-full lg:w-72 flex-shrink-0">
          <JobsFilterSidebar
            categories={taxonomies.categories}
            organizations={taxonomies.organizations}
            qualifications={taxonomies.qualifications}
            states={taxonomies.states}
          />
        </div>

        {/* Notice Grid / Empty State */}
        <div className="lg:col-span-3 space-y-6">
          {jobs.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                {jobs.map((job) => (
                  <JobCard key={job.id} job={job} />
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
                icon={Briefcase}
                title={params.search ? `No results for "${params.search}"` : "No Government Job Notices Found"}
                description={
                  params.search
                    ? "No official recruitment notices matched your search query. Try searching with alternative keywords, acronyms (e.g. UPSC, SSC, RRB), or clearing your search."
                    : "There are currently no published official job notices matching your selected filters. Try clearing your filters or checking back as new gazette releases are published."
                }
              />
              {(params.search || Object.keys(params).length > 0) && (
                <div className="text-center">
                  <Link href="/jobs">
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
