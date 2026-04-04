"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function HeroSearch() {
  const router = useRouter();
  const [destination, setDestination] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const q = new URLSearchParams();
    if (destination.trim()) q.set("destination", destination.trim());
    if (from) q.set("from", from);
    if (to) q.set("to", to);
    router.push(`/tours?${q.toString()}`);
  }

  return (
    <form
      onSubmit={submit}
      className="mx-auto flex max-w-4xl flex-col gap-3 rounded-lg border border-tp-border bg-tp-accent p-3 shadow-lg sm:flex-row sm:items-end sm:gap-2 sm:p-2"
    >
      <label className="flex-1 px-1 sm:px-2">
        <span className="block text-xs font-semibold text-tp-navy">Destination</span>
        <input
          type="text"
          placeholder="Hunza, Skardu, Swat…"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="mt-1 w-full rounded border border-tp-border bg-white px-3 py-2.5 text-sm text-tp-text outline-none focus:ring-2 focus:ring-tp-blue"
        />
      </label>
      <label className="sm:w-40">
        <span className="block text-xs font-semibold text-tp-navy">Depart from</span>
        <input
          type="date"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className="mt-1 w-full rounded border border-tp-border bg-white px-3 py-2.5 text-sm text-tp-text outline-none focus:ring-2 focus:ring-tp-blue"
        />
      </label>
      <label className="sm:w-40">
        <span className="block text-xs font-semibold text-tp-navy">Return by</span>
        <input
          type="date"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="mt-1 w-full rounded border border-tp-border bg-white px-3 py-2.5 text-sm text-tp-text outline-none focus:ring-2 focus:ring-tp-blue"
        />
      </label>
      <button
        type="submit"
        className="rounded-md bg-tp-blue px-6 py-3 text-sm font-bold text-white hover:bg-tp-blue-hover sm:shrink-0"
      >
        Search
      </button>
    </form>
  );
}
