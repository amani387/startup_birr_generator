"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Crown, Home, Share2, User, Wallet } from "lucide-react";
import { MOBILE_NAV } from "@/lib/i18n/index";
import { useTranslation } from "@/components/providers/i18n-provider";
import { cn } from "@/lib/utils";

const iconMap = { Home, Crown, Wallet, Share2, User };

export function FloatingBottomNav() {
  const pathname = usePathname();
  const t = useTranslation();

  return (
    <motion.nav
      initial={false}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
      className="safe-bottom fixed inset-x-0 bottom-0 z-50 px-5 pb-5 md:hidden"
    >
      <div className="mx-auto flex max-w-sm items-center justify-around gap-1 rounded-full border border-border bg-surface/95 px-3 py-2.5 shadow-[var(--shadow-lg)] backdrop-blur-2xl">
        {MOBILE_NAV.map((item) => {
          const Icon = iconMap[item.icon as keyof typeof iconMap];
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex min-w-[52px] flex-col items-center gap-0.5 rounded-full px-2 py-1.5 transition-all duration-200 active:scale-95",
                isActive ? "text-primary" : "text-muted"
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="nav-glow"
                  className="absolute -bottom-0.5 h-1 w-1 rounded-full bg-primary gold-glow-sm"
                />
              )}
              <Icon
                className={cn(
                  "h-5 w-5",
                  isActive && "gold-glow-sm rounded-full"
                )}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className="text-[10px] font-medium leading-none">
                {t(item.key)}
              </span>
            </Link>
          );
        })}
      </div>
    </motion.nav>
  );
}
