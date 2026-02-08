import express from "express";
import Team from "../models/Team.js";

const router = express.Router();

const adminOnly = (req, res, next) => {
  if (req.headers["x-admin-key"] !== process.env.ADMIN_SECRET) {
    return res.status(403).json({ error: "Not admin" });
  }
  next();
};

// PUBLIC: get all teams
router.get("/", async (req, res) => {
  const teams = await Team.find().sort({ skulls: -1 });
  res.json(teams);
});

// ADMIN: add team
router.post("/", adminOnly, async (req, res) => {
  const team = await Team.create(req.body);
  res.json(team);
});

// ADMIN: update team (freezeUntil is always applied when sent — new duration from "now" or null)
router.put("/:id", adminOnly, async (req, res) => {
  const update = { ...req.body };
  if (Object.prototype.hasOwnProperty.call(update, "freezeUntil")) {
    update.freezeUntil = update.freezeUntil == null ? null : new Date(update.freezeUntil);
  }
  const team = await Team.findByIdAndUpdate(
    req.params.id,
    update,
    { new: true }
  );
  res.json(team);
});

// ADMIN: delete team
router.delete("/:id", adminOnly, async (req, res) => {
  await Team.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// ADMIN: ATTACK TEAM
router.post("/:id/attack", adminOnly, async (req, res) => {
  const target = await Team.findById(req.params.id);
  if (!target) return res.status(404).json({ error: "Team not found" });

  if (target.shields > 0) {
    target.shields -= 1;
  } else {
    target.freezeUntil = new Date(Date.now() + 10 * 60000);
  }

  await target.save();
  res.json(target);
});

export default router;
