"use client";

import { useEffect, useRef } from "react";
import { useFeedback } from "@/components/providers/feedback-provider";
import type { ActionResult } from "@/types/database";

/** Show toast popups when a server action returns success or error. */
export function useActionResultFeedback(result?: ActionResult) {
  const { showActionResult } = useFeedback();
  const lastKey = useRef<string | null>(null);

  useEffect(() => {
    if (!result?.error && !result?.success) return;
    const key = `${result.error ?? ""}|${result.success ?? ""}`;
    if (lastKey.current === key) return;
    lastKey.current = key;
    showActionResult(result);
  }, [result, showActionResult]);
}
