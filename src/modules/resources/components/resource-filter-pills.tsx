"use client";

import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CareerResourceCategory } from "../types";
import { Target, ShieldCheck, BookOpen, IndianRupee, Compass, Users, Layers } from "lucide-react";

interface ResourceFilterPillsProps {
  categories: CareerResourceCategory[];
  currentCategory?: string;
}

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "preparation-strategy": Target,
  "eligibility-rules": ShieldCheck,
  "syllabus-guide": BookOpen,
  "salary-perks": IndianRupee,
  "career-roadmaps": Compass,
  "interview-prep": Users,
};

function ResourceFilterPillsComponent({ categories, currentCategory }: ResourceFilterPillsProps) {
  const searchParams = useSearchParams();
  const activeCategory = currentCategory || searchParams.get("category") || "all";

  function createCategoryUrl(categorySlug: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (categorySlug === "all") {
      params.delete("category");
    } else {
      params.set("category", categorySlug);
    }
    params.delete("page"); // Reset pagination on category change
    const query = params.toString();
    return query ? `/resources?${query}` : "/resources";
  }

  return (
    <div className="no-scrollbar flex items-center gap-2 overflow-x-auto pb-2 pt-1">
      <Link
        href={createCategoryUrl("all")}
        className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-semibold transition-all shrink-0 ${
          activeCategory === "all"
            ? "bg-[#013089] text-white shadow-2xs"
            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
        }`}
      >
        <Layers className="h-3.5 w-3.5" />
        <span>All Tracks</span>
      </Link>

      {categories.map((category) => {
        const Icon = CATEGORY_ICONS[category.slug] || BookOpen;
        const isActive = activeCategory === category.slug;

        return (
          <Link
            key={category.slug}
            href={createCategoryUrl(category.slug)}
            className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-semibold transition-all shrink-0 ${
              isActive
                ? "bg-[#013089] text-white shadow-2xs"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            <span>{category.name}</span>
          </Link>
        );
      })}
    </div>
  );
}

export function ResourceFilterPills(props: ResourceFilterPillsProps) {
  return (
    <React.Suspense fallback={<div className="h-8 w-48 rounded-full bg-slate-100 animate-pulse" />}>
      <ResourceFilterPillsComponent {...props} />
    </React.Suspense>
  );
}
