import * as React from "react";
import { ShieldCheck, ExternalLink } from "lucide-react";

interface NewsSourceBadgeProps {
  name: string;
  sourceUrl?: string | null;
  className?: string;
}

export function NewsSourceBadge({ name, sourceUrl, className = "" }: NewsSourceBadgeProps) {
  const content = (
    <span
      className={`inline-flex items-center gap-1 text-[11px] font-bold text-[#013089] bg-blue-50/90 hover:bg-blue-100 border border-blue-200/60 px-2 py-0.5 rounded-md transition-colors whitespace-nowrap ${className}`}
      title={`Source: ${name}`}
    >
      <ShieldCheck className="h-3 w-3 text-emerald-600 shrink-0" />
      <span className="truncate max-w-[150px]">{name}</span>
      {sourceUrl && <ExternalLink className="h-2.5 w-2.5 opacity-60 ml-0.5" />}
    </span>
  );

  if (sourceUrl) {
    return (
      <a
        href={sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block hover:opacity-95"
        onClick={(e) => e.stopPropagation()}
      >
        {content}
      </a>
    );
  }

  return content;
}
