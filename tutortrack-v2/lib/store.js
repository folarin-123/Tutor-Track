"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

const StoreContext = createContext(null);

function makeId(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

export function StoreProvider({ children }) {
  const [students, setStudents] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [payments, setPayments] = useState([]);
  const [messages, setMessages] = useState([]);

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
    };
    setAssignments((list) => [...list, assignment]);
    return assignment;
  }, []);

  const gradeAssignment = useCallback((id) => {
    setAssignments((list) =>
      list.map((item) => (item.id === id ? { ...item, status: "Graded" } : item)),
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
      from: input.from,
      to: input.to,
      body: input.body,
      timestamp: Date.now(),
    };
    setMessages((list) => [...list, message]);
    return message;
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
