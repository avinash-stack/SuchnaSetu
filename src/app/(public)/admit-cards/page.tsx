import { Metadata } from "next";
import Link from "next/link";
import { getPublicAdmitCards } from "@/modules/admit-cards/service";
import { SearchBar } from "@/components/shared/search-bar";
import { EmptyState } from "@/components/shared/empty-state";
import { AdmitCardTable } from "@/components/shared/admit-card-table";
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
            <AdmitCardTable items={admitCards} />

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
