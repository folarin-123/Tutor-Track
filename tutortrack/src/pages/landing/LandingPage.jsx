import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  GraduationCap,
  Mail,
  Menu,
  MessageCircle,
  Moon,
  Sun,
  Users,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useTheme } from "../../hooks/useTheme.js";

const problems = [
  {
    icon: CalendarDays,
    title: "Scheduling lives in your notebook",
    copy: "Keep sessions, changes, and attendance in one calm place instead of chasing a calendar and a WhatsApp thread.",
  },
  {
    icon: MessageCircle,
    title: "Assignments disappear in chat",
    copy: "Know what was assigned, what is overdue, and what still needs grading without searching through old messages.",
  },
  {
    icon: Users,
    title: "Parents are left guessing",
    copy: "Give families a clear view of attendance, progress, assignments, and payments without another status request.",
  },
];

const roles = [
  {
    icon: GraduationCap,
    label: "Tutor",
    title: "Run the whole practice",
    copy: "See the work that needs your attention and keep every student moving.",
    href: "/tutor",
    action: "Open tutor space",
    items: [
      "Schedule one-off and group sessions",
      "Track assignments, grading, and payments",
      "See each student's progress at a glance",
    ],
    preview: { stat: "4 sessions", detail: "Next: Blessing at 4:00 pm", bars: ["Today", "To grade", "Outstanding"] },
    accent: "emerald",
  },
  {
    icon: BookOpen,
    label: "Student",
    title: "Know what comes next",
    copy: "Keep sessions, tasks, scores, and tutor messages together in one view.",
    href: "/student",
    action: "Open student view",
    items: [
      "See upcoming sessions and weekly goals",
      "Submit work and review feedback",
      "Follow syllabus progress and mock scores",
    ],
    preview: { stat: "88% progress", detail: "Mathematics · on track", bars: ["Next session", "3 tasks done", "78% latest score"] },
    accent: "sky",
  },
  {
    icon: Users,
    label: "Parent",
    title: "Stay close without hovering",
    copy: "Get the signal that matters without needing to ask for another update.",
    href: "/parent",
    action: "Open parent portal",
    items: [
      "Review attendance and assignment status",
      "Follow progress and score trends",
      "Check payment history and message the tutor",
    ],
    preview: { stat: "94% attendance", detail: "Blessing is on track", bars: ["3/5 tasks done", "60% syllabus", "₦36,000 due"] },
    accent: "orange",
  },
];

const workflow = [
  { number: "01", icon: CalendarDays, title: "Plan the week", copy: "Book one-off or recurring sessions, then keep attendance in the same place." },
  { number: "02", icon: ClipboardCheck, title: "Keep work moving", copy: "Assign practice, collect submissions, and keep grading from becoming a backlog." },
  { number: "03", icon: MessageCircle, title: "Share the signal", copy: "Parents see progress, payments, and the next step without another status chase." },
];

export default function LandingPage() {
  const { dark, toggleTheme } = useTheme();

  return (
    <main className="min-h-screen overflow-hidden bg-[var(--color-app-bg)] text-slate-900 dark:bg-[var(--color-dark-bg)] dark:text-slate-50">
      <LandingHeader dark={dark} onToggleTheme={toggleTheme} />
      <Hero />
      <ProblemSection />
      <WorkflowSection />
      <RolePreviewSection />
      <LandingFooter />
    </main>
  );
}

