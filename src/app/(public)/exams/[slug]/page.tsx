import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublicExamBySlug, getRelatedExams } from "@/modules/exams/service";
import { ExamTimeline } from "@/modules/exams/components/exam-timeline";
import { constructMetadata, buildGovExamJsonLd } from "@/lib/seo";
import { getCanonicalSiteUrl } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import {
  Building2,
  Calendar,
  Layers,
  MapPin,
  Clock,
  ExternalLink,
  Download,
  ShieldCheck,
  ShieldAlert,
  ArrowLeft,
  GraduationCap,
  Sparkles,
  BookOpen,
  HelpCircle,
  FileText,
  Briefcase,
  ChevronRight,
} from "lucide-react";

interface ExamDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ExamDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const exam = await getPublicExamBySlug(slug);

  if (!exam) {
    return constructMetadata({
      title: "Examination Not Found",
      description: "The requested official examination schedule could not be found.",
    });
  }

  const orgName = exam.organization?.name || "Official Examination Authority";
  return constructMetadata({
    title: exam.meta_title || `${exam.title} - ${exam.organization?.acronym || orgName}`,
    description:
      exam.meta_description ||
      `Official examination schedule and syllabus guide for ${exam.title} conducted by ${orgName}. Check exam dates, shift timings, multi-stage pattern, and eligibility criteria.`,
    path: `/exams/${exam.slug}`,
  });
}

