import { render, screen } from "@testing-library/react";
import { MemoryRouter, Navigate, Route, Routes } from "react-router-dom";
import { describe, expect, test, beforeAll, vi } from "vitest";
import React, { Suspense, lazy } from "react";
import Providers from "@/components/Providers";
import LandingPage from "@/app/page";
import SignInPage from "@/app/signin/page";
import SignUpPage from "@/app/signup/page";
import DashboardShell from "@/components/layout/DashboardShell";
import RequireRole from "@/components/layout/RequireRole";

const ParentPage = lazy(() => import("@/app/dashboard/parent/page"));
const StudentPage = lazy(() => import("@/app/dashboard/student/page"));
const TutorPage = lazy(() => import("@/app/dashboard/tutor/page"));

beforeAll(() => {
  global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };

  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

function DashboardRoute({ role, children }) {
  return (
    <RequireRole role={role}>
      <DashboardShell>{children}</DashboardShell>
    </RequireRole>
  );
}

function AppTree({ initialRoute = "/" }) {
  return (
    <MemoryRouter initialEntries={[initialRoute]}>
      <Providers>
        <Suspense fallback={<div data-testid="loading">Loading...</div>}>
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
    </MemoryRouter>
  );
}

describe("App Route Smoke Tests", () => {
  const routes = ["/", "/signin", "/signup", "/tutor", "/student", "/parent"];

  routes.forEach((route) => {
    test(`renders route ${route} without throwing`, async () => {
      expect(() => {
        render(<AppTree initialRoute={route} />);
      }).not.toThrow();
    });
  });

  test("renders LandingPage at /", async () => {
    render(<AppTree initialRoute="/" />);
    expect(await screen.findByText(/The Modern Platform for Independent Tutors/i)).toBeInTheDocument();
  });

  test("renders SignInPage at /signin", async () => {
    render(<AppTree initialRoute="/signin" />);
    expect(await screen.findByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });

  test("renders SignUpPage at /signup", async () => {
    render(<AppTree initialRoute="/signup" />);
    expect(await screen.findByRole("button", { name: /create account/i })).toBeInTheDocument();
  });
});
