import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  CalendarDays,
  CheckCircle2,
  CheckSquare,
  Clock,
  FileText,
  GraduationCap,
  Mail,
  Menu,
  MessageCircle,
  Moon,
  ShieldCheck,
  Sparkles,
  Sun,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { useTheme } from "@/lib/theme";
import { FadeIn, FadeUp, FloatCard } from "@/components/motion/Reveal";

const problems = [
  {
    icon: CalendarDays,
    title: "Centralized Scheduling",
    copy: "Manage all recurring, group, and 1-on-1 sessions without fragmented calendar invites or endless chat threads.",
  },
  {
    icon: FileText,
    title: "Streamlined Homework Hub",
    copy: "Assign practice sheets, track submissions, and deliver actionable feedback with zero clutter.",
  },
  {
    icon: Users,
    title: "Automated Parent Transparency",
    copy: "Give parents direct real-time visibility into student attendance, progress, and payment status.",
  },
];

const features = [
  {
    icon: Calendar,
    title: "Smart Calendar & Reminders",
    description: "Automated session reminders reduce no-shows and keep tutors and families synchronized.",
  },
  {
    icon: CheckSquare,
    title: "Assignment Tracking & Grading",
    description: "Keep past exam papers, essays, and mock test scores organized with rubric feedback.",
  },
  {
    icon: TrendingUp,
    title: "Progress Analytics",
    description: "Visualize grade improvements and syllabus completion over time for every student.",
  },
  {
    icon: ShieldCheck,
    title: "Payment & Invoice Tracking",
    description: "Track paid and pending session balances seamlessly without awkward follow-up chats.",
  },
];

const roles = [
  {
    icon: GraduationCap,
    label: "Tutor",
    badge: "Command Center",
    title: "Run your practice with complete clarity",
    copy: "An all-in-one workspace built to simplify lesson prep, scheduling, grading, and client communication.",
    href: "/signin",
    action: "Open Tutor Workspace",
    items: [
      "Schedule 1-on-1 and group exam prep sessions",
      "Assign, grade, and organize past paper practice",
      "Monitor individual progress and log payments",
    ],
  },
  {
    icon: BookOpen,
    label: "Student",
    badge: "Learning Portal",
    title: "Know exactly what to do next",
    copy: "Stay on top of upcoming lessons, active tasks, study materials, and direct feedback from your tutor.",
    href: "/signin",
    action: "Open Student View",
    items: [
      "View weekly timetable and lesson join links",
      "Submit homework assignments and review feedback",
      "Track syllabus progress and mock exam target scores",
    ],
  },
  {
    icon: Users,
    label: "Parent",
    badge: "Parent Portal",
    title: "Stay updated with peace of mind",
    copy: "Get clear insights into attendance, progress reports, and tuition statements without needing to ask.",
    href: "/signin",
    action: "Open Parent Portal",
    items: [
      "Review attendance records and lesson summaries",
      "Track score trajectory and milestone achievements",
      "Check payment invoices and message the tutor directly",
    ],
  },
];

export default function LandingPage() {
  const { dark, toggleTheme } = useTheme();
  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)] antialiased transition-colors duration-200">
      <LandingHeader dark={dark} onToggleTheme={toggleTheme} />
      <main>
        <Hero />
        <ProblemSection />
        <FeatureHighlightsSection />
        <MessagingSection />
        <RolePreviewSection />
      </main>
      <LandingFooter />
    </div>
  );
}

