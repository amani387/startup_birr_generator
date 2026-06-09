"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowDownToLine,
  Crown,
  LayoutDashboard,
  User,
  Users,
} from "lucide-react";
import { MOBILE_NAV_KEYS } from "@/lib/i18n/index";
import { useTranslation } from "@/components/providers/i18n-provider";
import { cn } from "@/lib/utils";

const iconMap = {
  LayoutDashboard,
  Crown,
  ArrowDownToLine,
  Users,
  User,
};

export function MobileBottomNav() {
  const pathname = usePathname();
  const t = useTranslation();

  return (
    <nav className="safe-bottom fixed inset-x-0 bottom-0 z-50 border-t border-border bg-surface/95 px-2 pb-2 pt-1.5 backdrop-blur-xl lg:hidden">
      <div className="mx-auto flex max-w-lg items-stretch justify-around gap-0.5">
        {MOBILE_NAV_KEYS.map((item) => {
          const Icon = iconMap[item.icon as keyof typeof iconMap];
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-h-[52px] min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-1.5 text-[10px] font-medium transition-all duration-200 sm:text-xs",
                isActive
                  ? "bg-primary-dim text-primary"
                  : "text-muted active:bg-foreground/5"
              )}
            >
              <Icon className={cn("h-5 w-5 shrink-0", isActive && "scale-110")} />
              <span className="max-w-full truncate leading-tight">
                {t(item.key)}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
