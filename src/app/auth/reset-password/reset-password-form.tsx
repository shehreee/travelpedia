"use client";

import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useEffect, useState } from "react";

export function ResetPasswordForm() {
  const [ready, setReady] = useState(false);
  const [checking, setChecking] = useState(true);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;

    function markReady() {
      if (!cancelled) {
        setReady(true);
        setChecking(false);
      }
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (cancelled) return;
      if (event === "PASSWORD_RECOVERY") {
        markReady();
        return;
      }
      if (session?.user) {
        markReady();
      }
    });

    void supabase.auth.getSession().then(({ data: { session } }) => {
      if (cancelled) return;
      if (session?.user) {
        markReady();
      }
    });

    const timer = window.setTimeout(() => {
      if (cancelled) return;
      void supabase.auth.getSession().then(({ data: { session } }) => {
        if (cancelled) return;
        if (session?.user) {
          markReady();
        } else {
          setChecking(false);
        }
      });
    }, 1200);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      subscription.unsubscribe();
    };
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const form = e.currentTarget;
    const password = String(form.password.value || "");
    const confirm = String(form.confirm.value || "");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      setPending(false);
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      setPending(false);
      return;
    }

    const supabase = createClient();
    const { error: updErr } = await supabase.auth.updateUser({ password });
    setPending(false);
    if (updErr) {
      setError(updErr.message);
      return;
    }
    setDone(true);
  }

  if (checking) {
    return (
      <p className="text-sm text-tp-muted" role="status">
        Verifying reset link…
      </p>
    );
  }

  if (!ready && !done) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-red-600">
          This reset link is invalid or has expired. Request a new one from the forgot password
          page.
        </p>
        <Link
          href="/auth/forgot-password"
          className="inline-block text-sm font-semibold text-tp-blue hover:underline"
        >
          Forgot password
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-green-800">
          Your password was updated. You can sign in with your new password.
        </p>
        <Link
          href="/auth/login"
          className="inline-block w-full rounded-md bg-tp-navy py-3 text-center text-sm font-bold text-white hover:bg-tp-blue"
        >
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="text-xs font-medium text-tp-muted">New password</label>
        <input
          name="password"
          type="password"
          required
          minLength={6}
          autoComplete="new-password"
          className="mt-1 w-full rounded-md border border-tp-border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-tp-blue"
        />
      </div>
      <div>
        <label className="text-xs font-medium text-tp-muted">Confirm password</label>
        <input
          name="confirm"
          type="password"
          required
          minLength={6}
          autoComplete="new-password"
          className="mt-1 w-full rounded-md border border-tp-border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-tp-blue"
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-tp-navy py-3 text-sm font-bold text-white hover:bg-tp-blue disabled:opacity-60"
      >
        {pending ? "Updating…" : "Update password"}
      </button>
    </form>
  );
}
