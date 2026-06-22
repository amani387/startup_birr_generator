import { format } from "date-fns";
import { PageHeader } from "@/components/dashboard/page-header";
import { WithdrawalForm } from "@/components/dashboard/withdrawal-form";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { WITHDRAWAL_RULES } from "@/lib/constants";
import { requireProfile } from "@/lib/data/profile";
import {
  getPlatformSetting,
  getWithdrawalSettings,
  getWithdrawals,
} from "@/lib/data/queries";
import { formatBirr } from "@/lib/utils";

function statusBadge(status: string) {
  if (status === "approved") return { status: "approved" as const, label: "Paid" };
  if (status === "rejected") return { status: "rejected" as const, label: "Failed" };
  return { status: "pending" as const, label: "Processing" };
}

export default async function WithdrawalsPage() {
  const profile = await requireProfile();
  const [withdrawals, settings] = await Promise.all([
    getWithdrawals(profile.id),
    getWithdrawalSettings(profile.id),
  ]);

  const retentionPercent = await getPlatformSetting(
    "withdrawal_retention_percent",
    WITHDRAWAL_RULES.retentionPercent
  );
  const minUnlock = await getPlatformSetting(
    "withdrawal_min_balance_unlock",
    WITHDRAWAL_RULES.minBalanceToUnlock
  );
  const minAmount = await getPlatformSetting(
    "withdrawal_min_amount",
    WITHDRAWAL_RULES.minWithdrawalAmount
  );

  const unlocked = profile.balance >= minUnlock;
  const maxWithdrawal = Math.floor(profile.balance * (1 - retentionPercent / 100));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Withdraw Funds"
        description="Withdraw your earnings securely."
      />

      {!unlocked && (
        <Card className="border-amber-500/30 bg-amber-500/5">
          <p className="text-sm font-semibold text-amber-700 dark:text-amber-300">
            Withdrawal unlocks at {formatBirr(minUnlock)} balance
          </p>
          <p className="mt-1 text-sm text-muted">
            Current balance: {formatBirr(profile.balance)} — need{" "}
            {formatBirr(Math.max(0, minUnlock - profile.balance))} more
          </p>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">
            Your Available Balance
          </p>
          <p className="mt-1 text-3xl font-bold text-primary">
            {formatBirr(profile.balance)}
          </p>
          <p className="mt-4 text-xs text-muted">
            {retentionPercent}% retention applies · Min withdrawal {formatBirr(minAmount)}
          </p>
          <div className="mt-6 border-t border-border pt-6">
            <h3 className="mb-4 font-bold">New Withdrawal</h3>
            <WithdrawalForm
              unlocked={unlocked}
              maxWithdrawal={maxWithdrawal}
              minAmount={minAmount}
              retentionPercent={retentionPercent}
              settings={settings}
            />
          </div>
        </Card>

        <Card>
          <h3 className="mb-4 font-bold">Withdrawal History</h3>
          {withdrawals.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted">
              No withdrawal requests yet
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs text-muted">
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium">Amount</th>
                    <th className="pb-3 font-medium">Method</th>
                    <th className="pb-3 font-medium">Destination</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {withdrawals.map((w) => {
                    const badge = statusBadge(w.status);
                    return (
                      <tr key={w.id} className="border-b border-border/50">
                        <td className="py-3 text-muted">
                          {format(new Date(w.created_at), "dd-MM-yyyy")}
                        </td>
                        <td className="py-3 font-semibold text-primary">
                          {formatBirr(w.amount)}
                        </td>
                        <td className="py-3">{w.payment_method}</td>
                        <td className="py-3 text-muted">{w.account_number}</td>
                        <td className="py-3">
                          <Badge status={badge.status}>{badge.label}</Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
