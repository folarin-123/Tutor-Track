import React, { useState, useEffect } from "react";
import { WifiOff } from "lucide-react";

export function OfflineBanner() {
  const [offline, setOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOffline = () => setOffline(true);
    const handleOnline = () => setOffline(false);

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  if (!offline) return null;

  return (
    <div className="fixed top-0 inset-x-0 z-50 flex items-center justify-center gap-2 bg-amber-500 py-1.5 px-4 text-xs font-bold text-gray-950 shadow-md">
      <WifiOff size={15} />
      <span>Working offline. Changes are saved locally on this device.</span>
    </div>
  );
}
