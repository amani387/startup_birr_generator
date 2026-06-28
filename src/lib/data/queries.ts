import { createClient } from "@/lib/supabase/server";
import { DEMO_VIP_PLANS, isSupabaseConfigured } from "@/lib/supabase/config";
import { applyVipTierPricing } from "@/lib/vip-pricing";
import type {
  ActivityItem,
  Deposit,
  Earning,
  ReferralCommission,
  ReferralMember,
  VipPlan,
  VipPurchase,
  Withdrawal,
  WithdrawalSettings,
} from "@/types/database";

export async function getVipPlans(): Promise<VipPlan[]> {
  if (!isSupabaseConfigured()) return DEMO_VIP_PLANS;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("vip_plans")
    .select("*")
    .eq("active", true)
    .order("level");

  if (error || !data?.length) return DEMO_VIP_PLANS;

  return data.map((row) =>
    applyVipTierPricing({
      id: row.id,
      level: row.level,
      name: row.name,
      price: Number(row.price),
      daily_income: Number(row.daily_income),
      duration_days: row.duration_days,
      total_return: Number(row.total_return),
      active: row.active,
    })
  );
}

export async function getNextVipPlan(currentLevel: number): Promise<VipPlan | null> {
  const plans = await getVipPlans();
  return plans.find((p) => p.level === currentLevel + 1) ?? null;
}

export async function getActiveVipPurchase(
  userId: string
): Promise<VipPurchase | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("vip_purchases")
    .select("*, vip_plans(*)")
    .eq("user_id", userId)
    .eq("status", "active")
    .gt("expires_at", new Date().toISOString())
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!data) return null;

  return {
    id: data.id,
    user_id: data.user_id,
    plan_id: data.plan_id,
    amount_paid: Number(data.amount_paid),
    daily_income: Number(data.daily_income),
    started_at: data.started_at,
    expires_at: data.expires_at,
    days_claimed: data.days_claimed,
    last_vip_income_claim: data.last_vip_income_claim as string | null,
    status: data.status,
    vip_plans: data.vip_plans
      ? {
          id: data.vip_plans.id,
          level: data.vip_plans.level,
          name: data.vip_plans.name,
          price: Number(data.vip_plans.price),
          daily_income: Number(data.vip_plans.daily_income),
          duration_days: data.vip_plans.duration_days,
          total_return: Number(data.vip_plans.total_return),
          active: data.vip_plans.active,
        }
      : undefined,
  };
}

export async function getDeposits(userId: string): Promise<Deposit[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("deposits")
    .select("id, amount, payment_method, screenshot_url, status, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return (data ?? []).map((row) => ({
    ...row,
    amount: Number(row.amount),
  }));
}

export async function getDirectReferralCount(userId: string): Promise<number> {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("referred_by", userId);

  if (error) {
    console.error("getDirectReferralCount:", error.message);
    return 0;
  }

  return count ?? 0;
}

export async function getWithdrawals(userId: string): Promise<Withdrawal[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("withdrawals")
    .select(
      "id, amount, payment_method, account_holder, account_number, status, created_at"
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return (data ?? []).map((row) => ({
    ...row,
    amount: Number(row.amount),
  }));
}

export async function getWithdrawalSettings(
  userId: string
): Promise<WithdrawalSettings | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("withdrawal_settings")
    .select("payment_method, account_holder, account_number")
    .eq("user_id", userId)
    .maybeSingle();

  return data;
}

export async function getEarnings(userId: string): Promise<Earning[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("earnings")
    .select("id, type, amount, description, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return (data ?? []).map((row) => ({
    ...row,
    amount: Number(row.amount),
  }));
}

export async function getReferralsByLevel(
  userId: string,
  level: 1 | 2 | 3
): Promise<ReferralMember[]> {
  const supabase = await createClient();

  if (level === 1) {
    const { data } = await supabase
      .from("profiles")
      .select("id, full_name, email, vip_level, created_at")
      .eq("referred_by", userId)
      .order("created_at", { ascending: false });

    return data ?? [];
  }

  const { data: level1 } = await supabase
    .from("profiles")
    .select("id")
    .eq("referred_by", userId);

  const level1Ids = (level1 ?? []).map((r) => r.id);
  if (level1Ids.length === 0) return [];

  if (level === 2) {
    const { data } = await supabase
      .from("profiles")
      .select("id, full_name, email, vip_level, created_at")
      .in("referred_by", level1Ids)
      .order("created_at", { ascending: false });

    return data ?? [];
  }

  const { data: level2 } = await supabase
    .from("profiles")
    .select("id")
    .in("referred_by", level1Ids);

  const level2Ids = (level2 ?? []).map((r) => r.id);
  if (level2Ids.length === 0) return [];

  const { data } = await supabase
    .from("profiles")
    .select("id, full_name, email, vip_level, created_at")
    .in("referred_by", level2Ids)
    .order("created_at", { ascending: false });

  return data ?? [];
}

export async function getReferralStats(userId: string) {
  const [l1, l2, l3] = await Promise.all([
    getReferralsByLevel(userId, 1),
    getReferralsByLevel(userId, 2),
    getReferralsByLevel(userId, 3),
  ]);

  const supabase = await createClient();
  const { data: commissions } = await supabase
    .from("referral_commissions")
    .select("amount")
    .eq("beneficiary_id", userId);

  const totalCommissions = (commissions ?? []).reduce(
    (sum, c) => sum + Number(c.amount),
    0
  );

  return {
    totalReferrals: l1.length + l2.length + l3.length,
    level1Count: l1.length,
    level2Count: l2.length,
    level3Count: l3.length,
    totalCommissions,
  };
}

export async function getReferralCommissions(
  userId: string
): Promise<ReferralCommission[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("earnings")
    .select("id, amount, description, created_at")
    .eq("user_id", userId)
    .eq("type", "referral_commission")
    .order("created_at", { ascending: false })
    .limit(50);

  return (data ?? []).map((row) => ({
    id: row.id,
    amount: Number(row.amount),
    level: 1,
    commission_percent: 15,
    created_at: row.created_at,
    source_user: row.description
      ? { full_name: row.description, email: "" }
      : null,
  }));
}

export async function getRecentActivity(userId: string): Promise<ActivityItem[]> {
  const [deposits, withdrawals, earnings] = await Promise.all([
    getDeposits(userId),
    getWithdrawals(userId),
    getEarnings(userId),
  ]);

  const items: ActivityItem[] = [
    ...deposits.slice(0, 5).map((d) => ({
      id: d.id,
      type: "deposit" as const,
      label: `Deposit via ${d.payment_method}`,
      amount: d.amount,
      status: d.status,
      created_at: d.created_at,
    })),
    ...withdrawals.slice(0, 5).map((w) => ({
      id: w.id,
      type: "withdrawal" as const,
      label: `Withdrawal to ${w.payment_method}`,
      amount: w.amount,
      status: w.status,
      created_at: w.created_at,
    })),
    ...earnings.slice(0, 5).map((e) => ({
      id: e.id,
      type: "earning" as const,
      label: e.description ?? e.type.replace("_", " "),
      amount: e.amount,
      created_at: e.created_at,
    })),
  ];

  return items
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    .slice(0, 8);
}

export async function getPlatformSetting(key: string, fallback: number) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("platform_settings")
    .select("value")
    .eq("key", key)
    .maybeSingle();

  if (!data?.value) return fallback;
  return Number(data.value);
}
