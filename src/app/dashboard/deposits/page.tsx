import { format } from "date-fns";
import { DepositFlow } from "@/components/dashboard/deposit-flow";
import { CardScrollArea } from "@/components/dashboard/card-scroll-area";
import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { requireProfile } from "@/lib/data/profile";
import { getDeposits } from "@/lib/data/queries";
import { formatBirr } from "@/lib/utils";

export default async function DepositsPage() {
  const profile = await requireProfile();
  const deposits = await getDeposits(profile.id);
  const approvedTotal = deposits
    .filter((d) => d.status === "approved")
    .reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Deposit"
        description="Choose a payment method and follow the steps."
      />

      <Card>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-muted">Your Balance</p>
            <p className="text-2xl font-bold text-primary">
              {formatBirr(profile.balance)}
            </p>
          </div>
          <p className="text-sm text-muted">{formatBirr(approvedTotal)} approved</p>
        </div>
      </Card>

      <DepositFlow />

      <Card>
        <h3 className="mb-4 font-bold">Deposit History</h3>
        {deposits.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted">No deposits yet</p>
        ) : (
          <CardScrollArea>
            <table className="w-full min-w-[480px] text-sm">
              <thead className="sticky top-0 z-10 bg-surface">
                <tr className="border-b border-border text-left text-muted">
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Amount</th>
                  <th className="pb-3 font-medium">Method</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {deposits.map((deposit) => (
                  <tr key={deposit.id} className="border-b border-white/5">
                    <td className="py-3">
                      {format(new Date(deposit.created_at), "MMM d, yyyy")}
                    </td>
                    <td className="py-3 font-medium text-primary">
                      {formatBirr(deposit.amount)}
                    </td>
                    <td className="py-3">{deposit.payment_method}</td>
                    <td className="py-3">
                      <Badge
                        status={
                          deposit.status === "approved"
                            ? "approved"
                            : deposit.status === "rejected"
                              ? "rejected"
                              : "pending"
                        }
                      >
                        {deposit.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardScrollArea>
        )}
      </Card>
    </div>
  );
}
