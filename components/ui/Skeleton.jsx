import React from "react";

export function Skeleton({ className = "", height, width }) {
  const style = {};
  if (height) style.height = height;
  if (width) style.width = width;

  return (
    <div
      style={style}
      className={`animate-pulse rounded-xl bg-[var(--border-default)]/60 ${className}`}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="space-y-3 rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-4 shadow-sm">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-8 w-2/3" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  );
}

export function SkeletonList({ count = 3 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-3">
          <Skeleton className="h-10 w-10 rounded-full shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
