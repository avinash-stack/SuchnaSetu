"use client";

import * as React from "react";
import Link from "next/link";
import { GovJobDetailed } from "../types";
import { useLanguage } from "@/lib/i18n/context";
import { resolveLocalizedJob } from "@/lib/i18n/localize";
import { formatDate, formatINR, formatNumber, formatApplicationFee } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import {
  Building2,
  Calendar,
  IndianRupee,
  Users,
  MapPin,
  FileText,
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
  GraduationCap,
  Briefcase,
  Layers,
  FileSpreadsheet,
  Globe,
  Clock,
  ChevronRight,
  FileCheck2,
  CreditCard,
} from "lucide-react";

interface JobDetailViewProps {
  job: GovJobDetailed;
}

export function JobDetailView({ job: rawJob }: JobDetailViewProps) {
  const { language, t } = useLanguage();
  const job = resolveLocalizedJob(rawJob, language);

  const org = job.organization;
  const dept = job.department;
  const qual = job.qualification;
  const state = job.state;
  const vacancies = job.vacancies || [];
  const dates = job.important_dates || [];
  const eligibility = job.eligibility;
  const documents = job.official_documents || [];

  const isClosingSoon = job.application_end_date
    ? new Date(job.application_end_date).getTime() - Date.now() < 5 * 86400000 &&
      new Date(job.application_end_date).getTime() > Date.now()
    : false;

  const salaryDisplay =
    job.salary_min || job.salary_max
      ? `${formatINR(job.salary_min)} - ${formatINR(job.salary_max)}`
      : job.pay_scale_details || null;

  const educationalQualification =
    job.qualification_summary ||
    qual?.name ||
    eligibility?.education_qualification ||
    null;

  const ageLimits =
    job.age_limit_summary ||
    (eligibility?.min_age && eligibility?.max_age
      ? `Min: ${eligibility.min_age} Yrs | Max: ${eligibility.max_age} Yrs`
      : eligibility?.max_age
        ? `Max: ${eligibility.max_age} Yrs`
        : null);

  const selectionProcess =
    job.selection_process ||
    eligibility?.selection_process ||
    null;

  const applicationFee = formatApplicationFee(eligibility?.application_fee_details);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-slate-800 transition-colors">
          {t("nav.home")}
        </Link>
        <ChevronRight className="h-3 w-3 text-slate-400" />
        <Link href="/jobs" className="hover:text-slate-800 transition-colors">
          {t("nav.jobs")}
        </Link>
        <ChevronRight className="h-3 w-3 text-slate-400" />
        <span className="font-semibold text-slate-800 truncate max-w-[220px] sm:max-w-md">
          {org?.acronym || org?.name || "Job Notice"}
        </span>
      </nav>

      {/* SECTION 1: HEADER & KEY SUMMARY */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-7 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="brand" className="text-xs font-bold py-0.5 px-2.5 bg-[#013089] text-white">
              {org?.acronym || org?.name || "Government Authority"}
            </Badge>
            {dept && (
              <Badge variant="outline" className="text-xs font-medium text-slate-700">
                {dept.name}
              </Badge>
            )}
            {job.category && (
              <Badge variant="default" className="text-xs">
                {job.category.name}
              </Badge>
            )}
            <Badge variant="success" className="text-xs bg-emerald-100 text-emerald-800 border-emerald-200">
              <ShieldCheck className="h-3 w-3 mr-1" />
              Verified Official Notice
            </Badge>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <MapPin className="h-3.5 w-3.5 text-slate-400" />
            <span>{state ? state.name : "All India Jurisdiction"}</span>
          </div>
        </div>

        {/* Localized Title */}
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 font-heading leading-snug">
          {job.title}
        </h1>

        {job.notification_number && (
          <div className="mt-2 text-xs font-mono text-slate-600">
            {t("card.advt_no")}: <span className="font-semibold text-slate-900">{job.notification_number}</span>
          </div>
        )}

        {(job.summary || job.description) && (
          <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed max-w-4xl border-t border-slate-100 pt-3">
            {job.summary || job.description}
          </p>
        )}

        {/* Primary Action Button Bar */}
        <div className="flex flex-wrap items-center gap-3 mt-5 pt-4 border-t border-slate-100">
          {job.official_apply_url && (
            <a
              href={job.official_apply_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center font-semibold rounded-md h-9 px-4 text-xs sm:text-sm gap-2 bg-[#013089] hover:bg-[#01276E] text-white shadow-xs select-none active:scale-[0.99] transition-all"
            >
              <span>{t("card.apply_now")}</span>
              <ExternalLink className="h-4 w-4" />
            </a>
          )}

          {job.official_notification_url && (
            <a
              href={job.official_notification_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center font-semibold rounded-md h-9 px-4 text-xs sm:text-sm gap-2 text-[#013089] border border-[#013089]/40 hover:bg-brand-50 hover:border-[#013089] bg-white select-none active:scale-[0.99] transition-all"
            >
              <FileText className="h-4 w-4 text-[#013089]" />
              <span>{t("card.official_notification")}</span>
              <ExternalLink className="h-3.5 w-3.5 ml-0.5 text-slate-400" />
            </a>
          )}

          {org?.website_url && (
            <a
              href={org.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center justify-center font-semibold rounded-md h-9 px-3 text-xs gap-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 select-none active:scale-[0.99] transition-all"
            >
              <Building2 className="h-3.5 w-3.5" />
              <span>Official Website</span>
              <ExternalLink className="h-3 w-3 ml-0.5 text-slate-400" />
            </a>
          )}
        </div>
      </div>

      {/* SECTION 2: QUICK INFORMATION TABLE */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="bg-slate-50/80 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#013089]">
            <Briefcase className="h-4 w-4" />
            <span>Quick Information Overview</span>
          </div>
          {job.total_vacancies && job.total_vacancies > 0 ? (
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-mono border border-emerald-200">
              {formatNumber(job.total_vacancies)} Posts
            </span>
          ) : null}
        </div>

        <div className="p-4 sm:p-5">
          <table className="w-full text-xs text-slate-800 border-collapse">
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50/50">
                <td className="py-2.5 px-3 font-semibold text-slate-600 w-1/3 sm:w-1/4">Recruiting Authority</td>
                <td className="py-2.5 px-3 font-bold text-slate-900">{org?.name || "Official Government Authority"}</td>
              </tr>
              {job.post_name && (
                <tr className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-3 font-semibold text-slate-600">Post Designation</td>
                  <td className="py-2.5 px-3 font-bold text-slate-900">{job.post_name}</td>
                </tr>
              )}
              {job.total_vacancies && job.total_vacancies > 0 ? (
                <tr className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-3 font-semibold text-slate-600">{t("card.vacancies")}</td>
                  <td className="py-2.5 px-3 font-bold text-emerald-700 font-mono text-sm">
                    {formatNumber(job.total_vacancies)} {t("card.posts")}
                  </td>
                </tr>
              ) : null}
              {salaryDisplay && (
                <tr className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-3 font-semibold text-slate-600">Pay Scale / Remuneration</td>
                  <td className="py-2.5 px-3 font-bold text-slate-900">{salaryDisplay}</td>
                </tr>
              )}
              {job.employment_type && (
                <tr className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-3 font-semibold text-slate-600">Employment Type</td>
                  <td className="py-2.5 px-3 capitalize text-slate-900">{job.employment_type.replace("_", " ")}</td>
                </tr>
              )}
              <tr className="hover:bg-slate-50/50">
                <td className="py-2.5 px-3 font-semibold text-slate-600">Jurisdiction / Location</td>
                <td className="py-2.5 px-3 text-slate-900">{state ? state.name : "All India / Central"}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 3: IMPORTANT DATES */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="bg-slate-50/80 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#013089]">
            <Calendar className="h-4 w-4" />
            <span>Important Dates &amp; Deadlines</span>
          </div>
          {isClosingSoon && (
            <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>Application Closing Soon</span>
            </span>
          )}
        </div>

        <div className="p-4 sm:p-5">
          <table className="w-full text-xs text-slate-800 border-collapse">
            <tbody className="divide-y divide-slate-100">
              {job.application_start_date && (
                <tr className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-3 font-semibold text-slate-600 w-1/2 sm:w-1/3">Application Start Date</td>
                  <td className="py-2.5 px-3 font-mono font-semibold text-slate-900">
                    {formatDate(job.application_start_date)}
                  </td>
                </tr>
              )}
              {job.application_end_date && (
                <tr className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-3 font-semibold text-slate-600">Last Date to Apply</td>
                  <td className={`py-2.5 px-3 font-mono ${isClosingSoon ? "font-bold text-amber-700" : "font-bold text-slate-900"}`}>
                    {formatDate(job.application_end_date)}
                  </td>
                </tr>
              )}
              {dates.map((d, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-3 font-semibold text-slate-600">{d.event_name}</td>
                  <td className="py-2.5 px-3 font-mono font-semibold text-slate-900">
                    {formatDate(d.event_date)} {d.is_tentative ? "(Tentative)" : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 4: ELIGIBILITY & VACANCY BREAKDOWN */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="bg-slate-50/80 px-4 py-3 border-b border-slate-200">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#013089]">
            <GraduationCap className="h-4 w-4" />
            <span>Eligibility Criteria &amp; Qualification</span>
          </div>
        </div>

        <div className="p-4 sm:p-5 space-y-4 text-xs text-slate-800">
          {educationalQualification && (
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
              <div className="font-bold text-slate-900 text-xs uppercase tracking-wide">Educational Qualification</div>
              <p className="text-slate-700 leading-relaxed">{educationalQualification}</p>
            </div>
          )}

          {ageLimits && (
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
              <div className="font-bold text-slate-900 text-xs uppercase tracking-wide">Age Limit &amp; Relaxations</div>
              <p className="text-slate-700 leading-relaxed font-mono">{ageLimits}</p>
              {eligibility?.age_relaxation_details && (
                <p className="text-slate-600 text-[11px] mt-1">{eligibility.age_relaxation_details}</p>
              )}
            </div>
          )}

          {applicationFee && (
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
              <div className="font-bold text-slate-900 text-xs uppercase tracking-wide flex items-center gap-1.5">
                <CreditCard className="h-3.5 w-3.5 text-[#013089]" />
                <span>Application Fee Details</span>
              </div>
              <p className="text-slate-700 leading-relaxed whitespace-pre-line">{applicationFee}</p>
            </div>
          )}

          {/* Category-wise Vacancy Breakdown Table */}
          {vacancies.length > 0 && (() => {
            // Only show category columns if at least one vacancy has actual category data
            const hasCategoryData = vacancies.some(
              (v) => v.ur_posts || v.ews_posts || v.obc_posts || v.sc_posts || v.st_posts
            );
            return (
              <div className="space-y-2 pt-2">
                <div className="font-bold text-slate-900 text-xs uppercase tracking-wide flex items-center justify-between">
                  <span>{hasCategoryData ? "Category-wise Vacancy Distribution" : "Vacancy Details"}</span>
                  {job.total_vacancies && job.total_vacancies > 0 ? (
                    <span className="font-mono text-[11px] text-slate-500 font-normal">
                      Total: {formatNumber(job.total_vacancies)} Posts
                    </span>
                  ) : null}
                </div>
                <div className="overflow-x-auto rounded-lg border border-slate-200">
                  <Table>
                    <TableHeader className="bg-slate-50">
                      <TableRow className="text-[11px] uppercase">
                        <TableHead className="font-bold text-slate-700">Post Name</TableHead>
                        {hasCategoryData && (
                          <>
                            <TableHead className="font-bold text-slate-700 text-center">UR</TableHead>
                            <TableHead className="font-bold text-slate-700 text-center">EWS</TableHead>
                            <TableHead className="font-bold text-slate-700 text-center">OBC</TableHead>
                            <TableHead className="font-bold text-slate-700 text-center">SC</TableHead>
                            <TableHead className="font-bold text-slate-700 text-center">ST</TableHead>
                          </>
                        )}
                        <TableHead className="font-bold text-slate-900 text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="text-xs">
                      {vacancies.map((v, idx) => (
                        <TableRow key={idx} className="hover:bg-slate-50/50">
                          <TableCell className="font-medium text-slate-900">{v.post_name}</TableCell>
                          {hasCategoryData && (
                            <>
                              <TableCell className="text-center font-mono">{v.ur_posts ? formatNumber(v.ur_posts) : "-"}</TableCell>
                              <TableCell className="text-center font-mono">{v.ews_posts ? formatNumber(v.ews_posts) : "-"}</TableCell>
                              <TableCell className="text-center font-mono">{v.obc_posts ? formatNumber(v.obc_posts) : "-"}</TableCell>
                              <TableCell className="text-center font-mono">{v.sc_posts ? formatNumber(v.sc_posts) : "-"}</TableCell>
                              <TableCell className="text-center font-mono">{v.st_posts ? formatNumber(v.st_posts) : "-"}</TableCell>
                            </>
                          )}
                          <TableCell className="text-right font-bold font-mono text-slate-900">
                            {formatNumber(v.total_posts)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* SECTION 5: SELECTION PROCESS (If present) */}
      {selectionProcess && (
        <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
          <div className="bg-slate-50/80 px-4 py-3 border-b border-slate-200">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#013089]">
              <Layers className="h-4 w-4" />
              <span>Selection Process &amp; Scheme</span>
            </div>
          </div>
          <div className="p-4 sm:p-5 text-xs text-slate-700 leading-relaxed whitespace-pre-line">
            {selectionProcess}
          </div>
        </div>
      )}

      {/* SECTION 6: IMPORTANT OFFICIAL LINKS */}
      <div className="rounded-xl border border-[#013089]/20 bg-[#013089]/5 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#013089]">
          <FileCheck2 className="h-5 w-5 text-[#013089]" />
          <span>Important Official Links</span>
        </div>

        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
          <table className="w-full text-xs text-slate-800 border-collapse">
            <tbody className="divide-y divide-slate-100">
              {/* Apply Now Gateway */}
              {job.official_apply_url && (
                <tr className="hover:bg-slate-50/80">
                  <td className="py-3 px-4 font-bold text-slate-900 w-1/3">Apply Online (Candidate Portal)</td>
                  <td className="py-3 px-4">
                    <a
                      href={job.official_apply_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-bold text-white bg-[#013089] hover:bg-[#01276E] px-3.5 py-1.5 rounded-md shadow-xs transition-colors text-xs"
                    >
                      <span>{t("card.apply_now")}</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </td>
                </tr>
              )}

              {/* Official Notification Document */}
              {job.official_notification_url && (
                <tr className="hover:bg-slate-50/80">
                  <td className="py-3 px-4 font-bold text-slate-900">Official Notification Gazette</td>
                  <td className="py-3 px-4">
                    <a
                      href={job.official_notification_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-bold text-[#013089] bg-brand-50 hover:bg-brand-100 px-3.5 py-1.5 rounded-md border border-brand-200 transition-colors text-xs"
                    >
                      <FileText className="h-3.5 w-3.5 text-[#013089]" />
                      <span>{t("card.official_notification")}</span>
                      <ExternalLink className="h-3.5 w-3.5 ml-0.5 text-slate-400" />
                    </a>
                  </td>
                </tr>
              )}

              {/* Official Authority Website */}
              {org?.website_url && (
                <tr className="hover:bg-slate-50/80">
                  <td className="py-3 px-4 font-bold text-slate-900">Official Organization Website</td>
                  <td className="py-3 px-4">
                    <a
                      href={org.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-[#013089] hover:underline"
                    >
                      <Building2 className="h-3.5 w-3.5 text-slate-500" />
                      <span>{org.name} Official Portal</span>
                      <ExternalLink className="h-3 w-3 ml-1 text-slate-400" />
                    </a>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Attached Gazette Documents if present */}
        {documents.length > 0 && (
          <div className="pt-2 space-y-2">
            <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Attached Gazette Circulars &amp; Annexures
            </div>
            <div className="space-y-1.5">
              {documents.map((doc, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs"
                >
                  <span className="font-semibold text-slate-900 truncate max-w-sm">{doc.title}</span>
                  {doc.file_url && (
                    <a
                      href={doc.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#013089] hover:underline bg-brand-50 px-2.5 py-1 rounded"
                    >
                      <FileText className="h-3 w-3" />
                      <span>Open Document</span>
                      <ExternalLink className="h-2.5 w-2.5 text-slate-400" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* SECTION 7: OFFICIAL AUTHORITY PROVENANCE & VERIFICATION */}
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-700 flex items-start gap-3">
        <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-bold text-slate-900">Official Government Provenance &amp; Verification</div>
          <p className="leading-relaxed text-slate-600">
            This notice is sourced directly from the official gazette portal of <strong>{org?.name}</strong>.
            Candidates are encouraged to verify all terms and conditions on the official commission website.
            SuchnaSetu does not charge any application or recruitment fees.
          </p>
        </div>
      </div>
    </div>
  );
}
