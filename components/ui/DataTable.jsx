import React from "react";

export function DataTable({ columns = [], data = [], keyField = "id", emptyText = "No data available" }) {
  if (data.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[var(--border-strong)] bg-[var(--bg-surface-muted)] p-8 text-center text-xs text-[var(--text-secondary)]">
        {emptyText}
      </div>
    );
  }

  return (
    <div>
      {/* Desktop & Tablet Table */}
      <div className="hidden md:block overflow-x-auto rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)]">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-[var(--border-default)] bg-[var(--bg-surface-muted)] font-bold text-[var(--text-secondary)] uppercase tracking-wider">
            <tr>
              {columns.map((col) => (
                <th key={col.key || col.header} className="px-4 py-3">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-default)]">
            {data.map((row, idx) => (
              <tr key={row[keyField] || idx} className="hover:bg-[var(--bg-surface-muted)]/50 transition-colors">
                {columns.map((col) => (
                  <td key={col.key || col.header} className="px-4 py-3 text-[var(--text-primary)]">
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Stacked Cards */}
      <div className="space-y-3 md:hidden">
        {data.map((row, idx) => (
          <div
            key={row[keyField] || idx}
            className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-4 shadow-sm space-y-2 text-xs"
          >
            {columns.map((col) => (
              <div key={col.key || col.header} className="flex items-center justify-between gap-2 border-b border-[var(--border-default)]/40 pb-1.5 last:border-0 last:pb-0">
                <span className="font-bold text-[var(--text-secondary)] uppercase tracking-wider text-[10px]">
                  {col.header}
                </span>
                <span className="text-[var(--text-primary)] font-medium text-right">
                  {col.render ? col.render(row) : row[col.key]}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
