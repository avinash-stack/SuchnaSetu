"use client";

import * as React from "react";
import {
  RefreshCw,
  Radio,
  Layers,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Database,
  Newspaper,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

interface SyncState {
  isRunning: boolean;
  activeType: "news" | "full" | null;
  elapsedSeconds: number;
  lastResponse: any | null;
  error: string | null;
}

export function ManualSyncConsole() {
  const [syncState, setSyncState] = React.useState<SyncState>({
    isRunning: false,
    activeType: null,
    elapsedSeconds: 0,
    lastResponse: null,
    error: null,
  });

  const [showDetails, setShowDetails] = React.useState(false);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  // Timer ticker while running
  React.useEffect(() => {
    if (syncState.isRunning) {
      timerRef.current = setInterval(() => {
        setSyncState((prev) => ({ ...prev, elapsedSeconds: prev.elapsedSeconds + 1 }));
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [syncState.isRunning]);

  const handleTriggerSync = async (type: "news" | "full") => {
    if (syncState.isRunning) return;

    setSyncState({
      isRunning: true,
      activeType: type,
      elapsedSeconds: 0,
      lastResponse: null,
      error: null,
    });
    setShowDetails(true);

    try {
      const res = await fetch("/api/admin/trigger-sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, batchSize: 6, maxBatches: 5 }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || `Failed to complete ${type} sync.`);
      }

      setSyncState((prev) => ({
        ...prev,
        isRunning: false,
        lastResponse: data,
        error: null,
      }));
    } catch (err: any) {
      setSyncState((prev) => ({
        ...prev,
        isRunning: false,
        error: err.message || "An unexpected error occurred during sync execution.",
      }));
    }
  };

  const resp = syncState.lastResponse;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* Header & Status Indicator */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
              <Radio className="h-4 w-4" />
            </span>
            <h2 className="text-lg font-bold text-slate-900 font-heading">
              Live Ingestion &amp; Sync Mission Control
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manually trigger and monitor real-time sync across verified government recruitment notifications and news feeds.
          </p>
        </div>

        {/* Status Pill */}
        <div className="flex items-center gap-3">
          {syncState.isRunning && (
            <div className="flex items-center gap-2 rounded-full bg-amber-50 px-3.5 py-1.5 text-xs font-semibold text-amber-700 border border-amber-200 animate-pulse">
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              <span>
                Syncing {syncState.activeType === "news" ? "News Feeds" : "Full Registry"} ({syncState.elapsedSeconds}s)
              </span>
            </div>
          )}

          {!syncState.isRunning && resp && (
            <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Last Execution Succeeded ({Math.round(resp.durationMs / 1000)}s)</span>
            </div>
          )}

          {!syncState.isRunning && syncState.error && (
            <div className="flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 border border-rose-200">
              <XCircle className="h-3.5 w-3.5" />
              <span>Sync Failed</span>
            </div>
          )}
        </div>
      </div>

      {/* Trigger Buttons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-5">
        {/* 1. News Sync Card */}
        <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 transition-all hover:border-blue-300 hover:bg-blue-50/20">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
                <Newspaper className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">News Portal Sync</h3>
                <p className="text-xs text-slate-500">
                  Ingests 36+ verified PIB, national, state bureaus &amp; education RSS feeds.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-100">
            <span className="text-[11px] font-medium text-slate-500">
              Direct RSS &bull; Multi-source &bull; AI Enrichment
            </span>
            <button
              onClick={() => handleTriggerSync("news")}
              disabled={syncState.isRunning}
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold text-white transition-all shadow-sm ${
                syncState.isRunning && syncState.activeType === "news"
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 active:scale-95"
              }`}
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${
                  syncState.isRunning && syncState.activeType === "news" ? "animate-spin" : ""
                }`}
              />
              <span>{syncState.isRunning && syncState.activeType === "news" ? "Syncing..." : "Trigger News Sync"}</span>
            </button>
          </div>
        </div>

        {/* 2. Full Platform Sync Card */}
        <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 transition-all hover:border-indigo-300 hover:bg-indigo-50/20">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm">
                <Layers className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Full Platform Sync (Jobs &amp; Exams)</h3>
                <p className="text-xs text-slate-500">
                  Orchestrates sequential batch sync across 135+ official recruitment portals.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-100">
            <span className="text-[11px] font-medium text-slate-500">
              135 Active Sources &bull; Batch Pipeline &bull; Durable
            </span>
            <button
              onClick={() => handleTriggerSync("full")}
              disabled={syncState.isRunning}
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold text-white transition-all shadow-sm ${
                syncState.isRunning && syncState.activeType === "full"
                  ? "bg-slate-500 cursor-not-allowed"
                  : "bg-slate-900 hover:bg-slate-800 active:scale-95"
              }`}
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${
                  syncState.isRunning && syncState.activeType === "full" ? "animate-spin" : ""
                }`}
              />
              <span>{syncState.isRunning && syncState.activeType === "full" ? "Orchestrating..." : "Trigger Full Sync"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {syncState.error && (
        <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-800 flex items-start gap-2.5">
          <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Sync Error:</span> {syncState.error}
          </div>
        </div>
      )}

      {/* Live / Last Execution Results Telemetry */}
      {resp && (
        <div className="rounded-xl border border-slate-200 bg-slate-900 text-slate-100 p-5 shadow-inner">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Execution Telemetry Breakdown ({resp.type === "news" ? "News Pipeline" : "Batch Orchestrator"})
              </span>
            </div>
            <span className="text-[11px] text-slate-400">
              Completed at {new Date(resp.executedAt).toLocaleTimeString()} in {(resp.durationMs / 1000).toFixed(1)}s
            </span>
          </div>

          {/* Metric Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
            {resp.type === "news" ? (
              <>
                <div className="rounded-lg bg-slate-800/80 p-3 border border-slate-700/50">
                  <div className="text-[11px] text-slate-400">Sources Processed</div>
                  <div className="text-xl font-bold text-white mt-0.5">
                    {resp.summary.successfulSources}/{resp.summary.totalSources}
                  </div>
                </div>
                <div className="rounded-lg bg-slate-800/80 p-3 border border-slate-700/50">
                  <div className="text-[11px] text-slate-400">Articles Fetched</div>
                  <div className="text-xl font-bold text-sky-400 mt-0.5">{resp.summary.totalFetched}</div>
                </div>
                <div className="rounded-lg bg-slate-800/80 p-3 border border-slate-700/50">
                  <div className="text-[11px] text-slate-400">New Inserted</div>
                  <div className="text-xl font-bold text-emerald-400 mt-0.5">+{resp.summary.totalInserted}</div>
                </div>
                <div className="rounded-lg bg-slate-800/80 p-3 border border-slate-700/50">
                  <div className="text-[11px] text-slate-400">Duplicates Skipped</div>
                  <div className="text-xl font-bold text-amber-400 mt-0.5">{resp.summary.totalDuplicates}</div>
                </div>
              </>
            ) : (
              <>
                <div className="rounded-lg bg-slate-800/80 p-3 border border-slate-700/50">
                  <div className="text-[11px] text-slate-400">Batches Run</div>
                  <div className="text-xl font-bold text-white mt-0.5">
                    {resp.batchExecution.batchesCompleted}/{resp.batchExecution.batchesTotal}
                  </div>
                </div>
                <div className="rounded-lg bg-slate-800/80 p-3 border border-slate-700/50">
                  <div className="text-[11px] text-slate-400">Notices Extracted</div>
                  <div className="text-xl font-bold text-sky-400 mt-0.5">{resp.summary.totalExtracted}</div>
                </div>
                <div className="rounded-lg bg-slate-800/80 p-3 border border-slate-700/50">
                  <div className="text-[11px] text-slate-400">New Inserted</div>
                  <div className="text-xl font-bold text-emerald-400 mt-0.5">+{resp.summary.totalInserted}</div>
                </div>
                <div className="rounded-lg bg-slate-800/80 p-3 border border-slate-700/50">
                  <div className="text-[11px] text-slate-400">Updated / Active</div>
                  <div className="text-xl font-bold text-indigo-400 mt-0.5">+{resp.summary.totalUpdated}</div>
                </div>
              </>
            )}
          </div>

          {/* Toggleable Details Drawer */}
          {resp.results && resp.results.length > 0 && (
            <div className="mt-3">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                {showDetails ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                <span>{showDetails ? "Hide Source Breakdown" : "View Source Details & Status"}</span>
              </button>

              {showDetails && (
                <div className="mt-3 max-h-60 overflow-y-auto rounded-lg bg-slate-950/80 p-3 border border-slate-800 font-mono text-[11px] text-slate-300 space-y-1.5">
                  {resp.results.map((r: any, idx: number) => {
                    const isSuccess = r.status === "success" || r.status === "completed" || r.status === "partial";
                    return (
                      <div
                        key={idx}
                        className={`flex items-center justify-between py-1 px-2 rounded ${
                          isSuccess ? "bg-slate-900/60" : "bg-rose-950/30 text-rose-300"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={isSuccess ? "text-emerald-400" : "text-rose-400"}>
                            {isSuccess ? "✓" : "✗"}
                          </span>
                          <span className="font-semibold">{r.sourceCode}</span>
                          <span className="text-slate-500">({r.sourceName})</span>
                        </div>
                        <div className="flex items-center gap-3">
                          {r.totalInserted !== undefined && <span>+{r.totalInserted} ins</span>}
                          {r.totalDuplicates !== undefined && <span className="text-slate-500">{r.totalDuplicates} dup</span>}
                          <span className="text-slate-500">{r.durationMs}ms</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
