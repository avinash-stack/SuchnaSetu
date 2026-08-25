"use client";

import * as React from "react";
import Link from "next/link";
import { NewsArticle } from "../types/article";
import { formatDate } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/context";
import { resolveLocalizedNewsArticle } from "../utils/localize";
import { Newspaper } from "lucide-react";

interface RelatedNewsStripProps {
  articles: NewsArticle[];
}

export function RelatedNewsStrip({ articles }: RelatedNewsStripProps) {
  const { language } = useLanguage();

  if (!articles || articles.length === 0) return null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 space-y-4 shadow-2xs">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
        <Newspaper className="h-4 w-4 text-[#013089]" />
        <h3 className="font-bold text-base text-slate-900 font-heading">Related News &amp; Coverage</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {articles.map((raw) => {
          const item = resolveLocalizedNewsArticle(raw, language);
          return (
            <div
              key={item.id}
              className="rounded-xl border border-slate-100 bg-slate-50/60 p-3 hover:bg-slate-100/80 transition-colors flex flex-col justify-between"
            >
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#013089]">
                  {item.category_slug}
                </span>
                <Link
                  href={`/news/${item.slug}`}
                  className="font-bold text-xs sm:text-[13px] text-slate-900 hover:text-[#013089] transition-colors leading-snug line-clamp-2 block"
                >
                  {item.title}
                </Link>
              </div>
              <div className="flex items-center justify-between text-[10.5px] text-slate-400 mt-2 font-mono">
                <span className="truncate max-w-[100px]">{item.source_name}</span>
                <span>{formatDate(item.published_at)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
