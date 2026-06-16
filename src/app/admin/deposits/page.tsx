import { format } from "date-fns";
import { ReviewActions } from "@/components/admin/review-actions";
import { Card } from "@/components/ui/card";
import { getAdminPendingDeposits } from "@/lib/data/admin-queries";
import { formatBirr } from "@/lib/utils";

function joinProfile(profiles: unknown): { full_name: string; email: string } | null {
  if (!profiles) return null;
  if (Array.isArray(profiles)) return profiles[0] ?? null;
  return profiles as { full_name: string; email: string };
}

export default async function AdminDepositsPage() {
  const deposits = await getAdminPendingDeposits();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Pending Deposits</h1>
        <p className="mt-1 text-sm text-muted">Review and approve user deposit requests.</p>
      </div>

      <Card>
        {deposits.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted">No pending deposits.</p>
        ) : (
          <div className="space-y-4">
            {deposits.map((deposit) => {
              const profile = joinProfile(deposit.profiles);
              return (
                <div
                  key={deposit.id}
                  className="flex flex-col gap-3 border-b border-border pb-4 last:border-0 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-semibold">{profile?.full_name ?? "Unknown"}</p>
                    <p className="text-xs text-muted">{profile?.email}</p>
                    <p className="mt-1 text-sm">
                      {formatBirr(Number(deposit.amount))} via {deposit.payment_method}
                    </p>
                    <p className="text-xs text-muted">
                      {format(new Date(deposit.created_at), "MMM d, yyyy HH:mm")}
                    </p>
                  </div>
                  <ReviewActions id={deposit.id} type="deposit" />
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
