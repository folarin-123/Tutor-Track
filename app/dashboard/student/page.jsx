"use client";

import { useState } from "react";
import { CalendarDays, FileUp, MessageCircle } from "lucide-react";
import ScrollableTabs from "@/components/common/ScrollableTabs";
import { EmptyState, MessageThread, Panel } from "@/components/common/Primitives";
import { useStore } from "@/lib/store";
import { useToast } from "@/lib/toast";
import { useAuth } from "@/lib/auth";

const tabs = ["My plan", "Assignments", "Messages"];

export default function StudentPage() {
  const [tab, setTab] = useState("My plan");
  const { push } = useToast();
  const { user } = useAuth();
  const store = useStore();

  return (
    <section className="mx-auto max-w-5xl">
      <p className="text-sm font-semibold text-primary-600">Your exam prep space</p>
      <div className="mt-1 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold">
            {user ? `Keep going, ${user.name}.` : "Keep going."}
          </h1>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            Your tutor will add sessions and assignments here as your plan grows.
          </p>
        </div>
        <button
          onClick={() => push("Message thread opened.")}
          className="inline-flex items-center gap-2 rounded-full bg-primary-900 px-4 py-3 text-sm font-bold text-white"
        >
          <MessageCircle size={17} />
          Ask your tutor
        </button>
      </div>
      <div className="mt-7">
        <ScrollableTabs tabs={tabs} active={tab} onChange={setTab} />
      </div>
      {tab === "My plan" && <Plan store={store} />}
      {tab === "Assignments" && <Assignments store={store} push={push} />}
      {tab === "Messages" && <Messages store={store} push={push} sender={user?.name ?? "Student"} />}
    </section>
  );
}

function Plan({ store }) {
  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_.8fr]">
      <Card title="Upcoming session">
        {store.sessions.length === 0 ? (
          <EmptyState title="No sessions yet" body="Your tutor has not scheduled a session yet." />
        ) : (
          <div className="rounded-3xl bg-primary-900 p-5 text-white">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-primary-400/20 px-3 py-1 text-xs font-bold text-primary-100">
                {store.sessions[0].status.toUpperCase()}
              </span>
              <CalendarDays size={20} className="text-primary-300" />
            </div>
            <p className="mt-6 text-xs font-bold text-primary-200">
              {store.sessions[0].date} · {store.sessions[0].start} to {store.sessions[0].end}
            </p>
            <h2 className="mt-2 text-xl font-extrabold">{store.sessions[0].topic}</h2>
          </div>
        )}
      </Card>
      <Card title="Assignments">
        {store.assignments.length === 0 ? (
          <EmptyState title="Nothing assigned yet" body="Check back after your next session." />
        ) : (
          <div className="space-y-3">
            {store.assignments.map((assignment) => (
              <div key={assignment.id} className="flex justify-between text-sm font-semibold">
                <span>{assignment.title}</span>
                <span className="text-[var(--text-secondary)]">{assignment.status}</span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

function Assignments({ store, push }) {
  return (
    <div className="mt-6 space-y-4">
      <Card title="Your assignments">
        {store.assignments.length === 0 ? (
          <EmptyState title="No assignments yet" body="Your tutor has not assigned any work." />
        ) : (
          <div className="space-y-3">
            {store.assignments.map((assignment) => (
              <div
                key={assignment.id}
                className="rounded-2xl border border-[var(--border-default)] p-4"
              >
                <div className="flex justify-between gap-4">
                  <div>
                    <p className="font-extrabold">{assignment.title}</p>
                    <p className="mt-1 text-sm text-[var(--text-secondary)]">
                      Due {assignment.due} · {assignment.status}
                    </p>
                  </div>
                </div>
                {assignment.status !== "Graded" && (
                  <button
                    onClick={() => push("Submission opened. Attach a photo, file, or text answer.")}
                    className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary-900 px-4 py-2.5 text-sm font-bold text-white"
                  >
                    <FileUp size={16} />
                    Submit work
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

function Messages({ store, push, sender }) {
  const defaultStudent =
    store.students.find(
      (s) =>
        s.id === store.students[0]?.id ||
        (sender && s.name.toLowerCase() === sender.toLowerCase()),
    ) || store.students[0];
  const [selectedStudentId, setSelectedStudentId] = useState(defaultStudent?.id || "");

  const activeStudent =
    store.students.find((s) => s.id === (selectedStudentId || defaultStudent?.id)) ||
    defaultStudent;

  const studentMessages = activeStudent
    ? store.messages.filter(
        (m) => m.studentId === activeStudent.id && (m.channel === "student" || !m.channel),
      )
    : [];

  const handleSend = (body) => {
    if (!activeStudent) return;
    store.sendMessage({
      studentId: activeStudent.id,
      channel: "student",
      from: sender,
      to: "Tutor",
      body,
    });
    push("Message sent.");
  };

  return (
    <div className="mt-6">
      <MessageThread
        messages={studentMessages}
        currentSender={sender}
        onSend={handleSend}
        placeholder="Ask your tutor a question"
        emptyText="No messages yet. Send your tutor a question."
        header={
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-default)] pb-4">
            <div>
              <p className="text-sm font-bold">Your conversation with your tutor</p>
              {activeStudent && (
                <p className="text-xs text-[var(--text-secondary)]">Student: {activeStudent.name}</p>
              )}
            </div>
            {store.students.length > 1 && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-[var(--text-secondary)]">Student:</span>
                <select
                  value={activeStudent?.id}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)] px-3 py-1.5 text-xs font-semibold outline-primary-500"
                >
                  {store.students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        }
      />
    </div>
  );
}

function Card({ title, children }) {
  return (
    <section className="rounded-3xl bg-[var(--bg-surface)] p-5 shadow-sm ring-1 ring-[var(--border-default)]">
      <h2 className="mb-5 font-bold">{title}</h2>
      {children}
    </section>
  );
}
