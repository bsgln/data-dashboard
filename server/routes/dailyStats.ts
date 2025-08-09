import { RequestHandler } from "express";
import { supabaseDailyTracker } from "../utils/supabaseDailyTracker";

// Get today's daily vote statistics
export const handleDailyStats: RequestHandler = async (_req, res) => {
  try {
    const dailyVotesAdded = await supabaseDailyTracker.getDailyVotesAdded();

    res.json({
      success: true,
      data: {
        dailyVotesAdded,
        date: new Date().toISOString().split("T")[0],
        timezone: "Asia/Ulaanbaatar",
        note: "Daily votes counted from 12:00 AM to 12:00 AM Ulaanbaatar time",
      },
    });
  } catch (error) {
    console.error("Error fetching daily stats:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch daily statistics",
      message: "Өнөөдрийн статистик авахад алдаа гарлаа",
    });
  }
};

// Get weekly vote statistics (last 7 days)
export const handleWeeklyStats: RequestHandler = async (_req, res) => {
  try {
    const weeklyStats = await supabaseDailyTracker.getWeeklyStats();

    res.json({
      success: true,
      data: {
        stats: weeklyStats,
        count: weeklyStats.length,
        timezone: "Asia/Ulaanbaatar",
        note: "Daily votes counted from 12:00 AM to 12:00 AM Ulaanbaatar time",
      },
    });
  } catch (error) {
    console.error("Error fetching weekly stats:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch weekly statistics",
      message: "7 хоногийн статистик авахад алдаа гарлаа",
    });
  }
};

// Get statistics for a specific date
export const handleDateStats: RequestHandler = async (req, res) => {
  try {
    const { date } = req.params;

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return res.status(400).json({
        success: false,
        error: "Invalid date format",
        message: "Огноо YYYY-MM-DD форматтай байх ёстой",
      });
    }

    const dateStats = await supabaseDailyTracker.getVoteStatsForDate(date);

    if (!dateStats) {
      return res.status(404).json({
        success: false,
        error: "No data found for this date",
        message: "Энэ өдрийн мэдээлэл олдсонгүй",
      });
    }

    res.json({
      success: true,
      data: {
        ...dateStats,
        timezone: "Asia/Ulaanbaatar",
        note: "Daily votes counted from 12:00 AM to 12:00 AM Ulaanbaatar time",
      },
    });
  } catch (error) {
    console.error("Error fetching date stats:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch date statistics",
      message: "Өдрийн статистик авахад алдаа гарлаа",
    });
  }
};
