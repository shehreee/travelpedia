import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatDate, formatPkr } from "@/lib/format";
import type { Tour } from "@/types/database";
import { CloseTourButton } from "./close-tour-button";

export default async function OperatorDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: tours } = await supabase
    .from("tours")
    .select("*")
    .eq("operator_id", user.id)
    .order("created_at", { ascending: false });

  const list = (tours ?? []) as Tour[];

  const badge = (s: Tour["status"]) => {
    const map = {
      pending: "bg-amber-100 text-amber-900",
      active: "bg-emerald-100 text-emerald-900",
      closed: "bg-zinc-200 text-zinc-800",
    };
    return (
      <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${map[s]}`}>{s}</span>
    );
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-tp-navy">Your tours</h1>
      <p className="mt-1 text-sm text-tp-muted">
        Pending tours need admin approval before they appear publicly.
      </p>

      <div className="mt-6 overflow-hidden rounded-xl border border-tp-border bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-tp-border bg-tp-surface text-xs uppercase text-tp-muted">
            <tr>
              <th className="px-4 py-3">Destination</th>
              <th className="hidden px-4 py-3 sm:table-cell">Departs</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-tp-muted">
                  No tours yet.{" "}
                  <Link href="/operator/tours/new" className="font-semibold text-tp-blue hover:underline">
                    Create one
                  </Link>
                </td>
              </tr>
            ) : (
              list.map((t) => (
                <tr key={t.id} className="border-b border-tp-border last:border-0">
                  <td className="px-4 py-3 font-medium">{t.destination}</td>
                  <td className="hidden px-4 py-3 text-tp-muted sm:table-cell">
                    {formatDate(t.departure_date)}
                  </td>
                  <td className="px-4 py-3">{formatPkr(Number(t.price))}</td>
                  <td className="px-4 py-3">{badge(t.status)}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex flex-wrap justify-end gap-2">
                      <Link
                        href={`/operator/tours/${t.id}/edit`}
                        className="rounded-md border border-tp-border px-2 py-1 text-xs font-semibold hover:bg-tp-surface"
                      >
                        Edit
                      </Link>
                      {t.status === "active" && <CloseTourButton tourId={t.id} />}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
