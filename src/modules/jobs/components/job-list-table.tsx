"use client";

import * as React from "react";
import Link from "next/link";
import { GovJobDetailed } from "../types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate, formatNumber } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/context";
import { ArrowRight, Clock, Building2, MapPin } from "lucide-react";

export interface JobListTableProps {
  jobs: GovJobDetailed[];
}

export function JobListTable({ jobs }: JobListTableProps) {
  const { t } = useLanguage();

  return (
    <div className="w-full rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
      {/* Desktop & Tablet Tabular View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-600">
              <th className="py-3 px-4 w-[18%]">Organization</th>
              <th className="py-3 px-4 w-[34%]">Job Title &amp; Advt No.</th>
              <th className="py-3 px-4 w-[12%] text-center">Vacancies</th>
              <th className="py-3 px-4 w-[16%]">Qualification</th>
              <th className="py-3 px-4 w-[12%]">Last Date</th>
              <th className="py-3 px-4 w-[8%] text-right">Action</th>
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
                  <td className="py-3.5 px-4 align-top">
                    <div className="flex flex-col gap-1">
                      <span className="font-bold text-[#013089] group-hover:underline inline-block">
                        {orgName}
                      </span>
                      {job.state ? (
                        <span className="text-[10px] text-slate-500 flex items-center gap-0.5">
                          <MapPin className="h-2.5 w-2.5 text-slate-400" />
                          <span>{job.state.name}</span>
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-mono">Central</span>
                      )}
                    </div>
                  </td>

                  {/* Job Title & Advt Column */}
                  <td className="py-3.5 px-4 align-top">
                    <Link
                      href={`/jobs/${job.slug}`}
                      className="font-bold text-slate-900 hover:text-[#013089] transition-colors leading-snug line-clamp-2"
                    >
                      {job.title}
                    </Link>
                    {job.notification_number && (
                      <div className="mt-1 text-[11px] font-mono text-slate-500">
                        Advt: <span className="font-semibold text-slate-700">{job.notification_number}</span>
                      </div>
                    )}
                  </td>

                  {/* Vacancies Column */}
                  <td className="py-3.5 px-4 align-top text-center">
                    {job.total_vacancies && job.total_vacancies > 0 ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-bold text-xs font-mono border border-emerald-200">
                        {formatNumber(job.total_vacancies)}
                      </span>
                    ) : (
                      <span className="text-slate-400 font-mono">-</span>
                    )}
                  </td>

                  {/* Qualification Column */}
                  <td className="py-3.5 px-4 align-top">
                    {qualificationName ? (
                      <span className="text-[11px] font-medium text-slate-700 line-clamp-2 leading-relaxed">
                        {qualificationName}
                      </span>
                    ) : (
                      <span className="text-slate-400 font-mono text-[11px]">Refer Notice</span>
                    )}
                  </td>

                  {/* Last Date Column */}
                  <td className="py-3.5 px-4 align-top">
                    {job.application_end_date ? (
                      <div className="flex flex-col gap-0.5">
                        <span className={`font-mono text-xs ${isClosingSoon ? "font-bold text-amber-700" : "font-semibold text-slate-800"}`}>
                          {formatDate(job.application_end_date)}
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
                      href={`/jobs/${job.slug}`}
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
            <div key={job.id} className="p-3.5 space-y-2 hover:bg-slate-50/70 transition-colors">
              {/* Header Badges */}
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-xs text-[#013089] bg-brand-50 px-2 py-0.5 rounded border border-brand-100 truncate">
                  {orgName}
                </span>
                {job.total_vacancies && job.total_vacancies > 0 ? (
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded font-mono border border-emerald-200 shrink-0">
                    {formatNumber(job.total_vacancies)} Posts
                  </span>
                ) : null}
              </div>

              {/* Title */}
              <Link
                href={`/jobs/${job.slug}`}
                className="block font-bold text-sm text-slate-900 hover:text-[#013089] transition-colors leading-snug line-clamp-2"
              >
                {job.title}
              </Link>

              {/* Condensed Metadata Grid */}
              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                {qualificationName && (
                  <div className="text-slate-600 truncate">
                    <span className="text-slate-400 font-semibold">Qual: </span>
                    <span>{qualificationName}</span>
                  </div>
                )}
                {job.application_end_date && (
                  <div className="text-slate-600 truncate text-right">
                    <span className="text-slate-400 font-semibold">Last Date: </span>
                    <span className={isClosingSoon ? "font-bold text-amber-700 font-mono" : "font-mono font-semibold"}>
                      {formatDate(job.application_end_date)}
                    </span>
                  </div>
                )}
              </div>

              {/* Bottom Action Strip */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                {job.notification_number ? (
                  <span className="text-[10px] font-mono text-slate-500 truncate max-w-[180px]">
                    Advt: {job.notification_number}
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-400 font-mono">Official Gazette</span>
                )}

                <Link href={`/jobs/${job.slug}`}>
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
