import type { Profile, VipPlan } from "@/types/database";

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
  email: "demo@aureumvip.com",
  referral_code: "EP-DEMO123",
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

export const DEMO_VIP_PLANS: VipPlan[] = [
  {
    id: "demo-vip-1",
    level: 1,
    name: "VIP 1",
    price: 500,
    daily_income: 71.43,
    duration_days: 7,
    total_return: 500.01,
    active: true,
  },
  {
    id: "demo-vip-2",
    level: 2,
    name: "VIP 2",
    price: 3000,
    daily_income: 428.57,
    duration_days: 7,
    total_return: 2999.99,
    active: true,
  },
  {
    id: "demo-vip-3",
    level: 3,
    name: "VIP 3",
    price: 12000,
    daily_income: 1714.29,
    duration_days: 7,
    total_return: 12000.03,
    active: true,
  },
  {
    id: "demo-vip-4",
    level: 4,
    name: "VIP 4",
    price: 26000,
    daily_income: 3714.29,
    duration_days: 7,
    total_return: 26000.03,
    active: true,
  },
  {
    id: "demo-vip-5",
    level: 5,
    name: "VIP 5",
    price: 50000,
    daily_income: 7142.86,
    duration_days: 7,
    total_return: 50000.02,
    active: true,
  },
];

export const PLATFORM_DEFAULTS: Record<string, number> = {
  daily_reward_amount: 5,
  daily_streak_bonus_day: 7,
  withdrawal_min_balance_unlock: 700,
  withdrawal_retention_percent: 30,
  withdrawal_min_amount: 100,
  referral_commission_l1: 10,
  referral_commission_l2: 10,
  referral_commission_l3: 10,
};