export default async function PublicExamDetailPage({ params }: ExamDetailPageProps) {
  const { slug } = await params;
  const exam = await getPublicExamBySlug(slug);

  if (!exam) {
    notFound();
  }

  const org = exam.organization;
  const dept = exam.department;
  const stages = exam.stages || [];
  const schedules = exam.schedules || [];
  const eligibility = exam.eligibility;
  const dates = exam.important_dates || [];
  const centers = exam.centers || [];
  const documents = exam.official_documents || [];
  const relatedJob = exam.related_job;

  const relatedExams = org ? await getRelatedExams(org.id, exam.id, 3) : [];

  // Earliest exam start date
  const examStartDate = dates.find((d) => d.date_type === "exam_start");
  const examEndDate = dates.find((d) => d.date_type === "exam_end");

  const jsonLd = buildGovExamJsonLd({
    title: exam.title,
    description: exam.description,
    url: `${getCanonicalSiteUrl()}/exams/${exam.slug}`,
    organizationName: org?.name || "Government Authority",
    startDate: examStartDate?.event_date || exam.published_at,
    endDate: examEndDate?.event_date,
    mode: exam.mode,
    datePublished: exam.published_at,
    dateModified: exam.updated_at,
  });

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
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-slate-800 transition-colors">
          Home
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
        <Link href="/exams" className="hover:text-slate-800 transition-colors">
          Exams & Notifications
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
        <span className="font-semibold text-slate-900 truncate max-w-md">
          {exam.short_title || exam.title}
        </span>
      </nav>

      {/* Hero Header Card */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        {exam.is_featured && (
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-600 via-amber-500 to-brand-600" />
        )}

        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="space-y-4 max-w-3xl">
            {/* Authority & Category Tag */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-brand-50 px-3 py-1 text-xs font-bold text-brand-900">
                <Building2 className="h-3.5 w-3.5 text-brand-600" />
                <span>{org?.name || "Official Commission"}</span>
              </span>

              {dept?.name && (
                <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                  {dept.name}
                </span>
              )}

              {exam.is_featured && (
                <Badge variant="warning" className="gap-1 text-xs">
                  <Sparkles className="h-3 w-3" />
                  <span>Featured Exam</span>
                </Badge>
              )}

              <Badge variant="outline" className="text-xs uppercase font-mono">
                {exam.exam_code || exam.frequency}
              </Badge>
            </div>

            {/* Title */}
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl font-heading leading-snug">
              {exam.title}
            </h1>

            {/* Short Meta Bar */}
            <div className="flex items-center gap-4 text-xs text-slate-600 flex-wrap">
              <div className="flex items-center gap-1.5 font-medium">
                <Clock className="h-4 w-4 text-slate-400" />
                <span>Mode: <strong>{formatMode(exam.mode)}</strong></span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <Layers className="h-4 w-4 text-slate-400" />
                <span>Stages: <strong>{stages.length} Stages Selection</strong></span>
              </div>
              {exam.state && (
                <div className="flex items-center gap-1.5 font-medium">
                  <MapPin className="h-4 w-4 text-slate-400" />
                  <span>State: <strong>{exam.state.name}</strong></span>
                </div>
              )}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 min-w-[220px]">
            {exam.official_website_url && (
              <a
                href={exam.official_website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full"
              >
                <Button variant="brand" size="md" className="w-full gap-2 font-bold justify-center">
                  <span>Official Application Portal</span>
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </a>
            )}

            {exam.official_notification_url && (
              <a
                href={exam.official_notification_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full"
              >
                <Button variant="outline" size="md" className="w-full gap-2 font-semibold justify-center">
                  <Download className="h-4 w-4" />
                  <span>Download Official Gazette</span>
                </Button>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Layout: Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left 2 Columns: Deep Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Section 1: Overview & Description */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 text-brand-700 font-bold text-xs uppercase tracking-wider">
                <BookOpen className="h-4 w-4" />
                <span>Official Scheme & Overview</span>
              </div>
              <CardTitle>About the Examination</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs text-slate-700 leading-relaxed">
              <p className="whitespace-pre-line">{exam.description}</p>

              {exam.pattern_description && (
                <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-4 space-y-1.5">
                  <h4 className="font-bold text-slate-900">Selection Pattern Overview</h4>
                  <p className="text-slate-600">{exam.pattern_description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Section 2: Examination Stages Breakdown */}
          {stages.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 text-brand-700 font-bold text-xs uppercase tracking-wider">
                  <Layers className="h-4 w-4" />
                  <span>Multi-Tier Evaluation</span>
                </div>
                <CardTitle>Examination Stages & Marks Distribution</CardTitle>
                <CardDescription>
                  Detailed tier-by-tier breakdown of test duration, total marks, qualifying cutoffs, and mode.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {stages.map((stg, idx) => (
                  <div key={stg.id || idx} className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">
                          {stg.stage_order}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 font-heading">
                          {stg.stage_name}
                        </h4>
                      </div>
                      <Badge variant="outline" className="text-xs capitalize self-start sm:self-auto font-medium">
                        {stg.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div className="rounded-lg bg-slate-50 p-2.5 space-y-0.5">
                        <span className="text-slate-500 font-medium">Test Mode</span>
                        <p className="font-bold text-slate-800 capitalize truncate">
                          {stg.mode?.replace("_", " ") || "Standard"}
                        </p>
                      </div>

                      <div className="rounded-lg bg-slate-50 p-2.5 space-y-0.5">
                        <span className="text-slate-500 font-medium">Duration</span>
                        <p className="font-bold text-slate-800">
                          {stg.duration_minutes ? `${stg.duration_minutes} Mins` : "As Notified"}
                        </p>
                      </div>

                      <div className="rounded-lg bg-slate-50 p-2.5 space-y-0.5">
                        <span className="text-slate-500 font-medium">Total Marks</span>
                        <p className="font-bold text-slate-800">
                          {stg.total_marks ? `${stg.total_marks} Marks` : "Qualifying"}
                        </p>
                      </div>

                      <div className="rounded-lg bg-slate-50 p-2.5 space-y-0.5">
                        <span className="text-slate-500 font-medium">Qualifying Min</span>
                        <p className="font-bold text-slate-800">
                          {stg.qualifying_marks ? `${stg.qualifying_marks} Marks` : "Norms Apply"}
                        </p>
                      </div>
                    </div>

                    {stg.description && (
                      <p className="text-xs text-slate-600 pt-1 leading-relaxed">
                        {stg.description}
                      </p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Section 3: Shift Schedules & Timetable */}
          {schedules.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 text-brand-700 font-bold text-xs uppercase tracking-wider">
                  <Calendar className="h-4 w-4" />
                  <span>Paper Schedules & Shifts</span>
                </div>
                <CardTitle>Examination Shift Timetable</CardTitle>
                <CardDescription>
                  Official shift reporting hours, exam commencement, and candidate guidelines.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Paper / Subject</TableHead>
                      <TableHead>Exam Date</TableHead>
                      <TableHead>Shift / Timings</TableHead>
                      <TableHead>Reporting</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {schedules.map((sc, i) => (
                      <TableRow key={sc.id || i}>
                        <TableCell className="font-bold text-slate-900 text-xs">
                          {sc.paper_name}
                          {sc.instructions && (
                            <p className="font-normal text-slate-500 text-[11px] mt-0.5">
                              {sc.instructions}
                            </p>
                          )}
                        </TableCell>
                        <TableCell className="text-xs text-slate-700 font-medium">
                          {formatDate(sc.exam_date)}
                        </TableCell>
                        <TableCell className="text-xs text-slate-700">
                          {sc.shift_name ? <span className="font-semibold">{sc.shift_name}: </span> : null}
                          {sc.start_time ? `${sc.start_time} - ${sc.end_time || ""}` : "Notified"}
                        </TableCell>
                        <TableCell className="text-xs text-slate-700 font-medium">
                          {sc.reporting_time || "As per Admit Card"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* Section 4: Syllabus & Marking Scheme */}
          {(exam.syllabus_summary || exam.marking_scheme) && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 text-brand-700 font-bold text-xs uppercase tracking-wider">
                  <BookOpen className="h-4 w-4" />
                  <span>Curriculum & Evaluation</span>
                </div>
                <CardTitle>Syllabus & Marking Guidelines</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-xs">
                {exam.syllabus_summary && (
                  <div className="space-y-1.5">
                    <h4 className="font-bold text-slate-900 text-sm">Syllabus Breakdown</h4>
                    <p className="text-slate-600 whitespace-pre-line leading-relaxed">
                      {exam.syllabus_summary}
                    </p>
                  </div>
                )}

                {exam.marking_scheme && (
                  <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4 space-y-1">
                    <h4 className="font-bold text-amber-950">Marking & Negative Marking Rules</h4>
                    <p className="text-amber-900 leading-relaxed">{exam.marking_scheme}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Section 5: Eligibility Criteria */}
          {eligibility && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 text-brand-700 font-bold text-xs uppercase tracking-wider">
                  <GraduationCap className="h-4 w-4" />
                  <span>Candidate Eligibility</span>
                </div>
                <CardTitle>Eligibility, Age & Educational Qualifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 space-y-1">
                    <span className="text-slate-500 font-medium">Age Limit</span>
                    <p className="font-bold text-slate-900 text-sm">
                      {eligibility.min_age || 18} to {eligibility.max_age || 32} Years
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 space-y-1">
                    <span className="text-slate-500 font-medium">Permissible Attempts</span>
                    <p className="font-bold text-slate-900 text-sm">
                      {eligibility.attempts_limit ? `${eligibility.attempts_limit} Attempts (General)` : "Unlimited"}
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 space-y-1">
                    <span className="text-slate-500 font-medium">Nationality</span>
                    <p className="font-bold text-slate-900 text-sm">
                      {eligibility.nationality_criteria || "Citizen of India"}
                    </p>
                  </div>
                </div>

                {eligibility.min_qualification && (
                  <div className="space-y-1 pt-2">
                    <span className="font-bold text-slate-800">Minimum Recognized Qualification:</span>
                    <p className="text-slate-600">
                      {eligibility.min_qualification.name} (Level: {eligibility.min_qualification.level})
                    </p>
                  </div>
                )}

                {eligibility.educational_qualification_description && (
                  <div className="space-y-1">
                    <span className="font-bold text-slate-800">Educational Qualification Details:</span>
                    <p className="text-slate-600 leading-relaxed">
                      {eligibility.educational_qualification_description}
                    </p>
                  </div>
                )}

                {eligibility.age_relaxation_rules && (
                  <div className="space-y-1">
                    <span className="font-bold text-slate-800">Category-Wise Age Relaxation:</span>
                    <p className="text-slate-600 leading-relaxed">
                      {eligibility.age_relaxation_rules}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Section 6: Exam Centers Directory */}
          {centers.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 text-brand-700 font-bold text-xs uppercase tracking-wider">
                  <MapPin className="h-4 w-4" />
                  <span>Test Center Locator</span>
                </div>
                <CardTitle>Designated Examination Centers ({centers.length} Cities)</CardTitle>
                <CardDescription>
                  Allocated examination cities and regional test venue codes.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {centers.map((c, i) => (
                    <span
                      key={c.id || i}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-700 font-medium"
                    >
                      <MapPin className="h-3 w-3 text-slate-400" />
                      <span>{c.city_name}</span>
                      {c.center_code && (
                        <span className="rounded bg-slate-200 px-1 py-0.2 text-[10px] font-mono text-slate-600">
                          {c.center_code}
                        </span>
                      )}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Section 7: Connected Job Notice */}
          {relatedJob && (
            <Card className="border-brand-200 bg-brand-50/40">
              <CardHeader>
                <div className="flex items-center gap-2 text-brand-800 font-bold text-xs uppercase tracking-wider">
                  <Briefcase className="h-4 w-4" />
                  <span>Associated Recruitment Notification</span>
                </div>
                <CardTitle>{relatedJob.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between gap-4">
                <p className="text-xs text-slate-600 max-w-lg">
                  This examination fulfills vacancies for official recruitment notice{" "}
                  <strong>{relatedJob.notification_number || relatedJob.title}</strong>.
                </p>
                <Link href={`/jobs/${relatedJob.slug}`}>
                  <Button variant="brand" size="sm" className="gap-1.5 font-bold">
                    <span>View Job Notice</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right 1 Column: Timeline, Fee, Documents & Related */}
        <div className="space-y-8">
          {/* Important Dates Timeline */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 text-brand-700 font-bold text-xs uppercase tracking-wider">
                <Calendar className="h-4 w-4" />
                <span>Important Dates</span>
              </div>
              <CardTitle>Milestone Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <ExamTimeline dates={dates} />
            </CardContent>
          </Card>

          {/* Application Fee Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Application Fee Structure</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 text-slate-700">
                <span>General / Unreserved:</span>
                <span className="font-bold text-slate-900">₹{fee.general ?? 100}</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 text-slate-700">
                <span>OBC (Non-Creamy Layer):</span>
                <span className="font-bold text-slate-900">₹{fee.obc ?? 100}</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 text-slate-700">
                <span>EWS (Economically Weaker):</span>
                <span className="font-bold text-slate-900">₹{fee.ews ?? 100}</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 text-slate-700">
                <span>SC / ST Candidates:</span>
                <span className="font-bold text-emerald-700">₹{fee.sc ?? 0} (Exempted)</span>
              </div>
              <div className="flex items-center justify-between text-slate-700">
                <span>Female & PwD Candidates:</span>
                <span className="font-bold text-emerald-700">₹{fee.female ?? 0} (Exempted)</span>
              </div>
            </CardContent>
          </Card>

          {/* Official Documents Downloads */}
          {documents.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 text-brand-700 font-bold text-xs uppercase tracking-wider">
                  <FileText className="h-4 w-4" />
                  <span>Official Downloads</span>
                </div>
                <CardTitle>Gazettes & Circulars</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {documents.map((doc, idx) => (
                  <a
                    key={doc.id || idx}
                    href={doc.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start justify-between gap-3 rounded-xl border border-slate-200 p-3 hover:border-brand-500 hover:bg-slate-50 transition-colors group"
                  >
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-brand-700 transition-colors line-clamp-2">
                        {doc.title}
                      </h4>
                      <span className="text-[10px] text-slate-500 uppercase font-medium">
                        {doc.document_type}
                      </span>
                    </div>
                    <Download className="h-4 w-4 text-slate-400 group-hover:text-brand-600 flex-shrink-0 mt-0.5" />
                  </a>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Related Examinations */}
          {relatedExams.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Other Exams by {org?.acronym || "Authority"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {relatedExams.map((rel) => (
                  <Link
                    key={rel.id}
                    href={`/exams/${rel.slug}`}
                    className="block rounded-xl border border-slate-100 bg-slate-50 p-3 hover:border-brand-400 hover:bg-white transition-all space-y-1 group"
                  >
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-brand-700 transition-colors line-clamp-2">
                      {rel.title}
                    </h4>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500">
                      <span className="capitalize">{rel.mode.replace("_", " ")}</span>
                      <span>•</span>
                      <span>{formatDate(rel.published_at)}</span>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Statutory Civic Integrity Disclaimer */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 space-y-2 text-xs text-slate-600">
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Verified Public Information</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              SuchnaSetu aggregates and structures official examination data solely from government gazettes and certified public portals. Candidates are advised to cross-verify all dates and eligibility conditions with the official commission brochure.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
