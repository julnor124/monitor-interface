import { useEffect, useState } from "react";
// Streams and derives live telemetry state.

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function useTelemetry(
  seedAz: number,
  seedEl: number,
  seedBars: [number, number, number]
) {
  const [az, setAz] = useState(seedAz);
  const [el, setEl] = useState(seedEl);
  const [bars, setBars] = useState<[number, number, number]>(seedBars);

  useEffect(() => {
    const timer = setInterval(() => {
      setAz((prev) => clamp(prev + (Math.random() - 0.5) * 0.08, 0, 360));
      setEl((prev) => clamp(prev + (Math.random() - 0.5) * 0.06, 0, 90));
      setBars((prev) => [
        clamp(prev[0] + (Math.random() - 0.5) * 10, 20, 95),
        clamp(prev[1] + (Math.random() - 0.5) * 10, 20, 95),
        clamp(prev[2] + (Math.random() - 0.5) * 10, 20, 95),
      ]);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return { az, el, bars };
}
