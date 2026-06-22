import Link from "next/link";
import { Crown } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { CardScrollArea } from "@/components/dashboard/card-scroll-area";
import { VipIncomeClaim } from "@/components/dashboard/vip-income-claim";
import { VipPackagesList } from "@/components/dashboard/vip-packages-list";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
        <Card className="border-primary/20">
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
            <Button>Go to Deposits</Button>
          </Link>
        </div>
      </Card>

      <Card padding="sm">
        <CardScrollArea>
          <VipPackagesList
            plans={plans}
            balance={profile.balance}
            currentVipLevel={profile.vip_level}
          />
        </CardScrollArea>
      </Card>
    </div>
  );
}
