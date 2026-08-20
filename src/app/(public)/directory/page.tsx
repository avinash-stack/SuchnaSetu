import { Metadata } from "next";
import Link from "next/link";
import { createPublicClient } from "@/lib/supabase/public";
import { unstable_cache } from "next/cache";
import { constructMetadata } from "@/lib/seo";
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
  CheckCircle2,
  X,
  Search,
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
  let title = "Public Directory - Recruiting Organizations, Commissions & Courts";
  if (params.search) {
    title = `Search: "${params.search}" - Directory | SuchnaSetu`;
  }
  return constructMetadata({
    title,
    description: "Official public directory of government recruiting authorities, UPSC, SSC, State PSCs, High Courts, Central PSUs, and ministries across India.",
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

  // Calculate statistics
  const totalCount = allOrgs.length;
  const centralCount = allOrgs.filter((o) => (o.jurisdiction || "").toLowerCase() === "central" || (o.jurisdiction || "").toLowerCase() === "national").length;
  const stateCount = allOrgs.filter((o) => (o.jurisdiction || "").toLowerCase() === "state").length;
  const courtsCount = allOrgs.filter((o) => (o.name || "").toLowerCase().includes("court") || (o.jurisdiction || "").toLowerCase().includes("court")).length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* 1. Header Masthead */}
      <div className="section-saffron-bar flex flex-col md:flex-row md:items-end justify-between border-b border-slate-200 pb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#013089]">
            <Building2 className="h-4 w-4" />
            <span>Master Public Authority Directory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F172A] font-heading mt-1">
            Recruiting Organizations, Commissions &amp; Courts
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Public directory of constitutional commissions, High Courts, Central Ministries, State PSCs, and public enterprises monitored for notices.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="navy" className="text-xs py-1 px-2.5">
            {totalCount} Verified Authorities
          </Badge>
        </div>
      </div>

      {/* 2. Search & Jurisdiction Filters */}
      <div className="space-y-4">
        <div className="max-w-3xl space-y-3">
          <SearchBar
            targetPath="/directory"
            placeholder="Search organizations by name (UPSC, SSC, BSSC), court (Patna, Allahabad), or state..."
          />

          {/* Active Search Pill */}
          {params.search && (
            <div className="flex items-center gap-2 text-xs text-slate-700 bg-slate-100 border border-slate-200 px-3 py-1 rounded-xs w-fit">
              <span>
                Showing results for: <strong>&ldquo;{params.search}&rdquo;</strong> ({filteredOrgs.length} matches)
              </span>
              <Link
                href={buildClearSearchUrl(params)}
                className="text-slate-500 hover:text-slate-900 p-0.5 rounded-xs transition-colors"
                title="Clear search query"
              >
                <X className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          <Link
            href={buildJurisdictionUrl(params, "all")}
            className={`rounded-xs px-3 py-1.5 font-semibold transition-colors shrink-0 ${
              currentJurisdiction === "all"
                ? "bg-[#013089] text-white font-bold"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
            }`}
          >
            All Authorities ({totalCount})
          </Link>
          <Link
            href={buildJurisdictionUrl(params, "central")}
            className={`rounded-xs px-3 py-1.5 font-semibold transition-colors shrink-0 ${
              currentJurisdiction === "central"
                ? "bg-[#013089] text-white font-bold"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
            }`}
          >
            Central &amp; National ({centralCount})
          </Link>
          <Link
            href={buildJurisdictionUrl(params, "state")}
            className={`rounded-xs px-3 py-1.5 font-semibold transition-colors shrink-0 ${
              currentJurisdiction === "state"
                ? "bg-[#013089] text-white font-bold"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
            }`}
          >
            State Commissions ({stateCount})
          </Link>
          <Link
            href={buildJurisdictionUrl(params, "judiciary")}
            className={`rounded-xs px-3 py-1.5 font-semibold transition-colors shrink-0 ${
              currentJurisdiction === "judiciary"
                ? "bg-[#013089] text-white font-bold"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
            }`}
          >
            Courts &amp; Judiciary ({courtsCount})
          </Link>
          <Link
            href={buildJurisdictionUrl(params, "psu")}
            className={`rounded-xs px-3 py-1.5 font-semibold transition-colors shrink-0 ${
              currentJurisdiction === "psu"
                ? "bg-[#013089] text-white font-bold"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
            }`}
          >
            PSUs &amp; Corporations
          </Link>
        </div>
      </div>

      {/* 3. Organizations Directory Table / Grid */}
      <div className="space-y-4">
        {filteredOrgs.length > 0 ? (
          <div className="overflow-x-auto rounded-xs border border-slate-200 bg-white shadow-xs">
            <table className="w-full text-left text-xs gazette-table">
              <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200 text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="p-3 pl-4">Authority &amp; Acronym</th>
                  <th className="p-3">Jurisdiction</th>
                  <th className="p-3">State / Location</th>
                  <th className="p-3">Official Website</th>
                  <th className="p-3 pr-4 text-right">Notices on SuchnaSetu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrgs.map((org) => (
                  <tr key={org.id} className="transition-colors">
                    <td className="p-3 pl-4">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center rounded-xs bg-[#013089] px-1.5 py-0.5 text-[10px] font-bold text-white uppercase font-mono">
                          {org.acronym || "GOVT"}
                        </span>
                        <span className="font-bold text-slate-900 text-sm">
                          {org.name}
                        </span>
                      </div>
                    </td>
                    <td className="p-3 text-slate-700 capitalize font-medium">
                      {org.jurisdiction || "Autonomous / Public Body"}
                    </td>
                    <td className="p-3 text-slate-600">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-slate-400" />
                        <span>{org.states_uts?.name || "All India"}</span>
                      </span>
                    </td>
                    <td className="p-3">
                      {org.website_url ? (
                        <a
                          href={org.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#013089] hover:underline"
                        >
                          <Globe className="h-3.5 w-3.5 text-slate-400" />
                          <span>Official Portal</span>
                          <ExternalLink className="h-3 w-3 text-slate-400" />
                        </a>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Gazette Registry</span>
                      )}
                    </td>
                    <td className="p-3 pr-4 text-right">
                      <Link
                        href={`/jobs?organization=${org.slug}`}
                        className="inline-flex items-center gap-1 font-bold text-xs text-[#013089] hover:underline"
                      >
                        <Briefcase className="h-3 w-3" />
                        <span>View Jobs &rarr;</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-xs border border-slate-200 bg-white p-10 text-center space-y-3">
            <Building2 className="h-10 w-10 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-900 font-heading">
              No organizations found matching &ldquo;{params.search}&rdquo;
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Try searching by abbreviation (<span className="font-semibold text-slate-700">UPSC, SSC, BSSC, PHC</span>) or clearing the filters.
            </p>
            <Link href="/directory">
              <Button variant="outline" size="sm" className="text-xs mt-2">
                Clear Filters
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
