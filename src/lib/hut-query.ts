import { demoTours } from "@/lib/demo-tours";
import { getDemoHutByOperatorId } from "@/lib/demo-huts";
import { createAnonServerClient } from "@/lib/supabase/server";
import type { Tour } from "@/types/database";
import type { HutPublicProfile } from "@/types/hut";

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

const hutProfileSelect =
  "id, company_name, full_name, email, phone, profile_photo_url, hut_experience, area_of_operation, created_at, role, approval_status";

export async function fetchHutByOperatorId(
  operatorId: string,
): Promise<{ profile: HutPublicProfile | null; tours: HutToursPartition; error: string | null }> {
  const demoProfile = getDemoHutByOperatorId(operatorId);
  const demoList = demoTours.filter((t) => t.operator_id === operatorId);
  const demoPartition = partitionHutTours(demoList);

  const supabase = createAnonServerClient();
  if (!supabase) {
    if (!demoProfile) {
      return { profile: null, tours: { live: [], past: [] }, error: null };
    }
    return { profile: demoProfile, tours: demoPartition, error: null };
  }

  const { data: row, error: pe } = await supabase
    .from("profiles")
    .select(hutProfileSelect)
    .eq("id", operatorId)
    .maybeSingle();

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
    .eq("operator_id", operatorId)
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
