import { TourCard } from "@/components/TourCard";
import { fetchActiveTours } from "@/lib/tours-query";
import { ToursFilterForm } from "./tours-filter-form";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ToursPage({ searchParams }: Props) {
  const sp = await searchParams;
  const destination = typeof sp.destination === "string" ? sp.destination : "";
  const from = typeof sp.from === "string" ? sp.from : "";
  const to = typeof sp.to === "string" ? sp.to : "";
  const minPrice = typeof sp.minPrice === "string" ? Number(sp.minPrice) : undefined;
  const maxPrice = typeof sp.maxPrice === "string" ? Number(sp.maxPrice) : undefined;
  const sort =
    sp.sort === "price_asc" ? ("price_asc" as const) : ("departure" as const);
  const category = typeof sp.category === "string" ? sp.category : "";

  const { data: tours, error } = await fetchActiveTours({
    destination: destination || undefined,
    from: from || undefined,
    to: to || undefined,
    minPrice: minPrice && !Number.isNaN(minPrice) ? minPrice : undefined,
    maxPrice: maxPrice && !Number.isNaN(maxPrice) ? maxPrice : undefined,
    category: category || undefined,
    sort,
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <h1 className="text-2xl font-bold text-tp-navy sm:text-3xl">Browse tours</h1>
      <p className="mt-1 text-tp-muted">
        Filter by destination, price, and departure — Northern Pakistan group tours.
      </p>

      <div className="mt-8 flex flex-col gap-8 lg:flex-row">
        <aside className="shrink-0 lg:w-72" aria-label="Tour search filters">
          <ToursFilterForm
            initial={{
              destination,
              from,
              to,
              minPrice: minPrice && !Number.isNaN(minPrice) ? String(minPrice) : "",
              maxPrice: maxPrice && !Number.isNaN(maxPrice) ? String(maxPrice) : "",
              category,
              sort: sort === "price_asc" ? "price_asc" : "departure",
            }}
          />
        </aside>
        <div className="min-w-0 flex-1" role="region" aria-label="Tour results">
          {error && (
            <div
              className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950"
              role="alert"
            >
              {error}
            </div>
          )}
          <div className="grid gap-6 sm:grid-cols-2">
            {tours.length === 0 ? (
              <p className="col-span-full text-tp-muted">
                No tours match your filters. Try clearing destination or widening the price
                range.
              </p>
            ) : (
              tours.map((t) => <TourCard key={t.id} tour={t} />)
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
