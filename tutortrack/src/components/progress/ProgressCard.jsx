export default function ProgressCard({ label, score, trend }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-slate-900 dark:text-slate-100">{label}</span>
        <span className="text-emerald-600 dark:text-emerald-300">{trend}</span>
      </div>
      <div className="mt-3 h-2 rounded bg-slate-100 dark:bg-slate-700">
        <div
          className="h-2 rounded bg-emerald-400"
          style={{ width: `${score}%` }}
        ></div>
      </div>
      <div className="mt-3 text-sm text-slate-500 dark:text-slate-400">{score}% complete</div>
    </div>
  );
}
