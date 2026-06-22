"use server";

import { redirect } from "next/navigation";
import { getAuthCallbackUrl } from "@/lib/app-url";
import { createClient } from "@/lib/supabase/server";
import { getPostLoginPath, getCurrentProfile } from "@/lib/data/profile";
import type { ActionResult } from "@/types/database";

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
      emailRedirectTo: getAuthCallbackUrl(),
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (data.session) {
    const profile = await getCurrentProfile();
    redirect(getPostLoginPath(profile?.role ?? "user"));
  }

  return {
    success:
      "Account created successfully. You can sign in now with your email and password.",
  };
}

export async function forgotPassword(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const email = String(formData.get("email") ?? "").trim();

  if (!email) {
    return { error: "Email is required." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: getAuthCallbackUrl("/reset-password"),
  });

  if (error) {
    return { error: error.message };
  }

  return { success: "Password reset link sent. Check your email." };
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
