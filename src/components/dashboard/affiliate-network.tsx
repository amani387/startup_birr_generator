"use client";

import { useState } from "react";
import { format } from "date-fns";
import { CardScrollArea } from "@/components/dashboard/card-scroll-area";
import { Card } from "@/components/ui/card";
import { REFERRAL_COMMISSION } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { ReferralMember } from "@/types/database";

const LEVELS = [
  { id: 1 as const, label: "Level 1 (Direct)", commission: REFERRAL_COMMISSION.level1 },
  { id: 2 as const, label: "Level 2", commission: REFERRAL_COMMISSION.level2 },
  { id: 3 as const, label: "Level 3", commission: REFERRAL_COMMISSION.level3 },
];

type AffiliateNetworkProps = {
  level1: ReferralMember[];
  level2: ReferralMember[];
  level3: ReferralMember[];
  level1Count: number;
  level2Count: number;
  level3Count: number;
};

export function AffiliateNetwork({
  level1,
  level2,
  level3,
  level1Count,
  level2Count,
  level3Count,
}: AffiliateNetworkProps) {
  const [activeLevel, setActiveLevel] = useState<1 | 2 | 3>(1);

  const members = activeLevel === 1 ? level1 : activeLevel === 2 ? level2 : level3;
  const counts = { 1: level1Count, 2: level2Count, 3: level3Count };

  return (
    <>
      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {LEVELS.map((level) => (
          <button
            key={level.id}
            type="button"
            onClick={() => setActiveLevel(level.id)}
            className={cn(
              "shrink-0 rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-200 sm:px-4 sm:text-sm",
              activeLevel === level.id
                ? "bg-primary text-black"
                : "border border-white/10 text-muted hover:text-foreground"
            )}
          >
            {level.label} ({level.commission}%)
          </button>
        ))}
      </div>

      <Card>
        <h3 className="mb-4 font-bold">Level {activeLevel} Referrals</h3>
        <CardScrollArea>
          <table className="w-full min-w-[400px] text-sm">
            <thead className="sticky top-0 z-10 bg-surface">
              <tr className="border-b border-border text-left text-muted">
                <th className="pb-3 font-medium">Username</th>
                <th className="pb-3 font-medium">Registration Date</th>
                <th className="pb-3 font-medium">VIP Status</th>
              </tr>
            </thead>
            <tbody>
              {members.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-12 text-center text-muted">
                    No referrals at this level yet
                  </td>
                </tr>
              ) : (
                members.map((member) => (
                  <tr key={member.id} className="border-b border-white/5">
                    <td className="py-3 font-medium">{member.full_name}</td>
                    <td className="py-3">
                      {format(new Date(member.created_at), "MMM d, yyyy")}
                    </td>
                    <td className="py-3">
                      {member.vip_level > 0 ? `VIP ${member.vip_level}` : "None"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </CardScrollArea>
      </Card>

      <Card className="overflow-hidden">
        <h3 className="mb-4 font-bold">Network Tree</h3>
        <div className="flex flex-col items-center py-6 sm:py-8">
          <div className="rounded-lg border border-primary/30 bg-primary/10 px-6 py-3 font-bold text-primary">
            You
          </div>
          <div className="my-4 h-8 w-px bg-white/20" />
          <div className="grid w-full max-w-full grid-cols-3 gap-2 sm:gap-4 md:gap-6">
            {LEVELS.map((level) => (
              <div key={level.id} className="min-w-0">
                <div className="rounded-lg border border-white/10 bg-surface-bright px-2 py-2 text-center text-xs sm:px-3 sm:py-2.5 sm:text-sm">
                  <p className="font-medium">Level {level.id}</p>
                  <p className="mt-0.5 text-[10px] text-primary sm:text-xs">
                    {level.commission}% commission
                  </p>
                </div>
                <p className="mt-2 truncate text-center text-[10px] text-muted sm:text-xs">
                  {counts[level.id]} members
                </p>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </>
  );
}
