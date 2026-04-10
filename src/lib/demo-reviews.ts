import type { TourReview } from "@/types/database";

const demo: TourReview[] = [
  {
    id: "demo-rev-1",
    tour_id: "demo-tour-001",
    author_name: "Ayesha R.",
    author_email: null,
    rating: 5,
    comment: "Well organized Hunza trip — clear communication and good hotels.",
    status: "approved",
    created_at: "2026-03-01T12:00:00.000Z",
  },
  {
    id: "demo-rev-2",
    tour_id: "demo-tour-001",
    author_name: "Bilal M.",
    author_email: null,
    rating: 4,
    comment: "Great scenery; would book again next season.",
    status: "approved",
    created_at: "2026-03-15T10:00:00.000Z",
  },
];

export function getDemoReviewsForTour(tourId: string): TourReview[] {
  return demo.filter((r) => r.tour_id === tourId && r.status === "approved");
}

export function averageRating(reviews: { rating: number }[]): number | null {
  if (reviews.length === 0) return null;
  const sum = reviews.reduce((a, r) => a + r.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10;
}
