import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-tp-border bg-tp-navy text-white shadow-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:h-16 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="rounded bg-tp-accent px-2 py-0.5 text-sm font-bold text-tp-navy">
            TP
          </span>
          <span className="text-lg sm:text-xl">Travelpedia</span>
        </Link>
        <nav className="flex items-center gap-1 text-sm sm:gap-3 sm:text-base">
          <Link
            href="/tours"
            className="rounded-md px-2 py-1.5 text-white/90 hover:bg-white/10 sm:px-3"
          >
            Tours
          </Link>
          <Link
            href="/auth/login"
            className="rounded-md px-2 py-1.5 text-white/90 hover:bg-white/10 sm:px-3"
          >
            Sign in
          </Link>
          <Link
            href="/auth/register"
            className="rounded-md bg-tp-blue px-3 py-1.5 font-medium text-white hover:bg-tp-blue-hover sm:px-4"
          >
            List your tours
          </Link>
        </nav>
      </div>
    </header>
  );
}
