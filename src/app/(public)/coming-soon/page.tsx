import { Metadata } from "next";
import Link from "next/link";
import { getComingSoonItems, ComingSoonItem } from "@/modules/home/dynamic-sections";
import { constructMetadata, buildBreadcrumbJsonLd } from "@/lib/seo";
import { formatDate, formatNumber } from "@/lib/utils";
import {
  Hourglass,
  ArrowRight,
  ChevronRight,
  MapPin,
  Timer,
  Building2,
  Calendar,
} from "lucide-react";

export const revalidate = 3600; // 1 hour cache

export async function generateMetadata(): Promise<Metadata> {
  return constructMetadata({
    title: "Upcoming Government Jobs & Exams 2026 - Advance Notifications",
    description: "Verified calendar of upcoming government job applications, exam dates, and advance notices opening in the next 15 to 60 days.",
    path: "/coming-soon",
    keywords: [
      "Upcoming Govt Jobs 2026",
      "Govt Jobs Starting Soon",
      "Upcoming Sarkari Naukri",
      "Advance Recruitment Notices",
      "Upcoming Government Exams",
    ],
  });
}

export default async function ComingSoonPage() {
  const items = await getComingSoonItems();

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Coming Soon", url: "/coming-soon" },
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
            <span className="text-slate-900 font-bold">Coming Soon</span>
          </nav>

          {/* Header */}
          <div className="rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-2">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-800">
                <Hourglass className="h-4 w-4" />
              </div>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-amber-500 text-white">
                ADVANCE SCHEDULE
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
              Upcoming Government Jobs &amp; Exam Registrations
            </h1>
            <p className="text-sm text-slate-600 max-w-3xl">
              Verified future recruitment drives and application openings scheduled to begin in the coming weeks. Prepare documents in advance before application windows go live.
            </p>
          </div>

          {/* List of upcoming notices */}
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
                        {item.stateCode && (
                          <span className="text-[11px] text-slate-500 flex items-center gap-0.5">
                            <MapPin className="h-3 w-3 text-slate-400" />
                            <span>{item.stateCode}</span>
                          </span>
                        )}
                        <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 flex items-center gap-1">
                          <Timer className="h-3 w-3" />
                          <span>Starts in {item.daysRemaining} days</span>
                        </span>
                        {item.totalVacancies && item.totalVacancies > 0 && (
                          <span className="text-[11px] font-mono text-slate-500 font-semibold">
                            {formatNumber(item.totalVacancies)} Vacancies
                          </span>
                        )}
                      </div>

                      <Link
                        href={item.slug}
                        className="font-bold text-sm sm:text-base text-slate-900 hover:text-[#013089] transition-colors leading-snug block"
                      >
                        {item.title}
                      </Link>

                      <div className="text-xs text-slate-500 flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        <span>Registration Starts: <strong>{formatDate(item.expectedStartDate)}</strong></span>
                      </div>
                    </div>

                    <Link
                      href={item.slug}
                      className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#013089] hover:bg-[#012169] text-white font-bold text-xs shadow-2xs transition-all shrink-0"
                    >
                      <span>Advance Notice</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center text-sm text-slate-500">
                No future scheduled applications found at this moment.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
