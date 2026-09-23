"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Check,
  ClipboardCheck,
  GraduationCap,
  LineChart,
  Menu,
  MessageCircle,
  Moon,
  Sun,
  Users,
  Wallet,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useTheme } from "@/lib/theme";
import { FadeIn, FadeUp, FloatCard } from "@/components/motion/Reveal";

const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#tutors", label: "For Tutors" },
  { href: "#students", label: "For Students" },
  { href: "#parents", label: "For Parents" },
];

export default function LandingPage() {
  const { dark, toggleTheme } = useTheme();
  return (
    <main className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)]">
      <LandingHeader dark={dark} onToggleTheme={toggleTheme} />
      <Hero />
      <ValueStrip />
      <ProblemSection />
      <FeaturesSection />
      <HowItWorks />
      <RolesSection />
      <MessagingSection />
      <FinalCta />
      <LandingFooter />
    </main>
  );
}

function LandingHeader({ dark, onToggleTheme }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border-default)] bg-[var(--bg-surface)]/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 text-sm font-semibold tracking-tight">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary-500 text-white">
            <GraduationCap size={16} />
          </span>
          TutorTrack
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-[var(--text-secondary)] lg:flex">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="transition hover:text-[var(--text-primary)]">
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label="Toggle color mode"
            aria-pressed={dark}
            className="grid h-9 w-9 place-items-center rounded-lg border border-[var(--border-default)] text-[var(--text-secondary)]"
          >
            {dark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <Link
            to="/signin"
            className="hidden rounded-lg px-3 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] sm:inline-flex"
          >
            Sign in
          </Link>
          <Link
            to="/signup"
            className="hidden rounded-lg bg-primary-500 px-3.5 py-2 text-sm font-medium text-white hover:bg-primary-600 sm:inline-flex"
          >
            Get started
          </Link>
          <button
            type="button"
            className="grid h-9 w-9 place-items-center rounded-lg text-[var(--text-secondary)] lg:hidden"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
          >
            <Menu size={18} />
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 lg:hidden"
            onClick={() => setOpen(false)}
          >
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 280 }}
              onClick={(event) => event.stopPropagation()}
              className="absolute right-0 top-0 flex h-full w-[min(20rem,86vw)] flex-col bg-[var(--bg-surface)] p-5 shadow-xl"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">Menu</p>
                <button type="button" aria-label="Close menu" onClick={() => setOpen(false)}>
                  <X size={18} />
                </button>
              </div>
              <nav className="mt-8 flex flex-col gap-4 text-sm">
                {navLinks.map((link) => (
                  <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
                    {link.label}
                  </a>
                ))}
              </nav>
              <div className="mt-auto grid gap-2">
                <Link to="/signin" className="rounded-lg border border-[var(--border-default)] px-4 py-2.5 text-center text-sm">
                  Sign in
                </Link>
                <Link to="/signup" className="rounded-lg bg-primary-500 px-4 py-2.5 text-center text-sm font-medium text-white">
                  Get started
                </Link>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(47,95,151,0.12),transparent_55%)]" />
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_.95fr] lg:py-24">
        <div>
          <FadeUp>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-primary-600">
              Tutoring operations, in one place
            </p>
          </FadeUp>
          <FadeUp delay={0.06}>
            <h1 className="mt-4 max-w-xl text-[clamp(2rem,4vw,3.35rem)] font-semibold leading-[1.12] tracking-tight">
              Everything your tutoring practice needs, in one place.
            </h1>
          </FadeUp>
          <FadeUp delay={0.12}>
            <p className="mt-5 max-w-lg text-[15px] leading-7 text-[var(--text-secondary)]">
              Manage students, schedules, assignments, payments and conversations without switching between notebooks, spreadsheets and chat apps.
            </p>
          </FadeUp>
          <FadeUp delay={0.18}>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 rounded-xl bg-primary-500 px-5 py-2.5 text-sm font-medium text-white shadow-sm shadow-primary-500/20 hover:bg-primary-600"
              >
                Get started <ArrowRight size={16} />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)] px-5 py-2.5 text-sm font-medium"
              >
                See how it works
              </a>
            </div>
          </FadeUp>
        </div>
        <FloatCard>
          <ProductPreview />
        </FloatCard>
      </div>
    </section>
  );
}

