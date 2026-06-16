import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type StatCardProps = {
  title: string;
  value: string;
  icon: LucideIcon;
  highlight?: boolean;
  className?: string;
};

export function StatCard({
  title,
  value,
  icon: Icon,
  highlight,
  className,
}: StatCardProps) {
  return (
    <Card
      padding="sm"
      className={cn(
        "transition-transform duration-200 hover:scale-[1.01]",
        highlight && "accent-glow border-primary/25 gold-glow-sm",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted sm:text-xs">
            {title}
          </p>
          <p
            className={cn(
              "mt-2 truncate font-display text-xl font-bold tracking-tight sm:text-2xl",
              highlight ? "text-primary" : "text-foreground"
            )}
          >
            {value}
          </p>
        </div>
        <div
          className={cn(
            "shrink-0 rounded-xl p-2.5 sm:p-3",
            highlight ? "bg-primary/15 gold-glow-sm" : "bg-primary-dim"
          )}
        >
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </div>
    </Card>
  );
}
