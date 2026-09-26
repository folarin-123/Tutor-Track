import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";

export function Dialog({ open, onClose, title, children, className = "" }) {
  const dialogRef = useRef(null);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    if (open) {
      previousFocusRef.current = document.activeElement;
      dialogRef.current?.focus();

      const handleKeyDown = (e) => {
        if (e.key === "Escape") {
          onClose();
        }
        if (e.key === "Tab" && dialogRef.current) {
          const focusables = dialogRef.current.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          if (focusables.length === 0) return;
          const first = focusables[0];
          const last = focusables[focusables.length - 1];
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      };

      document.addEventListener("keydown", handleKeyDown);
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
        if (previousFocusRef.current && typeof previousFocusRef.current.focus === "function") {
          previousFocusRef.current.focus();
        }
      };
    }
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 backdrop-blur-xs">
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        className={`w-full max-w-lg rounded-3xl bg-[var(--bg-surface)] p-6 shadow-2xl ring-1 ring-[var(--border-default)] outline-none ${className}`}
      >
        <div className="flex items-center justify-between border-b border-[var(--border-default)] pb-4">
          <h2 id="dialog-title" className="text-lg font-extrabold text-[var(--text-primary)]">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="grid h-8 w-8 place-items-center rounded-full text-[var(--text-secondary)] hover:bg-[var(--bg-surface-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>
        <div className="mt-5">{children}</div>
      </div>
    </div>
  );
}
