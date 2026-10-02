# TutorTrack PRD v2.0 (text extract for Copilot)

Machine-extracted from `TutorTrack_PRD_v2.pdf` (24 Sep 2026). Search by requirement ID (for example `FR-SCH-03`) or section number. The PDF remains the authoritative copy; the diagrams in section 12 (architecture, data model) are images in the PDF and appear here only as their text labels.

~~~~text
PRODUCT REQUIREMENTS DOCUMENT

TutorTrack
The calm command centre for tutoring

A practice-management platform for independent WAEC, JAMB and NECO exam-
prep tutors, their students and the parents who pay for them: schedule, attend,
assign, grade, track progress, report and get paid, in one place.

VERSION                   2.0 (supersedes v1.0)

OWNER                     Emmanuel Eseyin

STATUS                    Front-end prototype built → production build planned

LAST UPDATED              24 September 2026

AUDIENCE                  Portfolio reviewers and hiring managers; collaborators; the author as a build guide

188                            28                          18                          7
functional requirements        non-functional              product modules             delivery phases
                               requirements

How to read this document. Requirements carry an ID ( FR-SCH-04 ), a priority, and a status.

   P0 = required for the first public release (MVP). P1 = v1.0 completeness. P2 = post-launch differentiators.
   Built = works in the current prototype. Partial = UI exists but is mocked or incomplete. New = not started.

Table of contents
 1. Executive summary                                        12. Architecture and data model
 2. Problem statement                                        13. Integrations
 3. Vision, goals and non-goals                              14. UX and design requirements
 4. Success metrics                                          15. Analytics and instrumentation
 5. Users and personas                                       16. Security, privacy and compliance
 6. Current state audit                                      17. Testing, CI/CD and environments
 7. Scope tiers                                              18. Roadmap and milestones
 8. Functional requirements                                  19. Portfolio readiness checklist
 9. Key flows and acceptance criteria                        20. Risks and mitigations
10. Non-functional requirements                              21. Assumptions and open questions
11. Technology stack                                         22. Appendices

1. Executive summary
TutorTrack is a practice-management platform for independent exam-prep tutors in Nigeria and the wider West
African market (WAEC, JAMB/UTME, NECO). It replaces the notebook + WhatsApp + bank-alert workflow with one
system that covers the full tutoring loop: schedule → attend → assign → grade → track progress → report to the
parent → get paid.

It serves three roles from one codebase:

   Tutors get an operating system for their practice: roster, calendar, assignment tracker, payments ledger, and
   scoped messaging.
   Students get a clear plan: what is next, what is due, and how they are tracking against the syllabus.
   Parents get a read-only window into attendance, work completed, progress, and payments, without having to ask
   the tutor.

                                                2
               1                                                                   3                               4
      Schedule session
                              →         Attend and mark        →           Assign work
                                                                                                 →       Student submits
                                           attendance

              ↑                                                                                                    ↓
            repeats

               8                                7                                  6                               5
         Invoice and          ←           Parent sees          ←          Progress and           ←       Tutor grades and
           payment                     progress and alerts              syllabus updated                  gives feedback

                                                 Figure 1 — The core tutoring loop

Where the project is today. A polished, responsive front-end prototype exists (landing page, three role dashboards,
dark mode, empty states, demo data). It runs entirely in the browser with localStorage : there is no backend,
authentication is simulated, and several actions are UI-only. This PRD defines how to take it from prototype to a
production-grade, deployable product that demonstrates full-stack engineering, not just UI craft.

What makes it portfolio-worthy. It solves a concrete local problem (see §2); it has real engineering depth (relational
data model with row-level security, atomic booking, webhook-driven payments, offline-tolerant attendance, child-data
privacy); and it can be demonstrated end to end in under five minutes.

2. Problem statement

2.1 Context
Exam preparation in Nigeria is a very large, high-stakes, and largely informal market.

 Exam                    2026 figure                                                    Source

 JAMB UTME               2,243,816 candidates registered, up 10.5% from about 2.03      Channels TV, 17 Apr 2026
                         million in 2025

 WAEC WASSCE             1,959,668 registered from 24,207 schools; 1,950,726 sat        WAEC briefing as reported by The Guardian
 (school candidates)                                                                    Nigeria, BusinessDay and allAfrica, Aug
                                                                                        2026

 WASSCE outcome          Only 61.54% earned five credits including English and Maths,   Same as above
                         so roughly 750,000 candidates (about 38%) did not reach
                         the benchmark

Two further trends matter for product design:

   Both bodies are moving to computer-based testing. JAMB is fully CBT, and WAEC reported that markedly more
   schools sat the 2026 WASSCE in CBT format. Practice must increasingly look like the real exam.
   A large share of candidates leave school-hours teaching behind for private, after-school tutoring, much of it
   delivered by independent tutors rather than tutorial centres.

   Caveat. These figures size the exam population, not the market for tutor software. The number of independent
   tutors, their willingness to pay, and average student load are unmeasured (see §21, Q1). For portfolio purposes
   the problem is credible; for a commercial launch it must be validated with primary research.

