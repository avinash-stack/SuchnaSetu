"use client";

import * as React from "react";
import Link from "next/link";
import { GovExamDetailed } from "../types";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/context";
import { ArrowRight, Clock, MapPin, Calendar } from "lucide-react";

export interface ExamListTableProps {
  exams: GovExamDetailed[];
}

export function ExamListTable({ exams }: ExamListTableProps) {
  const { t } = useLanguage();

  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
      {/* Desktop & Tablet View */}
      <div className="hidden sm:block">
        <table className="w-full text-left border-collapse table-fixed">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-100/90 text-xs sm:text-[13px] font-bold uppercase tracking-wider text-slate-700">
              <th className="py-3.5 px-4 w-[20%]">Authority</th>
              <th className="py-3.5 px-4 w-[42%]">Examination Title &amp; Code</th>
              <th className="py-3.5 px-4 w-[18%]">Schedule / Deadline</th>
              <th className="py-3.5 px-4 w-[20%] text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-800">
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
                <tr
                  key={exam.id}
                  className="hover:bg-slate-50/90 transition-colors group"
                >
                  {/* Authority Column */}
                  <td className="py-4 px-4 align-top">
                    <div className="flex flex-col gap-1">
                      <span className="font-bold text-sm sm:text-[15px] text-[#013089] group-hover:underline truncate block">
                        {orgName}
                      </span>
                      {exam.state ? (
                        <span className="text-xs text-slate-500 flex items-center gap-1 truncate">
                          <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                          <span>{exam.state.name}</span>
                        </span>
                      ) : (
                        <span className="text-xs text-slate-500 font-medium">National Commission</span>
                      )}
                    </div>
                  </td>

                  {/* Exam Title & Code */}
                  <td className="py-4 px-4 align-top">
                    <Link
                      href={`/exams/${exam.slug}`}
                      className="font-bold text-[15px] sm:text-base text-slate-900 hover:text-[#013089] transition-colors leading-snug line-clamp-2 block"
                      title={exam.title}
                    >
                      {exam.title}
                    </Link>
                    {exam.exam_code && (
                      <div className="mt-1 text-xs font-mono text-slate-500 truncate">
                        Code: <span className="font-semibold text-slate-700">{exam.exam_code}</span>
                      </div>
                    )}
                  </td>

                  {/* Schedule Column */}
                  <td className="py-4 px-4 align-top">
                    <div className="space-y-1">
                      {examDateItem?.event_date ? (
                        <div className="font-semibold text-slate-900 font-mono text-xs sm:text-[13px] truncate">
                          {formatDate(examDateItem.event_date)}
                        </div>
                      ) : (
                        <span className="text-slate-500 text-xs font-medium">Refer Notification</span>
                      )}

                      {lastDateItem?.event_date && (
                        <div className={isClosingSoon ? "font-bold text-amber-700 font-mono text-xs" : "text-slate-500 font-mono text-xs"}>
                          Last: {formatDate(lastDateItem.event_date)}
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Action Column */}
                  <td className="py-4 px-4 align-top text-right whitespace-nowrap">
                    <Link
                      href={`/exams/${exam.slug}`}
                      className="inline-flex items-center justify-center font-bold rounded-lg h-8 px-3.5 text-xs sm:text-[13px] text-[#013089] bg-[#013089]/10 hover:bg-[#013089] hover:text-white border border-[#013089]/20 transition-all select-none gap-1.5 shadow-2xs"
                    >
                      <span>View Details</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Stacked List View */}
      <div className="sm:hidden divide-y divide-slate-100">
        {exams.map((exam) => {
          const orgName = exam.organization?.acronym || exam.organization?.name || "Govt Authority";
          const examDateItem = exam.important_dates?.find(
            (d) => d.date_type === "exam_start" || d.title.toLowerCase().includes("exam")
          );

          return (
            <div key={exam.id} className="p-4 space-y-2.5 hover:bg-slate-50/80 transition-colors">
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-xs text-[#013089] bg-brand-50 px-2 py-0.5 rounded border border-brand-100 truncate">
                  {orgName}
                </span>
                {exam.exam_code && (
                  <span className="text-xs font-mono text-slate-600 truncate font-semibold">
                    {exam.exam_code}
                  </span>
                )}
              </div>

              <Link
                href={`/exams/${exam.slug}`}
                className="block font-bold text-[15px] text-slate-900 hover:text-[#013089] transition-colors leading-snug line-clamp-2"
              >
                {exam.title}
              </Link>

              <div className="flex items-center justify-between text-xs pt-2 text-slate-500 border-t border-slate-100">
                <span className="font-medium">{examDateItem ? `Exam: ${formatDate(examDateItem.event_date)}` : "Exam Date: TBA"}</span>

                <Link
                  href={`/exams/${exam.slug}`}
                  className="inline-flex items-center gap-1 font-bold text-xs text-[#013089] hover:underline"
                >
                  <span>View Details</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
