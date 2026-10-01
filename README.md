# TutorTrack

A practice-management platform for independent WAEC, JAMB and NECO tutors, their students and the parents who pay for them.

[![CI](https://github.com/folarin-123/Tutor-Track/actions/workflows/ci.yml/badge.svg)](https://github.com/folarin-123/Tutor-Track/actions/workflows/ci.yml)

> **Status Banner**: TutorTrack is currently in **Phase 0 (Prototype Hardening)** of its development roadmap. The application is a front-end React prototype running locally in the browser. Core UI layout, role-based navigation, Nigerian Naira currency formatting (`formatNaira`), Lagos timezone dates, and Firebase authentication are functional. Data storage uses a browser `localStorage` adapter. Interactive actions such as student work submission, parent payments, and parent alert triggers are currently simulated using toast notifications.
>
> **Live demo**: coming soon

---

## The Problem

Exam preparation in Nigeria is a high-stakes, largely informal market with over 2.24 million JAMB UTME candidates (Channels TV, April 2026) and 1.95 million WAEC WASSCE candidates (WAEC briefing / The Guardian Nigeria, August 2026). With roughly 38% of WASSCE candidates failing to reach the benchmark of five credits including English and Mathematics, families rely heavily on private, after-school tutoring. Today, independent tutors manage their practice across disjointed tools—paper notebooks for attendance, WhatsApp for parent communication, and manual bank transfers for payments. This fragmented workflow causes missed sessions, untracked assignment progress, late payments, and zero visibility for parents who fund the education.

---

## What It Does Today

The table below outlines current functionality verified against the codebase and [docs/CURRENT_STATE.md](docs/CURRENT_STATE.md):

| Area | Status | Notes |
| --- | --- | --- |
| **Tutor: Student Management** | Partial | Modal to add students and list view exist. Search, filtering, and student lifecycle transitions are planned. |
| **Tutor: Scheduling** | Partial | Create single-student tutoring sessions (topic, date, time). Conflict checking, recurring sessions, and calendar view are planned. |
| **Tutor: Assignments & Grading** | Built | Create assignments and grade submissions on a 0–100 scale. Student submission upload is simulated. |
| **Tutor: Progress Tracking** | Built | Interactive score trend charts powered by Recharts derived from graded assignments. |
| **Tutor: Payments** | Built | Record manual payments, mark as paid, and view receipt modal. Invoicing and Paystack integration are planned. |
| **Tutor: Messaging** | Built | Role-scoped student and parent chat channels with unread message counters. |
| **Student: Dashboard & Schedule** | Built | Overview of upcoming scheduled sessions and active assignments. |
| **Student: Assignment Work** | Partial | View assigned coursework. "Submit work" action is currently simulated via toast notification. |
| **Parent: Multi-student Overview** | Partial | View student progress and score trends. Currently lists all local students rather than restricted guardian-scoped data. |
| **Parent: Payments** | Partial | View fee status and receipts. "Pay" button triggers a simulated toast message rather than real payment gateway. |
| **Parent: Alerts & Messages** | Partial | Role-scoped chat channel with tutor. "Alerts" button triggers a simulated toast message. |

---

## Screenshots

<!-- TODO(owner): add screenshot -->

---

## Tech Stack

Comparison of current codebase technology versus target stack ([docs/TutorTrack_PRD_v2.md](docs/TutorTrack_PRD_v2.md) §11.2):

| Layer | Current Choice | Target Choice (PRD §11.2) | Notes |
| --- | --- | --- | --- |
| **Language** | JavaScript (ES6+) | TypeScript | Incremental migration planned (`allowJs`). |
| **UI Library** | React 19 (`react`, `react-dom`) | React 19 | Function components and hooks. |
| **Build Tool** | Vite 6 | Vite 6 | Fast HMR and build optimization via `@vitejs/plugin-react`. |
| **Routing** | React Router 7 (`react-router-dom`) | React Router 7 | Client-side `BrowserRouter` with role-gated routes. |
| **Styling** | Tailwind CSS 4 (`@tailwindcss/vite`) | Tailwind CSS 4 + Accessible primitives | Design tokens via CSS variables for light and dark themes. |
| **Animation** | Motion (`motion`) | Motion | Scroll-reveal and UI transitions. |
| **Icons** | Lucide React (`lucide-react`) | Lucide React | Clean icon suite. |
| **Charts** | Recharts (`recharts`) | Recharts | Render student score trend graphs. |
| **State Management** | React Context + `localStorage` | TanStack Query + Supabase | Global store via `StoreProvider` reading `localStorageAdapter`. |
| **Backend & Auth** | Firebase Auth + Firestore (`firebase`) | Supabase (Postgres + Auth + RLS) | Firebase auth wired; Firestore rules present; migrating to Supabase in Phase 1. |
| **Testing** | Vitest 5 + Testing Library | Vitest + Playwright | Unit and route smoke tests running in Vitest. |

---

## Getting Started

### Prerequisites

- **Node.js**: `v20.x` or higher (configured in [.github/workflows/ci.yml](.github/workflows/ci.yml))
- **npm**: `v10.x` or higher

### Clone, Install, and Run

> **Note**: The repository folder on disk may be named `tutortrack` or `smartprep`.

```bash
# Clone repository
git clone https://github.com/folarin-123/Tutor-Track.git
cd Tutor-Track

# Install dependencies using exact lockfile
npm ci

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Environment Variables

Environment variables are derived from [.env.example](.env.example):

| Variable | Purpose | Status |
| --- | --- | --- |
| `VITE_FIREBASE_API_KEY` | Firebase Web API Key for authentication | Optional (defaults to demo fallback) |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Auth Domain | Optional (defaults to demo fallback) |
| `VITE_FIREBASE_PROJECT_ID` | Firebase Project ID | Optional (defaults to demo fallback) |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase Storage Bucket URL | Optional (defaults to demo fallback) |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase Cloud Messaging Sender ID | Optional (defaults to demo fallback) |
| `VITE_FIREBASE_APP_ID` | Firebase Web Application ID | Optional (defaults to demo fallback) |

### Demo Mode

The application operates in demo mode by default, loading synthetic sample data (tutors, students, assignments, payments, and sessions) into browser `localStorage`. You can immediately explore the Tutor, Student, and Parent dashboards without registering or configuring external API credentials.

---

## Scripts

Every script declared in [package.json](package.json):

| Script | Command | Description |
| --- | --- | --- |
| `dev` | `npm run dev` | Starts the local Vite development server with hot module replacement. |
| `build` | `npm run build` | Builds optimized production assets into the `dist/` directory. |
| `preview` | `npm run preview` | Serves the production build locally for preview and testing. |
| `lint` | `npm run lint` | Runs ESLint across all source files. |
| `test` | `npm run test` | Executes unit and route smoke tests with Vitest. |
| `check:readme` | `npm run check:readme` | Validates README links, script documentation, and environment variables. |

---

## Project Structure

Canonical source directory tree verified against git index:

```
.
├── .github/
│   └── workflows/          # CI workflow definitions (ci.yml)
├── docs/                   # Product documentation and audits (CURRENT_STATE.md, TutorTrack_PRD_v2.md)
├── public/                 # Static web assets
├── scripts/                # Repository utility scripts (check-readme.mjs)
├── src/
│   ├── app/                # Route definitions, App router, and dashboard views
│   ├── components/         # Shared UI, layout, auth, and motion components
│   ├── features/           # Feature modules (assignments, messaging, payments, scheduling, students)
│   ├── lib/                # Auth, Firebase integration, store, formatters, and API adapters
│   ├── styles/             # Global CSS and Tailwind setup
│   ├── test/               # Test configuration and setup files
│   ├── App.test.jsx        # Route smoke tests
│   └── main.jsx            # Application entry point
├── eslint.config.mjs       # ESLint configuration
├── firebase.json           # Firebase CLI configuration
├── firestore.rules         # Firestore security rules
├── index.html              # HTML entry template
├── package.json            # Project dependencies and npm scripts
├── vercel.json             # Vercel deployment rewrite rules
└── vite.config.mjs         # Vite build configuration
```

---

## Testing and CI

CI is configured via [.github/workflows/ci.yml](.github/workflows/ci.yml) and executes automatically on push or pull request to `main`.

### CI Pipeline Steps

1. Checkout code and setup Node.js 20 environment with npm caching.
2. Install dependencies with `npm ci`.
3. Validate README completeness with `npm run check:readme`.
4. Run ESLint checks with `npm run lint`.
5. Run Vitest route smoke tests with `npm run test`.
6. Verify production build with `npm run build`.

### Running Locally

Run all verification steps prior to opening a pull request:

```bash
npm run check:readme
npm run lint
npm run test
npm run build
```

---

## Roadmap

Delivery milestones detailed in [docs/TutorTrack_PRD_v2.md](docs/TutorTrack_PRD_v2.md) §18:

- [x] **Phase 0: Prototype Hardening** — Codebase consolidation, Vite 6 / React 19 upgrade, Naira currency formatting, CI pipeline, documentation audit.
- [ ] **Phase 1: Foundation** — TypeScript setup, Supabase Postgres database with RLS policies, real multi-tenant data isolation, TanStack Query integration.
- [ ] **Phase 2: Core Loop (MVP)** — Advanced scheduling (recurring sessions, conflict constraints), attendance tracking, assignment upload flow, email notifications.
- [ ] **Phase 3: Progress & Parent Portal** — Syllabus tracking, topic progress, session notes visibility, progress report PDF generation, weekly digest emails.
- [ ] **Phase 4: Payments & Communications** — Fee plans, invoicing, automated Paystack integration, realtime messaging with file attachments, SMS reminders.
- [ ] **Phase 5: Polish & Portfolio Release** — PWA offline capability, accessibility audit, performance budgets, error monitoring, administrative user lookup.
- [ ] **Phase 6: Differentiators** — CBT exam practice simulation, AI-assisted drafting, multi-tutor tutoring centre management, self-booking portal.

---

## Architecture Decisions

Architectural decisions are documented in [docs/TutorTrack_PRD_v2.md](docs/TutorTrack_PRD_v2.md) §11.3 (individual files in `docs/adr/` are planned):

- **ADR-001**: Keep the Vite SPA architecture rather than returning to Next.js.
- **ADR-002**: Transition to Supabase (Postgres, Auth, Storage, Realtime) as the single backend provider.
- **ADR-003**: Enforce authorization via Postgres Row Level Security (RLS) as the single source of truth.
- **ADR-004**: Prevent double-booking using Postgres exclusion constraints (`tstzrange` + GiST).
- **ADR-005**: Store currency amounts as integer kobo to eliminate floating-point rounding errors.
- **ADR-006**: Implement an offline-first queue with idempotency keys for attendance, drafts, and messaging.
- **ADR-007**: Ensure AI features remain server-side and human-in-the-loop.
- **ADR-008**: Perform an incremental TypeScript migration (`allowJs`).

---

## Known Limitations

Identified from [docs/CURRENT_STATE.md](docs/CURRENT_STATE.md) and PRD §6.2/6.3:

- **Data Scoping**: Currently uses a single shared `localStorage` state across all user roles. Multi-tenant scoping and guardian data isolation are planned for Phase 1.
- **Authentication**: Uses Firebase Auth rather than Supabase. Role escalation is possible in the client prototype because Firestore rules allow self-update; email verification is not enforced.
- **Simulated Actions**: Student assignment submission, parent payments, and parent alerts display toast feedback without persistent server actions.
- **Scheduling**: Supports single-student session creation; calendar views, recurring schedules, and conflict detection are not yet built.
- **Linting Rules**: ESLint flat config currently defines workspace ignores; stricter linting rules and TypeScript type checking are planned.

---

## Privacy Note

TutorTrack is designed to process educational records and communication data for minors. The current web prototype uses synthetic demo data stored locally in the browser. It **must not** be used with real student records until Phase 1 (production authentication, data encryption, and Row Level Security) is completed.

---

## Contributing and License

Contributions, issues, and feature feedback are welcome. Please submit pull requests or open an issue on GitHub. Note: A formal open-source license file (`LICENSE`) is planned for Phase 0 completion.

---

## Author

Created by **Emmanuel Eseyin**.

- Contact: <!-- TODO(owner): add contact links -->
- Portfolio & Case Study: <!-- TODO(owner): add portfolio link -->
