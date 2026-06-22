import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type AdminPaginationProps = {
  page: number;
  totalPages: number;
  total: number;
  basePath: string;
  params?: Record<string, string | undefined>;
};

function buildHref(
  basePath: string,
  page: number,
  params?: Record<string, string | undefined>
) {
  const search = new URLSearchParams();
  if (page > 1) search.set("page", String(page));
  if (params?.status && params.status !== "pending") {
    search.set("status", params.status);
  }
  if (params?.q) search.set("q", params.q);
  const query = search.toString();
  return query ? `${basePath}?${query}` : basePath;
}

export function AdminPagination({
  page,
  totalPages,
  total,
  basePath,
  params,
}: AdminPaginationProps) {
  if (totalPages <= 1 && total <= 15) return null;

  const prevPage = Math.max(1, page - 1);
  const nextPage = Math.min(totalPages, page + 1);

  return (
    <div className="flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted">
        Showing page {page} of {totalPages} ({total} total)
      </p>
      <div className="flex items-center gap-2">
        <Link
          href={buildHref(basePath, prevPage, params)}
          className={cn(
            "inline-flex min-h-10 items-center gap-1 rounded-lg border border-border px-3 text-sm font-medium transition-colors hover:bg-primary/5",
            page <= 1 && "pointer-events-none opacity-40"
          )}
          aria-disabled={page <= 1}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Link>
        <span className="px-2 text-sm font-medium">{page}</span>
        <Link
          href={buildHref(basePath, nextPage, params)}
          className={cn(
            "inline-flex min-h-10 items-center gap-1 rounded-lg border border-border px-3 text-sm font-medium transition-colors hover:bg-primary/5",
            page >= totalPages && "pointer-events-none opacity-40"
          )}
          aria-disabled={page >= totalPages}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
