"use client";

import DashboardShell from "@/components/layout/DashboardShell";
import RequireRole from "@/components/layout/RequireRole";

export default function StudentLayout({ children }) {
  return (
    <RequireRole role="student">
      <DashboardShell>{children}</DashboardShell>
    </RequireRole>
  );
}
