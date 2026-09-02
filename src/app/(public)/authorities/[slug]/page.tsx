import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { constructMetadata, buildGovOrgJsonLd, buildBreadcrumbJsonLd } from "@/lib/seo";
import { getCanonicalSiteUrl } from "@/lib/constants";
import { isUuid } from "@/lib/utils";
import { JobListTable } from "@/modules/jobs/components/job-list-table";
import { ExamListTable } from "@/modules/exams/components/exam-list-table";
import { GovJobDetailed } from "@/modules/jobs/types";
import { GovExamDetailed } from "@/modules/exams/types";
import {
  Building2,
  ExternalLink,
  Briefcase,
  Calendar,
  Globe,
  MapPin,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  BookOpen,
} from "lucide-react";

interface AuthorityPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const revalidate = 1800; // 30 mins cache

async function getOrganization(slug: string): Promise<any> {
  const supabase = createAdminClient();
  const cleanSlug = decodeURIComponent(slug).trim().toLowerCase();

  // 1. Primary lookup by slug
  const { data: bySlug } = await supabase
    .from("organizations")
    .select("*")
    .eq("slug", cleanSlug)
    .maybeSingle();

  if (bySlug) return bySlug;

  // 2. Secondary lookup by acronym (case-insensitive)
  const { data: byAcronym } = await supabase
    .from("organizations")
    .select("*")
    .ilike("acronym", cleanSlug)
    .maybeSingle();

  if (byAcronym) return byAcronym;

  // 3. Fallback lookup by UUID ONLY if cleanSlug is a valid UUID format
  if (isUuid(cleanSlug)) {
    const { data: byId } = await supabase
      .from("organizations")
      .select("*")
      .eq("id", cleanSlug)
      .maybeSingle();

    if (byId) return byId;
  }

  return null;
}

export async function generateMetadata({ params }: AuthorityPageProps): Promise<Metadata> {
  const { slug } = await params;
  const org = await getOrganization(slug);

  if (!org) {
    return constructMetadata({
      title: "Authority Not Found",
      description: "The requested recruiting authority could not be found.",
      noIndex: true,
    });
  }

  const supabase = createAdminClient();
  const [{ count: jobsCount }, { count: examsCount }] = await Promise.all([
    supabase
      .from("gov_jobs")
      .select("id", { count: "exact", head: true })
      .eq("organization_id", org.id)
      .eq("status", "published")
      .is("deleted_at", null),
    supabase
      .from("gov_exams")
      .select("id", { count: "exact", head: true })
      .eq("organization_id", org.id)
      .eq("status", "published")
      .is("deleted_at", null),
  ]);

  const isEmptyAuthority = (jobsCount || 0) + (examsCount || 0) === 0;

  const title = `${org.name} ${org.acronym ? `(${org.acronym})` : ""} - Latest Recruitments, Exams & Notifications 2026`;
  const description = `Official recruitment portal and notification aggregator for ${org.name}. Check latest vacancy notices, exam dates, syllabus, admit cards, and verified official apply links.`;

  return constructMetadata({
    title,
    description,
    path: `/authorities/${org.acronym?.toLowerCase() || org.id}`,
    noIndex: isEmptyAuthority,
    keywords: [
      `${org.name} Recruitment 2026`,
      `${org.acronym || org.name} Jobs 2026`,
      `${org.acronym || org.name} Exam Date`,
      `${org.acronym || org.name} Syllabus`,
      `${org.acronym || org.name} Admit Card`,
      `${org.acronym || org.name} Official Website`,
    ],
  });
}

