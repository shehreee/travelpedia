"use client";

import { approveTourReview, rejectTourReview } from "@/app/actions/admin";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function ReviewModerationActions({ reviewId }: { reviewId: string }) {
  const router = useRouter();
  const [pending, setPending] = useState<"a" | "r" | null>(null);

  async function run(fn: typeof approveTourReview, key: "a" | "r") {
    setPending(key);
    await fn(reviewId);
    setPending(null);
    router.refresh();
  }

  return (
    <div className="flex flex-wrap justify-end gap-2">
      <button
        type="button"
        disabled={pending !== null}
        onClick={() => void run(approveTourReview, "a")}
        className="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-60"
      >
        {pending === "a" ? "…" : "Approve"}
      </button>
      <button
        type="button"
        disabled={pending !== null}
        onClick={() => void run(rejectTourReview, "r")}
        className="rounded-md border border-red-300 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-800 hover:bg-red-100 disabled:opacity-60"
      >
        {pending === "r" ? "…" : "Reject"}
      </button>
    </div>
  );
}
