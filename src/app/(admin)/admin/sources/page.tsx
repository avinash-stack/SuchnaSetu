import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import {
  Globe,
  CheckCircle2,
  ExternalLink,
  RefreshCw,
  Layers,
  Database,
  Activity,
  ShieldCheck,
  Building2,
  MapPin,
} from "lucide-react";
import { SourceActionsClient, JobLogsViewer, BulkSyncButton } from "./source-actions-client";

export default async function AdminSourcesPage() {
  const supabase = await createClient();

  // 1. Fetch Automated Ingestion Sources
  const { data: importSources } = await (supabase.from("import_sources") as any)
    .select("*, organizations(name, acronym, state_code, jurisdiction)")
    .order("name", { ascending: true });

  // 2. Fetch Recent Ingestion Jobs History
  const { data: recentJobs } = await (supabase.from("import_jobs") as any)
    .select("*, import_sources(name, code, target_module)")
    .order("created_at", { ascending: false })
    .limit(15);

  // 3. Fetch Official Verified Portal Registry
  const { data: officialSources } = await supabase
    .from("official_sources")
    .select("*, organizations(name, acronym)")
    .order("name", { ascending: true });

  const totalSources = importSources?.length || 0;
  const activeSources = (importSources || []).filter((s: any) => s.is_enabled).length;
  const totalJobsExecuted = recentJobs?.length || 0;
  const totalInsertedCount = (recentJobs || []).reduce(
    (acc: number, j: any) => acc + (j.total_inserted || 0),
    0
  );

  // Categorize sources
  const nationalSources = (importSources || []).filter(
    (s: any) =>
      s.organizations?.jurisdiction !== "state" && s.code !== "benchmark_mock_feed"
  );
  const stateSources = (importSources || []).filter(
    (s: any) => s.organizations?.jurisdiction === "state"
  );
  const benchmarkSources = (importSources || []).filter(
    (s: any) => s.code === "benchmark_mock_feed"
  );

  return (
    <div className="space-y-8">
      {/* Top Header with Bulk Sync CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-heading">
            Data Import & Ingestion Hub
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Automated extraction pipelines, official source connectors, SHA-256 deduplication engine, and real-time audits.
          </p>
        </div>
        <BulkSyncButton />
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white border-slate-200 shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                Total Ingestion Pipelines
              </p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1 font-heading">
                {totalSources}
              </h3>
              <p className="text-[11px] text-emerald-600 mt-0.5 font-medium">
                {activeSources} Active & Ready
              </p>
            </div>
            <div className="h-10 w-10 rounded-full bg-brand-50 flex items-center justify-center text-brand-700">
              <RefreshCw className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                Jurisdiction Coverage
              </p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1 font-heading">
                18 Nat + 10 States
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Central Ministries & State PSCs</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-700">
              <Layers className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                Pipeline Executions
              </p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1 font-heading">
                {totalJobsExecuted}
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Tracking SHA-256 Hashes</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-700">
              <Activity className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                Total Ingested Notices
              </p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1 font-heading">
                {totalInsertedCount}
              </h3>
              <p className="text-[11px] text-emerald-600 mt-0.5 font-medium">
                Persisted to Domain Tables
              </p>
            </div>
            <div className="h-10 w-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-700">
              <Database className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Section 1: Priority 1 - National Recruitment Sources (18) */}
      <Card className="shadow-xs border-slate-200">
        <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-brand-700" />
              <div>
                <CardTitle className="text-base font-bold text-slate-900 font-heading">
                  Priority 1: National Recruitment Authorities ({nationalSources.length})
                </CardTitle>
                <CardDescription className="text-xs text-slate-500 mt-0.5">
                  UPSC, SSC, RRB, IBPS, SBI, India Post, DRDO, ISRO, AIIMS, ESIC, EPFO, and Armed/Paramilitary Forces.
                </CardDescription>
              </div>
            </div>
            <Badge variant="brand" className="text-xs">
              National Jurisdiction
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/30">
                <TableHead className="w-[300px]">Authority / Feed Name</TableHead>
                <TableHead>Adapter Key</TableHead>
                <TableHead>Last Synced</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {nationalSources.map((source: any) => (
                <TableRow key={source.id} className="hover:bg-slate-50/50">
                  <TableCell>
                    <div className="font-semibold text-slate-900 text-sm">
                      {source.name}
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                      <span className="font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 font-semibold">
                        {source.code}
                      </span>
                      {source.organizations?.name && (
                        <span>• {source.organizations.name}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono text-[10px] bg-slate-50">
                      {source.adapter_key}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-slate-600">
                    {source.last_synced_at ? (
                      <div className="space-y-0.5">
                        <p className="font-medium text-slate-800">
                          {new Date(source.last_synced_at).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {new Date(source.last_synced_at).toLocaleTimeString()}
                        </p>
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">Never synced</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={source.is_enabled ? "success" : "secondary"}
                      className="gap-1 text-[10px]"
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          source.is_enabled ? "bg-emerald-500" : "bg-slate-400"
                        }`}
                      />
                      <span>{source.is_enabled ? "Active" : "Disabled"}</span>
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <SourceActionsClient
                      sourceId={source.id}
                      sourceName={source.name}
                      sourceCode={source.code}
                      isEnabled={source.is_enabled}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Section 2: Priority 2 - State Public Service Commissions (10) */}
      <Card className="shadow-xs border-slate-200">
        <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-emerald-700" />
              <div>
                <CardTitle className="text-base font-bold text-slate-900 font-heading">
                  Priority 2: State Public Service Commissions ({stateSources.length})
                </CardTitle>
                <CardDescription className="text-xs text-slate-500 mt-0.5">
                  BPSC (Bihar), UPPSC (UP), MPPSC (MP), RPSC (Rajasthan), UKPSC (Uttarakhand), JPSC (Jharkhand), HPSC (Haryana), WBPSC (West Bengal), OPSC (Odisha), APSC (Assam).
                </CardDescription>
              </div>
            </div>
            <Badge variant="success" className="text-xs">
              State PSCs
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/30">
                <TableHead className="w-[300px]">Commission / State</TableHead>
                <TableHead>Adapter Key</TableHead>
                <TableHead>Last Synced</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stateSources.map((source: any) => (
                <TableRow key={source.id} className="hover:bg-slate-50/50">
                  <TableCell>
                    <div className="font-semibold text-slate-900 text-sm">
                      {source.name}
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                      <span className="font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 font-semibold">
                        {source.code}
                      </span>
                      {source.organizations?.state_code && (
                        <span className="font-bold text-emerald-700">
                          [{source.organizations.state_code}]
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono text-[10px] bg-slate-50">
                      {source.adapter_key}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-slate-600">
                    {source.last_synced_at ? (
                      <div className="space-y-0.5">
                        <p className="font-medium text-slate-800">
                          {new Date(source.last_synced_at).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {new Date(source.last_synced_at).toLocaleTimeString()}
                        </p>
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">Never synced</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={source.is_enabled ? "success" : "secondary"}
                      className="gap-1 text-[10px]"
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          source.is_enabled ? "bg-emerald-500" : "bg-slate-400"
                        }`}
                      />
                      <span>{source.is_enabled ? "Active" : "Disabled"}</span>
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <SourceActionsClient
                      sourceId={source.id}
                      sourceName={source.name}
                      sourceCode={source.code}
                      isEnabled={source.is_enabled}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Section 3: Recent Ingestion Pipeline Execution History */}
      <Card className="shadow-xs border-slate-200">
        <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
          <CardTitle className="text-base font-bold text-slate-900 font-heading">
            Pipeline Execution History & Audit Logs
          </CardTitle>
          <CardDescription className="text-xs text-slate-500 mt-0.5">
            Immutable log of extraction, SHA-256 deduplication, and domain persistence metrics.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/30">
                <TableHead>Executed At</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Trigger</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Stats Breakdown</TableHead>
                <TableHead className="text-right">Logs</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(recentJobs || []).length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-xs text-slate-500">
                    No execution jobs recorded yet. Click "Sync Now" on a registered source above or "Sync All Active Sources" to execute the pipeline.
                  </TableCell>
                </TableRow>
              ) : (
                (recentJobs || []).map((job: any) => (
                  <TableRow key={job.id} className="hover:bg-slate-50/50">
                    <TableCell className="text-xs font-medium text-slate-900">
                      <div>
                        {new Date(job.created_at).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {new Date(job.created_at).toLocaleTimeString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold text-slate-800 text-xs">
                        {job.import_sources?.name || "Unknown Source"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize text-[10px]">
                        {job.trigger_type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          job.status === "completed"
                            ? "success"
                            : job.status === "failed"
                            ? "danger"
                            : "warning"
                        }
                        className="text-[10px] uppercase font-bold"
                      >
                        {job.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-[11px]">
                        <span className="text-slate-600">
                          Extracted: <strong>{job.total_extracted || 0}</strong>
                        </span>
                        <span className="text-emerald-700">
                          Inserted: <strong>{job.total_inserted || 0}</strong>
                        </span>
                        <span className="text-blue-700">
                          Updated: <strong>{job.total_updated || 0}</strong>
                        </span>
                        <span className="text-slate-400">
                          Skipped: <strong>{job.total_skipped || 0}</strong>
                        </span>
                        {job.total_failed > 0 && (
                          <span className="text-rose-600 font-bold">
                            Failed: {job.total_failed}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <JobLogsViewer jobId={job.id} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Section 4: Verified Official Public Portals */}
      <Card className="shadow-xs border-slate-200">
        <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
          <CardTitle className="text-base font-bold text-slate-900 font-heading">
            Verified Official Public Sources Directory ({officialSources?.length || 0})
          </CardTitle>
          <CardDescription className="text-xs text-slate-500 mt-0.5">
            Verified constitutional commissions, ministries, and testing authorities.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/30">
                <TableHead>Portal Name</TableHead>
                <TableHead>Associated Authority</TableHead>
                <TableHead>Portal Type</TableHead>
                <TableHead>Base URL</TableHead>
                <TableHead className="text-right">Verification Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(officialSources || []).map((src: any) => (
                <TableRow key={src.id} className="hover:bg-slate-50/50">
                  <TableCell className="font-semibold text-slate-900 text-sm">
                    {src.name}
                  </TableCell>
                  <TableCell className="text-xs text-slate-600">
                    {src.organizations?.name || "General Aggregator"}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px] uppercase font-mono">
                      {src.portal_type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <a
                      href={src.base_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-brand-700 hover:underline font-medium"
                    >
                      <span>{src.base_url}</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge
                      variant={src.is_verified ? "success" : "warning"}
                      className="gap-1 text-[10px]"
                    >
                      <CheckCircle2 className="h-3 w-3" />
                      <span>{src.is_verified ? "Verified Official" : "Pending Audit"}</span>
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
