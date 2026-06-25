"use server";

import { revalidatePath } from "next/cache";
import { isSuperAdminEmail, isSuperAdminProfile } from "@/lib/auth/super-admin";
import { requireAdmin } from "@/lib/data/profile";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { ActionResult } from "@/types/database";

async function assertAdmin() {
  const profile = await requireAdmin();
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Admin service role key is not configured.");
  }
  return profile;
}

async function purgeUserDataForDeletion(
  admin: ReturnType<typeof createAdminClient>,
  userId: string
): Promise<string | null> {
  const { data: deposits } = await admin
    .from("deposits")
    .select("screenshot_url")
    .eq("user_id", userId);

  const screenshotPaths = (deposits ?? [])
    .map((row) => row.screenshot_url)
    .filter((path): path is string => Boolean(path));

  if (screenshotPaths.length > 0) {
    await admin.storage.from("deposits").remove(screenshotPaths);
  }

  await admin.from("profiles").update({ referred_by: null }).eq("referred_by", userId);
  await admin.from("deposits").update({ reviewed_by: null }).eq("reviewed_by", userId);
  await admin.from("withdrawals").update({ reviewed_by: null }).eq("reviewed_by", userId);

  const { data: purchases } = await admin
    .from("vip_purchases")
    .select("id")
    .eq("user_id", userId);

  const purchaseIds = (purchases ?? []).map((row) => row.id);

  if (purchaseIds.length > 0) {
    const { error } = await admin
      .from("referral_commissions")
      .delete()
      .in("vip_purchase_id", purchaseIds);
    if (error) return error.message;
  }

  const { error: commissionError } = await admin
    .from("referral_commissions")
    .delete()
    .or(`beneficiary_id.eq.${userId},source_user_id.eq.${userId}`);

  if (commissionError) return commissionError.message;

  const userTables = [
    "vip_income_claims",
    "task_reward_claims",
    "daily_reward_claims",
    "notifications",
    "earnings",
    "vip_purchases",
    "deposits",
    "withdrawals",
    "withdrawal_settings",
  ] as const;

  for (const table of userTables) {
    const { error } = await admin.from(table).delete().eq("user_id", userId);
    if (error) return error.message;
  }

  return null;
}

