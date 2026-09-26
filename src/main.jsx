import * as React from "react";
import { StrictMode, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "@/app/globals.css";
import Providers from "@/components/Providers";
import LandingPage from "@/app/page";
import SignInPage from "@/app/signin/page";
import SignUpPage from "@/app/signup/page";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import DashboardShell from "@/components/layout/DashboardShell";
import RequireRole from "@/components/layout/RequireRole";
import { SkeletonList } from "@/components/ui/Skeleton";

const ParentPage = lazy(() => import("@/app/dashboard/parent/page"));
const StudentPage = lazy(() => import("@/app/dashboard/student/page"));
const TutorPage = lazy(() => import("@/app/dashboard/tutor/page"));

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

function App() {
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
                <TutorPage />
              </DashboardRoute>
            }
          />
          <Route
            path="/student"
            element={
              <DashboardRoute role="student">
                <StudentPage />
              </DashboardRoute>
            }
          />
          <Route
            path="/parent"
            element={
              <DashboardRoute role="parent">
                <ParentPage />
              </DashboardRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Providers>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>
);
