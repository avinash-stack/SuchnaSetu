import { Metadata } from "next";
import Link from "next/link";
import { createPublicClient } from "@/lib/supabase/public";
import { unstable_cache } from "next/cache";
import { constructMetadata, buildBreadcrumbJsonLd } from "@/lib/seo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/shared/search-bar";
import {
  Building2,
  Globe,
  ExternalLink,
  MapPin,
  Briefcase,
  Calendar,
  X,
  Layers,
} from "lucide-react";

interface DirectoryPageProps {
  searchParams: Promise<{
    search?: string;
    jurisdiction?: string;
    state?: string;
  }>;
}

export async function generateMetadata({ searchParams }: DirectoryPageProps): Promise<Metadata> {
  const params = await searchParams;
  let title = "Recruiting Organizations, Commissions & Courts Directory";
  if (params.search) {
    title = `Search: "${params.search}" - Directory | SuchnaSetu`;
  }
  return constructMetadata({
    title,
    description:
      "Official public directory of government recruiting authorities, UPSC, SSC, State PSCs, High Courts, Central PSUs, and ministries across India.",
    path: "/directory",
  });
}

const getCachedDirectoryOrganizations = unstable_cache(
  async () => {
    const supabase = createPublicClient();
    const { data: orgs, error } = await (supabase.from("organizations") as any)
      .select("*, states_uts(*)")
      .eq("is_active", true)
      .order("name", { ascending: true });

    if (error || !orgs) return [];
    return orgs as any[];
  },
  ["public-directory-organizations"],
  { revalidate: 300, tags: ["organizations", "taxonomies"] }
);

function buildJurisdictionUrl(params: Record<string, string | undefined>, jurisdiction: string) {
  const q = new URLSearchParams();
  if (jurisdiction && jurisdiction !== "all") {
    q.set("jurisdiction", jurisdiction);
  }
  if (params.search) {
    q.set("search", params.search);
  }
  if (params.state) {
    q.set("state", params.state);
  }
  const qs = q.toString();
  return qs ? `/directory?${qs}` : "/directory";
}

function buildClearSearchUrl(params: Record<string, string | undefined>) {
  const q = new URLSearchParams();
  if (params.jurisdiction && params.jurisdiction !== "all") {
    q.set("jurisdiction", params.jurisdiction);
  }
  if (params.state) {
    q.set("state", params.state);
  }
  const qs = q.toString();
  return qs ? `/directory?${qs}` : "/directory";
}

