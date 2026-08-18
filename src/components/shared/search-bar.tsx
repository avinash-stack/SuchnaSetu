"use client";

import * as React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  placeholder?: string;
  targetPath?: string;
  searchParamKey?: string;
  onSearch?: (query: string) => void;
  className?: string;
  buttonText?: string;
  showClear?: boolean;
  size?: "sm" | "md" | "lg";
}

function SearchBarInner({
  placeholder = "Search central, state, defence, banking jobs, organizations, or notification numbers...",
  targetPath,
  searchParamKey = "search",
  onSearch,
  className = "",
  buttonText = "Search Notices",
  showClear = true,
  size = "md",
}: SearchBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Read current active search query from URL
  const currentQuery =
    searchParams.get(searchParamKey) ||
    searchParams.get("q") ||
    searchParams.get("query") ||
    "";

  const [query, setQuery] = React.useState(currentQuery);
  const [isPending, startTransition] = React.useTransition();

  // Keep local query state in sync with URL searchParams
  React.useEffect(() => {
    setQuery(currentQuery);
  }, [currentQuery]);

  const executeSearch = (rawQuery: string) => {
    const trimmed = rawQuery.trim();

    if (onSearch) {
      onSearch(trimmed);
      return;
    }

    startTransition(() => {
      // If targetPath is specified and different from current pathname (e.g. searching from homepage to /jobs)
      if (targetPath && targetPath !== pathname) {
        const destParams = new URLSearchParams();
        if (trimmed) {
          destParams.set(searchParamKey, trimmed);
        }
        const qs = destParams.toString();
        router.push(qs ? `${targetPath}?${qs}` : targetPath);
        return;
      }

      // Searching on the current page: clone params, update search, reset page
      const nextParams = new URLSearchParams(searchParams.toString());
      if (trimmed) {
        nextParams.set(searchParamKey, trimmed);
      } else {
        nextParams.delete(searchParamKey);
        nextParams.delete("q");
        nextParams.delete("query");
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
    <form onSubmit={handleSubmit} className={`w-full ${className}`}>
      <div className="relative flex w-full items-center rounded-xl border border-slate-300 bg-white p-1.5 shadow-xs ring-1 ring-black/5 transition-all focus-within:border-brand-600 focus-within:ring-2 focus-within:ring-brand-600/20">
        <div className="flex items-center pl-3 text-slate-400">
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin text-brand-600" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent px-3 py-1.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden"
        />

        {showClear && query && (
          <button
            type="button"
            onClick={handleClear}
            className="p-1.5 mr-1 text-slate-400 hover:text-slate-600 rounded-md transition-colors"
            title="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        <Button
          type="submit"
          variant="brand"
          size={size === "sm" ? "sm" : "md"}
          disabled={isPending}
          className="gap-2 rounded-lg font-semibold shrink-0"
        >
          <span>{buttonText}</span>
        </Button>
      </div>
    </form>
  );
}

export function SearchBar(props: SearchBarProps) {
  return (
    <React.Suspense
      fallback={
        <div className={`w-full ${props.className || ""}`}>
          <div className="relative flex w-full items-center rounded-xl border border-slate-200 bg-white p-1.5 shadow-xs">
            <div className="flex items-center pl-3 text-slate-400">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              placeholder={props.placeholder || "Search..."}
              disabled
              className="w-full bg-transparent px-3 py-1.5 text-sm text-slate-400"
            />
            <Button variant="brand" size="md" disabled className="gap-2 rounded-lg font-semibold">
              <span>{props.buttonText || "Search Notices"}</span>
            </Button>
          </div>
        </div>
      }
    >
      <SearchBarInner {...props} />
    </React.Suspense>
  );
}
