"use client";

import * as React from "react";
import Link from "next/link";
import { GovExamDetailed } from "../types";
import { useLanguage } from "@/lib/i18n/context";
import { resolveLocalizedExam } from "@/lib/i18n/localize";
import { formatDate, formatApplicationFee } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { ExamTimeline } from "@/modules/exams/components/exam-timeline";
import { generateVerifiedExamFaqs } from "../utils/generate-exam-faqs";
import {
  trackApplyClicked,
  trackNotificationClicked,
  trackSyllabusClicked,
  trackAnswerKeyClicked,
} from "@/lib/analytics";
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
  HelpCircle,
  CheckCircle2,
  FileSearch,
  ListOrdered,
  Award,
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
  const admitCardDate = dates.find(
    (d) => d.date_type === "admit_card_release" || d.title.toLowerCase().includes("admit")
  );
  const resultDate = dates.find(
    (d) => d.date_type === "result_declaration" || d.title.toLowerCase().includes("result")
  );

  const isClosingSoon = appEndDate?.event_date
    ? new Date(appEndDate.event_date).getTime() - Date.now() < 5 * 86400000 &&
      new Date(appEndDate.event_date).getTime() > Date.now()
    : false;

  const isClosed = appEndDate?.event_date
    ? new Date(appEndDate.event_date).getTime() < Date.now()
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
      : eligibility?.min_age
      ? `Min: ${eligibility.min_age} Yrs`
      : null;

  const applicationFee = formatApplicationFee(exam.application_fee_details);

  const verifiedFaqs = React.useMemo(() => generateVerifiedExamFaqs(exam), [exam]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-7 font-sans">
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
        {exam.state_code && (
          <>
            <Link
              href={`/state/${exam.state_code.toLowerCase()}`}
              className="hover:text-slate-800 transition-colors uppercase font-medium"
            >
              {exam.state_code}
            </Link>
            <ChevronRight className="h-3 w-3 text-slate-400" />
          </>
        )}
        <span className="font-semibold text-slate-800 truncate max-w-[200px] sm:max-w-md">
          {org?.acronym || org?.name || "Exam Schedule"}
        </span>
      </nav>

      {/* 1. HERO BANNER & EXECUTIVE SUMMARY */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 shadow-xs relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-50 text-[#013089] border border-brand-200">
              <Building2 className="h-3.5 w-3.5" />
              <span>{org?.acronym || org?.name || "Official Examination Authority"}</span>
            </span>

            {exam.state_code ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                <MapPin className="h-3 w-3 text-slate-500" />
                <span>{exam.state?.name || exam.state_code}</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                <Globe className="h-3 w-3 text-slate-500" />
                <span>All India (National Exam)</span>
              </span>
            )}

            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200 capitalize">
              {exam.frequency ? `${exam.frequency.replace("_", " ")} Frequency` : "Annual"}
            </span>
          </div>

          {/* Status Badge */}
          {exam.status === "concluded" ? (
            <Badge variant="secondary" className="font-semibold text-xs px-2.5 py-1">
              Examination Concluded
            </Badge>
          ) : isClosingSoon ? (
            <Badge variant="warning" className="font-semibold text-xs px-2.5 py-1 animate-pulse">
              <Clock className="h-3 w-3 mr-1" />
              Closing Soon
            </Badge>
          ) : (
            <Badge variant="success" className="font-semibold text-xs px-2.5 py-1">
              Active Examination
            </Badge>
          )}
        </div>

        <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug font-heading">
          {exam.title}
        </h1>

        {exam.exam_code && (
          <p className="text-xs sm:text-sm text-slate-500 font-mono mt-1">
            Exam Reference Code: <span className="font-semibold text-slate-700">{exam.exam_code}</span>
          </p>
        )}

        {/* Executive Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-100">
          <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-100">
            <div className="text-[11px] font-medium text-slate-500 flex items-center gap-1 mb-0.5">
              <Calendar className="h-3.5 w-3.5 text-rose-600" />
              <span>Exam Date</span>
            </div>
            <div className="text-sm sm:text-base font-bold text-slate-900 truncate">
              {examDate?.event_date ? formatDate(examDate.event_date) : "To Be Announced"}
            </div>
          </div>

          <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-100">
            <div className="text-[11px] font-medium text-slate-500 flex items-center gap-1 mb-0.5">
              <Clock className="h-3.5 w-3.5 text-brand-600" />
              <span>Exam Mode</span>
            </div>
            <div className="text-xs sm:text-sm font-bold text-slate-900 truncate" title={formatMode(exam.mode)}>
              {formatMode(exam.mode)}
            </div>
          </div>

          <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-100">
            <div className="text-[11px] font-medium text-slate-500 flex items-center gap-1 mb-0.5">
              <GraduationCap className="h-3.5 w-3.5 text-blue-600" />
              <span>Eligibility</span>
            </div>
            <div className="text-xs sm:text-sm font-bold text-slate-900 truncate" title={educationalQualification || "Refer Notification"}>
              {educationalQualification || "Refer Notification"}
            </div>
          </div>

          <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-100">
            <div className="text-[11px] font-medium text-slate-500 flex items-center gap-1 mb-0.5">
              <Award className="h-3.5 w-3.5 text-emerald-600" />
              <span>Stages</span>
            </div>
            <div className="text-sm font-bold text-slate-900">
              {stages.length > 0 ? `${stages.length} Stage Selection` : "Multiple Stages"}
            </div>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 mt-6">
          <Link
            href={`/syllabus/${exam.slug || exam.id}`}
            onClick={() => trackSyllabusClicked(exam.title, org?.name || "Govt")}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-[#013089] hover:bg-[#01276E] shadow-sm transition-all"
          >
            <BookOpen className="h-4 w-4" />
            <span>Complete Exam Syllabus &amp; Pattern</span>
          </Link>

          {exam.official_notification_url && (
            <a
              href={exam.official_notification_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackNotificationClicked(exam.title, org?.name || "Govt", exam.official_notification_url!)}
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
              <span>Conducting Portal</span>
              <ExternalLink className="h-3 w-3 text-slate-400" />
            </a>
          )}
        </div>
      </div>

      {/* 2. EXAMINATION OVERVIEW LEDGER */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#013089] border-b border-slate-100 pb-3">
          <FileCheck2 className="h-4 w-4 text-[#013089]" />
          <span>1. Examination Overview</span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-xs sm:text-sm text-slate-800 border-collapse">
            <tbody className="divide-y divide-slate-100">
              <tr className="bg-slate-50/50">
                <td className="py-2.5 px-4 font-semibold text-slate-600 w-1/3">Conducting Commission / Body</td>
                <td className="py-2.5 px-4 font-bold text-slate-900">{org?.name} ({org?.acronym || "GOV"})</td>
              </tr>
              {dept?.name && (
                <tr>
                  <td className="py-2.5 px-4 font-semibold text-slate-600">Department</td>
                  <td className="py-2.5 px-4 text-slate-900">{dept.name}</td>
                </tr>
              )}
              <tr className="bg-slate-50/50">
                <td className="py-2.5 px-4 font-semibold text-slate-600">Exam Name</td>
                <td className="py-2.5 px-4 font-bold text-slate-900">{exam.title}</td>
              </tr>
              {exam.exam_code && (
                <tr>
                  <td className="py-2.5 px-4 font-semibold text-slate-600">Examination Code</td>
                  <td className="py-2.5 px-4 font-mono font-medium text-slate-800">{exam.exam_code}</td>
                </tr>
              )}
              <tr className="bg-slate-50/50">
                <td className="py-2.5 px-4 font-semibold text-slate-600">Exam Mode</td>
                <td className="py-2.5 px-4 text-slate-900 font-medium">{formatMode(exam.mode)}</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-semibold text-slate-600">Frequency</td>
                <td className="py-2.5 px-4 text-slate-900 capitalize">{exam.frequency?.replace("_", " ") || "Annual"}</td>
              </tr>
              {relatedJob && (
                <tr className="bg-slate-50/50">
                  <td className="py-2.5 px-4 font-semibold text-slate-600">Linked Recruitment Notification</td>
                  <td className="py-2.5 px-4">
                    <Link
                      href={`/jobs/${relatedJob.slug}`}
                      className="font-bold text-[#013089] hover:underline inline-flex items-center gap-1"
                    >
                      <span>{relatedJob.title}</span>
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. IMPORTANT DATES & EXAMINATION CALENDAR */}
      {dates.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#013089] border-b border-slate-100 pb-3">
            <Calendar className="h-4 w-4 text-[#013089]" />
            <span>2. Official Examination Calendar</span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-xs sm:text-sm text-slate-800 border-collapse">
              <tbody className="divide-y divide-slate-100">
                {dates.map((d, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? "bg-slate-50/50" : ""}>
                    <td className="py-2.5 px-4 font-semibold text-slate-700 flex items-center gap-1.5">
                      <span>{d.title}</span>
                      {d.is_tentative && (
                        <span className="text-[10px] text-amber-600 font-bold bg-amber-50 px-1.5 py-0.5 rounded">
                          (Tentative)
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-4 font-mono font-medium text-slate-900">
                      {d.event_date ? formatDate(d.event_date) : "To Be Announced"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. EXAM STAGES & TIMELINE PROGRESSION */}
      {stages.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#013089] border-b border-slate-100 pb-3">
            <ListOrdered className="h-4 w-4 text-[#013089]" />
            <span>3. Examination Stages &amp; Progression</span>
          </div>

          <div className="space-y-3">
            {stages.map((st, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#013089] text-white font-bold text-xs">
                      {st.stage_order || idx + 1}
                    </span>
                    <span className="font-bold text-slate-900 text-xs sm:text-sm">{st.stage_name}</span>
                  </div>
                  <Badge variant="outline" className="text-[10px] uppercase font-mono">
                    {st.stage_type.replace("_", " ")}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-600 pt-1">
                  <div>
                    <span className="block text-slate-400 text-[10px]">Mode:</span>
                    <span className="font-medium text-slate-800">{st.mode || formatMode(exam.mode)}</span>
                  </div>
                  <div>
                    <span className="block text-slate-400 text-[10px]">Duration:</span>
                    <span className="font-medium text-slate-800">{st.duration_minutes ? `${st.duration_minutes} Mins` : "As per circular"}</span>
                  </div>
                  <div>
                    <span className="block text-slate-400 text-[10px]">Total Marks:</span>
                    <span className="font-medium text-slate-800">{st.total_marks ? `${st.total_marks} Marks` : "As per circular"}</span>
                  </div>
                  <div>
                    <span className="block text-slate-400 text-[10px]">Qualifying Marks:</span>
                    <span className="font-medium text-slate-800">{st.qualifying_marks ? `${st.qualifying_marks}%` : "Category Cutoff"}</span>
                  </div>
                </div>

                {st.description && (
                  <p className="text-xs text-slate-600 pt-1 leading-relaxed border-t border-slate-200">
                    {st.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. EXAM PATTERN & MARKING SCHEME */}
      {(exam.marking_scheme || exam.pattern_description) && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#013089] border-b border-slate-100 pb-3">
            <FileSearch className="h-4 w-4 text-[#013089]" />
            <span>4. Exam Pattern &amp; Marking Scheme</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {exam.pattern_description && (
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5">
                <div className="text-xs font-bold uppercase tracking-wide text-slate-700">Question Paper Structure</div>
                <p className="text-xs sm:text-sm text-slate-900 leading-relaxed font-medium">
                  {exam.pattern_description}
                </p>
              </div>
            )}

            {exam.marking_scheme && (
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5">
                <div className="text-xs font-bold uppercase tracking-wide text-slate-700">Marking &amp; Negative Scheme</div>
                <p className="text-xs sm:text-sm text-slate-900 leading-relaxed font-medium">
                  {exam.marking_scheme}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 6. SUBJECT-WISE SYLLABUS HIGHLIGHT */}
      <div className="rounded-2xl border border-blue-200 bg-blue-50/40 p-5 sm:p-6 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#013089]">
            <BookOpen className="h-4 w-4 text-[#013089]" />
            <span>5. Complete Exam Syllabus &amp; Curriculum</span>
          </div>
          <Link
            href={`/syllabus/${exam.slug || exam.id}`}
            onClick={() => trackSyllabusClicked(exam.title, org?.name || "Govt")}
            className="text-xs font-bold text-[#013089] hover:underline inline-flex items-center gap-1"
          >
            <span>Open Dedicated Syllabus</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
          {exam.syllabus_summary ||
            `The official curriculum includes General Studies, Quantitative Aptitude, Reasoning Ability, English/Hindi Comprehension, and Subject-Specific domains prescribed by ${org?.name}.`}
        </p>
      </div>

      {/* 7. ELIGIBILITY CRITERIA & AGE LIMITS */}
      {(educationalQualification || ageLimits || eligibility?.attempts_limit || eligibility?.physical_standards) && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#013089] border-b border-slate-100 pb-3">
            <GraduationCap className="h-4 w-4 text-[#013089]" />
            <span>6. Eligibility Criteria &amp; Age Limits</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {educationalQualification && (
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5">
                <div className="text-xs font-bold uppercase tracking-wide text-slate-700">Educational Qualification</div>
                <p className="text-xs sm:text-sm text-slate-900 leading-relaxed font-medium">
                  {educationalQualification}
                </p>
              </div>
            )}

            {ageLimits && (
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5">
                <div className="text-xs font-bold uppercase tracking-wide text-slate-700">Prescribed Age Limits</div>
                <p className="text-xs sm:text-sm text-slate-900 leading-relaxed font-medium">
                  {ageLimits}
                </p>
              </div>
            )}

            {eligibility?.attempts_limit && (
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5">
                <div className="text-xs font-bold uppercase tracking-wide text-slate-700">Allowed Attempts Limit</div>
                <p className="text-xs sm:text-sm text-slate-900 leading-relaxed">
                  Maximum {eligibility.attempts_limit} attempts for General candidates (relaxations as per reservation norms).
                </p>
              </div>
            )}

            {eligibility?.physical_standards && (
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5">
                <div className="text-xs font-bold uppercase tracking-wide text-slate-700">Physical Standards &amp; Fitness</div>
                <p className="text-xs sm:text-sm text-slate-900 leading-relaxed">
                  {eligibility.physical_standards}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 8. APPLICATION FEE STRUCTURE */}
      {applicationFee && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#013089] border-b border-slate-100 pb-3">
            <CreditCard className="h-4 w-4 text-[#013089]" />
            <span>7. Examination Fee Structure</span>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
            <div className="text-xs sm:text-sm font-semibold text-slate-900">
              {applicationFee}
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-600 pt-2 border-t border-slate-200">
              <span className="font-medium text-slate-800">Fee Payment Channels:</span>
              <span>Online Net Banking, UPI, Credit Card, Debit Card or Bank Challan.</span>
            </div>
          </div>
        </div>
      )}

      {/* 9. SHIFTS & SCHEDULES IF CONFIGURED */}
      {schedules.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#013089] border-b border-slate-100 pb-3">
            <Clock className="h-4 w-4 text-[#013089]" />
            <span>8. Examination Shifts &amp; Reporting Timings</span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-xs text-slate-800 border-collapse">
              <thead className="bg-slate-100 text-slate-900 font-bold">
                <tr>
                  <th className="py-2.5 px-4 text-left">Paper / Subject</th>
                  <th className="py-2.5 px-4 text-left">Exam Date</th>
                  <th className="py-2.5 px-4 text-left">Shift</th>
                  <th className="py-2.5 px-4 text-left">Reporting Time</th>
                  <th className="py-2.5 px-4 text-left">Exam Timing</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {schedules.map((sc, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-2.5 px-4 font-semibold text-slate-900">{sc.paper_name}</td>
                    <td className="py-2.5 px-4 font-mono">{formatDate(sc.exam_date)}</td>
                    <td className="py-2.5 px-4">{sc.shift_name || "General"}</td>
                    <td className="py-2.5 px-4 font-mono text-rose-700">{sc.reporting_time || "1 Hour Prior"}</td>
                    <td className="py-2.5 px-4 font-mono">{sc.start_time && sc.end_time ? `${sc.start_time} - ${sc.end_time}` : "As on Admit Card"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 10. IMPORTANT OFFICIAL LINKS & GAZETTE CIRCULARS */}
      <div className="rounded-2xl border border-[#013089]/20 bg-[#013089]/5 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#013089]">
          <FileCheck2 className="h-5 w-5 text-[#013089]" />
          <span>9. Important Official Links &amp; Gateways</span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-xs sm:text-sm text-slate-800 border-collapse">
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50/80">
                <td className="py-3 px-4 font-bold text-slate-900 w-1/3">Exam Syllabus &amp; Scheme</td>
                <td className="py-3 px-4">
                  <Link
                    href={`/syllabus/${exam.slug || exam.id}`}
                    onClick={() => trackSyllabusClicked(exam.title, org?.name || "Govt")}
                    className="inline-flex items-center gap-1.5 font-bold text-white bg-[#013089] hover:bg-[#01276E] px-3.5 py-1.5 rounded-lg shadow-xs transition-colors text-xs"
                  >
                    <span>View Syllabus</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </td>
              </tr>

              {exam.official_notification_url && (
                <tr className="hover:bg-slate-50/80">
                  <td className="py-3 px-4 font-bold text-slate-900">Official Exam Notification PDF</td>
                  <td className="py-3 px-4">
                    <a
                      href={exam.official_notification_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackNotificationClicked(exam.title, org?.name || "Govt", exam.official_notification_url!)}
                      className="inline-flex items-center gap-1.5 font-bold text-[#013089] bg-brand-50 hover:bg-brand-100 px-3.5 py-1.5 rounded-lg border border-brand-200 transition-colors text-xs"
                    >
                      <FileText className="h-3.5 w-3.5 text-[#013089]" />
                      <span>Download PDF</span>
                      <ExternalLink className="h-3.5 w-3.5 ml-0.5 text-slate-400" />
                    </a>
                  </td>
                </tr>
              )}

              {org?.website_url && (
                <tr className="hover:bg-slate-50/80">
                  <td className="py-3 px-4 font-bold text-slate-900">Official Examination Portal</td>
                  <td className="py-3 px-4">
                    <a
                      href={org.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-[#013089] hover:underline"
                    >
                      <Building2 className="h-3.5 w-3.5 text-slate-500" />
                      <span>{org.name} Official Website</span>
                      <ExternalLink className="h-3 w-3 ml-1 text-slate-400" />
                    </a>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Attached Official Circular Documents if present */}
        {documents.length > 0 && (
          <div className="pt-2 space-y-2">
            <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Attached Examination Circulars &amp; Annexures
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

      {/* 11. VERIFIED EXAMINATION FAQS */}
      {verifiedFaqs.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#013089] border-b border-slate-100 pb-3">
            <HelpCircle className="h-4 w-4 text-[#013089]" />
            <span>10. Frequently Asked Questions (Verified FAQs)</span>
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

      {/* 12. OFFICIAL PROVENANCE & AUTHENTICATION */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-700 flex items-start gap-3">
        <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-bold text-slate-900">Official Government Provenance &amp; Verification</div>
          <p className="leading-relaxed text-slate-600">
            This examination schedule is published directly from the official gazette notices of <strong>{org?.name}</strong>.
            Candidates must check the official commission website for real-time exam center allotments and admit card downloads.
          </p>
        </div>
      </div>
    </div>
  );
}
