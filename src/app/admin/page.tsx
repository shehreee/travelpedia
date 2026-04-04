import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AdminHomePage() {
  const supabase = await createClient();

  const [{ count: pendingOperators }, { count: pendingTours }, { count: activeTours }] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .eq("role", "operator")
        .eq("approval_status", "pending"),
      supabase
        .from("tours")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending"),
      supabase
        .from("tours")
        .select("*", { count: "exact", head: true })
        .eq("status", "active"),
    ]);

  const cards = [
    {
      label: "Operators awaiting approval",
      value: pendingOperators ?? 0,
      href: "/admin/operators",
    },
    {
      label: "Tours awaiting approval",
      value: pendingTours ?? 0,
      href: "/admin/tours",
    },
    {
      label: "Live tours",
      value: activeTours ?? 0,
      href: "/tours",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-tp-navy">Overview</h1>
      <p className="mt-1 text-sm text-tp-muted">
        Approve operators and listings before they appear on the public site.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="rounded-xl border border-tp-border bg-white p-6 shadow-sm transition hover:border-tp-blue"
          >
            <p className="text-3xl font-bold text-tp-navy">{c.value}</p>
            <p className="mt-2 text-sm font-medium text-tp-muted">{c.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
