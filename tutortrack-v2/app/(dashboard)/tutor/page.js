"use client";

import { useMemo, useState } from "react";
import {
  CalendarDays,
  CircleDollarSign,
  ClipboardCheck,
  Plus,
  ReceiptText,
  Send,
  Users,
} from "lucide-react";
import ScrollableTabs from "@/components/common/ScrollableTabs";
import {
  Avatar,
  EmptyState,
  Field,
  Modal,
  Panel,
  PrimaryButton,
  SecondaryButton,
  SelectField,
  Stat,
} from "@/components/common/Primitives";
import { useStore } from "@/lib/store";
import { useToast } from "@/lib/toast";
import { useAuth } from "@/lib/auth";

const tabs = ["Overview", "Schedule", "Students", "Assignments", "Payments", "Messages"];
const money = (n) => `$${Number(n || 0).toLocaleString("en-US")}`;

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
    Schedule: <Schedule store={store} push={push} />,
    Students: <Students store={store} onAdd={() => setModal("student")} />,
    Assignments: <Assignments store={store} push={push} />,
    Payments: <Payments store={store} money={money} onReceipt={setReceipt} />,
    Messages: <Messages store={store} push={push} sender={user?.name ?? "Tutor"} />,
  }[tab];

  return (
    <section className="mx-auto max-w-7xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-primary-600">
            {user ? `Welcome back, ${user.name}.` : "Welcome back."}
          </p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Your practice at a glance.
          </h1>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            Add students, sessions, and assignments to see this space come together.
          </p>
        </div>
        <PrimaryButton onClick={() => setModal(getCreateKind(tab))}>
          <Plus size={17} />
          New {getCreateLabel(tab)}
        </PrimaryButton>
      </div>
      <div className="mt-7">
        <ScrollableTabs tabs={tabs} active={tab} onChange={setTab} />
      </div>
      {content}
      {modal === "student" && (
        <AddStudentModal onClose={() => setModal(false)} store={store} push={push} />
      )}
      {modal === "session" && (
        <AddSessionModal onClose={() => setModal(false)} store={store} push={push} />
      )}
      {modal === "assignment" && (
        <AddAssignmentModal onClose={() => setModal(false)} store={store} push={push} />
      )}
      {receipt && <Receipt item={receipt} money={money} onClose={() => setReceipt(null)} />}
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
  return (
    <div className="mt-7 space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          icon={<CalendarDays size={18} />}
          label="Upcoming sessions"
          value={store.sessions.length}
          detail={store.sessions[0] ? `Next: ${store.sessions[0].topic}` : "None scheduled yet"}
          tone="primary"
        />
        <Stat
          icon={<ClipboardCheck size={18} />}
          label="Ready to grade"
          value={dueGrading}
          detail={dueGrading ? "Needs your review" : "All caught up"}
          tone="warning"
        />
        <Stat
          icon={<CircleDollarSign size={18} />}
          label="Outstanding"
          value={money(outstanding)}
          detail={`Across ${store.payments.filter((p) => p.status !== "Paid").length} families`}
          tone="danger"
        />
        <Stat
          icon={<Users size={18} />}
          label="Active students"
          value={store.students.length}
          detail={store.students.length ? "Growing your roster" : "Add your first student"}
          tone="primary"
        />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.25fr_.75fr]">
        <Panel title="Upcoming sessions" action="Open schedule" onAction={() => go("Schedule")}>
          {store.sessions.length === 0 ? (
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
                    <p className="text-sm font-bold">{session.studentName}</p>
                    <p className="mt-1 text-xs text-[var(--text-secondary)]">{session.topic}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Panel>
        <Panel title="Grading queue" action="View all" onAction={() => go("Assignments")}>
          {store.assignments.length === 0 ? (
            <EmptyState title="Nothing to grade" body="New assignments will show up here." />
          ) : (
            <div className="space-y-3">
              {store.assignments.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between rounded-2xl bg-[var(--bg-surface-muted)] p-3"
                >
                  <div>
                    <p className="text-sm font-bold">{task.title}</p>
                    <p className="mt-1 text-xs text-[var(--text-secondary)]">{task.studentName}</p>
                  </div>
                  <StatusBadge status={task.status} />
                </div>
              ))}
            </div>
          )}
        </Panel>
      </div>
      <Panel title="Your students" action="All students" onAction={() => go("Students")}>
        {store.students.length === 0 ? (
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

function Schedule({ store, push }) {
  return (
    <div className="mt-7">
      <Panel title="Sessions">
        {store.sessions.length === 0 ? (
          <EmptyState title="No sessions yet" body="Use the new session button above to add one." />
        ) : (
          <div className="space-y-3">
            {store.sessions.map((session) => (
              <button
                type="button"
                key={session.id}
                onClick={() => push("Session opened. You can confirm or propose a new time.")}
                className="flex w-full flex-col gap-1 rounded-2xl border border-[var(--border-default)] p-4 text-left"
              >
                <span className="text-xs font-bold text-primary-600">
                  {session.date} · {session.start} to {session.end}
                </span>
                <span className="font-bold">{session.topic}</span>
                <span className="text-sm text-[var(--text-secondary)]">
                  {session.status} · {session.studentName}
                </span>
              </button>
            ))}
          </div>
        )}
      </Panel>
    </div>
  );
}

function Students({ store, onAdd }) {
  return (
    <div className="mt-7">
      <div className="rounded-3xl border border-dashed border-primary-300 bg-primary-50 p-5 text-primary-900">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <p className="font-bold">Add a student</p>
            <p className="mt-1 text-sm text-primary-700">
              Build your roster so sessions, assignments, and payments can link to them.
            </p>
          </div>
          <PrimaryButton onClick={onAdd}>
            <Plus size={16} />
            Add student
          </PrimaryButton>
        </div>
      </div>
      <div className="mt-5">
        {store.students.length === 0 ? (
          <EmptyState title="No students yet" body="Your roster is empty." />
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {store.students.map((student) => (
              <StudentCard key={student.id} student={student} full />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Assignments({ store, push }) {
  const graded = store.assignments.filter((item) => item.status === "Graded").length;
  const pending = store.assignments.length - graded;
  return (
    <div className="mt-7 space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <Stat label="Pending review" value={pending} detail="Needs a grade" tone="warning" />
        <Stat label="Graded" value={graded} detail="Keep it moving" tone="primary" />
      </div>
      <Panel title="Assignment tracker">
        {store.assignments.length === 0 ? (
          <EmptyState title="No assignments yet" body="Use the new assignment button above." />
        ) : (
          <div className="space-y-3">
            {store.assignments.map((task) => (
              <div
                key={task.id}
                className="flex flex-col gap-3 rounded-2xl border border-[var(--border-default)] p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-bold">{task.title}</p>
                  <p className="mt-1 text-sm text-[var(--text-secondary)]">
                    {task.studentName} · Due {task.due}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                  <StatusBadge status={task.status} />
                  {task.status !== "Graded" && (
                    <button
                      onClick={() => {
                        store.gradeAssignment(task.id);
                        push("Assignment marked as graded.");
                      }}
                      className="rounded-full bg-primary-900 px-3 py-2 text-xs font-bold text-white"
                    >
                      Mark graded
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Panel>
    </div>
  );
}

function Payments({ store, money, onReceipt }) {
  const outstanding = store.payments
    .filter((item) => item.status !== "Paid")
    .reduce((sum, item) => sum + item.amount, 0);
  const collected = store.payments
    .filter((item) => item.status === "Paid")
    .reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="mt-7 space-y-6">
      <div className="overflow-hidden rounded-[2rem] bg-primary-900 p-6 text-white sm:p-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold text-primary-300">Payments overview</p>
            <p className="mt-3 text-4xl font-extrabold sm:text-5xl">{money(outstanding)}</p>
            <p className="mt-2 text-sm text-primary-100">Outstanding across your families</p>
          </div>
          <div className="rounded-3xl bg-white/10 p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-primary-100">
              Collected
            </p>
            <p className="mt-3 text-3xl font-extrabold">{money(collected)}</p>
          </div>
        </div>
      </div>
      <Panel title="Balances">
        {store.payments.length === 0 ? (
          <EmptyState title="No payments yet" body="Add a payment record to track balances." />
        ) : (
          <div className="space-y-3">
            {store.payments.map((payment) => (
              <div
                key={payment.id}
                className="flex flex-col gap-3 rounded-2xl border border-[var(--border-default)] p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-3">
                  <Avatar value={payment.studentName} />
                  <div>
                    <p className="font-bold">{payment.studentName}</p>
                    <p className="mt-1 text-xs text-[var(--text-secondary)]">{payment.month}</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-4 sm:justify-end">
                  <div className="text-right">
                    <p className="font-extrabold">{money(payment.amount)}</p>
                    <StatusBadge status={payment.status} />
                  </div>
                  {payment.status !== "Paid" ? (
                    <button
                      onClick={() => store.markPaymentPaid(payment.id)}
                      className="rounded-full bg-primary-500 px-3 py-2 text-xs font-bold text-white"
                    >
                      Mark paid
                    </button>
                  ) : (
                    <button
                      onClick={() => onReceipt(payment)}
                      className="rounded-full border border-[var(--border-default)] px-3 py-2 text-xs font-bold"
                    >
                      Receipt
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Panel>
    </div>
  );
}

function Messages({ store, push, sender }) {
  const [draft, setDraft] = useState("");
  const relevant = store.messages;

  const send = () => {
    if (!draft.trim()) return;
    store.sendMessage({ from: sender, to: "Student", body: draft.trim() });
    setDraft("");
    push("Message sent.");
  };

  return (
    <div className="mt-7 flex min-h-[420px] flex-col overflow-hidden rounded-3xl bg-[var(--bg-surface)] p-5 ring-1 ring-[var(--border-default)]">
      <div className="flex-1 space-y-3 overflow-y-auto py-4 text-sm">
        {relevant.length === 0 ? (
          <p className="text-center text-sm text-[var(--text-secondary)]">
            No messages yet. Say hello to a student or parent.
          </p>
        ) : (
          relevant.map((message) => (
            <div
              key={message.id}
              className="ml-auto max-w-sm rounded-2xl rounded-tr-sm bg-primary-500 p-3 text-white"
            >
              {message.body}
            </div>
          ))
        )}
      </div>
      <div className="flex flex-wrap gap-2 pt-4">
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          className="min-w-0 flex-[1_1_12rem] rounded-full bg-[var(--bg-surface-muted)] px-4 py-3 text-sm outline-primary-500"
          placeholder="Write a message"
        />
        <button
          type="button"
          onClick={send}
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary-900 text-white"
        >
          <Send size={17} />
        </button>
      </div>
    </div>
  );
}

function StudentCard({ student, full }) {
  return (
    <div className="rounded-3xl bg-[var(--bg-surface)] p-5 shadow-sm ring-1 ring-[var(--border-default)]">
      <div className="flex gap-3">
        <Avatar value={student.name} />
        <div>
          <p className="font-bold">{student.name}</p>
          <p className="text-xs text-[var(--text-secondary)]">{student.grade}</p>
        </div>
      </div>
      {full && student.note && (
        <p className="mt-4 text-xs leading-5 text-[var(--text-secondary)]">{student.note}</p>
      )}
    </div>
  );
}

function StatusBadge({ status }) {
  const tone = {
    Paid: "bg-success-100 text-success-700",
    Due: "bg-warning-100 text-warning-700",
    Graded: "bg-success-100 text-success-700",
    Draft: "bg-warning-100 text-warning-700",
    "In Review": "bg-primary-100 text-primary-700",
    Scheduled: "bg-primary-100 text-primary-700",
  }[status] || "bg-[var(--bg-surface-muted)] text-[var(--text-secondary)]";
  return (
    <span className={`rounded-full px-3 py-1.5 text-xs font-bold ${tone}`}>{status}</span>
  );
}

function AddStudentModal({ onClose, store, push }) {
  const [name, setName] = useState("");
  const [grade, setGrade] = useState("");

  const submit = () => {
    if (!name.trim()) return;
    store.addStudent({ name: name.trim(), grade: grade.trim() });
    push(`${name.trim()} was added to your roster.`);
    onClose();
  };

  return (
    <Modal title="Add a student" onClose={onClose}>
      <div className="space-y-4">
        <Field label="Student name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" />
        <Field label="Grade or level" value={grade} onChange={(e) => setGrade(e.target.value)} placeholder="Grade 8" />
      </div>
      <PrimaryButton className="mt-5 w-full" onClick={submit}>
        Save
      </PrimaryButton>
    </Modal>
  );
}

function AddSessionModal({ onClose, store, push }) {
  const [studentId, setStudentId] = useState("");
  const [topic, setTopic] = useState("");
  const [date, setDate] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const studentOptions = useMemo(
    () => ["Unassigned", ...store.students.map((s) => s.name)],
    [store.students],
  );

  const submit = () => {
    if (!topic.trim() || !date || !start || !end) return;
    const student = store.students.find((s) => s.name === studentId);
    store.addSession({
      studentId: student?.id,
      studentName: studentId || "Unassigned",
      topic: topic.trim(),
      date,
      start,
      end,
    });
    push("Session added to your schedule.");
    onClose();
  };

  return (
    <Modal title="Add a session" onClose={onClose}>
      <div className="space-y-4">
        <SelectField
          label="Student"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          options={studentOptions}
        />
        <Field label="Topic" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Mathematics, fractions" />
        <Field label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <div className="grid grid-cols-2 gap-3">
          <Field label="Start" type="time" value={start} onChange={(e) => setStart(e.target.value)} />
          <Field label="End" type="time" value={end} onChange={(e) => setEnd(e.target.value)} />
        </div>
      </div>
      <PrimaryButton className="mt-5 w-full" onClick={submit}>
        Save
      </PrimaryButton>
    </Modal>
  );
}

function AddAssignmentModal({ onClose, store, push }) {
  const [studentId, setStudentId] = useState("");
  const [title, setTitle] = useState("");
  const [due, setDue] = useState("");

  const studentOptions = useMemo(
    () => ["Unassigned", ...store.students.map((s) => s.name)],
    [store.students],
  );

  const submit = () => {
    if (!title.trim() || !due) return;
    const student = store.students.find((s) => s.name === studentId);
    store.addAssignment({
      studentId: student?.id,
      studentName: studentId || "Unassigned",
      title: title.trim(),
      due,
    });
    push("Assignment added.");
    onClose();
  };

  return (
    <Modal title="Add an assignment" onClose={onClose}>
      <div className="space-y-4">
        <SelectField
          label="Student"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          options={studentOptions}
        />
        <Field label="Title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Reading reflection" />
        <Field label="Due date" type="date" value={due} onChange={(e) => setDue(e.target.value)} />
      </div>
      <PrimaryButton className="mt-5 w-full" onClick={submit}>
        Save
      </PrimaryButton>
    </Modal>
  );
}

function Receipt({ item, money, onClose }) {
  return (
    <Modal title="Payment receipt" onClose={onClose}>
      <div className="rounded-3xl bg-primary-900 p-5 text-white">
        <div className="flex items-center justify-between">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-primary-400 text-primary-900">
            <ReceiptText size={18} />
          </span>
          <span className="rounded-full bg-primary-400/20 px-3 py-1 text-xs font-bold text-primary-100">
            PAID
          </span>
        </div>
        <p className="mt-7 text-sm text-primary-200">Received from</p>
        <p className="text-xl font-extrabold">{item.studentName}</p>
        <p className="mt-6 text-3xl font-extrabold">{money(item.amount)}</p>
        <div className="mt-6 border-t border-white/15 pt-4 text-sm text-primary-200">
          <p>{item.month} tuition, TutorTrack receipt</p>
          <p className="mt-1">Ref: TT-{item.id}</p>
        </div>
      </div>
      <PrimaryButton className="mt-4 w-full" onClick={onClose}>
        Done
      </PrimaryButton>
    </Modal>
  );
}
