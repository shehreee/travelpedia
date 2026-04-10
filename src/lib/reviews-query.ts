import { createAnonServerClient } from "@/lib/supabase/server";
import { getDemoReviewsForTour } from "@/lib/demo-reviews";
import type { TourReview } from "@/types/database";

export async function fetchApprovedReviewsForTour(tourId: string): Promise<TourReview[]> {
  const supabase = createAnonServerClient();
  if (!supabase) {
    return getDemoReviewsForTour(tourId);
  }

  const { data, error } = await supabase
    .from("tour_reviews")
    .select("*")
    .eq("tour_id", tourId)
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (error) {
    return tourId.startsWith("demo-tour-") ? getDemoReviewsForTour(tourId) : [];
  }

  const rows = (data ?? []) as TourReview[];
  if (rows.length === 0 && tourId.startsWith("demo-tour-")) {
    return getDemoReviewsForTour(tourId);
  }
  return rows;
}
