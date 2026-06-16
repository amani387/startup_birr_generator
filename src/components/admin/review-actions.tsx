"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { reviewDeposit, reviewWithdrawal } from "@/lib/actions/admin";
import { Button } from "@/components/ui/button";

type ReviewActionsProps = {
  id: string;
  type: "deposit" | "withdrawal";
};

export function ReviewActions({ id, type }: ReviewActionsProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  function handle(action: "approved" | "rejected") {
    startTransition(async () => {
      const result =
        type === "deposit"
          ? await reviewDeposit(id, action)
          : await reviewWithdrawal(id, action);

      if (result.error) {
        setMessage(result.error);
        setIsError(true);
      } else {
        setMessage(result.success ?? "Updated.");
        setIsError(false);
        router.refresh();
      }
    });
  }

  return (
    <div className="flex flex-col items-end gap-2">
      {message && (
        <p
          className={`max-w-xs text-right text-xs ${isError ? "text-red-500" : "text-green-500"}`}
        >
          {message}
        </p>
      )}
      <div className="flex gap-2">
        <Button size="sm" disabled={pending} onClick={() => handle("approved")}>
          Approve
        </Button>
        <Button
          size="sm"
          variant="outline"
          disabled={pending}
          onClick={() => handle("rejected")}
        >
          Reject
        </Button>
      </div>
    </div>
  );
}
