"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Crown,
  History,
  LayoutDashboard,
  Network,
  Settings,
  TrendingUp,
  User,
  Users,
  X,
} from "lucide-react";
import { LogoutButton } from "@/components/dashboard/logout-button";
import { BrandLogo } from "@/components/ui/brand-logo";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { NAV_KEYS } from "@/lib/i18n/index";
import { useTranslation } from "@/components/providers/i18n-provider";
import { cn } from "@/lib/utils";

const iconMap = {
  LayoutDashboard,
  Crown,
  ArrowDownToLine,
  ArrowUpFromLine,
  Settings,
  Users,
  Network,
  TrendingUp,
  History,
  User,
};

type SidebarProps = {
  mobileOpen?: boolean;
  onClose?: () => void;
};

export function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const t = useTranslation();

  const navContent = (
    <>
      <div className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-border px-5">
        <Link
          href="/dashboard"
          onClick={onClose}
          className="flex items-center gap-2.5"
        >
          <BrandLogo size={36} className="rounded-xl" />
          <div>
            <span className="font-display text-lg font-bold tracking-tight text-primary">
              {t("common.appName")}
            </span>
          </div>
        </Link>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="touch-target rounded-xl p-2 text-muted hover:bg-foreground/5 lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-widest text-muted">
          {t("common.menu")}
        </p>
        {NAV_KEYS.map((item) => {
          const Icon = iconMap[item.icon as keyof typeof iconMap];
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex min-h-11 items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "nav-active accent-glow"
                  : "text-muted hover:bg-foreground/5 hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {t(item.key)}
            </Link>
          );
        })}
      </nav>

      <div className="shrink-0 space-y-3 border-t border-border p-4">
        <LanguageSwitcher className="w-full" />
        <ThemeToggle className="w-full" />
        <LogoutButton />
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col border-r border-border bg-surface/95 backdrop-blur-xl lg:flex">
        {navContent}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-[var(--overlay)] backdrop-blur-sm"
            onClick={onClose}
            aria-label="Close overlay"
          />
          <aside className="absolute inset-y-0 left-0 flex w-[min(100%,20rem)] flex-col bg-surface shadow-[var(--shadow-lg)]">
            {navContent}
          </aside>
        </div>
      )}
    </>
  );
}
