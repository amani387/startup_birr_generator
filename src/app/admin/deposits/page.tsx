import Link from "next/link";
import { format } from "date-fns";
import { ExternalLink } from "lucide-react";
import { AdminPagination } from "@/components/admin/admin-pagination";
import { AdminScrollList } from "@/components/admin/admin-scroll-list";
import { AdminStatusFilter } from "@/components/admin/admin-status-filter";
import { ReviewActions } from "@/components/admin/review-actions";
import { Card } from "@/components/ui/card";
import {
  parseAdminPage,
  parseAdminStatus,
} from "@/lib/admin-pagination";
import { getAdminDeposits, isAdminConfigured } from "@/lib/data/admin-queries";
import { cn, formatBirr } from "@/lib/utils";

type AdminDepositsPageProps = {
  searchParams: Promise<{ page?: string; status?: string }>;
};

function statusBadgeClass(status: string) {
  if (status === "approved") return "bg-emerald-500/10 text-emerald-700";
  if (status === "rejected") return "bg-red-500/10 text-red-700";
  return "bg-amber-500/10 text-amber-700";
}

export default async function AdminDepositsPage({
  searchParams,
}: AdminDepositsPageProps) {
  const params = await searchParams;
  const page = parseAdminPage(params.page);
  const status = parseAdminStatus(params.status);
  const result = await getAdminDeposits({ page, status });
  const configured = isAdminConfigured();

  const titles: Record<string, string> = {
    pending: "Pending Deposits",
    approved: "Approved Deposits",
    rejected: "Rejected Deposits",
    all: "All Deposits",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">{titles[status]}</h1>
        <p className="mt-1 text-sm text-muted">
          Review payment screenshots, approve or reject deposits, and manage records.
        </p>
      </div>

      {!configured && (
        <Card className="border-amber-500/30 bg-amber-500/10 p-4 text-sm text-muted">
          Set <code>SUPABASE_SERVICE_ROLE_KEY</code> on the server to load deposit data.
        </Card>
      )}

      <AdminStatusFilter basePath="/admin/deposits" current={status} />

      <Card>
        {result.items.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted">
            No deposits found for this filter.
          </p>
        ) : (
          <AdminScrollList>
            <div className="space-y-6 pr-1">
              {result.items.map((deposit) => (
              <div
                key={deposit.id}
                className="flex flex-col gap-4 border-b border-border pb-6 last:border-0 lg:flex-row lg:items-start lg:justify-between"
              >
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold">
                      {deposit.profiles?.full_name ?? "Unknown user"}
                    </p>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-xs font-medium capitalize",
                        statusBadgeClass(deposit.status)
                      )}
                    >
                      {deposit.status}
                    </span>
                  </div>
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
                <ReviewActions
                  id={deposit.id}
                  type="deposit"
                  status={deposit.status}
                />
              </div>
              ))}
            </div>
          </AdminScrollList>
        )}

        <AdminPagination
          page={result.page}
          totalPages={result.totalPages}
          total={result.total}
          basePath="/admin/deposits"
          params={{ status: status === "pending" ? undefined : status }}
        />
      </Card>
    </div>
  );
}
