"use client";

import * as React from "react";
import Link from "next/link";
import { NewsArticle } from "../types/article";
import { NewsSourceBadge } from "./news-source-badge";
import { formatDate } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/context";
import { resolveLocalizedNewsArticle } from "../utils/localize";
import { Flame, Clock, Sparkles, ChevronRight } from "lucide-react";

interface NewsHeroTopStoriesProps {
  articles: NewsArticle[];
}

export function NewsHeroTopStories({ articles }: NewsHeroTopStoriesProps) {
  const { language } = useLanguage();

  if (!articles || articles.length === 0) return null;

  const leadStory = resolveLocalizedNewsArticle(articles[0], language);
  const secondaryStories = articles.slice(1, 3).map((a) => resolveLocalizedNewsArticle(a, language));
  const sideHeadlines = articles.slice(3, 7).map((a) => resolveLocalizedNewsArticle(a, language));

  return (
    <section className="bg-slate-50 border-b border-slate-200/90 py-5 sm:py-6" aria-label="Top News Stories">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-4">
        {/* Section Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="h-4 w-4 text-[#FE8D01]" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 font-heading">
              Top Stories &amp; Major Developments
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-medium hidden sm:inline">
            Updated continuously from verified government &amp; national sources
          </span>
        </div>

        {/* 3-Column Top Stories Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Column 1 (6 Cols): Main Lead Story */}
          {leadStory && (
            <div className="lg:col-span-6 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs flex flex-col justify-between hover:border-[#013089]/50 transition-all group">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
                  <span className="font-bold text-[11px] uppercase tracking-wider text-[#013089] bg-blue-50 px-2 py-0.5 rounded">
                    {leadStory.category_slug}
                  </span>
                  <div className="flex items-center gap-1 text-slate-400 font-mono text-[11px]">
                    <Clock className="h-3 w-3" />
                    <span>{formatDate(leadStory.published_at)}</span>
                  </div>
                </div>

                <Link href={`/news/${leadStory.slug}`} className="block">
                  <h3 className="font-extrabold text-lg sm:text-2xl text-slate-900 group-hover:text-[#013089] transition-colors leading-tight font-heading">
                    {leadStory.title}
                  </h3>
                </Link>

                <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
                  {leadStory.summary}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                <NewsSourceBadge name={leadStory.source_name} sourceUrl={leadStory.source_url} />
                <Link
                  href={`/news/${leadStory.slug}`}
                  className="font-bold text-[#013089] hover:underline inline-flex items-center gap-0.5"
                >
                  <span>Read Full Story</span>
                  <ChevronRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          )}

          {/* Column 2 (3 Cols): Secondary Stories (Stacked) */}
          <div className="lg:col-span-3 space-y-4">
            {secondaryStories.map((story) => (
              <div
                key={story.id}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs hover:border-[#013089]/40 transition-all flex flex-col justify-between gap-2 group h-[calc(50%-8px)]"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-[#013089] uppercase tracking-wider bg-blue-50 px-1.5 py-0.2 rounded text-[10px]">
                      {story.category_slug}
                    </span>
                    <span className="text-slate-400 font-mono text-[10.5px]">
                      {formatDate(story.published_at)}
                    </span>
                  </div>

                  <Link href={`/news/${story.slug}`} className="block">
                    <h4 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-[#013089] transition-colors leading-snug line-clamp-2">
                      {story.title}
                    </h4>
                  </Link>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {story.summary}
                  </p>
                </div>

                <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] font-semibold text-slate-500 truncate max-w-[120px]">
                    {story.source_name}
                  </span>
                  <Link href={`/news/${story.slug}`} className="font-bold text-[#013089] text-[11px] hover:underline">
                    Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Column 3 (3 Cols): Fast Headlines Feed */}
          <div className="lg:col-span-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider text-slate-800 font-heading">
                <Sparkles className="h-3.5 w-3.5 text-[#013089]" />
                <span>Latest Headlines</span>
              </div>
              <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
            </div>

            <div className="divide-y divide-slate-100 space-y-1">
              {sideHeadlines.map((headline) => (
                <div key={headline.id} className="pt-2 first:pt-0 pb-1">
                  <Link
                    href={`/news/${headline.slug}`}
                    className="font-bold text-xs sm:text-[13px] text-slate-800 hover:text-[#013089] transition-colors line-clamp-2 leading-snug block"
                  >
                    {headline.title}
                  </Link>
                  <div className="flex items-center justify-between text-[10.5px] text-slate-400 mt-1 font-mono">
                    <span className="truncate max-w-[100px]">{headline.source_name}</span>
                    <span>{formatDate(headline.published_at)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
