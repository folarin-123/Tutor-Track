import { useEffect, useState } from "react";
import { getSessions } from "../data/sessions.js";

export function useSessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getSessions().then((data) => {
      if (mounted) {
        setSessions(data);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  return { sessions, loading };
}
