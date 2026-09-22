export default function ParentMessage({ student, body }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
      <div className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
        Parent Note
      </div>
      <div className="mt-2 font-semibold text-slate-900 dark:text-slate-100">{student}</div>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{body}</p>
    </div>
  );
}
