"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { Mail, ShieldCheck } from "lucide-react";
import { BrandLogo } from "@/components/ui/brand-logo";
import {
  resetPasswordWithOtp,
  sendPasswordResetOtp,
} from "@/lib/actions/auth";
import { FormMessage } from "@/components/auth/form-message";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useTranslation } from "@/components/providers/i18n-provider";

export function ForgotPasswordForm() {
  const t = useTranslation();
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [sendState, sendAction, sendPending] = useActionState(
    sendPasswordResetOtp,
    {}
  );
  const [resetState, resetAction, resetPending] = useActionState(
    resetPasswordWithOtp,
    {}
  );

  const activeState = step === "email" ? sendState : resetState;
  const pending = step === "email" ? sendPending : resetPending;

  useEffect(() => {
    if (sendState.success && step === "email") {
      setStep("otp");
    }
  }, [sendState.success, step]);

  return (
    <Card padding="lg" className="mx-auto w-full max-w-md">
      <div className="mb-8 flex flex-col items-center gap-4 text-center">
        <BrandLogo size={56} className="accent-glow rounded-2xl" />
        <div>
          <h1 className="font-display text-2xl font-bold text-primary sm:text-3xl">
            {step === "email" ? "Forgot password" : "Enter verification code"}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            {step === "email"
              ? "We will email a 6-digit code to reset your password."
              : `Enter the code sent to ${email}`}
          </p>
        </div>
        <div className="flex w-full flex-wrap items-center justify-center gap-2">
          <LanguageSwitcher compact />
          <ThemeToggle compact />
        </div>
      </div>

      <div className="mb-5 flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-left">
        <Mail className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
        <p className="text-xs leading-relaxed text-muted">
          <span className="font-semibold text-foreground">Important:</span> use the{" "}
          <span className="font-semibold text-foreground">same email address</span> you
          used when you first registered. Password reset only works for that email.
        </p>
      </div>

      {step === "email" ? (
        <form
          action={sendAction}
          className="space-y-5"
          onSubmit={(e) => {
            const form = e.currentTarget;
            const value = (
              form.elements.namedItem("email") as HTMLInputElement
            )?.value?.trim();
            if (value) setEmail(value.toLowerCase());
          }}
        >
          <FormMessage result={activeState} />
          <Input
            label={t("auth.email")}
            name="email"
            type="email"
            placeholder="you@example.com"
            required
            autoComplete="email"
            defaultValue={email}
          />
          <Button type="submit" className="w-full" size="lg" disabled={pending}>
            {pending ? t("common.loading") : "Send verification code"}
          </Button>
        </form>
      ) : (
        <form action={resetAction} className="space-y-5">
          <FormMessage result={activeState} />
          <input type="hidden" name="email" value={email} />
          <Input
            label="6-digit code from email"
            name="otp"
            type="text"
            inputMode="numeric"
            pattern="[0-9]{6}"
            maxLength={6}
            placeholder="123456"
            required
            autoComplete="one-time-code"
          />
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
            {pending ? t("common.loading") : "Reset password"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            size="lg"
            disabled={pending}
            onClick={() => setStep("email")}
          >
            Use a different email
          </Button>
        </form>
      )}

      <div className="mt-6 flex items-start gap-2 rounded-lg border border-border bg-surface-bright/50 px-3 py-2.5 text-xs text-muted">
        <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
        <p>
          Reset links open on{" "}
          <span className="font-semibold text-foreground">gogenzeb.com</span>. You can
          also tap the link in the email instead of entering the code.
        </p>
      </div>

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
