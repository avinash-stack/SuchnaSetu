import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getResourceBySlug, getRelatedResources } from "@/modules/resources/service";
import { TableOfContents } from "@/modules/resources/components/table-of-contents";
import { ResourceContentRenderer } from "@/modules/resources/components/resource-content-renderer";
import { ResourceFaqAccordion } from "@/modules/resources/components/resource-faq-accordion";
import { RelatedOpeningsWidget } from "@/modules/resources/components/related-openings-widget";
import { ResourceCard } from "@/modules/resources/components/resource-card";
import { constructMetadata, buildBreadcrumbJsonLd } from "@/lib/seo";
import { getCanonicalSiteUrl } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  Calendar,
  Share2,
  ChevronRight,
  ShieldCheck,
  UserCheck,
  Languages,
  BookOpen,
} from "lucide-react";

export const revalidate = 300; // 5 minutes ISR cache

interface ResourceDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    lang?: string;
  }>;
}

export async function generateMetadata(props: ResourceDetailPageProps): Promise<Metadata> {
  const params = await props.params;
  const resource = await getResourceBySlug(params.slug);

  if (!resource) {
    return constructMetadata({
      title: "Career Resource Not Found — SuchnaSetu",
      description: "The requested career guidance resource could not be found.",
      path: `/resources/${params.slug}`,
      noIndex: true,
    });
  }

  return constructMetadata({
    title: `${resource.title} — Official Career Guide`,
    description: resource.excerpt,
    path: `/resources/${resource.slug}`,
    keywords: resource.tags,
  });
}

