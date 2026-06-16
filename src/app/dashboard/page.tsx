import Link from "next/link";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Crown,
  Sparkles,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { format } from "date-fns";
import { DailyRewardClaim } from "@/components/dashboard/daily-reward-claim";
import { ForexMarketChart } from "@/components/dashboard/forex-market-chart";
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

function activityBadge(
  status: string | undefined,
  t: (key: string) => string
): { status: "completed" | "processing" | "rejected"; label: string } | null {
  if (!status) return null;
  if (status === "approved" || status === "completed") {
    return { status: "completed", label: t("dashboard.completed") };
  }
  if (status === "rejected") {
    return { status: "rejected", label: status };
  }
  return { status: "processing", label: t("dashboard.processing") };
}

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

  const dailyRoi = activePurchase?.daily_income ?? 0;

  return (
    <div className="section-stack">
      {/* Portfolio hero — bento span */}
      <div className="bento-grid">
        <Card
          glow
          padding="lg"
          className="accent-glow gold-glow md:col-span-8"
        >
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-3">
              <p className="text-sm font-medium text-muted">
                {t("dashboard.welcome")}, {profile.full_name}
              </p>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                  {t("dashboard.totalBalance")}
                </p>
                <p className="font-display text-4xl font-bold tracking-tight text-primary sm:text-5xl">
                  {formatBirr(profile.balance)}
                </p>
              </div>
              <p className="max-w-md text-sm leading-relaxed text-muted">
                {t("dashboard.overview")}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="rounded-2xl border border-border bg-surface-bright px-5 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">
                  {t("dashboard.dailyRoi")}
                </p>
                <p className="mt-1 font-display text-2xl font-bold text-foreground">
                  {formatBirr(dailyRoi)}
                  <span className="text-sm font-normal text-muted">/day</span>
                </p>
              </div>
              <div className="flex items-center gap-2 rounded-2xl border border-primary/20 bg-primary-dim px-5 py-4">
                <Crown
                  className={`h-5 w-5 ${profile.vip_level > 0 ? "text-primary" : "text-muted"}`}
                />
                <span className="font-display font-bold">{vipLabel}</span>
              </div>
            </div>
          </div>
        </Card>

        <Card padding="md" className="md:col-span-4">
          <h3 className="mb-4 font-display text-sm font-bold uppercase tracking-wider text-muted">
            {t("dashboard.quickActions")}
          </h3>
          <div className="space-y-2">
            {[
              { label: t("dashboard.makeDeposit"), href: "/dashboard/deposits" },
              {
                label: t("dashboard.withdrawFunds"),
                href: "/dashboard/withdrawals",
              },
              {
                label: t("dashboard.buyVip"),
                href: "/dashboard/vip-packages",
              },
              {
                label: t("dashboard.referEarn"),
                href: "/dashboard/referral",
                accent: true,
              },
            ].map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className={`block min-h-11 rounded-xl border px-4 py-3 text-sm font-medium transition-all duration-200 active:scale-95 ${
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

      {/* Stats row */}
      <div className="bento-grid">
        <div className="md:col-span-7">
          <ForexMarketChart />
        </div>
        <div className="md:col-span-5 grid gap-4 sm:grid-cols-2 md:grid-cols-1">
          <StatCard
            title={t("dashboard.balance")}
            value={formatBirr(profile.balance)}
            icon={Wallet}
            highlight
          />
          <StatCard
            title={t("dashboard.dailyRoi")}
            value={formatBirr(dailyRoi)}
            icon={TrendingUp}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
        <StatCard
          title={t("dashboard.noVip")}
          value={vipLabel}
          icon={Crown}
        />
      </div>

      <div className="bento-grid">
        <div className="md:col-span-7">
          <VipProgress
            currentLevel={profile.vip_level}
            progressPercent={progressPercent}
            amountToNext={amountToNext}
            deposited={profile.total_deposited}
          />
        </div>
        <div className="md:col-span-5">
          <DailyRewardClaim
            rewardAmount={rewardAmount}
            streakDay={profile.daily_streak}
            maxStreak={streakBonusDay}
            canClaim={canClaimDailyReward(profile)}
          />
        </div>
      </div>

      {/* Activity ledger + active VIP */}
      <div className="bento-grid">
        <Card className="md:col-span-8">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="font-display text-lg font-bold">
              {t("dashboard.activityLedger")}
            </h3>
            <Link
              href="/dashboard/transactions"
              className="text-xs font-medium text-primary hover:underline"
            >
              {t("common.viewAll")}
            </Link>
          </div>
          {activity.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted">{t("common.noData")}</p>
              <p className="mt-2 max-w-xs text-xs leading-relaxed text-muted">
                {t("dashboard.noActivity")}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {activity.map((item) => {
                const badge = activityBadge(item.status, t);
                return (
                  <div
                    key={`${item.type}-${item.id}`}
                    className="flex items-center justify-between gap-3 rounded-xl border border-border bg-surface-bright/40 px-4 py-3.5 transition-colors hover:border-primary/15"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{item.label}</p>
                      <p className="text-xs text-muted">
                        {format(new Date(item.created_at), "MMM d, yyyy HH:mm")}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="font-semibold text-primary">
                        {formatBirr(item.amount)}
                      </p>
                      {badge ? (
                        <Badge status={badge.status}>{badge.label}</Badge>
                      ) : (
                        <Badge status="completed">
                          {t("dashboard.completed")}
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        <div className="md:col-span-4">
          {!activePurchase ? (
            <Card className="flex h-full flex-col items-center justify-center gap-5 py-8 text-center">
              <Crown className="h-10 w-10 text-muted" />
              <div className="space-y-2">
                <h3 className="font-display text-lg font-bold">
                  {t("dashboard.noActiveVip")}
                </h3>
                <p className="text-sm text-muted">{t("dashboard.browseVip")}</p>
              </div>
              <Link href="/dashboard/vip-packages" className="w-full px-4">
                <Button size="lg" className="w-full">
                  <Sparkles className="h-4 w-4" />
                  {t("dashboard.browseVip")}
                </Button>
              </Link>
            </Card>
          ) : (
            <Card glow className="h-full border-primary/20">
              <div className="flex h-full flex-col justify-between gap-4">
                <div>
                  <Badge status="active">Active</Badge>
                  <h3 className="mt-3 font-display text-lg font-bold">
                    {activePurchase.vip_plans?.name ?? "VIP"}
                  </h3>
                  <p className="mt-2 text-sm text-muted">
                    {formatBirr(activePurchase.daily_income)}/day
                  </p>
                  <p className="text-xs text-muted">
                    Expires{" "}
                    {format(new Date(activePurchase.expires_at), "MMM d, yyyy")}
                  </p>
                </div>
                <Link href="/dashboard/vip-packages">
                  <Button variant="outline" className="w-full">
                    {t("dashboard.buyVip")}
                  </Button>
                </Link>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
