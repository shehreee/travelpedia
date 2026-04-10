"use client";

import { useRouter } from "next/navigation";
import { useId, useState, useTransition } from "react";

export function HeroSearch() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const destId = useId();
  const fromId = useId();
  const toId = useId();
  const [destination, setDestination] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const q = new URLSearchParams();
    if (destination.trim()) q.set("destination", destination.trim());
    if (from) q.set("from", from);
    if (to) q.set("to", to);
    startTransition(() => {
      router.push(`/tours?${q.toString()}`);
    });
  }

  return (
    <form
      onSubmit={submit}
      aria-label="Search tours by destination and dates"
      className="mx-auto flex max-w-4xl flex-col gap-3 rounded-xl border border-tp-border/80 bg-tp-accent p-3 shadow-lg sm:flex-row sm:items-end sm:gap-2 sm:p-3"
    >
      <div className="flex-1 px-1 sm:px-2">
        <label htmlFor={destId} className="block text-xs font-semibold text-tp-navy">
          Destination
        </label>
        <input
          id={destId}
          type="text"
          placeholder="Hunza, Skardu, Swat…"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          autoComplete="off"
          className="tp-input mt-1"
        />
      </div>
      <div className="sm:w-40">
        <label htmlFor={fromId} className="block text-xs font-semibold text-tp-navy">
          Depart from
        </label>
        <input
          id={fromId}
          type="date"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className="tp-input mt-1"
        />
      </div>
      <div className="sm:w-40">
        <label htmlFor={toId} className="block text-xs font-semibold text-tp-navy">
          Return by
        </label>
        <input
          id={toId}
          type="date"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="tp-input mt-1"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="tp-btn-primary w-full sm:w-auto sm:shrink-0 disabled:opacity-60"
      >
        {pending ? "Loading…" : "Search tours"}
      </button>
    </form>
  );
}
