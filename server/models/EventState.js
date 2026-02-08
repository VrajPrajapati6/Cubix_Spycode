import mongoose from "mongoose";

const eventStateSchema = new mongoose.Schema(
  {
    finalResultPublished: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Single document for app state (use findOne or create)
export default mongoose.model("EventState", eventStateSchema);
