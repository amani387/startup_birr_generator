"use client";

import Link from "next/link";
import { useActionState } from "react";
import { BarChart3 } from "lucide-react";
import { AuthDivider } from "@/components/auth/auth-divider";
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";
import { register } from "@/lib/actions/auth";
import { GOOGLE_AUTH_ENABLED } from "@/lib/constants";
import { FormMessage } from "@/components/auth/form-message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { useTranslation } from "@/components/providers/i18n-provider";

type RegisterFormProps = {
  defaultReferralCode?: string;
};

export function RegisterForm({ defaultReferralCode }: RegisterFormProps) {
  const [state, action, pending] = useActionState(register, {});
  const t = useTranslation();

  return (
    <div className="w-full">
      <div className="mb-8 flex items-center gap-2 lg:hidden">
        <BarChart3 className="h-7 w-7 text-primary" strokeWidth={2.5} />
        <span className="font-display text-xl font-bold text-foreground">
          {t("common.appName")}
        </span>
      </div>

      <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
        Create your account
      </h1>
      <p className="mt-2 text-sm text-muted">{t("auth.registerSubtitle")}</p>

      <form action={action} className="mt-8 space-y-5">
        <FormMessage result={state} />
        <Input
          label={t("auth.fullName")}
          name="full_name"
          placeholder="Abebe Kebede"
          required
          autoComplete="name"
        />
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
          autoComplete="new-password"
          showPasswordLabel={t("auth.showPassword")}
          hidePasswordLabel={t("auth.hidePassword")}
        />
        <Input
          label={t("auth.referralCode")}
          name="referral_code"
          placeholder="BT-XXXXXXXX"
          defaultValue={defaultReferralCode}
          hint={t("auth.referralHint")}
        />
        <Button type="submit" className="w-full" size="lg" disabled={pending}>
          {pending ? t("common.loading") : t("auth.createAccount")}
        </Button>
      </form>

      {GOOGLE_AUTH_ENABLED && (
        <div className="mt-6">
          <AuthDivider />
          <div className="mt-6">
            <GoogleSignInButton referralCode={defaultReferralCode} />
          </div>
        </div>
      )}

      <p className="mt-8 text-center text-sm text-muted">
        {t("auth.hasAccount")}{" "}
        <Link href="/login" className="font-semibold text-primary hover:underline">
          {t("auth.signIn")}
        </Link>
      </p>
    </div>
  );
}
