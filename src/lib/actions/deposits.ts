"use server";

import { revalidatePath } from "next/cache";
import { getCurrentProfile } from "@/lib/data/profile";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/types/database";

const MAX_SCREENSHOT_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
]);

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

  if (!(screenshot instanceof File) || screenshot.size === 0) {
    return { error: "Please attach a payment screenshot." };
  }

  if (screenshot.size > MAX_SCREENSHOT_BYTES) {
    return { error: "Screenshot must be 5 MB or smaller." };
  }

  const contentType = screenshot.type || "image/jpeg";
  if (!ALLOWED_TYPES.has(contentType)) {
    return { error: "Screenshot must be a JPG, PNG, or WebP image." };
  }

  const supabase = await createClient();
  const ext = screenshot.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const path = `${profile.id}/${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("deposits")
    .upload(path, screenshot, {
      contentType,
      upsert: false,
    });

  if (uploadError) {
    if (uploadError.message.includes("Bucket not found")) {
      return {
        error:
          "Storage is not configured. Ask admin to run migration 004_deposits_storage.sql in Supabase.",
      };
    }
    return { error: `Upload failed: ${uploadError.message}` };
  }

  const { error } = await supabase.from("deposits").insert({
    user_id: profile.id,
    amount,
    payment_method: paymentMethod,
    screenshot_url: path,
    transaction_ref: transactionRef || null,
    status: "pending",
  });

  if (error) return { error: error.message };

  revalidatePath("/dashboard/deposits");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/transactions");
  revalidatePath("/admin/deposits");
  return { success: "Deposit submitted! We will review it shortly." };
}
