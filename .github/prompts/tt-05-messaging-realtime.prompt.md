---
description: Task 5 - ID-based messaging on Supabase Realtime (Phase 1d)
agent: agent
---

Task 5: Phase 1d, scoped messaging.

Read first: #file:docs/CURRENT_STATE.md and PRD FR-MSG-01/02 (P0), D4, §12.2 part 4, §16.3. Tasks 2 to 4 must be merged.

Create branch `task/05-messaging`, post your plan, wait for "go".

## Checkpoints

**CP1: reimplement the messaging API** (`subscribeToConversations`, `subscribeToMessages`, `getOrCreateConversation`, `sendMessage`, `markConversationRead`) over the Task 2 tables using Supabase Realtime. Keep the signatures `MessagingPanel` already uses.

**CP2: remove identity hacks.** Delete the hard-coded `"tutor-1"` and every display-name `from` / `to`. Messages reference user IDs only.

**CP3: enforce scope.** Only tutor-to-student and tutor-to-parent threads, enforced by RLS. Add tests proving student-to-parent and student-to-student creation fail. Enforce the 1 to 2000 length limit in the database.

**CP4: unread state.** Replace the `tutorUnread / studentUnread / parentUnread` counters with `last_read_at` per member. Keep `UnreadBadge` behaviour.

**CP5: restricted minors** (from Task 3) cannot message. Replace the "link a student/parent account" prompts in `MessagingPanel` with entry points to the invite flow.

**CP6: tests.** pgTAP thread scoping; React Testing Library for `MessagingPanel` (role-filtered lists, send, retry on failure). Update `docs/CURRENT_STATE.md`.

## Acceptance
With the seed data, the tutor sees threads for their students and a parent sees only their own child's thread. All Phase 1 exit criteria are green. **Stop here.** Phase 2 (scheduling, attendance, assignments, grading, notifications) gets its own prompt.
