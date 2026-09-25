import React from "react";
import Link from "next/link";
import { CareerResource } from "../types";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { Clock, ArrowRight, BookOpen, Compass, ShieldCheck, Target, IndianRupee, Users } from "lucide-react";

interface ResourceCardProps {
  resource: CareerResource;
  featured?: boolean;
}

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "preparation-strategy": Target,
  "eligibility-rules": ShieldCheck,
  "syllabus-guide": BookOpen,
  "salary-perks": IndianRupee,
  "career-roadmaps": Compass,
  "interview-prep": Users,
};

export function ResourceCard({ resource, featured = false }: ResourceCardProps) {
  const IconComponent = (resource.category_slug && CATEGORY_ICONS[resource.category_slug]) || BookOpen;

  if (featured) {
    return (
      <article className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs transition-all hover:border-[#013089]/40 hover:shadow-md">
        <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-500 mb-4">
          <Badge variant="brand" className="gap-1.5 py-1 px-3 text-xs font-semibold">
            <IconComponent className="h-3.5 w-3.5" />
            <span>{resource.category?.name || "Career Guide"}</span>
          </Badge>
          <span className="flex items-center gap-1 font-medium text-slate-500">
            <Clock className="h-3.5 w-3.5 text-slate-400" />
            {resource.reading_time_minutes} min read
          </span>
          <span className="text-slate-300">•</span>
          <time dateTime={resource.published_at}>{formatDate(resource.published_at)}</time>
        </div>

        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight group-hover:text-[#013089] transition-colors leading-snug">
          <Link href={`/resources/${resource.slug}`} className="focus:outline-hidden">
            <span className="absolute inset-0 z-10" aria-hidden="true" />
            {resource.title}
          </Link>
        </h3>

        <p className="mt-3 text-sm sm:text-base text-slate-600 line-clamp-3 leading-relaxed">
          {resource.excerpt}
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-4">
          <div className="flex flex-wrap gap-1.5">
            {resource.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-md bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-600 border border-slate-200/60"
              >
                #{tag}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#013089] group-hover:translate-x-0.5 transition-transform">
            <span>Read Full Guide</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-slate-200 bg-white p-5 sm:p-6 shadow-2xs transition-all hover:border-[#013089]/40 hover:shadow-sm">
      <div>
        <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
          <Badge variant="outline" className="gap-1 py-0.5 px-2 text-[11px] font-medium border-slate-200 text-slate-700 bg-slate-50">
            <IconComponent className="h-3 w-3 text-[#013089]" />
            <span>{resource.category?.name || "Guide"}</span>
          </Badge>
          <span className="flex items-center gap-1 text-[11.5px] text-slate-400">
            <Clock className="h-3 w-3" />
            {resource.reading_time_minutes} min
          </span>
        </div>

        <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-[#013089] transition-colors leading-snug line-clamp-2">
          <Link href={`/resources/${resource.slug}`} className="focus:outline-hidden">
            <span className="absolute inset-0 z-10" aria-hidden="true" />
            {resource.title}
          </Link>
        </h3>

        <p className="mt-2 text-xs sm:text-[13px] text-slate-600 line-clamp-2 leading-relaxed">
          {resource.excerpt}
        </p>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
        <time className="text-slate-400 text-[11.5px]" dateTime={resource.published_at}>
          {formatDate(resource.published_at)}
        </time>

        <span className="flex items-center gap-1 font-semibold text-[#013089] text-[11.5px] group-hover:translate-x-0.5 transition-transform">
          Read Guide
          <ArrowRight className="h-3 w-3" />
        </span>
      </div>
    </article>
  );
}
