"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/context";
import { SearchBar } from "@/components/shared/search-bar";
import { Briefcase, Calendar, FileCheck2, CreditCard, KeyRound, BookOpen, MapPin, Sparkles } from "lucide-react";

export function HomeHero() {
  const { t } = useLanguage();

  return (
    <section className="bg-white border-b border-slate-200/90 py-3.5 sm:py-4">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-3">
        {/* Utility Bar: Title & Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="space-y-0.5 shrink-0">
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#013089]">
              <Sparkles className="h-3.5 w-3.5 text-[#FE8D01]" />
              <span>Official Civic Gazette</span>
            </div>
            <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight font-heading leading-tight">
              Government Jobs, Exams &amp; Notifications
            </h1>
          </div>

          {/* Compact Inline Search */}
          <div className="w-full md:max-w-xl">
            <SearchBar placeholder="Search job title, commission (UPSC, SSC, BSSC), or state..." />
          </div>
        </div>

        {/* Quick Category & Hub Navigation Track */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar text-xs font-semibold text-slate-700">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 shrink-0 pr-1">
            Quick Hubs:
          </span>

          <Link
            href="/jobs"
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 hover:bg-[#013089] hover:text-white transition-colors shrink-0 text-slate-800"
          >
            <Briefcase className="h-3 w-3 text-[#013089] group-hover:text-white" />
            <span>Govt Jobs</span>
          </Link>

          <Link
            href="/exams"
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 hover:bg-[#013089] hover:text-white transition-colors shrink-0 text-slate-800"
          >
            <Calendar className="h-3 w-3 text-[#013089]" />
            <span>Exams</span>
          </Link>

          <Link
            href="/results"
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 hover:bg-emerald-700 hover:text-white transition-colors shrink-0 border border-emerald-200/60"
          >
            <FileCheck2 className="h-3 w-3" />
            <span>Results</span>
          </Link>

          <Link
            href="/admit-cards"
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 text-amber-800 hover:bg-amber-600 hover:text-white transition-colors shrink-0 border border-amber-200/60"
          >
            <CreditCard className="h-3 w-3" />
            <span>Admit Cards</span>
          </Link>

          <Link
            href="/answer-keys"
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 hover:bg-[#013089] hover:text-white transition-colors shrink-0 text-slate-800"
          >
            <KeyRound className="h-3 w-3 text-slate-500" />
            <span>Answer Keys</span>
          </Link>

          <Link
            href="/syllabus"
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 hover:bg-[#013089] hover:text-white transition-colors shrink-0 text-slate-800"
          >
            <BookOpen className="h-3 w-3 text-slate-500" />
            <span>Syllabus</span>
          </Link>

          <Link
            href="/coming-soon"
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-purple-50 text-purple-800 hover:bg-purple-700 hover:text-white transition-colors shrink-0 border border-purple-200/60"
          >
            <Sparkles className="h-3 w-3" />
            <span>Coming Soon</span>
          </Link>

          <span className="h-4 w-px bg-slate-200 shrink-0 mx-1" />

          {/* Key State Quick Pills */}
          <Link
            href="/jobs?state=BR"
            className="px-2.5 py-1 rounded-full bg-slate-50 hover:bg-slate-200 transition-colors shrink-0 text-slate-600 text-[11.5px]"
          >
            Bihar (BR)
          </Link>
          <Link
            href="/jobs?state=UP"
            className="px-2.5 py-1 rounded-full bg-slate-50 hover:bg-slate-200 transition-colors shrink-0 text-slate-600 text-[11.5px]"
          >
            UP
          </Link>
          <Link
            href="/jobs?state=WB"
            className="px-2.5 py-1 rounded-full bg-slate-50 hover:bg-slate-200 transition-colors shrink-0 text-slate-600 text-[11.5px]"
          >
            WB
          </Link>
          <Link
            href="/jobs?state=RJ"
            className="px-2.5 py-1 rounded-full bg-slate-50 hover:bg-slate-200 transition-colors shrink-0 text-slate-600 text-[11.5px]"
          >
            Rajasthan
          </Link>
          <Link
            href="/jobs?state=DL"
            className="px-2.5 py-1 rounded-full bg-slate-50 hover:bg-slate-200 transition-colors shrink-0 text-slate-600 text-[11.5px]"
          >
            Delhi
          </Link>
        </div>
      </div>
    </section>
  );
}
