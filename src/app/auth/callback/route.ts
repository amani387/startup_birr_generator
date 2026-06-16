import { NextResponse } from "next/server";
import { getPostLoginPath } from "@/lib/data/profile";
import { getSiteOrigin } from "@/lib/site-origin";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const origin = getSiteOrigin(request);
  const code = searchParams.get("code");
  const next = searchParams.get("next");
  const referralCode = searchParams.get("referral_code");
  const oauthError = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  if (oauthError) {
    const message = errorDescription ?? oauthError;
    return NextResponse.redirect(
      `${origin}/login?error=auth_callback_failed&details=${encodeURIComponent(message)}`
    );
  }

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(
      `${origin}/login?error=auth_callback_failed&details=${encodeURIComponent(error.message)}`
    );
  }

  if (referralCode) {
    await supabase.rpc("link_referral_by_code", { ref_code: referralCode });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (next) {
    return NextResponse.redirect(`${origin}${next}`);
  }

  let role: "user" | "admin" = "user";
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();
    if (profile?.role === "admin") role = "admin";
  }

  return NextResponse.redirect(`${origin}${getPostLoginPath(role)}`);
}
