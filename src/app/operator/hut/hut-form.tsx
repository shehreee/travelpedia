"use client";

import { updateHutProfile } from "@/app/actions/operator-hut";
import { useState } from "react";

type Initial = {
  company_name: string | null;
  phone: string | null;
  profile_photo_url: string | null;
  hut_experience: string | null;
  area_of_operation: string | null;
};

type Props = { initial: Initial; hutUrl: string };

export function HutEditorForm({ initial, hutUrl }: Props) {
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg(null);
    setErr(null);
    setPending(true);
    const fd = new FormData(e.currentTarget);
    const res = await updateHutProfile(fd);
    setPending(false);
    if (res.ok) setMsg(res.message);
    else setErr(res.message);
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-5 rounded-xl border border-tp-border bg-white p-6 shadow-sm"
    >
      <p className="text-sm text-tp-muted">
        Your <strong>HUT</strong> is your public agency page. Travelers see it when they tap your company
        name on a tour.
      </p>
      <p className="text-sm">
        <span className="text-tp-muted">Public link: </span>
        <a href={hutUrl} className="font-semibold text-tp-blue hover:underline" target="_blank" rel="noreferrer">
          {hutUrl}
        </a>
      </p>

      <div>
        <label className="text-xs font-medium text-tp-muted">Company / brand name</label>
        <input
          name="company_name"
          required
          defaultValue={initial.company_name ?? ""}
          className="mt-1 w-full rounded-md border border-tp-border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-tp-blue"
        />
      </div>
      <div>
        <label className="text-xs font-medium text-tp-muted">Phone (shown on HUT)</label>
        <input
          name="phone"
          type="tel"
          defaultValue={initial.phone ?? ""}
          className="mt-1 w-full rounded-md border border-tp-border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-tp-blue"
        />
      </div>
      <div>
        <label className="text-xs font-medium text-tp-muted">Profile / logo image URL</label>
        <input
          name="profile_photo_url"
          type="url"
          placeholder="https://…"
          defaultValue={initial.profile_photo_url ?? ""}
          className="mt-1 w-full rounded-md border border-tp-border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-tp-blue"
        />
        <p className="mt-1 text-xs text-tp-muted">
          Paste a direct image link (e.g. from your website or cloud storage). Upload UI can be added
          later.
        </p>
      </div>
      <div>
        <label className="text-xs font-medium text-tp-muted">Area of operation</label>
        <input
          name="area_of_operation"
          placeholder="e.g. Gilgit-Baltistan, Swat, departures from Lahore"
          defaultValue={initial.area_of_operation ?? ""}
          className="mt-1 w-full rounded-md border border-tp-border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-tp-blue"
        />
      </div>
      <div>
        <label className="text-xs font-medium text-tp-muted">Experience &amp; story</label>
        <textarea
          name="hut_experience"
          rows={6}
          placeholder="Years in business, specialties, safety practices, what makes your agency different…"
          defaultValue={initial.hut_experience ?? ""}
          className="mt-1 w-full rounded-md border border-tp-border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-tp-blue"
        />
      </div>

      {msg && <p className="text-sm text-green-800">{msg}</p>}
      {err && <p className="text-sm text-red-600">{err}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-tp-navy px-5 py-2.5 text-sm font-bold text-white hover:bg-tp-blue disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save HUT"}
      </button>
    </form>
  );
}
