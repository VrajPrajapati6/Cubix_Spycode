import { useMemo } from "react";

const LAVA_COLORS = [
  "#ff4500",
  "#ff6a00",
  "#cc3300",
  "#ff8c1a",
  "#992200",
];

export default function LavaBlocks({ count = 24 }: { count?: number }) {
  const blocks = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        color: LAVA_COLORS[Math.floor(Math.random() * LAVA_COLORS.length)],
        size: Math.random() * 8 + 6,
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 4,
        duration: Math.random() * 3 + 4,
      })),
    [count]
  );

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg">
      {blocks.map((p) => (
        <div
          key={p.id}
          className="absolute lava-block opacity-60"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.left}%`,
            top: `${p.top}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            backgroundColor: p.color,
            boxShadow: `inset 0 -1px 0 rgba(0,0,0,0.35), 0 0 ${Math.max(6, p.size)}px ${p.color}50`,
          }}
        />
      ))}
    </div>
  );
}
