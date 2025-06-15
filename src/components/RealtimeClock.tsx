
import { useEffect, useState } from "react";

export default function RealtimeClock() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-white/20 text-white rounded-lg px-3 py-1 shadow text-sm font-mono font-semibold tracking-wide backdrop-blur-sm border border-white/30">
      {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
    </div>
  );
}