function LandingHeader({ dark, onToggleTheme }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border-default)] bg-[var(--bg-surface)]/85 backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="group flex items-center gap-2.5 font-bold tracking-tight text-lg">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary-500 text-white shadow-sm shadow-primary-500/20 group-hover:bg-primary-600 transition-colors">
            <GraduationCap size={20} />
          </span>
          <span className="text-[var(--text-primary)]">
            Tutor<span className="text-primary-500">Track</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-semibold text-[var(--text-secondary)] md:flex">
          <a href="#why" className="hover:text-primary-500 transition-colors">
            Why TutorTrack
          </a>
          <a href="#features" className="hover:text-primary-500 transition-colors">
            Features
          </a>
          <a href="#messaging" className="hover:text-primary-500 transition-colors">
            Messaging
          </a>
          <a href="#action" className="hover:text-primary-500 transition-colors">
            Role Portals
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label="Toggle color mode"
            aria-pressed={dark}
            className="grid h-9 w-9 place-items-center rounded-lg border border-[var(--border-default)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-strong)] bg-[var(--bg-surface)] transition-all cursor-pointer"
          >
            {dark ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <Link
            to="/signin"
            className="hidden rounded-lg px-4 py-2 text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-muted)] transition-all sm:inline-flex"
          >
            Sign in
          </Link>
          <Link
            to="/signup"
            className="hidden rounded-lg bg-primary-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-600 transition-all sm:inline-flex"
          >
            Get started
          </Link>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="grid h-9 w-9 place-items-center rounded-lg border border-[var(--border-default)] text-[var(--text-secondary)] sm:hidden"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile navigation drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-[var(--border-default)] bg-[var(--bg-surface)] px-4 py-4 sm:hidden">
          <div className="flex flex-col gap-3 font-semibold text-sm text-[var(--text-secondary)]">
            <a
              href="#why"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-[var(--bg-surface-muted)]"
            >
              Why TutorTrack
            </a>
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-[var(--bg-surface-muted)]"
            >
              Features
            </a>
            <a
              href="#messaging"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-[var(--bg-surface-muted)]"
            >
              Messaging
            </a>
            <a
              href="#action"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-[var(--bg-surface-muted)]"
            >
              Role Portals
            </a>
            <hr className="border-[var(--border-default)] my-1" />
            <div className="flex flex-col gap-2 pt-1">
              <Link
                to="/signin"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center rounded-lg border border-[var(--border-default)] py-2 font-semibold text-[var(--text-primary)]"
              >
                Sign in
              </Link>
              <Link
                to="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center rounded-lg bg-primary-500 py-2 font-semibold text-white shadow-sm"
              >
                Get started
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section className="relative border-b border-[var(--border-default)] overflow-hidden lg:min-h-[calc(100vh-4rem)] lg:max-h-[820px] lg:flex lg:items-center py-12 lg:py-0">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
          {/* Left Column: Text & CTA */}
          <div className="lg:col-span-6 max-w-2xl">
            <FadeUp>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50/80 px-3 py-1 text-xs font-semibold text-primary-700 dark:border-primary-800/60 dark:bg-primary-950/40 dark:text-primary-300">
                <Sparkles size={13} className="text-primary-500" />
                <span>The Modern Platform for Independent Tutors</span>
              </div>
            </FadeUp>

            <FadeUp delay={0.06}>
              <h1
                className="mt-4 font-extrabold tracking-tight text-[var(--text-primary)] leading-[1.15]"
                style={{ fontSize: "clamp(1.9rem, 3.4vw, 3.25rem)" }}
              >
                Organize your sessions, assignments, and parents{" "}
                <span className="text-primary-500">in one calm command center.</span>
              </h1>
            </FadeUp>

            <FadeUp delay={0.12}>
              <p className="mt-4 text-base leading-relaxed text-[var(--text-secondary)] sm:text-lg">
                TutorTrack unites scheduling, homework tracking, progress reports, and parent communications into a single streamlined workspace.
              </p>
            </FadeUp>

            <FadeUp delay={0.18}>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-500 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-primary-500/20 hover:bg-primary-600 transition-all cursor-pointer"
                >
                  Start free trial <ArrowRight size={16} />
                </Link>
                <a
                  href="#why"
                  className="inline-flex items-center justify-center rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface)] px-5 py-3 text-sm font-semibold text-[var(--text-primary)] hover:bg-[var(--bg-surface-muted)] transition-all"
                >
                  See how it works
                </a>
              </div>
            </FadeUp>

            <FadeUp delay={0.24}>
              <div className="mt-8 pt-6 border-t border-[var(--border-default)] grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xl font-bold text-[var(--text-primary)]">100%</p>
                  <p className="text-xs text-[var(--text-secondary)]">Clarity for families</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-[var(--text-primary)]">0</p>
                  <p className="text-xs text-[var(--text-secondary)]">Spreadsheet headaches</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-[var(--text-primary)]">3-in-1</p>
                  <p className="text-xs text-[var(--text-secondary)]">Tutor, Student, Parent</p>
                </div>
              </div>
            </FadeUp>
          </div>

          {/* Right Column: High-fidelity SaaS UI Mockup Card */}
          <div className="lg:col-span-6">
            <FloatCard className="w-full">
              <HeroDashboardPreview />
            </FloatCard>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroDashboardPreview() {
  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] shadow-2xl shadow-black/10">
      {/* Mockup Window Titlebar */}
      <div className="flex items-center justify-between border-b border-[var(--border-default)] bg-[var(--bg-surface-muted)] px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-red-400/80"></span>
          <span className="h-3 w-3 rounded-full bg-amber-400/80"></span>
          <span className="h-3 w-3 rounded-full bg-emerald-400/80"></span>
          <span className="ml-2 text-xs font-semibold text-[var(--text-muted)]">
            TutorTrack • Workspace
          </span>
        </div>
        <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          • Live Practice
        </span>
      </div>

      {/* Mockup Workspace Body */}
      <div className="p-4 sm:p-5 space-y-4 text-xs sm:text-sm">
        {/* Next Session Highlight */}
        <div className="rounded-xl border border-primary-200 bg-primary-50/60 p-3.5 dark:border-primary-800/40 dark:bg-primary-950/30">
          <div className="flex items-center justify-between mb-2">
            <span className="inline-flex items-center gap-1.5 font-bold text-primary-700 dark:text-primary-300 text-xs">
              <Clock size={14} /> UPCOMING SESSION
            </span>
            <span className="rounded bg-primary-500/15 px-2 py-0.5 text-[11px] font-semibold text-primary-700 dark:text-primary-300">
              In 20 mins
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-[var(--text-primary)] text-sm sm:text-base">
                A-Level Maths • Pure Calculus
              </p>
              <p className="text-[var(--text-secondary)] text-xs">Student: Alex M. (SS3)</p>
            </div>
            <button
              type="button"
              className="rounded-lg bg-primary-500 px-3 py-1.5 font-semibold text-white text-xs shadow-sm"
            >
              Start Session
            </button>
          </div>
        </div>

        {/* Dashboard Quick Widgets Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Assignment Widget */}
          <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-3">
            <div className="flex items-center justify-between text-xs text-[var(--text-muted)] mb-1">
              <span>Pending Grading</span>
              <FileText size={14} className="text-primary-500" />
            </div>
            <p className="font-bold text-[var(--text-primary)] text-sm">Integration Worksheet #3</p>
            <div className="mt-2 flex items-center justify-between text-[11px]">
              <span className="text-[var(--text-secondary)]">Submitted by Sarah K.</span>
              <span className="rounded bg-amber-500/10 px-1.5 py-0.5 font-semibold text-amber-600 dark:text-amber-400">
                Needs review
              </span>
            </div>
          </div>

          {/* Student Progress Widget */}
          <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-3">
            <div className="flex items-center justify-between text-xs text-[var(--text-muted)] mb-1">
              <span>Class Performance</span>
              <TrendingUp size={14} className="text-emerald-500" />
            </div>
            <p className="font-bold text-[var(--text-primary)] text-sm">Avg Mock Score</p>
            <div className="mt-2 flex items-center justify-between text-[11px]">
              <span className="font-bold text-emerald-600 dark:text-emerald-400">88% (+12% term)</span>
              <span className="text-[var(--text-muted)]">12 Students</span>
            </div>
          </div>
        </div>

        {/* Parent Activity Strip */}
        <div className="flex items-center justify-between rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface-muted)] p-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300">
              <Users size={13} />
            </span>
            <span className="text-[var(--text-secondary)] font-medium">
              Weekly progress report automatically delivered to parents
            </span>
          </div>
          <span className="font-semibold text-primary-500 hover:underline cursor-pointer">
            View report
          </span>
        </div>
      </div>
    </div>
  );
}

