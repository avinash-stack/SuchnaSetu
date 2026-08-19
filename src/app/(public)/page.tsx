import Link from "next/link";
import { SITE_CONFIG, SYSTEM_MODULES } from "@/lib/constants";
import { getBreakingBulletins, getPublicBulletins } from "@/modules/bulletins/service";
import { searchGlobal } from "@/modules/search/service";
import { BreakingTicker } from "@/modules/bulletins/components/breaking-ticker";
import { BulletinCard } from "@/modules/bulletins/components/bulletin-card";
import { JobCard } from "@/modules/jobs/components/job-card";
import { ExamCard } from "@/modules/exams/components/exam-card";
import { SearchBar } from "@/components/shared/search-bar";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  ShieldCheck,
  Briefcase,
  Calendar,
  Award,
  FileText,
  ShieldAlert,
  GraduationCap,
  FileSpreadsheet,
  Layers,
  Bell,
  CheckCircle2,
  ExternalLink,
  Building,
  Sparkles,
  ArrowRight,
  Database,
  Lock,
  Newspaper,
  Flame,
  Search,
  X,
  HelpCircle,
  Filter,
} from "lucide-react";

interface HomePageProps {
  searchParams: Promise<{
    search?: string;
    q?: string;
    query?: string;
    type?: string;
  }>;
}

const moduleIcons: Record<string, React.ReactNode> = {
  jobs: <Briefcase className="h-6 w-6 text-brand-600" />,
  exams: <Calendar className="h-6 w-6 text-blue-600" />,
  results: <Award className="h-6 w-6 text-emerald-600" />,
  admit_cards: <FileText className="h-6 w-6 text-purple-600" />,
  schemes: <ShieldCheck className="h-6 w-6 text-amber-600" />,
  scholarships: <GraduationCap className="h-6 w-6 text-indigo-600" />,
  tenders: <FileSpreadsheet className="h-6 w-6 text-teal-600" />,
  circulars: <Layers className="h-6 w-6 text-cyan-600" />,
  public_notices: <Bell className="h-6 w-6 text-rose-600" />,
};

