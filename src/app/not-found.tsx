import Link from "next/link";

export default function NotFound() {
  return (
    <div
      className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center"
      role="status"
      aria-live="polite"
    >
      <p className="text-sm font-medium uppercase tracking-wide text-tp-muted">Error 404</p>
      <h1 className="mt-2 text-2xl font-bold text-tp-navy">Page not found</h1>
      <p className="mt-3 max-w-sm text-tp-muted">
        This page does not exist or is not available. If you followed a tour link, it may have been
        removed or is not published yet.
      </p>
      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Link href="/tours" className="tp-btn-primary px-6">
          Browse tours
        </Link>
        <Link href="/" className="tp-btn-secondary px-6">
          Back to home
        </Link>
      </div>
    </div>
  );
}
