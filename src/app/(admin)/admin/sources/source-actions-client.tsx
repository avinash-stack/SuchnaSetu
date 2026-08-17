"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Play,
  Activity,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Eye,
  Loader2,
  Power,
  Zap,
} from "lucide-react";
import {
  triggerImportJob,
  testSourceConnection,
  getImportJobLogs,
  toggleSourceEnabledAction,
  bulkSyncSourcesAction,
} from "@/modules/ingestion/actions";

interface SourceActionsClientProps {
  sourceId: string;
  sourceName: string;
  sourceCode: string;
  isEnabled: boolean;
}

export function SourceActionsClient({
  sourceId,
  sourceName,
  sourceCode,
  isEnabled,
}: SourceActionsClientProps) {
  const router = useRouter();
  const [testing, setTesting] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [enabled, setEnabled] = useState(isEnabled);
  const [result, setResult] = useState<{
    type: "success" | "error" | "info";
    message: string;
    stats?: any;
  } | null>(null);

  const handleToggle = async () => {
    setToggling(true);
    try {
      const nextState = !enabled;
      const res = await toggleSourceEnabledAction(sourceId, nextState);
      if (res.success) {
        setEnabled(nextState);
        router.refresh();
      }
    } catch (err: any) {
      console.error("Toggle error:", err);
    } finally {
      setToggling(false);
    }
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setResult(null);
    try {
      const res = await testSourceConnection(sourceId);
      if (res.success) {
        setResult({
          type: "success",
          message: res.message,
        });
      } else {
        setResult({
          type: "error",
          message: res.message,
        });
      }
    } catch (err: any) {
      setResult({
        type: "error",
        message: err?.message || "Failed to test connection",
      });
    } finally {
      setTesting(false);
    }
  };

  const handleTriggerSync = async () => {
    setSyncing(true);
    setResult(null);
    try {
      const res = await triggerImportJob(sourceId);
      if (res.success && res.stats) {
        setResult({
          type: "success",
          message: `Sync completed: Extracted ${res.stats.totalExtracted}, Inserted ${res.stats.totalInserted}, Updated ${res.stats.totalUpdated}, Skipped (Duplicate) ${res.stats.totalSkipped}, Failed ${res.stats.totalFailed}`,
          stats: res.stats,
        });
        router.refresh();
      } else {
        setResult({
          type: "error",
          message: res.error || "Sync execution failed",
        });
      }
    } catch (err: any) {
      setResult({
        type: "error",
        message: err?.message || "Error running ingestion job",
      });
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5 flex-wrap">
        <Button
          size="sm"
          variant="outline"
          onClick={handleToggle}
          disabled={toggling || syncing}
          className={`h-7 px-2 text-[11px] gap-1 ${
            enabled
              ? "text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50"
              : "text-slate-500 hover:text-slate-700"
          }`}
          title={enabled ? "Disable this source" : "Enable this source"}
        >
          {toggling ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <Power className={`h-3 w-3 ${enabled ? "text-emerald-600" : "text-slate-400"}`} />
          )}
          <span>{enabled ? "Active" : "Disabled"}</span>
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={handleTestConnection}
          disabled={testing || syncing || !enabled}
          className="h-7 px-2 text-[11px] gap-1"
        >
          {testing ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <Activity className="h-3 w-3 text-blue-600" />
          )}
          <span>Test Feed</span>
        </Button>

        <Button
          size="sm"
          onClick={handleTriggerSync}
          disabled={testing || syncing || !enabled}
          className="h-7 px-2.5 text-[11px] gap-1 bg-brand-700 hover:bg-brand-800 text-white font-medium shadow-xs"
        >
          {syncing ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <Play className="h-3 w-3 fill-current" />
          )}
          <span>Sync Now</span>
        </Button>
      </div>

      {result && (
        <div
          className={`text-[11px] p-2 rounded border flex items-start gap-1.5 max-w-sm ${
            result.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-rose-50 text-rose-800 border-rose-200"
          }`}
        >
          {result.type === "success" ? (
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="h-3.5 w-3.5 text-rose-600 shrink-0 mt-0.5" />
          )}
          <span className="leading-tight">{result.message}</span>
        </div>
      )}
    </div>
  );
}

export function BulkSyncButton() {
  const router = useRouter();
  const [syncingAll, setSyncingAll] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);

  const handleBulkSync = async () => {
    if (!confirm("Run synchronization across all enabled official sources now?")) return;

    setSyncingAll(true);
    setSummary(null);
    try {
      const res = await bulkSyncSourcesAction();
      if (res.success) {
        setSummary(`Successfully synced ${res.totalSynced} source pipelines!`);
      } else {
        setSummary(`Synced ${res.totalSynced} sources with ${res.totalErrors} errors.`);
      }
      router.refresh();
    } catch (err: any) {
      setSummary(err?.message || "Failed to trigger bulk sync");
    } finally {
      setSyncingAll(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      {summary && (
        <span className="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 font-medium">
          {summary}
        </span>
      )}
      <Button
        variant="brand"
        size="sm"
        onClick={handleBulkSync}
        disabled={syncingAll}
        className="gap-2 font-bold shadow-xs hover:shadow-sm"
      >
        {syncingAll ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Zap className="h-4 w-4 fill-current" />
        )}
        <span>{syncingAll ? "Syncing All Sources..." : "Sync All Active Sources"}</span>
      </Button>
    </div>
  );
}

export function JobLogsViewer({ jobId }: { jobId: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);

  const handleFetchLogs = async () => {
    setOpen(!open);
    if (!open && logs.length === 0) {
      setLoading(true);
      try {
        const res = await getImportJobLogs(jobId);
        if (res.success) {
          setLogs(res.logs || []);
        }
      } catch (err) {
        console.error("Failed to load logs:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div>
      <Button
        size="sm"
        variant="ghost"
        onClick={handleFetchLogs}
        className="h-7 text-[11px] text-slate-600 hover:text-slate-900 gap-1 px-2"
      >
        <Eye className="h-3 w-3" />
        <span>{open ? "Hide Logs" : "View Logs"}</span>
      </Button>

      {open && (
        <div className="mt-2 p-3 bg-slate-900 text-slate-100 rounded-md font-mono text-[11px] max-h-64 overflow-y-auto space-y-1 border border-slate-800">
          {loading ? (
            <div className="flex items-center gap-2 text-slate-400 py-2">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>Fetching execution logs...</span>
            </div>
          ) : logs.length === 0 ? (
            <p className="text-slate-400">No granular logs recorded for this job.</p>
          ) : (
            logs.map((log: any) => (
              <div key={log.id} className="flex items-start gap-2 border-b border-slate-800/60 pb-1">
                <span
                  className={`text-[9px] px-1 py-0.2 rounded uppercase shrink-0 font-bold ${
                    log.level === "error" || log.level === "fatal"
                      ? "bg-rose-900/80 text-rose-300"
                      : log.level === "warn"
                      ? "bg-amber-900/80 text-amber-300"
                      : "bg-slate-800 text-slate-300"
                  }`}
                >
                  {log.level}
                </span>
                <span className="text-cyan-400 shrink-0">[{log.step}]</span>
                <span className="text-slate-200 flex-1">{log.message}</span>
                <span className="text-slate-500 text-[10px] shrink-0">
                  {new Date(log.created_at).toLocaleTimeString()}
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
