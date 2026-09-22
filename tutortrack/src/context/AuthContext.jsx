import { useMemo, useState } from "react";
import { AuthContext } from "./AuthContextValue.js";

export function AuthProvider({ children }) {
  const [user, setUser] = useState({
    name: "Avery Brooks",
    role: "tutor",
    email: "avery@tutortrack.app",
  });

  const value = useMemo(() => ({ user, setUser }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

