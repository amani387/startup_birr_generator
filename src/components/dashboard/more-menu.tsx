"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpFromLine,
  History,
  LogOut,
  Network,
  Settings,
  Sparkles,
  X,
} from "lucide-react";
import { logout } from "@/lib/actions/auth";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { SECONDARY_NAV } from "@/lib/i18n/index";
import { useTranslation } from "@/components/providers/i18n-provider";
import { cn } from "@/lib/utils";

const iconMap = {
  ArrowUpFromLine,
  History,
  Sparkles,
  Settings,
  Network,
};

type MoreMenuProps = {
  open: boolean;
  onClose: () => void;
};

export function MoreMenu({ open, onClose }: MoreMenuProps) {
  const pathname = usePathname();
  const t = useTranslation();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-[var(--overlay)] backdrop-blur-sm"
            onClick={onClose}
            aria-label="Close menu"
          />
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="glass-card fixed left-1/2 top-20 z-[70] w-[min(calc(100%-2rem),22rem)] -translate-x-1/2 p-4 md:right-6 md:left-auto md:top-16 md:translate-x-0"
          >
            <div className="mb-3 flex items-center justify-between">
              <p className="font-display text-sm font-bold">{t("nav.more")}</p>
              <button
                type="button"
                onClick={onClose}
                className="interactive-hover rounded-lg p-1.5 text-muted"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-1">
              {SECONDARY_NAV.map((item) => {
                const Icon = iconMap[item.icon as keyof typeof iconMap];
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted interactive-hover hover:text-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {t(item.key)}
                  </Link>
                );
              })}
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-border pt-3 md:hidden">
              <LanguageSwitcher compact className="min-w-0 flex-1" />
              <ThemeToggle compact />
            </div>
            <form action={logout} className="mt-3 border-t border-border pt-3">
              <button
                type="submit"
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10"
              >
                <LogOut className="h-4 w-4" />
                {t("nav.logout")}
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
