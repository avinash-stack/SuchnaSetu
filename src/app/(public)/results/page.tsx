import { Metadata } from "next";
import Link from "next/link";
import { getPublicResults } from "@/modules/results/service";
import { SearchBar } from "@/components/shared/search-bar";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { constructMetadata, buildBreadcrumbJsonLd } from "@/lib/seo";
import { formatDate } from "@/lib/utils";
import {
  Award,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  X,
  MapPin,
  FileCheck2,
  ShieldCheck,
} from "lucide-react";

interface ResultsPageProps {
  searchParams: Promise<{
    search?: string;
    state?: string;
    page?: string;
    limit?: string;
  }>;
}

export async function generateMetadata({ searchParams }: ResultsPageProps): Promise<Metadata> {
  const params = await searchParams;
  let title = "Government Exam Results & Merit Lists 2026 - Official Cutoffs";
  if (params.search) {
    title = `Search: "${params.search}" - Exam Results | SuchnaSetu`;
  }
  return constructMetadata({
    title,
    description:
      "Direct official scorecards, final merit lists, selection lists, cutoff announcements, and answer keys across central and state recruitment authorities.",
    path: "/results",
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
  return qs ? `/results?${qs}` : "/results";
}

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

export default async function PublicResultsPage({ searchParams }: ResultsPageProps) {
  const params = await searchParams;
  const currentPage = parseInt(params.page || "1", 10) || 1;
  const parsedLimit = parseInt(params.limit || "20", 10);
  const currentLimit = PAGE_SIZE_OPTIONS.includes(parsedLimit) ? parsedLimit : 20;

  const { results, total, totalPages } = await getPublicResults({
    search: params.search,
    stateCode: params.state,
    page: currentPage,
    limit: currentLimit,
  });

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Results & Merit Lists", url: "/results" },
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
            <Award className="h-4 w-4 text-[#013089]" />
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 font-heading whitespace-nowrap">
              Results &amp; Merit Lists
            </h1>
            <Badge variant="navy" className="text-[10px] py-0.5 px-2">
              {total} Declared
            </Badge>
          </div>

          <div className="w-full sm:max-w-lg flex items-center gap-2">
            <div className="flex-1">
              <SearchBar placeholder="Search result, commission (UPSC, SSC, BSSC), or post..." />
            </div>
            {params.search && (
              <Link
                href="/results"
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
        {results.length > 0 ? (
          <>
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                      <th className="py-2.5 px-4">Authority &amp; Recruitment Result</th>
                      <th className="py-2.5 px-4">State / Jurisdiction</th>
                      <th className="py-2.5 px-4">Status</th>
                      <th className="py-2.5 px-4 text-right">Official Document</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {results.map((item) => {
                      const orgName = item.organization?.acronym || item.organization?.name || "Official Body";
                      return (
                        <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3 px-4 align-top max-w-md">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <Badge variant="brand" className="text-[10px] font-bold py-0 px-2 bg-[#013089] text-white">
                                  {orgName}
                                </Badge>
                                {item.code && (
                                  <span className="font-mono text-[11px] text-slate-500 font-semibold">
                                    {item.code}
                                  </span>
                                )}
                              </div>
                              <Link
                                href={`/jobs/${item.slug}`}
                                className="block font-bold text-slate-900 hover:text-[#013089] text-sm leading-snug transition-colors"
                              >
                                {item.title}
                              </Link>
                              {item.published_at && (
                                <p className="text-[11px] text-slate-400">
                                  Published: {formatDate(item.published_at)}
                                </p>
                              )}
                            </div>
                          </td>

                          <td className="py-3 px-4 align-top text-slate-600">
                            <div className="flex items-center gap-1 text-slate-600">
                              <MapPin className="h-3.5 w-3.5 text-slate-400" />
                              <span>{item.state_code || "National"}</span>
                            </div>
                          </td>

                          <td className="py-3 px-4 align-top">
                            <Badge variant="success" className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 border-emerald-200">
                              <ShieldCheck className="h-3 w-3 mr-1" />
                              {item.status}
                            </Badge>
                          </td>

                          <td className="py-3 px-4 align-top text-right">
                            {item.result_url && (
                              <a
                                href={item.result_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center font-bold rounded-md h-7 px-3 text-xs bg-[#013089] hover:bg-[#01276E] text-white shadow-xs transition-all gap-1.5"
                              >
                                <FileCheck2 className="h-3.5 w-3.5" />
                                <span>View Gazette</span>
                                <ExternalLink className="h-3 w-3 ml-0.5" />
                              </a>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

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
              icon={Award}
              title={params.search ? `No results found for "${params.search}"` : "No Results Currently Published"}
              description="No official exam results or merit lists match your current search query. Check back shortly as new commission gazettes are declared."
            />
            {params.search && (
              <div className="text-center">
                <Link href="/results">
                  <Button variant="brand" size="sm">
                    Clear Search
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
    </>
  );
}
