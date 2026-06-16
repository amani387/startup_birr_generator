"use client";

import type { ActionResult } from "@/types/database";
import { useActionResultFeedback } from "@/lib/hooks/use-action-result-feedback";

/**
 * Displays server action feedback as responsive toast popups.
 * Keeps a screen-reader-only summary for accessibility.
 */
export function FormMessage({ result }: { result?: ActionResult }) {
  useActionResultFeedback(result);

  if (!result?.error && !result?.success) return null;

  return (
    <p className="sr-only" role="status" aria-live="polite">
      {result.error ?? result.success}
    </p>
  );
}
