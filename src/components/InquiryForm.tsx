"use client";

import { useId, useState } from "react";
import { submitInquiry } from "@/app/actions/inquiry";

type Props = {
  tourId: string;
  tourTitle: string;
};

export function InquiryForm({ tourId, tourTitle }: Props) {
  const nameId = useId();
  const phoneId = useId();
  const seatsId = useId();
  const messageId = useId();
  const statusId = useId();
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
      <form onSubmit={onSubmit} className="mt-4 space-y-4" aria-describedby={message ? statusId : undefined}>
        <input type="hidden" name="tourId" value={tourId} />
        <div>
          <label htmlFor={nameId} className="text-xs font-medium text-tp-muted">
            Full name
          </label>
          <input
            id={nameId}
            name="name"
            required
            autoComplete="name"
            className="tp-input mt-1"
            placeholder="Your name"
          />
        </div>
        <div>
          <label htmlFor={phoneId} className="text-xs font-medium text-tp-muted">
            Phone (WhatsApp)
          </label>
          <input
            id={phoneId}
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            className="tp-input mt-1"
            placeholder="+92 3xx xxxxxxx"
          />
        </div>
        <div>
          <label htmlFor={seatsId} className="text-xs font-medium text-tp-muted">
            Seats required
          </label>
          <input
            id={seatsId}
            name="seats_requested"
            type="number"
            min={1}
            defaultValue={1}
            required
            inputMode="numeric"
            className="tp-input mt-1"
          />
        </div>
        <div>
          <label htmlFor={messageId} className="text-xs font-medium text-tp-muted">
            Message (optional)
          </label>
          <textarea
            id={messageId}
            name="message"
            rows={3}
            className="tp-input mt-1 min-h-[5.5rem]"
            placeholder="Dietary needs, group type, questions…"
          />
        </div>
        <button
          type="submit"
          disabled={pending}
          className="min-h-11 w-full rounded-md bg-tp-navy py-3 text-sm font-bold text-white outline-none transition-colors hover:bg-tp-blue disabled:opacity-60 focus-visible:ring-2 focus-visible:ring-tp-blue focus-visible:ring-offset-2"
        >
          {pending ? "Sending…" : "Send inquiry"}
        </button>
      </form>
      <div id={statusId} className="mt-3 min-h-[1.25rem]" aria-live="polite" aria-atomic="true">
        {message && (
          <p
            className={`text-sm ${message.type === "ok" ? "text-green-800" : "text-red-700"}`}
            role={message.type === "err" ? "alert" : "status"}
          >
            {message.text}
          </p>
        )}
      </div>
    </div>
  );
}
