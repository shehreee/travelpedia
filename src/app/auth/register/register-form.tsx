"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function RegisterForm() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage(null);
    setPending(true);
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      if (!supabaseUrl || !supabaseAnonKey) {
        setMessage(
          "Signup is not configured. Missing Supabase environment variables on this deployment.",
        );
        return;
      }

      const form = e.currentTarget;
      const email = String(form.email.value || "").trim();
      const password = String(form.password.value || "");
      const full_name = String(form.full_name.value || "").trim();
      const phone = String(form.phone.value || "").trim();
      const company_name = String(form.company_name.value || "").trim();

      const supabase = createClient();
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name,
            phone,
            company_name,
          },
        },
      });
      if (error) {
        setMessage(error.message);
        return;
      }

      router.push("/auth/login?registered=1");
    } catch (err: unknown) {
      const reason =
        err instanceof Error && err.message
          ? err.message
          : "Network or server issue. Please try again.";
      setMessage(`Signup failed: ${reason}`);
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="text-xs font-medium text-tp-muted">Company / brand name</label>
        <input
          name="company_name"
          required
          className="tp-input mt-1"
        />
      </div>
      <div>
        <label className="text-xs font-medium text-tp-muted">Your full name</label>
        <input
          name="full_name"
          required
          autoComplete="name"
          className="tp-input mt-1"
        />
      </div>
      <div>
        <label className="text-xs font-medium text-tp-muted">Phone</label>
        <input
          name="phone"
          type="tel"
          required
          autoComplete="tel"
          className="tp-input mt-1"
        />
      </div>
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
        <label className="text-xs font-medium text-tp-muted">Password</label>
        <input
          name="password"
          type="password"
          required
          minLength={6}
          autoComplete="new-password"
          className="tp-input mt-1"
        />
      </div>
      {message && (
        <p
          className={`text-sm ${message.includes("Check") || message.includes("verify") ? "text-green-800" : "text-red-700"}`}
          role="status"
        >
          {message}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="min-h-11 w-full rounded-md bg-tp-blue py-3 text-sm font-bold text-white outline-none transition-colors hover:bg-tp-blue-hover disabled:opacity-60 focus-visible:ring-2 focus-visible:ring-tp-blue focus-visible:ring-offset-2"
      >
        {pending ? "Signing up…" : "Signup"}
      </button>
    </form>
  );
}
