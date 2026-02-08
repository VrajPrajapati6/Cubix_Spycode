import { Link } from "react-router-dom";
import { useTeams } from "@/hooks/useTeams";
import ScoreboardTable from "@/components/ScoreboardTable";
import PixelParticles from "@/components/PixelParticles";

export default function Round3() {
  const { data: teams = [], isLoading } = useTeams(3, 5000);

  return (
    <div className="relative min-h-screen p-4 md:p-8">
      <PixelParticles count={15} />
      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Link to="/" className="mc-btn px-3 py-2 text-[10px] font-pixel text-foreground">
            ← BACK
          </Link>
          <div className="text-right">
            <h1 className="font-pixel text-lg md:text-2xl text-mc-red">GRAND FINALE</h1>
            <p className="font-silk text-xs text-muted-foreground">Champion Rush</p>
          </div>
        </div>

        <ScoreboardTable teams={teams} round={3} isLoading={isLoading} />

        <p className="text-center font-silk text-[10px] text-muted-foreground mt-4">
          Auto-refreshes every 5 seconds • Freeze timers sync with backend
        </p>
      </div>
    </div>
  );
}
