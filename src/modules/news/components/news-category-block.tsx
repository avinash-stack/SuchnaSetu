"use client";

import * as React from "react";
import Link from "next/link";
import { NewsArticle } from "../types/article";
import { NewsCategory } from "../types/category";
import { NewsSourceBadge } from "./news-source-badge";
import { formatDate } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/context";
import { resolveLocalizedNewsArticle } from "../utils/localize";
import { ChevronRight } from "lucide-react";

interface NewsCategoryBlockProps {
  category: NewsCategory;
  articles: NewsArticle[];
}

export function NewsCategoryBlock({ category, articles }: NewsCategoryBlockProps) {
  const { language } = useLanguage();

  if (!articles || articles.length === 0) return null;

  const isHindi = language === "hi";
  const localizedArticles = articles.map((a) => resolveLocalizedNewsArticle(a, language));
  const lead = localizedArticles[0];
  const rest = localizedArticles.slice(1, 4);

  return (
    <section className="space-y-3" aria-label={category.name}>
      {/* Category Header */}
      <div className="flex items-center justify-between border-b-2 border-[#013089] pb-1.5">
        <h3 className="text-base sm:text-lg font-bold text-slate-900 font-heading">
          {isHindi ? category.name_hi : category.name}
        </h3>
        <Link
          href={`/news/category/${category.slug}`}
          className="text-xs font-bold text-[#013089] hover:underline flex items-center gap-0.5"
        >
          <span>{isHindi ? "सभी देखें" : "View All"}</span>
          <ChevronRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
        {/* Left: Lead Category Story */}
        {lead && (
          <div className="md:col-span-6 rounded-xl border border-slate-200 bg-white p-4 shadow-2xs flex flex-col justify-between hover:border-[#013089]/40 transition-all group">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-[#013089] bg-blue-50 px-1.5 py-0.2 rounded text-[10px]">
                  {lead.category_slug}
                </span>
                <span className="text-slate-400 font-mono">{formatDate(lead.published_at)}</span>
              </div>

              <Link href={`/news/${lead.slug}`} className="block">
                <h4 className="font-bold text-base text-slate-900 group-hover:text-[#013089] transition-colors leading-snug line-clamp-2">
                  {lead.title}
                </h4>
              </Link>

              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {lead.summary}
              </p>
            </div>

            <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <NewsSourceBadge name={lead.source_name} sourceUrl={lead.source_url} />
              <Link href={`/news/${lead.slug}`} className="font-bold text-[#013089] text-[11.5px] hover:underline">
                Read →
              </Link>
            </div>
          </div>
        )}

        {/* Right: 3 Headline Rows */}
        <div className="md:col-span-6 rounded-xl border border-slate-200 bg-white p-3 shadow-2xs divide-y divide-slate-100 flex flex-col justify-between">
          {rest.map((item) => (
            <div key={item.id} className="py-2 first:pt-0 last:pb-0">
              <Link
                href={`/news/${item.slug}`}
                className="font-bold text-xs sm:text-[13px] text-slate-900 hover:text-[#013089] transition-colors line-clamp-2 leading-snug block"
              >
                {item.title}
              </Link>
              <div className="flex items-center justify-between text-[10.5px] text-slate-400 mt-1 font-mono">
                <span className="truncate max-w-[120px]">{item.source_name}</span>
                <span>{formatDate(item.published_at)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
