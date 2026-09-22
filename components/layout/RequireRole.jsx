"use client";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";

export default function RequireRole({ role, children }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/signin", { replace: true });
      return;
    }
    if (user.role !== role) {
      navigate(`/${user.role}`, { replace: true });
    }
  }, [user, role, navigate]);

  if (!user || user.role !== role) {
    return null;
  }

  return children;
}
