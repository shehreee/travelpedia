import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-tp-border bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
          <div>
            <p className="font-semibold text-tp-navy">Travelpedia</p>
            <p className="mt-2 max-w-sm text-sm text-tp-muted">
              Discover curated tours across Northern Pakistan. Travelpedia connects
              travelers with verified operators through a simple inquiry experience.
            </p>
          </div>
          <div className="flex flex-wrap gap-8 text-sm">
            <nav aria-label="Footer explore">
              <p className="font-medium text-tp-text">Explore</p>
              <ul className="mt-2 space-y-2 text-tp-muted">
                <li>
                  <Link
                    href="/tours"
                    className="rounded-sm text-tp-muted underline-offset-4 outline-none hover:text-tp-blue hover:underline focus-visible:ring-2 focus-visible:ring-tp-blue focus-visible:ring-offset-2"
                  >
                    All tours
                  </Link>
                </li>
                <li>
                  <Link
                    href="/auth/register"
                    className="rounded-sm text-tp-muted underline-offset-4 outline-none hover:text-tp-blue hover:underline focus-visible:ring-2 focus-visible:ring-tp-blue focus-visible:ring-offset-2"
                  >
                    For operators
                  </Link>
                </li>
                <li>
                  <Link
                    href="/auth/login"
                    className="rounded-sm text-tp-muted underline-offset-4 outline-none hover:text-tp-blue hover:underline focus-visible:ring-2 focus-visible:ring-tp-blue focus-visible:ring-offset-2"
                  >
                    Sign in
                  </Link>
                </li>
                <li>
                  <Link
                    href="/auth/forgot-password"
                    className="rounded-sm text-tp-muted underline-offset-4 outline-none hover:text-tp-blue hover:underline focus-visible:ring-2 focus-visible:ring-tp-blue focus-visible:ring-offset-2"
                  >
                    Forgot password
                  </Link>
                </li>
              </ul>
            </nav>
            <nav aria-label="Legal">
              <p className="font-medium text-tp-text">Legal</p>
              <ul className="mt-2 space-y-2 text-tp-muted">
                <li>
                  <span className="text-tp-muted">Terms (coming soon)</span>
                </li>
                <li>
                  <span className="text-tp-muted">Privacy (coming soon)</span>
                </li>
              </ul>
            </nav>
          </div>
        </div>
        <p className="mt-8 border-t border-tp-border pt-6 text-center text-xs text-tp-muted">
          © {new Date().getFullYear()} Travelpedia — Tourism discovery &amp; lead generation.
        </p>
      </div>
    </footer>
  );
}
