"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { reviewDeposit, reviewWithdrawal } from "@/lib/actions/admin";
import { useFeedback } from "@/components/providers/feedback-provider";
import { Button } from "@/components/ui/button";
import { applyActionResult, getErrorMessage } from "@/lib/feedback";

type ReviewActionsProps = {
  id: string;
  type: "deposit" | "withdrawal";
};

export function ReviewActions({ id, type }: ReviewActionsProps) {
  const router = useRouter();
  const { showError, showSuccess } = useFeedback();
  const [pending, startTransition] = useTransition();

  function handle(action: "approved" | "rejected") {
    startTransition(async () => {
      try {
        const result =
          type === "deposit"
            ? await reviewDeposit(id, action)
            : await reviewWithdrawal(id, action);

        applyActionResult(result, { onError: showError, onSuccess: showSuccess });
        if (!result.error) router.refresh();
      } catch (err) {
        showError(getErrorMessage(err));
      }
    });
  }

  return (
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
  );
}
