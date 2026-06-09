import Link from "next/link";
import { Crown, Shield } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatBirr } from "@/lib/utils";

export default function VipUpgradesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="VIP Upgrades"
        description="Purchase a VIP package to start earning daily income."
      />

      <Card>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted">Your Current Plan</p>
              <p className="text-xl font-bold">No active plan</p>
            </div>
          </div>
          <p className="text-sm">
            Balance: <span className="font-bold text-primary">{formatBirr(0)}</span>
          </p>
        </div>
      </Card>

      <Card className="flex flex-col items-center py-12 text-center">
        <Crown className="mb-4 h-16 w-16 text-primary/50" />
        <h3 className="text-xl font-bold">No Active VIP Plan</h3>
        <p className="mt-2 max-w-md text-sm text-muted">
          You haven&apos;t purchased a VIP package yet. Head to VIP Packages to
          choose a plan and start earning daily income.
        </p>
        <Link href="/dashboard/vip-packages" className="mt-6">
          <Button size="lg">Go to VIP Packages →</Button>
        </Link>
      </Card>
    </div>
  );
}
