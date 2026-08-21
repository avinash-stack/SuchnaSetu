import { Metadata } from "next";
import Link from "next/link";
import { getPublicJobs, getJobTaxonomies } from "@/modules/jobs/service";
import { SearchBar } from "@/components/shared/search-bar";
import { JobsFilterSidebar } from "@/modules/jobs/components/jobs-filter-sidebar";
import { JobsListingContainer } from "@/modules/jobs/components/jobs-listing-container";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { constructMetadata } from "@/lib/seo";
import { Briefcase, ChevronLeft, ChevronRight, X } from "lucide-react";

interface JobsPageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    organization?: string;
    qualification?: string;
    state?: string;
    type?: string;
    page?: string;
    limit?: string;
  }>;
}

export async function generateMetadata({ searchParams }: JobsPageProps): Promise<Metadata> {
  const params = await searchParams;
  let title = "Government Jobs & Recruitment Notifications 2026 - Official Gazette Feeds";
  if (params.search) {
    title = `Search: "${params.search}" - Govt Jobs | SuchnaSetu`;
  }
  return constructMetadata({
    title,
    description:
      "Search verified government recruitment notifications from UPSC, SSC, State PSCs, High Courts, Banks, Railways, and Defence.",
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
  const parsedLimit = parseInt(params.limit || "20", 10);
  const currentLimit = [10, 20, 50, 100].includes(parsedLimit) ? parsedLimit : 20;

  const [{ jobs, total, totalPages }, taxonomies] = await Promise.all([
    getPublicJobs({
      search: params.search,
      categorySlug: params.category,
      organizationSlug: params.organization,
      qualificationSlug: params.qualification,
      stateCode: params.state,
      employmentType: params.type,
      page: currentPage,
      limit: currentLimit,
    }),
    getJobTaxonomies(),
  ]);

  return (
    <div className="min-h-screen">
      {/* 1. Compact Sticky Top Header & Search Bar */}
      <div className="sticky top-14 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs py-2.5 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 shrink-0">
            <Briefcase className="h-4 w-4 text-[#013089]" />
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 font-heading whitespace-nowrap">
              Government Jobs
            </h1>
            <Badge variant="navy" className="text-[10px] py-0.5 px-2">
              {total} Active
            </Badge>
          </div>

          <div className="w-full sm:max-w-lg flex items-center gap-2">
            <div className="flex-1">
              <SearchBar placeholder="Search job title, commission (UPSC, SSC, BSSC), or post..." />
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

      {/* 2. Main Body: Sticky Filter Sidebar + Job Listings */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4 items-start">
          {/* Sticky Filter Sidebar */}
          <aside className="w-full lg:w-72 flex-shrink-0 lg:sticky lg:top-28 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto pr-1 pb-4">
            <JobsFilterSidebar
              categories={taxonomies.categories}
              organizations={taxonomies.organizations}
              qualifications={taxonomies.qualifications}
              states={taxonomies.states}
            />
          </aside>

          {/* Job Notice Grid / List */}
          <div className="lg:col-span-3 space-y-6">
            {jobs.length > 0 ? (
              <>
                <JobsListingContainer jobs={jobs} total={total} currentLimit={currentLimit} />

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
                  icon={Briefcase}
                  title={params.search ? `No notifications found for "${params.search}"` : "No Openings Match Your Filters"}
                  description="Try adjusting your filters or search query to discover verified recruitment notices."
                />
                {(params.category || params.organization || params.state || params.type || params.search) && (
                  <div className="text-center">
                    <Link href="/jobs">
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
  );
}
