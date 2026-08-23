import Link from "next/link";
import { TodayUpdateItem } from "@/modules/home/dynamic-sections";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import {
  Zap,
  ChevronRight,
} from "lucide-react";

interface TodaysUpdatesSectionProps {
  items: TodayUpdateItem[];
}

export function TodaysUpdatesSection({ items }: TodaysUpdatesSectionProps) {
  // If there are no updates, hide the section entirely
  if (!items || items.length === 0) {
    return null;
  }

  // Max 7 top links in the right panel
  const displayItems = items.slice(0, 7);

  return (
    <div className="rounded-xl border border-slate-200/90 bg-white p-4 sm:p-4.5 space-y-3 shadow-2xs">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-red-50 text-red-700">
            <Zap className="h-3.5 w-3.5 fill-red-600 text-red-600" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 font-heading flex items-center gap-2">
            <span>Today&apos;s Updates</span>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-red-600 text-white animate-pulse">
              LIVE
            </span>
          </h3>
        </div>

        <Link
          href="/news"
          className="text-xs font-semibold text-[#013089] hover:underline inline-flex items-center gap-0.5"
        >
          <span>View All</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="divide-y divide-slate-100/80 -mx-1">
        {displayItems.map((item) => (
          <div
            key={item.id}
            className="py-2 px-2 hover:bg-slate-50/80 rounded-lg transition-colors flex items-center justify-between gap-2.5"
          >
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <Badge
                variant="brand"
                className="text-[10px] font-bold py-0.5 px-1.5 shrink-0 bg-[#013089] text-white rounded"
              >
                {item.authorityAcronym}
              </Badge>

              <Link
                href={item.slug}
                className="text-[13px] font-medium text-slate-800 hover:text-[#013089] transition-colors truncate block leading-snug"
                title={item.title}
              >
                {item.title}
              </Link>
            </div>

            <span className="text-[11px] text-slate-400 font-medium shrink-0 whitespace-nowrap">
              {formatDate(item.publishedAt)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
