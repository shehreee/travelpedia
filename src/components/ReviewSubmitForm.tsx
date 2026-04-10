"use client";

import { submitTourReview } from "@/app/actions/submit-tour-review";
import { useState } from "react";

type Props = { tourId: string };

export function ReviewSubmitForm({ tourId }: Props) {
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg(null);
    setErr(null);
    setPending(true);
    const fd = new FormData(e.currentTarget);
    fd.set("tourId", tourId);
    const res = await submitTourReview(fd);
    setPending(false);
    if (res.ok) {
      setMsg(res.message);
      e.currentTarget.reset();
    } else {
      setErr(res.message);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mt-4 space-y-3 rounded-lg border border-tp-border bg-tp-surface/60 p-4"
      aria-label="Submit a review"
    >
      <p className="text-sm font-semibold text-tp-navy">Write a review</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor={`rev-name-${tourId}`} className="text-xs font-medium text-tp-muted">
            Your name
          </label>
          <input
            id={`rev-name-${tourId}`}
            name="author_name"
            required
            maxLength={120}
            className="tp-input mt-1"
          />
        </div>
        <div>
          <label htmlFor={`rev-email-${tourId}`} className="text-xs font-medium text-tp-muted">
            Email (optional)
          </label>
          <input
            id={`rev-email-${tourId}`}
            name="author_email"
            type="email"
            maxLength={200}
            className="tp-input mt-1"
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor={`rev-rating-${tourId}`} className="text-xs font-medium text-tp-muted">
            Rating
          </label>
          <select
            id={`rev-rating-${tourId}`}
            name="rating"
            required
            defaultValue="5"
            className="tp-input mt-1"
          >
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {n} — {n === 5 ? "Excellent" : n === 1 ? "Poor" : "Good"}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor={`rev-comment-${tourId}`} className="text-xs font-medium text-tp-muted">
            Comment (optional)
          </label>
          <textarea
            id={`rev-comment-${tourId}`}
            name="comment"
            rows={3}
            maxLength={2000}
            className="tp-input mt-1"
          />
        </div>
      </div>
      {err && (
        <p className="text-sm text-red-700" role="alert">
          {err}
        </p>
      )}
      {msg && (
        <p className="text-sm text-green-800" role="status" aria-live="polite">
          {msg}
        </p>
      )}
      <button type="submit" disabled={pending} className="tp-btn-primary text-sm">
        {pending ? "Submitting…" : "Submit for moderation"}
      </button>
    </form>
  );
}
