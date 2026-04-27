import { useEffect, useState } from "react";
// Emits a ticking UTC timestamp for UI updates.

export function useUtcTick() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 250);
    return () => window.clearInterval(timer);
  }, []);

  return now;
}
