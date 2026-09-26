
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const StoreContext = createContext(null);
const STORE_STORAGE_KEY = "tutortrack-store";

function makeId(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

const demoData = {
  students: [
    { id: "ST-demo-1", name: "Amara Okafor", grade: "SS2", status: "Active", note: "Preparing for WAEC mathematics." },
    { id: "ST-demo-2", name: "Daniel Mensah", grade: "SS1", status: "Active", note: "Focused on physics and exam technique." },
    { id: "ST-demo-3", name: "Zainab Bello", grade: "SS3", status: "Active", note: "Targeting a distinction in biology." },
  ],
  sessions: [
    { id: "S-demo-1", studentId: "ST-demo-1", studentName: "Amara Okafor", date: "2026-09-24", start: "16:00", end: "17:00", topic: "Quadratic equations", status: "Scheduled" },
    { id: "S-demo-2", studentId: "ST-demo-2", studentName: "Daniel Mensah", date: "2026-09-25", start: "17:30", end: "18:30", topic: "Electric fields revision", status: "Scheduled" },
  ],
  assignments: [
    { id: "A-demo-1", studentId: "ST-demo-1", studentName: "Amara Okafor", title: "Complete algebra practice set", due: "2026-09-26", status: "Assigned" },
    { id: "A-demo-2", studentId: "ST-demo-2", studentName: "Daniel Mensah", title: "Submit circuit calculations", due: "2026-09-23", status: "Submitted" },
    { id: "A-demo-3", studentId: "ST-demo-3", studentName: "Zainab Bello", title: "Mark biology mock paper", due: "2026-09-21", status: "Graded", score: 78 },
    { id: "A-demo-4", studentId: "ST-demo-1", studentName: "Amara Okafor", title: "Algebra revision quiz", due: "2026-09-05", status: "Graded", score: 72 },
    { id: "A-demo-5", studentId: "ST-demo-1", studentName: "Amara Okafor", title: "Functions problem set", due: "2026-08-20", status: "Graded", score: 84 },
    { id: "A-demo-10", studentId: "ST-demo-1", studentName: "Amara Okafor", title: "Coordinate geometry drill", due: "2026-09-18", status: "Graded", score: 80 },
    { id: "A-demo-6", studentId: "ST-demo-2", studentName: "Daniel Mensah", title: "Forces review worksheet", due: "2026-09-10", status: "Graded", score: 81 },
    { id: "A-demo-7", studentId: "ST-demo-2", studentName: "Daniel Mensah", title: "Mechanics checkpoint", due: "2026-08-25", status: "Graded", score: 76 },
    { id: "A-demo-8", studentId: "ST-demo-3", studentName: "Zainab Bello", title: "Cell biology quiz", due: "2026-09-12", status: "Graded", score: 88 },
    { id: "A-demo-9", studentId: "ST-demo-3", studentName: "Zainab Bello", title: "Genetics practice paper", due: "2026-08-28", status: "Graded", score: 83 },
  ],
  payments: [
    { id: "PY-demo-1", studentId: "ST-demo-1", studentName: "Amara Okafor", amount: 45000, month: "September 2026", status: "Paid" },
    { id: "PY-demo-2", studentId: "ST-demo-2", studentName: "Daniel Mensah", amount: 55000, month: "September 2026", status: "Due" },
    { id: "PY-demo-3", studentId: "ST-demo-3", studentName: "Zainab Bello", amount: 50000, month: "September 2026", status: "Pending" },
  ],
  messages: [
    {
      id: "M-demo-1",
      studentId: "ST-demo-1",
      channel: "student",
      from: "Amara Okafor",
      to: "Mr. Adewale",
      body: "Good afternoon Mr. Adewale, I had a question on question 4 of the algebra practice set.",
      timestamp: Date.now() - 7200000,
    },
    {
      id: "M-demo-2",
      studentId: "ST-demo-1",
      channel: "student",
      from: "Mr. Adewale",
      to: "Amara Okafor",
      body: "Let's review the quadratic formula step together in our next session.",
      timestamp: Date.now() - 3600000,
    },
    {
      id: "M-demo-3",
      studentId: "ST-demo-1",
      channel: "parent",
      from: "Mr. Okafor",
      to: "Mr. Adewale",
      body: "Thank you for the update on Amara's math progress this term.",
      timestamp: Date.now() - 86400000 * 2,
    },
    {
      id: "M-demo-4",
      studentId: "ST-demo-2",
      channel: "student",
      from: "Daniel Mensah",
      to: "Mr. Adewale",
      body: "I submitted the physics circuit calculations for review.",
      timestamp: Date.now() - 14400000,
    },
    {
      id: "M-demo-5",
      studentId: "ST-demo-2",
      channel: "parent",
      from: "Mrs. Mensah",
      to: "Mr. Adewale",
      body: "Could we confirm the start time for Friday's physics session?",
      timestamp: Date.now() - 86400000,
    },
    {
      id: "M-demo-6",
      studentId: "ST-demo-3",
      channel: "parent",
      from: "Mrs. Bello",
      to: "Mr. Adewale",
      body: "Zainab enjoyed the mock review. Could we confirm the next biology session?",
      timestamp: Date.now() - 86400000,
    },
    {
      id: "M-demo-7",
      studentId: "ST-demo-3",
      channel: "student",
      from: "Zainab Bello",
      to: "Mr. Adewale",
      body: "Thank you for grading the mock paper! I understand the genetics part now.",
      timestamp: Date.now() - 1800000,
    },
  ],
};

export function StoreProvider({ children }) {
  const [students, setStudents] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [payments, setPayments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const savedStore = window.localStorage.getItem(STORE_STORAGE_KEY);
      if (savedStore) {
        const data = JSON.parse(savedStore);
        setStudents(Array.isArray(data.students) ? data.students : []);
        setSessions(Array.isArray(data.sessions) ? data.sessions : []);
        setAssignments(Array.isArray(data.assignments) ? data.assignments : []);
        setPayments(Array.isArray(data.payments) ? data.payments : []);
        setMessages(
          Array.isArray(data.messages)
            ? data.messages.map((m) => ({
                ...m,
                studentId: m.studentId || "ST-demo-1",
                channel: m.channel || "student",
              }))
            : [],
        );
      }
    } catch {
      setStudents([]);
      setSessions([]);
      setAssignments([]);
      setPayments([]);
      setMessages([]);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(
        STORE_STORAGE_KEY,
        JSON.stringify({ students, sessions, assignments, payments, messages }),
      );
    } catch {
      // Storage may be unavailable in private browsing or restricted environments.
    }
  }, [students, sessions, assignments, payments, messages, hydrated]);

  const addStudent = useCallback((input) => {
    const student = {
      id: makeId("ST"),
      name: input.name,
      grade: input.grade || "Not set",
      status: "Active",
      note: input.note || "",
    };
    setStudents((list) => [...list, student]);
    return student;
  }, []);

  const addSession = useCallback((input) => {
    const session = {
      id: makeId("S"),
      studentId: input.studentId || null,
      studentName: input.studentName || "Unassigned",
      date: input.date,
      start: input.start,
      end: input.end,
      topic: input.topic,
      status: "Scheduled",
    };
    setSessions((list) => [...list, session]);
    return session;
  }, []);

  const addAssignment = useCallback((input) => {
    const assignment = {
      id: makeId("A"),
      studentId: input.studentId || null,
      studentName: input.studentName || "Unassigned",
      title: input.title,
      due: input.due,
      status: "Draft",
      score: null,
    };
    setAssignments((list) => [...list, assignment]);
    return assignment;
  }, []);

  const gradeAssignment = useCallback((id, score) => {
    setAssignments((list) =>
      list.map((item) =>
        item.id === id
          ? { ...item, status: "Graded", score: score == null || score === "" ? null : Number(score) }
          : item,
      ),
    );
  }, []);

  const addPayment = useCallback((input) => {
    const payment = {
      id: makeId("PY"),
      studentId: input.studentId || null,
      studentName: input.studentName || "Unassigned",
      amount: Number(input.amount) || 0,
      month: input.month,
      status: "Due",
    };
    setPayments((list) => [...list, payment]);
    return payment;
  }, []);

  const markPaymentPaid = useCallback((id) => {
    setPayments((list) =>
      list.map((item) => (item.id === id ? { ...item, status: "Paid" } : item)),
    );
  }, []);

  const sendMessage = useCallback((input) => {
    const message = {
      id: makeId("M"),
      studentId: input.studentId,
      channel: input.channel || "student",
      from: input.from,
      to: input.to,
      body: input.body,
      timestamp: Date.now(),
    };
    setMessages((list) => [...list, message]);
    return message;
  }, []);

  const loadDemoData = useCallback(() => {
    setStudents(demoData.students);
    setSessions(demoData.sessions);
    setAssignments(demoData.assignments);
    setPayments(demoData.payments);
    setMessages(demoData.messages);
  }, []);

  const value = useMemo(
    () => ({
      students,
      sessions,
      assignments,
      payments,
      messages,
      addStudent,
      addSession,
      addAssignment,
      gradeAssignment,
      addPayment,
      markPaymentPaid,
      sendMessage,
      loadDemoData,
    }),
    [
      students,
      sessions,
      assignments,
      payments,
      messages,
      addStudent,
      addSession,
      addAssignment,
      gradeAssignment,
      addPayment,
      markPaymentPaid,
      sendMessage,
      loadDemoData,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used inside StoreProvider");
  }
  return context;
}
