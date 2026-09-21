"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

export default function RequireRole({ role, children }) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace("/signin");
      return;
    }
    if (user.role !== role) {
      router.replace(`/${user.role}`);
    }
  }, [user, role, router]);

  if (!user || user.role !== role) {
    return null;
  }

  return children;
}
