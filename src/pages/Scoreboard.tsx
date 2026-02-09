import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LavaBlocks from "@/components/LavaBlocks";
import IceCrackOverlay from "@/components/IceCrackOverlay";

type Team = {
  _id: string;
  teamId: string;
  teamName: string;
  skulls: number;
  shields: number;
  attacks: number;
  freezeUntil?: string | null;
};

export default function Scoreboard() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(Date.now());

  /* ---------------- FETCH ---------------- */
  const fetchTeams = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/teams`);
      const data = await res.json();
      setTeams(data.sort((a: Team, b: Team) => b.skulls - a.skulls));
    } catch (err) {
      console.error("Failed to fetch teams", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
    const fetchInterval = setInterval(fetchTeams, 5000);
    const timerInterval = setInterval(() => setNow(Date.now()), 1000);

    return () => {
      clearInterval(fetchInterval);
      clearInterval(timerInterval);
    };
  }, []);

  /* ---------------- FREEZE TIMER ---------------- */
  const freezeRemaining = (t?: string | null) => {
    if (!t) return null;
    const diff = new Date(t).getTime() - now;
    return diff > 0 ? diff : null;
  };

  const formatTime = (ms: number) => {
    const totalSec = Math.floor(ms / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return `${min}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div
      className="relative h-screen overflow-hidden text-white"
      style={{
        backgroundImage: "url('/bg/minecraft-bg1.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* DARK OVERLAY — fixed with background */}
      <div className="absolute inset-0 bg-black/75 backdrop-blur-[2px]" />

      <div className="relative z-10 h-full flex flex-col max-w-6xl mx-auto p-3 md:p-8 w-full">
        {/* HEADER — stays at top, stacks on very small screens */}
        <div className="flex-shrink-0 flex flex-wrap items-center justify-between gap-2 mb-3 md:mb-4">
          <Link to="/" className="mc-btn px-3 py-2 text-[10px] font-pixel">
            ← BACK
          </Link>

          <div className="text-right min-w-0">
            <h1 className="font-pixel text-base sm:text-xl md:text-3xl text-[#ff8c1a] drop-shadow-[0_0_10px_rgba(255,140,26,0.6)] truncate">
              SPYCODE SCOREBOARD
            </h1>
            <p className="font-pixel text-[10px] text-orange-300/80">
              • Live Rankings
            </p>
          </div>
        </div>

        {/* SCROLLABLE TABLE AREA — vertical + horizontal scroll on mobile */}
        <div className="flex-1 min-h-0 overflow-auto -mx-3 px-3 md:mx-0 md:px-0 scrollbar-hide">
        {/* PANEL: min-width on mobile so table stays readable, horizontal scroll when needed */}
        <div className="relative rounded-lg overflow-hidden glass-panel p-3 md:p-6 min-w-[300px] w-full max-w-full">
          {/* Moving lava blocks layer (Nether theme) */}
          <LavaBlocks count={20} />

          {loading ? (
            <p className="relative z-10 text-center py-10 font-pixel text-orange-200">
              Loading Nether Data...
            </p>
          ) : (
            <div className="relative z-10 space-y-3">
              {teams.map((team, index) => {
                const remaining = freezeRemaining(team.freezeUntil);
                const frozen = Boolean(remaining);

                return (
                  <div
                    key={team._id}
                    className={`
                      relative flex items-center justify-between gap-3 px-3 sm:px-4 py-3 overflow-hidden rounded min-w-0
                      ${
                        frozen
                          ? "frozen-crystal"
                          : index === 0
                          ? "border border-[#ffd36a]/50 bg-[#2a1a0a]/70 shadow-[0_0_20px_rgba(255,211,106,0.25)]"
                          : "border border-white/10 bg-black/30"
                      }
                    `}
                  >
                    {/* Ice crack overlay (frozen only) */}
                    {frozen && <IceCrackOverlay />}

                    {/* LEFT */}
                    <div className="flex items-center gap-2 sm:gap-4 relative z-10 min-w-0 flex-shrink-0">
                      <span
                        className={`font-pixel text-xs sm:text-sm w-5 sm:w-6 text-center flex-shrink-0 ${
                          frozen
                            ? "text-sky-200/95"
                            : index === 0
                            ? "text-[#ffd36a]"
                            : "text-orange-400"
                        }`}
                      >
                        {index + 1}
                      </span>

                      <span
                        className={`font-pixel text-xs sm:text-sm tracking-wide truncate ${
                          frozen ? "text-sky-100/90" : ""
                        }`}
                      >
                        {team.teamName}
                      </span>
                    </div>

                    {/* RIGHT */}
                    <div className="flex items-center gap-3 sm:gap-6 font-pixel text-[10px] sm:text-xs relative z-10 flex-shrink-0">
                      <span className="flex items-center gap-1 text-[#ffcc66]">
                        💀 {team.skulls}
                      </span>

                      <span className="flex items-center gap-1 text-cyan-300">
                        🛡️ {team.shields}
                      </span>

                      <span className="flex items-center gap-1 text-red-400">
                        ⚔️ {team.attacks}
                      </span>

                      {frozen ? (
                        <span className="flex items-center gap-1 text-sky-200 font-bold tracking-wide">
                          ❄ {formatTime(remaining!)}
                        </span>
                      ) : (
                        <span className="text-green-400/90 tracking-wide">
                          ACTIVE
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* FOOTER — just below table; Final Result button bottom right */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <p className="font-pixel text-[12px] text-orange-300/60 order-2 md:order-1">
            Build With Love By –{" "}
          <a
            href="https://www.csi-nirma.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-300 underline hover:text-orange-400"
          >
            Team CSI 
          </a>
          </p>
          <Link
            to="/final-result"
            className="mc-btn px-3 py-2 text-[10px] font-pixel order-1 md:order-2 ml-auto"
          >
            FINAL RESULT →
          </Link>
        </div>
        </div>
      </div>
    </div>
  );
}
