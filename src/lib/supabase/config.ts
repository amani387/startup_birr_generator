import type { Profile, VipPlan } from "@/types/database";
import { VIP_TIERS } from "@/lib/constants";

/** Client-safe key: supports new publishable key or legacy anon JWT. */
export function getSupabaseAnonKey(): string | undefined {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export function getSupabaseUrl(): string | undefined {
  return process.env.NEXT_PUBLIC_SUPABASE_URL;
}

export function isSupabaseConfigured(): boolean {
  return Boolean(getSupabaseUrl() && getSupabaseAnonKey());
}

export const DEMO_PROFILE: Profile = {
  id: "00000000-0000-0000-0000-000000000001",
  full_name: "Demo User",
  email: "demo@gogenzeb.com",
  referral_code: "BT-DEMO123",
  referred_by: null,
  role: "user",
  balance: 0,
  total_earned: 0,
  total_deposited: 0,
  total_withdrawn: 0,
  vip_level: 0,
  daily_streak: 0,
  last_daily_claim: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const DEMO_VIP_PLANS: VipPlan[] = VIP_TIERS.map((tier) => ({
  id: `demo-vip-${tier.level}`,
  level: tier.level,
  name: tier.name,
  price: tier.price,
  daily_income: tier.dailyIncome,
  duration_days: tier.durationDays,
  total_return: Math.round(tier.dailyIncome * tier.durationDays * 100) / 100,
  active: true,
}));

export const PLATFORM_DEFAULTS: Record<string, number> = {
  daily_reward_amount: 5,
  daily_streak_bonus_day: 7,
  withdrawal_min_balance_unlock: 700,
  withdrawal_retention_percent: 30,
  withdrawal_min_amount: 100,
  referral_commission_l1: 15,
  referral_commission_l2: 10,
  referral_commission_l3: 5,
};
