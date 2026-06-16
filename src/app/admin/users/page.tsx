import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { getAdminUsers, isAdminConfigured } from "@/lib/data/admin-queries";
import { formatBirr } from "@/lib/utils";

export default async function AdminUsersPage() {
  const users = await getAdminUsers();
  const configured = isAdminConfigured();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Users</h1>
        <p className="mt-1 text-sm text-muted">
          {users.length} registered members
        </p>
      </div>

      {!configured && (
        <Card className="border-amber-500/30 bg-amber-500/10 p-4 text-sm text-muted">
          Set <code>SUPABASE_SERVICE_ROLE_KEY</code> on the server to load users.
        </Card>
      )}

      <Card>
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
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
