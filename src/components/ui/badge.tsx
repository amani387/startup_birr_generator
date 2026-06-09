import { cn } from "@/lib/utils";

const styles = {
  approved: "bg-green-500/10 text-green-400",
  pending: "bg-primary/10 text-primary",
  rejected: "bg-red-500/10 text-red-400",
  success: "bg-green-500/10 text-green-400",
  active: "bg-primary/10 text-primary",
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
