import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { TourReview } from "@/types/database";
import { ReviewModerationActions } from "./review-actions";

export default async function AdminReviewsPage() {
  const supabase = await createClient();
  const { data: rows } = await supabase
    .from("tour_reviews")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  const list = (rows ?? []) as TourReview[];
  const tourIds = [...new Set(list.map((r) => r.tour_id))];

  const tourMeta: Record<string, { destination: string; listing_company: string | null }> = {};
  if (tourIds.length > 0) {
    const { data: tours } = await supabase
      .from("tours")
      .select("id, destination, listing_company")
      .in("id", tourIds);
    for (const t of tours ?? []) {
      tourMeta[t.id] = {
        destination: t.destination,
        listing_company: t.listing_company,
      };
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-tp-navy">Reviews</h1>
      <p className="mt-1 text-sm text-tp-muted">
        Approve or reject traveler reviews before they appear on public tour pages.
      </p>

      <div className="mt-6 overflow-hidden rounded-xl border border-tp-border bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-tp-border bg-tp-surface text-xs uppercase text-tp-muted">
            <tr>
              <th className="px-4 py-3">Tour</th>
              <th className="px-4 py-3">Author</th>
              <th className="px-4 py-3">Rating</th>
              <th className="px-4 py-3">Comment</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-tp-muted">
                  No pending reviews. Apply{" "}
                  <code className="rounded bg-tp-surface px-1">003_marketplace_reviews_categories.sql</code>{" "}
                  if the reviews table is not set up yet.
                </td>
              </tr>
            ) : (
              list.map((r) => {
                const meta = tourMeta[r.tour_id];
                return (
                  <tr key={r.id} className="border-b border-tp-border last:border-0">
                    <td className="px-4 py-3 align-top">
                      <p className="font-medium">{meta?.destination ?? "Tour"}</p>
                      {meta?.listing_company && (
                        <p className="text-xs text-tp-muted">{meta.listing_company}</p>
                      )}
                      <Link
                        href={`/tours/${r.tour_id}`}
                        className="text-xs font-semibold text-tp-blue hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View tour
                      </Link>
                    </td>
                    <td className="px-4 py-3 align-top">
                      <p>{r.author_name}</p>
                      {r.author_email && (
                        <p className="text-xs text-tp-muted">{r.author_email}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 align-top">{r.rating} / 5</td>
                    <td className="max-w-xs px-4 py-3 align-top text-tp-muted">
                      {r.comment?.trim() || "—"}
                    </td>
                    <td className="px-4 py-3 align-top">
                      <ReviewModerationActions reviewId={r.id} />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
