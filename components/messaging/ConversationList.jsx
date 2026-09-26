import { Search } from "lucide-react";
import ConversationItem from "@/components/messaging/ConversationItem";
import { EmptyState } from "@/components/common/Primitives";

export default function ConversationList({
  query,
  onQueryChange,
  items,
  selectedId,
  onSelect,
  emptyTitle,
  emptyBody,
}) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="border-b border-[var(--border-default)] p-3">
        <label className="relative block">
          <Search
            size={15}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
          />
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search conversations"
            className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)] py-2 pl-9 pr-3 text-sm outline-primary-500"
          />
        </label>
      </div>
      <div className="min-h-0 flex-1 space-y-1 overflow-y-auto p-2">
        {items.length === 0 ? (
          <div className="p-2">
            <EmptyState title={emptyTitle} body={emptyBody} />
          </div>
        ) : (
          items.map((item) => (
            <ConversationItem
              key={item.id}
              title={item.title}
              subtitle={item.subtitle}
              preview={item.preview}
              timestamp={item.timestamp}
              unread={item.unread}
              active={item.id === selectedId}
              onSelect={() => onSelect(item)}
            />
          ))
        )}
      </div>
    </div>
  );
}
