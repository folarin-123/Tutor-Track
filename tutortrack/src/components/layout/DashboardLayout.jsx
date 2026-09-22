import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  BookOpen,
  CalendarDays,
  GraduationCap,
  Menu,
  MessageCircle,
  Moon,
  Sun,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { useTheme } from "../../hooks/useTheme.js";

const roleLinks = [
  { label: "Tutor space", icon: GraduationCap, to: "/tutor" },
  { label: "Student view", icon: BookOpen, to: "/student" },
  { label: "Parent portal", icon: Users, to: "/parent" },
];

const roleDetails = {
  tutor: { label: "Adewale", account: "Tutor account" },
  student: { label: "Blessing", account: "Student account" },
  parent: { label: "Mrs. Nwachukwu", account: "Parent account" },
};

export default function DashboardLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { dark, toggleTheme } = useTheme();
  const role = useLocation().pathname.slice(1) || "tutor";
  const user = roleDetails[role] ?? roleDetails.tutor;

  return (
    <div className="min-h-screen bg-[var(--color-app-bg)] text-slate-900 transition-colors dark:bg-[var(--color-dark-bg)] dark:text-slate-50">
        <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-[var(--color-dark-surface)]/90">
          <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 sm:px-6">
            <Brand menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
            <ProfileMenu dark={dark} onToggleTheme={toggleTheme} user={user} />
          </div>
        </header>
            <div className="mx-auto flex max-w-[1440px]">
          <Sidebar menuOpen={menuOpen} closeMenu={() => setMenuOpen(false)} />
          <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
  );
}

function Brand({ menuOpen, setMenuOpen }) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="rounded-xl p-2 text-slate-500 lg:hidden"
      >
        {menuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
      <NavLink
        to="/tutor"
        className="flex items-center gap-2 font-extrabold tracking-tight"
      >
        <span className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-500 text-white">
          <GraduationCap size={18} />
        </span>
        TutorTrack
      </NavLink>
    </div>
  );
}

function ProfileMenu({ dark, onToggleTheme, user }) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={onToggleTheme}
        aria-pressed={dark}
        aria-label="Toggle color mode"
        className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 text-slate-500 dark:border-slate-700 dark:text-slate-300"
      >
        {dark ? <Sun size={17} /> : <Moon size={17} />}
      </button>
      <div className="hidden text-right sm:block">
        <p className="text-sm font-semibold">{user.label}</p>
        <p className="text-[11px] text-slate-500 dark:text-slate-400">
          {user.account}
        </p>
      </div>
      <div className="grid h-9 w-9 place-items-center rounded-full bg-orange-100 font-bold text-orange-700">
        {user.label[0]}
      </div>
    </div>
  );
}

function Sidebar({ menuOpen, closeMenu }) {
  const visibility = menuOpen
    ? "fixed inset-x-0 top-16 z-20 block px-4"
    : "hidden";
  return (
    <>
      {menuOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={closeMenu}
          className="fixed inset-0 top-16 z-10 bg-slate-950/30 lg:hidden"
        />
      )}
      <aside
        className={`${visibility} z-20 w-full bg-white pb-4 shadow-xl lg:sticky lg:top-16 lg:z-0 lg:block lg:h-[calc(100vh-4rem)] lg:w-64 lg:shrink-0 lg:border-r lg:border-slate-200 lg:bg-transparent lg:px-5 lg:py-7 lg:shadow-none dark:bg-[var(--color-dark-bg)] dark:lg:border-slate-800`}
      >
        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[.18em] text-slate-400">
          Switch preview
        </p>
        <nav className="space-y-1">
          {roleLinks.map(({ label, icon: Icon, to }) => (
            <NavLink
              onClick={closeMenu}
              key={to}
              to={to}
              className={({ isActive }) => getNavClassName(isActive)}
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-7 border-t border-slate-200 pt-5 dark:border-slate-800">
          <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[.18em] text-slate-400">
            TutorTrack
          </p>
          <SidebarDetail icon={CalendarDays} text="Smart scheduling" />
          <SidebarDetail icon={MessageCircle} text="Secure messages" />
        </div>
      </aside>
    </>
  );
}

function getNavClassName(isActive) {
  const active =
    "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300";
  const idle =
    "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800";
  return `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium ${isActive ? active : idle}`;
}

function SidebarDetail({ icon: Icon, text }) {
  return (
    <div className="flex items-center gap-3 px-3 py-2 text-sm text-slate-500 dark:text-slate-400">
      <Icon size={17} />
      {text}
    </div>
  );
}
