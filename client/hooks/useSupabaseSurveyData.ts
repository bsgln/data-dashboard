import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { SurveyDashboardData } from "@shared/survey";

interface UseSupabaseSurveyDataResult {
  data: SurveyDashboardData | undefined;
  displayData: SurveyDashboardData | undefined;
  isLoading: boolean;
  isRefetching: boolean;
  error: Error | null;
  showConnectionError: boolean;
  retryConnection: () => void;
  setShowConnectionError: (show: boolean) => void;
  submitVote: (questionId: number, responseId: number) => Promise<boolean>;
}

const SUPABASE_API_BASE = "/api/survey/database";
const VOTE_API_ENDPOINT = "/api/survey/vote";

export function useSupabaseSurveyData(): UseSupabaseSurveyDataResult {
  const [showConnectionError, setShowConnectionError] = useState(false);
  const lastValidDataRef = useRef<SurveyDashboardData | null>(null);
  const [isVoting, setIsVoting] = useState(false);

  const { data, isLoading, isRefetching, error, refetch } = useQuery({
    queryKey: ["supabase-survey-data"],
    queryFn: async (): Promise<SurveyDashboardData> => {
      const response = await fetch(SUPABASE_API_BASE);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.message || "Датабаазтай холбогдоход алдаа гарлаа");
      }

      return data;
    },
    refetchInterval: 5000, // Refetch every 5 seconds for real-time updates
    refetchIntervalInBackground: true,
    retry: (failureCount, error) => {
      // Retry up to 3 times, then show connection error
      if (failureCount >= 3) {
        setShowConnectionError(true);
        return false;
      }
      return true;
    },
    onSuccess: (newData) => {
      // Store valid data
      lastValidDataRef.current = newData;
      // Hide connection error on successful fetch
      setShowConnectionError(false);
    },
    onError: (error) => {
      console.error("Error fetching Supabase survey data:", error);
      setShowConnectionError(true);
    },
  });

  // Use last valid data when there's an error, otherwise use current data
  const displayData =
    error && lastValidDataRef.current ? lastValidDataRef.current : data;

  const retryConnection = () => {
    setShowConnectionError(false);
    refetch();
  };

  const submitVote = async (
    questionId: number,
    responseId: number,
  ): Promise<boolean> => {
    if (isVoting) return false;

    setIsVoting(true);

    try {
      const response = await fetch(VOTE_API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questionId,
          responseId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.error) {
        throw new Error(result.message || "Санал өгөхөд алдаа гарлаа");
      }

      // Refetch data after successful vote
      await refetch();

      return true;
    } catch (error) {
      console.error("Error submitting vote:", error);
      return false;
    } finally {
      setIsVoting(false);
    }
  };

  return {
    data,
    displayData,
    isLoading,
    isRefetching,
    error,
    showConnectionError,
    retryConnection,
    setShowConnectionError,
    submitVote,
  };
}

// Hook for switching between regular API and Supabase
export function useSurveyDataSource(useDatabase: boolean = false) {
  const regularData = useQuery({
    queryKey: ["survey-data-regular"],
    queryFn: async (): Promise<SurveyDashboardData> => {
      const response = await fetch("/api/survey");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    },
    enabled: !useDatabase,
    refetchInterval: 3000,
  });

  const supabaseData = useSupabaseSurveyData();

  return useDatabase
    ? supabaseData
    : {
        ...regularData,
        displayData: regularData.data,
        showConnectionError: false,
        retryConnection: () => regularData.refetch(),
        setShowConnectionError: () => {},
        submitVote: async () => false,
      };
}
