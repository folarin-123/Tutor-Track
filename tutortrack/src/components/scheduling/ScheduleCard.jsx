export default function ScheduleCard({ title, date, time }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
      <div className="text-sm uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
        Session
      </div>
      <div className="mt-2 text-xl font-bold text-slate-900 dark:text-slate-100">{title}</div>
      <div className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        {date} · {time}
      </div>
    </section>
  );
}
