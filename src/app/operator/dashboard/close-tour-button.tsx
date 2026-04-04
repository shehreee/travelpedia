"use client";

import { setTourClosed } from "@/app/actions/operator-tours";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function CloseTourButton({ tourId }: { tourId: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function click() {
    if (!confirm("Mark this tour as closed? It will disappear from public search.")) return;
    setPending(true);
    await setTourClosed(tourId);
    setPending(false);
    router.refresh();
  }

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => void click()}
      className="rounded-md border border-red-200 bg-red-50 px-2 py-1 text-xs font-semibold text-red-800 hover:bg-red-100 disabled:opacity-60"
    >
      Close
    </button>
  );
}
