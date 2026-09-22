import * as React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "@/app/globals.css";
import Providers from "@/components/Providers";
import LandingPage from "@/app/page";
import SignInPage from "@/app/signin/page";
import SignUpPage from "@/app/signup/page";
import ParentPage from "@/app/(dashboard)/parent/page";
import StudentPage from "@/app/(dashboard)/student/page";
import TutorPage from "@/app/(dashboard)/tutor/page";
import ErrorPage from "@/app/error";
import DashboardShell from "@/components/layout/DashboardShell";
import RequireRole from "@/components/layout/RequireRole";

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
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/tutor" element={<DashboardRoute role="tutor"><TutorPage /></DashboardRoute>} />
        <Route path="/student" element={<DashboardRoute role="student"><StudentPage /></DashboardRoute>} />
        <Route path="/parent" element={<DashboardRoute role="parent"><ParentPage /></DashboardRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Providers>
  );
}

class AppErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  reset = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return <ErrorPage reset={this.reset} />;
    }
    return this.props.children;
  }
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);