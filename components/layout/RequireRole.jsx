"use client";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";

export default function RequireRole({ role, children }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate("/signin", { replace: true });
      return;
    }
    if (user.role !== role) {
      navigate(`/${user.role}`, { replace: true });
    }
  }, [user, loading, role, navigate]);

  if (loading || !user || user.role !== role) {
    return null;
  }

  return children;
}