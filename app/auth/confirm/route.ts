import { createClient } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";

type EmailOtpType =
  | "signup"
  | "invite"
  | "magiclink"
  | "recovery"
  | "email_change"
  | "email";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const adminAccessKey = process.env.ADMIN_ACCESS_KEY;
  const adminUrl = adminAccessKey ? `/panel/${adminAccessKey}` : "/";

  if (token_hash && type) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { error } = await supabase.auth.verifyOtp({
      token_hash,
      type,
    });

    if (!error) {
      return NextResponse.redirect(new URL(adminUrl, request.url));
    }
  }

  // エラー時も管理者画面にリダイレクト
  const errorUrl = new URL(adminUrl, request.url);
  errorUrl.searchParams.set("auth_error", "confirmation_failed");
  return NextResponse.redirect(errorUrl);
}
