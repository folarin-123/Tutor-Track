import {
  ArrowRight,
  CalendarDays,
  Check,
  CircleDollarSign,
  ClipboardCheck,
  Link,
  MoreHorizontal,
  Plus,
  ReceiptText,
  Send,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useAssignments } from "../../hooks/useAssignments.js";
import { usePayments } from "../../hooks/usePayments.js";
import { useProgress } from "../../hooks/useProgress.js";
import { useSessions } from "../../hooks/useSessions.js";
import { useStudents } from "../../hooks/useStudents.js";
import { useToast } from "../../hooks/useToast.js";
import ScrollableTabs from "../../components/common/ScrollableTabs.jsx";

const tabs = [
  "Overview",
  "Schedule",
  "Students",
  "Assignments",
  "Progress",
  "Payments",
  "Messages",
];
const money = (n) => `₦${n.toLocaleString("en-NG")}`;

export default function TutorPage() {
  const [tab, setTab] = useState("Overview"),
    [paidIds, setPaidIds] = useState([]),
    [receipt, setReceipt] = useState(null),
    [modal, setModal] = useState(false);
  const { assignments } = useAssignments();
  const { progress } = useProgress();
  const { sessions } = useSessions();
  const { students } = useStudents();
  const { payments: paymentData } = usePayments();
  const { push } = useToast();
  const people = students.map((student, index) => ({
    name: student.name,
    initials: student.name
      .split(" ")
      .map((part) => part[0])
      .join(""),
    subject: student.grade,
    attendance: [94, 78, 96][index] ?? 90,
    work: [88, 67, 100][index] ?? 80,
    note: student.risk,
  }));
  const tasks = assignments.map((assignment) => ({
    title: assignment.title,
    person:
      students.find((student) => student.id === assignment.studentId)?.name ??
      "Assigned student",
    due: assignment.due,
    status: assignment.status,
    color:
      assignment.status === "In Review"
        ? "bg-amber-100 text-amber-700"
        : assignment.status === "Draft"
          ? "bg-rose-100 text-rose-700"
          : "bg-sky-100 text-sky-700",
  }));

  const payments = paymentData.map((payment) => ({
    ...payment,
    name:
      students.find((student) => student.id === payment.studentId)?.name ??
      "Assigned student",
    item: `${payment.month} tuition`,
    due: payment.status === "Due" ? "Due this month" : "Paid",
    status: paidIds.includes(payment.id) ? "paid" : payment.status.toLowerCase(),
    method: "Mock record",
  }));
  const markPaid = (id) => {
    setPaidIds((ids) => (ids.includes(id) ? ids : [...ids, id]));
    push("Payment marked received. Receipt is ready.");
  };
  const content = {
    Overview: <Overview go={setTab} people={people} tasks={tasks} />,
    Schedule: <Schedule push={push} sessions={sessions} />,
    Students: <Students push={push} people={people} />,
    Assignments: <Assignments push={push} tasks={tasks} />,
    Progress: <Progress progress={progress} />,
    Payments: (
      <Payments items={payments} markPaid={markPaid} receipt={setReceipt} />
    ),
    Messages: <Messages push={push} />,
  }[tab];
  return (
    <section className="mx-auto max-w-7xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-emerald-600">
            Tuesday, 15 September 2026
          </p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Good morning, Mr. Adewale.
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Your practice is moving—here’s what needs your attention.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setModal(true)}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/20"
        >
          <Plus size={17} />
          New{" "}
          {tab === "Assignments"
            ? "assignment"
            : tab === "Schedule"
              ? "session"
              : "student"}
        </button>
      </div>
      <div className="mt-7">
        <ScrollableTabs tabs={tabs} active={tab} onChange={setTab} />
      </div>
      {content}
      {modal && (
        <Modal
          title={`Add ${getCreateTitle(tab)}`}
          close={() => setModal(false)}
        >
          <label className="text-sm font-semibold">
            Details
            <input
              autoFocus
              className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-emerald-500"
              placeholder="Enter details"
            />
          </label>
          <button
            onClick={() => {
              setModal(false);
              push("Saved locally.");
            }}
            className="mt-5 w-full rounded-xl bg-emerald-500 py-3 font-bold text-white"
          >
            Save
          </button>
        </Modal>
      )}
      {receipt && <Receipt item={receipt} close={() => setReceipt(null)} />}
    </section>
  );
}

