"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/data/profile";
import {
  DEFAULT_PLATFORM_CONTACT,
  PLATFORM_CONTACT_KEYS,
  type PlatformContactSettings,
} from "@/lib/platform-contact";
import { createAdminClient } from "@/lib/supabase/admin";
import type { ActionResult } from "@/types/database";

const FIELD_LABELS: Record<keyof PlatformContactSettings, string> = {
  telebirr_phone: "Telebirr phone number",
  telebirr_account_holder: "Telebirr account holder",
  cbe_account_number: "CBE account number",
  cbe_account_holder: "CBE account holder",
  youtube_channel_url: "YouTube channel URL",
  telegram_group_url: "Telegram group URL",
  telegram_channel_url: "Telegram channel URL",
  twitter_url: "Twitter / X profile URL",
  facebook_page_url: "Facebook page URL",
};

export async function updatePlatformContactSettings(
  formData: FormData
): Promise<ActionResult> {
  await requireAdmin();

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return { error: "Admin service role key is not configured." };
  }

  const admin = createAdminClient();
  const updates: PlatformContactSettings = { ...DEFAULT_PLATFORM_CONTACT };

  for (const key of PLATFORM_CONTACT_KEYS) {
    const raw = formData.get(key)?.toString().trim() ?? "";
    if (!raw) {
      return { error: `${FIELD_LABELS[key]} is required.` };
    }
    if (key.endsWith("_url") && !/^https?:\/\//i.test(raw)) {
      return { error: `${FIELD_LABELS[key]} must start with http:// or https://` };
    }
    updates[key] = raw;
  }

  for (const key of PLATFORM_CONTACT_KEYS) {
    const { error } = await admin.from("platform_settings").upsert(
      {
        key,
        value: updates[key],
        updated_at: new Date().toISOString(),
      },
      { onConflict: "key" }
    );

    if (error) {
      return { error: `Failed to save ${FIELD_LABELS[key]}.` };
    }
  }

  revalidatePath("/admin/settings");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/deposits");

  return { success: "Payment and social contact details updated." };
}
