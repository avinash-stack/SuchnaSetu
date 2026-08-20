"use client";

import * as React from "react";
import Link from "next/link";
import { GovExamDetailed } from "../types";
import { useLanguage } from "@/lib/i18n/context";
import { resolveLocalizedExam } from "@/lib/i18n/localize";
import { getLocalizedDateLabel } from "@/lib/i18n/config";
import { ExamTimeline } from "@/modules/exams/components/exam-timeline";
import { formatDate, isPdfUrl } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { InlinePdfViewer } from "@/modules/jobs/components/inline-pdf-viewer";
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
  X,
} from "lucide-react";

interface ExamDetailViewProps {
  exam: GovExamDetailed;
  relatedExams?: GovExamDetailed[];
}

export function ExamDetailView({ exam: rawExam, relatedExams = [] }: ExamDetailViewProps) {
  const { language, t } = useLanguage();
  const exam = resolveLocalizedExam(rawExam, language);
  const [isPdfViewerOpen, setIsPdfViewerOpen] = React.useState(false);
  const [activePdfUrl, setActivePdfUrl] = React.useState<string | null>(
    exam.official_notification_url || null
  );

  const org = exam.organization;
  const dept = exam.department;
  const stages = exam.stages || [];
  const schedules = exam.schedules || [];
  const eligibility = exam.eligibility;
  const dates = exam.important_dates || [];
  const centers = exam.centers || [];
  const documents = exam.official_documents || [];
  const relatedJob = exam.related_job;

  const handleTogglePdf = () => {
    if (!isPdfViewerOpen && (activePdfUrl || exam.official_notification_url)) {
      if (!activePdfUrl && exam.official_notification_url) {
        setActivePdfUrl(exam.official_notification_url);
      }
      setIsPdfViewerOpen(true);
    } else {
      setIsPdfViewerOpen(false);
    }
  };

  const examStartDate = dates.find((d) => d.date_type === "exam_start");
  const examEndDate = dates.find((d) => d.date_type === "exam_end");
  const appStartDate = dates.find((d) => d.date_type === "application_start");
  const appEndDate = dates.find((d) => d.date_type === "application_end");

  const formatMode = (mode: string) => {
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
        return mode;
    }
  };

  const fee = (exam.application_fee_details as any) || {};

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-slate-800 transition-colors">
          {t("nav.home")}
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
        <Link href="/exams" className="hover:text-slate-800 transition-colors">
          {t("nav.exams")}
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
        <span className="font-semibold text-slate-900 truncate max-w-md">
          {exam.short_title || exam.title}
        </span>
      </nav>

      {/* Hero Header Card */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="space-y-4 max-w-3xl">
            {/* Authority & Category Tag */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#013089]/10 px-3 py-1 text-xs font-bold text-[#013089]">
                <Building2 className="h-3.5 w-3.5 text-[#013089]" />
                <span>{org?.name || "Official Commission"}</span>
              </span>

              {exam.category && (
                <span className="inline-flex items-center rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                  {exam.category.name}
                </span>
              )}

              {exam.state && (
                <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                  <MapPin className="h-3.5 w-3.5 text-slate-500" />
                  <span>{exam.state.name}</span>
                </span>
              )}
            </div>

            {/* Localized Title */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight font-heading">
              {exam.title}
            </h1>

            {/* Localized Description */}
            <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
              {exam.description}
            </p>

            {/* Key Information Badges */}
            <div className="flex flex-wrap gap-2 pt-2">
              <Badge variant="outline" className="text-xs">
                Mode: {formatMode(exam.mode)}
              </Badge>
              <Badge variant="outline" className="text-xs">
                Frequency: {exam.frequency}
              </Badge>
              <Badge variant="outline" className="text-xs">
                Total Stages: {stages.length || 1}
              </Badge>
            </div>
          </div>

          {/* Quick Action Side Panel */}
          <div className="flex flex-col gap-3 min-w-[260px] lg:w-72 bg-slate-50 p-5 rounded-xl border border-slate-200">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Application Window</span>
              <div className="text-xs font-semibold text-slate-700">
                {appStartDate ? formatDate(appStartDate.event_date) : "Check Gazette"} - {appEndDate ? formatDate(appEndDate.event_date) : "TBD"}
              </div>
            </div>

            {exam.official_website_url && (
              <a
                href={exam.official_website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full"
              >
                <Button variant="primary" size="md" className="w-full justify-center gap-1.5 font-bold bg-[#013089] hover:bg-[#01276E] text-white">
                  <span>{t("card.apply_online")}</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </Button>
              </a>
            )}

            {exam.official_notification_url && (
              isPdfUrl(exam.official_notification_url) ? (
                <Button
                  variant={isPdfViewerOpen ? "primary" : "outline"}
                  size="md"
                  onClick={handleTogglePdf}
                  className={`w-full justify-center gap-1.5 text-xs font-semibold transition-all ${
                    isPdfViewerOpen
                      ? "bg-slate-800 hover:bg-slate-900 text-white border-slate-700 shadow-xs"
                      : "border-slate-300 hover:border-brand-500 hover:text-brand-700"
                  }`}
                >
                  {isPdfViewerOpen ? (
                    <>
                      <X className="h-3.5 w-3.5" />
                      <span>Hide PDF</span>
                    </>
                  ) : (
                    <>
                      <FileText className="h-3.5 w-3.5 text-brand-600" />
                      <span>{t("card.official_pdf")}</span>
                    </>
                  )}
                </Button>
              ) : (
                <a
                  href={exam.official_notification_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full"
                >
                  <Button
                    variant="outline"
                    size="md"
                    className="w-full justify-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-[#013089] hover:border-brand-500"
                  >
                    <Globe className="h-3.5 w-3.5 text-slate-500" />
                    <span>Official Notification Page</span>
                    <ExternalLink className="h-3 w-3 text-slate-400 ml-auto" />
                  </Button>
                </a>
              )
            )}

            {relatedJob && (
              <Link href={`/jobs/${relatedJob.slug}`} className="w-full">
                <Button variant="ghost" size="sm" className="w-full justify-center gap-1.5 text-xs text-brand-700 hover:text-brand-900">
                  <Briefcase className="h-3.5 w-3.5" />
                  <span>View Related Job Notice</span>
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Inline PDF Viewer (Directly below Notification PDF button in hero) */}
        {isPdfViewerOpen && activePdfUrl && (
          <InlinePdfViewer
            url={activePdfUrl}
            title={`${exam.short_title || exam.title} - Official Notification`}
            organizationName={org?.name || "Government Authority"}
            onClose={() => setIsPdfViewerOpen(false)}
          />
        )}
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Stages, Syllabus, Dates, Centers */}
        <div className="lg:col-span-2 space-y-8">
          {/* Multi-Stage Examination Timeline */}
          {dates.length > 0 && (
            <Card>
              <CardHeader className="border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <Layers className="h-5 w-5 text-[#013089]" />
                  <CardTitle className="text-base font-bold text-slate-900 font-heading">
                    Official Examination Timeline
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <ExamTimeline dates={dates} />
              </CardContent>
            </Card>
          )}

          {/* Shift Schedule Table */}
          {schedules.length > 0 && (
            <Card>
              <CardHeader className="border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-[#013089]" />
                  <CardTitle className="text-base font-bold text-slate-900 font-heading">
                    Official Exam Shift Schedule
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-slate-50">
                      <TableRow>
                        <TableHead className="font-bold text-slate-700">Exam Date</TableHead>
                        <TableHead className="font-bold text-slate-700">Shift</TableHead>
                        <TableHead className="font-bold text-slate-700">Timings</TableHead>
                        <TableHead className="font-bold text-slate-700">Reporting Time</TableHead>
                        <TableHead className="font-bold text-slate-700">Advisory</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {schedules.map((s, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="font-semibold text-slate-900 font-mono text-xs">
                            {formatDate(s.exam_date)}
                          </TableCell>
                          <TableCell className="text-xs font-bold text-[#013089]">
                            {s.shift_name}
                          </TableCell>
                          <TableCell className="text-xs font-mono text-slate-700">
                            {s.start_time} - {s.end_time}
                          </TableCell>
                          <TableCell className="text-xs font-mono text-slate-500">
                            {s.reporting_time || "1 Hour Prior"}
                          </TableCell>
                          <TableCell className="text-xs text-slate-600">
                            {s.instructions || "Bring Admit Card & Photo ID"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Eligibility Criteria */}
          {eligibility && (
            <Card>
              <CardHeader className="border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-[#013089]" />
                  <CardTitle className="text-base font-bold text-slate-900 font-heading">
                    Eligibility &amp; Age Criteria
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-xs font-bold uppercase text-slate-500">Minimum Educational Qualification</span>
                    <div className="text-sm font-semibold text-slate-900">
                      {eligibility.min_qualification?.name || "As specified in official notification"}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-xs font-bold uppercase text-slate-500">Prescribed Age Limits</span>
                    <div className="text-sm font-semibold text-slate-900">
                      {eligibility.min_age || eligibility.max_age
                        ? `Min: ${eligibility.min_age || "18"} Yrs | Max: ${eligibility.max_age || "32"} Yrs`
                        : "Refer to official Gazette notice"}
                    </div>
                  </div>
                </div>

                {exam.eligibility_summary && (
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {exam.eligibility_summary}
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right 1 Col: Important Dates, Fee, Centers, Official Docs */}
        <div className="space-y-6">
          {/* Important Dates Box */}
          {dates.length > 0 && (
            <Card>
              <CardHeader className="pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-[#013089]" />
                  <CardTitle className="text-sm font-bold text-slate-900 font-heading">
                    Important Exam Dates
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                {dates.map((d, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs pb-2 border-b border-slate-50 last:border-0 last:pb-0">
                    <span className="text-slate-600 font-medium">
                      {getLocalizedDateLabel(d.date_type, language, d.title)}
                    </span>
                    <span className="font-bold text-slate-900 font-mono">
                      {formatDate(d.event_date)}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Official Documents Catalog */}
          {documents.length > 0 && (
            <Card>
              <CardHeader className="pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-[#013089]" />
                  <CardTitle className="text-sm font-bold text-slate-900 font-heading">
                    Official Gazette Documents
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-3 space-y-2">
                {documents.map((doc, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors text-xs"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="h-4 w-4 text-slate-500 shrink-0" />
                      <div className="truncate">
                        <div className="font-bold text-slate-900 truncate">{doc.title}</div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          {doc.document_type.toUpperCase()} • Official Source
                        </div>
                      </div>
                    </div>

                    {doc.file_url && (
                      isPdfUrl(doc.file_url) ? (
                        <button
                          type="button"
                          onClick={() => {
                            setActivePdfUrl(doc.file_url);
                            setIsPdfViewerOpen(true);
                            window.scrollTo({ top: 300, behavior: "smooth" });
                          }}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-[#013089] hover:underline cursor-pointer bg-brand-50 px-2 py-1 rounded-md hover:bg-brand-100 transition-colors shrink-0 ml-2"
                        >
                          <FileText className="h-3 w-3" />
                          <span>View PDF</span>
                        </button>
                      ) : (
                        <a
                          href={doc.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 hover:text-[#013089] hover:underline bg-slate-100 px-2 py-1 rounded-md transition-colors shrink-0 ml-2"
                        >
                          <Globe className="h-3 w-3" />
                          <span>Portal</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Official Verification Notice */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-slate-900">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Official Authority Source</span>
            </div>
            <p className="leading-relaxed text-[11px]">
              This schedule is aggregated directly from official commission notifications. Candidate details are subject to verification by {org?.name}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
