import { TriggerVipIncomeButton } from "@/components/admin/trigger-vip-income-button";
import { getAdminStats } from "@/lib/data/admin-queries";

export default async function AdminVipIncomePage() {
  const stats = await getAdminStats();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">VIP Income</h1>
        <p className="mt-1 text-sm text-muted">
          {stats.activeVipMembers} active VIP memberships currently earning daily income.
        </p>
      </div>
      <TriggerVipIncomeButton />
    </div>
  );
}
