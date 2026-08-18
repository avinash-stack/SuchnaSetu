"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import {
  GraduationCap,
  Newspaper,
  Briefcase,
  Layers,
  CheckCircle2,
  ExternalLink,
  Search,
  Zap,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Filter,
  Building2,
  MapPin,
} from "lucide-react";
import { SourceActionsClient } from "./source-actions-client";
import { bulkSyncSourcesAction } from "@/modules/ingestion/actions";

export interface ImportSourceRecord {
  id: string;
  code: string;
  name: string;
  target_module: string;
  adapter_key: string;
  is_enabled: boolean;
  last_synced_at: string | null;
  organizations?: {
    name?: string;
    acronym?: string;
    state_code?: string;
    jurisdiction?: string;
  } | null;
}

export interface OfficialSourceRecord {
  id: string;
  name: string;
  base_url: string;
  portal_type: string;
  is_verified: boolean;
  organizations?: {
    name?: string;
    acronym?: string;
  } | null;
}

interface SourcesManagementClientProps {
  examSources: ImportSourceRecord[];
  newsSources: ImportSourceRecord[];
  nationalRecruitmentSources: ImportSourceRecord[];
  stateRecruitmentSources: ImportSourceRecord[];
  officialSources: OfficialSourceRecord[];
  runningSourceIds: string[];
}

type TabKey = "exams" | "news" | "recruitment" | "sources";
type RecruitmentSubFilter = "all" | "national" | "state";
const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

