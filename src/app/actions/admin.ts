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

export async function setOperatorBanned(profileId: string, banned: boolean) {
  const ctx = await requireAdmin();
  if (!ctx.ok) return { ok: false, message: "Unauthorized." };
  const { error } = await ctx.supabase
    .from("profiles")
    .update({ banned })
    .eq("id", profileId)
    .eq("role", "operator");
  if (error) return { ok: false, message: error.message };
  revalidatePath("/admin/operators");
  return { ok: true, message: banned ? "Operator suspended." : "Suspension lifted." };
}

export async function approveTourReview(reviewId: string) {
  const ctx = await requireAdmin();
  if (!ctx.ok) return { ok: false, message: "Unauthorized." };
  const { data: row, error: fe } = await ctx.supabase
    .from("tour_reviews")
    .select("tour_id")
    .eq("id", reviewId)
    .single();
  if (fe || !row) return { ok: false, message: "Review not found." };

  const { error } = await ctx.supabase
    .from("tour_reviews")
    .update({ status: "approved" })
    .eq("id", reviewId);
  if (error) return { ok: false, message: error.message };
  revalidatePath("/admin/reviews");
  revalidatePath(`/tours/${row.tour_id}`);
  revalidatePath("/tours");
  return { ok: true, message: "Review published." };
}

export async function rejectTourReview(reviewId: string) {
  const ctx = await requireAdmin();
  if (!ctx.ok) return { ok: false, message: "Unauthorized." };
  const { data: row, error: fe } = await ctx.supabase
    .from("tour_reviews")
    .select("tour_id")
    .eq("id", reviewId)
    .single();
  if (fe || !row) return { ok: false, message: "Review not found." };

  const { error } = await ctx.supabase
    .from("tour_reviews")
    .update({ status: "rejected" })
    .eq("id", reviewId);
  if (error) return { ok: false, message: error.message };
  revalidatePath("/admin/reviews");
  revalidatePath(`/tours/${row.tour_id}`);
  return { ok: true, message: "Review rejected." };
}
