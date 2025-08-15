import { useState, useEffect, useCallback, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { SurveyDashboardData, DashboardConfig } from "@shared/survey";

const defaultConfig: DashboardConfig = {
  refreshInterval: 60000, // 1 minute
  dataUrl: "/api/survey",
  enableAutoRefresh: true,
};

export function useSurveyData(config: Partial<DashboardConfig> = {}) {
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(true);
  const [showConnectionError, setShowConnectionError] = useState(false);
  const lastValidDataRef = useRef<SurveyDashboardData | null>(null);

  const finalConfig = { ...defaultConfig, ...config };

  const fetchSurveyData =
    useCallback(async (): Promise<SurveyDashboardData> => {
      try {
        setError(null);
        setIsConnected(true);
        setShowConnectionError(false);

        // Add timeout to fetch request
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

        const response = await fetch(finalConfig.dataUrl, {
          signal: controller.signal,
          headers: {
            "Content-Type": "application/json",
          },
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(
            `Failed to fetch data: ${response.status} ${response.statusText}`,
          );
        }

        const data = await response.json();
        // Store the last valid data
        lastValidDataRef.current = data;
        return data;
      } catch (err) {
        console.error("Error fetching survey data:", err);

        let errorMessage = "Unknown error occurred";
        if (err instanceof Error) {
          if (err.name === "AbortError") {
            errorMessage = "Request timeout - please check your connection";
          } else if (err.message.includes("Failed to fetch")) {
            errorMessage =
              "Network error - please check your internet connection";
          } else {
            errorMessage = err.message;
          }
        }

        setError(errorMessage);
        setIsConnected(false);

        // Show connection error dialog only after initial load
        if (lastValidDataRef.current) {
          setShowConnectionError(true);
        }

        throw err;
      }
    }, [finalConfig.dataUrl]);

  const { data, isLoading, isError, refetch, isRefetching } = useQuery({
    queryKey: ["surveyData"],
    queryFn: fetchSurveyData,
    refetchInterval: finalConfig.enableAutoRefresh
      ? finalConfig.refreshInterval
      : false,
    refetchIntervalInBackground: true,
    retry: (failureCount, error) => {
      // Retry up to 5 times with exponential backoff for network errors
      if (failureCount < 5) {
        console.log(
          `Retrying survey data fetch (attempt ${failureCount + 1}/5)`,
          error?.message || error,
        );
        return true;
      }
      setError("Холболт тасарсан байна. Дахин оролдоно уу.");
      return false;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    staleTime: 30000, // Consider data stale after 30 seconds
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
  });

  const updateConfig = useCallback(
    (newConfig: Partial<DashboardConfig>) => {
      Object.assign(finalConfig, newConfig);
    },
    [finalConfig],
  );

  const forceRefresh = useCallback(() => {
    setError(null);
    setShowConnectionError(false);
    refetch();
  }, [refetch]);

  const closeConnectionError = useCallback(() => {
    setShowConnectionError(false);
  }, []);

  // Use last valid data if connection is lost and we have previous data
  const displayData = data || lastValidDataRef.current;

  // Return enriched data with connection status
  return {
    data: displayData,
    isLoading,
    isError: isError || !!error,
    error: error || (isError ? "Failed to fetch survey data" : null),
    isConnected,
    isRefetching,
    showConnectionError,
    refetch: forceRefresh,
    closeConnectionError,
    updateConfig,
    config: finalConfig,
  };
}
