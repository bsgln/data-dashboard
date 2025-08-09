export interface SurveyMetrics {
  totalVotes: number;
  votesChange: number;
  dailyVotesAdded: number;
  averageVotesPerMinute: number;
  completionPercentage: number;
  topBudgetPriority: {
    category: string;
    percentage: number;
  };
  lastUpdated: string;
  isLive: boolean;
}

export interface GenderDistribution {
  male: {
    count: number;
    percentage: number;
  };
  female: {
    count: number;
    percentage: number;
  };
}

export interface AgeGroup {
  range: string;
  count: number;
  percentage: number;
}

export interface BudgetPriorityIndex {
  category: string;
  index: number;
  status: "increase" | "decrease" | "neutral";
}

export interface SurveyResponse {
  category: string;
  votes: number;
  percentage: number;
  color: string;
}

export interface SurveyQuestion {
  id: number;
  question: string;
  totalVotes: number;
  responses: SurveyResponse[];
}

export interface SurveyDashboardData {
  metrics: SurveyMetrics;
  genderDistribution: GenderDistribution;
  ageGroups: AgeGroup[];
  budgetPriorities: BudgetPriorityIndex[];
  questions: SurveyQuestion[];
}

export interface DashboardConfig {
  refreshInterval: number; // in milliseconds
  dataUrl: string;
  enableAutoRefresh: boolean;
}
