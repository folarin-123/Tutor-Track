import React from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export function Toast({ toast, onClose, onUndo }) {
  if (!toast) return null;

  const icons = {
    info: <Info className="text-primary-500" size={18} />,
    success: <CheckCircle2 className="text-emerald-500" size={18} />,
    danger: <AlertCircle className="text-danger-500" size={18} />,
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] px-4 py-3 shadow-2xl ring-1 ring-black/5 animate-fade-in text-sm">
      <span className="shrink-0">{icons[toast.tone] || icons.info}</span>
      <p className="font-semibold text-[var(--text-primary)]">{toast.message}</p>
      {onUndo && (
        <button
          type="button"
          onClick={onUndo}
          className="rounded-lg bg-primary-100 px-2.5 py-1 text-xs font-bold text-primary-700 hover:bg-primary-200 transition-colors cursor-pointer"
        >
          Undo
        </button>
      )}
      <button
        type="button"
        onClick={onClose}
        className="rounded-full p-1 text-[var(--text-muted)] hover:bg-[var(--bg-surface-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
        aria-label="Close notification"
      >
        <X size={15} />
      </button>
    </div>
  );
}
