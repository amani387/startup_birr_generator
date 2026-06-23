"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Crown,
  ExternalLink,
  LineChart,
  PlayCircle,
  Send,
  Share2,
  Sparkles,
  Star,
  TrendingUp,
} from "lucide-react";
import { claimSocialTask } from "@/lib/actions/tasks";
import {
  FOREX_TRADE,
  SOCIAL_TASK_CLAIM_DELAY_SECONDS,
  type SocialTask,
  type SocialTaskPlatform,
} from "@/lib/constants";
import { celebrateReward } from "@/lib/confetti";
import { calculateBoostedVipDailyIncome } from "@/lib/forex";
import { useFeedback } from "@/components/providers/feedback-provider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { applyActionResult, getErrorMessage } from "@/lib/feedback";
import { cn, formatBirr } from "@/lib/utils";

const PLATFORM_ICON: Record<
  SocialTaskPlatform,
  React.ComponentType<{ className?: string }>
> = {
  facebook: Share2,
  telegram: Send,
  youtube: PlayCircle,
};

const PLATFORM_COLORS: Record<SocialTaskPlatform, string> = {
  facebook: "bg-blue-500/10 text-blue-600",
  telegram: "bg-sky-500/10 text-sky-600",
  youtube: "bg-red-500/10 text-red-600",
};

type SocialTasksPanelProps = {
  socialTasks: SocialTask[];
  claimedTaskIds: string[];
  vipLevel: number;
  forexInterestRate: number;
  baseDailyIncome?: number;
};

