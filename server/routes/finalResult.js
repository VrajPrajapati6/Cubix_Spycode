import express from "express";
import EventState from "../models/EventState.js";
import Team from "../models/Team.js";

const router = express.Router();

const adminOnly = (req, res, next) => {
  if (req.headers["x-admin-key"] !== process.env.ADMIN_SECRET) {
    return res.status(403).json({ error: "Not admin" });
  }
  next();
};

// GET final result state (public) + top 3 when published
router.get("/", async (req, res) => {
  let state = await EventState.findOne();
  if (!state) {
    state = await EventState.create({ finalResultPublished: false });
  }
  const published = state.finalResultPublished;
  if (!published) {
    return res.json({ published: false, top3: null });
  }
  const teams = await Team.find().sort({ skulls: -1 }).limit(3).lean();
  return res.json({ published: true, top3: teams });
});

// POST add/publish final result (admin)
router.post("/add", adminOnly, async (req, res) => {
  let state = await EventState.findOne();
  if (!state) {
    state = await EventState.create({ finalResultPublished: true });
  } else {
    state.finalResultPublished = true;
    await state.save();
  }
  res.json({ published: true });
});

// POST remove/unpublish final result (admin)
router.post("/remove", adminOnly, async (req, res) => {
  let state = await EventState.findOne();
  if (!state) {
    state = await EventState.create({ finalResultPublished: false });
  } else {
    state.finalResultPublished = false;
    await state.save();
  }
  res.json({ published: false });
});

export default router;
