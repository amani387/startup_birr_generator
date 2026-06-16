"use client";

import Link from "next/link";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getErrorMessage } from "@/lib/feedback";

type ErrorFallbackProps = {
  error: Error & { digest?: string };
  reset: () => void;
  title?: string;
  homeHref?: string;
  homeLabel?: string;
};

export function ErrorFallback({
  error,
  reset,
  title = "Something went wrong",
  homeHref = "/dashboard",
  homeLabel = "Go to dashboard",
}: ErrorFallbackProps) {
  const message = getErrorMessage(error, "An unexpected error occurred.");

  return (
    <div className="flex min-h-[50dvh] items-center justify-center p-4 sm:p-6">
      <Card padding="lg" className="w-full max-w-md text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10">
          <AlertTriangle className="h-7 w-7 text-red-500" aria-hidden />
        </div>
        <h1 className="mt-5 font-display text-xl font-bold">{title}</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">{message}</p>
        {error.digest && (
          <p className="mt-2 text-xs text-muted/70">Ref: {error.digest}</p>
        )}
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button onClick={reset} className="w-full sm:w-auto">
            <RefreshCw className="h-4 w-4" />
            Try again
          </Button>
          <Link href={homeHref} className="w-full sm:w-auto">
            <Button variant="outline" className="w-full">
              {homeLabel}
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
