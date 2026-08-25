import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  fetchNewsFeed,
  fetchCategoryBySlug,
  fetchCategoryList,
} from "@/modules/news/services/news-query-service";
import { NewsHeader } from "@/modules/news/components/news-header";
import { NewsFeedCard } from "@/modules/news/components/news-feed-card";
import { EmptyState } from "@/components/shared/empty-state";
import { constructMetadata, buildBreadcrumbJsonLd } from "@/lib/seo";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
  searchParams: Promise<{
    page?: string;
  }>;
}

export const revalidate = 180;

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category: rawCategory } = await params;
  const category = await fetchCategoryBySlug(rawCategory);

  if (!category) {
    return constructMetadata({
      title: "Category Not Found | SuchnaSetu News",
      description: "The requested news category could not be found.",
    });
  }

  return constructMetadata({
    title: `${category.name} News & Updates — SuchnaSetu News`,
    description: `Latest verified news, policy decisions, and developments in ${category.name}.`,
    path: `/news/category/${category.slug}`,
    canonicalPath: `/news/category/${category.slug}`,
  });
}

export default async function NewsCategoryPage({ params, searchParams }: CategoryPageProps) {
  const { category: rawCategory } = await params;
  const sParams = await searchParams;
  const category = await fetchCategoryBySlug(rawCategory);

  if (!category) {
    notFound();
  }

  const currentPage = parseInt(sParams.page || "1", 10) || 1;
  const { articles, total, totalPages } = await fetchNewsFeed({
    category: category.slug,
    page: currentPage,
    limit: 15,
    sort: "latest",
  });

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "News", url: "/news" },
    { name: category.name, url: `/news/category/${category.slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="min-h-screen bg-slate-50/50 pb-16 font-sans">
        <NewsHeader />

        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          {/* Header Banner */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#013089]">
              News Category
            </span>
            <div className="flex items-baseline justify-between flex-wrap gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
                {category.name} <span className="text-slate-400 font-normal text-lg">({category.name_hi})</span>
              </h1>
              <span className="text-xs text-slate-500 font-mono font-medium">
                {total} Articles Total
              </span>
            </div>
            {category.description && (
              <p className="text-sm text-slate-600 max-w-2xl">{category.description}</p>
            )}
          </div>

          {/* Articles Stream */}
          {articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {articles.map((article) => (
                <NewsFeedCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <EmptyState
              title={`No articles yet in ${category.name}`}
              description="New stories will appear here as soon as they are published by our verified sources."
            />
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              {currentPage > 1 && (
                <Link
                  href={`/news/category/${category.slug}?page=${currentPage - 1}`}
                  className="px-4 py-2 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 inline-flex items-center gap-1 shadow-2xs"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Previous</span>
                </Link>
              )}

              <span className="text-xs font-bold text-slate-600 px-3">
                Page {currentPage} of {totalPages}
              </span>

              {currentPage < totalPages && (
                <Link
                  href={`/news/category/${category.slug}?page=${currentPage + 1}`}
                  className="px-4 py-2 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 inline-flex items-center gap-1 shadow-2xs"
                >
                  <span>Next</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              )}
            </div>
          )}
        </main>
      </div>
    </>
  );
}
