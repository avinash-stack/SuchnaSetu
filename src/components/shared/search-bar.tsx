"use client";

import * as React from "react";
import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  className?: string;
}

export function SearchBar({
  placeholder = "Search central, state, defence, banking jobs, organizations, or notification numbers...",
  onSearch,
  className,
}: SearchBarProps) {
  const [query, setQuery] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="relative flex w-full items-center rounded-xl border border-slate-300 bg-white p-1.5 shadow-sm ring-1 ring-black/5 transition-all focus-within:border-slate-900 focus-within:ring-2 focus-within:ring-slate-900">
        <div className="flex items-center pl-3 text-slate-400">
          <Search className="h-5 w-5" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
        />
        <Button type="submit" variant="brand" size="md" className="gap-2 rounded-lg font-semibold">
          <span>Search Notices</span>
        </Button>
      </div>
    </form>
  );
}
