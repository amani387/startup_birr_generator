import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type CardScrollAreaProps = {
  children: ReactNode;
  className?: string;
};

/** Scrollable list region inside dashboard cards — keeps long data inside the card. */
export function CardScrollArea({ children, className }: CardScrollAreaProps) {
  return (
    <div
      className={cn(
        "max-h-[min(60vh,520px)] overflow-y-auto overflow-x-auto overscroll-contain",
        className
      )}
    >
      {children}
    </div>
  );
}
