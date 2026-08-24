import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getStateByCode, INDIAN_STATES } from "@/lib/constants/states";
import { constructMetadata, buildBreadcrumbJsonLd } from "@/lib/seo";
import { getCanonicalSiteUrl } from "@/lib/constants";
import { createAdminClient } from "@/lib/supabase/admin";
import { JobListTable } from "@/modules/jobs/components/job-list-table";
import { ExamListTable } from "@/modules/exams/components/exam-list-table";
import { GovJobDetailed } from "@/modules/jobs/types";
import { GovExamDetailed } from "@/modules/exams/types";
import {
  MapPin,
  Briefcase,
  Calendar,
  Building2,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";

interface StatePageProps {
  params: Promise<{
    stateCode: string;
  }>;
}

export const revalidate = 1800; // 30 minutes cache

export async function generateStaticParams() {
  return INDIAN_STATES.map((s) => ({
    stateCode: s.code.toLowerCase(),
  }));
}

export async function generateMetadata({ params }: StatePageProps): Promise<Metadata> {
  const { stateCode } = await params;
  const state = getStateByCode(stateCode);

  if (!state) {
    return constructMetadata({
      title: "State Not Found",
      description: "State recruitment directory could not be found.",
      noIndex: true,
    });
  }

  const supabase = createAdminClient();
  const [{ count: jobsCount }, { count: examsCount }] = await Promise.all([
    supabase
      .from("gov_jobs")
      .select("id", { count: "exact", head: true })
      .eq("status", "published")
      .is("deleted_at", null)
      .or(`state_code.eq.${state.code},state.ilike.%${state.name}%`),
    supabase
      .from("gov_exams")
      .select("id", { count: "exact", head: true })
      .eq("status", "published")
      .is("deleted_at", null)
      .or(`state_code.eq.${state.code},state.ilike.%${state.name}%`),
  ]);

  const isEmptyPortal = (jobsCount || 0) + (examsCount || 0) === 0;

  const title = `${state.name} Government Jobs 2026 - Latest Sarkari Naukri & ${state.pscAcronym} Notifications`;
  const description = `Find verified ${state.name} government jobs, ${state.pscName} (${state.pscAcronym}) recruitment notifications, exams, syllabus, and admit cards with direct official apply links.`;

  return constructMetadata({
    title,
    description,
    path: `/state/${state.code.toLowerCase()}`,
    noIndex: isEmptyPortal,
    keywords: [
      `${state.name} Govt Jobs 2026`,
      `${state.name} Sarkari Naukri`,
      `${state.pscAcronym} Recruitment 2026`,
      `${state.name} Public Service Commission`,
      `${state.name} Police Recruitment`,
      `${state.name} Teacher Vacancy`,
    ],
  });
}

export default async function StatePortalPage({ params }: StatePageProps) {
  const { stateCode } = await params;
  const state = getStateByCode(stateCode);

  if (!state) {
    notFound();
  }

  const supabase = createAdminClient();

  // Fetch published jobs for this state
  const { data: jobs } = await supabase
    .from("gov_jobs")
    .select(`
      *,
      organization:organizations!inner(*)
    `)
    .eq("status", "published")
    .is("deleted_at", null)
    .or(`state_code.eq.${state.code},state.ilike.%${state.name}%`)
    .order("published_at", { ascending: false })
    .limit(30);

  // Fetch published exams for this state
  const { data: exams } = await supabase
    .from("gov_exams")
    .select(`
      *,
      organization:organizations!inner(*)
    `)
    .eq("status", "published")
    .is("deleted_at", null)
    .or(`state_code.eq.${state.code},state.ilike.%${state.name}%`)
    .order("published_at", { ascending: false })
    .limit(20);

  // Fetch verified organizations in this state
  const { data: orgs } = await supabase
    .from("organizations")
    .select("*")
    .eq("state_code", state.code)
    .order("name", { ascending: true });

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "States", url: "/directory" },
    { name: state.name, url: `/state/${state.code.toLowerCase()}` },
  ];

  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbs);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="min-h-screen bg-slate-50/50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-slate-500 font-medium" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-[#013089] transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3 text-slate-400" />
            <Link href="/directory" className="hover:text-[#013089] transition-colors">State Directory</Link>
            <ChevronRight className="h-3 w-3 text-slate-400" />
            <span className="text-slate-900 font-bold">{state.name}</span>
          </nav>

          {/* State Hero Header */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#012169] via-[#013089] to-[#0d47a1] p-6 sm:p-8 text-white shadow-lg">
            <div className="relative z-10 max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur-xs border border-white/15">
                <MapPin className="h-3.5 w-3.5 text-amber-400" />
                <span>{state.isUT ? "Union Territory" : "State Portal"} • Code: {state.code}</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-heading">
                {state.name} ({state.hindiName}) Government Jobs &amp; Exams 2026
              </h1>
              <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed">
                Centralized gateway for all official notifications, public service commission ({state.pscAcronym}) recruitment notices, teacher vacancies, police bharti, and civil exams in {state.name}.
              </p>

              {/* Quick Metadata Stats */}
              <div className="flex flex-wrap gap-4 pt-2 text-xs text-blue-200">
                <div className="flex items-center gap-1.5">
                  <Building2 className="h-4 w-4 text-amber-400" />
                  <span>PSC: <strong>{state.pscAcronym}</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Briefcase className="h-4 w-4 text-emerald-400" />
                  <span>Active Jobs: <strong>{jobs?.length || 0}</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-blue-300" />
                  <span>Scheduled Exams: <strong>{exams?.length || 0}</strong></span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Grid: Jobs, Exams, State Organizations */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left 8 Cols: Jobs & Exams */}
            <div className="lg:col-span-8 space-y-8">
              {/* State Jobs Section */}
              <section className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800">
                      <Briefcase className="h-4 w-4 text-emerald-700" />
                    </div>
                    <h2 className="text-lg font-bold text-slate-900 font-heading">
                      Active Government Jobs in {state.name}
                    </h2>
                  </div>
                  <Link
                    href={`/jobs?state=${state.code}`}
                    className="text-xs font-semibold text-[#013089] hover:underline inline-flex items-center gap-1"
                  >
                    <span>View All Jobs</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>

                {jobs && jobs.length > 0 ? (
                  <JobListTable jobs={jobs as unknown as GovJobDetailed[]} />
                ) : (
                  <div className="rounded-xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
                    No active state-specific job vacancies currently listed for {state.name}. Check National / All-India openings.
                  </div>
                )}
              </section>

              {/* State Examinations Section */}
              <section className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 text-blue-800">
                      <Calendar className="h-4 w-4 text-blue-700" />
                    </div>
                    <h2 className="text-lg font-bold text-slate-900 font-heading">
                      Official Examinations &amp; PSC Notices
                    </h2>
                  </div>
                  <Link
                    href={`/exams?state=${state.code}`}
                    className="text-xs font-semibold text-[#013089] hover:underline inline-flex items-center gap-1"
                  >
                    <span>View All Exams</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>

                {exams && exams.length > 0 ? (
                  <ExamListTable exams={exams as unknown as GovExamDetailed[]} />
                ) : (
                  <div className="rounded-xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
                    No active examinations currently scheduled for {state.name}.
                  </div>
                )}
              </section>
            </div>

            {/* Right 4 Cols: State Commissions & Quick Links */}
            <div className="lg:col-span-4 space-y-6">
              {/* State Commissions Widget */}
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Building2 className="h-4 w-4 text-[#013089]" />
                  <h3 className="font-bold text-sm text-slate-900">
                    {state.name} Recruiting Bodies
                  </h3>
                </div>

                <div className="space-y-2">
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
                    <span className="font-bold text-xs text-[#013089] block">
                      {state.pscName} ({state.pscAcronym})
                    </span>
                    <p className="text-[11px] text-slate-500">
                      State administrative, civil, engineering and judicial services examinations.
                    </p>
                    <Link
                      href={`/authorities/${state.pscAcronym.toLowerCase()}`}
                      className="text-[11px] font-bold text-[#013089] hover:underline inline-flex items-center gap-1 pt-1"
                    >
                      <span>View Authority Profile</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>

                  {orgs && orgs.length > 0 && (orgs as any[]).map((org) => (
                    <div key={org.id} className="p-3 rounded-lg hover:bg-slate-50 transition-colors border border-slate-100/60">
                      <Link
                        href={`/authorities/${org.acronym?.toLowerCase() || org.id}`}
                        className="font-bold text-xs text-slate-900 hover:text-[#013089] block truncate"
                      >
                        {org.name} {org.acronym && `(${org.acronym})`}
                      </Link>
                      <span className="text-[10px] text-slate-400 block font-mono capitalize">
                        {org.category || "State Commission"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Other Major States Quick Links */}
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs space-y-3">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500">
                  Explore Other States
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {INDIAN_STATES.filter((s) => s.code !== state.code).slice(0, 16).map((otherState) => (
                    <Link
                      key={otherState.code}
                      href={`/state/${otherState.code.toLowerCase()}`}
                      className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-100 hover:bg-[#013089] hover:text-white text-slate-700 transition-colors"
                    >
                      {otherState.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
