import { NextResponse } from "next/server";
import { getPostLoginPath } from "@/lib/data/profile";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next");
  const referralCode = searchParams.get("referral_code");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      if (referralCode) {
        await supabase.rpc("link_referral_by_code", {
          ref_code: referralCode,
        });
      }

      if (next) {
        return NextResponse.redirect(`${origin}${next}`);
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", (await supabase.auth.getUser()).data.user?.id ?? "")
        .maybeSingle();

      const destination = getPostLoginPath(profile?.role === "admin" ? "admin" : "user");
      return NextResponse.redirect(`${origin}${destination}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
