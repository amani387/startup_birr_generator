"use client";

import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";
import type { FeedbackItem } from "@/components/providers/feedback-provider";
import { cn } from "@/lib/utils";

type FeedbackToastStackProps = {
  items: FeedbackItem[];
  onDismiss: (id: string) => void;
};

export function FeedbackToastStack({ items, onDismiss }: FeedbackToastStackProps) {
  if (items.length === 0) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[9999] flex flex-col items-center gap-2 p-3 sm:items-end sm:p-4"
      aria-live="polite"
      aria-relevant="additions"
    >
      {items.map((item) => (
        <FeedbackToast key={item.id} item={item} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

type FeedbackToastProps = {
  item: FeedbackItem;
  onDismiss: (id: string) => void;
};

function FeedbackToast({ item, onDismiss }: FeedbackToastProps) {
  const Icon =
    item.type === "success"
      ? CheckCircle2
      : item.type === "error"
        ? AlertCircle
        : Info;

  return (
    <div
      role="alert"
      className={cn(
        "pointer-events-auto flex w-full max-w-md animate-[slideDown_0.28s_ease-out] items-start gap-3 rounded-xl border px-4 py-3.5 shadow-lg backdrop-blur-md sm:w-[min(100%,22rem)]",
        item.type === "success" &&
          "border-green-500/35 bg-green-500/10 text-foreground dark:bg-green-950/80",
        item.type === "error" &&
          "border-red-500/35 bg-red-500/10 text-foreground dark:bg-red-950/85",
        item.type === "info" &&
          "border-primary/35 bg-surface-card/95 text-foreground"
      )}
    >
      <Icon
        className={cn(
          "mt-0.5 h-5 w-5 shrink-0",
          item.type === "success" && "text-green-600 dark:text-green-400",
          item.type === "error" && "text-red-600 dark:text-red-400",
          item.type === "info" && "text-primary"
        )}
        aria-hidden
      />
      <div className="min-w-0 flex-1 pr-1">
        <p className="text-sm font-semibold leading-snug">{item.title}</p>
        {item.message && (
          <p className="mt-1 text-sm leading-relaxed text-muted">{item.message}</p>
        )}
      </div>
      <button
        type="button"
        onClick={() => onDismiss(item.id)}
        className="shrink-0 rounded-lg p-1 text-muted transition-colors hover:bg-surface-bright hover:text-foreground"
        aria-label="Dismiss notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
