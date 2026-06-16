"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { AuthDivider } from "@/components/auth/auth-divider";
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";
import { BrandLogo } from "@/components/ui/brand-logo";
import { login } from "@/lib/actions/auth";
import { FormMessage } from "@/components/auth/form-message";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useTranslation } from "@/components/providers/i18n-provider";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, {});
  const t = useTranslation();
  const searchParams = useSearchParams();
  const callbackError = searchParams.get("error");
  const errorDetails = searchParams.get("details");

  return (
    <Card padding="lg" className="mx-auto w-full max-w-md">
      <div className="mb-8 flex flex-col items-center gap-4 text-center">
        <BrandLogo size={56} className="accent-glow rounded-2xl" />
        <div>
          <h1 className="font-display text-2xl font-bold text-primary sm:text-3xl">
            {t("common.appName")}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            {t("auth.signInSubtitle")}
          </p>
        </div>
        <div className="flex w-full flex-wrap items-center justify-center gap-2">
          <LanguageSwitcher compact />
          <ThemeToggle compact />
        </div>
      </div>

      <GoogleSignInButton />

      <AuthDivider />

      <form action={action} className="space-y-5">
        <FormMessage
          result={
            callbackError === "auth_callback_failed"
              ? {
                  error: errorDetails
                    ? decodeURIComponent(errorDetails)
                    : t("auth.googleError"),
                }
              : state
          }
        />
        <Input
          label={t("auth.email")}
          name="email"
          type="email"
          placeholder="you@example.com"
          required
          autoComplete="email"
        />
        <PasswordInput
          label={t("auth.password")}
          name="password"
          placeholder="••••••••"
          required
          autoComplete="current-password"
          showPasswordLabel={t("auth.showPassword")}
          hidePasswordLabel={t("auth.hidePassword")}
        />
        <div className="text-right">
          <Link
            href="/forgot-password"
            className="text-sm font-medium text-primary hover:underline"
          >
            {t("auth.forgotPassword")}
          </Link>
        </div>
        <Button type="submit" className="w-full" size="lg" disabled={pending}>
          {pending ? t("auth.signingIn") : t("auth.signIn")}
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-muted">
        {t("auth.noAccount")}{" "}
        <Link
          href="/register"
          className="font-semibold text-primary hover:underline"
        >
          {t("auth.register")}
        </Link>
      </p>
    </Card>
  );
}
