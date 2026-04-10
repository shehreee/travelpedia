import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "How Travelpedia handles personal data and your choices.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold text-tp-navy">Privacy policy</h1>
      <p className="mt-2 text-sm text-tp-muted">Last updated: April 2026</p>
      <div className="prose prose-sm mt-8 max-w-none text-tp-text">
        <p>
          Travelpedia is a discovery and lead-generation directory. We connect travelers with tour
          operators; we do not process trip payments on this site.
        </p>
        <h2 className="mt-8 text-lg font-bold text-tp-navy">Data we collect</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Account data you provide at registration (e.g. email, name, company).</li>
          <li>Inquiry and review content you submit on listings.</li>
          <li>Technical logs typical of web hosting (IP, browser, timestamps) via our providers.</li>
        </ul>
        <h2 className="mt-8 text-lg font-bold text-tp-navy">How we use data</h2>
        <p className="mt-2">
          To operate the platform, moderate listings and reviews, respond to abuse reports, and meet
          legal obligations. Operators receive inquiry details you send so they can contact you
          directly.
        </p>
        <h2 className="mt-8 text-lg font-bold text-tp-navy">Your rights (including GDPR-style)</h2>
        <p className="mt-2">
          Where applicable you may request access, correction, deletion, or export of personal data
          tied to your account, and object to certain processing. Contact the site operator using the
          details you were given at signup or on your contract.
        </p>
        <h2 className="mt-8 text-lg font-bold text-tp-navy">Cookies</h2>
        <p className="mt-2">
          We use cookies and similar technologies needed for sign-in and security (e.g. session
          cookies). You can control cookies through your browser settings.
        </p>
        <p className="mt-8">
          <Link href="/" className="font-semibold text-tp-blue hover:underline">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
