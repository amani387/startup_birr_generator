import { createClient } from "@/lib/supabase/server";

export async function getTodayClaimedTaskIds(userId: string): Promise<string[]> {
  const supabase = await createClient();
  const today = new Date().toISOString().slice(0, 10);

  const { data, error } = await supabase
    .from("task_reward_claims")
    .select("task_id")
    .eq("user_id", userId)
    .eq("claim_date", today);

  if (error) {
    console.error("getTodayClaimedTaskIds:", error.message);
    return [];
  }

  return (data ?? []).map((row) => row.task_id);
}
