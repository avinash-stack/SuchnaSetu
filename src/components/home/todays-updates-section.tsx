import Link from "next/link";
import { TodayUpdateItem } from "@/modules/home/dynamic-sections";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import {
  Zap,
  ArrowRight,
  Clock,
  ChevronRight,
} from "lucide-react";

interface TodaysUpdatesSectionProps {
  items: TodayUpdateItem[];
}

export function TodaysUpdatesSection({ items }: TodaysUpdatesSectionProps) {
  // CRITICAL REQUIREMENT: If there are no updates, hide the section entirely
  if (!items || items.length === 0) {
    return null;
  }

  // Max 7 top links in the right panel as requested
  const displayItems = items.slice(0, 7);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3.5 space-y-2.5 shadow-2xs">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <div className="flex items-center gap-1.5">
          <div className="flex h-5 w-5 items-center justify-center rounded bg-red-100 text-red-700">
            <Zap className="h-3 w-3 fill-red-600 text-red-600" />
          </div>
          <h3 className="text-xs sm:text-sm font-bold text-slate-900 font-heading flex items-center gap-1.5">
            <span>Today&apos;s Updates</span>
            <span className="inline-flex items-center px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-red-600 text-white animate-pulse">
              LIVE
            </span>
          </h3>
        </div>

        <Link
          href="/news"
          className="text-[11px] font-bold text-[#013089] hover:underline inline-flex items-center gap-0.5"
        >
          <span>View All</span>
          <ChevronRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="space-y-1 divide-y divide-slate-100">
        {displayItems.map((item) => (
          <div
            key={item.id}
            className="pt-1.5 first:pt-0 flex items-center justify-between gap-2 hover:bg-slate-50/80 rounded px-1 -mx-1 transition-colors"
          >
            <div className="flex items-center gap-1.5 min-w-0 flex-1">
              <Badge
                variant="brand"
                className="text-[9px] font-bold py-0 px-1.5 shrink-0 bg-[#013089] text-white"
              >
                {item.authorityAcronym}
              </Badge>

              <Link
                href={item.slug}
                className="text-xs font-semibold text-slate-900 hover:text-[#013089] transition-colors truncate block"
                title={item.title}
              >
                {item.title}
              </Link>
            </div>

            <span className="text-[10px] text-slate-400 font-medium shrink-0 whitespace-nowrap">
              {formatDate(item.publishedAt)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
