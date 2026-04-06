import Link from "next/link";
import { ResetPasswordForm } from "./reset-password-form";

export default function ResetPasswordPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:px-6">
      <h1 className="text-2xl font-bold text-tp-navy">Set a new password</h1>
      <p className="mt-1 text-sm text-tp-muted">
        Choose a new password for your Travelpedia account.
      </p>
      <div className="mt-8 rounded-xl border border-tp-border bg-white p-6 shadow-sm">
        <ResetPasswordForm />
      </div>
      <p className="mt-6 text-center text-sm text-tp-muted">
        <Link href="/auth/login" className="font-semibold text-tp-blue hover:underline">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
