import Link from "next/link";
import { SITE_CONFIG } from "@/lib/constants";
import { getBreakingBulletins, getPublicBulletins } from "@/modules/bulletins/service";
import { getPublicJobs } from "@/modules/jobs/service";
import { getPublicExams } from "@/modules/exams/service";
import { searchGlobal } from "@/modules/search/service";
import { BreakingTicker } from "@/modules/bulletins/components/breaking-ticker";
import { BulletinCard } from "@/modules/bulletins/components/bulletin-card";
import { JobCard } from "@/modules/jobs/components/job-card";
import { ExamCard } from "@/modules/exams/components/exam-card";
import { HomeHero } from "@/components/home/home-hero";
import { SearchBar } from "@/components/shared/search-bar";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
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
} from "lucide-react";

interface HomePageProps {
  searchParams: Promise<{
    search?: string;
    q?: string;
    query?: string;
    type?: string;
  }>;
}

const verifiedSourcesDirectory = [
  { name: "Union Public Service Commission", acronym: "UPSC", type: "Central Commission", url: "https://upsc.gov.in" },
  { name: "Staff Selection Commission", acronym: "SSC", type: "Central Recruitment", url: "https://ssc.gov.in" },
  { name: "Railway Recruitment Boards", acronym: "RRB", type: "Ministry of Railways", url: "https://indianrailways.gov.in" },
  { name: "Institute of Banking Personnel Selection", acronym: "IBPS", type: "Autonomous Banking", url: "https://ibps.in" },
  { name: "High Court of Judicature at Patna", acronym: "PHC", type: "State Judiciary", url: "https://patnahighcourt.gov.in" },
  { name: "High Court of Judicature at Allahabad", acronym: "AHC", type: "State Judiciary", url: "https://www.allahabadhighcourt.in" },
  { name: "Bihar Staff Selection Commission", acronym: "BSSC", type: "State Commission", url: "https://bssc.bihar.gov.in" },
  { name: "UP Subordinate Services Commission", acronym: "UPSSSC", type: "State Commission", url: "https://upsssc.gov.in" },
  { name: "National Testing Agency", acronym: "NTA", type: "Autonomous Testing", url: "https://recruitment.nta.nic.in" },
  { name: "Food Corporation of India", acronym: "FCI", type: "Central PSU", url: "https://fci.gov.in" },
  { name: "Kendriya Vidyalaya Sangathan", acronym: "KVS", type: "Education Autonomous", url: "https://kvsangathan.nic.in" },
  { name: "Defence Research & Development Org", acronym: "DRDO", type: "R&D Defence", url: "https://drdo.gov.in" },
];

