"use client";

import * as React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Category, Organization, StateUT } from "@/modules/core/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Filter,
  RotateCcw,
  Building2,
  Layers,
  MapPin,
  Laptop,
  Check,
} from "lucide-react";

interface ExamFilterSidebarProps {
  categories: Category[];
  organizations: Organization[];
  states: StateUT[];
}

export function ExamFilterSidebar({
  categories,
  organizations,
  states,
}: ExamFilterSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentOrg = searchParams.get("organization") || "";
  const currentCat = searchParams.get("category") || "";
  const currentMode = searchParams.get("mode") || "";
  const currentState = searchParams.get("state") || "";

  const hasActiveFilters = Boolean(currentOrg || currentCat || currentMode || currentState);

  const applyFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (params.get(key) === value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  const clearAllFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("organization");
    params.delete("category");
    params.delete("mode");
    params.delete("state");
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  const EXAM_MODES = [
    { label: "Online Computer Based Test (CBT)", value: "online_cbt" },
    { label: "Offline OMR Sheet", value: "offline_omr" },
    { label: "Pen & Paper Conventional", value: "pen_paper" },
    { label: "Hybrid (CBT + Written)", value: "hybrid" },
    { label: "Interview / Personality Test", value: "interview_only" },
  ];

  return (
    <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2 font-bold text-slate-900 font-heading">
          <Filter className="h-4 w-4 text-brand-600" />
          <span>Filter Examinations</span>
        </div>

        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="flex items-center gap-1 text-xs font-semibold text-brand-700 hover:text-brand-800 transition-colors"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Conducting Organization Filter */}
      <div className="space-y-3">
        <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-600">
          <Building2 className="h-3.5 w-3.5 text-slate-400" />
          <span>Conducting Authority</span>
        </label>
        <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
          {organizations.map((org) => {
            const isSelected = currentOrg === org.slug;
            return (
              <button
                key={org.id}
                onClick={() => applyFilter("organization", org.slug)}
                className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-xs transition-colors ${
                  isSelected
                    ? "bg-brand-50 font-bold text-brand-900"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <span className="truncate">{org.acronym || org.name}</span>
                {isSelected && <Check className="h-3 w-3 text-brand-600" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Examination Mode Filter */}
      <div className="space-y-3 border-t border-slate-100 pt-4">
        <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-600">
          <Laptop className="h-3.5 w-3.5 text-slate-400" />
          <span>Examination Mode</span>
        </label>
        <div className="space-y-1">
          {EXAM_MODES.map((mode) => {
            const isSelected = currentMode === mode.value;
            return (
              <button
                key={mode.value}
                onClick={() => applyFilter("mode", mode.value)}
                className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-xs transition-colors ${
                  isSelected
                    ? "bg-brand-50 font-bold text-brand-900"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <span className="truncate">{mode.label}</span>
                {isSelected && <Check className="h-3 w-3 text-brand-600" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Category Filter */}
      <div className="space-y-3 border-t border-slate-100 pt-4">
        <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-600">
          <Layers className="h-3.5 w-3.5 text-slate-400" />
          <span>Sector / Category</span>
        </label>
        <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
          {categories.map((cat) => {
            const isSelected = currentCat === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() => applyFilter("category", cat.slug)}
                className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-xs transition-colors ${
                  isSelected
                    ? "bg-brand-50 font-bold text-brand-900"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <span className="truncate">{cat.name}</span>
                {isSelected && <Check className="h-3 w-3 text-brand-600" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* State / Jurisdiction Filter */}
      <div className="space-y-3 border-t border-slate-100 pt-4">
        <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-600">
          <MapPin className="h-3.5 w-3.5 text-slate-400" />
          <span>State / UT Region</span>
        </label>
        <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
          {states.map((st) => {
            const isSelected = currentState === st.code;
            return (
              <button
                key={st.code}
                onClick={() => applyFilter("state", st.code)}
                className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-xs transition-colors ${
                  isSelected
                    ? "bg-brand-50 font-bold text-brand-900"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <span className="truncate">{st.name}</span>
                {isSelected && <Check className="h-3 w-3 text-brand-600" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
