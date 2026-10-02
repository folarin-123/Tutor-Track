import { useMemo, useState } from "react";
import {
  CalendarDays,
  CircleDollarSign,
  ClipboardCheck,
  Plus,
  RefreshCw,
  Users,
} from "lucide-react";
import ScrollableTabs from "@/components/common/ScrollableTabs";
import {
  EmptyState,
  Panel,
  PrimaryButton,
  SecondaryButton,
  Stat,
} from "@/components/common/Primitives";
import { SkeletonCard, SkeletonList } from "@/components/ui/Skeleton";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useStore } from "@/lib/store";
import { useToast } from "@/lib/toast";
import { useAuth } from "@/lib/auth";
import { formatDate, formatNaira } from "@/lib/formatters";

import StudentsView from "@/features/students/components/StudentsView";
import AddStudentModal from "@/features/students/components/AddStudentModal";
import StudentCard from "@/features/students/components/StudentCard";

import ScheduleView from "@/features/scheduling/components/ScheduleView";
import AddSessionModal from "@/features/scheduling/components/AddSessionModal";

import AssignmentsView from "@/features/assignments/components/AssignmentsView";
import AddAssignmentModal from "@/features/assignments/components/AddAssignmentModal";

import PaymentsView from "@/features/payments/components/PaymentsView";
import ReceiptModal from "@/features/payments/components/ReceiptModal";

import MessagingPanel from "@/features/messaging/components/MessagingPanel";

const SCORE_LINE_COLORS = [
  "var(--color-primary-500)",
  "var(--color-success-500)",
  "var(--color-warning-500)",
  "var(--color-danger-500)",
];

const tabs = ["Overview", "Schedule", "Students", "Assignments", "Payments", "Messages"];

export default function TutorPage() {
  const [tab, setTab] = useState("Overview");
  const [modal, setModal] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const { user } = useAuth();
  const store = useStore();
  const { push } = useToast();

  const outstanding = store.payments
    .filter((payment) => payment.status !== "Paid")
    .reduce((sum, payment) => sum + payment.amount, 0);
  const dueGrading = store.assignments.filter((item) => item.status !== "Graded").length;

  const content = {
    Overview: (
      <Overview
        go={setTab}
        store={store}
        outstanding={outstanding}
        dueGrading={dueGrading}
      />
    ),
    Schedule: (
      <ScheduleView
        sessions={store.sessions}
        loading={store.sessionsLoading}
        error={store.sessionsError}
        push={push}
        onRetry={store.fetchSessions}
      />
    ),
    Students: (
      <StudentsView
        students={store.students}
        loading={store.studentsLoading}
        error={store.studentsError}
        onAdd={() => setModal("student")}
        onRetry={store.fetchStudents}
      />
    ),
    Assignments: (
      <AssignmentsView
        assignments={store.assignments}
        loading={store.assignmentsLoading}
        error={store.assignmentsError}
        onGrade={store.gradeAssignment}
        push={push}
        onRetry={store.fetchAssignments}
      />
    ),
    Payments: (
      <PaymentsView
        payments={store.payments}
        loading={store.paymentsLoading}
        error={store.paymentsError}
        onMarkPaid={store.markPaymentPaid}
        onReceipt={setReceipt}
        onRetry={store.fetchPayments}
      />
    ),
    Messages: (
      <MessagingPanel
        role="tutor"
        user={user}
        roster={store.students}
        onUpdateStudent={store.updateStudent}
      />
    ),
  }[tab];

  return (
    <section className="mx-auto max-w-7xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-primary-600 dark:text-primary-400">
            {user ? `Welcome back, ${user.name}.` : "Welcome back."}
          </p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight sm:text-4xl text-[var(--text-primary)]">
            Your practice at a glance.
          </h1>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            Add students, sessions, and assignments to see this space come together.
          </p>
          {user?.cv && (
            <p className="mt-2 text-xs font-semibold text-[var(--text-secondary)]">
              Uploaded CV: <span className="font-bold text-[var(--text-primary)]">{user.cv.name}</span> ({user.cv.sizeKB} KB)
            </p>
          )}
        </div>
        <div className="flex flex-wrap justify-end gap-3">
          <SecondaryButton onClick={() => store.loadDemoData()}>
            Load demo data
          </SecondaryButton>
          <PrimaryButton onClick={() => setModal(getCreateKind(tab))}>
            <Plus size={17} />
            New {getCreateLabel(tab)}
          </PrimaryButton>
        </div>
      </div>
      <div className="mt-7">
        <ScrollableTabs tabs={tabs} active={tab} onChange={setTab} />
      </div>
      {content}
      {modal === "student" && (
        <AddStudentModal
          onClose={() => setModal(false)}
          onAdd={store.addStudent}
          push={push}
        />
      )}
      {modal === "session" && (
        <AddSessionModal
          onClose={() => setModal(false)}
          students={store.students}
          onAdd={store.addSession}
          push={push}
        />
      )}
      {modal === "assignment" && (
        <AddAssignmentModal
          onClose={() => setModal(false)}
          students={store.students}
          onAdd={store.addAssignment}
          push={push}
        />
      )}
      {receipt && <ReceiptModal item={receipt} onClose={() => setReceipt(null)} />}
    </section>
  );
}

