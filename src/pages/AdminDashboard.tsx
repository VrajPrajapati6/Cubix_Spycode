import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useTeams, type Team } from "@/hooks/useTeams";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Shield, Trash2, Snowflake, Plus, Minus } from "lucide-react";

export default function AdminDashboard() {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeRound, setActiveRound] = useState(1);

  const { data: teams = [], isLoading } = useTeams(activeRound, 3000);

  // Add team form state
  const [newTeamId, setNewTeamId] = useState("");
  const [newTeamName, setNewTeamName] = useState("");
  const [newSkulls, setNewSkulls] = useState(0);
  const [newShields, setNewShields] = useState(0);

  // Freeze state
  const [freezeMinutes, setFreezeMinutes] = useState(10);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-pixel text-sm text-muted-foreground animate-pulse">Loading...</p>
      </div>
    );
  }

  if (!user) {
    navigate("/admin");
    return null;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="mc-panel p-8 text-center">
          <h2 className="font-pixel text-mc-red text-sm mb-4">ACCESS DENIED</h2>
          <p className="font-silk text-xs text-muted-foreground mb-4">
            You don't have admin privileges.
          </p>
          <button onClick={signOut} className="mc-btn px-4 py-2 text-[10px] font-pixel text-foreground">
            SIGN OUT
          </button>
        </div>
      </div>
    );
  }

  const refresh = () => queryClient.invalidateQueries({ queryKey: ["teams", activeRound] });

  const addTeam = async () => {
    if (!newTeamId.trim() || !newTeamName.trim()) return;
    const { error } = await supabase.from("teams").insert({
      team_id: newTeamId.trim(),
      team_name: newTeamName.trim(),
      round: activeRound,
      skulls: newSkulls,
      shields: activeRound === 3 ? newShields : 0,
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Team added!" });
      setNewTeamId("");
      setNewTeamName("");
      setNewSkulls(0);
      setNewShields(0);
      refresh();
    }
  };

  const updateSkulls = async (team: Team, delta: number) => {
    const { error } = await supabase
      .from("teams")
      .update({ skulls: team.skulls + delta })
      .eq("id", team.id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else refresh();
  };

  const updateShields = async (team: Team, delta: number) => {
    const newVal = Math.max(0, Math.min(3, team.shields + delta));
    const { error } = await supabase
      .from("teams")
      .update({ shields: newVal })
      .eq("id", team.id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else refresh();
  };

  const freezeTeam = async (team: Team) => {
    const freezeUntil = new Date(Date.now() + freezeMinutes * 60000).toISOString();
    const { error } = await supabase
      .from("teams")
      .update({ freeze_until: freezeUntil })
      .eq("id", team.id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else {
      toast({ title: `${team.team_name} frozen for ${freezeMinutes}m` });
      refresh();
    }
  };

  const removeTeam = async (team: Team) => {
    if (!confirm(`Remove ${team.team_name}?`)) return;
    const { error } = await supabase.from("teams").delete().eq("id", team.id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else refresh();
  };

  const roundLabels = ["", "🟢 Round 1 — Spy Game", "🟡 Round 2 — Packet Purchase", "🔴 Round 3 — Grand Finale"];

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-pixel text-sm md:text-lg text-mc-gold">⚙️ ADMIN PANEL</h1>
          <div className="flex gap-2">
            <a href="/" className="mc-btn px-3 py-2 text-[10px] font-pixel text-foreground">
              VIEW SITE
            </a>
            <button onClick={signOut} className="mc-btn px-3 py-2 text-[10px] font-pixel text-mc-red">
              LOGOUT
            </button>
          </div>
        </div>

        {/* Round tabs */}
        <div className="flex gap-2 mb-6">
          {[1, 2, 3].map((r) => (
            <button
              key={r}
              onClick={() => setActiveRound(r)}
              className={`mc-btn px-4 py-2 text-[10px] font-pixel ${
                activeRound === r ? "text-mc-gold" : "text-muted-foreground"
              }`}
            >
              R{r}
            </button>
          ))}
        </div>

        <h2 className="font-pixel text-xs text-foreground mb-4">{roundLabels[activeRound]}</h2>

        {/* Add team */}
        <div className="mc-panel p-4 mb-6">
          <h3 className="font-pixel text-[10px] text-mc-green mb-3">➕ ADD TEAM</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="font-pixel text-[8px] text-muted-foreground">TEAM ID</label>
              <Input
                value={newTeamId}
                onChange={(e) => setNewTeamId(e.target.value)}
                className="bg-secondary border-mc-stone font-silk text-sm"
                placeholder="T01"
              />
            </div>
            <div>
              <label className="font-pixel text-[8px] text-muted-foreground">TEAM NAME</label>
              <Input
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                className="bg-secondary border-mc-stone font-silk text-sm"
                placeholder="Team Alpha"
              />
            </div>
            <div>
              <label className="font-pixel text-[8px] text-muted-foreground">SKULLS</label>
              <Input
                type="number"
                value={newSkulls}
                onChange={(e) => setNewSkulls(Number(e.target.value))}
                className="bg-secondary border-mc-stone font-silk text-sm"
              />
            </div>
            {activeRound === 3 && (
              <div>
                <label className="font-pixel text-[8px] text-muted-foreground">SHIELDS</label>
                <Input
                  type="number"
                  value={newShields}
                  min={0}
                  max={3}
                  onChange={(e) => setNewShields(Number(e.target.value))}
                  className="bg-secondary border-mc-stone font-silk text-sm"
                />
              </div>
            )}
          </div>
          <button onClick={addTeam} className="mc-btn mt-3 px-4 py-2 text-[10px] font-pixel text-mc-green">
            ADD TEAM
          </button>
        </div>

        {/* Freeze minutes input (R3 only) */}
        {activeRound === 3 && (
          <div className="mc-panel p-4 mb-6">
            <h3 className="font-pixel text-[10px] text-mc-blue mb-3">❄️ FREEZE DURATION</h3>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={freezeMinutes}
                min={1}
                max={60}
                onChange={(e) => setFreezeMinutes(Number(e.target.value))}
                className="bg-secondary border-mc-stone font-silk text-sm w-24"
              />
              <span className="font-silk text-xs text-muted-foreground">minutes</span>
            </div>
          </div>
        )}

        {/* Team list */}
        <div className="mc-panel p-4">
          <h3 className="font-pixel text-[10px] text-mc-gold mb-3">📋 TEAMS ({teams.length})</h3>

          {isLoading ? (
            <p className="font-pixel text-xs text-muted-foreground animate-pulse">Loading...</p>
          ) : !teams.length ? (
            <p className="font-silk text-xs text-muted-foreground">No teams in this round.</p>
          ) : (
            <div className="space-y-2">
              {teams.map((team) => (
                <div
                  key={team.id}
                  className="flex items-center justify-between bg-secondary/30 border border-border p-3 gap-2 flex-wrap"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="font-pixel text-[10px] text-muted-foreground">{team.team_id}</span>
                    <span className="font-silk text-sm font-bold truncate">{team.team_name}</span>
                    <span className="font-pixel text-xs text-mc-green">💀 {team.skulls}</span>
                    {activeRound === 3 && (
                      <span className="font-pixel text-xs text-mc-blue">🛡️ {team.shields}</span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 flex-wrap">
                    {/* Skulls +/- */}
                    <button
                      onClick={() => updateSkulls(team, 10)}
                      className="mc-btn p-1.5 text-[10px] font-pixel text-mc-green"
                      title="+10 Skulls"
                    >
                      <Plus size={14} />
                    </button>
                    <button
                      onClick={() => updateSkulls(team, -10)}
                      className="mc-btn p-1.5 text-[10px] font-pixel text-mc-red"
                      title="-10 Skulls"
                    >
                      <Minus size={14} />
                    </button>

                    {/* R3: Shields */}
                    {activeRound === 3 && (
                      <>
                        <button
                          onClick={() => updateShields(team, 1)}
                          className="mc-btn p-1.5 text-[10px] font-pixel text-mc-blue"
                          title="+1 Shield"
                        >
                          <Shield size={14} />
                          <Plus size={10} />
                        </button>
                        <button
                          onClick={() => updateShields(team, -1)}
                          className="mc-btn p-1.5 text-[10px] font-pixel text-mc-blue"
                          title="-1 Shield"
                        >
                          <Shield size={14} />
                          <Minus size={10} />
                        </button>
                        <button
                          onClick={() => freezeTeam(team)}
                          className="mc-btn p-1.5 text-[10px] font-pixel text-mc-blue"
                          title="Freeze team"
                        >
                          <Snowflake size={14} />
                        </button>
                      </>
                    )}

                    {/* Delete */}
                    <button
                      onClick={() => removeTeam(team)}
                      className="mc-btn p-1.5 text-[10px] font-pixel text-mc-red"
                      title="Remove team"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
