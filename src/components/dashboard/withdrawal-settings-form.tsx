"use client";

import { useActionState } from "react";
import { Shield } from "lucide-react";
import { saveWithdrawalSettings } from "@/lib/actions/profile";
import { FormMessage } from "@/components/auth/form-message";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { WithdrawalSettings } from "@/types/database";

type WithdrawalSettingsFormProps = {
  settings: WithdrawalSettings | null;
};

export function WithdrawalSettingsForm({ settings }: WithdrawalSettingsFormProps) {
  const [state, action, pending] = useActionState(saveWithdrawalSettings, {});

  return (
    <Card>
      <h3 className="mb-4 font-bold">Payment Details</h3>
      <form action={action} className="space-y-4">
        <FormMessage result={state} />
        <Input
          label="Payment Method"
          name="payment_method"
          placeholder="Choose your bank or wallet"
          defaultValue={settings?.payment_method}
          required
        />
        <Input
          label="Account Holder Name"
          name="account_holder"
          placeholder="e.g. Abebe Kebede"
          defaultValue={settings?.account_holder}
          required
        />
        <Input
          label="Account Number / Wallet Number"
          name="account_number"
          placeholder="e.g. 0911234567"
          defaultValue={settings?.account_number}
          hint="Admin will send your funds to this account when a withdrawal is approved"
          required
        />
        <Button type="submit" disabled={pending}>
          {pending ? "Saving..." : "Save Settings"}
        </Button>
      </form>
    </Card>
  );
}

export function WithdrawalPrivacyNotice() {
  return (
    <Card className="border-blue-500/20 bg-blue-500/5">
      <div className="flex gap-3">
        <Shield className="h-5 w-5 shrink-0 text-blue-400" />
        <p className="text-sm text-muted">
          Your details are private. Only you and the admin processing your
          withdrawal can see these details.
        </p>
      </div>
    </Card>
  );
}
