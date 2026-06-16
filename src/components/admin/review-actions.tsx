"use client";

import { useTransition } from "react";
import { reviewDeposit, reviewWithdrawal } from "@/lib/actions/admin";
import { Button } from "@/components/ui/button";

type ReviewActionsProps = {
  id: string;
  type: "deposit" | "withdrawal";
};

export function ReviewActions({ id, type }: ReviewActionsProps) {
  const [pending, startTransition] = useTransition();

  function handle(action: "approved" | "rejected") {
    startTransition(async () => {
      if (type === "deposit") await reviewDeposit(id, action);
      else await reviewWithdrawal(id, action);
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
