import { format } from "date-fns";
import { Clock, Target, Wallet } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { WITHDRAWAL_RULES } from "@/lib/constants";
import { requireProfile } from "@/lib/data/profile";
import { getPlatformSetting, getWithdrawals } from "@/lib/data/queries";
import { formatBirr } from "@/lib/utils";

export default async function WithdrawalsPage() {
  const profile = await requireProfile();
  const withdrawals = await getWithdrawals(profile.id);

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
  const pendingTotal = withdrawals
    .filter((w) => w.status === "pending")
    .reduce((sum, w) => sum + w.amount, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Withdrawal Request"
        description="Withdraw your earnings to your preferred payment method."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          title="Available Balance"
          value={formatBirr(profile.balance)}
          icon={Wallet}
          highlight
        />
        <StatCard title="Pending" value={formatBirr(pendingTotal)} icon={Clock} />
        <StatCard
          title="Total Withdrawn"
          value={formatBirr(profile.total_withdrawn)}
          icon={Target}
        />
      </div>

      {!unlocked && (
        <Card className="border-red-500/20 bg-red-500/5">
          <h3 className="font-bold text-red-400">Withdrawal not yet available</h3>
          <p className="mt-2 text-sm text-muted">
            You need a total balance of at least {formatBirr(minUnlock)} to unlock
            withdrawals.
          </p>
          <p className="mt-2 text-sm">
            Your total balance: {formatBirr(profile.balance)} — Still needed:{" "}
            {formatBirr(Math.max(0, minUnlock - profile.balance))}
          </p>
          <p className="mt-1 text-xs text-muted">
            {retentionPercent}% retention applies once unlocked
          </p>
        </Card>
      )}

      <Card>
        <h3 className="mb-4 font-bold">New Withdrawal</h3>
        <form className="space-y-4">
          <Input
            label="Amount (Birr)"
            type="number"
            placeholder={`Min ${minAmount} Birr`}
            hint={`Max withdrawal: ${formatBirr(maxWithdrawal)} — ${retentionPercent}% retention required`}
          />
          <Input label="Payment Method" placeholder="Select your bank or wallet" />
          <Input label="Account Holder Name" placeholder="Abebe Kebede" />
          <Input
            label="Account Number / Wallet Number"
            placeholder="0911234567"
            hint="Admin will send funds to this account upon approval"
          />
          <Button type="submit" disabled={!unlocked}>
            Submit Withdrawal Request
          </Button>
        </form>
      </Card>

      <Card>
        <h3 className="mb-4 font-bold">Withdrawal History</h3>
        {withdrawals.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted">
            No withdrawal requests yet
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left text-muted">
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Amount</th>
                  <th className="pb-3 font-medium">Method</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {withdrawals.map((w) => (
                  <tr key={w.id} className="border-b border-white/5">
                    <td className="py-3">
                      {format(new Date(w.created_at), "MMM d, yyyy")}
                    </td>
                    <td className="py-3 font-medium text-primary">
                      {formatBirr(w.amount)}
                    </td>
                    <td className="py-3">{w.payment_method}</td>
                    <td className="py-3">
                      <Badge
                        status={
                          w.status === "approved"
                            ? "approved"
                            : w.status === "rejected"
                              ? "rejected"
                              : "pending"
                        }
                      >
                        {w.status}
                      </Badge>
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
