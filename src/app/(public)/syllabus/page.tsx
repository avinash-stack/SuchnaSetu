import { Metadata } from "next";
import Link from "next/link";
import { getOfficialSyllabi, SyllabusItem } from "@/modules/home/dynamic-sections";
import { constructMetadata, buildBreadcrumbJsonLd } from "@/lib/seo";
import {
  BookOpen,
  ArrowRight,
  ChevronRight,
  Award,
  Building2,
  FileText,
  Search,
} from "lucide-react";

export const revalidate = 3600; // 1 hour cache

export async function generateMetadata(): Promise<Metadata> {
  return constructMetadata({
    title: "Government Exam Syllabus & Exam Pattern 2026 - Official Syllabus Gazettes",
    description: "Search and download official government exam syllabi, question paper patterns, negative marking schemes, and subject-wise curriculum for UPSC, SSC, Banking, Railways, and State PSCs.",
    path: "/syllabus",
    keywords: [
      "Govt Exam Syllabus 2026",
      "Sarkari Syllabus",
      "Official Exam Pattern",
      "Negative Marking Scheme",
      "PSC Exam Syllabus 2026",
    ],
  });
}

export default async function SyllabusDirectoryPage() {
  const syllabi = await getOfficialSyllabi();

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Syllabus Directory", url: "/syllabus" },
  ];

  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbs);

  return (
    <>
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
            <span className="text-slate-900 font-bold">Syllabus &amp; Exam Patterns</span>
          </nav>

          {/* Header */}
          <div className="rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-2">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-800">
                <BookOpen className="h-4 w-4 text-blue-700" />
              </div>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-[#013089] text-white">
                CURRICULUM &amp; PATTERNS
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
              Government Exam Syllabus &amp; Selection Schemes 2026
            </h1>
            <p className="text-sm text-slate-600 max-w-3xl">
              Browse verified syllabi and marking schemes extracted from official gazettes. Master the subject breakdown, duration, stage-wise cutoffs, and evaluation criteria for all competitive examinations.
            </p>
          </div>

          {/* Syllabus Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {syllabi && syllabi.length > 0 ? (
              syllabi.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs hover:border-[#013089]/40 transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <Link
                        href={`/authorities/${item.authorityAcronym.toLowerCase()}`}
                        className="font-bold text-xs text-[#013089] bg-brand-50 px-2 py-0.5 rounded border border-brand-100 hover:underline"
                      >
                        {item.authorityAcronym}
                      </Link>
                      {item.examCode && (
                        <span className="font-mono text-[10px] text-slate-500 font-semibold">
                          {item.examCode}
                        </span>
                      )}
                    </div>

                    <Link
                      href={`/syllabus/${item.id}`}
                      className="font-bold text-base text-slate-900 hover:text-[#013089] transition-colors leading-snug block line-clamp-2"
                    >
                      {item.title}
                    </Link>

                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {item.syllabusSummary}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    {item.markingScheme ? (
                      <div className="text-[11px] text-amber-800 font-medium flex items-center gap-1 truncate">
                        <Award className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                        <span className="truncate">{item.markingScheme}</span>
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-400">Official Pattern</span>
                    )}

                    <Link
                      href={`/syllabus/${item.id}`}
                      className="inline-flex items-center gap-1 font-bold text-xs text-[#013089] hover:underline shrink-0"
                    >
                      <span>Full Syllabus</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 p-12 text-center text-sm text-slate-500 bg-white rounded-xl border border-dashed border-slate-200">
                No syllabus records found.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
