import Link from "next/link";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Crown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { format } from "date-fns";
import { DailyRewardClaim } from "@/components/dashboard/daily-reward-claim";
import { StatCard } from "@/components/dashboard/stat-card";
import { VipProgress } from "@/components/dashboard/vip-progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  canClaimDailyReward,
  getVipProgress,
  requireProfile,
} from "@/lib/data/profile";
import {
  getActiveVipPurchase,
  getNextVipPlan,
  getPlatformSetting,
  getRecentActivity,
} from "@/lib/data/queries";
import { getTranslations } from "@/lib/i18n/server";
import { formatBirr } from "@/lib/utils";

export default async function DashboardPage() {
  const profile = await requireProfile();
  const t = await getTranslations();
  const [nextPlan, activePurchase, activity, rewardAmount, streakBonusDay] =
    await Promise.all([
      getNextVipPlan(profile.vip_level),
      getActiveVipPurchase(profile.id),
      getRecentActivity(profile.id),
      getPlatformSetting("daily_reward_amount", 5),
      getPlatformSetting("daily_streak_bonus_day", 7),
    ]);

  const { progressPercent, amountToNext } = getVipProgress(
    profile,
    nextPlan?.price ?? null
  );

  const vipLabel =
    profile.vip_level > 0 ? `VIP ${profile.vip_level}` : t("dashboard.noVip");

  return (
    <div className="section-stack">
      <Card glow className="border-primary/20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h2 className="font-display text-xl font-bold sm:text-2xl">
              {t("dashboard.welcome")}, {profile.full_name} 👋
            </h2>
            <p className="text-sm leading-relaxed text-muted">
              {t("dashboard.overview")}
            </p>
          </div>
          <div className="flex w-fit items-center gap-2 rounded-xl border border-border bg-surface-bright px-4 py-2.5">
            <Crown
              className={`h-4 w-4 ${profile.vip_level > 0 ? "text-primary" : "text-muted"}`}
            />
            <span className="text-sm font-semibold">{vipLabel}</span>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title={t("dashboard.balance")}
          value={formatBirr(profile.balance)}
          icon={Wallet}
          highlight
        />
        <StatCard
          title={t("dashboard.totalEarnings")}
          value={formatBirr(profile.total_earned)}
          icon={TrendingUp}
        />
        <StatCard
          title={t("dashboard.totalDeposits")}
          value={formatBirr(profile.total_deposited)}
          icon={ArrowDownToLine}
        />
        <StatCard
          title={t("dashboard.totalWithdrawals")}
          value={formatBirr(profile.total_withdrawn)}
          icon={ArrowUpFromLine}
        />
      </div>

      <VipProgress
        currentLevel={profile.vip_level}
        progressPercent={progressPercent}
        amountToNext={amountToNext}
        deposited={profile.total_deposited}
      />

      <DailyRewardClaim
        rewardAmount={rewardAmount}
        streakDay={profile.daily_streak}
        maxStreak={streakBonusDay}
        canClaim={canClaimDailyReward(profile)}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h3 className="mb-4 font-display text-lg font-bold">
            {t("dashboard.recentActivity")}
          </h3>
          {activity.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted">{t("common.noData")}</p>
              <p className="mt-2 max-w-xs text-xs leading-relaxed text-muted">
                {t("dashboard.noActivity")}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {activity.map((item) => (
                <div
                  key={`${item.type}-${item.id}`}
                  className="flex items-center justify-between gap-3 rounded-xl border border-border bg-surface-bright/60 px-4 py-3.5"
                >
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted">
                      {format(new Date(item.created_at), "MMM d, yyyy HH:mm")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary">
                      {formatBirr(item.amount)}
                    </p>
                    {item.status && (
                      <Badge
                        status={
                          item.status === "approved"
                            ? "approved"
                            : item.status === "rejected"
                              ? "rejected"
                              : "pending"
                        }
                      >
                        {item.status}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <h3 className="mb-4 font-display text-lg font-bold">
            {t("dashboard.quickActions")}
          </h3>
          <div className="space-y-2.5">
            {[
              { label: t("dashboard.makeDeposit"), href: "/dashboard/deposits" },
              {
                label: t("dashboard.withdrawFunds"),
                href: "/dashboard/withdrawals",
              },
              { label: t("dashboard.buyVip"), href: "/dashboard/vip-packages" },
              {
                label: t("dashboard.referEarn"),
                href: "/dashboard/referral",
                accent: true,
              },
            ].map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className={`block min-h-11 rounded-xl border px-4 py-3.5 text-sm font-medium transition-all duration-200 active:scale-[0.99] ${
                  action.accent
                    ? "border-primary/25 bg-primary-dim text-primary"
                    : "border-border hover:border-primary/25 hover:bg-primary-dim/50"
                }`}
              >
                {action.label}
              </Link>
            ))}
          </div>
        </Card>
      </div>

      {!activePurchase ? (
        <Card>
          <div className="flex flex-col items-center gap-5 py-4 text-center sm:flex-row sm:justify-between sm:text-left">
            <div className="space-y-2">
              <Crown className="mx-auto h-10 w-10 text-muted sm:mx-0" />
              <h3 className="font-display text-lg font-bold">
                {t("dashboard.noActiveVip")}
              </h3>
            </div>
            <Link href="/dashboard/vip-packages" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto">
                {t("dashboard.browseVip")}
              </Button>
            </Link>
          </div>
        </Card>
      ) : (
        <Card glow className="border-primary/20">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-bold">
                Active Package: {activePurchase.vip_plans?.name ?? "VIP"}
              </h3>
              <p className="text-sm text-muted">
                {formatBirr(activePurchase.daily_income)}/day — expires{" "}
                {format(new Date(activePurchase.expires_at), "MMM d, yyyy")}
              </p>
            </div>
            <Badge status="active">Active</Badge>
          </div>
        </Card>
      )}
    </div>
  );
}
