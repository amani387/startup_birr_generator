"use client";

import { useState, useTransition } from "react";
import { purchaseVipPlan } from "@/lib/actions/vip";
import { useFeedback } from "@/components/providers/feedback-provider";
import { Button } from "@/components/ui/button";
import { applyActionResult, getErrorMessage } from "@/lib/feedback";

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
  const { showError, showSuccess } = useFeedback();
  const [pending, startTransition] = useTransition();

  if (isCurrent) {
    return (
      <Button variant="outline" className="mt-auto w-full pt-4" disabled>
        Current Plan
      </Button>
    );
  }

  return (
    <Button
      variant={disabled ? "outline" : "default"}
      className="mt-auto w-full pt-4"
      disabled={disabled || pending}
      onClick={() =>
        startTransition(async () => {
          try {
            const result = await purchaseVipPlan(planId);
            applyActionResult(result, { onError: showError, onSuccess: showSuccess });
          } catch (err) {
            showError(getErrorMessage(err));
          }
        })
      }
    >
      {pending ? "Processing..." : disabled ? "Insufficient Balance" : `Buy ${planName}`}
    </Button>
  );
}
