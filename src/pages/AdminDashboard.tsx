import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { LogOut, Trash2 } from "lucide-react";

type Team = {
  _id: string;
  teamId: string;
  teamName: string;
  skulls: number;
  shields: number;
  attacks: number;
  freezeUntil?: string | null;
};

const API_URL = `${import.meta.env.VITE_API_URL}/teams`;
const FINAL_RESULT_URL = `${import.meta.env.VITE_API_URL}/final-result`;

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [finalResultPublished, setFinalResultPublished] = useState(false);

  /* ---------------- AUTH ---------------- */
  useEffect(() => {
    if (localStorage.getItem("cubix_admin_auth") !== "true") {
      navigate("/admin");
    }
    fetchTeams();
    fetchFinalResultState();
    const i = setInterval(fetchTeams, 1000);
    const j = setInterval(fetchFinalResultState, 5000);
    return () => {
      clearInterval(i);
      clearInterval(j);
    };
  }, []);

  const headers = {
    "Content-Type": "application/json",
    "x-admin-key": import.meta.env.VITE_ADMIN_SECRET,
  };

  /* ---------------- FETCH ---------------- */
  const fetchTeams = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setTeams(data);
    setLoading(false);
  };

  const fetchFinalResultState = async () => {
    try {
      const res = await fetch(FINAL_RESULT_URL);
      const data = await res.json();
      setFinalResultPublished(data.published ?? false);
    } catch (_) {}
  };

  // ADD TEAM state
  const [newTeamId, setNewTeamId] = useState("");
  const [newTeamName, setNewTeamName] = useState("");
  const [initialScore, setInitialScore] = useState(0);
  const [initialShields, setInitialShields] = useState(0);
  const [initialAttacks, setInitialAttacks] = useState(0);

  const addTeam = async () => {
    if (!newTeamId || !newTeamName) return;

    await fetch(API_URL, {
      method: "POST",
      headers,
      body: JSON.stringify({
        teamId: newTeamId,
        teamName: newTeamName,
        skulls: Math.max(0, initialScore),
        shields: Math.max(0, initialShields),
        attacks: Math.max(0, initialAttacks),
      }),
    });

    setNewTeamId("");
    setNewTeamName("");
    setInitialScore(0);
    setInitialShields(0);
    setInitialAttacks(0);

    toast({ title: "Team added" });
    fetchTeams();
  };

  /* ---------------- UPDATE TEAM ---------------- */
  const [selectedId, setSelectedId] = useState<string>("");

  const selectedTeam = teams.find((t) => t._id === selectedId);

  const [scoreValue, setScoreValue] = useState(0);
  const [scoreMode, setScoreMode] = useState<"add" | "sub">("add");

  const [shieldValue, setShieldValue] = useState(0);
  const [shieldMode, setShieldMode] = useState<"add" | "sub">("add");

  const [attackValue, setAttackValue] = useState(0);
  const [attackMode, setAttackMode] = useState<"add" | "sub">("add");

  const [freezeMinutes, setFreezeMinutes] = useState(0);
  const freezeInputRef = useRef<HTMLInputElement>(null);

  const applyUpdates = async () => {
    if (!selectedTeam) return;

    const updated = {
      skulls:
        scoreMode === "add"
          ? selectedTeam.skulls + scoreValue
          : selectedTeam.skulls - scoreValue,

      shields:
        shieldMode === "add"
          ? selectedTeam.shields + shieldValue
          : selectedTeam.shields - shieldValue,

      attacks:
        attackMode === "add"
          ? selectedTeam.attacks + attackValue
          : selectedTeam.attacks - attackValue,
    };

    updated.skulls = Math.max(0, updated.skulls);
    updated.shields = Math.max(0, Math.min(3, updated.shields));
    updated.attacks = Math.max(0, updated.attacks);

    const payload: Record<string, unknown> = { ...updated };

    // Freeze minutes >= 0: 0 = unfreeze (clear), > 0 = set duration from now
    const minutes = freezeInputRef.current
      ? Number(freezeInputRef.current.value)
      : freezeMinutes;
    const mins = Number.isFinite(minutes) ? Math.max(0, minutes) : 0;

    if (mins >= 0) {
      payload.freezeUntil =
        mins > 0
          ? new Date(Date.now() + mins * 60000).toISOString()
          : null;
    }

    await fetch(`${API_URL}/${selectedTeam._id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(payload),
    });

    toast({ title: "Updates applied" });
    fetchTeams();
  };

  const deleteTeam = async () => {
    if (!selectedTeam) return;
    if (!confirm(`Delete ${selectedTeam.teamName}?`)) return;

    await fetch(`${API_URL}/${selectedTeam._id}`, {
      method: "DELETE",
      headers,
    });

    setSelectedId("");
    toast({ title: "Team removed" });
    fetchTeams();
  };

  const publishFinalResult = async () => {
    await fetch(`${FINAL_RESULT_URL}/add`, { method: "POST", headers });
    setFinalResultPublished(true);
    toast({ title: "Final result published — top 3 now visible" });
    fetchFinalResultState();
  };

  const unpublishFinalResult = async () => {
    await fetch(`${FINAL_RESULT_URL}/remove`, { method: "POST", headers });
    setFinalResultPublished(false);
    toast({ title: "Final result hidden — showing Announced Soon" });
    fetchFinalResultState();
  };

  const logout = () => {
    localStorage.removeItem("cubix_admin_auth");
    navigate("/admin");
  };

  const freezeRemaining = (t?: string | null) => {
    if (!t) return null;
    const diff = new Date(t).getTime() - Date.now();
    return diff > 0 ? diff : null;
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="flex justify-between mb-6">
          <h1 className="font-pixel text-lg text-mc-gold">⚙ ADMIN PANEL</h1>
          <button
            onClick={logout}
            className="mc-btn text-mc-red px-3 py-2 text-xs"
          >
            <LogOut size={12} /> LOGOUT
          </button>
        </div>

        <div className="mc-panel p-4 mb-6">
          <h3 className="font-pixel text-xs text-mc-green mb-4">➕ ADD TEAM</h3>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {/* TEAM ID */}
            <div>
              <label className="block font-pixel text-[9px] text-muted-foreground mb-1">
                TEAM ID
              </label>
              <Input
                value={newTeamId}
                onChange={(e) => setNewTeamId(e.target.value)}
                className="bg-black/60 text-white font-pixel"
              />
            </div>

            {/* TEAM NAME */}
            <div>
              <label className="block font-pixel text-[9px] text-muted-foreground mb-1">
                TEAM NAME
              </label>
              <Input
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                className="bg-black/60 text-white font-pixel"
              />
            </div>

            {/* SCORE */}
            <div>
              <label className="block font-pixel text-[9px] text-mc-green mb-1">
                💀 SCORE
              </label>
              <Input
                type="number"
                value={initialScore}
                onChange={(e) => setInitialScore(+e.target.value)}
                className="bg-black/60 text-white font-pixel text-center"
              />
            </div>

            {/* SHIELDS */}
            <div>
              <label className="block font-pixel text-[9px] text-mc-blue mb-1">
                🛡 SHIELDS
              </label>
              <Input
                type="number"
                min={0}
                max={3}
                value={initialShields}
                onChange={(e) => setInitialShields(+e.target.value)}
                className="bg-black/60 text-white font-pixel text-center"
              />
            </div>

            {/* ATTACKS */}
            <div>
              <label className="block font-pixel text-[9px] text-mc-red mb-1">
                ⚔ ATTACKS
              </label>
              <Input
                type="number"
                min={0}
                value={initialAttacks}
                onChange={(e) => setInitialAttacks(+e.target.value)}
                className="bg-black/60 text-white font-pixel text-center"
              />
            </div>
          </div>

          <button
            onClick={addTeam}
            className="mc-btn mt-4 px-4 py-2 text-[10px] font-pixel text-mc-green"
          >
            ADD TEAM
          </button>

          <p className="mt-2 font-pixel text-[8px] text-muted-foreground">
            Set initial score, shields, and attacks when creating the team.
          </p>
        </div>

        {/* UPDATE TEAM */}
        <div className="mc-panel p-4 mb-6">
          <h3 className="font-pixel text-xs text-mc-blue mb-4">
            ✏ UPDATE TEAM
          </h3>

          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="
              w-full mb-4 p-2
              bg-[#0b0f14]
              text-white
              font-pixel
              border-2 border-mc-stone
              focus:outline-none
              focus:border-mc-gold
            "
          >
            <option value="">Select team</option>
            {teams.map((t) => (
              <option key={t._id} value={t._id}>
                {t.teamName}
              </option>
            ))}
          </select>

          {selectedTeam && (
            <>
              {/* SCORE */}
              <div className="flex gap-2 mb-2">
                <Input
                  type="number"
                  placeholder="Score"
                  onChange={(e) => setScoreValue(+e.target.value)}
                />
                <select
                  onChange={(e) =>
                    setScoreMode(e.target.value as "add" | "sub")
                  }
                  className="
                    bg-[#0b0f14]
                    text-white
                    font-pixel
                    px-3 py-2
                    border-2 border-mc-stone
                    focus:outline-none
                    focus:border-mc-gold
                    cursor-pointer
                  "
                >
                  <option value="add" className="bg-[#0b0f14] text-mc-green">
                    ADD
                  </option>
                  <option value="sub" className="bg-[#0b0f14] text-mc-red">
                    SUB
                  </option>
                </select>
              </div>

              {/* SHIELD */}
              <div className="flex gap-2 mb-2">
                <Input
                  type="number"
                  placeholder="Shields"
                  onChange={(e) => setShieldValue(+e.target.value)}
                />
                <select
                  onChange={(e) =>
                    setShieldMode(e.target.value as "add" | "sub")
                  }
                  className="bg-[#0b0f14] text-white font-pixel px-3 py-2 border-2 border-mc-stone"
                >
                  <option value="add" className="bg-[#0b0f14] text-mc-blue">
                    ADD
                  </option>
                  <option value="sub" className="bg-[#0b0f14] text-gray-400">
                    SUB
                  </option>
                </select>
              </div>

              {/* ATTACK */}
              <div className="flex gap-2 mb-2">
                <Input
                  type="number"
                  placeholder="Attacks"
                  onChange={(e) => setAttackValue(+e.target.value)}
                />
                <select
                  onChange={(e) =>
                    setAttackMode(e.target.value as "add" | "sub")
                  }
                  className="bg-[#0b0f14] text-white font-pixel px-3 py-2 border-2 border-mc-stone"
                >
                  <option value="add" className="bg-[#0b0f14] text-mc-red">
                    ADD
                  </option>
                  <option value="sub" className="bg-[#0b0f14] text-gray-400">
                    SUB
                  </option>
                </select>
              </div>

              {/* FREEZE — >= 0: 0 = unfreeze, > 0 = set minutes from now (replaces any running timer) */}
              <div className="flex gap-2 mb-4">
                <Input
                  ref={freezeInputRef}
                  type="number"
                  min={0}
                  placeholder="Freeze min (0 = unfreeze)"
                  value={freezeMinutes}
                  onChange={(e) => setFreezeMinutes(Math.max(0, +(e.target.value || 0)))}
                />
              </div>

              <div className="flex justify-between">
                <button onClick={applyUpdates} className="mc-btn text-mc-green">
                  APPLY
                </button>

                <button onClick={deleteTeam} className="mc-btn text-mc-red">
                  <Trash2 size={14} /> DELETE
                </button>
              </div>
            </>
          )}
        </div>

        {/* FINAL RESULT — Add = publish top 3, Remove = show Announced Soon */}
        <div className="mc-panel p-4 mb-6">
          <h3 className="font-pixel text-xs text-mc-gold mb-4">
            🏆 FINAL RESULT
          </h3>
          <p className="font-pixel text-[9px] text-muted-foreground mb-3">
            {finalResultPublished
              ? "Published — /final-result shows top 3 from scoreboard."
              : "Not published — /final-result shows “Announced Soon”."}
          </p>
          <div className="flex gap-3">
            <button
              onClick={publishFinalResult}
              className="mc-btn px-4 py-2 text-[10px] font-pixel text-mc-green"
            >
              (1) ADD
            </button>
            <button
              onClick={unpublishFinalResult}
              className="mc-btn px-4 py-2 text-[10px] font-pixel text-mc-red"
            >
              (2) REMOVE
            </button>
          </div>
        </div>

        {/* SCOREBOARD */}
        <div className="mc-panel p-4">
          <h3 className="font-pixel text-xs text-mc-gold mb-3">
            📋 SCOREBOARD
          </h3>

          {loading
            ? "Loading..."
            : teams
                .sort((a, b) => b.skulls - a.skulls)
                .map((t) => {
                  const rem = freezeRemaining(t.freezeUntil);
                  return (
                    <div key={t._id} className="flex justify-between mb-2">
                      <span>{t.teamName}</span>
                      <span>
                        💀 {t.skulls} 🛡 {t.shields} ⚔ {t.attacks}
                        {rem && (
                          <span className="text-cyan-400 ml-2">
                            ❄ {Math.floor(rem / 60000)}:
                            {Math.floor((rem % 60000) / 1000)
                              .toString()
                              .padStart(2, "0")}
                          </span>
                        )}
                      </span>
                    </div>
                  );
                })}
        </div>
      </div>
    </div>
  );
}
