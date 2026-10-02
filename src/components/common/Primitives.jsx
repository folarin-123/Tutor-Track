
import { useState } from "react";
import { ArrowRight, Send } from "lucide-react";

export function Panel({ title, action, onAction, children }) {
  return (
    <section className="rounded-3xl bg-[var(--bg-surface)] p-5 shadow-sm ring-1 ring-[var(--border-default)] sm:p-6">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-bold">{title}</h2>
        {action && (
          <button
            type="button"
            onClick={onAction}
            className="inline-flex items-center gap-1 text-xs font-bold text-primary-500"
          >
            {action}
            <ArrowRight size={13} />
          </button>
        )}
      </div>
      {children}
    </section>
  );
}

const toneClasses = {
  primary: "bg-primary-100 text-primary-700",
  success: "bg-success-100 text-success-700",
  warning: "bg-warning-100 text-warning-700",
  danger: "bg-danger-100 text-danger-700",
};

export function Stat({ icon, label, value, detail, tone = "primary" }) {
  return (
    <div className="rounded-3xl bg-[var(--bg-surface)] p-5 shadow-sm ring-1 ring-[var(--border-default)]">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-[var(--text-secondary)]">{label}</p>
        {icon && (
          <span
            className={`grid h-9 w-9 place-items-center rounded-full ${toneClasses[tone]}`}
          >
            {icon}
          </span>
        )}
      </div>
      <p className="mt-4 text-3xl font-extrabold">{value}</p>
      {detail && <p className="mt-1 text-xs text-[var(--text-secondary)]">{detail}</p>}
    </div>
  );
}

export function Avatar({ value, size = 40 }) {
  const initials = (value || "?")
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <span
      className="grid shrink-0 place-items-center rounded-full bg-primary-100 font-bold text-primary-700"
      style={{ width: size, height: size, fontSize: size * 0.36 }}
    >
      {initials}
    </span>
  );
}

export function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-3xl bg-[var(--bg-surface)] p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid h-8 w-8 place-items-center rounded-full text-[var(--text-secondary)] hover:bg-[var(--bg-surface-muted)]"
          >
            &times;
          </button>
        </div>
        <div className="mt-5">{children}</div>
      </div>
    </div>
  );
}

export function EmptyState({ title, body, action, onAction }) {
  return (
    <div className="rounded-3xl border border-dashed border-[var(--border-strong)] bg-[var(--bg-surface-muted)] p-8 text-center">
      <p className="font-bold">{title}</p>
      <p className="mt-2 text-sm text-[var(--text-secondary)]">{body}</p>
      {action && (
        <button
          type="button"
          onClick={onAction}
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary-500 px-5 py-2.5 text-sm font-bold text-white"
        >
          {action}
        </button>
      )}
    </div>
  );
}

export function Field({ label, ...props }) {
  return (
    <label className="block text-sm font-semibold">
      {label}
      <input
        className="mt-2 w-full rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] px-4 py-3 text-sm font-normal outline-primary-500"
        {...props}
      />
    </label>
  );
}

export function SelectField({ label, options, ...props }) {
  return (
    <label className="block text-sm font-semibold">
      {label}
      <select
        className="mt-2 w-full rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] px-4 py-3 text-sm font-normal outline-primary-500"
        {...props}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

export function PrimaryButton({ children, className = "", ...props }) {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-primary-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-primary-600 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({ children, className = "", ...props }) {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center gap-2 rounded-full border border-[var(--border-default)] bg-[var(--bg-surface)] px-5 py-3 text-sm font-bold transition hover:bg-[var(--bg-surface-muted)] ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function formatRelativeTime(timestamp) {
  if (!timestamp) return "";
  const diffMs = Date.now() - Number(timestamp);
  const diffSec = Math.max(0, Math.floor(diffMs / 1000));
  if (diffSec < 60) return "just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return `${Math.floor(diffDays / 7)}w ago`;
}

export function MessageThread({
  messages = [],
  currentSender = "",
  onSend,
  placeholder = "Write a message",
  emptyText = "No messages yet.",
  header = null,
}) {
  const [draft, setDraft] = useState("");

  const handleSend = (event) => {
    event?.preventDefault();
    if (!draft.trim()) return;
    onSend?.(draft.trim());
    setDraft("");
  };

  return (
    <div className="flex min-h-[420px] flex-col overflow-hidden rounded-3xl bg-[var(--bg-surface)] p-5 ring-1 ring-[var(--border-default)]">
      {header}
      <div className="flex-1 space-y-4 overflow-y-auto py-4 text-sm">
        {messages.length === 0 ? (
          <p className="py-8 text-center text-sm text-[var(--text-secondary)]">{emptyText}</p>
        ) : (
          messages.map((message) => {
            const isMe =
              message.from === currentSender ||
              (message.from &&
                currentSender &&
                message.from.trim().toLowerCase() === currentSender.trim().toLowerCase());
            return (
              <div key={message.id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                <div
                  className={`max-w-sm rounded-2xl p-3 text-sm ${
                    isMe
                      ? "rounded-tr-sm bg-primary-500 text-white"
                      : "rounded-tl-sm bg-[var(--bg-surface-muted)] text-[var(--text-primary)]"
                  }`}
                >
                  {message.body}
                </div>
                <span className="mt-1 px-1 text-[11px] text-[var(--text-secondary)]">
                  {message.from} · {formatRelativeTime(message.timestamp)}
                </span>
              </div>
            );
          })
        )}
      </div>
      <form onSubmit={handleSend} className="flex flex-wrap gap-2 border-t border-[var(--border-default)] pt-4">
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          className="min-w-0 flex-[1_1_12rem] rounded-full bg-[var(--bg-surface-muted)] px-4 py-3 text-sm outline-primary-500"
          placeholder={placeholder}
        />
        <button
          type="submit"
          disabled={!draft.trim()}
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary-900 text-white transition disabled:opacity-40"
          aria-label="Send message"
        >
          <Send size={17} />
        </button>
      </form>
    </div>
  );
}
