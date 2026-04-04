import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { TourForm } from "@/components/operator/TourForm";
import { createClient } from "@/lib/supabase/server";
import type { Tour } from "@/types/database";

type Props = { params: Promise<{ id: string }> };

export default async function EditTourPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: tour, error } = await supabase
    .from("tours")
    .select("*")
    .eq("id", id)
    .eq("operator_id", user.id)
    .maybeSingle();

  if (error || !tour) notFound();

  return (
    <div>
      <Link href="/operator/dashboard" className="text-sm font-medium text-tp-blue hover:underline">
        ← Back to dashboard
      </Link>
      <h1 className="mt-4 text-2xl font-bold text-tp-navy">Edit tour</h1>
      <p className="mt-1 text-sm text-tp-muted">
        Updates reset status to pending until an admin re-approves.
      </p>
      <div className="mt-6">
        <TourForm tour={tour as Tour} />
      </div>
    </div>
  );
}
