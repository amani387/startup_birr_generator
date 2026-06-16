import { ReferralCopySection } from "@/components/dashboard/referral-copy";
import { ReferralCommissionHistory } from "@/components/dashboard/referral-commission-history";
import { ReferralRewardsTable } from "@/components/dashboard/referral-rewards-table";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { Card } from "@/components/ui/card";
import { getAppUrl } from "@/lib/app-url";
import { requireProfile } from "@/lib/data/profile";
import { getReferralStats } from "@/lib/data/queries";
import { formatBirr } from "@/lib/utils";
import { Share2, Users } from "lucide-react";

export default async function ReferralPage() {
  const profile = await requireProfile();
  const stats = await getReferralStats(profile.id);

  const appUrl = getAppUrl();
  const referralLink = `${appUrl}/ref/${profile.referral_code}`;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Referral Program"
        description="Earn 15% invitation rewards when referrals purchase VIP packages."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Total Referrals" value={String(stats.totalReferrals)} icon={Users} />
        <StatCard
          title="Referral Earnings"
          value={formatBirr(stats.totalCommissions)}
          icon={Share2}
          highlight
        />
        <StatCard title="Commission Rate" value="15%" icon={Users} />
      </div>

      <ReferralCopySection referralCode={profile.referral_code} referralLink={referralLink} />

      <ReferralRewardsTable />

      <ReferralCommissionHistory />

      <Card>
        <h3 className="mb-4 font-bold">How It Works</h3>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              step: 1,
              title: "Share Your Link",
              desc: "Share your unique referral link or code with friends.",
            },
            {
              step: 2,
              title: "They Register & Buy",
              desc: "Your friend registers and purchases any VIP package.",
            },
            {
              step: 3,
              title: "You Earn 15%",
              desc: "Invitation reward is credited instantly to your balance.",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="rounded-lg border border-border bg-surface-bright p-4"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-[#14120f]">
                {item.step}
              </span>
              <h4 className="mt-3 font-semibold">{item.title}</h4>
              <p className="mt-1 text-sm text-muted">{item.desc}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
