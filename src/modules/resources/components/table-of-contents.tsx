"use client";

import React, { useEffect, useState } from "react";
import { ListCollapse, ChevronRight } from "lucide-react";

interface TableOfContentsProps {
  content: string;
}

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function TableOfContents({ content }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    // Extract H2 and H3 headings from markdown content
    const lines = content.split("\n");
    const extracted: TocItem[] = [];

    lines.forEach((line) => {
      const h2Match = line.match(/^##\s+(.+)$/);
      const h3Match = line.match(/^###\s+(.+)$/);

      if (h2Match) {
        const text = h2Match[1].replace(/[*_`]/g, "").trim();
        const id = text
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "");
        extracted.push({ id, text, level: 2 });
      } else if (h3Match) {
        const text = h3Match[1].replace(/[*_`]/g, "").trim();
        const id = text
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "");
        extracted.push({ id, text, level: 3 });
      }
    });

    setHeadings(extracted);

    // Intersection observer to track active section
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "0px 0px -70% 0px" }
    );

    extracted.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [content]);

  if (headings.length === 0) return null;

  return (
    <nav className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 shadow-2xs space-y-3" aria-label="Table of contents">
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2.5 text-xs font-bold uppercase tracking-wider text-slate-700">
        <ListCollapse className="h-4 w-4 text-[#013089]" />
        <span>In This Guide</span>
      </div>

      <ul className="space-y-1.5 text-[12.5px] max-h-[calc(100vh-16rem)] overflow-y-auto pr-1">
        {headings.map((h) => {
          const isActive = activeId === h.id;

          return (
            <li key={h.id} className={h.level === 3 ? "pl-3 text-[12px]" : ""}>
              <a
                href={`#${h.id}`}
                className={`flex items-start gap-1.5 py-1 transition-colors ${
                  isActive
                    ? "font-bold text-[#013089]"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <ChevronRight className={`h-3 w-3 mt-0.5 shrink-0 ${isActive ? "text-[#013089]" : "text-slate-300"}`} />
                <span className="line-clamp-1">{h.text}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
