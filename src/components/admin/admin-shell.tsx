"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowLeftRight,
  Banknote,
  LayoutDashboard,
  LogOut,
  TrendingUp,
  Users,
  Settings,
  Zap,
} from "lucide-react";
import { logout } from "@/lib/actions/auth";
import { APP_NAME } from "@/lib/constants";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils";

const ADMIN_NAV = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/deposits", label: "Deposits", icon: Banknote },
  { href: "/admin/withdrawals", label: "Withdrawals", icon: ArrowLeftRight },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/vip-income", label: "VIP Income", icon: Zap },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

type AdminShellProps = {
  userName: string;
  children: React.ReactNode;
};

export function AdminShell({ userName, children }: AdminShellProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-dvh">
      <header className="glass-panel border-b border-border">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span className="font-display font-bold text-primary">{APP_NAME}</span>
            <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold uppercase text-primary">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle compact />
            <Link
              href="/dashboard"
              className="hidden text-xs text-muted hover:text-primary sm:inline"
            >
              User dashboard
            </Link>
            <span className="hidden text-sm text-muted sm:inline">{userName}</span>
            <form action={logout}>
              <button
                type="submit"
                className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs text-red-400 hover:bg-red-500/10"
              >
                <LogOut className="h-3.5 w-3.5" />
                Log out
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-6 md:px-6">
        <nav className="mb-6 flex gap-2 overflow-x-auto pb-1">
          {ADMIN_NAV.map((item) => {
            const Icon = item.icon;
            const active =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary text-[#14120f]"
                    : "border border-border text-muted hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        {children}
      </div>
    </div>
  );
}
