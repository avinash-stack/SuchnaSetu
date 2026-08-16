import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublicJobBySlug } from "@/modules/jobs/service";
import { constructMetadata, buildGovNoticeJsonLd } from "@/lib/seo";
import { formatDate, formatINR, formatNumber } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
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
  ArrowLeft,
  GraduationCap,
  Clock,
  Briefcase,
  Layers,
  FileSpreadsheet,
} from "lucide-react";

interface JobDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: JobDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const job = await getPublicJobBySlug(slug);

  if (!job) {
    return constructMetadata({
      title: "Notice Not Found",
      description: "The requested official notice could not be found.",
    });
  }

  const orgName = job.organization?.name || "Government Authority";
  return constructMetadata({
    title: job.meta_title || `${job.title} - ${job.organization?.acronym || orgName}`,
    description:
      job.meta_description ||
      `Official recruitment notice for ${job.total_vacancies} vacancies by ${orgName}. Check eligibility, dates, reservation breakdown, and official gazette notification.`,
    path: `/jobs/${job.slug}`,
  });
}

export default async function PublicJobDetailPage({ params }: JobDetailPageProps) {
  const { slug } = await params;
  const job = await getPublicJobBySlug(slug);

  if (!job) {
    notFound();
  }

  const org = job.organization;
  const dept = job.department;
  const qual = job.qualification;
  const state = job.state;
  const vacancies = job.vacancies || [];
  const dates = job.important_dates || [];
  const eligibility = job.eligibility;
  const documents = job.official_documents || [];

  const jsonLd = buildGovNoticeJsonLd({
    title: job.title,
    description: job.summary || `${job.title} by ${org?.name || "Government"}`,
    url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/jobs/${job.slug}`,
    organizationName: org?.name || "Government of India",
    datePublished: job.published_at,
    dateModified: job.updated_at,
  });

  return (
    <>
      {/* Inject Structured JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-xs text-slate-500">
          <Link href="/" className="hover:text-slate-800 transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/jobs" className="hover:text-slate-800 transition-colors">
            Government Jobs
          </Link>
          <span>/</span>
          <span className="font-semibold text-slate-800 truncate max-w-[200px] sm:max-w-xs">
            {org?.acronym || org?.name || "Notice"}
          </span>
        </nav>

        {/* Hero Header Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="brand" className="text-xs font-bold py-0.5 px-2.5">
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
              <Badge variant="success" className="text-xs">
                Verified Official Notice
              </Badge>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <MapPin className="h-3.5 w-3.5 text-slate-400" />
              <span>{state ? state.name : "All India Jurisdiction"}</span>
            </div>
          </div>

          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl font-heading leading-tight">
            {job.title}
          </h1>

          {job.notification_number && (
            <div className="mt-2 text-xs font-mono text-slate-500">
              Official Notification No: <span className="font-semibold text-slate-800">{job.notification_number}</span>
            </div>
          )}

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 rounded-xl bg-slate-50 p-4 border border-slate-100 mt-6">
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Total Vacancies</div>
              <div className="text-lg font-extrabold text-emerald-700 mt-0.5">
                {formatNumber(job.total_vacancies)} Posts
              </div>
            </div>

            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Pay Scale</div>
              <div className="text-sm font-bold text-slate-800 mt-0.5 truncate">
                {job.salary_min || job.salary_max
                  ? `${formatINR(job.salary_min)} - ${formatINR(job.salary_max)}`
                  : job.pay_scale_details || "As per 7th CPC"}
              </div>
            </div>

            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Application Start</div>
              <div className="text-sm font-semibold text-slate-800 mt-0.5">
                {formatDate(job.application_start_date)}
              </div>
            </div>

            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Application Deadline</div>
              <div className="text-sm font-bold text-amber-700 mt-0.5">
                {formatDate(job.application_end_date)}
              </div>
            </div>
          </div>

          {/* Direct Provenance Action Strip */}
          <div className="flex flex-wrap items-center gap-3 mt-6 pt-6 border-t border-slate-100">
            {job.official_apply_url && (
              <a
                href={job.official_apply_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none"
              >
                <Button variant="brand" size="lg" className="w-full gap-2 font-bold shadow-md shadow-brand-500/10">
                  <span>Apply on Official Portal</span>
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </a>
            )}

            <a
              href={job.official_notification_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none"
            >
              <Button variant="outline" size="lg" className="w-full gap-2 font-semibold">
                <Download className="h-4 w-4 text-slate-600" />
                <span>Download Official Gazette / PDF</span>
              </Button>
            </a>

            {org?.website_url && (
              <a
                href={org.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-block"
              >
                <Button variant="ghost" size="lg" className="gap-1.5 text-xs text-slate-600">
                  <Building2 className="h-4 w-4" />
                  <span>{org.acronym || org.name} Website</span>
                </Button>
              </a>
            )}
          </div>
        </div>

        {/* Summary Description if present */}
        {job.summary && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold text-slate-900">
                Notice Summary & Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {job.summary}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Important Dates Timeline Card */}
        {dates.length > 0 && (
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-brand-600" />
                <CardTitle className="text-base font-bold text-slate-900">
                  Important Dates & Schedule
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {dates.map((d) => (
                  <div
                    key={d.id}
                    className="rounded-lg border border-slate-100 bg-slate-50/70 p-3.5 space-y-1"
                  >
                    <div className="text-xs font-medium text-slate-500">{d.event_name}</div>
                    <div className="text-sm font-bold text-slate-900">
                      {d.event_date ? formatDate(d.event_date) : d.event_date_text || "To be notified"}
                    </div>
                    {d.is_tentative && (
                      <Badge variant="warning" className="text-[9px]">
                        Tentative
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Post & Vacancy Breakdown Table */}
        {vacancies.length > 0 && (
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="h-5 w-5 text-emerald-600" />
                  <CardTitle className="text-base font-bold text-slate-900">
                    Post-Wise Vacancy & Reservation Breakdown
                  </CardTitle>
                </div>
                <Badge variant="outline" className="text-xs">
                  {vacancies.length} {vacancies.length === 1 ? "Post Cadre" : "Post Cadres"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Post Name</TableHead>
                    <TableHead>Pay Level</TableHead>
                    <TableHead className="text-center">UR</TableHead>
                    <TableHead className="text-center">EWS</TableHead>
                    <TableHead className="text-center">OBC</TableHead>
                    <TableHead className="text-center">SC</TableHead>
                    <TableHead className="text-center">ST</TableHead>
                    <TableHead className="text-center">PwD</TableHead>
                    <TableHead className="text-right">Total Posts</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vacancies.map((v) => (
                    <TableRow key={v.id}>
                      <TableCell className="font-semibold text-slate-900">
                        {v.post_name}
                        {v.post_code && (
                          <span className="block text-[11px] font-mono text-slate-400 font-normal">
                            Code: {v.post_code}
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-xs text-slate-600">
                        {v.pay_level || "—"}
                      </TableCell>
                      <TableCell className="text-center text-xs">{v.ur_posts ?? "—"}</TableCell>
                      <TableCell className="text-center text-xs">{v.ews_posts ?? "—"}</TableCell>
                      <TableCell className="text-center text-xs">{v.obc_posts ?? "—"}</TableCell>
                      <TableCell className="text-center text-xs">{v.sc_posts ?? "—"}</TableCell>
                      <TableCell className="text-center text-xs">{v.st_posts ?? "—"}</TableCell>
                      <TableCell className="text-center text-xs">{v.pwd_posts ?? "—"}</TableCell>
                      <TableCell className="text-right font-bold text-emerald-700">
                        {formatNumber(v.total_posts)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Eligibility & Criteria Details */}
        {eligibility && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Qualifications & Age Limit */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-base font-bold text-slate-900">
                    Educational Qualifications & Age Criteria
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-0 text-xs">
                <div>
                  <div className="font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Minimum Qualification:
                  </div>
                  <p className="text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100 leading-relaxed whitespace-pre-line">
                    {eligibility.education_qualification}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div>
                    <div className="text-slate-400 font-semibold uppercase text-[10px]">Age Limits</div>
                    <div className="text-sm font-bold text-slate-900 mt-0.5">
                      {eligibility.min_age || eligibility.max_age
                        ? `${eligibility.min_age || "18"} to ${eligibility.max_age || "N/A"} Years`
                        : "As per official rules"}
                    </div>
                  </div>

                  {eligibility.age_calculation_date && (
                    <div>
                      <div className="text-slate-400 font-semibold uppercase text-[10px]">Crucial Date</div>
                      <div className="text-sm font-semibold text-slate-900 mt-0.5">
                        {formatDate(eligibility.age_calculation_date)}
                      </div>
                    </div>
                  )}
                </div>

                {eligibility.age_relaxation_details && (
                  <div>
                    <div className="font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Age Relaxation:
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      {eligibility.age_relaxation_details}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Selection Process & Fees */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <IndianRupee className="h-5 w-5 text-amber-600" />
                  <CardTitle className="text-base font-bold text-slate-900">
                    Selection Process & Application Fees
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-0 text-xs">
                {eligibility.selection_process && (
                  <div>
                    <div className="font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Stages of Selection:
                    </div>
                    <p className="text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100 leading-relaxed">
                      {eligibility.selection_process}
                    </p>
                  </div>
                )}

                {eligibility.experience_details && (
                  <div>
                    <div className="font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Experience Requirement:
                    </div>
                    <p className="text-slate-600 text-[11px]">
                      {eligibility.experience_details}
                    </p>
                  </div>
                )}

                {eligibility.application_fee_details && (
                  <div>
                    <div className="font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Application Fee Structure:
                    </div>
                    <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-3 text-slate-800 text-[11px]">
                      <pre className="font-sans whitespace-pre-wrap">
                        {typeof eligibility.application_fee_details === "string"
                          ? eligibility.application_fee_details
                          : JSON.stringify(eligibility.application_fee_details, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Official Documents & Verified PDFs */}
        {documents.length > 0 && (
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-purple-600" />
                <CardTitle className="text-base font-bold text-slate-900">
                  Official Verification Documents
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50/50 p-4 transition-all hover:bg-slate-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-100 text-red-700 font-bold text-xs">
                        PDF
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-slate-900">{doc.title}</div>
                        <div className="text-[11px] text-slate-400 uppercase">
                          {doc.document_type.replace("_", " ")}
                          {doc.published_date && ` • ${formatDate(doc.published_date)}`}
                        </div>
                      </div>
                    </div>

                    <a
                      href={doc.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg p-2 text-slate-500 hover:bg-slate-200 hover:text-slate-900 transition-colors"
                      aria-label={`Download ${doc.title}`}
                    >
                      <Download className="h-4 w-4" />
                    </a>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Statutory Anti-Fraud & Authenticity Disclaimer */}
        <div className="rounded-xl border border-amber-500/30 bg-amber-50/40 p-5 flex items-start gap-3 text-xs text-slate-700">
          <ShieldAlert className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-amber-900">Statutory Notice: </span>
            <span>
              SuchnaSetu does not accept payments, job application forms, or resumes. All applications must be submitted strictly on the official authority portal ({org?.website_url || "official link"}). Please verify all terms in the original notification document.
            </span>
          </div>
        </div>

        {/* Back Link */}
        <div className="pt-4">
          <Link href="/jobs">
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to All Government Jobs</span>
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}