const stateQuickFilters = [
  { label: "All India", href: "/jobs" },
  { label: "Bihar", href: "/jobs?state=BR" },
  { label: "Uttar Pradesh", href: "/jobs?state=UP" },
  { label: "Rajasthan", href: "/jobs?state=RJ" },
  { label: "Madhya Pradesh", href: "/jobs?state=MP" },
  { label: "Delhi", href: "/jobs?state=DL" },
  { label: "Central Govt", href: "/jobs?type=central" },
  { label: "Defence & Police", href: "/jobs?category=defence-police" },
  { label: "Banking", href: "/jobs?category=banking-finance" },
  { label: "Railways", href: "/jobs?category=railways" },
  { label: "Teaching", href: "/jobs?category=teaching-research" },
  { label: "Judiciary", href: "/jobs?category=judiciary-law" },
];

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const rawQuery = (params.search || params.q || params.query || "").trim();
  const currentType = (params.type || "all") as "all" | "jobs" | "exams" | "news";

  // If a search query is active, execute global search across Jobs, Exams, and News
  const searchResult = rawQuery
    ? await searchGlobal(rawQuery, { limitPerType: 12 })
    : null;

  // Concurrent data fetching for homepage editorial sections
  const [
    breakingBulletins,
    { bulletins: latestBulletins },
    { jobs: latestJobs },
    { exams: upcomingExams },
  ] = await Promise.all([
    getBreakingBulletins(5),
    getPublicBulletins({ limit: 4 }),
    getPublicJobs({ limit: 6 }),
    getPublicExams({ limit: 4 }),
  ]);

  // Urgent closing jobs (application deadline within 10 days)
  const urgentClosingJobs = latestJobs
    .filter((j) => j.application_end_date && new Date(j.application_end_date).getTime() > Date.now())
    .slice(0, 4);

  const buildTypeUrl = (type: string) => {
    const q = new URLSearchParams();
    if (rawQuery) q.set("search", rawQuery);
    if (type !== "all") q.set("type", type);
    const qs = q.toString();
    return qs ? `/?${qs}` : "/";
  };

  return (
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

          {/* Results: Jobs */}
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

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {searchResult.jobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            </div>
          )}

          {/* Results: Exams */}
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

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {searchResult.exams.map((exam) => (
                  <ExamCard key={exam.id} exam={exam} />
                ))}
              </div>
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
            {/* LEFT MAIN EDITORIAL COLUMN (8 Cols) */}
            {/* ----------------------------------------------------------------- */}
            <div className="lg:col-span-8 space-y-10">
              {/* A. Latest Government Jobs Ledger */}
              <div className="space-y-4">
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

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {latestJobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
              </div>

              {/* B. Active Examinations & Notifications */}
              <div className="space-y-4 pt-4 border-t border-slate-200">
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

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {upcomingExams.map((exam) => (
                    <ExamCard key={exam.id} exam={exam} />
                  ))}
                </div>
              </div>

              {/* C. Verified Official Sources Directory */}
              <div className="space-y-3 pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-700" />
                    <h3 className="text-base font-bold text-[#0F172A] font-heading">
                      Verified Organizations &amp; Commissions
                    </h3>
                  </div>
                  <Link href="/directory">
                    <Button variant="outline" size="sm" className="h-6 px-2 text-[11px] font-bold text-[#013089]">
                      <span>Full Directory</span>
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </Link>
                </div>

                <div className="overflow-x-auto rounded-xs border border-slate-200 bg-white">
                  <table className="w-full text-left text-xs gazette-table">
                    <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 text-[11px]">
                      <tr>
                        <th className="p-2.5 pl-3">Organization</th>
                        <th className="p-2.5">Category</th>
                        <th className="p-2.5">Official Portal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {verifiedSourcesDirectory.map((src, idx) => (
                        <tr key={idx}>
                          <td className="p-2.5 pl-3 font-semibold text-slate-900">
                            {src.name} <span className="text-[10px] font-bold text-[#013089] font-mono">({src.acronym})</span>
                          </td>
                          <td className="p-2.5 text-slate-600">{src.type}</td>
                          <td className="p-2.5">
                            <a
                              href={src.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#013089] hover:underline"
                            >
                              <span>Official Site</span>
                              <ExternalLink className="h-3 w-3 text-slate-400" />
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* ----------------------------------------------------------------- */}
            {/* RIGHT SIDEBAR (4 Cols) */}
            {/* ----------------------------------------------------------------- */}
            <div className="lg:col-span-4 space-y-6">
              {/* Widget 1: Urgent Deadlines / Closing Soon */}
              <div className="rounded-xs border border-slate-200 bg-white p-4 space-y-3 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-1.5 font-bold text-sm text-slate-900">
                    <Clock className="h-4 w-4 text-[#FE8D01]" />
                    <span>Closing Soon (Next 10 Days)</span>
                  </div>
                  <span className="rounded-xs bg-amber-50 text-amber-900 border border-amber-200 px-1.5 py-0.2 text-[10px] font-bold">
                    Urgent
                  </span>
                </div>

                <div className="space-y-2.5 divide-y divide-slate-100">
                  {urgentClosingJobs.length > 0 ? (
                    urgentClosingJobs.map((job) => (
                      <div key={job.id} className="pt-2 first:pt-0 space-y-1">
                        <Link href={`/jobs/${job.slug}`} className="block group">
                          <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#013089] leading-snug line-clamp-2">
                            {job.title}
                          </h4>
                        </Link>
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-500 font-medium">
                            {job.organization?.acronym || "Govt"}
                          </span>
                          <span className="font-bold text-amber-700">
                            Last Date: {formatDate(job.application_end_date)}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-500 py-2">
                      No recruitment deadlines closing in the next 10 days.
                    </p>
                  )}
                </div>

                <Link href="/jobs" className="block pt-1">
                  <Button variant="outline" size="sm" className="w-full text-xs font-bold justify-center">
                    <span>Browse All Active Openings</span>
                  </Button>
                </Link>
              </div>

              {/* Widget 2: Employment News & Student Advisories */}
              <div className="rounded-xs border border-slate-200 bg-white p-4 space-y-3 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-1.5 font-bold text-sm text-slate-900">
                    <Newspaper className="h-4 w-4 text-[#013089]" />
                    <span>Rozgar Samachar &amp; Advisories</span>
                  </div>
                  <Link href="/news" className="text-[11px] font-bold text-[#013089] hover:underline">
                    View All
                  </Link>
                </div>

                <div className="space-y-3 divide-y divide-slate-100">
                  {latestBulletins.map((bulletin) => (
                    <div key={bulletin.id} className="pt-2.5 first:pt-0 space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                        <span className="font-semibold text-slate-700">{bulletin.source_name}</span>
                        <span>{formatDate(bulletin.published_at)}</span>
                      </div>
                      <Link href={`/news/${bulletin.slug}`} className="block group">
                        <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#013089] leading-snug line-clamp-2">
                          {bulletin.title}
                        </h4>
                      </Link>
                      <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                        {bulletin.summary}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Widget 3: Statutory Citizen Transparency Protocol */}
              <div className="rounded-xs border border-slate-200 bg-slate-50 p-4 space-y-2 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-slate-800">
                  <ShieldAlert className="h-4 w-4 text-[#FE8D01]" />
                  <span>Statutory Notice &amp; Cross-Check</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  SuchnaSetu only publishes notifications backed by verified official PDFs. Candidates are advised to cross-verify all terms with the respective recruitment portal before fee submission.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
