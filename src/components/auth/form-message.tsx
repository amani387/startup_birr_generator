"use client";

import type { ActionResult } from "@/types/database";
import { cn } from "@/lib/utils";

export function FormMessage({ result }: { result?: ActionResult }) {
  if (!result?.error && !result?.success) return null;

  return (
    <div
      className={cn(
        "rounded-lg px-4 py-3 text-sm",
        result.error
          ? "border border-red-500/30 bg-red-500/10 text-red-400"
          : "border border-green-500/30 bg-green-500/10 text-green-400"
      )}
    >
      {result.error ?? result.success}
    </div>
  );
}
