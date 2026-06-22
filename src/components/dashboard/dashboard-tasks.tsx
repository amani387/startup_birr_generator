import Link from "next/link";
import { CheckCircle2, Circle } from "lucide-react";
import { Card } from "@/components/ui/card";

const TASKS = [
  { id: 1, label: "Deposit funds into your wallet", href: "/dashboard/deposits" },
  { id: 2, label: "Review and sign up for a VIP plan", href: "/dashboard/vip-packages" },
  { id: 3, label: "Claim your daily VIP income", href: "/dashboard" },
  { id: 4, label: "Share your referral link", href: "/dashboard/referral" },
] as const;

type DashboardTasksProps = {
  hasDeposit: boolean;
  hasVip: boolean;
};

export function DashboardTasks({ hasDeposit, hasVip }: DashboardTasksProps) {
  const done = [hasDeposit, hasVip, hasVip, false];

  return (
    <Card className="h-full">
      <h3 className="font-display text-sm font-bold uppercase tracking-wider text-foreground">
        Today&apos;s Tasks
      </h3>
      <ul className="mt-4 space-y-3">
        {TASKS.map((task, i) => (
          <li key={task.id}>
            <Link
              href={task.href}
              className="flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-primary/5"
            >
              {done[i] ? (
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              ) : (
                <Circle className="mt-0.5 h-5 w-5 shrink-0 text-primary/40" />
              )}
              <span className="text-sm leading-snug text-foreground">{task.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </Card>
  );
}
