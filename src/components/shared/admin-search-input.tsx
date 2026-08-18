"use client";

import * as React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search, X, Loader2 } from "lucide-react";

interface AdminSearchInputProps {
  placeholder?: string;
  className?: string;
}

function AdminSearchInputInner({
  placeholder = "Search by keyword, code, or title...",
  className = "",
}: AdminSearchInputProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentQuery = searchParams.get("search") || "";
  const [query, setQuery] = React.useState(currentQuery);
  const [isPending, startTransition] = React.useTransition();

  React.useEffect(() => {
    setQuery(currentQuery);
  }, [currentQuery]);

  const executeSearch = (value: string) => {
    const trimmed = value.trim();
    startTransition(() => {
      const nextParams = new URLSearchParams(searchParams.toString());
      if (trimmed) {
        nextParams.set("search", trimmed);
      } else {
        nextParams.delete("search");
      }
      nextParams.delete("page");

      const qs = nextParams.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname);
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch(query);
  };

  const handleClear = () => {
    setQuery("");
    executeSearch("");
  };

  return (
    <form onSubmit={handleSubmit} className={`relative flex items-center ${className}`}>
      <div className="relative flex w-full items-center rounded-lg border border-slate-200 bg-slate-50/50 px-2.5 py-1 text-xs shadow-2xs focus-within:border-slate-900 focus-within:bg-white transition-colors">
        {isPending ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-500 mr-1.5 shrink-0" />
        ) : (
          <Search className="h-3.5 w-3.5 text-slate-400 mr-1.5 shrink-0" />
        )}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="p-0.5 text-slate-400 hover:text-slate-600 rounded transition-colors ml-1"
            title="Clear search"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </form>
  );
}

export function AdminSearchInput(props: AdminSearchInputProps) {
  return (
    <React.Suspense
      fallback={
        <div className={`relative flex items-center ${props.className || ""}`}>
          <div className="relative flex w-full items-center rounded-lg border border-slate-200 bg-slate-50/50 px-2.5 py-1 text-xs">
            <Search className="h-3.5 w-3.5 text-slate-300 mr-1.5" />
            <input
              type="text"
              placeholder={props.placeholder || "Search..."}
              disabled
              className="w-full bg-transparent text-xs text-slate-300"
            />
          </div>
        </div>
      }
    >
      <AdminSearchInputInner {...props} />
    </React.Suspense>
  );
}
