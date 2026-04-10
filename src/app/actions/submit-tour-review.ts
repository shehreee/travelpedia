"use server";

import { createAnonServerClient } from "@/lib/supabase/server";
import { reviewSubmitSchema } from "@/lib/validations/schemas";
import { isUuid } from "@/lib/is-uuid";
import { revalidatePath } from "next/cache";

export async function submitTourReview(formData: FormData): Promise<{
  ok: boolean;
  message: string;
}> {
  const supabase = createAnonServerClient();
  if (!supabase) {
    return { ok: false, message: "Connect Supabase to submit reviews." };
  }

  const parsed = reviewSubmitSchema.safeParse({
    tourId: formData.get("tourId"),
    author_name: formData.get("author_name"),
    author_email: formData.get("author_email"),
    rating: formData.get("rating"),
    comment: formData.get("comment"),
  });

  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? "Check your review details.";
    return { ok: false, message: msg };
  }

  const { tourId, author_name, author_email, rating, comment } = parsed.data;
  if (!isUuid(tourId)) {
    return {
      ok: false,
      message: "Reviews can only be submitted for published database listings.",
    };
  }

  const { error } = await supabase.from("tour_reviews").insert({
    tour_id: tourId,
    author_name,
    author_email: author_email ?? null,
    rating,
    comment: comment || null,
    status: "pending",
  });

  if (error) {
    const rls = error.message.includes("row-level security");
    return {
      ok: false,
      message: rls
        ? "This tour may not accept reviews yet, or it is no longer active."
        : error.message,
    };
  }

  revalidatePath(`/tours/${tourId}`);
  return {
    ok: true,
    message: "Thanks — your review was submitted and will appear after moderation.",
  };
}