export function SourcesManagementClient({
  examSources,
  newsSources,
  nationalRecruitmentSources,
  stateRecruitmentSources,
  officialSources,
  runningSourceIds,
}: SourcesManagementClientProps) {
  const router = useRouter();

  // Tab & Sub-filter States
  const [activeTab, setActiveTab] = useState<TabKey>("exams");
  const [recruitmentFilter, setRecruitmentFilter] = useState<RecruitmentSubFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination States per tab (default page size 10)
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Sync execution state
  const [syncingTab, setSyncingTab] = useState(false);
  const [syncMessage, setSyncMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const runningSet = useMemo(() => new Set(runningSourceIds), [runningSourceIds]);

  // Combined Recruitment List
  const allRecruitmentSources = useMemo(() => {
    return [...nationalRecruitmentSources, ...stateRecruitmentSources];
  }, [nationalRecruitmentSources, stateRecruitmentSources]);

  // Active dataset for current tab & filter
  const currentDataset = useMemo(() => {
    switch (activeTab) {
      case "exams":
        return examSources;
      case "news":
        return newsSources;
      case "recruitment":
        if (recruitmentFilter === "national") return nationalRecruitmentSources;
        if (recruitmentFilter === "state") return stateRecruitmentSources;
        return allRecruitmentSources;
      case "sources":
        return officialSources;
    }
  }, [
    activeTab,
    recruitmentFilter,
    examSources,
    newsSources,
    nationalRecruitmentSources,
    stateRecruitmentSources,
    allRecruitmentSources,
    officialSources,
  ]);

  // Filtered dataset by search
  const filteredDataset = useMemo(() => {
    if (!searchQuery.trim()) return currentDataset;
    const q = searchQuery.toLowerCase();

    if (activeTab === "sources") {
      return (currentDataset as OfficialSourceRecord[]).filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.base_url.toLowerCase().includes(q) ||
          item.organizations?.name?.toLowerCase().includes(q)
      );
    }

    return (currentDataset as ImportSourceRecord[]).filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.code.toLowerCase().includes(q) ||
        item.adapter_key.toLowerCase().includes(q) ||
        item.organizations?.name?.toLowerCase().includes(q) ||
        item.organizations?.state_code?.toLowerCase().includes(q)
    );
  }, [currentDataset, searchQuery, activeTab]);

  // Pagination calculation
  const totalItems = filteredDataset.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedItems = useMemo(() => {
    const start = (safeCurrentPage - 1) * pageSize;
    return filteredDataset.slice(start, start + pageSize);
  }, [filteredDataset, safeCurrentPage, pageSize]);

  // Handlers for switching tabs & filters (resetting to page 1)
  const handleTabChange = (tab: TabKey) => {
    setActiveTab(tab);
    setCurrentPage(1);
    setSearchQuery("");
    setSyncMessage(null);
  };

  const handleRecruitmentFilterChange = (filter: RecruitmentSubFilter) => {
    setRecruitmentFilter(filter);
    setCurrentPage(1);
    setSyncMessage(null);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

  // Tab-Wise Manual Sync Execution
  const handleTabWiseSync = async () => {
    if (activeTab === "sources") return;

    // Get enabled source IDs for current tab & filter
    const activeSourcesToSync = (currentDataset as ImportSourceRecord[]).filter(
      (s) => s.is_enabled
    );

    if (activeSourcesToSync.length === 0) {
      setSyncMessage({
        type: "error",
        text: "No active/enabled sources available to synchronize in this view.",
      });
      return;
    }

    let tabLabel = "Exams";
    if (activeTab === "news") tabLabel = "News";
    if (activeTab === "recruitment") {
      tabLabel =
        recruitmentFilter === "national"
          ? "National Recruitment"
          : recruitmentFilter === "state"
          ? "State Recruitment"
          : "Recruitment (All)";
    }

    if (
      !confirm(
        `Synchronize ${activeSourcesToSync.length} enabled source pipelines under "${tabLabel}" now?`
      )
    ) {
      return;
    }

    setSyncingTab(true);
    setSyncMessage(null);

    try {
      const sourceIds = activeSourcesToSync.map((s) => s.id);
      const res = await bulkSyncSourcesAction(sourceIds);

      if (res.success) {
        setSyncMessage({
          type: "success",
          text: `Successfully synced all ${res.totalSynced} source pipelines under ${tabLabel}!`,
        });
      } else {
        setSyncMessage({
          type: res.totalSynced > 0 ? "success" : "error",
          text: `Synced ${res.totalSynced} sources with ${res.totalErrors} errors under ${tabLabel}.`,
        });
      }
      router.refresh();
    } catch (err: any) {
      setSyncMessage({
        type: "error",
        text: err?.message || "Failed to execute tab synchronization.",
      });
    } finally {
      setSyncingTab(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 4 Clean Tabs (No record counts in tab names) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-2">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <button
            onClick={() => handleTabChange("exams")}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors flex items-center gap-2 ${
              activeTab === "exams"
                ? "bg-orange-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <GraduationCap className="h-4 w-4" />
            <span>Exams</span>
          </button>

          <button
            onClick={() => handleTabChange("news")}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors flex items-center gap-2 ${
              activeTab === "news"
                ? "bg-emerald-700 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Newspaper className="h-4 w-4" />
            <span>News</span>
          </button>

          <button
            onClick={() => handleTabChange("recruitment")}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors flex items-center gap-2 ${
              activeTab === "recruitment"
                ? "bg-brand-700 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Briefcase className="h-4 w-4" />
            <span>Recruitment</span>
          </button>

          <button
            onClick={() => handleTabChange("sources")}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors flex items-center gap-2 ${
              activeTab === "sources"
                ? "bg-slate-800 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Layers className="h-4 w-4" />
            <span>Sources</span>
          </button>
        </div>

        {/* Tab-Wise Manual Sync Trigger (Exams, News, Recruitment) */}
        {activeTab !== "sources" && (
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="brand"
              size="sm"
              onClick={handleTabWiseSync}
              disabled={syncingTab}
              className="gap-2 font-bold shadow-xs hover:shadow-sm"
            >
              {syncingTab ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Zap className="h-4 w-4 fill-current" />
              )}
              <span>
                {syncingTab
                  ? "Syncing Tab..."
                  : activeTab === "recruitment" && recruitmentFilter !== "all"
                  ? `Sync ${recruitmentFilter === "national" ? "National" : "State"} Sources`
                  : `Sync ${activeTab === "exams" ? "Exams" : activeTab === "news" ? "News" : "Recruitment"} Sources`}
              </span>
            </Button>
          </div>
        )}
      </div>

      {/* Sync Feedback Message */}
      {syncMessage && (
        <div
          className={`p-3 rounded-lg text-xs font-medium border flex items-center justify-between gap-2 ${
            syncMessage.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-rose-50 text-rose-800 border-rose-200"
          }`}
        >
          <span>{syncMessage.text}</span>
          <button
            onClick={() => setSyncMessage(null)}
            className="text-xs hover:opacity-75"
          >
            ✕
          </button>
        </div>
      )}

      {/* Controls Bar: Sub-filter (for Recruitment), Search Bar & Page Size Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
        {/* Left: Recruitment Sub-filter pills or Tab Description */}
        <div className="flex items-center gap-2 flex-wrap">
          {activeTab === "recruitment" ? (
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
              <button
                onClick={() => handleRecruitmentFilterChange("all")}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                  recruitmentFilter === "all"
                    ? "bg-white text-brand-800 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                All Recruitment ({allRecruitmentSources.length})
              </button>
              <button
                onClick={() => handleRecruitmentFilterChange("national")}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors flex items-center gap-1 ${
                  recruitmentFilter === "national"
                    ? "bg-white text-brand-800 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Building2 className="h-3 w-3" />
                <span>National ({nationalRecruitmentSources.length})</span>
              </button>
              <button
                onClick={() => handleRecruitmentFilterChange("state")}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors flex items-center gap-1 ${
                  recruitmentFilter === "state"
                    ? "bg-white text-brand-800 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <MapPin className="h-3 w-3" />
                <span>State PSCs ({stateRecruitmentSources.length})</span>
              </button>
            </div>
          ) : (
            <div className="text-xs text-slate-500">
              {activeTab === "exams" &&
                "Standardized examination calendars, patterns, and notification cycles."}
              {activeTab === "news" &&
                "Official PIB communiques, Employment News digests, and public bulletins."}
              {activeTab === "sources" &&
                "Directory of verified constitutional commissions and official portals."}
            </div>
          )}
        </div>

        {/* Right: Search Input + Page Size Dropdown */}
        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-56">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search in tab..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:border-brand-500 bg-slate-50/50"
            />
          </div>

          <div className="flex items-center gap-1.5 shrink-0 text-xs text-slate-600">
            <span className="text-[11px] text-slate-500 font-medium">Show:</span>
            <select
              value={pageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              className="px-2 py-1 text-xs rounded-md border border-slate-200 bg-white font-semibold text-slate-800 focus:outline-hidden"
            >
              {PAGE_SIZE_OPTIONS.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <Card className="shadow-xs border-slate-200">
        <CardContent className="p-0">
          {activeTab !== "sources" ? (
            /* INGESTION PIPELINES TABLE (Exams, News, Recruitment) */
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50">
                  <TableHead className="w-[340px]">Source Pipeline / Authority</TableHead>
                  <TableHead>Adapter Key</TableHead>
                  <TableHead>Target Module</TableHead>
                  <TableHead>Last Synced</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedItems.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-10 text-xs text-slate-500"
                    >
                      No source pipelines match the selected filter or query.
                    </TableCell>
                  </TableRow>
                ) : (
                  (paginatedItems as ImportSourceRecord[]).map((source) => (
                    <TableRow key={source.id} className="hover:bg-slate-50/50">
                      <TableCell>
                        <div className="font-semibold text-slate-900 text-sm">
                          {source.name}
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5 flex-wrap">
                          <span className="font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 font-semibold">
                            {source.code}
                          </span>
                          {source.organizations?.name && (
                            <span>• {source.organizations.name}</span>
                          )}
                          {source.organizations?.state_code && (
                            <span className="font-bold text-emerald-700">
                              [{source.organizations.state_code}]
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="font-mono text-[10px] bg-slate-50"
                        >
                          {source.adapter_key}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`text-[10px] capitalize ${
                            source.target_module === "exams"
                              ? "bg-orange-50 text-orange-700 border-orange-200"
                              : source.target_module === "bulletins"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-blue-50 text-blue-700 border-blue-200"
                          }`}
                        >
                          {source.target_module === "exams"
                            ? "Exams & Notifications"
                            : source.target_module === "bulletins"
                            ? "News & Bulletins"
                            : "Gov Jobs"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-slate-600">
                        {source.last_synced_at ? (
                          <div className="space-y-0.5">
                            <p className="font-medium text-slate-800">
                              {new Date(source.last_synced_at).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                }
                              )}
                            </p>
                            <p className="text-[10px] text-slate-400">
                              {new Date(source.last_synced_at).toLocaleTimeString()}
                            </p>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Ready to sync</span>
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
                          isActivelyRunning={runningSet.has(source.id)}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          ) : (
            /* VERIFIED OFFICIAL PUBLIC SOURCES DIRECTORY (Sources Tab) */
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50">
                  <TableHead className="w-[340px]">Portal Name</TableHead>
                  <TableHead>Associated Authority</TableHead>
                  <TableHead>Portal Type</TableHead>
                  <TableHead>Base URL</TableHead>
                  <TableHead className="text-right">Verification Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedItems.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-10 text-xs text-slate-500"
                    >
                      No official portal sources match the query.
                    </TableCell>
                  </TableRow>
                ) : (
                  (paginatedItems as OfficialSourceRecord[]).map((src) => (
                    <TableRow key={src.id} className="hover:bg-slate-50/50">
                      <TableCell className="font-semibold text-slate-900 text-sm">
                        {src.name}
                      </TableCell>
                      <TableCell className="text-xs text-slate-600">
                        {src.organizations?.name || "General Authority"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="text-[10px] uppercase font-mono"
                        >
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
                          <span className="truncate max-w-[260px]">{src.base_url}</span>
                          <ExternalLink className="h-3 w-3 shrink-0" />
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
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Pagination Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 px-1">
        <div>
          Showing{" "}
          <strong className="text-slate-800">
            {totalItems === 0 ? 0 : (safeCurrentPage - 1) * pageSize + 1}
          </strong>{" "}
          to{" "}
          <strong className="text-slate-800">
            {Math.min(safeCurrentPage * pageSize, totalItems)}
          </strong>{" "}
          of <strong className="text-slate-800">{totalItems}</strong> records
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(1)}
            disabled={safeCurrentPage <= 1}
            className="h-8 w-8 p-0"
            title="First Page"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={safeCurrentPage <= 1}
            className="h-8 w-8 p-0"
            title="Previous Page"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="px-3 py-1 font-semibold text-slate-800 bg-white border border-slate-200 rounded-md">
            Page {safeCurrentPage} of {totalPages}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={safeCurrentPage >= totalPages}
            className="h-8 w-8 p-0"
            title="Next Page"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(totalPages)}
            disabled={safeCurrentPage >= totalPages}
            className="h-8 w-8 p-0"
            title="Last Page"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
