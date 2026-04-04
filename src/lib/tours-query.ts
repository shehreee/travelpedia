import { createAnonServerClient } from "@/lib/supabase/server";
import type { Tour } from "@/types/database";

export type TourFilters = {
  destination?: string;
  from?: string;
  to?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: "departure" | "price_asc";
};

export async function fetchActiveTours(filters: TourFilters = {}) {
  const supabase = createAnonServerClient();
  if (!supabase) return { data: [] as Tour[], error: null as string | null };

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

  if (filters.sort === "price_asc") {
    q = q.order("price", { ascending: true });
  } else {
    q = q.order("departure_date", { ascending: true });
  }

  const { data, error } = await q;
  if (error) {
    return { data: [] as Tour[], error: error.message };
  }
  return { data: (data ?? []) as Tour[], error: null };
}

export async function fetchTourById(id: string) {
  const supabase = createAnonServerClient();
  if (!supabase) return { data: null as Tour | null, error: "not_configured" };

  const { data, error } = await supabase
    .from("tours")
    .select("*")
    .eq("id", id)
    .eq("status", "active")
    .maybeSingle();

  if (error) return { data: null, error: error.message };
  return { data: data as Tour | null, error: null };
}
