"use client";

import Link from "next/link";
import { useActionState } from "react";
import { BrandLogo } from "@/components/ui/brand-logo";
import { resetPassword } from "@/lib/actions/auth";
import { FormMessage } from "@/components/auth/form-message";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PasswordInput } from "@/components/ui/password-input";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useTranslation } from "@/components/providers/i18n-provider";

type ResetPasswordFormProps = {
  isAuthenticated: boolean;
};

export function ResetPasswordForm({ isAuthenticated }: ResetPasswordFormProps) {
  const [state, action, pending] = useActionState(resetPassword, {});
  const t = useTranslation();

  if (!isAuthenticated) {
    return (
      <Card padding="lg" className="mx-auto w-full max-w-md text-center">
        <BrandLogo size={56} className="mx-auto accent-glow rounded-2xl" />
        <h1 className="mt-6 font-display text-xl font-bold">Reset link expired</h1>
        <p className="mt-2 text-sm text-muted">
          Request a new verification code on the forgot password page. Use the same
          email you registered with.
        </p>
        <Link href="/forgot-password" className="mt-6 inline-block">
          <Button size="lg">Request new code</Button>
        </Link>
      </Card>
    );
  }

  return (
    <Card padding="lg" className="mx-auto w-full max-w-md">
      <div className="mb-8 flex flex-col items-center gap-4 text-center">
        <BrandLogo size={56} className="accent-glow rounded-2xl" />
        <div>
          <h1 className="font-display text-2xl font-bold text-primary sm:text-3xl">
            Set new password
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Choose a new password for your account.
          </p>
        </div>
        <div className="flex w-full flex-wrap items-center justify-center gap-2">
          <LanguageSwitcher compact />
          <ThemeToggle compact />
        </div>
      </div>

      <form action={action} className="space-y-5">
        <FormMessage result={state} />
        <PasswordInput
          label="New password"
          name="new_password"
          required
          autoComplete="new-password"
          showPasswordLabel={t("auth.showPassword")}
          hidePasswordLabel={t("auth.hidePassword")}
        />
        <PasswordInput
          label="Confirm new password"
          name="confirm_password"
          required
          autoComplete="new-password"
          showPasswordLabel={t("auth.showPassword")}
          hidePasswordLabel={t("auth.hidePassword")}
        />
        <Button type="submit" className="w-full" size="lg" disabled={pending}>
          {pending ? t("common.loading") : "Update password"}
        </Button>
      </form>
    </Card>
  );
}
