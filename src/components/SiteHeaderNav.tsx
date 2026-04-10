"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navFocus =
  "inline-flex min-h-11 min-w-11 items-center justify-center rounded-md px-3 text-white/90 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tp-accent focus-visible:ring-offset-2 focus-visible:ring-offset-tp-navy";

const ctaFocus =
  "inline-flex min-h-11 items-center justify-center rounded-md bg-tp-blue px-4 font-medium text-white transition-colors hover:bg-tp-blue-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tp-accent focus-visible:ring-offset-2 focus-visible:ring-offset-tp-navy";

export function SiteHeaderNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary" className="flex flex-wrap items-center justify-end gap-1 sm:gap-2">
      <Link
        href="/tours"
        className={navFocus}
        aria-current={pathname === "/tours" || pathname?.startsWith("/tours/") ? "page" : undefined}
      >
        Tours
      </Link>
      <Link
        href="/auth/login"
        className={navFocus}
        aria-current={pathname?.startsWith("/auth/login") ? "page" : undefined}
      >
        Sign in
      </Link>
      <Link
        href="/auth/register"
        className={ctaFocus}
        aria-current={pathname?.startsWith("/auth/register") ? "page" : undefined}
      >
        List your tours
      </Link>
    </nav>
  );
}
