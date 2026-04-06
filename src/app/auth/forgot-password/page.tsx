import Link from "next/link";
import { ForgotPasswordForm } from "./forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:px-6">
      <h1 className="text-2xl font-bold text-tp-navy">Forgot password</h1>
      <p className="mt-1 text-sm text-tp-muted">
        Enter your account email and we&apos;ll send you a link to choose a new password.
      </p>
      <div className="mt-8 rounded-xl border border-tp-border bg-white p-6 shadow-sm">
        <ForgotPasswordForm />
      </div>
      <p className="mt-6 text-center text-sm text-tp-muted">
        No account?{" "}
        <Link href="/auth/register" className="font-semibold text-tp-blue hover:underline">
          Signup
        </Link>
      </p>
    </div>
  );
}
