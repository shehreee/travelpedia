"use client";

import { LISTING_CATEGORIES } from "@/lib/listing-categories";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";

type Initial = {
  destination: string;
  from: string;
  to: string;
  minPrice: string;
  maxPrice: string;
  category: string;
  sort: "departure" | "price_asc";
};

export function ToursFilterForm({ initial }: { initial: Initial }) {
  const router = useRouter();
  const destId = useId();
  const fromId = useId();
  const toId = useId();
  const minId = useId();
  const maxId = useId();
  const sortId = useId();
  const catId = useId();
  const [v, setV] = useState(initial);

  function apply(e: React.FormEvent) {
    e.preventDefault();
    const q = new URLSearchParams();
    if (v.destination.trim()) q.set("destination", v.destination.trim());
    if (v.from) q.set("from", v.from);
    if (v.to) q.set("to", v.to);
    if (v.minPrice) q.set("minPrice", v.minPrice);
    if (v.maxPrice) q.set("maxPrice", v.maxPrice);
    if (v.category) q.set("category", v.category);
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
      category: "",
      sort: "departure",
    });
    router.push("/tours");
  }

  return (
    <form
      onSubmit={apply}
      aria-label="Tour filters"
      className="space-y-4 rounded-xl border border-tp-border bg-white p-5 shadow-sm"
    >
      <h2 className="font-bold text-tp-navy">Filters</h2>
      <div>
        <label htmlFor={destId} className="text-xs font-medium text-tp-muted">
          Destination
        </label>
        <input
          id={destId}
          value={v.destination}
          onChange={(e) => setV({ ...v, destination: e.target.value })}
          className="tp-input mt-1"
          placeholder="Hunza, Naran…"
        />
      </div>
      <div>
        <label htmlFor={fromId} className="text-xs font-medium text-tp-muted">
          Departure from
        </label>
        <input
          id={fromId}
          type="date"
          value={v.from}
          onChange={(e) => setV({ ...v, from: e.target.value })}
          className="tp-input mt-1"
        />
      </div>
      <div>
        <label htmlFor={toId} className="text-xs font-medium text-tp-muted">
          Departure by
        </label>
        <input
          id={toId}
          type="date"
          value={v.to}
          onChange={(e) => setV({ ...v, to: e.target.value })}
          className="tp-input mt-1"
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label htmlFor={minId} className="text-xs font-medium text-tp-muted">
            Min PKR
          </label>
          <input
            id={minId}
            type="number"
            min={0}
            value={v.minPrice}
            onChange={(e) => setV({ ...v, minPrice: e.target.value })}
            className="tp-input mt-1"
          />
        </div>
        <div>
          <label htmlFor={maxId} className="text-xs font-medium text-tp-muted">
            Max PKR
          </label>
          <input
            id={maxId}
            type="number"
            min={0}
            value={v.maxPrice}
            onChange={(e) => setV({ ...v, maxPrice: e.target.value })}
            className="tp-input mt-1"
          />
        </div>
      </div>
      <div>
        <label htmlFor={catId} className="text-xs font-medium text-tp-muted">
          Category
        </label>
        <select
          id={catId}
          value={v.category}
          onChange={(e) => setV({ ...v, category: e.target.value })}
          className="tp-input mt-1"
        >
          <option value="">All categories</option>
          {LISTING_CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor={sortId} className="text-xs font-medium text-tp-muted">
          Sort by
        </label>
        <select
          id={sortId}
          value={v.sort}
          onChange={(e) =>
            setV({ ...v, sort: e.target.value === "price_asc" ? "price_asc" : "departure" })
          }
          className="tp-input mt-1"
        >
          <option value="departure">Soonest departure</option>
          <option value="price_asc">Lowest price</option>
        </select>
      </div>
      <div className="flex gap-2 pt-2">
        <button type="submit" className="tp-btn-primary flex-1">
          Apply filters
        </button>
        <button type="button" onClick={clear} className="tp-btn-secondary shrink-0 px-4">
          Clear
        </button>
      </div>
    </form>
  );
}
