import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const variants = {
  default:
    "bg-primary text-[#14120f] shadow-[var(--shadow)] hover:brightness-105 active:scale-[0.98] dark:text-[#14120f]",
  outline:
    "border border-primary/35 bg-transparent text-primary hover:bg-primary-dim active:scale-[0.98]",
  ghost:
    "bg-transparent text-foreground hover:bg-foreground/5 active:scale-[0.98]",
  danger: "bg-red-600 text-white hover:bg-red-500 active:scale-[0.98]",
} as const;

const sizes = {
  sm: "px-3.5 py-2 text-sm rounded-xl",
  md: "px-5 py-3 text-sm rounded-xl",
  lg: "px-6 py-3.5 text-base rounded-2xl",
} as const;

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  children: ReactNode;
};

export function Button({
  variant = "default",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
