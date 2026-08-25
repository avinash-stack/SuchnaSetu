"use client";

import * as React from "react";
import Link from "next/link";
import { GovJobDetailed } from "../types";
import { formatDate } from "@/lib/utils";
import { MapPin, Clock } from "lucide-react";

export interface JobListTableProps {
  jobs: GovJobDetailed[];
}

export function JobListTable({ jobs }: JobListTableProps) {
  if (!jobs || jobs.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
        No active government recruitment notifications found matching criteria.
      </div>
    );
  }

  return (
    <div className="w-full rounded-xl border border-slate-200/90 bg-white shadow-2xs divide-y divide-slate-100 overflow-hidden">
      {jobs.map((job) => {
        const isClosingSoon = job.application_end_date
          ? new Date(job.application_end_date).getTime() - Date.now() < 5 * 86400000 &&
            new Date(job.application_end_date).getTime() > Date.now()
          : false;

        const isClosed = job.application_end_date
          ? new Date(job.application_end_date).getTime() < Date.now()
          : false;

        const orgName = job.organization?.acronym || job.organization?.name || "Govt";
        const qualification =
          job.qualification?.name ||
          job.qualification_summary ||
          job.eligibility?.education_qualification ||
          null;

        return (
          <Link
            key={job.id}
            href={`/jobs/${job.slug}`}
            className="group flex flex-col sm:flex-row sm:items-center justify-between py-2.5 px-3.5 sm:px-4 hover:bg-slate-50/90 transition-colors gap-1.5 sm:gap-4 text-sm"
          >
            {/* Left: Primary Title with Strongest Hierarchy */}
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <span className="font-bold text-slate-900 group-hover:text-[#013089] transition-colors leading-snug line-clamp-1">
                {job.title}
              </span>
            </div>

            {/* Right: Restrained Metadata & Date Ledger on Single Line */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0 text-xs flex-wrap sm:flex-nowrap">
              {/* Organization Badge */}
              <span className="font-bold text-[#013089] bg-[#013089]/8 px-2 py-0.5 rounded text-[11.5px] whitespace-nowrap">
                {orgName}
              </span>

              {/* State or All India Tag */}
              {job.state?.name ? (
                <span className="text-slate-600 bg-slate-100 px-2 py-0.5 rounded text-[11.5px] font-medium whitespace-nowrap">
                  {job.state.name}
                </span>
              ) : null}

              {/* Qualification Tag */}
              {qualification && (
                <span className="text-slate-600 bg-slate-100 px-2 py-0.5 rounded text-[11.5px] font-medium truncate max-w-[140px] hidden md:inline-block">
                  {qualification}
                </span>
              )}

              {/* Date / Closing Status */}
              {job.application_end_date && !isClosed ? (
                <span
                  className={`font-mono text-[11.5px] font-semibold whitespace-nowrap ${
                    isClosingSoon ? "text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded" : "text-slate-500"
                  }`}
                >
                  {formatDate(job.application_end_date)}
                </span>
              ) : isClosed ? (
                <span className="text-[10.5px] font-semibold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded whitespace-nowrap">
                  Closed
                </span>
              ) : (
                <span className="text-emerald-700 text-[11.5px] font-semibold whitespace-nowrap">
                  Active
                </span>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
