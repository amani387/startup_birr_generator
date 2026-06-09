import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/types/database";

function mapProfile(row: Record<string, unknown>): Profile {
  return {
    id: row.id as string,
    full_name: row.full_name as string,
    email: row.email as string,
    referral_code: row.referral_code as string,
    referred_by: row.referred_by as string | null,
    role: row.role as Profile["role"],
    balance: Number(row.balance),
    total_earned: Number(row.total_earned),
    total_deposited: Number(row.total_deposited),
    total_withdrawn: Number(row.total_withdrawn),
    vip_level: Number(row.vip_level),
    daily_streak: Number(row.daily_streak),
    last_daily_claim: row.last_daily_claim as string | null,
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
  };
}

export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function getCurrentProfile(): Promise<Profile | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error || !data) return null;
  return mapProfile(data);
}

export async function requireProfile(): Promise<Profile> {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");
  return profile;
}

export function getVipProgress(profile: Profile, nextPlanPrice: number | null) {
  if (!nextPlanPrice || profile.vip_level >= 5) {
    return { progressPercent: 100, amountToNext: 0 };
  }

  const progressPercent = Math.min(
    100,
    Math.round((profile.total_deposited / nextPlanPrice) * 100)
  );
  const amountToNext = Math.max(0, nextPlanPrice - profile.total_deposited);

  return { progressPercent, amountToNext };
}

export function canClaimDailyReward(profile: Profile): boolean {
  if (!profile.last_daily_claim) return true;
  const today = new Date().toISOString().slice(0, 10);
  return profile.last_daily_claim !== today;
}
