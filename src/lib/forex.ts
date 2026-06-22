import { FOREX_TRADE } from "@/lib/constants";

/** Boosted daily VIP income after forex task (VIP purchase) is unlocked. */
export function calculateBoostedVipDailyIncome(
  baseDailyIncome: number,
  vipLevel: number,
  interestRate: number = FOREX_TRADE.interestRate
): number {
  if (vipLevel <= 0) return baseDailyIncome;
  return Math.round((baseDailyIncome * interestRate + vipLevel) * 100) / 100;
}

export function isForexTradeUnlocked(vipLevel: number): boolean {
  return vipLevel > 0;
}
