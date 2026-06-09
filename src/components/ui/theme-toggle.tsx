"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/providers/theme-provider";
import { useTranslation } from "@/components/providers/i18n-provider";
import { cn } from "@/lib/utils";

type ThemeToggleProps = {
  compact?: boolean;
  className?: string;
};

export function ThemeToggle({ compact, className }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const t = useTranslation();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={cn(
        "touch-target flex items-center gap-2.5 rounded-xl border border-border bg-surface-bright px-3 py-2.5 text-sm font-medium text-foreground transition-all duration-200 hover:border-primary/30 hover:bg-primary-dim active:scale-[0.98]",
        compact && "justify-center px-2.5",
        className
      )}
      aria-label={isDark ? t("common.themeLight") : t("common.themeDark")}
    >
      {isDark ? (
        <Sun className="h-4 w-4 shrink-0 text-primary" />
      ) : (
        <Moon className="h-4 w-4 shrink-0 text-primary" />
      )}
      {!compact && (
        <span>{isDark ? t("common.themeLight") : t("common.themeDark")}</span>
      )}
    </button>
  );
}
