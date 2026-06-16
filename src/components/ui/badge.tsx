import { cn } from "@/lib/utils";

const styles = {
  approved: "bg-green-500/10 text-green-400 ring-1 ring-green-500/20",
  completed: "bg-green-500/10 text-green-400 ring-1 ring-green-500/20",
  pending: "bg-amber-500/10 text-amber-300 ring-1 ring-amber-500/20",
  processing: "bg-amber-500/10 text-amber-300 ring-1 ring-amber-500/20",
  rejected: "bg-red-500/10 text-red-400 ring-1 ring-red-500/20",
  success: "bg-green-500/10 text-green-400 ring-1 ring-green-500/20",
  active: "bg-primary/10 text-primary ring-1 ring-primary/25",
} as const;

type BadgeProps = {
  status: keyof typeof styles;
  children: React.ReactNode;
  className?: string;
};

export function Badge({ status, children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide",
        styles[status],
        className
      )}
    >
      {children}
    </span>
  );
}
