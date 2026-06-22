"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

type AdminSearchProps = {
  placeholder?: string;
  paramName?: string;
};

export function AdminSearch({
  placeholder = "Search by name or email...",
  paramName = "q",
}: AdminSearchProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [query, setQuery] = useState(searchParams.get(paramName) ?? "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (query.trim()) {
        params.set(paramName, query.trim());
      } else {
        params.delete(paramName);
      }
      params.delete("page");
      const qs = params.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <div className="relative min-w-0 flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="min-h-10 w-full rounded-xl border border-border bg-surface-bright py-2 pl-9 pr-3 text-sm outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
        />
      </div>
      <Button type="submit" size="sm" disabled={pending}>
        Search
      </Button>
    </form>
  );
}
