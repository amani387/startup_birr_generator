import { format } from "date-fns";
import { AffiliateNetwork } from "@/components/dashboard/affiliate-network";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { requireProfile } from "@/lib/data/profile";
import { getReferralStats, getReferralsByLevel } from "@/lib/data/queries";
import { formatBirr } from "@/lib/utils";
import { Gift, Network, User } from "lucide-react";

export default async function AffiliatePage() {
  const profile = await requireProfile();
  const stats = await getReferralStats(profile.id);
  const [level1, level2, level3] = await Promise.all([
    getReferralsByLevel(profile.id, 1),
    getReferralsByLevel(profile.id, 2),
    getReferralsByLevel(profile.id, 3),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Affiliate Network"
        description="Your referred members, their deposits, and commissions you've earned."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Total Referrals" value={String(stats.totalReferrals)} icon={User} />
        <StatCard title="Network Deposits" value={formatBirr(0)} icon={Network} />
        <StatCard
          title="Total Commissions"
          value={formatBirr(stats.totalCommissions)}
          icon={Gift}
          highlight
        />
      </div>

      <AffiliateNetwork
        level1={level1}
        level2={level2}
        level3={level3}
        level1Count={stats.level1Count}
        level2Count={stats.level2Count}
        level3Count={stats.level3Count}
      />
    </div>
  );
}

function formatMemberDate(date: string) {
  return format(new Date(date), "MMM d, yyyy");
}

export { formatMemberDate };
