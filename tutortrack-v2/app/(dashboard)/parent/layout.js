"use client";

import DashboardShell from "@/components/layout/DashboardShell";
import RequireRole from "@/components/layout/RequireRole";

export default function ParentLayout({ children }) {
  return (
    <RequireRole role="parent">
      <DashboardShell>{children}</DashboardShell>
    </RequireRole>
  );
}
