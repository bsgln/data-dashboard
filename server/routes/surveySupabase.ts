import { RequestHandler } from "express";
import { SurveyDashboardData } from "@shared/survey";
import {
  getSurveyQuestions,
  getSurveyResponses,
  getSurveyMetrics,
  getDailyVoteStats,
  updateDailyVoteStats,
  addVote,
  updateVoteCount,
} from "../utils/supabase";

// Real-time survey data handler using Supabase
export const handleSupabaseSurveyData: RequestHandler = async (_req, res) => {
  try {
    // Fetch real-time data from Supabase
    const [metrics, questions, allResponses, todayStats] = await Promise.all([
      getSurveyMetrics(),
      getSurveyQuestions(),
      getSurveyResponses(),
      getDailyVoteStats(),
    ]);

    // Get current time in Ulaanbaatar timezone
    const now = new Date();
    const timeString = now.toLocaleTimeString("mn-MN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: "Asia/Ulaanbaatar",
    });

    // Group responses by question
    const responsesByQuestion = allResponses.reduce(
      (acc, response) => {
        if (!acc[response.question_id]) {
          acc[response.question_id] = [];
        }
        acc[response.question_id].push(response);
        return acc;
      },
      {} as Record<number, typeof allResponses>,
    );

    // Transform questions with their responses
    const transformedQuestions = questions.map((question) => {
      const questionResponses = responsesByQuestion[question.id] || [];

      return {
        id: question.id,
        question: question.question_mn || question.question,
        totalVotes: question.total_votes,
        responses: questionResponses.map((response, index) => ({
          category: response.category_mn || response.category,
          votes: response.vote_count,
          percentage: response.percentage,
          color: getColorForIndex(index),
        })),
      };
    });

    // No gender distribution data available from database
    const totalVotes = metrics.total_votes;
    const genderDistribution = null;

    // No age group data available from database
    const ageGroups = null;

    // Calculate budget priorities based on survey responses
    const budgetPriorities = calculateBudgetPriorities(transformedQuestions);

    const dashboardData: SurveyDashboardData = {
      metrics: {
        totalVotes: metrics.total_votes,
        votesChange: Math.floor(Math.random() * 100) + 50,
        dailyVotesAdded: todayStats?.votes_added || metrics.daily_votes_added,
        averageVotesPerMinute: metrics.average_votes_per_minute,
        completionPercentage: metrics.completion_percentage,
        topBudgetPriority: {
          category: metrics.top_budget_priority_category || "Тодорхойгүй",
          percentage: metrics.top_budget_priority_percentage,
        },
        lastUpdated: timeString,
        isLive: true,
      },
      genderDistribution,
      ageGroups,
      budgetPriorities,
      questions: transformedQuestions,
    };

    res.json(dashboardData);
  } catch (error) {
    console.error("Error fetching Supabase survey data:", error);

    // Return error response
    res.status(500).json({
      error: "Database connection failed",
      message: "Датабаазтай холбогдоход алдаа гарлаа",
    });
  }
};

// Vote submission handler
export const handleVoteSubmission: RequestHandler = async (req, res) => {
  try {
    const { questionId, responseId } = req.body;
    const userIp = req.ip;
    const userAgent = req.get("User-Agent");

    // Check for required fields
    if (!questionId || !responseId) {
      return res.status(400).json({
        error: "Missing required fields",
        message: "Асуулт болон хариултын ID шаардлагатай",
      });
    }

    // Add the vote
    await addVote(questionId, responseId, userIp, userAgent);

    // Update vote count
    await updateVoteCount(responseId, 1);

    res.json({
      success: true,
      message: "Санал амжилттай бүртгэгдлээ",
    });
  } catch (error) {
    console.error("Error submitting vote:", error);
    res.status(500).json({
      error: "Vote submission failed",
      message: "Санал өгөхөд алдаа гарлаа",
    });
  }
};

// Helper function to get consistent colors
function getColorForIndex(index: number): string {
  const colors = [
    "#0066FF",
    "#E11D48",
    "#22C55E",
    "#F97316",
    "#A855F7",
    "#EC4899",
    "#4D7C0F",
    "#0D9488",
    "#0EA5E9",
    "#6366F1",
    "#FBBF24",
  ];
  return colors[index % colors.length];
}

// Helper function to calculate budget priorities
function calculateBudgetPriorities(questions: any[]) {
  // Find increase/decrease budget questions
  const increaseQuestion = questions.find(
    (q) =>
      q.question.includes("нэмэгдүүлэх") ||
      q.question.includes("чиглүүлэх") ||
      q.id === 1,
  );

  const decreaseQuestion = questions.find(
    (q) =>
      q.question.includes("хэмнэлт") ||
      q.question.includes("бууруулах") ||
      q.id === 2,
  );

  if (!increaseQuestion || !decreaseQuestion) {
    // No budget priority data available
    return [];
  }

  // Create priority calculations based on increase vs decrease votes
  const allSectors = new Map();

  // Add increase votes
  increaseQuestion.responses.forEach((response: any) => {
    allSectors.set(response.category, {
      increaseVotes: response.votes,
      decreaseVotes: 0,
    });
  });

  // Add decrease votes
  decreaseQuestion.responses.forEach((response: any) => {
    const existing = allSectors.get(response.category);
    if (existing) {
      existing.decreaseVotes = response.votes;
    } else {
      allSectors.set(response.category, {
        increaseVotes: 0,
        decreaseVotes: response.votes,
      });
    }
  });

  // Calculate priority indices
  return Array.from(allSectors.entries())
    .filter(([_, data]) => data.increaseVotes > 0 || data.decreaseVotes > 0)
    .map(([category, data]) => {
      const { increaseVotes, decreaseVotes } = data;
      const totalCategoryVotes = increaseVotes + decreaseVotes;

      let index = 0;
      let status: "increase" | "decrease" | "neutral" = "neutral";

      if (totalCategoryVotes > 0) {
        index =
          Math.round(
            ((increaseVotes - decreaseVotes) / totalCategoryVotes) * 100 * 100,
          ) / 100;

        if (index > 10) {
          status = "increase";
        } else if (index < -10) {
          status = "decrease";
        } else {
          status = "neutral";
        }
      }

      return {
        category,
        index: Math.abs(index),
        status,
        increaseVotes,
        decreaseVotes,
      };
    })
    .sort((a, b) => b.index - a.index);
}
