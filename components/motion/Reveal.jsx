"use client";

export function FadeUp({ children, delay = 0, className = "" }) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}

export function FadeIn({ children, delay = 0, className = "" }) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}

export function FloatCard({ children, className = "" }) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}
