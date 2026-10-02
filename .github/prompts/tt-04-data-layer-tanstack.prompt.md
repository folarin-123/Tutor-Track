---
description: Task 4 - replace the localStorage store with TanStack Query over Supabase (Phase 1c)
agent: agent
---

Task 4: Phase 1c, real data with proper scoping.

Read first: #file:docs/CURRENT_STATE.md and PRD §18 Phase 1, D3, §12.3, NFR-PERF-02, ADR-008. FR-PAR-01/02 and FR-STD-01 are touched only for data scoping. Tasks 2 and 3 must be merged.

Create branch `task/04-data-layer`, post your plan, wait for "go".

**Do not** build recurrence, calendar views, attendance, student submissions, feedback or Paystack (Phases 2 to 4).

## Checkpoints

**CP1: plumbing.** Add `@tanstack/react-query` and a `QueryClientProvider`.

**CP2: Supabase adapter behind the existing seam** `src/lib/api/index.js`, keeping the current function names (`listStudents`, `addStudent`, `updateStudent`, `listSessions`, `addSession`, `listAssignments`, `addAssignment`, `gradeAssignment`, `listInvoices`, `addPayment`, `markPaymentPaid`). Map snake_case rows to the camelCase shapes the UI uses, inside the adapter. Money stays integer kobo end to end. Map the prototype payment statuses (Due / Pending / Paid) to PRD invoice statuses and document the mapping.

**CP3: feature hooks** in `src/features/<feature>/hooks` (`useStudents`, `useAddStudent`, and so on) with stable query keys and optimistic updates where the prototype felt instant. `refetch` replaces the old `store.fetchX` retry buttons.

**CP4: migrate screens one feature at a time** (students, then scheduling, assignments, payments), keeping loading, empty and error states and lazy-loaded dashboards. `addSession` converts Lagos-local input to a UTC `time_range` and shows a friendly "This overlaps another session" error on exclusion-constraint violation (full conflict UX is Phase 2).

**CP5: fix D3 data scoping.** Tutor sees only their roster. A student sees only their own sessions and assignments. A parent sees only linked children, with the child switcher fed from `guardianships`. RLS enforces it; UI filtering is only for selection.

**CP6: remove `StoreProvider` and `useStore`** once every consumer is migrated. Keep `localStorageAdapter` only as the demo and test adapter, selected by `VITE_DATA_MODE=demo`, with a persistent "Demo data" banner. It must never be used while a Supabase session exists. Hide `loadDemoData` for real accounts.

**CP7: tests.** MSW-backed component tests for each role's main screen; unit tests for mappers and money; extend pgTAP across sessions, assignments, submissions, invoices and payments for all roles per §12.3, including "a student can never read another student's submission" and "a parent cannot edit one". Report bundle sizes against NFR-PERF-02. Update `docs/CURRENT_STATE.md`.

## Acceptance
No remaining import of `useStore`. Each role sees only its own data against the seeded database. All tests green.
