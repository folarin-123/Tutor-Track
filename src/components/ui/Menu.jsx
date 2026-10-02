import React, { useState, useRef, useEffect } from "react";

export function Menu({ trigger, items = [], align = "right", className = "" }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className={`relative inline-block text-left ${className}`} ref={menuRef}>
      <div onClick={() => setOpen((prev) => !prev)} className="cursor-pointer">
        {trigger}
      </div>
      {open && (
        <div
          className={`absolute z-40 mt-2 w-48 rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-1.5 shadow-xl transition-all ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          {items.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                item.onClick?.();
                setOpen(false);
              }}
              className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                item.danger
                  ? "text-danger-500 hover:bg-danger-100"
                  : "text-[var(--text-primary)] hover:bg-[var(--bg-surface-muted)]"
              }`}
            >
              {item.icon && <span className="shrink-0">{item.icon}</span>}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
