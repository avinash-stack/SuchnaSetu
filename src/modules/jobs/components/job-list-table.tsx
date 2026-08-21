"use client";

import * as React from "react";
import Link from "next/link";
import { GovJobDetailed } from "../types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate, formatNumber } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/context";
import { ArrowRight, Clock, MapPin, Users } from "lucide-react";

export interface JobListTableProps {
  jobs: GovJobDetailed[];
}

export function JobListTable({ jobs }: JobListTableProps) {
  const { t } = useLanguage();

  return (
    <div className="w-full rounded-xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
      {/* Desktop & Tablet Table (Fixed Width Columns - No Horizontal Scroll) */}
      <div className="hidden sm:block">
        <table className="w-full text-left border-collapse table-fixed">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-600">
              <th className="py-2.5 px-3 w-[22%]">Organization</th>
              <th className="py-2.5 px-3 w-[42%]">Job Title &amp; Details</th>
              <th className="py-2.5 px-3 w-[18%]">Vacancies &amp; Deadline</th>
              <th className="py-2.5 px-3 w-[18%] text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs text-slate-800">
            {jobs.map((job) => {
              const isClosingSoon = job.application_end_date
                ? new Date(job.application_end_date).getTime() - Date.now() < 5 * 86400000 &&
                  new Date(job.application_end_date).getTime() > Date.now()
                : false;

              const orgName = job.organization?.acronym || job.organization?.name || "Govt Authority";
              const qualificationName =
                job.qualification?.name ||
                job.qualification_summary ||
                job.eligibility?.education_qualification ||
                null;

              return (
                <tr
                  key={job.id}
                  className="hover:bg-slate-50/80 transition-colors group"
                >
                  {/* Organization Column */}
                  <td className="py-3 px-3 align-top">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-bold text-[#013089] group-hover:underline truncate block">
                        {orgName}
                      </span>
                      {job.state ? (
                        <span className="text-[10px] text-slate-500 flex items-center gap-0.5 truncate">
                          <MapPin className="h-2.5 w-2.5 text-slate-400 shrink-0" />
                          <span>{job.state.name}</span>
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-mono">All India</span>
                      )}
                    </div>
                  </td>

                  {/* Job Title & Details Column */}
                  <td className="py-3 px-3 align-top">
                    <Link
                      href={`/jobs/${job.slug}`}
                      className="font-bold text-slate-900 hover:text-[#013089] transition-colors leading-snug line-clamp-2 block"
                      title={job.title}
                    >
                      {job.title}
                    </Link>
                    <div className="mt-1 flex items-center gap-2 flex-wrap text-[10px] text-slate-500">
                      {job.notification_number && (
                        <span className="font-mono truncate max-w-[140px]">
                          Advt: {job.notification_number}
                        </span>
                      )}
                      {qualificationName && (
                        <span className="text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded truncate max-w-[180px]">
                          {qualificationName}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Vacancies & Deadline Column */}
                  <td className="py-3 px-3 align-top">
                    <div className="space-y-1">
                      {job.total_vacancies && job.total_vacancies > 0 ? (
                        <span className="inline-flex items-center px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-800 font-bold text-[11px] font-mono border border-emerald-200">
                          {formatNumber(job.total_vacancies)} Posts
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[10px] font-mono">See Circular</span>
                      )}

                      <div className="text-[11px]">
                        {job.application_end_date ? (
                          <div className={isClosingSoon ? "font-bold text-amber-700 font-mono text-[10px]" : "font-mono text-slate-600 text-[10px]"}>
                            Last: {formatDate(job.application_end_date)}
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[10px] font-mono">Active</span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Action Column */}
                  <td className="py-3 px-3 align-top text-right whitespace-nowrap">
                    <Link
                      href={`/jobs/${job.slug}`}
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
        {jobs.map((job) => {
          const isClosingSoon = job.application_end_date
            ? new Date(job.application_end_date).getTime() - Date.now() < 5 * 86400000 &&
              new Date(job.application_end_date).getTime() > Date.now()
            : false;

          const orgName = job.organization?.acronym || job.organization?.name || "Govt Authority";
          const qualificationName =
            job.qualification?.name ||
            job.qualification_summary ||
            job.eligibility?.education_qualification ||
            null;

          return (
            <div key={job.id} className="p-3 space-y-2 hover:bg-slate-50/70 transition-colors">
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-[11px] text-[#013089] bg-brand-50 px-1.5 py-0.5 rounded border border-brand-100 truncate">
                  {orgName}
                </span>
                {job.total_vacancies && job.total_vacancies > 0 ? (
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded font-mono border border-emerald-200 shrink-0">
                    {formatNumber(job.total_vacancies)} Posts
                  </span>
                ) : null}
              </div>

              <Link
                href={`/jobs/${job.slug}`}
                className="block font-bold text-xs text-slate-900 hover:text-[#013089] transition-colors leading-snug line-clamp-2"
              >
                {job.title}
              </Link>

              <div className="flex items-center justify-between text-[10px] pt-1 text-slate-500 border-t border-slate-100">
                <span>Last: {job.application_end_date ? formatDate(job.application_end_date) : "Active"}</span>

                <Link
                  href={`/jobs/${job.slug}`}
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
