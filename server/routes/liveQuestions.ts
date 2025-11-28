import { RequestHandler } from "express";
import { SurveyQuestion, SurveyResponse } from "@shared/survey";

const LIVE_API_URL =
  "https://e-mongolia.mn/shared-service/api/survey/stats/v22/688b1679eeaf8f6a1fab1011";

let cachedQuestions: SurveyQuestion[] | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 2 * 60 * 1000; // 2 minutes

async function fetchLiveQuestions(): Promise<SurveyQuestion[]> {
  try {
    console.log("📊 Fetching live question data from:", LIVE_API_URL);

    const response = await fetch(LIVE_API_URL);
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const apiData = await response.json();

    console.log("📋 API Response structure:", Object.keys(apiData.data || {}));

    if (!apiData.result || !apiData.data) {
      throw new Error("Invalid API response format - missing result or data");
    }

    const questionsData = apiData.data["Дэлгэрэнгүй үзүүлэлт"];
    if (!questionsData) {
      console.log("❌ Missing 'Дэлгэрэнгүй үзүүлэлт' in response");
      throw new Error("Invalid API response format - missing detailed data");
    }
    const questions: SurveyQuestion[] = [];

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
    ];

    let questionId = 1;

    // Parse each question from the API
    for (const [questionText, responses] of Object.entries(questionsData)) {
      if (!Array.isArray(responses)) continue;

      console.log(`📋 Processing question: ${questionText}`);

      // Calculate total votes for this question
      const totalVotes = responses.reduce(
        (sum: number, item: any) => sum + (item.count || 0),
        0,
      );

      // Create response objects
      const questionResponses: SurveyResponse[] = responses.map(
        (item: any, index: number) => {
          const votes = item.count || 0;
          const percentage =
            totalVotes > 0
              ? Math.round((votes / totalVotes) * 100 * 10) / 10
              : 0;

          return {
            category: item._id || `Option ${index + 1}`,
            votes,
            percentage,
            color: colors[index % colors.length],
          };
        },
      );

      // Sort responses by vote count (descending)
      questionResponses.sort((a, b) => b.votes - a.votes);

      // Map question titles and handle special cases
      let mappedQuestionText = questionText;
      let mappedQuestionId = questionId;

      // Handle specific question mapping (5а -> 5, 5б -> 6)
      if (questionText.includes("5а") || questionText.includes("5А")) {
        mappedQuestionId = 5;
        mappedQuestionText = questionText.replace(/5[аА]/g, "5");
      } else if (questionText.includes("5б") || questionText.includes("5Б")) {
        mappedQuestionId = 6;
        mappedQuestionText = questionText.replace(/5[бБ]/g, "6");
      }

      // Create simplified question title
      const simpleTitle = mappedQuestionText
        .replace(/^\d+\s*-?\s*/, "") // Remove question number prefix
        .replace(/\?\s*$/, "") // Remove trailing question mark
        .trim();

      questions.push({
        id: mappedQuestionId,
        question: simpleTitle,
        totalVotes,
        responses: questionResponses,
      });

      questionId++;
    }

    // Sort questions by ID
    questions.sort((a, b) => a.id - b.id);

    console.log(`✅ Processed ${questions.length} questions from live API`);
    return questions;
  } catch (error) {
    console.error("❌ Error fetching live questions:", error);
    throw error;
  }
}

export const handleLiveQuestions: RequestHandler = async (_req, res) => {
  try {
    const now = Date.now();

    // Use cached data if available and fresh
    if (cachedQuestions && now - lastFetchTime < CACHE_DURATION) {
      console.log("📊 Using cached live questions");
      return res.json({ questions: cachedQuestions });
    }

    // Fetch fresh data from live API
    console.log("📊 Fetching fresh live questions");
    const questions = await fetchLiveQuestions();

    // Cache the data
    cachedQuestions = questions;
    lastFetchTime = now;

    res.json({ questions });
  } catch (error) {
    console.error("❌ Error in live questions endpoint:", error);
    res.status(500).json({
      error: "Live questions unavailable",
      message: "Live question data could not be loaded",
      details:
        error instanceof Error ? error.message : "Unknown error occurred",
      timestamp: new Date().toISOString(),
    });
  }
};

// Export the fetch function for use in other routes
export { fetchLiveQuestions };
