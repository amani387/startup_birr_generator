import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type StatCardProps = {
  title: string;
  value: string;
  icon: LucideIcon;
  highlight?: boolean;
};

export function StatCard({ title, value, icon: Icon, highlight }: StatCardProps) {
  return (
    <Card
      padding="sm"
      className={cn(highlight && "accent-glow border-primary/25")}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted sm:text-xs">
            {title}
          </p>
          <p
            className={cn(
              "mt-2 truncate text-xl font-bold tracking-tight sm:text-2xl",
              highlight ? "text-primary" : "text-foreground"
            )}
          >
            {value}
          </p>
        </div>
        <div className="shrink-0 rounded-xl bg-primary-dim p-2.5 sm:p-3">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </div>
    </Card>
  );
}
