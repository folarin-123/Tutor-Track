import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Providers from "@/components/Providers";
import LandingPage from "@/app/routes/LandingPage";
import SignInPage from "@/app/routes/SignInPage";
import SignUpPage from "@/app/routes/SignUpPage";
import DashboardShell from "@/components/layout/DashboardShell";
import RequireRole from "@/components/layout/RequireRole";
import { SkeletonList } from "@/components/ui/Skeleton";

const ParentDashboard = lazy(() => import("@/app/dashboards/ParentDashboard"));
const StudentDashboard = lazy(() => import("@/app/dashboards/StudentDashboard"));
const TutorDashboard = lazy(() => import("@/app/dashboards/TutorDashboard"));

function PageLoader() {
  return (
    <div className="mx-auto max-w-5xl p-6">
      <SkeletonList count={4} />
    </div>
  );
}

function DashboardRoute({ role, children }) {
  return (
    <RequireRole role={role}>
      <DashboardShell>{children}</DashboardShell>
    </RequireRole>
  );
}

export default function App() {
  return (
    <Providers>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route
            path="/tutor"
            element={
              <DashboardRoute role="tutor">
                <TutorDashboard />
              </DashboardRoute>
            }
          />
          <Route
            path="/student"
            element={
              <DashboardRoute role="student">
                <StudentDashboard />
              </DashboardRoute>
            }
          />
          <Route
            path="/parent"
            element={
              <DashboardRoute role="parent">
                <ParentDashboard />
              </DashboardRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Providers>
  );
}