function getCreateTitle(tab) {
  const titles = {
    Schedule: "a session",
    Assignments: "an assignment",
    default: "a student",
  };

  return titles[tab] ?? titles.default;
}
function Overview({ go, people, tasks }) {
  return (
    <div className="mt-7 space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          icon={<CalendarDays />}
          label="Today’s sessions"
          value="4"
          detail="Next: Blessing at 4:00 pm"
          tone="emerald"
        />
        <Stat
          icon={<ClipboardCheck />}
          label="Ready to grade"
          value="6"
          detail="2 are overdue"
          tone="amber"
        />
        <Stat
          icon={<CircleDollarSign />}
          label="Outstanding"
          value="₦84,000"
          detail="Across 3 families"
          tone="rose"
        />
        <Stat
          icon={<Users />}
          label="Active students"
          value="24"
          detail="2 joined this month"
          tone="blue"
        />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.25fr_.75fr]">
        <Panel
          title="Today’s sessions"
          action="Open calendar"
          click={() => go("Schedule")}
        >
          <div className="space-y-3">
            <Session
              time="4:00 pm"
              student="Blessing Okafor"
              topic="Mathematics · Differentiation"
              tag="Confirmed"
            />
            <Session
              time="5:15 pm"
              student="SS3 Science group · 6 students"
              topic="Chemistry · Electrolysis"
              tag="Confirmed"
            />
            <Session
              time="7:00 pm"
              student="Daniel Adebayo"
              topic="Physics · Electricity"
              tag="Awaiting reschedule"
              warn
            />
          </div>
        </Panel>
        <Panel
          title="Grading queue"
          action="View all"
          click={() => go("Assignments")}
        >
          <div className="space-y-3">
            {tasks.map((x) => (
              <Task key={x.title} x={x} />
            ))}
          </div>
        </Panel>
      </div>
      <Panel
        title="Students who need a quick look"
        action="All students"
        click={() => go("Students")}
      >
        <div className="grid gap-3 md:grid-cols-3">
          {people.map((x) => (
            <StudentCard key={x.name} x={x} />
          ))}
        </div>
      </Panel>
    </div>
  );
}
function Schedule({ push, sessions }) {
  return (
    <div className="mt-7 grid gap-6 xl:grid-cols-[1fr_290px]">
      <Panel title="September 2026" action="Week">
        <div className="mb-5 flex gap-2 text-sm text-slate-500">
          <button>‹</button>
          <strong className="px-3 text-slate-900 dark:text-white">
            15–19 September
          </strong>
          <button>›</button>
        </div>
        <div className="md:hidden">
          <div className="space-y-3">
            {sessions.map((session) => (
              <button
                type="button"
                key={session.id}
                onClick={() =>
                  push("Session opened. You can confirm or propose a new time.")
                }
                className="flex w-full flex-col gap-1 rounded-xl border border-slate-200 p-4 text-left dark:border-slate-800"
              >
                <span className="text-xs font-bold text-emerald-600">
                  {session.date} · {session.start}–{session.end}
                </span>
                <span className="font-bold">{session.topic}</span>
                <span className="text-sm text-slate-500">
                  {session.status} · Student {session.studentId}
                </span>
              </button>
            ))}
          </div>
        </div>
        <div className="hidden overflow-x-auto md:block">
          <div className="min-w-[650px]">
            <div className="grid grid-cols-[70px_repeat(5,1fr)] border-b border-slate-200 pb-3 text-center text-xs font-bold text-slate-500">
              <span></span>
              {["Tue 15", "Wed 16", "Thu 17", "Fri 18", "Sat 19"].map((x) => (
                <span key={x}>{x}</span>
              ))}
            </div>
            {["2:00 pm", "4:00 pm", "5:15 pm", "7:00 pm"].map((t, i) => (
              <div
                className="grid grid-cols-[70px_repeat(5,1fr)] border-b border-slate-100 py-3 text-xs dark:border-slate-800"
                key={t}
              >
                <span className="text-slate-400">{t}</span>
                {[0, 1, 2, 3, 4].map((day) => (
                  <div
                    className="min-h-10 border-l border-slate-100 px-1 dark:border-slate-800"
                    key={day}
                  >
                    {((day === 1 && i === 1) ||
                      (day === 2 && i === 2) ||
                      (day === 0 && i === 3)) && (
                      <button
                        onClick={() =>
                          push(
                            "Session opened. You can confirm or propose a new time.",
                          )
                        }
                        className="w-full rounded-lg bg-emerald-100 p-2 text-left font-bold text-emerald-800"
                      >
                        {i === 1
                          ? "Blessing · Maths"
                          : i === 2
                            ? "SS3 Group · Chem"
                            : "Daniel · Physics"}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </Panel>
      <Panel title="Session details">
        <p className="text-sm font-bold">Blessing Okafor</p>
        <p className="mt-1 text-sm text-slate-500">Wednesday, 4:00–5:00 pm</p>
        <div className="mt-5 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800">
          Both sides confirmed this session.
        </div>
        <button
          onClick={() => push("Attendance is ready to mark after the session.")}
          className="mt-4 w-full rounded-xl border border-slate-200 py-2.5 text-sm font-bold"
        >
          Mark attendance
        </button>
        <button
          onClick={() => push("Reschedule proposal sent for confirmation.")}
          className="mt-2 w-full rounded-xl bg-[var(--color-brand-navy)] py-2.5 text-sm font-bold text-white"
        >
          Propose new time
        </button>
      </Panel>
    </div>
  );
}
function Students({ push, people }) {
  return (
    <div className="mt-7">
      <div className="rounded-2xl border border-dashed border-emerald-300 bg-emerald-50 p-5 text-emerald-900">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <p className="font-bold">Invite a student or parent</p>
            <p className="mt-1 text-sm text-emerald-700">
              They can join your class themselves with a secure code.
            </p>
          </div>
          <button
            onClick={() =>
              push("Invite link copied: tutortrack.app/join/ADEWALE24")
            }
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-bold text-white"
          >
            <Link size={16} />
            Copy invite link
          </button>
        </div>
      </div>
      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {people.map((x) => (
          <StudentCard key={x.name} x={x} full />
        ))}
      </div>
    </div>
  );
}
function Assignments({ push, tasks }) {
  return (
    <div className="mt-7 space-y-5">
      <div className="grid gap-4 md:grid-cols-3">
        <Stat
          label="Not submitted"
          value="3"
          detail="Needs follow-up"
          tone="rose"
        />
        <Stat
          label="Submitted"
          value="8"
          detail="Awaiting your review"
          tone="blue"
        />
        <Stat
          label="Graded this week"
          value="12"
          detail="Keep it moving"
          tone="emerald"
        />
      </div>
      <Panel title="Assignment tracker">
        <div className="space-y-3">
          {tasks.map((x, i) => (
            <div
              key={x.title}
              className="flex flex-col gap-3 rounded-xl border border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800"
            >
              <div>
                <p className="font-bold">{x.title}</p>
                <p className="mt-1 text-sm text-slate-500">
                  {x.person} · {x.due}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                <span
                  className={`rounded-full px-3 py-1.5 text-xs font-bold ${x.color}`}
                >
                  {x.status}
                </span>
                <button
                  onClick={() =>
                    push(
                      i === 1
                        ? "Overdue reminder queued for student and parent."
                        : "Submission opened for grading.",
                    )
                  }
                  className="rounded-lg bg-[var(--color-brand-navy)] px-3 py-2 text-xs font-bold text-white"
                >
                  {i === 1 ? "Send reminder" : "Grade"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
function Progress({ progress }) {
  return (
    <div className="mt-7 grid gap-6 xl:grid-cols-[1fr_.85fr]">
      <Panel title="Blessing’s Mathematics checklist" action="Edit syllabus">
        <div className="space-y-4">
          {progress.map((item) => (
            <div key={item.studentId + item.metric} className="flex items-center gap-3 text-sm">
              <span
                className={`grid h-5 w-5 place-items-center rounded-md ${item.score >= 80 ? "bg-emerald-500 text-white" : "border border-slate-300"}`}
              >
                {item.score >= 80 && <Check size={14} />}
              </span>
              <span className={item.score >= 80 ? "text-slate-500 line-through" : ""}>
                {item.metric} · {item.score}%
              </span>
            </div>
          ))}
          <div className="pt-2">
            <div className="mb-2 flex justify-between text-sm font-bold">
              <span>Syllabus completion</span>
              <span className="text-emerald-600">60%</span>
            </div>
            <div className="h-2 rounded-full bg-slate-100">
              <div className="h-full w-3/5 rounded-full bg-emerald-500" />
            </div>
          </div>
        </div>
      </Panel>
      <Panel title="Mock test trend">
        <div className="flex h-52 items-end justify-between gap-3 border-b border-l border-slate-200 px-4 pb-2">
          <Bar h="41%" label="Feb" />
          <Bar h="56%" label="Mar" />
          <Bar h="63%" label="Apr" />
          <Bar h="78%" label="May" />
        </div>
        <p className="mt-5 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800">
          +15 points since February. Share this progress note with parent?
        </p>
        <button className="mt-3 text-sm font-bold text-emerald-600">
          Share update →
        </button>
      </Panel>
    </div>
  );
}
function Payments({ items, markPaid, receipt }) {
  const outstanding = items
    .filter((x) => x.status !== "paid")
    .reduce((a, x) => a + x.amount, 0);
  return (
    <div className="mt-7 space-y-6">
      <div className="overflow-hidden rounded-3xl bg-[var(--color-brand-navy)] p-6 text-white shadow-xl shadow-[var(--color-brand-navy)]/15 sm:p-8">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_.8fr]">
          <div>
            <p className="text-sm font-semibold text-emerald-300">
              Payments overview · September 2026
            </p>
            <p className="mt-3 text-4xl font-extrabold sm:text-5xl">
              {money(outstanding)}
            </p>
            <p className="mt-2 text-sm text-slate-300">
              Outstanding across 2 families
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <span className="rounded-full bg-white/10 px-3 py-2 text-xs font-bold">
                ₦48,000 overdue
              </span>
              <span className="rounded-full bg-white/10 px-3 py-2 text-xs font-bold">
                ₦36,000 upcoming
              </span>
            </div>
          </div>
          <div className="rounded-2xl bg-white/10 p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Collected this month
            </p>
            <p className="mt-3 text-3xl font-extrabold">₦168,000</p>
            <div className="mt-4 h-2 rounded-full bg-white/15">
              <div className="h-full w-[72%] rounded-full bg-emerald-400" />
            </div>
            <p className="mt-2 text-xs text-slate-300">
              72% of September tuition collected
            </p>
          </div>
        </div>
      </div>
      <div className="grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
        <Panel title="Balances" action="Sort: most overdue">
          <div className="space-y-3">
            {items.map((x) => (
              <div
                key={x.id}
                className="flex flex-col gap-3 rounded-2xl border border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800"
              >
                <div className="flex items-center gap-3">
                  <Avatar
                    value={x.name
                      .split(" ")
                      .map((y) => y[0])
                      .join("")}
                  />
                  <div>
                    <p className="font-bold">{x.name}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {x.item} · {x.method}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-4 sm:justify-end">
                  <div className="text-right">
                    <p className="font-extrabold">{money(x.amount)}</p>
                    <Status x={x} />
                  </div>
                  {x.status !== "paid" ? (
                    <button
                      onClick={() => markPaid(x.id)}
                      className="rounded-xl bg-emerald-500 px-3 py-2 text-xs font-bold text-white"
                    >
                      Mark paid
                    </button>
                  ) : (
                    <button
                      onClick={() => receipt(x)}
                      className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold dark:border-slate-700"
                    >
                      Receipt
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Panel>
        <Panel title="Payment reminders">
          <div className="rounded-xl bg-rose-50 p-4">
            <p className="text-sm font-bold text-rose-800">
              Daniel’s tuition is overdue
            </p>
            <p className="mt-1 text-xs leading-5 text-rose-700">
              A friendly reminder is ready to send to the linked parent.
            </p>
            <button className="mt-3 rounded-lg bg-rose-600 px-3 py-2 text-xs font-bold text-white">
              Send reminder
            </button>
          </div>
          <div className="mt-3 rounded-xl bg-amber-50 p-4">
            <p className="text-sm font-bold text-amber-800">
              Blessing’s payment is due soon
            </p>
            <p className="mt-1 text-xs text-amber-700">
              Reminder scheduled for 18 September.
            </p>
          </div>
        </Panel>
      </div>
    </div>
  );
}
function Messages({ push }) {
  return (
    <div className="mt-7 grid min-h-[480px] overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200 lg:grid-cols-[280px_1fr] dark:bg-[var(--color-dark-surface)] dark:ring-slate-800">
      <div className="border-b border-slate-200 p-4 lg:border-b-0 lg:border-r dark:border-slate-800">
        <p className="mb-4 font-extrabold">Structured messages</p>
        {[
          "Blessing Okafor · Direct",
          "Mrs. Okafor · Parent",
          "SS3 Science · Group",
        ].map((x, i) => (
          <button
            key={x}
            className={`mb-1 w-full rounded-xl p-3 text-left text-sm ${i === 0 ? "bg-emerald-50 font-bold text-emerald-800" : "hover:bg-slate-50 dark:hover:bg-slate-800"}`}
          >
            <p>{x}</p>
            <small className="text-slate-500">
              {i === 0 ? "Assignment question" : "Last message yesterday"}
            </small>
          </button>
        ))}
      </div>
      <div className="flex flex-col p-5">
        <div className="border-b border-slate-100 pb-4 dark:border-slate-800">
          <p className="font-bold">Blessing Okafor</p>
          <p className="text-xs text-slate-500">Direct thread · Mathematics</p>
        </div>
        <div className="flex-1 space-y-4 py-6 text-sm">
          <div className="max-w-sm rounded-2xl rounded-tl-sm bg-slate-100 p-3 dark:bg-slate-800">
            Good afternoon sir, is Question 5 compulsory?
          </div>
          <div className="ml-auto max-w-sm rounded-2xl rounded-tr-sm bg-emerald-500 p-3 text-white">
            Focus on Questions 1–4 today. We’ll review Question 5 in our
            session.
          </div>
          <p className="text-center text-xs text-slate-400">
            System · Assignment due tomorrow at 11:59 pm
          </p>
        </div>
        <div className="flex flex-wrap gap-2 pb-[env(safe-area-inset-bottom)]">
          <input
            className="min-w-0 flex-[1_1_12rem] rounded-xl bg-slate-100 px-4 py-3 text-sm outline-emerald-500 dark:bg-slate-800"
            placeholder="Write a message…"
          />
          <button
            type="button"
            onClick={() => push("Message sent to Blessing.")}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[var(--color-brand-navy)] text-white"
          >
            <Send size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}
function Panel({ title, action, click, children }) {
  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 dark:bg-[var(--color-dark-surface)] dark:ring-slate-800">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-extrabold">{title}</h2>
        {action && (
          <button
            onClick={click}
            className="text-xs font-bold text-emerald-600"
          >
            {action} <ArrowRight className="inline" size={13} />
          </button>
        )}
      </div>
      {children}
    </section>
  );
}
function Stat({ icon, label, value, detail, tone = "emerald" }) {
  const s = {
    emerald: "bg-emerald-100 text-emerald-700",
    amber: "bg-amber-100 text-amber-700",
    rose: "bg-rose-100 text-rose-700",
    blue: "bg-sky-100 text-sky-700",
  };
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 dark:bg-[var(--color-dark-surface)] dark:ring-slate-800">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-500">{label}</p>
        {icon && (
          <span
            className={`grid h-9 w-9 place-items-center rounded-xl ${s[tone]}`}
          >
            {icon}
          </span>
        )}
      </div>
      <p className="mt-4 text-3xl font-extrabold">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{detail}</p>
    </div>
  );
}
function Avatar({ value }) {
  return (
    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-orange-100 text-xs font-extrabold text-orange-700">
      {value}
    </span>
  );
}
function StudentCard({ x, full }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 dark:bg-[var(--color-dark-surface)] dark:ring-slate-800">
      <div className="flex justify-between">
        <div className="flex gap-3">
          <Avatar value={x.initials} />
          <div>
            <p className="font-bold">{x.name}</p>
            <p className="text-xs text-slate-500">{x.subject}</p>
          </div>
        </div>
        {full && (
          <button className="text-slate-400">
            <MoreHorizontal />
          </button>
        )}
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3 text-xs">
        <Metric label="Attendance" value={`${x.attendance}%`} />
        <Metric label="Work done" value={`${x.work}%`} />
      </div>
      <p className="mt-4 text-xs leading-5 text-slate-500">{x.note}</p>
    </div>
  );
}
function Metric({ label, value }) {
  return (
    <div>
      <p className="text-[11px] text-slate-500">{label}</p>
      <p className="mt-1 font-extrabold">{value}</p>
    </div>
  );
}
function Task({ x }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
      <div>
        <p className="text-sm font-bold">{x.title}</p>
        <p className="mt-1 text-xs text-slate-500">{x.person}</p>
      </div>
      <span
        className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${x.color}`}
      >
        {x.status}
      </span>
    </div>
  );
}
function Session({ time, student, topic, tag, warn }) {
  return (
    <div className="flex gap-3 rounded-xl border border-slate-100 p-3 dark:border-slate-800">
      <p className="w-14 pt-1 text-xs font-bold text-slate-500">{time}</p>
      <div
        className={`w-1 rounded-full ${warn ? "bg-amber-400" : "bg-emerald-400"}`}
      />
      <div className="flex-1">
        <div className="flex justify-between gap-2">
          <p className="text-sm font-bold">{student}</p>
          <span
            className={`text-[11px] font-bold ${warn ? "text-amber-600" : "text-emerald-600"}`}
          >
            {tag}
          </span>
        </div>
        <p className="mt-1 text-xs text-slate-500">{topic}</p>
      </div>
    </div>
  );
}
function Status({ x }) {
  const statusColors = {
    paid: "text-emerald-600",
    overdue: "text-rose-600",
    pending: "text-amber-600",
  };

  return (
    <p className={`mt-1 text-[11px] font-bold ${statusColors[x.status]}`}>
      ● {x.status[0].toUpperCase() + x.status.slice(1)} · {x.due}
    </p>
  );
}
function Bar({ h, label }) {
  return (
    <div className="flex flex-1 flex-col justify-end gap-2 text-center">
      <span className="rounded-t-lg bg-emerald-400" style={{ height: h }} />
      <small className="text-xs text-slate-500">{label}</small>
    </div>
  );
}
function Modal({ title, close, children }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex justify-between">
          <h2 className="text-xl font-extrabold">{title}</h2>
          <button onClick={close}>×</button>
        </div>
        <div className="mt-5">{children}</div>
      </div>
    </div>
  );
}
function Receipt({ item, close }) {
  return (
    <Modal title="Payment receipt" close={close}>
      <div className="rounded-2xl bg-[var(--color-brand-navy)] p-5 text-white">
        <div className="flex items-center justify-between">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-400 text-[var(--color-brand-navy)]">
            <ReceiptText />
          </span>
          <span className="rounded-full bg-emerald-400/20 px-3 py-1 text-xs font-bold text-emerald-200">
            PAID
          </span>
        </div>
        <p className="mt-7 text-sm text-slate-300">Received from</p>
        <p className="text-xl font-extrabold">{item.name}</p>
        <p className="mt-6 text-3xl font-extrabold">{money(item.amount)}</p>
        <div className="mt-6 border-t border-white/15 pt-4 text-sm text-slate-300">
          <p>September tuition · TutorTrack receipt</p>
          <p className="mt-1">Method: {item.method}</p>
          <p className="mt-1">Ref: TT-MAY-{item.id}092</p>
        </div>
      </div>
      <button
        onClick={close}
        className="mt-4 w-full rounded-xl bg-emerald-500 py-3 font-bold text-white"
      >
        Done
      </button>
    </Modal>
  );
}
