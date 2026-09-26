import { formatRelativeTime } from "@/components/common/Primitives";

export default function MessageBubble({ message, isMine }) {
  return (
    <div className={`flex flex-col ${isMine ? "items-end" : "items-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-6 ${
          isMine
            ? "rounded-br-md bg-primary-500 text-white"
            : "rounded-bl-md bg-[var(--bg-surface-muted)] text-[var(--text-primary)]"
        }`}
      >
        {message.text}
      </div>
      <span className="mt-1 px-1 text-[11px] text-[var(--text-secondary)]">
        {formatRelativeTime(message.createdAt)}
        {isMine ? (message.read ? " · Read" : " · Sent") : ""}
      </span>
    </div>
  );
}
