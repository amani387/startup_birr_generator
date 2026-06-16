"use client";

import { useActionState, useEffect, useState } from "react";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  ChevronRight,
  Copy,
  CreditCard,
  User,
} from "lucide-react";
import { submitDeposit } from "@/lib/actions/deposits";
import { FormMessage } from "@/components/auth/form-message";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DEPOSIT_PAYMENT_METHODS, type DepositPaymentMethod } from "@/lib/constants";
import { cn } from "@/lib/utils";

type DepositFlowProps = {
  onMethodChange?: (method: DepositPaymentMethod | null) => void;
};

export function DepositFlow({ onMethodChange }: DepositFlowProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const selectedMethod =
    DEPOSIT_PAYMENT_METHODS.find((method) => method.id === selectedId) ?? null;

  function selectMethod(id: string) {
    const method = DEPOSIT_PAYMENT_METHODS.find((m) => m.id === id) ?? null;
    setSelectedId(id);
    setShowForm(false);
    onMethodChange?.(method);
  }

  function goBack() {
    if (showForm) {
      setShowForm(false);
      return;
    }
    setSelectedId(null);
    onMethodChange?.(null);
  }

  if (showForm && selectedMethod) {
    return (
      <DepositSubmitForm
        method={selectedMethod}
        onBack={goBack}
        onSuccess={() => {
          setShowForm(false);
          setSelectedId(null);
          onMethodChange?.(null);
        }}
      />
    );
  }

  if (selectedMethod) {
    return (
      <DepositMethodDetails
        method={selectedMethod}
        onBack={goBack}
        onConfirm={() => setShowForm(true)}
      />
    );
  }

  return (
    <div className="space-y-3">
      {DEPOSIT_PAYMENT_METHODS.map((method) => (
        <button
          key={method.id}
          type="button"
          onClick={() => selectMethod(method.id)}
          className="glass-card flex w-full items-center justify-between p-4 text-left transition-colors hover:border-primary/30 active:scale-[0.99]"
        >
          <div className="flex min-w-0 items-center gap-4">
            <div className="shrink-0 rounded-lg bg-primary/10 p-3">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold">{method.name}</p>
              <p className="truncate text-sm text-muted">{method.accountNumber}</p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 shrink-0 text-muted" />
        </button>
      ))}
    </div>
  );
}

type DepositMethodDetailsProps = {
  method: DepositPaymentMethod;
  onBack: () => void;
  onConfirm: () => void;
};

function DepositMethodDetails({
  method,
  onBack,
  onConfirm,
}: DepositMethodDetailsProps) {
  const [copied, setCopied] = useState(false);

  async function copyAccountNumber() {
    if (method.accountNumber.startsWith("Contact") || method.accountNumber.startsWith("Via")) {
      return;
    }
    await navigator.clipboard.writeText(method.accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const canCopy =
    !method.accountNumber.startsWith("Contact") &&
    !method.accountNumber.startsWith("Via");

  return (
    <div className="space-y-5">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to payment methods
      </button>

      <div>
        <h3 className="font-display text-xl font-bold">{method.name}</h3>
        <p className="mt-1 text-sm text-muted">Send your deposit to this account</p>
      </div>

      <Card className="border-primary/15 bg-primary/[0.04]">
        <p className="mb-4 text-[11px] font-semibold uppercase tracking-wider text-primary">
          Deposit account details
        </p>
        <div className="space-y-4">
          <DetailRow
            icon={Building2}
            label="Bank Name"
            value={method.bankName}
          />
          <DetailRow
            icon={CreditCard}
            label="Account Number"
            value={method.accountNumber}
            action={
              canCopy ? (
                <button
                  type="button"
                  onClick={copyAccountNumber}
                  className="flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
                >
                  <Copy className="h-3.5 w-3.5" />
                  {copied ? "Copied!" : "Copy"}
                </button>
              ) : null
            }
          />
          <DetailRow icon={User} label="Account Holder" value={method.accountHolder} />
        </div>
      </Card>

      <Card className="border-blue-500/20 bg-blue-500/5">
        <h4 className="mb-3 font-semibold text-blue-300">Instructions</h4>
        <ol className="space-y-2.5">
          {method.instructions.map((step, index) => (
            <li key={step} className="flex gap-3 text-sm text-muted">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-500/15 text-xs font-bold text-blue-300">
                {index + 1}
              </span>
              <span className="pt-0.5 leading-relaxed">{step}</span>
            </li>
          ))}
        </ol>
      </Card>

      <Button size="lg" className="w-full" onClick={onConfirm}>
        <CheckCircle2 className="h-4 w-4" />
        I&apos;ve Sent the Money
      </Button>
    </div>
  );
}

type DetailRowProps = {
  icon: typeof Building2;
  label: string;
  value: string;
  action?: React.ReactNode;
};

function DetailRow({ icon: Icon, label, value, action }: DetailRowProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-bright">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted">{label}</p>
        <div className="mt-0.5 flex flex-wrap items-center gap-2">
          <p className="font-semibold break-all">{value}</p>
          {action}
        </div>
      </div>
    </div>
  );
}

type DepositSubmitFormProps = {
  method: DepositPaymentMethod;
  onBack: () => void;
  onSuccess: () => void;
};

function DepositSubmitForm({ method, onBack, onSuccess }: DepositSubmitFormProps) {
  const [state, action, pending] = useActionState(submitDeposit, {});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (state.success) setSubmitted(true);
  }, [state.success]);

  if (submitted && state.success) {
    return (
      <div className="space-y-5">
        <Card className="border-green-500/20 bg-green-500/5 text-center">
          <CheckCircle2 className="mx-auto h-10 w-10 text-green-400" />
          <p className="mt-3 font-semibold text-green-400">{state.success}</p>
          <p className="mt-1 text-sm text-muted">
            Your deposit will appear in history once reviewed.
          </p>
          <Button className="mt-5 w-full" onClick={onSuccess}>
            Done
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to account details
      </button>

      <div>
        <h3 className="font-display text-xl font-bold">Confirm your deposit</h3>
        <p className="mt-1 text-sm text-muted">
          Submit proof of payment for {method.name}
        </p>
      </div>

      <Card>
        <form action={action} className="space-y-4">
          <FormMessage result={state.error ? { error: state.error } : undefined} />
          <input type="hidden" name="payment_method" value={method.name} />
          <Input
            label="Amount (Birr)"
            name="amount"
            type="number"
            min="1"
            step="0.01"
            placeholder="e.g. 500"
            required
          />
          <Input
            label="Transaction reference (optional)"
            name="transaction_ref"
            placeholder="e.g. FT123456789"
          />
          <div className="space-y-2">
            <label
              htmlFor="screenshot"
              className="block text-sm font-medium text-foreground"
            >
              Payment screenshot
            </label>
            <input
              id="screenshot"
              name="screenshot"
              type="file"
              accept="image/*"
              className={cn(
                "min-h-12 w-full rounded-xl border border-border bg-surface-bright px-4 py-3 text-sm text-foreground file:mr-3 file:rounded-lg file:border-0 file:bg-primary/15 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-primary"
              )}
            />
            <p className="text-xs text-muted">
              Upload a screenshot of your payment confirmation
            </p>
          </div>
          <Button type="submit" size="lg" className="w-full" disabled={pending}>
            {pending ? "Submitting..." : "Submit deposit"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
