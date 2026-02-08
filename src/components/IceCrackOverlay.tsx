/**
 * SVG overlay of jagged ice cracks — layered so the frozen row looks like real frozen ice.
 */
export default function IceCrackOverlay() {
  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden rounded"
      aria-hidden
    >
      <svg
        className="absolute inset-0 w-full h-full object-cover opacity-[0.7]"
        viewBox="0 0 400 56"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        {/* Main crack - jagged center line */}
        <path
          d="M0 30 L42 26 L58 34 L72 22 L92 36 L112 26 L132 40 L152 28 L172 42 L192 30 L215 44 L240 32 L262 46 L288 36 L308 50 L330 38 L355 44 L400 40"
          stroke="rgba(120, 170, 210, 0.75)"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Branch cracks */}
        <path
          d="M55 26 L65 18 L78 24 L72 32 L80 38"
          stroke="rgba(100, 155, 200, 0.6)"
          strokeWidth="0.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M20 52 L35 42 L52 48 L68 40 L82 50"
          stroke="rgba(90, 145, 185, 0.65)"
          strokeWidth="0.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M140 40 L155 32 L168 38 L178 30"
          stroke="rgba(95, 150, 190, 0.6)"
          strokeWidth="0.65"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M260 0 L272 14 L288 8 L302 18 L318 10 L335 20"
          stroke="rgba(110, 165, 205, 0.55)"
          strokeWidth="0.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M95 0 L108 12 L122 6 L138 16 L152 8"
          stroke="rgba(100, 155, 195, 0.5)"
          strokeWidth="0.55"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Darker / deeper cracks (shadow) */}
        <path
          d="M0 42 L28 38 L48 46 L70 40 L92 48 L118 42 L142 50 L168 44 L195 52 L225 46 L255 52 L285 46 L318 50 L350 46 L400 48"
          stroke="rgba(45, 95, 135, 0.55)"
          strokeWidth="1.1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M60 56 L82 46 L108 54 L132 46 L158 54 L185 48 L212 54 L242 48 L272 54 L305 48 L340 52 L400 50"
          stroke="rgba(40, 88, 128, 0.5)"
          strokeWidth="0.95"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
