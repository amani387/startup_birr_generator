import { format } from "date-fns";
import { Copy, Download, Share2, Users } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { ReferralCopySection } from "@/components/dashboard/referral-copy";
import { StatCard } from "@/components/dashboard/stat-card";
import { Card } from "@/components/ui/card";
import { REFERRAL_COMMISSION } from "@/lib/constants";
import { requireProfile } from "@/lib/data/profile";
import { getReferralStats } from "@/lib/data/queries";
import { formatBirr } from "@/lib/utils";

export default async function ReferralPage() {
  const profile = await requireProfile();
  const stats = await getReferralStats(profile.id);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const referralLink = `${appUrl}/ref/${profile.referral_code}`;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Referral Program"
        description={`Earn ${REFERRAL_COMMISSION.level1}% commission when referrals purchase VIP packages.`}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Total Referrals" value={String(stats.totalReferrals)} icon={Users} />
        <StatCard
          title="Referral Earnings"
          value={formatBirr(stats.totalCommissions)}
          icon={Share2}
          highlight
        />
        <StatCard
          title="Commission Rate"
          value={`${REFERRAL_COMMISSION.level1}%`}
          icon={Users}
        />
      </div>

      <ReferralCopySection
        referralCode={profile.referral_code}
        referralLink={referralLink}
      />

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
              title: `You Earn ${REFERRAL_COMMISSION.level1}%`,
              desc: "Commission is credited instantly to your balance.",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="rounded-lg border border-white/10 bg-surface-bright p-4"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-black">
                {item.step}
              </span>
              <h4 className="mt-3 font-semibold">{item.title}</h4>
              <p className="mt-1 text-sm text-muted">{item.desc}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h3 className="mb-4 font-bold">Referral Bonus History</h3>
        {stats.totalCommissions === 0 ? (
          <p className="py-8 text-center text-sm text-muted">
            No referral bonuses yet. Start inviting friends!
          </p>
        ) : (
          <p className="text-sm text-muted">
            Total earned from referrals: {formatBirr(stats.totalCommissions)}
          </p>
        )}
      </Card>
    </div>
  );
}
