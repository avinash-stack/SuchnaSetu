"use client";

import * as React from "react";
import Link from "next/link";
import { GovExamDetailed } from "../types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/context";
import { ArrowRight, Clock, MapPin, Calendar } from "lucide-react";

export interface ExamListTableProps {
  exams: GovExamDetailed[];
}

export function ExamListTable({ exams }: ExamListTableProps) {
  const { t } = useLanguage();

  return (
    <div className="w-full rounded-xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
      {/* Desktop & Tablet View (Fixed Width - No Horizontal Scroll) */}
      <div className="hidden sm:block">
        <table className="w-full text-left border-collapse table-fixed">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-600">
              <th className="py-2.5 px-3 w-[22%]">Authority</th>
              <th className="py-2.5 px-3 w-[44%]">Exam Name &amp; Code</th>
              <th className="py-2.5 px-3 w-[18%]">Schedule / Stage</th>
              <th className="py-2.5 px-3 w-[16%] text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs text-slate-800">
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
                  className="hover:bg-slate-50/80 transition-colors group"
                >
                  {/* Authority Column */}
                  <td className="py-3 px-3 align-top">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-bold text-[#013089] group-hover:underline truncate block">
                        {orgName}
                      </span>
                      {exam.state ? (
                        <span className="text-[10px] text-slate-500 flex items-center gap-0.5 truncate">
                          <MapPin className="h-2.5 w-2.5 text-slate-400 shrink-0" />
                          <span>{exam.state.name}</span>
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-mono">National</span>
                      )}
                    </div>
                  </td>

                  {/* Exam Title & Code */}
                  <td className="py-3 px-3 align-top">
                    <Link
                      href={`/exams/${exam.slug}`}
                      className="font-bold text-slate-900 hover:text-[#013089] transition-colors leading-snug line-clamp-2 block"
                      title={exam.title}
                    >
                      {exam.title}
                    </Link>
                    {exam.exam_code && (
                      <div className="mt-0.5 text-[10px] font-mono text-slate-500 truncate">
                        Code: <span className="font-semibold text-slate-700">{exam.exam_code}</span>
                      </div>
                    )}
                  </td>

                  {/* Schedule Column */}
                  <td className="py-3 px-3 align-top">
                    <div className="space-y-0.5">
                      {examDateItem?.event_date ? (
                        <div className="font-semibold text-slate-800 font-mono text-[11px] truncate">
                          {formatDate(examDateItem.event_date)}
                        </div>
                      ) : (
                        <span className="text-slate-500 text-[10px]">TBA / Refer Notice</span>
                      )}

                      {lastDateItem?.event_date && (
                        <div className={isClosingSoon ? "font-bold text-amber-700 font-mono text-[10px]" : "text-slate-500 font-mono text-[10px]"}>
                          Last: {formatDate(lastDateItem.event_date)}
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Action Column */}
                  <td className="py-3 px-3 align-top text-right whitespace-nowrap">
                    <Link
                      href={`/exams/${exam.slug}`}
                      className="inline-flex items-center justify-center font-bold rounded-md h-7 px-2.5 text-[11px] text-[#013089] bg-brand-50/50 hover:bg-[#013089] hover:text-white border border-[#013089]/30 transition-all select-none gap-1"
                    >
                      <span>View</span>
                      <ArrowRight className="h-3 w-3" />
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
            <div key={exam.id} className="p-3 space-y-2 hover:bg-slate-50/70 transition-colors">
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-[11px] text-[#013089] bg-brand-50 px-1.5 py-0.5 rounded border border-brand-100 truncate">
                  {orgName}
                </span>
                {exam.exam_code && (
                  <span className="text-[10px] font-mono text-slate-500 truncate">
                    {exam.exam_code}
                  </span>
                )}
              </div>

              <Link
                href={`/exams/${exam.slug}`}
                className="block font-bold text-xs text-slate-900 hover:text-[#013089] transition-colors leading-snug line-clamp-2"
              >
                {exam.title}
              </Link>

              <div className="flex items-center justify-between text-[10px] pt-1 text-slate-500 border-t border-slate-100">
                <span>{examDateItem ? `Exam: ${formatDate(examDateItem.event_date)}` : "Exam Date: TBA"}</span>

                <Link
                  href={`/exams/${exam.slug}`}
                  className="inline-flex items-center gap-1 font-bold text-[#013089] hover:underline"
                >
                  <span>View Details</span>
                  <ArrowRight className="h-2.5 w-2.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
