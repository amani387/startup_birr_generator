import { format } from "date-fns";
import { Building2 } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { requireProfile } from "@/lib/data/profile";
import { getDeposits } from "@/lib/data/queries";
import { formatBirr } from "@/lib/utils";

const PAYMENT_METHODS = [
  { id: "telebirr", name: "Telebirr (Ethio Telecom)", account: "0929825757" },
  { id: "chapa", name: "Chapa", account: "Via Chapa gateway" },
  { id: "bank", name: "Bank Transfer", account: "Contact support for details" },
];

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
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted">Your Balance</p>
            <p className="text-2xl font-bold text-primary">
              {formatBirr(profile.balance)}
            </p>
          </div>
          <p className="text-sm text-muted">{formatBirr(approvedTotal)} approved</p>
        </div>
      </Card>

      <div className="space-y-3">
        {PAYMENT_METHODS.map((method) => (
          <Card
            key={method.id}
            className="flex cursor-pointer items-center justify-between transition-colors hover:border-primary/30"
          >
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-primary/10 p-3">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold">{method.name}</p>
                <p className="text-sm text-muted">{method.account}</p>
              </div>
            </div>
            <span className="text-muted">›</span>
          </Card>
        ))}
      </div>

      <Card>
        <h3 className="mb-4 font-bold">Deposit History</h3>
        {deposits.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted">No deposits yet</p>
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
          </div>
        )}
      </Card>
    </div>
  );
}
