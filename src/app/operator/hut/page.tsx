import { HutEditorForm } from "./hut-form";
import { toHutSlug } from "@/lib/hut-slug";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function OperatorHutPage() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-tp-navy">Your HUT</h1>
        <p className="mt-2 text-tp-muted">Configure Supabase to edit your public profile.</p>
      </div>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login?next=/operator/hut");

  let migrationMissing = false;
  const extended = await supabase
    .from("profiles")
    .select(
      "company_name, phone, profile_photo_url, hut_experience, area_of_operation, role, approval_status",
    )
    .eq("id", user.id)
    .single();
  let profile = extended.data;
  let error = extended.error;
  if (error?.message.includes("does not exist")) {
    migrationMissing = true;
    const basic = await supabase
      .from("profiles")
      .select("company_name, phone, role, approval_status")
      .eq("id", user.id)
      .single();
    profile = basic.data
      ? {
          ...basic.data,
          profile_photo_url: null,
          hut_experience: null,
          area_of_operation: null,
        }
      : null;
    error = basic.error;
  }

  if (error || !profile || profile.role !== "operator") {
    redirect("/auth/login");
  }

  const base =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    (typeof process.env.VERCEL_URL === "string"
      ? `https://${process.env.VERCEL_URL}`
      : "");
  const hutSlug = toHutSlug(profile.company_name || "operator");
  const hutUrl = base ? `${base}/hut/${hutSlug}` : `/hut/${hutSlug}`;

  return (
    <div>
      <h1 className="text-2xl font-bold text-tp-navy">Your HUT</h1>
      <p className="mt-1 text-sm text-tp-muted">
        Public agency profile: trips, story, and contact. Email comes from your account; update it in
        Supabase Auth if needed.
      </p>
      {profile.approval_status !== "approved" && (
        <p className="mt-4 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          Your account is not approved yet. HUT will be public only after admin approval.
        </p>
      )}
      {migrationMissing && (
        <p className="mt-4 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          HUT photo/experience fields need DB migration `002_hut_operator_public.sql` in Supabase.
        </p>
      )}
      <div className="mt-8 max-w-2xl">
        <HutEditorForm
          hutUrl={hutUrl}
          initial={{
            company_name: profile.company_name,
            phone: profile.phone,
            profile_photo_url: profile.profile_photo_url ?? null,
            hut_experience: profile.hut_experience ?? null,
            area_of_operation: profile.area_of_operation ?? null,
          }}
        />
      </div>
    </div>
  );
}
