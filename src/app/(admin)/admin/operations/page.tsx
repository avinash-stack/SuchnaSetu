import { createClient } from "@/lib/supabase/server";
import {
  getSystemHealthOverview,
  getSourceHealthRegistry,
  getDataQualityAudit,
  getSeoDiagnostics,
  getOperationalAlerts,
  getOperationalReports,
} from "@/modules/operations/service";
import { OperationsClient } from "./operations-client";

export default async function AdminOperationsPage() {
  const supabase = await createClient();

  const [
    systemHealth,
    sourceHealthList,
    dataQuality,
    seoDiagnostics,
    alerts,
    reports,
    recentJobsRes,
    sourcesRes,
  ] = await Promise.all([
    getSystemHealthOverview(),
    getSourceHealthRegistry(),
    getDataQualityAudit(),
    getSeoDiagnostics(),
    getOperationalAlerts(),
    getOperationalReports(),
    (supabase.from("import_jobs") as any)
      .select("*, import_sources(name, code)")
      .order("created_at", { ascending: false })
      .limit(15),
    (supabase.from("import_sources") as any)
      .select("*, organizations(name, acronym)")
      .order("name", { ascending: true }),
  ]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-heading">
          Operations &amp; Observability Center
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Monitor source uptime, retry failed ingestion jobs, audit data quality, validate SEO indexing, and review platform telemetry.
        </p>
      </div>

      {/* Interactive Operations Console */}
      <OperationsClient
        systemHealth={systemHealth}
        sourceHealthList={sourceHealthList}
        dataQuality={dataQuality}
        seoDiagnostics={seoDiagnostics}
        alerts={alerts}
        reports={reports}
        recentJobs={recentJobsRes.data || []}
        sourcesList={sourcesRes.data || []}
      />
    </div>
  );
}
