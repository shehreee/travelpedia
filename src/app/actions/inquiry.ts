"use server";

import { createAnonServerClient } from "@/lib/supabase/server";
import { inquirySchema } from "@/lib/validations/schemas";

export async function submitInquiry(formData: FormData): Promise<{
  ok: boolean;
  message: string;
}> {
  const supabase = createAnonServerClient();
  if (!supabase) {
    return { ok: false, message: "Add Supabase keys to .env.local to enable inquiries." };
  }

  const parsed = inquirySchema.safeParse({
    tourId: formData.get("tourId"),
    name: formData.get("name"),
    phone: formData.get("phone"),
    message: formData.get("message"),
    seats_requested: formData.get("seats_requested"),
  });

  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? "Please check the form.";
    return { ok: false, message: msg };
  }

  const { tourId, name, phone, message, seats_requested } = parsed.data;

  const { error } = await supabase.from("inquiries").insert({
    tour_id: tourId,
    name,
    phone,
    message: message || null,
    seats_requested: seats_requested,
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