export default async function ResourceDetailPage(props: ResourceDetailPageProps) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const isHindi = searchParams.lang === "hi";

  const resource = await getResourceBySlug(params.slug);

  if (!resource) {
    notFound();
  }

  const related = await getRelatedResources(resource.slug, resource.category_slug);
  const baseUrl = getCanonicalSiteUrl();

  const title = isHindi && resource.title_hi ? resource.title_hi : resource.title;
  const content = isHindi && resource.content_hi ? resource.content_hi : resource.content;
  const excerpt = isHindi && resource.excerpt_hi ? resource.excerpt_hi : resource.excerpt;

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Resources", url: "/resources" },
    { name: resource.category?.name || "Career Guides", url: `/resources?category=${resource.category_slug}` },
    { name: resource.title, url: `/resources/${resource.slug}` },
  ];

  // Article Schema
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: resource.title,
    description: resource.excerpt,
    datePublished: resource.published_at,
    dateModified: resource.updated_at,
    author: {
      "@type": "Organization",
      name: resource.author_name,
      url: baseUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "SuchnaSetu",
      url: baseUrl,
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/icon.svg`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}/resources/${resource.slug}`,
    },
  };

  // Google FAQPage Schema
  const faqSchema =
    resource.faqs && resource.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: resource.faqs.map((faq) => ({
            "@type": "Question",
            name: isHindi && faq.question_hi ? faq.question_hi : faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: isHindi && faq.answer_hi ? faq.answer_hi : faq.answer,
            },
          })),
        }
      : null;

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildBreadcrumbJsonLd(breadcrumbs)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {/* 1. BREADCRUMBS BAR */}
      <div className="border-b border-slate-200/80 bg-white py-3">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="no-scrollbar flex items-center gap-1.5 overflow-x-auto text-xs text-slate-500 whitespace-nowrap">
            <Link href="/" className="hover:text-slate-900 transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3 w-3 text-slate-300 shrink-0" />
            <Link href="/resources" className="hover:text-slate-900 transition-colors">
              Resources
            </Link>
            <ChevronRight className="h-3 w-3 text-slate-300 shrink-0" />
            <Link
              href={`/resources?category=${resource.category_slug}`}
              className="hover:text-slate-900 transition-colors"
            >
              {resource.category?.name || "Career Guides"}
            </Link>
            <ChevronRight className="h-3 w-3 text-slate-300 shrink-0" />
            <span className="font-semibold text-slate-800 line-clamp-1 max-w-[200px] sm:max-w-xs">
              {resource.title}
            </span>
          </nav>
        </div>
      </div>

      {/* 2. ARTICLE HEADER */}
      <header className="border-b border-slate-200 bg-white py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Badge variant="brand" className="py-1 px-3 text-xs font-semibold">
                {resource.category?.name || "Career Guide"}
              </Badge>

              {/* Language Switcher */}
              <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 p-1 text-xs font-semibold">
                <Languages className="h-3.5 w-3.5 text-slate-500 ml-1" />
                <Link
                  href={`/resources/${resource.slug}`}
                  className={`rounded-md px-2.5 py-1 transition-colors ${
                    !isHindi ? "bg-white text-[#013089] shadow-2xs font-bold" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  English
                </Link>
                <Link
                  href={`/resources/${resource.slug}?lang=hi`}
                  className={`rounded-md px-2.5 py-1 transition-colors ${
                    isHindi ? "bg-white text-[#013089] shadow-2xs font-bold" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  हिंदी
                </Link>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 font-heading leading-tight">
              {title}
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl">
              {excerpt}
            </p>

            {/* Author & Meta Row */}
            <div className="flex flex-wrap items-center gap-4 border-t border-slate-100 pt-4 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#013089] text-white font-bold text-[11px]">
                  SS
                </div>
                <div>
                  <div className="font-bold text-slate-900">{resource.author_name}</div>
                  <div className="text-[11px] text-slate-400">{resource.author_role}</div>
                </div>
              </div>

              <span className="text-slate-200">|</span>

              <div className="flex items-center gap-1 text-slate-500">
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                <time dateTime={resource.published_at}>{formatDate(resource.published_at)}</time>
              </div>

              <div className="flex items-center gap-1 text-slate-500">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                <span>{resource.reading_time_minutes} min read</span>
              </div>

              <div className="flex items-center gap-1 text-emerald-700 font-medium">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Verified Public Sector Desk</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 3. MAIN ARTICLE LAYOUT: 2-COLUMN (Content + Sticky Sidebar) */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 items-start">
          {/* Main Article Body (8 cols) */}
          <article className="lg:col-span-8 space-y-10 min-w-0">
            {/* Structured Markdown Content */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-10 shadow-2xs">
              <ResourceContentRenderer content={content} />
            </div>

            {/* Candidate FAQs Accordion */}
            {resource.faqs && resource.faqs.length > 0 && (
              <ResourceFaqAccordion faqs={resource.faqs} isHindi={isHindi} />
            )}

            {/* Official Provenance Disclaimer */}
            <footer className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5 text-xs text-slate-600 flex items-start gap-3.5">
              <ShieldCheck className="h-5 w-5 text-emerald-700 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="font-bold text-slate-900">SuchnaSetu Research Standards &amp; Provenance</div>
                <p className="leading-relaxed">
                  All syllabus topics, pay matrices, examination schemes, and reservation guidelines published in this guide are grounded strictly in official gazette notifications from the respective recruiting commissions (UPSC, SSC, RRB, IBPS, and State PSCs).
                </p>
              </div>
            </footer>
          </article>

          {/* Sticky Sidebar (4 cols) */}
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            {/* Table of Contents */}
            <TableOfContents content={content} />

            {/* Live Openings Cross-Linking Card */}
            <RelatedOpeningsWidget tags={resource.tags} categorySlug={resource.category_slug} />

            {/* Tags Cloud */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Related Topics &amp; Sectors
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {resource.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/resources?search=${encodeURIComponent(tag)}`}
                    className="rounded-md bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-[#013089] hover:text-white transition-colors border border-slate-200/80"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* 4. RELATED CAREER GUIDES STRIP */}
      {related.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16">
          <div className="border-t border-slate-200 pt-10 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading">
                Related Career Guidance Guides
              </h2>
              <Link href="/resources" className="text-xs font-semibold text-[#013089] hover:underline">
                View All Guides →
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((rel) => (
                <ResourceCard key={rel.id} resource={rel} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
