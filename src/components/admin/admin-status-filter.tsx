import Link from "next/link";
import { cn } from "@/lib/utils";

const STATUSES = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "all", label: "All" },
] as const;

type AdminStatusFilterProps = {
  basePath: string;
  current: string;
  counts?: Partial<Record<string, number>>;
};

export function AdminStatusFilter({
  basePath,
  current,
  counts,
}: AdminStatusFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {STATUSES.map((status) => {
        const active = current === status.value;
        const href =
          status.value === "pending"
            ? basePath
            : `${basePath}?status=${status.value}`;
        const count = counts?.[status.value];

        return (
          <Link
            key={status.value}
            href={href}
            className={cn(
              "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
              active
                ? "bg-primary text-white"
                : "border border-border text-muted hover:text-foreground"
            )}
          >
            {status.label}
            {count !== undefined ? ` (${count})` : ""}
          </Link>
        );
      })}
    </div>
  );
}
