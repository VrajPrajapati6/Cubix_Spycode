import { useState, useEffect } from "react";

interface FreezeTimerProps {
  freezeUntil: string | null;
}

export default function FreezeTimer({ freezeUntil }: FreezeTimerProps) {
  const [remaining, setRemaining] = useState("");
  const [isFrozen, setIsFrozen] = useState(false);

  useEffect(() => {
    if (!freezeUntil) {
      setIsFrozen(false);
      setRemaining("");
      return;
    }

    const update = () => {
      const end = new Date(freezeUntil).getTime();
      const now = Date.now();
      const diff = end - now;

      if (diff <= 0) {
        setIsFrozen(false);
        setRemaining("");
        return;
      }

      setIsFrozen(true);
      const mins = Math.floor(diff / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      setRemaining(`${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`);
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [freezeUntil]);

  if (!isFrozen) return null;

  return (
    <span className="inline-flex items-center gap-1 text-mc-blue font-pixel text-xs">
      ❄️ {remaining}
    </span>
  );
}
