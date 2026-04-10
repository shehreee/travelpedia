"use client";

import { saveTour } from "@/app/actions/operator-tours";
import { LISTING_CATEGORIES } from "@/lib/listing-categories";
import type { Tour } from "@/types/database";
import { useState } from "react";

type Props = { tour?: Tour | null };

export function TourForm({ tour }: Props) {
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg(null);
    setErr(null);
    setPending(true);
    const fd = new FormData(e.currentTarget);
    const res = await saveTour(fd);
    setPending(false);
    if (res.ok) setMsg(res.message);
    else setErr(res.message);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5 rounded-xl border border-tp-border bg-white p-6 shadow-sm">
      {tour?.id && <input type="hidden" name="id" value={tour.id} />}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="text-xs font-medium text-tp-muted">Destination</label>
          <input
            name="destination"
            required
            defaultValue={tour?.destination}
            className="mt-1 w-full rounded-md border border-tp-border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-tp-blue"
            placeholder="Hunza Valley"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs font-medium text-tp-muted">Listing category</label>
          <select
            name="listing_category"
            required
            defaultValue={tour?.listing_category ?? "group_tour"}
            className="mt-1 w-full rounded-md border border-tp-border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-tp-blue"
          >
            {LISTING_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-tp-muted">Departure city</label>
          <input
            name="departure_city"
            required
            defaultValue={tour?.departure_city}
            className="mt-1 w-full rounded-md border border-tp-border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-tp-blue"
            placeholder="Islamabad"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-tp-muted">Duration (text)</label>
          <input
            name="duration"
            required
            defaultValue={tour?.duration}
            className="mt-1 w-full rounded-md border border-tp-border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-tp-blue"
            placeholder="5 days / 4 nights"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-tp-muted">Departure date</label>
          <input
            name="departure_date"
            type="date"
            required
            defaultValue={tour?.departure_date?.slice(0, 10)}
            className="mt-1 w-full rounded-md border border-tp-border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-tp-blue"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-tp-muted">Return date</label>
          <input
            name="return_date"
            type="date"
            required
            defaultValue={tour?.return_date?.slice(0, 10)}
            className="mt-1 w-full rounded-md border border-tp-border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-tp-blue"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-tp-muted">Price per person (PKR)</label>
          <input
            name="price"
            type="number"
            min={0}
            step={1}
            required
            defaultValue={tour?.price != null ? String(tour.price) : ""}
            className="mt-1 w-full rounded-md border border-tp-border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-tp-blue"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-tp-muted">Total seats (optional)</label>
          <input
            name="seats_total"
            type="number"
            min={0}
            defaultValue={tour?.seats_total != null ? String(tour.seats_total) : ""}
            className="mt-1 w-full rounded-md border border-tp-border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-tp-blue"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs font-medium text-tp-muted">WhatsApp number (for button)</label>
          <input
            name="whatsapp_contact"
            defaultValue={tour?.whatsapp_contact ?? ""}
            className="mt-1 w-full rounded-md border border-tp-border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-tp-blue"
            placeholder="923001234567"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs font-medium text-tp-muted">Itinerary</label>
          <textarea
            name="itinerary"
            rows={6}
            defaultValue={tour?.itinerary ?? ""}
            className="mt-1 w-full rounded-md border border-tp-border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-tp-blue"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs font-medium text-tp-muted">
            Itinerary PDF URL (optional — upload file to Storage and paste link)
          </label>
          <input
            name="itinerary_pdf_path"
            defaultValue={tour?.itinerary_pdf_path ?? ""}
            className="mt-1 w-full rounded-md border border-tp-border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-tp-blue"
            placeholder="https://..."
          />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs font-medium text-tp-muted">Inclusions</label>
          <textarea
            name="inclusions"
            rows={3}
            defaultValue={tour?.inclusions ?? ""}
            className="mt-1 w-full rounded-md border border-tp-border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-tp-blue"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs font-medium text-tp-muted">Exclusions</label>
          <textarea
            name="exclusions"
            rows={3}
            defaultValue={tour?.exclusions ?? ""}
            className="mt-1 w-full rounded-md border border-tp-border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-tp-blue"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs font-medium text-tp-muted">Cancellation policy</label>
          <textarea
            name="cancellation_policy"
            rows={3}
            defaultValue={tour?.cancellation_policy ?? ""}
            className="mt-1 w-full rounded-md border border-tp-border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-tp-blue"
          />
        </div>
      </div>
      {err && <p className="text-sm text-red-600">{err}</p>}
      {msg && <p className="text-sm text-green-700">{msg}</p>}
      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-tp-blue px-6 py-3 text-sm font-bold text-white hover:bg-tp-blue-hover disabled:opacity-60"
      >
        {pending ? "Saving…" : tour ? "Update tour" : "Submit for approval"}
      </button>
    </form>
  );
}
