"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getReferralRewardForLevel } from "@/lib/constants";
import { getCurrentProfile } from "@/lib/data/profile";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/types/database";

export async function purchaseVipPlan(planId: string): Promise<ActionResult> {
  const profile = await getCurrentProfile();
  if (!profile) return { error: "Not authenticated." };

  const supabase = await createClient();
  const { data: plan, error: planError } = await supabase
    .from("vip_plans")
    .select("*")
    .eq("id", planId)
    .eq("active", true)
    .single();

  if (planError || !plan) return { error: "VIP plan not found." };

  const price = Number(plan.price);
  if (profile.balance < price) {
    return { error: "Insufficient balance. Please deposit first." };
  }

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + plan.duration_days);

  const { data: purchase, error: purchaseError } = await supabase
    .from("vip_purchases")
    .insert({
      user_id: profile.id,
      plan_id: plan.id,
      amount_paid: price,
      daily_income: plan.daily_income,
      expires_at: expiresAt.toISOString(),
      status: "active",
    })
    .select("id")
    .single();

  if (purchaseError || !purchase) {
    return { error: purchaseError?.message ?? "Could not complete purchase." };
  }

  const newBalance = profile.balance - price;
  const newVipLevel = Math.max(profile.vip_level, plan.level);

  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      balance: newBalance,
      vip_level: newVipLevel,
      updated_at: new Date().toISOString(),
    })
    .eq("id", profile.id);

  if (profileError) return { error: profileError.message };

  if (profile.referred_by) {
    const reward = getReferralRewardForLevel(plan.level);
    if (reward > 0) {
      await supabase.from("referral_commissions").insert({
        beneficiary_id: profile.referred_by,
        source_user_id: profile.id,
        vip_purchase_id: purchase.id,
        level: 1,
        commission_percent: 15,
        amount: reward,
      });

      const { data: referrer } = await supabase
        .from("profiles")
        .select("balance, total_earned")
        .eq("id", profile.referred_by)
        .single();

      if (referrer) {
        await supabase
          .from("profiles")
          .update({
            balance: Number(referrer.balance) + reward,
            total_earned: Number(referrer.total_earned) + reward,
          })
          .eq("id", profile.referred_by);

        await supabase.from("earnings").insert({
          user_id: profile.referred_by,
          type: "referral_commission",
          amount: reward,
          source_id: purchase.id,
          description: `VIP ${plan.level} invitation bonus`,
        });
      }
    }
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/vip-packages");
  revalidatePath("/dashboard/referral");
  revalidatePath("/dashboard/affiliate");
  return { success: `${plan.name} purchased successfully!` };
}
