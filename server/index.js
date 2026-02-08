import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./db.js";
import teamRoutes from "./routes/teams.js";
import finalResultRoutes from "./routes/finalResult.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/teams", teamRoutes);
app.use("/api/final-result", finalResultRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
