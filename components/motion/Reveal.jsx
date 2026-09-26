import React, { useEffect, useState } from "react";

export function FadeUp({ children, delay = 0, className = "" }) {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(query.matches);
    const listener = (e) => setReducedMotion(e.matches);
    query.addEventListener("change", listener);
    return () => query.removeEventListener("change", listener);
  }, []);

  return (
    <div
      className={`transition-all duration-300 ${
        reducedMotion ? "" : "motion-safe:animate-fade-in-up"
      } ${className}`}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
}

export function FadeIn({ children, delay = 0, className = "" }) {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(query.matches);
    const listener = (e) => setReducedMotion(e.matches);
    query.addEventListener("change", listener);
    return () => query.removeEventListener("change", listener);
  }, []);

  return (
    <div
      className={`transition-opacity duration-300 ${
        reducedMotion ? "" : "motion-safe:animate-fade-in"
      } ${className}`}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
}

export function FloatCard({ children, className = "" }) {
  return <div className={className}>{children}</div>;
}
