import { Bell, Crown } from "lucide-react";
import { APP_NAME } from "@/lib/constants";

type TopBarProps = {
  title?: string;
  userName?: string;
};

export function TopBar({ title, userName = "Member" }: TopBarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/10 bg-surface/60 px-6 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <Crown className="h-5 w-5 text-primary md:hidden" />
        <h1 className="text-lg font-bold tracking-tight">
          {title ?? APP_NAME}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          className="relative rounded-lg p-2 text-muted transition-colors hover:bg-white/5 hover:text-foreground"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
        </button>
        <div className="hidden items-center gap-2 rounded-lg border border-white/10 bg-surface-bright px-3 py-1.5 sm:flex">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
            {userName
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </div>
          <span className="text-sm font-medium">{userName}</span>
        </div>
      </div>
    </header>
  );
}
