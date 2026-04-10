import Link from "next/link";
import { notFound } from "next/navigation";
import { InquiryForm } from "@/components/InquiryForm";
import { formatDate, formatPkr } from "@/lib/format";
import { fetchTourById } from "@/lib/tours-query";

type Props = { params: Promise<{ id: string }> };

export default async function TourDetailPage({ params }: Props) {
  const { id } = await params;
  const { data: tour, error } = await fetchTourById(id);

  if (error === "not_configured" || !tour) {
    notFound();
  }

  const company = tour.listing_company?.trim() || "Tour operator";
  const wa = tour.whatsapp_contact?.replace(/\D/g, "");
  const waHref = wa ? `https://wa.me/${wa}` : null;
  const today = new Date().toISOString().slice(0, 10);
  const isPast =
    tour.status === "closed" || tour.return_date < today;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <Link href="/tours" className="text-sm font-medium text-tp-blue hover:underline">
        ← Back to tours
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-xl border border-tp-border bg-white shadow-sm">
            <div className="bg-gradient-to-r from-tp-navy to-tp-blue px-6 py-10 text-white">
              <p className="text-sm font-medium text-white/80">
                {tour.departure_city} → {tour.destination}
              </p>
              <h1 className="mt-2 text-3xl font-bold sm:text-4xl">{tour.destination}</h1>
              <p className="mt-2 text-lg text-white/90">
                <Link
                  href={`/hut/${tour.operator_id}`}
                  className="hover:underline"
                >
                  {company}
                </Link>
              </p>
            </div>
            {isPast && (
              <div className="border-b border-white/20 bg-white/10 px-6 py-3 text-sm text-amber-100">
                This trip has ended or is archived. Inquiry is only available for active listings.
              </div>
            )}
            <div className="grid gap-4 border-b border-tp-border p-6 sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium uppercase text-tp-muted">Departure</p>
                <p className="mt-1 font-semibold">{formatDate(tour.departure_date)}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase text-tp-muted">Return</p>
                <p className="mt-1 font-semibold">{formatDate(tour.return_date)}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase text-tp-muted">Duration</p>
                <p className="mt-1 font-semibold">{tour.duration}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase text-tp-muted">From</p>
                <p className="mt-1 text-2xl font-bold text-tp-navy">
                  {formatPkr(Number(tour.price))}{" "}
                  <span className="text-sm font-normal text-tp-muted">/ person</span>
                </p>
              </div>
              {tour.seats_remaining != null && (
                <div className="sm:col-span-2">
                  <p className="text-xs font-medium uppercase text-tp-muted">Seats</p>
                  <p className="mt-1 font-semibold">
                    {tour.seats_remaining} remaining
                    {tour.seats_total != null ? ` of ${tour.seats_total}` : ""}
                  </p>
                </div>
              )}
            </div>
            <div className="space-y-6 p-6">
              <section>
                <h2 className="text-lg font-bold text-tp-navy">Itinerary</h2>
                <p className="mt-2 whitespace-pre-wrap text-sm text-tp-text">
                  {tour.itinerary || "Itinerary will be shared by the operator."}
                </p>
              </section>
              {tour.inclusions && (
                <section>
                  <h2 className="text-lg font-bold text-tp-navy">Inclusions</h2>
                  <p className="mt-2 whitespace-pre-wrap text-sm text-tp-text">
                    {tour.inclusions}
                  </p>
                </section>
              )}
              {tour.exclusions && (
                <section>
                  <h2 className="text-lg font-bold text-tp-navy">Exclusions</h2>
                  <p className="mt-2 whitespace-pre-wrap text-sm text-tp-text">
                    {tour.exclusions}
                  </p>
                </section>
              )}
              {tour.cancellation_policy && (
                <section>
                  <h2 className="text-lg font-bold text-tp-navy">Cancellation policy</h2>
                  <p className="mt-2 whitespace-pre-wrap text-sm text-tp-text">
                    {tour.cancellation_policy}
                  </p>
                </section>
              )}
              {tour.itinerary_pdf_path?.trim() && (
                <section>
                  <h2 className="text-lg font-bold text-tp-navy">Itinerary PDF</h2>
                  <a
                    href={tour.itinerary_pdf_path.trim()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex text-sm font-semibold text-tp-blue hover:underline"
                  >
                    Download / view PDF
                  </a>
                </section>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {waHref && (
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-emerald-500 bg-emerald-50 py-3 text-sm font-bold text-emerald-800 hover:bg-emerald-100"
            >
              Contact on WhatsApp
            </a>
          )}
          {!isPast && (
            <InquiryForm tourId={tour.id} tourTitle={tour.destination} />
          )}
        </div>
      </div>
    </div>
  );
}
