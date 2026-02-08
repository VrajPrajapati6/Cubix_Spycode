import mongoose from "mongoose";

const teamSchema = new mongoose.Schema(
  {
    teamId: { type: String, required: true },
    teamName: { type: String, required: true },

    skulls: { type: Number, default: 0 },
    shields: { type: Number, default: 0 },

    attacks: { type: Number, default: 0 }, // NEW
    freezeUntil: { type: Date, default: null },
  },
  { timestamps: true }
);

export default mongoose.model("Team", teamSchema);
