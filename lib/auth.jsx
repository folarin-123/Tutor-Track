
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
export const PASSWORD_HINT =
  "Use at least 8 characters, with uppercase, lowercase, a number, and a special character.";

export function isStrongPassword(password) {
  return PASSWORD_REGEX.test(password || "");
}

const AuthContext = createContext(null);

async function fetchProfile(uid) {
  try {
    const snap = await getDoc(doc(db, "users", uid));
    return snap.exists() ? snap.data() : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setLoading(false);
        return;
      }
      const profile = await fetchProfile(firebaseUser.uid);
      setUser({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.displayName || profile?.name || "",
        role: profile?.role || "tutor",
        cv: profile?.cv || null,
      });
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signUp = async ({ email, password, name, role, cv }) => {
    const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);
    const trimmedName = typeof name === "string" ? name.trim() : "";
    if (trimmedName) {
      await updateProfile(firebaseUser, { displayName: trimmedName });
    }
    await setDoc(doc(db, "users", firebaseUser.uid), {
      name: trimmedName,
      role,
      cv: cv || null,
    });
    // onAuthStateChanged will pick this up and populate `user` automatically.
  };

  const signIn = async ({ email, password }) => {
    await signInWithEmailAndPassword(auth, email, password);
    // onAuthStateChanged will pick this up and populate `user` automatically.
  };

  const resetPassword = async (email) => {
    await sendPasswordResetEmail(auth, email);
  };

  const signOut = () => firebaseSignOut(auth);

  const value = useMemo(
    () => ({ user, loading, signUp, signIn, signOut, resetPassword }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}