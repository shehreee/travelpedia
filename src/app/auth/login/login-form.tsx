"use client";

import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useState } from "react";

export function LoginForm({ nextPath }: { nextPath: string }) {
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

    // Ensure the browser client has finished persisting the session to cookies
    // before the server runs layout auth checks (avoids redirect loop / “reload”).
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
      setError("Session could not be established. Please try again.");
      setPending(false);
      return;
    }

    const { data: profile, error: profileErr } = await supabase
      .from("profiles")
      .select("role")
      .maybeSingle();

    if (profileErr) {
      setError(profileErr.message);
      setPending(false);
      return;
    }
    if (!profile) {
      setError(
        "No operator profile found for this account. If you just signed up, confirm your email first or contact support.",
      );
      setPending(false);
      return;
    }

    const dest =
      profile.role === "admin"
        ? "/admin"
        : nextPath.startsWith("/")
          ? nextPath
          : "/operator/dashboard";

    // Full navigation so middleware + server layouts reliably receive auth cookies.
    window.location.assign(dest);
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
          className="tp-input mt-1"
        />
      </div>
      <div>
        <div className="flex items-center justify-between gap-2">
          <label className="text-xs font-medium text-tp-muted">Password</label>
          <Link
            href="/auth/forgot-password"
            className="rounded-sm text-xs font-semibold text-tp-blue underline-offset-4 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-tp-blue focus-visible:ring-offset-2"
          >
            Forgot password?
          </Link>
        </div>
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="tp-input mt-1"
        />
      </div>
      {error && (
        <p className="text-sm text-red-700" role="alert">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="min-h-11 w-full rounded-md bg-tp-navy py-3 text-sm font-bold text-white outline-none transition-colors hover:bg-tp-blue disabled:opacity-60 focus-visible:ring-2 focus-visible:ring-tp-blue focus-visible:ring-offset-2"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
