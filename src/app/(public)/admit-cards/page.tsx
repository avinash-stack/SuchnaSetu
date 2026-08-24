import { Metadata } from "next";
import Link from "next/link";
import { getPublicAdmitCards } from "@/modules/admit-cards/service";
import { SearchBar } from "@/components/shared/search-bar";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { constructMetadata, buildBreadcrumbJsonLd } from "@/lib/seo";
import { formatDate } from "@/lib/utils";
import {
  FileText,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  X,
  MapPin,
  Download,
  ShieldCheck,
} from "lucide-react";

interface AdmitCardsPageProps {
  searchParams: Promise<{
    search?: string;
    state?: string;
    page?: string;
    limit?: string;
  }>;
}

export async function generateMetadata({ searchParams }: AdmitCardsPageProps): Promise<Metadata> {
  const params = await searchParams;
  let title = "Admit Cards 2026 - Government Exams & Recruitment Hall Tickets";
  if (params.search) {
    title = `Search: "${params.search}" - Admit Cards | SuchnaSetu`;
  }
  return constructMetadata({
    title,
    description:
      "Direct official links to download government exam admit cards, hall tickets, call letters, and test venue intimation slips.",
    path: "/admit-cards",
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
  return qs ? `/admit-cards?${qs}` : "/admit-cards";
}

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

export default async function PublicAdmitCardsPage({ searchParams }: AdmitCardsPageProps) {
  const params = await searchParams;
  const currentPage = parseInt(params.page || "1", 10) || 1;
  const parsedLimit = parseInt(params.limit || "20", 10);
  const currentLimit = PAGE_SIZE_OPTIONS.includes(parsedLimit) ? parsedLimit : 20;

  const { admitCards, total, totalPages } = await getPublicAdmitCards({
    search: params.search,
    stateCode: params.state,
    page: currentPage,
    limit: currentLimit,
  });

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Admit Cards", url: "/admit-cards" },
  ];
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbs);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="min-h-screen">
      {/* 1. Header & Search Bar */}
      <div className="bg-white border-b border-slate-200 py-6 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-[#013089]" />
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 font-heading">
                Admit Cards &amp; Hall Tickets
              </h1>
              <Badge variant="navy" className="text-xs font-bold py-0.5 px-2.5">
                {total} Available
              </Badge>
            </div>
            <p className="text-sm text-slate-600">
              Direct official commission links to download exam call letters and venue slips.
            </p>
          </div>

          <div className="w-full sm:max-w-md flex items-center gap-2">
            <div className="flex-1">
              <SearchBar placeholder="Search by exam, commission, or post..." />
            </div>
            {params.search && (
              <Link
                href="/admit-cards"
                className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1 bg-slate-100 border border-slate-200 px-3 py-2 rounded-lg shrink-0 font-semibold"
                title="Clear search"
              >
                <X className="h-4 w-4" />
                <span className="hidden sm:inline">Clear</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* 2. Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        {admitCards.length > 0 ? (
          <>
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse table-fixed">
                  <thead>
                    <tr className="bg-slate-100/90 border-b border-slate-200 text-xs sm:text-[13px] font-bold text-slate-700 uppercase tracking-wider">
                      <th className="py-3.5 px-4 w-[46%]">Authority &amp; Examination</th>
                      <th className="py-3.5 px-4 w-[20%]">State / Jurisdiction</th>
                      <th className="py-3.5 px-4 w-[16%]">Status</th>
                      <th className="py-3.5 px-4 w-[18%] text-right">Official Download</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800">
                    {admitCards.map((item) => {
                      const orgName = item.organization?.acronym || item.organization?.name || "Official Body";
                      return (
                        <tr key={item.id} className="hover:bg-slate-50/90 transition-colors">
                          <td className="py-4 px-4 align-top">
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-2 flex-wrap">
                                <Badge variant="brand" className="text-xs font-bold py-0.5 px-2 bg-[#013089] text-white">
                                  {orgName}
                                </Badge>
                                {item.code && (
                                  <span className="font-mono text-xs text-slate-500 font-semibold">
                                    {item.code}
                                  </span>
                                )}
                              </div>
                              <Link
                                href={`/exams/${item.slug}`}
                                className="block font-bold text-slate-900 hover:text-[#013089] text-[15px] sm:text-base leading-snug transition-colors line-clamp-2"
                              >
                                {item.title}
                              </Link>
                              {item.published_at && (
                                <p className="text-xs text-slate-400 font-mono">
                                  Updated: {formatDate(item.published_at)}
                                </p>
                              )}
                            </div>
                          </td>

                          <td className="py-4 px-4 align-top text-slate-600">
                            <div className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-600 font-medium">
                              <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                              <span>{item.state_code || "National"}</span>
                            </div>
                          </td>

                          <td className="py-4 px-4 align-top">
                            <Badge variant="success" className="text-xs font-semibold bg-emerald-50 text-emerald-700 border-emerald-200">
                              <ShieldCheck className="h-3.5 w-3.5 mr-1" />
                              {item.status}
                            </Badge>
                          </td>

                          <td className="py-4 px-4 align-top text-right whitespace-nowrap">
                            {item.admit_card_url && (
                              <a
                                href={item.admit_card_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center font-bold rounded-lg h-8 px-3.5 text-xs sm:text-[13px] bg-[#013089] hover:bg-[#01276E] text-white shadow-2xs transition-all gap-1.5"
                              >
                                <Download className="h-3.5 w-3.5" />
                                <span>Download Slip</span>
                                <ExternalLink className="h-3 w-3" />
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
                <div className="text-sm text-slate-500">
                  Showing page <span className="font-semibold text-slate-800">{currentPage}</span> of{" "}
                  <span className="font-semibold text-slate-800">{totalPages}</span> ({currentLimit} per page)
                </div>

                <div className="flex items-center gap-2">
                  {currentPage > 1 && (
                    <Link href={buildPageUrl(params, currentPage - 1)}>
                      <Button variant="outline" size="sm" className="gap-1 text-sm font-semibold">
                        <ChevronLeft className="h-4 w-4" />
                        <span>Previous</span>
                      </Button>
                    </Link>
                  )}

                  {currentPage < totalPages && (
                    <Link href={buildPageUrl(params, currentPage + 1)}>
                      <Button variant="outline" size="sm" className="gap-1 text-sm font-semibold">
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
              icon={FileText}
              title={params.search ? `No admit cards found for "${params.search}"` : "No Admit Cards Currently Available"}
              description="No active examination admit cards match your current search query. Check back shortly as commission calendars are synchronized."
            />
            {params.search && (
              <div className="text-center">
                <Link href="/admit-cards">
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
