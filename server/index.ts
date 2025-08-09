import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleSurveyData } from "./routes/survey";
import {
  handleSimpleDailyStats,
  handleDailyStatsDebug,
  handleDailyStatsReset,
} from "./routes/simpleDailyStats";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);
  app.get("/api/survey", handleSurveyData);

  // Энгийн өдрийн статистик (зөвхөн API дата ашиглан)
  app.get("/api/daily-stats", handleSimpleDailyStats);
  app.get("/api/daily-stats/debug", handleDailyStatsDebug);
  app.post("/api/daily-stats/reset", handleDailyStatsReset);

  return app;
}
