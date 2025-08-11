import { useSurveyData } from "@/hooks/useSurveyData";
import { DashboardHeader } from "@/components/DashboardHeader";
import { MetricsCards } from "@/components/MetricsCards";
import { GenderChart } from "@/components/GenderChart";
import { AgeGroupChart } from "@/components/AgeGroupChart";
import { AgeParticipationChart } from "@/components/AgeParticipationChart";
import { BudgetPriorityTable } from "@/components/BudgetPriorityTable";
import { SurveyQuestionResults } from "@/components/SurveyQuestionResults";
import { ConnectionErrorDialog } from "@/components/ConnectionErrorDialog";
import { Button } from "@/components/ui/button";
import { RefreshCw, Settings, AlertCircle, Wifi, WifiOff } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SurveyDashboardData } from "@shared/survey";
import {
  MetricsCardsSkeleton,
  GenderChartSkeleton,
  AgeGroupChartSkeleton,
  BudgetPriorityTableSkeleton,
  SurveyQuestionSkeleton,
} from "@/components/SkeletonLoaders";

export default function Index() {
  const {
    data,
    isLoading,
    isError,
    error,
    isConnected,
    isRefetching,
    showConnectionError,
    refetch,
    closeConnectionError,
  } = useSurveyData();

  return (
    <div
      className="min-h-screen bg-[#F8FAFC] animate-in fade-in"
      style={{ animationDuration: "800ms" }}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Connection Status & Controls */}
        <div
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0
                    mb-3 sm:mb-4 animate-in slide-in-from-top-2 fade-in"
          style={{ animationDelay: "100ms", animationFillMode: "backwards" }}
        >
          <div className="flex items-center gap-3">
            {isConnected ? (
              <div
                className={`flex items-center gap-2 text-[#22C55E] transition-all duration-300 ${isLoading || isRefetching ? "animate-pulse" : ""}`}
              >
                <Wifi className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {isLoading || isRefetching ? "Холбогдож байна" : "Холбогдсон"}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-[#EF4444] animate-bounce">
                <WifiOff className="w-4 h-4" />
                <span className="text-sm font-medium">Холболт тасарсан</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end sm:justify-start">
            <Button
              variant="outline"
              size="sm"
              onClick={refetch}
              disabled={isLoading || isRefetching}
              className="flex items-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-md
                         text-sm sm:text-base px-3 sm:px-4 py-2"
            >
              <RefreshCw
                className={`w-4 h-4 transition-transform duration-500 ${isLoading || isRefetching ? "animate-spin" : "hover:rotate-180"}`}
              />
              Шинэчлэх
            </Button>
          </div>
        </div>

        {/* Connection Error Dialog */}
        <ConnectionErrorDialog
          isOpen={showConnectionError}
          onClose={closeConnectionError}
          onRetry={refetch}
          isRetrying={isRefetching}
        />

        {/* Dashboard Content */}
        {!isLoading || data ? (
          <>
            <DashboardHeader
              lastUpdated={data?.metrics.lastUpdated || ""}
              isLive={(data?.metrics.isLive && isConnected) || false}
            />

            <MetricsCards metrics={data?.metrics} />

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
              <GenderChart data={data?.genderDistribution} />
              <AgeGroupChart data={data?.ageGroups} />
              <AgeParticipationChart totalVotes={data?.metrics.totalVotes || 0} />
              <BudgetPriorityTable data={data?.budgetPriorities} />
            </div>

            <div className="mb-4 sm:mb-6">
              <h2
                className="text-[16px] sm:text-[18px] font-semibold text-[#1E293B] mb-3 sm:mb-4
                             tracking-[0.3px] animate-in slide-in-from-left-2 fade-in transition-colors duration-200"
                style={{
                  animationDelay: "500ms",
                  animationFillMode: "backwards",
                }}
              >
                Асуултуудын үр дүн
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                {data?.questions.map((question) => (
                  <SurveyQuestionResults
                    key={question.id}
                    question={question}
                  />
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Skeleton Loaders */}
            <div className="mb-8">
              <div className="h-16 bg-white rounded-xl shadow-[0_4px_16px_rgba(0,102,255,0.08)] p-6 flex justify-between items-center">
                <div>
                  <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>

            <MetricsCardsSkeleton />

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <GenderChartSkeleton />
              <AgeGroupChartSkeleton />
              <AgeGroupChartSkeleton /> {/* Age participation chart skeleton */}
              <BudgetPriorityTableSkeleton />
            </div>

            <div className="mb-6 sm:mb-8">
              <div className="h-5 sm:h-6 w-40 sm:w-48 bg-gray-200 rounded animate-pulse mb-4 sm:mb-6"></div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <SurveyQuestionSkeleton />
                <SurveyQuestionSkeleton />
              </div>
            </div>
          </>
        )}

        {/* Loading overlay for refreshes */}
        {isRefetching && (
          <div
            className="fixed top-4 right-4 bg-white shadow-lg rounded-lg p-3 flex items-center gap-2 
                          animate-in slide-in-from-right-4 fade-in z-50"
          >
            <RefreshCw className="w-4 h-4 animate-spin text-[#0066FF]" />
            <span className="text-sm text-[#64748B]">Шинэчилж байна...</span>
          </div>
        )}
      </div>
    </div>
  );
}
