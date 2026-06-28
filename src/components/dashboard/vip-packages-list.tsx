"use client";

import { Crown } from "lucide-react";
import { VipBuyButton } from "@/components/dashboard/vip-buy-button";
import { getReferralRewardForLevel } from "@/lib/constants";
import type { VipPlan } from "@/types/database";
import { formatBirr } from "@/lib/utils";

type VipPackagesListProps = {
  plans: VipPlan[];
  balance: number;
  currentVipLevel: number;
};

export function VipPackagesList({
  plans,
  balance,
  currentVipLevel,
}: VipPackagesListProps) {
  return (
    <div className="space-y-3">
      {plans.map((plan) => {
        const canAfford = balance >= plan.price;
        const isCurrent = currentVipLevel === plan.level;
        const referralReward = getReferralRewardForLevel(plan.level);

        return (
          <div
            key={plan.id}
            className={`vip-list-row ${isCurrent ? "border-primary/40 bg-primary/5" : ""}`}
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Crown className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-bold text-foreground">{plan.name}</p>
                <p className="text-xs text-muted">
                  {formatBirr(plan.price)} · {formatBirr(plan.daily_income)}/day
                  · Referral {formatBirr(referralReward)} (15%)
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 sm:gap-8">
              <div className="min-w-[100px]">
                <p className="text-xs text-muted">Package price</p>
                <p className="font-bold text-primary">{formatBirr(plan.price)}</p>
              </div>
              <div className="min-w-[100px]">
                <p className="text-xs text-muted">Daily earning</p>
                <p className="font-bold text-foreground">
                  {formatBirr(plan.daily_income)}
                </p>
              </div>
              <div className="w-full sm:w-auto sm:min-w-[120px]">
                <VipBuyButton
                  planId={plan.id}
                  planName={plan.name}
                  disabled={!canAfford}
                  isCurrent={isCurrent}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
