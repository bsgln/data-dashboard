import { useState } from "react";
import { useSurveyData } from "@/hooks/useSurveyData";
import { DashboardHeader } from "@/components/DashboardHeader";
import { MetricsCards } from "@/components/MetricsCards";
import { GenderChart } from "@/components/GenderChart";
import { AgeParticipationChart } from "@/components/AgeParticipationChart";
import { SurveyQuestionResults } from "@/components/SurveyQuestionResults";
import { SeventhQuestionCard } from "@/components/SeventhQuestionCard";
import { QuestionDetailPopup } from "@/components/QuestionDetailPopup";
import { ConnectionErrorDialog } from "@/components/ConnectionErrorDialog";
import { Button } from "@/components/ui/button";
import { RefreshCw, Settings, AlertCircle, Wifi, WifiOff } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SurveyDashboardData, SurveyQuestion } from "@shared/survey";
import {
  MetricsCardsSkeleton,
  GenderChartSkeleton,
  AgeGroupChartSkeleton,
  SurveyQuestionSkeleton,
  SeventhQuestionCardSkeleton,
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

  const [selectedQuestion, setSelectedQuestion] = useState<SurveyQuestion | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleQuestionClick = (question: SurveyQuestion) => {
    setSelectedQuestion(question);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedQuestion(null);
  };


  return (
    <div
      className="min-h-screen bg-[#F8FAFC] animate-in fade-in"
      style={{ animationDuration: "800ms" }}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">

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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-8">
              <GenderChart data={data?.genderDistribution} />
              <AgeParticipationChart
                totalVotes={data?.metrics.totalVotes || 0}
              />
            </div>

            <div className="mb-8">
              <h2
                className="text-[18px] sm:text-[20px] lg:text-[22px] font-semibold text-[#1E293B] mb-6
                             tracking-[0.3px] animate-in slide-in-from-left-2 fade-in transition-colors duration-200"
                style={{
                  animationDelay: "500ms",
                  animationFillMode: "backwards",
                }}
              >
                Асуултуудын үр дүн
              </h2>

              {/* Regular Survey Questions (excluding question 7) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-8">
                {data?.questions
                  .filter((q) => q.id !== 7)
                  .map((question) => (
                    <div key={question.id}>
                      <SurveyQuestionResults
                        question={question}
                      />
                    </div>
                  ))}
              </div>

              {/* Citizen Suggestions Card - At Bottom */}
              <div className="mb-8">
                <SeventhQuestionCard
                  question={data?.questions.find((q) => q.id === 7)}
                />
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-8">
              <GenderChartSkeleton />
              <GenderChartSkeleton /> {/* Age participation chart skeleton */}
            </div>

            <div className="mb-8">
              <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-6"></div>

              {/* Regular Question Skeletons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-8">
                <SurveyQuestionSkeleton />
                <SurveyQuestionSkeleton />
                <SurveyQuestionSkeleton />
                <SurveyQuestionSkeleton />
                <SurveyQuestionSkeleton />
                <SurveyQuestionSkeleton />
              </div>

              {/* Citizen Suggestions Card Skeleton - At Bottom */}
              <div className="mb-8">
                <SeventhQuestionCardSkeleton />
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
