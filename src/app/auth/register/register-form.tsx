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
    setPending(false);
    if (error) {
      setMessage(error.message);
      return;
    }
    setMessage("Check your email to confirm your account, then sign in.");
    router.push("/auth/login");
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="text-xs font-medium text-tp-muted">Company / brand name</label>
        <input
          name="company_name"
          required
          className="mt-1 w-full rounded-md border border-tp-border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-tp-blue"
        />
      </div>
      <div>
        <label className="text-xs font-medium text-tp-muted">Your full name</label>
        <input
          name="full_name"
          required
          className="mt-1 w-full rounded-md border border-tp-border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-tp-blue"
        />
      </div>
      <div>
        <label className="text-xs font-medium text-tp-muted">Phone</label>
        <input
          name="phone"
          type="tel"
          required
          className="mt-1 w-full rounded-md border border-tp-border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-tp-blue"
        />
      </div>
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
          minLength={6}
          autoComplete="new-password"
          className="mt-1 w-full rounded-md border border-tp-border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-tp-blue"
        />
      </div>
      {message && (
        <p className={`text-sm ${message.includes("Check") ? "text-green-700" : "text-red-600"}`}>
          {message}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-tp-blue py-3 text-sm font-bold text-white hover:bg-tp-blue-hover disabled:opacity-60"
      >
        {pending ? "Creating…" : "Register"}
      </button>
    </form>
  );
}
