import Link from "next/link";
import { format } from "date-fns";
import { Banknote, TrendingUp, Users, Wallet, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { getAdminRecentDeposits, getAdminStats } from "@/lib/data/admin-queries";
import { formatBirr } from "@/lib/utils";

export default async function AdminPage() {
  const [stats, recentDeposits] = await Promise.all([
    getAdminStats(),
    getAdminRecentDeposits(8),
  ]);

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
          Live data from Supabase — deposits, withdrawals, users, and VIP income.
        </p>
      </div>

      {!stats.configured && (
        <Card className="border-amber-500/30 bg-amber-500/10">
          <p className="text-sm font-semibold text-amber-600 dark:text-amber-300">
            Admin data unavailable
          </p>
          <p className="mt-1 text-sm text-muted">
            Add <code className="text-xs">SUPABASE_SERVICE_ROLE_KEY</code> to your
            server environment and restart the app.
          </p>
        </Card>
      )}

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

      {stats.configured && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">
              Total Approved Deposits
            </p>
            <p className="mt-2 text-2xl font-bold text-primary">
              {formatBirr(stats.totalDeposited)}
            </p>
          </Card>
          <Card>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">
              Total Withdrawn
            </p>
            <p className="mt-2 text-2xl font-bold">{formatBirr(stats.totalWithdrawn)}</p>
          </Card>
          <Card>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">
              Platform Balance (all users)
            </p>
            <p className="mt-2 flex items-center gap-2 text-2xl font-bold">
              <Wallet className="h-5 w-5 text-primary" />
              {formatBirr(stats.platformBalance)}
            </p>
          </Card>
        </div>
      )}

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-bold">Recent Deposits</h2>
          <Link href="/admin/deposits" className="text-sm text-primary hover:underline">
            View pending
          </Link>
        </div>
        {recentDeposits.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted">No deposits yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted">
                  <th className="pb-3 font-medium">User</th>
                  <th className="pb-3 font-medium">Amount</th>
                  <th className="pb-3 font-medium">Method</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentDeposits.map((deposit) => (
                  <tr key={deposit.id} className="border-b border-border/50">
                    <td className="py-3">
                      {(deposit.profiles as { full_name: string } | null)?.full_name ??
                        "—"}
                    </td>
                    <td className="py-3 font-medium text-primary">
                      {formatBirr(deposit.amount)}
                    </td>
                    <td className="py-3">{deposit.payment_method}</td>
                    <td className="py-3 capitalize">{deposit.status}</td>
                    <td className="py-3 text-muted">
                      {format(new Date(deposit.created_at), "MMM d, HH:mm")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
