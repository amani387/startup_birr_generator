"use client";

import { ErrorFallback } from "@/components/ui/error-fallback";

type AdminErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function AdminError({ error, reset }: AdminErrorProps) {
  return (
    <ErrorFallback
      error={error}
      reset={reset}
      title="Admin panel error"
      homeHref="/admin"
      homeLabel="Back to admin"
    />
  );
}