2.2 The problem as each persona experiences it
The workflow descriptions below come from the v1 PRD and the author's direct observation of how independent tutors
operate. They are hypotheses to be validated by interviews (§21, A1).

 Persona   What they do today                                  Where it breaks                        Consequence

 Tutor     Sessions live in a phone calendar or notebook.      Double-booked slots; forgotten or      Hours of unpaid admin each week;
           Assignments are sent and collected over             unmarked homework; no record of        lost revenue; no defensible
           WhatsApp. Progress is "in my head". Payments        who submitted what; unpaid             evidence of a student's progress
           are bank-transfer screenshots chased at month-      months discovered late.                heading into the exam.
           end.

 Parent    Pays, then asks the tutor for updates.              No visibility into attendance, work,   Anxiety, low trust, and churn ("is
                                                               or improvement without                 this money well spent?").
                                                               "hovering".

 Student   Gets instructions in a chat thread.                 Unclear what is due and what is        Missed deadlines, uneven
                                                               next; feedback is buried; no map       preparation, and last-minute
                                                               of the syllabus or of their own        cramming.
                                                               gaps.

2.3 Root causes
 1. Fragmented tooling. Five or more apps (calendar, WhatsApp, notes, bank app, spreadsheets) with no shared
    source of truth.
 2. Chat is not structure. WhatsApp has no concept of "due date", "submitted", "graded", or "balance owed".
 3. No data trail. Attendance, scores, and payments are not recorded in a form that can be summarised for a parent.
 4. A trust gap between payer and provider. The person paying (parent) cannot see the value delivered.
 5. Users are minors. Any solution must respect child-data privacy and keep parent–tutor–student visibility strictly
    scoped.

2.4 Why existing options fall short
 Alternative                            Gap

 WhatsApp + notebook + bank             Zero structure; not searchable; nothing summarisable for parents.
 alerts (status quo)

 Google Calendar / Sheets / Forms       No roles, no parent view, no payment or grading workflow; each tutor reinvents the system.

 Global tutor-management suites         Generally designed and priced for other markets; not built around WAEC/JAMB/NECO syllabi,
 and LMS platforms                      Naira, Paystack, or bank-transfer reality; heavy for a solo tutor.

 Tutor marketplaces                     Solve finding a tutor, not running a tutoring practice.

2.5 Product thesis and value proposition

   Give every independent tutor one calm place to run their practice, and give every parent proof that it is
   working.

   Tutor: "Spend less time on admin and get paid on time."

     Parent: "See attendance, progress, and payments without having to ask."
     Student: "Always know what's next, what's due, and where I stand before the exam."

3. Vision, goals and non-goals
Vision. The default operating system for independent exam-prep tutoring in West Africa: simple enough for a non-
technical tutor to adopt in a day, transparent enough for a parent to trust in a week.

3.1 Product goals
 #      Goal

 G1     Eliminate scheduling chaos: no double-booked slots; every change is confirmed by both sides.

 G2     Make assignment accountability total: every task has a tracked state from assigned to graded.

 G3     Make progress visible and defensible: attendance, syllabus coverage, and score trends per student.

 G4     Close the payment loop: clear balances, reminders, receipts, and in-app payment where wanted.

 G5     Give parents a trustworthy, read-only view and structured channel to the tutor.

 G6     Work in real Nigerian conditions: phone-first, low bandwidth, intermittent connectivity.

 G7     Protect minors' data by design: strict role scoping, least-privilege access, auditability.

3.2 Non-goals (v1)
     A tutor marketplace or discovery engine. TutorTrack serves tutors who already have students.
     Building video conferencing. Sessions link out to Google Meet or Zoom.
     Full LMS course authoring (SCORM, video hosting, course catalogues).
     Fully automated grading of subjective work. The tutor grades; AI may only draft (see §8.15).
     A school information system (timetabling, report cards for whole schools).
     Native mobile apps. A responsive PWA covers mobile until validated.

3.3 Design principles
 1. Calm over clever. Fewer screens, plain language, generous empty states.
 2. Parent-legible. Every number shown to a parent must be explainable in one sentence.
 3. Phone-first, offline-tolerant. Core actions survive a dropped connection.
 4. Tutor-in-the-loop. Software assists; the tutor teaches, grades, and decides.
 5. Privacy by default. Minors' data is private until explicitly shared, and visible only to the people who need it.

4. Success metrics

4.1 North-star metric
Completed tutoring loops per active tutor per week. A loop is one session that has attendance recorded and at
least one of: an assignment issued or graded, a progress note, or a payment recorded.

4.2 Product KPIs (targets: 6 months after public launch)
 Area                     Metric                                                                                  Target

 Activation               Tutors who add ≥3 students and schedule ≥1 session within 24 hours of signup            > 60%

 Scheduling               Sessions booked or rescheduled without off-platform back-and-forth                      > 80%

 Assignments              Assignments with a tracked submission state                                             100%

 Grading                  Median time from submission to grade                                                    < 48 hours

 Parent engagement        Linked parents who open the progress view at least weekly                               > 50%

 Payments                 Invoices settled on or before due date                                                  > 85%

 Retention                Tutors still active after 3 months                                                      > 60%

 Time saved               Self-reported admin hours saved per tutor per week                                      > 3 hours

4.3 Guardrail metrics
   Zero cross-tenant data exposure incidents (verified by automated RLS tests on every release).
   Payment reconciliation mismatches = 0 (every paid invoice matches a verified gateway event).
   Notification cost per active tutor stays under a defined monthly cap (§10, NFR-COST-01).
   Crash-free sessions > 99.5%.

4.4 Portfolio success criteria
These define "done" for the portfolio goal specifically. Full checklist in §19.

   Live deployed demo with seeded data and one-click role switching.
   Lighthouse ≥ 90 (Performance, Accessibility, Best Practices, SEO) on the landing page; ≥ 90 Accessibility on
   dashboards.
   CI pipeline green with unit, integration, RLS, and end-to-end tests.
   A README with architecture diagram, screenshots or GIFs, and a written case study.

5. Users and personas

5.1 Primary personas
Mr. Adewale, independent tutor. Teaches Physics and Chemistry for WAEC/JAMB to 15–40 students across several
schools, in one-on-one and small-group sessions. Manages everything by phone. Wants less admin, not another tool
to learn. Success looks like: a Monday-morning glance that shows today's sessions, who owes money, and what
needs grading.

Blessing, student (JAMB candidate, age 16–19). Attends after school, mostly on a phone with limited data. Needs to
know the next session, what is due, and how she is doing against the syllabus. Success looks like: opening the app
once a day and knowing exactly what to do.

Mrs. Nwachukwu, parent and payer. Wants to know whether her child is attending, keeping up, and improving,
without seeming to hover. Success looks like: a weekly summary that answers "is this working?" in ten seconds.

5.2 Secondary personas
Platform admin (the owner or support). Verifies tutors, resolves billing or access issues, monitors platform health.

Tutorial-centre owner (future, P2). Runs several tutors under one roof; needs a centre-level roster, revenue view,
and permissions.

5.3 Jobs to be done
 When…                                     I want to…                                         So that…

 I add a new student                       onboard them and their parent in minutes           I don't create every account by hand

 A session is coming up                    confirm it with both sides and get reminded        no one shows up at the wrong time

 I finish a session                        mark attendance and log what we covered            the parent and I have a record

 I set homework                            see who has and hasn't submitted                   I stop chasing people in chats

 The month ends                            see who owes what and send a reminder              I get paid without awkward conversations

 A parent asks "how is she doing?"         point them to a live view                          I don't write updates manually
 The exam is weeks away                    see which syllabus topics are still uncovered      I focus remaining sessions where they matter

6. Current state audit (as-built)
This section is based on a review of the repository ( smartprep/ , source files only). It is deliberately candid: a reviewer
will click through the demo, so the roadmap must close the gap between what the product says and what it does.

6.1 What exists today
 Area            Implemented                                                             Reality

 Landing         Hero, problem cards, per-role value sections, CTAs, scroll-reveal       Built. Copy promises more than the app delivers
 page            motion, dark mode                                                       (§6.2).

 Auth            Sign-up with role selector; sign-in; tutor CV upload field; role-       Partial. Any email and password is accepted; the
                 gated routes ( RequireRole )                                            session is a JSON blob in localStorage
                                                                                         ( tutortrack-user ); the CV file is never stored
                                                                                         (only name and size).

 Tutor space     Tabs: Overview, Schedule, Students, Assignments, Payments,              Partial. Fully functional for a single browser, but
                 Messages. Modals to add a student, session, and assignment.             no persistence beyond localStorage , no
                 One-click "mark graded". Add payment, mark paid, receipt                validation beyond required fields, no conflict
                 modal. Demo-data loader                                                 detection.

 Student         Tabs: My plan, Assignments, Messages                                    Partial. "Submit" only shows a toast. No feedback,
 space                                                                                   syllabus, or score views.

 Parent          Tabs: Overview, Assignments, Payments, Messages                         Partial. "Pay" shows "Payment flow would open
 portal                                                                                  here." "Alerts" only shows a toast.

 Messaging       Per-student threads with student and parent channels                    Partial. Sender identity is a display name string,
                                                                                         not a user ID.
 Cross-          Dark mode (persisted), toast system, error boundary and global          Built, and a real asset.
 cutting         error page, scrollable tabs, responsive dashboard shell, empty
                 states

 Design          CSS-variable tokens ( --bg-surface , --border-default , --              Built. Preserve and extend.
 system          text-secondary , primary and danger scales), shared primitives
                 ( Panel , Stat , Field , Modal , PrimaryButton ,
                  EmptyState )

 Persistence      localStorage store ( tutortrack-store )                                Prototype-only. Replaced in Phase 1.

6.2 Promised versus delivered
 Landing-page promise                                                  Reality

 "Schedule one-off and group sessions"                                 Sessions have a single student; no groups, no recurrence.

 Attendance tracked in "one calm place"                                No attendance feature exists.

 "See each student's progress at a glance"                             No progress, syllabus, or score model.

 "Follow syllabus progress and mock scores" (student)                  Not built.

 "Follow progress and score trends" (parent)                           Not built.

 "Submit work and review feedback" (student)                           Submit is a toast; no feedback field.

 "Confirm or propose a new time" (session)                             Toast only; no reschedule workflow.

6.3 Defects and technical debt
 ID    Finding                                                                         Impact                                   Fix in

 D1    Currency is hard-coded to $ ( money() in the tutor page) and demo               Undermines credibility for the target    Phase 0
       amounts are USD-scale, for a Naira-denominated market                           user

 D2    No real authentication; passwords are ignored; role is trusted from             Not deployable; role escalation is       Phase 1
       client storage                                                                  trivial

 D3    No data scoping: student and parent views read sessions,                        A "student" or "parent" sees every       Phase 1 (RLS)
       assignments, and payments from the entire shared store, and the                 family's data, which violates the
       student's Messages tab lets the user switch between any student's               core privacy requirement
       thread

 D4    Message identity is by display name ( from: "Mr. Adewale" ),                    Name collisions; not auditable           Phase 1
       compared as strings

 D5    Several actions are toast-only (student submit, parent pay, alert               Broken promises during a demo            Phases 2–4
       preferences, "Ask your tutor", open session)

 D6    Logo <Link href="/"> in DashboardShell uses a Next.js-style                     Minor navigation bug                     Phase 0
       prop; React Router expects to , so the logo likely resolves to the
       current route instead of /

 D7    Next.js leftovers in a Vite app: "use client" directives, an app/               Confusing structure for reviewers        Phase 0
       directory, error.jsx / global-error.jsx naming

 D8    Three overlapping codebases in one repo: tutortrack/ (Vite v1),                 A reviewer cannot tell which is          Phase 0
       tutortrack-v2/ (Next.js), and the repo root (Vite port of v2)                   canonical

 D9    Dependency hygiene: vite is not declared explicitly (resolves as a              Fragile installs; dead weight            Phase 0
       peer of the React plugin); package name is still tutortrack-v2 ;
       Recharts is installed but unused; two different linters across folders

 D10   Plain JavaScript, no types                                                      Higher regression risk once a real       Phase 1
                                                                                       API exists                               (incremental)

 D11   No tests, no CI, no root README (the only README is the Vite                    Fails a portfolio "engineering rigour"   Phase 0 →
       template boilerplate)                                                           screen                                   ongoing
 D12   Accessibility not audited (focus trapping in modals, keyboard support           Risk to AA compliance                    Phase 5
       for tabs, contrast in both themes)

7. Scope tiers

 Module             MVP (P0)                                               v1.0 (P1)                             Future (P2)

 Auth and           Email + password, roles, invite links, parent–         Phone OTP, Google sign-in,            Centre SSO
 accounts           child linking, RLS                                     tutor 2FA, tutor verification

 Module               MVP (P0)                                             v1.0 (P1)                             Future (P2)

 Students and         Roster, profiles, classes/groups, archive            CSV import, tags, bulk actions        Cross-tutor student records
 classes

 Scheduling           One-off + recurring sessions, conflict-free          Reminders, .ics export,               Self-booking page, waitlist
                      booking, group sessions, week/day calendar,          meeting links, availability rules
                      two-sided reschedule

 Attendance           Present / absent / late / excused; per-session       Attendance analytics, offline         Auto-attendance from
                      marking                                              queue                                 meeting links

 Assignments          Create, target student/class, submit                 Templates, resubmission,              Auto-marked MCQ;
                      (text/photo/file), grade, feedback, overdue flags    rubrics, bulk grading                 plagiarism hints

 Progress             Session notes, syllabus checklist, mock scores       Term report PDF, readiness            Weak-topic detection
                      + trend chart                                        score, exam countdown

 Payments             Fee plans, invoices, manual payment, receipts,       Paystack checkout + webhook,          Flutterwave, revenue
                      outstanding view                                     reminders, partial payments           analytics, payouts

 Messaging            Scoped threads (tutor↔︎student, tutor↔︎parent),      Attachments, read receipts,           WhatsApp bridge
                      system messages                                      class announcements

 Notifications        In-app + email                                       Web push, SMS (critical only),        WhatsApp templates
                                                                           digests, quiet hours

 Dashboards           Tutor overview, parent overview, student plan        At-risk flags, weekly digest          Centre-level analytics

 Practice and         —                                                    —                                     Question bank, timed CBT
 CBT                                                                                                             simulation, auto-graded MCQ

 AI assistance        —                                                    —                                     Tutor-approved drafts:
                                                                                                                 feedback, summaries,
                                                                                                                 practice questions

 Admin                Tutor verification queue, user lookup                Audit log viewer, support             Feature flags console
                                                                           tooling

 Platform             Responsive web, dark mode                            PWA, offline queue,                   i18n (Pidgin, Yoruba, Hausa,
                                                                           accessibility AA                      Igbo)

8. Functional requirements
Conventions: Pri = P0 / P1 / P2 (§7). Status = Built / Partial / New (§6). Requirements are written as testable
statements; the flows in §9 give acceptance criteria for the most critical ones.

8.1 Authentication and accounts ( FR-AUTH )
 ID              Requirement                                                                                        Pri      Status

 FR-AUTH-01      Users can register with email and password; email is verified before first sign-in                  P0       PARTIAL (UI
                                                                                                                             only)

 FR-AUTH-02      Users can sign in and out; sessions use short-lived tokens with refresh, managed by the             P0        PARTIAL
                 auth provider

 FR-AUTH-03      Users can reset a forgotten password via a time-limited email link                                  P0        NEW

 FR-AUTH-04      Each account has a role: tutor, student, parent, or admin. Roles are enforced by the                P0       PARTIAL (client
                 database (RLS), not just by client routing                                                                  only)

 FR-AUTH-05      Tutors can generate invite links/codes for a student or a class; invites can be single-use or       P0        NEW
                 multi-use, with expiry and revocation

 FR-AUTH-06      Accepting an invite creates or links the account and attaches it to the correct tutor, class,       P0        NEW
                 and student record

 ID            Requirement                                                                                         Pri      Status

 FR-AUTH-07    A parent can be linked to several children, and a child to several guardians; a link requires        P0       NEW
               confirmation by the tutor or the existing guardian

 FR-AUTH-08    Students under 18 cannot receive messages or share data until a guardian link exists;                P0       NEW
               guardian consent (with policy version and timestamp) is recorded

 FR-AUTH-09    Tutors upload a CV/credential to private storage at sign-up; admins review and mark the              P1       PARTIAL (file
               tutor verified or rejected with a reason                                                                     name only)

 FR-AUTH-10    Sign in with a phone number and one-time passcode                                                    P1       NEW

 FR-AUTH-11    Sign in with Google                                                                                  P1       NEW

 FR-AUTH-12    Tutors can enable TOTP two-factor authentication                                                     P1       NEW

 FR-AUTH-13    Users can view and revoke active sessions; idle sessions on shared devices time out                  P1       NEW

 FR-AUTH-14    A user can hold more than one role (for example, a tutor who is also a parent) and switch            P2       NEW
               between them

8.2 Onboarding and profiles ( FR-ONB )
 ID           Requirement                                                                                    Pri         Status

 FR-ONB-01    New tutors complete a short wizard: subjects, exam focus, session rate, timezone                 P0         NEW
              (default Africa/Lagos)

 FR-ONB-02    Student profile stores name, class/level, school, exam target (WAEC/JAMB/NECO),                  P0         PARTIAL (name,
              exam year, and subjects                                                                                    grade, note)

 FR-ONB-03    Parent profile stores name, phone, email, relationship, and contact preferences                  P0         NEW

 FR-ONB-04    Demo mode: a labelled sandbox with seeded data, one-click role switching, and reset;             P0          PARTIAL
              sends no real emails, SMS, or payments                                                                     ( loadDemoData )

 FR-ONB-05    A first-run checklist guides a tutor through "add a student → schedule a session → set           P1         NEW
              fees" and shows progress

 FR-ONB-06    Optional public tutor profile page (bio, subjects, verified badge; never any student data)       P2         NEW

8.3 Students and classes ( FR-STU )
 ID           Requirement                                                                                       Pri        Status

 FR-STU-01    Tutors can add a student manually or via invite link                                                  P0      PARTIAL (manual
                                                                                                                           only)

 FR-STU-02    The student list supports search, filters (status, exam, subject, class), and sorting                 P0      NEW

 FR-STU-03    A student detail page shows attendance %, assignment completion %, syllabus coverage,                 P0      NEW
              last note, balance, and next session

 FR-STU-04    Student status lifecycle: active → paused → completed → archived. Archived students are               P0      PARTIAL ("Active"
              hidden but retained                                                                                          only)

 FR-STU-05    Tutors can create classes (groups), add or remove members, and run class-level actions                P0      NEW
              (session, assignment, announcement)

 FR-STU-06    Private tutor notes per student are never visible to the student or parent                            P0      NEW

 FR-STU-07    A student can link to several tutors (for example, different subjects); each tutor sees only          P1      NEW
              their own data for that student

 FR-STU-08    Bulk import students from CSV with validation and a dry-run preview                                   P1      NEW

 FR-STU-09    Bulk actions on selected students: assign homework, message, invoice                                  P1      NEW

 FR-STU-10    Duplicate detection on name and phone when adding students                                            P2      NEW

8.4 Scheduling ( FR-SCH )
 ID           Requirement                                                                                      Pri      Status

 FR-SCH-01    Create a one-off session: student(s) or class, subject/topic, date, start and end, mode           P0       PARTIAL (one student,
              (in person or online), and location or meeting link                                                       topic, date, time)

 FR-SCH-02    Create recurring sessions (weekly on chosen days, with end date or count). Editing                P0       NEW
              offers "this session / this and following / all"

 FR-SCH-03    No double-booking: the database rejects overlapping sessions for the same tutor;                  P0       NEW
              the UI explains the conflict and suggests the nearest free slots
 FR-SCH-04    Group sessions with multiple participants and per-participant attendance                          P0       NEW

 FR-SCH-05    Day, week, and month calendar views for tutors; an agenda list on mobile and for                  P0       PARTIAL (list only)
              students/parents

 FR-SCH-06    Times are stored in UTC and displayed in the user's timezone (default Africa/Lagos)               P0       NEW

 FR-SCH-07    Session status: scheduled, confirmed, completed, cancelled, rescheduled, no-show                  P0       PARTIAL ("Scheduled")

 FR-SCH-08    Two-sided reschedule: either party proposes a new time; the other accepts,                        P0       NEW
              declines, or counters; the session moves only on acceptance; every step is recorded

 FR-SCH-09    Cancellation captures who cancelled and why; late-cancellation policy can flag the                P1       NEW
              session as chargeable

 FR-SCH-10    Reminders 24 hours and 1 hour before a session, per notification preferences                      P1       NEW

 FR-SCH-11    Availability rules ("Tue/Thu 4–6 pm") constrain session creation and feed self-booking            P1       NEW

 FR-SCH-12    Online sessions accept a Google Meet or Zoom URL (validated); a "Join" button                     P1       NEW
              appears 10 minutes before start

 FR-SCH-13    .ics export and a private, token-protected calendar feed URL                                      P1       NEW

 FR-SCH-14    Soft warning if a student is already booked at that time with another tutor on the                P1       NEW
              platform

 FR-SCH-15    Self-booking page: students/parents request slots from a tutor's availability; the tutor          P2       NEW
              approves

 FR-SCH-16    Waitlist for full group sessions; make-up credit when the tutor cancels                           P2       NEW

8.5 Attendance ( FR-ATT )
 ID            Requirement                                                                                                       Pri      Status

 FR-ATT-01     Tutor marks each participant present, absent, late, or excused, with an optional note                               P0      NEW

 FR-ATT-02     "Mark all present" then adjust exceptions                                                                           P0      NEW

 FR-ATT-03     Attendance percentage per student over rolling 30/90 days and per term                                              P0      NEW

 FR-ATT-04     Edits to attendance older than 7 days are audit-logged                                                              P1      NEW

 FR-ATT-05     Parent is alerted when a child is marked absent, respecting quiet hours                                             P1      NEW

 FR-ATT-06     Attendance marking works offline: queued locally and synced with idempotency keys                                   P1      NEW

 FR-ATT-07     Attendance export to CSV                                                                                            P1      NEW

8.6 Assignments and submissions ( FR-ASG )
 ID           Requirement                                                                                Pri         Status

 FR-ASG-01    Create an assignment: title, instructions, subject/topic tag, optional attachments          P0          PARTIAL (title, due date,
              (PDF/image), due date and time, maximum score, and target student(s) or class                          student)

 FR-ASG-02    Lifecycle: Draft → Assigned → Submitted → Graded, plus Returned (for                        P0          PARTIAL
              resubmission). Overdue is derived from the due date and state

 ID            Requirement                                                                            Pri     Status

 FR-ASG-03     Student submits by text, one or more photos (camera capture with on-device              P0      NEW (toast only)
               compression), or file upload (PDF, DOCX, image)

 FR-ASG-04     Each submission records a timestamp and is flagged late when past due                   P0      NEW

 FR-ASG-05     Tutor grades with a numeric score and written feedback; feedback is visible to the      P0      PARTIAL (one-click
               student and, per tutor setting, to the parent                                                  "graded", no score or feedback)

 FR-ASG-06     Grading queue sorted by age and due date, filterable by class and subject               P0      PARTIAL

 FR-ASG-07     Overdue assignments are flagged on tutor, student, and parent dashboards                P0      NEW

 FR-ASG-08     Uploads go to private storage; downloads use short-lived signed URLs; enforced          P0      NEW
               size limit (default 10 MB) and MIME allow-list

 FR-ASG-09     Scheduled release ("assign at 6 pm")                                                    P1      NEW

 FR-ASG-10     "Return for resubmission" keeps the version history of a submission                     P1      NEW

 FR-ASG-11     Rubrics: criteria with weights that compute the score                                   P1      NEW

 FR-ASG-12     Assignment templates; duplicate an assignment to another class                          P1      NEW

 FR-ASG-13     Structured past-question tags (exam board, year, subject, topic)                        P1      NEW

 FR-ASG-14     Bulk grade (same score) and reusable quick-comment snippets                             P1      NEW

 FR-ASG-15     Comment thread per submission between tutor and student                                 P1      NEW

 FR-ASG-16     Auto-graded multiple-choice assignments (see §8.8)                                      P2      NEW

8.7 Progress and syllabus ( FR-PRG )

      Explicitly out of scope: predicted exam grades. They imply false precision and can mislead families. The
      "readiness score" (FR-PRG-09) is a transparent indicator, not a prediction.

 ID            Requirement                                                                                    Pri      Status

 FR-PRG-01     Tutors define a syllabus per subject as a topic list (reusable template, copied per student)    P0       NEW

 FR-PRG-02     Per-student topic state: not started → taught → practised → mastered, each with a date          P0       NEW

 FR-PRG-03     Syllabus coverage percentage per subject                                                        P0       NEW

 FR-PRG-04     Session notes: topics covered, quick assessment (needs work / okay / strong), free text;        P0       NEW
               a per-note toggle makes it private or parent-visible

 FR-PRG-05     Log mock/CBT/past-question scores: test name, subject, score, maximum, date, type               P0       NEW

 FR-PRG-06     Score trend chart per subject with an optional target line                                      P0       NEW (Recharts
                                                                                                                       already installed)

 FR-PRG-07     Seeded syllabus templates for core JAMB/WAEC/NECO subjects, sourced from and                    P1       NEW
               attributed to the official published syllabi (a content workstream)

 FR-PRG-08     Weekly goals per student with check-off                                                         P1       NEW

 FR-PRG-09     Readiness indicator combining coverage, recent scores, attendance, and completion;              P1       NEW
               formula is visible and weights are tutor-adjustable

 FR-PRG-10     Exam countdown and pacing (topics remaining versus weeks left)                                  P1       NEW

 FR-PRG-11     Strength/weakness tags per topic, derived from grades and notes                                 P1       NEW

 FR-PRG-12     Termly progress report as a branded PDF containing only parent-safe fields                      P1       NEW

 FR-PRG-13     Expiring share link for a progress report                                                       P2       NEW

8.8 Practice and CBT simulation ( FR-PRC ) — all P2
Exam bodies are moving to computer-based testing, so practice should feel like the real thing.

 ID           Requirement                                                                                                   Pri    Status

 FR-PRC-01    Tutor-authored question bank (multiple choice): options, correct answer, explanation, topic, difficulty,       P2     NEW
              exam board and year

 FR-PRC-02    Import questions from CSV/JSON with validation                                                                 P2     NEW

 FR-PRC-03    Build a practice set or mock exam from the bank by topic, difficulty, and count (fixed or random draw)         P2     NEW

 FR-PRC-04    CBT simulation mode: countdown timer, question navigator, flag-for-review, auto-submit at time-out,            P2     NEW
              layout resembling the target computer-based exam

 FR-PRC-05    Auto-grading with per-topic analytics feeding the progress module                                              P2     NEW

 FR-PRC-06    Attempt review with the explanation for each question                                                          P2     NEW

 FR-PRC-07    Question and option shuffling; one active attempt at a time                                                    P2     NEW

 FR-PRC-08    Practice sets cached for offline use; results sync when back online                                            P2     NEW

 FR-PRC-09    Spaced-repetition queue that resurfaces previously missed questions                                            P2     NEW

 FR-PRC-10    Opt-in sharing of question banks between tutors, with moderation                                               P2     NEW

8.9 Payments and billing ( FR-PAY )
All amounts are in Naira (₦), stored as integer kobo. Card and bank details are never handled by TutorTrack; online
payment uses the gateway's hosted checkout.

 ID          Requirement                                                                                    Pri    Status

 FR-PAY-01   Fee plans: per session, monthly, per term, or a package of N sessions; per-student              P0     PARTIAL (amount and
             overrides and discounts (for example, siblings)                                                       month only)

 FR-PAY-02   Invoices with line items, due date, and status: draft, sent, partial, paid, overdue, void.      P0      PARTIAL (status: Due
             Monthly invoices can be generated automatically                                                       / Pending / Paid)

 FR-PAY-03   Record a manual payment (cash or transfer): amount, date, method, reference, and                P0     PARTIAL ("mark
             optional proof upload                                                                                 paid")

 FR-PAY-04   Invoices show the tutor's "pay to" bank details, since bank transfer is the dominant            P0     NEW
             payment method

 FR-PAY-05   Receipt with a unique number, viewable in-app and downloadable as PDF                           P0     PARTIAL (modal only)

 FR-PAY-06   Outstanding-balance dashboard: total, by student, and aging buckets (current, 1–7, 8–           P0     PARTIAL (total only)
             30, 30+ days)

 FR-PAY-07   Parents see only their own child's invoices and receipts                                        P0     NEW

 FR-PAY-08   Paystack checkout: the parent pays an invoice by card, bank, or USSD; the server                P1     NEW (parent "Pay" is a
             initialises the transaction; a signature-verified webhook marks the invoice paid                      toast)
             idempotently

 FR-PAY-09   Reconciliation: gateway events that match no invoice land in a review queue; every              P1     NEW
             state change is audit-logged
 FR-PAY-10   Partial payments with a running balance                                                         P1     NEW

 FR-PAY-11   Reminders before due, on due, and at intervals when overdue; tutors can mute per                P1     NEW
             family

 FR-PAY-12   Per-session plans accrue charges automatically when a session is marked completed               P1     NEW

 FR-PAY-13   Credits and manually recorded refunds                                                           P1     NEW

 FR-PAY-14   Revenue report: expected versus collected by month and subject; CSV export                      P1     NEW

 FR-PAY-15   Late-cancellation fees according to policy                                                      P2     NEW

 ID          Requirement                                                                                   Pri        Status

 FR-PAY-16   Flutterwave as a secondary gateway; additional currencies (GHS, USD)                              P2         NEW

8.10 Messaging ( FR-MSG )
 ID           Requirement                                                                                Pri        Status

 FR-MSG-01    Scoped threads only: tutor↔︎student, tutor↔︎parent, and tutor→class                         P0         PARTIAL (student and
              announcements. No student↔︎parent, student↔︎student, or unsolicited contact                           parent channels)

 FR-MSG-02    Messages reference user IDs, never display names                                            P0         NEW

 FR-MSG-03    Real-time delivery with optimistic UI and automatic retry                                   P1         NEW

 FR-MSG-04    Attachments (image, PDF) subject to the file policy in FR-ASG-08                            P1         NEW

 FR-MSG-05    System messages appear in-thread (session confirmed, assignment overdue,                    P1         NEW
              payment received)

 FR-MSG-06    Unread badges and read receipts                                                             P1         NEW

 FR-MSG-07    Tutor message templates ("session reminder", "payment reminder")                            P1         NEW

 FR-MSG-08    Report a message; admins review flagged content                                             P1         NEW

 FR-MSG-09    Guardian transparency: linked guardians can be granted read access to                       P1         NEW
              tutor↔︎student threads (default on for students under 16; see §21, Q5)

 FR-MSG-10    Soft delete with retention rules and export, consistent with §16                            P1         NEW

 FR-MSG-11    WhatsApp bridge for outbound reminders via a business API                                   P2         NEW

8.11 Notifications ( FR-NTF )
 ID          Requirement                                                                                            Pri       Status

 FR-NTF-01   In-app notification centre with read/unread state                                                       P0        NEW

 FR-NTF-02   Transactional email for key events                                                                      P0        NEW

 FR-NTF-03   Event catalogue: session created/changed/cancelled/reminder; absence marked;                            P0        NEW
             assignment assigned/due soon/overdue/graded; invoice issued/due/overdue/paid; message
             received; invite accepted

 FR-NTF-04   Web push for installed PWA users                                                                        P1        NEW

 FR-NTF-05   SMS for critical events only (session reminder, payment due), rate-limited and cost-capped              P1        NEW

 FR-NTF-06   Preference matrix (event × channel) and quiet hours (default 21:00–07:00)                               P1        PARTIAL (Alerts
                                                                                                                              button is a toast)

 FR-NTF-07   Weekly parent digest: attendance, work, progress, balance                                               P1        NEW

 FR-NTF-08   Tutor daily brief: today's sessions, work to grade, overdue payments                                    P1        NEW

 FR-NTF-09   Delivery log with retry and backoff; deduplication; unsubscribe links and consent records               P1        NEW

 FR-NTF-10   Per-tutor monthly cost cap with an alert when 80% is reached                                            P1        NEW

 FR-NTF-11   WhatsApp template notifications                                                                         P2        NEW

8.12 Tutor dashboard and reporting ( FR-DSH )
 ID           Requirement                                                                                                    Pri       Status

 FR-DSH-01    Overview: today's and this week's sessions, grading queue, outstanding total, active students                   P0       PARTIAL

 FR-DSH-02    Per-student quick view: attendance %, completion %, last note, balance                                          P0       NEW

 FR-DSH-03    At-risk flags (low attendance, overdue streak, falling scores) with a stated reason                             P1       NEW

 ID             Requirement                                                                                               Pri      Status

 FR-DSH-04      Monthly revenue: expected versus collected                                                                  P1         NEW

 FR-DSH-05      CSV export of attendance, payments, and scores                                                              P1         NEW

 FR-DSH-06      Global search across students, sessions, and assignments                                                    P1         NEW

 FR-DSH-07      Workload view: hours taught per week and subject                                                            P2         NEW

8.13 Parent portal ( FR-PAR )
 ID            Requirement                                                                              Pri      Status

 FR-PAR-01     Overview: next session, attendance %, assignment status, progress summary,                P0      PARTIAL
               balance

 FR-PAR-02     Multi-child switcher                                                                      P0      NEW

 FR-PAR-03     Attendance history with reasons                                                           P0      NEW

 FR-PAR-04     Assignments with grades and feedback, subject to tutor visibility settings                P0       PARTIAL (assignments
                                                                                                                 only)

 FR-PAR-05     Progress: syllabus coverage, score trend, and tutor notes marked parent-visible           P0      NEW

 FR-PAR-06     Payments: invoices, receipts, history; pay online (FR-PAY-08)                             P0      PARTIAL

 FR-PAR-07     Message the tutor via the scoped thread                                                   P0      PARTIAL

 FR-PAR-08     The portal is read-only for academic records; parents cannot edit attendance,             P0      NEW
               grades, or notes

 FR-PAR-09     Notification preferences (FR-NTF-06)                                                      P1      PARTIAL

 FR-PAR-10     Magic-link sign-in from digest emails for low-friction access                             P1      NEW

8.14 Student experience ( FR-STD )
 ID              Requirement                                                                                         Pri         Status

 FR-STD-01       "My plan": today, this week, and next session                                                            P0      PARTIAL

 FR-STD-02       Assignments grouped as due soon, overdue, submitted, graded (with feedback)                              P0      PARTIAL

 FR-STD-03       Submit work with camera, file, or text; save as draft                                                    P0      NEW

 FR-STD-04       Ask-tutor thread (FR-MSG-01)                                                                             P0      PARTIAL

 FR-STD-05       Syllabus map showing the student's own coverage and weak topics                                          P1      NEW

 FR-STD-06       Score trend, goals, and exam countdown                                                                   P1      NEW

 FR-STD-07       Data-saver mode: lower image quality, no auto-loaded media                                               P1      NEW

 FR-STD-08       Opt-in on-time-submission streaks; no public leaderboards for minors                                     P2      NEW

8.15 AI assistance ( FR-AI ) — all P2
Principles: assistive, not autonomous. AI drafts; the tutor reviews and approves. Content is labelled "AI-drafted" until
approved. Student-authored text is treated as untrusted input.

 ID          Requirement                                                                                                         Pri     Status

 FR-AI-01    Draft written feedback from the tutor's score and rubric; the tutor edits and sends                                  P2         NEW

 FR-AI-02    Draft a parent-friendly weekly summary from structured data; the tutor approves before it is sent                    P2         NEW

 FR-AI-03    Generate practice questions for a syllabus topic and difficulty; they enter the bank as "unreviewed" until a         P2         NEW
             tutor approves

 ID          Requirement                                                                                                         Pri    Status

 FR-AI-04    Suggest weak topics from scores and attendance, with the supporting rationale shown                                  P2     NEW

 FR-AI-05    Step-by-step explanations for approved questions, shown to students                                                  P2     NEW

 FR-AI-06    Guardrails: server-side calls only, PII redaction, prompt-injection defences, per-tutor rate and cost caps,          P2     NEW
             opt-in per tutor, audit log of requests

 FR-AI-07    Evaluation: a golden test set for every prompt, with additional checking of any mathematical output before           P2     NEW
             it is displayed

8.16 Admin console ( FR-ADM )
 ID               Requirement                                                                                              Pri         Status

 FR-ADM-01        Tutor verification queue: view credentials; approve or reject with a reason                               P0         NEW

 FR-ADM-02        User lookup; disable and enable accounts                                                                  P0         NEW

 FR-ADM-03        Read-only "view as user" for support, with an audit entry and a notice to the user                        P1         NEW

 FR-ADM-04        Audit log viewer: who accessed or changed what, and when                                                  P1         NEW

 FR-ADM-05        Moderation queue for reported messages and shared content                                                 P1         NEW

 FR-ADM-06        Platform metrics: sign-ups, activation, weekly active tutors, notification spend                          P1         NEW

 FR-ADM-07        Feature flags and in-app announcements                                                                    P2         NEW

 FR-ADM-08        Tutor subscription billing (if commercialised as SaaS)                                                    P2         NEW

8.17 Settings, privacy and data rights ( FR-SET )
 ID           Requirement                                                                            Pri   Status

 FR-SET-01    Profile and notification settings                                                       P0    NEW

 FR-SET-02    Theme: light, dark, or follow system                                                    P0    BUILT (toggle; add "system"
                                                                                                           option)

 FR-SET-03    Guardian consent records with policy version and timestamp                              P0    NEW

 FR-SET-04    Export my data (JSON/CSV)                                                               P1    NEW

 FR-SET-05    Delete my account with a grace period; guardians can request deletion of a              P1    NEW
              minor's data

 FR-SET-06    Retention rules for archived students, purge on request                                 P1    NEW

 FR-SET-07    Language: English at launch                                                             P0    BUILT

 FR-SET-08    Additional languages (Nigerian Pidgin, Yoruba, Hausa, Igbo)                             P2    NEW

8.18 Platform capabilities ( FR-PLT )
 ID           Requirement                                                                                  Pri    Status

 FR-PLT-01    Mobile-first responsive layouts that work down to 360 px width                                P0      PARTIAL

 FR-PLT-02    Empty, loading, and error states on every list and form                                       P0     PARTIAL (empty states
                                                                                                                  exist)

 FR-PLT-03    File service: upload, client-side image compression, MIME validation, quotas, signed          P0      NEW
              URLs

 FR-PLT-04    Public pages: landing, privacy policy, terms, contact                                         P0      PARTIAL (landing)

 FR-PLT-05    Installable PWA with a cached app shell and offline read of schedule and assignments          P1      NEW

 ID            Requirement                                                                          Pri   Status

 FR-PLT-06     Offline queue for attendance, submission drafts, and messages with idempotent sync    P1   NEW
               and conflict handling

 FR-PLT-07     Undo (toast) for destructive actions                                                  P1   NEW

 FR-PLT-08     Print-friendly receipts and reports                                                   P1   NEW

 FR-PLT-09     i18n framework in place (strings externalised)                                        P1   NEW

 FR-PLT-10     Keyboard shortcuts for common actions                                                 P2   NEW

9. Key flows and acceptance criteria
These flows are the highest-risk parts of the product. Each should have an automated test (§17).

9.1 Conflict-free booking (FR-SCH-03)
      Given a tutor has a session 16:00–17:00 on Thursday, when they try to create another session 16:30–17:30 the
      same day, then the save is rejected, the UI names the clashing session, and offers the nearest free slots.
      Given two browser tabs submit overlapping sessions at the same moment, then exactly one succeeds. This must
      be guaranteed by a database constraint, not by client-side checks.
      Back-to-back sessions (16:00–17:00 then 17:00–18:00) are allowed.

9.2 Two-sided reschedule (FR-SCH-08)
      Given a confirmed session, when the parent proposes a new time, then the session stays at its original time, the
      tutor is notified, and the request is visible as pending.
      When the tutor accepts, then the session moves atomically (subject to FR-SCH-03), all participants are notified,
      and the history records who proposed, who accepted, and when.
      When the tutor declines or counters, then the original time is retained and the requester is notified.
      A pending request expires after a configurable period (default 48 hours), and the session stays unchanged.

9.3 Assignment lifecycle (FR-ASG-02 to -07)
      Given an assignment is Assigned to a class of five students, then five independent submission records exist, each
      starting at "not submitted".
      When a student submits after the due time, then the submission is stored and flagged late.
      When the tutor grades with a score and feedback, then the student is notified; the parent sees the grade only if the
      tutor's visibility setting allows it.
      When the tutor returns a submission for resubmission, then the previous version is retained and the state
      becomes Returned.
      A student can never read another student's submission, and a parent can never edit one.

9.4 Online payment (FR-PAY-08, -09)
      Given an unpaid invoice, when the parent starts checkout, then the server creates the transaction and returns a
      gateway URL; the client never sees a secret key.
      When the gateway sends a webhook, then the server verifies the signature before parsing the body; invalid
      signatures are rejected and logged.

      When the same event is delivered twice, then the invoice is marked paid once, with a single receipt and a single
      notification (idempotent on the gateway reference).
      When the paid amount differs from the invoice, then the invoice is marked partial or the event goes to the
      reconciliation queue. It is never silently marked paid.
      Returning from the gateway's redirect page does not by itself mark an invoice paid; only the verified webhook (or a
      server-side verification call) does.

9.5 Data isolation (FR-AUTH-04, FR-PAR-07, FR-STU-07)
      Given Parent A is linked to Child A only, then every query for Child B's sessions, attendance, submissions, notes,
      invoices, and messages returns nothing, and direct-ID requests are denied.
      Given Tutor X and Tutor Y both teach Student S, then X cannot read Y's notes, invoices, or messages about S.
      Automated RLS tests assert these rules for every table and role on every release. A failing isolation test blocks the
      release.

9.6 Offline attendance (FR-ATT-06)
      Given the device is offline, when the tutor marks attendance, then the change is stored locally, shown as "pending
      sync", and survives an app restart.
      When connectivity returns, then pending changes sync in order using idempotency keys; retries never create
      duplicates.
      When the server has a newer edit for the same record, then the user is shown the conflict and chooses which
      version to keep.

9.7 Invite and guardian consent (FR-AUTH-05 to -08)
      Given a tutor creates a class invite, when a parent opens it, then they can create an account and link to the
      correct child without any tutor action.
      Given a student under 18 accepts an invite with no guardian link, then the account is created in a restricted state:
      no messaging and no data sharing until a guardian confirms.
      Expired, revoked, or fully used invites show a clear message and cannot be redeemed.

9.8 AI draft approval (FR-AI-02) — P2
      Given the tutor requests a parent summary, then a draft is generated from structured data and displayed labelled
      "AI-drafted".
      The draft is never sent to a parent until the tutor explicitly approves it, and any edits are preserved.
      A student's free text containing instructions ("ignore previous instructions…") does not change system behaviour or
      leak other students' data.

10. Non-functional requirements

 ID                Category       Requirement

 NFR-PERF-01       Performance    Largest Contentful Paint ≤ 2.5 s (p75) on a mid-range Android phone over Slow 4G

 NFR-PERF-02       Performance    Initial JavaScript ≤ 200 KB gzip for the landing route and ≤ 300 KB for each dashboard route, using
                                  route-level code splitting

 NFR-PERF-03       Performance    p95 API read latency ≤ 400 ms from Nigeria; lists use keyset pagination

 ID              Category          Requirement

 NFR-PERF-04     Performance       Image uploads compressed on-device before transfer (target ≤ 500 KB for a photo of handwritten
                                   work)

 NFR-REL-01      Reliability       ≥ 99.5% monthly availability for the deployed demo; ≥ 99.9% if commercialised

 NFR-REL-02      Reliability       Daily automated database backups; RPO ≤ 24 h, RTO ≤ 4 h; restore tested at least once before
                                   launch

 NFR-REL-03      Reliability       Core write paths (attendance, submissions, messages) tolerate offline periods and retry safely (FR-
                                   PLT-06)

 NFR-INT-01      Data integrity    Money stored as integer kobo; foreign keys and check constraints in the database; no orphaned
                                   records

 NFR-INT-02      Data integrity    Overlapping sessions for one tutor are impossible at the database level (exclusion constraint)

 NFR-INT-03      Data integrity    Externally triggered writes (webhooks, sync) are idempotent

 NFR-SEC-01      Security          Row-level security on every table holding user data; deny-by-default

 NFR-SEC-02      Security          Secrets only on the server (Edge Functions / CI); nothing sensitive in the client bundle

 NFR-SEC-03      Security          Rate limiting on auth, invites, uploads, and notification-triggering endpoints

 NFR-SEC-04      Security          OWASP ASVS L1 as the baseline; dependency and secret scanning in CI (details in §16)

 NFR-PRV-01      Privacy           Compliance with the Nigeria Data Protection Act 2023 (NDPA), with extra care for minors (details in
                                   §16)

 NFR-PRV-02      Privacy           Analytics and error tracking never capture message bodies, grades, or child names; session replay
                                   is disabled on student and parent screens
 NFR-A11Y-01     Accessibility     WCAG 2.2 AA; automated axe checks report zero serious or critical issues on core screens

 NFR-A11Y-02     Accessibility     Fully keyboard operable, including tabs, modals (focus trap and return), and menus; visible focus in
                                   both themes

 NFR-A11Y-03     Accessibility     Colour contrast meets AA in light and dark; prefers-reduced-motion disables non-essential
                                   animation

 NFR-COMP-01     Compatibility     Last two major versions of Chrome, Edge, Safari, and Firefox; Chrome on Android and Safari on iOS
                                   16+

 NFR-COMP-02     Compatibility     Usable at 360 px width; touch targets ≥ 44 px

 NFR-SCL-01      Scalability       Designed for 1,000 tutors and 40,000 students without re-architecture; indexes on all foreign keys
                                   and common filters

 NFR-OBS-01      Observability     Client and server error tracking, structured logs, uptime monitoring, and Core Web Vitals reporting

 NFR-OBS-02      Observability     Audit log for sensitive actions: role changes, impersonation, payment state changes, data exports,
                                   deletions

 NFR-MNT-01      Maintainability   TypeScript strict mode for new code; lint, format, and type-check enforced in CI; feature-based folder
                                   structure
 NFR-MNT-02      Maintainability   All schema changes via versioned migrations; environments reproducible from the repository

 NFR-LOC-01      Localisation      Naira formatting ( en-NG ), dates as DD/MM/YYYY, timezone Africa/Lagos by default

 NFR-COST-01     Cost              Portfolio deployment runs on free or low-cost tiers with a documented cost model; SMS and AI
                                   spend have hard per-tutor caps

11. Technology stack

11.1 Current stack (from the repository)
 Layer          Technology                                                    Notes

 UI library     React 19.2                                                    Function components and hooks

 Build tool     Vite                                                          Used via the React plugin; not declared explicitly in
                                                                              package.json (D9)

 Routing        React Router 7 ( react-router-dom )                           Client-side; BrowserRouter with role-gated routes

 Styling        Tailwind CSS 4 ( @tailwindcss/vite ) + CSS-variable           Light and dark themes
                design tokens

 Animation      Motion                                                        Used for scroll-reveal

 Icons          lucide-react
 Charts         Recharts                                                      Installed, not yet used

 Utilities      clsx

 State          React Context + localStorage                                  Separate contexts for auth, data store, theme, and toasts

 Backend        None                                                          Data lives in the browser

 Quality        ESLint 9                                                      No tests, no CI

11.2 Target stack
 Layer                   Choice                                                     Why

 Language                TypeScript (incremental migration, allowJs )               Types make the API and data-model contracts explicit;
                                                                                    a strong hiring signal
 UI                      React 19, Vite, React Router 7                             Already in place; see ADR-001

 Styling                 Tailwind CSS 4 + existing token system; accessible         Keeps the current look; adds tested focus and
                         primitives (Radix UI or Headless UI)                       keyboard behaviour for modals, menus, and tabs

 Server state            TanStack Query                                             Caching, retries, optimistic updates, and offline
                                                                                    persistence for a data-heavy app

 Forms and               React Hook Form + Zod                                      One schema shared by form validation and API types
 validation

 Dates and               date-fns (with timezone support) + rrule                   Correct Lagos-time handling and RFC 5545 recurrence
 recurrence

 Charts                  Recharts                                                   Already installed; used for score trends and revenue

 Database                PostgreSQL via Supabase                                    Relational fit (see §12); exclusion constraints for
                                                                                    booking; row-level security

 Auth                    Supabase Auth (email, magic link, Google; phone OTP        Managed, secure sessions; integrates with RLS
                         through an SMS provider)

 Authorisation           Postgres Row-Level Security policies                       Enforces tutor/parent/student isolation at the data layer
                                                                                    (ADR-003)

 File storage            Supabase Storage, private buckets, signed URLs             Submissions and CVs never publicly addressable

 Realtime                Supabase Realtime                                          Messaging and live status updates

 Server logic            Supabase Edge Functions (TypeScript/Deno) +                Payment webhooks, notifications, report generation,
                         pg_cron                                                    scheduled reminders

 Payments                Paystack (primary), Flutterwave (P2)                       Dominant local gateways; hosted checkout avoids
                                                                                    handling card data

 Layer                Choice                                                      Why

 Email                Resend (or similar transactional provider)                  Simple API, good deliverability

 SMS / WhatsApp       A Nigeria-focused provider such as Termii, or Twilio        Local delivery routes; critical-only usage to control cost

 Web push / PWA        vite-plugin-pwa (Workbox) + Web Push                       Installable, offline shell, notifications without an app
                                                                                  store

 Offline storage      IndexedDB (via Dexie)                                       Queue for attendance, drafts, and messages

 PDF                   @react-pdf/renderer (or pdf-lib in an Edge                 Receipts and progress reports
                      Function)

 AI (P2)              An LLM API (for example, the Claude API) called only        Keeps keys and student data server-side; provider-
                      from Edge Functions                                         agnostic wrapper
 Observability        Sentry (errors), PostHog or Plausible (privacy-safe         Matches NFR-OBS and NFR-PRV-02
                      analytics), uptime monitor

 Testing              Vitest, React Testing Library, MSW, Playwright, axe-        Unit, component, end-to-end, accessibility, and
                      core, pgTAP                                                 database-policy tests

 CI/CD                GitHub Actions; Vercel, Netlify, or Cloudflare Pages for    Preview deployments per pull request
                      the front end; Supabase CLI for migrations

 Code quality         ESLint, Prettier, Husky + lint-staged, Conventional         Consistent history and enforceable standards
                      Commits

11.3 Architecture decisions
 ADR       Decision                                 Rationale and trade-off

 ADR-      Keep the Vite SPA rather than            Dashboards are authenticated and gain nothing from SSR; the landing page can be
 001       returning to Next.js                     pre-rendered separately. The project already migrated from Next.js to Vite. Trade-
                                                    off: SEO for public pages needs a pre-render step.

 ADR-      Supabase (Postgres + Auth +              A solo developer ships faster and gets production-grade auth and RLS. Trade-off:
 002       Storage + Realtime) instead of a         less custom-backend showcase; mitigated by Edge Functions, SQL, and RLS
           hand-built Express API                   being non-trivial engineering (see 11.4 for the alternative).

 ADR-      Authorisation via RLS as the single      The core privacy rule (a parent sees only their child) is enforced even if a client bug
 003       source of truth                          or a forged request slips through. Trade-off: policies need careful design and
                                                    automated tests (§17).

 ADR-      No double-booking via a Postgres         Atomic and race-free, unlike check-then-insert in application code.
 004       exclusion constraint ( tstzrange +
           GiST)

 ADR-      Store money as integer kobo              Avoids floating-point errors; formatting handled in one utility.
 005

 ADR-      Offline-first queue for attendance,      Connectivity is unreliable in target conditions; idempotency keys make retries safe.
 006       drafts, messages

 ADR-      AI is human-in-the-loop and server-      Protects students, controls cost, and avoids unreviewed AI content reaching
 007       side only                                families.

 ADR-      Incremental TypeScript migration         New code is strict TypeScript; existing JSX converts feature by feature as it is
 008                                                touched.

11.4 Alternative: custom backend (Option B)
If the goal shifts toward demonstrating server engineering rather than shipping speed, replace Supabase with:

Node.js + NestJS (or Fastify) + Prisma + PostgreSQL + Redis (BullMQ for jobs) + S3-compatible storage +
Socket.IO, deployed on Railway, Render, or Fly.io.

                          Option A (Supabase)                                  Option B (custom API)

 Time to a working MVP    Faster                                               Slower (auth, storage, realtime built by hand)

 Authorisation model      RLS in the database                                  Guards and services in application code

 Showcases                SQL, RLS design, Edge Functions, security thinking   REST/GraphQL design, queues, service architecture

 Operational burden       Low                                                  Higher

Recommendation: Option A for the first release. It gets a verifiably secure product live sooner, and the SQL/RLS work
is itself strong portfolio evidence. Revisit Option B only if a specific requirement (heavy background processing, non-
Postgres data) demands it.

11.5 Proposed repository structure

   tutortrack/
   ├─ src/
   │ ├─ app/               # router, providers, layouts, route guards
   │ ├─ features/
   │ │ ├─ auth/ students/ scheduling/ attendance/ assignments/
   │ │ ├─ progress/ payments/ messaging/ notifications/ reports/
   │ │ └─ <feature>/       # api/ components/ hooks/ schemas/ tests/
   │ ├─ components/ui/     # Panel, Stat, Field, Modal, Tabs, EmptyState, ...
   │ ├─ lib/               # supabase client, query client, money, dates, i18n
   │ └─ styles/            # tokens, globals
   ├─ supabase/
   │ ├─ migrations/        # schema, constraints, RLS policies
   │ ├─ functions/         # paystack-webhook, send-notification, generate-report, ai-*
   │ ├─ tests/             # pgTAP RLS tests
   │ └─ seed.sql           # demo data
   ├─ e2e/                 # Playwright specs
   ├─ docs/                # PRD, ADRs, architecture, screenshots, case study
   └─ .github/workflows/   # ci.yml, e2e.yml, deploy.yml

12. Architecture and data model

12.1 System architecture

      Browser / PWA (React + Vite)                                                                                      UNTRUSTED

            Role dashboards               TanStack Query cache                      IndexedDB               Service worker
          tutor · student · parent ·                                                offline queue            cached app shell
                    admin

                       ⇅ Reads and writes (authorised by RLS) · auth sessions · signed-URL uploads · realtime updates

      Supabase                                                                     TRUST BOUNDARY: RLS + SERVER-SIDE SECRETS

                Auth                   PostgreSQL                 Storage                        Realtime      Edge Functions
                                       + Row-Level              private buckets
                                         Security

                                                                  pg_cron

      ⇅ Edge Functions call email, SMS and LLM APIs · Paystack sends signed webhooks to Edge Functions · browser redirects to
                                                             Paystack checkout

      External services

                 Paystack                      Email provider                     SMS / WhatsApp              LLM API (P2)
                                                                                      provider

                                           Figure 2 — System architecture and trust boundaries

Trust boundaries. The browser is untrusted. Every read and write is authorised by Postgres RLS. Anything involving
secrets, third parties, or money (payments, notifications, AI, PDF generation) runs only in Edge Functions.

12.2 Data model

                                                                                       PROFILE
                                                                                       id PK

                                                                                       role

                                                                                       full_name

                                                                                       phone

                                                                                       timezone

                                                                 extends                       extends

                                   TUTOR_PROFILE                            STUDENT_PROFILE
                                                                                                                   is parent in
                                   subjects, exam focus, rates              level, exam target, school

                                   owns          teaches              enrolled via                       is child in

               TUTOR_CLASS             ENROLLMENT                                                          GUARDIANSHIP
                                                                                     joins
               group of students       tutor ↔ student, per subject                                        parent ↔ child link + consent

                                     has

                                            CLASS_MEMBER
                                            student in a class

                                   Data model, part 1 of 4 — identity, guardianship and enrolment

                                                                             TUTOR_PROFILE · part 1
                                                                             subjects, exam focus, rates

                                                                                      runs        defines

                                                            SESSION
                                                            id PK

                                                            tutor_id FK
               STUDENT_PROFILE · part 1                     time_range (tstzrange)               SYLLABUS_TOPIC                        ENROLLMENT · part 1
               level, exam target, school                   status                               tutor-defined topics                  tutor ↔ student, per subject

                                                            mode

                                                            meeting_url

                                                            series_id

                                 attends         includes                 may have                            covered as          tracks                records

                 SESSION_PARTICIPANT
                 session_id FK
                                                        RESCHEDULE_REQUEST                          TOPIC_PROGRESS                         ASSESSMENT_RESULT
                 student_id FK
                                                        proposed time + decision                    state per student and topic            mock / CBT scores
                 attendance

                 marked_at

                                 may have

                    PROGRESS_NOTE
                    notes + visibility flags

                                               Data model, part 2 of 4 — sessions, attendance and progress

                                                                                 TUTOR_PROFILE · part 1                ENROLLMENT · part 1
                                                                                 subjects, exam focus, rates           tutor ↔ student, per subject

                                                                                                 sets                                  billed

                                                                                                                            INVOICE
                                                                                                                            id PK
                                  STUDENT_PROFILE · part 1                       ASSIGNMENT                                 enrollment_id FK

                                  level, exam target, school                     instructions, due date, targets            amount_kobo

                                                                                                                            due_date

                                                                                                                            status

                                                           makes                    receives                                           settled by

                                                         SUBMISSION
                                                         id PK                                                        PAYMENT
                                                         assignment_id FK                                             id PK

                                                         student_id FK                                                invoice_id FK

                                                         status                                                       amount_kobo

                                                         score                                                        method

                                                         feedback                                                     gateway_reference (unique)

                                                         submitted_at

                                                                    attaches

                                                        FILE
                                                        private storage object

                                                      Data model, part 3 of 4 — assignments and billing

                         MESSAGE_THREAD
                                                                                                                                     PROFILE · part 1
                         scoped conversation

                                includes                contains                                                                        receives        acts in

      THREAD_MEMBER                              MESSAGE                                                  NOTIFICATION                                 AUDIT_LOG
      participant in a thread                    body, sender_id, sent_at                                 in-app / email / push events                 append-only trail

                                                 Data model, part 4 of 4 — messaging and system tables

Crow’s-foot notation: a single bar is “exactly one”, a fork is “many”, and a circle means “optional”. The model is split into four views for
readability. Greyed boxes are defined in part 1.

Key schema rules

    No double-booking (ADR-004):

        create extension if not exists btree_gist;

        alter table sessions
          add constraint no_tutor_overlap
          exclude using gist (tutor_id with =, time_range with &&)
          where (status <> 'cancelled');

   Recurring sessions are stored as individual rows sharing a series_id , so the same constraint protects every
   occurrence.
   Money: amount_kobo integers; ₦ formatting only in the UI layer.

   Idempotent payments: unique (gateway_reference) on payments ; the webhook handler inserts or ignores.

   Time: all timestamps are timestamptz in UTC.

   Archive, don't delete: archived_at on students and classes; hard deletes happen only through the data-rights
   process.

   Audit log: append-only; written by the server; readable only by admins.

   Visibility flags: visible_to_parent and visible_to_student on notes, grades, and feedback, defaulting to
   private.

12.3 Authorisation matrix (RLS summary)
Deny by default. "Own" = rows the user created or that belong to them; "linked" = via enrollment or guardianship.

 Data                  Tutor                 Student                    Parent                               Admin

 Student profile       Read students         Read/update own            Read linked children                 Read via audited
                       enrolled with them                                                                    function

 Sessions              Full control of own   Read where a participant   Read where child is a participant    Read

 Attendance            Write for own         Read own                   Read linked child                    Read
                       sessions

 Assignments           Full control of own   Read those assigned to     Read those assigned to linked        Read
                                             them                       child

 Submissions           Read and grade for    Create/update own until    Read linked child's, respecting      Read
                       own assignments       graded; read own           visibility flags

 Progress notes,       Full control of own   Read only if               Read only if                         Read
 grades                                      visible_to_student         visible_to_parent

 Syllabus and topic    Full control of own   Read own                   Read linked child                    Read
 progress
 Invoices              Full control of own   No access                  Read linked child's                  Read

 Payments              Create manual; read   No access                  Read linked child's; gateway         Read
                       own                                              payments created server-side
                                                                        only

 Messages              Participants of the   Participants only          Participants only (plus guardian-    Only via moderation
                       thread only                                      transparency rule, FR-MSG-09)        of reported items

 Files (Storage)       Path-scoped to own    Path-scoped to own         Read linked child's, via signed      Read via audited
                       tutor ID              submissions                URL                                  function

 Audit log             None                  None                       None                                 Read

13. Integrations

 Integration       Purpose                Data exchanged                                             Failure handling

 Paystack          Online invoice         Server → gateway: initialise transaction (amount in        Webhook retries are safe
                   payment                kobo, invoice reference, parent email). Gateway →          (idempotent); unmatched events go to
                                          server: signed webhook ( charge.success and                the reconciliation queue; test-mode
                                          related events); the signature header is verified before   keys in all non-production
                                          the body is trusted                                        environments

 Email             Transactional          Recipient, template ID, minimal variables (no grades       Retry with backoff; log delivery status;
 provider          email, digests         in subject lines)                                          unsubscribe honoured

 SMS /             Critical reminders     Recipient number, short templated text                     Per-tutor cost cap; fall back to push
 WhatsApp          only                                                                              and in-app; log cost
 provider

 Google Meet       Online sessions        Meeting URL string only (no API access in v1)              URL validated (https scheme, allow-
 / Zoom                                                                                              listed hosts)

 Calendar          Subscribe to           Tokenised private feed of upcoming sessions                Token can be rotated; feed contains
 ( .ics )          sessions in phone                                                                 titles and times only
                   calendars

 LLM API (P2)      Drafts and practice    Redacted structured data; never raw identifiers or         Timeouts and fallbacks; feature
                   questions              contact details                                            degrades gracefully; cost caps

 Sentry /          Errors and product     Event names and non-identifying properties                 Client never blocks on telemetry
 analytics         metrics

14. UX and design requirements

14.1 Information architecture
 Role          Primary navigation

 Tutor         Overview · Schedule · Students · Classes · Assignments · Progress · Payments · Messages · Settings

 Student       My plan · Assignments · Progress · Messages · (Practice, P2)

 Parent        Overview (child switcher) · Attendance · Assignments · Progress · Payments · Messages

 Admin         Verification · Users · Moderation · Audit · Metrics

14.2 Critical screens
 1. Landing and sign-up (role-first), including invite acceptance
 2. Tutor overview ("Monday-morning view")
 3. Week calendar with conflict feedback and reschedule requests
 4. Session detail: attendance, notes, topics covered, follow-up assignment
 5. Student detail: attendance, syllabus map, score trend, balance
 6. Grading queue and submission review
 7. Invoices and outstanding-balance view
 8. Parent overview and weekly digest
 9. Student "My plan" and submission flow (camera-first on mobile)
10. Settings: notifications, privacy, data export

14.3 Design-system requirements
   Preserve the existing token system (CSS variables, primary/danger scales, light and dark themes) and shared
   primitives; extend rather than replace.
   Add accessible primitives: Tabs , Dialog (with focus trap and return), Menu , Tooltip , Toast (with undo),
   DataTable , Calendar , FileDropzone , Skeleton , OfflineBanner .
   Every async view has loading (skeleton), empty, error, and offline states, each with an action ("Add your first
   student").
   Forms validate inline and preserve input on error; destructive actions confirm or offer undo.
   Mobile: on phones, primary sections move to a bottom navigation bar; tables collapse to cards; the camera is the
   default submission input.
   Respect prefers-reduced-motion for the existing scroll-reveal animation.

14.4 Content and localisation requirements
   Use Nigerian academic terminology consistently: JSS1–JSS3, SS1–SS3, "Term", "Post-secondary / gap year"
   for JAMB repeaters. (The current demo data mixes in UK-style "Year 11", which should be corrected.)
   Currency as ₦12,500 ; dates as 24 Sep 2026 ; times in 12-hour format with a Lagos-time default.
   Plain, calm copy at roughly a secondary-school reading level; no jargon in parent-facing screens.
   Privacy microcopy where data is sensitive ("Only you and your child's tutor can see this").

14.5 Accessibility requirements
Meet NFR-A11Y-01 to -03. In addition: form controls have programmatic labels; status is never conveyed by colour
alone (badges include text); charts include a text or table alternative; modals return focus to the trigger.

15. Analytics and instrumentation
Principle: measure behaviour, never content. No message text, grades, child names, or contact details in any
analytics event; identifiers are opaque IDs. Session replay is disabled on student and parent screens (NFR-PRV-02).

15.1 Event taxonomy
 Event                                         Trigger                                  Non-identifying properties

 signup_completed                              Account created                          role, method

 student_added                                 Tutor adds a student                     source (manual, invite, import)

 session_created                               Session saved                            type (one-off, recurring, group), mode

 session_conflict_shown                        Booking rejected for overlap             –

 reschedule_requested / _resolved              Request created / accepted or declined   requester_role, outcome

 attendance_marked                             Attendance saved                         online or offline-queued

 assignment_created / _submitted / _graded     Lifecycle transitions                    target (student, class), late (bool)

 progress_logged                               Note, topic, or score saved              kind

 invoice_created / payment_recorded            Billing actions                          method (manual, gateway)

 parent_portal_viewed                          Parent opens a dashboard                 section

 digest_opened                                 Weekly digest link opened                channel

 Event                                           Trigger                                      Non-identifying properties

 offline_sync_completed                          Queue flushed                                items, conflicts

15.2 Funnels and dashboards
   Tutor activation: sign-up → first student → first session → first attendance → first invoice.
   Parent engagement: invite accepted → first portal view → four consecutive weekly views.
   Assignment health: assigned → submitted → graded (with time-to-grade distribution).
   Payments: invoice issued → paid on time / late / outstanding.
   Quality: Core Web Vitals, error rate, offline-sync failure rate.

16. Security, privacy and compliance

   This section describes engineering requirements. It is not legal advice; obtain qualified counsel before a
   commercial launch, especially for the data-protection items.

16.1 Threat model highlights
 Threat                                        Mitigation

 Broken access control / IDOR (one family      RLS on every table; automated cross-role tests (§9.5); no client-side role trust
 reads another's data)

 Forged payment confirmation                   Verify webhook signature before parsing; re-verify with the gateway server-side;
                                               ignore redirect-page claims

 Malicious uploads                             Size and MIME allow-list; private buckets; signed URLs; malware scanning (P1);
                                               never render user HTML

 XSS through messages, notes, and rich text    Escape by default; sanitise any rich text with a vetted sanitiser; strict Content
                                               Security Policy

 Credential stuffing and brute force           Provider rate limits, lockout, breached-password checks, tutor 2FA

 Invite or link enumeration                    Long random tokens; expiry; single-use option; rate limits on redemption

 Prompt injection (P2)                         Treat student text as data, never instructions; server-side templates; no tool
                                               access; human approval before anything is sent

 Secret leakage                                Secrets only in server environment and CI; secret scanning on every push; no
                                               secrets in the client bundle

 Vulnerable dependencies                       Automated dependency alerts and scans in CI; lockfile committed

 PII in logs                                   Structured logging with redaction; no message bodies or grades in logs

 Unsafe meeting URLs                           Validate scheme and allow-listed hosts; open with rel="noopener noreferrer"

16.2 Privacy and data protection (Nigeria Data Protection Act 2023)
   Lawful basis and consent. Students are frequently minors. Processing a minor's data requires recorded
   guardian consent (FR-AUTH-08, FR-SET-03), with the policy version and timestamp.
   Data minimisation. Collect only what the workflow needs; contact details are shown only to those who need them.
   Purpose limitation. Data is used to run tutoring, not for advertising. No sale or sharing of student data.
   Data-subject rights. Access, correction, export, and deletion (FR-SET-04 to -06), including guardian-initiated
   deletion for minors.

   Retention. Defined retention per data class; archived students purged on request or after a stated period.
   Breach response. A documented incident process, including notifying the regulator and affected people within the
   period the law requires (currently understood to be 72 hours; confirm with current NDPC guidance).
   Cross-border transfer. If the database region is outside Nigeria, document the safeguards relied on and disclose
   it in the privacy policy.
   Registration and assessment. Assess whether registration as a data controller or processor is required at launch
   scale, and complete a data-protection impact assessment because the service processes children's data.
   Transparency. Plain-language privacy policy and terms (FR-PLT-04), written for parents.

16.3 Safeguarding
   Tutors are verified (FR-AUTH-09) before their profile shows a verified badge.
   Communication is scoped (FR-MSG-01); no student-to-student or student-to-parent channels; guardian
   transparency available (FR-MSG-09).
   Any user can report a message or profile; admins review with an audit trail (FR-ADM-05).
   Contact details are not exposed between tutor and student beyond what a session requires.

16.4 Payment security
   Card and bank credentials are handled only on the gateway's hosted checkout; TutorTrack never sees or stores
   card data, which keeps PCI scope minimal.
   Tutor bank "pay to" details are stored encrypted and shown only on that tutor's invoices.
   All payment state changes are audit-logged (NFR-OBS-02).

16.5 Audit logging
Log actor, action, target, timestamp, and origin for: role or status changes, impersonation, payment state changes,
data exports, deletions, verification decisions, and changes to visibility settings.

17. Testing, CI/CD and environments

17.1 Test strategy
 Layer             Tooling                            Scope                                       Target

 Unit              Vitest                             Money, dates and recurrence, permission     ≥ 80% on lib/ and domain
                                                      helpers, validators                         logic

 Component         React Testing Library + MSW        Forms, modals, empty/error/offline states   Every shared primitive and
                                                                                                  each feature's main screen

 Database and      pgTAP                              Every table × role, including negative      100% of user-data tables;
 RLS                                                  cases; the exclusion constraint             blocks release on failure

 Integration       Local Supabase + Edge Function     Webhook signature and idempotency,          All Edge Functions
                   tests                              notification dispatch, cron reminders

 End-to-end        Playwright (desktop and a 360 px   The eight flows in §9                       Every flow green on every PR
                   mobile profile)

 Accessibility     axe-core in Playwright + manual    Core screens in both themes                 Zero serious/critical violations
                   keyboard and screen-reader pass

 Layer              Tooling                               Scope                                       Target

 Performance        Lighthouse CI + bundle-size           Landing and dashboards                      Budgets from NFR-PERF
                    budget

17.2 CI/CD pipeline
 1. On every pull request: install, lint, format check, type-check, unit and component tests, build, bundle-size check,
    secret and dependency scan.
 2. Database job: start local Supabase, apply migrations from scratch, run pgTAP.
 3. E2E job: run Playwright against a preview deployment with seeded data.
 4. Preview: deploy a per-PR preview of the front end.
 5. On merge to main : deploy to staging; run smoke tests; promote to production after approval; apply migrations
    with the Supabase CLI.

17.3 Environments
 Environment     Purpose                           Data                  Payments and messaging

 Local           Development (Supabase in          seed.sql demo         Emulated or test mode
                 Docker)                           data
 Preview         Per-PR review and E2E             Seeded                Test mode; outbound messages disabled

 Staging         Pre-release verification          Synthetic             Paystack test keys; messages to a sink

 Production      Live                              Real                  Live keys (or test mode for the public portfolio demo, clearly
                                                                         labelled)

17.4 Definition of Done
A change is done when it has: passing tests at the appropriate layers; RLS tests updated if data access changed;
accessibility checked; loading, empty, error, and offline states handled; analytics events added (if applicable);
documentation and any ADR updated; and no new lint, type, or audit warnings.

18. Roadmap and milestones

   Estimating assumption: one developer at roughly 15 hours per week. Durations are planning estimates, not
   commitments; scale them to your actual availability.

 Phase                  Weeks     Goal             Key deliverables                                             Exit criteria

 0. Prototype           1         One clean,       Fix D1 (₦ and Nigerian levels), D6, D7; consolidate to a     Single-app repo, CI
 hardening                        credible         single app (tag the old code, then remove tutortrack/        green, live URL
                                  codebase         and tutortrack-v2/ ); fix dependencies (declare vite ,
                                                   rename package, use or remove Recharts, one linter);
                                                   root README; LICENSE; .env.example ; CI running lint
                                                   + build; deploy the prototype so a live link always exists

 1. Foundation          2–4       Real users and   TypeScript setup; Supabase local + cloud; schema v1          Two real accounts can
                                  real data        (profiles, guardianship, enrollments, classes); RLS +        sign up; tests prove a
                                  isolation        pgTAP tests; real auth and password reset; invite flow;      parent cannot read
                                                   TanStack Query replaces the localStorage store; ID-          another child's data
                                                   based messaging schema; seed data

 Phase                 Weeks     Goal             Key deliverables                                             Exit criteria

 2. Core loop (MVP)    5–8       Schedule →       Scheduling (one-off, recurring, group, exclusion             Full loop works for all
                                 attend →         constraint, calendar, reschedule flow); attendance;          three roles; MVP
                                 assign →         assignments and submissions with upload and camera;          deployed
                                 grade, end to    grading with score and feedback; live tutor, student, and
                                 end              parent dashboards; notification centre + email; Playwright
                                                  for flows 9.1–9.3, 9.5, 9.7
 3. Progress and       9–11      Make progress    Syllabus and topic progress; session notes with visibility   A parent can answer
 parent portal                   visible and      flags; mock-score log; Recharts trends; complete parent      "is this working?" in
                                 defensible       portal; weekly digest; progress-report PDF; at-risk flags    ten seconds

 4. Payments and       12–14     Close the        Fee plans; invoices; manual payments; receipt PDFs;          Flow 9.4 green;
 communications                  money loop;      aging dashboard; Paystack (test mode) checkout +             reconciliation queue
                                 structured       idempotent webhook; reminders; realtime messaging            works
                                 messaging        with attachments; preference matrix; capped SMS

 5. Polish and         15–16     Ship and         PWA and offline queue; accessibility audit; performance      §19 checklist
 portfolio release               present          budgets; security review; error monitoring; admin basics     complete
                                                  (verification, user lookup); demo-mode polish;
                                                  documentation and case study; walkthrough recording

 6. Differentiators    Post-     Deepen value     Practice and CBT simulation; AI-assisted drafting (tutor-    Sequenced by pilot
                       launch    where demand     approved); centre/multi-tutor mode; self-booking;            feedback
                                 is proven        WhatsApp reminders; additional languages; Flutterwave

18.1 Cut lines (if time runs short)
Cut in this order, protecting the core loop and the security work:

 1. Phase 6 entirely; Flutterwave; additional languages
 2. SMS and WhatsApp (keep email, in-app, and push)
 3. Seeded official syllabus templates (keep tutor-defined syllabus)
 4. Rubrics, bulk grading, assignment templates
 5. PWA push notifications (keep the installable shell and the offline queue)

Never cut: RLS and its tests, the booking constraint, webhook signature verification and idempotency, guardian
consent, and accessibility basics.

19. Portfolio readiness checklist
Product

         Live URL that loads fast on mobile, with a one-click demo mode (role switcher, seeded Nigerian data, reset)
         No toast-only buttons anywhere on the demo path

         Payments clearly labelled "test mode" in the demo; no real messages sent from demo accounts

         Empty, loading, error, and offline states all present

Engineering

         CI badge (lint, types, unit, RLS, E2E) visible in the README

         RLS test suite passing; test names readable as documentation of the privacy model
         Coverage and Lighthouse scores published in the README

         TypeScript strict on all new code; zero lint and type warnings

         Secret scan clean, including git history (rotate anything that ever leaked)

         Accessibility: zero serious/critical axe issues; keyboard and screen-reader spot check

Documentation

         README with hero screenshot or GIF, feature list, architecture diagram, ER diagram, and a setup guide that
      works in under ten minutes

          docs/ folder with this PRD, ADRs, and a "known limitations" section

         Environment-variable reference and a description of each Edge Function

Presentation

         A 2–3 minute walkthrough video following the loop: schedule → attend → assign → grade → parent view →
      pay
         Portfolio case study covering: the problem and evidence, users, key decisions and trade-offs, the hardest
      problems and how you solved them, results, and what you would do next

          Repository hygiene: tagged releases ( v0.1.0 and up), meaningful commit history, issues and milestones
      mirroring §18

Four engineering stories worth telling (each maps to a requirement above, and each is a good interview answer):

 1. Race-free booking with a Postgres exclusion constraint instead of client-side checks (§9.1, ADR-004).
 2. Designing RLS so that a parent, a student, and two competing tutors each see exactly what they should, proven by
    tests (§9.5, §12.3).
 3. Idempotent payment webhooks with signature verification and a reconciliation queue (§9.4).
 4. Offline-tolerant attendance with a local queue, idempotency keys, and conflict resolution (§9.6).

Résumé bullets (fill in with your real measured numbers):

      Built a full-stack PWA for independent WAEC/JAMB tutors (React, TypeScript, Supabase/PostgreSQL) that unifies
      scheduling, attendance, assignments, progress, and payments for tutors, students, and parents.
      Designed a row-level-security model and automated policy tests enforcing strict data isolation for minors' records
      across four roles.
      Implemented race-free session booking (Postgres exclusion constraints) and idempotent Paystack webhook
      processing; achieved Lighthouse scores of [X] and [Y]% test coverage.

20. Risks and mitigations

 #       Risk                                     Likelihood   Impact   Mitigation

 R1      Scope creep (a solo developer facing a   High         High     Phased plan (§18), P0/P1/P2 discipline, explicit cut lines
         very large feature set)

 R2      RLS misconfiguration exposes another     Medium       Severe   Deny-by-default; pgTAP tests for every table and role; never
         family's data                                                  ship the service-role key to the client; policy review before
                                                                        each release

 R3      Children's data compliance (NDPA)        Medium       High     Guardian consent, data minimisation, retention rules (§16);
                                                                        synthetic data in all demos; counsel before commercial
                                                                        launch
 R4      Payment errors (double credit,           Medium       High     Signature verification, idempotency on the gateway
         mismatch, forged confirmation)                                 reference, reconciliation queue, test-mode isolation,
                                                                        dedicated tests

 #      Risk                                         Likelihood    Impact     Mitigation

 R5     Adoption unproven: the problem               Medium        Medium     Interview 5–10 tutors and pilot with 2–3 before claiming
        hypotheses may not match real tutors                                  impact; capture real quotes for the case study

 R6     Offline sync complexity                      Medium        Medium     Limit offline scope to attendance, drafts, and messages;
                                                                              idempotency keys; visible conflict UI; test under network
                                                                              throttling

 R7     SMS/AI cost overrun                          Medium        Medium     Push-first, SMS for critical events only, per-tutor caps and
                                                                              alerts (NFR-COST-01)

 R8     Free-tier limits (paused projects,           Medium        Medium     Health-check pings, quota monitoring, upgrade the tier
        quotas) break the live demo                                           before sharing the portfolio widely

 R9     Syllabus content accuracy or                 Medium        Medium     Tutor-defined syllabus first; seeded templates only from
        licensing                                                             official published syllabi, with attribution and tutor editing

 R10    Vendor lock-in (payments, messaging)         Low           Medium     Thin provider-adapter layer; gateway-specific code isolated
                                                                              in Edge Functions

 R11    Accessibility debt                           Medium        Medium     Built into the Definition of Done; axe in CI; audit in Phase 5

 R12    Demo confusion (demo data mistaken           Low           Medium     Persistent "demo" banner, scheduled resets, no outbound
        for real, or real data entering demo)                                 messages, no real PII

 R13    Date, time, and recurrence bugs              Medium        Medium     UTC storage, a tested recurrence library, table-driven tests
                                                                              for edge cases

21. Assumptions and open questions

21.1 Assumptions
 #     Assumption                                                                                     How to validate

 A1    Independent tutors run their practice on a notebook, WhatsApp, and bank alerts (from           5–10 tutor interviews
       the v1 PRD and the author's observation)

 A2    Tutors, parents, and students are phone-first with intermittent data                           Interviews; analytics device split after
                                                                                                      launch

 A3    Bank transfer remains the dominant payment method, so manual recording is P0                   Interviews; payment-method analytics

 A4    Parents will accept an invite-link flow; email may not be universal, so phone OTP could        Interview parents; watch invite-
       move earlier                                                                                   acceptance funnel
 A5    Supabase's free or low tier is enough for the portfolio deployment                             Usage monitoring

 A6    Paystack test mode is acceptable for demonstration; live use needs the gateway's               Confirm current Paystack onboarding
       business verification                                                                          requirements

21.2 Open questions
 #      Question                                                                      Why it matters

 Q1     How many independent tutors exist in target cities, how many students         Determines whether this is a portfolio piece only or a
        does each carry, and what would they pay?                                     viable business

 Q2     Commercial model: portfolio only, flat SaaS, tiered by student count, or      Affects the admin role, billing module, and tenancy
        B2B2C for tutorial centres? (carried from v1)                                 model

 Q3     Do students need their own logins, given shared phones? A "parent-            Changes onboarding and privacy design
        managed student" mode may fit better

 Q4     Which exam board first for seeded syllabus templates: JAMB only, or           Content workload and launch focus
        WAEC and NECO as well?

 #       Question                                                                    Why it matters

 Q5      Guardian-transparency default and age threshold (for example, on for        A policy decision with safeguarding implications
         under-16s)?

 Q6      Multi-tutor-per-student in the MVP or later? The schema supports it; the    Scope control
         UI could wait

 Q7      Final product name: TutorTrack (code, UI, landing page) or SmartPrep        Domain, branding, and README must agree before
         (repository folder)?                                                        launch
 Q8      Which database region, and how is cross-border transfer documented?         NDPA disclosure and latency from Nigeria

 Q9      How much progress data is structured versus free-form? (carried from        Over-structuring feels like busywork; under-
         v1)                                                                         structuring makes the parent view thin

 Q10     Should the platform ever take a fee on in-app payments?                     Monetisation, and added legal and reconciliation
                                                                                     complexity

22. Appendices

Appendix A — Glossary
 Term                  Meaning

 WAEC /                West African Examinations Council / West African Senior School Certificate Examination
 WASSCE

 NECO / SSCE           National Examinations Council / Senior School Certificate Examination

 JAMB / UTME           Joint Admissions and Matriculation Board / Unified Tertiary Matriculation Examination

 CBT                   Computer-based testing

 JSS / SS              Junior Secondary School / Senior Secondary School (levels 1–3 each)

 RLS                   Row-Level Security: database rules deciding which rows each user may read or write

 Idempotent            An operation that has the same effect whether applied once or many times (essential for webhooks and offline
                       sync)

 Kobo                  One hundredth of a Naira; the integer unit used to store money

 PWA                   Progressive Web App: an installable, offline-capable web app

 RPO / RTO             Recovery Point / Recovery Time Objective for backups and restores

 NDPA / NDPC           Nigeria Data Protection Act 2023 / Nigeria Data Protection Commission

 ADR                   Architecture Decision Record

Appendix B — Changes from the v1 PRD
 Area               v1.0                               v2.0                                           Reason

 Stage              Pre-build discovery                Prototype built; production plan               The front end now exists; the PRD
                                                                                                      had to reflect reality

 Framing            Commercial SaaS for tutors         Portfolio-first, commercial-ready              The stated goal is a portfolio project;
                                                                                                      commercial options remain open
                                                                                                      (Q2)

 Requirements       Module descriptions                ID'd, prioritised, status-tracked              Testable and traceable
                                                       requirements with acceptance criteria

 Area             v1.0                              v2.0                                        Reason

 Stack            React + TypeScript,               Vite + React + TypeScript, Supabase         Drops a custom Express layer for
                  Node/Express, Supabase, FCM,      (RLS, Edge Functions), Paystack,            speed and stronger security (ADR-
                  Twilio                            Resend, provider-agnostic SMS, PWA          002, ADR-003); Option B
                                                    push                                        documented

 Privacy          One line on data isolation        Full section: RLS matrix, NDPA, guardian    Users are minors
                                                    consent, safeguarding, audit
 Data integrity   "Atomic booking"                  Exclusion constraint, idempotent            Concrete, testable mechanisms
                                                    webhooks, integer money

  NEW             –                                 Current-state audit, defect list, CBT       Coverage needed to ship and to
                                                    practice, AI (human-in-the-loop), admin     present
                                                    console, analytics plan, CI/CD, portfolio
                                                    checklist

 Kept             Personas, six core flows, phase   Same, refined                               Sound and still valid
                  ordering (core → progress →
                  payments → growth)

Appendix C — Sources for market figures
   JAMB UTME 2026: 2,243,816 registered candidates, up 10.5% from about 2.03 million in 2025 — Channels TV,
   "JAMB to release 2026 UTME first day results today", 17 April 2026. The 2025 figure of 2,030,627 was reported by
   Gazette Nigeria from JAMB's weekly bulletin, March 2025.
   WAEC WASSCE 2026 (school candidates): 1,959,668 registered from 24,207 schools; 1,950,726 sat; 1,200,514
   (61.54%) obtained five credits including English Language and Mathematics — WAEC Nigeria briefing, as reported
   by The Guardian Nigeria, BusinessDay, and allAfrica, August 2026. The "about 750,000 (38%)" figure is derived:
   1,950,726 − 1,200,514 = 750,212.
   CBT trend: WAEC's 2026 computer-based WASSCE reporting (Headteacher.ng, News Central TV) noted that
   more schools adopted the computer-based format than in previous years.

Verify these figures again before publishing, as official numbers can be revised.

Appendix D — Requirements summary
 Module                                                                                 P0       P1          P2         Total

 8.1 Authentication and accounts                                                        8        5           1          14

 8.2 Onboarding and profiles                                                            4        1           1          6

 8.3 Students and classes                                                               6        3           1          10

 8.4 Scheduling                                                                         8        6           2          16

 8.5 Attendance                                                                         3        4           0          7

 8.6 Assignments and submissions                                                        8        7           1          16

 8.7 Progress and syllabus                                                              6        6           1          13
 8.8 Practice and CBT simulation                                                        0        0           10         10

 8.9 Payments and billing                                                               7        7           2          16

 8.10 Messaging                                                                         2        8           1          11

 8.11 Notifications                                                                     3        7           1          11

 8.12 Tutor dashboard and reporting                                                     2        4           1          7

 8.13 Parent portal                                                                     8        2           0          10

 8.14 Student experience                                                                4        3           1          8

 Module                                                                      P0        P1       P2        Total

 8.15 AI assistance                                                          0         0        7         7

 8.16 Admin console                                                          2         4        2         8

 8.17 Settings, privacy and data rights                                      4         3        1         8

 8.18 Platform capabilities                                                  4         5        1         10

 Total                                                                       79        75       34        188

Implementation status of the 188 functional requirements today: 2 built, 34 partial (UI exists but is mocked or
incomplete), 152 not started. Plus 28 non-functional requirements in §10.

The gap is the point: the prototype proves the UX; the roadmap in §18 delivers the substance behind it.

End of document.
~~~~
