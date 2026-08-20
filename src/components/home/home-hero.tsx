"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/context";
import { SearchBar } from "@/components/shared/search-bar";
import { Sparkles, MapPin } from "lucide-react";

export function HomeHero() {
  const { t } = useLanguage();

  return (
    <section className="bg-white border-b border-slate-200 pt-6 pb-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-5">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#013089]">
              <Sparkles className="h-4 w-4 text-[#FE8D01]" />
              <span>{t("masthead.official_portal")}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F172A] font-heading mt-1">
              {t("hero.title")}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              {t("hero.subtitle")}
            </p>
          </div>
        </div>

        {/* Unified High-Performance Search Bar */}
        <div className="max-w-3xl">
          <SearchBar size="lg" />

          {/* Quick Search Badges */}
          <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
            <span className="font-semibold text-slate-700">{t("hero.popular")}</span>
            <Link
              href="/?search=Bihar"
              className="rounded-xs bg-slate-100 hover:bg-slate-200 px-2 py-0.5 text-slate-700 font-medium transition-colors"
            >
              {t("hero.tag_bihar")}
            </Link>
            <Link
              href="/?search=SSC"
              className="rounded-xs bg-slate-100 hover:bg-slate-200 px-2 py-0.5 text-slate-700 font-medium transition-colors"
            >
              {t("hero.tag_ssc")}
            </Link>
            <Link
              href="/?search=Railway"
              className="rounded-xs bg-slate-100 hover:bg-slate-200 px-2 py-0.5 text-slate-700 font-medium transition-colors"
            >
              {t("hero.tag_railway")}
            </Link>
            <Link
              href="/?search=Teacher"
              className="rounded-xs bg-slate-100 hover:bg-slate-200 px-2 py-0.5 text-slate-700 font-medium transition-colors"
            >
              {t("hero.tag_teaching")}
            </Link>
            <Link
              href="/?search=High+Court"
              className="rounded-xs bg-slate-100 hover:bg-slate-200 px-2 py-0.5 text-slate-700 font-medium transition-colors"
            >
              {t("hero.tag_patna_hc")}
            </Link>
          </div>
        </div>

        {/* Editorial State Switcher Strip */}
        <div className="pt-2 border-t border-slate-100 flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
          <span className="font-bold text-slate-700 uppercase tracking-wider shrink-0 flex items-center gap-1 text-[11px]">
            <MapPin className="h-3.5 w-3.5 text-[#013089]" />
            <span>{t("state_strip.heading")}</span>
          </span>

          <Link
            href="/jobs"
            className="rounded-xs bg-[#013089] text-white px-2.5 py-1 font-bold shrink-0 transition-colors"
          >
            {t("state_strip.all_india")}
          </Link>
          <Link
            href="/jobs?state=BR"
            className="rounded-xs bg-slate-100 hover:bg-slate-200 px-2.5 py-1 text-slate-800 font-semibold shrink-0 transition-colors"
          >
            Bihar (BR)
          </Link>
          <Link
            href="/jobs?state=UP"
            className="rounded-xs bg-slate-100 hover:bg-slate-200 px-2.5 py-1 text-slate-800 font-semibold shrink-0 transition-colors"
          >
            Uttar Pradesh (UP)
          </Link>
          <Link
            href="/jobs?state=WB"
            className="rounded-xs bg-slate-100 hover:bg-slate-200 px-2.5 py-1 text-slate-800 font-semibold shrink-0 transition-colors"
          >
            West Bengal (WB)
          </Link>
          <Link
            href="/jobs?state=OR"
            className="rounded-xs bg-slate-100 hover:bg-slate-200 px-2.5 py-1 text-slate-800 font-semibold shrink-0 transition-colors"
          >
            Odisha (OR)
          </Link>
          <Link
            href="/jobs?state=AS"
            className="rounded-xs bg-slate-100 hover:bg-slate-200 px-2.5 py-1 text-slate-800 font-semibold shrink-0 transition-colors"
          >
            Assam (AS)
          </Link>
          <Link
            href="/jobs?state=PB"
            className="rounded-xs bg-slate-100 hover:bg-slate-200 px-2.5 py-1 text-slate-800 font-semibold shrink-0 transition-colors"
          >
            Punjab (PB)
          </Link>
          <Link
            href="/jobs?state=RJ"
            className="rounded-xs bg-slate-100 hover:bg-slate-200 px-2.5 py-1 text-slate-800 font-semibold shrink-0 transition-colors"
          >
            Rajasthan (RJ)
          </Link>
          <Link
            href="/jobs?state=MP"
            className="rounded-xs bg-slate-100 hover:bg-slate-200 px-2.5 py-1 text-slate-800 font-semibold shrink-0 transition-colors"
          >
            Madhya Pradesh (MP)
          </Link>
          <Link
            href="/jobs?state=DL"
            className="rounded-xs bg-slate-100 hover:bg-slate-200 px-2.5 py-1 text-slate-800 font-semibold shrink-0 transition-colors"
          >
            Delhi (DL)
          </Link>
        </div>
      </div>
    </section>
  );
}
