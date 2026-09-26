import { Avatar, formatRelativeTime } from "@/components/common/Primitives";
import UnreadBadge from "@/components/messaging/UnreadBadge";

export default function ConversationItem({
  title,
  subtitle,
  preview,
  timestamp,
  unread,
  active,
  onSelect,
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${
        active
          ? "bg-primary-50 ring-1 ring-primary-200 dark:bg-primary-900/40 dark:ring-primary-700"
          : "hover:bg-[var(--bg-surface-muted)]"
      }`}
    >
      <Avatar value={title} size={36} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm font-semibold">{title}</p>
          {timestamp ? (
            <span className="shrink-0 text-[11px] text-[var(--text-muted)]">
              {formatRelativeTime(timestamp)}
            </span>
          ) : null}
        </div>
        <div className="mt-0.5 flex items-center justify-between gap-2">
          <p className="truncate text-xs text-[var(--text-secondary)]">
            {preview || subtitle || "No messages yet"}
          </p>
          <UnreadBadge count={unread} />
        </div>
      </div>
    </button>
  );
}
