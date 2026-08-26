"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NewsSearchBarProps {
  placeholder?: string;
  initialQuery?: string;
  lang?: "en" | "hi";
}

export function NewsSearchBar({
  placeholder = "Search headlines, topics, states, or publishers...",
  initialQuery = "",
  lang = "en",
}: NewsSearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = React.useState(initialQuery);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    const langParam = lang === "hi" ? "&lang=hi" : "";
    if (trimmed) {
      router.push(`/news/search?q=${encodeURIComponent(trimmed)}${langParam}`);
    } else {
      router.push(`/news/search${lang === "hi" ? "?lang=hi" : ""}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full relative flex items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full h-11 pl-10 pr-10 rounded-full border border-slate-200 bg-white text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#013089] focus:border-transparent transition-all shadow-2xs"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <Button
        type="submit"
        variant="brand"
        className="ml-2 h-11 px-5 rounded-full font-bold text-xs shrink-0 shadow-xs"
      >
        Search
      </Button>
    </form>
  );
}
