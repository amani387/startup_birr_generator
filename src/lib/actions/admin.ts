"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/data/profile";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { ActionResult } from "@/types/database";

async function assertAdmin() {
  await requireAdmin();
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Admin service role key is not configured.");
  }
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
