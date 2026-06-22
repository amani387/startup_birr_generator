import { createAdminClient } from "@/lib/supabase/admin";

export function isAdminAuthAvailable(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() &&
      process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
  );
}

export function isEmailNotConfirmedError(message: string): boolean {
  const lower = message.toLowerCase();
  return (
    lower.includes("email not confirmed") ||
    lower.includes("email_not_confirmed")
  );
}

export async function confirmUserById(userId: string): Promise<boolean> {
  if (!isAdminAuthAvailable()) return false;

  try {
    const admin = createAdminClient();
    const { error } = await admin.auth.admin.updateUserById(userId, {
      email_confirm: true,
    });
    return !error;
  } catch {
    return false;
  }
}

async function findUserIdByEmail(email: string): Promise<string | null> {
  if (!isAdminAuthAvailable()) return null;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!.trim();
  const filter = `email.eq."${email.replace(/"/g, '\\"')}"`;

  try {
    const res = await fetch(
      `${url}/auth/v1/admin/users?filter=${encodeURIComponent(filter)}&page=1&per_page=1`,
      {
        headers: {
          Authorization: `Bearer ${key}`,
          apikey: key,
        },
        cache: "no-store",
      }
    );

    if (!res.ok) return null;

    const json = (await res.json()) as { users?: { id: string }[] };
    return json.users?.[0]?.id ?? null;
  } catch {
    return null;
  }
}

export async function confirmUserByEmail(email: string): Promise<boolean> {
  const userId = await findUserIdByEmail(email);
  if (!userId) return false;
  return confirmUserById(userId);
}
