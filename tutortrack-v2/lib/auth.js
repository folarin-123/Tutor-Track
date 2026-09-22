"use client";

import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

const roleNames = {
  tutor: "Mr. Adewale",
  student: "Blessing",
  parent: "Mrs. Nwachukwu",
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const signIn = (role) => {
    setUser({ role, name: roleNames[role] ?? roleNames.tutor });
  };

  const signOut = () => setUser(null);

  const value = useMemo(() => ({ user, signIn, signOut }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
