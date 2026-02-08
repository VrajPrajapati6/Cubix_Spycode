import type { Team } from "@/hooks/useTeams";
import FreezeTimer from "./FreezeTimer";
import { Shield } from "lucide-react";

interface ScoreboardTableProps {
  teams: Team[];
  round: number;
  isLoading?: boolean;
}

function getStatus(team: Team): "active" | "frozen" | "shielded" {
  if (team.freeze_until && new Date(team.freeze_until).getTime() > Date.now()) {
    return "frozen";
  }
  if (team.shields > 0) return "shielded";
  return "active";
}

function StatusBadge({ status }: { status: "active" | "frozen" | "shielded" }) {
  const styles = {
    active: "bg-mc-green/20 text-mc-green border-mc-green/40",
    frozen: "bg-mc-blue/20 text-mc-blue border-mc-blue/40",
    shielded: "bg-mc-blue/20 text-mc-blue border-mc-blue/40",
  };
  const labels = { active: "ACTIVE", frozen: "❄️ FROZEN", shielded: "🛡️ SHIELDED" };

  return (
    <span className={`px-2 py-1 text-[10px] font-pixel border ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}

export default function ScoreboardTable({ teams, round, isLoading }: ScoreboardTableProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <p className="font-pixel text-muted-foreground text-sm animate-pulse">Loading scores...</p>
      </div>
    );
  }

  if (!teams.length) {
    return (
      <div className="flex justify-center py-20">
        <p className="font-pixel text-muted-foreground text-sm">No teams yet</p>
      </div>
    );
  }

  return (
    <div className="mc-panel overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-mc-stone">
              <th className="px-4 py-3 text-left font-pixel text-xs text-mc-gold">RANK</th>
              <th className="px-4 py-3 text-left font-pixel text-xs text-mc-gold">TEAM ID</th>
              <th className="px-4 py-3 text-left font-pixel text-xs text-mc-gold">TEAM NAME</th>
              <th className="px-4 py-3 text-right font-pixel text-xs text-mc-gold">💀 SKULLS</th>
              {round === 3 && (
                <>
                  <th className="px-4 py-3 text-center font-pixel text-xs text-mc-gold">🛡️ SHIELDS</th>
                  <th className="px-4 py-3 text-center font-pixel text-xs text-mc-gold">STATUS</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {teams.map((team, idx) => {
              const status = getStatus(team);
              const isFrozen = status === "frozen";
              return (
                <tr
                  key={team.id}
                  className={`border-b border-border/30 transition-colors hover:bg-secondary/30 ${isFrozen ? "frozen-row" : ""}`}
                >
                  <td className="px-4 py-3">
                    <span
                      className={`font-pixel text-sm ${
                        idx === 0 ? "text-mc-gold" : idx === 1 ? "text-foreground/80" : idx === 2 ? "text-mc-stone" : "text-muted-foreground"
                      }`}
                    >
                      #{idx + 1}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-silk text-sm text-muted-foreground">{team.team_id}</td>
                  <td className="px-4 py-3 font-silk text-sm font-bold">{team.team_name}</td>
                  <td className="px-4 py-3 text-right">
                    <span className="font-pixel text-mc-green text-sm">{team.skulls}</span>
                  </td>
                  {round === 3 && (
                    <>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-0.5">
                          {Array.from({ length: 3 }, (_, i) => (
                            <Shield
                              key={i}
                              size={16}
                              className={i < team.shields ? "text-mc-blue fill-mc-blue/30" : "text-muted-foreground/30"}
                            />
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <StatusBadge status={status} />
                          <FreezeTimer freezeUntil={team.freeze_until} />
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
