const STORE_STORAGE_KEY = "tutortrack-store";

function makeId(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

export const initialDemoData = {
  students: [
    { id: "ST-demo-1", name: "Amara Okafor", grade: "SS2", status: "Active", note: "Preparing for WAEC mathematics.", uid: "student-1", parentUid: "parent-1" },
    { id: "ST-demo-2", name: "Daniel Mensah", grade: "SS1", status: "Active", note: "Focused on physics and exam technique.", uid: "student-2", parentUid: "parent-2" },
    { id: "ST-demo-3", name: "Zainab Bello", grade: "SS3", status: "Active", note: "Targeting a distinction in biology.", uid: "student-3", parentUid: "parent-3" },
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
    { id: "PY-demo-1", studentId: "ST-demo-1", studentName: "Amara Okafor", amount: 4500000, month: "September 2026", status: "Paid" },
    { id: "PY-demo-2", studentId: "ST-demo-2", studentName: "Daniel Mensah", amount: 5500000, month: "September 2026", status: "Due" },
    { id: "PY-demo-3", studentId: "ST-demo-3", studentName: "Zainab Bello", amount: 5000000, month: "September 2026", status: "Pending" },
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

function readStore() {
  try {
    const raw = window.localStorage.getItem(STORE_STORAGE_KEY);
    if (!raw) return { students: [], sessions: [], assignments: [], payments: [], messages: [] };
    const parsed = JSON.parse(raw);
    return {
      students: Array.isArray(parsed.students) ? parsed.students : [],
      sessions: Array.isArray(parsed.sessions) ? parsed.sessions : [],
      assignments: Array.isArray(parsed.assignments) ? parsed.assignments : [],
      payments: Array.isArray(parsed.payments) ? parsed.payments : [],
      messages: Array.isArray(parsed.messages) ? parsed.messages : [],
    };
  } catch {
    return { students: [], sessions: [], assignments: [], payments: [], messages: [] };
  }
}

function writeStore(data) {
  try {
    window.localStorage.setItem(STORE_STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Storage unavailable
  }
}

export async function listStudents() {
  const store = readStore();
  return store.students;
}

export async function addStudent(input) {
  const store = readStore();
  const student = {
    id: makeId("ST"),
    name: input.name,
    grade: input.grade || "SS1",
    status: "Active",
    note: input.note || "",
    uid: input.uid || "",
    parentUid: input.parentUid || "",
  };
  store.students.push(student);
  writeStore(store);
  return student;
}

export async function updateStudent(id, patch) {
  const store = readStore();
  store.students = store.students.map((item) => (item.id === id ? { ...item, ...patch } : item));
  writeStore(store);
  return store.students.find((item) => item.id === id);
}

export async function listSessions() {
  const store = readStore();
  return store.sessions;
}

export async function addSession(input) {
  const store = readStore();
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
  store.sessions.push(session);
  writeStore(store);
  return session;
}

export async function listAssignments() {
  const store = readStore();
  return store.assignments;
}

export async function addAssignment(input) {
  const store = readStore();
  const assignment = {
    id: makeId("A"),
    studentId: input.studentId || null,
    studentName: input.studentName || "Unassigned",
    title: input.title,
    due: input.due,
    status: "Draft",
    score: null,
  };
  store.assignments.push(assignment);
  writeStore(store);
  return assignment;
}

export async function gradeAssignment(id, score) {
  const store = readStore();
  store.assignments = store.assignments.map((item) =>
    item.id === id
      ? { ...item, status: "Graded", score: score == null || score === "" ? null : Number(score) }
      : item,
  );
  writeStore(store);
  return store.assignments.find((item) => item.id === id);
}

export async function listInvoices() {
  const store = readStore();
  return store.payments;
}

export async function addPayment(input) {
  const store = readStore();
  const payment = {
    id: makeId("PY"),
    studentId: input.studentId || null,
    studentName: input.studentName || "Unassigned",
    amount: Number(input.amount) || 0, // kobo integer
    month: input.month,
    status: "Due",
  };
  store.payments.push(payment);
  writeStore(store);
  return payment;
}

export async function markPaymentPaid(id) {
  const store = readStore();
  store.payments = store.payments.map((item) =>
    item.id === id ? { ...item, status: "Paid" } : item,
  );
  writeStore(store);
  return store.payments.find((item) => item.id === id);
}

export async function listThreads() {
  const store = readStore();
  return store.messages;
}

export async function sendMessage(input) {
  const store = readStore();
  const message = {
    id: makeId("M"),
    studentId: input.studentId || input.conversation?.studentId,
    channel: input.channel || input.conversation?.channel || "student",
    from: input.from || input.senderId || "Me",
    to: input.to || "TutorTrack",
    body: input.body || input.text || "",
    timestamp: Date.now(),
  };
  store.messages.push(message);
  writeStore(store);
  return message;
}

export async function loadDemoData() {
  writeStore(initialDemoData);
  return initialDemoData;
}

export function subscribeToConversations(uid, onChange) {
  const store = readStore();
  const threadsMap = {};
  store.messages.forEach((m) => {
    const threadKey = `${m.studentId}-${m.channel}`;
    if (!threadsMap[threadKey]) {
      const student = store.students.find((s) => s.id === m.studentId) || { name: m.from };
      threadsMap[threadKey] = {
        id: threadKey,
        studentId: student.uid || m.studentId,
        channel: m.channel,
        parentId: student.parentUid || null,
        tutorId: "tutor-1",
        participants: [student.uid || m.studentId, "tutor-1"],
        lastMessage: m.body,
        lastMessageAt: m.timestamp,
        tutorUnread: 0,
        studentUnread: 0,
        parentUnread: 0,
        studentName: student.name,
        tutorName: "Mr. Adewale",
      };
    } else {
      threadsMap[threadKey].lastMessage = m.body;
      threadsMap[threadKey].lastMessageAt = m.timestamp;
    }
  });

  const items = Object.values(threadsMap).sort((a, b) => b.lastMessageAt - a.lastMessageAt);
  const timer = setTimeout(() => onChange(items), 10);
  return () => clearTimeout(timer);
}

export function subscribeToMessages(conversationId, onChange) {
  const store = readStore();
  const [studentId, channel] = conversationId.split("-");
  const filtered = store.messages
    .filter((m) => m.studentId === studentId && (channel ? m.channel === channel : true))
    .map((m) => ({
      id: m.id,
      senderId: m.from,
      senderRole: m.channel,
      text: m.body,
      createdAt: m.timestamp,
      read: true,
    }))
    .sort((a, b) => a.createdAt - b.createdAt);

  const timer = setTimeout(() => onChange(filtered), 10);
  return () => clearTimeout(timer);
}

export async function getOrCreateConversation({ studentId, channel }) {
  return {
    id: `${studentId}-${channel}`,
    studentId,
    channel,
    tutorId: "tutor-1",
    participants: [studentId, "tutor-1"],
    lastMessage: "",
    lastMessageAt: Date.now(),
    tutorUnread: 0,
    studentUnread: 0,
    parentUnread: 0,
  };
}

export async function markConversationRead() {
  return Promise.resolve();
}
