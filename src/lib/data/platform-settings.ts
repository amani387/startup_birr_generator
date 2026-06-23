import { createClient } from "@/lib/supabase/server";
import {
  buildDepositPaymentMethods,
  buildSocialTasks,
  DEFAULT_PLATFORM_CONTACT,
  PLATFORM_CONTACT_KEYS,
  type PlatformContactSettings,
} from "@/lib/platform-contact";

function parseJsonbString(value: unknown, fallback: string): string {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return fallback;
}

export async function getPlatformContactSettings(): Promise<PlatformContactSettings> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("platform_settings")
    .select("key, value")
    .in("key", [...PLATFORM_CONTACT_KEYS]);

  const settings = { ...DEFAULT_PLATFORM_CONTACT };

  for (const row of data ?? []) {
    const key = row.key as keyof PlatformContactSettings;
    if (key in settings) {
      settings[key] = parseJsonbString(row.value, settings[key]);
    }
  }

  return settings;
}

export async function getDepositPaymentMethods() {
  const settings = await getPlatformContactSettings();
  return buildDepositPaymentMethods(settings);
}

export async function getSocialTasks() {
  const settings = await getPlatformContactSettings();
  return buildSocialTasks(settings);
}
