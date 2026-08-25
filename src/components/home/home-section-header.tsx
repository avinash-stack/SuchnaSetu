"use client";

import * as React from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/context";
import { TranslationKey } from "@/lib/i18n/translations";
import { ArrowRight, Briefcase, Calendar, Newspaper, Sparkles, Building2, Flame } from "lucide-react";

export type SectionIconName = "briefcase" | "calendar" | "newspaper" | "sparkles" | "building" | "flame";

interface HomeSectionHeaderProps {
  titleKey: TranslationKey;
  subKey?: TranslationKey;
  viewAllHref: string;
  viewAllKey: TranslationKey;
  iconName?: SectionIconName;
  count?: number;
}

export function HomeSectionHeader({
  titleKey,
  subKey,
  viewAllHref,
  viewAllKey,
  iconName,
  count,
}: HomeSectionHeaderProps) {
  const { t } = useLanguage();

  const renderIcon = () => {
    switch (iconName) {
      case "briefcase":
        return <Briefcase className="h-4 w-4 text-[#013089]" />;
      case "calendar":
        return <Calendar className="h-4 w-4 text-[#013089]" />;
      case "newspaper":
        return <Newspaper className="h-4 w-4 text-[#013089]" />;
      case "sparkles":
        return <Sparkles className="h-4 w-4 text-[#013089]" />;
      case "building":
        return <Building2 className="h-4 w-4 text-[#013089]" />;
      case "flame":
        return <Flame className="h-4 w-4 text-[#FE8D01]" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center justify-between border-b border-slate-200/90 pb-1.5">
      <div className="flex items-center gap-2">
        {renderIcon()}
        <div>
          <h2 className="text-base sm:text-lg font-bold text-[#0F172A] font-heading">
            {t(titleKey)}
          </h2>
          {subKey && (
            <p className="text-[11.5px] text-slate-500 hidden sm:block">
              {t(subKey)}
            </p>
          )}
        </div>
      </div>

      <Link
        href={viewAllHref}
        className="text-xs font-bold text-[#013089] hover:underline flex items-center gap-0.5 whitespace-nowrap shrink-0"
      >
        <span>
          {t(viewAllKey)}
          {count ? ` (${count}+)` : ""}
        </span>
        <ArrowRight className="h-3 w-3" />
      </Link>
    </div>
  );
}
