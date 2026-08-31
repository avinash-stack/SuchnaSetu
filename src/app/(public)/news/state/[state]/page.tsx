import { Metadata } from "next";
import { fetchNewsFeed } from "@/modules/news/services/news-query-service";
import { NewsHeader } from "@/modules/news/components/news-header";
import { NewsListViewItem } from "@/modules/news/components/news-list-view-item";
import { NewsPagination } from "@/modules/news/components/news-pagination";
import { EmptyState } from "@/components/shared/empty-state";
import { constructMetadata, buildBreadcrumbJsonLd } from "@/lib/seo";
import { getLocalizedStateName } from "@/lib/i18n/config";
import { MapPin } from "lucide-react";

interface StateNewsPageProps {
  params: Promise<{
    state: string;
  }>;
  searchParams: Promise<{
    page?: string;
    limit?: string;
    lang?: string;
  }>;
}

export const revalidate = 180;

export async function generateMetadata({ params, searchParams }: StateNewsPageProps): Promise<Metadata> {
  const { state: rawState } = await params;
  const sParams = await searchParams;
  const isHindi = sParams.lang === "hi";
  const stateCode = rawState.toUpperCase();
  const stateName = getLocalizedStateName(stateCode, "en") || stateCode;
  const stateNameHi = getLocalizedStateName(stateCode, "hi") || stateName;

  return constructMetadata({
    title: isHindi
      ? `${stateNameHi} समाचार एवं प्रादेशिक अपडेट — SuchnaSetu News`
      : `${stateName} News & Regional Updates — SuchnaSetu News`,
    description: isHindi
      ? `${stateNameHi} से संबंधित नवीनतम सत्यापित समाचार, राज्य मंत्रिमंडल के निर्णय एवं स्थानीय सूचनाएं।`
      : `Latest verified news, state government announcements, cabinet decisions, and local updates from ${stateName}.`,
    path: `/news/state/${rawState.toLowerCase()}`,
    canonicalPath: `/news/state/${rawState.toLowerCase()}`,
    manifest: "/news/manifest.webmanifest",
  });
}

export default async function StateNewsPage({ params, searchParams }: StateNewsPageProps) {
  const { state: rawState } = await params;
  const sParams = await searchParams;
  const stateCode = rawState.toUpperCase();
  const stateName = getLocalizedStateName(stateCode, "en") || stateCode;
  const stateNameHi = getLocalizedStateName(stateCode, "hi") || stateName;

  const currentPage = Math.max(1, parseInt(sParams.page || "1", 10) || 1);
  const rawLimit = parseInt(sParams.limit || "20", 10);
  const limit = [20, 50, 100].includes(rawLimit) ? rawLimit : 20;
  const lang = sParams.lang === "hi" ? "hi" : "en";
  const isHindi = lang === "hi";

  const { articles, total, totalPages } = await fetchNewsFeed({
    state: stateCode,
    page: currentPage,
    limit,
    sort: "latest",
    lang,
  });

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "News", url: "/news" },
    { name: `${stateName} News`, url: `/news/state/${rawState.toLowerCase()}` },
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
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#013089]">
                <MapPin className="h-4 w-4 text-[#FE8D01]" />
                <span>{isHindi ? "राज्य एवं प्रादेशिक डेस्क" : "State & Regional News Desk"}</span>
              </div>
            </div>

            <div className="flex items-baseline justify-between flex-wrap gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
                {isHindi ? stateNameHi : stateName}{" "}
                <span className="text-slate-400 font-normal text-lg">
                  ({isHindi ? stateName : stateNameHi})
                </span>
              </h1>
              <span className="text-xs text-slate-500 font-mono font-medium">
                {total} {isHindi ? "लेख उपलब्ध" : "Articles Indexed"}
              </span>
            </div>
            <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
              {isHindi
                ? `${stateNameHi} के लिए सत्यापित प्रशासनिक निर्णय, सरकारी योजनाएं एवं प्रादेशिक समाचार रिपोर्टिंग।`
                : `Verified public communiques, state cabinet policies, administrative decisions, and regional reporting for ${stateName}.`}
            </p>
          </div>

          {/* Articles Stream in List View */}
          <section className="space-y-3" aria-label="State Articles">
            {articles.length > 0 ? (
              <div className="space-y-3">
                {articles.map((article) => (
                  <NewsListViewItem key={article.id} article={article} lang={lang} />
                ))}
              </div>
            ) : (
              <EmptyState
                title={isHindi ? `${stateNameHi} के लिए कोई लेख नहीं मिला` : `No articles found for ${stateName}`}
                description={
                  isHindi
                    ? "प्रादेशिक रिपोर्टिंग अपडेट की जा रही है। इस बीच सभी राष्ट्रीय समाचार देखें।"
                    : "Regional reporting is updating. Browse all national news in the meantime."
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
              pathname={`/news/state/${rawState.toLowerCase()}`}
              searchParams={sParams}
            />
          )}
        </main>
      </div>
    </>
  );
}
