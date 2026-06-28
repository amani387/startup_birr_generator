import { VIP_TIERS } from "@/lib/constants";
import type { VipPlan } from "@/types/database";

/** Apply canonical VIP tier pricing from app constants (source of truth). */
export function applyVipTierPricing(plan: VipPlan): VipPlan {
  const tier = VIP_TIERS.find((t) => t.level === plan.level);
  if (!tier) return plan;

  return {
    ...plan,
    name: tier.name,
    price: tier.price,
    daily_income: tier.dailyIncome,
    duration_days: tier.durationDays,
    total_return:
      Math.round(tier.dailyIncome * tier.durationDays * 100) / 100,
    active: true,
  };
}

export function getVipTierByLevel(level: number) {
  return VIP_TIERS.find((t) => t.level === level) ?? null;
}
