export default function StatCard({ label, value, detail }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
      <div className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
        {label}
      </div>
      <div className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">{value}</div>
      {detail && <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">{detail}</div>}
    </div>
  );
}
