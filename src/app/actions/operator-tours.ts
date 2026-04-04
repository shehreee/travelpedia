"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

function parseNum(v: FormDataEntryValue | null) {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export async function saveTour(formData: FormData): Promise<{ ok: boolean; message: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: "Sign in required." };

  const { data: profile, error: pe } = await supabase
    .from("profiles")
    .select("company_name, full_name, approval_status")
    .eq("id", user.id)
    .single();

  if (pe || !profile) return { ok: false, message: "Profile not found." };
  if (profile.approval_status !== "approved") {
    return { ok: false, message: "Your operator account is not approved yet." };
  }

  const listing_company =
    profile.company_name?.trim() || profile.full_name?.trim() || "Tour operator";

  const id = String(formData.get("id") || "").trim();
  const destination = String(formData.get("destination") || "").trim();
  const departure_city = String(formData.get("departure_city") || "").trim();
  const departure_date = String(formData.get("departure_date") || "").trim();
  const return_date = String(formData.get("return_date") || "").trim();
  const duration = String(formData.get("duration") || "").trim();
  const price = parseNum(formData.get("price"));
  const seats_total = parseNum(formData.get("seats_total"));
  const itinerary = String(formData.get("itinerary") || "").trim();
  const inclusions = String(formData.get("inclusions") || "").trim();
  const exclusions = String(formData.get("exclusions") || "").trim();
  const cancellation_policy = String(formData.get("cancellation_policy") || "").trim();
  const whatsapp_contact = String(formData.get("whatsapp_contact") || "").trim();
  const itinerary_pdf_path = String(formData.get("itinerary_pdf_path") || "").trim();

  if (!destination || !departure_city || !departure_date || !return_date || !duration) {
    return { ok: false, message: "Fill destination, cities, dates, and duration." };
  }
  if (price == null || price < 0) return { ok: false, message: "Enter a valid price." };

  const seats_remaining =
    seats_total != null && seats_total >= 0 ? seats_total : null;

  const row = {
    operator_id: user.id,
    listing_company,
    destination,
    departure_city,
    departure_date,
    return_date,
    duration,
    price,
    seats_total: seats_total != null && seats_total >= 0 ? seats_total : null,
    seats_remaining,
    itinerary: itinerary || null,
    itinerary_pdf_path: itinerary_pdf_path || null,
    inclusions: inclusions || null,
    exclusions: exclusions || null,
    cancellation_policy: cancellation_policy || null,
    whatsapp_contact: whatsapp_contact || null,
    status: "pending" as const,
  };

  if (id) {
    const { data: existing } = await supabase
      .from("tours")
      .select("id, operator_id")
      .eq("id", id)
      .single();
    if (!existing || existing.operator_id !== user.id) {
      return { ok: false, message: "Tour not found." };
    }
    const { error } = await supabase
      .from("tours")
      .update({
        ...row,
        status: "pending",
      })
      .eq("id", id)
      .eq("operator_id", user.id);
    if (error) return { ok: false, message: error.message };
  } else {
    const { error } = await supabase.from("tours").insert(row);
    if (error) return { ok: false, message: error.message };
  }

  revalidatePath("/operator/dashboard");
  revalidatePath("/tours");
  revalidatePath("/");
  return { ok: true, message: "Saved. Awaiting admin approval for publication." };
}

export async function setTourClosed(tourId: string): Promise<{ ok: boolean; message: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: "Sign in required." };

  const { error } = await supabase
    .from("tours")
    .update({ status: "closed" })
    .eq("id", tourId)
    .eq("operator_id", user.id);

  if (error) return { ok: false, message: error.message };
  revalidatePath("/operator/dashboard");
  revalidatePath("/tours");
  revalidatePath("/");
  return { ok: true, message: "Tour marked as closed." };
}
