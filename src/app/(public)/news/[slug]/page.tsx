import { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  resolveArticleBySlug,
  fetchRelatedArticles,
  fetchTopStories,
} from "@/modules/news/services/news-query-service";
import { getOrTranslateNewsArticle } from "@/modules/news/services/translation-service";
import { NewsHeader } from "@/modules/news/components/news-header";
import { NewsArticleView } from "@/modules/news/components/news-article-view";
import { constructMetadata, buildNewsArticleJsonLd, buildBreadcrumbJsonLd } from "@/lib/seo";
import { createPublicClient } from "@/lib/supabase/public";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FileQuestion, Sparkles, Building2, ArrowRight } from "lucide-react";

interface NewsArticlePageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams?: Promise<{
    lang?: string;
  }>;
}

export const revalidate = 180; // 3 minutes ISR

export async function generateMetadata({ params, searchParams }: NewsArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const sParams = searchParams ? await searchParams : {};
  const requestedLang = sParams.lang === "hi" ? "hi" : "en";

  const resolved = await resolveArticleBySlug(slug);

  if (resolved.type === "cross_module_redirect" || resolved.type === "not_found" || !resolved.article) {
    return constructMetadata({
      title: "Notice Not Found | SuchnaSetu",
      description: "The requested news story could not be found or has moved.",
      noIndex: true, // Prevent Google from indexing 404 pages
      manifest: "/news/manifest.webmanifest",
    });
  }

  const rawArticle = resolved.article;
  const { article } = await getOrTranslateNewsArticle(rawArticle, requestedLang);
  const isHindi = requestedLang === "hi";

  return constructMetadata({
    title: `${article.title} | ${isHindi ? "सूचना सेतु समाचार" : "SuchnaSetu News"}`,
    description: article.summary,
    path: `/news/${article.slug}${isHindi ? "?lang=hi" : ""}`,
    canonicalPath: `/news/${article.slug}`,
    image: article.image_url || undefined,
    availableLanguages: {
      en: `https://suchnasetu.in/news/${article.slug}`,
      hi: `https://suchnasetu.in/news/${article.slug}?lang=hi`,
    },
    manifest: "/news/manifest.webmanifest",
  });
}

export default async function NewsArticleDetailPage({ params, searchParams }: NewsArticlePageProps) {
  const { slug } = await params;
  const sParams = searchParams ? await searchParams : {};
  const requestedLang = sParams.lang === "hi" ? "hi" : "en";

  const resolved = await resolveArticleBySlug(slug);

  // 1. Cross-module redirection (e.g. user or crawler accessed a job/exam slug under /news/)
  if (resolved.type === "cross_module_redirect") {
    redirect(resolved.redirectUrl);
  }

  // 2. Canonical slug redirection (e.g. casing mismatch or stripped hash)
  if (resolved.type === "found" && resolved.redirectUrl && resolved.redirectUrl !== `/news/${slug}`) {
    redirect(resolved.redirectUrl);
  }

  // 3. Fallback recovery view if story genuinely does not exist
  if (resolved.type === "not_found" || !resolved.article) {
    const [topStories, recentJobs] = await Promise.all([
      fetchTopStories(4),
      (async () => {
        try {
          const supabase = createPublicClient();
          const { data } = await (supabase as any)
            .from("gov_jobs")
            .select("id, slug, title, total_vacancies, application_end_date, organization:organizations(name, acronym)")
            .eq("status", "published")
            .is("deleted_at", null)
            .order("published_at", { ascending: false })
            .limit(4);
          return data || [];
        } catch {
          return [];
        }
      })(),
    ]);

    return (
      <div className="min-h-screen bg-slate-50 font-sans pb-16">
        <NewsHeader />
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-3 bg-white p-8 rounded-2xl border border-slate-200 shadow-xs">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-700 mx-auto">
              <FileQuestion className="h-6 w-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading">
              This Story Has Moved or Been Archived
            </h1>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              The requested news bulletin has been updated or archived under our latest civic records. Explore the most recent announcements below.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <Link href="/news">
                <Button variant="primary" size="sm" className="gap-2">
                  <span>Browse Latest News</span>
                </Button>
              </Link>
              <Link href="/jobs">
                <Button variant="outline" size="sm" className="gap-2">
                  <span>Explore Govt Jobs</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Top Breaking News */}
          {topStories.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-[#FE8D01]" />
                <span>Trending &amp; Top News</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {topStories.map((story) => (
                  <Link
                    key={story.id}
                    href={`/news/${story.slug}`}
                    className="p-4 rounded-xl border border-slate-200 bg-white hover:border-[#013089] hover:shadow-xs transition-all group"
                  >
                    <div className="text-xs font-bold text-[#013089] uppercase tracking-wider mb-1">
                      {story.category_slug}
                    </div>
                    <div className="text-sm font-bold text-slate-900 group-hover:text-[#013089] line-clamp-2">
                      {story.title}
                    </div>
                    <div className="text-xs text-slate-500 mt-2">
                      {formatDate(story.published_at)}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Latest Govt Jobs */}
          {recentJobs.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-[#013089]" />
                <span>Latest Government Vacancies</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {recentJobs.map((job: any) => (
                  <Link
                    key={job.id}
                    href={`/jobs/${job.slug}`}
                    className="p-4 rounded-xl border border-slate-200 bg-white hover:border-[#013089] hover:shadow-xs transition-all group"
                  >
                    <div className="text-xs font-bold text-[#013089] truncate">
                      {job.organization?.acronym || job.organization?.name}
                    </div>
                    <div className="text-sm font-bold text-slate-900 group-hover:text-[#013089] line-clamp-2">
                      {job.title}
                    </div>
                    <div className="text-xs text-slate-500 mt-2 flex items-center justify-between">
                      <span>{job.total_vacancies ? `${job.total_vacancies} Posts` : "Govt Post"}</span>
                      <span className="font-semibold text-[#013089] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                        Details <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  const rawArticle = resolved.article;

  const [{ article, isTranslated, originalLang }, relatedArticles] = await Promise.all([
    getOrTranslateNewsArticle(rawArticle, requestedLang),
    fetchRelatedArticles(rawArticle.id, rawArticle.category_slug, 4),
  ]);

  const articleWithRelated = {
    ...article,
    related_articles: relatedArticles,
    related_jobs: rawArticle.related_jobs || [],
    related_exams: rawArticle.related_exams || [],
  };

  const jsonLd = buildNewsArticleJsonLd({
    title: article.title,
    description: article.summary,
    url: `/news/${article.slug}${requestedLang === "hi" ? "?lang=hi" : ""}`,
    imageUrl: article.image_url,
    datePublished: article.published_at,
    dateModified: article.updated_at,
    authorName: article.author || article.source_name || "SuchnaSetu News Desk",
  });

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "News", url: "/news" },
    { name: article.category?.name || article.category_slug, url: `/news/category/${article.category_slug}` },
    { name: article.title, url: `/news/${article.slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="min-h-screen bg-slate-50/50 pb-16 font-sans">
        <NewsHeader />
        <main>
          <NewsArticleView
            article={articleWithRelated}
            lang={requestedLang}
            isTranslated={isTranslated}
            originalLang={originalLang}
          />
        </main>
      </div>
    </>
  );
}
