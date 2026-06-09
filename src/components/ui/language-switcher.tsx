"use client";

import { Globe } from "lucide-react";
import { LOCALES, type Locale } from "@/lib/i18n/index";
import { useI18n } from "@/components/providers/i18n-provider";
import { cn } from "@/lib/utils";

type LanguageSwitcherProps = {
  compact?: boolean;
  className?: string;
};

export function LanguageSwitcher({ compact, className }: LanguageSwitcherProps) {
  const { locale, setLocale, isPending } = useI18n();

  return (
    <div className={cn("relative", className)}>
      <label className="sr-only">Language</label>
      <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
        <Globe className="h-4 w-4 text-primary" />
      </div>
      <select
        value={locale}
        disabled={isPending}
        onChange={(e) => setLocale(e.target.value as Locale)}
        className={cn(
          "touch-target w-full appearance-none rounded-xl border border-border bg-surface-bright py-2.5 pl-9 pr-8 text-sm font-medium text-foreground outline-none transition-colors focus:border-primary/40 focus:ring-2 focus:ring-primary/20",
          compact ? "max-w-[140px]" : "min-w-[160px]"
        )}
      >
        {LOCALES.map((loc) => (
          <option key={loc.code} value={loc.code}>
            {loc.nativeLabel}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted">
        ▾
      </span>
    </div>
  );
}
