"use server";

import { revalidatePath } from "next/cache";
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
    const { error: referralError } = await supabase.rpc(
      "process_referral_commissions",
      {
        p_purchase_id: purchase.id,
        p_buyer_id: profile.id,
        p_plan_level: plan.level,
        p_plan_price: price,
      }
    );

    if (referralError) {
      console.error("Referral commission failed:", referralError.message);
    }
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/vip-packages");
  revalidatePath("/dashboard/referral");
  revalidatePath("/dashboard/affiliate");
  return { success: `${plan.name} purchased successfully!` };
}

export async function claimVipDailyIncome(): Promise<ActionResult> {
  const profile = await getCurrentProfile();
  if (!profile) return { error: "Not authenticated." };

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("claim_vip_daily_income");

  if (error) return { error: error.message };

  const result = data as { error?: string; success?: string; amount?: number };
  if (result.error) return { error: result.error };

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/transactions");
  revalidatePath("/dashboard/vip-packages");
  return {
    success:
      result.success ??
      `Claimed ${result.amount ?? ""} Birr VIP income!`.trim(),
  };
}
