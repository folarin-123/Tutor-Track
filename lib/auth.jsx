"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);
const USER_STORAGE_KEY = "tutortrack-user";

const roleNames = {
  tutor: "Mr. Adewale",
  student: "Blessing",
  parent: "Mrs. Nwachukwu",
};

function getSavedUser() {
  try {
    const savedUser = window.localStorage.getItem(USER_STORAGE_KEY);
    return savedUser ? JSON.parse(savedUser) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getSavedUser);

  useEffect(() => {
    try {
      const savedUser = window.localStorage.getItem(USER_STORAGE_KEY);
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    try {
      if (user) {
        window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      } else {
        window.localStorage.removeItem(USER_STORAGE_KEY);
      }
    } catch {
      // Storage may be unavailable in private browsing or restricted environments.
    }
  }, [user]);

  const signIn = (role, name, extra = {}) => {
    const trimmedName = typeof name === "string" ? name.trim() : "";
    const resolvedName = trimmedName || (roleNames[role] ?? roleNames.tutor);
    const extraData = extra && typeof extra === "object" ? (extra.cv ? extra : { cv: extra }) : {};
    setUser((prev) => ({
      ...(prev || {}),
      role,
      name: resolvedName,
      ...extraData,
    }));
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
