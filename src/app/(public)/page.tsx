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
import { RightActionPanel } from "@/components/home/right-action-panel";
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
      {/* ========================================================================= */}
      {/* 4. MAIN EDITORIAL HOMEPAGE (8 Cols Left Feed + 4 Cols Right Action Panel) */}
      {/* ========================================================================= */}
      {!searchResult && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
            {/* ----------------------------------------------------------------- */}
            {/* LEFT MAIN DISCOVERY COLUMN (8 Cols / ~70%) - High-Density Single-Line Rows */}
            {/* ----------------------------------------------------------------- */}
            <div className="lg:col-span-8 space-y-6">
              {/* A. Latest Government Jobs (Single-Line Compact Rows) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between border-b border-slate-200/90 pb-1.5">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-[#013089]" />
                    <h2 className="text-base sm:text-lg font-bold text-[#0F172A] font-heading">
                      Latest Government Job Notifications
                    </h2>
                  </div>

                  <Link href="/jobs" className="text-xs font-bold text-[#013089] hover:underline flex items-center gap-0.5">
                    <span>View All ({latestJobs.length}+)</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>

                <JobListTable jobs={latestJobs} />
              </div>

              {/* B. Active Examination Schedules (Single-Line Compact Rows) */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between border-b border-slate-200/90 pb-1.5">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-[#013089]" />
                    <h2 className="text-base sm:text-lg font-bold text-[#0F172A] font-heading">
                      Official Examination Calendar &amp; Schedules
                    </h2>
                  </div>

                  <Link href="/exams" className="text-xs font-bold text-[#013089] hover:underline flex items-center gap-0.5">
                    <span>All Schedules</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>

                <ExamListTable exams={upcomingExams} />
              </div>

              {/* C. Rozgar Samachar & Verified Bulletins (High-Density List) */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between border-b border-slate-200/90 pb-1.5">
                  <div className="flex items-center gap-2">
                    <Newspaper className="h-4 w-4 text-[#013089]" />
                    <h2 className="text-base sm:text-lg font-bold text-[#0F172A] font-heading">
                      Rozgar Samachar &amp; Gazette Advisories
                    </h2>
                  </div>

                  <Link href="/news" className="text-xs font-bold text-[#013089] hover:underline flex items-center gap-0.5">
                    <span>All News</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>

                <div className="w-full rounded-xl border border-slate-200/90 bg-white shadow-2xs divide-y divide-slate-100 overflow-hidden">
                  {latestBulletins.slice(0, 5).map((bulletin) => (
                    <Link
                      key={bulletin.id}
                      href={`/news/${bulletin.slug}`}
                      className="group flex flex-col sm:flex-row sm:items-center justify-between py-2.5 px-3.5 sm:px-4 hover:bg-slate-50/90 transition-colors gap-1 sm:gap-4 text-sm"
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <span className="font-bold text-slate-900 group-hover:text-[#013089] transition-colors leading-snug line-clamp-1">
                          {bulletin.title}
                        </span>
                      </div>

                      <div className="flex items-center gap-2.5 shrink-0 text-xs">
                        <span className="font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded text-[11px]">
                          {bulletin.source_name || "GAZETTE"}
                        </span>
                        <span className="text-slate-500 font-mono text-[11.5px] whitespace-nowrap">
                          {formatDate(bulletin.published_at)}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* ----------------------------------------------------------------- */}
            {/* RIGHT ACTION PANEL (4 Cols / ~30%) - Visible Above The Fold */}
            {/* ----------------------------------------------------------------- */}
            <div className="lg:col-span-4 space-y-4">
              <RightActionPanel
                admitCards={latestAdmitCards}
                results={latestResults}
                answerKeys={answerKeys}
                officialSyllabi={officialSyllabi}
                comingSoonItems={comingSoonItems}
              />

              {/* Statutory Citizen Transparency Protocol Card */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3.5 space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center gap-1.5 font-bold text-slate-800">
                  <ShieldCheck className="h-4 w-4 text-emerald-700" />
                  <span>Verified Civic Gazette Protocol</span>
                </div>
                <p className="text-[11.5px] leading-relaxed">
                  All notifications, schedules, and answer keys are backed by official PDFs from respective government recruiting commissions.
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
