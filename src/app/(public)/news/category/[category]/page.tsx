import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  fetchNewsFeed,
  fetchCategoryBySlug,
} from "@/modules/news/services/news-query-service";
import { NewsHeader } from "@/modules/news/components/news-header";
import { NewsListViewItem } from "@/modules/news/components/news-list-view-item";
import { NewsPagination } from "@/modules/news/components/news-pagination";
import { NewsLanguageFilter } from "@/modules/news/components/news-language-filter";
import { EmptyState } from "@/components/shared/empty-state";
import { constructMetadata, buildBreadcrumbJsonLd } from "@/lib/seo";

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
  searchParams: Promise<{
    page?: string;
    limit?: string;
    lang?: string;
  }>;
}

export const revalidate = 180;

export async function generateMetadata({ params, searchParams }: CategoryPageProps): Promise<Metadata> {
  const { category: rawCategory } = await params;
  const sParams = await searchParams;
  const isHindi = sParams.lang === "hi";
  const category = await fetchCategoryBySlug(rawCategory);

  if (!category) {
    return constructMetadata({
      title: "Category Not Found | SuchnaSetu News",
      description: "The requested news category could not be found.",
    });
  }

  return constructMetadata({
    title: isHindi
      ? `${category.name_hi || category.name} समाचार एवं अपडेट — SuchnaSetu News`
      : `${category.name} News & Policy Updates — SuchnaSetu News`,
    description: isHindi
      ? `${category.name_hi || category.name} से संबंधित नवीनतम सत्यापित समाचार एवं नीतियां।`
      : `Latest verified news, policy decisions, and national developments in ${category.name}.`,
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

  const currentPage = Math.max(1, parseInt(sParams.page || "1", 10) || 1);
  const rawLimit = parseInt(sParams.limit || "20", 10);
  const limit = [20, 50, 100].includes(rawLimit) ? rawLimit : 20;
  const lang = sParams.lang === "hi" ? "hi" : "en";
  const isHindi = lang === "hi";

  const { articles, total, totalPages } = await fetchNewsFeed({
    category: category.slug,
    page: currentPage,
    limit,
    sort: "latest",
    lang,
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

        <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {/* Header Banner */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-2xs space-y-3">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider text-[#013089]">
                {isHindi ? "समाचार श्रेणी" : "News Desk"}
              </span>
              <NewsLanguageFilter
                currentLang={lang}
                pathname={`/news/category/${category.slug}`}
                searchParams={sParams}
              />
            </div>

            <div className="flex items-baseline justify-between flex-wrap gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
                {isHindi ? (category.name_hi || category.name) : category.name}{" "}
                <span className="text-slate-400 font-normal text-lg">
                  ({isHindi ? category.name : category.name_hi})
                </span>
              </h1>
              <span className="text-xs text-slate-500 font-mono font-medium">
                {total} {isHindi ? "लेख उपलब्ध" : "Articles Indexed"}
              </span>
            </div>
            {category.description && (
              <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">{category.description}</p>
            )}
          </div>

          {/* Articles Stream in List View */}
          <section className="space-y-3" aria-label="Category Articles">
            {articles.length > 0 ? (
              <div className="space-y-3">
                {articles.map((article) => (
                  <NewsListViewItem key={article.id} article={article} lang={lang} />
                ))}
              </div>
            ) : (
              <EmptyState
                title={isHindi ? `${category.name_hi || category.name} में अभी कोई लेख नहीं है` : `No articles yet in ${category.name}`}
                description={
                  isHindi
                    ? "जैसे ही नए लेख सत्यापित स्रोतों द्वारा प्रकाशित होंगे, वे यहाँ प्रदर्शित होंगे।"
                    : "New stories will appear here as soon as they are published by our verified sources."
                }
              />
            )}
          </section>

          {/* Server-Side Pagination */}
          {total > 0 && (
            <NewsPagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={total}
              currentLimit={limit}
              lang={lang}
              pathname={`/news/category/${category.slug}`}
              searchParams={sParams}
            />
          )}
        </main>
      </div>
    </>
  );
}
