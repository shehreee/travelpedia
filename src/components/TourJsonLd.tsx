import { averageRating } from "@/lib/demo-reviews";
import type { Tour, TourReview } from "@/types/database";

type Props = { tour: Tour; reviews: TourReview[]; siteUrl: string };

/** Basic structured data for SEO (Product-style tour listing). */
export function TourJsonLd({ tour, reviews, siteUrl }: Props) {
  const avg = averageRating(reviews);
  const base = siteUrl.replace(/\/$/, "");
  const url = `${base}/tours/${tour.id}`;

  const json: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: tour.destination,
    description: tour.itinerary?.slice(0, 500) || `Tour from ${tour.departure_city}`,
    url,
    brand: { "@type": "Brand", name: tour.listing_company || "Tour operator" },
    offers: {
      "@type": "Offer",
      priceCurrency: "PKR",
      price: String(tour.price),
      availability: tour.status === "active" ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  if (avg != null && reviews.length > 0) {
    json.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: String(avg),
      reviewCount: String(reviews.length),
      bestRating: "5",
      worstRating: "1",
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
