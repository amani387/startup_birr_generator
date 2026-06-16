"use client";

import { Card } from "@/components/ui/card";
import { useTranslation } from "@/components/providers/i18n-provider";
import { cn } from "@/lib/utils";

type VipProgressProps = {
  currentLevel: number;
  maxLevel?: number;
  progressPercent: number;
  amountToNext: number;
  deposited: number;
};

export function VipProgress({
  currentLevel,
  maxLevel = 6,
  progressPercent,
  amountToNext,
  deposited,
}: VipProgressProps) {
  const t = useTranslation();

  return (
    <Card className="overflow-hidden">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-display font-bold">{t("dashboard.vipProgress")}</h3>
          <p className="text-sm text-muted">
            {currentLevel === 0
              ? t("dashboard.noVip")
              : `VIP ${currentLevel}`}{" "}
            — {progressPercent}%
          </p>
        </div>
        <span className="text-sm font-semibold text-primary">
          {amountToNext > 0
            ? `${amountToNext.toLocaleString()} ${t("common.birr")}`
            : "Max"}
        </span>
      </div>

      <div className="relative h-3 overflow-hidden rounded-full bg-foreground/10">
        <div
          className="progress-gold h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="mt-3 flex justify-between text-xs text-muted">
        {Array.from({ length: maxLevel }, (_, i) => (
          <span
            key={i}
            className={cn(
              i + 1 <= currentLevel && "font-semibold text-primary"
            )}
          >
            VIP {i + 1}
          </span>
        ))}
      </div>
      <p className="mt-2 text-xs text-muted">
        {deposited.toLocaleString()} {t("common.birr")} deposited
      </p>
    </Card>
  );
}
