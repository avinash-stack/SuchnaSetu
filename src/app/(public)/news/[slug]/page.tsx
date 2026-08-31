import { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchArticleBySlug, fetchRelatedArticles } from "@/modules/news/services/news-query-service";
import { getOrTranslateNewsArticle } from "@/modules/news/services/translation-service";
import { NewsHeader } from "@/modules/news/components/news-header";
import { NewsArticleView } from "@/modules/news/components/news-article-view";
import { constructMetadata, buildNewsArticleJsonLd, buildBreadcrumbJsonLd } from "@/lib/seo";

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

  const rawArticle = await fetchArticleBySlug(slug);

  if (!rawArticle) {
    return constructMetadata({
      title: "News Story Not Found | SuchnaSetu News",
      description: "The requested news story could not be found.",
      manifest: "/news/manifest.webmanifest",
    });
  }

  const { article, isTranslated } = await getOrTranslateNewsArticle(rawArticle, requestedLang);

  const isHindi = requestedLang === "hi";

  return constructMetadata({
    title: `${article.title} | ${isHindi ? "सूचना सेतु समाचार" : "SuchnaSetu News"}`,
    description: article.summary,
    path: `/news/${article.slug}${isHindi ? "?lang=hi" : ""}`,
    canonicalPath: `/news/${article.slug}`,
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

  const rawArticle = await fetchArticleBySlug(slug);

  if (!rawArticle) {
    notFound();
  }

  const [{ article, isTranslated, originalLang }, relatedArticles] = await Promise.all([
    getOrTranslateNewsArticle(rawArticle, requestedLang),
    fetchRelatedArticles(rawArticle.id, rawArticle.category_slug, 4),
  ]);

  const articleWithRelated = {
    ...article,
    related_articles: relatedArticles,
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
