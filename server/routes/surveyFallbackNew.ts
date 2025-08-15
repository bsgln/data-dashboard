import { RequestHandler } from "express";
import { SurveyDashboardData } from "@shared/survey";
import { supabaseDailyTracker } from "../utils/supabaseDailyTracker";
import { fetchLiveQuestions } from "./liveQuestions";

let cachedSurveyData: SurveyDashboardData | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

async function createSurveyData(): Promise<SurveyDashboardData> {
  try {
    console.log("📊 Creating survey data with live questions from API");

    // Fetch live questions from the new API
    let questions = [];

    try {
      questions = await fetchLiveQuestions();
      console.log(`✅ Got ${questions.length} live questions from API`);
    } catch (error) {
      console.error(
        "❌ Failed to fetch live questions, using empty array:",
        error,
      );
      // Empty array if live API fails - will maintain static demographics only
      questions = [];
    }

    // Static demographics and metrics (not from live API as per request)
    const actualTotalVotes = 188016; // Static total votes (not from questions)

    // Calculate metrics
    const dailyVotesAdded =
      await supabaseDailyTracker.updateDailyVoteCount(actualTotalVotes);

    // Find top budget priority from first question if available
    const topBudgetPriority =
      questions.length > 0 && questions[0].responses.length > 0
        ? {
            category: questions[0].responses[0].category,
            percentage: questions[0].responses[0].percentage,
          }
        : { category: "Тодорхойгүй", percentage: 0 };

    // Calculate gender distribution (using updated data)
    const maleCount = 82180;
    const femaleCount = 105836;

    // Age groups based on actual survey data - updated pyramid
    const ageGroups = [
      {
        range: "18-34 нас",
        count: 93755,
        percentage: 49.87,
      },
      {
        range: "35-54 нас",
        count: 85893,
        percentage: 45.68,
      },
      {
        range: "55+ нас",
        count: 8368,
        percentage: 4.45,
      },
    ];

    const mongoliaAdultPopulation = 2280887;

    return {
      metrics: {
        totalVotes: actualTotalVotes,
        votesChange: Math.floor(Math.random() * 100) + 50,
        dailyVotesAdded: dailyVotesAdded,
        averageVotesPerMinute:
          Math.round((actualTotalVotes / (24 * 60)) * 100) / 100,
        completionPercentage:
          Math.round((actualTotalVotes / mongoliaAdultPopulation) * 100 * 10) /
          10,
        topBudgetPriority,
        lastUpdated: "2025/08/14 23:59",
        isLive: false, // Static data
      },
      genderDistribution: {
        male: {
          count: maleCount,
          percentage:
            Math.round((maleCount / (maleCount + femaleCount)) * 100 * 10) / 10,
        },
        female: {
          count: femaleCount,
          percentage:
            Math.round((femaleCount / (maleCount + femaleCount)) * 100 * 10) /
            10,
        },
      },
      ageGroups,
      budgetPriorities: [], // Will be calculated from questions if needed
      questions,
    };
  } catch (error) {
    console.error("❌ Error creating survey data:", error);
    throw error;
  }
}

export const handleSurveyFallbackNew: RequestHandler = async (_req, res) => {
  try {
    const now = Date.now();

    // Use cached data if available and fresh
    if (cachedSurveyData && now - lastFetchTime < CACHE_DURATION) {
      console.log("📊 Using cached survey data");
      return res.json(cachedSurveyData);
    }

    // Create fresh data
    console.log("📊 Creating fresh survey data");
    const surveyData = await createSurveyData();

    // Cache the data
    cachedSurveyData = surveyData;
    lastFetchTime = now;

    res.json(surveyData);
  } catch (error) {
    console.error("❌ Error in survey fallback:", error);
    res.status(500).json({
      error: "Survey data unavailable",
      message: "Survey data could not be loaded",
      details:
        error instanceof Error ? error.message : "Unknown error occurred",
      timestamp: new Date().toISOString(),
    });
  }
};
