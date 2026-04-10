import Link from "next/link";
import { formatDate, formatPkr } from "@/lib/format";
import { toHutSlug } from "@/lib/hut-slug";
import type { TourWithOperator } from "@/types/database";

type Props = { tour: TourWithOperator; hideHutLink?: boolean };

export function TourCard({ tour, hideHutLink = false }: Props) {
  const company = tour.listing_company?.trim() || "Tour operator";

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-tp-border bg-white shadow-sm transition-[box-shadow] duration-200 hover:shadow-md">
      <div className="relative h-40 bg-gradient-to-br from-tp-blue/90 to-tp-navy sm:h-44">
        <div className="absolute inset-0 flex flex-col justify-end p-4 text-white">
          <p className="text-xs font-medium uppercase tracking-wider text-white/80">
            {tour.departure_city} → {tour.destination}
          </p>
          <h2 className="mt-1 line-clamp-2 text-lg font-bold leading-snug">
            <Link
              href={`/tours/${tour.id}`}
              className="rounded-sm text-white outline-none ring-offset-2 ring-offset-tp-navy focus-visible:ring-2 focus-visible:ring-tp-accent"
            >
              <span className="sr-only">View tour: </span>
              {tour.destination}
            </Link>
          </h2>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <p className="text-sm text-tp-muted">
          {hideHutLink ? (
            <span className="font-medium text-tp-text">{company}</span>
          ) : (
            <Link
              href={`/hut/${toHutSlug(company)}`}
              className="rounded-sm font-medium text-tp-text underline-offset-4 outline-none hover:text-tp-blue hover:underline focus-visible:ring-2 focus-visible:ring-tp-blue focus-visible:ring-offset-2"
            >
              {company}
              <span className="sr-only"> — view operator HUT</span>
            </Link>
          )}
          <span className="mx-1">·</span>
          {tour.duration}
        </p>
        <div className="flex flex-wrap gap-2 text-xs text-tp-muted">
          <span className="rounded-full bg-tp-surface px-2 py-0.5">
            Departs {formatDate(tour.departure_date)}
          </span>
          {tour.seats_remaining != null && (
            <span className="rounded-full bg-tp-surface px-2 py-0.5">
              {tour.seats_remaining} seats left
            </span>
          )}
        </div>
        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <div>
            <p className="text-xs text-tp-muted">From</p>
            <p className="text-xl font-bold text-tp-navy">{formatPkr(Number(tour.price))}</p>
            <p className="text-xs text-tp-muted">per person</p>
          </div>
          <Link
            href={`/tours/${tour.id}`}
            className="rounded-md bg-tp-blue px-4 py-2.5 text-sm font-semibold text-white outline-none transition-colors hover:bg-tp-blue-hover focus-visible:ring-2 focus-visible:ring-tp-blue focus-visible:ring-offset-2"
          >
            View deal
          </Link>
        </div>
      </div>
    </article>
  );
}
