---
description: Task 2 - TypeScript, Supabase local, schema v1, RLS and pgTAP tests (Phase 1a)
agent: agent
---

Task 2: Phase 1a, the database foundation.

Read first: #file:docs/CURRENT_STATE.md and PRD ADR-002/003/004/005, §12.2, §12.3, §9.5, §17.1, NFR-SEC-01, NFR-INT-01/02, FR-AUTH-04/07/08, FR-MSG-01/02. Follow `.github/instructions/supabase.instructions.md`.

**Prerequisite check (do this first):** confirm Docker Desktop is installed and running (`docker version`) and the Supabase CLI is available (`npx supabase --version`). If Docker is missing, stop and tell me; do not fake the database steps.

Create branch `task/02-supabase-foundation`, post your plan, wait for "go".

**Do not** wire any UI, remove Firebase yet, or use the service-role key in `src/`.

## Checkpoints

**CP1: TypeScript.** `tsconfig.json` (`allowJs`, strict for new files), `typecheck` script, a CI step. Convert `formatters` as the exemplar. Add shared domain types in `src/lib/types`.

**CP2: Supabase local.** `npx supabase init`; scripts `db:start`, `db:reset`, `db:test`, `db:types`; `docs/SETUP.md` that works in under ten minutes on Windows/PowerShell.

**CP3: Migration 1, identity and enrolment (PRD §12.2 part 1).**
- `profiles` (id references `auth.users`; role enum `tutor|student|parent|admin`; full_name; phone; timezone default `Africa/Lagos`)
- `tutor_profiles`; `student_profiles` (level, school, exam_target WAEC/JAMB/NECO, exam_year, subjects, `is_minor` default true)
- `guardianships` (parent, student, status, confirmed_by, consent_policy_version, consented_at)
- `enrollments` (tutor, student, subject, status active/paused/completed/archived, archived_at)
- `tutor_classes`, `class_members`
- `handle_new_user` trigger: role from sign-up metadata restricted to `tutor|student|parent` (never `admin`). Role is immutable afterwards except by admin or service role.

**CP4: Migration 2, activity tables in their final PRD shape** (so Task 4 can migrate without a breaking migration; the UI stays at prototype scope).
- `sessions` with `time_range tstzrange`, status, mode, meeting_url, nullable `series_id`, and the `no_tutor_overlap` exclusion constraint; `session_participants`
- `assignments`, `submissions` (one row per targeted student, per §9.3); visibility flags default private
- `invoices` (`amount_kobo`, due_date, status), `payments` (nullable unique `gateway_reference`)
- `audit_log`, append-only, readable only by admins

**CP5: Migration 3, ID-based messaging (§12.2 part 4).**
`message_threads` (tutor_id, student_id, channel `student|parent`, unique per tutor+student+channel), `thread_members` (with `last_read_at`), `messages` (thread, `sender_id` FK to profiles, body CHECK 1..2000).

**CP6: RLS on every table** implementing the §12.3 matrix exactly, with `security definer` helpers such as `is_tutor_of(student)` and `is_guardian_of(student)`.

**CP7: pgTAP tests** in `supabase/tests/`:
- Every table x role, including negative cases.
- §9.5: Parent A (linked to Child A only) gets zero rows for Child B. Tutor X cannot read Tutor Y's notes, invoices or messages about a shared student.
- Exclusion constraint: overlap rejected; back-to-back 16:00–17:00 then 17:00–18:00 allowed; cancelled sessions do not block (§9.1).
- Role immutability.
- Message scoping: student-to-parent and student-to-student threads cannot be created.
- A test that `relrowsecurity` is on for every public table.

**CP8: CI and client wiring.** A database job that starts local Supabase, applies migrations from scratch, and runs pgTAP. Add `src/lib/supabase.ts` using `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`; generate and commit `database.types.ts`; update `.env.example`. Update `docs/CURRENT_STATE.md`.

## Acceptance
`db:reset` then `db:test` green; `typecheck` green; all tests above exist. Report exactly which commands you ran.