function LandingHeader({ dark, onToggleTheme }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="relative z-10 border-b border-slate-200/80 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-[var(--color-dark-surface)]/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 font-extrabold tracking-tight">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-500 text-white">
            <GraduationCap size={18} />
          </span>
          TutorTrack
        </Link>
        <nav className="hidden items-center gap-5 text-sm font-semibold text-slate-500 md:flex dark:text-slate-300">
          <a href="#why">The problem</a>
          <a href="#workflow">How it works</a>
          <a href="#action">Role views</a>
          <Link to="/tutor">Tutor space</Link>
        </nav>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label="Toggle color mode"
            aria-pressed={dark}
            className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 text-slate-500 dark:border-slate-700 dark:text-slate-300"
          >
            {dark ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <Link
            to="/signin"
            className="hidden rounded-xl bg-[var(--color-brand-navy)] px-4 py-2.5 text-sm font-bold text-white sm:inline-flex"
          >
            Sign in
          </Link>
          <Link to="/signup" className="hidden rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-bold text-white sm:inline-flex">Get started</Link>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
            className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 text-slate-500 sm:hidden dark:border-slate-700 dark:text-slate-300"
          >
            {menuOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </div>
      {menuOpen && (
        <nav className="border-t border-slate-200 bg-white px-4 py-3 sm:hidden dark:border-slate-800 dark:bg-[var(--color-dark-surface)]">
          <div className="mx-auto grid max-w-7xl gap-1 text-sm font-semibold text-slate-600 dark:text-slate-300">
            <MobileNavLink href="#why" onClick={() => setMenuOpen(false)}>The problem</MobileNavLink>
            <MobileNavLink href="#workflow" onClick={() => setMenuOpen(false)}>How it works</MobileNavLink>
            <MobileNavLink href="#action" onClick={() => setMenuOpen(false)}>Role views</MobileNavLink>
            <Link to="/tutor" onClick={() => setMenuOpen(false)} className="rounded-xl px-3 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800">Tutor space</Link>
            <div className="mt-2 grid grid-cols-2 gap-2 border-t border-slate-200 pt-3 dark:border-slate-800">
              <Link to="/signin" onClick={() => setMenuOpen(false)} className="rounded-xl border border-slate-200 px-3 py-2.5 text-center dark:border-slate-700">Sign in</Link>
              <Link to="/signup" onClick={() => setMenuOpen(false)} className="rounded-xl bg-emerald-500 px-3 py-2.5 text-center text-white">Get started</Link>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}

function MobileNavLink({ href, onClick, children }) {
  return <a href={href} onClick={onClick} className="rounded-xl px-3 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800">{children}</a>;
}

function Hero() {
  return (
    <section className="relative border-b border-slate-200/80 dark:border-slate-800">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 sm:py-24 lg:grid-cols-[1.15fr_.85fr] lg:items-center lg:px-8 lg:py-28">
        <div className="relative z-10 max-w-2xl">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold uppercase tracking-[.16em] text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
            The calm command centre for tutoring
          </p>
          <h1 className="max-w-2xl text-[clamp(2.5rem,4.5vw,4rem)] font-extrabold leading-[1.08] tracking-tight">
            Replace the notebook, WhatsApp threads, and bank-alert chases
            <span className="text-emerald-500"> with one calm place to run your tutoring practice.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">
            TutorTrack is built for independent WAEC, JAMB, and NECO exam-prep tutors who want less admin and clearer progress for every family.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/tutor"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/20"
            >
              See it in action <ArrowRight size={17} />
            </Link>
            <a
              href="#why"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-bold text-slate-700 dark:border-slate-700 dark:bg-[var(--color-dark-surface)] dark:text-slate-200"
            >
              Why tutors use it
            </a>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-2"><CheckCircle2 className="text-emerald-500" size={16} /> Scheduling</span>
            <span className="inline-flex items-center gap-2"><CheckCircle2 className="text-emerald-500" size={16} /> Assignments</span>
            <span className="inline-flex items-center gap-2"><CheckCircle2 className="text-emerald-500" size={16} /> Parent visibility</span>
          </div>
        </div>
        <HeroPreview />
      </div>
    </section>
  );
}

function HeroPreview() {
  return (
    <div className="relative mx-auto w-full max-w-xl">
      <div className="relative rounded-3xl border border-slate-200 bg-white p-3 shadow-2xl shadow-slate-900/10 dark:border-slate-700 dark:bg-[var(--color-dark-surface)]">
        <div className="rounded-2xl bg-[var(--color-brand-navy)] p-5 text-white sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.16em] text-emerald-300">Tuesday, 15 September</p>
              <p className="mt-2 text-2xl font-extrabold">Good morning, Mr. Adewale.</p>
              <p className="mt-2 text-sm text-slate-300">Here is what needs your attention.</p>
            </div>
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-400 text-[var(--color-brand-navy)]"><GraduationCap size={20} /></span>
          </div>
          <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <PreviewMetric value="4" label="Sessions" />
            <PreviewMetric value="6" label="To grade" />
            <PreviewMetric value="₦84k" label="Outstanding" />
            <PreviewMetric value="24" label="Students" />
          </div>
        </div>
        <div className="grid gap-3 p-2 pt-5 sm:grid-cols-[1.15fr_.85fr] sm:p-4">
          <div className="rounded-2xl border border-slate-100 p-4 dark:border-slate-700">
            <div className="mb-4 flex items-center justify-between"><p className="font-extrabold">Today&apos;s sessions</p><CalendarDays className="text-emerald-500" size={18} /></div>
            <PreviewSession time="4:00 pm" title="Blessing Okafor" detail="Mathematics · Differentiation" />
            <PreviewSession time="5:15 pm" title="SS3 Science group" detail="Chemistry · Electrolysis" />
          </div>
          <div className="rounded-2xl border border-slate-100 p-4 dark:border-slate-700">
            <p className="font-extrabold">Grading queue</p>
            <div className="mt-4 space-y-3">
              <PreviewQueue title="Reading Reflection" status="Draft" />
              <PreviewQueue title="Number Patterns" status="In Review" />
              <PreviewQueue title="Argument Builder" status="Ready" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PreviewMetric({ value, label }) {
  return <div className="rounded-xl bg-white/10 p-3"><p className="text-xl font-extrabold">{value}</p><p className="mt-1 text-[11px] text-slate-300">{label}</p></div>;
}

function PreviewSession({ time, title, detail }) {
  return <div className="flex gap-3 border-t border-slate-100 py-3 first:border-t-0 dark:border-slate-700"><span className="w-14 shrink-0 text-xs font-bold text-slate-500">{time}</span><div><p className="text-sm font-bold">{title}</p><p className="mt-1 text-xs text-slate-500">{detail}</p></div></div>;
}

function PreviewQueue({ title, status }) {
  return <div className="flex items-center justify-between gap-2 rounded-xl bg-slate-50 p-3 dark:bg-slate-800"><p className="min-w-0 truncate text-xs font-bold">{title}</p><span className="shrink-0 rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-bold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">{status}</span></div>;
}

function ProblemSection() {
  return (
    <section id="why" className="bg-white/55 dark:bg-[var(--color-dark-surface)]/45">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <div className="max-w-2xl">
        <p className="text-sm font-bold uppercase tracking-[.16em] text-emerald-600">The admin problem</p>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">A calmer operating rhythm for every tutoring practice.</h2>
        <p className="mt-4 text-slate-600 dark:text-slate-300">TutorTrack gives the scattered parts of your practice a shared home, so the important signals do not get buried.</p>
      </div>
      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {problems.map(({ icon: Icon, title, copy }) => (
          <article key={title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[var(--color-dark-surface)]">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"><Icon size={21} /></span>
            <h3 className="mt-6 text-lg font-extrabold">{title}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{copy}</p>
          </article>
        ))}
      </div>
      </div>
    </section>
  );
}

function WorkflowSection() {
  return (
    <section id="workflow" className="border-y border-slate-200/80 bg-[var(--color-brand-navy)] text-white dark:border-slate-800">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[.16em] text-emerald-300">The TutorTrack loop</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">From a session plan to visible progress.</h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-slate-300">Every part of the weekly tutoring rhythm has a place, so the next action is easy to find.</p>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {workflow.map(({ number, icon: Icon, title, copy }, index) => (
            <article key={number} className="relative border-t border-white/20 pt-5">
              <div className="flex items-center justify-between"><span className="text-sm font-extrabold text-emerald-300">{number}</span><Icon className="text-emerald-300" size={21} /></div>
              <h3 className="mt-8 text-xl font-extrabold">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">{copy}</p>
              {index < workflow.length - 1 && <ArrowRight className="absolute -right-5 top-5 hidden text-white/30 md:block" size={20} />}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function RolePreviewSection() {
  return (
    <section id="action" className="border-y border-slate-200/80 bg-white/60 dark:border-slate-800 dark:bg-slate-950/20">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div className="max-w-2xl"><p className="text-sm font-bold uppercase tracking-[.16em] text-emerald-600">See it in action</p><h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">One practice, three clear views.</h2></div>
          <p className="max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">Explore the live prototype from the perspective of the person using it.</p>
        </div>
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {roles.map((role) => <RoleCard key={role.label} {...role} />)}
        </div>
      </div>
    </section>
  );
}

function RoleCard({ icon: Icon, label, title, copy, href, action, items, accent, preview }) {
  const iconClass = { emerald: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300", sky: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300", orange: "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300" }[accent];
  return (
    <article className="flex flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-900/5 dark:border-slate-700 dark:bg-[var(--color-dark-surface)] dark:shadow-black/20 sm:p-7">
      <div className="flex items-center justify-between"><span className={`grid h-11 w-11 place-items-center rounded-xl ${iconClass}`}><Icon size={21} /></span><span className="text-xs font-bold uppercase tracking-[.16em] text-slate-400">{label} view</span></div>
      <div className="mt-6 rounded-2xl bg-[var(--color-brand-navy)] p-4 text-white">
        <div className="flex items-end justify-between gap-3"><p className="text-2xl font-extrabold">{preview.stat}</p><span className="rounded-full bg-emerald-400/20 px-2 py-1 text-[10px] font-bold text-emerald-200">LIVE PREVIEW</span></div>
        <p className="mt-1 text-xs text-slate-300">{preview.detail}</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-3">{preview.bars.map((bar, index) => <div key={bar} className="rounded-lg bg-white/10 p-2 text-[10px] text-slate-200"><span className={`mb-2 block h-1.5 rounded-full ${index === 0 ? "w-full" : index === 1 ? "w-3/4" : "w-1/2"} bg-emerald-400`} />{bar}</div>)}</div>
      </div>
      <h3 className="mt-6 text-xl font-extrabold">{title}</h3>
      <p className="mt-3 min-h-12 text-sm leading-6 text-slate-600 dark:text-slate-300">{copy}</p>
      <ul className="mt-6 space-y-3 border-t border-slate-100 pt-5 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-300">
        {items.map((item) => <li key={item} className="flex gap-2"><CheckCircle2 className="mt-0.5 shrink-0 text-emerald-500" size={16} />{item}</li>)}
      </ul>
      <Link to={href} className="mt-7 inline-flex items-center justify-between rounded-xl bg-[var(--color-brand-navy)] px-4 py-3 text-sm font-bold text-white">{action}<ArrowRight size={17} /></Link>
    </article>
  );
}

function LandingFooter() {
  return (
    <footer className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
      <div><Link to="/" className="flex items-center gap-2 font-extrabold"><span className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-500 text-white"><GraduationCap size={18} /></span>TutorTrack</Link><p className="mt-3 text-sm text-slate-500 dark:text-slate-400">A clearer way to run independent exam prep.</p></div>
      <form className="flex w-full max-w-md flex-col gap-2 sm:flex-row" onSubmit={(event) => event.preventDefault()}>
        <label className="sr-only" htmlFor="updates-email">Email address</label>
        <div className="relative min-w-0 flex-1"><Mail className="absolute left-3 top-3.5 text-slate-400" size={17} /><input id="updates-email" type="email" placeholder="Your email for product updates" className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-3 text-sm outline-emerald-500 dark:border-slate-700 dark:bg-[var(--color-dark-surface)]" /></div>
        <button type="submit" className="rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-white">Keep me posted</button>
      </form>
    </footer>
  );
}
