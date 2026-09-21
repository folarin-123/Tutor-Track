"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  GraduationCap,
  Mail,
  Menu,
  MessageCircle,
  Moon,
  Sun,
  Users,
} from "lucide-react";
import { useTheme } from "@/lib/theme";
import { FadeIn, FadeUp, FloatCard } from "@/components/motion/Reveal";

const problems = [
  {
    icon: CalendarDays,
    title: "Scheduling lives in your notebook",
    copy: "Keep sessions, changes, and attendance in one calm place instead of chasing a calendar and a chat thread.",
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
    href: "/signin",
    action: "Open tutor space",
    items: [
      "Schedule one off and group sessions",
      "Track assignments, grading, and payments",
      "See each student's progress at a glance",
    ],
  },
  {
    icon: BookOpen,
    label: "Student",
    title: "Know what comes next",
    copy: "Keep sessions, tasks, scores, and tutor messages together in one view.",
    href: "/signin",
    action: "Open student view",
    items: [
      "See upcoming sessions and weekly goals",
      "Submit work and review feedback",
      "Follow syllabus progress and mock scores",
    ],
  },
  {
    icon: Users,
    label: "Parent",
    title: "Stay close without hovering",
    copy: "Get the signal that matters without needing to ask for another update.",
    href: "/signin",
    action: "Open parent portal",
    items: [
      "Review attendance and assignment status",
      "Follow progress and score trends",
      "Check payment history and message the tutor",
    ],
  },
];

export default function LandingPage() {
  const { dark, toggleTheme } = useTheme();

  return (
    <main className="min-h-screen overflow-hidden bg-[var(--bg-page)] text-[var(--text-primary)]">
      <LandingHeader dark={dark} onToggleTheme={toggleTheme} />
      <Hero />
      <ProblemSection />
      <RolePreviewSection />
      <LandingFooter />
    </main>
  );
}

function LandingHeader({ dark, onToggleTheme }) {
  return (
    <header className="relative z-10 border-b border-[var(--border-default)] bg-[var(--bg-surface)]/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-extrabold tracking-tight">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-primary-500 text-white">
            <GraduationCap size={18} />
          </span>
          TutorTrack
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-semibold text-[var(--text-secondary)] md:flex">
          <a href="#why">Why TutorTrack</a>
          <a href="#action">See it in action</a>
        </nav>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label="Toggle color mode"
            aria-pressed={dark}
            className="grid h-9 w-9 place-items-center rounded-full border border-[var(--border-default)] text-[var(--text-secondary)]"
          >
            {dark ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <Link
            href="/signin"
            className="hidden rounded-full border border-[var(--border-default)] px-4 py-2.5 text-sm font-bold sm:inline-flex"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="hidden rounded-full bg-primary-500 px-4 py-2.5 text-sm font-bold text-white sm:inline-flex"
          >
            Get started
          </Link>
          <Menu className="text-[var(--text-muted)] sm:hidden" size={20} aria-hidden="true" />
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative border-b border-[var(--border-default)]">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 sm:py-24 lg:grid-cols-[1.1fr_.9fr] lg:items-center lg:px-8 lg:py-28">
        <div className="relative z-10 max-w-2xl">
          <FadeUp>
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-3 py-1.5 text-xs font-bold uppercase tracking-[.16em] text-primary-700">
              The calm command centre for tutoring
            </p>
          </FadeUp>
          <FadeUp delay={0.08}>
            <h1 className="max-w-2xl text-[clamp(2.5rem,4.5vw,4rem)] font-extrabold leading-[1.08] tracking-tight">
              Replace the notebook, chat threads, and payment chases
              <span className="text-primary-500"> with one calm place to run your tutoring practice.</span>
            </h1>
          </FadeUp>
          <FadeUp delay={0.16}>
            <p className="mt-6 max-w-xl text-base leading-7 text-[var(--text-secondary)] sm:text-lg">
              TutorTrack is built for independent exam prep tutors who want less admin and clearer progress for every family.
            </p>
          </FadeUp>
          <FadeUp delay={0.24}>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary-500 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary-500/20"
              >
                Get started <ArrowRight size={17} />
              </Link>
              <a
                href="#why"
                className="inline-flex items-center justify-center rounded-full border border-[var(--border-default)] bg-[var(--bg-surface)] px-5 py-3.5 text-sm font-bold"
              >
                Why tutors use it
              </a>
            </div>
          </FadeUp>
          <FadeUp delay={0.3}>
            <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-[var(--text-secondary)]">
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="text-primary-500" size={16} /> Scheduling
              </span>
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="text-primary-500" size={16} /> Assignments
              </span>
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="text-primary-500" size={16} /> Parent visibility
              </span>
            </div>
          </FadeUp>
        </div>
        <HeroPhoto />
      </div>
    </section>
  );
}

function HeroPhoto() {
  return (
    <FloatCard className="relative mx-auto w-full max-w-xl">
      <div className="overflow-hidden rounded-[2rem] border border-[var(--border-default)] bg-[var(--bg-surface)] p-3 shadow-2xl shadow-black/10">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-primary-100">
          <PhotoWithFallback
            src="https://picsum.photos/id/1005/900/1100"
            alt="A tutor and student working through a lesson together"
            sizes="(min-width: 1024px) 480px, 90vw"
            priority
          />
          <div className="absolute inset-x-4 bottom-4 rounded-2xl bg-black/55 p-4 text-white backdrop-blur">
            <p className="text-xs font-bold uppercase tracking-[.16em] text-primary-200">
              Live session
            </p>
            <p className="mt-1 text-sm font-semibold">Mathematics, differentiation</p>
          </div>
        </div>
      </div>
    </FloatCard>
  );
}

function PhotoWithFallback({ src, alt, sizes, priority }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-primary-200 via-primary-100 to-primary-300" />
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      className="object-cover"
      priority={priority}
      onError={() => setFailed(true)}
    />
  );
}

