import React from "react";
import Link from "next/link";
import { getPublicSupabaseClient } from "@/lib/supabase/public";
import { Briefcase, ArrowRight, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface RelatedOpeningsWidgetProps {
  tags: string[];
  categorySlug: string;
}

interface MatchingNotice {
  id: string;
  title: string;
  slug: string;
  organization_name?: string;
  total_vacancies?: number | null;
  application_end_date?: string | null;
}

export async function RelatedOpeningsWidget({ tags, categorySlug }: RelatedOpeningsWidgetProps) {
  const supabase = getPublicSupabaseClient();
  let matches: MatchingNotice[] = [];

  try {
    // Search active jobs where title matches any of the prominent tags
    const primaryTag = tags[0] || "Government";
    const { data } = await (supabase.from("gov_jobs") as any)
      .select("id, title, slug, total_vacancies, application_end_date, organizations(name)")
      .eq("status", "active")
      .ilike("title", `%${primaryTag}%`)
      .limit(3);

    if (data && data.length > 0) {
      matches = data.map((d: any) => ({
        id: d.id,
        title: d.title,
        slug: d.slug,
        organization_name: d.organizations?.name || "Official Commission",
        total_vacancies: d.total_vacancies,
        application_end_date: d.application_end_date,
      }));
    }
  } catch (err) {
    // Non-blocking
  }

  return (
    <aside className="rounded-2xl border border-blue-100 bg-linear-to-br from-blue-50/70 to-indigo-50/40 p-5 sm:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Briefcase className="h-4 w-4 text-[#013089]" />
          <h3 className="text-sm font-bold text-slate-900 font-heading">
            Live Recruitment Notices
          </h3>
        </div>
        <Link
          href="/jobs"
          className="text-[11.5px] font-semibold text-[#013089] hover:underline flex items-center gap-1"
        >
          View All Jobs
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {matches.length > 0 ? (
        <div className="space-y-2.5">
          {matches.map((job) => (
            <Link
              key={job.id}
              href={`/jobs/${job.slug}`}
              className="group block rounded-xl border border-white/80 bg-white/90 p-3 shadow-2xs hover:border-[#013089]/40 hover:shadow-xs transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs font-bold text-slate-900 group-hover:text-[#013089] transition-colors line-clamp-1">
                  {job.title}
                </span>
                <ExternalLink className="h-3 w-3 shrink-0 text-slate-400 group-hover:text-[#013089]" />
              </div>
              <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                <span>{job.organization_name}</span>
                {job.total_vacancies && (
                  <>
                    <span>•</span>
                    <span className="font-semibold text-emerald-700">{job.total_vacancies.toLocaleString("en-IN")} Posts</span>
                  </>
                )}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-white/80 bg-white/90 p-3.5 text-xs text-slate-600">
          <p className="leading-relaxed">
            Explore verified central and state government recruitment notifications matching this preparation track.
          </p>
          <div className="mt-3">
            <Link
              href="/jobs"
              className="inline-flex items-center gap-1.5 font-semibold text-[#013089] hover:underline"
            >
              <span>Browse Active Notices</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      )}
    </aside>
  );
}
