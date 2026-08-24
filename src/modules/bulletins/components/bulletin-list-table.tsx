"use client";

import Link from "next/link";
import { PublicBulletinDetailed } from "../types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/context";
import { resolveLocalizedBulletin } from "@/lib/i18n/localize";
import {
  Calendar,
  Flame,
  ArrowRight,
  ShieldCheck,
  Building2,
  Briefcase,
  Users,
  GraduationCap,
} from "lucide-react";

export interface BulletinListTableProps {
  bulletins: PublicBulletinDetailed[];
}

const categoryPillConfig: Record<string, { label: string; bg: string; text: string }> = {
  exam_recruitment: { label: "Recruitment", bg: "bg-amber-50 border-amber-200", text: "text-amber-800" },
  student_aspirant: { label: "Aspirant Alert", bg: "bg-red-50 border-red-200", text: "text-red-800" },
  education_govt: { label: "Govt & NTA", bg: "bg-indigo-50 border-indigo-200", text: "text-indigo-800" },
  results_admit_cards: { label: "Result / Admit", bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-800" },
  employment_news: { label: "Rozgar Samachar", bg: "bg-amber-50 border-amber-200", text: "text-amber-800" },
  student_advisory: { label: "Student Notice", bg: "bg-red-50 border-red-200", text: "text-red-800" },
  legal_update: { label: "Court Order", bg: "bg-purple-50 border-purple-200", text: "text-purple-800" },
  press_release: { label: "Press Release", bg: "bg-blue-50 border-blue-200", text: "text-blue-800" },
};

export function BulletinListTable({ bulletins }: BulletinListTableProps) {
  const { language, t } = useLanguage();

  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
      {/* Desktop & Tablet Table */}
      <div className="hidden sm:block">
        <table className="w-full text-left border-collapse table-fixed">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-100/90 text-xs sm:text-[13px] font-bold uppercase tracking-wider text-slate-700">
              <th className="py-3.5 px-4 w-[22%]">Category &amp; Authority</th>
              <th className="py-3.5 px-4 w-[44%]">Headline &amp; Summary</th>
              <th className="py-3.5 px-4 w-[16%]">Published Date</th>
              <th className="py-3.5 px-4 w-[18%] text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-800">
            {bulletins.map((rawBulletin) => {
              const bulletin = resolveLocalizedBulletin(rawBulletin, language);
              const pill = categoryPillConfig[bulletin.category] || categoryPillConfig.employment_news;
              const orgName = bulletin.organization?.acronym || bulletin.organization?.name || bulletin.source_name || "Official Body";

              return (
                <tr
                  key={bulletin.id}
                  className="hover:bg-slate-50/90 transition-colors group"
                >
                  {/* Category & Authority Column */}
                  <td className="py-4 px-4 align-top">
                    <div className="flex flex-col gap-1.5">
                      <span className="font-bold text-sm sm:text-[15px] text-[#013089] group-hover:underline truncate block">
                        {orgName}
                      </span>
                      <span className={`inline-flex items-center self-start text-[11px] font-bold px-2 py-0.5 rounded border ${pill.bg} ${pill.text}`}>
                        {pill.label}
                      </span>
                    </div>
                  </td>

                  {/* Headline & Excerpt Column */}
                  <td className="py-4 px-4 align-top">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {bulletin.is_breaking && (
                          <span className="inline-flex items-center gap-1 rounded bg-[#FE8D01] px-1.5 py-0.5 text-[9px] font-bold text-white uppercase tracking-wider">
                            <Flame className="h-2.5 w-2.5" />
                            <span>Urgent</span>
                          </span>
                        )}
                        <Link
                          href={`/news/${bulletin.slug}`}
                          className="font-bold text-sm sm:text-[15.5px] text-slate-900 group-hover:text-[#013089] transition-colors line-clamp-2 leading-snug"
                        >
                          {bulletin.title}
                        </Link>
                      </div>

                      <p className="text-xs sm:text-[13.5px] text-slate-600 line-clamp-2 leading-relaxed">
                        {bulletin.summary}
                      </p>

                      <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium pt-0.5">
                        <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">{bulletin.source_name}</span>
                      </div>
                    </div>
                  </td>

                  {/* Published Date Column */}
                  <td className="py-4 px-4 align-top text-xs text-slate-600">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-medium font-mono text-slate-800">
                        {formatDate(bulletin.published_at)}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">
                        Verified Notice
                      </span>
                    </div>
                  </td>

                  {/* Action Button Column */}
                  <td className="py-4 px-4 align-top text-right">
                    <Link href={`/news/${bulletin.slug}`} className="inline-block">
                      <Button
                        variant="brand"
                        size="sm"
                        className="gap-1.5 font-bold shadow-xs hover:shadow-sm px-3.5 py-1.5 text-xs text-white bg-[#013089] hover:bg-[#01276E]"
                      >
                        <span>{t("card.view_details")}</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List */}
      <div className="sm:hidden divide-y divide-slate-100">
        {bulletins.map((rawBulletin) => {
          const bulletin = resolveLocalizedBulletin(rawBulletin, language);
          const pill = categoryPillConfig[bulletin.category] || categoryPillConfig.employment_news;
          const orgName = bulletin.organization?.acronym || bulletin.organization?.name || bulletin.source_name || "Official Body";

          return (
            <div key={bulletin.id} className="p-4 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-xs text-[#013089] truncate">
                  {orgName}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${pill.bg} ${pill.text}`}>
                  {pill.label}
                </span>
              </div>

              <Link
                href={`/news/${bulletin.slug}`}
                className="font-bold text-sm text-slate-900 block leading-snug"
              >
                {bulletin.title}
              </Link>

              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {bulletin.summary}
              </p>

              <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100">
                <span className="text-[11px] text-slate-500 font-mono">
                  {formatDate(bulletin.published_at)}
                </span>
                <Link href={`/news/${bulletin.slug}`}>
                  <Button variant="outline" size="sm" className="text-xs font-bold gap-1 py-1 px-3">
                    <span>{t("card.view_details")}</span>
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
