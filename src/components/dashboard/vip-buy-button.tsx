"use client";

import { useState, useTransition } from "react";
import { purchaseVipPlan } from "@/lib/actions/vip";
import { Button } from "@/components/ui/button";

type VipBuyButtonProps = {
  planId: string;
  planName: string;
  disabled?: boolean;
  isCurrent?: boolean;
};

export function VipBuyButton({
  planId,
  planName,
  disabled,
  isCurrent,
}: VipBuyButtonProps) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  if (isCurrent) {
    return (
      <Button variant="outline" className="mt-auto w-full pt-4" disabled>
        Current Plan
      </Button>
    );
  }

  return (
    <div className="mt-auto w-full pt-4">
      {message && (
        <p
          className={`mb-2 text-xs ${message.includes("success") || message.includes("purchased") ? "text-green-500" : "text-red-400"}`}
        >
          {message}
        </p>
      )}
      <Button
        variant={disabled ? "outline" : "default"}
        className="w-full"
        disabled={disabled || pending}
        onClick={() =>
          startTransition(async () => {
            const result = await purchaseVipPlan(planId);
            setMessage(result.success ?? result.error ?? null);
          })
        }
      >
        {pending ? "Processing..." : disabled ? "Insufficient Balance" : `Buy ${planName}`}
      </Button>
    </div>
  );
}
