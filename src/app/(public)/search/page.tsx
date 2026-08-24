import { Metadata } from "next";
import Link from "next/link";
import { executeAiEnhancedSearch } from "@/modules/ai/search/search-service";
import { JobCard } from "@/modules/jobs/components/job-card";
import { ExamCard } from "@/modules/exams/components/exam-card";
import { BulletinCard } from "@/modules/bulletins/components/bulletin-card";
import { SearchBar } from "@/components/shared/search-bar";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { constructMetadata } from "@/lib/seo";
import {
  Search,
  Briefcase,
  Calendar,
  Newspaper,
  Sparkles,
  ArrowRight,
  Filter,
  CheckCircle2,
  HelpCircle,
  TrendingUp,
  Cpu,
} from "lucide-react";

interface SearchPageProps {
  searchParams: Promise<{
    search?: string;
    q?: string;
    query?: string;
    type?: string;
  }>;
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const params = await searchParams;
  const rawQuery = params.search || params.q || params.query || "";
  const title = rawQuery
    ? `Search: "${rawQuery}" - Govt Jobs, Exams & News | SuchnaSetu`
    : "Universal Search - Government Jobs, Exams & Public Notices | SuchnaSetu";

  return constructMetadata({
    title,
    description:
      "Intelligent universal search across verified central and state government jobs, official commission exams, syllabus, dates, and employment news.",
    path: "/search",
  });
}

const POPULAR_SEARCH_TAGS = [
  { label: "10th Pass Bihar", query: "10th pass government jobs in Bihar" },
  { label: "UP Govt Jobs", query: "government jobs in UP" },
  { label: "Upcoming SSC Exams", query: "upcoming SSC exams" },
  { label: "Salary > ₹50,000", query: "government jobs with salary above 50000" },
  { label: "Graduate Fresher", query: "graduate jobs without experience" },
  { label: "Police & Defence", query: "Police Constable" },
  { label: "Banking & IBPS", query: "Banking jobs" },
  { label: "Closing This Month", query: "jobs closing this month" },
];

