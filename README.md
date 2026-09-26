# TutorTrack 🎓

**TutorTrack** is a modern, lightweight operating workspace for independent exam prep tutors, students, and parents. It unifies lesson scheduling, homework tracking, progress analytics, and parent transparency into a single streamlined command center.

---

## 📌 Project Status

- **Stage:** Prototype / Frontend-Only Pass
- **Data Persistence:** Client-side local state backed by `localStorage`
- **Backend / Authentication:** Pre-configured client auth shell for prototype role switching (`Tutor`, `Student`, `Parent`). Real backend integration & database persistence starts next week.

---

## 🚀 Key Features

- **Tutor Workspace:** Manage student rosters, 1-on-1 and group exam prep sessions, assignment grading, and tuition statements.
- **Student Portal:** Track upcoming timetable, join links, homework submissions, and syllabus target scores.
- **Parent Portal:** Read-only transparency into lesson summaries, attendance, payment invoices, and score trajectories.
- **Nigerian Localization:** Naira currency (`₦`) formatting, Nigerian secondary school levels (`JSS1–JSS3`, `SS1–SS3`), and exam prep contexts.
- **Responsive & Accessible UI:** Designed for desktop, tablet, and mobile (with dedicated mobile bottom navigation and 44px+ touch targets). Supports dark mode and honors `prefers-reduced-motion`.

---

## 🛠️ Tech Stack

- **Framework:** React 19 + React Router 7
- **Build Tool:** Vite 6
- **Styling:** Tailwind CSS v4 + Motion
- **Charts:** Recharts
- **Icons:** Lucide React

---

## 💻 Getting Started Locally

### Prerequisites

- **Node.js:** v18.0.0 or higher
- **Package Manager:** npm or yarn

### Installation & Run

```bash
# 1. Clone repository
git clone https://github.com/your-org/tutortrack.git
cd tutortrack

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 🧪 Available Scripts

```bash
npm run dev      # Start Vite dev server
npm run build    # Build for production
npm run preview  # Preview production build locally
npm run lint     # Run ESLint across codebase
```

---

## 📂 Documentation & Architecture

For product specs or PRD details, check the [`docs/`](./docs) directory if present.
