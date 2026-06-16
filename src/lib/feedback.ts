import type { ActionResult } from "@/types/database";

/** Turn unknown errors into a safe user-facing string. */
export function getErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again."
): string {
  if (typeof error === "string" && error.trim()) return error.trim();
  if (error instanceof Error && error.message.trim()) return error.message;
  return fallback;
}

export function applyActionResult(
  result: ActionResult,
  handlers: {
    onError: (message: string) => void;
    onSuccess: (message: string) => void;
  }
): boolean {
  if (result.error) {
    handlers.onError(result.error);
    return false;
  }
  if (result.success) {
    handlers.onSuccess(result.success);
    return true;
  }
  return true;
}
