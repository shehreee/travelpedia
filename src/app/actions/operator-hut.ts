"use server";

import { createClient } from "@/lib/supabase/server";
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

  const company_name = String(formData.get("company_name") || "").trim();
  const profile_photo_url = String(formData.get("profile_photo_url") || "").trim();
  const hut_experience = String(formData.get("hut_experience") || "").trim();
  const area_of_operation = String(formData.get("area_of_operation") || "").trim();
  const phone = String(formData.get("phone") || "").trim();

  if (!company_name) {
    return { ok: false, message: "Company / brand name is required." };
  }

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

  revalidatePath("/operator/hut");
  revalidatePath(`/hut/${user.id}`);
  revalidatePath("/tours");
  revalidatePath("/");
  return { ok: true, message: "HUT profile updated." };
}
