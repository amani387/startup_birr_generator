"use client";

import { useState } from "react";
import { Bell, Menu } from "lucide-react";
import { BrandLogo } from "@/components/ui/brand-logo";
import { FloatingBottomNav } from "@/components/dashboard/floating-bottom-nav";
import { MoreMenu } from "@/components/dashboard/more-menu";
import { TopNav } from "@/components/dashboard/top-nav";
import { useTranslation } from "@/components/providers/i18n-provider";

type DashboardShellProps = {
  userName?: string;
  children: React.ReactNode;
};

export function DashboardShell({ userName = "Member", children }: DashboardShellProps) {
  const [moreOpen, setMoreOpen] = useState(false);
  const t = useTranslation();

  return (
    <div className="min-h-dvh">
      <TopNav userName={userName} onOpenMore={() => setMoreOpen(true)} />

      {/* Mobile minimal header */}
      <header className="glass-panel fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between px-4 md:hidden">
        <div className="flex items-center gap-2">
          <BrandLogo size={28} />
          <span className="font-display text-base font-bold text-primary">
            {t("common.appName")}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="touch-target rounded-full p-2 text-muted"
            aria-label={t("common.notifications")}
          >
            <Bell className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => setMoreOpen(true)}
            className="touch-target rounded-full p-2 text-muted"
            aria-label={t("nav.more")}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      <MoreMenu open={moreOpen} onClose={() => setMoreOpen(false)} />

      <main className="page-container">{children}</main>

      <FloatingBottomNav />
    </div>
  );
}
