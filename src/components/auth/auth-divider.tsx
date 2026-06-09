"use client";

import { useTranslation } from "@/components/providers/i18n-provider";

export function AuthDivider() {
  const t = useTranslation();

  return (
    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center" aria-hidden>
        <div className="w-full border-t border-border" />
      </div>
      <p className="relative mx-auto w-fit bg-surface px-3 text-xs font-medium uppercase tracking-wider text-muted">
        {t("auth.orContinueWith")}
      </p>
    </div>
  );
}
