# TutorTrack: always-on instructions

You are building **TutorTrack**, a practice-management platform for independent WAEC/JAMB/NECO tutors, their students and the parents who pay. The prototype is being taken to production as defined in `docs/TutorTrack_PRD_v2.md`.

## Source of truth

- The PRD is binding: requirement IDs (FR-xxx, NFR-xxx), priorities (P0/P1/P2), ADRs, flows (§9) and phases (§18).
- The PRD is long. Do **not** load it whole. Search it by requirement ID or section heading and read only what the task names.
- Current repo status and known defects live in `docs/CURRENT_STATE.md`. Read it at the start of every task.
- If code, a task or your own judgement conflicts with the PRD, follow the PRD and tell me.
- Never invent requirements. Never pull P1/P2 work into a P0 task.
- Never cut (PRD §18.1): RLS and its tests, the booking exclusion constraint, webhook signature verification and idempotency, guardian consent, accessibility basics.

## Rules for every change

1. Authorisation is Postgres RLS, deny-by-default. The browser is untrusted. The service-role key never appears in `src/`. Never base a policy on `user_metadata`.
2. Money is integer kobo. Format only in the UI with `formatNaira`.
3. Timestamps are `timestamptz` in UTC. Display in Africa/Lagos, dates as DD/MM/YYYY.
4. Schema changes only through versioned migrations in `supabase/migrations/`. New code is TypeScript strict. Convert existing JS only when you touch it.
5. Every async view has loading, empty, error and offline states, each with an action.
6. Never put message bodies, grades or child names in logs or analytics.
7. Use JSS1–JSS3, SS1–SS3, "Term" and Naira. Preserve the CSS-variable design tokens and dark mode.

## Working agreement (this is an interactive agent, not a background job)

- **Plan first.** Before editing, post a short plan: the PRD IDs you are addressing, the files you will touch, and any assumptions. Wait for my "go".
- **Work in checkpoints.** After each numbered checkpoint: run the checks, summarise what changed in under 10 lines, then stop and wait for "continue".
- **Branch and commit locally.** One branch per task (`task/NN-slug`). One Conventional Commit per checkpoint. Never push, merge, force-push, or delete branches. Ask before any destructive command.
- **I am on Windows with PowerShell.** Use cross-platform npm scripts. No bash-only syntax in scripts or CI that must run locally.
- **Be honest about verification.** State exactly which commands you ran and what they printed. If you could not run something (Docker, Supabase, a browser), say so. Never claim a pass you did not observe.
- **If a step needs something only I can do** (create a cloud project, get API keys, install Docker), stop, give me the exact steps, and continue with a local alternative.
- **Stay in scope.** If you notice something outside the task, list it under "Noticed, not done" instead of fixing it.

## Definition of Done

Passing tests at the right layers; RLS tests updated if data access changed; accessibility checked; loading, empty, error and offline states handled; docs and ADRs updated; no new lint, type or audit warnings. Finish with `npm run lint && npm run test && npm run build` (plus `typecheck` and `db:test` once they exist).
