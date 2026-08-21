"use client";

import * as React from "react";
import Link from "next/link";
import { GovExamDetailed } from "../types";
import { useLanguage } from "@/lib/i18n/context";
import { resolveLocalizedExam } from "@/lib/i18n/localize";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { ExamTimeline } from "@/modules/exams/components/exam-timeline";
import {
  Building2,
  Calendar,
  Layers,
  MapPin,
  Clock,
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
  GraduationCap,
  Sparkles,
  BookOpen,
  FileText,
  Briefcase,
  ChevronRight,
  Globe,
  FileCheck2,
  CreditCard,
} from "lucide-react";

interface ExamDetailViewProps {
  exam: GovExamDetailed;
  relatedExams?: GovExamDetailed[];
}

export function ExamDetailView({ exam: rawExam, relatedExams = [] }: ExamDetailViewProps) {
  const { language, t } = useLanguage();
  const exam = resolveLocalizedExam(rawExam, language);

  const org = exam.organization;
  const dept = exam.department;
  const stages = exam.stages || [];
  const schedules = exam.schedules || [];
  const eligibility = exam.eligibility;
  const dates = exam.important_dates || [];
  const centers = exam.centers || [];
  const documents = exam.official_documents || [];
  const relatedJob = exam.related_job;

  const appStartDate = dates.find(
    (d) => d.date_type === "application_start" || d.title.toLowerCase().includes("start")
  );
  const appEndDate = dates.find(
    (d) => d.date_type === "application_end" || d.title.toLowerCase().includes("last") || d.title.toLowerCase().includes("closing")
  );
  const examDate = dates.find(
    (d) => d.date_type === "exam_start" || d.title.toLowerCase().includes("exam")
  );

  const isClosingSoon = appEndDate?.event_date
    ? new Date(appEndDate.event_date).getTime() - Date.now() < 5 * 86400000 &&
      new Date(appEndDate.event_date).getTime() > Date.now()
    : false;

  const formatMode = (mode?: string | null) => {
    if (!mode) return "Computer Based Test / Written";
    switch (mode) {
      case "online_cbt":
        return "Online Computer Based Test (CBT)";
      case "offline_omr":
        return "Offline OMR Sheet";
      case "pen_paper":
        return "Pen & Paper Conventional (Descriptive)";
      case "hybrid":
        return "Hybrid (CBT + Written)";
      case "interview_only":
        return "Interview / Personality Test Only";
      default:
        return mode.replace("_", " ").toUpperCase();
    }
  };

  const educationalQualification =
    eligibility?.min_qualification?.name ||
    eligibility?.educational_qualification_description ||
    exam.eligibility_summary ||
    null;

  const ageLimits =
    eligibility?.min_age && eligibility?.max_age
      ? `Min: ${eligibility.min_age} Yrs | Max: ${eligibility.max_age} Yrs`
      : eligibility?.max_age
        ? `Max: ${eligibility.max_age} Yrs`
        : null;

  const applicationFee =
    (exam.application_fee_details as any)
      ? typeof exam.application_fee_details === "string"
        ? exam.application_fee_details
        : JSON.stringify(exam.application_fee_details, null, 2)
      : null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-slate-800 transition-colors">
          {t("nav.home")}
        </Link>
        <ChevronRight className="h-3 w-3 text-slate-400" />
        <Link href="/exams" className="hover:text-slate-800 transition-colors">
          {t("nav.exams")}
        </Link>
        <ChevronRight className="h-3 w-3 text-slate-400" />
        <span className="font-semibold text-slate-800 truncate max-w-[220px] sm:max-w-md">
          {exam.short_title || exam.title}
        </span>
      </nav>

      {/* SECTION 1: HEADER & KEY SUMMARY */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-7 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="brand" className="text-xs font-bold py-0.5 px-2.5 bg-[#013089] text-white">
              {org?.acronym || org?.name || "Official Commission"}
            </Badge>
            {exam.category && (
              <Badge variant="default" className="text-xs">
                {exam.category.name}
              </Badge>
            )}
            <Badge variant="success" className="text-xs bg-emerald-100 text-emerald-800 border-emerald-200">
              <ShieldCheck className="h-3 w-3 mr-1" />
              Verified Official Schedule
            </Badge>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <MapPin className="h-3.5 w-3.5 text-slate-400" />
            <span>{exam.state ? exam.state.name : "National Jurisdiction"}</span>
          </div>
        </div>

        {/* Localized Title */}
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 font-heading leading-snug">
          {exam.title}
        </h1>

        {exam.exam_code && (
          <div className="mt-2 text-xs font-mono text-slate-600">
            Official Exam Code: <span className="font-semibold text-slate-900">{exam.exam_code}</span>
          </div>
        )}

        {exam.description && (
          <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed max-w-4xl border-t border-slate-100 pt-3">
            {exam.description}
          </p>
        )}

        {/* Primary Action Button Bar */}
        <div className="flex flex-wrap items-center gap-3 mt-5 pt-4 border-t border-slate-100">
          {exam.official_website_url && (
            <a
              href={exam.official_website_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="primary"
                size="md"
                className="gap-2 font-bold bg-[#013089] hover:bg-[#01276E] text-white shadow-xs"
              >
                <span>{t("card.apply_now")}</span>
                <ExternalLink className="h-4 w-4" />
              </Button>
            </a>
          )}

          {exam.official_notification_url && (
            <a
              href={exam.official_notification_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="outline"
                size="md"
                className="gap-2 font-bold text-[#013089] border-[#013089]/40 hover:bg-brand-50 hover:border-[#013089]"
              >
                <FileText className="h-4 w-4 text-[#013089]" />
                <span>{t("card.official_notification")}</span>
                <ExternalLink className="h-3.5 w-3.5 ml-0.5 text-slate-400" />
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
              <Button
                variant="ghost"
                size="md"
                className="gap-1.5 text-xs text-slate-600 hover:text-slate-900"
              >
                <Building2 className="h-3.5 w-3.5" />
                <span>Official Website</span>
                <ExternalLink className="h-3 w-3 ml-0.5 text-slate-400" />
              </Button>
            </a>
          )}
        </div>
      </div>

      {/* SECTION 2: QUICK INFORMATION OVERVIEW */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="bg-slate-50/80 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#013089]">
            <Layers className="h-4 w-4" />
            <span>Quick Examination Overview</span>
          </div>
          {exam.mode && (
            <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded font-mono border border-slate-200 uppercase">
              {exam.mode.replace("_", " ")}
            </span>
          )}
        </div>

        <div className="p-4 sm:p-5">
          <table className="w-full text-xs text-slate-800 border-collapse">
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50/50">
                <td className="py-2.5 px-3 font-semibold text-slate-600 w-1/3 sm:w-1/4">Conducting Authority</td>
                <td className="py-2.5 px-3 font-bold text-slate-900">{org?.name || "Official Examination Authority"}</td>
              </tr>
              <tr className="hover:bg-slate-50/50">
                <td className="py-2.5 px-3 font-semibold text-slate-600">Examination Mode</td>
                <td className="py-2.5 px-3 font-semibold text-slate-900">{formatMode(exam.mode)}</td>
              </tr>
              {exam.frequency && (
                <tr className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-3 font-semibold text-slate-600">Frequency</td>
                  <td className="py-2.5 px-3 capitalize text-slate-900">{exam.frequency.replace("_", " ")}</td>
                </tr>
              )}
              {stages.length > 0 && (
                <tr className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-3 font-semibold text-slate-600">Evaluation Stages</td>
                  <td className="py-2.5 px-3 font-bold text-slate-900 font-mono">
                    {stages.length} {stages.length === 1 ? "Stage" : "Stages"} (
                    {stages.map((s) => s.stage_name).join(" → ")})
                  </td>
                </tr>
              )}
              <tr className="hover:bg-slate-50/50">
                <td className="py-2.5 px-3 font-semibold text-slate-600">Jurisdiction</td>
                <td className="py-2.5 px-3 text-slate-900">{exam.state ? exam.state.name : "National / All India"}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 3: IMPORTANT EXAMINATION DATES & TIMELINE */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="bg-slate-50/80 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#013089]">
            <Calendar className="h-4 w-4" />
            <span>Important Examination Schedule &amp; Dates</span>
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
              {appStartDate?.event_date && (
                <tr className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-3 font-semibold text-slate-600 w-1/2 sm:w-1/3">Application Start Date</td>
                  <td className="py-2.5 px-3 font-mono font-semibold text-slate-900">
                    {formatDate(appStartDate.event_date)}
                  </td>
                </tr>
              )}
              {appEndDate?.event_date && (
                <tr className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-3 font-semibold text-slate-600">Last Date to Apply</td>
                  <td className={`py-2.5 px-3 font-mono ${isClosingSoon ? "font-bold text-amber-700" : "font-bold text-slate-900"}`}>
                    {formatDate(appEndDate.event_date)}
                  </td>
                </tr>
              )}
              {examDate?.event_date && (
                <tr className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-3 font-semibold text-slate-600">Official Exam Date</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-brand-700">
                    {formatDate(examDate.event_date)} {examDate.is_tentative ? "(Tentative)" : ""}
                  </td>
                </tr>
              )}
              {dates.map((d, idx) => {
                if (d.id === appStartDate?.id || d.id === appEndDate?.id || d.id === examDate?.id) return null;
                return (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-3 font-semibold text-slate-600">{d.title}</td>
                    <td className="py-2.5 px-3 font-mono font-semibold text-slate-900">
                      {formatDate(d.event_date)} {d.is_tentative ? "(Tentative)" : ""}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Examination Timeline Widget */}
          {dates.length > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-100">
              <ExamTimeline dates={dates} />
            </div>
          )}
        </div>
      </div>

      {/* SECTION 4: ELIGIBILITY CRITERIA & AGE LIMITS */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="bg-slate-50/80 px-4 py-3 border-b border-slate-200">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#013089]">
            <GraduationCap className="h-4 w-4" />
            <span>Eligibility Criteria &amp; Candidate Qualifications</span>
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
              <div className="font-bold text-slate-900 text-xs uppercase tracking-wide">Age Limits &amp; Relaxations</div>
              <p className="text-slate-700 leading-relaxed font-mono">{ageLimits}</p>
              {eligibility?.age_relaxation_rules && (
                <p className="text-slate-600 text-[11px] mt-1">{eligibility.age_relaxation_rules}</p>
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

          {/* Shift Schedule Table if present */}
          {schedules.length > 0 && (
            <div className="space-y-2 pt-2">
              <div className="font-bold text-slate-900 text-xs uppercase tracking-wide">
                Examination Paper &amp; Shift Schedule
              </div>
              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow className="text-[11px] uppercase">
                      <TableHead className="font-bold text-slate-700">Exam Date</TableHead>
                      <TableHead className="font-bold text-slate-700">Shift</TableHead>
                      <TableHead className="font-bold text-slate-700">Timings</TableHead>
                      <TableHead className="font-bold text-slate-700">Reporting Time</TableHead>
                      <TableHead className="font-bold text-slate-700">Advisory</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="text-xs">
                    {schedules.map((s, idx) => (
                      <TableRow key={idx} className="hover:bg-slate-50/50">
                        <TableCell className="font-semibold text-slate-900 font-mono">
                          {formatDate(s.exam_date)}
                        </TableCell>
                        <TableCell className="font-bold text-[#013089]">{s.shift_name}</TableCell>
                        <TableCell className="font-mono text-slate-700">{s.start_time} - {s.end_time}</TableCell>
                        <TableCell className="font-mono text-slate-500">{s.reporting_time || "1 Hr Prior"}</TableCell>
                        <TableCell className="text-slate-600">{s.instructions || "Admit Card Required"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SECTION 5: EXAMINATION PATTERN & SYLLABUS (If present) */}
      {(exam.syllabus_summary || exam.pattern_description || exam.marking_scheme) && (
        <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
          <div className="bg-slate-50/80 px-4 py-3 border-b border-slate-200">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#013089]">
              <BookOpen className="h-4 w-4" />
              <span>Exam Pattern, Marking Scheme &amp; Syllabus</span>
            </div>
          </div>
          <div className="p-4 sm:p-5 text-xs text-slate-700 space-y-3 leading-relaxed">
            {exam.pattern_description && (
              <div>
                <div className="font-bold text-slate-900 text-xs uppercase">Exam Pattern</div>
                <p className="whitespace-pre-line mt-0.5">{exam.pattern_description}</p>
              </div>
            )}
            {exam.marking_scheme && (
              <div>
                <div className="font-bold text-slate-900 text-xs uppercase">Marking Scheme</div>
                <p className="whitespace-pre-line mt-0.5">{exam.marking_scheme}</p>
              </div>
            )}
            {exam.syllabus_summary && (
              <div>
                <div className="font-bold text-slate-900 text-xs uppercase">Syllabus Overview</div>
                <p className="whitespace-pre-line mt-0.5">{exam.syllabus_summary}</p>
              </div>
            )}
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
              {exam.official_website_url && (
                <tr className="hover:bg-slate-50/80">
                  <td className="py-3 px-4 font-bold text-slate-900 w-1/3">Apply Online (OTR / Application Gateway)</td>
                  <td className="py-3 px-4">
                    <a
                      href={exam.official_website_url}
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
              {exam.official_notification_url && (
                <tr className="hover:bg-slate-50/80">
                  <td className="py-3 px-4 font-bold text-slate-900">Official Examination Notice</td>
                  <td className="py-3 px-4">
                    <a
                      href={exam.official_notification_url}
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

              {/* Commission Official Website */}
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

              {/* Related Job Notice */}
              {relatedJob && (
                <tr className="hover:bg-slate-50/80">
                  <td className="py-3 px-4 font-bold text-slate-900">Linked Government Recruitment Notice</td>
                  <td className="py-3 px-4">
                    <Link
                      href={`/jobs/${relatedJob.slug}`}
                      className="inline-flex items-center gap-1.5 font-semibold text-brand-700 hover:text-brand-900 hover:underline text-xs"
                    >
                      <Briefcase className="h-3.5 w-3.5" />
                      <span>View {relatedJob.title}</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
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
          <div className="font-bold text-slate-900">Official Commission Provenance &amp; Schedule Verification</div>
          <p className="leading-relaxed text-slate-600">
            This examination schedule is aggregated directly from the official notices published by <strong>{org?.name}</strong>.
            Candidates must adhere to official hall tickets and commission advisories. SuchnaSetu is a civic information utility.
          </p>
        </div>
      </div>
    </div>
  );
}
