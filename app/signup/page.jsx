"use client";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import AuthShell, { RoleSelector } from "@/components/auth/AuthShell";
import { useAuth } from "@/lib/auth";

const roleCopy = {
  tutor: {
    title: "Set up your tutor space",
    description: "Create a simple home for your students, sessions, and progress.",
  },
  student: {
    title: "Join your learning space",
    description: "Keep your plan and assignments close.",
  },
  parent: {
    title: "See your child's progress",
    description: "Join the linked parent view for sessions, assignments, and payments.",
  },
};

export default function SignUpPage() {
  const [role, setRole] = useState("tutor");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cv, setCv] = useState(null);
  const [error, setError] = useState("");
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const content = roleCopy[role];

  const handleCvChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const sizeKB = Math.round(file.size / 1024) || 1;
      setCv({
        name: file.name,
        sizeKB,
        type: file.type || "application/octet-stream",
      });
    } else {
      setCv(null);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const missingCv = role === "tutor" && !cv;
    if (!name.trim() || !email.trim() || !password.trim() || missingCv) {
      setError(
        role === "tutor"
          ? "Fill in your name, email, password, and CV to continue."
          : "Fill in your name, email, and password to continue."
      );
      return;
    }
    setError("");
    signIn(role, name.trim(), role === "tutor" && cv ? { cv } : undefined);
    navigate(`/${role}`);
  };

  return (
    <AuthShell eyebrow="Get started">
      <RoleSelector role={role} onChange={setRole} />
      <h1 className="mt-8 text-3xl font-extrabold tracking-tight">{content.title}</h1>
      <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
        {content.description} This prototype accepts any email and password.
      </p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <label className="block text-sm font-bold" htmlFor="signup-name">
          Your name
          <input
            id="signup-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Your name"
            className="mt-2 w-full rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] px-4 py-3 font-normal outline-primary-500"
          />
        </label>
        <label className="block text-sm font-bold" htmlFor="signup-email">
          Email address
          <input
            id="signup-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            className="mt-2 w-full rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] px-4 py-3 font-normal outline-primary-500"
          />
        </label>
        <label className="block text-sm font-bold" htmlFor="signup-password">
          Password
          <input
            id="signup-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Anything works here"
            className="mt-2 w-full rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] px-4 py-3 font-normal outline-primary-500"
          />
        </label>
        {role === "tutor" && (
          <div>
            <label className="block text-sm font-bold" htmlFor="signup-cv">
              Upload your CV
              <input
                id="signup-cv"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleCvChange}
                className="mt-2 w-full rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] px-4 py-3 font-normal outline-primary-500"
              />
            </label>
            <p className="mt-1 text-xs text-[var(--text-secondary)]">
              This is a prototype — your file stays on this device and isn't uploaded anywhere.
            </p>
          </div>
        )}
        {error && <p className="text-sm font-semibold text-danger-500">{error}</p>}
        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-full bg-primary-500 py-3.5 font-bold text-white"
        >
          Create account <ArrowRight size={17} />
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-[var(--text-secondary)]">
        Already have a space?{" "}
        <Link to="/signin" className="font-bold text-primary-600">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
