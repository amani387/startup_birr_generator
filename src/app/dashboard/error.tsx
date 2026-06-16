"use client";

import { ErrorFallback } from "@/components/ui/error-fallback";

type DashboardErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function DashboardError({ error, reset }: DashboardErrorProps) {
  return (
    <ErrorFallback
      error={error}
      reset={reset}
      title="Dashboard error"
      homeHref="/dashboard"
      homeLabel="Back to dashboard"
    />
  );
}
