import { cookies } from "next/headers";
import {
  createTranslator,
  defaultLocale,
  dictionaries,
  type Dictionary,
  type Locale,
} from "@/lib/i18n/index";

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const value = cookieStore.get("locale")?.value;
  if (value === "en" || value === "am" || value === "om") return value;
  return defaultLocale;
}

export async function getDictionary(): Promise<Dictionary> {
  const locale = await getLocale();
  return dictionaries[locale];
}

export async function getTranslations() {
  const dict = await getDictionary();
  return createTranslator(dict);
}
