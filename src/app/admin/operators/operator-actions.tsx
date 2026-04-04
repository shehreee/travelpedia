"use client";

import {
  approveOperator,
  rejectOperator,
} from "@/app/actions/admin";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function OperatorActions({ profileId }: { profileId: string }) {
  const router = useRouter();
  const [pending, setPending] = useState<"a" | "r" | null>(null);

  async function run(fn: typeof approveOperator, key: "a" | "r") {
    setPending(key);
    await fn(profileId);
    setPending(null);
    router.refresh();
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        disabled={pending !== null}
        onClick={() => void run(approveOperator, "a")}
        className="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-60"
      >
        {pending === "a" ? "…" : "Approve"}
      </button>
      <button
        type="button"
        disabled={pending !== null}
        onClick={() => void run(rejectOperator, "r")}
        className="rounded-md border border-red-300 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-800 hover:bg-red-100 disabled:opacity-60"
      >
        {pending === "r" ? "…" : "Reject"}
      </button>
    </div>
  );
}
