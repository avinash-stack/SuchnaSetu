"use client";

import * as React from "react";
import Link from "next/link";
import { GovExamDetailed } from "../types";
import { useLanguage } from "@/lib/i18n/context";
import { resolveLocalizedExam } from "@/lib/i18n/localize";
import { formatDate, formatApplicationFee } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
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
  ArrowRight,
  Bell,
  CheckCircle2,
  FileSpreadsheet,
  MapPinCheck,
  Sparkles,
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
  const centers = exam.centers || [];
  const documents = exam.official_documents || [];
  const relatedJob = exam.related_job;
  const relatedExams = exam.related_exams || [];
  const relatedJobs = exam.related_jobs || [];
  const relatedBulletins = exam.related_bulletins || [];
  const relatedNews = exam.related_news || [];

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

  // Aggregate verified source-backed updates and notices
  const examUpdates = React.useMemo(() => {
    const list: Array<{ date: string | null; title: string; type: string; url?: string | null }> = [];

    // 1. Documents
    documents.forEach((doc) => {
      let docLabel = "Official Notice";
      if (doc.document_type === "timetable") docLabel = "Exam Timetable";
      else if (doc.document_type === "syllabus") docLabel = "Syllabus Notice";
      else if (doc.document_type === "circular") docLabel = "Official Circular";
      else if (doc.document_type === "instructions") docLabel = "Exam Instructions";
      else if (doc.document_type === "press_release") docLabel = "Press Release";
      else if (doc.document_type === "gazette") docLabel = "Gazette Notification";

      list.push({
        date: doc.published_date || exam.published_at,
        title: doc.title,
        type: docLabel,
        url: doc.file_url,
      });
    });

    // 2. Linked bulletins
    relatedBulletins.forEach((b) => {
      list.push({
        date: b.published_at,
        title: b.title,
        type: "Exam Advisory",
        url: b.source_url || `/news/${b.slug}`,
      });
    });

    // 3. Fallback to notification release
    if (list.length === 0 && exam.published_at) {
      list.push({
        date: exam.published_at,
        title: `Official Examination Notification (${exam.exam_code || "Schedule"}) Released`,
        type: "Notification Release",
        url: exam.official_notification_url,
      });
    }

    return list;
  }, [documents, relatedBulletins, exam.published_at, exam.exam_code, exam.official_notification_url]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 font-sans text-slate-800">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center flex-wrap gap-1.5 text-xs sm:text-[13px] text-slate-500 font-medium" aria-label="Breadcrumb">
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

        {/* Key Examination Highlights Ledger */}
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
              <span>Eligibility Criteria</span>
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
                    Official Examination Name
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
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </td>
                  </tr>
                )}
                <tr className="hover:bg-slate-50/50">
                  <th scope="row" className="py-3 px-4 sm:px-5 font-semibold text-slate-600 bg-slate-50/70 text-left">
                    Jurisdiction
                  </th>
                  <td className="py-3 px-4 sm:px-5 text-slate-900">
                    {exam.state?.name ? `${exam.state.name} State` : "All India (National Level Examination)"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* SECTION 2: IMPORTANT EXAMINATION DATES */}
        <section className="p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2.5">
            <Calendar className="h-5 w-5 text-[#013089]" />
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              2. Important Examination Dates
            </h2>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-[14px] sm:text-[15px] text-slate-800 border-collapse">
              <tbody className="divide-y divide-slate-100">
                {dates.length > 0 ? (
                  dates.map((d, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <th scope="row" className="py-3 px-4 sm:px-5 font-semibold text-slate-600 w-1/2 bg-slate-50/70 text-left flex items-center gap-2">
                        <span>{d.title}</span>
                        {d.is_tentative && (
                          <span className="text-[11px] text-amber-800 font-bold bg-amber-100/80 px-2 py-0.5 rounded">
                            Tentative
                          </span>
                        )}
                      </th>
                      <td className="py-3 px-4 sm:px-5 font-mono text-slate-900">
                        {d.event_date ? formatDate(d.event_date) : "To Be Announced"}
                        {d.event_time && <span className="text-xs text-slate-500 ml-2">({d.event_time})</span>}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="hover:bg-slate-50/50">
                    <th scope="row" className="py-3 px-4 sm:px-5 font-semibold text-slate-600 w-1/2 bg-slate-50/70 text-left">
                      Examination Notification &amp; Schedule
                    </th>
                    <td className="py-3 px-4 sm:px-5 font-mono text-slate-900">
                      {exam.published_at ? formatDate(exam.published_at) : "Refer Notification"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* SECTION 3: LATEST EXAM UPDATES & NOTICES */}
        {examUpdates.length > 0 && (
          <section className="p-6 sm:p-8 space-y-4 bg-blue-50/20">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2.5">
                <Bell className="h-5 w-5 text-[#013089]" />
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  3. Latest Examination Updates &amp; Notices
                </h2>
              </div>
              <Badge variant="brand" className="text-xs font-semibold px-2.5 py-0.5">
                Official Commission Updates
              </Badge>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
              <table className="w-full text-[14px] sm:text-[15px] text-slate-800 border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-600">
                  <tr>
                    <th className="py-3 px-4 sm:px-5 text-left w-36 sm:w-44">Date</th>
                    <th className="py-3 px-4 sm:px-5 text-left">Update / Announcement</th>
                    <th className="py-3 px-4 sm:px-5 text-right w-36">Source Document</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {examUpdates.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/70">
                      <td className="py-3 px-4 sm:px-5 font-mono text-xs sm:text-sm text-slate-600">
                        {item.date ? formatDate(item.date) : "Recent"}
                      </td>
                      <td className="py-3 px-4 sm:px-5">
                        <div className="font-semibold text-slate-900">{item.title}</div>
                        <div className="text-xs text-slate-500 capitalize">{item.type}</div>
                      </td>
                      <td className="py-3 px-4 sm:px-5 text-right">
                        {item.url ? (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-bold text-[#013089] hover:underline bg-[#013089]/10 px-2.5 py-1.5 rounded-md"
                          >
                            <span>View Document</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : (
                          <span className="text-xs text-slate-400">Official Notice</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* SECTION 4: EXAM STAGES, PATTERN & MARKING SCHEME */}
        <section className="p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <ListOrdered className="h-5 w-5 text-[#013089]" />
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                4. Examination Stages &amp; Marking Pattern
              </h2>
            </div>
            <Link
              href={`/syllabus/${exam.slug || exam.id}`}
              className="text-xs sm:text-sm font-bold text-[#013089] hover:underline inline-flex items-center gap-1"
            >
              <span>View Full Syllabus &amp; Subject Topics</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {stages.length > 0 ? (
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <Table>
                <TableHeader className="bg-slate-100/90">
                  <TableRow>
                    <TableHead className="font-bold text-slate-900 text-xs sm:text-sm py-3.5">Stage Order</TableHead>
                    <TableHead className="font-bold text-slate-900 text-xs sm:text-sm py-3.5">Stage Name</TableHead>
                    <TableHead className="font-bold text-slate-900 text-xs sm:text-sm text-center py-3.5">Mode</TableHead>
                    <TableHead className="font-bold text-slate-900 text-xs sm:text-sm text-center py-3.5">Duration</TableHead>
                    <TableHead className="font-bold text-slate-900 text-xs sm:text-sm text-center py-3.5">Total Marks</TableHead>
                    <TableHead className="font-bold text-slate-900 text-xs sm:text-sm text-center py-3.5">Qualifying Marks</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="text-[14px] sm:text-[15px] divide-y divide-slate-100">
                  {stages.map((s, idx) => (
                    <TableRow key={idx} className="hover:bg-slate-50/80">
                      <TableCell className="font-bold text-[#013089] py-3">Stage {s.stage_order || idx + 1}</TableCell>
                      <TableCell className="font-semibold text-slate-900 py-3">{s.stage_name}</TableCell>
                      <TableCell className="text-center text-slate-700 capitalize py-3">{s.mode || formatMode(exam.mode)}</TableCell>
                      <TableCell className="text-center font-mono text-slate-700 py-3">{s.duration_minutes ? `${s.duration_minutes} Mins` : "As Notified"}</TableCell>
                      <TableCell className="text-center font-bold text-slate-900 py-3">{s.total_marks ?? "—"}</TableCell>
                      <TableCell className="text-center text-slate-700 py-3">{s.qualifying_marks ?? "As Per Cutoff"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
              <p className="text-[14px] sm:text-[15px] text-slate-800 leading-relaxed">
                {exam.pattern_description || "The examination is conducted as per the official scheme of examination and syllabus specified in the commission notification."}
              </p>
              {exam.marking_scheme && (
                <div className="pt-2 text-xs sm:text-sm text-slate-600">
                  <span className="font-bold text-slate-800">Marking Scheme: </span>
                  <span>{exam.marking_scheme}</span>
                </div>
              )}
            </div>
          )}
        </section>

        {/* SECTION 5: DETAILED EXAM SCHEDULES & PAPERS */}
        {schedules.length > 0 && (
          <section className="p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2.5">
              <Clock className="h-5 w-5 text-[#013089]" />
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                5. Paper Schedule &amp; Shift Timings
              </h2>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <Table>
                <TableHeader className="bg-slate-100/90">
                  <TableRow>
                    <TableHead className="font-bold text-slate-900 text-xs sm:text-sm py-3.5">Paper / Subject</TableHead>
                    <TableHead className="font-bold text-slate-900 text-xs sm:text-sm py-3.5">Exam Date</TableHead>
                    <TableHead className="font-bold text-slate-900 text-xs sm:text-sm text-center py-3.5">Shift</TableHead>
                    <TableHead className="font-bold text-slate-900 text-xs sm:text-sm text-center py-3.5">Reporting Time</TableHead>
                    <TableHead className="font-bold text-slate-900 text-xs sm:text-sm text-center py-3.5">Exam Timing</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="text-[14px] sm:text-[15px] divide-y divide-slate-100">
                  {schedules.map((sch, idx) => (
                    <TableRow key={idx} className="hover:bg-slate-50/80">
                      <TableCell className="font-semibold text-slate-900 py-3">{sch.paper_name}</TableCell>
                      <TableCell className="font-mono text-slate-800 py-3">{formatDate(sch.exam_date)}</TableCell>
                      <TableCell className="text-center text-slate-700 py-3">{sch.shift_name || "Single Shift"}</TableCell>
                      <TableCell className="text-center font-mono text-slate-700 py-3">{sch.reporting_time || "—"}</TableCell>
                      <TableCell className="text-center font-mono font-semibold text-slate-900 py-3">
                        {sch.start_time && sch.end_time ? `${sch.start_time} - ${sch.end_time}` : sch.start_time || "As on Admit Card"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </section>
        )}

        {/* SECTION 6: ELIGIBILITY & AGE LIMIT */}
        {(educationalQualification || ageLimits || eligibility?.nationality_criteria || eligibility?.physical_standards) && (
          <section className="p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2.5">
              <GraduationCap className="h-5 w-5 text-[#013089]" />
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                6. Eligibility Criteria &amp; Age Limit
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
                    <span>Age Limit</span>
                  </div>
                  <p className="text-[15px] sm:text-base text-slate-900 leading-relaxed font-semibold">
                    {ageLimits}
                  </p>
                  {eligibility?.age_relaxation_rules && (
                    <p className="text-xs text-slate-600 pt-1">
                      {eligibility.age_relaxation_rules}
                    </p>
                  )}
                </div>
              )}

              {eligibility?.nationality_criteria && (
                <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                    <Globe className="h-4 w-4 text-[#013089]" />
                    <span>Nationality Criteria</span>
                  </div>
                  <p className="text-[14px] sm:text-[15px] text-slate-900 leading-relaxed">
                    {eligibility.nationality_criteria}
                  </p>
                </div>
              )}

              {eligibility?.physical_standards && (
                <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-emerald-700" />
                    <span>Physical Standards / Measurement</span>
                  </div>
                  <p className="text-[14px] sm:text-[15px] text-slate-900 leading-relaxed">
                    {eligibility.physical_standards}
                  </p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* SECTION 7: APPLICATION FEE DETAILS */}
        {applicationFee && (
          <section className="p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2.5">
              <CreditCard className="h-5 w-5 text-[#013089]" />
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                7. Application Fee &amp; Payment Details
              </h2>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
              <div className="text-[15px] sm:text-base font-semibold text-slate-900 leading-relaxed">
                {applicationFee}
              </div>
              <div className="text-xs sm:text-sm text-slate-600 pt-3 border-t border-slate-200/80">
                <span className="font-semibold text-slate-800">Accepted Payment Modes: </span>
                <span>Net Banking, Debit Card, Credit Card, UPI, or State Bank of India Challan as authorized by the commission.</span>
              </div>
            </div>
          </section>
        )}

        {/* SECTION 8: IMPORTANT OFFICIAL LINKS HUB */}
        <section className="p-6 sm:p-8 space-y-4 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <FileCheck2 className="h-5 w-5 text-[#013089]" />
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              8. Important Official Examination Links
            </h2>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-[14px] sm:text-[15px] text-slate-800 border-collapse">
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50/80">
                  <td className="py-3.5 px-4 sm:px-5 font-bold text-slate-900 w-1/3">
                    Exam Syllabus &amp; Subject Topics
                  </td>
                  <td className="py-3.5 px-4 sm:px-5">
                    <Link
                      href={`/syllabus/${exam.slug || exam.id}`}
                      className="inline-flex items-center gap-2 font-bold text-white bg-[#013089] hover:bg-[#01276E] px-4 py-2 rounded-lg shadow-xs transition-colors text-xs sm:text-sm"
                    >
                      <BookOpen className="h-4 w-4" />
                      <span>View Complete Syllabus</span>
                    </Link>
                  </td>
                </tr>

                {exam.official_notification_url && (
                  <tr className="hover:bg-slate-50/80">
                    <td className="py-3.5 px-4 sm:px-5 font-bold text-slate-900">
                      Official Notification PDF
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
                        <span>Download Notification PDF</span>
                        <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                      </a>
                    </td>
                  </tr>
                )}

                {org?.website_url && (
                  <tr className="hover:bg-slate-50/80">
                    <td className="py-3.5 px-4 sm:px-5 font-bold text-slate-900">
                      Official Commission Portal
                    </td>
                    <td className="py-3.5 px-4 sm:px-5">
                      <a
                        href={org.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-700 hover:text-[#013089] hover:underline"
                      >
                        <Building2 className="h-4 w-4 text-slate-500" />
                        <span>{org.name} Portal</span>
                        <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                      </a>
                    </td>
                  </tr>
                )}

                {/* Direct Cross-Module Gateways */}
                <tr className="hover:bg-slate-50/80">
                  <td className="py-3.5 px-4 sm:px-5 font-bold text-slate-900">
                    Admit Card / Hall Ticket
                  </td>
                  <td className="py-3.5 px-4 sm:px-5">
                    <Link
                      href="/admit-cards"
                      className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#013089] hover:underline"
                    >
                      <Layers className="h-4 w-4 text-slate-500" />
                      <span>Check Admit Card Status</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </td>
                </tr>

                <tr className="hover:bg-slate-50/80">
                  <td className="py-3.5 px-4 sm:px-5 font-bold text-slate-900">
                    Answer Key &amp; Objections
                  </td>
                  <td className="py-3.5 px-4 sm:px-5">
                    <Link
                      href="/answer-keys"
                      className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#013089] hover:underline"
                    >
                      <FileSpreadsheet className="h-4 w-4 text-slate-500" />
                      <span>Check Official Answer Key</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </td>
                </tr>

                <tr className="hover:bg-slate-50/80">
                  <td className="py-3.5 px-4 sm:px-5 font-bold text-slate-900">
                    Examination Results &amp; Cutoff
                  </td>
                  <td className="py-3.5 px-4 sm:px-5">
                    <Link
                      href="/results"
                      className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#013089] hover:underline"
                    >
                      <Award className="h-4 w-4 text-slate-500" />
                      <span>Check Exam Results</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* SECTION 9: CONTEXTUAL RELATED EXAMS, RECRUITMENTS & NEWS */}
        {(relatedExams.length > 0 || relatedJobs.length > 0 || relatedNews.length > 0) && (
          <section className="p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-2.5">
              <Layers className="h-5 w-5 text-[#013089]" />
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                9. Related Examinations, Jobs &amp; Updates
              </h2>
            </div>

            {/* Related News & Circulars */}
            {relatedNews.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#013089] flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-[#FE8D01]" />
                  <span>Latest News &amp; Advisories for this Examination</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {relatedNews.map((rn: any, idx: number) => (
                    <Link
                      key={idx}
                      href={`/news/${rn.slug}`}
                      className="p-3.5 rounded-xl border border-slate-200 bg-blue-50/30 hover:bg-white hover:border-[#013089] hover:shadow-xs transition-all group flex flex-col justify-between"
                    >
                      <div className="space-y-1">
                        <div className="text-[11px] font-bold text-[#013089] uppercase tracking-wider">
                          {rn.category_slug || "Exam Notice"}
                        </div>
                        <h4 className="text-xs sm:text-[13px] font-bold text-slate-900 group-hover:text-[#013089] line-clamp-2 leading-snug">
                          {rn.title}
                        </h4>
                      </div>
                      <div className="pt-2 mt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                        <span>{formatDate(rn.published_at)}</span>
                        <span className="font-bold text-[#013089] flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                          Read <ArrowRight className="h-3 w-3" />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {relatedExams.length > 0 && (
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  More Examinations by {org?.name || "this Authority"}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {relatedExams.map((re, idx) => (
                    <Link
                      key={idx}
                      href={`/exams/${re.slug}`}
                      className="p-4 rounded-xl border border-slate-200 bg-white hover:border-[#013089] hover:shadow-xs transition-all group"
                    >
                      <div className="text-[14px] sm:text-[15px] font-bold text-slate-900 group-hover:text-[#013089] line-clamp-2">
                        {re.title}
                      </div>
                      <div className="flex items-center justify-between text-xs text-slate-500 pt-2 mt-2 border-t border-slate-100">
                        <span className="capitalize">{re.mode ? re.mode.replace("_", " ") : "Exam Schedule"}</span>
                        <span className="font-semibold text-[#013089] group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                          View Exam <ArrowRight className="h-3 w-3" />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {relatedJobs.length > 0 && (
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Related Government Job Notices
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {relatedJobs.map((rj, idx) => (
                    <Link
                      key={idx}
                      href={`/jobs/${rj.slug}`}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:border-[#013089] hover:bg-white transition-all group"
                    >
                      <div className="text-[14px] sm:text-[15px] font-bold text-slate-900 group-hover:text-[#013089] line-clamp-2">
                        {rj.title}
                      </div>
                      <div className="flex items-center justify-between text-xs text-slate-500 pt-2 mt-2 border-t border-slate-200/60">
                        <span>{rj.total_vacancies ? `${rj.total_vacancies} Posts` : "Govt Post"}</span>
                        <span className="font-semibold text-[#013089] flex items-center gap-1">
                          Apply Details <ArrowRight className="h-3 w-3" />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

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

      {/* FOOTER: OFFICIAL PROVENANCE & TRANSPARENCY */}
      <footer className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-xs sm:text-[13px] text-slate-600 flex items-start gap-3.5">
        <ShieldCheck className="h-5 w-5 text-emerald-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-bold text-slate-900">Official Examination Provenance &amp; Verification</div>
          <p className="leading-relaxed">
            This examination schedule is published directly from the official gazette of <strong>{org?.name}</strong>.
            Candidates are strongly advised to regularly verify updates on the commission portal.
            SuchnaSetu provides verified public notifications free of cost for citizen convenience.
          </p>
        </div>
      </footer>
    </div>
  );
}
