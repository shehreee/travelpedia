import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SignOutButton } from "@/components/SignOutButton";

export default async function OperatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12">
        <p className="text-tp-muted">Configure Supabase in .env.local to use the operator area.</p>
      </div>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login?next=/operator/dashboard");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, approval_status, company_name")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "operator") {
    redirect("/auth/login");
  }

  return (
    <div className="border-b border-tp-border bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="text-xs font-medium uppercase text-tp-muted">Operator</p>
          <p className="font-semibold text-tp-navy">
            {profile.company_name || "Your company"}
          </p>
          {profile.approval_status === "pending" && (
            <p className="mt-1 text-sm text-amber-800">
              Account pending admin approval — you cannot publish tours yet.
            </p>
          )}
          {profile.approval_status === "rejected" && (
            <p className="mt-1 text-sm text-red-700">
              Registration was not approved. Contact support.
            </p>
          )}
        </div>
        <nav className="flex flex-wrap items-center gap-2 text-sm">
          <Link
            href="/operator/dashboard"
            className="rounded-md px-3 py-2 font-medium text-tp-text hover:bg-tp-surface"
          >
            Dashboard
          </Link>
          <Link
            href="/operator/tours/new"
            className="rounded-md px-3 py-2 font-medium text-tp-text hover:bg-tp-surface"
          >
            New tour
          </Link>
          <Link
            href="/operator/inquiries"
            className="rounded-md px-3 py-2 font-medium text-tp-text hover:bg-tp-surface"
          >
            Inquiries
          </Link>
          <SignOutButton />
        </nav>
      </div>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</div>
    </div>
  );
}
