import Link from "next/link";
import { SITE_CONFIG, SYSTEM_MODULES } from "@/lib/constants";
import { getBreakingBulletins, getPublicBulletins } from "@/modules/bulletins/service";
import { BreakingTicker } from "@/modules/bulletins/components/breaking-ticker";
import { BulletinCard } from "@/modules/bulletins/components/bulletin-card";
import { SearchBar } from "@/components/shared/search-bar";
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
} from "lucide-react";

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

export default async function HomePage() {
  const [breakingBulletins, { bulletins: latestBulletins }] = await Promise.all([
    getBreakingBulletins(5),
    getPublicBulletins({ limit: 3 }),
  ]);

  return (
    <div className="space-y-16 pb-20">
      {/* Top Breaking Alert Ticker */}
      {breakingBulletins.length > 0 && (
        <BreakingTicker bulletins={breakingBulletins} />
      )}

      {/* Hero Section */}
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
              Structured & Verified
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base text-slate-600 sm:text-lg leading-relaxed">
            {SITE_CONFIG.description}
          </p>

          <div className="mx-auto mt-8 max-w-3xl">
            <SearchBar
              targetPath="/search"
              placeholder="Search central, state, defence, banking jobs, exams, organizations (UPSC, SSC), or post names..."
            />
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
              <span className="font-medium text-slate-700">Quick Searches:</span>
              <Link href="/search?search=Central+Govt" className="rounded-md bg-white px-2 py-0.5 border border-slate-200 text-slate-600 hover:text-brand-700 hover:border-brand-300 transition-colors">Central Govt</Link>
              <Link href="/search?search=State+PSC" className="rounded-md bg-white px-2 py-0.5 border border-slate-200 text-slate-600 hover:text-brand-700 hover:border-brand-300 transition-colors">State PSCs</Link>
              <Link href="/search?search=Defence+Police" className="rounded-md bg-white px-2 py-0.5 border border-slate-200 text-slate-600 hover:text-brand-700 hover:border-brand-300 transition-colors">Defence & Police</Link>
              <Link href="/search?search=Banking" className="rounded-md bg-white px-2 py-0.5 border border-slate-200 text-slate-600 hover:text-brand-700 hover:border-brand-300 transition-colors">Banking</Link>
              <Link href="/search?search=Railways" className="rounded-md bg-white px-2 py-0.5 border border-slate-200 text-slate-600 hover:text-brand-700 hover:border-brand-300 transition-colors">Railways</Link>
            </div>
          </div>
        </div>
      </section>

      {/* High-Engagement Section: Employment News & Student Advisories Desk */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-700">
              <Flame className="h-4 w-4" />
              <span>Real-Time Information Desk</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl font-heading mt-1">
              Employment News & Student Advisories
            </h2>
            <p className="text-sm text-slate-500 mt-1 max-w-xl">
              Weekly Rozgar Samachar digests, official commission responses to student protests, and court stay orders.
            </p>
          </div>

          <Link href="/news">
            <Button variant="outline" size="sm" className="gap-1.5 font-semibold text-xs">
              <span>View All News & Advisories</span>
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
            <h3 className="text-base font-bold text-slate-800">Employment News & Student Desk Initialized</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              Weekly Employment News digests and verified student advisories will appear here once published by editorial administrators.
            </p>
            <div className="mt-4">
              <Link href="/news">
                <Button variant="outline" size="sm" className="text-xs font-semibold">
                  Browse Public News & Advisories
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
    </div>
  );
}
