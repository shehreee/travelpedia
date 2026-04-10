"use client";

import { setOperatorBanned } from "@/app/actions/admin";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function OperatorBanActions({
  profileId,
  banned,
}: {
  profileId: string;
  banned: boolean;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function toggle() {
    setPending(true);
    await setOperatorBanned(profileId, !banned);
    setPending(false);
    router.refresh();
  }

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => void toggle()}
      className={
        banned
          ? "rounded-md border border-emerald-600 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-900 hover:bg-emerald-100 disabled:opacity-60"
          : "rounded-md border border-red-300 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-800 hover:bg-red-100 disabled:opacity-60"
      }
    >
      {pending ? "…" : banned ? "Lift suspension" : "Suspend"}
    </button>
  );
}
