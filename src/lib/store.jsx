import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  addAssignment as apiAddAssignment,
  addPayment as apiAddPayment,
  addSession as apiAddSession,
  addStudent as apiAddStudent,
  gradeAssignment as apiGradeAssignment,
  listAssignments as apiListAssignments,
  listInvoices as apiListInvoices,
  listSessions as apiListSessions,
  listStudents as apiListStudents,
  listThreads as apiListThreads,
  loadDemoData as apiLoadDemoData,
  markPaymentPaid as apiMarkPaymentPaid,
  sendMessage as apiSendMessage,
  updateStudent as apiUpdateStudent,
} from "@/lib/api";

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [students, setStudents] = useState([]);
  const [studentsLoading, setStudentsLoading] = useState(true);
  const [studentsError, setStudentsError] = useState(null);

  const [sessions, setSessions] = useState([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [sessionsError, setSessionsError] = useState(null);

  const [assignments, setAssignments] = useState([]);
  const [assignmentsLoading, setAssignmentsLoading] = useState(true);
  const [assignmentsError, setAssignmentsError] = useState(null);

  const [payments, setPayments] = useState([]);
  const [paymentsLoading, setPaymentsLoading] = useState(true);
  const [paymentsError, setPaymentsError] = useState(null);

  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(true);
  const [messagesError, setMessagesError] = useState(null);

  const fetchStudents = useCallback(async () => {
    setStudentsLoading(true);
    setStudentsError(null);
    try {
      const data = await apiListStudents();
      setStudents(data);
    } catch (err) {
      setStudentsError(err.message || "Failed to load students.");
    } finally {
      setStudentsLoading(false);
    }
  }, []);

  const fetchSessions = useCallback(async () => {
    setSessionsLoading(true);
    setSessionsError(null);
    try {
      const data = await apiListSessions();
      setSessions(data);
    } catch (err) {
      setSessionsError(err.message || "Failed to load sessions.");
    } finally {
      setSessionsLoading(false);
    }
  }, []);

  const fetchAssignments = useCallback(async () => {
    setAssignmentsLoading(true);
    setAssignmentsError(null);
    try {
      const data = await apiListAssignments();
      setAssignments(data);
    } catch (err) {
      setAssignmentsError(err.message || "Failed to load assignments.");
    } finally {
      setAssignmentsLoading(false);
    }
  }, []);

  const fetchPayments = useCallback(async () => {
    setPaymentsLoading(true);
    setPaymentsError(null);
    try {
      const data = await apiListInvoices();
      setPayments(data);
    } catch (err) {
      setPaymentsError(err.message || "Failed to load payments.");
    } finally {
      setPaymentsLoading(false);
    }
  }, []);

  const fetchMessages = useCallback(async () => {
    setMessagesLoading(true);
    setMessagesError(null);
    try {
      const data = await apiListThreads();
      setMessages(data);
    } catch (err) {
      setMessagesError(err.message || "Failed to load messages.");
    } finally {
      setMessagesLoading(false);
    }
  }, []);

  const fetchAll = useCallback(async () => {
    await Promise.all([
      fetchStudents(),
      fetchSessions(),
      fetchAssignments(),
      fetchPayments(),
      fetchMessages(),
    ]);
  }, [fetchStudents, fetchSessions, fetchAssignments, fetchPayments, fetchMessages]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const addStudent = useCallback(async (input) => {
    const student = await apiAddStudent(input);
    setStudents((list) => [...list, student]);
    return student;
  }, []);

  const updateStudent = useCallback(async (id, patch) => {
    const updated = await apiUpdateStudent(id, patch);
    setStudents((list) =>
      list.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );
    return updated;
  }, []);

  const addSession = useCallback(async (input) => {
    const session = await apiAddSession(input);
    setSessions((list) => [...list, session]);
    return session;
  }, []);

  const addAssignment = useCallback(async (input) => {
    const assignment = await apiAddAssignment(input);
    setAssignments((list) => [...list, assignment]);
    return assignment;
  }, []);

  const gradeAssignment = useCallback(async (id, score) => {
    const updated = await apiGradeAssignment(id, score);
    setAssignments((list) =>
      list.map((item) =>
        item.id === id
          ? { ...item, status: "Graded", score: score == null || score === "" ? null : Number(score) }
          : item,
      ),
    );
    return updated;
  }, []);

  const addPayment = useCallback(async (input) => {
    const payment = await apiAddPayment(input);
    setPayments((list) => [...list, payment]);
    return payment;
  }, []);

  const markPaymentPaid = useCallback(async (id) => {
    const updated = await apiMarkPaymentPaid(id);
    setPayments((list) =>
      list.map((item) => (item.id === id ? { ...item, status: "Paid" } : item)),
    );
    return updated;
  }, []);

  const sendMessage = useCallback(async (input) => {
    const message = await apiSendMessage(input);
    setMessages((list) => [...list, message]);
    return message;
  }, []);

  const loadDemoData = useCallback(async () => {
    await apiLoadDemoData();
    await fetchAll();
  }, [fetchAll]);

  const value = useMemo(
    () => ({
      students,
      studentsLoading,
      studentsError,
      fetchStudents,

      sessions,
      sessionsLoading,
      sessionsError,
      fetchSessions,

      assignments,
      assignmentsLoading,
      assignmentsError,
      fetchAssignments,

      payments,
      paymentsLoading,
      paymentsError,
      fetchPayments,

      messages,
      messagesLoading,
      messagesError,
      fetchMessages,

      addStudent,
      updateStudent,
      addSession,
      addAssignment,
      gradeAssignment,
      addPayment,
      markPaymentPaid,
      sendMessage,
      loadDemoData,
      fetchAll,
    }),
    [
      students,
      studentsLoading,
      studentsError,
      fetchStudents,
      sessions,
      sessionsLoading,
      sessionsError,
      fetchSessions,
      assignments,
      assignmentsLoading,
      assignmentsError,
      fetchAssignments,
      payments,
      paymentsLoading,
      paymentsError,
      fetchPayments,
      messages,
      messagesLoading,
      messagesError,
      fetchMessages,
      addStudent,
      updateStudent,
      addSession,
      addAssignment,
      gradeAssignment,
      addPayment,
      markPaymentPaid,
      sendMessage,
      loadDemoData,
      fetchAll,
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
