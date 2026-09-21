"use client";

import DashboardShell from "@/components/layout/DashboardShell";
import RequireRole from "@/components/layout/RequireRole";

export default function TutorLayout({ children }) {
  return (
    <RequireRole role="tutor">
      <DashboardShell>{children}</DashboardShell>
    </RequireRole>
  );
}
