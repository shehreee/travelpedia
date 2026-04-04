import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center">
      <h1 className="text-2xl font-bold text-tp-navy">Page not found</h1>
      <p className="mt-2 text-tp-muted">
        This tour or page does not exist, or it is not published yet.
      </p>
      <Link
        href="/tours"
        className="mt-8 rounded-md bg-tp-blue px-6 py-3 text-sm font-bold text-white hover:bg-tp-blue-hover"
      >
        Browse tours
      </Link>
    </div>
  );
}