function ProductPreview() {
  return (
    <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-3 shadow-sm">
      <div className="rounded-xl bg-[var(--bg-page)] p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-[var(--text-secondary)]">Today</p>
            <p className="text-sm font-semibold">Practice overview</p>
          </div>
          <span className="rounded-md bg-primary-100 px-2 py-1 text-[11px] font-medium text-primary-700">Live preview</span>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <PreviewCard label="Upcoming session" value="Quadratic equations" detail="Thu · 16:00–17:00" />
          <PreviewCard label="Student progress" value="Amara · 80 avg" detail="Three graded assignments" />
          <PreviewCard label="Assignment status" value="2 ready to grade" detail="Submitted this week" />
          <PreviewCard label="Payment status" value="$220 due" detail="September tuition" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-3 flex items-start gap-3 rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-3"
        >
          <span className="mt-0.5 grid h-8 w-8 place-items-center rounded-full bg-primary-100 text-xs font-semibold text-primary-700">
            AO
          </span>
          <div>
            <p className="text-xs font-medium">Amara Okafor</p>
            <p className="mt-0.5 text-xs leading-5 text-[var(--text-secondary)]">
              I had a question on question 4 of the algebra practice set.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function PreviewCard({ label, value, detail }) {
  return (
    <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-3">
      <p className="text-[11px] text-[var(--text-secondary)]">{label}</p>
      <p className="mt-1 text-sm font-semibold">{value}</p>
      <p className="mt-1 text-[11px] text-[var(--text-muted)]">{detail}</p>
    </div>
  );
}

function ValueStrip() {
  const items = [
    { icon: CalendarDays, label: "Scheduling" },
    { icon: ClipboardCheck, label: "Assignments" },
    { icon: LineChart, label: "Progress tracking" },
    { icon: Wallet, label: "Payments" },
    { icon: MessageCircle, label: "Messaging" },
  ];
  return (
    <section className="border-y border-[var(--border-default)] bg-[var(--bg-surface)]">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-5 sm:px-6">
        {items.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
            <Icon size={16} className="text-primary-500" />
            {label}
          </div>
        ))}
      </div>
    </section>
  );
}

