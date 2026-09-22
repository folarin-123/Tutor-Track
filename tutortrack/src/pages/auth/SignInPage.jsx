import { ArrowRight, CheckCircle2, GraduationCap, Moon, Sun } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../../hooks/useTheme.js";

const roles = [
  { id: "tutor", label: "Tutor" },
  { id: "student", label: "Student" },
  { id: "parent", label: "Parent" },
];

export default function SignInPage() {
  const [role, setRole] = useState("tutor");
  const [step, setStep] = useState("contact");
  const [method, setMethod] = useState("phone");
  const navigate = useNavigate();
  const { dark, toggleTheme } = useTheme();

  return (
    <AuthShell dark={dark} onToggleTheme={toggleTheme} eyebrow="Welcome back">
      {step === "contact" ? (
        <ContactStep
          method={method}
          onMethodChange={setMethod}
          onContinue={() => setStep("code")}
          role={role}
          onRoleChange={setRole}
        />
      ) : (
        <OtpStep role={role} onContinue={() => navigate(`/${role}`)} />
      )}
    </AuthShell>
  );
}

function ContactStep({ method, onMethodChange, onContinue, role, onRoleChange }) {
  return (
    <>
      <RoleSelector role={role} onChange={onRoleChange} />
      <h1 className="mt-8 text-3xl font-extrabold tracking-tight">Sign in to your space</h1>
      <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">Use your phone or email to continue. This prototype accepts any code.</p>
      <MethodSelector method={method} onChange={onMethodChange} />
      <label className="mt-5 block text-sm font-bold" htmlFor="signin-contact">
        {method === "phone" ? "Phone number" : "Email address"}
        <input id="signin-contact" type={method === "phone" ? "tel" : "email"} placeholder={method === "phone" ? "+234 803 555 0192" : "you@example.com"} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-normal outline-emerald-500 dark:border-slate-700 dark:bg-slate-900" />
      </label>
      <button type="button" onClick={onContinue} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3.5 font-bold text-white">Send code <ArrowRight size={17} /></button>
      <p className="mt-6 text-center text-sm text-slate-500">New here? <Link to="/signup" className="font-bold text-emerald-600">Get started</Link></p>
    </>
  );
}

function OtpStep({ role, onContinue }) {
  return (
    <>
      <p className="text-sm font-semibold text-emerald-600">Mock verification</p>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight">Enter your code</h1>
      <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">Any 4-6 digit code works for this preview. You will go straight to the {role} dashboard.</p>
      <div className="mt-7 grid grid-cols-6 gap-2">
        {[1, 2, 3, 4, 5, 6].map((digit) => <input key={digit} aria-label={`Code digit ${digit}`} maxLength="1" inputMode="numeric" className="h-12 min-w-0 rounded-xl border border-slate-200 bg-white text-center text-xl font-bold outline-emerald-500 dark:border-slate-700 dark:bg-slate-900" />)}
      </div>
      <button type="button" onClick={onContinue} className="mt-6 w-full rounded-xl bg-emerald-500 py-3.5 font-bold text-white">Continue to dashboard</button>
      <p className="mt-6 text-center text-sm text-slate-500">No real verification is used in this prototype.</p>
    </>
  );
}

export function RoleSelector({ role, onChange }) {
  return (
    <div className="grid grid-cols-3 gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-900">
      {roles.map((item) => <button type="button" key={item.id} onClick={() => onChange(item.id)} className={`rounded-lg py-2 text-sm font-bold transition-colors ${role === item.id ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white" : "text-slate-500"}`}>{item.label}</button>)}
    </div>
  );
}

function MethodSelector({ method, onChange }) {
  return (
    <div className="mt-6 grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-900">
      {['phone', 'email'].map((item) => <button type="button" key={item} onClick={() => onChange(item)} className={`rounded-lg py-2 text-sm font-bold capitalize ${method === item ? "bg-white shadow-sm dark:bg-slate-700" : "text-slate-500"}`}>{item}</button>)}
    </div>
  );
}

export function AuthShell({ children, eyebrow, dark, onToggleTheme }) {
  return (
    <main className="min-h-screen bg-[var(--color-app-bg)] p-4 text-slate-900 dark:bg-[var(--color-dark-bg)] dark:text-slate-50 sm:p-6">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-6xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10 dark:border-slate-800 dark:bg-[var(--color-dark-surface)] lg:grid-cols-[.9fr_1.1fr]">
        <aside className="hidden bg-[var(--color-brand-navy)] p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-12">
          <Brand light />
          <div><p className="text-sm font-bold uppercase tracking-[.18em] text-emerald-300">{eyebrow}</p><h2 className="mt-5 max-w-sm text-4xl font-extrabold leading-tight">A clear start for every tutoring journey.</h2><p className="mt-5 max-w-sm text-sm leading-6 text-slate-300">Explore the same calm command centre used by tutors, students, and parents.</p></div>
          <p className="flex items-center gap-2 text-sm text-slate-300"><CheckCircle2 className="text-emerald-300" size={18} /> A visual prototype with no real verification.</p>
        </aside>
        <section className="relative mx-auto flex w-full max-w-xl flex-col justify-center p-7 sm:p-12">
          <div className="absolute right-5 top-5"><button type="button" onClick={onToggleTheme} aria-label="Toggle color mode" aria-pressed={dark} className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 text-slate-500 dark:border-slate-700 dark:text-slate-300">{dark ? <Sun size={17} /> : <Moon size={17} />}</button></div>
          <div className="mb-10 lg:hidden"><Brand /></div>
          <p className="text-sm font-semibold text-emerald-600">{eyebrow}</p>
          {children}
          <Link to="/" className="mt-8 text-center text-sm font-bold text-slate-500 hover:text-emerald-600">Back to TutorTrack</Link>
        </section>
      </div>
    </main>
  );
}

function Brand({ light = false }) {
  return <Link to="/" className="flex items-center gap-2 font-extrabold tracking-tight"><span className={`grid h-9 w-9 place-items-center rounded-xl ${light ? "bg-emerald-400 text-[var(--color-brand-navy)]" : "bg-emerald-500 text-white"}`}><GraduationCap size={20} /></span>TutorTrack</Link>;
}
