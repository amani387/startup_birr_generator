import { format } from "date-fns";
import { CardScrollArea } from "@/components/dashboard/card-scroll-area";
import { Card } from "@/components/ui/card";
import { getReferralCommissions } from "@/lib/data/queries";
import { requireProfile } from "@/lib/data/profile";
import { formatBirr } from "@/lib/utils";

export async function ReferralCommissionHistory() {
  const profile = await requireProfile();
  const commissions = await getReferralCommissions(profile.id);

  return (
    <Card>
      <h3 className="mb-4 font-bold">Your Referral Earnings</h3>
      {commissions.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted">
          No referral bonuses yet. Share your link — you earn 15% when a referral
          buys any VIP package.
        </p>
      ) : (
        <CardScrollArea>
          <table className="w-full min-w-[400px] text-sm">
            <thead className="sticky top-0 z-10 bg-surface">
              <tr className="border-b border-border text-left text-muted">
                <th className="pb-3 font-medium">Details</th>
                <th className="pb-3 font-medium">Amount</th>
                <th className="pb-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {commissions.map((row) => (
                <tr key={row.id} className="border-b border-border/50">
                  <td className="py-3">{row.source_user?.full_name ?? "Referral bonus"}</td>
                  <td className="py-3 font-semibold text-primary">
                    +{formatBirr(row.amount)}
                  </td>
                  <td className="py-3 text-muted">
                    {format(new Date(row.created_at), "MMM d, yyyy HH:mm")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardScrollArea>
      )}
    </Card>
  );
}
