"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { supabase, ok: false as const };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, approval_status")
    .eq("id", user.id)
    .single();

  const ok = profile?.role === "admin" && profile?.approval_status === "approved";
  return { supabase, user, profile, ok };
}

export async function approveOperator(profileId: string) {
  const ctx = await requireAdmin();
  if (!ctx.ok) return { ok: false, message: "Unauthorized." };
  const { error } = await ctx.supabase
    .from("profiles")
    .update({ approval_status: "approved" })
    .eq("id", profileId)
    .eq("role", "operator");
  if (error) return { ok: false, message: error.message };
  revalidatePath("/admin/operators");
  return { ok: true, message: "Operator approved." };
}

export async function rejectOperator(profileId: string) {
  const ctx = await requireAdmin();
  if (!ctx.ok) return { ok: false, message: "Unauthorized." };
  const { error } = await ctx.supabase
    .from("profiles")
    .update({ approval_status: "rejected" })
    .eq("id", profileId)
    .eq("role", "operator");
  if (error) return { ok: false, message: error.message };
  revalidatePath("/admin/operators");
  return { ok: true, message: "Operator rejected." };
}

export async function approveTour(tourId: string) {
  const ctx = await requireAdmin();
  if (!ctx.ok) return { ok: false, message: "Unauthorized." };
  const { error } = await ctx.supabase
    .from("tours")
    .update({ status: "active" })
    .eq("id", tourId);
  if (error) return { ok: false, message: error.message };
  revalidatePath("/admin/tours");
  revalidatePath("/tours");
  revalidatePath("/");
  return { ok: true, message: "Tour is now live." };
}

export async function rejectTour(tourId: string) {
  const ctx = await requireAdmin();
  if (!ctx.ok) return { ok: false, message: "Unauthorized." };
  const { error } = await ctx.supabase
    .from("tours")
    .update({ status: "closed" })
    .eq("id", tourId);
  if (error) return { ok: false, message: error.message };
  revalidatePath("/admin/tours");
  revalidatePath("/tours");
  revalidatePath("/");
  return { ok: true, message: "Tour rejected / closed." };
}
