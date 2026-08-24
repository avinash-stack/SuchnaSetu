import Link from "next/link";
import { TodayUpdateItem } from "@/modules/home/dynamic-sections";
import { Badge } from "@/components/ui/badge";
import {
  Zap,
  ChevronRight,
  Flame,
  Clock,
} from "lucide-react";

interface TodaysUpdatesSectionProps {
  items: TodayUpdateItem[];
}

export function TodaysUpdatesSection({ items }: TodaysUpdatesSectionProps) {
  // If there are no updates, hide the section gracefully
  if (!items || items.length === 0) {
    return null;
  }

  // Display top 7 updates
  const displayItems = items.slice(0, 7);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 space-y-4 shadow-xs">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-50 text-red-700">
            <Zap className="h-4 w-4 fill-red-600 text-red-600" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
            <span>Today&apos;s Live Updates</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-600 text-white animate-pulse">
              LIVE
            </span>
          </h3>
        </div>

        <Link
          href="/news"
          className="text-xs sm:text-sm font-semibold text-[#013089] hover:underline inline-flex items-center gap-0.5"
        >
          <span>All Bulletins</span>
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="divide-y divide-slate-100 -mx-1">
        {displayItems.map((item) => {
          const isBreaking = item.importance === "breaking";

          return (
            <div
              key={item.id}
              className={`py-3 px-2 rounded-lg transition-colors flex items-center justify-between gap-3 ${
                isBreaking ? "bg-red-50/40 hover:bg-red-50/70" : "hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-2 min-w-0 flex-1">
                {/* Category / Importance Badge */}
                <span
                  className={`text-[11px] font-bold py-0.5 px-2 rounded shrink-0 flex items-center gap-1 ${
                    item.badgeVariant === "danger"
                      ? "bg-red-600 text-white"
                      : item.badgeVariant === "warning"
                      ? "bg-amber-600 text-white"
                      : item.badgeVariant === "success"
                      ? "bg-emerald-600 text-white"
                      : "bg-[#013089] text-white"
                  }`}
                >
                  {isBreaking && <Flame className="h-3 w-3 fill-current" />}
                  <span>{item.badgeLabel}</span>
                </span>

                <Link
                  href={item.slug}
                  className="text-sm sm:text-[14.5px] font-semibold text-slate-800 hover:text-[#013089] transition-colors truncate block leading-snug"
                  title={item.title}
                >
                  {item.title}
                </Link>
              </div>

              {/* Time Ago Badge */}
              <div className="flex items-center gap-1 text-xs text-slate-500 font-medium shrink-0 whitespace-nowrap font-mono">
                <Clock className="h-3 w-3 text-slate-400" />
                <span>{item.timeAgo}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
