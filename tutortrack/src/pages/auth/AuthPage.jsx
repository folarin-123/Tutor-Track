import {
  ArrowRight,
  CheckCircle2,
  GraduationCap,
  Mail,
  Moon,
  Phone,
  ShieldCheck,
  Sun,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../hooks/useTheme.js";

export default function AuthPage() {
  const [step, setStep] = useState("role"),
    [role, setRole] = useState("tutor"),
    [method, setMethod] = useState("phone");
  const navigate = useNavigate();
  const { dark, toggleTheme } = useTheme();
  const finish = () => navigate(`/${role}`);
  return (
    <main className="relative min-h-screen bg-[var(--color-app-bg)] p-4 text-slate-900 dark:bg-[var(--color-dark-bg)] dark:text-slate-50">
      <button
        type="button"
        onClick={toggleTheme}
        aria-label="Toggle color mode"
        aria-pressed={dark}
        className="absolute right-6 top-6 z-10 grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-500 dark:border-slate-700 dark:bg-[var(--color-dark-surface)] dark:text-slate-300"
      >
        {dark ? <Sun size={17} /> : <Moon size={17} />}
      </button>
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-6xl overflow-hidden rounded-4xl bg-white shadow-2xl shadow-slate-900/10 lg:grid-cols-[1.05fr_.95fr]">
        <section className="hidden bg-[var(--color-brand-navy)] p-12 text-white lg:flex lg:flex-col">
          <div className="flex items-center gap-2 font-extrabold">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-400 text-[var(--color-brand-navy)]">
              <GraduationCap />
            </span>
            TutorTrack
          </div>
          <div className="my-auto">
            <p className="mb-5 text-sm font-bold uppercase tracking-[.2em] text-emerald-300">
              Prep made visible
            </p>
            <h1 className="max-w-md text-5xl font-extrabold leading-tight">
              The calm command centre for every tutor.
            </h1>
            <p className="mt-6 max-w-md leading-7 text-slate-300">
              Sessions, assignments, progress and payments—simple enough to run
              between classes.
            </p>
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-300">
            <ShieldCheck className="text-emerald-300" />
            Private by design for tutors, students and parents.
          </div>
        </section>
        <section className="mx-auto flex w-full max-w-md flex-col justify-center bg-white p-7 dark:bg-[var(--color-dark-surface)] sm:p-12">
          <div className="mb-8 flex items-center gap-2 font-extrabold lg:hidden">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-500 text-white">
              <GraduationCap />
            </span>
            TutorTrack
          </div>
          <p className="text-sm font-semibold text-emerald-600">
            Welcome to TutorTrack
          </p>
          <h2 className="mt-2 text-3xl font-extrabold">
            {step === "role"
              ? "How will you use it?"
              : step === "details"
                ? "Sign in or create account"
                : "Verify your code"}
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            {step === "role"
              ? "Choose a role. You can use an invite link to join a tutor’s class."
              : step === "details"
                ? "No password to remember. We’ll send a one-time code."
                : `We sent a 6-digit code to your ${method === "phone" ? "phone" : "email"}.`}
          </p>
          {step === "role" && (
            <>
              <div className="mt-7 space-y-3">
                {[
                  ["tutor", "I manage my own students"],
                  ["student", "I’m here to stay on track"],
                  ["parent", "I’m checking on my child"],
                ].map(([id, text]) => (
                  <button
                    key={id}
                    onClick={() => setRole(id)}
                    className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition ${role === id ? "border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500" : "border-slate-200 hover:border-emerald-300"}`}
                  >
                    <span
                      className={`grid h-9 w-9 place-items-center rounded-xl ${role === id ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-500"}`}
                    >
                      <CheckCircle2 size={18} />
                    </span>
                    <span>
                      <strong className="block capitalize">{id}</strong>
                      <small className="text-slate-500">{text}</small>
                    </span>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setStep("details")}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 font-bold text-white"
              >
                Continue <ArrowRight size={18} />
              </button>
            </>
          )}
          {step === "details" && (
            <>
              <div className="mt-7 grid grid-cols-2 rounded-xl bg-slate-100 p-1">
                <button
                  onClick={() => setMethod("phone")}
                  className={`rounded-lg py-2 text-sm font-semibold ${method === "phone" ? "bg-white shadow-sm" : "text-slate-500"}`}
                >
                  <Phone className="mr-1 inline" size={14} />
                  Phone
                </button>
                <button
                  onClick={() => setMethod("email")}
                  className={`rounded-lg py-2 text-sm font-semibold ${method === "email" ? "bg-white shadow-sm" : "text-slate-500"}`}
                >
                  <Mail className="mr-1 inline" size={14} />
                  Email
                </button>
              </div>
              <label className="mt-5 block text-sm font-semibold">
                {method === "phone" ? "Phone number" : "Email address"}
                <input
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-emerald-500"
                  defaultValue={
                    method === "phone"
                      ? "+234 803 555 0192"
                      : "hello@example.com"
                  }
                />
              </label>
              <button
                onClick={() => setStep("otp")}
                className="mt-6 w-full rounded-xl bg-emerald-500 py-3 font-bold text-white"
              >
                Send one-time code
              </button>
              <button
                onClick={() => setStep("role")}
                className="mt-3 w-full py-2 text-sm text-slate-500"
              >
                Back
              </button>
            </>
          )}
          {step === "otp" && (
            <>
              <div className="mt-7 flex gap-2">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <input
                    key={n}
                    maxLength="1"
                    className="h-12 w-full rounded-xl border border-slate-200 text-center text-xl font-bold outline-emerald-500"
                    defaultValue={n < 4 ? String(n + 1) : ""}
                  />
                ))}
              </div>
              <button
                onClick={finish}
                className="mt-6 w-full rounded-xl bg-emerald-500 py-3 font-bold text-white"
              >
                Verify & continue
              </button>
              <button
                onClick={() => setStep("details")}
                className="mt-3 w-full py-2 text-sm text-slate-500"
              >
                Use a different contact
              </button>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
