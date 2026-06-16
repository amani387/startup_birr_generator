"use client";

import { useState, useTransition } from "react";
import { Crown } from "lucide-react";
import { claimVipDailyIncome } from "@/lib/actions/vip";
import { Button } from "@/components/ui/button";
import { cn, formatBirr } from "@/lib/utils";

type VipIncomeClaimProps = {
  planName: string;
  dailyIncome: number;
  daysClaimed: number;
  durationDays: number;
  expiresAt: string;
  canClaim: boolean;
};

export function VipIncomeClaim({
  planName,
  dailyIncome,
  daysClaimed,
  durationDays,
  expiresAt,
  canClaim,
}: VipIncomeClaimProps) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  function handleClaim() {
    startTransition(async () => {
      const result = await claimVipDailyIncome();
      setMessage(result.error ?? result.success ?? null);
      setIsError(!!result.error);
    });
  }

  const progress = Math.min(100, Math.round((daysClaimed / durationDays) * 100));

  return (
    <div className="flex h-full flex-col justify-between gap-4">
      <div>
        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
          <Crown className="h-3 w-3" />
          Active
        </span>
        <h3 className="mt-3 font-display text-lg font-bold">{planName}</h3>
        <p className="mt-2 text-sm text-muted">
          {formatBirr(dailyIncome)}/day · Day {daysClaimed}/{durationDays}
        </p>
        <p className="text-xs text-muted">
          Expires {new Date(expiresAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
        </p>

        <div className="mt-4">
          <div className="mb-1.5 flex justify-between text-xs text-muted">
            <span>Earning progress</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-border">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {message && (
          <p
            className={cn(
              "mt-3 text-xs",
              isError ? "text-red-500" : "text-green-600 dark:text-green-400"
            )}
            role="alert"
          >
            {message}
          </p>
        )}
      </div>

      <Button
        size="lg"
        className="w-full"
        disabled={!canClaim || pending || daysClaimed >= durationDays}
        onClick={handleClaim}
      >
        {pending
          ? "Claiming..."
          : daysClaimed >= durationDays
            ? "Package complete"
            : canClaim
              ? `Claim ${formatBirr(dailyIncome)}`
              : "Claimed today"}
      </Button>
    </div>
  );
}
