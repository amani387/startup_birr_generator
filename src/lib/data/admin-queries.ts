import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export function isAdminConfigured(): boolean {
  return Boolean(
    isSupabaseConfigured() && process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

export async function getAdminStats() {
  if (!isAdminConfigured()) {
    return {
      configured: false,
      totalUsers: 0,
      pendingDeposits: 0,
      pendingWithdrawals: 0,
      activeVipMembers: 0,
      totalDeposited: 0,
      totalWithdrawn: 0,
      platformBalance: 0,
    };
  }

  const admin = createAdminClient();

  const [
    { count: totalUsers },
    { count: pendingDeposits },
    { count: pendingWithdrawals },
    { count: activeVipMembers },
    { data: depositRows },
    { data: profileRows },
  ] = await Promise.all([
    admin.from("profiles").select("*", { count: "exact", head: true }),
    admin
      .from("deposits")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending"),
    admin
      .from("withdrawals")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending"),
    admin
      .from("vip_purchases")
      .select("*", { count: "exact", head: true })
      .eq("status", "active")
      .gt("expires_at", new Date().toISOString()),
    admin.from("deposits").select("amount, status").eq("status", "approved"),
    admin.from("profiles").select("balance, total_withdrawn"),
  ]);

  const totalDeposited = (depositRows ?? []).reduce(
    (sum, row) => sum + Number(row.amount),
    0
  );
  const platformBalance = (profileRows ?? []).reduce(
    (sum, row) => sum + Number(row.balance),
    0
  );
  const totalWithdrawn = (profileRows ?? []).reduce(
    (sum, row) => sum + Number(row.total_withdrawn),
    0
  );

  return {
    configured: true,
    totalUsers: totalUsers ?? 0,
    pendingDeposits: pendingDeposits ?? 0,
    pendingWithdrawals: pendingWithdrawals ?? 0,
    activeVipMembers: activeVipMembers ?? 0,
    totalDeposited,
    totalWithdrawn,
    platformBalance,
  };
}

export type AdminDepositRow = {
  id: string;
  amount: number;
  payment_method: string;
  status: string;
  screenshot_url: string | null;
  transaction_ref: string | null;
  created_at: string;
  user_id: string;
  profiles: { full_name: string; email: string } | null;
  screenshotSignedUrl: string | null;
};

export async function getAdminPendingDeposits(): Promise<AdminDepositRow[]> {
  if (!isAdminConfigured()) return [];

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("deposits")
    .select(
      "id, amount, payment_method, status, screenshot_url, transaction_ref, created_at, user_id"
    )
    .eq("status", "pending")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("getAdminPendingDeposits:", error.message);
    return [];
  }
  if (!data?.length) return [];

  const userIds = [...new Set(data.map((d) => d.user_id))];
  const { data: profileRows } = await admin
    .from("profiles")
    .select("id, full_name, email")
    .in("id", userIds);

  const profileMap = new Map(
    (profileRows ?? []).map((p) => [p.id, { full_name: p.full_name, email: p.email }])
  );

  const rows: AdminDepositRow[] = [];
  for (const deposit of data) {
    let screenshotSignedUrl: string | null = null;
    if (deposit.screenshot_url) {
      const { data: signed } = await admin.storage
        .from("deposits")
        .createSignedUrl(deposit.screenshot_url, 3600);
      screenshotSignedUrl = signed?.signedUrl ?? null;
    }

    rows.push({
      id: deposit.id,
      amount: Number(deposit.amount),
      payment_method: deposit.payment_method,
      status: deposit.status,
      screenshot_url: deposit.screenshot_url,
      transaction_ref: deposit.transaction_ref,
      created_at: deposit.created_at,
      user_id: deposit.user_id,
      profiles: profileMap.get(deposit.user_id) ?? null,
      screenshotSignedUrl,
    });
  }

  return rows;
}

export async function getAdminPendingWithdrawals() {
  if (!isAdminConfigured()) return [];

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("withdrawals")
    .select(
      "id, amount, payment_method, account_holder, account_number, status, created_at, user_id"
    )
    .eq("status", "pending")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("getAdminPendingWithdrawals:", error.message);
    return [];
  }
  if (!data?.length) return [];

  const userIds = [...new Set(data.map((w) => w.user_id))];
  const { data: profileRows } = await admin
    .from("profiles")
    .select("id, full_name, email")
    .in("id", userIds);

  const profileMap = new Map(
    (profileRows ?? []).map((p) => [p.id, { full_name: p.full_name, email: p.email }])
  );

  return data.map((row) => ({
    ...row,
    amount: Number(row.amount),
    profiles: profileMap.get(row.user_id) ?? null,
  }));
}

export async function getAdminUsers() {
  if (!isAdminConfigured()) return [];

  const admin = createAdminClient();
  const { data } = await admin
    .from("profiles")
    .select(
      "id, full_name, email, role, balance, vip_level, total_deposited, total_withdrawn, total_earned, created_at"
    )
    .order("created_at", { ascending: false })
    .limit(200);

  return (data ?? []).map((row) => ({
    ...row,
    balance: Number(row.balance),
    total_deposited: Number(row.total_deposited),
    total_withdrawn: Number(row.total_withdrawn),
    total_earned: Number(row.total_earned),
  }));
}

export async function getAdminRecentDeposits(limit = 10) {
  if (!isAdminConfigured()) return [];

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("deposits")
    .select("id, amount, payment_method, status, created_at, user_id")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("getAdminRecentDeposits:", error.message);
    return [];
  }
  if (!data?.length) return [];

  const userIds = [...new Set(data.map((d) => d.user_id))];
  const { data: profileRows } = await admin
    .from("profiles")
    .select("id, full_name")
    .in("id", userIds);

  const profileMap = new Map(
    (profileRows ?? []).map((p) => [p.id, { full_name: p.full_name }])
  );

  return data.map((row) => ({
    ...row,
    amount: Number(row.amount),
    profiles: profileMap.get(row.user_id) ?? null,
  }));
}
