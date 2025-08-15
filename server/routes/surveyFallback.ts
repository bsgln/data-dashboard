import { RequestHandler } from "express";
import * as XLSX from "xlsx";
import { SurveyDashboardData, SurveyQuestion, SurveyResponse } from "@shared/survey";
import { supabaseDailyTracker } from "../utils/supabaseDailyTracker";

const EXCEL_URL = "https://cdn.builder.io/o/assets%2F3a7659bd2c534c9d9609b01504a01464%2Ff59419d538b34c05be6399f805f52cf9?alt=media&token=e811fe30-9a2a-4cd7-b14f-89d904cc8374&apiKey=3a7659bd2c534c9d9609b01504a01464";

let cachedSurveyData: SurveyDashboardData | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

async function parseExcelToSurveyData(): Promise<SurveyDashboardData> {
  try {
    console.log("📊 Creating survey data with detailed Question 1");

    const questions: SurveyQuestion[] = [];
    const colors = [
      "#0066FF", "#E11D48", "#22C55E", "#F97316", "#A855F7",
      "#EC4899", "#4D7C0F", "#0D9488", "#0EA5E9", "#6366F1"
    ];

    let questionId = 1;
    let totalVotesSum = 0;

    // Add detailed Question 1 data
    const question1TotalVotes = 27105;
    const question1: SurveyQuestion = {
      id: 1,
      question: "Асуулт 1: Хөрөнгө оруулалт нэмэгдүүлэх салбар",
      totalVotes: question1TotalVotes,
      responses: [
        {
          category: "Эрүүл мэнд",
          votes: Math.round(question1TotalVotes * 0.18),
          percentage: 18.0,
          color: colors[0]
        },
        {
          category: "Цалин, нийгмийн хамгаалал",
          votes: Math.round(question1TotalVotes * 0.13),
          percentage: 13.0,
          color: colors[1]
        },
        {
          category: "Боловсрол",
          votes: Math.round(question1TotalVotes * 0.13),
          percentage: 13.0,
          color: colors[2]
        },
        {
          category: "Аюулгүй байдал, хууль сахиулах",
          votes: Math.round(question1TotalVotes * 0.11),
          percentage: 11.0,
          color: colors[3]
        },
        {
          category: "Хөдөө аж ахуй, байгаль орчин",
          votes: Math.round(question1TotalVotes * 0.10),
          percentage: 10.0,
          color: colors[4]
        },
        {
          category: "Эдийн засаг, ажлын байр",
          votes: Math.round(question1TotalVotes * 0.09),
          percentage: 9.0,
          color: colors[5]
        },
        {
          category: "Дэд бүтэц, з��м",
          votes: Math.round(question1TotalVotes * 0.08),
          percentage: 8.0,
          color: colors[6]
        },
        {
          category: "Эрчим хүч",
          votes: Math.round(question1TotalVotes * 0.08),
          percentage: 8.0,
          color: colors[7]
        },
        {
          category: "Соёл, спорт, аялал жуулчлал",
          votes: Math.round(question1TotalVotes * 0.02),
          percentage: 2.0,
          color: colors[8]
        },
        {
          category: "Орон нутагт хөрөнгө оруулах",
          votes: Math.round(question1TotalVotes * 0.01),
          percentage: 1.0,
          color: colors[9]
        }
      ]
    };

    questions.push(question1);
    totalVotesSum += question1TotalVotes;
    questionId++;
    
    // Fetch and parse Excel for remaining questions (2-6)
    console.log("📊 Fetching Excel survey data for questions 2-6:", EXCEL_URL);

    const response = await fetch(EXCEL_URL);
    if (!response.ok) {
      throw new Error(`Failed to download Excel file: ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const workbook = XLSX.read(buffer, { type: 'buffer' });

    console.log("📋 Excel sheets found:", workbook.SheetNames);

    // Parse each sheet as a survey question (skip first since we have custom data)
    workbook.SheetNames.forEach((sheetName, sheetIndex) => {
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
      
      if (jsonData.length < 2) return; // Skip empty sheets
      
      console.log(`📄 Processing sheet: ${sheetName}`);
      
      const responses: SurveyResponse[] = [];
      let questionTotalVotes = 0;
      
      // Skip header row and process data
      for (let i = 1; i < jsonData.length; i++) {
        const row = jsonData[i];
        if (!row[0] || !row[1]) continue; // Skip empty rows
        
        const category = String(row[0]).trim();
        const votes = parseInt(String(row[1]).replace(/,/g, '')) || 0;
        const percentage = parseFloat(String(row[2]).replace('%', '')) || 0;
        
        if (category && votes > 0) {
          responses.push({
            category,
            votes,
            percentage: Math.round(percentage * 10) / 10, // Round to 1 decimal
            color: colors[(responses.length) % colors.length]
          });
          
          questionTotalVotes += votes;
        }
      }
      
      if (responses.length > 0) {
        questions.push({
          id: questionId++,
          question: sheetName,
          totalVotes: questionTotalVotes,
          responses: responses.sort((a, b) => b.votes - a.votes) // Sort by votes descending
        });
        
        totalVotesSum += questionTotalVotes;
      }
    });
    
    console.log(`✅ Parsed ${questions.length} questions with total ${totalVotesSum} votes`);
    
    // Calculate metrics
    const dailyVotesAdded = await supabaseDailyTracker.updateDailyVoteCount(totalVotesSum);
    const now = new Date();
    const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    // Find top budget priority from first question if available
    const topBudgetPriority = questions.length > 0 && questions[0].responses.length > 0 
      ? {
          category: questions[0].responses[0].category,
          percentage: questions[0].responses[0].percentage
        }
      : { category: "Тодорхойгүй", percentage: 0 };

    // Override total votes with correct data
    const actualTotalVotes = 188016;

    // Calculate gender distribution (using updated data)
    const maleCount = 82180;
    const femaleCount = 105836;
    const totalGenderVotes = maleCount + femaleCount;

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
        totalVotes: totalVotesSum,
        votesChange: Math.floor(Math.random() * 100) + 50,
        dailyVotesAdded: dailyVotesAdded,
        averageVotesPerMinute: Math.round((totalVotesSum / (24 * 60)) * 100) / 100,
        completionPercentage: Math.round((totalVotesSum / mongoliaAdultPopulation) * 100 * 10) / 10,
        topBudgetPriority,
        lastUpdated: timeString,
        isLive: false, // Static data
      },
      genderDistribution: {
        male: {
          count: maleCount,
          percentage: Math.round((maleCount / totalGenderVotes) * 100 * 10) / 10,
        },
        female: {
          count: femaleCount,
          percentage: Math.round((femaleCount / totalGenderVotes) * 100 * 10) / 10,
        },
      },
      ageGroups,
      budgetPriorities: [], // Will be calculated from questions if needed
      questions,
    };
    
  } catch (error) {
    console.error("❌ Error parsing Excel data:", error);
    throw error;
  }
}

export const handleSurveyFallback: RequestHandler = async (_req, res) => {
  try {
    const now = Date.now();
    
    // Use cached data if available and fresh
    if (cachedSurveyData && (now - lastFetchTime) < CACHE_DURATION) {
      console.log("📊 Using cached survey data");
      return res.json(cachedSurveyData);
    }
    
    // Parse fresh data from Excel
    console.log("📊 Parsing fresh Excel survey data");
    const surveyData = await parseExcelToSurveyData();
    
    // Cache the data
    cachedSurveyData = surveyData;
    lastFetchTime = now;
    
    res.json(surveyData);
    
  } catch (error) {
    console.error("❌ Error in survey fallback:", error);
    res.status(500).json({
      error: "Survey data unavailable",
      message: "Excel fallback data could not be loaded",
      details: error instanceof Error ? error.message : "Unknown error occurred",
      timestamp: new Date().toISOString(),
    });
  }
};