function ProblemSection() {
  return (
    <section id="why" className="border-b border-[var(--border-default)] bg-[var(--bg-surface-muted)]/40 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeUp className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
            Designed for Modern Tutors
          </p>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-[var(--text-primary)] sm:text-3xl lg:text-4xl">
            Everything your practice needs, without the clutter
          </h2>
          <p className="mt-3 text-base text-[var(--text-secondary)]">
            Stop relying on messaging apps, notebook notes, and scattered spreadsheets. TutorTrack keeps your practice organized in one professional interface.
          </p>
        </FadeUp>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {problems.map(({ icon: Icon, title, copy }, index) => (
            <FadeUp key={title} delay={index * 0.08}>
              <article className="group h-full rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-6 shadow-sm hover:shadow-md hover:border-primary-300 transition-all">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary-100 text-primary-700 dark:bg-primary-950/60 dark:text-primary-300 group-hover:bg-primary-500 group-hover:text-white transition-colors">
                  <Icon size={20} />
                </span>
                <h3 className="mt-5 text-lg font-bold text-[var(--text-primary)]">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">{copy}</p>
              </article>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureHighlightsSection() {
  return (
    <section id="features" className="border-b border-[var(--border-default)] py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeUp className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
            Core Capabilities
          </p>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-[var(--text-primary)] sm:text-3xl lg:text-4xl">
            Built to keep students focused and parents confident
          </h2>
        </FadeUp>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, description }, index) => (
            <FadeUp key={title} delay={index * 0.06}>
              <div className="h-full rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-5 hover:border-[var(--border-strong)] transition-all">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary-600 dark:bg-primary-950/50 dark:text-primary-300">
                  <Icon size={18} />
                </div>
                <h3 className="mt-4 text-base font-bold text-[var(--text-primary)]">{title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-[var(--text-secondary)]">
                  {description}
                </p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

function MessagingSection() {
  return (
    <section id="messaging" className="border-b border-[var(--border-default)] bg-[var(--bg-surface-muted)]/20 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <FadeUp>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50/80 px-3 py-1 text-xs font-semibold text-primary-700 dark:border-primary-800/60 dark:bg-primary-950/40 dark:text-primary-300">
              <MessageCircle size={14} className="text-primary-500" />
              <span>In-App Messaging</span>
            </div>
            <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-[var(--text-primary)] sm:text-3xl lg:text-4xl">
              Talk to your tutor without leaving TutorTrack.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[var(--text-secondary)] sm:text-base">
              Real-time conversations between tutors and students, with a separate parent thread when a family needs to be involved. Messages stay with the practice, not in a private chat history nobody else can find.
            </p>
          </FadeUp>
          <FadeUp delay={0.1}>
            <div className="overflow-hidden rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] shadow-lg">
              <div className="grid sm:grid-cols-[13rem_minmax(0,1fr)]">
                <div className="border-b border-[var(--border-default)] p-3 sm:border-b-0 sm:border-r">
                  <p className="px-2 text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Inbox</p>
                  <div className="mt-2 flex items-center gap-2 rounded-lg bg-primary-50/80 p-2 dark:bg-primary-950/40">
                    <span className="relative grid h-8 w-8 place-items-center rounded-full bg-primary-100 text-[11px] font-bold text-primary-700 dark:bg-primary-900/50 dark:text-primary-300">
                      AO
                      <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-[var(--bg-surface)]" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-bold text-[var(--text-primary)]">Amara Okafor</p>
                      <p className="truncate text-[11px] text-[var(--text-secondary)]">Question on question 4…</p>
                    </div>
                    <span className="ml-auto rounded-full bg-primary-500 px-1.5 text-[10px] font-bold text-white">1</span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 border-b border-[var(--border-default)] pb-3">
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-primary-100 text-[11px] font-bold text-primary-700 dark:bg-primary-900/50 dark:text-primary-300">AO</span>
                    <div>
                      <p className="text-sm font-bold text-[var(--text-primary)]">Amara Okafor</p>
                      <p className="text-[11px] text-[var(--text-secondary)]">Student thread</p>
                    </div>
                  </div>
                  <div className="mt-4 space-y-3">
                    <div className="max-w-[80%] rounded-2xl rounded-bl-md bg-[var(--bg-surface-muted)] px-3 py-2 text-xs leading-5 text-[var(--text-primary)]">
                      I had a question on question 4 of the algebra practice set.
                      <p className="mt-1 text-[10px] text-[var(--text-muted)]">2h ago</p>
                    </div>
                    <div className="ml-auto max-w-[80%] rounded-2xl rounded-br-md bg-primary-500 px-3 py-2 text-xs leading-5 text-white">
                      Let’s review the quadratic formula together in our next session.
                      <p className="mt-1 text-[10px] text-primary-100">1h ago</p>
                    </div>
                  </div>
                  <div className="mt-4 rounded-xl border border-[var(--border-default)] px-3 py-2 text-xs text-[var(--text-muted)] bg-[var(--bg-page)]">
                    Write a message...
                  </div>
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

function RolePreviewSection() {
  return (
    <section id="action" className="border-b border-[var(--border-default)] bg-[var(--bg-surface-muted)]/30 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeUp className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
              Role-Based Portals
            </p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-[var(--text-primary)] sm:text-3xl lg:text-4xl">
              One seamless workspace, tailored for everyone
            </h2>
          </div>
          <p className="max-w-md text-sm text-[var(--text-secondary)]">
            Log in directly to explore tailored dashboards created specifically for tutors, students, and parents.
          </p>
        </FadeUp>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {roles.map((role, index) => (
            <FadeUp key={role.label} delay={index * 0.08}>
              <RoleCard {...role} />
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

function RoleCard({ icon: Icon, label, badge, title, copy, href, action, items }) {
  return (
    <article className="flex h-full flex-col justify-between rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-6 shadow-sm hover:shadow-md hover:border-primary-300 transition-all">
      <div>
        <div className="flex items-center justify-between">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary-100 text-primary-700 dark:bg-primary-950/60 dark:text-primary-300">
            <Icon size={20} />
          </span>
          <span className="rounded-full bg-[var(--bg-surface-muted)] px-3 py-1 text-xs font-semibold text-[var(--text-secondary)] border border-[var(--border-default)]">
            {badge}
          </span>
        </div>

        <h3 className="mt-5 text-xl font-bold text-[var(--text-primary)]">{title}</h3>
        <p className="mt-2 text-xs leading-relaxed text-[var(--text-secondary)]">{copy}</p>

        <ul className="mt-6 space-y-2.5 border-t border-[var(--border-default)] pt-4 text-xs text-[var(--text-secondary)]">
          {items.map((item) => (
            <li key={item} className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 shrink-0 text-primary-500" size={15} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8 pt-4 border-t border-[var(--border-default)]">
        <Link
          to={href}
          className="flex w-full items-center justify-between rounded-lg bg-primary-500 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-primary-600 transition-all"
        >
          <span>{action}</span>
          <ArrowRight size={15} />
        </Link>
      </div>
    </article>
  );
}

function LandingFooter() {
  return (
    <footer className="bg-[var(--bg-surface)] py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="grid gap-8 lg:grid-cols-12">
            {/* Branding & Mission */}
            <div className="lg:col-span-5 space-y-3">
              <Link to="/" className="flex items-center gap-2.5 font-bold tracking-tight text-lg">
                <span className="grid h-8 w-8 place-items-center rounded-xl bg-primary-500 text-white">
                  <GraduationCap size={18} />
                </span>
                <span className="text-[var(--text-primary)]">
                  Tutor<span className="text-primary-500">Track</span>
                </span>
              </Link>
              <p className="max-w-sm text-xs leading-relaxed text-[var(--text-secondary)]">
                The streamlined operating rhythm for independent exam prep tutors, students, and parents.
              </p>
            </div>

            {/* Links */}
            <div className="lg:col-span-3 grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="font-bold text-[var(--text-primary)] uppercase tracking-wider mb-3">Navigation</p>
                <ul className="space-y-2 text-[var(--text-secondary)]">
                  <li><a href="#why" className="hover:text-primary-500">Why TutorTrack</a></li>
                  <li><a href="#features" className="hover:text-primary-500">Features</a></li>
                  <li><a href="#messaging" className="hover:text-primary-500">Messaging</a></li>
                  <li><a href="#action" className="hover:text-primary-500">Role Portals</a></li>
                </ul>
              </div>
              <div>
                <p className="font-bold text-[var(--text-primary)] uppercase tracking-wider mb-3">Portals</p>
                <ul className="space-y-2 text-[var(--text-secondary)]">
                  <li><Link to="/signin" className="hover:text-primary-500">Tutor Space</Link></li>
                  <li><Link to="/signin" className="hover:text-primary-500">Student Portal</Link></li>
                  <li><Link to="/signin" className="hover:text-primary-500">Parent View</Link></li>
                </ul>
              </div>
            </div>

            {/* Newsletter */}
            <div className="lg:col-span-4 space-y-3">
              <p className="font-bold text-[var(--text-primary)] text-xs uppercase tracking-wider">Stay Updated</p>
              <p className="text-xs text-[var(--text-secondary)]">
                Get product updates and tutoring practice insights.
              </p>
              <form
                className="flex flex-col sm:flex-row gap-2"
                onSubmit={(e) => e.preventDefault()}
              >
                <div className="relative min-w-0 flex-1">
                  <Mail className="absolute left-3 top-2.5 text-[var(--text-muted)]" size={15} />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full rounded-lg border border-[var(--border-default)] bg-[var(--bg-page)] py-2 pl-9 pr-3 text-xs outline-primary-500 text-[var(--text-primary)]"
                  />
                </div>
                <button
                  type="submit"
                  className="rounded-lg bg-primary-500 px-4 py-2 text-xs font-bold text-white hover:bg-primary-600 transition-all shrink-0 cursor-pointer"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-[var(--border-default)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--text-muted)]">
            <p>© {new Date().getFullYear()} TutorTrack. All rights reserved.</p>
            <p>Empowering independent tutors & students worldwide.</p>
          </div>
        </FadeIn>
      </div>
    </footer>
  );
}
