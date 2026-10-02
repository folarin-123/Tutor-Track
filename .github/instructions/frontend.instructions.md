---
description: UI, accessibility, data-fetching and formatting rules for TutorTrack front-end code
applyTo: "src/**/*.{js,jsx,ts,tsx,css}"
---

- Reuse the shared primitives (`Panel`, `Stat`, `Field`, `Modal`, `PrimaryButton`, `EmptyState`, `Skeleton`, `ScrollableTabs`) and the existing CSS-variable tokens. Extend; do not replace.
- Layouts must work down to 360 px. Touch targets are at least 44 px. Phones get the bottom nav; tables collapse to cards.
- WCAG 2.2 AA: every control has a programmatic label; status is never colour alone; modals trap focus and return it; tabs are keyboard operable; honour `prefers-reduced-motion`.
- Server state goes through TanStack Query hooks in `src/features/<feature>/hooks`. No new React-context stores for server data.
- Never read role or identity from client storage. Role comes from the `profiles` row.
- Currency: `formatNaira(kobo)`. Dates: DD/MM/YYYY in Africa/Lagos. Do not hard-code `$` or UK school years.
- Plain, calm copy at a secondary-school reading level. No jargon on parent-facing screens.
- No toast-only buttons: if an action is not implemented, hide it or disable it with an explanation. Do not fake success.
- Keep dashboards lazy-loaded and watch bundle size (PRD NFR-PERF-02).
