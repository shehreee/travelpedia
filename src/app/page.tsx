import Link from "next/link";
import { HeroSearch } from "@/components/HeroSearch";
import { TourCard } from "@/components/TourCard";
import { fetchActiveTours } from "@/lib/tours-query";

export default async function HomePage() {
  const { data: tours, error } = await fetchActiveTours({ sort: "departure" });
  const featured = tours.slice(0, 6);
  const hasEnv = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);

  return (
    <div>
      <section className="bg-tp-navy pb-16 pt-10 text-white sm:pb-20 sm:pt-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-center text-sm font-medium uppercase tracking-widest text-tp-accent">
            Northern Pakistan · Group departures Test
          </p>
          <h1 className="mx-auto mt-3 max-w-3xl text-center text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
            Find your next adventure — compare tours like on Booking and Agoda
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-center text-base text-white/85 sm:text-lg">
            Structured listings from verified operators. Send an inquiry in one click. No
            payments on the platform (Phase 1).
          </p>
          <div className="mt-10">
            <HeroSearch />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-tp-navy sm:text-3xl">
              Popular departures
            </h2>
            <p className="mt-1 text-tp-muted">
              Active tours approved by our team — sorted by soonest departure.
            </p>
          </div>
          <Link
            href="/tours"
            className="text-sm font-semibold text-tp-blue hover:underline"
          >
            See all tours →
          </Link>
        </div>

        {error && (
          <p className="mt-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Could not load tours: {error}. Check Supabase configuration.
          </p>
        )}

        {!hasEnv && (
          <p className="mt-6 rounded-lg border border-tp-border bg-white px-4 py-3 text-sm text-tp-muted">
            Copy .env.example to .env.local and add your Supabase URL and anon key, then run
            the SQL in supabase/migrations.
          </p>
        )}

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.length === 0 && !error && hasEnv ? (
            <p className="col-span-full text-tp-muted">
              No active tours yet. Operators can publish after admin approval.
            </p>
          ) : (
            featured.map((tour) => <TourCard key={tour.id} tour={tour} />)
          )}
        </div>
      </section>

      <section className="border-t border-tp-border bg-white py-12 sm:py-16">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:grid-cols-3 sm:px-6">
          <div>
            <h3 className="font-bold text-tp-navy">For travelers</h3>
            <p className="mt-2 text-sm text-tp-muted">
              Search by destination and dates, compare price and inclusions, then send a
              direct inquiry to the operator.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-tp-navy">For operators</h3>
            <p className="mt-2 text-sm text-tp-muted">
              List group tours with clear policies. Receive qualified leads with contact
              details in your dashboard.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-tp-navy">Phase 1 scope</h3>
            <p className="mt-2 text-sm text-tp-muted">
              Discovery and lead generation only — no reviews, payments, or instant booking
              (per product doc).
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
