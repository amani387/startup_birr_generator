"use client";

import { Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type DailyRewardProps = {
  rewardAmount?: number;
  streakDay?: number;
  maxStreak?: number;
  canClaim?: boolean;
};

export function DailyReward({
  rewardAmount = 5,
  streakDay = 1,
  maxStreak = 7,
  canClaim = true,
}: DailyRewardProps) {
  return (
    <Card glow className="border-primary/30">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-primary/10 p-2.5">
            <Gift className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-bold">Daily Reward</h3>
            <p className="text-sm text-muted">
              Claim {rewardAmount} Birr bonus today
            </p>
          </div>
        </div>
        <Button disabled={!canClaim} size="lg">
          Claim {rewardAmount} Birr
        </Button>
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between text-xs text-muted">
          <span>Weekly streak progress</span>
          <span>
            Day {streakDay}/{maxStreak} — Bonus at day {maxStreak}!
          </span>
        </div>
        <div className="flex gap-2">
          {Array.from({ length: maxStreak }, (_, i) => (
            <div
              key={i}
              className={cn(
                "flex h-8 flex-1 items-center justify-center rounded-md text-xs font-bold",
                i + 1 <= streakDay
                  ? "bg-primary text-black"
                  : "bg-white/10 text-muted"
              )}
            >
              {i + 1}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
