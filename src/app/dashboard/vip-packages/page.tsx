import Link from "next/link";
import { Crown } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { VipBuyButton } from "@/components/dashboard/vip-buy-button";
import { VipIncomeClaim } from "@/components/dashboard/vip-income-claim";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getReferralRewardForLevel } from "@/lib/constants";
import { canClaimVipIncome, requireProfile } from "@/lib/data/profile";
import { getActiveVipPurchase, getVipPlans } from "@/lib/data/queries";
import { formatBirr } from "@/lib/utils";

export default async function VipPackagesPage() {
  const profile = await requireProfile();
  const [plans, activePurchase] = await Promise.all([
    getVipPlans(),
    getActiveVipPurchase(profile.id),
  ]);

  const durationDays = activePurchase?.vip_plans?.duration_days ?? 7;

  return (
    <div className="space-y-6">
      <PageHeader
        title="VIP Packages"
        description="Choose a VIP package to start earning daily income."
      />

      {activePurchase && (
        <Card glow className="border-primary/20">
          <VipIncomeClaim
            planName={activePurchase.vip_plans?.name ?? "VIP"}
            dailyIncome={activePurchase.daily_income}
            daysClaimed={activePurchase.days_claimed}
            durationDays={durationDays}
            expiresAt={activePurchase.expires_at}
            canClaim={canClaimVipIncome(activePurchase, durationDays)}
          />
        </Card>
      )}

      <Card>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">
              Your Available Balance
            </p>
            <p className="text-2xl font-bold text-primary">
              {formatBirr(profile.balance)}
            </p>
            <p className="mt-1 text-xs text-muted">
              Deposits approved + task rewards + referral bonuses
            </p>
          </div>
          <Link href="/dashboard/deposits">
            <Button variant="outline">Go to Deposits</Button>
          </Link>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {plans.map((plan) => {
          const canAfford = profile.balance >= plan.price;
          const shortfall = plan.price - profile.balance;
          const isCurrent = profile.vip_level === plan.level;
          const referralReward = getReferralRewardForLevel(plan.level);

          return (
            <Card
              key={plan.id}
              className={`flex flex-col ${isCurrent ? "accent-glow border-primary/30" : ""}`}
            >
              <span className="mb-3 inline-flex w-fit items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                <Crown className="h-3 w-3" />
                {plan.name}
              </span>
              <h3 className="text-xl font-bold">{plan.name}</h3>
              <p className="mt-1 text-sm text-muted">
                Earn {plan.daily_income} Birr daily for {plan.duration_days} days
              </p>
              <p className="mt-4 text-3xl font-bold">{formatBirr(plan.price)}</p>
              <ul className="mt-4 space-y-2 text-sm text-muted">
                <li>{plan.daily_income} Birr daily earnings</li>
                <li>{plan.duration_days} days earning period</li>
                <li>Total return: {formatBirr(plan.total_return)}</li>
                <li className="text-primary">
                  Referral reward: {formatBirr(referralReward)} (15%)
                </li>
              </ul>
              {!canAfford && !isCurrent && (
                <p className="mt-4 rounded-lg bg-primary/10 px-3 py-2 text-xs text-primary">
                  Need {formatBirr(shortfall)} more Birr
                </p>
              )}
              {isCurrent && (
                <p className="mt-4 rounded-lg bg-green-500/10 px-3 py-2 text-xs text-green-500">
                  Active Membership
                </p>
              )}
              <VipBuyButton
                planId={plan.id}
                planName={plan.name}
                disabled={!canAfford}
                isCurrent={isCurrent}
              />
            </Card>
          );
        })}
      </div>
    </div>
  );
}
