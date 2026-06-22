"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState, useMemo } from "react";
import { BarChart3 } from "lucide-react";
import { AuthDivider } from "@/components/auth/auth-divider";
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";
import { login } from "@/lib/actions/auth";
import { GOOGLE_AUTH_ENABLED } from "@/lib/constants";
import { FormMessage } from "@/components/auth/form-message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { useTranslation } from "@/components/providers/i18n-provider";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, {});
  const t = useTranslation();
  const searchParams = useSearchParams();
  const callbackError = searchParams.get("error");
  const errorDetails = searchParams.get("details");
  const passwordReset = searchParams.get("reset");

  const formResult = useMemo(() => {
    if (passwordReset === "success") {
      return { success: "Password updated. Sign in with your new password." };
    }
    if (callbackError === "auth_callback_failed") {
      let message = t("auth.googleError");
      if (errorDetails) {
        try {
          message = decodeURIComponent(errorDetails);
        } catch {
          message = errorDetails;
        }
      }
      return { error: message };
    }
    return state;
  }, [callbackError, errorDetails, passwordReset, state, t]);

  return (
    <div className="w-full">
      <div className="mb-8 flex items-center gap-2 lg:hidden">
        <BarChart3 className="h-7 w-7 text-primary" strokeWidth={2.5} />
        <span className="font-display text-xl font-bold text-foreground">
          {t("common.appName")}
        </span>
      </div>

      <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
        Welcome to {t("common.appName")}
      </h1>
      <p className="mt-2 text-sm text-muted">{t("auth.signInSubtitle")}</p>

      <form action={action} className="mt-8 space-y-5">
        <FormMessage result={formResult} />
        <Input
          label="Phone or Email address"
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
        <Button type="submit" className="w-full" size="lg" disabled={pending}>
          {pending ? t("auth.signingIn") : "Log In"}
        </Button>
        <div className="text-center">
          <Link
            href="/forgot-password"
            className="text-sm font-medium text-primary hover:underline"
          >
            {t("auth.forgotPassword")}
          </Link>
          <p className="mt-2 text-xs text-muted">
            Use the same email you registered with to reset your password.
          </p>
        </div>
      </form>

      {GOOGLE_AUTH_ENABLED && (
        <div className="mt-6">
          <AuthDivider />
          <div className="mt-6">
            <GoogleSignInButton />
          </div>
        </div>
      )}

      <p className="mt-8 text-center text-sm text-muted">
        {t("auth.noAccount")}{" "}
        <Link href="/register" className="font-semibold text-primary hover:underline">
          {t("auth.register")}
        </Link>
      </p>
    </div>
  );
}