function ProblemSection() {
  const problems = [
    "Sessions scattered across calendars and chats",
    "Assignments lost inside conversations",
    "Parents asking repeatedly for progress updates",
    "Payment tracking being manual",
    "Communication split between multiple apps",
  ];
  return (
    <section id="features" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
        <FadeUp>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-primary-600">The problem</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">Tutoring work is simple. The admin around it is not.</h2>
          <ul className="mt-6 space-y-3">
            {problems.map((item) => (
              <li key={item} className="flex gap-3 text-sm leading-6 text-[var(--text-secondary)]">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-400" />
                {item}
              </li>
            ))}
          </ul>
        </FadeUp>
        <FadeUp delay={0.08}>
          <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-6 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-primary-600">The solution</p>
            <h3 className="mt-3 text-xl font-semibold">TutorTrack centralizes the practice.</h3>
            <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
              One workspace for the session, the assignment, the score, the invoice, and the conversation. Tutors keep the teaching. Families get a clear view without another status request.
            </p>
            <div className="mt-6 grid gap-2 text-sm">
              {["Shared schedule", "Visible assignment status", "Progress charts", "In-app messaging"].map((item) => (
                <p key={item} className="flex items-center gap-2">
                  <Check size={15} className="text-primary-500" /> {item}
                </p>
              ))}
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    { icon: CalendarDays, title: "Smart scheduling", copy: "Keep one-off and recurring sessions in a single calendar instead of chasing chat confirmations." },
    { icon: ClipboardCheck, title: "Assignment management", copy: "Assign work, collect submissions, and record scores without hunting through old threads." },
    { icon: LineChart, title: "Progress tracking", copy: "See how scores move over time so the next lesson is based on evidence, not guesswork." },
    { icon: Wallet, title: "Payment tracking", copy: "Record what is due, mark what is paid, and keep a simple history for each family." },
    { icon: MessageCircle, title: "Tutor/student messaging", copy: "Talk in real time inside TutorTrack, with a separate thread when a parent needs to join." },
    { icon: Users, title: "Parent visibility", copy: "Give families a read-clear view of sessions, assignments, and progress without extra updates." },
  ];
  return (
    <section className="border-y border-[var(--border-default)] bg-[var(--bg-surface)]/60">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <FadeUp className="max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-primary-600">Product</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">The tools a tutoring practice actually uses.</h2>
        </FadeUp>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, copy }, index) => (
            <FadeUp key={title} delay={index * 0.05}>
              <article className="h-full rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary-100 text-primary-700">
                  <Icon size={18} />
                </span>
                <h3 className="mt-4 text-base font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{copy}</p>
              </article>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { n: "01", title: "Create your tutoring space", copy: "Sign up as a tutor, student, or parent and land in a workspace built for that role." },
    { n: "02", title: "Add students and organize learning", copy: "Bring the roster, sessions, and assignments into one place so the week is visible." },
    { n: "03", title: "Communicate, track progress and manage payments", copy: "Message in real time, record scores, and keep payment status next to the work." },
  ];
  return (
    <section id="how-it-works" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <FadeUp>
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-primary-600">How it works</p>
        <h2 className="mt-3 max-w-xl text-3xl font-semibold tracking-tight">A quieter path from first student to a running practice.</h2>
      </FadeUp>
      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {steps.map((step, index) => (
          <FadeUp key={step.n} delay={index * 0.08}>
            <div className="relative h-full rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-6">
              <p className="text-sm font-medium text-primary-500">{step.n}</p>
              <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
              <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">{step.copy}</p>
            </div>
          </FadeUp>
        ))}
      </div>
    </section>
  );
}

