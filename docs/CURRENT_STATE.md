# TutorTrack: current state (verified from the code, 1 Oct 2026)

Update this file at the end of every task.

## Stack and layout

React 19, Vite 6, React Router 7, Tailwind 4, Motion, Recharts, lucide-react, Vitest. Plain JavaScript (`jsconfig.json`). `vercel.json` has the SPA rewrite.

Canonical source tree under `src/`:
- `app/App.jsx` owns the route tree; `main.jsx` bootstraps providers, router and error boundary.
- `app/routes/{LandingPage,SignInPage,SignUpPage}.jsx` and `app/dashboards/{Tutor,Student,Parent}Dashboard.jsx` contain the route views.
- `components/` contains shared UI, layout, auth and motion components; `styles/globals.css` contains global styles.
- `lib/` contains auth, Firebase, messages, store, theme, toast, API adapters and formatters.
- `features/{students,scheduling,assignments,payments,messaging}` contains feature components and thin `api.js` wrappers; `test/` contains test setup and `App.test.jsx`.
- The `@` alias points to `src/`, so imports use paths such as `@/lib/api`.

## Data and auth

- `StoreProvider` (`src/lib/store.jsx`) loads everything through `src/lib/api`, which re-exports `localStorageAdapter.js`. This is the seam for swapping the backend.
- Money is already integer kobo, shown through `formatNaira`.
- Auth is Firebase Auth (email + password, strength rule, reset-password wired into sign-in). Role is chosen at sign-up and stored in a Firestore `users/{uid}` doc.

## PRD defect list (§6.3) versus reality

| ID | Status | Detail |
|---|---|---|
| D1 Naira, Nigerian levels | Fixed | `formatNaira`, `en-NG`, SS1–SS3, DD/MM/YYYY Lagos |
| D2 Real auth | Partial | Real provider but Firebase, not the PRD's Supabase. No email verification. Role is client-chosen and stored in a user-writable doc (`firestore.rules` allows self-update, so role escalation is possible); defaults to "tutor". No admin role. CV stored as name and size only |
| D3 Data scoping | Open | One shared localStorage blob feeds every role. Parent dashboard lists every student |
| D4 Message identity | Partial | Thread model uses uids, but the adapter hard-codes `tutorId: "tutor-1"` and seed messages use display names. Firestore code in `src/lib/messages.js` is not wired in (only `MAX_MESSAGE_LENGTH` is imported). `AddSessionModal` still matches students by display name; selecting by student ID is deferred to Phase 1 per the PRD |
| D5 Toast-only buttons | Open | Student "Submit work", parent "Pay", parent "Alerts" |
| D6 Logo link | Fixed | `<Link to="/">` |
| D7 Next.js leftovers | Partial | Routes and dashboards now use the canonical `src/app/` structure and descriptive names. Still: `public/{next,vercel,file,globe,window}.svg`, `.next/**` ESLint ignores, and `src/app/favicon.ico` |
| D8 Three codebases | Fixed | Single app |
| D9 Dependency hygiene | Mostly fixed | `eslint.config.mjs` has only ignore patterns, so lint checks nothing. `firebase` dependency is off-PRD |
| D10 No types | Open | |
| D11 Tests, CI, README | Partial | CI runs lint, test, build. 9 route-smoke tests. Thin README. Missing: LICENSE, `.env.example`, `docs/`, CI badge, type-check, secret and dependency scan, coverage |
| D12 Accessibility | Open | `DataTable`, `FileDropzone`, `Menu`, `OfflineBanner`, `Tooltip` exist in `src/components/ui` but are imported nowhere |

## Feature status versus PRD §8

- Students (FR-STU): add-student modal and list only. No search, filters, detail page, lifecycle beyond "Active", classes or invites.
- Scheduling (FR-SCH): one-student sessions (topic, date, times). No conflict check, recurrence, groups, calendar, reschedule or timezone handling.
- Attendance (FR-ATT): does not exist.
- Assignments (FR-ASG): create and grade (0–100). No student submission, feedback, due-date logic or overdue flag.
- Progress (FR-PRG): score-trend chart derived from graded assignments (tutor and parent). No syllabus, notes or mock scores.
- Payments (FR-PAY): add payment, mark paid, receipt modal. Statuses Due / Pending / Paid. No invoices, bank details, aging view or Paystack.
- Messaging (FR-MSG): role-scoped student and parent channels in the UI, unread counters in the model.
- Cross-cutting, built, keep: design tokens, dark mode, shared primitives, `ScrollableTabs`, `Skeleton`, toasts, `MobileBottomNav`, `ErrorBoundary`.
