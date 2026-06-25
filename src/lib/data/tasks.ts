import { createClient } from "@/lib/supabase/server";

export async function getClaimedTaskIds(userId: string): Promise<string[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("task_reward_claims")
    .select("task_id")
    .eq("user_id", userId);

  if (error) {
    console.error("getClaimedTaskIds:", error.message);
    return [];
  }

  return (data ?? []).map((row) => row.task_id);
}