export async function reviewDeposit(
  depositId: string,
  action: "approved" | "rejected",
  note?: string
): Promise<ActionResult> {
  await assertAdmin();
  const admin = createAdminClient();

  const { data: deposit, error: fetchError } = await admin
    .from("deposits")
    .select("*")
    .eq("id", depositId)
    .single();

  if (fetchError || !deposit) return { error: "Deposit not found." };
  if (deposit.status !== "pending") return { error: "Deposit already reviewed." };

  const profile = await requireAdmin();

  const { error: updateError } = await admin
    .from("deposits")
    .update({
      status: action,
      admin_note: note ?? null,
      reviewed_by: profile.id,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", depositId);

  if (updateError) return { error: updateError.message };

  if (action === "approved") {
    const { data: userProfile } = await admin
      .from("profiles")
      .select("balance, total_deposited")
      .eq("id", deposit.user_id)
      .single();

    if (userProfile) {
      await admin
        .from("profiles")
        .update({
          balance: Number(userProfile.balance) + Number(deposit.amount),
          total_deposited: Number(userProfile.total_deposited) + Number(deposit.amount),
        })
        .eq("id", deposit.user_id);

      await admin.from("earnings").insert({
        user_id: deposit.user_id,
        type: "bonus",
        amount: deposit.amount,
        source_id: depositId,
        description: `Deposit approved via ${deposit.payment_method}`,
      });
    }
  }

  revalidatePath("/admin");
  revalidatePath("/admin/deposits");
  revalidatePath("/dashboard/deposits");
  return { success: `Deposit ${action}.` };
}

export async function reviewWithdrawal(
  withdrawalId: string,
  action: "approved" | "rejected",
  note?: string
): Promise<ActionResult> {
  await assertAdmin();
  const admin = createAdminClient();

  const { data: withdrawal, error: fetchError } = await admin
    .from("withdrawals")
    .select("*")
    .eq("id", withdrawalId)
    .single();

  if (fetchError || !withdrawal) return { error: "Withdrawal not found." };
  if (withdrawal.status !== "pending") return { error: "Withdrawal already reviewed." };

  const profile = await requireAdmin();

  const { error: updateError } = await admin
    .from("withdrawals")
    .update({
      status: action,
      admin_note: note ?? null,
      reviewed_by: profile.id,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", withdrawalId);

  if (updateError) return { error: updateError.message };

  if (action === "approved") {
    const { data: userProfile } = await admin
      .from("profiles")
      .select("total_withdrawn")
      .eq("id", withdrawal.user_id)
      .single();

    if (userProfile) {
      await admin
        .from("profiles")
        .update({
          total_withdrawn:
            Number(userProfile.total_withdrawn) + Number(withdrawal.amount),
        })
        .eq("id", withdrawal.user_id);
    }
  } else {
    const { data: userProfile } = await admin
      .from("profiles")
      .select("balance")
      .eq("id", withdrawal.user_id)
      .single();

    if (userProfile) {
      await admin
        .from("profiles")
        .update({
          balance: Number(userProfile.balance) + Number(withdrawal.amount),
        })
        .eq("id", withdrawal.user_id);
    }
  }

  revalidatePath("/admin");
  revalidatePath("/admin/withdrawals");
  revalidatePath("/dashboard/withdrawals");
  return { success: `Withdrawal ${action}.` };
}

export async function deleteDeposit(depositId: string): Promise<ActionResult> {
  await assertAdmin();
  const admin = createAdminClient();

  const { data: deposit, error: fetchError } = await admin
    .from("deposits")
    .select("*")
    .eq("id", depositId)
    .single();

  if (fetchError || !deposit) return { error: "Deposit not found." };
  if (deposit.status === "approved") {
    return { error: "Cannot delete an approved deposit. Reject is not available after approval." };
  }

  if (deposit.screenshot_url) {
    await admin.storage.from("deposits").remove([deposit.screenshot_url]);
  }

  const { error } = await admin.from("deposits").delete().eq("id", depositId);
  if (error) return { error: error.message };

  revalidatePath("/admin");
  revalidatePath("/admin/deposits");
  return { success: "Deposit deleted." };
}

export async function deleteWithdrawal(withdrawalId: string): Promise<ActionResult> {
  await assertAdmin();
  const admin = createAdminClient();

  const { data: withdrawal, error: fetchError } = await admin
    .from("withdrawals")
    .select("*")
    .eq("id", withdrawalId)
    .single();

  if (fetchError || !withdrawal) return { error: "Withdrawal not found." };

  if (withdrawal.status === "pending") {
    const { data: userProfile } = await admin
      .from("profiles")
      .select("balance")
      .eq("id", withdrawal.user_id)
      .single();

    if (userProfile) {
      await admin
        .from("profiles")
        .update({
          balance: Number(userProfile.balance) + Number(withdrawal.amount),
        })
        .eq("id", withdrawal.user_id);
    }
  }

  const { error } = await admin.from("withdrawals").delete().eq("id", withdrawalId);
  if (error) return { error: error.message };

  revalidatePath("/admin");
  revalidatePath("/admin/withdrawals");
  revalidatePath("/dashboard/withdrawals");
  return { success: "Withdrawal deleted." };
}

export async function deleteUser(userId: string): Promise<ActionResult> {
  const adminProfile = await assertAdmin();
  if (adminProfile.id === userId) {
    return { error: "You cannot delete your own account." };
  }

  const admin = createAdminClient();
  const { data: target } = await admin
    .from("profiles")
    .select("role, email")
    .eq("id", userId)
    .single();

  if (!target) return { error: "User not found." };
  if (isSuperAdminEmail(target.email)) {
    return { error: "The super admin account cannot be deleted." };
  }

  const purgeError = await purgeUserDataForDeletion(admin, userId);
  if (purgeError) {
    return { error: `Could not delete user data: ${purgeError}` };
  }

  const { error } = await admin.auth.admin.deleteUser(userId);
  if (error) return { error: error.message };

  revalidatePath("/admin");
  revalidatePath("/admin/users");
  return { success: "User deleted." };
}

export async function updateUserRole(
  userId: string,
  role: "user" | "admin"
): Promise<ActionResult> {
  const adminProfile = await assertAdmin();

  if (!isSuperAdminProfile(adminProfile)) {
    return { error: "Only the super admin can change user roles." };
  }

  const admin = createAdminClient();
  const { data: target } = await admin
    .from("profiles")
    .select("email, role")
    .eq("id", userId)
    .single();

  if (!target) return { error: "User not found." };

  if (isSuperAdminEmail(target.email) && role !== "admin") {
    return { error: "The super admin account cannot be demoted." };
  }

  if (adminProfile.id === userId && role !== "admin") {
    return { error: "You cannot remove your own admin role." };
  }

  const { error } = await admin
    .from("profiles")
    .update({ role })
    .eq("id", userId);

  if (error) return { error: error.message };

  revalidatePath("/admin/users");
  return { success: `User role updated to ${role}.` };
}
