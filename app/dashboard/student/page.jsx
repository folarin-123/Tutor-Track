import { useState } from "react";
import { CalendarDays, FileUp, MessageCircle, RefreshCw } from "lucide-react";
import ScrollableTabs from "@/components/common/ScrollableTabs";
import { EmptyState, SecondaryButton } from "@/components/common/Primitives";
import { SkeletonCard, SkeletonList } from "@/components/ui/Skeleton";
import MessagingPanel from "@/src/features/messaging/components/MessagingPanel";
import { useStore } from "@/lib/store";
import { useToast } from "@/lib/toast";
import { useAuth } from "@/lib/auth";
import { formatDate } from "@/src/lib/formatters";

const tabs = ["My plan", "Assignments", "Messages"];

export default function StudentPage() {
  const [tab, setTab] = useState("My plan");
  const { push } = useToast();
  const { user } = useAuth();
  const store = useStore();

  return (
    <section className="mx-auto max-w-5xl">
      <p className="text-sm font-semibold text-primary-600 dark:text-primary-400">Your exam prep space</p>
      <div className="mt-1 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-[var(--text-primary)]">
            {user ? `Keep going, ${user.name}.` : "Keep going."}
          </h1>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            Your tutor will add sessions and assignments here as your plan grows.
          </p>
        </div>
        <button
          onClick={() => setTab("Messages")}
          className="inline-flex items-center gap-2 rounded-full bg-primary-900 px-4 py-3 text-sm font-bold text-white cursor-pointer hover:bg-primary-800"
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
      {tab === "Messages" && <Messages user={user} />}
    </section>
  );
}

function Plan({ store }) {
  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_.8fr]">
      <Card title="Upcoming session">
        {store.sessionsLoading ? (
          <SkeletonCard />
        ) : store.sessionsError ? (
          <div className="text-center py-4 text-xs font-semibold text-danger-500">
            {store.sessionsError}{" "}
            <SecondaryButton onClick={store.fetchSessions} className="ml-2">
              <RefreshCw size={12} className="inline mr-1" /> Retry
            </SecondaryButton>
          </div>
        ) : store.sessions.length === 0 ? (
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
              {formatDate(store.sessions[0].date)} · {store.sessions[0].start} to {store.sessions[0].end}
            </p>
            <h2 className="mt-2 text-xl font-extrabold">{store.sessions[0].topic}</h2>
          </div>
        )}
      </Card>
      <Card title="Assignments">
        {store.assignmentsLoading ? (
          <SkeletonList count={2} />
        ) : store.assignmentsError ? (
          <div className="text-center py-4 text-xs font-semibold text-danger-500">
            {store.assignmentsError}{" "}
            <SecondaryButton onClick={store.fetchAssignments} className="ml-2">
              <RefreshCw size={12} className="inline mr-1" /> Retry
            </SecondaryButton>
          </div>
        ) : store.assignments.length === 0 ? (
          <EmptyState title="Nothing assigned yet" body="Check back after your next session." />
        ) : (
          <div className="space-y-3">
            {store.assignments.map((assignment) => (
              <div key={assignment.id} className="flex justify-between text-sm font-semibold text-[var(--text-primary)]">
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
        {store.assignmentsLoading ? (
          <SkeletonList count={3} />
        ) : store.assignmentsError ? (
          <div className="text-center py-4 text-xs font-semibold text-danger-500">
            {store.assignmentsError}{" "}
            <SecondaryButton onClick={store.fetchAssignments} className="ml-2">
              <RefreshCw size={12} className="inline mr-1" /> Retry
            </SecondaryButton>
          </div>
        ) : store.assignments.length === 0 ? (
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
                    <p className="font-extrabold text-[var(--text-primary)]">{assignment.title}</p>
                    <p className="mt-1 text-sm text-[var(--text-secondary)]">
                      Due {formatDate(assignment.due)} · {assignment.status}
                    </p>
                  </div>
                </div>
                {assignment.status !== "Graded" && (
                  <button
                    onClick={() => push("Submission opened. Attach a photo, file, or text answer.")}
                    className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary-900 px-4 py-2.5 text-sm font-bold text-white cursor-pointer hover:bg-primary-800"
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

function Messages({ user }) {
  return <MessagingPanel role="student" user={user} />;
}

function Card({ title, children }) {
  return (
    <section className="rounded-3xl bg-[var(--bg-surface)] p-5 shadow-sm ring-1 ring-[var(--border-default)]">
      <h2 className="mb-5 font-bold text-[var(--text-primary)]">{title}</h2>
      {children}
    </section>
  );
}
