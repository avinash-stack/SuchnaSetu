import { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchArticleBySlug, fetchRelatedArticles } from "@/modules/news/services/news-query-service";
import { NewsHeader } from "@/modules/news/components/news-header";
import { NewsArticleView } from "@/modules/news/components/news-article-view";
import { constructMetadata, buildNewsArticleJsonLd, buildBreadcrumbJsonLd } from "@/lib/seo";

interface NewsArticlePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const revalidate = 300; // 5 minutes ISR

export async function generateMetadata({ params }: NewsArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await fetchArticleBySlug(slug);

  if (!article) {
    return constructMetadata({
      title: "News Story Not Found | SuchnaSetu News",
      description: "The requested news story could not be found.",
    });
  }

  return constructMetadata({
    title: `${article.title} | SuchnaSetu News`,
    description: article.summary,
    path: `/news/${article.slug}`,
    canonicalPath: `/news/${article.slug}`,
  });
}

export default async function NewsArticleDetailPage({ params }: NewsArticlePageProps) {
  const { slug } = await params;
  const article = await fetchArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = await fetchRelatedArticles(article.id, article.category_slug, 4);
  const articleWithRelated = {
    ...article,
    related_articles: relatedArticles,
  };

  const jsonLd = buildNewsArticleJsonLd({
    title: article.title,
    description: article.summary,
    url: `/news/${article.slug}`,
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
          <NewsArticleView article={articleWithRelated} />
        </main>
      </div>
    </>
  );
}
