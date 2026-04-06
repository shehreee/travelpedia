import Link from "next/link";
import { RegisterForm } from "./register-form";

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:px-6">
      <h1 className="text-2xl font-bold text-tp-navy">Operator signup</h1>
      <p className="mt-1 text-sm text-tp-muted">
        Sign up as an operator. Admin approval is required before publishing tours.
      </p>
      <div className="mt-8 rounded-xl border border-tp-border bg-white p-6 shadow-sm">
        <RegisterForm />
      </div>
      <p className="mt-6 text-center text-sm text-tp-muted">
        Already registered?{" "}
        <Link href="/auth/login" className="font-semibold text-tp-blue hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
