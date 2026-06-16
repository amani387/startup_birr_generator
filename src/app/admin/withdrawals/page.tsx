import { format } from "date-fns";
import { ReviewActions } from "@/components/admin/review-actions";
import { Card } from "@/components/ui/card";
import { getAdminPendingWithdrawals, isAdminConfigured } from "@/lib/data/admin-queries";
import { formatBirr } from "@/lib/utils";

export default async function AdminWithdrawalsPage() {
  const withdrawals = await getAdminPendingWithdrawals();
  const configured = isAdminConfigured();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Pending Withdrawals</h1>
        <p className="mt-1 text-sm text-muted">Approve or reject withdrawal requests.</p>
      </div>

      {!configured && (
        <Card className="border-amber-500/30 bg-amber-500/10 p-4 text-sm text-muted">
          Set <code>SUPABASE_SERVICE_ROLE_KEY</code> on the server to load withdrawal data.
        </Card>
      )}

      <Card>
        {withdrawals.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted">No pending withdrawals.</p>
        ) : (
          <div className="space-y-4">
            {withdrawals.map((withdrawal) => (
              <div
                key={withdrawal.id}
                className="flex flex-col gap-3 border-b border-border pb-4 last:border-0 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-semibold">
                    {withdrawal.profiles?.full_name ?? "Unknown"}
                  </p>
                  <p className="text-xs text-muted">{withdrawal.profiles?.email}</p>
                  <p className="mt-1 text-sm font-medium text-primary">
                    {formatBirr(withdrawal.amount)}
                  </p>
                  <p className="text-xs text-muted">
                    {withdrawal.payment_method} — {withdrawal.account_holder} (
                    {withdrawal.account_number})
                  </p>
                  <p className="text-xs text-muted">
                    {format(new Date(withdrawal.created_at), "MMM d, yyyy HH:mm")}
                  </p>
                </div>
                <ReviewActions id={withdrawal.id} type="withdrawal" />
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
