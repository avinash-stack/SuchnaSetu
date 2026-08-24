"use client";

import * as React from "react";
import Link from "next/link";
import { GovJobDetailed } from "../types";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatNumber } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/context";
import { ArrowRight, Clock, MapPin, Users } from "lucide-react";

export interface JobListTableProps {
  jobs: GovJobDetailed[];
}

export function JobListTable({ jobs }: JobListTableProps) {
  const { t } = useLanguage();

  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
      {/* Desktop & Tablet Table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-left border-collapse table-fixed min-w-[620px] sm:min-w-0">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-100/90 text-xs sm:text-[13px] font-bold uppercase tracking-wider text-slate-700">
              <th className="py-3.5 px-4 w-[20%]">Authority</th>
              <th className="py-3.5 px-4 w-[42%]">Recruitment Title &amp; Details</th>
              <th className="py-3.5 px-4 w-[18%]">Vacancies &amp; Deadline</th>
              <th className="py-3.5 px-4 w-[20%] text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-800">
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
                  className="hover:bg-slate-50/90 transition-colors group"
                >
                  {/* Organization Column */}
                  <td className="py-4 px-4 align-top">
                    <div className="flex flex-col gap-1">
                      <span className="font-bold text-sm sm:text-[15px] text-[#013089] group-hover:underline truncate block">
                        {orgName}
                      </span>
                      {job.state ? (
                        <span className="text-xs text-slate-500 flex items-center gap-1 truncate">
                          <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                          <span>{job.state.name}</span>
                        </span>
                      ) : (
                        <span className="text-xs text-slate-500 font-medium">All India</span>
                      )}
                    </div>
                  </td>

                  {/* Job Title & Details Column */}
                  <td className="py-4 px-4 align-top">
                    <Link
                      href={`/jobs/${job.slug}`}
                      className="font-bold text-[15px] sm:text-base text-slate-900 hover:text-[#013089] transition-colors leading-snug line-clamp-2 block"
                      title={job.title}
                    >
                      {job.title}
                    </Link>
                    <div className="mt-1.5 flex items-center gap-2 flex-wrap text-xs text-slate-500">
                      {job.notification_number && (
                        <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-700 truncate max-w-[160px]">
                          Advt: {job.notification_number}
                        </span>
                      )}
                      {qualificationName && (
                        <span className="text-slate-700 bg-slate-100 px-2 py-0.5 rounded truncate max-w-[200px] font-medium">
                          {qualificationName}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Vacancies & Deadline Column */}
                  <td className="py-4 px-4 align-top">
                    <div className="space-y-1.5">
                      {job.total_vacancies && job.total_vacancies > 0 ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-bold text-xs font-mono border border-emerald-200">
                          {formatNumber(job.total_vacancies)} Posts
                        </span>
                      ) : (
                        <span className="text-slate-500 text-xs font-medium">See Circular</span>
                      )}

                      <div className="text-xs">
                        {job.application_end_date ? (
                          <div className={isClosingSoon ? "font-bold text-amber-700 font-mono text-xs" : "font-medium text-slate-600 text-xs font-mono"}>
                            Last: {formatDate(job.application_end_date)}
                          </div>
                        ) : (
                          <span className="text-slate-500 text-xs">Active Application</span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Action Column */}
                  <td className="py-4 px-4 align-top text-right whitespace-nowrap">
                    <Link
                      href={`/jobs/${job.slug}`}
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
        {jobs.map((job) => {
          const isClosingSoon = job.application_end_date
            ? new Date(job.application_end_date).getTime() - Date.now() < 5 * 86400000 &&
              new Date(job.application_end_date).getTime() > Date.now()
            : false;

          const orgName = job.organization?.acronym || job.organization?.name || "Govt Authority";

          return (
            <div key={job.id} className="p-4 space-y-2.5 hover:bg-slate-50/80 transition-colors">
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-xs text-[#013089] bg-brand-50 px-2 py-0.5 rounded border border-brand-100 truncate">
                  {orgName}
                </span>
                {job.total_vacancies && job.total_vacancies > 0 ? (
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-mono border border-emerald-200 shrink-0">
                    {formatNumber(job.total_vacancies)} Posts
                  </span>
                ) : null}
              </div>

              <Link
                href={`/jobs/${job.slug}`}
                className="block font-bold text-[15px] text-slate-900 hover:text-[#013089] transition-colors leading-snug line-clamp-2"
              >
                {job.title}
              </Link>

              <div className="flex items-center justify-between text-xs pt-2 text-slate-500 border-t border-slate-100">
                <span className={isClosingSoon ? "font-bold text-amber-700 font-mono" : "font-medium text-slate-600 font-mono"}>
                  Last: {job.application_end_date ? formatDate(job.application_end_date) : "Active"}
                </span>

                <Link
                  href={`/jobs/${job.slug}`}
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
