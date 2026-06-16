import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export async function getAdminStats() {
  if (!isSupabaseConfigured() || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return {
      totalUsers: 0,
      pendingDeposits: 0,
      pendingWithdrawals: 0,
      activeVipMembers: 0,
    };
  }

  const admin = createAdminClient();

  const [
    { count: totalUsers },
    { count: pendingDeposits },
    { count: pendingWithdrawals },
    { count: activeVipMembers },
  ] = await Promise.all([
    admin.from("profiles").select("*", { count: "exact", head: true }),
    admin.from("deposits").select("*", { count: "exact", head: true }).eq("status", "pending"),
    admin.from("withdrawals").select("*", { count: "exact", head: true }).eq("status", "pending"),
    admin
      .from("vip_purchases")
      .select("*", { count: "exact", head: true })
      .eq("status", "active")
      .gt("expires_at", new Date().toISOString()),
  ]);

  return {
    totalUsers: totalUsers ?? 0,
    pendingDeposits: pendingDeposits ?? 0,
    pendingWithdrawals: pendingWithdrawals ?? 0,
    activeVipMembers: activeVipMembers ?? 0,
  };
}

export async function getAdminPendingDeposits() {
  if (!isSupabaseConfigured() || !process.env.SUPABASE_SERVICE_ROLE_KEY) return [];

  const admin = createAdminClient();
  const { data } = await admin
    .from("deposits")
    .select("id, amount, payment_method, status, created_at, user_id, profiles(full_name, email)")
    .eq("status", "pending")
    .order("created_at", { ascending: false })
    .limit(50);

  return data ?? [];
}

export async function getAdminPendingWithdrawals() {
  if (!isSupabaseConfigured() || !process.env.SUPABASE_SERVICE_ROLE_KEY) return [];

  const admin = createAdminClient();
  const { data } = await admin
    .from("withdrawals")
    .select(
      "id, amount, payment_method, account_holder, account_number, status, created_at, user_id, profiles(full_name, email)"
    )
    .eq("status", "pending")
    .order("created_at", { ascending: false })
    .limit(50);

  return data ?? [];
}

export async function getAdminUsers() {
  if (!isSupabaseConfigured() || !process.env.SUPABASE_SERVICE_ROLE_KEY) return [];

  const admin = createAdminClient();
  const { data } = await admin
    .from("profiles")
    .select("id, full_name, email, role, balance, vip_level, total_deposited, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  return data ?? [];
}
