import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  RefreshCw,
  Layers,
  GraduationCap,
  Newspaper,
  Clock,
  Briefcase,
} from "lucide-react";
import { SourcesManagementClient } from "./sources-management-client";
import { getNextScheduledSync } from "@/modules/ingestion/config/scheduler.config";

export default async function AdminSourcesPage() {
  const supabase = await createClient();
  const nextSync = getNextScheduledSync();

  // 1. Fetch Automated Ingestion Sources
  const { data: importSources } = await (supabase.from("import_sources") as any)
    .select("*, organizations(name, acronym, state_code, jurisdiction)")
    .order("name", { ascending: true });

  // 2. Fetch Recent Ingestion Jobs to identify running tasks
  const { data: recentJobs } = await (supabase.from("import_jobs") as any)
    .select("id, source_id, status, created_at")
    .order("created_at", { ascending: false })
    .limit(30);

  // 3. Fetch Official Verified Portal Registry
  const { data: officialSources } = await supabase
    .from("official_sources")
    .select("*, organizations(name, acronym)")
    .order("name", { ascending: true });

  const totalSources = importSources?.length || 0;
  const activeSources = (importSources || []).filter((s: any) => s.is_enabled).length;

  // Track active running jobs
  const runningSourceIds = (recentJobs || [])
    .filter((j: any) => j.status === "running")
    .map((j: any) => j.source_id);

  // Categorize sources
  const examSources = (importSources || []).filter(
    (s: any) => s.target_module === "exams"
  );
  const newsSources = (importSources || []).filter(
    (s: any) => s.target_module === "bulletins"
  );
  const nationalRecruitmentSources = (importSources || []).filter(
    (s: any) =>
      s.target_module === "jobs" &&
      s.organizations?.jurisdiction !== "state" &&
      s.code !== "benchmark_mock_feed"
  );
  const stateRecruitmentSources = (importSources || []).filter(
    (s: any) =>
      s.target_module === "jobs" &&
      s.organizations?.jurisdiction === "state"
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-heading">
          Official Sources &amp; Ingestion Hub
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage automated extraction pipelines for Government Exams, News, Recruitment authorities, and official portal registries.
        </p>
      </div>

      {/* Auto-Sync Schedule Strip */}
      <div className="rounded-xl border border-brand-200 bg-brand-50/50 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <Clock className="h-4 w-4 text-brand-700 shrink-0" />
          <div>
            <span className="font-bold text-slate-900">Automatic Sync Schedule: </span>
            <span className="text-slate-700">
              Runs twice daily at <strong>06:00 AM IST</strong> &amp; <strong>06:00 PM IST</strong>.
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="brand" className="text-[11px] font-semibold py-0.5">
            Next Auto Run: {nextSync.formattedIST} ({nextSync.timeRemaining})
          </Badge>
        </div>
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
                {activeSources} Active &amp; Ready
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
                Exams &amp; Notifications
              </p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1 font-heading">
                {examSources.length} Pipelines
              </h3>
              <p className="text-[11px] text-orange-600 mt-0.5 font-medium">UPSC, SSC, RRB &amp; States</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
              <GraduationCap className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                News &amp; Bulletins
              </p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1 font-heading">
                {newsSources.length} Pipelines
              </h3>
              <p className="text-[11px] text-emerald-600 mt-0.5 font-medium">PIB, Rozgar &amp; Ministry</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-700">
              <Newspaper className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                Recruitment Pipelines
              </p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1 font-heading">
                {nationalRecruitmentSources.length + stateRecruitmentSources.length}
              </h3>
              <p className="text-[11px] text-blue-600 mt-0.5 font-medium">
                {nationalRecruitmentSources.length} National • {stateRecruitmentSources.length} State
              </p>
            </div>
            <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-700">
              <Briefcase className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 4-Tab Management Console with Pagination & Tab-Wise Sync */}
      <SourcesManagementClient
        examSources={examSources}
        newsSources={newsSources}
        nationalRecruitmentSources={nationalRecruitmentSources}
        stateRecruitmentSources={stateRecruitmentSources}
        officialSources={officialSources || []}
        runningSourceIds={runningSourceIds}
      />
    </div>
  );
}
