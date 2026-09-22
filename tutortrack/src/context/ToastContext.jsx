import { useState } from "react";
import { ToastContext } from "./ToastContextValue.js";

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

