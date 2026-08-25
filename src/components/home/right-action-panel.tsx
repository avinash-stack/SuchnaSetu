"use client";

import * as React from "react";
import Link from "next/link";
import { AdmitCardItem } from "@/modules/admit-cards/service";
import { ResultItem } from "@/modules/results/service";
import { AnswerKeyItem, SyllabusItem, ComingSoonItem } from "@/modules/home/dynamic-sections";
import { formatDate } from "@/lib/utils";
import {
  CreditCard,
  FileCheck2,
  KeyRound,
  BookOpen,
  Sparkles,
  ChevronRight,
  ExternalLink,
  Download,
  Flame,
} from "lucide-react";

interface RightActionPanelProps {
  admitCards: AdmitCardItem[];
  results: ResultItem[];
  answerKeys: AnswerKeyItem[];
  officialSyllabi: SyllabusItem[];
  comingSoonItems: ComingSoonItem[];
}

type ActionTabKey = "all" | "admit" | "results" | "keys" | "syllabus" | "coming_soon";

export function RightActionPanel({
  admitCards,
  results,
  answerKeys,
  officialSyllabi,
  comingSoonItems,
}: RightActionPanelProps) {
  const [activeTab, setActiveTab] = React.useState<ActionTabKey>("all");

  return (
    <aside className="w-full space-y-3.5" aria-label="Quick Action Portals">
      {/* Action Panel Header & Interactive Tabs */}
      <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-2xs space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider text-slate-900 font-heading">
            <Flame className="h-4 w-4 text-[#FE8D01]" />
            <span>Civic Action Portals</span>
          </div>
          <span className="text-[11px] text-slate-400 font-semibold">Direct Access</span>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-0.5 no-scrollbar text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`px-2.5 py-1 rounded-md transition-colors shrink-0 text-[11.5px] ${
              activeTab === "all"
                ? "bg-[#013089] text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            All Portals
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("admit")}
            className={`px-2.5 py-1 rounded-md transition-colors shrink-0 text-[11.5px] ${
              activeTab === "admit"
                ? "bg-amber-600 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            Admit Cards ({admitCards.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("results")}
            className={`px-2.5 py-1 rounded-md transition-colors shrink-0 text-[11.5px] ${
              activeTab === "results"
                ? "bg-emerald-700 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            Results ({results.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("keys")}
            className={`px-2.5 py-1 rounded-md transition-colors shrink-0 text-[11.5px] ${
              activeTab === "keys"
                ? "bg-blue-700 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            Keys
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("syllabus")}
            className={`px-2.5 py-1 rounded-md transition-colors shrink-0 text-[11.5px] ${
              activeTab === "syllabus"
                ? "bg-slate-800 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            Syllabus
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("coming_soon")}
            className={`px-2.5 py-1 rounded-md transition-colors shrink-0 text-[11.5px] ${
              activeTab === "coming_soon"
                ? "bg-purple-700 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            Upcoming
          </button>
        </div>
      </div>

      {/* 1. ADMIT CARDS & HALL TICKETS */}
      {(activeTab === "all" || activeTab === "admit") && (
        <div className="rounded-xl border border-slate-200 bg-white p-3 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 font-heading">
              <CreditCard className="h-3.5 w-3.5 text-amber-600" />
              <span>Admit Cards &amp; Hall Tickets</span>
            </div>
            <Link
              href="/admit-cards"
              className="text-[11px] font-bold text-[#013089] hover:underline inline-flex items-center"
            >
              <span>View All</span>
              <ChevronRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {admitCards.slice(0, 5).map((ac) => (
              <div
                key={ac.id}
                className="py-1.5 flex items-center justify-between gap-2 hover:bg-slate-50 rounded transition-colors px-1"
              >
                <div className="flex items-center gap-1.5 min-w-0 flex-1">
                  <span className="font-bold text-[10.5px] text-[#013089] bg-blue-50 px-1.5 py-0.2 rounded shrink-0">
                    {ac.organization?.acronym || "EXAM"}
                  </span>
                  <Link
                    href={`/exams/${ac.slug}`}
                    className="font-semibold text-slate-800 hover:text-[#013089] transition-colors truncate block"
                    title={ac.title}
                  >
                    {ac.title}
                  </Link>
                </div>
                {ac.admit_card_url ? (
                  <a
                    href={ac.admit_card_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[10.5px] font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 px-2 py-0.5 rounded shrink-0"
                  >
                    <span>Download</span>
                    <Download className="h-2.5 w-2.5" />
                  </a>
                ) : (
                  <span className="text-[10.5px] text-slate-400 font-mono shrink-0">
                    {ac.state_code || "National"}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. RESULTS & MERIT LISTS */}
      {(activeTab === "all" || activeTab === "results") && (
        <div className="rounded-xl border border-slate-200 bg-white p-3 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 font-heading">
              <FileCheck2 className="h-3.5 w-3.5 text-emerald-700" />
              <span>Latest Results &amp; Cutoffs</span>
            </div>
            <Link
              href="/results"
              className="text-[11px] font-bold text-[#013089] hover:underline inline-flex items-center"
            >
              <span>View All</span>
              <ChevronRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {results.slice(0, 5).map((res) => (
              <div
                key={res.id}
                className="py-1.5 flex items-center justify-between gap-2 hover:bg-slate-50 rounded transition-colors px-1"
              >
                <div className="flex items-center gap-1.5 min-w-0 flex-1">
                  <span className="font-bold text-[10.5px] text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded shrink-0">
                    {res.organization?.acronym || "GOVT"}
                  </span>
                  <Link
                    href={`/jobs/${res.slug}`}
                    className="font-semibold text-slate-800 hover:text-[#013089] transition-colors truncate block"
                    title={res.title}
                  >
                    {res.title}
                  </Link>
                </div>
                {res.result_url ? (
                  <a
                    href={res.result_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[10.5px] font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded shrink-0"
                  >
                    <span>Gazette</span>
                    <ExternalLink className="h-2.5 w-2.5" />
                  </a>
                ) : (
                  <span className="text-[10.5px] text-emerald-700 font-semibold shrink-0">
                    Declared
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. OFFICIAL ANSWER KEYS */}
      {(activeTab === "all" || activeTab === "keys") && (
        <div className="rounded-xl border border-slate-200 bg-white p-3 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 font-heading">
              <KeyRound className="h-3.5 w-3.5 text-[#013089]" />
              <span>Official Answer Keys</span>
            </div>
            <Link
              href="/answer-keys"
              className="text-[11px] font-bold text-[#013089] hover:underline inline-flex items-center"
            >
              <span>View All</span>
              <ChevronRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {answerKeys.slice(0, 5).map((item) => (
              <div
                key={item.id}
                className="py-1.5 flex items-center justify-between gap-2 hover:bg-slate-50 rounded transition-colors px-1"
              >
                <div className="flex items-center gap-1.5 min-w-0 flex-1">
                  <span className="font-bold text-[10.5px] text-[#013089] bg-blue-50 px-1.5 py-0.2 rounded shrink-0">
                    {item.authorityAcronym || "KEY"}
                  </span>
                  <Link
                    href={`/exams/${item.slug}`}
                    className="font-semibold text-slate-800 hover:text-[#013089] transition-colors truncate block"
                    title={item.title}
                  >
                    {item.title}
                  </Link>
                </div>
                {item.answerKeyUrl ? (
                  <a
                    href={item.answerKeyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[10.5px] font-bold text-[#013089] bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded shrink-0"
                  >
                    <span>Key PDF</span>
                    <ExternalLink className="h-2.5 w-2.5" />
                  </a>
                ) : (
                  <span className="text-[10.5px] text-slate-400 font-mono shrink-0">
                    {formatDate(item.releasedAt)}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. EXAM SYLLABUS & PATTERNS */}
      {(activeTab === "all" || activeTab === "syllabus") && (
        <div className="rounded-xl border border-slate-200 bg-white p-3 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 font-heading">
              <BookOpen className="h-3.5 w-3.5 text-slate-700" />
              <span>Exam Syllabus &amp; Scheme</span>
            </div>
            <Link
              href="/syllabus"
              className="text-[11px] font-bold text-[#013089] hover:underline inline-flex items-center"
            >
              <span>View All</span>
              <ChevronRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {officialSyllabi.slice(0, 5).map((item) => (
              <div
                key={item.id}
                className="py-1.5 flex items-center justify-between gap-2 hover:bg-slate-50 rounded transition-colors px-1"
              >
                <div className="flex items-center gap-1.5 min-w-0 flex-1">
                  <span className="font-bold text-[10.5px] text-slate-700 bg-slate-100 px-1.5 py-0.2 rounded shrink-0">
                    {item.authorityAcronym || "PATTERN"}
                  </span>
                  <Link
                    href={`/syllabus/${item.slug}`}
                    className="font-semibold text-slate-800 hover:text-[#013089] transition-colors truncate block"
                    title={item.title}
                  >
                    {item.title}
                  </Link>
                </div>
                <Link
                  href={`/syllabus/${item.slug}`}
                  className="inline-flex items-center gap-0.5 text-[10.5px] font-bold text-[#013089] hover:underline shrink-0"
                >
                  <span>Syllabus</span>
                  <ChevronRight className="h-2.5 w-2.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. COMING SOON / ADVANCE CIRCULARS */}
      {(activeTab === "all" || activeTab === "coming_soon") && comingSoonItems.length > 0 && (
        <div className="rounded-xl border border-purple-200/80 bg-purple-50/30 p-3 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between border-b border-purple-100 pb-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-purple-900 font-heading">
              <Sparkles className="h-3.5 w-3.5 text-purple-700" />
              <span>Advance Recruitment Notices</span>
            </div>
            <Link
              href="/coming-soon"
              className="text-[11px] font-bold text-purple-800 hover:underline inline-flex items-center"
            >
              <span>View All</span>
              <ChevronRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="divide-y divide-purple-100 text-xs">
            {comingSoonItems.slice(0, 4).map((item) => (
              <div
                key={item.id}
                className="py-1.5 flex items-center justify-between gap-2 hover:bg-purple-100/50 rounded transition-colors px-1"
              >
                <div className="flex items-center gap-1.5 min-w-0 flex-1">
                  <span className="font-bold text-[10.5px] text-purple-800 bg-purple-100 px-1.5 py-0.2 rounded shrink-0">
                    {item.authorityAcronym || "UPCOMING"}
                  </span>
                  <Link
                    href={`/jobs/${item.slug}`}
                    className="font-semibold text-slate-800 hover:text-purple-900 transition-colors truncate block"
                    title={item.title}
                  >
                    {item.title}
                  </Link>
                </div>
                <span className="text-[10.5px] font-semibold text-purple-700 shrink-0 whitespace-nowrap">
                  Coming Soon
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
