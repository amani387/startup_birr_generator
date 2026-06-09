"use client";

import Link from "next/link";
import { useActionState } from "react";
import { BrandLogo } from "@/components/ui/brand-logo";
import { forgotPassword } from "@/lib/actions/auth";
import { FormMessage } from "@/components/auth/form-message";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useTranslation } from "@/components/providers/i18n-provider";

export function ForgotPasswordForm() {
  const [state, action, pending] = useActionState(forgotPassword, {});
  const t = useTranslation();

  return (
    <Card padding="lg" className="mx-auto w-full max-w-md">
      <div className="mb-8 flex flex-col items-center gap-4 text-center">
        <BrandLogo size={56} className="accent-glow rounded-2xl" />
        <div>
          <h1 className="font-display text-2xl font-bold text-primary sm:text-3xl">
            {t("common.appName")}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            {t("auth.forgotSubtitle")}
          </p>
        </div>
        <div className="flex w-full flex-wrap items-center justify-center gap-2">
          <LanguageSwitcher compact />
          <ThemeToggle compact />
        </div>
      </div>

      <form action={action} className="space-y-5">
        <FormMessage result={state} />
        <Input
          label={t("auth.email")}
          name="email"
          type="email"
          placeholder="you@example.com"
          required
          autoComplete="email"
        />
        <Button type="submit" className="w-full" size="lg" disabled={pending}>
          {pending ? t("common.loading") : t("auth.sendReset")}
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-muted">
        <Link
          href="/login"
          className="font-semibold text-primary hover:underline"
        >
          {t("auth.backToSignIn")}
        </Link>
      </p>
    </Card>
  );
}
