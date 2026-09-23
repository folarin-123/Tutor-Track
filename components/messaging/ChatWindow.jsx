import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { Avatar, EmptyState } from "@/components/common/Primitives";
import MessageBubble from "@/components/messaging/MessageBubble";
import MessageComposer from "@/components/messaging/MessageComposer";

export default function ChatWindow({
  title,
  subtitle,
  messages,
  currentUid,
  loading,
  error,
  onSend,
  onBack,
  composerDisabled,
  placeholder,
  emptyText,
}) {
  const scrollerRef = useRef(null);
  const [pinnedToBottom, setPinnedToBottom] = useState(true);
  const [unseen, setUnseen] = useState(0);
  const previousCount = useRef(0);

  useEffect(() => {
    const node = scrollerRef.current;
    if (!node) return;
    if (pinnedToBottom) {
      node.scrollTop = node.scrollHeight;
      setUnseen(0);
    } else if (messages.length > previousCount.current) {
      setUnseen((count) => count + 1);
    }
    previousCount.current = messages.length;
  }, [messages, pinnedToBottom]);

  const jumpToLatest = () => {
    const node = scrollerRef.current;
    if (!node) return;
    node.scrollTop = node.scrollHeight;
    setPinnedToBottom(true);
    setUnseen(0);
  };

  return (
    <div className="flex h-full min-h-0 flex-col bg-[var(--bg-surface)]">
      <div className="flex items-center gap-3 border-b border-[var(--border-default)] px-3 py-3">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="grid h-8 w-8 place-items-center rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-surface-muted)] lg:hidden"
            aria-label="Back to conversations"
          >
            <ArrowLeft size={16} />
          </button>
        )}
        <Avatar value={title} size={34} />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{title}</p>
          {subtitle && <p className="truncate text-xs text-[var(--text-secondary)]">{subtitle}</p>}
        </div>
      </div>

      <div className="relative min-h-0 flex-1">
        <div
          ref={scrollerRef}
          onScroll={(event) => {
            const node = event.currentTarget;
            const atBottom = node.scrollHeight - node.scrollTop - node.clientHeight < 48;
            setPinnedToBottom(atBottom);
            if (atBottom) setUnseen(0);
          }}
          className="h-full space-y-3 overflow-y-auto px-4 py-4"
        >
          {loading ? (
            <div className="space-y-3">
              <div className="h-10 w-2/3 animate-pulse rounded-2xl bg-[var(--bg-surface-muted)]" />
              <div className="ml-auto h-10 w-1/2 animate-pulse rounded-2xl bg-[var(--bg-surface-muted)]" />
              <div className="h-10 w-1/2 animate-pulse rounded-2xl bg-[var(--bg-surface-muted)]" />
            </div>
          ) : error ? (
            <EmptyState title="Couldn't load messages" body={error} />
          ) : messages.length === 0 ? (
            <EmptyState title="No messages yet" body={emptyText} />
          ) : (
            <AnimatePresence initial={false}>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <MessageBubble message={message} isMine={message.senderId === currentUid} />
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
        {!pinnedToBottom && unseen > 0 && (
          <button
            type="button"
            onClick={jumpToLatest}
            className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-primary-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm"
          >
            New message
          </button>
        )}
      </div>

      <MessageComposer
        onSend={onSend}
        disabled={composerDisabled || loading || Boolean(error)}
        placeholder={placeholder}
      />
    </div>
  );
}
