"use client";

import * as React from "react";
import Link from "next/link";
import { GovExamDetailed } from "../types";
import { formatDate } from "@/lib/utils";
import { Calendar, MapPin } from "lucide-react";

export interface ExamListTableProps {
  exams: GovExamDetailed[];
}

export function ExamListTable({ exams }: ExamListTableProps) {
  if (!exams || exams.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
        No active examination schedules found matching criteria.
      </div>
    );
  }

  return (
    <div className="w-full rounded-xl border border-slate-200/90 bg-white shadow-2xs divide-y divide-slate-100 overflow-hidden">
      {exams.map((exam) => {
        const orgName = exam.organization?.acronym || exam.organization?.name || "Govt";
        const examDateItem = exam.important_dates?.find(
          (d) => d.date_type === "exam_start" || d.title.toLowerCase().includes("exam")
        );

        return (
          <Link
            key={exam.id}
            href={`/exams/${exam.slug}`}
            className="group flex flex-col sm:flex-row sm:items-center justify-between py-2.5 px-3.5 sm:px-4 hover:bg-slate-50/90 transition-colors gap-1.5 sm:gap-4 text-sm"
          >
            {/* Left: Primary Title with Strongest Hierarchy */}
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <span className="font-bold text-slate-900 group-hover:text-[#013089] transition-colors leading-snug line-clamp-1">
                {exam.title}
              </span>
            </div>

            {/* Right: Restrained Metadata & Date Ledger on Single Line */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0 text-xs flex-wrap sm:flex-nowrap">
              {/* Organization Badge */}
              <span className="font-bold text-[#013089] bg-[#013089]/8 px-2 py-0.5 rounded text-[11.5px] whitespace-nowrap">
                {orgName}
              </span>

              {/* State or National Scope Tag */}
              {exam.state?.name ? (
                <span className="text-slate-600 bg-slate-100 px-2 py-0.5 rounded text-[11.5px] font-medium whitespace-nowrap">
                  {exam.state.name}
                </span>
              ) : null}

              {/* Exam Code or Mode */}
              {exam.exam_code && (
                <span className="text-slate-600 font-mono bg-slate-100 px-2 py-0.5 rounded text-[11px] truncate max-w-[130px] hidden md:inline-block">
                  {exam.exam_code}
                </span>
              )}

              {/* Exam Date */}
              {examDateItem?.event_date ? (
                <span className="font-mono text-[11.5px] font-semibold text-slate-700 bg-slate-100/80 px-2 py-0.5 rounded whitespace-nowrap">
                  Exam: {formatDate(examDateItem.event_date)}
                </span>
              ) : (
                <span className="text-slate-500 text-[11.5px] whitespace-nowrap">
                  Date: TBA
                </span>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
