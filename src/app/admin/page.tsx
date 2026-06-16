import Link from "next/link";
import { Banknote, TrendingUp, Users, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { getAdminStats } from "@/lib/data/admin-queries";

export default async function AdminPage() {
  const stats = await getAdminStats();

  const cards = [
    { label: "Total Users", value: stats.totalUsers, icon: Users, href: "/admin/users" },
    {
      label: "Pending Deposits",
      value: stats.pendingDeposits,
      icon: Banknote,
      href: "/admin/deposits",
    },
    {
      label: "Pending Withdrawals",
      value: stats.pendingWithdrawals,
      icon: TrendingUp,
      href: "/admin/withdrawals",
    },
    {
      label: "Active VIP Members",
      value: stats.activeVipMembers,
      icon: Zap,
      href: "/admin/vip-income",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Admin Overview</h1>
        <p className="mt-1 text-sm text-muted">
          Manage deposits, withdrawals, users, and VIP income.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.href} href={card.href}>
              <Card className="transition-colors hover:border-primary/30">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                      {card.label}
                    </p>
                    <p className="mt-2 text-3xl font-bold text-primary">{card.value}</p>
                  </div>
                  <div className="rounded-lg bg-primary/10 p-2">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
