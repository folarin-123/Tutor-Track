import { useEffect, useState } from "react";
import { getAssignments } from "../data/assignments.js";

export function useAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getAssignments().then((data) => {
      if (mounted) {
        setAssignments(data);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  return { assignments, loading };
}
