# Product Requirements Document: TutorTrack

**Version:** 1.0 (Draft)
**Owner:** Emmanuel Eseyin
**Positioning:** A full operating system for independent exam-prep tutors (WAEC/JAMB/NECO-style) — scheduling, assignments, progress tracking, parent visibility, and payment collection in one place. Not a lite scheduling widget; covers the tutor's entire student-management workload.
**Status:** Discovery / Pre-build

---

## 1. Problem Statement

Independent exam-prep tutors (not attached to a large tutorial center) run their entire practice manually: student schedules live in a personal calendar or notebook, assignments are shared and collected via WhatsApp with no tracking of who submitted what, progress exists only in the tutor's head, and payment collection is a monthly chase of bank transfer screenshots. Parents — who are usually the ones paying and the most anxious about outcomes — have zero visibility into whether their child is attending, keeping up, or actually improving, and have to ask the tutor directly for updates.

As a tutor's student count grows past a handful, this manual system breaks down: double-booked sessions, forgotten assignments, missed payments, and no defensible record of a student's progress heading into WAEC/JAMB/NECO.

**Product thesis:** Give independent tutors a single tool that replaces the notebook + WhatsApp + bank alert workflow — covering the full loop from scheduling a session to showing a parent measurable progress — while staying simple enough for a non-technical tutor to run solo.

---

## 2. Goals & Success Metrics

| Goal | Metric | Target (6 months post-launch) |
|---|---|---|
| Reduce scheduling chaos | % of sessions booked/rescheduled without a manual back-and-forth message | > 80% |
| Assignment accountability | % of assigned tasks with a tracked submission status (vs. untracked) | 100% (tracking is core, not optional) |
| Parent engagement | % of parent accounts that check the progress view at least weekly | > 50% |
| Payment collection reliability | % of sessions/months with on-time recorded payment | > 85% |
| Tutor retention on platform | Tutors still active after 3 months | > 60% |
| Time saved | Tutor-reported admin time saved per week (survey) | > 3 hours/week |

**Non-goals for v1:** a tutor-discovery marketplace (matching new tutors to new students) — this is a practice-management tool for tutors who already have their student base; live video conferencing infrastructure (integrate with existing tools like Zoom/Google Meet rather than building it); automated grading/AI tutoring (tutor still does the teaching and grading); full LMS course authoring (this isn't a course platform, it's a coordination tool around live tutoring).

---

## 3. Personas

**1. Mr. Adewale — Independent Tutor**
Teaches WAEC/JAMB prep (e.g. Physics, Chemistry) to 15-40 students across different schools, some one-on-one, some small groups. Juggles schedules manually, sends assignments over WhatsApp, tracks payment in a notebook. Wants less admin, not more software to learn.

**2. Blessing — Student**
JAMB candidate, attends sessions after school, needs to know when her next session is, what's due, and how she's tracking against the syllabus.

**3. Mrs. Nwachukwu — Parent**
Pays for her child's tutoring, wants to know: is my child attending, are they keeping up, is this money well spent — without having to ask the tutor directly and risk seeming like she's hovering.

**4. Admin (platform, if multi-tutor tenant model) — Emmanuel's internal ops**
Onboards tutors, handles billing/subscription issues, monitors platform health. (Only relevant if TutorTrack is sold as a hosted SaaS to many tutors — see Section 9.)

---

## 4. End-to-End User Flows

### 4.1 Tutor onboarding & setup
1. Sign up (phone/email + OTP)
2. Set up profile: subjects taught, exam focus (WAEC/JAMB/NECO/other), session rate (per session or per package)
3. Add students: name, parent contact, subject(s), current level/exam year — manually, or via a shareable "join my class" invite link/code that a parent or student uses to self-register
4. Set recurring availability (e.g. "Tuesdays and Thursdays, 4-6pm") or add one-off sessions

### 4.2 Scheduling flow
1. Tutor creates a session: student(s) (1-on-1 or group), subject, date/time, recurring or one-off
2. Student/parent receives a notification (push/SMS) confirming the session
3. Reschedule: either party proposes a new time; the other confirms — no session moves without both-side confirmation, avoiding the "I thought we agreed" disputes
4. Attendance: tutor marks each student present/absent/late at or after session time — this becomes the attendance record parents see

### 4.3 Assignment flow
1. Tutor creates an assignment: subject, description, optional attached file/past-question PDF, due date, assigned to one student or a group
2. Student sees assignment in their view, can mark "submitted" and attach their work (photo of written work, file upload, or text answer)
3. Tutor reviews submission, marks graded/score, leaves feedback
4. Overdue assignments auto-flag on both the tutor's and parent's dashboard

