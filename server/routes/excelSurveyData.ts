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

    // Excel Questions Data
    const questions: SurveyQuestion[] = [
      {
        id: 1,
        question:
          "2026 онд аль салбарт төсвийг түлхүү чиглүүлэх нь зүйтэй гэж та үзэж байна вэ?",
        totalVotes: 490296,
        responses: [
          {
            category: "Эрүүл мэнд",
            votes: 129625,
            percentage: 26.44,
            color: colors[0],
          },
          {
            category: "Боловсрол",
            votes: 105295,
            percentage: 21.48,
            color: colors[1],
          },
          {
            category: "Цахилгаан, дулаан",
            votes: 88010,
            percentage: 17.95,
            color: colors[2],
          },
          { category: "Зам", votes: 35165, percentage: 7.17, color: colors[3] },
          {
            category: "Хууль зүй, хүний эрхийн салбар",
            votes: 29082,
            percentage: 5.93,
            color: colors[4],
          },
          {
            category: "Гэр бүл, хүүхэд",
            votes: 24151,
            percentage: 4.93,
            color: colors[5],
          },
          {
            category: "Байгаль орчин, уур амьсгалын өөрчлөлт",
            votes: 21543,
            percentage: 4.39,
            color: colors[6],
          },
          { category: "Ус", votes: 17606, percentage: 3.59, color: colors[7] },
          {
            category: "Хөдөө аж ахуй, мал аж ахуй",
            votes: 15445,
            percentage: 3.15,
            color: colors[8],
          },
          {
            category: "Нийгмийн халамж",
            votes: 15047,
            percentage: 3.07,
            color: colors[9],
          },
          {
            category: "Соёл, спорт, аялал жуулчлал",
            votes: 9327,
            percentage: 1.9,
            color: colors[0],
          },
        ],
      },
      {
        id: 2,
        question:
          "2026 онд аль салбарын төсөвт хэмнэлт хийх шаардлагатай гэж та үзэж байна вэ?",
        totalVotes: 469837,
        responses: [
          {
            category: "Нийгмийн халамж",
            votes: 80121,
            percentage: 17.05,
            color: colors[0],
          },
          {
            category: "Соёл, спорт, аялал жуулчлал",
            votes: 76565,
            percentage: 16.3,
            color: colors[1],
          },
          {
            category: "Зам, барилга",
            votes: 65437,
            percentage: 13.93,
            color: colors[2],
          },
          {
            category: "Хууль зүй",
            votes: 59657,
            percentage: 12.7,
            color: colors[3],
          },
          {
            category: "Цахилгаан, дулаан",
            votes: 39275,
            percentage: 8.36,
            color: colors[4],
          },
          {
            category: "Хөдөө аж ахуй, мал аж ахуй",
            votes: 36668,
            percentage: 7.8,
            color: colors[5],
          },
          {
            category: "Эрүүл мэнд",
            votes: 36272,
            percentage: 7.72,
            color: colors[6],
          },
          {
            category: "Байгаль орчин, уур амьсгалын өөрчлөлт",
            votes: 30000,
            percentage: 6.39,
            color: colors[7],
          },
          {
            category: "Боловсрол",
            votes: 29234,
            percentage: 6.22,
            color: colors[8],
          },
          { category: "Ус", votes: 16608, percentage: 3.53, color: colors[9] },
        ],
      },
      {
        id: 3,
        question:
          "Төсвийн үр ашгийг сайжруулах хүрээнд ямар бодлого хэрэгжүүлэх шаардлагатай гэж та үзэж байна вэ?",
        totalVotes: 460144,
        responses: [
          {
            category:
              "Төрийн захиргааны үйл ажиллагааны зардал бууруулах (томилолт, унаа, оффисын зардал гэх мэт)",
            votes: 127390,
            percentage: 27.68,
            color: colors[0],
          },
          {
            category: "Төрийн өмчит компаниудын зардлыг бууруулах, тоог цөөлөх",
            votes: 107016,
            percentage: 23.26,
            color: colors[1],
          },
          {
            category: "Халамжийн зардлыг танах (ямар төрлийн халамж)",
            votes: 77013,
            percentage: 16.74,
            color: colors[2],
          },
          {
            category:
              "Төрийн албан хаагчдын орон тоог хязгаарлах (нэмэлт тайлбар)",
            votes: 69826,
            percentage: 15.17,
            color: colors[3],
          },
          {
            category:
              "Төрийн чиг үүргийг хувийн хэвшилд шилжүүлэх (ямар чиг үүрэг)",
            votes: 51452,
            percentage: 11.18,
            color: colors[4],
          },
          {
            category: "Хөрөнгө оруулалтыг бууруулах (салбар)",
            votes: 27447,
            percentage: 5.96,
            color: colors[5],
          },
        ],
      },
      {
        id: 4,
        question:
          "Ямар төрлийн хөрөнгө оруулалтыг 2026 онд шинээр эх��үүлэхгүй, тэвчиж болно гэж та үзэж байна вэ?",
        totalVotes: 396606,
        responses: [
          {
            category: "Соёлын төв",
            votes: 140983,
            percentage: 35.55,
            color: colors[0],
          },
          {
            category: "Дотуур байр",
            votes: 76928,
            percentage: 19.4,
            color: colors[1],
          },
          {
            category: "Инженерийн дэд бүтэц",
            votes: 47661,
            percentage: 12.02,
            color: colors[2],
          },
          {
            category: "Сургууль",
            votes: 33372,
            percentage: 8.41,
            color: colors[3],
          },
          {
            category: "Эмнэлэг",
            votes: 26577,
            percentage: 6.7,
            color: colors[4],
          },
          {
            category: "Цэцэрлэг",
            votes: 26375,
            percentage: 6.65,
            color: colors[5],
          },
          {
            category: "Цахилгаан, эрчим хүч",
            votes: 24221,
            percentage: 6.11,
            color: colors[6],
          },
          {
            category: "Дулаан хангамж",
            votes: 20489,
            percentage: 5.17,
            color: colors[7],
          },
        ],
      },
      {
        id: 5,
        question: "Татварын бодлогын дэмжлэг үзүүлэх",
        totalVotes: 448229,
        responses: [
          {
            category: "Татварын хувь хэмжээг бууруулах",
            votes: 150610,
            percentage: 33.6,
            color: colors[0],
          },
          {
            category: "Татварын буцаан олголт ба хөнгөлөлт",
            votes: 85152,
            percentage: 19.0,
            color: colors[1],
          },
          {
            category: "Татварын хугацааг уян хатан болгох",
            votes: 71956,
            percentage: 16.05,
            color: colors[2],
          },
          {
            category: "Татварын орчныг сайжруулах",
            votes: 58091,
            percentage: 12.96,
            color: colors[3],
          },
          {
            category: "Татварын урамшуулал",
            votes: 50326,
            percentage: 11.23,
            color: colors[4],
          },
          {
            category: "Татварын чөлөөт бүс",
            votes: 32094,
            percentage: 7.16,
            color: colors[5],
          },
        ],
      },
      {
        id: 6,
        question: "Хувийн хэвшилд шилжүүлэх чиг үүрэг",
        totalVotes: 408180,
        responses: [
          {
            category:
              "Дэд бүтцийн үйлчилгээ (хог хаягдал, цэцэрлэгжүүлэлт, зам засвар гэх мэт)",
            votes: 105037,
            percentage: 25.73,
            color: colors[0],
          },
          {
            category: "Эрүүл мэндийн даатгалын үйлчилгээний шинэ хэлбэрүүд",
            votes: 87947,
            percentage: 21.55,
            color: colors[1],
          },
          {
            category:
              "Эрүүл мэндийн урьдчилан сэргийлэх үйлчилгээ, анхан шатны үзлэг",
            votes: 80663,
            percentage: 19.76,
            color: colors[2],
          },
          {
            category: "Халаалт, засвар үйлчилгээ",
            votes: 54266,
            percentage: 13.29,
            color: colors[3],
          },
          {
            category: "Харуул хамгаалалт",
            votes: 47094,
            percentage: 11.54,
            color: colors[4],
          },
          {
            category: "Тусгай хамгаалалттай газар нутгийн менежмент",
            votes: 32790,
            percentage: 8.03,
            color: colors[5],
          },
          { category: "Бусад", votes: 383, percentage: 0.09, color: colors[6] },
        ],
      },
    ];

    // Static demographics and metrics
    const actualTotalVotes = 188016; // Final total votes after voting ended

    // Calculate correct average votes per minute
    // Voting started 8.1 (Aug 1, 2025) and ended Aug 14, 2025
    const startDate = new Date("2025-08-01T00:00:00");
    const endDate = new Date("2025-08-14T23:59:59");
    const totalMinutes = Math.floor(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60),
    ); // 20,159 minutes
    const averageVotesPerMinute =
      Math.round((actualTotalVotes / totalMinutes) * 100) / 100; // 9.33 votes/minute

    console.log(
      `📊 Voting period: ${totalMinutes} minutes (${Math.floor(totalMinutes / (24 * 60))} days)`,
    );
    console.log(`📊 Average votes per minute: ${averageVotesPerMinute}`);

    // Calculate metrics
    const dailyVotesAdded =
      await supabaseDailyTracker.updateDailyVoteCount(actualTotalVotes);

    // Find top budget priority from first question
    const topBudgetPriority = questions[0].responses[0];

    // Calculate gender distribution based on 188,086 total votes
    // Using proportions: 44.46% male, 55.54% female
    const maleCount = Math.round(actualTotalVotes * 0.4446); // 83,645
    const femaleCount = Math.round(actualTotalVotes * 0.5554); // 104,441

    // Age groups based on 188,086 total votes
    const ageGroups = [
      {
        range: "18-34 нас",
        count: Math.round(actualTotalVotes * 0.4987), // 93,755
        percentage: 49.87,
      },
      {
        range: "35-54 нас",
        count: Math.round(actualTotalVotes * 0.4568), // 85,893
        percentage: 45.68,
      },
      {
        range: "55+ нас",
        count: Math.round(actualTotalVotes * 0.0445), // 8,370
        percentage: 4.45,
      },
    ];

    const mongoliaAdultPopulation = 2280887; // Mongolia's adult population (18+)

    return {
      metrics: {
        totalVotes: actualTotalVotes,
        votesChange: Math.floor(Math.random() * 100) + 50,
        dailyVotesAdded: dailyVotesAdded,
        averageVotesPerMinute: averageVotesPerMinute,
        completionPercentage:
          Math.round((actualTotalVotes / mongoliaAdultPopulation) * 100 * 10) /
          10,
        topBudgetPriority: {
          category: topBudgetPriority.category,
          percentage: topBudgetPriority.percentage,
        },
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
    if (cachedSurveyData && now - lastFetchTime < CACHE_DURATION) {
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
      details:
        error instanceof Error ? error.message : "Unknown error occurred",
      timestamp: new Date().toISOString(),
    });
  }
};
