import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type AdminScrollListProps = {
  children: ReactNode;
  className?: string;
};

/** Keeps long admin lists inside the viewport without breaking the page layout. */
export function AdminScrollList({ children, className }: AdminScrollListProps) {
  return (
    <div
      className={cn(
        "max-h-[min(70vh,720px)] overflow-y-auto overflow-x-auto overscroll-contain",
        className
      )}
    >
      {children}
    </div>
  );
}
