"use server";

import { revalidatePath } from "next/cache";
import { getSocialTaskById } from "@/lib/constants";
import { getCurrentProfile } from "@/lib/data/profile";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/types/database";

export async function claimSocialTask(taskId: string): Promise<ActionResult> {
  const profile = await getCurrentProfile();
  if (!profile) return { error: "Not authenticated." };

  const task = getSocialTaskById(taskId);
  if (!task) return { error: "Invalid task." };

  const today = new Date().toISOString().slice(0, 10);
  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("task_reward_claims")
    .select("id")
    .eq("user_id", profile.id)
    .eq("task_id", taskId)
    .eq("claim_date", today)
    .maybeSingle();

  if (existing) {
    return { error: "You already claimed this task today." };
  }

  const { error: claimError } = await supabase.from("task_reward_claims").insert({
    user_id: profile.id,
    task_id: taskId,
    amount: task.reward,
    claim_date: today,
  });

  if (claimError) {
    if (claimError.code === "23505") {
      return { error: "You already claimed this task today." };
    }
    return { error: claimError.message };
  }

  const { error: earningError } = await supabase.from("earnings").insert({
    user_id: profile.id,
    type: "task_reward",
    amount: task.reward,
    description: task.label,
  });

  if (earningError) return { error: earningError.message };

  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      balance: profile.balance + task.reward,
      total_earned: profile.total_earned + task.reward,
    })
    .eq("id", profile.id);

  if (profileError) return { error: profileError.message };

  revalidatePath("/dashboard");
  return { success: `+${task.reward} Birr — ${task.label}` };
}
