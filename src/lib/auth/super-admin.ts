import { SUPER_ADMIN_EMAIL } from "@/lib/constants";

export function isSuperAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return email.trim().toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();
}

export function isSuperAdminProfile(profile: { email: string }): boolean {
  return isSuperAdminEmail(profile.email);
}
