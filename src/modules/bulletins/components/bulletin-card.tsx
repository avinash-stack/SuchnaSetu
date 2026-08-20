"use client";

import Link from "next/link";
import { PublicBulletinDetailed } from "../types";
import { useLanguage } from "@/lib/i18n/context";
import { resolveLocalizedBulletin } from "@/lib/i18n/localize";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import {
  FileText,
  Briefcase,
  Users,
  Scale,
  GraduationCap,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building2,
} from "lucide-react";

interface BulletinCardProps {
  bulletin: PublicBulletinDetailed;
}

const categoryMeta: Record<string, { label: string; icon: any }> = {
  government_updates: { label: "Govt Update", icon: Building2 },
  recruitment_jobs: { label: "Recruitment Notice", icon: Briefcase },
  employment_news: { label: "Rozgar Samachar", icon: Briefcase },
  exams: { label: "Exam Notice", icon: GraduationCap },
  education: { label: "Education Advisory", icon: GraduationCap },
  government_schemes: { label: "Public Scheme", icon: Sparkles },
  important_notifications: { label: "Public Advisory", icon: Users },
  student_advisory: { label: "Student Desk", icon: Users },
  legal_update: { label: "Court / Legal Order", icon: Scale },
  press_release: { label: "Press Release", icon: FileText },
};

export function BulletinCard({ bulletin: rawBulletin }: BulletinCardProps) {
  const { language, t } = useLanguage();
  const bulletin = resolveLocalizedBulletin(rawBulletin, language);
  const meta = categoryMeta[bulletin.category] || categoryMeta.employment_news;

  return (
    <Card className="flex flex-col justify-between overflow-hidden border border-slate-200 bg-white transition-all hover:border-[#013089] hover:shadow-xs group">
      <CardHeader className="p-4 pb-2 space-y-2">
        {/* Category & Status Badges */}
        <div className="flex items-center justify-between gap-1.5 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center rounded-xs bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-800 border border-slate-200">
              {meta.label}
            </span>

            {bulletin.is_breaking && (
              <span className="inline-flex items-center rounded-xs bg-[#FE8D01] px-1.5 py-0.5 text-[9px] font-bold text-white uppercase tracking-wider">
                Urgent
              </span>
            )}
          </div>

          <span className="text-[11px] text-slate-500 font-medium font-mono">
            {formatDate(bulletin.published_at)}
          </span>
        </div>

        {/* Localized Title */}
        <Link href={`/news/${bulletin.slug}`} className="block">
          <CardTitle className="text-sm sm:text-base font-bold text-slate-900 leading-snug group-hover:text-[#013089] transition-colors line-clamp-2">
            {bulletin.title}
          </CardTitle>
        </Link>
      </CardHeader>

      <CardContent className="p-4 pt-1 pb-3 text-xs text-slate-600 space-y-2">
        {/* Localized Summary */}
        <p className="line-clamp-3 leading-relaxed">
          {bulletin.summary}
        </p>

        {/* Verified Provenance */}
        <div className="flex items-center gap-1.5 rounded-xs bg-slate-50 px-2.5 py-1 text-[11px] text-slate-600 border border-slate-100">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" />
          <span className="font-semibold text-slate-700">Source:</span>
          <span className="truncate">{bulletin.source_name}</span>
        </div>
      </CardContent>

      <CardFooter className="p-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
          Official Gazette Digest
        </span>

        <Link href={`/news/${bulletin.slug}`}>
          <span className="inline-flex items-center gap-1 text-xs font-bold text-[#013089] hover:underline">
            <span>{t("card.view_details")}</span>
            <ArrowRight className="h-3 w-3" />
          </span>
        </Link>
      </CardFooter>
    </Card>
  );
}
