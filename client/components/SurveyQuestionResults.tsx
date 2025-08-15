import { SurveyQuestion } from "@shared/survey";
import { useMemo } from "react";

interface SurveyQuestionResultsProps {
  question: SurveyQuestion;
  onVote?: (responseId: number) => Promise<boolean>;
}

export function SurveyQuestionResults({
  question,
  onVote,
}: SurveyQuestionResultsProps) {

  // Generate unique animation IDs to avoid conflicts
  const animationId = useMemo(
    () => Math.random().toString(36).substr(2, 9),
    [],
  );

  return (
    <>

      <div
        className="bg-white p-3 sm:p-4 lg:p-5 rounded-xl shadow-[0_2px_8px_rgba(0,102,255,0.06)]
                      transition-all duration-300 hover:shadow-[0_4px_16px_rgba(0,102,255,0.1)] hover:scale-[1.005]
                      animate-in slide-in-from-bottom-4 fade-in min-h-[280px] sm:min-h-[320px] lg:min-h-[360px] flex flex-col
                      border border-[#F1F5F9] hover:border-[#E1EFFE]"
        style={{
          animationDelay: `${400 + question.id * 100}ms`,
          animationFillMode: "backwards",
        }}
      >
        {/* Header */}
        <div className="mb-5">
          <div
            className="flex items-center gap-3 mb-4 animate-in slide-in-from-left-2 fade-in"
            style={{
              animationDelay: `${500 + question.id * 100}ms`,
              animationFillMode: "backwards",
            }}
          >
            <div
              className="px-3 py-1.5 border border-[#D1D9E6] rounded-full bg-[#F8FAFC]
                         transition-all duration-200 hover:border-[#0066FF] hover:bg-[#F0F7FF]"
            >
              <span className="text-[12px] sm:text-[13px] font-semibold text-[#0066FF] tracking-[0.15px]">
                Асуулт {question.id}
              </span>
            </div>
            <span className="text-[11px] sm:text-[12px] text-[#64748B] tracking-[0.15px] font-medium">
              {question.totalVotes.toLocaleString()} санал
            </span>
          </div>

          <h3
            className="text-[13px] sm:text-[14px] lg:text-[15px] font-semibold text-[#1E293B] tracking-[0.15px]
                     leading-[1.5] transition-colors duration-200 pr-2 break-words overflow-wrap-anywhere"
          >
            {question.question}
          </h3>
        </div>

        {/* Results */}
        <div className="space-y-3 mb-4 flex-1">
          {question.responses.map((response, index) => (
            <div
              key={index}
              className="group animate-in slide-in-from-left-2 fade-in"
              style={{
                animationDelay: `${600 + question.id * 100 + index * 30}ms`,
                animationFillMode: "backwards",
              }}
            >
              <div className="flex justify-between items-center gap-3 mb-2 transition-all duration-200">
                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0 transition-all duration-200 group-hover:scale-110"
                    style={{ backgroundColor: response.color }}
                  />
                  <span
                    className="text-[12px] sm:text-[13px] font-medium text-[#1E293B] tracking-[0.1px]
                               leading-[1.4] break-words transition-all duration-200 group-hover:text-[#0066FF]"
                  >
                    {response.category}
                  </span>
                </div>
                <div className="flex items-center gap-2.5 flex-shrink-0">
                  <span
                    className="text-[12px] sm:text-[13px] font-semibold text-[#1E293B] tracking-[0.1px]
                               transition-all duration-200 group-hover:text-[#0066FF] leading-[1.3]"
                  >
                    {response.votes.toLocaleString()}
                  </span>
                  <div
                    className="bg-[#F1F5F9] px-2 py-1 rounded-md min-w-[40px] text-center
                               transition-all duration-200 group-hover:bg-[#E1EFFE] border border-[#E2E8F0]"
                  >
                    <span
                      className="text-[11px] sm:text-[12px] font-semibold text-[#475569] tracking-[0.1px]
                                 transition-colors duration-200 group-hover:text-[#0066FF] leading-[1.2]"
                    >
                      {response.percentage}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="relative h-2 bg-[#E8EDF5] rounded-full overflow-hidden transition-all duration-200 group-hover:h-2.5">
                <div
                  className="absolute left-0 top-0 h-full rounded-full transition-all duration-500 ease-out"
                  style={{
                    backgroundColor: response.color,
                    width: `${response.percentage}%`,
                    opacity: 0.9,
                    animationDelay: `${700 + question.id * 100 + index * 30}ms`,
                    animation: `slideInBar-${animationId}-${index} 0.6s ease-out both`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* CSS Animation Styles */}
      <style>{`
        ${question.responses
          .map(
            (response, index) => `
        @keyframes slideInBar-${animationId}-${index} {
          from {
            width: 0%;
            opacity: 0.3;
          }
          to {
            width: ${response.percentage}%;
            opacity: 0.9;
          }
        }
        `,
          )
          .join("")}
      `}</style>
    </>
  );
}
