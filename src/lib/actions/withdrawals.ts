"use server";

import { revalidatePath } from "next/cache";
import { WITHDRAWAL_RULES } from "@/lib/constants";
import { getCurrentProfile } from "@/lib/data/profile";
import { getPlatformSetting } from "@/lib/data/queries";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/types/database";

export async function submitWithdrawal(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const profile = await getCurrentProfile();
  if (!profile) return { error: "Not authenticated." };

  const amount = Number(formData.get("amount"));
  const paymentMethod = String(formData.get("payment_method") ?? "").trim();
  const accountHolder = String(formData.get("account_holder") ?? "").trim();
  const accountNumber = String(formData.get("account_number") ?? "").trim();

  const retentionPercent = await getPlatformSetting(
    "withdrawal_retention_percent",
    WITHDRAWAL_RULES.retentionPercent
  );
  const minUnlock = await getPlatformSetting(
    "withdrawal_min_balance_unlock",
    WITHDRAWAL_RULES.minBalanceToUnlock
  );
  const minAmount = await getPlatformSetting(
    "withdrawal_min_amount",
    WITHDRAWAL_RULES.minWithdrawalAmount
  );

  if (profile.balance < minUnlock) {
    return {
      error: `You need at least ${minUnlock} Birr balance to unlock withdrawals.`,
    };
  }

  if (!amount || amount < minAmount) {
    return { error: `Minimum withdrawal is ${minAmount} Birr.` };
  }

  const maxWithdrawal = Math.floor(
    profile.balance * (1 - retentionPercent / 100)
  );
  if (amount > maxWithdrawal) {
    return {
      error: `Maximum withdrawable amount is ${maxWithdrawal} Birr (${retentionPercent}% retention).`,
    };
  }

  if (!paymentMethod || !accountHolder || !accountNumber) {
    return { error: "All payment fields are required." };
  }

  if (amount > profile.balance) {
    return { error: "Insufficient balance." };
  }

  const supabase = await createClient();

  const { error: insertError } = await supabase.from("withdrawals").insert({
    user_id: profile.id,
    amount,
    payment_method: paymentMethod,
    account_holder: accountHolder,
    account_number: accountNumber,
    status: "pending",
  });

  if (insertError) return { error: insertError.message };

  const { error: balanceError } = await supabase
    .from("profiles")
    .update({
      balance: profile.balance - amount,
      updated_at: new Date().toISOString(),
    })
    .eq("id", profile.id);

  if (balanceError) return { error: balanceError.message };

  revalidatePath("/dashboard/withdrawals");
  revalidatePath("/dashboard");
  revalidatePath("/admin/withdrawals");
  return { success: "Withdrawal request submitted. Awaiting admin approval." };
}
