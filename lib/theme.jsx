
import { createContext, useContext, useLayoutEffect, useState } from "react";

const ThemeContext = createContext(null);

function getInitialTheme() {
  if (typeof window === "undefined") return false;
  try {
    const stored = window.localStorage.getItem("tutortrack-theme");
    if (stored === "dark") return true;
    if (stored === "light") return false;
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  } catch {
    return false;
  }
}

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(false);
  const [ready, setReady] = useState(false);

  useLayoutEffect(() => {
    setDark(getInitialTheme());
    setReady(true);
  }, []);

  useLayoutEffect(() => {
    if (!ready) return;
    document.documentElement.classList.toggle("dark", dark);
    try {
      window.localStorage.setItem("tutortrack-theme", dark ? "dark" : "light");
    } catch {
      // ignore storage errors
    }
  }, [dark, ready]);

  function toggleTheme() {
    setDark((current) => !current);
  }

  return (
    <ThemeContext.Provider value={{ dark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }
  return context;
}
