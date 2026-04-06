"use client";

import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useState } from "react";

export function ForgotPasswordForm() {
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage(null);
    setIsError(false);
    setPending(true);
    const form = e.currentTarget;
    const email = String(form.email.value || "").trim();

    const supabase = createClient();
    const origin = window.location.origin;
    const nextPath = encodeURIComponent("/auth/reset-password");
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/auth/callback?next=${nextPath}`,
    });

    setPending(false);
    if (error) {
      setIsError(true);
      setMessage(error.message);
      return;
    }

    setMessage(
      "If an account exists for that email, we sent a reset link. Check your inbox and spam folder.",
    );
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
      {message && (
        <p
          className={`text-sm ${isError ? "text-red-600" : "text-green-800"}`}
        >
          {message}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-tp-navy py-3 text-sm font-bold text-white hover:bg-tp-blue disabled:opacity-60"
      >
        {pending ? "Sending…" : "Send reset link"}
      </button>
      <p className="text-center text-sm text-tp-muted">
        <Link href="/auth/login" className="font-semibold text-tp-blue hover:underline">
          Back to sign in
        </Link>
      </p>
    </form>
  );
}
