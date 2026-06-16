"use client";

import { ErrorFallback } from "@/components/ui/error-fallback";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <ErrorFallback
      error={error}
      reset={reset}
      title="Page error"
      homeHref="/"
      homeLabel="Go home"
    />
  );
}
