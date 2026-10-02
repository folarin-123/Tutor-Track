---
description: Task 3 - Supabase Auth, invites, guardianship and consent; remove Firebase (Phase 1b)
agent: agent
---

Task 3: Phase 1b, real auth, invites and guardianship.

Read first: #file:docs/CURRENT_STATE.md and PRD FR-AUTH-01 to 08, FR-SET-03, §9.7, ADR-002, NFR-SEC-03. Task 2 must be merged.

**Prerequisite:** I must have a Supabase cloud project (or confirm we are developing against local only). If keys are missing, stop and tell me what to do.

Create branch `task/03-auth`, post your plan, wait for "go".

**Do not** build the FR-ONB-01 tutor wizard, phone OTP, Google sign-in, 2FA (all P1) or any admin UI.

## Checkpoints

**CP1: Supabase Auth replaces `src/lib/auth`.**
Email + password with verified email before first sign-in; sign-out and refresh; password reset through a time-limited email link with a `/reset-password` page. Keep the `useAuth()` shape (`user, loading, signUp, signIn, signOut, resetPassword`) and the password-strength rule. `user.role` comes from `profiles`, never from client input after sign-up.

**CP2: remove Firebase completely.**
The `firebase` dependency, `lib/firebase.js`, `firebase.json`, `firestore.rules`, the Firestore code in `lib/messages.js` (move `MAX_MESSAGE_LENGTH` to a constants module), and every `VITE_FIREBASE_*` reference.

**CP3: invites (FR-AUTH-05/06).**
`invites` table with a hashed token (at least 128 bits of entropy), tutor_id, kind `student|class|guardian`, target ids, `expires_at`, `max_uses`, `use_count`, `revoked_at`. A tutor UI in the Students view to create, copy and revoke a link. An `/invite/:token` page. Redemption through a `security definer` RPC `redeem_invite` that validates and attaches the account atomically. Clear messages for expired, revoked and used-up invites (§9.7).

**CP4: guardianship and consent (FR-AUTH-07/08, FR-SET-03).**
A parent can link to several children and a child to several guardians; a link needs confirmation by the tutor or an existing guardian; consent is stored with policy version and timestamp. A minor with no confirmed guardian is restricted: no messaging and no data sharing, enforced by RLS and not only the UI, with a clear explanatory screen.

**CP5: unlinked accounts and CV.**
A new student or parent with no enrolment or guardianship sees an "Enter invite code" empty state and no data. Keep collecting the CV; store name and size in `tutor_profiles` (private upload and admin review are P1).

**CP6: tests.**
React Testing Library for the auth screens (validation, errors, reset flow, mocked client). pgTAP for `redeem_invite` (expired, revoked, exhausted, and concurrent double-redeem succeeding exactly once) and for guardianship confirmation and the restricted-minor state. Update `docs/CURRENT_STATE.md` and `.env.example`.

## Acceptance
Phase 1 exit criterion: two real accounts can sign up and verify email, and tests prove a parent cannot read another child's data.
