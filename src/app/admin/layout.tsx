import Link from "next/link";
import { redirect } from "next/navigation";
import { SignOutButton } from "@/components/SignOutButton";
import { createClient } from "@/lib/supabase/server";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12">
        <p className="text-tp-muted">Configure Supabase in .env.local to use the admin area.</p>
      </div>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login?next=/admin");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, approval_status")
    .eq("id", user.id)
    .single();

  const isAdmin =
    profile?.role === "admin" && profile?.approval_status === "approved";
  if (!isAdmin) {
    redirect("/auth/login");
  }

  return (
    <div className="border-b border-tp-border bg-tp-navy text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="text-xs font-medium uppercase text-white/70">Admin</p>
          <p className="font-semibold">Travelpedia moderation</p>
        </div>
        <nav className="flex flex-wrap items-center gap-2 text-sm">
          <Link href="/admin" className="rounded-md px-3 py-2 font-medium hover:bg-white/10">
            Overview
          </Link>
          <Link
            href="/admin/operators"
            className="rounded-md px-3 py-2 font-medium hover:bg-white/10"
          >
            Operators
          </Link>
          <Link href="/admin/tours" className="rounded-md px-3 py-2 font-medium hover:bg-white/10">
            Tours
          </Link>
          <Link href="/admin/reviews" className="rounded-md px-3 py-2 font-medium hover:bg-white/10">
            Reviews
          </Link>
          <Link href="/" className="rounded-md px-3 py-2 font-medium hover:bg-white/10">
            Public site
          </Link>
          <div className="border-l border-white/20 pl-2">
            <SignOutButton className="border-white/30 text-white hover:bg-white/10" />
          </div>
        </nav>
      </div>
      <div className="bg-tp-surface text-tp-text">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</div>
      </div>
    </div>
  );
}
