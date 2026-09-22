export default function ScrollableTabs({ tabs, active, onChange }) {
  return (
    <div className="relative rounded-full border border-[var(--border-default)] bg-[var(--bg-surface)] p-1">
      <div className="flex gap-1 overflow-x-auto pr-7 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {tabs.map((tab) => (
          <button
            type="button"
            key={tab}
            onClick={() => onChange(tab)}
            aria-current={active === tab ? "page" : undefined}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              active === tab
                ? "bg-primary-500 text-white"
                : "text-[var(--text-secondary)] hover:bg-[var(--bg-surface-muted)]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-0 h-full w-8 rounded-r-full bg-gradient-to-l from-[var(--bg-surface)] via-[var(--bg-surface)]/80 to-transparent"
      />
    </div>
  );
}
