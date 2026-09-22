import { useEffect, useState } from "react";
import { getProgress } from "../data/progress.js";

export function useProgress() {
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getProgress().then((data) => {
      if (mounted) {
        setProgress(data);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  return { progress, loading };
}
