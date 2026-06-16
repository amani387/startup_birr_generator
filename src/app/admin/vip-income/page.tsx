import { Card } from "@/components/ui/card";
import { getAdminStats } from "@/lib/data/admin-queries";

export default async function AdminVipIncomePage() {
  const stats = await getAdminStats();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">VIP Income</h1>
        <p className="mt-1 text-sm text-muted">
          {stats.activeVipMembers} active VIP memberships. Members claim daily
          income themselves from the dashboard.
        </p>
      </div>

      <Card>
        <h3 className="font-bold">How daily VIP income works</h3>
        <ul className="mt-3 space-y-2 text-sm text-muted">
          <li>• After purchasing a VIP package, members see a claim button on their dashboard.</li>
          <li>• They can claim once per calendar day for the duration of their package (7 days).</li>
          <li>• Income is credited to their balance instantly — no admin action required.</li>
          <li>• When all days are claimed, the membership status changes to completed.</li>
        </ul>
      </Card>
    </div>
  );
}
