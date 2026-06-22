"use server";

import { redirect } from "next/navigation";
import {
  confirmUserByEmail,
  confirmUserById,
  isAdminAuthAvailable,
  isEmailNotConfirmedError,
} from "@/lib/auth/email-confirm";
import { getPasswordResetRedirectUrl } from "@/lib/app-url";
import { createClient } from "@/lib/supabase/server";
import { getPostLoginPath, getCurrentProfile } from "@/lib/data/profile";
import type { ActionResult } from "@/types/database";

async function signInAndRedirect(email: string, password: string) {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: error.message } satisfies ActionResult;
  }

  const profile = await getCurrentProfile();
  redirect(getPostLoginPath(profile?.role ?? "user"));
}

export async function login(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    if (isEmailNotConfirmedError(error.message) && isAdminAuthAvailable()) {
      const confirmed = await confirmUserByEmail(email);
      if (confirmed) {
        return signInAndRedirect(email, password);
      }
    }

    return { error: error.message };
  }

  const profile = await getCurrentProfile();
  redirect(getPostLoginPath(profile?.role ?? "user"));
}

export async function register(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const fullName = String(formData.get("full_name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const referralCode = String(formData.get("referral_code") ?? "").trim();

  if (!fullName || !email || !password) {
    return { error: "All fields except referral code are required." };
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        ...(referralCode ? { referral_code: referralCode } : {}),
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (data.session) {
    const profile = await getCurrentProfile();
    redirect(getPostLoginPath(profile?.role ?? "user"));
  }

  if (data.user?.id && isAdminAuthAvailable()) {
    await confirmUserById(data.user.id);
    return signInAndRedirect(email, password);
  }

  if (!isAdminAuthAvailable()) {
    return {
      error:
        "Account created but sign-in is blocked until email is confirmed. Add SUPABASE_SERVICE_ROLE_KEY on the server, or disable “Confirm email” in Supabase → Authentication → Providers → Email.",
    };
  }

  return {
    error: "Account created but sign-in failed. Please try logging in.",
  };
}

export async function sendPasswordResetOtp(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  if (!email) {
    return { error: "Email is required." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: getPasswordResetRedirectUrl(),
  });

  if (error) {
    return { error: error.message };
  }

  return {
    success:
      "If an account exists for this email, we sent a 6-digit code and reset link. Use the same email you registered with.",
  };
}

export async function resetPasswordWithOtp(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const otp = String(formData.get("otp") ?? "").trim();
  const newPassword = String(formData.get("new_password") ?? "");
  const confirmPassword = String(formData.get("confirm_password") ?? "");

  if (!email || !otp) {
    return { error: "Email and verification code are required." };
  }

  if (!newPassword || newPassword.length < 6) {
    return { error: "New password must be at least 6 characters." };
  }

  if (newPassword !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  const supabase = await createClient();
  const { error: verifyError } = await supabase.auth.verifyOtp({
    email,
    token: otp,
    type: "recovery",
  });

  if (verifyError) {
    return {
      error:
        verifyError.message ||
        "Invalid or expired code. Request a new one and use the email you registered with.",
    };
  }

  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (updateError) {
    return { error: updateError.message };
  }

  redirect("/login?reset=success");
}

/** @deprecated Use sendPasswordResetOtp — kept for compatibility */
export async function forgotPassword(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  return sendPasswordResetOtp(_prev, formData);
}

export async function resetPassword(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const newPassword = String(formData.get("new_password") ?? "");
  const confirmPassword = String(formData.get("confirm_password") ?? "");

  if (!newPassword || newPassword.length < 6) {
    return { error: "New password must be at least 6 characters." };
  }

  if (newPassword !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Reset link expired. Please request a new one." };
  }

  const { error } = await supabase.auth.updateUser({ password: newPassword });

  if (error) {
    return { error: error.message };
  }

  redirect("/dashboard");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
