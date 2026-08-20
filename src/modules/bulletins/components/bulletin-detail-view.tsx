"use client";

import Link from "next/link";
import { PublicBulletinDetailed } from "../types";
import { useLanguage } from "@/lib/i18n/context";
import { resolveLocalizedBulletin } from "@/lib/i18n/localize";
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
  Briefcase,
  Flame,
  ArrowRight,
  User,
  Tag,
} from "lucide-react";

interface BulletinDetailViewProps {
  bulletin: PublicBulletinDetailed;
  relatedBulletins?: PublicBulletinDetailed[];
}

export function BulletinDetailView({ bulletin: rawBulletin, relatedBulletins = [] }: BulletinDetailViewProps) {
  const { language, t } = useLanguage();
  const bulletin = resolveLocalizedBulletin(rawBulletin, language);

  const org = bulletin.organization;
  const relatedJob = bulletin.related_job;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-slate-800 transition-colors">
          {t("nav.home")}
        </Link>
        <span>/</span>
        <Link href="/news" className="hover:text-slate-800 transition-colors">
          {t("nav.news")}
        </Link>
        <span>/</span>
        <span className="font-semibold text-slate-800 truncate max-w-xs">
          {bulletin.title}
        </span>
      </nav>

      {/* Article Header Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Badge variant="brand" className="text-xs font-bold uppercase tracking-wider bg-[#013089] text-white">
              {bulletin.category.replace("_", " ")}
            </Badge>

            {bulletin.is_breaking && (
              <Badge variant="danger" className="gap-1 text-xs font-bold bg-[#FE8D01] text-white">
                <Flame className="h-3 w-3" />
                <span>Urgent</span>
              </Badge>
            )}

            {org && (
              <Badge variant="outline" className="text-xs">
                {org.acronym || org.name}
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium font-mono">
            <Calendar className="h-3.5 w-3.5 text-slate-400" />
            <span>Published: {formatDate(bulletin.published_at)}</span>
          </div>
        </div>

        {/* Localized Title */}
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

        {/* Localized Highlight Summary Box */}
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 font-medium leading-relaxed">
          {bulletin.summary}
        </div>

        {/* Source Citation & Provenance Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50/50 p-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0" />
            <div className="text-xs">
              <span className="font-bold text-slate-800">Verified Official Source: </span>
              <span className="text-slate-600">{bulletin.source_name}</span>
            </div>
          </div>

          {bulletin.source_url && (
            <a
              href={bulletin.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-900 transition-colors"
            >
              <span>{t("card.official_pdf")}</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      </div>

      {/* Full Article Content */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
        <div className="prose prose-slate max-w-none text-sm text-slate-800 leading-relaxed whitespace-pre-line">
          {bulletin.content}
        </div>

        {/* Tags */}
        {bulletin.tags && bulletin.tags.length > 0 && (
          <div className="pt-4 border-t border-slate-100 flex items-center gap-2 flex-wrap text-xs text-slate-500">
            <Tag className="h-3.5 w-3.5 text-slate-400" />
            <span className="font-semibold">Tags:</span>
            {bulletin.tags.map((tag, idx) => (
              <span
                key={idx}
                className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-700 font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Associated Job Notice Action Strip */}
      {relatedJob && (
        <div className="rounded-2xl border border-brand-200 bg-brand-50/50 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-brand-900">
              <Briefcase className="h-4 w-4 text-brand-600" />
              <span>Linked Government Job Recruitment</span>
            </div>
            <div className="text-base font-bold text-slate-900 font-heading">
              {relatedJob.title}
            </div>
          </div>

          <Link href={`/jobs/${relatedJob.slug}`}>
            <Button variant="primary" size="md" className="gap-2 shrink-0 bg-[#013089] hover:bg-[#01276E] text-white">
              <span>{t("card.view_details")}</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      )}

      {/* Transparency Notice */}
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600 flex items-start gap-3">
        <ShieldAlert className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed text-[11px]">
          <strong>Notice to Readers:</strong> SuchnaSetu aggregates and structures news summaries from public government gazettes, PIB, and official recruitment portals. For complete notifications, refer to the verified official source link above.
        </p>
      </div>
    </div>
  );
}
