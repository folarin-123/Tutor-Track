"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import AuthShell, { RoleSelector } from "@/components/auth/AuthShell";
import { useAuth } from "@/lib/auth";

export default function SignInPage() {
  const [role, setRole] = useState("tutor");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { signIn } = useAuth();
  const router = useRouter();

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Enter an email and password to continue.");
      return;
    }
    setError("");
    signIn(role);
    router.push(`/${role}`);
  };

  return (
    <AuthShell eyebrow="Welcome back">
      <RoleSelector role={role} onChange={setRole} />
      <h1 className="mt-8 text-3xl font-extrabold tracking-tight">Sign in to your space</h1>
      <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
        This prototype accepts any email and password.
      </p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <label className="block text-sm font-bold" htmlFor="signin-email">
          Email address
          <input
            id="signin-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            className="mt-2 w-full rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] px-4 py-3 font-normal outline-primary-500"
          />
        </label>
        <label className="block text-sm font-bold" htmlFor="signin-password">
          Password
          <input
            id="signin-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Anything works here"
            className="mt-2 w-full rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] px-4 py-3 font-normal outline-primary-500"
          />
        </label>
        {error && <p className="text-sm font-semibold text-danger-500">{error}</p>}
        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-full bg-primary-500 py-3.5 font-bold text-white"
        >
          Sign in <ArrowRight size={17} />
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-[var(--text-secondary)]">
        New here?{" "}
        <Link href="/signup" className="font-bold text-primary-600">
          Get started
        </Link>
      </p>
    </AuthShell>
  );
}
