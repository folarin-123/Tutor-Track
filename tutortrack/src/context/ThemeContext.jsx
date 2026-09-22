import { useLayoutEffect, useState } from "react";
import { ThemeContext } from "./ThemeContextValue.js";

function getInitialTheme() {
  try {
    const storedTheme = window.localStorage.getItem("tutortrack-theme");
    if (storedTheme === "dark") return true;
    return false;
  } catch {
    return false;
  }
}

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(getInitialTheme);

  useLayoutEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    try {
      window.localStorage.setItem("tutortrack-theme", dark ? "dark" : "light");
    } catch {
    }
  }, [dark]);

  function toggleTheme() {
    setDark((currentTheme) => !currentTheme);
  }

  return (
    <ThemeContext.Provider value={{ dark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

