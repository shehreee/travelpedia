"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LoginForm({ nextPath }: { nextPath: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const form = e.currentTarget;
    const email = String(form.email.value || "").trim();
    const password = String(form.password.value || "");

    const supabase = createClient();
    const { error: signErr } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (signErr) {
      setError(signErr.message);
      setPending(false);
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .single();

    if (profile?.role === "admin") {
      router.push("/admin");
    } else {
      router.push(nextPath.startsWith("/") ? nextPath : "/operator/dashboard");
    }
    router.refresh();
    setPending(false);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="text-xs font-medium text-tp-muted">Email</label>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className="mt-1 w-full rounded-md border border-tp-border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-tp-blue"
        />
      </div>
      <div>
        <label className="text-xs font-medium text-tp-muted">Password</label>
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="mt-1 w-full rounded-md border border-tp-border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-tp-blue"
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-tp-navy py-3 text-sm font-bold text-white hover:bg-tp-blue disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
