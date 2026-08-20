"use client";

import Link from "next/link";
import { GovJobDetailed } from "../types";
import { useLanguage } from "@/lib/i18n/context";
import { resolveLocalizedJob } from "@/lib/i18n/localize";
import { getLocalizedDateLabel } from "@/lib/i18n/config";
import { formatDate, formatINR, formatNumber } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import {
  Building2,
  Calendar,
  IndianRupee,
  Users,
  MapPin,
  FileText,
  ExternalLink,
  Download,
  ShieldCheck,
  ShieldAlert,
  GraduationCap,
  Briefcase,
  Layers,
  FileSpreadsheet,
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

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-slate-800 transition-colors">
          {t("nav.home")}
        </Link>
        <span>/</span>
        <Link href="/jobs" className="hover:text-slate-800 transition-colors">
          {t("nav.jobs")}
        </Link>
        <span>/</span>
        <span className="font-semibold text-slate-800 truncate max-w-[200px] sm:max-w-xs">
          {org?.acronym || org?.name || "Notice"}
        </span>
      </nav>

      {/* Hero Header Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="brand" className="text-xs font-bold py-0.5 px-2.5 bg-[#013089] text-white">
              {org?.acronym || org?.name || "Government"}
            </Badge>
            {dept && (
              <Badge variant="outline" className="text-xs font-medium">
                {dept.name}
              </Badge>
            )}
            {job.category && (
              <Badge variant="default" className="text-xs">
                {job.category.name}
              </Badge>
            )}
            {qual && (
              <Badge variant="secondary" className="text-xs font-semibold">
                {qual.name}
              </Badge>
            )}
            <Badge variant="success" className="text-xs bg-emerald-100 text-emerald-800 border-emerald-200">
              Verified Official Notice
            </Badge>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <MapPin className="h-3.5 w-3.5 text-slate-400" />
            <span>{state ? state.name : "All India Jurisdiction"}</span>
          </div>
        </div>

        {/* Localized Title */}
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl font-heading leading-tight">
          {job.title}
        </h1>

        {job.notification_number && (
          <div className="mt-2 text-xs font-mono text-slate-500">
            {t("card.advt_no")}: <span className="font-semibold text-slate-800">{job.notification_number}</span>
          </div>
        )}

        {/* Quick Metrics Bar */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 rounded-xl bg-slate-50 p-4 border border-slate-100 mt-6">
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">{t("card.vacancies")}</div>
            <div className="text-lg font-extrabold text-emerald-700 mt-0.5">
              {formatNumber(job.total_vacancies)} {t("card.posts")}
            </div>
          </div>

          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">{t("card.salary")}</div>
            <div className="text-sm font-bold text-slate-800 mt-0.5 truncate">
              {job.salary_min || job.salary_max
                ? `${formatINR(job.salary_min)} - ${formatINR(job.salary_max)}`
                : job.pay_scale_details || "As per 7th CPC"}
            </div>
          </div>

          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">
              {getLocalizedDateLabel("application_start", language, "Application Start")}
            </div>
            <div className="text-sm font-semibold text-slate-800 mt-0.5">
              {formatDate(job.application_start_date)}
            </div>
          </div>

          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">{t("card.last_date")}</div>
            <div className="text-sm font-bold text-amber-700 mt-0.5">
              {formatDate(job.application_end_date)}
            </div>
          </div>
        </div>

        {/* Direct Provenance Action Strip (Preserving Official URLs) */}
        <div className="flex flex-wrap items-center gap-3 mt-6 pt-6 border-t border-slate-100">
          {job.official_apply_url && (
            <a
              href={job.official_apply_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none"
            >
              <Button variant="primary" size="lg" className="w-full gap-2 font-bold shadow-xs bg-[#013089] hover:bg-[#01276E] text-white">
                <span>{t("card.apply_online")}</span>
                <ExternalLink className="h-4 w-4" />
              </Button>
            </a>
          )}

          {job.official_notification_url && (
            <a
              href={job.official_notification_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none"
            >
              <Button variant="outline" size="lg" className="w-full gap-2 font-semibold">
                <Download className="h-4 w-4 text-slate-600" />
                <span>{t("card.official_pdf")}</span>
              </Button>
            </a>
          )}

          {org?.website_url && (
            <a
              href={org.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-block"
            >
              <Button variant="ghost" size="lg" className="gap-1.5 text-xs text-slate-600">
                <Building2 className="h-4 w-4" />
                <span>{org.acronym || org.name} Official Portal</span>
              </Button>
            </a>
          )}
        </div>
      </div>

      {/* Summary / Description if present */}
      {(job.description || job.summary) && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold text-slate-900">
              Notice Summary &amp; Scope
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {job.description || job.summary}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Important Dates Timeline Card */}
      {dates.length > 0 && (
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-[#013089]" />
              <CardTitle className="text-base font-bold text-slate-900">
                Important Dates &amp; Timelines
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {dates.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-lg border border-slate-100 bg-slate-50/50 p-3.5 flex flex-col justify-between"
                >
                  <div className="text-xs font-semibold text-slate-600">
                    {item.event_name}
                  </div>
                  <div className="mt-2 text-sm font-bold text-slate-900">
                    {formatDate(item.event_date)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Vacancy Breakdown Table */}
      {vacancies.length > 0 && (
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5 text-[#013089]" />
                <CardTitle className="text-base font-bold text-slate-900">
                  Vacancy &amp; Reservation Breakdown
                </CardTitle>
              </div>
              <Badge variant="outline" className="text-xs font-bold font-mono">
                Total: {formatNumber(job.total_vacancies)} Posts
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="font-bold text-slate-700">Post / Designation</TableHead>
                    <TableHead className="font-bold text-slate-700 text-center">UR</TableHead>
                    <TableHead className="font-bold text-slate-700 text-center">EWS</TableHead>
                    <TableHead className="font-bold text-slate-700 text-center">OBC</TableHead>
                    <TableHead className="font-bold text-slate-700 text-center">SC</TableHead>
                    <TableHead className="font-bold text-slate-700 text-center">ST</TableHead>
                    <TableHead className="font-bold text-slate-900 text-right">Total Posts</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vacancies.map((v, idx) => (
                    <TableRow key={idx} className="hover:bg-slate-50/50">
                      <TableCell className="font-medium text-slate-900">
                        {v.post_name}
                      </TableCell>
                      <TableCell className="text-center font-mono text-xs">{v.ur_posts ?? "-"}</TableCell>
                      <TableCell className="text-center font-mono text-xs">{v.ews_posts ?? "-"}</TableCell>
                      <TableCell className="text-center font-mono text-xs">{v.obc_posts ?? "-"}</TableCell>
                      <TableCell className="text-center font-mono text-xs">{v.sc_posts ?? "-"}</TableCell>
                      <TableCell className="text-center font-mono text-xs">{v.st_posts ?? "-"}</TableCell>
                      <TableCell className="text-right font-bold font-mono text-slate-900">
                        {formatNumber(v.total_posts)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Eligibility & Qualifications */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-[#013089]" />
            <CardTitle className="text-base font-bold text-slate-900">
              Eligibility &amp; Qualification Requirements
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 text-xs text-slate-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
              <div className="font-bold text-slate-900 text-sm">Educational Qualification</div>
              <p className="text-slate-600 leading-relaxed">
                {job.qualification_summary || eligibility?.education_qualification || "Please check official advertisement for exact qualifications."}
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
              <div className="font-bold text-slate-900 text-sm">Age Limits &amp; Criteria</div>
              <p className="text-slate-600 leading-relaxed">
                {job.age_limit_summary ||
                  (eligibility?.min_age || eligibility?.max_age
                    ? `Min Age: ${eligibility?.min_age || "18"} Years, Max Age: ${eligibility?.max_age || "37"} Years (Relaxation as per Govt Rules)`
                    : "As per official recruitment notification rules.")}
              </p>
            </div>
          </div>

          {(job.selection_process || eligibility?.selection_process) && (
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
              <div className="font-bold text-slate-900 text-sm">Selection Process</div>
              <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                {job.selection_process || eligibility?.selection_process}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Official Documents Catalog */}
      {documents.length > 0 && (
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-[#013089]" />
              <CardTitle className="text-base font-bold text-slate-900">
                Official Gazette Documents &amp; Circulars
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {documents.map((doc, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-slate-500 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-slate-900">{doc.title}</div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      {doc.document_type.toUpperCase()} • Official Source File
                    </div>
                  </div>
                </div>

                <a
                  href={doc.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#013089] hover:underline"
                >
                  <span>{t("card.official_pdf")}</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Transparency Disclaimer */}
      <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 text-xs text-amber-950 flex items-start gap-3">
        <ShieldAlert className="h-5 w-5 text-[#FE8D01] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Official Gazette Disclaimer:</strong> All candidates are advised to verify details from the original official advertisement before applying. SuchnaSetu does not charge any fee for access to official recruitment notices.
        </p>
      </div>
    </div>
  );
}
