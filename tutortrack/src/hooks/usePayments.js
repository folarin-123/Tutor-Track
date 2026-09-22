import { useEffect, useState } from "react";
import { getPayments } from "../data/payments.js";

export function usePayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getPayments().then((data) => {
      if (mounted) {
        setPayments(data);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  return { payments, loading };
}
