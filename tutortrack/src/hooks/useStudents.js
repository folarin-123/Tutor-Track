import { useEffect, useState } from "react";
import { getStudents } from "../data/students.js";

export function useStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getStudents().then((data) => {
      if (mounted) {
        setStudents(data);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  return { students, loading };
}
