import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type CardProps = {
  children: ReactNode;
  className?: string;
  glow?: boolean;
  padding?: "sm" | "md" | "lg";
};

const paddingMap = {
  sm: "p-4 sm:p-5",
  md: "p-5 sm:p-6",
  lg: "p-6 sm:p-8",
};

export function Card({
  children,
  className,
  glow,
  padding = "md",
}: CardProps) {
  return (
    <div
      className={cn(
        "glass-card",
        paddingMap[padding],
        glow && "accent-glow border-primary/25",
        className
      )}
    >
      {children}
    </div>
  );
}
