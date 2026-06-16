"use client";

import { useActionState } from "react";
import { submitWithdrawal } from "@/lib/actions/withdrawals";
import { FormMessage } from "@/components/auth/form-message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { WithdrawalSettings } from "@/types/database";

type WithdrawalFormProps = {
  unlocked: boolean;
  maxWithdrawal: number;
  minAmount: number;
  retentionPercent: number;
  settings: WithdrawalSettings | null;
};

export function WithdrawalForm({
  unlocked,
  maxWithdrawal,
  minAmount,
  retentionPercent,
  settings,
}: WithdrawalFormProps) {
  const [state, action, pending] = useActionState(submitWithdrawal, {});

  return (
    <form action={action} className="space-y-4">
      <FormMessage result={state} />
      <Input
        label="Amount (Birr)"
        name="amount"
        type="number"
        min={minAmount}
        max={maxWithdrawal}
        step="0.01"
        placeholder={`Min ${minAmount} Birr`}
        hint={`Max withdrawal: ${maxWithdrawal.toLocaleString()} Birr — ${retentionPercent}% retention required`}
        required
        disabled={!unlocked}
      />
      <Input
        label="Payment Method"
        name="payment_method"
        placeholder="Telebirr, CBE, etc."
        defaultValue={settings?.payment_method}
        required
        disabled={!unlocked}
      />
      <Input
        label="Account Holder Name"
        name="account_holder"
        placeholder="Abebe Kebede"
        defaultValue={settings?.account_holder}
        required
        disabled={!unlocked}
      />
      <Input
        label="Account Number / Wallet Number"
        name="account_number"
        placeholder="0911234567"
        defaultValue={settings?.account_number}
        hint="Admin will send funds to this account upon approval"
        required
        disabled={!unlocked}
      />
      <Button type="submit" disabled={!unlocked || pending}>
        {pending ? "Submitting..." : "Submit Withdrawal Request"}
      </Button>
    </form>
  );
}
