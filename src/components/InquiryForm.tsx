"use client";

import { useState } from "react";
import { submitInquiry } from "@/app/actions/inquiry";

type Props = {
  tourId: string;
  tourTitle: string;
};

export function InquiryForm({ tourId, tourTitle }: Props) {
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<{
    type: "ok" | "err";
    text: string;
  } | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setMessage(null);
    const form = e.currentTarget;
    const fd = new FormData(form);
    fd.set("tourId", tourId);
    const res = await submitInquiry(fd);
    setPending(false);
    if (res.ok) {
      setMessage({ type: "ok", text: res.message });
      form.reset();
    } else {
      setMessage({ type: "err", text: res.message });
    }
  }

  return (
    <div className="rounded-xl border border-tp-border bg-white p-6 shadow-sm">
      <h3 className="text-lg font-bold text-tp-navy">Send inquiry</h3>
      <p className="mt-1 text-sm text-tp-muted">
        Request seats on <span className="font-medium text-tp-text">{tourTitle}</span>. The
        operator will contact you directly.
      </p>
      <form onSubmit={onSubmit} className="mt-4 space-y-3">
        <input type="hidden" name="tourId" value={tourId} />
        <div>
          <label className="text-xs font-medium text-tp-muted">Full name</label>
          <input
            name="name"
            required
            className="mt-1 w-full rounded-md border border-tp-border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-tp-blue"
            placeholder="Your name"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-tp-muted">Phone (WhatsApp)</label>
          <input
            name="phone"
            type="tel"
            required
            className="mt-1 w-full rounded-md border border-tp-border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-tp-blue"
            placeholder="+92 3xx xxxxxxx"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-tp-muted">Seats required</label>
          <input
            name="seats_requested"
            type="number"
            min={1}
            defaultValue={1}
            required
            className="mt-1 w-full rounded-md border border-tp-border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-tp-blue"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-tp-muted">Message (optional)</label>
          <textarea
            name="message"
            rows={3}
            className="mt-1 w-full rounded-md border border-tp-border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-tp-blue"
            placeholder="Dietary needs, group type, questions…"
          />
        </div>
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-md bg-tp-navy py-3 text-sm font-bold text-white hover:bg-tp-blue disabled:opacity-60"
        >
          {pending ? "Sending…" : "Send inquiry"}
        </button>
        {message && (
          <p
            className={`text-sm ${message.type === "ok" ? "text-green-700" : "text-red-600"}`}
            role="status"
          >
            {message.text}
          </p>
        )}
      </form>
    </div>
  );
}