export function SocialTasksPanel({
  socialTasks,
  claimedTaskIds,
  vipLevel,
  forexInterestRate,
  baseDailyIncome = 0,
}: SocialTasksPanelProps) {
  const router = useRouter();
  const { showError, showSuccess } = useFeedback();
  const [pending, startTransition] = useTransition();
  const [pendingTaskId, setPendingTaskId] = useState<string | null>(null);
  /** taskId → timestamp (ms) when Claim becomes available */
  const [claimUnlockAt, setClaimUnlockAt] = useState<Record<string, number>>({});
  const [, setTick] = useState(0);

  const hasActiveCountdown = Object.values(claimUnlockAt).some(
    (unlockAt) => unlockAt > Date.now()
  );

  useEffect(() => {
    if (!hasActiveCountdown) return;
    const timer = setInterval(() => setTick((n) => n + 1), 1000);
    return () => clearInterval(timer);
  }, [hasActiveCountdown]);

  function handleOpenTask(taskId: string) {
    setClaimUnlockAt((prev) => ({
      ...prev,
      [taskId]: Date.now() + SOCIAL_TASK_CLAIM_DELAY_SECONDS * 1000,
    }));
  }

  function getClaimButtonState(taskId: string, done: boolean) {
    if (done) {
      return { disabled: true, label: "Claimed" as const };
    }

    const unlockAt = claimUnlockAt[taskId];
    if (!unlockAt || unlockAt > Date.now()) {
      return { disabled: true, label: "Claim" as const };
    }

    return { disabled: false, label: "Claim" as const };
  }

  const claimedSet = new Set(claimedTaskIds);
  const socialCompleted = socialTasks.filter((t) => claimedSet.has(t.id)).length;
  const forexUnlocked = vipLevel > 0;
  const boostedDaily =
    baseDailyIncome > 0
      ? calculateBoostedVipDailyIncome(baseDailyIncome, vipLevel, forexInterestRate)
      : null;

  function handleClaim(taskId: string) {
    setPendingTaskId(taskId);
    startTransition(async () => {
      try {
        const result = await claimSocialTask(taskId);
        const ok = applyActionResult(result, {
          onError: showError,
          onSuccess: showSuccess,
        });
        if (ok && result.success) {
          celebrateReward();
          router.refresh();
        }
      } catch (err) {
        showError(getErrorMessage(err));
      } finally {
        setPendingTaskId(null);
      }
    });
  }

  return (
    <div id="reward-tasks">
      <Card className="overflow-hidden border-primary/15 p-0">
        <div className="border-b border-border bg-gradient-to-r from-primary/5 via-transparent to-amber-500/5 px-5 py-4 sm:px-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-primary/10 p-2.5">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-foreground">
                  Earn & Grow
                </h3>
                <p className="mt-0.5 text-sm text-muted">
                  Complete tasks, unlock forex VIP income, and boost your daily earnings.
                </p>
              </div>
            </div>
            <span className="rounded-full border border-primary/20 bg-surface px-3 py-1 text-xs font-semibold text-primary shadow-sm">
              {socialCompleted}/{socialTasks.length} social today
            </span>
          </div>
        </div>

        <div className="space-y-4 p-5 sm:p-6">
          {/* Featured forex task */}
          <Link
            href={FOREX_TRADE.vipPackagesPath}
            className={cn(
              "group relative block overflow-hidden rounded-2xl border-2 p-4 transition-all hover:scale-[1.01] hover:shadow-lg sm:p-5",
              forexUnlocked
                ? "border-amber-400/60 bg-gradient-to-br from-amber-50 via-yellow-50/80 to-amber-100/50 shadow-[0_0_24px_rgba(251,191,36,0.15)] dark:from-amber-950/40 dark:via-amber-950/20 dark:to-yellow-950/30 dark:shadow-[0_0_24px_rgba(251,191,36,0.08)]"
                : "border-amber-400/40 bg-gradient-to-br from-amber-50 via-white to-yellow-50 shadow-[0_4px_20px_rgba(245,158,11,0.12)] dark:from-amber-950/30 dark:via-surface dark:to-yellow-950/20 dark:shadow-[0_4px_20px_rgba(245,158,11,0.06)]"
            )}
          >
            <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-amber-400/20 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-4 left-1/3 h-16 w-16 rounded-full bg-yellow-500/15 blur-xl" />

            <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-yellow-600 shadow-md">
                  <LineChart className="h-6 w-6 text-white" />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-200">
                      <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                      Featured
                    </span>
                    {forexUnlocked && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-700 dark:text-emerald-300">
                        <CheckCircle2 className="h-3 w-3" />
                        Active
                      </span>
                    )}
                  </div>
                  <h4 className="mt-1 font-display text-lg font-bold text-amber-950 dark:text-amber-100">
                    Earn with our forex trade
                  </h4>
                  <p className="mt-1 text-sm leading-relaxed text-amber-900/80 dark:text-amber-100/75">
                    {forexUnlocked
                      ? `VIP ${vipLevel} unlocked — daily income boosted with forex rate × ${forexInterestRate} + level bonus.`
                      : "Purchase any VIP package to unlock boosted daily forex income."}
                  </p>
                  {forexUnlocked && boostedDaily !== null && (
                    <p className="mt-2 inline-flex items-center gap-1.5 text-sm font-bold text-amber-800 dark:text-amber-200">
                      <TrendingUp className="h-4 w-4" />
                      Boosted daily: {formatBirr(boostedDaily)}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2 sm:flex-col sm:items-end">
                {forexUnlocked ? (
                  <div className="flex items-center gap-2 rounded-xl bg-amber-500/20 px-3 py-2 text-sm font-semibold text-amber-900 dark:text-amber-100">
                    <Crown className="h-4 w-4" />
                    VIP {vipLevel}
                  </div>
                ) : (
                  <span className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 px-4 text-sm font-bold text-white shadow-md transition group-hover:from-amber-600 group-hover:to-yellow-600">
                    Buy VIP to unlock
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                  </span>
                )}
              </div>
            </div>
          </Link>

          {/* Social tasks */}
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
              Social rewards
            </p>
            <ul className="max-h-[min(60vh,480px)] space-y-2 overflow-y-auto overscroll-contain pr-1">
              {socialTasks.map((task) => {
                const done = claimedSet.has(task.id);
                const Icon = PLATFORM_ICON[task.platform];
                const isClaiming = pending && pendingTaskId === task.id;
                const claimState = getClaimButtonState(task.id, done);

                return (
                  <li
                    key={task.id}
                    className={cn(
                      "rounded-xl border p-3 transition-all hover:border-primary/25 hover:shadow-sm",
                      done
                        ? "border-primary/25 bg-primary/5"
                        : "border-border bg-surface-bright/60"
                    )}
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex min-w-0 items-start gap-3">
                        <div
                          className={cn(
                            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                            PLATFORM_COLORS[task.platform]
                          )}
                        >
                          {done ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : (
                            <Icon className="h-4 w-4" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium leading-snug text-foreground">
                            {task.label}
                          </p>
                          <p className="mt-0.5 text-xs font-bold text-primary">
                            +{formatBirr(task.reward)}
                          </p>
                        </div>
                      </div>

                      <div className="flex shrink-0 flex-wrap gap-2 sm:justify-end">
                        <a
                          href={task.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => handleOpenTask(task.id)}
                          className="inline-flex min-h-9 items-center gap-1.5 rounded-xl border border-border bg-surface-bright px-3 text-xs font-semibold text-foreground transition-colors hover:border-primary/30 hover:bg-primary/5"
                        >
                          Open
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                        <Button
                          size="sm"
                          disabled={done || pending || claimState.disabled}
                          onClick={() => handleClaim(task.id)}
                        >
                          {isClaiming ? "Claiming..." : claimState.label}
                        </Button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
