import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { EmptyState, Panel, SecondaryButton, Stat } from "@/components/common/Primitives";
import { SkeletonList } from "@/components/ui/Skeleton";
import { formatDate } from "@/lib/formatters";
import GradeAssignmentModal from "./GradeAssignmentModal";

function StatusBadge({ status }) {
  const tone = {
    Paid: "bg-success-100 text-success-700 dark:bg-success-950/60 dark:text-success-300",
    Due: "bg-warning-100 text-warning-700 dark:bg-warning-950/60 dark:text-warning-300",
    Graded: "bg-success-100 text-success-700 dark:bg-success-950/60 dark:text-success-300",
    Draft: "bg-warning-100 text-warning-700 dark:bg-warning-950/60 dark:text-warning-300",
    "In Review": "bg-primary-100 text-primary-700 dark:bg-primary-950/60 dark:text-primary-300",
    Scheduled: "bg-primary-100 text-primary-700 dark:bg-primary-950/60 dark:text-primary-300",
  }[status] || "bg-[var(--bg-surface-muted)] text-[var(--text-secondary)]";
  return (
    <span className={`rounded-full px-3 py-1.5 text-xs font-bold ${tone}`}>{status}</span>
  );
}

export default function AssignmentsView({
  assignments = [],
  loading = false,
  error = null,
  onGrade = async () => {},
  push = () => {},
  onRetry = () => {},
}) {
  const [grading, setGrading] = useState(null);
  const graded = assignments.filter((item) => item.status === "Graded").length;
  const pending = assignments.length - graded;

  return (
    <div className="mt-7 space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <Stat label="Pending review" value={pending} detail="Needs a grade" tone="warning" />
        <Stat label="Graded" value={graded} detail="Keep it moving" tone="primary" />
      </div>
      <Panel title="Assignment tracker">
        {loading ? (
          <SkeletonList count={3} />
        ) : error ? (
          <div className="rounded-2xl border border-danger-200 bg-danger-50 p-4 text-center text-danger-700 dark:border-danger-900/50 dark:bg-danger-950/30 dark:text-danger-300">
            <p className="text-sm font-semibold">{error}</p>
            <SecondaryButton className="mt-3" onClick={onRetry}>
              <RefreshCw size={14} className="mr-1 inline" /> Retry
            </SecondaryButton>
          </div>
        ) : assignments.length === 0 ? (
          <EmptyState title="No assignments yet" body="Use the new assignment button above." />
        ) : (
          <div className="space-y-3">
            {assignments.map((task) => (
              <div
                key={task.id}
                className="flex flex-col gap-3 rounded-2xl border border-[var(--border-default)] p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-bold text-[var(--text-primary)]">{task.title}</p>
                  <p className="mt-1 text-sm text-[var(--text-secondary)]">
                    {task.studentName} · Due {formatDate(task.due)}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                  <StatusBadge status={task.status} />
                  {task.status !== "Graded" && (
                    <button
                      type="button"
                      onClick={() => setGrading(task)}
                      className="rounded-full bg-primary-900 px-3 py-2 text-xs font-bold text-white cursor-pointer hover:bg-primary-800"
                    >
                      Mark graded
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Panel>
      {grading && (
        <GradeAssignmentModal
          assignment={grading}
          onClose={() => setGrading(null)}
          onSave={async (score) => {
            await onGrade(grading.id, score);
            push("Assignment marked as graded.");
            setGrading(null);
          }}
        />
      )}
    </div>
  );
}
