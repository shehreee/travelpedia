import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of service",
  description: "Terms for using Travelpedia as a traveler or operator.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold text-tp-navy">Terms of service</h1>
      <p className="mt-2 text-sm text-tp-muted">Last updated: April 2026</p>
      <div className="prose prose-sm mt-8 max-w-none text-tp-text">
        <p>
          By using Travelpedia you agree to these terms. The service lists tours and operator
          profiles for information and lead generation only. Bookings, pricing, and contracts are
          between you and the operator unless we state otherwise in writing.
        </p>
        <h2 className="mt-8 text-lg font-bold text-tp-navy">Operator listings</h2>
        <p className="mt-2">
          Operators must provide accurate information. We may approve, edit, reject, or remove
          listings or accounts to reduce fraud, spam, or legal risk. Suspended operators cannot use
          operator tools until reinstated.
        </p>
        <h2 className="mt-8 text-lg font-bold text-tp-navy">Reviews</h2>
        <p className="mt-2">
          Reviews are moderated. Do not post illegal, abusive, or misleading content. We may remove
          content or reject submissions that violate these terms.
        </p>
        <h2 className="mt-8 text-lg font-bold text-tp-navy">Disclaimer</h2>
        <p className="mt-2">
          Listings are provided by third parties. Travelpedia does not guarantee availability,
          safety, or quality of any trip. Use your own judgment and confirm details with the operator.
        </p>
        <p className="mt-8">
          <Link href="/privacy" className="font-semibold text-tp-blue hover:underline">
            Privacy policy
          </Link>
          {" · "}
          <Link href="/" className="font-semibold text-tp-blue hover:underline">
            Home
          </Link>
        </p>
      </div>
    </div>
  );
}
