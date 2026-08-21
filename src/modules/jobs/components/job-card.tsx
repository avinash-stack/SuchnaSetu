"use client";

import Link from "next/link";
import { GovJobDetailed } from "../types";
import { useLanguage } from "@/lib/i18n/context";
import { resolveLocalizedJob } from "@/lib/i18n/localize";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDate, formatINR, formatNumber, isPdfUrl } from "@/lib/utils";
import {
  Calendar,
  MapPin,
  ArrowRight,
  Clock,
  FileText,
  Globe,
} from "lucide-react";

interface JobCardProps {
  job: GovJobDetailed;
}

export function JobCard({ job: rawJob }: JobCardProps) {
  const { language, t } = useLanguage();
  const job = resolveLocalizedJob(rawJob, language);

  const isClosingSoon = job.application_end_date
    ? new Date(job.application_end_date).getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000 &&
      new Date(job.application_end_date).getTime() > Date.now()
    : false;

  return (
    <Card className="flex flex-col justify-between overflow-hidden border border-slate-200 bg-white transition-all hover:border-[#013089] hover:shadow-xs group">
      <CardHeader className="p-4 pb-2 space-y-2">
        {/* Authority & Scope Strip */}
        <div className="flex flex-wrap items-center justify-between gap-1.5">
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center rounded-xs bg-[#013089] px-2 py-0.5 text-[11px] font-bold text-white uppercase tracking-wider">
              {job.organization?.acronym || job.organization?.name || "Govt"}
            </span>

            {job.category && (
              <span className="inline-flex items-center rounded-xs bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-700 border border-slate-200">
                {job.category.name}
              </span>
            )}
          </div>

          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500">
            <MapPin className="h-3 w-3 text-slate-400" />
            <span>{job.state?.name || "All India"}</span>
          </span>
        </div>

        {/* Localized Title */}
        <Link href={`/jobs/${job.slug}`} className="block">
          <CardTitle className="text-sm sm:text-base font-bold leading-snug text-slate-900 group-hover:text-[#013089] transition-colors line-clamp-2">
            {job.title}
          </CardTitle>
        </Link>

        {/* Official Reference / Advt No */}
        {job.notification_number && (
          <p className="text-[10px] font-mono text-slate-500">
            {t("card.advt_no")}: <span className="font-semibold text-slate-700">{job.notification_number}</span>
          </p>
        )}
      </CardHeader>

      <CardContent className="p-4 pt-2 pb-3 space-y-2.5 text-xs text-slate-700">
        {/* Structured Data Grid */}
        <div className="grid grid-cols-2 gap-2 rounded-xs bg-slate-50 p-2.5 border border-slate-100 text-xs">
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              {t("card.vacancies")}
            </div>
            <div className="font-bold text-[#0F172A] text-sm mt-0.5">
              {formatNumber(job.total_vacancies)}{" "}
              <span className="text-[11px] font-normal text-slate-500">{t("card.posts")}</span>
            </div>
          </div>

          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              {t("card.salary")}
            </div>
            <div className="font-medium text-slate-800 text-xs truncate mt-0.5">
              {job.salary_min || job.salary_max
                ? `${formatINR(job.salary_min)} - ${formatINR(job.salary_max)}`
                : job.pay_scale_details || "7th CPC Scale"}
            </div>
          </div>
        </div>

        {/* Deadline Strip */}
        <div className="flex items-center justify-between text-[11px] pt-0.5">
          <div className="flex items-center gap-1.5 text-slate-500">
            <Calendar className="h-3.5 w-3.5 text-slate-400" />
            <span>{t("card.last_date")}:</span>
            <span className={`font-semibold ${isClosingSoon ? "text-amber-700 font-bold" : "text-slate-800"}`}>
              {formatDate(job.application_end_date)}
            </span>
          </div>

          {isClosingSoon && (
            <span className="inline-flex items-center gap-1 rounded-xs bg-[#FE8D01] px-1.5 py-0.5 text-[10px] font-bold text-white">
              <Clock className="h-3 w-3" />
              <span>{t("card.closes")}</span>
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-2">
        {job.official_notification_url ? (
          <a
            href={job.official_notification_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 hover:text-[#013089] transition-colors"
            title="Open official notification in new tab"
          >
            <FileText className="h-3.5 w-3.5 text-slate-400" />
            <span>{t("card.official_notification")}</span>
          </a>
        ) : (
          <span className="text-[10px] text-slate-400 font-mono">Gazette Verified</span>
        )}

        <Link href={`/jobs/${job.slug}`}>
          <Button variant="outline" size="sm" className="h-7 px-2.5 text-[11px] font-bold text-[#013089] hover:bg-[#013089] hover:text-white border-[#013089]/40 hover:border-[#013089]">
            <span>{t("card.view_details")}</span>
            <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
