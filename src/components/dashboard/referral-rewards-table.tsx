"use client";

import { VIP_REFERRAL_REWARDS } from "@/lib/constants";
import { Card } from "@/components/ui/card";
import { formatBirr } from "@/lib/utils";

export function ReferralRewardsTable() {
  return (
    <Card>
      <h3 className="mb-4 font-bold">Invitation Rewards by VIP Package</h3>
      <p className="mb-4 text-sm text-muted">
        Earn 15% when your referral purchases any VIP package.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted">
              <th className="pb-3 font-medium">Package</th>
              <th className="pb-3 font-medium">Price</th>
              <th className="pb-3 font-medium">Your Reward</th>
            </tr>
          </thead>
          <tbody>
            {VIP_REFERRAL_REWARDS.map((row) => (
              <tr key={row.level} className="border-b border-border/50">
                <td className="py-3 font-medium">{row.name}</td>
                <td className="py-3">{formatBirr(row.packagePrice)}</td>
                <td className="py-3 font-semibold text-primary">
                  {formatBirr(row.reward)}
                  <span className="ml-1 text-xs text-muted">({row.percent}%)</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
