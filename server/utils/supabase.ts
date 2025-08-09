import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || "placeholder-key";

// Only create client if we have valid environment variables
let supabase: any = null;

if (
  supabaseUrl !== "https://placeholder.supabase.co" &&
  supabaseAnonKey !== "placeholder-key"
) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export { supabase };

// Database types
export interface SurveyQuestion {
  id: number;
  question: string;
  question_mn?: string;
  total_votes: number;
  created_at: string;
  updated_at: string;
}

export interface SurveyResponse {
  id: number;
  question_id: number;
  category: string;
  category_mn?: string;
  vote_count: number;
  percentage: number;
  created_at: string;
  updated_at: string;
}

export interface SurveyVote {
  id: number;
  question_id: number;
  response_id: number;
  user_ip?: string;
  user_agent?: string;
  created_at: string;
}

export interface DailyVoteStats {
  id: number;
  date: string;
  total_votes_start: number;
  total_votes_end: number;
  votes_added: number;
  created_at: string;
  updated_at: string;
}

export interface SurveyMetrics {
  id: number;
  total_votes: number;
  daily_votes_added: number;
  average_votes_per_minute: number;
  completion_percentage: number;
  top_budget_priority_category?: string;
  top_budget_priority_percentage: number;
  last_updated: string;
}

// Helper functions
export async function getSurveyQuestions() {
  if (!supabase) {
    throw new Error(
      "Supabase client not initialized. Please set SUPABASE_URL and SUPABASE_ANON_KEY environment variables.",
    );
  }

  const { data, error } = await supabase
    .from("survey_questions")
    .select("*")
    .order("id");

  if (error) throw error;
  return data as SurveyQuestion[];
}

export async function getSurveyResponses(questionId?: number) {
  if (!supabase) {
    throw new Error(
      "Supabase client not initialized. Please set SUPABASE_URL and SUPABASE_ANON_KEY environment variables.",
    );
  }

  let query = supabase.from("survey_responses").select("*");

  if (questionId) {
    query = query.eq("question_id", questionId);
  }

  query = query.order("vote_count", { ascending: false });

  const { data, error } = await query;
  if (error) throw error;
  return data as SurveyResponse[];
}

export async function getSurveyMetrics() {
  if (!supabase) {
    throw new Error(
      "Supabase client not initialized. Please set SUPABASE_URL and SUPABASE_ANON_KEY environment variables.",
    );
  }

  const { data, error } = await supabase
    .from("survey_metrics")
    .select("*")
    .order("last_updated", { ascending: false })
    .limit(1)
    .single();

  if (error) throw error;
  return data as SurveyMetrics;
}

export async function updateVoteCount(
  responseId: number,
  increment: number = 1,
) {
  if (!supabase) {
    throw new Error(
      "Supabase client not initialized. Please set SUPABASE_URL and SUPABASE_ANON_KEY environment variables.",
    );
  }

  const { data, error } = await supabase.rpc("increment_vote_count", {
    response_id: responseId,
    increment_by: increment,
  });

  if (error) throw error;
  return data;
}

export async function addVote(
  questionId: number,
  responseId: number,
  userIp?: string,
  userAgent?: string,
) {
  if (!supabase) {
    throw new Error(
      "Supabase client not initialized. Please set SUPABASE_URL and SUPABASE_ANON_KEY environment variables.",
    );
  }

  const { data, error } = await supabase.from("survey_votes").insert({
    question_id: questionId,
    response_id: responseId,
    user_ip: userIp,
    user_agent: userAgent,
  });

  if (error) throw error;
  return data;
}

export async function getDailyVoteStats(date?: string) {
  if (!supabase) {
    throw new Error(
      "Supabase client not initialized. Please set SUPABASE_URL and SUPABASE_ANON_KEY environment variables.",
    );
  }

  let query = supabase.from("daily_vote_stats").select("*");

  if (date) {
    query = query.eq("date", date);
  } else {
    query = query.eq("date", new Date().toISOString().split("T")[0]);
  }

  const { data, error } = await query.single();
  if (error && error.code !== "PGRST116") throw error; // PGRST116 = no rows returned
  return data as DailyVoteStats | null;
}

export async function updateDailyVoteStats(date: string, totalVotes: number) {
  if (!supabase) {
    throw new Error(
      "Supabase client not initialized. Please set SUPABASE_URL and SUPABASE_ANON_KEY environment variables.",
    );
  }

  const { data, error } = await supabase.from("daily_vote_stats").upsert(
    {
      date,
      total_votes_end: totalVotes,
      votes_added: totalVotes,
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: "date",
    },
  );

  if (error) throw error;
  return data;
}
