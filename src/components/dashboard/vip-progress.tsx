import { Card } from "@/components/ui/card";
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
  maxLevel = 5,
  progressPercent,
  amountToNext,
  deposited,
}: VipProgressProps) {
  return (
    <Card>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-bold">VIP Progress</h3>
          <p className="text-sm text-muted">
            {currentLevel === 0
              ? "No VIP yet"
              : `Current VIP Level ${currentLevel}`}{" "}
            — {progressPercent}% to next level
          </p>
        </div>
        <span className="text-sm font-semibold text-primary">
          {amountToNext > 0 ? `${amountToNext.toLocaleString()} Birr to go` : "Max level"}
        </span>
      </div>

      <div className="relative h-3 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary/80 to-primary transition-all duration-500"
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
        {deposited.toLocaleString()} Birr deposited
      </p>
    </Card>
  );
}
