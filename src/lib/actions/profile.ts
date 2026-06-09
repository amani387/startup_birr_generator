"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/data/profile";
import { getPlatformSetting } from "@/lib/data/queries";
import type { ActionResult } from "@/types/database";

export async function updateProfile(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const profile = await getCurrentProfile();
  if (!profile) return { error: "Not authenticated." };

  const fullName = String(formData.get("full_name") ?? "").trim();
  if (!fullName) return { error: "Full name is required." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ full_name: fullName })
    .eq("id", profile.id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/profile");
  revalidatePath("/dashboard");
  return { success: "Profile updated successfully." };
}

export async function updatePassword(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const newPassword = String(formData.get("new_password") ?? "");
  const confirmPassword = String(formData.get("confirm_password") ?? "");

  if (!newPassword || newPassword.length < 6) {
    return { error: "New password must be at least 6 characters." };
  }

  if (newPassword !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: newPassword });

  if (error) return { error: error.message };

  return { success: "Password updated successfully." };
}

export async function saveWithdrawalSettings(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const profile = await getCurrentProfile();
  if (!profile) return { error: "Not authenticated." };

  const paymentMethod = String(formData.get("payment_method") ?? "").trim();
  const accountHolder = String(formData.get("account_holder") ?? "").trim();
  const accountNumber = String(formData.get("account_number") ?? "").trim();

  if (!paymentMethod || !accountHolder || !accountNumber) {
    return { error: "All payment fields are required." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("withdrawal_settings").upsert({
    user_id: profile.id,
    payment_method: paymentMethod,
    account_holder: accountHolder,
    account_number: accountNumber,
    updated_at: new Date().toISOString(),
  });

  if (error) return { error: error.message };

  revalidatePath("/dashboard/withdrawal-settings");
  revalidatePath("/dashboard/withdrawals");
  return { success: "Withdrawal settings saved." };
}

export async function claimDailyReward(): Promise<ActionResult> {
  const profile = await getCurrentProfile();
  if (!profile) return { error: "Not authenticated." };

  const today = new Date().toISOString().slice(0, 10);
  if (profile.last_daily_claim === today) {
    return { error: "You already claimed today's reward." };
  }

  const rewardAmount = await getPlatformSetting("daily_reward_amount", 5);
  const streakBonusDay = await getPlatformSetting("daily_streak_bonus_day", 7);

  let newStreak = 1;
  if (profile.last_daily_claim) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().slice(0, 10);
    newStreak =
      profile.last_daily_claim === yesterdayStr
        ? profile.daily_streak + 1
        : 1;
  }

  if (newStreak > streakBonusDay) newStreak = 1;

  const bonusAmount =
    newStreak === streakBonusDay ? rewardAmount * 2 : rewardAmount;

  const supabase = await createClient();

  const { error: claimError } = await supabase.from("daily_reward_claims").insert({
    user_id: profile.id,
    amount: bonusAmount,
    streak_day: newStreak,
  });

  if (claimError) return { error: claimError.message };

  const { error: earningError } = await supabase.from("earnings").insert({
    user_id: profile.id,
    type: "daily_reward",
    amount: bonusAmount,
    description: `Daily reward — day ${newStreak}`,
  });

  if (earningError) return { error: earningError.message };

  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      balance: profile.balance + bonusAmount,
      total_earned: profile.total_earned + bonusAmount,
      daily_streak: newStreak,
      last_daily_claim: today,
    })
    .eq("id", profile.id);

  if (profileError) return { error: profileError.message };

  revalidatePath("/dashboard");
  return { success: `Claimed ${bonusAmount} Birr!` };
}
