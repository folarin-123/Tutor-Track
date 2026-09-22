"use client";

import { createContext, useContext, useState } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [message, setMessage] = useState(null);

  const push = (text) => {
    setMessage(text);
    window.setTimeout(() => setMessage(null), 2600);
  };

  return (
    <ToastContext.Provider value={{ message, push }}>
      {children}
      {message && <div className="toast">{message}</div>}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }
  return context;
}
