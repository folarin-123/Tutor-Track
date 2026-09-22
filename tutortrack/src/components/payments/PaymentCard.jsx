export default function PaymentCard({ amount, status }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-center justify-between">
        <span className="text-slate-500 dark:text-slate-400">Payment</span>
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs text-emerald-700 dark:bg-white/10 dark:text-emerald-300">
          {status}
        </span>
      </div>
      <div className="mt-4 text-3xl font-bold text-slate-900 dark:text-slate-100">${amount}</div>
    </div>
  );
}
