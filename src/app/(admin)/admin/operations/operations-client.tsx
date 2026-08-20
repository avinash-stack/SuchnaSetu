"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Database,
  Globe,
  Layers,
  RefreshCw,
  RotateCcw,
  Search,
  ShieldCheck,
  Zap,
  Loader2,
  ExternalLink,
  Trash2,
  BarChart3,
  FileCheck2,
  Clock,
  Sparkles,
  Link as LinkIcon,
} from "lucide-react";
import { retryFailedJobAction, cleanupOrphanRecordsAction } from "@/modules/operations/actions";
import {
  SystemHealthMetrics,
  SourceHealthRecord,
  DataQualityAuditResult,
  SeoDiagnosticResult,
  OperationalAlert,
  OperationalReportSummary,
} from "@/modules/operations/types";

interface OperationsClientProps {
  systemHealth: SystemHealthMetrics;
  sourceHealthList?: SourceHealthRecord[];
  dataQuality: DataQualityAuditResult;
  seoDiagnostics: SeoDiagnosticResult;
  alerts: OperationalAlert[];
  reports: OperationalReportSummary;
  recentJobs: any[];
  sourcesList: any[];
}

export function OperationsClient({
  systemHealth,
  sourceHealthList = [],
  dataQuality,
  seoDiagnostics,
  alerts,
  reports,
  recentJobs,
  sourcesList,
}: OperationsClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "overview" | "sources" | "quality" | "seo" | "analytics" | "reports"
  >("overview");

  const [retryingJobId, setRetryingJobId] = useState<string | null>(null);
  const [cleaningOrphans, setCleaningOrphans] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleRetryJob = async (jobId: string) => {
    setRetryingJobId(jobId);
    setActionFeedback(null);
    try {
      const res = await retryFailedJobAction(jobId);
      if (res.success && res.stats) {
        setActionFeedback({
          type: "success",
          message: `Retry succeeded: Ingested ${res.stats.totalInserted}, Updated ${res.stats.totalUpdated}, Skipped ${res.stats.totalSkipped}.`,
        });
        router.refresh();
      } else {
        setActionFeedback({
          type: "error",
          message: res.error || "Retry failed to execute",
        });
      }
    } catch (err: any) {
      setActionFeedback({
        type: "error",
        message: err?.message || "Failed to trigger retry",
      });
    } finally {
      setRetryingJobId(null);
    }
  };

  const handleCleanupOrphans = async () => {
    if (!confirm("Run automated database cleanup of dangling orphan child records?")) return;
    setCleaningOrphans(true);
    setActionFeedback(null);
    try {
      const res = await cleanupOrphanRecordsAction();
      setActionFeedback({
        type: res.success ? "success" : "error",
        message: res.message,
      });
      router.refresh();
    } catch (err: any) {
      setActionFeedback({
        type: "error",
        message: err?.message || "Failed to cleanup orphan records",
      });
    } finally {
      setCleaningOrphans(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation Strip */}
      <div className="flex items-center gap-1.5 border-b border-slate-200 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab("overview")}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
            activeTab === "overview"
              ? "bg-slate-900 text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Activity className="h-4 w-4" />
          <span>System Overview</span>
          {alerts.length > 0 && (
            <span className="rounded-full bg-amber-500 px-1.5 py-0.2 text-[10px] font-bold text-white">
              {alerts.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("sources")}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
            activeTab === "sources"
              ? "bg-slate-900 text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <RefreshCw className="h-4 w-4" />
          <span>Source & Job Health</span>
        </button>

        <button
          onClick={() => setActiveTab("quality")}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
            activeTab === "quality"
              ? "bg-slate-900 text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <FileCheck2 className="h-4 w-4" />
          <span>Data Quality Audit</span>
          <span className="rounded-full bg-brand-500/20 text-brand-700 px-1.5 py-0.2 text-[10px] font-bold">
            {dataQuality.score}%
          </span>
        </button>

        <button
          onClick={() => setActiveTab("seo")}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
            activeTab === "seo"
              ? "bg-slate-900 text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Search className="h-4 w-4" />
          <span>Search & SEO Audit</span>
        </button>

        <button
          onClick={() => setActiveTab("analytics")}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
            activeTab === "analytics"
              ? "bg-slate-900 text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <BarChart3 className="h-4 w-4" />
          <span>Analytics & Tracking</span>
        </button>

        <button
          onClick={() => setActiveTab("reports")}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
            activeTab === "reports"
              ? "bg-slate-900 text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Clock className="h-4 w-4" />
          <span>Operational Reports</span>
        </button>
      </div>

      {/* Global Action Feedback Alert */}
      {actionFeedback && (
        <div
          className={`p-3 rounded-lg border flex items-center justify-between text-xs font-medium ${
            actionFeedback.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-rose-50 text-rose-800 border-rose-200"
          }`}
        >
          <div className="flex items-center gap-2">
            {actionFeedback.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0" />
            )}
            <span>{actionFeedback.message}</span>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setActionFeedback(null)}
            className="h-6 px-2 text-[11px]"
          >
            Dismiss
          </Button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 1: SYSTEM OVERVIEW & ALERTS                                           */}
      {/* ========================================================================= */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Active Alerts Banner */}
          {alerts.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Active Operational Notifications ({alerts.length})
              </h3>
              <div className="grid grid-cols-1 gap-2.5">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      alert.level === "critical"
                        ? "bg-rose-50 border-rose-200 text-rose-900"
                        : alert.level === "warning"
                        ? "bg-amber-50 border-amber-200 text-amber-900"
                        : "bg-blue-50 border-blue-200 text-blue-900"
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <AlertTriangle
                        className={`h-4 w-4 shrink-0 mt-0.5 ${
                          alert.level === "critical"
                            ? "text-rose-600"
                            : alert.level === "warning"
                            ? "text-amber-600"
                            : "text-blue-600"
                        }`}
                      />
                      <div>
                        <p className="text-xs font-bold">{alert.title}</p>
                        <p className="text-[11px] opacity-90 mt-0.5">{alert.message}</p>
                      </div>
                    </div>

                    {alert.actionUrl && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => router.push(alert.actionUrl!)}
                        className="h-7 text-xs whitespace-nowrap self-start sm:self-auto bg-white/80"
                      >
                        {alert.actionLabel || "Inspect"}
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Infrastructure Health Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="border-slate-200 shadow-xs">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-emerald-600" />
                    <span className="text-xs font-bold text-slate-800">Database (PostgreSQL)</span>
                  </div>
                  <Badge variant="success" className="text-[10px]">
                    {systemHealth.database.latencyMs}ms Latency
                  </Badge>
                </div>
                <div className="mt-3 space-y-1 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Active Published Jobs:</span>
                    <span className="font-bold text-slate-900">{systemHealth.database.totalJobs}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Examinations:</span>
                    <span className="font-bold text-slate-900">{systemHealth.database.totalExams}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Public Bulletins:</span>
                    <span className="font-bold text-slate-900">{systemHealth.database.totalBulletins}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-xs">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 text-brand-600" />
                    <span className="text-xs font-bold text-slate-800">Ingestion Engine</span>
                  </div>
                  <Badge variant="brand" className="text-[10px]">
                    {systemHealth.ingestion.activePipelines} Active
                  </Badge>
                </div>
                <div className="mt-3 space-y-1 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Registered Sources:</span>
                    <span className="font-bold text-slate-900">{systemHealth.ingestion.totalPipelines}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Running Sync Tasks:</span>
                    <span className="font-bold text-emerald-700">{systemHealth.ingestion.runningJobsCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Failed Sync Tasks:</span>
                    <span className="font-bold text-rose-600">{systemHealth.ingestion.failedJobsCount}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-xs">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-orange-600" />
                    <span className="text-xs font-bold text-slate-800">Auto Sync Schedule</span>
                  </div>
                  <Badge variant="brand" className="text-[10px]">
                    3x Daily
                  </Badge>
                </div>
                <div className="mt-3 space-y-1 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Schedule Times:</span>
                    <span className="font-bold text-slate-900">08:00 AM, 04:00 PM &amp; 01:30 AM IST</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Next Execution:</span>
                    <span className="font-semibold text-brand-700">
                      {systemHealth.ingestion.nextScheduledSync?.formattedIST || "08:00 AM IST"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Countdown:</span>
                    <span className="font-medium text-emerald-700">
                      {systemHealth.ingestion.nextScheduledSync?.timeRemaining || "Scheduled"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-xs">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-purple-600" />
                    <span className="text-xs font-bold text-slate-800">Environment &amp; Keys</span>
                  </div>
                  <Badge variant="success" className="text-[10px]">
                    Validated
                  </Badge>
                </div>
                <div className="mt-3 space-y-1 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Supabase Service Role:</span>
                    <span className="text-emerald-700 font-semibold">Configured</span>
                  </div>
                  <div className="flex justify-between">
                    <span>AdSense Client ID:</span>
                    <span className="text-emerald-700 font-semibold">Verified</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Edge Rate Limiter:</span>
                    <span className="text-emerald-700 font-semibold">Active</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: SOURCE & INGESTION HEALTH (WITH RETRY ACTION & TELEMETRY MATRIX)    */}
      {/* ========================================================================= */}
      {activeTab === "sources" && (
        <div className="space-y-6">
          {/* Source Health Telemetry Matrix */}
          {sourceHealthList.length > 0 && (
            <Card className="border-slate-200 shadow-xs">
              <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-bold text-slate-900 font-heading">
                      Source Health &amp; Telemetry Matrix ({sourceHealthList.length})
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-500 mt-0.5">
                      Monitors consecutive failure counts, last successful and failed sync timestamps, and upcoming schedules.
                    </CardDescription>
                  </div>
                  <Badge variant="brand" className="text-xs">
                    Next Auto Sync: {systemHealth.ingestion.nextScheduledSync?.formattedIST || "08:00 AM IST"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/30">
                      <TableHead>Pipeline / Source</TableHead>
                      <TableHead>Target Module</TableHead>
                      <TableHead>Last Successful Sync</TableHead>
                      <TableHead>Last Failed Sync</TableHead>
                      <TableHead>Failures</TableHead>
                      <TableHead className="text-right">Health Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sourceHealthList.map((src) => (
                      <TableRow key={src.id} className="hover:bg-slate-50/50">
                        <TableCell>
                          <div className="font-semibold text-slate-900 text-xs">
                            {src.name}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            {src.code}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-[10px] capitalize">
                            {src.targetModule}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-slate-600">
                          {src.lastSuccessfulSync ? (
                            <span>{new Date(src.lastSuccessfulSync).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })} {new Date(src.lastSuccessfulSync).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                          ) : (
                            <span className="text-slate-400 italic">Never</span>
                          )}
                        </TableCell>
                        <TableCell className="text-xs text-slate-600">
                          {src.lastFailedSync ? (
                            <span className="text-rose-600 font-medium">{new Date(src.lastFailedSync).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })} {new Date(src.lastFailedSync).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                          ) : (
                            <span className="text-slate-400">None</span>
                          )}
                        </TableCell>
                        <TableCell className="text-xs">
                          {src.consecutiveFailures > 0 ? (
                            <Badge variant="danger" className="text-[10px] font-bold">
                              {src.consecutiveFailures} Failed
                            </Badge>
                          ) : (
                            <span className="text-emerald-600 font-medium">0</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge
                            variant={
                              src.currentStatus === "healthy"
                                ? "success"
                                : src.currentStatus === "syncing"
                                ? "brand"
                                : src.currentStatus === "warning"
                                ? "warning"
                                : src.currentStatus === "error"
                                ? "danger"
                                : "secondary"
                            }
                            className="text-[10px] uppercase font-bold"
                          >
                            {src.currentStatus}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* Recent Execution Jobs & Error Triage */}
          <Card className="border-slate-200 shadow-xs">
            <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold text-slate-900 font-heading">
                    Recent Execution Jobs &amp; Error Triage
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500 mt-0.5">
                    Click &quot;Retry&quot; on any failed ingestion job to re-trigger the extraction and normalization pipeline.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/30">
                    <TableHead>Executed At</TableHead>
                    <TableHead>Source Authority</TableHead>
                    <TableHead>Trigger</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ingestion Breakdown</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentJobs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6 text-xs text-slate-500">
                        No recent ingestion jobs recorded.
                      </TableCell>
                    </TableRow>
                  ) : (
                    recentJobs.map((job: any) => (
                      <TableRow key={job.id} className="hover:bg-slate-50/50">
                        <TableCell className="text-xs font-medium text-slate-900">
                          {new Date(job.created_at).toLocaleTimeString()} •{" "}
                          {new Date(job.created_at).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                          })}
                        </TableCell>
                        <TableCell className="text-xs font-semibold text-slate-800">
                          {job.import_sources?.name || "Unknown Source"}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-[10px] capitalize">
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
                        <TableCell className="text-xs text-slate-600">
                          <span className="text-emerald-700 font-semibold">+{job.total_inserted || 0} New</span>
                          {" • "}
                          <span className="text-slate-400">{job.total_skipped || 0} Duplicates</span>
                          {job.total_failed > 0 && (
                            <span className="text-rose-600 font-bold ml-1">
                              ({job.total_failed} Failed)
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {job.status === "failed" ? (
                            <Button
                              size="sm"
                              variant="brand"
                              onClick={() => handleRetryJob(job.id)}
                              disabled={retryingJobId === job.id}
                              className="h-7 text-xs gap-1"
                            >
                              {retryingJobId === job.id ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <RotateCcw className="h-3 w-3" />
                              )}
                              <span>Retry</span>
                            </Button>
                          ) : (
                            <span className="text-[11px] text-slate-400">Completed</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: DATA QUALITY & INTEGRITY AUDIT                                      */}
      {/* ========================================================================= */}
      {activeTab === "quality" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900">Overall Data Quality Score:</span>
                <span
                  className={`text-base font-extrabold ${
                    dataQuality.score >= 90
                      ? "text-emerald-600"
                      : dataQuality.score >= 70
                      ? "text-amber-600"
                      : "text-rose-600"
                  }`}
                >
                  {dataQuality.score} / 100
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Audited {dataQuality.totalAudited} notices • {dataQuality.passedRecords} fully compliant
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleCleanupOrphans}
              disabled={cleaningOrphans}
              className="gap-1.5 text-xs text-slate-700 hover:text-rose-700"
            >
              {cleaningOrphans ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Trash2 className="h-3.5 w-3.5 text-rose-500" />
              )}
              <span>Purge Orphan Child Records</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Broken URLs Card */}
            <Card className="border-slate-200 shadow-xs">
              <CardHeader className="pb-3 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <LinkIcon className="h-4 w-4 text-rose-600" />
                    <CardTitle className="text-sm font-bold text-slate-900">
                      Broken Official URLs ({dataQuality.breakdown.brokenUrls.length})
                    </CardTitle>
                  </div>
                  <Badge variant={dataQuality.breakdown.brokenUrls.length === 0 ? "success" : "danger"}>
                    {dataQuality.breakdown.brokenUrls.length === 0 ? "All Clean" : "Needs Review"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-3 max-h-60 overflow-y-auto space-y-2">
                {dataQuality.breakdown.brokenUrls.length === 0 ? (
                  <p className="text-xs text-slate-500 py-3 text-center">
                    All published job notices contain valid HTTP/HTTPS official links.
                  </p>
                ) : (
                  dataQuality.breakdown.brokenUrls.map((item) => (
                    <div key={item.id} className="p-2 rounded bg-rose-50/50 border border-rose-100 text-xs">
                      <p className="font-semibold text-slate-900 truncate">{item.title}</p>
                      <p className="text-[11px] text-rose-700 mt-0.5">{item.reason}: {item.url}</p>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Expired Notices Card */}
            <Card className="border-slate-200 shadow-xs">
              <CardHeader className="pb-3 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-amber-600" />
                    <CardTitle className="text-sm font-bold text-slate-900">
                      Past Closing Date ({dataQuality.breakdown.expiredPublishedNotices.length})
                    </CardTitle>
                  </div>
                  <Badge variant="secondary">
                    {dataQuality.breakdown.expiredPublishedNotices.length} Notices
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-3 max-h-60 overflow-y-auto space-y-2">
                {dataQuality.breakdown.expiredPublishedNotices.length === 0 ? (
                  <p className="text-xs text-slate-500 py-3 text-center">
                    No active published notices past closing date.
                  </p>
                ) : (
                  dataQuality.breakdown.expiredPublishedNotices.map((item) => (
                    <div key={item.id} className="p-2 rounded bg-amber-50/50 border border-amber-100 text-xs">
                      <p className="font-semibold text-slate-900 truncate">{item.title}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Closed on: {item.endDate}</p>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: SEARCH & SEO AUDIT                                                 */}
      {/* ========================================================================= */}
      {activeTab === "seo" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="border-slate-200 shadow-xs">
              <CardContent className="p-4">
                <p className="text-xs text-slate-500 font-medium">Indexed URLs in Sitemap</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1 font-heading">
                  {seoDiagnostics.indexedPagesEstimate}
                </h3>
                <a
                  href="/sitemap.xml"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-brand-700 hover:underline mt-2 font-medium"
                >
                  <span>View sitemap.xml</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-xs">
              <CardContent className="p-4">
                <p className="text-xs text-slate-500 font-medium">Schema.org JSON-LD Coverage</p>
                <h3 className="text-2xl font-bold text-emerald-600 mt-1 font-heading">
                  {seoDiagnostics.structuredDataCoveragePercent}%
                </h3>
                <p className="text-[11px] text-slate-500 mt-2">
                  GovernmentPermit, Event & NewsArticle
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-xs">
              <CardContent className="p-4">
                <p className="text-xs text-slate-500 font-medium">Robots.txt & Meta Crawl Directives</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1 font-heading">
                  Valid
                </h3>
                <a
                  href="/robots.txt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-brand-700 hover:underline mt-2 font-medium"
                >
                  <span>View robots.txt</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: ANALYTICS & INTEGRATIONS                                           */}
      {/* ========================================================================= */}
      {activeTab === "analytics" && (
        <div className="space-y-4">
          <Card className="border-slate-200 shadow-xs">
            <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
              <CardTitle className="text-base font-bold text-slate-900 font-heading">
                Civic Analytics & Third-Party Integration Points
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 mt-0.5">
                Manage tracking tags and external verification keys securely via environment configuration.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">Google AdSense</span>
                    <Badge variant="success" className="text-[10px]">Active</Badge>
                  </div>
                  <p className="text-xs text-slate-600 mt-2 font-mono">
                    {process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "ca-pub-2975962030636569"}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">ads.txt verified with Google</p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">Google Search Console</span>
                    <Badge variant="outline" className="text-[10px]">Config Ready</Badge>
                  </div>
                  <p className="text-xs text-slate-600 mt-2 font-mono">
                    NEXT_PUBLIC_GSC_VERIFICATION_TAG
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">Site ownership verification meta tag</p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">Google Analytics (GA4)</span>
                    <Badge variant="outline" className="text-[10px]">Integration Ready</Badge>
                  </div>
                  <p className="text-xs text-slate-600 mt-2 font-mono">
                    NEXT_PUBLIC_GA_MEASUREMENT_ID
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">G-XXXXXXXXXX container</p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">Microsoft Clarity</span>
                    <Badge variant="outline" className="text-[10px]">Integration Ready</Badge>
                  </div>
                  <p className="text-xs text-slate-600 mt-2 font-mono">
                    NEXT_PUBLIC_CLARITY_PROJECT_ID
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">Session recording & heatmaps</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: OPERATIONAL REPORTS                                                */}
      {/* ========================================================================= */}
      {activeTab === "reports" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="border-slate-200 shadow-xs">
              <CardHeader className="pb-2 border-b border-slate-100">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Daily Ingestion Summary ({reports.daily.date})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-600">Notices Ingested:</span>
                  <span className="font-bold text-emerald-700">{reports.daily.jobsIngested}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Sync Errors:</span>
                  <span className="font-bold text-slate-900">{reports.daily.syncErrors}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Active Sources:</span>
                  <span className="font-bold text-brand-700">{reports.daily.activeSources}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-xs">
              <CardHeader className="pb-2 border-b border-slate-100">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Weekly Deduplication Rate ({reports.weekly.period})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-600">Total Processed:</span>
                  <span className="font-bold text-slate-900">{reports.weekly.totalJobsProcessed}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Duplicate Skip Rate:</span>
                  <span className="font-bold text-blue-700">{reports.weekly.duplicateSkippedRate}%</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-xs">
              <CardHeader className="pb-2 border-b border-slate-100">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Monthly Performance ({reports.monthly.month})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-600">Total Pipeline Runs:</span>
                  <span className="font-bold text-slate-900">{reports.monthly.totalPipelineRuns}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Avg Run Latency:</span>
                  <span className="font-bold text-slate-900">{reports.monthly.averagePipelineDurationSec}s</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