function RolesSection() {
  const roles = [
    { id: "tutors", icon: GraduationCap, label: "Tutor", title: "Run your entire tutoring practice.", items: ["Schedule and roster", "Grade assignments", "Message students and parents"] },
    { id: "students", icon: BookOpen, label: "Student", title: "Know exactly what to learn and what comes next.", items: ["Upcoming sessions", "Assignment status", "Direct tutor chat"] },
    { id: "parents", icon: Users, label: "Parent", title: "Stay informed without constantly asking for updates.", items: ["Progress charts", "Payment status", "A dedicated tutor thread"] },
  ];
  return (
    <section className="border-y border-[var(--border-default)] bg-[var(--bg-surface)]/50">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <FadeUp>
          <h2 className="text-3xl font-semibold tracking-tight">Three roles. One shared source of truth.</h2>
        </FadeUp>
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {roles.map((role, index) => (
            <FadeUp key={role.label} delay={index * 0.08}>
              <article id={role.id} className="h-full rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-5 shadow-sm">
                <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                  <role.icon size={16} className="text-primary-600" />
                  {role.label}
                </div>
                <h3 className="mt-4 text-lg font-semibold">{role.title}</h3>
                <div className="mt-5 rounded-xl bg-[var(--bg-page)] p-4">
                  <p className="text-[11px] uppercase tracking-wider text-[var(--text-muted)]">{role.label} preview</p>
                  <ul className="mt-3 space-y-2 text-sm text-[var(--text-secondary)]">
                    {role.items.map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary-400" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

function MessagingSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <FadeUp>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-primary-600">Messaging</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">Talk to your tutor without leaving TutorTrack.</h2>
          <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">
            Real-time conversations between tutors and students, with a separate parent thread when a family needs to be involved. Messages stay with the practice, not in a private chat history nobody else can find.
          </p>
        </FadeUp>
        <FadeUp delay={0.1}>
          <div className="overflow-hidden rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] shadow-sm">
            <div className="grid sm:grid-cols-[13rem_minmax(0,1fr)]">
              <div className="border-b border-[var(--border-default)] p-3 sm:border-b-0 sm:border-r">
                <p className="px-2 text-[11px] font-medium uppercase tracking-wider text-[var(--text-muted)]">Inbox</p>
                <div className="mt-2 flex items-center gap-2 rounded-lg bg-primary-50 p-2">
                  <span className="relative grid h-8 w-8 place-items-center rounded-full bg-primary-100 text-[11px] font-semibold text-primary-700">
                    AO
                    <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-success-500 ring-2 ring-[var(--bg-surface)]" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold">Amara Okafor</p>
                    <p className="truncate text-[11px] text-[var(--text-secondary)]">Question on question 4…</p>
                  </div>
                  <span className="ml-auto rounded-full bg-primary-500 px-1.5 text-[10px] text-white">1</span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 border-b border-[var(--border-default)] pb-3">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-primary-100 text-[11px] font-semibold text-primary-700">AO</span>
                  <div>
                    <p className="text-sm font-semibold">Amara Okafor</p>
                    <p className="text-[11px] text-[var(--text-secondary)]">Student thread</p>
                  </div>
                </div>
                <div className="mt-4 space-y-3">
                  <div className="max-w-[80%] rounded-2xl rounded-bl-md bg-[var(--bg-surface-muted)] px-3 py-2 text-xs leading-5">
                    I had a question on question 4 of the algebra practice set.
                    <p className="mt-1 text-[10px] text-[var(--text-muted)]">2h ago</p>
                  </div>
                  <div className="ml-auto max-w-[80%] rounded-2xl rounded-br-md bg-primary-500 px-3 py-2 text-xs leading-5 text-white">
                    Let’s review the quadratic formula together in our next session.
                    <p className="mt-1 text-[10px] text-primary-100">1h ago</p>
                  </div>
                </div>
                <div className="mt-4 rounded-xl border border-[var(--border-default)] px-3 py-2 text-xs text-[var(--text-muted)]">
                  Write a message
                </div>
              </div>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="border-y border-[var(--border-default)] bg-primary-900 text-white">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 py-16 sm:px-6 lg:flex-row lg:items-center">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">Give your tutoring practice a calmer workflow.</h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-primary-100">
            Create a space for tutors, students, and parents to share the same schedule, scores, and conversations.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to="/signup" className="rounded-xl bg-white px-5 py-2.5 text-sm font-medium text-primary-900">
            Get started
          </Link>
          <Link to="/signin" className="rounded-xl border border-white/20 px-5 py-2.5 text-sm font-medium text-white">
            Sign in
          </Link>
        </div>
      </div>
    </section>
  );
}

function LandingFooter() {
  return (
    <FadeIn>
      <footer className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-1">
          <Link to="/" className="flex items-center gap-2 text-sm font-semibold">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary-500 text-white">
              <GraduationCap size={16} />
            </span>
            TutorTrack
          </Link>
          <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
            A quieter operating system for independent tutoring.
          </p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]">Product</p>
          <div className="mt-3 grid gap-2 text-sm">
            <a href="#features">Features</a>
            <a href="#how-it-works">How it works</a>
          </div>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]">Roles</p>
          <div className="mt-3 grid gap-2 text-sm">
            <a href="#tutors">For Tutors</a>
            <a href="#students">For Students</a>
            <a href="#parents">For Parents</a>
          </div>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]">Account</p>
          <div className="mt-3 grid gap-2 text-sm">
            <Link to="/signin">Sign in</Link>
            <Link to="/signup">Get started</Link>
          </div>
        </div>
      </footer>
    </FadeIn>
  );
}
