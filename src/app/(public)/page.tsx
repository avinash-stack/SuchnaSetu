import Link from "next/link";
import { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/constants";
import { constructMetadata, buildWebSiteJsonLd, buildSuchnaSetuOrgJsonLd } from "@/lib/seo";

export const revalidate = 120; // Revalidate homepage every 2 minutes for high performance and fresh data
import { INDIAN_STATES } from "@/lib/constants/states";
import { getBreakingBulletins, getPublicBulletins } from "@/modules/bulletins/service";
import { getPublicJobs } from "@/modules/jobs/service";
import { getPublicExams } from "@/modules/exams/service";
import { getPublicAdmitCards } from "@/modules/admit-cards/service";
import { getPublicResults } from "@/modules/results/service";
import { searchGlobal } from "@/modules/search/service";
import {
  getTodaysUpdates,
  getComingSoonItems,
  getAnswerKeys,
  getOfficialSyllabi,
} from "@/modules/home/dynamic-sections";
import { BreakingTicker } from "@/modules/bulletins/components/breaking-ticker";
import { BulletinCard } from "@/modules/bulletins/components/bulletin-card";
import { JobListTable } from "@/modules/jobs/components/job-list-table";
import { ExamListTable } from "@/modules/exams/components/exam-list-table";
import { HomeHero } from "@/components/home/home-hero";
import { TodaysUpdatesSection } from "@/components/home/todays-updates-section";
import { ComingSoonSection } from "@/components/home/coming-soon-section";
import { AnswerKeySection } from "@/components/home/answer-key-section";
import { SyllabusSection } from "@/components/home/syllabus-section";
import { SearchBar } from "@/components/shared/search-bar";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Briefcase,
  Calendar,
  ShieldCheck,
  ExternalLink,
  Building,
  ArrowRight,
  Newspaper,
  Flame,
  Search,
  X,
  Clock,
  CheckCircle2,
  ShieldAlert,
  ChevronRight,
  MapPin,
  Sparkles,
  Award,
  FileText,
  Download,
  FileCheck2,
  CreditCard,
  BookOpen,
  KeyRound,
  Hourglass,
} from "lucide-react";

interface HomePageProps {
  searchParams: Promise<{
    search?: string;
    q?: string;
    query?: string;
    type?: string;
  }>;
}

