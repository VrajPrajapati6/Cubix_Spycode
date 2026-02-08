import { useMemo } from "react";

const COLORS = [
  "bg-mc-green",
  "bg-mc-red",
  "bg-mc-blue",
  "bg-mc-gold",
  "bg-mc-stone",
  "bg-mc-dirt",
];

export default function PixelParticles({ count = 20 }: { count?: number }) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: Math.random() * 12 + 4,
        left: Math.random() * 100,
        delay: Math.random() * 5,
        duration: Math.random() * 4 + 3,
      })),
    [count]
  );

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p) => (
        <div
          key={p.id}
          className={`absolute ${p.color} opacity-40 animate-float-block`}
          style={{
            width: p.size,
            height: p.size,
            left: `${p.left}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
