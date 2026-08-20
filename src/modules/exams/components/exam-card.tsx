"use client";

import Link from "next/link";
import { GovExamDetailed } from "../types";
import { useLanguage } from "@/lib/i18n/context";
import { resolveLocalizedExam } from "@/lib/i18n/localize";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import {
  Calendar,
  Layers,
  ArrowRight,
  Clock,
} from "lucide-react";

interface ExamCardProps {
  exam: GovExamDetailed;
}

export function ExamCard({ exam: rawExam }: ExamCardProps) {
  const { language, t } = useLanguage();
  const exam = resolveLocalizedExam(rawExam, language);

  const org = exam.organization;
  const stages = exam.stages || [];
  const importantDates = exam.important_dates || [];

  // Find next upcoming exam date or application end date
  const examStartDate = importantDates.find((d) => d.date_type === "exam_start");
  const appEndDate = importantDates.find((d) => d.date_type === "application_end");

  return (
    <Card className="flex flex-col justify-between overflow-hidden border border-slate-200 bg-white transition-all hover:border-[#013089] hover:shadow-xs group">
      <CardContent className="p-4 space-y-3 flex flex-col justify-between h-full">
        <div className="space-y-2">
          {/* Authority and Exam Code */}
          <div className="flex items-center justify-between gap-1.5 flex-wrap">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <span className="inline-flex items-center rounded-xs bg-[#013089] px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                {org?.acronym || "COMMISSION"}
              </span>
              <span className="truncate max-w-[180px] text-slate-600">{org?.name}</span>
            </div>

            {exam.exam_code && (
              <span className="rounded-xs bg-slate-100 px-1.5 py-0.5 text-[10px] font-mono text-slate-600 border border-slate-200">
                {exam.exam_code}
              </span>
            )}
          </div>

          {/* Localized Title */}
          <Link href={`/exams/${exam.slug}`} className="block group-hover:text-[#013089] transition-colors">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug line-clamp-2 font-heading">
              {exam.title}
            </h3>
          </Link>

          {/* Localized Short summary / description */}
          {exam.description && (
            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
              {exam.description}
            </p>
          )}
        </div>

        {/* Structured Selection & Date Strip */}
        <div className="space-y-2 pt-1 border-t border-slate-100">
          <div className="rounded-xs bg-slate-50 p-2.5 space-y-1.5 text-xs border border-slate-100">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-500 flex items-center gap-1">
                <Layers className="h-3.5 w-3.5 text-slate-400" />
                <span>{t("card.stage")}:</span>
              </span>
              <span className="font-semibold text-slate-800">
                {stages.length > 0 ? `${stages.length} Stages Selection` : "Official Gazette Selection"}
              </span>
            </div>

            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-500 flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                <span>{t("card.exam_date")}:</span>
              </span>
              <span className="font-bold text-[#013089]">
                {examStartDate ? formatDate(examStartDate.event_date) : "Announced Shortly"}
              </span>
            </div>
          </div>

          {/* Card Footer */}
          <div className="flex items-center justify-between pt-1">
            {appEndDate ? (
              <span className="text-[10px] text-slate-500 flex items-center gap-1">
                <Clock className="h-3 w-3 text-slate-400" />
                <span>{t("card.closes")}: {formatDate(appEndDate.event_date)}</span>
              </span>
            ) : (
              <span className="text-[10px] text-slate-400">Official Calendar</span>
            )}

            <Link href={`/exams/${exam.slug}`}>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-[#013089] hover:underline">
                <span>{t("card.view_details")}</span>
                <ArrowRight className="h-3 w-3" />
              </span>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
