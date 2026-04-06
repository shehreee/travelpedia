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
            <div>
              <p className="font-medium text-tp-text">Explore</p>
              <ul className="mt-2 space-y-1 text-tp-muted">
                <li>
                  <Link href="/tours" className="hover:text-tp-blue">
                    All tours
                  </Link>
                </li>
                <li>
                  <Link href="/auth/register" className="hover:text-tp-blue">
                    For operators
                  </Link>
                </li>
                <li>
                  <Link href="/auth/login" className="hover:text-tp-blue">
                    Sign in
                  </Link>
                </li>
                <li>
                  <Link href="/auth/forgot-password" className="hover:text-tp-blue">
                    Forgot password
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-tp-text">Legal</p>
              <ul className="mt-2 space-y-1 text-tp-muted">
                <li>
                  <span className="cursor-default">Terms</span>
                </li>
                <li>
                  <span className="cursor-default">Privacy</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <p className="mt-8 border-t border-tp-border pt-6 text-center text-xs text-tp-muted">
          © {new Date().getFullYear()} Travelpedia — Tourism discovery &amp; lead generation.
        </p>
      </div>
    </footer>
  );
}
