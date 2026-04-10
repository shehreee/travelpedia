"use server";

import { createClient } from "@/lib/supabase/server";
import { tourSaveSchema } from "@/lib/validations/schemas";
import { revalidatePath } from "next/cache";

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

  const parsed = tourSaveSchema.safeParse({
    destination: formData.get("destination"),
    departure_city: formData.get("departure_city"),
    departure_date: formData.get("departure_date"),
    return_date: formData.get("return_date"),
    duration: formData.get("duration"),
    price: formData.get("price"),
    seats_total: formData.get("seats_total"),
    listing_category: formData.get("listing_category"),
    itinerary: formData.get("itinerary"),
    itinerary_pdf_path: formData.get("itinerary_pdf_path"),
    inclusions: formData.get("inclusions"),
    exclusions: formData.get("exclusions"),
    cancellation_policy: formData.get("cancellation_policy"),
    whatsapp_contact: formData.get("whatsapp_contact"),
  });

  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? "Check the tour form.";
    return { ok: false, message: msg };
  }

  const d = parsed.data;
  const seats_total = d.seats_total;
  const seats_remaining =
    seats_total != null && seats_total >= 0 ? seats_total : null;

  const row = {
    operator_id: user.id,
    listing_company,
    destination: d.destination,
    departure_city: d.departure_city,
    departure_date: d.departure_date,
    return_date: d.return_date,
    duration: d.duration,
    price: d.price,
    seats_total: seats_total != null && seats_total >= 0 ? seats_total : null,
    seats_remaining,
    listing_category: d.listing_category,
    itinerary: d.itinerary || null,
    itinerary_pdf_path: d.itinerary_pdf_path || null,
    inclusions: d.inclusions || null,
    exclusions: d.exclusions || null,
    cancellation_policy: d.cancellation_policy || null,
    whatsapp_contact: d.whatsapp_contact || null,
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
  if (id) revalidatePath(`/tours/${id}`);
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
  revalidatePath(`/tours/${tourId}`);
  return { ok: true, message: "Tour marked as closed." };
}
