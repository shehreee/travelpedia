"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type Props = { className?: string };

export function SignOutButton({ className = "" }: Props) {
  const router = useRouter();

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={() => void signOut()}
      className={`min-h-11 rounded-md border border-tp-border px-3 py-2 font-medium text-tp-muted outline-none transition-colors hover:bg-tp-surface focus-visible:ring-2 focus-visible:ring-tp-blue focus-visible:ring-offset-2 ${className}`}
    >
      Sign out
    </button>
  );
}
