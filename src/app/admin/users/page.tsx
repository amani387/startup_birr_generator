import { Suspense } from "react";
import { format } from "date-fns";
import { AdminPagination } from "@/components/admin/admin-pagination";
import { AdminSearch } from "@/components/admin/admin-search";
import { AdminUserActions } from "@/components/admin/admin-user-actions";
import { Card } from "@/components/ui/card";
import { parseAdminPage } from "@/lib/admin-pagination";
import { getAdminUsers, isAdminConfigured } from "@/lib/data/admin-queries";
import { requireAdmin } from "@/lib/data/profile";
import { formatBirr } from "@/lib/utils";

type AdminUsersPageProps = {
  searchParams: Promise<{ page?: string; q?: string }>;
};

export default async function AdminUsersPage({
  searchParams,
}: AdminUsersPageProps) {
  const params = await searchParams;
  const page = parseAdminPage(params.page);
  const search = params.q?.trim();
  const [result, currentAdmin] = await Promise.all([
    getAdminUsers({ page, search }),
    requireAdmin(),
  ]);
  const configured = isAdminConfigured();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Users</h1>
        <p className="mt-1 text-sm text-muted">
          {result.total} registered members
          {search ? ` matching "${search}"` : ""}
        </p>
      </div>

      {!configured && (
        <Card className="border-amber-500/30 bg-amber-500/10 p-4 text-sm text-muted">
          Set <code>SUPABASE_SERVICE_ROLE_KEY</code> on the server to load users.
        </Card>
      )}

      <Suspense fallback={null}>
        <AdminSearch placeholder="Search by name or email..." />
      </Suspense>

      <Card>
        {result.items.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted">No users found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted">
                  <th className="pb-3 font-medium">Name</th>
                  <th className="pb-3 font-medium">Email</th>
                  <th className="pb-3 font-medium">Role</th>
                  <th className="pb-3 font-medium">VIP</th>
                  <th className="pb-3 font-medium">Balance</th>
                  <th className="pb-3 font-medium">Deposited</th>
                  <th className="pb-3 font-medium">Earned</th>
                  <th className="pb-3 font-medium">Joined</th>
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {result.items.map((user) => (
                  <tr key={user.id} className="border-b border-border/50">
                    <td className="py-3 font-medium">{user.full_name}</td>
                    <td className="py-3 text-muted">{user.email}</td>
                    <td className="py-3 capitalize">{user.role}</td>
                    <td className="py-3">
                      {user.vip_level > 0 ? `VIP ${user.vip_level}` : "—"}
                    </td>
                    <td className="py-3 text-primary">{formatBirr(user.balance)}</td>
                    <td className="py-3">{formatBirr(user.total_deposited)}</td>
                    <td className="py-3">{formatBirr(user.total_earned)}</td>
                    <td className="py-3 text-muted">
                      {format(new Date(user.created_at), "MMM d, yyyy")}
                    </td>
                    <td className="py-3">
                      <AdminUserActions
                        userId={user.id}
                        role={user.role}
                        isSelf={user.id === currentAdmin.id}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <AdminPagination
          page={result.page}
          totalPages={result.totalPages}
          total={result.total}
          basePath="/admin/users"
          params={search ? { q: search } : undefined}
        />
      </Card>
    </div>
  );
}
