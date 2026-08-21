"use client";

import * as React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { GovJobDetailed } from "../types";
import { JobListTable } from "./job-list-table";
import { JobCard } from "./job-card";
import { Button } from "@/components/ui/button";
import { List, LayoutGrid } from "lucide-react";

export interface JobsListingContainerProps {
  jobs: GovJobDetailed[];
  total: number;
  currentLimit?: number;
}

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

export function JobsListingContainer({ jobs, total, currentLimit = 20 }: JobsListingContainerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [viewMode, setViewMode] = React.useState<"list" | "card">("list");
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem("suchnasetu_jobs_view_mode");
    if (saved === "list" || saved === "card") {
      setViewMode(saved);
    }
  }, []);

  const handleToggle = (mode: "list" | "card") => {
    setViewMode(mode);
    try {
      localStorage.setItem("suchnasetu_jobs_view_mode", mode);
    } catch {
      // LocalStorage error handling
    }
  };

  const handleLimitChange = (newLimit: number) => {
    const params = new URLSearchParams(searchParams ? searchParams.toString() : "");
    params.set("limit", String(newLimit));
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="space-y-4">
      {/* View Switcher & Limit Header Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
        <div className="text-xs font-semibold text-slate-500">
          Showing <span className="font-bold text-slate-900">{jobs.length}</span> of{" "}
          <span className="font-bold text-slate-900">{total}</span> Active Recruitment Notices
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Page Size Selector (10 / 20 / 50 / 100) */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-lg">
            <span className="font-semibold text-slate-500">Show:</span>
            <div className="flex items-center gap-1">
              {PAGE_SIZE_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleLimitChange(opt)}
                  className={`px-1.5 py-0.5 text-xs font-bold rounded transition-colors ${
                    currentLimit === opt
                      ? "bg-[#013089] text-white shadow-2xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-200"
                  }`}
                  title={`Show ${opt} notices per page`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* View Mode Toggle Controls */}
          <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5 shadow-2xs">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleToggle("list")}
              className={`h-7 px-2.5 text-xs font-semibold rounded-md transition-all gap-1.5 ${
                viewMode === "list"
                  ? "bg-white text-[#013089] shadow-xs font-bold border border-slate-200"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
              title="List View (Compact Information Dense)"
            >
              <List className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">List View</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleToggle("card")}
              className={`h-7 px-2.5 text-xs font-semibold rounded-md transition-all gap-1.5 ${
                viewMode === "card"
                  ? "bg-white text-[#013089] shadow-xs font-bold border border-slate-200"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
              title="Card View (Expanded Details)"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Card View</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Render Selected View */}
      {viewMode === "list" ? (
        <JobListTable jobs={jobs} />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}