function ProblemSection() {
  return (
    <section id="why" className="bg-[var(--bg-surface)]/50">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <FadeUp className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[.16em] text-primary-600">
            The admin problem
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
            A calmer operating rhythm for every tutoring practice.
          </h2>
          <p className="mt-4 text-[var(--text-secondary)]">
            TutorTrack gives the scattered parts of your practice a shared home, so the important signals do not get buried.
          </p>
        </FadeUp>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {problems.map(({ icon: Icon, title, copy }, index) => (
            <FadeUp key={title} delay={index * 0.08}>
              <article className="h-full rounded-3xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-6 shadow-sm">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-primary-100 text-primary-700">
                  <Icon size={21} />
                </span>
                <h3 className="mt-6 text-lg font-extrabold">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">{copy}</p>
              </article>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

const rolePhotos = {
  Tutor: "https://picsum.photos/id/1074/700/500",
  Student: "https://picsum.photos/id/1062/700/500",
  Parent: "https://picsum.photos/id/1027/700/500",
};

function RolePreviewSection() {
  return (
    <section id="action" className="border-y border-[var(--border-default)] bg-[var(--bg-surface)]/40">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <FadeUp className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[.16em] text-primary-600">
              See it in action
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
              One practice, three clear views.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-[var(--text-secondary)]">
            Create an account and explore the space built for you.
          </p>
        </FadeUp>
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {roles.map((role, index) => (
            <FadeUp key={role.label} delay={index * 0.1}>
              <RoleCard {...role} />
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

function RoleCard({ icon: Icon, label, title, copy, href, action, items }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-[var(--border-default)] bg-[var(--bg-surface)] shadow-lg shadow-black/5">
      <div className="relative h-40 w-full bg-primary-100">
        <PhotoWithFallback
          src={rolePhotos[label]}
          alt={`${label} using TutorTrack`}
          sizes="(min-width: 1024px) 360px, 90vw"
        />
      </div>
      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <div className="flex items-center justify-between">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-primary-100 text-primary-700">
            <Icon size={21} />
          </span>
          <span className="text-xs font-bold uppercase tracking-[.16em] text-[var(--text-muted)]">
            {label} view
          </span>
        </div>
        <h3 className="mt-6 text-xl font-extrabold">{title}</h3>
        <p className="mt-3 min-h-12 text-sm leading-6 text-[var(--text-secondary)]">{copy}</p>
        <ul className="mt-6 space-y-3 border-t border-[var(--border-default)] pt-5 text-sm text-[var(--text-secondary)]">
          {items.map((item) => (
            <li key={item} className="flex gap-2">
              <CheckCircle2 className="mt-0.5 shrink-0 text-primary-500" size={16} />
              {item}
            </li>
          ))}
        </ul>
        <Link
          href={href}
          className="mt-7 inline-flex items-center justify-between rounded-full bg-primary-500 px-4 py-3 text-sm font-bold text-white"
        >
          {action}
          <ArrowRight size={17} />
        </Link>
      </div>
    </article>
  );
}

function LandingFooter() {
  return (
    <FadeIn>
      <footer className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <Link href="/" className="flex items-center gap-2 font-extrabold">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-primary-500 text-white">
              <GraduationCap size={18} />
            </span>
            TutorTrack
          </Link>
          <p className="mt-3 text-sm text-[var(--text-secondary)]">
            A clearer way to run independent exam prep.
          </p>
        </div>
        <form
          className="flex w-full max-w-md flex-col gap-2 sm:flex-row"
          onSubmit={(event) => event.preventDefault()}
        >
          <label className="sr-only" htmlFor="updates-email">
            Email address
          </label>
          <div className="relative min-w-0 flex-1">
            <Mail className="absolute left-4 top-3.5 text-[var(--text-muted)]" size={17} />
            <input
              id="updates-email"
              type="email"
              placeholder="Your email for product updates"
              className="w-full rounded-full border border-[var(--border-default)] bg-[var(--bg-surface)] py-3 pl-11 pr-3 text-sm outline-primary-500"
            />
          </div>
          <button
            type="submit"
            className="rounded-full bg-primary-500 px-4 py-3 text-sm font-bold text-white"
          >
            Keep me posted
          </button>
        </form>
      </footer>
    </FadeIn>
  );
}
