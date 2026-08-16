import Link from "next/link";
import { PublicBulletinDetailed } from "../types";
import { Bell, Flame, ArrowRight, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface BreakingTickerProps {
  bulletins: PublicBulletinDetailed[];
}

export function BreakingTicker({ bulletins }: BreakingTickerProps) {
  if (!bulletins || bulletins.length === 0) return null;

  const featured = bulletins[0];

  return (
    <div className="border-b border-amber-200/80 bg-gradient-to-r from-amber-500/10 via-brand-500/10 to-emerald-500/10 px-4 py-2 text-xs">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="flex items-center gap-1.5 rounded-md bg-amber-600 px-2 py-0.5 font-bold text-[10px] text-white uppercase tracking-wider flex-shrink-0 animate-pulse">
            <Flame className="h-3 w-3" />
            <span>Latest Bulletin</span>
          </div>

          <Link
            href={`/news/${featured.slug}`}
            className="truncate font-semibold text-slate-800 hover:text-brand-700 transition-colors"
          >
            {featured.title}
          </Link>
        </div>

        <Link
          href="/news"
          className="flex items-center gap-1 font-semibold text-brand-700 hover:text-brand-800 text-[11px] flex-shrink-0 transition-colors"
        >
          <span>All Bulletins & News</span>
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
