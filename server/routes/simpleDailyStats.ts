import { RequestHandler } from "express";
import { simpleDailyTracker } from "../utils/simpleDailyTracker";

// Өнөөдрийн санал тоололын статистик авах
export const handleSimpleDailyStats: RequestHandler = async (_req, res) => {
  try {
    const todayStats = simpleDailyTracker.getTodayStats();
    const dailyVotesAdded = simpleDailyTracker.getDailyVotesAdded();

    if (!todayStats) {
      return res.json({
        success: true,
        data: {
          date: new Date().toISOString().split("T")[0],
          dailyVotesAdded: 0,
          message: "Өнөөдөр санал тоолол эхлээгүй байна",
          timezone: "Asia/Ulaanbaatar",
        },
      });
    }

    res.json({
      success: true,
      data: {
        date: todayStats.date,
        startOfDayVotes: todayStats.startOfDayVotes,
        currentVotes: todayStats.currentVotes,
        dailyVotesAdded: dailyVotesAdded,
        lastUpdated: todayStats.lastUpdated,
        timezone: "Asia/Ulaanbaatar",
        note: "Улаанбаатар цагийн бүсээр 12:00 AM-аас тооцоолсон",
      },
    });
  } catch (error) {
    console.error("Error getting daily stats:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get daily statistics",
      message: "Өнөөдрийн статистик авахад алдаа гарлаа",
    });
  }
};

// Daily tracker debug мэдээлэл (development зориулалт)
export const handleDailyStatsDebug: RequestHandler = async (_req, res) => {
  try {
    // Console дээр debug мэдээлэл хэвлэх
    simpleDailyTracker.debugInfo();

    const todayStats = simpleDailyTracker.getTodayStats();

    res.json({
      success: true,
      debug: true,
      data: todayStats,
      message: "Debug мэдээлэл console дээр хэвлэгдлээ",
    });
  } catch (error) {
    console.error("Error in debug endpoint:", error);
    res.status(500).json({
      success: false,
      error: "Debug failed",
      message: "Debug алдаа гарлаа",
    });
  }
};

// Daily tracker reset хийх (тестийн зориулалт)
export const handleDailyStatsReset: RequestHandler = async (_req, res) => {
  try {
    simpleDailyTracker.resetDay();

    res.json({
      success: true,
      message:
        "Daily tracker reset хийгдлээ. Дараагийн API дуудлагад шинэ өдөр эхэлнэ.",
    });
  } catch (error) {
    console.error("Error resetting daily stats:", error);
    res.status(500).json({
      success: false,
      error: "Reset failed",
      message: "Reset хийхэд алдаа гарлаа",
    });
  }
};
