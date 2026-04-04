"use server";

import { createAnonServerClient } from "@/lib/supabase/server";

export async function submitInquiry(formData: FormData): Promise<{
  ok: boolean;
  message: string;
}> {
  const supabase = createAnonServerClient();
  if (!supabase) {
    return { ok: false, message: "Add Supabase keys to .env.local to enable inquiries." };
  }

  const tourId = String(formData.get("tourId") || "").trim();
  const name = String(formData.get("name") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const message = String(formData.get("message") || "").trim();
  const seats = Math.max(1, Number(formData.get("seats_requested")) || 1);

  if (!tourId || !name || !phone) {
    return { ok: false, message: "Please fill in name, phone, and tour." };
  }

  const { error } = await supabase.from("inquiries").insert({
    tour_id: tourId,
    name,
    phone,
    message: message || null,
    seats_requested: seats,
  });

  if (error) {
    const rls = error.message.includes("row-level security");
    return {
      ok: false,
      message: rls
        ? "Could not send inquiry. The tour may no longer be available."
        : error.message,
    };
  }

  return {
    ok: true,
    message: "Inquiry sent. The operator will contact you soon.",
  };
}
