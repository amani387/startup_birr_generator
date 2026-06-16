"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { FeedbackToastStack } from "@/components/ui/feedback-toast";
import type { ActionResult } from "@/types/database";

export type FeedbackType = "success" | "error" | "info";

export type FeedbackItem = {
  id: string;
  type: FeedbackType;
  title: string;
  message?: string;
};

type FeedbackContextValue = {
  showSuccess: (message: string, title?: string) => void;
  showError: (message: string, title?: string) => void;
  showInfo: (message: string, title?: string) => void;
  showActionResult: (result: ActionResult) => void;
  dismiss: (id: string) => void;
};

const FeedbackContext = createContext<FeedbackContextValue | null>(null);

const AUTO_DISMISS_MS: Record<FeedbackType, number> = {
  success: 4500,
  error: 7000,
  info: 5000,
};

export function FeedbackProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<FeedbackItem[]>([]);
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = useCallback((id: string) => {
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const push = useCallback(
    (type: FeedbackType, message: string, title?: string) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      const item: FeedbackItem = {
        id,
        type,
        title: title ?? (type === "error" ? "Error" : type === "success" ? "Success" : "Notice"),
        message,
      };

      setItems((prev) => [...prev.slice(-4), item]);

      const timer = setTimeout(() => dismiss(id), AUTO_DISMISS_MS[type]);
      timersRef.current.set(id, timer);
    },
    [dismiss]
  );

  const showSuccess = useCallback(
    (message: string, title?: string) => push("success", message, title),
    [push]
  );

  const showError = useCallback(
    (message: string, title?: string) => push("error", message, title),
    [push]
  );

  const showInfo = useCallback(
    (message: string, title?: string) => push("info", message, title),
    [push]
  );

  const showActionResult = useCallback(
    (result: ActionResult) => {
      if (result.error) showError(result.error);
      else if (result.success) showSuccess(result.success);
    },
    [showError, showSuccess]
  );

  const value = useMemo(
    () => ({ showSuccess, showError, showInfo, showActionResult, dismiss }),
    [showSuccess, showError, showInfo, showActionResult, dismiss]
  );

  return (
    <FeedbackContext.Provider value={value}>
      {children}
      <FeedbackToastStack items={items} onDismiss={dismiss} />
    </FeedbackContext.Provider>
  );
}

export function useFeedback(): FeedbackContextValue {
  const ctx = useContext(FeedbackContext);
  if (!ctx) {
    throw new Error("useFeedback must be used within FeedbackProvider");
  }
  return ctx;
}
