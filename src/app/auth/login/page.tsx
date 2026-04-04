import Link from "next/link";
import { LoginForm } from "./login-form";

type Props = {
  searchParams: Promise<{ next?: string }>;
};

export default async function LoginPage({ searchParams }: Props) {
  const sp = await searchParams;
  const next = typeof sp.next === "string" ? sp.next : "/operator/dashboard";

  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:px-6">
      <h1 className="text-2xl font-bold text-tp-navy">Sign in</h1>
      <p className="mt-1 text-sm text-tp-muted">
        Operators and admins — use the account created in Supabase.
      </p>
      <div className="mt-8 rounded-xl border border-tp-border bg-white p-6 shadow-sm">
        <LoginForm nextPath={next} />
      </div>
      <p className="mt-6 text-center text-sm text-tp-muted">
        New operator?{" "}
        <Link href="/auth/register" className="font-semibold text-tp-blue hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
