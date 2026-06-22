export const ADMIN_PAGE_SIZE = 15;

export type PaginatedResult<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export function parseAdminPage(raw?: string | string[]): number {
  const value = Array.isArray(raw) ? raw[0] : raw;
  const parsed = parseInt(value ?? "1", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

export function parseAdminStatus(
  raw?: string | string[]
): "all" | "pending" | "approved" | "rejected" {
  const value = (Array.isArray(raw) ? raw[0] : raw) ?? "pending";
  if (value === "approved" || value === "rejected" || value === "all") return value;
  return "pending";
}

export function buildPaginatedResult<T>(
  items: T[],
  total: number,
  page: number,
  pageSize = ADMIN_PAGE_SIZE
): PaginatedResult<T> {
  return {
    items,
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

export function adminPageRange(page: number, pageSize = ADMIN_PAGE_SIZE) {
  const from = (page - 1) * pageSize;
  return { from, to: from + pageSize - 1 };
}
