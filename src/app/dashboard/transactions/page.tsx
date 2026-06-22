"use client";

import { useState } from "react";
import { Gift, ArrowDownToLine, ArrowUpFromLine } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { CardScrollArea } from "@/components/dashboard/card-scroll-area";
import { StatCard } from "@/components/dashboard/stat-card";
import { Card } from "@/components/ui/card";
import { cn, formatBirr } from "@/lib/utils";

const FILTERS = ["All", "Deposits", "Withdrawals", "Referral", "Earnings"] as const;

export default function TransactionsPage() {
  const [activeFilter, setActiveFilter] =
    useState<(typeof FILTERS)[number]>("All");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Transaction History"
        description="All your deposits, withdrawals, and referral bonuses in one place."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          title="Total Deposited"
          value={formatBirr(0)}
          icon={ArrowDownToLine}
        />
        <StatCard
          title="Total Withdrawn"
          value={formatBirr(0)}
          icon={ArrowUpFromLine}
        />
        <StatCard title="Referral Earned" value={formatBirr(0)} icon={Gift} />
      </div>

      <Card>
        <div className="mb-4 flex flex-wrap items-center gap-3">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200",
                activeFilter === filter
                  ? "bg-primary text-black"
                  : "text-muted hover:bg-white/5"
              )}
            >
              {filter}
            </button>
          ))}
          <div className="ml-auto flex gap-2">
            <input
              type="date"
              className="rounded-lg border border-white/10 bg-surface-bright px-3 py-1.5 text-sm"
              placeholder="From"
            />
            <input
              type="date"
              className="rounded-lg border border-white/10 bg-surface-bright px-3 py-1.5 text-sm"
              placeholder="To"
            />
          </div>
        </div>

        <CardScrollArea>
          <table className="w-full min-w-[640px] text-sm">
            <thead className="sticky top-0 z-10 bg-surface">
              <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted">
                <th className="pb-3 font-medium">Type</th>
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Amount</th>
                <th className="pb-3 font-medium">Method / Note</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={5} className="py-16 text-center text-muted">
                  No transactions match your filters
                </td>
              </tr>
            </tbody>
          </table>
        </CardScrollArea>
      </Card>
    </div>
  );
}
