import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import {
  ADMIN_PAGE_SIZE,
  adminPageRange,
  buildPaginatedResult,
  type PaginatedResult,
} from "@/lib/admin-pagination";

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

export type AdminWithdrawalRow = {
  id: string;
  amount: number;
  payment_method: string;
  account_holder: string;
  account_number: string;
  status: string;
  created_at: string;
  user_id: string;
  profiles: { full_name: string; email: string } | null;
};

export type AdminUserRow = {
  id: string;
  full_name: string;
  email: string;
  role: "user" | "admin";
  balance: number;
  vip_level: number;
  total_deposited: number;
  total_withdrawn: number;
  total_earned: number;
  created_at: string;
};

async function attachProfiles<T extends { user_id: string }>(
  admin: ReturnType<typeof createAdminClient>,
  rows: T[]
): Promise<Map<string, { full_name: string; email: string }>> {
  const userIds = [...new Set(rows.map((r) => r.user_id))];
  if (!userIds.length) return new Map();

  const { data: profileRows } = await admin
    .from("profiles")
    .select("id, full_name, email")
    .in("id", userIds);

  return new Map(
    (profileRows ?? []).map((p) => [p.id, { full_name: p.full_name, email: p.email }])
  );
}

export async function getAdminDeposits(options: {
  page: number;
  status?: "all" | "pending" | "approved" | "rejected";
}): Promise<PaginatedResult<AdminDepositRow>> {
  const empty = buildPaginatedResult<AdminDepositRow>([], 0, options.page);
  if (!isAdminConfigured()) return empty;

  const admin = createAdminClient();
  const { from, to } = adminPageRange(options.page);

  let query = admin
    .from("deposits")
    .select(
      "id, amount, payment_method, status, screenshot_url, transaction_ref, created_at, user_id",
      { count: "exact" }
    )
    .order("created_at", { ascending: false });

  if (options.status && options.status !== "all") {
    query = query.eq("status", options.status);
  }

  const { data, count, error } = await query.range(from, to);

  if (error) {
    console.error("getAdminDeposits:", error.message);
    return empty;
  }
  if (!data?.length) {
    return buildPaginatedResult([], count ?? 0, options.page);
  }

  const profileMap = await attachProfiles(admin, data);
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

  return buildPaginatedResult(rows, count ?? 0, options.page);
}

export async function getAdminWithdrawals(options: {
  page: number;
  status?: "all" | "pending" | "approved" | "rejected";
}): Promise<PaginatedResult<AdminWithdrawalRow>> {
  const empty = buildPaginatedResult<AdminWithdrawalRow>([], 0, options.page);
  if (!isAdminConfigured()) return empty;

  const admin = createAdminClient();
  const { from, to } = adminPageRange(options.page);

  let query = admin
    .from("withdrawals")
    .select(
      "id, amount, payment_method, account_holder, account_number, status, created_at, user_id",
      { count: "exact" }
    )
    .order("created_at", { ascending: false });

  if (options.status && options.status !== "all") {
    query = query.eq("status", options.status);
  }

  const { data, count, error } = await query.range(from, to);

  if (error) {
    console.error("getAdminWithdrawals:", error.message);
    return empty;
  }
  if (!data?.length) {
    return buildPaginatedResult([], count ?? 0, options.page);
  }

  const profileMap = await attachProfiles(admin, data);

  const items = data.map((row) => ({
    id: row.id,
    amount: Number(row.amount),
    payment_method: row.payment_method,
    account_holder: row.account_holder,
    account_number: row.account_number,
    status: row.status,
    created_at: row.created_at,
    user_id: row.user_id,
    profiles: profileMap.get(row.user_id) ?? null,
  }));

  return buildPaginatedResult(items, count ?? 0, options.page);
}

export async function getAdminUsers(options: {
  page: number;
  search?: string;
}): Promise<PaginatedResult<AdminUserRow>> {
  const empty = buildPaginatedResult<AdminUserRow>([], 0, options.page);
  if (!isAdminConfigured()) return empty;

  const admin = createAdminClient();
  const { from, to } = adminPageRange(options.page);

  let query = admin
    .from("profiles")
    .select(
      "id, full_name, email, role, balance, vip_level, total_deposited, total_withdrawn, total_earned, created_at",
      { count: "exact" }
    )
    .order("created_at", { ascending: false });

  const search = options.search?.trim();
  if (search) {
    const safe = search.replace(/[%_]/g, "");
    query = query.or(`full_name.ilike.%${safe}%,email.ilike.%${safe}%`);
  }

  const { data, count, error } = await query.range(from, to);

  if (error) {
    console.error("getAdminUsers:", error.message);
    return empty;
  }

  const items = (data ?? []).map((row) => ({
    id: row.id,
    full_name: row.full_name,
    email: row.email,
    role: row.role as "user" | "admin",
    balance: Number(row.balance),
    vip_level: Number(row.vip_level),
    total_deposited: Number(row.total_deposited),
    total_withdrawn: Number(row.total_withdrawn),
    total_earned: Number(row.total_earned),
    created_at: row.created_at,
  }));

  return buildPaginatedResult(items, count ?? 0, options.page);
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

/** @deprecated Use getAdminDeposits */
export async function getAdminPendingDeposits() {
  const result = await getAdminDeposits({ page: 1, status: "pending" });
  return result.items;
}

/** @deprecated Use getAdminWithdrawals */
export async function getAdminPendingWithdrawals() {
  const result = await getAdminWithdrawals({ page: 1, status: "pending" });
  return result.items;
}
