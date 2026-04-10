import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatDate, formatPkr } from "@/lib/format";
import type { Tour } from "@/types/database";
import { TourActions } from "./tour-actions";

export default async function AdminToursPage() {
  const supabase = await createClient();
  const { data: rows } = await supabase
    .from("tours")
    .select("*")
    .order("created_at", { ascending: false });

  const list = (rows ?? []) as Tour[];

  return (
    <div>
      <h1 className="text-2xl font-bold text-tp-navy">Tours</h1>
      <p className="mt-1 text-sm text-tp-muted">
        Approve pending listings or reject low-quality content.
      </p>

      <div className="mt-6 overflow-hidden rounded-xl border border-tp-border bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-tp-border bg-tp-surface text-xs uppercase text-tp-muted">
            <tr>
              <th className="px-4 py-3">Tour</th>
              <th className="hidden px-4 py-3 sm:table-cell">Operator</th>
              <th className="px-4 py-3">Departs</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-tp-muted">
                  No tours yet.
                </td>
              </tr>
            ) : (
              list.map((t) => (
                <tr key={t.id} className="border-b border-tp-border last:border-0">
                  <td className="px-4 py-3">
                    <p className="font-medium">{t.destination}</p>
                    {t.status === "active" ? (
                      <Link
                        href={`/tours/${t.id}`}
                        className="text-xs text-tp-blue hover:underline"
                      >
                        Public page
                      </Link>
                    ) : (
                      <span className="text-xs text-tp-muted">Not public yet</span>
                    )}
                  </td>
                  <td className="hidden px-4 py-3 text-tp-muted sm:table-cell">
                    <Link
                      href={`/hut/${t.operator_id}`}
                      className="text-tp-blue hover:underline"
                    >
                      {t.listing_company}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-tp-muted">{formatDate(t.departure_date)}</td>
                  <td className="px-4 py-3">{formatPkr(Number(t.price))}</td>
                  <td className="px-4 py-3 capitalize">{t.status}</td>
                  <td className="px-4 py-3 text-right">
                    {t.status === "pending" && <TourActions tourId={t.id} />}
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
