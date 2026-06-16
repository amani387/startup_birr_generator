"use server";

import { revalidatePath } from "next/cache";
import { getCurrentProfile } from "@/lib/data/profile";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/types/database";

export async function submitDeposit(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const profile = await getCurrentProfile();
  if (!profile) return { error: "Not authenticated." };

  const amount = Number(formData.get("amount"));
  const paymentMethod = String(formData.get("payment_method") ?? "").trim();
  const transactionRef = String(formData.get("transaction_ref") ?? "").trim();
  const screenshot = formData.get("screenshot");

  if (!amount || amount <= 0) return { error: "Enter a valid deposit amount." };
  if (!paymentMethod) return { error: "Payment method is required." };

  let screenshotUrl: string | null = null;

  if (screenshot instanceof File && screenshot.size > 0) {
    const supabase = await createClient();
    const ext = screenshot.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const path = `${profile.id}/${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("deposits")
      .upload(path, screenshot, { contentType: screenshot.type });

    if (uploadError) {
      return {
        error: "Could not upload screenshot. Ensure the deposits storage bucket exists in Supabase.",
      };
    }

    screenshotUrl = path;
  }

  const supabase = await createClient();
  const { error } = await supabase.from("deposits").insert({
    user_id: profile.id,
    amount,
    payment_method: paymentMethod,
    screenshot_url: screenshotUrl,
    transaction_ref: transactionRef || null,
    status: "pending",
  });

  if (error) return { error: error.message };

  revalidatePath("/dashboard/deposits");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/transactions");
  return { success: "Deposit submitted! We will review it shortly." };
}
