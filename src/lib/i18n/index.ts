import { am } from "./locales/am";
import { en } from "./locales/en";
import { om } from "./locales/om";

export type Locale = "en" | "am" | "om";

export const LOCALES: { code: Locale; label: string; nativeLabel: string }[] = [
  { code: "en", label: "English", nativeLabel: "English" },
  { code: "am", label: "Amharic", nativeLabel: "አማርኛ" },
  { code: "om", label: "Afaan Oromo", nativeLabel: "Afaan Oromoo" },
];

export const defaultLocale: Locale = "en";

export type Dictionary = {
  common: Record<string, string>;
  nav: Record<string, string>;
  auth: Record<string, string>;
  dashboard: Record<string, string>;
};

export const dictionaries: Record<Locale, Dictionary> = {
  en: en as Dictionary,
  am: am as Dictionary,
  om: om as Dictionary,
};

export function getNestedValue(
  obj: Record<string, unknown>,
  path: string
): string {
  const keys = path.split(".");
  let current: unknown = obj;
  for (const key of keys) {
    if (current && typeof current === "object" && key in current) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return path;
    }
  }
  return typeof current === "string" ? current : path;
}

export function createTranslator(dict: Dictionary) {
  return (key: string) =>
    getNestedValue(dict as unknown as Record<string, unknown>, key);
}

export const NAV_KEYS = [
  { href: "/dashboard", key: "nav.dashboard", icon: "LayoutDashboard" },
  { href: "/dashboard/vip-packages", key: "nav.vipPackages", icon: "Crown" },
  { href: "/dashboard/deposits", key: "nav.deposits", icon: "ArrowDownToLine" },
  { href: "/dashboard/withdrawals", key: "nav.withdrawals", icon: "ArrowUpFromLine" },
  {
    href: "/dashboard/withdrawal-settings",
    key: "nav.withdrawalSettings",
    icon: "Settings",
  },
  { href: "/dashboard/referral", key: "nav.referral", icon: "Users" },
  { href: "/dashboard/affiliate", key: "nav.affiliate", icon: "Network" },
  { href: "/dashboard/vip-upgrades", key: "nav.vipUpgrades", icon: "TrendingUp" },
  { href: "/dashboard/transactions", key: "nav.transactions", icon: "History" },
  { href: "/dashboard/profile", key: "nav.profile", icon: "User" },
] as const;

export const MOBILE_NAV_KEYS = [
  { href: "/dashboard", key: "nav.dashboard", icon: "LayoutDashboard" },
  { href: "/dashboard/vip-packages", key: "nav.vipPackages", icon: "Crown" },
  { href: "/dashboard/deposits", key: "nav.deposits", icon: "ArrowDownToLine" },
  { href: "/dashboard/referral", key: "nav.referral", icon: "Users" },
  { href: "/dashboard/profile", key: "nav.profile", icon: "User" },
] as const;
