"use server";

import { createClient } from "@/lib/supabase/server";
import { toHutSlug } from "@/lib/hut-slug";
import { hutUpdateSchema } from "@/lib/validations/schemas";
import { revalidatePath } from "next/cache";

export async function updateHutProfile(formData: FormData): Promise<{ ok: boolean; message: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: "Sign in required." };

  const { data: profile, error: pe } = await supabase
    .from("profiles")
    .select("id, role")
    .eq("id", user.id)
    .single();

  if (pe || !profile || profile.role !== "operator") {
    return { ok: false, message: "Operator profile not found." };
  }

  const parsed = hutUpdateSchema.safeParse({
    company_name: formData.get("company_name"),
    profile_photo_url: formData.get("profile_photo_url"),
    hut_experience: formData.get("hut_experience"),
    area_of_operation: formData.get("area_of_operation"),
    phone: formData.get("phone"),
  });

  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? "Check your profile details.";
    return { ok: false, message: msg };
  }

  const { company_name, phone, profile_photo_url, hut_experience, area_of_operation } =
    parsed.data;

  const { error } = await supabase
    .from("profiles")
    .update({
      company_name,
      phone: phone || null,
      profile_photo_url: profile_photo_url || null,
      hut_experience: hut_experience || null,
      area_of_operation: area_of_operation || null,
    })
    .eq("id", user.id);

  if (error) return { ok: false, message: error.message };

  revalidatePath(`/hut/${toHutSlug(company_name)}`);
  revalidatePath("/operator/hut");
  revalidatePath("/tours");
  revalidatePath("/");
  return { ok: true, message: "HUT profile updated." };
}
