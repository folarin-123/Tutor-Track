import { useState } from "react";
import { Send } from "lucide-react";
import { MAX_MESSAGE_LENGTH } from "@/lib/messages";

export default function MessageComposer({ onSend, disabled, placeholder }) {
  const [draft, setDraft] = useState("");
  const canSend = Boolean(draft.trim()) && !disabled;

  const submit = () => {
    if (!canSend) return;
    onSend?.(draft.trim());
    setDraft("");
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
      className="flex items-end gap-2 border-t border-[var(--border-default)] p-3"
    >
      <textarea
        value={draft}
        onChange={(event) => setDraft(event.target.value.slice(0, MAX_MESSAGE_LENGTH))}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            submit();
          }
        }}
        rows={1}
        disabled={disabled}
        placeholder={placeholder}
        className="max-h-32 min-h-11 min-w-0 flex-1 resize-none rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface-muted)] px-3 py-2.5 text-sm outline-primary-500 disabled:opacity-60"
      />
      <button
        type="submit"
        disabled={!canSend}
        aria-label="Send message"
        className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary-600 text-white transition hover:bg-primary-700 disabled:opacity-40"
      >
        <Send size={16} />
      </button>
    </form>
  );
}
