import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { constructMetadata, buildSyllabusJsonLd, buildBreadcrumbJsonLd } from "@/lib/seo";
import { getCanonicalSiteUrl } from "@/lib/constants";
import {
  BookOpen,
  ArrowRight,
  ChevronRight,
  Award,
  Building2,
  Calendar,
  FileCheck2,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";

interface SyllabusDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const revalidate = 3600; // 1 hour cache

async function getExamForSyllabus(slug: string): Promise<any> {
  const supabase = createAdminClient();
  const cleanSlug = decodeURIComponent(slug).trim();

  // Try lookup by ID
  const { data: byId } = await supabase
    .from("gov_exams")
    .select(`
      *,
      organization:organizations!inner(*)
    `)
    .eq("id", cleanSlug)
    .maybeSingle();

  if (byId) return byId;

  // Try lookup by slug
  const { data: bySlug } = await supabase
    .from("gov_exams")
    .select(`
      *,
      organization:organizations!inner(*)
    `)
    .eq("slug", cleanSlug)
    .maybeSingle();

  return bySlug;
}

export async function generateMetadata({ params }: SyllabusDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const exam = await getExamForSyllabus(slug);

  if (!exam) {
    return constructMetadata({
      title: "Syllabus Not Found",
      description: "The requested syllabus document could not be found.",
    });
  }

  const org = exam.organization;
  const title = `${exam.title} Syllabus 2026 - Exam Pattern & Marking Scheme`;
  const description = `Official syllabus and examination scheme for ${exam.title} conducted by ${org?.name || "Official Body"}. Includes subject-wise curriculum, marks distribution, time duration, and negative marking rules.`;

  return constructMetadata({
    title,
    description,
    path: `/syllabus/${exam.slug || exam.id}`,
    keywords: [
      `${exam.title} Syllabus 2026`,
      `${org?.acronym || ""} Exam Pattern`,
      `${exam.title} Marking Scheme`,
      `${exam.title} Topics Breakdown`,
    ],
  });
}

export default async function SingleSyllabusPage({ params }: SyllabusDetailPageProps) {
  const { slug } = await params;
  const exam = await getExamForSyllabus(slug);

  if (!exam) {
    notFound();
  }

  const org = exam.organization;
  const syllabusData = (exam.syllabus as any) || {};

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Syllabus", url: "/syllabus" },
    { name: exam.title, url: `/syllabus/${exam.slug || exam.id}` },
  ];

  const syllabusJsonLd = buildSyllabusJsonLd({
    title: `${exam.title} Official Syllabus 2026`,
    examName: exam.title,
    description: syllabusData.description || exam.summary || `${exam.title} official exam scheme and syllabus.`,
    url: `${getCanonicalSiteUrl()}/syllabus/${exam.slug || exam.id}`,
    organizationName: org?.name || "Government Authority",
    markingScheme: (exam.marking_scheme as any)?.negative_marking || "Standard Examination Scheme",
  });

  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbs);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(syllabusJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="min-h-screen bg-slate-50/50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-slate-500 font-medium" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-[#013089] transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3 text-slate-400" />
            <Link href="/syllabus" className="hover:text-[#013089] transition-colors">Syllabus Directory</Link>
            <ChevronRight className="h-3 w-3 text-slate-400" />
            <span className="text-slate-900 font-bold truncate max-w-xs">{exam.title}</span>
          </nav>

          {/* Header */}
          <div className="rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap text-xs">
                  <Link
                    href={`/authorities/${org?.acronym?.toLowerCase() || org?.id}`}
                    className="font-bold text-[#013089] bg-brand-50 px-2 py-0.5 rounded border border-brand-100 hover:underline"
                  >
                    {org?.acronym || org?.name}
                  </Link>
                  {exam.exam_code && (
                    <span className="font-mono text-slate-500 font-semibold">
                      {exam.exam_code}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-xs">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>Official Gazette Syllabus</span>
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
                  {exam.title} Syllabus &amp; Exam Pattern 2026
                </h1>
              </div>

              <Link
                href={`/exams/${exam.slug}`}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#013089] hover:bg-[#012169] text-white font-bold text-xs shadow-2xs transition-all shrink-0"
              >
                <span>View Full Exam Notice</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {/* Overview / Pattern Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
                <span className="font-bold text-slate-500 block">Exam Mode</span>
                <span className="text-slate-900 font-semibold text-sm capitalize">
                  {exam.mode?.replace("_", " ") || "Offline / Online"}
                </span>
              </div>
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
                <span className="font-bold text-slate-500 block">Marking Scheme</span>
                <span className="text-amber-800 font-semibold text-sm">
                  {(exam.marking_scheme as any)?.negative_marking || "Per Official Rules"}
                </span>
              </div>
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
                <span className="font-bold text-slate-500 block">Recruiting Authority</span>
                <span className="text-[#013089] font-semibold text-sm truncate block">
                  {org?.name}
                </span>
              </div>
            </div>
          </div>

          {/* Syllabus Detailed Content */}
          <div className="rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
              <BookOpen className="h-5 w-5 text-[#013089]" />
              <h2 className="text-lg font-bold text-slate-900 font-heading">
                Subject-wise Curriculum &amp; Sectional Breakdown
              </h2>
            </div>

            <div className="prose prose-slate max-w-none text-sm text-slate-700 space-y-4">
              {syllabusData.description ? (
                <p className="leading-relaxed">{syllabusData.description}</p>
              ) : (
                <p className="leading-relaxed">
                  {exam.summary || "The examination consists of objective multiple choice questions and descriptive papers covering General Studies, Aptitude, Subject Specialization, and Official Language comprehension."}
                </p>
              )}

              {/* Sections / Subjects breakdown if available */}
              {Array.isArray(syllabusData.sections) && syllabusData.sections.length > 0 && (
                <div className="space-y-4 pt-2">
                  {syllabusData.sections.map((section: any, idx: number) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-sm text-slate-900">{section.name || `Section ${idx + 1}`}</h3>
                        {section.marks && <span className="font-mono text-xs font-bold text-[#013089]">{section.marks} Marks</span>}
                      </div>
                      {section.topics && (
                        <p className="text-xs text-slate-600 leading-relaxed">{section.topics}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Official Source link */}
            {exam.official_notification_url && (
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Verified Official Source Gazette:</span>
                <a
                  href={exam.official_notification_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-bold text-[#013089] hover:underline"
                >
                  <span>Official Gazette Notice</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
