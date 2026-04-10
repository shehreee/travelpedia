import Link from "next/link";
import { SiteHeaderNav } from "@/components/SiteHeaderNav";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-tp-navy text-white shadow-md">
      <div className="mx-auto flex min-h-14 max-w-6xl items-center justify-between gap-4 px-4 py-2 sm:min-h-16 sm:px-6">
        <Link
          href="/"
          className="flex min-h-11 min-w-11 items-center gap-2 rounded-md font-semibold tracking-tight outline-none ring-offset-2 ring-offset-tp-navy focus-visible:ring-2 focus-visible:ring-tp-accent"
        >
          <span className="rounded bg-tp-accent px-2 py-0.5 text-sm font-bold text-tp-navy" aria-hidden>
            TP
          </span>
          <span className="text-lg sm:text-xl">Travelpedia</span>
          <span className="sr-only">, go to home</span>
        </Link>
        <SiteHeaderNav />
      </div>
    </header>
  );
}
