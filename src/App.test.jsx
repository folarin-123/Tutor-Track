import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, test, beforeAll, vi } from "vitest";
import App from "@/app/App";

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

function renderApp(initialRoute = "/") {
  return (
    <MemoryRouter initialEntries={[initialRoute]}>
      <App />
    </MemoryRouter>
  );
}

describe("App Route Smoke Tests", () => {
  const routes = ["/", "/signin", "/signup", "/tutor", "/student", "/parent"];

  routes.forEach((route) => {
    test(`renders route ${route} without throwing`, async () => {
      expect(() => {
        render(renderApp(route));
      }).not.toThrow();
    });
  });

  test("renders LandingPage at /", async () => {
    render(renderApp("/"));
    expect(await screen.findByText(/The Modern Platform for Independent Tutors/i)).toBeInTheDocument();
  });

  test("renders SignInPage at /signin", async () => {
    render(renderApp("/signin"));
    expect(await screen.findByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });

  test("renders SignUpPage at /signup", async () => {
    render(renderApp("/signup"));
    expect(await screen.findByRole("button", { name: /create account/i })).toBeInTheDocument();
  });
});
