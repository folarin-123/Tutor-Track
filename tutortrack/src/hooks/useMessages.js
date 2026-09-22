import { useEffect, useState } from "react";
import { getMessages } from "../data/messages.js";

export function useMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getMessages().then((data) => {
      if (mounted) {
        setMessages(data);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  return { messages, loading };
}
