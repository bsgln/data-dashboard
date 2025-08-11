import { SurveyQuestion } from "@shared/survey";
import { TrendingUp, Calendar, Users } from "lucide-react";

interface SeventhQuestionCardProps {
  question?: SurveyQuestion;
}

export function SeventhQuestionCard({ question }: SeventhQuestionCardProps) {
  if (!question) {
    return (
      <div
        className="bg-white p-4 sm:p-5 rounded-xl shadow-[0_4px_16px_rgba(0,102,255,0.08)]
                      transition-all duration-300 hover:shadow-[0_8px_24px_rgba(0,102,255,0.12)]
                      min-h-[320px] sm:min-h-[380px] flex items-center justify-center"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse mx-auto mb-3"></div>
          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  // Get top 3 responses for highlight display
  const topResponses = [...question.responses]
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 3);

  return (
    <div
      className="relative bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/50 
                    p-4 sm:p-5 lg:p-6 rounded-2xl shadow-[0_8px_32px_rgba(0,102,255,0.12)]
                    transition-all duration-500 hover:shadow-[0_16px_48px_rgba(0,102,255,0.18)]
                    hover:scale-[1.02] hover:-translate-y-1
                    border border-blue-100/50 backdrop-blur-sm
                    animate-in slide-in-from-bottom-4 fade-in min-h-[380px] sm:min-h-[420px] flex flex-col
                    group overflow-hidden"
      style={{ animationDelay: "600ms", animationFillMode: "backwards" }}
    >
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/20 to-indigo-300/20 rounded-full blur-2xl transform translate-x-8 -translate-y-8 transition-transform duration-700 group-hover:scale-110"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-200/20 to-pink-300/20 rounded-full blur-xl transform -translate-x-4 translate-y-4 transition-transform duration-700 group-hover:scale-110"></div>
      
      {/* Header with icon */}
      <div className="relative z-10 mb-4 sm:mb-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-lg">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div className="text-xs sm:text-sm text-blue-600 font-medium tracking-wide uppercase">
              Асуулт 7
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500 bg-white/60 px-2 py-1 rounded-full">
            <Users className="w-3 h-3" />
            <span>{question.totalVotes.toLocaleString()}</span>
          </div>
        </div>
        
        <h3
          className="text-[16px] sm:text-[18px] lg:text-[19px] font-bold text-[#1E293B] 
                       tracking-[0.36px] transition-colors duration-200 leading-[1.3]
                       bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent"
        >
          {question.question}
        </h3>
      </div>

      {/* Top 3 Results - Popup Style Cards */}
      <div className="relative z-10 flex-1 space-y-3 sm:space-y-4">
        {topResponses.map((response, index) => (
          <div
            key={response.category}
            className={`relative p-3 sm:p-4 rounded-xl transition-all duration-500 hover:scale-[1.02]
                      border backdrop-blur-sm group/item
                      ${index === 0 
                        ? 'bg-gradient-to-r from-white/90 to-blue-50/80 border-blue-200/60 shadow-[0_4px_20px_rgba(0,102,255,0.15)]' 
                        : index === 1
                        ? 'bg-gradient-to-r from-white/80 to-indigo-50/70 border-indigo-200/50 shadow-[0_3px_16px_rgba(0,102,255,0.1)]'
                        : 'bg-gradient-to-r from-white/70 to-purple-50/60 border-purple-200/40 shadow-[0_2px_12px_rgba(0,102,255,0.08)]'
                      }`}
            style={{ animationDelay: `${700 + index * 100}ms` }}
          >
            {/* Rank indicator */}
            <div className={`absolute -top-2 -left-2 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg
                           ${index === 0 ? 'bg-gradient-to-br from-yellow-400 to-orange-500' :
                             index === 1 ? 'bg-gradient-to-br from-gray-400 to-gray-600' :
                             'bg-gradient-to-br from-amber-600 to-yellow-700'}`}>
              {index + 1}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex-1 mr-3">
                <div className="flex items-center gap-2 mb-2">
                  <div 
                    className="w-3 h-3 rounded-full shadow-sm"
                    style={{ backgroundColor: response.color }}
                  />
                  <span className="text-[13px] sm:text-[14px] font-semibold text-[#1E293B] leading-tight">
                    {response.category}
                  </span>
                </div>
                
                {/* Progress bar */}
                <div className="relative h-2 bg-gray-200/60 rounded-full overflow-hidden">
                  <div
                    className="absolute left-0 top-0 h-full rounded-full transition-all duration-1000 ease-out"
                    style={{
                      width: `${response.percentage}%`,
                      backgroundColor: response.color,
                      boxShadow: `0 0 10px ${response.color}40`,
                      animationDelay: `${800 + index * 100}ms`,
                    }}
                  />
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-[14px] sm:text-[16px] font-bold text-[#1E293B]">
                  {response.percentage}%
                </div>
                <div className="text-[10px] sm:text-[11px] text-[#64748B]">
                  {response.votes.toLocaleString()} санал
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Show more indicator */}
        {question.responses.length > 3 && (
          <div className="text-center pt-2">
            <div className="inline-flex items-center gap-2 text-xs text-blue-600 bg-blue-50/80 px-3 py-1 rounded-full border border-blue-200/50">
              <Calendar className="w-3 h-3" />
              <span>+{question.responses.length - 3} бусад сонголт</span>
            </div>
          </div>
        )}
      </div>

      {/* Footer stats */}
      <div className="relative z-10 mt-4 pt-3 border-t border-gray-200/50">
        <div className="flex justify-between items-center text-xs text-gray-500">
          <span>Нийт санал</span>
          <span className="font-semibold text-gray-700">
            {question.totalVotes.toLocaleString()} хүн
          </span>
        </div>
      </div>
    </div>
  );
}
