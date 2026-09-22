"use client";

import Link from "next/link";
import { CheckCircle2, GraduationCap, Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/theme";

const roles = [
  { id: "tutor", label: "Tutor" },
  { id: "student", label: "Student" },
  { id: "parent", label: "Parent" },
];

export function RoleSelector({ role, onChange }) {
  return (
    <div className="grid grid-cols-3 gap-1 rounded-full bg-[var(--bg-surface-muted)] p-1">
      {roles.map((item) => (
        <button
          type="button"
          key={item.id}
          onClick={() => onChange(item.id)}
          className={`rounded-full py-2 text-sm font-bold transition-colors ${
            role === item.id
              ? "bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-sm"
              : "text-[var(--text-secondary)]"
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

export default function AuthShell({ children, eyebrow }) {
  const { dark, toggleTheme } = useTheme();
  return (
    <main className="min-h-screen bg-[var(--bg-page)] p-4 text-[var(--text-primary)] sm:p-6">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-6xl overflow-hidden rounded-[2rem] border border-[var(--border-default)] bg-[var(--bg-surface)] shadow-2xl shadow-black/10 lg:grid-cols-[.9fr_1.1fr]">
        <aside className="hidden bg-primary-900 p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-12">
          <Brand light />
          <div>
            <p className="text-sm font-bold uppercase tracking-[.18em] text-primary-300">
              {eyebrow}
            </p>
            <h2 className="mt-5 max-w-sm text-4xl font-extrabold leading-tight">
              A clear start for every tutoring journey.
            </h2>
            <p className="mt-5 max-w-sm text-sm leading-6 text-primary-100">
              Explore the same calm command centre used by tutors, students, and parents.
            </p>
          </div>
          <p className="flex items-center gap-2 text-sm text-primary-100">
            <CheckCircle2 className="text-primary-300" size={18} />
            A prototype with no real verification.
          </p>
        </aside>
        <section className="relative mx-auto flex w-full max-w-xl flex-col justify-center p-7 sm:p-12">
          <div className="absolute right-5 top-5">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle color mode"
              aria-pressed={dark}
              className="grid h-9 w-9 place-items-center rounded-full border border-[var(--border-default)] text-[var(--text-secondary)]"
            >
              {dark ? <Sun size={17} /> : <Moon size={17} />}
            </button>
          </div>
          <div className="mb-10 lg:hidden">
            <Brand />
          </div>
          <p className="text-sm font-semibold text-primary-600">{eyebrow}</p>
          {children}
          <Link
            href="/"
            className="mt-8 text-center text-sm font-bold text-[var(--text-secondary)] hover:text-primary-600"
          >
            Back to TutorTrack
          </Link>
        </section>
      </div>
    </main>
  );
}

function Brand({ light = false }) {
  return (
    <Link href="/" className="flex items-center gap-2 font-extrabold tracking-tight">
      <span
        className={`grid h-9 w-9 place-items-center rounded-full ${
          light ? "bg-primary-400 text-primary-900" : "bg-primary-500 text-white"
        }`}
      >
        <GraduationCap size={20} />
      </span>
      TutorTrack
    </Link>
  );
}
