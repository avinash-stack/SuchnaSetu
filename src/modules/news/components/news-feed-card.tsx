"use client";

import * as React from "react";
import Link from "next/link";
import { NewsArticle } from "../types/article";
import { NewsSourceBadge } from "./news-source-badge";
import { formatDate } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/context";
import { resolveLocalizedNewsArticle } from "../utils/localize";
import { Clock, MapPin, Sparkles } from "lucide-react";

interface NewsFeedCardProps {
  article: NewsArticle;
  variant?: "standard" | "compact" | "horizontal";
}

export function NewsFeedCard({ article: rawArticle, variant = "standard" }: NewsFeedCardProps) {
  const { language } = useLanguage();
  const article = resolveLocalizedNewsArticle(rawArticle, language);

  const isBreaking = article.importance === "breaking";

  if (variant === "compact") {
    return (
      <div className="py-2.5 px-3 hover:bg-slate-50 rounded-lg transition-colors border-b border-slate-100 last:border-0">
        <div className="flex items-center gap-2 text-[11px] mb-1 flex-wrap">
          <span className="font-bold text-[#013089] uppercase tracking-wider text-[10px] bg-blue-50 px-1.5 py-0.2 rounded">
            {article.category_slug}
          </span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-500 font-mono">{formatDate(article.published_at)}</span>
        </div>
        <Link
          href={`/news/${article.slug}`}
          className="font-bold text-sm text-slate-900 hover:text-[#013089] transition-colors leading-snug line-clamp-2 block"
        >
          {article.title}
        </Link>
      </div>
    );
  }

  return (
    <article
      className={`rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-2xs hover:border-[#013089]/40 hover:shadow-xs transition-all flex flex-col justify-between gap-3 group ${
        isBreaking ? "border-l-4 border-l-red-600 bg-red-50/10" : ""
      }`}
    >
      <div className="space-y-2">
        {/* Category & Authority Strip */}
        <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
          <div className="flex items-center gap-1.5">
            {isBreaking && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-red-600 text-white animate-pulse">
                <Sparkles className="h-2.5 w-2.5" />
                BREAKING
              </span>
            )}
            <Link
              href={`/news/category/${article.category_slug}`}
              className="font-bold text-[11px] uppercase tracking-wider text-[#013089] bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded transition-colors"
            >
              {article.category_slug}
            </Link>
            {article.state_code && (
              <span className="inline-flex items-center gap-0.5 text-[11px] text-slate-600 font-medium bg-slate-100 px-2 py-0.5 rounded">
                <MapPin className="h-2.5 w-2.5 text-slate-400" />
                {article.state_code}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
            <Clock className="h-3 w-3 text-slate-400" />
            <span>{formatDate(article.published_at)}</span>
          </div>
        </div>

        {/* Title */}
        <Link href={`/news/${article.slug}`} className="block">
          <h3 className="font-bold text-base sm:text-lg text-slate-900 group-hover:text-[#013089] transition-colors leading-snug line-clamp-2 font-heading">
            {article.title}
          </h3>
        </Link>

        {/* Factual Summary */}
        <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed line-clamp-2">
          {article.summary}
        </p>
      </div>

      {/* Publisher Attribution & Source Link Footer */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
        <NewsSourceBadge name={article.source_name} sourceUrl={article.source_url} />

        <Link
          href={`/news/${article.slug}`}
          className="text-[11.5px] font-bold text-[#013089] hover:underline shrink-0"
        >
          Read Story →
        </Link>
      </div>
    </article>
  );
}
