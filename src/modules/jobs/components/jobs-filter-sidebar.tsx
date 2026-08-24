"use client";

import * as React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Category, Organization, StateUT, Qualification } from "@/modules/core/types";
import { Badge } from "@/components/ui/badge";
import { Filter, RotateCcw, Building2, MapPin, Layers, Briefcase, GraduationCap } from "lucide-react";

interface JobsFilterSidebarProps {
  categories: Category[];
  organizations: Organization[];
  qualifications?: Qualification[];
  states: StateUT[];
}

export function JobsFilterSidebar({
  categories,
  organizations,
  qualifications = [],
  states,
}: JobsFilterSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get("category") || "";
  const currentOrg = searchParams.get("organization") || "";
  const currentQual = searchParams.get("qualification") || "";
  const currentState = searchParams.get("state") || "";
  const currentType = searchParams.get("type") || "";

  const activeFiltersCount = [currentCategory, currentOrg, currentQual, currentState, currentType].filter(
    Boolean
  ).length;

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleReset = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("category");
    params.delete("organization");
    params.delete("qualification");
    params.delete("state");
    params.delete("type");
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
        <div className="flex items-center gap-2 font-bold text-base text-slate-900 font-heading">
          <Filter className="h-4.5 w-4.5 text-[#013089]" />
          <span>Filter Notices</span>
          {activeFiltersCount > 0 && (
            <Badge variant="brand" className="text-xs font-bold py-0.5 px-2 bg-[#013089] text-white">
              {activeFiltersCount}
            </Badge>
          )}
        </div>

        {activeFiltersCount > 0 && (
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#013089] hover:underline transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* 1. Sector / Category Filter */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
          <Layers className="h-4 w-4 text-slate-500" />
          <span>Sector / Category</span>
        </label>
        <select
          value={currentCategory}
          onChange={(e) => handleFilterChange("category", e.target.value)}
          className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:border-[#013089] focus:outline-none focus:ring-1 focus:ring-[#013089]"
        >
          <option value="">All Sectors</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* 2. Educational Qualification Filter */}
      {qualifications.length > 0 && (
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
            <GraduationCap className="h-4 w-4 text-blue-600" />
            <span>Qualification</span>
          </label>
          <select
            value={currentQual}
            onChange={(e) => handleFilterChange("qualification", e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:border-[#013089] focus:outline-none focus:ring-1 focus:ring-[#013089]"
          >
            <option value="">All Qualifications</option>
            {qualifications.map((q) => (
              <option key={q.id} value={q.slug}>
                {q.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* 3. Recruiting Commission / Authority */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
          <Building2 className="h-4 w-4 text-slate-500" />
          <span>Recruiting Authority</span>
        </label>
        <select
          value={currentOrg}
          onChange={(e) => handleFilterChange("organization", e.target.value)}
          className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:border-[#013089] focus:outline-none focus:ring-1 focus:ring-[#013089]"
        >
          <option value="">All Authorities</option>
          {organizations.map((org) => (
            <option key={org.id} value={org.slug}>
              {org.acronym ? `${org.acronym} - ${org.name}` : org.name}
            </option>
          ))}
        </select>
      </div>

      {/* 4. State / Jurisdiction Filter */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
          <MapPin className="h-4 w-4 text-slate-500" />
          <span>State / Jurisdiction</span>
        </label>
        <select
          value={currentState}
          onChange={(e) => handleFilterChange("state", e.target.value)}
          className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:border-[#013089] focus:outline-none focus:ring-1 focus:ring-[#013089]"
        >
          <option value="">All India / Central</option>
          {states.map((st) => (
            <option key={st.code} value={st.code}>
              {st.name}
            </option>
          ))}
        </select>
      </div>

      {/* 5. Employment Type Filter */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
          <Briefcase className="h-4 w-4 text-slate-500" />
          <span>Cadre / Employment</span>
        </label>
        <select
          value={currentType}
          onChange={(e) => handleFilterChange("type", e.target.value)}
          className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:border-[#013089] focus:outline-none focus:ring-1 focus:ring-[#013089]"
        >
          <option value="">All Types</option>
          <option value="permanent">Permanent / Regular</option>
          <option value="contract">Contractual</option>
          <option value="deputation">Deputation</option>
          <option value="apprenticeship">Apprenticeship</option>
        </select>
      </div>
    </div>
  );
}
