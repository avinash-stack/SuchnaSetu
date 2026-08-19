import Link from "next/link";
import { PublicBulletinDetailed } from "../types";
import { ArrowRight, Flame } from "lucide-react";

interface BreakingTickerProps {
  bulletins: PublicBulletinDetailed[];
}

export function BreakingTicker({ bulletins }: BreakingTickerProps) {
  if (!bulletins || bulletins.length === 0) return null;

  const featured = bulletins[0];

  return (
    <div className="border-b border-amber-200 bg-amber-50/70 px-4 py-2 text-xs">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="flex items-center gap-1 rounded-sm bg-[#FE8D01] px-2 py-0.5 font-bold text-[10px] text-white uppercase tracking-wider flex-shrink-0">
            <Flame className="h-3 w-3" />
            <span>Latest Notice</span>
          </div>

          <Link
            href={`/news/${featured.slug}`}
            className="truncate font-semibold text-[#0F172A] hover:text-[#013089] transition-colors"
          >
            {featured.title}
          </Link>
        </div>

        <Link
          href="/news"
          className="flex items-center gap-1 font-bold text-[#013089] hover:text-[#01276E] text-[11px] flex-shrink-0 transition-colors"
        >
          <span>All Bulletins</span>
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
