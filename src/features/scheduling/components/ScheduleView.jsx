import { RefreshCw } from "lucide-react";
import { EmptyState, Panel, SecondaryButton } from "@/components/common/Primitives";
import { SkeletonList } from "@/components/ui/Skeleton";
import { formatDate } from "@/src/lib/formatters";

export default function ScheduleView({
  sessions = [],
  loading = false,
  error = null,
  push = () => {},
  onRetry = () => {},
}) {
  return (
    <div className="mt-7">
      <Panel title="Sessions">
        {loading ? (
          <SkeletonList count={3} />
        ) : error ? (
          <div className="rounded-2xl border border-danger-200 bg-danger-50 p-4 text-center text-danger-700 dark:border-danger-900/50 dark:bg-danger-950/30 dark:text-danger-300">
            <p className="text-sm font-semibold">{error}</p>
            <SecondaryButton className="mt-3" onClick={onRetry}>
              <RefreshCw size={14} className="mr-1 inline" /> Retry
            </SecondaryButton>
          </div>
        ) : sessions.length === 0 ? (
          <EmptyState title="No sessions yet" body="Use the new session button above to add one." />
        ) : (
          <div className="space-y-3">
            {sessions.map((session) => (
              <button
                type="button"
                key={session.id}
                onClick={() => push("Session opened. You can confirm or propose a new time.")}
                className="flex w-full flex-col gap-1 rounded-2xl border border-[var(--border-default)] p-4 text-left hover:border-primary-300 transition-colors cursor-pointer"
              >
                <span className="text-xs font-bold text-primary-600 dark:text-primary-400">
                  {formatDate(session.date)} · {session.start} to {session.end}
                </span>
                <span className="font-bold text-[var(--text-primary)]">{session.topic}</span>
                <span className="text-sm text-[var(--text-secondary)]">
                  {session.status} · {session.studentName}
                </span>
              </button>
            ))}
          </div>
        )}
      </Panel>
    </div>
  );
}
