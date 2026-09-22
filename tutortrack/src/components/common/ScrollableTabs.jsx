export default function ScrollableTabs({ tabs, active, onChange }) {
  return (
    <div className="relative rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-[var(--color-dark-surface)]">
      <div className="flex gap-1 overflow-x-auto pr-7 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {tabs.map((tab) => (
          <button
            type="button"
            key={tab}
            onClick={() => onChange(tab)}
            aria-current={active === tab ? "page" : undefined}
            className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${active === tab ? "bg-emerald-500 text-white" : "text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"}`}
          >
            {tab}
          </button>
        ))}
      </div>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-0 h-full w-8 rounded-r-xl bg-gradient-to-l from-white via-white/80 to-transparent dark:from-[var(--color-dark-surface)] dark:via-[var(--color-dark-surface)]/80"
      />
    </div>
  );
}
