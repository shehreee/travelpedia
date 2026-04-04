import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-tp-border bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
          <div>
            <p className="font-semibold text-tp-navy">Travelpedia</p>
            <p className="mt-2 max-w-sm text-sm text-tp-muted">
              Discover fixed-departure group tours across Northern Pakistan. We connect
              travelers with verified operators — inquiries only, no payments on the
              platform.
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
              </ul>
            </div>
            <div>
              <p className="font-medium text-tp-text">Legal</p>
              <ul className="mt-2 space-y-1 text-tp-muted">
                <li>
                  <span className="cursor-default">Terms (Phase 1)</span>
                </li>
                <li>
                  <span className="cursor-default">Privacy (Phase 1)</span>
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
