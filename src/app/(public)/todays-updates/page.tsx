import { Metadata } from "next";
import Link from "next/link";
import { getTodaysUpdates, TodayUpdateItem } from "@/modules/home/dynamic-sections";
import { constructMetadata, buildBreadcrumbJsonLd } from "@/lib/seo";
import { formatDate } from "@/lib/utils";
import {
  Sparkles,
  Briefcase,
  Calendar,
  Award,
  ChevronRight,
  ExternalLink,
  ArrowRight,
  Clock,
  Building2,
} from "lucide-react";

export const revalidate = 600; // 10 minutes cache for real-time updates

export async function generateMetadata(): Promise<Metadata> {
  const todayFormatted = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return constructMetadata({
    title: `Today's Government Job Updates & Latest Notifications - ${todayFormatted}`,
    description: `Real-time official updates published today across Central & State government bodies, UPSC, SSC, Railways, Banking, and PSC commissions.`,
    path: "/todays-updates",
    keywords: [
      "Todays Govt Job Updates",
      "Sarkari Result Today",
      "Latest Govt Notifications 2026",
      "Employment News Today",
      "Govt Exam Updates Today",
    ],
  });
}

export default async function TodaysUpdatesPage() {
  const updates = await getTodaysUpdates();

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Today's Updates", url: "/todays-updates" },
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
            <span className="text-slate-900 font-bold">Today&apos;s Updates</span>
          </nav>

          {/* Header */}
          <div className="rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-2">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-red-700">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-bold bg-red-600 text-white animate-pulse">
                LIVE UPDATES
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
              Today&apos;s Official Government Updates &amp; Notifications
            </h1>
            <p className="text-sm text-slate-600 max-w-3xl">
              Chronological feed of official recruitment notices, exam date announcements, admit cards, and gazette releases published today by verified government authorities.
            </p>
          </div>

          {/* Updates Feed */}
          <div className="space-y-3">
            {updates && updates.length > 0 ? (
              updates.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-2xs hover:border-[#013089]/40 transition-all group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2 flex-wrap text-xs">
                        <Link
                          href={`/authorities/${item.authorityAcronym.toLowerCase()}`}
                          className="font-bold text-[#013089] bg-brand-50 px-2 py-0.5 rounded border border-brand-100 hover:underline"
                        >
                          {item.authorityAcronym}
                        </Link>
                        <span className="text-[11px] font-semibold text-slate-500 capitalize px-2 py-0.5 rounded bg-slate-100">
                          {item.type}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {formatDate(item.publishedAt)}
                        </span>
                      </div>

                      <Link
                        href={item.actionUrl}
                        className="font-bold text-sm sm:text-base text-slate-900 hover:text-[#013089] transition-colors leading-snug block group-hover:underline"
                      >
                        {item.title}
                      </Link>
                    </div>

                    <Link
                      href={item.actionUrl}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#013089] hover:bg-[#012169] text-white font-bold text-xs shadow-2xs transition-all shrink-0"
                    >
                      <span>{item.actionLabel}</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-slate-200 bg-white p-12 text-center text-sm text-slate-500">
                No new verified updates published in the last 24 hours. Check back soon or browse active openings.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
