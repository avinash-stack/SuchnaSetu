"use client";

import * as React from "react";
import Link from "next/link";
import { GovExamDetailed } from "../types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/context";
import { ArrowRight, Clock, MapPin, Calendar, Layers } from "lucide-react";

export interface ExamListTableProps {
  exams: GovExamDetailed[];
}

export function ExamListTable({ exams }: ExamListTableProps) {
  const { t } = useLanguage();

  return (
    <div className="w-full rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
      {/* Desktop & Tablet Tabular View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-600">
              <th className="py-3 px-4 w-[18%]">Authority</th>
              <th className="py-3 px-4 w-[34%]">Exam Title &amp; Code</th>
              <th className="py-3 px-4 w-[14%]">Exam Date</th>
              <th className="py-3 px-4 w-[14%]">Stages / Mode</th>
              <th className="py-3 px-4 w-[12%]">Last Date</th>
              <th className="py-3 px-4 w-[8%] text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs text-slate-800">
            {exams.map((exam) => {
              const orgName = exam.organization?.acronym || exam.organization?.name || "Govt Authority";
              
              // Extract next exam date or schedule
              const examDateItem = exam.important_dates?.find(
                (d) => d.date_type === "exam_start" || d.title.toLowerCase().includes("exam")
              );
              const lastDateItem = exam.important_dates?.find(
                (d) => d.date_type === "application_end" || d.title.toLowerCase().includes("last") || d.title.toLowerCase().includes("closing")
              );

              const isClosingSoon = lastDateItem?.event_date
                ? new Date(lastDateItem.event_date).getTime() - Date.now() < 5 * 86400000 &&
                  new Date(lastDateItem.event_date).getTime() > Date.now()
                : false;

              // Format mode string
              const modeLabel = exam.mode
                ? exam.mode.replace("_", " ").toUpperCase()
                : "CBT / Offline";
              const stageCount = exam.stages?.length || 0;

              return (
                <tr
                  key={exam.id}
                  className="hover:bg-slate-50/80 transition-colors group"
                >
                  {/* Authority Column */}
                  <td className="py-3.5 px-4 align-top">
                    <div className="flex flex-col gap-1">
                      <span className="font-bold text-[#013089] group-hover:underline inline-block">
                        {orgName}
                      </span>
                      {exam.state ? (
                        <span className="text-[10px] text-slate-500 flex items-center gap-0.5">
                          <MapPin className="h-2.5 w-2.5 text-slate-400" />
                          <span>{exam.state.name}</span>
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-mono">National</span>
                      )}
                    </div>
                  </td>

                  {/* Exam Title & Code */}
                  <td className="py-3.5 px-4 align-top">
                    <Link
                      href={`/exams/${exam.slug}`}
                      className="font-bold text-slate-900 hover:text-[#013089] transition-colors leading-snug line-clamp-2"
                    >
                      {exam.title}
                    </Link>
                    {exam.exam_code && (
                      <div className="mt-1 text-[11px] font-mono text-slate-500">
                        Code: <span className="font-semibold text-slate-700">{exam.exam_code}</span>
                      </div>
                    )}
                  </td>

                  {/* Exam Date Column */}
                  <td className="py-3.5 px-4 align-top">
                    {examDateItem?.event_date ? (
                      <div className="flex flex-col gap-0.5">
                        <span className="font-semibold text-slate-800 font-mono text-xs">
                          {formatDate(examDateItem.event_date)}
                        </span>
                        {examDateItem.is_tentative && (
                          <span className="text-[10px] text-amber-700 font-medium">(Tentative)</span>
                        )}
                      </div>
                    ) : (
                      <span className="text-slate-400 font-mono text-[11px]">As per Schedule</span>
                    )}
                  </td>

                  {/* Stages / Mode Column */}
                  <td className="py-3.5 px-4 align-top">
                    <div className="flex flex-col gap-1">
                      <span className="text-[11px] font-semibold text-slate-700">
                        {modeLabel}
                      </span>
                      {stageCount > 0 ? (
                        <span className="text-[10px] text-slate-500 flex items-center gap-1">
                          <Layers className="h-2.5 w-2.5 text-slate-400" />
                          <span>{stageCount} {stageCount === 1 ? "Stage" : "Stages"}</span>
                        </span>
                      ) : null}
                    </div>
                  </td>

                  {/* Last Date Column */}
                  <td className="py-3.5 px-4 align-top">
                    {lastDateItem?.event_date ? (
                      <div className="flex flex-col gap-0.5">
                        <span className={`font-mono text-xs ${isClosingSoon ? "font-bold text-amber-700" : "font-semibold text-slate-800"}`}>
                          {formatDate(lastDateItem.event_date)}
                        </span>
                        {isClosingSoon && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-amber-700">
                            <Clock className="h-2.5 w-2.5" />
                            <span>Closes Soon</span>
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-slate-400 text-[11px] font-mono">Active</span>
                    )}
                  </td>

                  {/* Action Column */}
                  <td className="py-3.5 px-4 align-top text-right">
                    <Link
                      href={`/exams/${exam.slug}`}
                      className="inline-flex items-center justify-center font-semibold rounded-md h-7 px-2.5 text-[11px] font-bold text-[#013089] hover:bg-[#013089] hover:text-white border border-[#013089]/30 shadow-none shrink-0 transition-all select-none"
                    >
                      <span>{t("card.view_details")}</span>
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile High-Density Stacked List View */}
      <div className="md:hidden divide-y divide-slate-100">
        {exams.map((exam) => {
          const orgName = exam.organization?.acronym || exam.organization?.name || "Govt Authority";
          const examDateItem = exam.important_dates?.find(
            (d) => d.date_type === "exam_start" || d.title.toLowerCase().includes("exam")
          );
          const lastDateItem = exam.important_dates?.find(
            (d) => d.date_type === "application_end" || d.title.toLowerCase().includes("last") || d.title.toLowerCase().includes("closing")
          );

          const isClosingSoon = lastDateItem?.event_date
            ? new Date(lastDateItem.event_date).getTime() - Date.now() < 5 * 86400000 &&
              new Date(lastDateItem.event_date).getTime() > Date.now()
            : false;

          return (
            <div key={exam.id} className="p-3.5 space-y-2 hover:bg-slate-50/70 transition-colors">
              {/* Header Badges */}
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-xs text-[#013089] bg-brand-50 px-2 py-0.5 rounded border border-brand-100 truncate">
                  {orgName}
                </span>
                {exam.mode && (
                  <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded uppercase font-mono">
                    {exam.mode.replace("_", " ")}
                  </span>
                )}
              </div>

              {/* Title */}
              <Link
                href={`/exams/${exam.slug}`}
                className="block font-bold text-sm text-slate-900 hover:text-[#013089] transition-colors leading-snug line-clamp-2"
              >
                {exam.title}
              </Link>

              {/* Condensed Metadata Grid */}
              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                {examDateItem?.event_date && (
                  <div className="text-slate-600 truncate">
                    <span className="text-slate-400 font-semibold">Exam: </span>
                    <span className="font-mono font-semibold">{formatDate(examDateItem.event_date)}</span>
                  </div>
                )}
                {lastDateItem?.event_date && (
                  <div className="text-slate-600 truncate text-right">
                    <span className="text-slate-400 font-semibold">Last Date: </span>
                    <span className={isClosingSoon ? "font-bold text-amber-700 font-mono" : "font-mono font-semibold"}>
                      {formatDate(lastDateItem.event_date)}
                    </span>
                  </div>
                )}
              </div>

              {/* Bottom Action Strip */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                {exam.exam_code ? (
                  <span className="text-[10px] font-mono text-slate-500 truncate max-w-[180px]">
                    Code: {exam.exam_code}
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-400 font-mono">Official Calendar</span>
                )}

                <Link href={`/exams/${exam.slug}`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-6 px-2 text-[10px] font-bold text-[#013089] hover:bg-[#013089] hover:text-white border-[#013089]/30"
                  >
                    <span>{t("card.view_details")}</span>
                    <ArrowRight className="h-2.5 w-2.5 ml-1" />
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
