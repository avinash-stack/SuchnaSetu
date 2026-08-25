"use client";

import * as React from "react";
import Link from "next/link";
import { GovExamDetailed } from "../types";
import { useLanguage } from "@/lib/i18n/context";
import { resolveLocalizedExam } from "@/lib/i18n/localize";
import { formatDate, formatApplicationFee } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { generateVerifiedExamFaqs } from "../utils/generate-exam-faqs";
import {
  trackNotificationClicked,
  trackSyllabusClicked,
} from "@/lib/analytics";
import {
  Building2,
  Calendar,
  Layers,
  MapPin,
  Clock,
  ExternalLink,
  ShieldCheck,
  GraduationCap,
  BookOpen,
  FileText,
  ChevronRight,
  Globe,
  FileCheck2,
  CreditCard,
  HelpCircle,
  FileSearch,
  ListOrdered,
  Award,
} from "lucide-react";

interface ExamDetailViewProps {
  exam: GovExamDetailed;
  relatedExams?: GovExamDetailed[];
}

export function ExamDetailView({ exam: rawExam }: ExamDetailViewProps) {
  const { language, t } = useLanguage();
  const exam = resolveLocalizedExam(rawExam, language);

  const org = exam.organization;
  const dept = exam.department;
  const stages = exam.stages || [];
  const schedules = exam.schedules || [];
  const eligibility = exam.eligibility;
  const dates = exam.important_dates || [];
  const documents = exam.official_documents || [];
  const relatedJob = exam.related_job;

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
        return "Offline OMR Sheet Based";
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
      ? `Minimum ${eligibility.min_age} Years, Maximum ${eligibility.max_age} Years`
      : eligibility?.max_age
      ? `Maximum ${eligibility.max_age} Years`
      : eligibility?.min_age
      ? `Minimum ${eligibility.min_age} Years`
      : null;

  const applicationFee = formatApplicationFee(exam.application_fee_details);
  const verifiedFaqs = React.useMemo(() => generateVerifiedExamFaqs(exam, language), [exam, language]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 font-sans text-slate-800">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center flex-wrap gap-1.5 text-xs sm:text-[13px] text-slate-500 font-medium">
        <Link href="/" className="hover:text-[#013089] transition-colors">
          {t("nav.home")}
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-slate-400 shrink-0" />
        <Link href="/exams" className="hover:text-[#013089] transition-colors">
          {t("nav.exams")}
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-slate-400 shrink-0" />
        {exam.state_code ? (
          <>
            <Link
              href={`/state/${exam.state_code.toLowerCase()}`}
              className="hover:text-[#013089] transition-colors uppercase"
            >
              {exam.state?.name || exam.state_code}
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          </>
        ) : (
          <>
            <span className="text-slate-600">National Commission</span>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          </>
        )}
        <span className="font-semibold text-slate-900 truncate max-w-[240px] sm:max-w-md">
          {org?.acronym || org?.name || "Exam Notice"}
        </span>
      </nav>

      {/* 1. HERO & ACTION STRIP */}
      <header className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
        {/* Authority & Scope Tags */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-[#013089]/10 text-[#013089] border border-[#013089]/20">
              <Building2 className="h-3.5 w-3.5" />
              <span>{org?.acronym || org?.name || "Examination Body"}</span>
            </span>

            {exam.state_code ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                <MapPin className="h-3.5 w-3.5 text-slate-500" />
                <span>{exam.state?.name || exam.state_code}</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                <Globe className="h-3.5 w-3.5 text-slate-500" />
                <span>All India (National Exam)</span>
              </span>
            )}

            <span className="px-3 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200 capitalize">
              {exam.frequency ? `${exam.frequency.replace("_", " ")} Frequency` : "Annual Calendar"}
            </span>
          </div>

          {/* Status Badge */}
          {exam.status === "concluded" ? (
            <Badge variant="secondary" className="font-semibold text-xs px-3 py-1">
              Examination Concluded
            </Badge>
          ) : isClosingSoon ? (
            <Badge variant="warning" className="font-semibold text-xs px-3 py-1 animate-pulse">
              <Clock className="h-3.5 w-3.5 mr-1" />
              Closing Soon
            </Badge>
          ) : (
            <Badge variant="success" className="font-semibold text-xs px-3 py-1">
              Active Examination
            </Badge>
          )}
        </div>

        {/* Title & Reference */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight sm:leading-snug font-heading">
            {exam.title}
          </h1>

          {exam.exam_code && (
            <p className="text-xs sm:text-sm text-slate-500 font-mono">
              Official Exam Code: <span className="font-semibold text-slate-800">{exam.exam_code}</span>
            </p>
          )}
        </div>

        {/* Key Examination Highlights Ledger (Clean Structured Grid) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
            <div className="text-xs font-medium text-slate-500 flex items-center gap-1.5 mb-1">
              <Calendar className="h-4 w-4 text-rose-600" />
              <span>Exam Date</span>
            </div>
            <div className="text-[15px] sm:text-base font-bold text-slate-900 truncate">
              {examDate?.event_date ? formatDate(examDate.event_date) : "To Be Announced"}
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
            <div className="text-xs font-medium text-slate-500 flex items-center gap-1.5 mb-1">
              <Clock className="h-4 w-4 text-[#013089]" />
              <span>Exam Mode</span>
            </div>
            <div className="text-[14px] sm:text-[15px] font-bold text-slate-900 truncate" title={formatMode(exam.mode)}>
              {formatMode(exam.mode)}
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
            <div className="text-xs font-medium text-slate-500 flex items-center gap-1.5 mb-1">
              <GraduationCap className="h-4 w-4 text-blue-600" />
              <span>Eligibility</span>
            </div>
            <div className="text-[14px] sm:text-[15px] font-bold text-slate-900 truncate" title={educationalQualification || "Refer Notification"}>
              {educationalQualification || "Refer Notification"}
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
            <div className="text-xs font-medium text-slate-500 flex items-center gap-1.5 mb-1">
              <Award className="h-4 w-4 text-emerald-700" />
              <span>Selection Stages</span>
            </div>
            <div className="text-lg sm:text-xl font-bold text-slate-900">
              {stages.length > 0 ? `${stages.length} Stages` : "Single Stage"}
            </div>
          </div>
        </div>

        {/* Primary Action Gateways */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Link
            href={`/syllabus/${exam.slug || exam.id}`}
            onClick={() => trackSyllabusClicked(exam.title, org?.name || "Govt")}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm sm:text-[15px] text-white bg-[#013089] hover:bg-[#01276E] shadow-sm transition-all"
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

      {/* 2. UNIFIED EXAMINATION SPECIFICATION BODY */}
      <main className="rounded-2xl border border-slate-200 bg-white shadow-xs divide-y divide-slate-200 overflow-hidden">
        {/* SECTION 1: EXAMINATION OVERVIEW TABLE */}
        <section className="p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2.5">
            <FileCheck2 className="h-5 w-5 text-[#013089]" />
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              1. Examination Overview
            </h2>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-[14px] sm:text-[15px] text-slate-800 border-collapse">
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50/50">
                  <th scope="row" className="py-3 px-4 sm:px-5 font-semibold text-slate-600 w-1/3 bg-slate-50/70 text-left">
                    Conducting Body / Commission
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
                    Official Exam Name
                  </th>
                  <td className="py-3 px-4 sm:px-5 font-semibold text-slate-900">
                    {exam.title}
                  </td>
                </tr>
                {exam.exam_code && (
                  <tr className="hover:bg-slate-50/50">
                    <th scope="row" className="py-3 px-4 sm:px-5 font-semibold text-slate-600 bg-slate-50/70 text-left">
                      Examination Reference Code
                    </th>
                    <td className="py-3 px-4 sm:px-5 font-mono font-medium text-slate-800">
                      {exam.exam_code}
                    </td>
                  </tr>
                )}
                <tr className="hover:bg-slate-50/50">
                  <th scope="row" className="py-3 px-4 sm:px-5 font-semibold text-slate-600 bg-slate-50/70 text-left">
                    Examination Delivery Mode
                  </th>
                  <td className="py-3 px-4 sm:px-5 text-slate-900 font-medium">
                    {formatMode(exam.mode)}
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <th scope="row" className="py-3 px-4 sm:px-5 font-semibold text-slate-600 bg-slate-50/70 text-left">
                    Examination Frequency
                  </th>
                  <td className="py-3 px-4 sm:px-5 text-slate-900 capitalize">
                    {exam.frequency?.replace("_", " ") || "Annual"}
                  </td>
                </tr>
                {relatedJob && (
                  <tr className="hover:bg-slate-50/50">
                    <th scope="row" className="py-3 px-4 sm:px-5 font-semibold text-slate-600 bg-slate-50/70 text-left">
                      Linked Recruitment Notice
                    </th>
                    <td className="py-3 px-4 sm:px-5">
                      <Link
                        href={`/jobs/${relatedJob.slug}`}
                        className="font-bold text-[#013089] hover:underline inline-flex items-center gap-1.5"
                      >
                        <span>{relatedJob.title}</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Link>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* SECTION 2: IMPORTANT DATES & EXAMINATION CALENDAR */}
        {dates.length > 0 && (
          <section className="p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2.5">
              <Calendar className="h-5 w-5 text-[#013089]" />
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                2. Official Examination Calendar
              </h2>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-[14px] sm:text-[15px] text-slate-800 border-collapse">
                <tbody className="divide-y divide-slate-100">
                  {dates.map((d, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <th scope="row" className="py-3 px-4 sm:px-5 font-semibold text-slate-600 w-1/2 bg-slate-50/70 text-left flex items-center gap-2">
                        <span>{d.title}</span>
                        {d.is_tentative && (
                          <span className="text-[11px] text-amber-800 font-bold bg-amber-100/80 px-2 py-0.5 rounded">
                            Tentative
                          </span>
                        )}
                      </th>
                      <td className="py-3 px-4 sm:px-5 font-mono font-medium text-slate-900">
                        {d.event_date ? formatDate(d.event_date) : "To Be Announced"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* SECTION 3: EXAM STAGES & TIMELINE */}
        {stages.length > 0 && (
          <section className="p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2.5">
              <ListOrdered className="h-5 w-5 text-[#013089]" />
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                3. Examination Stages &amp; Progression
              </h2>
            </div>

            <div className="space-y-3.5">
              {stages.map((st, idx) => (
                <div key={idx} className="p-5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#013089] text-white font-bold text-xs">
                        {st.stage_order || idx + 1}
                      </span>
                      <span className="font-bold text-slate-900 text-base sm:text-lg">{st.stage_name}</span>
                    </div>
                    <Badge variant="outline" className="text-xs uppercase font-mono px-2.5 py-0.5">
                      {st.stage_type.replace("_", " ")}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs sm:text-[13px] text-slate-600 pt-1">
                    <div>
                      <span className="block text-slate-400 text-xs">Mode:</span>
                      <span className="font-semibold text-slate-900">{st.mode || formatMode(exam.mode)}</span>
                    </div>
                    <div>
                      <span className="block text-slate-400 text-xs">Duration:</span>
                      <span className="font-semibold text-slate-900">{st.duration_minutes ? `${st.duration_minutes} Mins` : "As per circular"}</span>
                    </div>
                    <div>
                      <span className="block text-slate-400 text-xs">Total Marks:</span>
                      <span className="font-semibold text-slate-900">{st.total_marks ? `${st.total_marks} Marks` : "As per circular"}</span>
                    </div>
                    <div>
                      <span className="block text-slate-400 text-xs">Qualifying Cutoff:</span>
                      <span className="font-semibold text-slate-900">{st.qualifying_marks ? `${st.qualifying_marks}%` : "Category Standard"}</span>
                    </div>
                  </div>

                  {st.description && (
                    <p className="text-[14px] sm:text-[15px] text-slate-700 pt-2 leading-relaxed border-t border-slate-200">
                      {st.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SECTION 4: EXAM PATTERN & MARKING SCHEME */}
        {(exam.marking_scheme || exam.pattern_description) && (
          <section className="p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2.5">
              <FileSearch className="h-5 w-5 text-[#013089]" />
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                4. Exam Pattern &amp; Marking Scheme
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {exam.pattern_description && (
                <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-600">Question Paper Structure</div>
                  <p className="text-[14px] sm:text-[15px] text-slate-900 leading-relaxed font-medium">
                    {exam.pattern_description}
                  </p>
                </div>
              )}

              {exam.marking_scheme && (
                <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-600">Marking &amp; Negative Marking</div>
                  <p className="text-[14px] sm:text-[15px] text-slate-900 leading-relaxed font-medium">
                    {exam.marking_scheme}
                  </p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* SECTION 5: SUBJECT-WISE SYLLABUS HIGHLIGHT */}
        <section className="p-6 sm:p-8 space-y-4 bg-blue-50/30">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <BookOpen className="h-5 w-5 text-[#013089]" />
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                5. Syllabus &amp; Curriculum Breakdown
              </h2>
            </div>
            <Link
              href={`/syllabus/${exam.slug || exam.id}`}
              onClick={() => trackSyllabusClicked(exam.title, org?.name || "Govt")}
              className="text-xs sm:text-sm font-bold text-[#013089] hover:underline inline-flex items-center gap-1"
            >
              <span>Open Dedicated Syllabus Page</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <p className="text-[14px] sm:text-[15px] text-slate-800 leading-relaxed">
            {exam.syllabus_summary ||
              `The official curriculum includes General Studies, Quantitative Aptitude, Reasoning Ability, English/Hindi Comprehension, and Subject-Specific domains prescribed by ${org?.name}.`}
          </p>
        </section>

        {/* SECTION 6: ELIGIBILITY CRITERIA & AGE LIMITS */}
        {(educationalQualification || ageLimits || eligibility?.attempts_limit || eligibility?.physical_standards) && (
          <section className="p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2.5">
              <GraduationCap className="h-5 w-5 text-[#013089]" />
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                6. Eligibility Criteria &amp; Age Limits
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {educationalQualification && (
                <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-600">Educational Qualification</div>
                  <p className="text-[15px] sm:text-base text-slate-900 leading-relaxed font-semibold">
                    {educationalQualification}
                  </p>
                </div>
              )}

              {ageLimits && (
                <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-600">Prescribed Age Limits</div>
                  <p className="text-[15px] sm:text-base text-slate-900 leading-relaxed font-semibold">
                    {ageLimits}
                  </p>
                </div>
              )}

              {eligibility?.attempts_limit && (
                <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-600">Allowed Attempts Limit</div>
                  <p className="text-[14px] sm:text-[15px] text-slate-900 leading-relaxed">
                    Maximum {eligibility.attempts_limit} attempts for General candidates (relaxations as per reservation norms).
                  </p>
                </div>
              )}

              {eligibility?.physical_standards && (
                <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-600">Physical Standards &amp; Fitness</div>
                  <p className="text-[14px] sm:text-[15px] text-slate-900 leading-relaxed">
                    {eligibility.physical_standards}
                  </p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* SECTION 7: APPLICATION & EXAM FEE */}
        {applicationFee && (
          <section className="p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2.5">
              <CreditCard className="h-5 w-5 text-[#013089]" />
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                7. Examination Fee Structure
              </h2>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
              <div className="text-[15px] sm:text-base font-semibold text-slate-900 leading-relaxed">
                {applicationFee}
              </div>
              <div className="text-xs sm:text-sm text-slate-600 pt-3 border-t border-slate-200/80">
                <span className="font-semibold text-slate-800">Fee Payment Channels: </span>
                <span>Online Net Banking, UPI, Credit Card, Debit Card or Bank Challan.</span>
              </div>
            </div>
          </section>
        )}

        {/* SECTION 8: SHIFTS & SCHEDULES */}
        {schedules.length > 0 && (
          <section className="p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2.5">
              <Clock className="h-5 w-5 text-[#013089]" />
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                8. Examination Shifts &amp; Reporting Timings
              </h2>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-[14px] sm:text-[15px] text-slate-800 border-collapse">
                <thead className="bg-slate-100 text-slate-900 font-bold">
                  <tr>
                    <th className="py-3 px-4 sm:px-5 text-left">Paper / Subject</th>
                    <th className="py-3 px-4 sm:px-5 text-left">Exam Date</th>
                    <th className="py-3 px-4 sm:px-5 text-left">Shift</th>
                    <th className="py-3 px-4 sm:px-5 text-left">Reporting Time</th>
                    <th className="py-3 px-4 sm:px-5 text-left">Exam Timing</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {schedules.map((sc, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="py-3 px-4 sm:px-5 font-semibold text-slate-900">{sc.paper_name}</td>
                      <td className="py-3 px-4 sm:px-5 font-mono">{formatDate(sc.exam_date)}</td>
                      <td className="py-3 px-4 sm:px-5">{sc.shift_name || "General"}</td>
                      <td className="py-3 px-4 sm:px-5 font-mono text-rose-700 font-bold">{sc.reporting_time || "1 Hour Prior"}</td>
                      <td className="py-3 px-4 sm:px-5 font-mono">{sc.start_time && sc.end_time ? `${sc.start_time} - ${sc.end_time}` : "As on Admit Card"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* SECTION 9: OFFICIAL LINKS */}
        <section className="p-6 sm:p-8 space-y-4 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <FileCheck2 className="h-5 w-5 text-[#013089]" />
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              9. Important Official Links &amp; Gateways
            </h2>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-[14px] sm:text-[15px] text-slate-800 border-collapse">
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50/80">
                  <td className="py-3.5 px-4 sm:px-5 font-bold text-slate-900 w-1/3">
                    Complete Exam Syllabus
                  </td>
                  <td className="py-3.5 px-4 sm:px-5">
                    <Link
                      href={`/syllabus/${exam.slug || exam.id}`}
                      onClick={() => trackSyllabusClicked(exam.title, org?.name || "Govt")}
                      className="inline-flex items-center gap-2 font-bold text-white bg-[#013089] hover:bg-[#01276E] px-4 py-2 rounded-lg shadow-xs transition-colors text-xs sm:text-sm"
                    >
                      <span>View Detailed Syllabus</span>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </td>
                </tr>

                {exam.official_notification_url && (
                  <tr className="hover:bg-slate-50/80">
                    <td className="py-3.5 px-4 sm:px-5 font-bold text-slate-900">
                      Official Exam Notification PDF
                    </td>
                    <td className="py-3.5 px-4 sm:px-5">
                      <a
                        href={exam.official_notification_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackNotificationClicked(exam.title, org?.name || "Govt", exam.official_notification_url!)}
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
                      Official Examination Portal
                    </td>
                    <td className="py-3.5 px-4 sm:px-5">
                      <a
                        href={org.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-700 hover:text-[#013089] hover:underline"
                      >
                        <Building2 className="h-4 w-4 text-slate-500" />
                        <span>{org.name} Official Website</span>
                        <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                      </a>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Attached Circular Documents if present */}
          {documents.length > 0 && (
            <div className="pt-3 space-y-2.5">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Official Examination Circulars &amp; Annexures
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

        {/* SECTION 10: VERIFIED EXAMINATION FAQS */}
        {verifiedFaqs.length > 0 && (
          <section className="p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2.5">
              <HelpCircle className="h-5 w-5 text-[#013089]" />
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                10. Frequently Asked Questions
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

      {/* FOOTER: OFFICIAL PROVENANCE */}
      <footer className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-xs sm:text-[13px] text-slate-600 flex items-start gap-3.5">
        <ShieldCheck className="h-5 w-5 text-emerald-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-bold text-slate-900">Official Government Provenance &amp; Verification</div>
          <p className="leading-relaxed">
            This examination schedule is published directly from the official gazette notices of <strong>{org?.name}</strong>.
            Candidates are advised to consult the official commission website for real-time exam center allotments, admit card releases, and official updates.
          </p>
        </div>
      </footer>
    </div>
  );
}
