import React, { useState } from "react";

export function Tabs({ tabs = [], activeTab, onChange, className = "" }) {
  return (
    <div
      className={`flex items-center gap-1 overflow-x-auto rounded-full border border-[var(--border-default)] bg-[var(--bg-surface)] p-1.5 shadow-sm scrollbar-none ${className}`}
      role="tablist"
    >
      {tabs.map((tab) => {
        const id = typeof tab === "string" ? tab : tab.id;
        const label = typeof tab === "string" ? tab : tab.label;
        const isActive = activeTab === id;
        return (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(id)}
            className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
              isActive
                ? "bg-primary-500 text-white shadow-sm"
                : "text-[var(--text-secondary)] hover:bg-[var(--bg-surface-muted)] hover:text-[var(--text-primary)]"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
