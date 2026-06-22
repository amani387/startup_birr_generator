import { format } from "date-fns";
import { AdminPagination } from "@/components/admin/admin-pagination";
import { AdminScrollList } from "@/components/admin/admin-scroll-list";
import { AdminStatusFilter } from "@/components/admin/admin-status-filter";
import { ReviewActions } from "@/components/admin/review-actions";
import { Card } from "@/components/ui/card";
import {
  parseAdminPage,
  parseAdminStatus,
} from "@/lib/admin-pagination";
import { getAdminWithdrawals, isAdminConfigured } from "@/lib/data/admin-queries";
import { cn, formatBirr } from "@/lib/utils";

type AdminWithdrawalsPageProps = {
  searchParams: Promise<{ page?: string; status?: string }>;
};

function statusBadgeClass(status: string) {
  if (status === "approved") return "bg-emerald-500/10 text-emerald-700";
  if (status === "rejected") return "bg-red-500/10 text-red-700";
  return "bg-amber-500/10 text-amber-700";
}

export default async function AdminWithdrawalsPage({
  searchParams,
}: AdminWithdrawalsPageProps) {
  const params = await searchParams;
  const page = parseAdminPage(params.page);
  const status = parseAdminStatus(params.status);
  const result = await getAdminWithdrawals({ page, status });
  const configured = isAdminConfigured();

  const titles: Record<string, string> = {
    pending: "Pending Withdrawals",
    approved: "Approved Withdrawals",
    rejected: "Rejected Withdrawals",
    all: "All Withdrawals",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">{titles[status]}</h1>
        <p className="mt-1 text-sm text-muted">
          Approve, reject, or remove withdrawal requests.
        </p>
      </div>

      {!configured && (
        <Card className="border-amber-500/30 bg-amber-500/10 p-4 text-sm text-muted">
          Set <code>SUPABASE_SERVICE_ROLE_KEY</code> on the server to load withdrawal data.
        </Card>
      )}

      <AdminStatusFilter basePath="/admin/withdrawals" current={status} />

      <Card>
        {result.items.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted">
            No withdrawals found for this filter.
          </p>
        ) : (
          <AdminScrollList>
            <div className="space-y-4 pr-1">
              {result.items.map((withdrawal) => (
              <div
                key={withdrawal.id}
                className="flex flex-col gap-3 border-b border-border pb-4 last:border-0 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold">
                      {withdrawal.profiles?.full_name ?? "Unknown"}
                    </p>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-xs font-medium capitalize",
                        statusBadgeClass(withdrawal.status)
                      )}
                    >
                      {withdrawal.status}
                    </span>
                  </div>
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
                <ReviewActions
                  id={withdrawal.id}
                  type="withdrawal"
                  status={withdrawal.status}
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
          basePath="/admin/withdrawals"
          params={{ status: status === "pending" ? undefined : status }}
        />
      </Card>
    </div>
  );
}
