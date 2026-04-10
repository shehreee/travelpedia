import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

/**
 * Only refresh the Supabase session on routes that use server-side auth.
 * Running `getUser()` on every public page (/, /tours, etc.) added a Supabase
 * round-trip to *every* navigation and made the app feel sluggish (>1s taps).
 */
export async function middleware(request: NextRequest) {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return NextResponse.next();
  }

  return updateSession(request);
}

export const config = {
  matcher: ["/operator/:path*", "/admin/:path*", "/auth/callback"],
};
