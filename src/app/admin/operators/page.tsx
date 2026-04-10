import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/types/database";
import { OperatorActions } from "./operator-actions";
import Link from "next/link";

export default async function AdminOperatorsPage() {
  const supabase = await createClient();
  const { data: rows } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "operator")
    .order("created_at", { ascending: false });

  const list = (rows ?? []) as Profile[];

  return (
    <div>
      <h1 className="text-2xl font-bold text-tp-navy">Operators</h1>
      <p className="mt-1 text-sm text-tp-muted">Approve or reject tour operator registrations.</p>

      <div className="mt-6 overflow-hidden rounded-xl border border-tp-border bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-tp-border bg-tp-surface text-xs uppercase text-tp-muted">
            <tr>
              <th className="px-4 py-3">Company</th>
              <th className="hidden px-4 py-3 md:table-cell">Contact</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">HUT</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-tp-muted">
                  No operators yet.
                </td>
              </tr>
            ) : (
              list.map((p) => (
                <tr key={p.id} className="border-b border-tp-border last:border-0">
                  <td className="px-4 py-3">
                    <p className="font-medium">{p.company_name || "—"}</p>
                    <p className="text-xs text-tp-muted md:hidden">{p.email}</p>
                  </td>
                  <td className="hidden px-4 py-3 text-tp-muted md:table-cell">
                    <p>{p.full_name}</p>
                    <p className="text-xs">{p.email}</p>
                    <p className="text-xs">{p.phone}</p>
                  </td>
                  <td className="px-4 py-3 capitalize">{p.approval_status}</td>
                  <td className="px-4 py-3">
                    {p.approval_status === "approved" ? (
                      <Link
                        href={`/hut/${p.id}`}
                        className="font-medium text-tp-blue hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Open HUT
                      </Link>
                    ) : (
                      <span className="text-tp-muted">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {p.approval_status === "pending" && (
                      <OperatorActions profileId={p.id} />
                    )}
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