### 4.4 Progress tracking flow
1. Tutor logs a quick per-session note: topics covered, syllabus checkpoint reached, informal assessment (e.g. "strong," "needs review")
2. Optional structured progress markers: syllabus completion % per subject (tutor sets the syllabus outline once, checks off topics as covered)
3. Mock test / CBT practice scores can be logged per test, building a score trend over time
4. All of this rolls up into a per-student progress view

### 4.5 Parent view flow
1. Parent gets an invite (from tutor or student) to a read-only linked account
2. Parent dashboard shows: upcoming sessions, attendance history, assignment completion rate, progress notes/syllabus %, mock test score trend, payment status/history
3. Parent can message the tutor directly through the platform (structured, not raw WhatsApp) and receives auto-notifications for missed sessions, overdue assignments, or payment due dates

### 4.6 Payment flow
1. Tutor sets pricing: per-session rate or a package (e.g. monthly, term-based)
2. Payment tracking: tutor can mark a payment received manually (cash/bank transfer, common in this market) or accept in-app payment via Paystack/Flutterwave
3. Auto-generated payment reminders to parent before a session block starts or when a balance is due
4. Simple invoice/receipt generated per payment for the parent's record
5. Tutor dashboard shows outstanding balances across all students at a glance

---

## 5. Feature Requirements by Module

