"use client";

import { LogOut } from "lucide-react";
import { logout } from "@/lib/actions/auth";
import { useTranslation } from "@/components/providers/i18n-provider";

export function LogoutButton() {
  const t = useTranslation();

  return (
    <form action={logout}>
      <button
        type="submit"
        className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-red-500/10 hover:text-red-500"
      >
        <LogOut className="h-4 w-4" />
        {t("nav.logout")}
      </button>
    </form>
  );
}
