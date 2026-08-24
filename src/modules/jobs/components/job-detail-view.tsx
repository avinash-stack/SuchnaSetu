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
import { generateVerifiedJobFaqs } from "../utils/generate-job-faqs";
import {
  trackApplyClicked,
  trackNotificationClicked,
  trackSyllabusClicked,
  trackAnswerKeyClicked,
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
  CheckCircle2,
  HelpCircle,
  BookOpen,
  ClipboardList,
  AlertCircle,
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
      ? `Min: ${eligibility.min_age} Yrs | Max: ${eligibility.max_age} Yrs`
      : eligibility?.max_age
      ? `Max: ${eligibility.max_age} Yrs`
      : eligibility?.min_age
      ? `Min: ${eligibility.min_age} Yrs`
      : null);

  const selectionProcess =
    job.selection_process ||
    eligibility?.selection_process ||
    null;

  const applicationFee = formatApplicationFee(eligibility?.application_fee_details);

  const verifiedFaqs = React.useMemo(() => generateVerifiedJobFaqs(job), [job]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-7 font-sans">
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
        {job.state_code && (
          <>
            <Link
              href={`/state/${job.state_code.toLowerCase()}`}
              className="hover:text-slate-800 transition-colors uppercase font-medium"
            >
              {job.state_code}
            </Link>
            <ChevronRight className="h-3 w-3 text-slate-400" />
          </>
        )}
        <span className="font-semibold text-slate-800 truncate max-w-[200px] sm:max-w-md">
          {org?.acronym || org?.name || "Job Notice"}
        </span>
      </nav>

      {/* 1. HEADER & HERO BANNER */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 shadow-xs relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-50 text-[#013089] border border-brand-200">
              <Building2 className="h-3.5 w-3.5" />
              <span>{org?.acronym || org?.name || "Government Authority"}</span>
            </span>

            {job.state_code ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                <MapPin className="h-3 w-3 text-slate-500" />
                <span>{state?.name || job.state_code}</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                <Globe className="h-3 w-3 text-slate-500" />
                <span>All India (Central)</span>
              </span>
            )}

            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200 capitalize">
              {job.employment_type || "Full Time"}
            </span>
          </div>

          {/* Status Badge */}
          {isClosed ? (
            <Badge variant="danger" className="font-semibold text-xs px-2.5 py-1">
              Application Closed
            </Badge>
          ) : isClosingSoon ? (
            <Badge variant="warning" className="font-semibold text-xs px-2.5 py-1 animate-pulse">
              <Clock className="h-3 w-3 mr-1" />
              Closing Soon
            </Badge>
          ) : (
            <Badge variant="success" className="font-semibold text-xs px-2.5 py-1">
              Active Recruitment
            </Badge>
          )}
        </div>

        <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug font-heading">
          {job.title}
        </h1>

        {job.notification_number && (
          <p className="text-xs sm:text-sm text-slate-500 font-mono mt-1">
            Advt / Notification No: <span className="font-semibold text-slate-700">{job.notification_number}</span>
          </p>
        )}

        {/* Executive Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-100">
          <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-100">
            <div className="text-[11px] font-medium text-slate-500 flex items-center gap-1 mb-0.5">
              <Users className="h-3.5 w-3.5 text-brand-600" />
              <span>Total Vacancies</span>
            </div>
            <div className="text-base sm:text-lg font-bold text-slate-900">
              {job.total_vacancies ? formatNumber(job.total_vacancies) : "See Notice"}
            </div>
          </div>

          <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-100">
            <div className="text-[11px] font-medium text-slate-500 flex items-center gap-1 mb-0.5">
              <IndianRupee className="h-3.5 w-3.5 text-emerald-600" />
              <span>Pay Scale / Salary</span>
            </div>
            <div className="text-sm sm:text-base font-bold text-slate-900 truncate" title={salaryDisplay || "As Per Norms"}>
              {salaryDisplay || "As Per Norms"}
            </div>
          </div>

          <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-100">
            <div className="text-[11px] font-medium text-slate-500 flex items-center gap-1 mb-0.5">
              <GraduationCap className="h-3.5 w-3.5 text-blue-600" />
              <span>Qualification</span>
            </div>
            <div className="text-sm font-bold text-slate-900 truncate" title={educationalQualification || "Refer Notification"}>
              {educationalQualification || "Refer Notification"}
            </div>
          </div>

          <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-100">
            <div className="text-[11px] font-medium text-slate-500 flex items-center gap-1 mb-0.5">
              <Calendar className="h-3.5 w-3.5 text-rose-600" />
              <span>Application Last Date</span>
            </div>
            <div className="text-sm font-bold text-slate-900">
              {job.application_end_date ? formatDate(job.application_end_date) : "Refer Notice"}
            </div>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 mt-6">
          {job.official_apply_url && !isClosed && (
            <a
              href={job.official_apply_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackApplyClicked(job.title, org?.name || "Govt", job.official_apply_url!)}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-[#013089] hover:bg-[#01276E] shadow-sm transition-all"
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
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm text-[#013089] bg-brand-50 hover:bg-brand-100 border border-brand-200 transition-colors"
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
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <Building2 className="h-3.5 w-3.5 text-slate-500" />
              <span>Official Website</span>
              <ExternalLink className="h-3 w-3 text-slate-400" />
            </a>
          )}
        </div>
      </div>

      {/* 2. RECRUITMENT OVERVIEW LEDGER */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#013089] border-b border-slate-100 pb-3">
          <ClipboardList className="h-4 w-4 text-[#013089]" />
          <span>1. Recruitment Overview</span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-xs sm:text-sm text-slate-800 border-collapse">
            <tbody className="divide-y divide-slate-100">
              <tr className="bg-slate-50/50">
                <td className="py-2.5 px-4 font-semibold text-slate-600 w-1/3">Recruitment Authority</td>
                <td className="py-2.5 px-4 font-bold text-slate-900">{org?.name} ({org?.acronym || "GOV"})</td>
              </tr>
              {dept?.name && (
                <tr>
                  <td className="py-2.5 px-4 font-semibold text-slate-600">Department / Ministry</td>
                  <td className="py-2.5 px-4 text-slate-900">{dept.name}</td>
                </tr>
              )}
              <tr className="bg-slate-50/50">
                <td className="py-2.5 px-4 font-semibold text-slate-600">Post / Recruitment Title</td>
                <td className="py-2.5 px-4 font-bold text-slate-900">{job.title}</td>
              </tr>
              {job.notification_number && (
                <tr>
                  <td className="py-2.5 px-4 font-semibold text-slate-600">Advertisement Number</td>
                  <td className="py-2.5 px-4 font-mono font-medium text-slate-800">{job.notification_number}</td>
                </tr>
              )}
              <tr className="bg-slate-50/50">
                <td className="py-2.5 px-4 font-semibold text-slate-600">Total Vacancies</td>
                <td className="py-2.5 px-4 font-bold text-slate-900">{job.total_vacancies ? `${job.total_vacancies} Posts` : "As per gazette notice"}</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-semibold text-slate-600">Job Location / Jurisdiction</td>
                <td className="py-2.5 px-4 text-slate-900">{state?.name ? `${state.name} State` : "All India (Central Government)"}</td>
              </tr>
              <tr className="bg-slate-50/50">
                <td className="py-2.5 px-4 font-semibold text-slate-600">Employment Type</td>
                <td className="py-2.5 px-4 text-slate-900 capitalize">{job.employment_type}</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-semibold text-slate-600">Application Mode</td>
                <td className="py-2.5 px-4 text-slate-900 font-medium">Online Official Candidate Registration</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. IMPORTANT DATES TIMELINE & LEDGER */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#013089] border-b border-slate-100 pb-3">
          <Calendar className="h-4 w-4 text-[#013089]" />
          <span>2. Important Official Dates</span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-xs sm:text-sm text-slate-800 border-collapse">
            <tbody className="divide-y divide-slate-100">
              {job.published_at && (
                <tr className="bg-slate-50/50">
                  <td className="py-2.5 px-4 font-semibold text-slate-600 w-1/2">Notification Release Date</td>
                  <td className="py-2.5 px-4 font-mono font-medium text-slate-900">{formatDate(job.published_at)}</td>
                </tr>
              )}
              {job.application_start_date && (
                <tr>
                  <td className="py-2.5 px-4 font-semibold text-slate-600">Online Application Start Date</td>
                  <td className="py-2.5 px-4 font-mono font-bold text-emerald-700">{formatDate(job.application_start_date)}</td>
                </tr>
              )}
              {job.application_end_date && (
                <tr className="bg-rose-50/40">
                  <td className="py-2.5 px-4 font-semibold text-rose-900">Application Closing Last Date</td>
                  <td className="py-2.5 px-4 font-mono font-bold text-rose-700">{formatDate(job.application_end_date)}</td>
                </tr>
              )}

              {/* Dynamic sub-dates if configured */}
              {dates.map((d, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? "bg-slate-50/50" : ""}>
                  <td className="py-2.5 px-4 font-semibold text-slate-600 flex items-center gap-1.5">
                    <span>{d.event_name}</span>
                    {d.is_tentative && <span className="text-[10px] text-amber-600 font-bold bg-amber-50 px-1.5 py-0.5 rounded">(Tentative)</span>}
                  </td>
                  <td className="py-2.5 px-4 font-mono text-slate-900">
                    {d.event_date ? formatDate(d.event_date) : d.event_date_text || "To Be Announced"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. VACANCY DETAILS (CATEGORY-WISE & POST-WISE) */}
      {(job.total_vacancies > 0 || vacancies.length > 0) && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#013089]">
              <Users className="h-4 w-4 text-[#013089]" />
              <span>3. Vacancy Details &amp; Distribution</span>
            </div>
            {job.total_vacancies > 0 && (
              <Badge variant="brand" className="text-xs">
                Total: {formatNumber(job.total_vacancies)} Posts
              </Badge>
            )}
          </div>

          {vacancies.length > 0 ? (
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <Table>
                <TableHeader className="bg-slate-100/80">
                  <TableRow>
                    <TableHead className="font-bold text-slate-900 text-xs">Post Name</TableHead>
                    <TableHead className="font-bold text-slate-900 text-xs text-center">Total</TableHead>
                    <TableHead className="font-bold text-slate-900 text-xs text-center">UR</TableHead>
                    <TableHead className="font-bold text-slate-900 text-xs text-center">OBC</TableHead>
                    <TableHead className="font-bold text-slate-900 text-xs text-center">EWS</TableHead>
                    <TableHead className="font-bold text-slate-900 text-xs text-center">SC</TableHead>
                    <TableHead className="font-bold text-slate-900 text-xs text-center">ST</TableHead>
                    <TableHead className="font-bold text-slate-900 text-xs text-center">PwD</TableHead>
                    <TableHead className="font-bold text-slate-900 text-xs">Pay Level</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="text-xs divide-y divide-slate-100">
                  {vacancies.map((v, idx) => (
                    <TableRow key={idx} className="hover:bg-slate-50/80">
                      <TableCell className="font-semibold text-slate-900">
                        {v.post_name}
                        {v.post_code && <span className="block text-[10px] text-slate-400 font-mono">Code: {v.post_code}</span>}
                      </TableCell>
                      <TableCell className="text-center font-bold text-brand-700">{v.total_posts}</TableCell>
                      <TableCell className="text-center text-slate-600">{v.ur_posts ?? "—"}</TableCell>
                      <TableCell className="text-center text-slate-600">{v.obc_posts ?? "—"}</TableCell>
                      <TableCell className="text-center text-slate-600">{v.ews_posts ?? "—"}</TableCell>
                      <TableCell className="text-center text-slate-600">{v.sc_posts ?? "—"}</TableCell>
                      <TableCell className="text-center text-slate-600">{v.st_posts ?? "—"}</TableCell>
                      <TableCell className="text-center text-slate-600">{v.pwd_posts ?? "—"}</TableCell>
                      <TableCell className="font-mono text-slate-700">{v.pay_level ?? "—"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              A total of <strong>{job.total_vacancies} vacancies</strong> are notified. Detailed category-wise reservations and department breakdown are available in the official gazette circular.
            </p>
          )}
        </div>
      )}

      {/* 5. ELIGIBILITY CRITERIA & AGE LIMITS */}
      {(educationalQualification || ageLimits || eligibility?.experience_details || eligibility?.age_relaxation_details) && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#013089] border-b border-slate-100 pb-3">
            <GraduationCap className="h-4 w-4 text-[#013089]" />
            <span>4. Eligibility Criteria &amp; Age Limit</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Educational Qualification */}
            {educationalQualification && (
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5">
                <div className="text-xs font-bold uppercase tracking-wide text-slate-700 flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5 text-brand-600" />
                  <span>Educational Qualification</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-900 leading-relaxed font-medium">
                  {educationalQualification}
                </p>
              </div>
            )}

            {/* Age Limits */}
            {ageLimits && (
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5">
                <div className="text-xs font-bold uppercase tracking-wide text-slate-700 flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-brand-600" />
                  <span>Age Limit (As on Cutoff Date)</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-900 leading-relaxed font-medium">
                  {ageLimits}
                </p>
                {eligibility?.age_calculation_date && (
                  <p className="text-[11px] text-slate-500">
                    Age calculation cutoff date: {formatDate(eligibility.age_calculation_date)}
                  </p>
                )}
              </div>
            )}

            {/* Experience Requirements if any */}
            {eligibility?.experience_details && (
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5 md:col-span-2">
                <div className="text-xs font-bold uppercase tracking-wide text-slate-700 flex items-center gap-1.5">
                  <Briefcase className="h-3.5 w-3.5 text-brand-600" />
                  <span>Experience Details</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-900 leading-relaxed">
                  {eligibility.experience_details}
                </p>
              </div>
            )}

            {/* Age Relaxation Breakdown if any */}
            {eligibility?.age_relaxation_details && (
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5 md:col-span-2">
                <div className="text-xs font-bold uppercase tracking-wide text-slate-700 flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Category Age Relaxation</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-900 leading-relaxed">
                  {eligibility.age_relaxation_details}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 6. SALARY & REMUNERATION STRUCTURE */}
      {(salaryDisplay || job.pay_scale_details) && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#013089] border-b border-slate-100 pb-3">
            <IndianRupee className="h-4 w-4 text-[#013089]" />
            <span>5. Salary &amp; Pay Scale Structure</span>
          </div>

          <div className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-900">Official Monthly Remuneration</span>
              <span className="font-bold text-sm sm:text-base text-emerald-800 font-mono">
                {salaryDisplay}
              </span>
            </div>
            <p className="text-xs text-emerald-950 leading-relaxed">
              In addition to basic pay, appointed candidates are eligible for applicable central/state allowances including Dearness Allowance (DA), House Rent Allowance (HRA), Transport Allowance (TA), and medical coverage as per official rules.
            </p>
          </div>
        </div>
      )}

      {/* 7. APPLICATION FEE & PAYMENT METHOD */}
      {applicationFee && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#013089] border-b border-slate-100 pb-3">
            <CreditCard className="h-4 w-4 text-[#013089]" />
            <span>6. Application Fee &amp; Payment Mode</span>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
            <div className="text-xs sm:text-sm font-semibold text-slate-900">
              {applicationFee}
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-600 pt-2 border-t border-slate-200">
              <span className="font-medium text-slate-800">Payment Modes Accepted:</span>
              <span>Online Net Banking, Debit Card, Credit Card, UPI / SBI Challan (where applicable).</span>
            </div>
          </div>
        </div>
      )}

      {/* 8. SELECTION PROCESS & STAGES */}
      {selectionProcess && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#013089] border-b border-slate-100 pb-3">
            <FileSearch className="h-4 w-4 text-[#013089]" />
            <span>7. Selection Process Stages</span>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
            <p className="text-xs sm:text-sm text-slate-900 font-medium leading-relaxed">
              {selectionProcess}
            </p>
            <p className="text-[11px] text-slate-500">
              Candidates must qualify each stage with minimum cutoff marks to progress to final merit ranking and medical examination.
            </p>
          </div>
        </div>
      )}

      {/* 9. REQUIRED APPLICATION DOCUMENTS CHECKLIST */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#013089] border-b border-slate-100 pb-3">
          <CheckCircle2 className="h-4 w-4 text-[#013089]" />
          <span>8. Required Documents for Online Registration</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-100">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>Recent Passport Size Photograph (white background, JPEG/JPG format).</span>
          </div>
          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-100">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>Candidate Signature scanned clearly in black ink.</span>
          </div>
          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-100">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>10th (Matriculation) Certificate &amp; Marksheet for Date of Birth verification.</span>
          </div>
          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-100">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>Educational Qualification Certificates (Degree/Diploma/12th Marksheets).</span>
          </div>
          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-100">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>Category Certificate (SC/ST/OBC-NCL/EWS) if claiming reservation.</span>
          </div>
          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-100">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>Valid Photo Identification Card (Aadhaar / Voter ID / PAN / Passport).</span>
          </div>
        </div>
      </div>

      {/* 10. HOW TO APPLY (STEP-BY-STEP INSTRUCTIONS) */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#013089] border-b border-slate-100 pb-3">
          <Sparkles className="h-4 w-4 text-[#013089]" />
          <span>9. Step-by-Step Application Guide</span>
        </div>

        <div className="space-y-3 text-xs sm:text-sm text-slate-700">
          <div className="flex items-start gap-3">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-50 text-[#013089] font-bold text-xs">
              1
            </div>
            <p className="pt-0.5">
              Visit the official registration portal of <strong>{org?.name}</strong>.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-50 text-[#013089] font-bold text-xs">
              2
            </div>
            <p className="pt-0.5">
              Complete the One-Time Registration (OTR) using a valid email ID and mobile number.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-50 text-[#013089] font-bold text-xs">
              3
            </div>
            <p className="pt-0.5">
              Fill in personal, educational, category, and address details accurately as per matriculation certificate.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-50 text-[#013089] font-bold text-xs">
              4
            </div>
            <p className="pt-0.5">
              Upload scanned photo, signature, and relevant documents in the prescribed file dimensions.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-50 text-[#013089] font-bold text-xs">
              5
            </div>
            <p className="pt-0.5">
              Pay the examination fee online and download / print the final confirmation application form for future reference.
            </p>
          </div>
        </div>
      </div>

      {/* 11. IMPORTANT OFFICIAL LINKS & GAZETTE CIRCULARS */}
      <div className="rounded-2xl border border-[#013089]/20 bg-[#013089]/5 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#013089]">
          <FileCheck2 className="h-5 w-5 text-[#013089]" />
          <span>10. Important Official Links &amp; Circulars</span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-xs sm:text-sm text-slate-800 border-collapse">
            <tbody className="divide-y divide-slate-100">
              {job.official_apply_url && (
                <tr className="hover:bg-slate-50/80">
                  <td className="py-3 px-4 font-bold text-slate-900 w-1/3">Apply Online (Candidate Portal)</td>
                  <td className="py-3 px-4">
                    <a
                      href={job.official_apply_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackApplyClicked(job.title, org?.name || "Govt", job.official_apply_url!)}
                      className="inline-flex items-center gap-1.5 font-bold text-white bg-[#013089] hover:bg-[#01276E] px-3.5 py-1.5 rounded-lg shadow-xs transition-colors text-xs"
                    >
                      <span>Apply Now</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </td>
                </tr>
              )}

              {job.official_notification_url && (
                <tr className="hover:bg-slate-50/80">
                  <td className="py-3 px-4 font-bold text-slate-900">Official Notification Gazette PDF</td>
                  <td className="py-3 px-4">
                    <a
                      href={job.official_notification_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackNotificationClicked(job.title, org?.name || "Govt", job.official_notification_url!)}
                      className="inline-flex items-center gap-1.5 font-bold text-[#013089] bg-brand-50 hover:bg-brand-100 px-3.5 py-1.5 rounded-lg border border-brand-200 transition-colors text-xs"
                    >
                      <FileText className="h-3.5 w-3.5 text-[#013089]" />
                      <span>Download Notification</span>
                      <ExternalLink className="h-3.5 w-3.5 ml-0.5 text-slate-400" />
                    </a>
                  </td>
                </tr>
              )}

              {org?.website_url && (
                <tr className="hover:bg-slate-50/80">
                  <td className="py-3 px-4 font-bold text-slate-900">Official Commission Website</td>
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
                  className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs"
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

      {/* 12. VERIFIED RECRUITMENT FAQS */}
      {verifiedFaqs.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#013089] border-b border-slate-100 pb-3">
            <HelpCircle className="h-4 w-4 text-[#013089]" />
            <span>11. Frequently Asked Questions (Verified FAQs)</span>
          </div>

          <div className="divide-y divide-slate-100">
            {verifiedFaqs.map((faq, idx) => (
              <div key={idx} className="py-3.5 first:pt-0 last:pb-0 space-y-1">
                <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                  Q{idx + 1}. {faq.question}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 13. OFFICIAL AUTHORITY PROVENANCE & VERIFICATION */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-700 flex items-start gap-3">
        <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-bold text-slate-900">Official Government Provenance &amp; Verification</div>
          <p className="leading-relaxed text-slate-600">
            This recruitment notice is sourced directly from the official gazette portal of <strong>{org?.name}</strong>.
            Candidates are encouraged to verify all terms and conditions on the official commission website.
            SuchnaSetu does not charge any application or recruitment fees.
          </p>
        </div>
      </div>
    </div>
  );
}