export default async function AuthorityProfilePage({ params }: AuthorityPageProps) {
  const { slug } = await params;
  const org = await getOrganization(slug);

  if (!org) {
    notFound();
  }

  const supabase = createAdminClient();

  // Fetch active jobs under this organization
  const { data: jobs } = await supabase
    .from("gov_jobs")
    .select(`
      *,
      organization:organizations!inner(*)
    `)
    .eq("organization_id", org.id)
    .eq("status", "published")
    .is("deleted_at", null)
    .order("published_at", { ascending: false });

  // Fetch active exams under this organization
  const { data: exams } = await supabase
    .from("gov_exams")
    .select(`
      *,
      organization:organizations!inner(*)
    `)
    .eq("organization_id", org.id)
    .eq("status", "published")
    .is("deleted_at", null)
    .order("published_at", { ascending: false });

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Authorities", url: "/directory" },
    { name: org.acronym || org.name, url: `/authorities/${org.acronym?.toLowerCase() || org.id}` },
  ];

  const orgJsonLd = buildGovOrgJsonLd({
    name: org.name,
    acronym: org.acronym,
    url: `${getCanonicalSiteUrl()}/authorities/${org.acronym?.toLowerCase() || org.id}`,
    websiteUrl: org.website_url,
    category: org.category,
  });

  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbs);

  return (
    <>
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
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
            <Link href="/directory" className="hover:text-[#013089] transition-colors">Authority Directory</Link>
            <ChevronRight className="h-3 w-3 text-slate-400" />
            <span className="text-slate-900 font-bold">{org.acronym || org.name}</span>
          </nav>

          {/* Authority Hero Header */}
          <div className="rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-brand-50 border border-brand-100 text-[#013089]">
                  <Building2 className="h-7 w-7" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
                      {org.name}
                    </h1>
                    {org.acronym && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold bg-[#013089] text-white">
                        {org.acronym}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                    <span className="capitalize font-medium">{org.category || "Government Body"}</span>
                    {org.state_code && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-slate-400" />
                        <Link href={`/state/${org.state_code.toLowerCase()}`} className="hover:text-[#013089] underline">
                          {org.state_code} State
                        </Link>
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                      <span>Verified Authority</span>
                    </span>
                  </div>
                </div>
              </div>

              {org.website_url && (
                <a
                  href={org.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#013089] hover:bg-[#012169] text-white font-bold text-xs shadow-2xs transition-all shrink-0"
                >
                  <Globe className="h-4 w-4" />
                  <span>Official Portal</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-[11px] font-semibold text-slate-500 block">Active Recruitments</span>
                <span className="text-xl font-bold text-[#013089]">{jobs?.length || 0}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-[11px] font-semibold text-slate-500 block">Examinations</span>
                <span className="text-xl font-bold text-blue-700">{exams?.length || 0}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-[11px] font-semibold text-slate-500 block">Verification Status</span>
                <span className="text-xs font-bold text-emerald-700 block mt-1">Official / Verified</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-[11px] font-semibold text-slate-500 block">Syllabus &amp; Patterns</span>
                <span className="text-xs font-bold text-slate-700 block mt-1">Available Online</span>
              </div>
            </div>
          </div>

          {/* Active Job Openings */}
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800">
                  <Briefcase className="h-4 w-4 text-emerald-700" />
                </div>
                <h2 className="text-lg font-bold text-slate-900 font-heading">
                  Latest Job Recruitments by {org.acronym || org.name}
                </h2>
              </div>
            </div>

            {jobs && jobs.length > 0 ? (
              <JobListTable jobs={jobs as unknown as GovJobDetailed[]} />
            ) : (
              <div className="rounded-xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
                No active recruitment notices currently open for {org.name}.
              </div>
            )}
          </section>

          {/* Examinations & Schedules */}
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 text-blue-800">
                  <Calendar className="h-4 w-4 text-blue-700" />
                </div>
                <h2 className="text-lg font-bold text-slate-900 font-heading">
                  Examinations, Admit Cards &amp; Notifications
                </h2>
              </div>
            </div>

            {exams && exams.length > 0 ? (
              <ExamListTable exams={exams as unknown as GovExamDetailed[]} />
            ) : (
              <div className="rounded-xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
                No active examination schedules currently published for {org.name}.
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
