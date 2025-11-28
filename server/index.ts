import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleSurveyData } from "./routes/survey";
import { handleSurveyFallback } from "./routes/surveyFallback";
import { handleLiveQuestions } from "./routes/liveQuestions";
import { handleExcelSurveyData } from "./routes/excelSurveyData";
import {
  handleSimpleDailyStats,
  handleDailyStatsDebug,
  handleDailyStatsReset,
} from "./routes/simpleDailyStats";
import { handleExcelAnalysis } from "./routes/excelAnalyzer";

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
  app.get("/api/survey-fallback", handleSurveyFallback);
  app.get("/api/excel-survey", handleExcelSurveyData);
  app.get("/api/live-questions", handleLiveQuestions);
  app.get("/api/excel-analysis", handleExcelAnalysis);

  // Энгийн өдрийн статистик (зөвхөн API дата ашиглан)
  app.get("/api/daily-stats", handleSimpleDailyStats);
  app.get("/api/daily-stats/debug", handleDailyStatsDebug);
  app.post("/api/daily-stats/reset", handleDailyStatsReset);

  return app;
}
