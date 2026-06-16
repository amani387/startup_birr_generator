import Link from "next/link";
import { format } from "date-fns";
import { ExternalLink } from "lucide-react";
import { ReviewActions } from "@/components/admin/review-actions";
import { Card } from "@/components/ui/card";
import { getAdminPendingDeposits, isAdminConfigured } from "@/lib/data/admin-queries";
import { formatBirr } from "@/lib/utils";

export default async function AdminDepositsPage() {
  const deposits = await getAdminPendingDeposits();
  const configured = isAdminConfigured();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Pending Deposits</h1>
        <p className="mt-1 text-sm text-muted">
          Review payment screenshots and approve or reject deposits.
        </p>
      </div>

      {!configured && (
        <Card className="border-amber-500/30 bg-amber-500/10 p-4 text-sm text-muted">
          Set <code>SUPABASE_SERVICE_ROLE_KEY</code> on the server to load deposit data.
        </Card>
      )}

      <Card>
        {deposits.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted">No pending deposits.</p>
        ) : (
          <div className="space-y-6">
            {deposits.map((deposit) => (
              <div
                key={deposit.id}
                className="flex flex-col gap-4 border-b border-border pb-6 last:border-0 lg:flex-row lg:items-start lg:justify-between"
              >
                <div className="min-w-0 flex-1 space-y-2">
                  <p className="font-semibold">
                    {deposit.profiles?.full_name ?? "Unknown user"}
                  </p>
                  <p className="text-xs text-muted">{deposit.profiles?.email}</p>
                  <p className="text-lg font-bold text-primary">
                    {formatBirr(deposit.amount)}
                  </p>
                  <p className="text-sm">
                    via <span className="font-medium">{deposit.payment_method}</span>
                  </p>
                  {deposit.transaction_ref && (
                    <p className="text-xs text-muted">
                      Ref: {deposit.transaction_ref}
                    </p>
                  )}
                  <p className="text-xs text-muted">
                    {format(new Date(deposit.created_at), "MMM d, yyyy HH:mm")}
                  </p>
                  {deposit.screenshotSignedUrl ? (
                    <Link
                      href={deposit.screenshotSignedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                    >
                      View payment screenshot
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                  ) : (
                    <p className="text-xs text-muted">No screenshot attached</p>
                  )}
                </div>
                <ReviewActions id={deposit.id} type="deposit" />
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
