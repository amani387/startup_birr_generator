"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { BarChart3, Briefcase, Headphones, LayoutDashboard, TrendingUp } from "lucide-react";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { DESKTOP_NAV } from "@/lib/i18n/index";
import { useTranslation } from "@/components/providers/i18n-provider";
import { cn } from "@/lib/utils";

const iconMap = {
  LayoutDashboard,
  Briefcase,
  TrendingUp,
  Headphones,
};

type TopNavProps = {
  userName: string;
  onOpenMore: () => void;
};

export function TopNav({ userName, onOpenMore }: TopNavProps) {
  const pathname = usePathname();
  const t = useTranslation();

  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <motion.header
      initial={false}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="glass-panel fixed inset-x-0 top-0 z-50 hidden md:block"
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-6">
        <Link href="/dashboard" className="flex shrink-0 items-center gap-2.5">
          <BarChart3 className="h-7 w-7 text-primary" strokeWidth={2.5} />
          <span className="font-display text-lg font-bold text-foreground">
            {t("common.appName")}
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          {DESKTOP_NAV.map((item) => {
            const Icon = iconMap[item.icon as keyof typeof iconMap];
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-4 py-2 text-sm transition-all duration-200",
                  isActive
                    ? "nav-top-active"
                    : "text-muted hover:bg-foreground/5 hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {t(item.key)}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <LanguageSwitcher compact />
          <ThemeToggle compact />
          <button
            type="button"
            onClick={onOpenMore}
            className="interactive-hover rounded-lg px-3 py-2 text-xs font-medium text-muted transition-colors hover:text-foreground"
          >
            {t("nav.more")}
          </button>
          <Link
            href="/dashboard/profile"
            className="flex items-center gap-2 rounded-xl border border-border bg-surface-bright py-1.5 pl-1.5 pr-3 transition-colors hover:border-primary/30"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-xs font-bold text-white">
              {initials}
            </div>
            <span className="max-w-[88px] truncate text-sm font-medium">
              {userName}
            </span>
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
