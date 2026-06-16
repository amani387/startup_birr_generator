"use client";

import { useState, useTransition } from "react";
import { triggerDailyVipIncome } from "@/lib/actions/admin";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function TriggerVipIncomeButton() {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  return (
    <Card>
      <h3 className="font-bold">Daily VIP Income</h3>
      <p className="mt-2 text-sm text-muted">
        Manually pay daily income to all active VIP members. Run once per day.
      </p>
      {message && (
        <p
          className={`mt-3 text-sm ${message.includes("paid") || message.includes("No active") ? "text-green-400" : "text-red-400"}`}
        >
          {message}
        </p>
      )}
      <Button
        className="mt-4"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            const result = await triggerDailyVipIncome();
            setMessage(result.success ?? result.error ?? null);
          })
        }
      >
        {pending ? "Processing..." : "Pay Daily VIP Income"}
      </Button>
    </Card>
  );
}
