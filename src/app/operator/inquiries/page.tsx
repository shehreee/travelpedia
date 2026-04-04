import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/format";
import type { Inquiry, Tour } from "@/types/database";

export default async function OperatorInquiriesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: rows } = await supabase
    .from("inquiries")
    .select("*, tours(destination)")
    .eq("operator_id", user.id)
    .order("created_at", { ascending: false });

  type Row = Inquiry & { tours: Pick<Tour, "destination"> | null };

  return (
    <div>
      <h1 className="text-2xl font-bold text-tp-navy">Inquiries</h1>
      <p className="mt-1 text-sm text-tp-muted">
        Leads from travelers who clicked “Send inquiry” on your live tours.
      </p>

      <div className="mt-6 space-y-4">
        {!rows?.length ? (
          <p className="text-tp-muted">No inquiries yet.</p>
        ) : (
          (rows as Row[]).map((r) => (
            <article
              key={r.id}
              className="rounded-xl border border-tp-border bg-white p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-tp-navy">{r.name}</p>
                  <p className="text-sm text-tp-blue">{r.phone}</p>
                </div>
                <p className="text-xs text-tp-muted">{formatDate(r.created_at)}</p>
              </div>
              <p className="mt-2 text-sm text-tp-muted">
                Tour:{" "}
                <span className="font-medium text-tp-text">
                  {r.tours?.destination ?? "—"}
                </span>
                {" · "}
                Seats: {r.seats_requested}
              </p>
              {r.message && (
                <p className="mt-3 whitespace-pre-wrap rounded-lg bg-tp-surface p-3 text-sm">
                  {r.message}
                </p>
              )}
            </article>
          ))
        )}
      </div>
    </div>
  );
}
