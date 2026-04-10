import { createAnonServerClient } from "@/lib/supabase/server";
import { getDemoTourById, getDemoTours } from "@/lib/demo-tours";
import type { Tour } from "@/types/database";

export type TourFilters = {
  destination?: string;
  from?: string;
  to?: string;
  minPrice?: number;
  maxPrice?: number;
  /** Matches `tours.listing_category` */
  category?: string;
  sort?: "departure" | "price_asc";
};

export async function fetchActiveTours(filters: TourFilters = {}) {
  const supabase = createAnonServerClient();
  if (!supabase) {
    return { data: getDemoTours(filters), error: null as string | null };
  }

  let q = supabase
    .from("tours")
    .select("*")
    .eq("status", "active");

  if (filters.destination?.trim()) {
    q = q.ilike("destination", `%${filters.destination.trim()}%`);
  }
  if (filters.from) {
    q = q.gte("departure_date", filters.from);
  }
  if (filters.to) {
    q = q.lte("departure_date", filters.to);
  }
  if (filters.minPrice != null && !Number.isNaN(filters.minPrice)) {
    q = q.gte("price", filters.minPrice);
  }
  if (filters.maxPrice != null && !Number.isNaN(filters.maxPrice)) {
    q = q.lte("price", filters.maxPrice);
  }
  if (filters.category?.trim()) {
    q = q.eq("listing_category", filters.category.trim());
  }

  if (filters.sort === "price_asc") {
    q = q.order("price", { ascending: true });
  } else {
    q = q.order("departure_date", { ascending: true });
  }

  const { data, error } = await q;
  if (error) {
    return { data: getDemoTours(filters), error: error.message };
  }
  const tours = (data ?? []) as Tour[];
  if (tours.length === 0) {
    return { data: getDemoTours(filters), error: null };
  }
  return { data: tours, error: null };
}

export async function fetchTourById(id: string) {
  const supabase = createAnonServerClient();
  if (!supabase) return { data: getDemoTourById(id), error: null };

  const { data, error } = await supabase
    .from("tours")
    .select("*")
    .eq("id", id)
    .in("status", ["active", "closed"])
    .maybeSingle();

  if (error) return { data: getDemoTourById(id), error: error.message };
  if (!data) return { data: getDemoTourById(id), error: null };
  return { data: data as Tour | null, error: null };
}