const benchmarkSources = [
  { name: "Union Public Service Commission (UPSC)", type: "Central Commission", url: "https://upsc.gov.in" },
  { name: "Staff Selection Commission (SSC)", type: "Central Recruitment", url: "https://ssc.gov.in" },
  { name: "Institute of Banking Personnel Selection (IBPS)", type: "Autonomous Banking", url: "https://ibps.in" },
  { name: "Railway Recruitment Boards (RRB)", type: "Central Ministry", url: "https://indianrailways.gov.in" },
  { name: "National Testing Agency (NTA)", type: "Autonomous Testing", url: "https://nta.ac.in" },
  { name: "Defence Research & Development Org (DRDO)", type: "R&D Defence", url: "https://drdo.gov.in" },
];

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const rawQuery = (params.search || params.q || params.query || "").trim();
  const currentType = (params.type || "all") as "all" | "jobs" | "exams" | "news";

  // If a search query is provided, execute global search across Jobs, Exams, and News
  const searchResult = rawQuery
    ? await searchGlobal(rawQuery, { limitPerType: 12 })
    : null;

  const [breakingBulletins, { bulletins: latestBulletins }] = await Promise.all([
    getBreakingBulletins(5),
    getPublicBulletins({ limit: 3 }),
  ]);

  const buildTypeUrl = (type: string) => {
    const q = new URLSearchParams();
    if (rawQuery) q.set("search", rawQuery);
    if (type !== "all") q.set("type", type);
    const qs = q.toString();
    return qs ? `/?${qs}` : "/";
  };

  return (
    <div className="space-y-16 pb-20">
      {/* Top Breaking Alert Ticker */}
      {breakingBulletins.length > 0 && (
        <BreakingTicker bulletins={breakingBulletins} />
      )}

      {/* Hero Search Section */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-b from-white via-slate-50 to-slate-100/70 pt-12 pb-16 lg:pt-16 lg:pb-20">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full overflow-hidden pointer-events-none opacity-40">
          <div className="absolute -top-24 left-1/4 h-96 w-96 rounded-full bg-brand-200/40 blur-3xl" />
          <div className="absolute top-12 right-1/4 h-96 w-96 rounded-full bg-emerald-200/30 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur mb-6">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Structured Official Notifications & Student Advisories</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500">Anti-Misinformation Standard</span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl font-heading">
            Authentic Public Notices, <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-amber-600 via-brand-600 to-emerald-700 bg-clip-text text-transparent">
              Structured &amp; Verified
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base text-slate-600 sm:text-lg leading-relaxed">
            {SITE_CONFIG.description}
          </p>

          <div className="mx-auto mt-8 max-w-3xl">
            <SearchBar
              targetPath="/"
              placeholder="Search central, state, defence, banking jobs, exams, organizations (UPSC, SSC, BSSC), or post names..."
            />
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
              <span className="font-medium text-slate-700">Quick Searches:</span>
              <Link href="/?search=Central+Govt" className="rounded-md bg-white px-2 py-0.5 border border-slate-200 text-slate-600 hover:text-brand-700 hover:border-brand-300 transition-colors">Central Govt</Link>
              <Link href="/?search=State+PSC" className="rounded-md bg-white px-2 py-0.5 border border-slate-200 text-slate-600 hover:text-brand-700 hover:border-brand-300 transition-colors">State PSCs</Link>
              <Link href="/?search=Defence+Police" className="rounded-md bg-white px-2 py-0.5 border border-slate-200 text-slate-600 hover:text-brand-700 hover:border-brand-300 transition-colors">Defence &amp; Police</Link>
              <Link href="/?search=Banking" className="rounded-md bg-white px-2 py-0.5 border border-slate-200 text-slate-600 hover:text-brand-700 hover:border-brand-300 transition-colors">Banking</Link>
              <Link href="/?search=Railways" className="rounded-md bg-white px-2 py-0.5 border border-slate-200 text-slate-600 hover:text-brand-700 hover:border-brand-300 transition-colors">Railways</Link>
              <Link href="/?search=Teaching" className="rounded-md bg-white px-2 py-0.5 border border-slate-200 text-slate-600 hover:text-brand-700 hover:border-brand-300 transition-colors">Teaching</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* HOME PAGE SEARCH RESULTS SECTION (Shown when query is active) */}
      {/* ========================================================================= */}
      {searchResult && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Active Search Summary Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-brand-200 bg-brand-50/50 p-6">
            <div>
              <div className="flex items-center gap-2">
                <Search className="h-5 w-5 text-brand-700" />
                <h2 className="text-xl font-bold text-slate-900 font-heading">
                  Search Results for &ldquo;{rawQuery}&rdquo;
                </h2>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Found <span className="font-bold text-slate-900">{searchResult.totalCount}</span> verified notices across Government Jobs, Examinations, and Public News.
              </p>
            </div>

            <Link href="/">
              <Button variant="outline" size="sm" className="gap-1.5 bg-white text-slate-700 hover:bg-slate-100">
                <X className="h-3.5 w-3.5" />
                <span>Clear Search</span>
              </Button>
            </Link>
          </div>

          {/* Section Navigation Tabs */}
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
            <Link
              href={buildTypeUrl("all")}
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                currentType === "all"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              <span>All Results</span>
              <span className={`rounded-full px-2 py-0.5 text-xs ${
                currentType === "all" ? "bg-slate-700 text-slate-100" : "bg-slate-200 text-slate-700"
              }`}>
                {searchResult.totalCount}
              </span>
            </Link>

            <Link
              href={buildTypeUrl("jobs")}
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                currentType === "jobs"
                  ? "bg-brand-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              <Briefcase className="h-4 w-4" />
              <span>Govt Jobs</span>
              <span className={`rounded-full px-2 py-0.5 text-xs ${
                currentType === "jobs" ? "bg-brand-700 text-brand-100" : "bg-slate-200 text-slate-700"
              }`}>
                {searchResult.counts.jobs}
              </span>
            </Link>

            <Link
              href={buildTypeUrl("exams")}
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                currentType === "exams"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              <Calendar className="h-4 w-4" />
              <span>Exams &amp; Schedules</span>
              <span className={`rounded-full px-2 py-0.5 text-xs ${
                currentType === "exams" ? "bg-blue-700 text-blue-100" : "bg-slate-200 text-slate-700"
              }`}>
                {searchResult.counts.exams}
              </span>
            </Link>

            <Link
              href={buildTypeUrl("news")}
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                currentType === "news"
                  ? "bg-amber-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              <Newspaper className="h-4 w-4" />
              <span>Employment News</span>
              <span className={`rounded-full px-2 py-0.5 text-xs ${
                currentType === "news" ? "bg-amber-700 text-amber-100" : "bg-slate-200 text-slate-700"
              }`}>
                {searchResult.counts.bulletins}
              </span>
            </Link>
          </div>

          {/* Zero Results State */}
          {searchResult.totalCount === 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center space-y-4">
              <Search className="h-12 w-12 text-slate-400 mx-auto" />
              <h3 className="text-xl font-bold text-slate-900 font-heading">
                No matching notices found for &ldquo;{rawQuery}&rdquo;
              </h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                Try searching with broader terms like commission names (e.g. <span className="font-semibold text-slate-700">UPSC, SSC, BSSC, RRB</span>), categories (<span className="font-semibold text-slate-700">Banking, Teaching, Police</span>), or state names (<span className="font-semibold text-slate-700">Bihar, UP, Delhi</span>).
              </p>
              <div className="flex flex-wrap justify-center gap-2 pt-2">
                <Link href="/?search=Bihar+Govt+Job">
                  <Button variant="outline" size="sm">Bihar Govt Jobs</Button>
                </Link>
                <Link href="/?search=UPSC">
                  <Button variant="outline" size="sm">UPSC Notices</Button>
                </Link>
                <Link href="/?search=Banking">
                  <Button variant="outline" size="sm">Banking Jobs</Button>
                </Link>
                <Link href="/?search=Police+Constable">
                  <Button variant="outline" size="sm">Police Constable</Button>
                </Link>
              </div>
            </div>
          )}

          {/* 1. Government Jobs Results */}
          {(currentType === "all" || currentType === "jobs") && searchResult.jobs.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-brand-600" />
                  <h3 className="text-lg font-bold text-slate-900 font-heading">
                    Government Jobs &amp; Vacancies
                  </h3>
                  <Badge variant="brand" className="text-xs">
                    {searchResult.counts.jobs} matches
                  </Badge>
                </div>
                <Link href={`/jobs?search=${encodeURIComponent(rawQuery)}`} className="text-xs font-semibold text-brand-600 hover:text-brand-700 hover:underline">
                  View in Jobs Section &rarr;
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {searchResult.jobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            </div>
          )}

          {/* 2. Examinations Results */}
          {(currentType === "all" || currentType === "exams") && searchResult.exams.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-bold text-slate-900 font-heading">
                    Examinations &amp; Schedules
                  </h3>
                  <Badge variant="default" className="text-xs bg-blue-100 text-blue-800">
                    {searchResult.counts.exams} matches
                  </Badge>
                </div>
                <Link href={`/exams?search=${encodeURIComponent(rawQuery)}`} className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline">
                  View in Exams Section &rarr;
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {searchResult.exams.map((exam) => (
                  <ExamCard key={exam.id} exam={exam} />
                ))}
              </div>
            </div>
          )}

          {/* 3. Employment News & Advisories Results */}
          {(currentType === "all" || currentType === "news") && searchResult.bulletins.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <div className="flex items-center gap-2">
                  <Newspaper className="h-5 w-5 text-amber-600" />
                  <h3 className="text-lg font-bold text-slate-900 font-heading">
                    Employment News &amp; Student Advisories
                  </h3>
                  <Badge variant="default" className="text-xs bg-amber-100 text-amber-800">
                    {searchResult.counts.bulletins} matches
                  </Badge>
                </div>
                <Link href={`/news?search=${encodeURIComponent(rawQuery)}`} className="text-xs font-semibold text-amber-700 hover:text-amber-800 hover:underline">
                  View in News Desk &rarr;
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {searchResult.bulletins.map((bulletin) => (
                  <BulletinCard key={bulletin.id} bulletin={bulletin} />
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* ========================================================================= */}
      {/* STANDARD HOMEPAGE SECTIONS (Shown when no search query or browsing) */}
      {/* ========================================================================= */}
      {!searchResult && (
        <>
          {/* High-Engagement Section: Employment News & Student Advisories Desk */}
          <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-700">
                  <Flame className="h-4 w-4" />
                  <span>Real-Time Information Desk</span>
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl font-heading mt-1">
                  Employment News &amp; Student Advisories
                </h2>
                <p className="text-sm text-slate-500 mt-1 max-w-xl">
                  Weekly Rozgar Samachar digests, official commission responses to student protests, and court stay orders.
                </p>
              </div>

              <Link href="/news">
                <Button variant="outline" size="sm" className="gap-1.5 font-semibold text-xs">
                  <span>View All News &amp; Advisories</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>

            {latestBulletins.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {latestBulletins.map((bulletin) => (
                  <BulletinCard key={bulletin.id} bulletin={bulletin} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
                <Newspaper className="h-10 w-10 mx-auto text-slate-400 mb-2" />
                <h3 className="text-base font-bold text-slate-800">Employment News &amp; Student Desk Initialized</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                  Weekly Employment News digests and verified student advisories will appear here once published by editorial administrators.
                </p>
                <div className="mt-4">
                  <Link href="/news">
                    <Button variant="outline" size="sm" className="text-xs font-semibold">
                      Browse Public News &amp; Advisories
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </section>

          {/* Modular Information Directory Section */}
          <section id="modules" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-700">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Platform Directory</span>
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl font-heading mt-1">
                  Independent Information Modules
                </h2>
                <p className="text-sm text-slate-500 mt-1 max-w-xl">
                  Each module operates independently with structured schemas, official verification, and direct gazette links.
                </p>
              </div>
              <Badge variant="brand" className="self-start md:self-auto py-1 px-3">
                Modular Architecture
              </Badge>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {SYSTEM_MODULES.map((module) => {
                const isActive = module.status === "active";
                const icon = moduleIcons[module.key];

                return (
                  <Card
                    key={module.key}
                    className={`relative flex flex-col justify-between overflow-hidden border transition-all ${
                      isActive
                        ? "border-brand-300 bg-white ring-1 ring-brand-500/20 shadow-sm hover:border-brand-500 hover:shadow-md"
                        : "border-slate-200 bg-slate-50/70 opacity-90 hover:opacity-100 hover:bg-white"
                    }`}
                  >
                    {isActive && (
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-brand-600" />
                    )}

                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100/90 border border-slate-200">
                          {icon}
                        </div>
                        <Badge variant={isActive ? "success" : "default"} className="text-[10px]">
                          {module.badge}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg font-bold text-slate-900">
                        {module.title}
                      </CardTitle>
                      <CardDescription className="text-xs leading-relaxed text-slate-600 mt-1">
                        {module.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="pt-0 pb-6">
                      {isActive ? (
                        <Link href={module.href}>
                          <Button variant="primary" size="sm" className="w-full justify-between group">
                            <span>Browse Notifications</span>
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </Button>
                        </Link>
                      ) : (
                        <Button variant="outline" size="sm" disabled className="w-full justify-between text-xs text-slate-400 bg-slate-100/60 border-slate-200">
                          <span>Module in Foundation Phase</span>
                          <span className="text-[10px] font-semibold text-slate-400">Roadmap</span>
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>

          {/* Verified Official Sources Registry Overview */}
          <section id="sources" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-100 gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Direct Data Provenance</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 font-heading mt-1">
                    Official Sources Registry
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    All records link directly to original government gazettes and recruitment portals.
                  </p>
                </div>
                <div className="text-xs text-slate-500">
                  <span className="font-semibold text-slate-700">Audit Protocol: </span> Every listing requires verified official URLs.
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-6">
                {benchmarkSources.map((src, idx) => (
                  <div
                    key={idx}
                    className="flex items-start justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition-all hover:bg-slate-50"
                  >
                    <div>
                      <div className="flex items-center gap-1.5 font-semibold text-sm text-slate-900">
                        <Building className="h-4 w-4 text-slate-500" />
                        <span>{src.name}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{src.type}</p>
                    </div>
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors"
                      aria-label={`Visit ${src.name}`}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Core Architectural Pillars */}
          <section id="about" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700 mb-4">
                  <Database className="h-5 w-5" />
                </div>
                <h4 className="text-base font-bold text-slate-900 mb-2">Structured Data Normalization</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Notices are transformed into 3NF normalized schemas (post vacancies, reservation breakdowns, qualification criteria, and official timelines).
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 mb-4">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h4 className="text-base font-bold text-slate-900 mb-2">Zero Speculation Standard</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  SuchnaSetu only publishes notifications backed by official PDF notices, avoiding rumors or unverified circular claims.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-700 mb-4">
                  <Lock className="h-5 w-5" />
                </div>
                <h4 className="text-base font-bold text-slate-900 mb-2">Admin-Only Authentication</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  All public notices are completely open and accessible without login. Authentication is strictly guarded for verified editorial administrators.
                </p>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
