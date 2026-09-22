export default function AssignmentCard({ title, due, status }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-slate-900 dark:text-slate-100">{title}</span>
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs text-emerald-700 dark:bg-emerald-400/20 dark:text-emerald-300">
          {status}
        </span>
      </div>
      <div className="mt-3 text-sm text-slate-500 dark:text-slate-400">Due {due}</div>
    </div>
  );
}
