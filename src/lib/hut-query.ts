import { demoTours } from "@/lib/demo-tours";
import { getDemoHutByOperatorId, getDemoHutBySlug } from "@/lib/demo-huts";
import { isUuidLike, toHutSlug } from "@/lib/hut-slug";
import { createAnonServerClient } from "@/lib/supabase/server";
import type { Tour } from "@/types/database";
import type { HutPublicProfile } from "@/types/hut";
import { cache } from "react";

export type HutToursPartition = { live: Tour[]; past: Tour[] };

function todayISODate(): string {
  return new Date().toISOString().slice(0, 10);
}

function partitionHutTours(tours: Tour[]): HutToursPartition {
  const today = todayISODate();
  const live: Tour[] = [];
  const past: Tour[] = [];
  for (const t of tours) {
    const ended = t.return_date < today;
    if (t.status === "closed" || ended) {
      past.push(t);
    } else if (t.status === "active") {
      live.push(t);
    }
  }
  live.sort(
    (a, b) =>
      new Date(a.departure_date).getTime() - new Date(b.departure_date).getTime(),
  );
  past.sort(
    (a, b) =>
      new Date(b.return_date).getTime() - new Date(a.return_date).getTime(),
  );
  return { live, past };
}

const hutProfileSelectBasic =
  "id, company_name, full_name, email, phone, created_at, role, approval_status";
const hutProfileSelectExtended =
  "id, company_name, full_name, email, phone, profile_photo_url, hut_experience, area_of_operation, created_at, role, approval_status";

async function fetchHutByIdentifierUncached(
  identifier: string,
): Promise<{ profile: HutPublicProfile | null; tours: HutToursPartition; error: string | null }> {
  const ident = identifier.trim();
  const isUuid = isUuidLike(ident);
  const demoProfile = isUuid ? getDemoHutByOperatorId(ident) : getDemoHutBySlug(ident);
  const demoOperatorId = demoProfile?.id ?? (isUuid ? ident : "");
  const demoList = demoTours.filter((t) => t.operator_id === demoOperatorId);
  const demoPartition = partitionHutTours(demoList);

  const supabase = createAnonServerClient();
  if (!supabase) {
    if (!demoProfile) {
      return { profile: null, tours: { live: [], past: [] }, error: null };
    }
    return { profile: demoProfile, tours: demoPartition, error: null };
  }

  let row: {
    id: string;
    company_name: string | null;
    full_name: string | null;
    email: string | null;
    phone: string | null;
    profile_photo_url?: string | null;
    hut_experience?: string | null;
    area_of_operation?: string | null;
    created_at: string;
    role: string;
    approval_status: string;
  } | null = null;
  let pe: { message: string } | null = null;

  if (isUuid) {
    const extended = await supabase
      .from("profiles")
      .select(hutProfileSelectExtended)
      .eq("id", ident)
      .maybeSingle();
    if (extended.error && extended.error.message.includes("does not exist")) {
      const basic = await supabase
        .from("profiles")
        .select(hutProfileSelectBasic)
        .eq("id", ident)
        .maybeSingle();
      row = (basic.data as typeof row) ?? null;
      pe = basic.error ? { message: basic.error.message } : null;
    } else {
      row = (extended.data as typeof row) ?? null;
      pe = extended.error ? { message: extended.error.message } : null;
    }
  } else {
    // Name-based lookup for user-friendly /hut/<company-name> links.
    const basic = await supabase
      .from("profiles")
      .select(hutProfileSelectBasic)
      .eq("role", "operator")
      .eq("approval_status", "approved");
    if (basic.error) {
      pe = { message: basic.error.message };
    } else {
      const list = (basic.data ?? []) as Array<{
        id: string;
        company_name: string | null;
        full_name: string | null;
        email: string | null;
        phone: string | null;
        created_at: string;
        role: string;
        approval_status: string;
      }>;
      const found = list.find((p) => toHutSlug(p.company_name || p.full_name || "") === ident);
      if (found) {
        const extended = await supabase
          .from("profiles")
          .select(hutProfileSelectExtended)
          .eq("id", found.id)
          .maybeSingle();
        if (extended.error && extended.error.message.includes("does not exist")) {
          row = found;
        } else {
          row = (extended.data as typeof row) ?? found;
          if (extended.error) pe = { message: extended.error.message };
        }
      }
    }
  }

  if (pe) {
    if (demoProfile) {
      return { profile: demoProfile, tours: demoPartition, error: pe.message };
    }
    return { profile: null, tours: { live: [], past: [] }, error: pe.message };
  }

  if (
    !row ||
    row.role !== "operator" ||
    row.approval_status !== "approved"
  ) {
    if (demoProfile) {
      return { profile: demoProfile, tours: demoPartition, error: null };
    }
    return { profile: null, tours: { live: [], past: [] }, error: null };
  }

  const profile: HutPublicProfile = {
    id: row.id,
    company_name: row.company_name,
    full_name: row.full_name,
    email: row.email,
    phone: row.phone,
    profile_photo_url: row.profile_photo_url ?? null,
    hut_experience: row.hut_experience ?? null,
    area_of_operation: row.area_of_operation ?? null,
    created_at: row.created_at,
  };

  const { data: tourRows, error: te } = await supabase
    .from("tours")
    .select("*")
    .eq("operator_id", profile.id)
    .in("status", ["active", "closed"]);

  if (te) {
    return {
      profile,
      tours: { live: [], past: [] },
      error: te.message,
    };
  }

  const tours = (tourRows ?? []) as Tour[];
  return { profile, tours: partitionHutTours(tours), error: null };
}

/** Dedupes work when `generateMetadata` and the page both load the same HUT in one request. */
export const fetchHutByIdentifier = cache(fetchHutByIdentifierUncached);

export const fetchHutByOperatorId = fetchHutByIdentifier;
