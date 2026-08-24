"use client";

import * as React from "react";
import Link from "next/link";
import { GovJobDetailed } from "../types";
import { useLanguage } from "@/lib/i18n/context";
import { resolveLocalizedJob } from "@/lib/i18n/localize";
import { formatDate, formatINR, formatNumber, formatApplicationFee } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { generateVerifiedJobFaqs } from "../utils/generate-job-faqs";
import {
  trackApplyClicked,
  trackNotificationClicked,
} from "@/lib/analytics";
import {
  Building2,
  Calendar,
  IndianRupee,
  Users,
  MapPin,
  FileText,
  ExternalLink,
  ShieldCheck,
  GraduationCap,
  Briefcase,
  Globe,
  Clock,
  ChevronRight,
  FileCheck2,
  CreditCard,
  CheckCircle2,
  HelpCircle,
  BookOpen,
  ClipboardList,
  FileSearch,
  Sparkles,
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

  const isClosed = job.application_end_date
    ? new Date(job.application_end_date).getTime() < Date.now()
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
      ? `Minimum ${eligibility.min_age} Years, Maximum ${eligibility.max_age} Years`
      : eligibility?.max_age
      ? `Maximum ${eligibility.max_age} Years`
      : eligibility?.min_age
      ? `Minimum ${eligibility.min_age} Years`
      : null);

  const selectionProcess =
    job.selection_process ||
    eligibility?.selection_process ||
    null;

  const applicationFee = formatApplicationFee(eligibility?.application_fee_details);
  const verifiedFaqs = React.useMemo(() => generateVerifiedJobFaqs(job), [job]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 font-sans text-slate-800">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center flex-wrap gap-1.5 text-xs sm:text-[13px] text-slate-500 font-medium">
        <Link href="/" className="hover:text-[#013089] transition-colors">
          {t("nav.home")}
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-slate-400 shrink-0" />
        <Link href="/jobs" className="hover:text-[#013089] transition-colors">
          {t("nav.jobs")}
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-slate-400 shrink-0" />
        {job.state_code ? (
          <>
            <Link
              href={`/state/${job.state_code.toLowerCase()}`}
              className="hover:text-[#013089] transition-colors uppercase"
            >
              {state?.name || job.state_code}
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          </>
        ) : (
          <>
            <span className="text-slate-600">Central Government</span>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          </>
        )}
        <span className="font-semibold text-slate-900 truncate max-w-[240px] sm:max-w-md">
          {org?.acronym || org?.name || "Job Notice"}
        </span>
      </nav>

      {/* 1. HERO & ACTION STRIP */}
      <header className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
        {/* Authority & Category Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-[#013089]/10 text-[#013089] border border-[#013089]/20">
              <Building2 className="h-3.5 w-3.5" />
              <span>{org?.acronym || org?.name || "Government Authority"}</span>
            </span>

            {job.state_code ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                <MapPin className="h-3.5 w-3.5 text-slate-500" />
                <span>{state?.name || job.state_code}</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                <Globe className="h-3.5 w-3.5 text-slate-500" />
                <span>All India Recruitment</span>
              </span>
            )}

            <span className="px-3 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200 capitalize">
              {job.employment_type || "Regular Govt Service"}
            </span>
          </div>

          {/* Status Badge */}
          {isClosed ? (
            <Badge variant="danger" className="font-semibold text-xs px-3 py-1">
              Application Closed
            </Badge>
          ) : isClosingSoon ? (
            <Badge variant="warning" className="font-semibold text-xs px-3 py-1 animate-pulse">
              <Clock className="h-3.5 w-3.5 mr-1" />
              Closing Soon
            </Badge>
          ) : (
            <Badge variant="success" className="font-semibold text-xs px-3 py-1">
              Applications Open
            </Badge>
          )}
        </div>

        {/* Title & Reference */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight sm:leading-snug font-heading">
            {job.title}
          </h1>

          {job.notification_number && (
            <p className="text-xs sm:text-sm text-slate-500 font-mono">
              Advt / Notification Reference: <span className="font-semibold text-slate-800">{job.notification_number}</span>
            </p>
          )}
        </div>

        {/* Key Recruitment Highlights Ledger (Clean Structured Grid) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
            <div className="text-xs font-medium text-slate-500 flex items-center gap-1.5 mb-1">
              <Users className="h-4 w-4 text-[#013089]" />
              <span>Total Vacancies</span>
            </div>
            <div className="text-lg sm:text-xl font-bold text-slate-900">
              {job.total_vacancies ? `${formatNumber(job.total_vacancies)} Posts` : "Refer Notice"}
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
            <div className="text-xs font-medium text-slate-500 flex items-center gap-1.5 mb-1">
              <Calendar className="h-4 w-4 text-rose-600" />
              <span>Last Date to Apply</span>
            </div>
            <div className={`text-[15px] sm:text-base font-bold ${isClosingSoon ? "text-rose-700" : "text-slate-900"}`}>
              {job.application_end_date ? formatDate(job.application_end_date) : "Refer Notification"}
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
            <div className="text-xs font-medium text-slate-500 flex items-center gap-1.5 mb-1">
              <IndianRupee className="h-4 w-4 text-emerald-700" />
              <span>Pay Scale / Salary</span>
            </div>
            <div className="text-[15px] sm:text-base font-bold text-slate-900 truncate" title={salaryDisplay || "As Per Norms"}>
              {salaryDisplay || "As Per Official Scale"}
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
            <div className="text-xs font-medium text-slate-500 flex items-center gap-1.5 mb-1">
              <GraduationCap className="h-4 w-4 text-blue-600" />
              <span>Minimum Eligibility</span>
            </div>
            <div className="text-[15px] sm:text-base font-bold text-slate-900 truncate" title={educationalQualification || "Refer Notification"}>
              {educationalQualification || "Refer Notification"}
            </div>
          </div>
        </div>

        {/* Primary Action Gateways */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          {job.official_apply_url && !isClosed && (
            <a
              href={job.official_apply_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackApplyClicked(job.title, org?.name || "Govt", job.official_apply_url!)}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm sm:text-[15px] text-white bg-[#013089] hover:bg-[#01276E] shadow-sm transition-all"
            >
              <span>Apply Online Portal</span>
              <ExternalLink className="h-4 w-4" />
            </a>
          )}

          {job.official_notification_url && (
            <a
              href={job.official_notification_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackNotificationClicked(job.title, org?.name || "Govt", job.official_notification_url!)}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm sm:text-[15px] text-[#013089] bg-[#013089]/5 hover:bg-[#013089]/10 border border-[#013089]/20 transition-colors"
            >
              <FileText className="h-4 w-4 text-[#013089]" />
              <span>Official Notification PDF</span>
              <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
            </a>
          )}

          {org?.website_url && (
            <a
              href={org.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <Building2 className="h-4 w-4 text-slate-500" />
              <span>Commission Website</span>
              <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
            </a>
          )}
        </div>
      </header>

      {/* 2. UNIFIED RECRUITMENT SPECIFICATION BODY */}
      <main className="rounded-2xl border border-slate-200 bg-white shadow-xs divide-y divide-slate-200 overflow-hidden">
        {/* SECTION 1: RECRUITMENT OVERVIEW TABLE */}
        <section className="p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2.5">
            <ClipboardList className="h-5 w-5 text-[#013089]" />
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              1. Recruitment Overview
            </h2>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-[14px] sm:text-[15px] text-slate-800 border-collapse">
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50/50">
                  <th scope="row" className="py-3 px-4 sm:px-5 font-semibold text-slate-600 w-1/3 bg-slate-50/70 text-left">
                    Conducting Authority
                  </th>
                  <td className="py-3 px-4 sm:px-5 font-bold text-slate-900">
                    {org?.name} {org?.acronym ? `(${org.acronym})` : ""}
                  </td>
                </tr>
                {dept?.name && (
                  <tr className="hover:bg-slate-50/50">
                    <th scope="row" className="py-3 px-4 sm:px-5 font-semibold text-slate-600 bg-slate-50/70 text-left">
                      Department / Ministry
                    </th>
                    <td className="py-3 px-4 sm:px-5 text-slate-900">
                      {dept.name}
                    </td>
                  </tr>
                )}
                <tr className="hover:bg-slate-50/50">
                  <th scope="row" className="py-3 px-4 sm:px-5 font-semibold text-slate-600 bg-slate-50/70 text-left">
                    Recruitment Title / Post
                  </th>
                  <td className="py-3 px-4 sm:px-5 font-semibold text-slate-900">
                    {job.title}
                  </td>
                </tr>
                {job.notification_number && (
                  <tr className="hover:bg-slate-50/50">
                    <th scope="row" className="py-3 px-4 sm:px-5 font-semibold text-slate-600 bg-slate-50/70 text-left">
                      Advertisement Number
                    </th>
                    <td className="py-3 px-4 sm:px-5 font-mono font-medium text-slate-800">
                      {job.notification_number}
                    </td>
                  </tr>
                )}
                <tr className="hover:bg-slate-50/50">
                  <th scope="row" className="py-3 px-4 sm:px-5 font-semibold text-slate-600 bg-slate-50/70 text-left">
                    Total Vacancies
                  </th>
                  <td className="py-3 px-4 sm:px-5 font-bold text-slate-900">
                    {job.total_vacancies ? `${formatNumber(job.total_vacancies)} Posts` : "As per official notification"}
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <th scope="row" className="py-3 px-4 sm:px-5 font-semibold text-slate-600 bg-slate-50/70 text-left">
                    Jurisdiction / Location
                  </th>
                  <td className="py-3 px-4 sm:px-5 text-slate-900">
                    {state?.name ? `${state.name} State` : "All India (Central Government Cadre)"}
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <th scope="row" className="py-3 px-4 sm:px-5 font-semibold text-slate-600 bg-slate-50/70 text-left">
                    Employment Nature
                  </th>
                  <td className="py-3 px-4 sm:px-5 text-slate-900 capitalize">
                    {job.employment_type || "Regular Govt Service"}
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <th scope="row" className="py-3 px-4 sm:px-5 font-semibold text-slate-600 bg-slate-50/70 text-left">
                    Application Mode
                  </th>
                  <td className="py-3 px-4 sm:px-5 text-slate-900 font-medium">
                    Online Official Candidate Registration
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* SECTION 2: IMPORTANT DATES TIMELINE */}
        <section className="p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2.5">
            <Calendar className="h-5 w-5 text-[#013089]" />
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              2. Important Official Dates
            </h2>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-[14px] sm:text-[15px] text-slate-800 border-collapse">
              <tbody className="divide-y divide-slate-100">
                {job.published_at && (
                  <tr className="hover:bg-slate-50/50">
                    <th scope="row" className="py-3 px-4 sm:px-5 font-semibold text-slate-600 w-1/2 bg-slate-50/70 text-left">
                      Notification Release Date
                    </th>
                    <td className="py-3 px-4 sm:px-5 font-mono font-medium text-slate-900">
                      {formatDate(job.published_at)}
                    </td>
                  </tr>
                )}
                {job.application_start_date && (
                  <tr className="hover:bg-slate-50/50">
                    <th scope="row" className="py-3 px-4 sm:px-5 font-semibold text-slate-600 bg-slate-50/70 text-left">
                      Online Application Start Date
                    </th>
                    <td className="py-3 px-4 sm:px-5 font-mono font-bold text-emerald-800">
                      {formatDate(job.application_start_date)}
                    </td>
                  </tr>
                )}
                {job.application_end_date && (
                  <tr className="bg-rose-50/40 hover:bg-rose-50/60">
                    <th scope="row" className="py-3 px-4 sm:px-5 font-bold text-rose-900 bg-rose-100/50 text-left">
                      Application Closing Last Date
                    </th>
                    <td className="py-3 px-4 sm:px-5 font-mono font-bold text-rose-700">
                      {formatDate(job.application_end_date)}
                    </td>
                  </tr>
                )}

                {/* Sub-dates from important_dates */}
                {dates.map((d, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <th scope="row" className="py-3 px-4 sm:px-5 font-semibold text-slate-600 bg-slate-50/70 text-left flex items-center gap-2">
                      <span>{d.event_name}</span>
                      {d.is_tentative && (
                        <span className="text-[11px] text-amber-800 font-bold bg-amber-100/80 px-2 py-0.5 rounded">
                          Tentative
                        </span>
                      )}
                    </th>
                    <td className="py-3 px-4 sm:px-5 font-mono text-slate-900">
                      {d.event_date ? formatDate(d.event_date) : d.event_date_text || "To Be Announced"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* SECTION 3: VACANCY DETAILS (CATEGORY & POST-WISE) */}
        {(job.total_vacancies > 0 || vacancies.length > 0) && (
          <section className="p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2.5">
                <Users className="h-5 w-5 text-[#013089]" />
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  3. Vacancy Details &amp; Distribution
                </h2>
              </div>
              {job.total_vacancies > 0 && (
                <Badge variant="brand" className="text-xs sm:text-sm px-3 py-1 font-bold">
                  Total: {formatNumber(job.total_vacancies)} Posts
                </Badge>
              )}
            </div>

            {vacancies.length > 0 ? (
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <Table>
                  <TableHeader className="bg-slate-100/90">
                    <TableRow>
                      <TableHead className="font-bold text-slate-900 text-xs sm:text-sm py-3.5">Post Name</TableHead>
                      <TableHead className="font-bold text-slate-900 text-xs sm:text-sm text-center py-3.5">Total</TableHead>
                      <TableHead className="font-bold text-slate-900 text-xs sm:text-sm text-center py-3.5">UR</TableHead>
                      <TableHead className="font-bold text-slate-900 text-xs sm:text-sm text-center py-3.5">OBC</TableHead>
                      <TableHead className="font-bold text-slate-900 text-xs sm:text-sm text-center py-3.5">EWS</TableHead>
                      <TableHead className="font-bold text-slate-900 text-xs sm:text-sm text-center py-3.5">SC</TableHead>
                      <TableHead className="font-bold text-slate-900 text-xs sm:text-sm text-center py-3.5">ST</TableHead>
                      <TableHead className="font-bold text-slate-900 text-xs sm:text-sm text-center py-3.5">PwD</TableHead>
                      <TableHead className="font-bold text-slate-900 text-xs sm:text-sm py-3.5">Pay Level</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="text-[14px] sm:text-[15px] divide-y divide-slate-100">
                    {vacancies.map((v, idx) => (
                      <TableRow key={idx} className="hover:bg-slate-50/80">
                        <TableCell className="font-semibold text-slate-900 py-3">
                          {v.post_name}
                          {v.post_code && <span className="block text-xs text-slate-500 font-mono">Code: {v.post_code}</span>}
                        </TableCell>
                        <TableCell className="text-center font-bold text-[#013089] py-3">{v.total_posts}</TableCell>
                        <TableCell className="text-center text-slate-700 py-3">{v.ur_posts ?? "—"}</TableCell>
                        <TableCell className="text-center text-slate-700 py-3">{v.obc_posts ?? "—"}</TableCell>
                        <TableCell className="text-center text-slate-700 py-3">{v.ews_posts ?? "—"}</TableCell>
                        <TableCell className="text-center text-slate-700 py-3">{v.sc_posts ?? "—"}</TableCell>
                        <TableCell className="text-center text-slate-700 py-3">{v.st_posts ?? "—"}</TableCell>
                        <TableCell className="text-center text-slate-700 py-3">{v.pwd_posts ?? "—"}</TableCell>
                        <TableCell className="font-mono text-slate-800 py-3">{v.pay_level ?? "—"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-[14px] sm:text-[15px] text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-200 leading-relaxed">
                A total of <strong>{job.total_vacancies} posts</strong> are officially notified. Detailed category reservations and post distribution are published in the official gazette.
              </p>
            )}
          </section>
        )}

        {/* SECTION 4: ELIGIBILITY & AGE LIMIT */}
        {(educationalQualification || ageLimits || eligibility?.experience_details || eligibility?.age_relaxation_details) && (
          <section className="p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2.5">
              <GraduationCap className="h-5 w-5 text-[#013089]" />
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                4. Eligibility Criteria &amp; Age Limit
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {educationalQualification && (
                <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                    <BookOpen className="h-4 w-4 text-[#013089]" />
                    <span>Educational Qualification</span>
                  </div>
                  <p className="text-[15px] sm:text-base text-slate-900 leading-relaxed font-semibold">
                    {educationalQualification}
                  </p>
                </div>
              )}

              {ageLimits && (
                <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-[#013089]" />
                    <span>Age Limit (As on Cutoff Date)</span>
                  </div>
                  <p className="text-[15px] sm:text-base text-slate-900 leading-relaxed font-semibold">
                    {ageLimits}
                  </p>
                  {eligibility?.age_calculation_date && (
                    <p className="text-xs text-slate-500">
                      Cutoff Calculation Date: <span className="font-semibold text-slate-700">{formatDate(eligibility.age_calculation_date)}</span>
                    </p>
                  )}
                </div>
              )}

              {eligibility?.experience_details && (
                <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2 md:col-span-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                    <Briefcase className="h-4 w-4 text-[#013089]" />
                    <span>Experience Requirements</span>
                  </div>
                  <p className="text-[14px] sm:text-[15px] text-slate-900 leading-relaxed">
                    {eligibility.experience_details}
                  </p>
                </div>
              )}

              {eligibility?.age_relaxation_details && (
                <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2 md:col-span-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-emerald-700" />
                    <span>Category-Wise Age Relaxation</span>
                  </div>
                  <p className="text-[14px] sm:text-[15px] text-slate-900 leading-relaxed">
                    {eligibility.age_relaxation_details}
                  </p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* SECTION 5: SALARY STRUCTURE & PAY SCALE */}
        {(salaryDisplay || job.pay_scale_details) && (
          <section className="p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2.5">
              <IndianRupee className="h-5 w-5 text-[#013089]" />
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                5. Salary &amp; Remuneration Scale
              </h2>
            </div>

            <div className="p-5 rounded-xl border border-emerald-200/80 bg-emerald-50/40 space-y-2.5">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-sm font-semibold text-emerald-900">Official Monthly Pay Scale</span>
                <span className="font-bold text-base sm:text-lg text-emerald-900 font-mono">
                  {salaryDisplay}
                </span>
              </div>
              <p className="text-[14px] sm:text-[15px] text-emerald-950 leading-relaxed">
                In addition to basic pay, appointed candidates are eligible for applicable central/state allowances including Dearness Allowance (DA), House Rent Allowance (HRA), Transport Allowance (TA), and healthcare coverage as per government service rules.
              </p>
            </div>
          </section>
        )}

        {/* SECTION 6: APPLICATION FEE & PAYMENT MODE */}
        {applicationFee && (
          <section className="p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2.5">
              <CreditCard className="h-5 w-5 text-[#013089]" />
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                6. Application Fee &amp; Payment Details
              </h2>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
              <div className="text-[15px] sm:text-base font-semibold text-slate-900 leading-relaxed">
                {applicationFee}
              </div>
              <div className="text-xs sm:text-sm text-slate-600 pt-3 border-t border-slate-200/80">
                <span className="font-semibold text-slate-800">Accepted Payment Modes: </span>
                <span>Online Net Banking, Debit Card, Credit Card, UPI / Official Bank Challan (where prescribed).</span>
              </div>
            </div>
          </section>
        )}

        {/* SECTION 7: SELECTION PROCESS STAGES */}
        {selectionProcess && (
          <section className="p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2.5">
              <FileSearch className="h-5 w-5 text-[#013089]" />
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                7. Selection Process Stages
              </h2>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
              <p className="text-[15px] sm:text-base text-slate-900 font-semibold leading-relaxed">
                {selectionProcess}
              </p>
              <p className="text-xs sm:text-sm text-slate-500 pt-1">
                Candidates must secure minimum qualifying cutoff marks in each stage to be shortlisted for final document verification and medical review.
              </p>
            </div>
          </section>
        )}

        {/* SECTION 8: REQUIRED APPLICATION DOCUMENTS */}
        <section className="p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="h-5 w-5 text-[#013089]" />
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              8. Required Documents for Registration
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[14px] sm:text-[15px] text-slate-700">
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
              <span>Recent Passport Size Photograph (clear white background, JPG format).</span>
            </div>
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
              <span>Candidate Signature clearly scanned in black ink.</span>
            </div>
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
              <span>10th (Matriculation) Certificate / Marksheet for Date of Birth proof.</span>
            </div>
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
              <span>Educational Qualification Marksheets &amp; Degree / Diploma Certificates.</span>
            </div>
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
              <span>Category Certificate (SC/ST/OBC-NCL/EWS) if claiming reservation benefits.</span>
            </div>
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
              <span>Valid Government Photo ID Card (Aadhaar / Voter ID / PAN / Passport).</span>
            </div>
          </div>
        </section>

        {/* SECTION 9: STEP-BY-STEP APPLICATION GUIDE */}
        <section className="p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2.5">
            <Sparkles className="h-5 w-5 text-[#013089]" />
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              9. How to Apply Online
            </h2>
          </div>

          <ol className="space-y-3.5 text-[14px] sm:text-[15px] text-slate-800 list-none p-0">
            <li className="flex items-start gap-3.5">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#013089] text-white font-bold text-xs">
                1
              </span>
              <p className="pt-0.5 leading-relaxed">
                Visit the official candidate registration portal of <strong>{org?.name}</strong>.
              </p>
            </li>
            <li className="flex items-start gap-3.5">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#013089] text-white font-bold text-xs">
                2
              </span>
              <p className="pt-0.5 leading-relaxed">
                Complete the One-Time Registration (OTR) with your active email address and mobile number.
              </p>
            </li>
            <li className="flex items-start gap-3.5">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#013089] text-white font-bold text-xs">
                3
              </span>
              <p className="pt-0.5 leading-relaxed">
                Carefully fill in educational qualifications, personal info, category, and address details.
              </p>
            </li>
            <li className="flex items-start gap-3.5">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#013089] text-white font-bold text-xs">
                4
              </span>
              <p className="pt-0.5 leading-relaxed">
                Upload scanned copies of photo, signature, and mandatory eligibility certificates in prescribed file sizes.
              </p>
            </li>
            <li className="flex items-start gap-3.5">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#013089] text-white font-bold text-xs">
                5
              </span>
              <p className="pt-0.5 leading-relaxed">
                Submit the online application fee and download / print the final acknowledgment receipt for future reference.
              </p>
            </li>
          </ol>
        </section>

        {/* SECTION 10: OFFICIAL LINKS & GAZETTE CIRCULARS */}
        <section className="p-6 sm:p-8 space-y-4 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <FileCheck2 className="h-5 w-5 text-[#013089]" />
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              10. Important Official Links
            </h2>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-[14px] sm:text-[15px] text-slate-800 border-collapse">
              <tbody className="divide-y divide-slate-100">
                {job.official_apply_url && (
                  <tr className="hover:bg-slate-50/80">
                    <td className="py-3.5 px-4 sm:px-5 font-bold text-slate-900 w-1/3">
                      Apply Online Portal
                    </td>
                    <td className="py-3.5 px-4 sm:px-5">
                      <a
                        href={job.official_apply_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackApplyClicked(job.title, org?.name || "Govt", job.official_apply_url!)}
                        className="inline-flex items-center gap-2 font-bold text-white bg-[#013089] hover:bg-[#01276E] px-4 py-2 rounded-lg shadow-xs transition-colors text-xs sm:text-sm"
                      >
                        <span>Click Here to Apply</span>
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </td>
                  </tr>
                )}

                {job.official_notification_url && (
                  <tr className="hover:bg-slate-50/80">
                    <td className="py-3.5 px-4 sm:px-5 font-bold text-slate-900">
                      Official Notification PDF
                    </td>
                    <td className="py-3.5 px-4 sm:px-5">
                      <a
                        href={job.official_notification_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackNotificationClicked(job.title, org?.name || "Govt", job.official_notification_url!)}
                        className="inline-flex items-center gap-2 font-bold text-[#013089] bg-[#013089]/10 hover:bg-[#013089]/20 px-4 py-2 rounded-lg border border-[#013089]/20 transition-colors text-xs sm:text-sm"
                      >
                        <FileText className="h-4 w-4 text-[#013089]" />
                        <span>Download Notification</span>
                        <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                      </a>
                    </td>
                  </tr>
                )}

                {org?.website_url && (
                  <tr className="hover:bg-slate-50/80">
                    <td className="py-3.5 px-4 sm:px-5 font-bold text-slate-900">
                      Official Website
                    </td>
                    <td className="py-3.5 px-4 sm:px-5">
                      <a
                        href={org.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-700 hover:text-[#013089] hover:underline"
                      >
                        <Building2 className="h-4 w-4 text-slate-500" />
                        <span>{org.name} Official Portal</span>
                        <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                      </a>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Attached Gazette Circulars if present */}
          {documents.length > 0 && (
            <div className="pt-3 space-y-2.5">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Official Gazette Circulars &amp; Annexures
              </div>
              <div className="space-y-2">
                {documents.map((doc, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-[14px]"
                  >
                    <span className="font-semibold text-slate-900 truncate max-w-md">{doc.title}</span>
                    {doc.file_url && (
                      <a
                        href={doc.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#013089] hover:underline bg-[#013089]/10 px-3 py-1.5 rounded"
                      >
                        <FileText className="h-3.5 w-3.5" />
                        <span>Open Document</span>
                        <ExternalLink className="h-3 w-3 text-slate-400" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* SECTION 11: VERIFIED RECRUITMENT FAQS */}
        {verifiedFaqs.length > 0 && (
          <section className="p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2.5">
              <HelpCircle className="h-5 w-5 text-[#013089]" />
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                11. Frequently Asked Questions
              </h2>
            </div>

            <div className="divide-y divide-slate-100">
              {verifiedFaqs.map((faq, idx) => (
                <div key={idx} className="py-4 first:pt-0 last:pb-0 space-y-1.5">
                  <h3 className="text-[15px] sm:text-base font-bold text-slate-900">
                    Q{idx + 1}. {faq.question}
                  </h3>
                  <p className="text-[14px] sm:text-[15px] text-slate-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* FOOTER: OFFICIAL PROVENANCE & TRANSPARENCY */}
      <footer className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-xs sm:text-[13px] text-slate-600 flex items-start gap-3.5">
        <ShieldCheck className="h-5 w-5 text-emerald-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-bold text-slate-900">Official Government Provenance &amp; Verification</div>
          <p className="leading-relaxed">
            This recruitment notice is sourced directly from the official portal of <strong>{org?.name}</strong>.
            Candidates are advised to thoroughly verify details on the official notification before applying.
            SuchnaSetu provides verified public notifications free of cost for citizen convenience.
          </p>
        </div>
      </footer>
    </div>
  );
}
