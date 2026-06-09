import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { getCurrentProfile } from "@/lib/data/profile";
import { getTranslations } from "@/lib/i18n/server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getCurrentProfile();
  const t = await getTranslations();

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && !profile) {
    redirect("/login");
  }

  return (
    <DashboardShell userName={profile?.full_name ?? t("common.member")}>
      {children}
    </DashboardShell>
  );
}