function getCreateKind(tab) {
  if (tab === "Schedule") return "session";
  if (tab === "Assignments") return "assignment";
  return "student";
}
function getCreateLabel(tab) {
  if (tab === "Schedule") return "session";
  if (tab === "Assignments") return "assignment";
  return "student";
}

function Overview({ go, store, outstanding, dueGrading }) {
  const trend = useMemo(
    () => buildStudentAverageTrend(store.students, store.assignments),
    [store.students, store.assignments],
  );

  return (
    <div className="mt-7 space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          icon={<CalendarDays size={18} />}
          label="Upcoming sessions"
          value={store.sessionsLoading ? "..." : store.sessions.length}
          detail={store.sessions[0] ? `Next: ${store.sessions[0].topic}` : "None scheduled yet"}
          tone="primary"
        />
        <Stat
          icon={<ClipboardCheck size={18} />}
          label="Ready to grade"
          value={store.assignmentsLoading ? "..." : dueGrading}
          detail={dueGrading ? "Needs your review" : "All caught up"}
          tone="warning"
        />
        <Stat
          icon={<CircleDollarSign size={18} />}
          label="Outstanding"
          value={store.paymentsLoading ? "..." : formatNaira(outstanding)}
          detail={`Across ${store.payments.filter((p) => p.status !== "Paid").length} families`}
          tone="danger"
        />
        <Stat
          icon={<Users size={18} />}
          label="Active students"
          value={store.studentsLoading ? "..." : store.students.length}
          detail={store.students.length ? "Growing your roster" : "Add your first student"}
          tone="primary"
        />
      </div>

      <Panel title="Student score trends">
        {store.assignmentsLoading ? (
          <SkeletonCard />
        ) : trend.data.length < 2 ? (
          <EmptyState
            title="Not enough graded scores yet"
            body="Grade at least two assignments so a trend can appear."
          />
        ) : (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend.data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="var(--border-default)" strokeDasharray="3 3" />
                <XAxis dataKey="due" tick={{ fontSize: 12, fill: "var(--text-secondary)" }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: "var(--text-secondary)" }} />
                <Tooltip />
                <Legend />
                {trend.lines.map((name, index) => (
                  <Line
                    key={name}
                    type="monotone"
                    dataKey={name}
                    stroke={SCORE_LINE_COLORS[index % SCORE_LINE_COLORS.length]}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    connectNulls
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </Panel>

      <div className="grid gap-6 xl:grid-cols-[1.25fr_.75fr]">
        <Panel title="Upcoming sessions" action="Open schedule" onAction={() => go("Schedule")}>
          {store.sessionsLoading ? (
            <SkeletonList count={2} />
          ) : store.sessionsError ? (
            <div className="text-center py-4 text-xs font-semibold text-danger-500">
              {store.sessionsError}{" "}
              <button onClick={store.fetchSessions} className="underline">Retry</button>
            </div>
          ) : store.sessions.length === 0 ? (
            <EmptyState
              title="No sessions yet"
              body="Add a session to see it appear here."
              action="Add a session"
              onAction={() => go("Schedule")}
            />
          ) : (
            <div className="space-y-3">
              {store.sessions.map((session) => (
                <div
                  key={session.id}
                  className="flex gap-3 rounded-2xl border border-[var(--border-default)] p-3"
                >
                  <p className="w-16 pt-1 text-xs font-bold text-[var(--text-secondary)]">
                    {session.start}
                  </p>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-[var(--text-primary)]">{session.studentName}</p>
                    <p className="mt-1 text-xs text-[var(--text-secondary)]">
                      {formatDate(session.date)} · {session.topic}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Panel>

        <Panel title="Grading queue" action="View all" onAction={() => go("Assignments")}>
          {store.assignmentsLoading ? (
            <SkeletonList count={2} />
          ) : store.assignmentsError ? (
            <div className="text-center py-4 text-xs font-semibold text-danger-500">
              {store.assignmentsError}{" "}
              <button onClick={store.fetchAssignments} className="underline">Retry</button>
            </div>
          ) : store.assignments.length === 0 ? (
            <EmptyState title="Nothing to grade" body="New assignments will show up here." />
          ) : (
            <div className="space-y-3">
              {store.assignments.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between rounded-2xl bg-[var(--bg-surface-muted)] p-3"
                >
                  <div>
                    <p className="text-sm font-bold text-[var(--text-primary)]">{task.title}</p>
                    <p className="mt-1 text-xs text-[var(--text-secondary)]">{task.studentName}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${
                    task.status === "Graded" ? "bg-success-100 text-success-700" : "bg-warning-100 text-warning-700"
                  }`}>
                    {task.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Panel>
      </div>

      <Panel title="Your students" action="All students" onAction={() => go("Students")}>
        {store.studentsLoading ? (
          <SkeletonList count={3} />
        ) : store.studentsError ? (
          <div className="text-center py-4 text-xs font-semibold text-danger-500">
            {store.studentsError}{" "}
            <button onClick={store.fetchStudents} className="underline">Retry</button>
          </div>
        ) : store.students.length === 0 ? (
          <EmptyState
            title="No students yet"
            body="Add your first student to start building your roster."
            action="Add a student"
            onAction={() => go("Students")}
          />
        ) : (
          <div className="grid gap-3 md:grid-cols-3">
            {store.students.map((student) => (
              <StudentCard key={student.id} student={student} />
            ))}
          </div>
        )}
      </Panel>
    </div>
  );
}

function buildStudentAverageTrend(students, assignments) {
  const graded = assignments.filter(
    (item) =>
      item.status === "Graded" &&
      item.score != null &&
      item.score !== "" &&
      Number.isFinite(Number(item.score)),
  );
  const lines = students
    .map((student) => {
      const points = graded
        .filter((item) => item.studentId === student.id)
        .slice()
        .sort((a, b) => String(a.due).localeCompare(String(b.due)));
      let sum = 0;
      const series = points.map((item, index) => {
        sum += Number(item.score);
        return { due: formatDate(item.due), average: Math.round((sum / (index + 1)) * 10) / 10 };
      });
      return { name: student.name, series };
    })
    .filter((line) => line.series.length > 0);

  const dates = [...new Set(lines.flatMap((line) => line.series.map((point) => point.due)))].sort();
  const data = dates.map((due) => {
    const row = { due };
    lines.forEach((line) => {
      const point = line.series.find((entry) => entry.due === due);
      if (point) row[line.name] = point.average;
    });
    return row;
  });

  return { data, lines: lines.map((line) => line.name) };
}
