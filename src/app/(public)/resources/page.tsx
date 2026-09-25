import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { getPublicResources, getResourceCategories } from "@/modules/resources/service";
import { ResourceCard } from "@/modules/resources/components/resource-card";
import { ResourceFilterPills } from "@/modules/resources/components/resource-filter-pills";
import { constructMetadata, buildBreadcrumbJsonLd } from "@/lib/seo";
import { Search, BookOpen, ChevronLeft, ChevronRight, Sparkles, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

export const revalidate = 120; // 2 minutes ISR cache

interface ResourcesPageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    page?: string;
  }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return constructMetadata({
    title: "Career Guidance & Examination Resources — Official Study Roadmaps & Pay Guides",
    description:
      "Authoritative career preparation strategies, 7th Pay Commission salary structures, syllabus breakdowns, and eligibility guides for Indian competitive examinations (UPSC, SSC, Railway, Banking, State PSCs).",
    path: "/resources",
    keywords: [
      "career guidance",
      "sarkari naukri preparation",
      "ssc cgl study plan",
      "upsc eligibility rules",
      "7th pay commission salary",
      "rrb alp syllabus",
      "bank po vs ssc cgl",
    ],
  });
}

export default async function ResourcesPage(props: ResourcesPageProps) {
  const searchParams = await props.searchParams;
  const category = searchParams.category;
  const search = searchParams.search;
  const currentPage = parseInt(searchParams.page || "1", 10) || 1;

  const [categories, result] = await Promise.all([
    getResourceCategories(),
    getPublicResources({
      category,
      search,
      page: currentPage,
      limit: 12,
    }),
  ]);

  const { items: resources, total, totalPages } = result;
  const featuredResource = !search && (!category || category === "all") && currentPage === 1 ? resources[0] : null;
  const standardResources = featuredResource ? resources.slice(1) : resources;

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Career Resources", url: "/resources" },
  ];

  function buildPageUrl(targetPage: number) {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (search) params.set("search", search);
    params.set("page", targetPage.toString());
    return `/resources?${params.toString()}`;
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-16">
      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildBreadcrumbJsonLd(breadcrumbs)),
        }}
      />

      {/* 1. HERO SECTION */}
      <header className="border-b border-slate-200/80 bg-linear-to-b from-white via-slate-50/50 to-slate-100/50 pt-8 pb-10 sm:pt-12 sm:pb-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-3 py-1 text-xs font-semibold text-[#013089]">
              <Sparkles className="h-3.5 w-3.5 text-[#FE8D01]" />
              <span>SuchnaSetu Career &amp; Aspirant Resources Desk</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 font-heading">
              Career Guidance &amp; Examination Resources
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              Exhaustive preparation blueprints, 7th CPC salary breakdowns, reservation eligibility rules, and syllabus analyses grounded in official commission notifications.
            </p>
          </div>

          {/* Search Bar */}
          <div className="mt-6 max-w-xl">
            <form action="/resources" method="GET" className="relative flex items-center">
              <Search className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                name="search"
                defaultValue={search || ""}
                placeholder="Search topics (e.g. SSC CGL roadmap, Pay Level 7, UPSC attempts)..."
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-24 text-sm text-slate-900 placeholder:text-slate-400 shadow-2xs focus:border-[#013089] focus:outline-hidden focus:ring-1 focus:ring-[#013089]"
              />
              <button
                type="submit"
                className="absolute right-1.5 rounded-lg bg-[#013089] px-3 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-[#01256b] transition-colors"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* 2. CATEGORY FILTER BAR */}
      <section className="sticky top-16 z-20 border-b border-slate-200 bg-white/95 backdrop-blur-xs py-3 shadow-2xs">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ResourceFilterPills categories={categories} currentCategory={category} />
        </div>
      </section>

      {/* 3. MAIN CONTENT CONTAINER */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 space-y-10">
        {/* Results Header */}
        <div className="flex items-center justify-between">
          <div className="text-xs text-slate-500 font-medium">
            Showing <span className="font-bold text-slate-800">{resources.length}</span> of{" "}
            <span className="font-bold text-slate-800">{total}</span> guides
            {category && category !== "all" && (
              <span> in <strong className="text-slate-800">{categories.find((c) => c.slug === category)?.name}</strong></span>
            )}
            {search && (
              <span> matching &ldquo;<strong className="text-slate-800">{search}</strong>&rdquo;</span>
            )}
          </div>

          {(category || search) && (
            <Link href="/resources" className="text-xs font-semibold text-[#013089] hover:underline">
              Clear Filters
            </Link>
          )}
        </div>

        {/* Featured Spotlight Card */}
        {featuredResource && (
          <section aria-label="Featured Guide">
            <ResourceCard resource={featuredResource} featured={true} />
          </section>
        )}

        {/* Standard Grid */}
        {standardResources.length > 0 ? (
          <section aria-label="Career Resources Grid" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {standardResources.map((res) => (
              <ResourceCard key={res.id} resource={res} />
            ))}
          </section>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center space-y-4 shadow-2xs">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <Compass className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-heading">
              No Career Guides Found
            </h3>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              We couldn&apos;t find any guides matching your criteria. Try resetting your search query or exploring our standard tracks.
            </p>
            <div className="pt-2">
              <Link href="/resources">
                <Button variant="brand" size="sm">
                  View All Guides
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-200 pt-6">
            <div className="text-xs text-slate-500">
              Page <span className="font-semibold text-slate-800">{currentPage}</span> of{" "}
              <span className="font-semibold text-slate-800">{totalPages}</span>
            </div>

            <div className="flex items-center gap-2">
              {currentPage > 1 && (
                <Link href={buildPageUrl(currentPage - 1)}>
                  <Button variant="outline" size="sm" className="gap-1 text-xs">
                    <ChevronLeft className="h-4 w-4" />
                    <span>Previous</span>
                  </Button>
                </Link>
              )}

              {currentPage < totalPages && (
                <Link href={buildPageUrl(currentPage + 1)}>
                  <Button variant="outline" size="sm" className="gap-1 text-xs">
                    <span>Next</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Cross-linking Banner to Jobs & Exams */}
        <section className="rounded-2xl border border-blue-200 bg-linear-to-r from-blue-50 to-indigo-50 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-2xs">
          <div className="space-y-1.5 max-w-xl">
            <h3 className="text-lg font-bold text-slate-900 font-heading">
              Ready to Apply for Government Openings?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Explore 1,600+ verified active vacancies and upcoming examination timetables directly from official commission gazettes.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link href="/jobs">
              <Button variant="brand" size="sm" className="text-xs font-semibold">
                Browse Vacancies
              </Button>
            </Link>
            <Link href="/exams">
              <Button variant="outline" size="sm" className="text-xs font-semibold bg-white">
                Exam Timetables
              </Button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
