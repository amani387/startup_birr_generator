"use client";

import { useState } from "react";
import { Bell, Menu } from "lucide-react";
import { BrandLogo } from "@/components/ui/brand-logo";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Sidebar } from "@/components/dashboard/sidebar";
import { MobileBottomNav } from "@/components/dashboard/mobile-bottom-nav";
import { useTranslation } from "@/components/providers/i18n-provider";

type DashboardShellProps = {
  userName?: string;
  children: React.ReactNode;
};

export function DashboardShell({ userName = "Member", children }: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const t = useTranslation();

  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-dvh">
      <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-border bg-surface/80 px-4 py-3 backdrop-blur-xl sm:px-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="touch-target rounded-xl border border-border bg-surface-bright p-2.5 text-foreground lg:hidden"
                aria-label={t("common.menu")}
              >
                <Menu className="h-5 w-5" />
              </button>
              <div className="min-w-0">
                <div className="flex items-center gap-2 lg:hidden">
                  <BrandLogo size={28} />
                  <span className="font-display truncate text-base font-bold text-primary">
                    {t("common.appName")}
                  </span>
                </div>
                <p className="hidden text-xs text-muted lg:block">
                  {t("common.tagline")}
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              <div className="hidden sm:block">
                <LanguageSwitcher compact />
              </div>
              <div className="hidden sm:block">
                <ThemeToggle compact />
              </div>
              <button
                type="button"
                className="touch-target relative rounded-xl border border-border bg-surface-bright p-2.5 text-muted transition-colors hover:text-foreground"
                aria-label={t("common.notifications")}
              >
                <Bell className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-2 rounded-xl border border-border bg-surface-bright py-1.5 pl-1.5 pr-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-dim text-xs font-bold text-primary">
                  {initials}
                </div>
                <span className="hidden max-w-[100px] truncate text-sm font-medium sm:inline">
                  {userName}
                </span>
              </div>
            </div>
          </div>
        </header>

        <main className="page-container">{children}</main>
      </div>

      <MobileBottomNav />
    </div>
  );
}