export default async function PublicDirectoryPage({ searchParams }: DirectoryPageProps) {
  const params = await searchParams;
  const rawSearch = (params.search || "").toLowerCase().trim();
  const currentJurisdiction = (params.jurisdiction || "all").toLowerCase();

  const allOrgs = await getCachedDirectoryOrganizations();

  // Filter organizations
  const filteredOrgs = allOrgs.filter((org) => {
    // 1. Jurisdiction filter
    if (currentJurisdiction !== "all") {
      const orgJur = (org.jurisdiction || "").toLowerCase();
      if (currentJurisdiction === "central" && orgJur !== "central" && orgJur !== "national") return false;
      if (currentJurisdiction === "state" && orgJur !== "state") return false;
      if (currentJurisdiction === "judiciary" && !orgJur.includes("judiciar") && !orgJur.includes("court") && !org.name.toLowerCase().includes("court")) return false;
      if (currentJurisdiction === "psu" && !orgJur.includes("psu") && !orgJur.includes("enterprise") && !org.name.toLowerCase().includes("corporation") && !org.name.toLowerCase().includes("limited")) return false;
      if (currentJurisdiction === "autonomous" && !orgJur.includes("autonomous") && !orgJur.includes("commission") && !orgJur.includes("board")) return false;
    }

    // 2. Search filter
    if (rawSearch) {
      const name = (org.name || "").toLowerCase();
      const acronym = (org.acronym || "").toLowerCase();
      const slug = (org.slug || "").toLowerCase();
      const stateName = (org.states_uts?.name || "").toLowerCase();
      const jurisdiction = (org.jurisdiction || "").toLowerCase();

      const match =
        name.includes(rawSearch) ||
        acronym.includes(rawSearch) ||
        slug.includes(rawSearch) ||
        stateName.includes(rawSearch) ||
        jurisdiction.includes(rawSearch);

      if (!match) return false;
    }

    return true;
  });

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Recruiting Authorities Directory", url: "/directory" },
  ];
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbs);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="min-h-screen">
      {/* 1. Compact Sticky Top Header & Search Bar */}
      <div className="sticky top-[68px] sm:top-[76px] z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs py-2.5 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 shrink-0">
            <Building2 className="h-4 w-4 text-[#013089]" />
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 font-heading whitespace-nowrap">
              Recruiting Organizations
            </h1>
            <Badge variant="navy" className="text-[10px] py-0.5 px-2">
              {filteredOrgs.length} Authorities
            </Badge>
          </div>

          <div className="w-full sm:max-w-lg flex items-center gap-2">
            <div className="flex-1">
              <SearchBar placeholder="Search commission name, acronym (UPSC, BPSC), or state..." />
            </div>
            {params.search && (
              <Link
                href={buildClearSearchUrl(params)}
                className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1 bg-slate-100 border border-slate-200 px-2 py-1.5 rounded-md shrink-0"
                title="Clear search"
              >
                <X className="h-3.5 w-3.5" />
                <span className="hidden sm:inline text-[11px]">Clear</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* 2. Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
        {/* Jurisdiction Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {[
            { key: "all", label: "All Authorities" },
            { key: "central", label: "Central & National" },
            { key: "state", label: "State PSCs & Boards" },
            { key: "judiciary", label: "High Courts & Judiciary" },
            { key: "psu", label: "Public Sector & PSUs" },
            { key: "autonomous", label: "Autonomous & Testing" },
          ].map((jur) => {
            const isActive = currentJurisdiction === jur.key;
            return (
              <Link
                key={jur.key}
                href={buildJurisdictionUrl(params, jur.key)}
                className={`whitespace-nowrap rounded-md px-3 py-1 text-xs font-bold transition-all ${
                  isActive
                    ? "bg-[#013089] text-white shadow-xs"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {jur.label}
              </Link>
            );
          })}
        </div>

        {/* Directory Grid */}
        {filteredOrgs.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredOrgs.map((org) => (
              <div
                key={org.id}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs hover:border-[#013089]/40 hover:shadow-sm transition-all flex flex-col justify-between space-y-3"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    {org.acronym && (
                      <Badge variant="brand" className="text-[10px] font-bold py-0 px-2 bg-[#013089] text-white">
                        {org.acronym}
                      </Badge>
                    )}
                    <span className="text-[10px] text-slate-500 font-medium capitalize bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded">
                      {org.jurisdiction || "National"}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm leading-snug">
                    {org.name}
                  </h3>

                  {org.states_uts?.name && (
                    <div className="flex items-center gap-1 text-[11px] text-slate-500">
                      <MapPin className="h-3 w-3 text-slate-400" />
                      <span>{org.states_uts.name}</span>
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/jobs?organization=${org.slug}`}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-[#013089] hover:underline"
                    >
                      <Briefcase className="h-3 w-3" />
                      <span>Jobs</span>
                    </Link>
                    <span className="text-slate-300">•</span>
                    <Link
                      href={`/exams?organization=${org.slug}`}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-[#013089] hover:underline"
                    >
                      <Calendar className="h-3 w-3" />
                      <span>Exams</span>
                    </Link>
                  </div>

                  {org.website_url && (
                    <a
                      href={org.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-slate-900"
                    >
                      <Globe className="h-3 w-3" />
                      <span>Portal</span>
                      <ExternalLink className="h-2.5 w-2.5" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center py-12 bg-white rounded-xl border border-slate-200 p-8">
              <Building2 className="mx-auto h-8 w-8 text-slate-400" />
              <h3 className="mt-2 text-sm font-bold text-slate-900">No organizations found</h3>
              <p className="mt-1 text-xs text-slate-500">Try adjusting your jurisdiction or search filters.</p>
              <div className="mt-4">
                <Link href="/directory">
                  <Button variant="brand" size="sm">
                    Reset Filters
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
}
