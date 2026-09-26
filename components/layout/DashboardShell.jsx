
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  BookOpen,
  CalendarDays,
  GraduationCap,
  LogOut,
  Menu,
  MessageCircle,
  Moon,
  Sun,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { useTheme } from "@/lib/theme";
import { useAuth } from "@/lib/auth";
import { Avatar } from "@/components/common/Primitives";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";

const roleLinks = [
  { label: "Tutor space", icon: GraduationCap, to: "/tutor", role: "tutor" },
  { label: "Student view", icon: BookOpen, to: "/student", role: "student" },
  { label: "Parent portal", icon: Users, to: "/parent", role: "parent" },
];

export default function DashboardShell({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { dark, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    navigate("/signin");
  };

  const accountLabel = user ? `${capitalize(user.role)} account` : "Not signed in";

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)] transition-colors">
      <header className="sticky top-0 z-30 border-b border-[var(--border-default)] bg-[var(--bg-surface)]/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              className="rounded-full p-2 text-[var(--text-secondary)] lg:hidden"
              aria-label="Toggle navigation"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <Link to="/" className="flex items-center gap-2 font-extrabold tracking-tight">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-primary-500 text-white">
                <GraduationCap size={18} />
              </span>
              TutorTrack
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleTheme}
              aria-pressed={dark}
              aria-label="Toggle color mode"
              className="grid h-9 w-9 place-items-center rounded-full border border-[var(--border-default)] text-[var(--text-secondary)]"
            >
              {dark ? <Sun size={17} /> : <Moon size={17} />}
            </button>
            {user && (
              <>
                <div className="hidden text-right sm:block">
                  <p className="text-sm font-semibold">{user.name}</p>
                  <p className="text-[11px] text-[var(--text-secondary)]">{accountLabel}</p>
                  {user.cv && (
                    <p className="text-[10px] font-medium text-primary-600">
                      CV: {user.cv.name} ({user.cv.sizeKB} KB)
                    </p>
                  )}
                </div>
                <Avatar value={user.name} size={36} />
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="hidden items-center gap-2 rounded-full border border-[var(--border-default)] px-3 py-2 text-xs font-bold sm:inline-flex"
                >
                  <LogOut size={14} />
                  Sign out
                </button>
              </>
            )}
          </div>
        </div>
      </header>
      <div className="mx-auto flex max-w-[1440px]">
        <Sidebar
          menuOpen={menuOpen}
          closeMenu={() => setMenuOpen(false)}
          pathname={pathname}
          role={user?.role}
          onSignOut={handleSignOut}
        />
        <main className="min-w-0 flex-1 p-4 pb-20 sm:p-6 lg:p-8 lg:pb-8">{children}</main>
      </div>
      <MobileBottomNav role={user?.role || "tutor"} />
    </div>
  );
}

function Sidebar({ menuOpen, closeMenu, pathname, role, onSignOut }) {
  const visibility = menuOpen ? "fixed inset-x-0 top-16 z-20 block px-4" : "hidden";
  const visibleRoleLinks = roleLinks.filter((item) => item.role === role);
  return (
    <>
      {menuOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={closeMenu}
          className="fixed inset-0 top-16 z-10 bg-black/30 lg:hidden"
        />
      )}
      <aside
        className={`${visibility} z-20 w-full rounded-b-3xl bg-[var(--bg-surface)] pb-4 shadow-xl lg:sticky lg:top-16 lg:z-0 lg:block lg:h-[calc(100vh-4rem)] lg:w-64 lg:shrink-0 lg:rounded-none lg:border-r lg:border-[var(--border-default)] lg:bg-transparent lg:px-5 lg:py-7 lg:shadow-none`}
      >
        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[.18em] text-[var(--text-muted)]">
          Your portal
        </p>
        <nav className="space-y-1">
          {visibleRoleLinks.map(({ label, icon: Icon, to }) => {
            const isActive = pathname?.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                onClick={closeMenu}
                className={`flex w-full items-center gap-3 rounded-full px-3 py-2.5 text-sm font-medium ${
                  isActive
                    ? "bg-primary-100 text-primary-700"
                    : "text-[var(--text-secondary)] hover:bg-[var(--bg-surface-muted)]"
                }`}
              >
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-7 border-t border-[var(--border-default)] pt-5">
          <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[.18em] text-[var(--text-muted)]">
            TutorTrack
          </p>
          <div className="flex items-center gap-3 px-3 py-2 text-sm text-[var(--text-secondary)]">
            <CalendarDays size={17} />
            Smart scheduling
          </div>
          <div className="flex items-center gap-3 px-3 py-2 text-sm text-[var(--text-secondary)]">
            <MessageCircle size={17} />
            Secure messages
          </div>
        </div>
        <button
          type="button"
          onClick={onSignOut}
          className="mt-2 flex w-full items-center gap-3 rounded-full px-3 py-2.5 text-sm font-medium text-danger-500 hover:bg-danger-100 lg:hidden"
        >
          <LogOut size={18} />
          Sign out
        </button>
      </aside>
    </>
  );
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}