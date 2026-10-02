import React from "react";
import { Link, useLocation } from "react-router-dom";
import { GraduationCap, BookOpen, Users, LayoutDashboard, Calendar, FileText, DollarSign, MessageSquare } from "lucide-react";

export function MobileBottomNav({ role }) {
  const { pathname } = useLocation();

  const linksByRole = {
    tutor: [
      { label: "Tutor", icon: GraduationCap, to: "/tutor" },
      { label: "Schedule", icon: Calendar, to: "/tutor?tab=Schedule" },
      { label: "Tasks", icon: FileText, to: "/tutor?tab=Assignments" },
      { label: "Payments", icon: DollarSign, to: "/tutor?tab=Payments" },
      { label: "Messages", icon: MessageSquare, to: "/tutor?tab=Messages" },
    ],
    student: [
      { label: "Student", icon: BookOpen, to: "/student" },
      { label: "Tasks", icon: FileText, to: "/student?tab=Assignments" },
      { label: "Messages", icon: MessageSquare, to: "/student?tab=Messages" },
    ],
    parent: [
      { label: "Parent", icon: Users, to: "/parent" },
      { label: "Payments", icon: DollarSign, to: "/parent?tab=Payments" },
      { label: "Messages", icon: MessageSquare, to: "/parent?tab=Messages" },
    ],
  };

  const navLinks = linksByRole[role] || linksByRole.tutor;

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 flex h-16 items-center justify-around border-t border-[var(--border-default)] bg-[var(--bg-surface)]/95 backdrop-blur-md px-2 lg:hidden">
      {navLinks.map(({ label, icon: Icon, to }) => {
        const isActive = pathname === to || pathname.startsWith(to.split("?")[0]);
        return (
          <Link
            key={to + label}
            to={to}
            className={`flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-1 rounded-xl px-2 py-1 text-[11px] font-bold transition-colors ${
              isActive
                ? "text-primary-500"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            <Icon size={19} />
            <span className="truncate max-w-[60px]">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
