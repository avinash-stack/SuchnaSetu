import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublicBulletinBySlug, getRelatedBulletins } from "@/modules/bulletins/service";
import { constructMetadata, buildNewsArticleJsonLd } from "@/lib/seo";
import { getCanonicalSiteUrl } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Newspaper,
  Calendar,
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
  ArrowLeft,
  Briefcase,
  Flame,
  ArrowRight,
  User,
  Tag,
} from "lucide-react";

interface BulletinDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: BulletinDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const bulletin = await getPublicBulletinBySlug(slug);

  if (!bulletin) {
    return constructMetadata({
      title: "Bulletin Not Found",
      description: "The requested official bulletin could not be found.",
    });
  }

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
  const relatedJob = bulletin.related_job;
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

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-xs text-slate-500">
          <Link href="/" className="hover:text-slate-800 transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/news" className="hover:text-slate-800 transition-colors">
            News &amp; Bulletins
          </Link>
          <span>/</span>
          <span className="font-semibold text-slate-800 truncate max-w-xs">
            {bulletin.title}
          </span>
        </nav>

        {/* Article Header Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Badge variant="brand" className="text-xs font-bold uppercase tracking-wider">
                {bulletin.category.replace("_", " ")}
              </Badge>

              {bulletin.is_breaking && (
                <Badge variant="danger" className="gap-1 text-xs font-bold animate-pulse">
                  <Flame className="h-3 w-3" />
                  <span>Breaking</span>
                </Badge>
              )}

              {org && (
                <Badge variant="outline" className="text-xs">
                  {org.acronym || org.name}
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              <span>Published: {formatDate(bulletin.published_at)}</span>
            </div>
          </div>

          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl font-heading leading-tight">
            {bulletin.title}
          </h1>

          {/* Author / Source Meta Bar */}
          {bulletin.author && (
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <User className="h-3.5 w-3.5 text-slate-400" />
              <span>Reported / Issued by: <strong className="text-slate-700">{bulletin.author}</strong></span>
            </div>
          )}

          {/* Highlight Summary Box */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 font-medium leading-relaxed">
            {bulletin.summary}
          </div>

          {/* Source Citation & Provenance Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50/50 p-4">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="h-5 w-5 text-emerald-600 flex-shrink-0" />
              <div>
                <div className="text-xs font-bold text-slate-900">Verified Official Source Citation:</div>
                <div className="text-xs text-slate-600">{bulletin.source_name}</div>
              </div>
            </div>

            <a
              href={bulletin.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0"
            >
              <Button variant="primary" size="sm" className="gap-1.5 text-xs font-semibold">
                <span>View Official Source</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </Button>
            </a>
          </div>

          {/* Related Job Notice Link if attached */}
          {relatedJob && (
            <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <Briefcase className="h-5 w-5 text-blue-600 flex-shrink-0" />
                <div>
                  <div className="text-xs font-bold text-slate-900">Related Government Job Notice:</div>
                  <div className="text-xs text-slate-600">{relatedJob.title}</div>
                </div>
              </div>
              <Link href={`/jobs/${relatedJob.slug}`}>
                <Button variant="outline" size="sm" className="text-xs font-semibold">
                  View Job Notice
                </Button>
              </Link>
            </div>
          )}

          {/* Full In-Depth Content */}
          {bulletin.content && (
            <div className="pt-6 border-t border-slate-100">
              <h2 className="text-base font-bold text-slate-900 mb-3">Official Report &amp; Details</h2>
              <div className="prose prose-slate text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {bulletin.content}
              </div>
            </div>
          )}
        </div>

        {/* Related News Section */}
        {relatedBulletins.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 font-heading">Related Official Updates</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedBulletins.map((rel) => (
                <Link key={rel.id} href={`/news/${rel.slug}`} className="group">
                  <Card className="h-full border-slate-200 hover:border-brand-400 hover:shadow-xs transition-all p-4 flex flex-col justify-between">
                    <div>
                      <div className="text-[10px] text-slate-400 font-medium mb-1">
                        {formatDate(rel.published_at)}
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-brand-700 line-clamp-2 transition-colors">
                        {rel.title}
                      </h4>
                    </div>
                    <div className="mt-3 flex items-center text-[11px] font-semibold text-brand-700 gap-1">
                      <span>Read update</span>
                      <ArrowRight className="h-3 w-3" />
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Statutory Advisory Disclaimer */}
        <div className="rounded-xl border border-amber-500/30 bg-amber-50/40 p-4 flex items-start gap-3 text-xs text-slate-700">
          <ShieldAlert className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-amber-900">Statutory Fact-Checking Standard: </span>
            <span>
              SuchnaSetu only publishes verified press communiques, weekly Employment News digests, court judgments, and commission notices. We strictly refrain from speculative blogs or unverified social media claims.
            </span>
          </div>
        </div>

        {/* Back Link */}
        <div>
          <Link href="/news">
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to All News &amp; Bulletins</span>
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}
