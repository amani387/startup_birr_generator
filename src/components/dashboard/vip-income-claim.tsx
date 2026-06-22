"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Crown, TrendingUp } from "lucide-react";
import { claimVipDailyIncome } from "@/lib/actions/vip";
import { celebrateReward } from "@/lib/confetti";
import { useFeedback } from "@/components/providers/feedback-provider";
import { Button } from "@/components/ui/button";
import { applyActionResult, getErrorMessage } from "@/lib/feedback";
import { formatBirr } from "@/lib/utils";

type VipIncomeClaimProps = {
  planName: string;
  dailyIncome: number;
  boostedDailyIncome?: number;
  vipLevel?: number;
  forexInterestRate?: number;
  daysClaimed: number;
  durationDays: number;
  expiresAt: string;
  canClaim: boolean;
};

export function VipIncomeClaim({
  planName,
  dailyIncome,
  boostedDailyIncome,
  vipLevel = 0,
  forexInterestRate = 1.15,
  daysClaimed,
  durationDays,
  expiresAt,
  canClaim,
}: VipIncomeClaimProps) {
  const router = useRouter();
  const { showError, showSuccess } = useFeedback();
  const [pending, startTransition] = useTransition();

  const claimAmount = boostedDailyIncome ?? dailyIncome;
  const hasBoost = vipLevel > 0 && claimAmount > dailyIncome;

  function handleClaim() {
    startTransition(async () => {
      try {
        const result = await claimVipDailyIncome();
        const ok = applyActionResult(result, {
          onError: showError,
          onSuccess: showSuccess,
        });
        if (ok && result.success) {
          celebrateReward();
          router.refresh();
        }
      } catch (err) {
        showError(getErrorMessage(err));
      }
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
          {hasBoost ? (
            <>
              <span className="line-through opacity-60">{formatBirr(dailyIncome)}</span>{" "}
              <span className="font-semibold text-amber-700">
                {formatBirr(claimAmount)}/day
              </span>
            </>
          ) : (
            <>{formatBirr(dailyIncome)}/day</>
          )}{" "}
          · Day {daysClaimed}/{durationDays}
        </p>
        {hasBoost && (
          <p className="mt-1 flex items-center gap-1 text-xs font-medium text-amber-700">
            <TrendingUp className="h-3.5 w-3.5" />
            Forex boost: base × {forexInterestRate} + VIP {vipLevel}
          </p>
        )}
        <p className="mt-1 text-xs text-muted">
          Expires{" "}
          {new Date(expiresAt).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
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
              ? `Claim ${formatBirr(claimAmount)}`
              : "Claimed today"}
      </Button>
    </div>
  );
}
