"use client";

import { useState } from "react";
import { Bell, CalendarDays, CircleDollarSign, MessageCircle, Send } from "lucide-react";
import ScrollableTabs from "@/components/common/ScrollableTabs";
import { EmptyState, Panel } from "@/components/common/Primitives";
import { useStore } from "@/lib/store";
import { useToast } from "@/lib/toast";
import { useAuth } from "@/lib/auth";

const tabs = ["Overview", "Assignments", "Payments", "Messages"];
const money = (n) => `$${Number(n || 0).toLocaleString("en-US")}`;

export default function ParentPage() {
  const [tab, setTab] = useState("Overview");
  const { push } = useToast();
  const { user } = useAuth();
  const store = useStore();

  return (
    <section className="mx-auto max-w-5xl">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold text-primary-600">Learning update</p>
          <h1 className="mt-1 text-3xl font-extrabold">
            {user ? `Hello, ${user.name}.` : "Hello."}
          </h1>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            A clear, read only view of how things are going.
          </p>
        </div>
        <button
          onClick={() => push("Notification preferences opened.")}
          className="inline-flex items-center gap-2 rounded-full border border-[var(--border-default)] bg-[var(--bg-surface)] px-4 py-3 text-sm font-bold"
        >
          <Bell size={16} />
          Alerts
        </button>
      </div>
      <div className="mt-7">
        <ScrollableTabs tabs={tabs} active={tab} onChange={setTab} />
      </div>
      {tab === "Overview" && <Overview store={store} />}
      {tab === "Assignments" && <Assignments store={store} />}
      {tab === "Payments" && <Payments store={store} push={push} />}
      {tab === "Messages" && <Messages store={store} push={push} sender={user?.name ?? "Parent"} />}
    </section>
  );
}

function Overview({ store }) {
  return (
    <div className="mt-6 grid gap-5 md:grid-cols-2">
      <Card title="Upcoming session">
        {store.sessions.length === 0 ? (
          <EmptyState title="No sessions yet" body="Nothing scheduled yet." />
        ) : (
          <div className="rounded-3xl bg-primary-900 p-5 text-white">
            <CalendarDays className="text-primary-300" />
            <p className="mt-5 text-xs font-bold text-primary-200">
              {store.sessions[0].date} · {store.sessions[0].start}
            </p>
            <p className="mt-2 text-xl font-extrabold">{store.sessions[0].topic}</p>
          </div>
        )}
      </Card>
      <Card title="At a glance">
        <div className="grid grid-cols-2 gap-3">
          <Kpi n={store.assignments.length} l="Assignments" />
          <Kpi n={store.sessions.length} l="Sessions" />
        </div>
      </Card>
    </div>
  );
}

function Assignments({ store }) {
  return (
    <div className="mt-6">
      <Card title="Assignment status">
        {store.assignments.length === 0 ? (
          <EmptyState title="No assignments yet" body="Nothing assigned yet." />
        ) : (
          <div className="space-y-3">
            {store.assignments.map((assignment) => (
              <div
                key={assignment.id}
                className="rounded-2xl bg-[var(--bg-surface-muted)] p-4"
              >
                <p className="font-bold">{assignment.title}</p>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">
                  Due {assignment.due} · {assignment.status}
                </p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

function Payments({ store, push }) {
  const balance = store.payments
    .filter((item) => item.status !== "Paid")
    .reduce((sum, item) => sum + item.amount, 0);
  return (
    <div className="mt-6 grid gap-5 md:grid-cols-[1.1fr_.9fr]">
      <Card title="Payment status">
        <div className="rounded-3xl bg-primary-900 p-5 text-white">
          <CircleDollarSign className="text-primary-300" />
          <p className="mt-5 text-sm text-primary-100">Balance due</p>
          <p className="mt-1 text-4xl font-extrabold">{money(balance)}</p>
          <button
            onClick={() => push("Payment flow would open here.")}
            className="mt-5 rounded-full bg-primary-400 px-4 py-2.5 text-sm font-bold text-primary-900"
          >
            Pay securely
          </button>
        </div>
      </Card>
      <Card title="Payment history">
        {store.payments.length === 0 ? (
          <EmptyState title="No payments yet" body="Nothing recorded yet." />
        ) : (
          <div className="space-y-3">
            {store.payments.map((payment) => (
              <div key={payment.id} className="rounded-2xl bg-[var(--bg-surface-muted)] p-4">
                <p className="font-bold">{payment.month}</p>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">
                  {money(payment.amount)} · {payment.status}
                </p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

function Messages({ store, push, sender }) {
  const [draft, setDraft] = useState("");

  const send = () => {
    if (!draft.trim()) return;
    store.sendMessage({ from: sender, to: "Tutor", body: draft.trim() });
    setDraft("");
    push("Message sent.");
  };

  return (
    <div className="mt-6 flex min-h-[400px] flex-col rounded-3xl bg-[var(--bg-surface)] p-5 ring-1 ring-[var(--border-default)]">
      <div className="flex items-center gap-2 border-b border-[var(--border-default)] pb-4">
        <MessageCircle size={18} className="text-primary-600" />
        <p className="font-bold">Message the tutor</p>
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto py-4">
        {store.messages.length === 0 ? (
          <p className="text-center text-sm text-[var(--text-secondary)]">No messages yet.</p>
        ) : (
          store.messages.map((message) => (
            <p key={message.id} className="max-w-sm rounded-2xl bg-[var(--bg-surface-muted)] p-3 text-sm">
              {message.body}
            </p>
          ))
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          className="min-w-0 flex-[1_1_12rem] rounded-full bg-[var(--bg-surface-muted)] px-4 py-3 text-sm outline-primary-500"
          placeholder="Ask the tutor a question"
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

function Card({ title, children }) {
  return (
    <section className="rounded-3xl bg-[var(--bg-surface)] p-5 shadow-sm ring-1 ring-[var(--border-default)]">
      <h2 className="mb-5 font-bold">{title}</h2>
      {children}
    </section>
  );
}

function Kpi({ n, l }) {
  return (
    <div className="rounded-2xl bg-[var(--bg-surface-muted)] p-3 text-center">
      <p className="text-xl font-extrabold">{n}</p>
      <p className="mt-1 text-[11px] text-[var(--text-secondary)]">{l}</p>
    </div>
  );
}