export default async function GlobalSearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const rawQuery = (params.search || params.q || params.query || "").trim();
  const currentType = (params.type || "all") as "all" | "jobs" | "exams" | "news";

  const searchResult = rawQuery
    ? await executeAiEnhancedSearch(rawQuery, {
        module: currentType === "news" ? "bulletins" : currentType,
        limitPerType: 12,
      })
    : {
        query: "",
        isAiAssisted: false,
        executionTimeMs: 0,
        totalCount: 0,
        counts: { jobs: 0, exams: 0, bulletins: 0 },
        jobs: [],
        exams: [],
        bulletins: [],
      };

  const { totalCount, counts, jobs, exams, bulletins, isAiAssisted, intent } = searchResult;

  const buildTypeUrl = (type: string) => {
    const q = new URLSearchParams();
    if (rawQuery) q.set("search", rawQuery);
    if (type !== "all") q.set("type", type);
    const qs = q.toString();
    return qs ? `/search?${qs}` : "/search";
  };

  // Build filter pills summary if AI detected parameters
  const detectedFilters: string[] = [];
  if (intent?.state) detectedFilters.push(`State: ${intent.state}`);
  if (intent?.qualification?.length) detectedFilters.push(`Qualification: ${intent.qualification.join(", ")}`);
  if (intent?.salary_min) detectedFilters.push(`Min Salary: ₹${intent.salary_min.toLocaleString("en-IN")}`);
  if (intent?.gender === "female") detectedFilters.push("Reserved for Women");
  if (intent?.application_open) detectedFilters.push("Application Open");

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-slate-200 pb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-700">
            <Search className="h-4 w-4" />
            <span>Universal Information Discovery</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl font-heading mt-1">
            Global Notice &amp; Exam Search
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Intelligently discover authentic central &amp; state government recruitments, commission examination schedules, and official employment news digests.
          </p>
        </div>

        {rawQuery && (
          <div className="flex items-center gap-2">
            <Badge variant="brand" className="text-xs py-1 px-3">
              {totalCount} Total {totalCount === 1 ? "Result" : "Results"}
            </Badge>
          </div>
        )}
      </div>

      {/* Main Search Bar & Quick Tags */}
      <div className="max-w-4xl space-y-3">
        <SearchBar
          targetPath="/search"
          placeholder="Search central, state, defence, banking jobs, organizations (UPSC, SSC), states, or topics..."
        />

        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs text-slate-600">
          <span className="flex items-center gap-1 font-semibold text-slate-700 mr-1">
            <TrendingUp className="h-3.5 w-3.5 text-brand-600" />
            Trending:
          </span>
          {POPULAR_SEARCH_TAGS.map((tag) => (
            <Link
              key={tag.label}
              href={`/search?search=${encodeURIComponent(tag.query)}`}
              className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-600 hover:border-brand-500 hover:text-brand-700 hover:bg-brand-50/50 transition-colors shadow-2xs"
            >
              {tag.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Active Search Context & Type Filters */}
      {rawQuery && (
        <div className="space-y-4">
          {/* Active Query Pill */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-100/90 border border-slate-200 p-3.5 rounded-2xl">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2 text-sm text-slate-800">
                {isAiAssisted ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#013089] text-white shadow-2xs">
                    <Sparkles className="h-3 w-3 text-amber-300" />
                    <span>AI Intent Understanding</span>
                  </span>
                ) : (
                  <Sparkles className="h-4 w-4 text-brand-600 shrink-0" />
                )}
                <span>
                  Found <strong>{totalCount}</strong> verified notices for &ldquo;<strong>{rawQuery}</strong>&rdquo;
                </span>
              </div>

              {detectedFilters.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-600">
                  <span className="font-semibold text-slate-700">Understood Filters:</span>
                  {detectedFilters.map((f, idx) => (
                    <span key={idx} className="bg-white px-2 py-0.5 rounded-md border border-slate-200 text-slate-700 font-medium">
                      {f}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <Link href="/search" className="text-xs text-slate-500 hover:text-slate-900 underline shrink-0">
              Clear search
            </Link>
          </div>

          {/* Type Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200">
            <Link
              href={buildTypeUrl("all")}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                currentType === "all"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              <span>All Results</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${currentType === "all" ? "bg-slate-700 text-white" : "bg-slate-100 text-slate-700"}`}>
                {totalCount}
              </span>
            </Link>

            <Link
              href={buildTypeUrl("jobs")}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                currentType === "jobs"
                  ? "bg-brand-600 text-white shadow-xs"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              <Briefcase className="h-3.5 w-3.5" />
              <span>Govt Jobs</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${currentType === "jobs" ? "bg-brand-700 text-white" : "bg-slate-100 text-slate-700"}`}>
                {counts.jobs}
              </span>
            </Link>

            <Link
              href={buildTypeUrl("exams")}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                currentType === "exams"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              <Calendar className="h-3.5 w-3.5" />
              <span>Exams &amp; Notifications</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${currentType === "exams" ? "bg-blue-700 text-white" : "bg-slate-100 text-slate-700"}`}>
                {counts.exams}
              </span>
            </Link>

            <Link
              href={buildTypeUrl("news")}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                currentType === "news"
                  ? "bg-amber-600 text-white shadow-xs"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              <Newspaper className="h-3.5 w-3.5" />
              <span>Employment News</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${currentType === "news" ? "bg-amber-700 text-white" : "bg-slate-100 text-slate-700"}`}>
                {counts.bulletins}
              </span>
            </Link>
          </div>
        </div>
      )}

      {/* Main Results Display */}
      {rawQuery && totalCount > 0 ? (
        <div className="space-y-12">
          {/* 1. Government Jobs Section */}
          {(currentType === "all" || currentType === "jobs") && jobs.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-brand-50 rounded-lg text-brand-600">
                    <Briefcase className="h-4 w-4" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 font-heading">
                    Government Jobs
                  </h2>
                  <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                    {counts.jobs} {counts.jobs === 1 ? "match" : "matches"}
                  </span>
                </div>

                <Link
                  href={`/jobs?search=${encodeURIComponent(rawQuery)}`}
                  className="flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-800 transition-colors"
                >
                  <span>Explore in Jobs section with filters</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {jobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            </section>
          )}

          {/* 2. Examinations & Notifications Section */}
          {(currentType === "all" || currentType === "exams") && exams.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-blue-50 rounded-lg text-blue-600">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 font-heading">
                    Exams &amp; Notifications
                  </h2>
                  <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                    {counts.exams} {counts.exams === 1 ? "match" : "matches"}
                  </span>
                </div>

                <Link
                  href={`/exams?search=${encodeURIComponent(rawQuery)}`}
                  className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <span>Explore in Exams section with filters</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {exams.map((exam) => (
                  <ExamCard key={exam.id} exam={exam} />
                ))}
              </div>
            </section>
          )}

          {/* 3. Employment News & Advisories Section */}
          {(currentType === "all" || currentType === "news") && bulletins.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-amber-50 rounded-lg text-amber-600">
                    <Newspaper className="h-4 w-4" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 font-heading">
                    Employment News &amp; Advisories
                  </h2>
                  <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                    {counts.bulletins} {counts.bulletins === 1 ? "match" : "matches"}
                  </span>
                </div>

                <Link
                  href={`/news?search=${encodeURIComponent(rawQuery)}`}
                  className="flex items-center gap-1 text-xs font-bold text-amber-700 hover:text-amber-900 transition-colors"
                >
                  <span>Explore full News Desk</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {bulletins.map((bulletin) => (
                  <BulletinCard key={bulletin.id} bulletin={bulletin} />
                ))}
              </div>
            </section>
          )}
        </div>
      ) : rawQuery && totalCount === 0 ? (
        /* Zero Results State with Helpful Tips */
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center space-y-6 max-w-2xl mx-auto shadow-xs">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-amber-600">
            <HelpCircle className="h-7 w-7" />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-bold text-slate-900">
              No matching notices found for &ldquo;{rawQuery}&rdquo;
            </h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              We could not find any active job circulars, examination stages, or news bulletins matching your exact search terms.
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-4 text-left border border-slate-200/80 space-y-2">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Search Tips:
            </span>
            <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
              <li>Try broader terms (e.g. <strong>Bihar</strong>, <strong>SSC</strong>, <strong>Railway</strong>, <strong>Bank</strong>).</li>
              <li>Search by commission acronym (e.g. <strong>UPSC</strong>, <strong>BPSC</strong>, <strong>IBPS</strong>, <strong>RRB</strong>).</li>
              <li>Search by job role (e.g. <strong>Teacher</strong>, <strong>Constable</strong>, <strong>Clerk</strong>, <strong>Assistant</strong>).</li>
              <li>Check your spelling or browse specific sections using the top navigation.</li>
            </ul>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link href="/jobs">
              <Button variant="outline" size="sm" className="text-xs font-semibold">
                Browse All Jobs
              </Button>
            </Link>
            <Link href="/exams">
              <Button variant="outline" size="sm" className="text-xs font-semibold">
                Browse All Exams
              </Button>
            </Link>
            <Link href="/news">
              <Button variant="outline" size="sm" className="text-xs font-semibold">
                Browse All News
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        /* Empty Query State - Discover Guidance */
        <div className="rounded-2xl border border-slate-200 bg-white p-8 sm:p-12 text-center space-y-8 shadow-xs">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
            <Sparkles className="h-8 w-8" />
          </div>

          <div className="space-y-2 max-w-xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-900 font-heading">
              Search Across All Government Notices &amp; Exams
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              Enter any post name, department, state, exam code, or commission name to find verified official notices and schedules.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-4xl mx-auto">
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-5 space-y-2 hover:border-brand-300 transition-colors">
              <div className="flex items-center gap-2 font-bold text-sm text-slate-800">
                <Briefcase className="h-4 w-4 text-brand-600" />
                <span>Central &amp; State Jobs</span>
              </div>
              <p className="text-xs text-slate-500">
                Search verified vacancies from UPSC, SSC, Banking, Railways, Defence, and State PSCs.
              </p>
              <div className="pt-2">
                <Link href="/jobs" className="text-xs font-bold text-brand-600 hover:underline">
                  Browse Jobs &rarr;
                </Link>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-5 space-y-2 hover:border-blue-300 transition-colors">
              <div className="flex items-center gap-2 font-bold text-sm text-slate-800">
                <Calendar className="h-4 w-4 text-blue-600" />
                <span>Exams &amp; Schedules</span>
              </div>
              <p className="text-xs text-slate-500">
                Search exam stages, admit card release timelines, syllabus schemes, and exam dates.
              </p>
              <div className="pt-2">
                <Link href="/exams" className="text-xs font-bold text-blue-600 hover:underline">
                  Browse Exams &rarr;
                </Link>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-5 space-y-2 hover:border-amber-300 transition-colors">
              <div className="flex items-center gap-2 font-bold text-sm text-slate-800">
                <Newspaper className="h-4 w-4 text-amber-600" />
                <span>Employment News</span>
              </div>
              <p className="text-xs text-slate-500">
                Weekly digests, Rozgar Samachar summaries, student advisories, and court stay orders.
              </p>
              <div className="pt-2">
                <Link href="/news" className="text-xs font-bold text-amber-700 hover:underline">
                  Browse News &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
