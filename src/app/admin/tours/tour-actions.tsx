"use client";

import { approveTour, rejectTour } from "@/app/actions/admin";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function TourActions({ tourId }: { tourId: string }) {
  const router = useRouter();
  const [pending, setPending] = useState<"a" | "r" | null>(null);

  async function run(fn: typeof approveTour, key: "a" | "r") {
    setPending(key);
    await fn(tourId);
    setPending(null);
    router.refresh();
  }

  return (
    <div className="flex flex-wrap justify-end gap-2">
      <button
        type="button"
        disabled={pending !== null}
        onClick={() => void run(approveTour, "a")}
        className="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-60"
      >
        {pending === "a" ? "…" : "Approve"}
      </button>
      <button
        type="button"
        disabled={pending !== null}
        onClick={() => void run(rejectTour, "r")}
        className="rounded-md border border-red-300 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-800 hover:bg-red-100 disabled:opacity-60"
      >
        {pending === "r" ? "…" : "Reject"}
      </button>
    </div>
  );
}
