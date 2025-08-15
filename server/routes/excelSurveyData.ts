import { RequestHandler } from "express";
import { SurveyDashboardData, SurveyQuestion } from "@shared/survey";
import { supabaseDailyTracker } from "../utils/supabaseDailyTracker";

let cachedSurveyData: SurveyDashboardData | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

async function createExcelSurveyData(): Promise<SurveyDashboardData> {
  try {
    console.log("📊 Creating survey data from Excel file");
    
    const colors = [
      "#0066FF", "#E11D48", "#22C55E", "#F97316", "#A855F7", 
      "#EC4899", "#4D7C0F", "#0D9488", "#0EA5E9", "#6366F1"
    ];

    // Excel Questions Data
    const questions: SurveyQuestion[] = [
      {
        id: 1,
        question: "Монгол улсын 2026 оны төсвийн ямар салбарт илүү их хөрөнгө оруулалт хийх ёстой вэ?",
        totalVotes: 38514,
        responses: [
          { category: "Цалин хөлс нэмэгдүүлэх", votes: 7318, percentage: 19.0, color: colors[0] },
          { category: "Эрүүл мэндийн салбар", votes: 6139, percentage: 15.9, color: colors[1] },
          { category: "Төсвийн үр ашиг", votes: 5777, percentage: 15.0, color: colors[2] },
          { category: "Боловсролын салбар", votes: 4622, percentage: 12.0, color: colors[3] },
          { category: "Хууль, цагдаагийн байгууллага", votes: 4235, percentage: 11.0, color: colors[4] },
          { category: "Нийгмийн хамгаалал", votes: 3081, percentage: 8.0, color: colors[5] },
          { category: "Дэд бүтэц, зам харилцаа холбоо", votes: 2696, percentage: 7.0, color: colors[6] },
          { category: "Хөдөө аж ахуй", votes: 2311, percentage: 6.0, color: colors[7] },
          { category: "Байгаль орчны хамгаалал", votes: 1926, percentage: 5.0, color: colors[8] },
          { category: "Хувийн хэвшлийн дэмжлэг", votes: 1540, percentage: 4.0, color: colors[9] }
        ]
      },
      {
        id: 2,
        question: "Монгол улсын 2026 оны төсвийн ямар салбарын зардлыг бууруулах ёстой вэ?",
        totalVotes: 38514,
        responses: [
          { category: "УИХ-ын аппарат", votes: 11554, percentage: 30.0, color: colors[0] },
          { category: "Засгийн газрын нарийн бичгийн дарга нарын аппарат", votes: 7703, percentage: 20.0, color: colors[1] },
          { category: "Ерөнхийлөгчийн тамгын газар", votes: 4622, percentage: 12.0, color: colors[2] },
          { category: "Гадаад харилцааны яам", votes: 3466, percentage: 9.0, color: colors[3] },
          { category: "Шүүхийн ерөнхий зөвлөл", votes: 3466, percentage: 9.0, color: colors[4] },
          { category: "Соёл урлагийн яам", votes: 2311, percentage: 6.0, color: colors[5] },
          { category: "Хөгжлийн банк", votes: 1926, percentage: 5.0, color: colors[6] },
          { category: "Орон нутгийн өөрөө удирдах байгууллага", votes: 1926, percentage: 5.0, color: colors[7] },
          { category: "Шинжлэх ухаан технологийн яам", votes: 1541, percentage: 4.0, color: colors[8] }
        ]
      },
      {
        id: 3,
        question: "Та сонгуульд санал өгдөг үү?",
        totalVotes: 38514,
        responses: [
          { category: "Тийм", votes: 36588, percentage: 95.0, color: colors[0] },
          { category: "Үгүй", votes: 1926, percentage: 5.0, color: colors[1] }
        ]
      },
      {
        id: 4,
        question: "Улс төрийн намуудын санхүүжилтийг төсвөөс олгох талаар таны бодол юу вэ?",
        totalVotes: 38514,
        responses: [
          { category: "Зөвшөөрөхгүй байна", votes: 26960, percentage: 70.0, color: colors[0] },
          { category: "Зөвшөөрч байна", votes: 11554, percentage: 30.0, color: colors[1] }
        ]
      },
      {
        id: 5,
        question: "Хэрэв намуудад төрийн санхүүжилт олгох юм бол жилд хэдэн төгрөг олгох ёстой вэ?",
        totalVotes: 38514,
        responses: [
          { category: "1 тэрбум төгрөг", votes: 15406, percentage: 40.0, color: colors[0] },
          { category: "5+ тэрбум төгрөг", votes: 9629, percentage: 25.0, color: colors[1] },
          { category: "2 тэрбум төгрөг", votes: 7703, percentage: 20.0, color: colors[2] },
          { category: "3 тэрбум төгрөг", votes: 3851, percentage: 10.0, color: colors[3] },
          { category: "4 тэрбум төгрөг", votes: 1926, percentage: 5.0, color: colors[4] }
        ]
      },
      {
        id: 6,
        question: "Монгол улсын төсвийн ил тод байдлыг хэрхэн сайжруулах вэ?",
        totalVotes: 38514,
        responses: [
          { category: "Төсвийн мэдээллийг иргэдэд ойлгомжтой хэлбэрээр хүргэх", votes: 19257, percentage: 50.0, color: colors[0] },
          { category: "Төсвийн биелэлтийн тайланг үе үе олон нийтэд танилцуулах", votes: 11554, percentage: 30.0, color: colors[1] },
          { category: "Иргэдийн төсвийн хяналтад оролцох боломжийг нэмэгдүүлэх", votes: 7703, percentage: 20.0, color: colors[2] }
        ]
      }
    ];

    // Static demographics and metrics
    const actualTotalVotes = 188016; // Static total votes (not from questions)
    
    // Calculate correct average votes per minute
    // Voting started 8.1 (Aug 1, 2025) and ended yesterday (Aug 14, 2025)
    const startDate = new Date('2025-08-01T00:00:00');
    const endDate = new Date('2025-08-14T23:59:59');
    const totalMinutes = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60));
    const averageVotesPerMinute = Math.round((actualTotalVotes / totalMinutes) * 100) / 100;
    
    console.log(`📊 Voting period: ${totalMinutes} minutes (${Math.floor(totalMinutes / (24 * 60))} days)`);
    console.log(`📊 Average votes per minute: ${averageVotesPerMinute}`);
    
    // Calculate metrics
    const dailyVotesAdded = await supabaseDailyTracker.updateDailyVoteCount(actualTotalVotes);
    
    // Find top budget priority from first question
    const topBudgetPriority = questions[0].responses[0];

    // Calculate gender distribution (using updated data)
    const maleCount = 82180;
    const femaleCount = 105836;

    // Age groups based on actual survey data
    const ageGroups = [
      {
        range: "18-34 нас",
        count: 93755,
        percentage: 49.87
      },
      {
        range: "35-54 нас", 
        count: 85893,
        percentage: 45.68
      },
      {
        range: "55+ нас",
        count: 8368,
        percentage: 4.45
      }
    ];

    const mongoliaAdultPopulation = 2280887;

    return {
      metrics: {
        totalVotes: actualTotalVotes,
        votesChange: Math.floor(Math.random() * 100) + 50,
        dailyVotesAdded: dailyVotesAdded,
        averageVotesPerMinute: averageVotesPerMinute,
        completionPercentage: Math.round((actualTotalVotes / mongoliaAdultPopulation) * 100 * 10) / 10,
        topBudgetPriority: {
          category: topBudgetPriority.category,
          percentage: topBudgetPriority.percentage
        },
        lastUpdated: "2025/08/14 23:59",
        isLive: false, // Static data
      },
      genderDistribution: {
        male: {
          count: maleCount,
          percentage: Math.round((maleCount / (maleCount + femaleCount)) * 100 * 10) / 10,
        },
        female: {
          count: femaleCount,
          percentage: Math.round((femaleCount / (maleCount + femaleCount)) * 100 * 10) / 10,
        },
      },
      ageGroups,
      budgetPriorities: [], // Empty as requested to be removed
      questions,
    };
    
  } catch (error) {
    console.error("❌ Error creating Excel survey data:", error);
    throw error;
  }
}

export const handleExcelSurveyData: RequestHandler = async (_req, res) => {
  try {
    const now = Date.now();
    
    // Use cached data if available and fresh
    if (cachedSurveyData && (now - lastFetchTime) < CACHE_DURATION) {
      console.log("📊 Using cached Excel survey data");
      return res.json(cachedSurveyData);
    }
    
    // Create fresh data
    console.log("📊 Creating fresh Excel survey data");
    const surveyData = await createExcelSurveyData();
    
    // Cache the data
    cachedSurveyData = surveyData;
    lastFetchTime = now;
    
    res.json(surveyData);
    
  } catch (error) {
    console.error("❌ Error in Excel survey data:", error);
    res.status(500).json({
      error: "Survey data unavailable",
      message: "Excel survey data could not be loaded",
      details: error instanceof Error ? error.message : "Unknown error occurred",
      timestamp: new Date().toISOString(),
    });
  }
};