export async function generateMetadata({ searchParams }: HomePageProps): Promise<Metadata> {
  const params = await searchParams;
  const rawQuery = (params.search || params.q || params.query || "").trim();

  if (rawQuery) {
    return constructMetadata({
      title: `Search: "${rawQuery}" - Government Jobs & Exams`,
      description: `Search results for "${rawQuery}" across verified Central, State, and PSU recruitment notifications on SuchnaSetu.`,
      path: `/?search=${encodeURIComponent(rawQuery)}`,
      noIndex: true, // Prevent indexing search query permutations
    });
  }

  return constructMetadata({
    title: "SuchnaSetu - Government Jobs, Government Exams, Notifications, Answer Keys & Syllabus 2026",
    description: "Verified civic public information aggregator. Access authentic Central & State government job notifications, UPSC, SSC, Railways, PSC exams, syllabus, answer keys, admit cards, and official gazettes.",
    path: "/",
    keywords: [
      "Government Jobs 2026",
      "Sarkari Naukri 2026",
      "Government Exams Notification",
      "Official Answer Key 2026",
      "Exam Syllabus 2026",
      "Admit Card Download",
      "SuchnaSetu",
    ],
  });
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const rawQuery = (params.search || params.q || params.query || "").trim();
  const currentType = (params.type || "all") as "all" | "jobs" | "exams" | "news";

  // If a search query is active, execute global search across Jobs, Exams, and News
  const searchResult = rawQuery
    ? await searchGlobal(rawQuery, { limitPerType: 12 })
    : null;

  // Concurrent data fetching for homepage editorial and dynamic sections
  const [
    breakingBulletins,
    { bulletins: latestBulletins },
    { jobs: latestJobs },
    { exams: upcomingExams },
    { admitCards: latestAdmitCards },
    { results: latestResults },
    todaysUpdates,
    comingSoonItems,
    answerKeys,
    officialSyllabi,
  ] = await Promise.all([
    getBreakingBulletins(5),
    getPublicBulletins({ limit: 7 }),
    getPublicJobs({ limit: 8 }),
    getPublicExams({ limit: 6 }),
    getPublicAdmitCards({ limit: 7 }),
    getPublicResults({ limit: 6 }),
    getTodaysUpdates(),
    getComingSoonItems(),
    getAnswerKeys(),
    getOfficialSyllabi(6),
  ]);

  // Urgent closing jobs (application deadline within 10 days, max 7 items)
  const urgentClosingJobs = latestJobs
    .filter((j) => j.application_end_date && new Date(j.application_end_date).getTime() > Date.now())
    .slice(0, 7);

  const buildTypeUrl = (type: string) => {
    const q = new URLSearchParams();
    if (rawQuery) q.set("search", rawQuery);
    if (type !== "all") q.set("type", type);
    const qs = q.toString();
    return qs ? `/?${qs}` : "/";
  };

  const webSiteJsonLd = buildWebSiteJsonLd();
  const orgJsonLd = buildSuchnaSetuOrgJsonLd();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />

      <div className="space-y-8 pb-16">
        {/* 1. Breaking Bulletin Ticker */}
      {breakingBulletins.length > 0 && (
        <BreakingTicker bulletins={breakingBulletins} />
      )}

      {/* 2. Multilingual Editorial Search Header & State Switcher Strip */}
      <HomeHero />

      {/* ========================================================================= */}
      {/* 3. ACTIVE SEARCH RESULTS VIEW (Shown when user searches) */}
      {/* ========================================================================= */}
      {searchResult && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Active Search Summary Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xs border-l-4 border-[#FE8D01] bg-white p-4 border border-slate-200 shadow-xs">
            <div>
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-[#013089]" />
                <h2 className="text-lg font-bold text-slate-900 font-heading">
                  Search Results for &ldquo;{rawQuery}&rdquo;
                </h2>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Found <span className="font-bold text-slate-900">{searchResult.totalCount}</span> verified notices across Government Jobs, Examinations, and Public News.
              </p>
            </div>

            <Link href="/">
              <Button variant="outline" size="sm" className="gap-1 text-xs font-semibold">
                <X className="h-3.5 w-3.5" />
                <span>Clear Search</span>
              </Button>
            </Link>
          </div>

          {/* Section Navigation Tabs */}
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
            <Link
              href={buildTypeUrl("all")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xs transition-colors ${
                currentType === "all"
                  ? "bg-[#013089] text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
              }`}
            >
              <span>All Results</span>
              <span className={`px-1.5 py-0.2 rounded-xs text-[10px] ${currentType === "all" ? "bg-white/20 text-white" : "bg-slate-200 text-slate-800"}`}>
                {searchResult.totalCount}
              </span>
            </Link>

            <Link
              href={buildTypeUrl("jobs")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xs transition-colors ${
                currentType === "jobs"
                  ? "bg-[#013089] text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
              }`}
            >
              <Briefcase className="h-3.5 w-3.5" />
              <span>Govt Jobs</span>
              <span className={`px-1.5 py-0.2 rounded-xs text-[10px] ${currentType === "jobs" ? "bg-white/20 text-white" : "bg-slate-200 text-slate-800"}`}>
                {searchResult.counts.jobs}
              </span>
            </Link>

            <Link
              href={buildTypeUrl("exams")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xs transition-colors ${
                currentType === "exams"
                  ? "bg-[#013089] text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
              }`}
            >
              <Calendar className="h-3.5 w-3.5" />
              <span>Examinations</span>
              <span className={`px-1.5 py-0.2 rounded-xs text-[10px] ${currentType === "exams" ? "bg-white/20 text-white" : "bg-slate-200 text-slate-800"}`}>
                {searchResult.counts.exams}
              </span>
            </Link>

            <Link
              href={buildTypeUrl("news")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xs transition-colors ${
                currentType === "news"
                  ? "bg-[#013089] text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
              }`}
            >
              <Newspaper className="h-3.5 w-3.5" />
              <span>Employment News</span>
              <span className={`px-1.5 py-0.2 rounded-xs text-[10px] ${currentType === "news" ? "bg-white/20 text-white" : "bg-slate-200 text-slate-800"}`}>
                {searchResult.counts.bulletins}
              </span>
            </Link>
          </div>

          {/* Zero Results State */}
          {searchResult.totalCount === 0 && (
            <div className="rounded-xs border border-slate-200 bg-white p-10 text-center space-y-3">
              <Search className="h-10 w-10 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-900 font-heading">
                No matching notices found for &ldquo;{rawQuery}&rdquo;
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Try searching by commission name (<span className="font-semibold text-slate-700">UPSC, SSC, BSSC, RRB, Patna High Court</span>), post type (<span className="font-semibold text-slate-700">Assistant, Constable, Teacher, Engineer</span>), or state (<span className="font-semibold text-slate-700">Bihar, UP, Rajasthan</span>).
              </p>
              <div className="flex flex-wrap justify-center gap-2 pt-2">
                <Link href="/?search=Bihar+Govt+Job">
                  <Button variant="outline" size="sm" className="text-xs">Bihar Govt Jobs</Button>
                </Link>
                <Link href="/?search=UPSC">
                  <Button variant="outline" size="sm" className="text-xs">UPSC Notices</Button>
                </Link>
                <Link href="/?search=Banking">
                  <Button variant="outline" size="sm" className="text-xs">Banking Jobs</Button>
                </Link>
                <Link href="/?search=Patna+High+Court">
                  <Button variant="outline" size="sm" className="text-xs">Patna High Court</Button>
                </Link>
              </div>
            </div>
          )}

          {/* Results: Jobs (List View) */}
          {(currentType === "all" || currentType === "jobs") && searchResult.jobs.length > 0 && (
            <div className="space-y-3">
              <div className="section-saffron-bar flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 font-heading">
                  Government Jobs &amp; Vacancies ({searchResult.counts.jobs})
                </h3>
                <Link href={`/jobs?search=${encodeURIComponent(rawQuery)}`} className="text-xs font-bold text-[#013089] hover:underline">
                  View all in Jobs section &rarr;
                </Link>
              </div>

              <JobListTable jobs={searchResult.jobs as any} />
            </div>
          )}

          {/* Results: Exams (List View) */}
          {(currentType === "all" || currentType === "exams") && searchResult.exams.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-slate-200">
              <div className="section-saffron-bar flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 font-heading">
                  Examinations &amp; Schedules ({searchResult.counts.exams})
                </h3>
                <Link href={`/exams?search=${encodeURIComponent(rawQuery)}`} className="text-xs font-bold text-[#013089] hover:underline">
                  View all in Exams section &rarr;
                </Link>
              </div>

              <ExamListTable exams={searchResult.exams as any} />
            </div>
          )}

          {/* Results: News */}
          {(currentType === "all" || currentType === "news") && searchResult.bulletins.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-slate-200">
              <div className="section-saffron-bar flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 font-heading">
                  Employment News &amp; Advisories ({searchResult.counts.bulletins})
                </h3>
                <Link href={`/news?search=${encodeURIComponent(rawQuery)}`} className="text-xs font-bold text-[#013089] hover:underline">
                  View all in News desk &rarr;
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {searchResult.bulletins.map((bulletin) => (
                  <BulletinCard key={bulletin.id} bulletin={bulletin} />
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* ========================================================================= */}
      {/* 4. MAIN EDITORIAL HOMEPAGE (8 Cols Left Feed + 4 Cols Right Sidebar) */}
      {/* ========================================================================= */}
      {!searchResult && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* ----------------------------------------------------------------- */}
            {/* LEFT MAIN EDITORIAL COLUMN (8 Cols) - High-Density List Views */}
            {/* ----------------------------------------------------------------- */}
            <div className="lg:col-span-8 space-y-10">
              {/* A. Latest Government Jobs Ledger (List View Table) */}
              <div className="space-y-3">
                <div className="section-saffron-bar flex items-center justify-between border-b border-slate-200 pb-2">
                  <div>
                    <h2 className="text-xl font-bold text-[#0F172A] font-heading">
                      Latest Government Job Notifications
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Verified public recruitment circulars with official notification numbers &amp; PDFs.
                    </p>
                  </div>

                  <Link href="/jobs">
                    <Button variant="outline" size="sm" className="h-7 text-xs font-bold text-[#013089] border-[#013089]/30">
                      <span>View All Jobs</span>
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </Link>
                </div>

                <JobListTable jobs={latestJobs} />
              </div>

              {/* DYNAMIC SECTION: COMING SOON (List View Table) */}
              <ComingSoonSection items={comingSoonItems} />

              {/* B. Active Examinations & Schedules (List View Table) */}
              <div className="space-y-3 pt-4 border-t border-slate-200">
                <div className="section-navy-bar flex items-center justify-between border-b border-slate-200 pb-2">
                  <div>
                    <h2 className="text-xl font-bold text-[#0F172A] font-heading">
                      Official Examination Calendar &amp; Schedules
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Key state &amp; central commission exam schedules, stages, and admit card dates.
                    </p>
                  </div>

                  <Link href="/exams">
                    <Button variant="outline" size="sm" className="h-7 text-xs font-bold text-[#013089] border-[#013089]/30">
                      <span>All Exam Schedules</span>
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </Link>
                </div>

                <ExamListTable exams={upcomingExams} />
              </div>

              {/* DYNAMIC SECTION: ANSWER KEYS (List View Table) */}
              <AnswerKeySection items={answerKeys} />

              {/* C. Latest Results & Merit Lists (List View Table) */}
              <div className="space-y-3 pt-4 border-t border-slate-200">
                <div className="section-navy-bar flex items-center justify-between border-b border-slate-200 pb-2">
                  <div>
                    <h2 className="text-xl font-bold text-[#0F172A] font-heading">
                      Latest Examination Results &amp; Merit Lists
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Scorecards, cutoffs, and selection recommendations from official commission gazettes.
                    </p>
                  </div>

                  <Link href="/results">
                    <Button variant="outline" size="sm" className="h-7 text-xs font-bold text-[#013089] border-[#013089]/30">
                      <span>View All Results</span>
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </Link>
                </div>

                <div className="w-full rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
                  {/* Desktop & Tablet View */}
                  <div className="hidden sm:block overflow-x-auto">
                    <table className="w-full text-left border-collapse table-fixed min-w-[620px] sm:min-w-0">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-100/90 text-xs sm:text-[13px] font-bold uppercase tracking-wider text-slate-700">
                          <th className="py-3.5 px-4 w-[20%]">Authority</th>
                          <th className="py-3.5 px-4 w-[44%]">Examination / Result Title</th>
                          <th className="py-3.5 px-4 w-[14%]">Status</th>
                          <th className="py-3.5 px-4 w-[22%] text-right">Gazette / Score</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-800">
                        {latestResults.map((res) => (
                          <tr key={res.id} className="hover:bg-slate-50/90 transition-colors group">
                            {/* Organization */}
                            <td className="py-4 px-4 align-top">
                              <div className="flex flex-col gap-1">
                                <span className="font-bold text-sm sm:text-[15px] text-[#013089] group-hover:underline truncate block">
                                  {res.organization?.acronym || res.organization?.name || "Official Body"}
                                </span>
                                <span className="text-xs text-slate-500 truncate block">
                                  {res.state_code || "National"}
                                </span>
                              </div>
                            </td>

                            {/* Result Title */}
                            <td className="py-4 px-4 align-top">
                              <Link
                                href={`/jobs/${res.slug}`}
                                className="font-bold text-[15px] sm:text-base text-slate-900 hover:text-[#013089] transition-colors leading-snug line-clamp-2 block"
                                title={res.title}
                              >
                                {res.title}
                              </Link>
                            </td>

                            {/* Status */}
                            <td className="py-4 px-4 align-top">
                              <span className="inline-flex items-center text-xs text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                Declared
                              </span>
                            </td>

                            {/* Action */}
                            <td className="py-4 px-4 align-top text-right whitespace-nowrap">
                              {res.result_url ? (
                                <a
                                  href={res.result_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center justify-center font-bold rounded-lg h-8 px-3 text-xs bg-emerald-700 hover:bg-emerald-800 text-white transition-all shadow-2xs gap-1.5 shrink-0"
                                >
                                  <FileCheck2 className="h-3.5 w-3.5 shrink-0" />
                                  <span>Gazette</span>
                                  <ExternalLink className="h-3 w-3 shrink-0" />
                                </a>
                              ) : (
                                <Link
                                  href={`/jobs/${res.slug}`}
                                  className="inline-flex items-center gap-1 text-xs sm:text-[13px] font-bold text-[#013089] hover:underline"
                                >
                                  <span>Details</span>
                                  <ArrowRight className="h-3.5 w-3.5" />
                                </Link>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Stacked List View */}
                  <div className="sm:hidden divide-y divide-slate-100">
                    {latestResults.map((res) => (
                      <div key={res.id} className="p-4 space-y-2.5 hover:bg-slate-50/80 transition-colors">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-xs text-[#013089] bg-brand-50 px-2 py-0.5 rounded border border-brand-100 truncate">
                            {res.organization?.acronym || "Official"}
                          </span>
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            Declared
                          </span>
                        </div>

                        <Link
                          href={`/jobs/${res.slug}`}
                          className="block font-bold text-[15px] text-slate-900 hover:text-[#013089] transition-colors leading-snug line-clamp-2"
                        >
                          {res.title}
                        </Link>

                        <div className="pt-2 border-t border-slate-100 flex justify-end">
                          {res.result_url ? (
                            <a
                              href={res.result_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 font-bold text-xs text-emerald-700 hover:underline"
                            >
                              <FileCheck2 className="h-3.5 w-3.5" />
                              <span>View Gazette</span>
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          ) : (
                            <Link
                              href={`/jobs/${res.slug}`}
                              className="inline-flex items-center gap-1 font-bold text-xs text-[#013089] hover:underline"
                            >
                              <span>View Details</span>
                              <ArrowRight className="h-3 w-3" />
                            </Link>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* DYNAMIC SECTION: SYLLABUS (List View Table) */}
              <SyllabusSection items={officialSyllabi} />
            </div>

            {/* ----------------------------------------------------------------- */}
            {/* RIGHT SIDEBAR (4 Cols) - Spacious & Legible */}
            {/* ----------------------------------------------------------------- */}
            <div className="lg:col-span-4 space-y-6">
              {/* Widget 1: TODAY'S UPDATES (Max 7 links) */}
              <TodaysUpdatesSection items={todaysUpdates} />

              {/* Widget 2: LATEST ADMIT CARDS & HALL TICKETS */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 space-y-4 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-[#013089]">
                      <CreditCard className="h-4 w-4 text-[#013089]" />
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 font-heading">
                      Admit Cards &amp; Hall Tickets
                    </h3>
                  </div>
                  <Link
                    href="/admit-cards"
                    className="text-xs sm:text-sm font-semibold text-[#013089] hover:underline inline-flex items-center gap-0.5"
                  >
                    <span>View All</span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>

                <div className="divide-y divide-slate-100 -mx-1">
                  {latestAdmitCards.length > 0 ? (
                    latestAdmitCards.slice(0, 7).map((ac) => (
                      <div
                        key={ac.id}
                        className="py-3 px-2 hover:bg-slate-50 rounded-lg transition-colors flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <Badge
                            variant="brand"
                            className="text-xs font-bold py-0.5 px-2 shrink-0 bg-[#013089] text-white rounded"
                          >
                            {ac.organization?.acronym || "EXAM"}
                          </Badge>
                          <Link
                            href={`/exams/${ac.slug}`}
                            className="text-sm sm:text-[14.5px] font-semibold text-slate-800 hover:text-[#013089] transition-colors truncate block leading-snug"
                            title={ac.title}
                          >
                            {ac.title}
                          </Link>
                        </div>

                        {ac.admit_card_url ? (
                          <a
                            href={ac.admit_card_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-bold text-[#013089] hover:underline shrink-0 whitespace-nowrap bg-blue-50 px-2.5 py-1 rounded"
                          >
                            <span>Download</span>
                            <Download className="h-3.5 w-3.5" />
                          </a>
                        ) : (
                          <span className="text-xs text-slate-400 font-mono shrink-0 whitespace-nowrap">
                            {ac.state_code || "National"}
                          </span>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-xs sm:text-sm text-slate-500 py-3 px-2 text-center">
                      No new admit cards released today.
                    </p>
                  )}
                </div>
              </div>

              {/* Widget 3: Urgent Deadlines / Closing Soon */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 space-y-4 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 text-amber-700">
                      <Clock className="h-4 w-4 text-[#FE8D01]" />
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 font-heading">
                      Closing Soon (Next 10 Days)
                    </h3>
                  </div>
                  <Link
                    href="/jobs"
                    className="text-xs sm:text-sm font-semibold text-[#013089] hover:underline inline-flex items-center gap-0.5"
                  >
                    <span>View All</span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>

                <div className="divide-y divide-slate-100 -mx-1">
                  {urgentClosingJobs.length > 0 ? (
                    urgentClosingJobs.slice(0, 7).map((job) => (
                      <div
                        key={job.id}
                        className="py-3 px-2 hover:bg-slate-50 rounded-lg transition-colors flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <Badge
                            variant="secondary"
                            className="text-xs font-bold py-0.5 px-2 shrink-0 text-slate-700 bg-slate-100 rounded"
                          >
                            {job.organization?.acronym || "GOVT"}
                          </Badge>
                          <Link
                            href={`/jobs/${job.slug}`}
                            className="text-sm sm:text-[14.5px] font-semibold text-slate-800 hover:text-[#013089] transition-colors truncate block leading-snug"
                            title={job.title}
                          >
                            {job.title}
                          </Link>
                        </div>
                        <span className="text-xs font-bold text-amber-700 shrink-0 whitespace-nowrap font-mono">
                          {formatDate(job.application_end_date)}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs sm:text-sm text-slate-500 py-3 px-2 text-center">
                      No recruitment deadlines closing in the next 10 days.
                    </p>
                  )}
                </div>
              </div>

              {/* Widget 4: Rozgar Samachar & Advisories */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 space-y-4 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-[#013089]">
                      <Newspaper className="h-4 w-4 text-[#013089]" />
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 font-heading">
                      Rozgar Samachar &amp; Advisories
                    </h3>
                  </div>
                  <Link
                    href="/news"
                    className="text-xs sm:text-sm font-semibold text-[#013089] hover:underline inline-flex items-center gap-0.5"
                  >
                    <span>View All</span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>

                <div className="divide-y divide-slate-100 -mx-1">
                  {latestBulletins.slice(0, 7).map((bulletin) => (
                    <div
                      key={bulletin.id}
                      className="py-3 px-2 hover:bg-slate-50 rounded-lg transition-colors flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <Badge
                          variant="brand"
                          className="text-xs font-bold py-0.5 px-2 shrink-0 bg-rose-600 text-white rounded"
                        >
                          {bulletin.source_name
                            ? bulletin.source_name.length > 8
                              ? bulletin.source_name.slice(0, 8)
                              : bulletin.source_name
                            : "NEWS"}
                        </Badge>
                        <Link
                          href={`/news/${bulletin.slug}`}
                          className="text-sm sm:text-[14.5px] font-semibold text-slate-800 hover:text-[#013089] transition-colors truncate block leading-snug"
                          title={bulletin.title}
                        >
                          {bulletin.title}
                        </Link>
                      </div>
                      <span className="text-xs text-slate-500 font-medium shrink-0 whitespace-nowrap">
                        {formatDate(bulletin.published_at)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Widget 5: Statutory Citizen Transparency Protocol */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 space-y-2.5 text-xs sm:text-sm">
                <div className="flex items-center gap-2 font-bold text-slate-800">
                  <ShieldAlert className="h-4.5 w-4.5 text-[#FE8D01]" />
                  <span>Statutory Notice &amp; Cross-Check</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  SuchnaSetu only publishes notifications backed by verified official PDFs. Candidates are advised to cross-verify all terms with the respective recruitment portal before fee submission.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* CRAWLABLE SEARCH ENGINE DIRECTORY & INTERNAL LINKING MATRIX */}
      {/* ========================================================================= */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xs space-y-6" aria-label="Quick Directory">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 font-heading">
              Government Recruitment &amp; Public Examinations Hub
            </h2>
            <p className="text-xs text-slate-500">
              Explore state-wise recruitment portals, central commissions, and verified civic notice archives across India.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
            {/* Column 1: Major States */}
            <div className="space-y-2.5">
              <h3 className="font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                <MapPin className="h-3.5 w-3.5 text-[#013089]" />
                <span>State Government Jobs</span>
              </h3>
              <ul className="space-y-1.5">
                {INDIAN_STATES.slice(0, 8).map((st) => (
                  <li key={st.code}>
                    <Link
                      href={`/state/${st.code.toLowerCase()}`}
                      className="text-slate-600 hover:text-[#013089] hover:underline flex items-center justify-between"
                    >
                      <span>{st.name} Govt Jobs</span>
                      <span className="text-[10px] text-slate-400 font-mono">{st.pscAcronym}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2: More States */}
            <div className="space-y-2.5">
              <h3 className="font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                <MapPin className="h-3.5 w-3.5 text-[#013089]" />
                <span>Regional Recruitment</span>
              </h3>
              <ul className="space-y-1.5">
                {INDIAN_STATES.slice(8, 16).map((st) => (
                  <li key={st.code}>
                    <Link
                      href={`/state/${st.code.toLowerCase()}`}
                      className="text-slate-600 hover:text-[#013089] hover:underline flex items-center justify-between"
                    >
                      <span>{st.name} Govt Jobs</span>
                      <span className="text-[10px] text-slate-400 font-mono">{st.pscAcronym}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Central Authorities & Commissions */}
            <div className="space-y-2.5">
              <h3 className="font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                <Building className="h-3.5 w-3.5 text-[#013089]" />
                <span>Central Commissions</span>
              </h3>
              <ul className="space-y-1.5">
                {[
                  { name: "Union Public Service Commission", acronym: "UPSC" },
                  { name: "Staff Selection Commission", acronym: "SSC" },
                  { name: "Railway Recruitment Boards", acronym: "RRB" },
                  { name: "Institute of Banking Personnel", acronym: "IBPS" },
                  { name: "State Bank of India", acronym: "SBI" },
                  { name: "Defence Research & Dev (DRDO)", acronym: "DRDO" },
                  { name: "National Testing Agency", acronym: "NTA" },
                  { name: "Border Security Force", acronym: "BSF" },
                ].map((auth) => (
                  <li key={auth.acronym}>
                    <Link
                      href={`/authorities/${auth.acronym.toLowerCase()}`}
                      className="text-slate-600 hover:text-[#013089] hover:underline flex items-center justify-between"
                    >
                      <span className="truncate max-w-[150px]">{auth.name}</span>
                      <span className="text-[10px] font-bold text-[#013089] bg-brand-50 px-1.5 py-0.2 rounded">
                        {auth.acronym}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Key Service Hubs */}
            <div className="space-y-2.5">
              <h3 className="font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                <Sparkles className="h-3.5 w-3.5 text-[#013089]" />
                <span>Civic Portals</span>
              </h3>
              <ul className="space-y-1.5">
                <li>
                  <Link href="/todays-updates" className="text-slate-600 hover:text-[#013089] hover:underline flex items-center gap-1.5">
                    <Sparkles className="h-3 w-3 text-red-500" />
                    <span>Today&apos;s Updates (Live Feed)</span>
                  </Link>
                </li>
                <li>
                  <Link href="/coming-soon" className="text-slate-600 hover:text-[#013089] hover:underline flex items-center gap-1.5">
                    <Hourglass className="h-3 w-3 text-amber-500" />
                    <span>Coming Soon / Advance Notices</span>
                  </Link>
                </li>
                <li>
                  <Link href="/answer-keys" className="text-slate-600 hover:text-[#013089] hover:underline flex items-center gap-1.5">
                    <KeyRound className="h-3 w-3 text-teal-600" />
                    <span>Official Answer Keys</span>
                  </Link>
                </li>
                <li>
                  <Link href="/syllabus" className="text-slate-600 hover:text-[#013089] hover:underline flex items-center gap-1.5">
                    <BookOpen className="h-3 w-3 text-blue-600" />
                    <span>Exam Patterns &amp; Syllabi</span>
                  </Link>
                </li>
                <li>
                  <Link href="/admit-cards" className="text-slate-600 hover:text-[#013089] hover:underline flex items-center gap-1.5">
                    <Download className="h-3 w-3 text-indigo-600" />
                    <span>Admit Cards &amp; Hall Tickets</span>
                  </Link>
                </li>
                <li>
                  <Link href="/results" className="text-slate-600 hover:text-[#013089] hover:underline flex items-center gap-1.5">
                    <Award className="h-3 w-3 text-emerald-600" />
                    <span>Results &amp; Merit Gazettes</span>
                  </Link>
                </li>
                <li>
                  <Link href="/news" className="text-slate-600 hover:text-[#013089] hover:underline flex items-center gap-1.5">
                    <Newspaper className="h-3 w-3 text-rose-600" />
                    <span>Employment News &amp; PIB</span>
                  </Link>
                </li>
                <li>
                  <Link href="/directory" className="text-slate-600 hover:text-[#013089] hover:underline flex items-center gap-1.5">
                    <Building className="h-3 w-3 text-slate-600" />
                    <span>Verified Organization Directory</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}
