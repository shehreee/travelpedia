"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Initial = {
  destination: string;
  from: string;
  to: string;
  minPrice: string;
  maxPrice: string;
  sort: "departure" | "price_asc";
};

export function ToursFilterForm({ initial }: { initial: Initial }) {
  const router = useRouter();
  const [v, setV] = useState(initial);

  function apply(e: React.FormEvent) {
    e.preventDefault();
    const q = new URLSearchParams();
    if (v.destination.trim()) q.set("destination", v.destination.trim());
    if (v.from) q.set("from", v.from);
    if (v.to) q.set("to", v.to);
    if (v.minPrice) q.set("minPrice", v.minPrice);
    if (v.maxPrice) q.set("maxPrice", v.maxPrice);
    if (v.sort === "price_asc") q.set("sort", "price_asc");
    router.push(`/tours?${q.toString()}`);
  }

  function clear() {
    setV({
      destination: "",
      from: "",
      to: "",
      minPrice: "",
      maxPrice: "",
      sort: "departure",
    });
    router.push("/tours");
  }

  return (
    <form
      onSubmit={apply}
      className="space-y-4 rounded-xl border border-tp-border bg-white p-5 shadow-sm"
    >
      <h2 className="font-bold text-tp-navy">Filters</h2>
      <div>
        <label className="text-xs font-medium text-tp-muted">Destination</label>
        <input
          value={v.destination}
          onChange={(e) => setV({ ...v, destination: e.target.value })}
          className="mt-1 w-full rounded-md border border-tp-border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-tp-blue"
          placeholder="Hunza, Naran…"
        />
      </div>
      <div>
        <label className="text-xs font-medium text-tp-muted">Departure from</label>
        <input
          type="date"
          value={v.from}
          onChange={(e) => setV({ ...v, from: e.target.value })}
          className="mt-1 w-full rounded-md border border-tp-border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-tp-blue"
        />
      </div>
      <div>
        <label className="text-xs font-medium text-tp-muted">Departure by</label>
        <input
          type="date"
          value={v.to}
          onChange={(e) => setV({ ...v, to: e.target.value })}
          className="mt-1 w-full rounded-md border border-tp-border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-tp-blue"
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs font-medium text-tp-muted">Min PKR</label>
          <input
            type="number"
            min={0}
            value={v.minPrice}
            onChange={(e) => setV({ ...v, minPrice: e.target.value })}
            className="mt-1 w-full rounded-md border border-tp-border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-tp-blue"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-tp-muted">Max PKR</label>
          <input
            type="number"
            min={0}
            value={v.maxPrice}
            onChange={(e) => setV({ ...v, maxPrice: e.target.value })}
            className="mt-1 w-full rounded-md border border-tp-border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-tp-blue"
          />
        </div>
      </div>
      <div>
        <label className="text-xs font-medium text-tp-muted">Sort by</label>
        <select
          value={v.sort}
          onChange={(e) =>
            setV({ ...v, sort: e.target.value === "price_asc" ? "price_asc" : "departure" })
          }
          className="mt-1 w-full rounded-md border border-tp-border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-tp-blue"
        >
          <option value="departure">Soonest departure</option>
          <option value="price_asc">Lowest price</option>
        </select>
      </div>
      <div className="flex gap-2 pt-2">
        <button
          type="submit"
          className="flex-1 rounded-md bg-tp-blue py-2.5 text-sm font-bold text-white hover:bg-tp-blue-hover"
        >
          Apply
        </button>
        <button
          type="button"
          onClick={clear}
          className="rounded-md border border-tp-border px-3 py-2.5 text-sm font-medium text-tp-muted hover:bg-tp-surface"
        >
          Clear
        </button>
      </div>
    </form>
  );
}
