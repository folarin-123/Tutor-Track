---
description: SQL migration, RLS policy and pgTAP test rules for the TutorTrack Supabase backend
applyTo: "supabase/**"
---

- Enable RLS on every table in `public`. Deny by default; add the narrowest policy that satisfies the PRD §12.3 matrix.
- Write helper functions as `security definer` with `set search_path = ''` and fully qualified names. Keep them in a non-exposed schema where possible.
- Policies use `(select auth.uid())` and never read `raw_user_meta_data` or `user_metadata`. Roles come from `public.profiles`.
- Money is `integer` kobo with CHECK constraints. Time is `timestamptz`. Add foreign keys, check constraints and indexes on all foreign keys and common filters.
- No double-booking: `exclude using gist (tutor_id with =, time_range with &&) where (status <> 'cancelled')`, with `btree_gist`.
- Webhook-style writes are idempotent (`unique (gateway_reference)`, insert-or-ignore).
- Every migration is additive and reversible in intent. Never edit a migration that has been applied; add a new one.
- pgTAP: test every table x role (tutor, student, parent, other tutor, other parent, anon, admin), including negative cases. Name tests so they read as documentation of the privacy model. A failing isolation test blocks the release.
