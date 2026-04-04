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
      className={`rounded-md border border-tp-border px-3 py-2 font-medium text-tp-muted hover:bg-tp-surface ${className}`}
    >
      Sign out
    </button>
  );
}