### 5.1 Authentication & Roles
- Phone/email + OTP
- Roles: Tutor, Student, Parent (a parent account can link to multiple children/students; a student can be linked to multiple tutors if they take multiple subjects from different tutors)
- Invite-link/code based self-registration for students and parents (tutor doesn't have to manually create every account)

### 5.2 Student & Class Management
- Student profile: name, exam target (WAEC/JAMB/NECO), subjects, school, linked parent(s)
- Group/class support: a session can involve one student or a defined group
- Bulk actions: assign homework to a whole group at once, message a whole group

### 5.3 Scheduling
- Recurring availability rules + one-off session creation
- Atomic booking to prevent double-booking a tutor's time slot
- Two-sided confirmation for reschedules/cancellations
- Calendar view (day/week) for the tutor; simplified upcoming-sessions list for student/parent
- Reminders: push/SMS 24h and 1h before a session

### 5.4 Assignments
- Create assignment with attachments (PDF, image, text prompt), due date, target student(s)/group
- Submission tracking: not submitted / submitted / graded, with timestamp
- File upload for submissions (photo of handwritten work is the realistic default in this market)
- Grading + feedback field, visible to student and parent

### 5.5 Progress & Syllabus Tracking
- Tutor-defined syllabus checklist per subject (reusable template across students taking the same subject)
- Per-session topic-covered logging, checked off against the syllabus
- Mock test/CBT score logging with a trend view over time
- Informal per-session assessment notes (private to tutor, or shareable with parent — tutor's choice per note)

### 5.6 Parent Portal
- Read-only (by default) dashboard: attendance, assignments, progress/syllabus %, score trend, payment status
- Direct messaging thread with the tutor
- Notification preferences (what to be alerted about: missed session, overdue assignment, payment due, weekly summary digest)

### 5.7 Payments
- Manual payment marking (cash/transfer) with note/reference
- Optional in-app payment via Paystack/Flutterwave
- Auto-reminders for upcoming/overdue payments
- Simple receipt generation per payment
- Outstanding balance dashboard across all students, sortable by how overdue

### 5.8 Messaging
- Structured, scoped messaging: tutor↔student, tutor↔parent, tutor↔group — not an open free-for-all chat, keeps it purpose-bound and easy to review
- System-generated messages for key events (session confirmed, assignment overdue, payment due) alongside free-text messages

### 5.9 Tutor Dashboard
- Today/this week's sessions at a glance
- Pending assignment grading queue
- Outstanding payments queue
- Per-student quick-view: attendance %, assignment completion %, last progress note

---

## 6. Data Model (high-level)

```
User
 ├─ id, phone/email, roles[tutor|student|parent], created_at

TutorProfile
 ├─ user_id, subjects[], exam_focus[], default_rate, rate_type[per_session|package]

StudentProfile
 ├─ user_id, name, exam_target, school, subjects[]

ParentLink
 ├─ parent_user_id, student_user_id, relationship

TutorStudentLink
 ├─ tutor_id, student_id, subject, status[active|inactive], linked_at

Session
 ├─ id, tutor_id, subject, participants[student_ids], datetime,
 │  status[scheduled|confirmed|completed|cancelled|rescheduled],
 │  recurrence_rule(optional), created_at

Attendance
 ├─ session_id, student_id, status[present|absent|late], marked_at

Assignment
 ├─ id, tutor_id, subject, description, attachment_url(optional),
 │  due_date, assigned_to[student_ids or group_id]

Submission
 ├─ assignment_id, student_id, status[not_submitted|submitted|graded],
 │  submission_content_url, submitted_at, score(optional), feedback(optional)

SyllabusTemplate
 ├─ id, tutor_id, subject, topics[]

SyllabusProgress
 ├─ tutor_student_link_id, topic, covered_at(optional)

MockTestScore
 ├─ student_id, subject, test_name, score, max_score, date

ProgressNote
 ├─ session_id, tutor_id, student_id, note_text, visible_to_parent(bool)

Payment
 ├─ id, tutor_id, student_id, amount, method[cash|transfer|in_app],
 │  status[pending|paid|overdue], due_date, paid_at(optional), reference

Message
 ├─ id, thread_id, sender_id, body, sent_at
MessageThread
 ├─ id, tutor_id, participant_ids[], context[direct|group]
```

---

## 7. Non-Functional Requirements

- **Reliability of scheduling:** session booking must be atomic — no double-booked tutor time slots, especially once a tutor is juggling 30+ students
- **Low-friction for non-technical users:** tutors and parents in this market are not necessarily tech-savvy — onboarding must work via a simple invite link/code, not require the parent to navigate a complex signup
- **Connectivity resilience:** assignment submission and attendance marking should tolerate poor connectivity (queue and sync) since sessions often happen in areas with inconsistent data access
- **Data privacy:** student progress and payment data visible only to the linked tutor and that student's linked parent(s) — no cross-visibility between different tutors' students or between unrelated parents
- **Notification cost-awareness:** SMS reminders cost money at scale — default to push notifications where possible, SMS as fallback/critical-only (payment due, session reminder) to keep unit economics sane

---

## 8. Suggested Build Phases

**Phase 1 (Core practice management):**
Auth + roles, student/class management, scheduling with atomic booking, attendance tracking, assignments + submissions, tutor dashboard.

**Phase 2 (Progress & parent visibility — the real differentiator):**
Syllabus tracking, mock test score trends, progress notes, full parent portal with read-only dashboard and notifications.

**Phase 3 (Payments & messaging):**
Payment tracking (manual + in-app via Paystack/Flutterwave), auto payment reminders, receipts, structured in-app messaging.

**Phase 4 (Growth, if validated):**
Tutor-to-tutor resource sharing (shared syllabus templates, past-question banks per exam board), multi-tutor "learning center" tenant mode for small tutorial centers with several tutors under one admin, referral tools for tutors to grow their own student base.

---

## 9. Business Model Note

Two possible packaging directions worth deciding early:
- **Direct SaaS to independent tutors:** monthly subscription per tutor (flat fee, or tiered by student count) — simplest to build and sell, matches the "solo tutor operating system" framing throughout this PRD.
- **B2B2C via tutorial centers:** sell to small tutorial centers/learning centers as an admin-plus-multiple-tutors tenant model — larger deal size per customer, but adds a center-admin role and multi-tutor permission layer not scoped in this v1.

Recommend validating with independent tutors first (simpler build, faster to first paying customer) before considering the tutorial-center expansion.

---

## 10. Suggested Stack

- **Frontend:** React + TypeScript + Tailwind (web); mobile-responsive is critical since parents and students will use this primarily on phones — a lightweight React Native wrapper could follow once web validates
- **Backend:** Node/Express
- **Database:** Supabase (Postgres + Auth) — the relational model here (students, sessions, assignments, payments all cross-referencing) fits Postgres well, and Supabase gives auth + row-level security for the tutor/parent data-isolation requirement out of the box
- **Notifications:** Firebase Cloud Messaging (push) + Twilio (SMS fallback for critical alerts only, to manage cost)
- **File storage (assignments, submissions):** Supabase Storage
- **Payments:** Paystack/Flutterwave

---

## 11. Open Questions

- Direct-to-tutor SaaS or tutorial-center B2B2C — which to validate first (affects whether a center-admin role needs to be in v1 scope)?
- Pricing model: flat monthly fee per tutor, or tiered by active student count (scales with the tutor's own revenue, may feel fairer but is harder to communicate upfront)?
- Should students have their own login at all, or is this primarily a tutor↔parent tool with the student experience kept minimal (many students in this age range may not have reliable personal phone access)?
- How much of the "progress" signal should be structured (syllabus %, scores) vs. freeform tutor notes — over-structuring risks feeling like busywork for the tutor, under-structuring risks the parent view feeling thin?
- Single-exam-board focus at launch (e.g. JAMB only) to nail the syllabus-template experience, or subject/board-agnostic from day one?
