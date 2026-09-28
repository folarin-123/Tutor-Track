import { RefreshCw } from "lucide-react";
import { Avatar, EmptyState, Panel, SecondaryButton } from "@/components/common/Primitives";
import { SkeletonList } from "@/components/ui/Skeleton";
import { formatNaira } from "@/src/lib/formatters";

function StatusBadge({ status }) {
  const tone = {
    Paid: "bg-success-100 text-success-700 dark:bg-success-950/60 dark:text-success-300",
    Due: "bg-warning-100 text-warning-700 dark:bg-warning-950/60 dark:text-warning-300",
    Pending: "bg-primary-100 text-primary-700 dark:bg-primary-950/60 dark:text-primary-300",
  }[status] || "bg-[var(--bg-surface-muted)] text-[var(--text-secondary)]";
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-bold ${tone}`}>{status}</span>
  );
}

export default function PaymentsView({
  payments = [],
  loading = false,
  error = null,
  onMarkPaid = async () => {},
  onReceipt = () => {},
  onRetry = () => {},
}) {
  const outstanding = payments
    .filter((item) => item.status !== "Paid")
    .reduce((sum, item) => sum + item.amount, 0);
  const collected = payments
    .filter((item) => item.status === "Paid")
    .reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="mt-7 space-y-6">
      <div className="overflow-hidden rounded-[2rem] bg-primary-900 p-6 text-white sm:p-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold text-primary-300">Payments overview</p>
            <p className="mt-3 text-4xl font-extrabold sm:text-5xl">{formatNaira(outstanding)}</p>
            <p className="mt-2 text-sm text-primary-100">Outstanding across your families</p>
          </div>
          <div className="rounded-3xl bg-white/10 p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-primary-100">
              Collected
            </p>
            <p className="mt-3 text-3xl font-extrabold">{formatNaira(collected)}</p>
          </div>
        </div>
      </div>
      <Panel title="Balances">
        {loading ? (
          <SkeletonList count={3} />
        ) : error ? (
          <div className="rounded-2xl border border-danger-200 bg-danger-50 p-4 text-center text-danger-700 dark:border-danger-900/50 dark:bg-danger-950/30 dark:text-danger-300">
            <p className="text-sm font-semibold">{error}</p>
            <SecondaryButton className="mt-3" onClick={onRetry}>
              <RefreshCw size={14} className="mr-1 inline" /> Retry
            </SecondaryButton>
          </div>
        ) : payments.length === 0 ? (
          <EmptyState title="No payments yet" body="Add a payment record to track balances." />
        ) : (
          <div className="space-y-3">
            {payments.map((payment) => (
              <div
                key={payment.id}
                className="flex flex-col gap-3 rounded-2xl border border-[var(--border-default)] p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-3">
                  <Avatar value={payment.studentName} />
                  <div>
                    <p className="font-bold text-[var(--text-primary)]">{payment.studentName}</p>
                    <p className="mt-1 text-xs text-[var(--text-secondary)]">{payment.month}</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-4 sm:justify-end">
                  <div className="text-right">
                    <p className="font-extrabold text-[var(--text-primary)]">{formatNaira(payment.amount)}</p>
                    <StatusBadge status={payment.status} />
                  </div>
                  {payment.status !== "Paid" ? (
                    <button
                      onClick={() => onMarkPaid(payment.id)}
                      className="rounded-full bg-primary-500 px-3 py-2 text-xs font-bold text-white cursor-pointer hover:bg-primary-600"
                    >
                      Mark paid
                    </button>
                  ) : (
                    <button
                      onClick={() => onReceipt(payment)}
                      className="rounded-full border border-[var(--border-default)] px-3 py-2 text-xs font-bold text-[var(--text-primary)] cursor-pointer hover:bg-[var(--bg-surface-muted)]"
                    >
                      Receipt
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Panel>
    </div>
  );
}
