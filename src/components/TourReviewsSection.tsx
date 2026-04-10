import { ReviewSubmitForm } from "@/components/ReviewSubmitForm";
import { averageRating } from "@/lib/demo-reviews";
import { formatDate } from "@/lib/format";
import type { TourReview } from "@/types/database";

type Props = {
  tourId: string;
  reviews: TourReview[];
  canSubmit: boolean;
};

export function TourReviewsSection({ tourId, reviews, canSubmit }: Props) {
  const avg = averageRating(reviews);

  return (
    <section className="border-t border-tp-border pt-6" aria-labelledby="reviews-heading">
      <h2 id="reviews-heading" className="text-lg font-bold text-tp-navy">
        Reviews
      </h2>
      {avg != null && (
        <p className="mt-2 text-sm text-tp-text">
          <span className="font-semibold text-tp-navy">{avg}</span>
          <span className="text-tp-muted"> / 5 average</span>
          <span className="text-tp-muted">
            {" "}
            · {reviews.length} review{reviews.length === 1 ? "" : "s"}
          </span>
        </p>
      )}
      {reviews.length === 0 && (
        <p className="mt-2 text-sm text-tp-muted">No reviews yet — be the first after your trip.</p>
      )}
      <ul className="mt-4 space-y-4">
        {reviews.map((r) => (
          <li
            key={r.id}
            className="rounded-lg border border-tp-border bg-white px-4 py-3 shadow-sm"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="font-semibold text-tp-navy">{r.author_name}</p>
              <p className="text-xs text-tp-muted">{formatDate(r.created_at)}</p>
            </div>
            <p className="mt-1 text-sm text-amber-800">{r.rating} / 5 stars</p>
            {r.comment?.trim() && (
              <p className="mt-2 whitespace-pre-wrap text-sm text-tp-text">{r.comment.trim()}</p>
            )}
          </li>
        ))}
      </ul>
      {canSubmit ? (
        <ReviewSubmitForm tourId={tourId} />
      ) : (
        <p className="mt-4 text-xs text-tp-muted">
          Reviews can be submitted for live listings on Travelpedia (demo sample tours are
          read-only).
        </p>
      )}
    </section>
  );
}
