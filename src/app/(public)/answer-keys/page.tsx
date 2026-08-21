import { Metadata } from "next";
import Link from "next/link";
import { getAnswerKeys, AnswerKeyItem } from "@/modules/home/dynamic-sections";
import { constructMetadata, buildBreadcrumbJsonLd } from "@/lib/seo";
import { formatDate } from "@/lib/utils";
import {
  KeyRound,
  ExternalLink,
  ChevronRight,
  FileCheck2,
  Calendar,
  Building2,
} from "lucide-react";

export const revalidate = 1800; // 30 minutes cache

export async function generateMetadata(): Promise<Metadata> {
  return constructMetadata({
    title: "Government Exam Answer Keys 2026 - Official Response Sheets & Keys",
    description: "Download official government exam answer keys, response sheets, and tentative keys declared by UPSC, SSC, RRB, NTA, and State PSC commissions.",
    path: "/answer-keys",
    keywords: [
      "Govt Exam Answer Key 2026",
      "Sarkari Answer Key",
      "Official Response Sheet 2026",
      "Tentative Answer Key",
      "Answer Key Download",
    ],
  });
}

export default async function AnswerKeysPage() {
  const items = await getAnswerKeys();

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Answer Keys", url: "/answer-keys" },
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
            <span className="text-slate-900 font-bold">Answer Keys</span>
          </nav>

          {/* Header */}
          <div className="rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-2">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-100 text-teal-800">
                <KeyRound className="h-4 w-4 text-teal-700" />
              </div>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-teal-700 text-white">
                OFFICIAL RELEASES
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
              Official Government Exam Answer Keys &amp; Response Sheets
            </h1>
            <p className="text-sm text-slate-600 max-w-3xl">
              Access verified provisional and final answer keys released by examination authorities. Verify questions, compare response sheets, and submit objections directly on official portals.
            </p>
          </div>

          {/* Answer Keys List */}
          <div className="w-full rounded-xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
            {items && items.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 sm:p-5 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2 flex-wrap text-xs">
                        <Link
                          href={`/authorities/${item.authorityAcronym.toLowerCase()}`}
                          className="font-bold text-[#013089] bg-brand-50 px-2 py-0.5 rounded border border-brand-100 hover:underline"
                        >
                          {item.authorityAcronym}
                        </Link>
                        {item.examCode && (
                          <span className="font-mono text-[11px] text-slate-500 font-semibold">
                            {item.examCode}
                          </span>
                        )}
                        <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-slate-400" />
                          <span>Released: {formatDate(item.releasedAt)}</span>
                        </span>
                      </div>

                      <Link
                        href={item.slug}
                        className="font-bold text-sm sm:text-base text-slate-900 hover:text-[#013089] transition-colors leading-snug block"
                      >
                        {item.title}
                      </Link>
                    </div>

                    <a
                      href={item.answerKeyUrl}
                      target={item.answerKeyUrl.startsWith("http") ? "_blank" : undefined}
                      rel={item.answerKeyUrl.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-2xs transition-all shrink-0"
                    >
                      <FileCheck2 className="h-3.5 w-3.5" />
                      <span>View Answer Key</span>
                      {item.answerKeyUrl.startsWith("http") && <ExternalLink className="h-3 w-3" />}
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center text-sm text-slate-500">
                No answer keys currently published. Check back after exam stages conclude.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
