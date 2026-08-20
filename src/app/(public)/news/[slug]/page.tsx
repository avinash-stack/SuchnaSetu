import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublicBulletinBySlug, getRelatedBulletins } from "@/modules/bulletins/service";
import { constructMetadata, buildNewsArticleJsonLd } from "@/lib/seo";
import { getCanonicalSiteUrl } from "@/lib/constants";
import { resolveLocalizedBulletin } from "@/lib/i18n/localize";
import { LanguageCode } from "@/lib/i18n/config";
import { BulletinDetailView } from "@/modules/bulletins/components/bulletin-detail-view";

interface BulletinDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams?: Promise<{
    lang?: string;
  }>;
}

export async function generateMetadata({ params, searchParams }: BulletinDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const sParams = searchParams ? await searchParams : {};
  const lang = (sParams.lang as LanguageCode) || "en";
  const rawBulletin = await getPublicBulletinBySlug(slug);

  if (!rawBulletin) {
    return constructMetadata({
      title: "Bulletin Not Found",
      description: "The requested official bulletin could not be found.",
    });
  }

  const bulletin = resolveLocalizedBulletin(rawBulletin, lang);

  return constructMetadata({
    title: `${bulletin.title} | SuchnaSetu`,
    description: bulletin.summary,
    path: `/news/${bulletin.slug}`,
  });
}

export default async function PublicBulletinDetailPage({ params }: BulletinDetailPageProps) {
  const { slug } = await params;
  const bulletin = await getPublicBulletinBySlug(slug);

  if (!bulletin) {
    notFound();
  }

  const org = bulletin.organization;
  const relatedBulletins = await getRelatedBulletins(bulletin.id, bulletin.category, 3);

  const jsonLd = buildNewsArticleJsonLd({
    title: bulletin.title,
    description: bulletin.summary,
    url: `${getCanonicalSiteUrl()}/news/${bulletin.slug}`,
    datePublished: bulletin.published_at,
    dateModified: bulletin.updated_at,
    authorName: bulletin.author || org?.name || "SuchnaSetu Civic News Desk",
  });

  return (
    <>
      {/* Inject Structured JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Multilingual Reactive Detail View */}
      <BulletinDetailView bulletin={bulletin} relatedBulletins={relatedBulletins} />
    </>
  );
}
